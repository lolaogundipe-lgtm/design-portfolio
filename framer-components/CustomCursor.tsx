import { useEffect, useRef } from "react"
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
            <style>{`
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
            `}</style>
            <div id="lola-cursor" ref={cursorRef} />
            <div id="lola-cursor-follow" ref={followRef} />
            <div id="lola-cursor-label" ref={labelRef} />
        </>
    )
}

addPropertyControls(CustomCursor, {})
