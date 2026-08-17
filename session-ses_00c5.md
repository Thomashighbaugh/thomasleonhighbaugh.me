
---

### 1. dev.to
*   **Where:** Log into [dev.to](https://dev.to).
*   **Steps:** Go to **Settings** (click your profile picture) > **Extensions** > scroll down to **API Keys**.
*   **Key:** Create a new key with a descriptive name like "GitHub Crossposting".
*   **Secret to add:** `DEVTO_API_KEY`

### 2. Hashnode
*   **Where:** [Hashnode Dashboard](https://hashnode.com/dashboard) > **Settings** > **Developer**.
*   **Key:** Generate a **Personal Access Token**.
*   **Publication ID:** On the same Developer page, look for the "Publication ID" associated with your blog.
*   **Secrets to add:** `HASHNODE_TOKEN`, `HASHNODE_PUBLICATION_ID`

### 3. Mastodon
*   **Where:** Your instance’s web interface (e.g., `mastodon.social`).
*   **Steps:** **Settings** > **Development** > **New Application**.
*   **Scopes:** Select `write` (specifically `write:statuses`).
*   **Secrets to add:** `MASTODON_INSTANCE` (e.g., `https://mastodon.social`), `MASTODON_TOKEN` (the "Your access token" field).

### 4. Bluesky
*   **Where:** [Bluesky App](https://bsky.app) (Settings).
*   **Steps:** **Settings** > **Advanced** > **App Passwords** > **Add App Password**.
*   **Note:** Use your handle (e.g., `yourname.bsky.social`) as the identifier.
*   **Secrets to add:** `BLUESKY_IDENTIFIER`, `BLUESKY_APP_PASSWORD`

### 5. Telegram
*   **Where:** Within Telegram.
*   **Bot Token:** Message [@BotFather](https://t.me/botfather), send `/newbot`, and follow the steps. Save the token provided.
*   **Channel ID:** Add the bot to your channel as an admin. Then, forward a message from that channel to [@userinfobot](https://t.me/userinfobot) to get the numeric `id` (e.g., `-100123456789`).
*   **Secrets to add:** `TELEGRAM_BOT_TOKEN`, `TELEGRAM_CHANNEL_ID`

### 6. LinkedIn (The tricky one)
*   **Where:** [LinkedIn Developer Portal](https://developer.linkedin.com/).
*   **Steps:** Create an app. You must associate it with a LinkedIn Page or your profile.
*   **Author URN:** This is complex. You typically need to use the LinkedIn API to fetch your URN (`urn:li:person:<id>`) once authenticated.
*   **Secrets to add:** `LINKEDIN_ACCESS_TOKEN`, `LINKEDIN_AUTHOR_URN`
*   *Tip:* If you get stuck here, LinkedIn’s API is notoriously slow to set up. Focus on the others first, then tackle this when you have time for their review process.

### 7. Twitter (X)
*   **Where:** [X Developer Portal](https://developer.twitter.com/).
*   **Steps:**
    1.  Create a Project and an App.
    2.  In your App settings, configure **Authentication settings**. Enable **OAuth 2.0**.
    3.  Set "App permissions" to **Read and write**.
    4.  Set the **Callback URI** to `http://localhost:8732/callback`.
*   **Credentials:** You need the `Client ID`.
*   **Local Setup:** Run the auth script I included in the code once:
    ```bash
    export TWITTER_CLIENT_ID=your_client_id
    npm run crosspost -- auth twitter
    ```
*   **Secrets to add:** Use the `CLIENT_ID` and `REFRESH_TOKEN` output by that script. `TWITTER_CLIENT_SECRET` is only needed if you configured your app as "Confidential" in the portal.

---

### Pro-Tip: Testing
Before you add all of these at once, start by adding just one (e.g., **dev.to**) and running the **Crosspost (manual)** workflow from the GitHub Actions tab. Verify it posts correctly, then add the rest one by one.

---

## User

i said after commit and pushing the repo\

---

## Assistant (Hubs · Gemini 3.1 Flash Lite · 6.1s)

_Thinking:_

**Clarifying User Intent**

I'm now zeroing in on the user's need for instructions *post*-commit and push, specifically relating to my crossposting automation. This clarification clarifies my next steps to determine precisely what's needed after that point in their workflow.


**Defining Post-Push Actions**

I'm now focusing on the crucial *post-push* actions. My plan details these explicit steps: Commit and push, navigate to GitHub settings, setup secrets for credentials, configure the `SITE_URL` variable, and then, importantly, how to trigger the manual workflow for initial testing. I'm aiming for clarity regarding the correct sequence.




Understood. My apologies for jumping the gun.

Once you have performed the `git add .`, `git commit -m "..."`, and `git push` to send the new files to your GitHub repository, **this is the exact order to follow for setup:**

### 1. Wait for the Push to Sync
Once you push, GitHub will detect the new workflow files in `.github/workflows/`. They will now appear in your repository's **Actions** tab.

### 2. Configure GitHub Settings
Navigate to your repository on GitHub and go to **Settings** (top navigation bar):

1.  **Add Secrets:**
    *   In the left sidebar, click **Secrets and variables** > **Actions**.
    *   Click the **Secrets** tab.
    *   Click **New repository secret**.
    *   Add each credential you gathered (e.g., `DEVTO_API_KEY`, `HASHNODE_TOKEN`, etc.) one by one. *These are encrypted and invisible once added.*

2.  **Add Variables:**
    *   Still in **Secrets and variables** > **Actions**, click the **Variables** tab.
    *   Click **New repository variable**.
    *   Add `SITE_URL` with the value `https://thomasleonhighbaugh.me`.

### 3. Run Your First Manual Test
Now that the code is on the server and the credentials/variables are set:

1.  Click the **Actions** tab in your repository.
2.  In the left sidebar under "All workflows," click **Crosspost (manual)**.
3.  On the right, you will see a banner: "This workflow has a workflow_dispatch trigger." Click the **Run workflow** dropdown.
4.  **Important for the first test:**
    *   Set `dry_run` to `true`.
    *   Set `count` to `1`.
    *   Click the green **Run workflow** button.
5.  Watch the logs. If it says `[dry-run]` and lists the API calls it *would* have made, your secrets are configured correctly, and the code is working.

After that passes, switch `dry_run` to `false` and run it again to actually publish.

---

