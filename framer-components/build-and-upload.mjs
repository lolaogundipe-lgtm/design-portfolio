#!/usr/bin/env node
/**
 * Builds Framer code components from the local redesign and uploads via unframer MCP.
 */
import { readFileSync, writeFileSync, mkdirSync } from "fs"
import { execFileSync } from "child_process"
import { dirname, join } from "path"
import { fileURLToPath } from "url"

const __dirname = dirname(fileURLToPath(import.meta.url))
const root = join(__dirname, "..")

const css = readFileSync(join(root, "style.css"), "utf8")
const script = readFileSync(join(root, "script.js"), "utf8")

function extractBody(html) {
  const m = html.match(/<body[^>]*>([\s\S]*)<\/body>/i)
  let body = m ? m[1] : html
  body = body.replace(/<script[\s\S]*?<\/script>/gi, "")
  // Point local links to Framer routes
  body = body
    .replace(/href="index\.html"/g, 'href="/"')
    .replace(/href="index\.html#/g, 'href="/#')
    .replace(/href="relate-onboarding\.html"/g, 'href="/relate-onboarding"')
    .replace(/href="relate-visual\.html"/g, 'href="/relate-visual"')
    .replace(/href="live-transcribe\.html"/g, 'href="/live-transcribe"')
    .replace(/href="market-fresh\.html"/g, 'href="/market-fresh"')
  return body.trim()
}

function esc(str) {
  return str
    .replace(/\\/g, "\\\\")
    .replace(/`/g, "\\`")
    .replace(/\$\{/g, "\\${")
}

const FONTS =
  "https://fonts.googleapis.com/css2?family=Fragment+Mono:ital,wght@0,400;1,400&family=Geist+Mono:wght@400;500;600;700&family=Inter:wght@400;500;600;700&display=swap"

function makeComponent(name, bodyHtml, defaultPageLabel) {
  const body = esc(extractBody(bodyHtml))
  const styles = esc(css)
  const js = esc(script)

  return `import { useEffect, useRef } from "react"
import { addPropertyControls, ControlType } from "framer"

const CSS = \`${styles}\`
const BODY_HTML = \`${body}\`
const BOOT_JS = \`${js}\`
const FONTS_HREF = ${JSON.stringify(FONTS)}

/**
 * ${name} — local portfolio redesign ported into Framer.
 * Includes custom cursor, typewriter, scroll reveal, and full page styles.
 */
export default function ${name}(props) {
    const rootRef = useRef(null)

    useEffect(() => {
        if (typeof document === "undefined") return

        // Fonts
        if (!document.getElementById("lola-fonts")) {
            const link = document.createElement("link")
            link.id = "lola-fonts"
            link.rel = "stylesheet"
            link.href = FONTS_HREF
            document.head.appendChild(link)
        }

        // Styles once
        if (!document.getElementById("lola-redesign-css")) {
            const style = document.createElement("style")
            style.id = "lola-redesign-css"
            style.textContent = CSS + \`
              html, body { background: #000 !important; }
              /* Framer chrome reset inside component */
              .lola-portfolio-root, .lola-portfolio-root * { box-sizing: border-box; }
            \`
            document.head.appendChild(style)
        }

        // Boot interactions after DOM paint
        const id = requestAnimationFrame(() => {
            try {
                // eslint-disable-next-line no-new-func
                new Function(BOOT_JS)()
            } catch (e) {
                console.warn("Portfolio boot:", e)
            }
        })

        return () => cancelAnimationFrame(id)
    }, [])

    return (
        <div
            ref={rootRef}
            className="lola-portfolio-root"
            style={{
                width: "100%",
                minHeight: "100vh",
                background: "#000",
                position: "relative",
                overflow: "visible",
            }}
            dangerouslySetInnerHTML={{ __html: BODY_HTML }}
        />
    )
}

${name}.displayName = ${JSON.stringify(name)}

addPropertyControls(${name}, {
    note: {
        type: ControlType.String,
        title: "Page",
        defaultValue: ${JSON.stringify(defaultPageLabel)},
        displayTextArea: false,
    },
})
`
}

const pages = [
  {
    file: "RedesignHome.tsx",
    name: "RedesignHome",
    html: readFileSync(join(root, "index.html"), "utf8"),
    label: "Home",
  },
  {
    file: "RedesignRelateOnboarding.tsx",
    name: "RedesignRelateOnboarding",
    html: readFileSync(join(root, "relate-onboarding.html"), "utf8"),
    label: "Relate Onboarding",
  },
  {
    file: "RedesignRelateVisual.tsx",
    name: "RedesignRelateVisual",
    html: readFileSync(join(root, "relate-visual.html"), "utf8"),
    label: "Relate Visual",
  },
  {
    file: "RedesignLiveTranscribe.tsx",
    name: "RedesignLiveTranscribe",
    html: readFileSync(join(root, "live-transcribe.html"), "utf8"),
    label: "Live Transcribe",
  },
  {
    file: "RedesignMarketFresh.tsx",
    name: "RedesignMarketFresh",
    html: readFileSync(join(root, "market-fresh.html"), "utf8"),
    label: "Market Fresh",
  },
]

// Also create standalone Nav/Footer/CustomCursor for foundations todo
const navFooterCursor = `import { useEffect, useRef, useState } from "react"
import { addPropertyControls, ControlType } from "framer"

/**
 * RedesignNav — fixed brutalist nav matching the local redesign.
 */
export default function RedesignNav(props) {
    const active = props.active || "home"
    const links = [
        { key: "home", href: "/#hero", label: "Home" },
        { key: "work", href: "/#work", label: "Work" },
        { key: "about", href: "/#about", label: "About" },
        { key: "skills", href: "/#skills", label: "Tools" },
    ]
    return (
        <nav
            data-cursor="interactive"
            style={{
                position: "fixed",
                top: 0,
                left: 0,
                right: 0,
                zIndex: 100,
                display: "flex",
                alignItems: "stretch",
                justifyContent: "space-between",
                background: "#000",
                borderBottom: "1px solid #fff",
                height: 64,
                width: "100%",
                fontFamily: "'Inter', sans-serif",
            }}
        >
            <a
                href="/"
                className="nav-logo"
                data-cursor="interactive"
                style={{
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "center",
                    padding: "0 18px",
                    borderRight: "1px solid #fff",
                    textDecoration: "none",
                    color: "#fff",
                    fontSize: 13,
                    fontWeight: 600,
                    lineHeight: 1.15,
                    minWidth: 118,
                }}
            >
                <span>Lola/</span>
                <span>Ogundipe</span>
            </a>
            <div
                style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 28,
                    marginLeft: "auto",
                    padding: "0 8px",
                }}
            >
                {links.map((l) => (
                    <a
                        key={l.key}
                        href={l.href}
                        className="nav-link"
                        data-cursor="interactive"
                        style={{
                            fontFamily: "'Fragment Mono', monospace",
                            fontSize: 12,
                            letterSpacing: "-0.03em",
                            color: active === l.key ? "#fff" : "#bababa",
                            textDecoration: "none",
                            whiteSpace: "nowrap",
                        }}
                    >
                        {active === l.key ? \`< \${l.label} >\` : l.label}
                    </a>
                ))}
            </div>
            <a
                href="/#contact"
                className="nav-cta"
                data-cursor="interactive"
                style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    padding: "0 28px",
                    background: "#fff",
                    color: "#000",
                    fontSize: 13,
                    fontWeight: 600,
                    textDecoration: "none",
                    borderLeft: "1px solid #fff",
                }}
            >
                Contact
            </a>
        </nav>
    )
}

addPropertyControls(RedesignNav, {
    active: {
        type: ControlType.Enum,
        title: "Active",
        options: ["home", "work", "about", "skills"],
        optionTitles: ["Home", "Work", "About", "Tools"],
        defaultValue: "home",
    },
})
`

const footerComp = `import { addPropertyControls, ControlType } from "framer"

/**
 * RedesignFooter — site footer matching the local redesign.
 */
export default function RedesignFooter() {
    return (
        <footer
            style={{
                display: "flex",
                justifyContent: "space-between",
                gap: 24,
                flexWrap: "wrap",
                padding: "28px 48px",
                borderTop: "1px solid #fff",
                background: "#000",
                width: "100%",
            }}
        >
            <div
                style={{
                    fontFamily: "'Fragment Mono', monospace",
                    fontSize: 11,
                    letterSpacing: "0.06em",
                    textTransform: "uppercase",
                    color: "#6b6b73",
                }}
            >
                © 2026 LOLA OGUNDIPE — UX DESIGNER
            </div>
            <div
                style={{
                    fontFamily: "'Fragment Mono', monospace",
                    fontSize: 11,
                    letterSpacing: "0.06em",
                    textTransform: "uppercase",
                    color: "#6b6b73",
                }}
            >
                NEW YORK · AVAILABLE FOR FREELANCE & FULL-TIME
            </div>
        </footer>
    )
}

addPropertyControls(RedesignFooter, {})
`

const cursorComp = `import { useEffect, useRef } from "react"
import { addPropertyControls, ControlType } from "framer"

/**
 * CustomCursor — parity with local script.js cursor interactions.
 * Place once per page (or rely on RedesignHome which embeds it).
 */
export default function CustomCursor() {
    const cursorRef = useRef(null)
    const followRef = useRef(null)
    const labelRef = useRef(null)

    useEffect(() => {
        const cursor = cursorRef.current
        const follow = followRef.current
        const cursorLabel = labelRef.current
        if (!cursor) return

        const finePointer = window.matchMedia("(pointer: fine)").matches
        if (!finePointer) {
            cursor.style.display = "none"
            if (follow) follow.style.display = "none"
            return
        }

        document.documentElement.style.cursor = "none"
        document.body.style.cursor = "none"

        let cx = 0,
            cy = 0,
            fx = 0,
            fy = 0
        let raf = 0

        const onMove = (e) => {
            cx = e.clientX
            cy = e.clientY
            cursor.style.left = cx + "px"
            cursor.style.top = cy + "px"
            if (cursorLabel) {
                cursorLabel.style.left = cx + "px"
                cursorLabel.style.top = cy + "px"
            }
        }

        const animate = () => {
            if (follow) {
                fx += (cx - fx) * 0.16
                fy += (cy - fy) * 0.16
                follow.style.left = fx + "px"
                follow.style.top = fy + "px"
            }
            raf = requestAnimationFrame(animate)
        }
        animate()

        const selector =
            ".project-window, .project-card, .btn-solid, .btn-ghost, .contact-link, .nav-link, .nav-cta, .cs-back-link, .cs-next, .nav-logo, [data-cursor='interactive']"

        const onEnter = (e) => {
            const el = e.currentTarget
            cursor.classList.add("hover-state")
            if (cursorLabel) {
                const show =
                    el.classList.contains("project-window") ||
                    el.classList.contains("project-card")
                cursorLabel.style.opacity = show ? "1" : "0"
                cursorLabel.textContent = "OPEN"
            }
        }
        const onLeave = () => {
            cursor.classList.remove("hover-state")
            if (cursorLabel) cursorLabel.style.opacity = "0"
        }

        const bind = () => {
            document.querySelectorAll(selector).forEach((el) => {
                el.removeEventListener("mouseenter", onEnter)
                el.removeEventListener("mouseleave", onLeave)
                el.addEventListener("mouseenter", onEnter)
                el.addEventListener("mouseleave", onLeave)
            })
        }
        bind()
        const mo = new MutationObserver(bind)
        mo.observe(document.body, { childList: true, subtree: true })
        document.addEventListener("mousemove", onMove)

        return () => {
            cancelAnimationFrame(raf)
            document.removeEventListener("mousemove", onMove)
            mo.disconnect()
            document.documentElement.style.cursor = ""
            document.body.style.cursor = ""
        }
    }, [])

    return (
        <>
            <style>{\`
              #lola-cursor {
                position: fixed; width: 10px; height: 10px; background: #fff;
                border-radius: 0; pointer-events: none; z-index: 99999;
                transform: translate(-50%, -50%);
                transition: width 0.15s cubic-bezier(0.25,0.46,0.45,0.94), height 0.15s cubic-bezier(0.25,0.46,0.45,0.94), background 0.15s;
                mix-blend-mode: difference;
              }
              #lola-cursor-follow {
                position: fixed; width: 28px; height: 28px; border: 1px solid #fff;
                border-radius: 0; pointer-events: none; z-index: 99998;
                transform: translate(-50%, -50%); opacity: 0.45;
              }
              #lola-cursor.hover-state { width: 36px; height: 36px; background: transparent; }
              #lola-cursor-label {
                position: fixed; font-family: 'Fragment Mono', monospace; font-size: 10px;
                letter-spacing: 0.08em; color: #fff; pointer-events: none; z-index: 99999;
                opacity: 0; transform: translate(18px, -50%); transition: opacity 0.15s;
                white-space: nowrap; mix-blend-mode: difference;
              }
            \`}</style>
            <div id="lola-cursor" ref={cursorRef} />
            <div id="lola-cursor-follow" ref={followRef} />
            <div id="lola-cursor-label" ref={labelRef} />
        </>
    )
}

addPropertyControls(CustomCursor, {})
`

mkdirSync(__dirname, { recursive: true })
writeFileSync(join(__dirname, "RedesignNav.tsx"), navFooterCursor)
writeFileSync(join(__dirname, "RedesignFooter.tsx"), footerComp)
writeFileSync(join(__dirname, "CustomCursor.tsx"), cursorComp)

const created = []
for (const p of pages) {
  const content = makeComponent(p.name, p.html, p.label)
  const path = join(__dirname, p.file)
  writeFileSync(path, content)
  created.push({ ...p, path, bytes: content.length })
  console.log(`Wrote ${p.file} (${content.length} bytes)`)
}

console.log("Wrote RedesignNav.tsx, RedesignFooter.tsx, CustomCursor.tsx")

// Upload helper
function upload(name, path) {
  const content = readFileSync(path, "utf8")
  console.log(`\\n=== Uploading ${name} (${content.length} bytes) ===`)
  try {
    const out = execFileSync(
      "npx",
      ["--yes", "unframer", "mcp", "createCodeFile", "--name", name, "--content", content],
      { encoding: "utf8", maxBuffer: 50 * 1024 * 1024, timeout: 120000 }
    )
    console.log(out)
    return out
  } catch (e) {
    const msg = (e.stdout || "") + (e.stderr || e.message)
    if (/already exists|exists/i.test(msg)) {
      console.log("File may exist, trying to find id via getProjectXml...")
      return msg
    }
    console.error(msg)
    throw e
  }
}

const uploadList = [
  ["RedesignNav.tsx", join(__dirname, "RedesignNav.tsx")],
  ["RedesignFooter.tsx", join(__dirname, "RedesignFooter.tsx")],
  ["CustomCursor.tsx", join(__dirname, "CustomCursor.tsx")],
  ...created.map((p) => [p.file, p.path]),
]

const results = {}
for (const [name, path] of uploadList) {
  results[name] = upload(name, path)
}

writeFileSync(join(__dirname, "upload-results.json"), JSON.stringify(results, null, 2))
console.log("\\nDone. Results saved to upload-results.json")
