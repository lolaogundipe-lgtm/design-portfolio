import { useEffect, useRef, useState } from "react"
import { addPropertyControls, ControlType } from "framer"

/**
 * RedesignNav — fixed brutalist nav matching the local redesign.
 */
export default function RedesignNav(props) {
    const active = props.active || "home"
    const links = [
        { key: "home", href: "/#hero", label: "Home" },
        { key: "work", href: "/#work", label: "Work" },
        { key: "services", href: "/services", label: "Services" },
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
                        {active === l.key ? `< ${l.label} >` : l.label}
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
        options: ["home", "work", "services", "about", "skills"],
        optionTitles: ["Home", "Work", "Services", "About", "Tools"],
        defaultValue: "home",
    },
})
