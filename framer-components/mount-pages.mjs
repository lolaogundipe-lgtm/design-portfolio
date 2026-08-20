#!/usr/bin/env node
import { execFileSync } from "child_process"

function mcp(...args) {
  const out = execFileSync("npx", ["--yes", "unframer", "mcp", ...args], {
    encoding: "utf8",
    maxBuffer: 50 * 1024 * 1024,
    timeout: 120000,
  })
  return out
}

function getDesktopId(pageId) {
  const xml = mcp("getNodeXml", "--nodeId", pageId)
  const m = xml.match(/<(Desktop|Root|Breakpoint)[^>]*nodeId="([^"]+)"/)
  if (!m) {
    // Try first top-level nodeId
    const m2 = xml.match(/nodeId="([^"]+)"/)
    if (!m2) throw new Error(`No desktop found for page ${pageId}\n${xml.slice(0, 500)}`)
    return m2[1]
  }
  return m[2]
}

function getChildIds(desktopId) {
  const xml = mcp("getNodeXml", "--nodeId", desktopId)
  // Collect direct children: lines with nodeId that are not the root itself
  // Simpler: match all nodeId after the opening root tag
  const ids = []
  const re = /nodeId="([^"]+)"/g
  let match
  let first = true
  while ((match = re.exec(xml))) {
    if (first) {
      first = false
      continue // skip desktop itself
    }
    ids.push(match[1])
  }
  // Only delete top-level children — getNodeXml returns nested too.
  // Parse more carefully: find tags at indent level of first child
  const lines = xml.split("\n")
  const top = []
  let rootIndent = null
  for (const line of lines) {
    const idMatch = line.match(/^\s*<(\w+)[^>]*nodeId="([^"]+)"/)
    if (!idMatch) continue
    const indent = line.match(/^\s*/)[0].length
    if (idMatch[2] === desktopId) {
      rootIndent = indent
      continue
    }
    if (rootIndent !== null && indent === rootIndent + 2) {
      top.push(idMatch[2])
    }
  }
  // Fallback: if indent heuristic fails, delete unique first-level from ComponentInstance/Stack/etc
  if (top.length === 0) {
    // Use first 30 unique ids after root as candidates (aggressive clear)
    return [...new Set(ids)].slice(0, 40)
  }
  return top
}

const pages = [
  {
    path: "/",
    pageId: "xj0CHLYbx",
    insertUrl: "https://framer.com/m/RedesignHome-gPwZA5.js",
  },
  {
    path: "/relate-onboarding",
    pageId: "kcA00X5YU",
    insertUrl: "https://framer.com/m/RedesignRelateOnboarding-GJlEGh.js",
  },
  {
    path: "/relate-visual",
    pageId: "s0uxFa6p7",
    insertUrl: "https://framer.com/m/RedesignRelateVisual-Ofh5gl.js",
  },
  {
    path: "/live-transcribe",
    pageId: "augiA20Il",
    insertUrl: "https://framer.com/m/RedesignLiveTranscribe-oorccT.js",
  },
  {
    path: "/market-fresh",
    pageId: "s1qJjiUxh",
    insertUrl: "https://framer.com/m/RedesignMarketFresh-fHrtmy.js",
  },
]

for (const page of pages) {
  console.log(`\n======== Mounting ${page.path} ========`)
  const desktopId = getDesktopId(page.pageId)
  console.log(`Desktop: ${desktopId}`)

  let children = getChildIds(desktopId)
  console.log(`Top-level children (${children.length}):`, children.join(", "))

  for (const id of children) {
    try {
      const r = mcp("deleteNode", "--nodeId", id)
      console.log(`Deleted ${id}:`, r.split("\n")[0])
    } catch (e) {
      console.log(`Skip delete ${id}:`, (e.stdout || e.message || "").slice(0, 120))
    }
  }

  // Re-fetch and clear leftovers once
  children = getChildIds(desktopId)
  if (children.length) {
    console.log(`Leftover children: ${children.length}, deleting...`)
    for (const id of children) {
      try {
        mcp("deleteNode", "--nodeId", id)
      } catch (_) {}
    }
  }

  const xml = `
<Desktop nodeId="${desktopId}" backgroundColor="/Brand/Bg" width="1200px" height="fit-content" overflow="hidden" layout="stack" stackDirection="vertical" stackAlignment="center" stackDistribution="start">
  <Redesign insertUrl="${page.insertUrl}" width="100%" height="fit-content" position="relative" />
</Desktop>`.trim()

  const result = mcp("updateXmlForNode", "--nodeId", desktopId, "--xml", xml)
  console.log(result.slice(0, 1200))
}

console.log("\nAll pages mounted.")
console.log(mcp("getProjectWebsiteUrl"))
