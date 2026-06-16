/**
 * Image Optimization Pipeline
 *
 * Finds all PNG/JPG/JPEG images in src/content/ and public/,
 * converts them to WebP alongside originals, and resizes
 * images wider than 1200px down to 1200px.
 */

import { readdirSync, statSync, existsSync, mkdirSync } from "fs"
import { join, relative, parse, dirname } from "path"
import sharp from "sharp"

const DIRS = [
  "src/content",
  "public",
]

const EXTENSIONS = new Set([".png", ".jpg", ".jpeg"])
const MAX_WIDTH = 1200

let totalOriginalSize = 0
let totalWebpSize = 0
let convertedCount = 0
let skippedCount = 0

function getAllImages(dir) {
  const results = []
  try {
    const entries = readdirSync(dir, { withFileTypes: true })
    for (const entry of entries) {
      const fullPath = join(dir, entry.name)
      if (entry.isDirectory() && entry.name !== "node_modules" && entry.name !== ".git") {
        results.push(...getAllImages(fullPath))
      } else if (entry.isFile()) {
        const ext = parse(entry.name).ext.toLowerCase()
        if (EXTENSIONS.has(ext)) {
          results.push(fullPath)
        }
      }
    }
  } catch {
    // Skip directories that don't exist
  }
  return results
}

async function optimizeImage(filePath) {
  const parsed = parse(filePath)
  const webpPath = join(parsed.dir, `${parsed.name}.webp`)

  // Skip if WebP already exists and is newer
  if (existsSync(webpPath)) {
    const imgStat = statSync(filePath)
    const webpStat = statSync(webpPath)
    if (webpStat.mtimeMs >= imgStat.mtimeMs) {
      skippedCount++
      return
    }
  }

  const image = sharp(filePath)
  const metadata = await image.metadata()
  let pipeline = image

  // Resize if wider than MAX_WIDTH
  if (metadata.width && metadata.width > MAX_WIDTH) {
    pipeline = pipeline.resize({ width: MAX_WIDTH, withoutEnlargement: true })
  }

  const originalSize = statSync(filePath).size
  const webpBuffer = await pipeline.webp({ quality: 80 }).toBuffer()

  await sharp(webpBuffer).toFile(webpPath)

  totalOriginalSize += originalSize
  totalWebpSize += webpBuffer.length
  convertedCount++

  const savings = ((1 - webpBuffer.length / originalSize) * 100).toFixed(1)
  console.log(`  ✓ ${relative(process.cwd(), filePath)} → .webp (${savings}% saved)`)
}

async function main() {
  console.log("🔍 Scanning for images...\n")

  const allImages = []
  for (const dir of DIRS) {
    allImages.push(...getAllImages(dir))
  }

  if (allImages.length === 0) {
    console.log("No images found to optimize.")
    return
  }

  console.log(`Found ${allImages.length} image(s) to process.\n`)

  for (const img of allImages) {
    await optimizeImage(img)
  }

  console.log("\n📊 Optimization Report:")
  console.log(`  Processed: ${convertedCount} image(s)`)
  console.log(`  Skipped (already optimized): ${skippedCount} file(s)`)
  if (convertedCount > 0) {
    const savingsPercent = ((1 - totalWebpSize / totalOriginalSize) * 100).toFixed(1)
    const originalMb = (totalOriginalSize / 1024 / 1024).toFixed(2)
    const webpMb = (totalWebpSize / 1024 / 1024).toFixed(2)
    console.log(`  Original size:  ${originalMb} MB`)
    console.log(`  WebP size:      ${webpMb} MB`)
    console.log(`  Total savings:  ${savingsPercent}%`)
  }
}

main().catch((err) => {
  console.error("Image optimization failed:", err)
  process.exit(1)
})
