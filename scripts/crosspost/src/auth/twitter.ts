/**
 * One-time OAuth 2.0 PKCE setup for X (Twitter).
 *
 * Run locally once: `tsx bin/crosspost.ts auth twitter`
 *
 * You'll need:
 *   - An X Developer Portal app with OAuth 2.0 enabled
 *   - A redirect URI of `http://localhost:8732/callback` configured
 *   - The app's client id passed via TWITTER_CLIENT_ID env var
 *
 * The script:
 *   1. Generates a PKCE code_verifier + code_challenge
 *   2. Prints the authorization URL and (if a browser-launcher is
 *      available) opens it
 *   3. Spins up a local HTTP server on :8732 to receive the redirect
 *   4. Exchanges the authorization code for a refresh token
 *   5. Prints the credentials to paste into GitHub Secrets
 */

import { createHash, randomBytes } from 'node:crypto'
import { createServer } from 'node:http'
import { httpRequest } from '../platforms/types.js'

const AUTH_URL = 'https://x.com/i/oauth2/authorize'
const TOKEN_URL = 'https://api.x.com/2/oauth2/token'
const REDIRECT_URI = 'http://localhost:8732/callback'
const PORT = 8732
const SCOPES = ['tweet.read', 'tweet.write', 'users.read', 'offline.access']

export interface TwitterOAuthResult {
  clientId: string
  clientSecret?: string
  refreshToken: string
}

export async function performTwitterOAuth(): Promise<TwitterOAuthResult> {
  const clientId = process.env.TWITTER_CLIENT_ID
  if (!clientId) {
    throw new Error('Set TWITTER_CLIENT_ID in your env before running this command.')
  }
  const clientSecret = process.env.TWITTER_CLIENT_SECRET

  const verifier = base64url(randomBytes(32))
  const challenge = base64url(createHash('sha256').update(verifier).digest())

  const authUrl = buildAuthUrl(clientId, challenge)
  console.log('\nOpen this URL in your browser to authorize the app:\n')
  console.log(`  ${authUrl}\n`)

  // Best-effort browser launch; ignore if no opener is available.
  try {
    const { default: open } = await import('node:child_process').then((cp) => ({
      default: (url: string) => cp.exec(`xdg-open "${url}" || open "${url}" || true`),
    }))
    void open(authUrl)
  } catch {
    // ignore
  }

  const code = await waitForCallback()
  console.log('\nReceived authorization code. Exchanging for tokens...')

  const token = await exchangeCode(clientId, clientSecret, code, verifier)
  if (!token.refresh_token) {
    throw new Error('Token response did not include a refresh_token. Make sure offline.access scope is enabled.')
  }

  return { clientId, clientSecret, refreshToken: token.refresh_token }
}

function buildAuthUrl(clientId: string, challenge: string): string {
  const params = new URLSearchParams({
    response_type: 'code',
    client_id: clientId,
    redirect_uri: REDIRECT_URI,
    scope: SCOPES.join(' '),
    state: randomBytes(8).toString('hex'),
    code_challenge: challenge,
    code_challenge_method: 'S256',
  })
  return `${AUTH_URL}?${params}`
}

function waitForCallback(): Promise<string> {
  return new Promise((resolve, reject) => {
    const server = createServer((req, res) => {
      try {
        const url = new URL(req.url ?? '/', `http://localhost:${PORT}`)
        if (url.pathname !== '/callback') {
          res.writeHead(404)
          res.end('Not found')
          return
        }
        const code = url.searchParams.get('code')
        const error = url.searchParams.get('error')
        res.writeHead(200, { 'Content-Type': 'text/html' })
        if (error) {
          res.end(`<h1>Authorization failed</h1><p>${error}</p><p>You can close this tab.</p>`)
          reject(new Error(`Authorization error: ${error}`))
        } else if (code) {
          res.end('<h1>Authorization complete</h1><p>You can close this tab and return to the terminal.</p>')
          resolve(code)
        } else {
          res.end('<h1>Malformed callback</h1>')
          reject(new Error('No code or error in callback URL'))
        }
      } finally {
        server.close()
      }
    })
    server.listen(PORT, () => {
      console.log(`Waiting for browser redirect on ${REDIRECT_URI} ...`)
    })
    server.on('error', reject)
  })
}

async function exchangeCode(
  clientId: string,
  clientSecret: string | undefined,
  code: string,
  verifier: string,
): Promise<{ access_token: string; refresh_token?: string }> {
  const body = new URLSearchParams({
    grant_type: 'authorization_code',
    code,
    client_id: clientId,
    redirect_uri: REDIRECT_URI,
    code_verifier: verifier,
  })
  const headers: Record<string, string> = {
    'Content-Type': 'application/x-www-form-urlencoded',
  }
  if (clientSecret) {
    headers['Authorization'] = `Basic ${Buffer.from(`${clientId}:${clientSecret}`).toString('base64')}`
  }

  const res = await httpRequest(TOKEN_URL, {
    method: 'POST',
    headers,
    body: body.toString(),
  })

  if (res.status !== 200) {
    throw new Error(`Token exchange failed: ${res.status} ${res.body}`)
  }
  return res.json() as { access_token: string; refresh_token?: string }
}

function base64url(buf: Buffer): string {
  return buf.toString('base64').replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '')
}
