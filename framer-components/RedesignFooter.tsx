import { addPropertyControls, ControlType } from "framer"

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
