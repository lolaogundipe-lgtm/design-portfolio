import { useEffect, useRef } from "react"
import { addPropertyControls, ControlType } from "framer"

const CSS = `*, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

:root {
  --bg: #000000;
  --bg2: #0a0a0a;
  --surface: #111111;
  --border: #ffffff;
  --border-dim: #3f3f46;
  --text: #ffffff;
  --text2: #bababa;
  --text3: #6b6b73;
  --accent: #ffffff;
  --accent-hot: #b81414;
  --font-display: 'Geist Mono', monospace;
  --font-body: 'Inter', sans-serif;
  --font-mono: 'Fragment Mono', 'Geist Mono', monospace;
  --ease-out: cubic-bezier(0.25, 0.46, 0.45, 0.94);
  --ease-snap: cubic-bezier(0.16, 1, 0.3, 1);
}

html { scroll-behavior: smooth; }

body {
  background: var(--bg);
  color: var(--text);
  font-family: var(--font-display);
  overflow-x: hidden;
  cursor: none;
}

/* ─── CUSTOM CURSOR ─────────────────────────────────── */
#cursor {
  position: fixed;
  width: 10px; height: 10px;
  background: var(--text);
  border-radius: 0;
  pointer-events: none;
  z-index: 9999;
  transform: translate(-50%, -50%);
  transition: width 0.15s var(--ease-out), height 0.15s var(--ease-out), background 0.15s;
  mix-blend-mode: difference;
}
#cursor-follow {
  position: fixed;
  width: 28px; height: 28px;
  border: 1px solid var(--text);
  border-radius: 0;
  pointer-events: none;
  z-index: 9998;
  transform: translate(-50%, -50%);
  opacity: 0.45;
  transition: transform 0.12s var(--ease-out), opacity 0.2s, width 0.15s, height 0.15s;
}
#cursor.hover-state { width: 36px; height: 36px; background: transparent; }
#cursor-label {
  position: fixed;
  font-family: var(--font-mono);
  font-size: 10px;
  letter-spacing: 0.08em;
  color: var(--text);
  pointer-events: none;
  z-index: 9999;
  opacity: 0;
  transform: translate(18px, -50%);
  transition: opacity 0.15s;
  white-space: nowrap;
  mix-blend-mode: difference;
}

/* Noise / dither grain */
body::after {
  content: '';
  position: fixed;
  inset: 0;
  background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E");
  opacity: 0.045;
  pointer-events: none;
  z-index: 9997;
  mix-blend-mode: overlay;
}

/* ─── NAV ───────────────────────────────────────────── */
nav {
  position: fixed;
  top: 0; left: 0; right: 0;
  z-index: 100;
  display: flex;
  align-items: stretch;
  justify-content: space-between;
  gap: 16px;
  padding: 0;
  background: var(--bg);
  border-bottom: 1px solid var(--border);
  height: 64px;
}
.nav-logo {
  display: flex;
  flex-direction: column;
  justify-content: center;
  padding: 0 18px;
  border-right: 1px solid var(--border);
  text-decoration: none;
  color: var(--text);
  font-family: var(--font-body);
  font-size: 13px;
  font-weight: 600;
  line-height: 1.15;
  letter-spacing: -0.02em;
  min-width: 118px;
  transition: background 0.2s, color 0.2s;
}
.nav-logo:hover { background: var(--text); color: var(--bg); }
.nav-links {
  display: flex;
  align-items: center;
  gap: 28px;
  margin-left: auto;
  padding: 0 8px;
}
.nav-link {
  font-family: var(--font-mono);
  font-size: 12px;
  letter-spacing: -0.03em;
  color: var(--text2);
  text-decoration: none;
  transition: color 0.15s;
  white-space: nowrap;
}
.nav-link:hover,
.nav-link.is-active { color: var(--text); }
.nav-cta {
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0 28px;
  background: var(--text);
  color: var(--bg);
  font-family: var(--font-body);
  font-size: 13px;
  font-weight: 600;
  text-decoration: none;
  border-left: 1px solid var(--border);
  transition: background 0.2s, color 0.2s;
}
.nav-cta:hover { background: var(--bg); color: var(--text); }

/* ─── HERO ──────────────────────────────────────────── */
#hero {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  justify-content: flex-end;
  padding: 96px 48px 0;
  position: relative;
  overflow: hidden;
  border-bottom: 1px solid var(--border);
}
.hero-dither {
  position: absolute;
  inset: 0;
  background:
    radial-gradient(ellipse 70% 55% at 70% 40%, rgba(255,255,255,0.09) 0%, transparent 60%),
    radial-gradient(ellipse 40% 30% at 20% 80%, rgba(184,20,20,0.18) 0%, transparent 70%),
    repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(255,255,255,0.015) 2px, rgba(255,255,255,0.015) 3px),
    repeating-linear-gradient(90deg, transparent, transparent 2px, rgba(255,255,255,0.015) 2px, rgba(255,255,255,0.015) 3px);
  pointer-events: none;
}
.hero-scanlines {
  position: absolute;
  inset: 0;
  background: repeating-linear-gradient(
    to bottom,
    transparent 0px,
    transparent 3px,
    rgba(0,0,0,0.18) 3px,
    rgba(0,0,0,0.18) 4px
  );
  pointer-events: none;
  opacity: 0.35;
  animation: scanDrift 8s linear infinite;
}
@keyframes scanDrift {
  from { transform: translateY(0); }
  to { transform: translateY(4px); }
}

.hero-frame {
  position: relative;
  z-index: 1;
  max-width: 920px;
  padding-bottom: 48px;
}
.hero-status {
  display: inline-flex;
  align-items: center;
  gap: 10px;
  font-family: var(--font-mono);
  font-size: 11px;
  letter-spacing: -0.02em;
  color: var(--text2);
  margin-bottom: 28px;
  opacity: 0;
  animation: fadeUp 0.5s var(--ease-out) 0.15s forwards;
}
.status-dot {
  width: 8px; height: 8px;
  background: var(--accent-hot);
  animation: blink 1.2s steps(1) infinite;
}
@keyframes blink {
  0%, 50% { opacity: 1; }
  51%, 100% { opacity: 0.15; }
}
.hero-role {
  font-family: var(--font-mono);
  font-size: clamp(12px, 1.4vw, 14px);
  letter-spacing: 0.08em;
  text-transform: uppercase;
  color: var(--text2);
  margin-bottom: 20px;
  min-height: 1.4em;
  opacity: 0;
  animation: fadeUp 0.5s var(--ease-out) 0.25s forwards;
}
.hero-brand {
  font-family: var(--font-display);
  font-size: clamp(48px, 10vw, 112px);
  font-weight: 700;
  line-height: 0.9;
  letter-spacing: -0.06em;
  text-transform: uppercase;
  margin-bottom: 22px;
  opacity: 0;
  animation: fadeUp 0.7s var(--ease-snap) 0.35s forwards;
}
.brand-line { display: block; }
.brand-line.accent {
  color: var(--bg);
  -webkit-text-stroke: 1.5px var(--text);
  paint-order: stroke fill;
  text-shadow: 4px 4px 0 var(--accent-hot);
}
.hero-tagline {
  font-family: var(--font-display);
  font-size: clamp(22px, 3.4vw, 40px);
  font-weight: 700;
  letter-spacing: -0.04em;
  text-transform: uppercase;
  line-height: 1.1;
  color: var(--text);
  max-width: 18ch;
  margin-bottom: 18px;
  opacity: 0;
  animation: fadeUp 0.6s var(--ease-out) 0.45s forwards;
}
.hero-sub {
  font-family: var(--font-body);
  font-size: clamp(15px, 1.5vw, 18px);
  line-height: 1.55;
  color: var(--text2);
  max-width: 560px;
  margin-bottom: 28px;
  opacity: 0;
  animation: fadeUp 0.6s var(--ease-out) 0.55s forwards;
}
.hero-actions {
  display: flex;
  gap: 12px;
  flex-wrap: wrap;
  opacity: 0;
  animation: fadeUp 0.6s var(--ease-out) 0.65s forwards;
}
.hero-meta-bar {
  position: relative;
  z-index: 1;
  display: flex;
  justify-content: space-between;
  gap: 16px;
  border-top: 1px solid var(--border);
  padding: 14px 0;
  font-family: var(--font-mono);
  font-size: 11px;
  letter-spacing: 0.04em;
  color: var(--text3);
  opacity: 0;
  animation: fadeIn 0.6s var(--ease-out) 0.85s forwards;
}
@keyframes fadeUp { to { opacity: 1; transform: translateY(0); } }
@keyframes fadeIn { to { opacity: 1; } }

@media (prefers-reduced-motion: reduce) {
  .hero-status, .hero-role, .hero-brand, .hero-tagline, .hero-sub, .hero-actions, .hero-meta-bar,
  .reveal, .cs-section {
    opacity: 1 !important;
    transform: none !important;
    animation: none !important;
    transition: none !important;
  }
  .hero-scanlines { animation: none; }
}

/* Buttons */
.btn-solid,
.btn-ghost,
.contact-link,
.nav-cta {
  border-radius: 0;
}
.btn-solid {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: 14px 28px;
  background: var(--text);
  color: var(--bg);
  font-family: var(--font-body);
  font-size: 13px;
  font-weight: 600;
  text-decoration: none;
  border: 1px solid var(--text);
  transition: background 0.2s, color 0.2s;
}
.btn-solid:hover { background: transparent; color: var(--text); }
.btn-ghost {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: 14px 28px;
  background: transparent;
  color: var(--text);
  font-family: var(--font-body);
  font-size: 13px;
  font-weight: 600;
  text-decoration: none;
  border: 1px solid var(--border);
  transition: background 0.2s, color 0.2s;
}
.btn-ghost:hover { background: var(--text); color: var(--bg); }

/* ─── SECTION SHARED ────────────────────────────────── */
section { padding: 100px 48px; scroll-margin-top: 64px; }
.section-badge {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  font-family: var(--font-mono);
  font-size: 11px;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  color: var(--text);
  border: 1px solid var(--border);
  padding: 8px 14px;
  margin-bottom: 28px;
}
.badge-icon { opacity: 0.7; }
.section-title {
  font-family: var(--font-display);
  font-size: clamp(40px, 7vw, 88px);
  font-weight: 700;
  letter-spacing: -0.05em;
  line-height: 0.95;
  text-transform: uppercase;
  margin-bottom: 56px;
}
.section-title em {
  font-style: normal;
  -webkit-text-stroke: 1px var(--text);
  -webkit-text-fill-color: transparent;
}

/* ─── WINDOW CHROME ─────────────────────────────────── */
.window-chrome {
  display: flex;
  align-items: center;
  justify-content: space-between;
  background: var(--text);
  color: var(--bg);
  padding: 10px 14px;
  font-family: var(--font-mono);
  font-size: 11px;
  letter-spacing: -0.02em;
}
.window-controls {
  letter-spacing: 0.2em;
  opacity: 0.7;
}

/* ─── WORK / PROJECTS ───────────────────────────────── */
#work { background: var(--bg); border-bottom: 1px solid var(--border); }
.project-list {
  display: flex;
  flex-direction: column;
  gap: 28px;
}
.project-window {
  display: block;
  border: 1px solid var(--border);
  text-decoration: none;
  color: inherit;
  background: var(--bg);
  transition: transform 0.25s var(--ease-out), box-shadow 0.25s;
}
.project-window:hover {
  transform: translate(-4px, -4px);
  box-shadow: 4px 4px 0 var(--accent-hot);
}
.window-body {
  display: grid;
  grid-template-columns: 1.2fr 0.8fr;
  gap: 0;
  height: 300px;
  min-height: 300px;
}
.window-copy {
  padding: 36px 32px;
  border-right: 1px solid var(--border-dim);
  display: flex;
  flex-direction: column;
  justify-content: center;
  overflow: hidden;
}
.project-label {
  font-family: var(--font-mono);
  font-size: 11px;
  letter-spacing: 0.04em;
  text-transform: uppercase;
  color: var(--text3);
  margin-bottom: 14px;
}
.project-name {
  font-family: var(--font-display);
  font-size: clamp(22px, 2.8vw, 34px);
  font-weight: 700;
  letter-spacing: -0.04em;
  text-transform: uppercase;
  line-height: 1.05;
  margin-bottom: 14px;
  color: var(--text);
}
.project-desc {
  font-family: var(--font-body);
  font-size: 15px;
  line-height: 1.55;
  color: var(--text2);
  max-width: 460px;
  margin-bottom: 22px;
}
.project-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}
.project-tags span {
  font-family: var(--font-mono);
  font-size: 10px;
  letter-spacing: 0.04em;
  text-transform: uppercase;
  border: 1px solid var(--border-dim);
  padding: 5px 10px;
  color: var(--text2);
}
.window-media {
  background: #080808;
  overflow: hidden;
  position: relative;
  height: 100%;
  min-height: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 16px;
}
.window-media img {
  width: 100%;
  height: 100%;
  max-width: 100%;
  max-height: 100%;
  object-fit: contain;
  object-position: center;
  filter: grayscale(1) contrast(1.15);
  opacity: 0.85;
  transition: filter 0.35s, opacity 0.35s, transform 0.5s var(--ease-out);
  transform: scale(1);
}
.project-window:hover .window-media img {
  filter: grayscale(0.35) contrast(1.05);
  opacity: 1;
  transform: scale(1.02);
}

/* Legacy project-card support (if any) */
.project-card { display: contents; }
.project-num, .project-main, .project-meta-col,
.project-type-tag, .project-impact, .project-image-col,
.project-arrow, .work-header, .work-headline, .work-count { display: none; }

/* ─── ABOUT ─────────────────────────────────────────── */
#about {
  background: var(--bg2);
  border-bottom: 1px solid var(--border);
}
.about-layout {
  display: grid;
  grid-template-columns: 1.4fr 0.8fr;
  gap: 24px;
  align-items: stretch;
  margin-bottom: 28px;
}
.about-terminal {
  border: 1px solid var(--border);
  background: var(--bg);
}
.terminal-body {
  padding: 28px 24px;
  font-family: var(--font-mono);
  font-size: 13px;
  line-height: 1.7;
}
.term-line { color: var(--text); margin-bottom: 6px; }
.term-prompt { color: var(--accent-hot); margin-right: 8px; }
.term-output {
  color: var(--text2);
  margin: 0 0 18px 18px;
  max-width: 56ch;
}
.term-output strong { color: var(--text); font-weight: 600; }
.term-output em { color: var(--text); font-style: italic; }
.term-cursor {
  display: inline-block;
  animation: blink 1s steps(1) infinite;
  color: var(--text);
}
.about-stats {
  display: grid;
  grid-template-columns: 1fr 1fr;
  border: 1px solid var(--border);
}
.stat-cell {
  padding: 28px 20px;
  border-right: 1px solid var(--border-dim);
  border-bottom: 1px solid var(--border-dim);
}
.stat-cell:nth-child(2n) { border-right: none; }
.stat-cell:nth-child(n+3) { border-bottom: none; }
.stat-num {
  font-family: var(--font-display);
  font-size: 42px;
  font-weight: 700;
  letter-spacing: -0.05em;
  margin-bottom: 8px;
}
.stat-label {
  font-family: var(--font-mono);
  font-size: 10px;
  letter-spacing: 0.06em;
  color: var(--text3);
}
.about-tags { display: flex; flex-wrap: wrap; gap: 8px; }
.tag {
  font-family: var(--font-mono);
  font-size: 11px;
  letter-spacing: -0.02em;
  border: 1px solid var(--border-dim);
  padding: 7px 12px;
  color: var(--text2);
  border-radius: 0;
  transition: border-color 0.15s, color 0.15s, background 0.15s;
}
.tag:hover {
  border-color: var(--text);
  color: var(--bg);
  background: var(--text);
}

/* Legacy about classes */
.about-grid { display: contents; }
.about-headline, .about-body, .about-stat-grid, .about-stat,
.about-stat-num, .about-stat-label { /* keep usable on case studies if referenced */ }

/* ─── SKILLS ────────────────────────────────────────── */
#skills { background: var(--bg); border-bottom: 1px solid var(--border); }
.skills-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 0;
  border: 1px solid var(--border);
  margin-top: 0;
  background: transparent;
}
.skill-block {
  background: var(--bg);
  padding: 28px 24px;
  border-right: 1px solid var(--border-dim);
  border-bottom: 1px solid var(--border-dim);
  transition: background 0.2s;
}
.skill-block:nth-child(3n) { border-right: none; }
.skill-block:nth-child(n+4) { border-bottom: none; }
.skill-block:hover { background: #0d0d0d; }
.skill-top {
  display: flex;
  justify-content: space-between;
  align-items: baseline;
  gap: 12px;
  margin-bottom: 12px;
}
.skill-name {
  font-family: var(--font-display);
  font-size: 15px;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: -0.03em;
}
.skill-pct {
  font-family: var(--font-mono);
  font-size: 11px;
  color: var(--text3);
}
.skill-desc {
  font-family: var(--font-mono);
  font-size: 11px;
  letter-spacing: -0.02em;
  line-height: 1.65;
  color: var(--text3);
  text-transform: none;
  margin-bottom: 18px;
  min-height: 3.3em;
}
.skill-bar {
  height: 3px;
  background: var(--border-dim);
  overflow: hidden;
}
.skill-bar span {
  display: block;
  height: 100%;
  width: 0;
  background: var(--text);
  transition: width 1s var(--ease-out);
}
.skill-block.visible .skill-bar span,
.skill-block .skill-bar span.filled { width: var(--w); }
.skill-icon { display: none; }

/* ─── CONTACT ───────────────────────────────────────── */
#contact {
  background: var(--bg2);
  border-bottom: 1px solid var(--border);
  text-align: left;
  padding: 100px 48px;
}
.contact-window {
  border: 1px solid var(--border);
  max-width: 720px;
}
.contact-body { padding: 36px 28px; }
.contact-prompt {
  font-family: var(--font-mono);
  font-size: 13px;
  color: var(--text2);
  margin-bottom: 24px;
}
.contact-links {
  display: flex;
  gap: 12px;
  flex-wrap: wrap;
  justify-content: flex-start;
}
.contact-eyebrow { display: none; }
.contact-headline { /* unused on new home; keep for safety */ }
.contact-link {
  font-family: var(--font-body);
  font-size: 13px;
  font-weight: 600;
  letter-spacing: 0;
  text-transform: none;
  color: var(--text);
  text-decoration: none;
  border: 1px solid var(--border);
  padding: 14px 28px;
  border-radius: 0;
  transition: background 0.2s, color 0.2s;
}
.contact-link:hover { background: var(--text); color: var(--bg); }
.contact-link.primary { background: var(--text); color: var(--bg); }
.contact-link.primary:hover { background: transparent; color: var(--text); }

/* ─── FOOTER ─────────────────────────────────────────── */
footer {
  border-top: none;
  padding: 20px 48px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 16px;
  background: var(--bg);
}
.footer-text {
  font-family: var(--font-mono);
  font-size: 10px;
  letter-spacing: 0.06em;
  text-transform: uppercase;
  color: var(--text3);
}

/* ─── CASE STUDY PAGES ──────────────────────────────── */
.cs-page { background: var(--bg2); border-bottom: 1px solid var(--border); }
.cs-grid {
  display: grid;
  grid-template-columns: 280px 1fr;
  gap: 64px;
  align-items: start;
}
.cs-sticky { position: sticky; top: 88px; z-index: 0; }
.cs-title {
  font-size: 28px;
  font-weight: 700;
  letter-spacing: -0.04em;
  text-transform: uppercase;
  line-height: 1.05;
  margin-bottom: 24px;
  font-family: var(--font-display);
}
.cs-meta-strip {
  display: flex;
  flex-direction: column;
  gap: 0;
  margin-bottom: 24px;
  border: 1px solid var(--border);
}
.cs-meta-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-family: var(--font-mono);
  font-size: 10px;
  letter-spacing: 0.04em;
  text-transform: uppercase;
  padding: 12px 14px;
  border-bottom: 1px solid var(--border-dim);
}
.cs-meta-row:last-child { border-bottom: none; }
.cs-meta-row .label { color: var(--text3); }
.cs-meta-row .value { color: var(--text2); }
.cs-impact-callout {
  background: transparent;
  border: 1px solid var(--border);
  border-radius: 0;
  padding: 20px;
  font-family: var(--font-mono);
  font-size: 11px;
  line-height: 1.7;
  color: var(--text);
  letter-spacing: 0.02em;
}
.cs-impact-callout strong {
  display: block;
  font-size: 28px;
  letter-spacing: -0.04em;
  margin-bottom: 4px;
  font-family: var(--font-display);
  font-weight: 700;
  color: var(--accent-hot);
}

.cs-sections { position: relative; z-index: 1; isolation: isolate; display: flex; flex-direction: column; gap: 0; }
.cs-section {
  border-top: 1px solid var(--border-dim);
  padding: 36px 0;
  opacity: 0;
  transform: translateY(20px);
  transition: opacity 0.5s var(--ease-out), transform 0.5s var(--ease-out);
}
.cs-section.visible { opacity: 1; transform: translateY(0); }
.cs-section-num {
  font-family: var(--font-mono);
  font-size: 10px;
  letter-spacing: 0.08em;
  color: var(--text3);
  text-transform: uppercase;
  margin-bottom: 12px;
  display: flex;
  align-items: center;
  gap: 12px;
}
.cs-section-num::after {
  content: '';
  flex: 1;
  height: 1px;
  background: var(--border-dim);
}
.cs-section-title {
  font-size: 20px;
  font-weight: 700;
  letter-spacing: -0.03em;
  text-transform: uppercase;
  margin-bottom: 16px;
  color: var(--text);
  font-family: var(--font-display);
}
.cs-section-body {
  font-family: var(--font-body);
  font-size: 16px;
  line-height: 1.7;
  color: var(--text2);
  font-style: normal;
  max-width: 600px;
}
.cs-section-body strong {
  font-style: normal;
  color: var(--text);
  font-family: var(--font-display);
  font-weight: 600;
  font-size: 14px;
}
.cs-list {
  list-style: none;
  margin: 12px 0 0;
  padding: 0;
  max-width: 600px;
  display: flex;
  flex-direction: column;
  gap: 8px;
}
.cs-list li {
  font-family: var(--font-body);
  font-size: 15px;
  line-height: 1.55;
  color: var(--text2);
  padding: 10px 14px;
  border: 1px solid var(--border-dim);
  position: relative;
}
.cs-list li::before {
  content: '→';
  color: var(--text);
  margin-right: 10px;
  font-family: var(--font-mono);
  font-size: 12px;
}

/* Full-measure copy: body text spans the content column instead of a 600px paragraph. */
.cs-wide-copy .cs-section-body,
.cs-wide-copy .cs-list {
  max-width: none;
}
.cs-page-header.cs-wide-copy .cs-page-sub {
  max-width: min(1100px, 100%);
}

.cs-page-header {
  padding: 120px 48px 64px;
  border-bottom: 1px solid var(--border);
  background: var(--bg);
  position: relative;
  overflow: hidden;
}
.cs-page-header::before {
  content: '';
  position: absolute;
  inset: 0;
  background:
    repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(255,255,255,0.02) 2px, rgba(255,255,255,0.02) 3px),
    radial-gradient(ellipse 50% 40% at 80% 20%, rgba(184,20,20,0.12), transparent 60%);
  pointer-events: none;
}
.cs-back-link {
  display: inline-flex;
  align-items: center;
  gap: 10px;
  font-family: var(--font-mono);
  font-size: 11px;
  letter-spacing: 0.04em;
  text-transform: uppercase;
  color: var(--text2);
  text-decoration: none;
  margin-bottom: 32px;
  transition: color 0.2s, gap 0.2s;
  position: relative;
}
.cs-back-link:hover { color: var(--text); gap: 14px; }
.cs-eyebrow {
  font-family: var(--font-mono);
  font-size: 11px;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  color: var(--text3);
  margin-bottom: 20px;
  position: relative;
}
.cs-page-title {
  font-family: var(--font-display);
  font-size: clamp(40px, 6vw, 80px);
  font-weight: 700;
  line-height: 0.95;
  letter-spacing: -0.05em;
  text-transform: uppercase;
  color: var(--text);
  margin-bottom: 28px;
  max-width: 1100px;
  position: relative;
}
.cs-page-sub {
  font-family: var(--font-body);
  font-style: normal;
  font-size: clamp(16px, 1.8vw, 20px);
  color: var(--text2);
  max-width: 720px;
  line-height: 1.55;
  position: relative;
}
.cs-hero-image {
  width: 100%;
  max-width: 720px;
  margin-top: 56px;
  border-radius: 0;
  overflow: hidden;
  border: 1px solid var(--border);
  background: var(--surface);
  position: relative;
  max-height: 380px;
}
.cs-hero-image img {
  width: 100%;
  height: 100%;
  max-height: 380px;
  object-fit: contain;
  object-position: center;
  display: block;
  filter: grayscale(0.3) contrast(1.05);
}

.cs-media {
  margin-top: 24px;
  border-radius: 0;
  overflow: hidden;
  border: 1px solid var(--border-dim);
  background: var(--surface);
  max-width: 560px;
}
.cs-media img, .cs-media video {
  display: block;
  width: 100%;
  height: auto;
  max-height: 420px;
  object-fit: contain;
  object-position: center;
  margin: 0 auto;
}
.cs-media--wide {
  max-width: 680px;
}
.cs-media--wide img {
  max-height: 480px;
}
.cs-media--device {
  max-width: 280px;
}
.cs-media--device img {
  max-height: 480px;
}
.cs-media--cutout {
  background: transparent;
  border: none;
  overflow: visible;
}
.cs-media--cutout img {
  max-height: 560px;
}
.cs-media-caption {
  font-family: var(--font-mono);
  font-size: 10px;
  letter-spacing: 0.06em;
  text-transform: uppercase;
  color: var(--text3);
  padding: 12px 16px;
  border-top: 1px solid var(--border-dim);
  background: var(--bg);
}
.cs-media-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 16px;
  margin-top: 24px;
  max-width: 640px;
}
.cs-media-grid .cs-media { margin-top: 0; max-width: none; }
.cs-media-grid img { max-height: 340px; }
.cs-media-row {
  display: flex;
  flex-wrap: wrap;
  gap: 16px;
  margin-top: 24px;
  align-items: flex-start;
}
.cs-media-row .cs-media { margin-top: 0; }

.process-tabs {
  margin-top: 32px;
  border: 1px solid var(--border);
  border-radius: 0;
  overflow: hidden;
}
.process-tab-nav { display: flex; border-bottom: 1px solid var(--border); }
.process-tab-btn {
  flex: 1;
  font-family: var(--font-mono);
  font-size: 10px;
  letter-spacing: 0.06em;
  text-transform: uppercase;
  padding: 12px 8px;
  background: none;
  border: none;
  color: var(--text3);
  cursor: pointer;
  border-bottom: 2px solid transparent;
  transition: color 0.2s, border-color 0.2s;
}
.process-tab-btn.active { color: var(--text); border-bottom-color: var(--text); }
.process-tab-content { display: none; padding: 20px; }
.process-tab-content.active { display: block; }
.process-tab-content p {
  font-family: var(--font-mono);
  font-size: 11px;
  line-height: 1.8;
  color: var(--text2);
  letter-spacing: 0.02em;
}

.funnel-wrap { margin-top: 24px; }
.funnel-row {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 10px;
}
.funnel-label {
  font-family: var(--font-mono);
  font-size: 10px;
  letter-spacing: 0.04em;
  color: var(--text3);
  text-transform: uppercase;
  width: 200px;
  flex-shrink: 0;
}
.funnel-bar-wrap {
  flex: 1;
  height: 20px;
  background: rgba(255,255,255,0.06);
  border-radius: 0;
  overflow: hidden;
  border: 1px solid var(--border-dim);
}
.funnel-bar {
  height: 100%;
  background: var(--border-dim);
  border-radius: 0;
  width: 0;
  transition: width 1.2s var(--ease-out);
}
.funnel-bar.cliff { background: var(--accent-hot); }
.funnel-pct {
  font-family: var(--font-mono);
  font-size: 10px;
  color: var(--text2);
  width: 36px;
  text-align: right;
  flex-shrink: 0;
}

.pull-quote {
  font-family: var(--font-body);
  font-size: 20px;
  font-style: italic;
  color: var(--text2);
  border-left: 2px solid var(--text);
  padding: 16px 0 16px 24px;
  margin: 24px 0;
  line-height: 1.5;
}

.cs-next {
  border-top: 1px solid var(--border);
  background: var(--bg);
  padding: 80px 48px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 40px;
  text-decoration: none;
  transition: background 0.3s, box-shadow 0.3s;
}
.cs-next:hover {
  background: var(--bg);
  box-shadow: inset 0 0 0 1px var(--text);
}
.cs-next-label {
  font-family: var(--font-mono);
  font-size: 10px;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  color: var(--text3);
  margin-bottom: 10px;
}
.cs-next-title {
  font-family: var(--font-display);
  font-size: clamp(28px, 4vw, 56px);
  font-weight: 700;
  letter-spacing: -0.04em;
  text-transform: uppercase;
  color: var(--text);
  line-height: 1;
  transition: color 0.2s;
}
.cs-next:hover .cs-next-title { color: var(--accent-hot); }
.cs-next-arrow {
  font-family: var(--font-mono);
  font-size: 32px;
  color: var(--text);
  transition: transform 0.3s var(--ease-out);
}
.cs-next:hover .cs-next-arrow { transform: translateX(8px); }

/* ─── SCROLL ANIMATIONS ─────────────────────────────── */
.reveal {
  opacity: 0;
  transform: translateY(20px);
  transition: opacity 0.55s var(--ease-out), transform 0.55s var(--ease-out);
}
.reveal.visible { opacity: 1; transform: translateY(0); }
.reveal-delay-1 { transition-delay: 0.08s; }
.reveal-delay-2 { transition-delay: 0.16s; }
.reveal-delay-3 { transition-delay: 0.24s; }

a { cursor: none; }

/* Hide unused side text if present */
.side-text { display: none; }

@media (max-width: 900px) {
  nav { height: auto; flex-wrap: wrap; }
  .nav-logo { border-right: none; border-bottom: 1px solid var(--border); width: 100%; padding: 12px 16px; }
  .nav-links {
    width: 100%;
    justify-content: flex-start;
    gap: 16px;
    padding: 12px 16px;
    overflow-x: auto;
    margin-left: 0;
  }
  .nav-cta { width: 100%; padding: 14px; border-left: none; border-top: 1px solid var(--border); }
  section, #contact { padding: 72px 20px; }
  #hero { padding: 140px 20px 0; }
  .cs-page-header { padding: 140px 20px 40px; }
  .cs-next { padding: 48px 20px; }
  .about-layout, .cs-grid, .window-body { grid-template-columns: 1fr; }
  .window-body { height: auto; min-height: 0; }
  .window-copy { border-right: none; border-bottom: 1px solid var(--border-dim); }
  .window-media { height: 220px; min-height: 220px; aspect-ratio: auto; }
  .cs-sticky { position: relative; top: auto; }
  .skills-grid { grid-template-columns: 1fr; }
  .skill-block { border-right: none !important; border-bottom: 1px solid var(--border-dim) !important; }
  .skill-block:last-child { border-bottom: none !important; }
  .cs-media-grid { grid-template-columns: 1fr; }
  .cs-media, .cs-media--wide { max-width: 100%; }
  .cs-media-row { flex-direction: column; }
  .cs-media--device { max-width: 220px; }
  .hero-meta-bar { flex-direction: column; gap: 8px; }
  footer { flex-direction: column; text-align: left; padding: 20px; }
}

@media (max-width: 600px) {
  .about-stats { grid-template-columns: 1fr; }
  .stat-cell { border-right: none !important; border-bottom: 1px solid var(--border-dim) !important; }
  .stat-cell:last-child { border-bottom: none !important; }
  .hero-brand { font-size: clamp(48px, 16vw, 72px); }
}
`
const BODY_HTML = `<div id="cursor"></div>
<div id="cursor-follow"></div>
<div id="cursor-label"></div>

<!-- NAV -->
<nav id="nav">
  <a href="/" class="nav-logo">
    <span>Lola/</span>
    <span>Ogundipe</span>
  </a>
  <div class="nav-links">
    <a href="#hero" class="nav-link is-active" data-nav="home">&lt; Home &gt;</a>
    <a href="#work" class="nav-link" data-nav="work">Work</a>
    <a href="#about" class="nav-link" data-nav="about">About</a>
    <a href="#skills" class="nav-link" data-nav="skills">Tools</a>
  </div>
  <a href="#contact" class="nav-cta">Contact</a>
</nav>

<!-- HERO -->
<section id="hero">
  <div class="hero-dither" aria-hidden="true"></div>
  <div class="hero-scanlines" aria-hidden="true"></div>

  <div class="hero-frame">
    <div class="hero-status">
      <span class="status-dot"></span>
      <span>uxwithlola.design</span>
    </div>
    <p class="hero-role" id="typeTarget">PRODUCT DESIGN · UX RESEARCH_</p>
    <h1 class="hero-brand">
      <span class="brand-line">Lola</span>
      <span class="brand-line accent">Ogundipe</span>
    </h1>
    <h2 class="hero-tagline">Communication is the product.</h2>
    <p class="hero-sub">I create communication experiences across mobile, conversational, and transactional interfaces by making complex interactions feel personal and intuitive. Wherever the "conversation" lives, my job is the same — make it clear, human, and worth the moment someone gives it.</p>
    <div class="hero-actions">
      <a href="#work" class="btn-solid">View work</a>
      <a href="#contact" class="btn-ghost">Say hello</a>
    </div>
  </div>
  <div class="hero-meta-bar">
    <span>NYC</span>
    <span>AVAILABLE_FOR_HIRE</span>
    <span>04 SELECTED WORKS</span>
  </div>
</section>

<!-- WORK -->
<section id="work">
  <div class="section-badge reveal"><span class="badge-icon">⌘</span> WORK</div>
  <h2 class="section-title reveal">Stuff I<br><em>shipped</em></h2>

  <div class="project-list">

    <a href="/relate-onboarding" class="project-window reveal">
      <div class="window-chrome">
        <span class="window-title">01 / RELATE_ONBOARDING</span>
        <span class="window-controls">— □ ×</span>
      </div>
      <div class="window-body">
        <div class="window-copy">
          <div class="project-label">Google · Product Design · End-to-end UX</div>
          <h3 class="project-name">Project Relate Onboarding</h3>
          <p class="project-desc">Redesigned the first-run experience for users with atypical speech, reducing a 27% early abandonment cliff.</p>
          <div class="project-tags">
            <span>Accessibility</span>
            <span>Mobile</span>
            <span>↗ Google I/O 2024</span>
          </div>
        </div>
        <div class="window-media">
          <img src="https://framerusercontent.com/images/b2vksuyZ4rA6f4QKN3ykTIXjI8.png?width=480&height=962" alt="Project Relate Onboarding" loading="lazy">
        </div>
      </div>
    </a>

    <a href="/relate-visual" class="project-window reveal reveal-delay-1">
      <div class="window-chrome">
        <span class="window-title">02 / RELATE_VISUAL</span>
        <span class="window-controls">— □ ×</span>
      </div>
      <div class="window-body">
        <div class="window-copy">
          <div class="project-label">Google · Design Systems · Visual Design</div>
          <h3 class="project-name">Project Relate Visual Re-design</h3>
          <p class="project-desc">Redesigned and built new components to modernize an accessibility app. Tap accuracy climbed from 68% to 94%.</p>
          <div class="project-tags">
            <span>Design Systems</span>
            <span>Visual</span>
            <span>↗ Shipped</span>
          </div>
        </div>
        <div class="window-media">
          <img src="https://framerusercontent.com/images/foeTZBKjjheORiWf1zy7H7ZDKA.png?width=412&height=898" alt="Project Relate Visual" loading="lazy">
        </div>
      </div>
    </a>

    <a href="/live-transcribe" class="project-window reveal reveal-delay-2">
      <div class="window-chrome">
        <span class="window-title">03 / LIVE_TRANSCRIBE</span>
        <span class="window-controls">— □ ×</span>
      </div>
      <div class="window-body">
        <div class="window-copy">
          <div class="project-label">Google · Feature Design · Foldable Device</div>
          <h3 class="project-name">Live Transcribe Dual Screen</h3>
          <p class="project-desc">Designed a dual-screen transcription experience for Pixel Fold 9 launch, achieving a 35% adoption rate and reducing the need for multiple devices for deaf users.</p>
          <div class="project-tags">
            <span>Feature Design</span>
            <span>Foldable</span>
            <span>↗ Google I/O 2024</span>
          </div>
        </div>
        <div class="window-media">
          <img src="https://framerusercontent.com/images/J604ZGjMoHE7yQGnDLYmjZgRKM.png" alt="Live Transcribe" loading="lazy">
        </div>
      </div>
    </a>

    <a href="/market-fresh" class="project-window reveal reveal-delay-3">
      <div class="window-chrome">
        <span class="window-title">04 / MARKET_FRESH</span>
        <span class="window-controls">— □ ×</span>
      </div>
      <div class="window-body">
        <div class="window-copy">
          <div class="project-label">Product Design · Desktop · Web</div>
          <h3 class="project-name">Market Fresh Website</h3>
          <p class="project-desc">End-to-end product design for a meal kit platform — recipes, flexible delivery, and dietary customization.</p>
          <div class="project-tags">
            <span>Product Design</span>
            <span>Desktop</span>
            <span>↗ Case study</span>
          </div>
        </div>
        <div class="window-media">
          <img src="https://framerusercontent.com/images/9EjuP4xIyf7MbsX1CcFb7yETNjU.png" alt="Market Fresh" loading="lazy">
        </div>
      </div>
    </a>

  </div>
</section>

<!-- ABOUT -->
<section id="about">
  <div class="section-badge reveal"><span class="badge-icon">◉</span> ABOUT</div>
  <div class="about-layout">
    <div class="about-terminal reveal">
      <div class="window-chrome">
        <span class="window-title">&gt;_ /ABOUT_ME</span>
        <span class="window-controls">— □ ×</span>
      </div>
      <div class="terminal-body">
        <p class="term-line"><span class="term-prompt">$</span> whoami</p>
        <p class="term-output">lola_ogundipe — product designer</p>
        <p class="term-line"><span class="term-prompt">$</span> cat origin.txt</p>
        <p class="term-output">I started as a <strong>speech-language pathologist</strong>, sitting with people who struggled to be understood. Communication is never just a technical problem — it's a human one.</p>
        <p class="term-line"><span class="term-prompt">$</span> cat approach.txt</p>
        <p class="term-output">That lens is what I bring to product design. I sweat the details, but I never lose sight of <em>who</em> the detail serves.</p>
        <p class="term-line"><span class="term-prompt">$</span> <span class="term-cursor">█</span></p>
      </div>
    </div>
    <div class="about-stats reveal reveal-delay-1">
      <div class="stat-cell">
        <div class="stat-num">4+</div>
        <div class="stat-label">YEARS_DESIGNING</div>
      </div>
      <div class="stat-cell">
        <div class="stat-num">2</div>
        <div class="stat-label">SHIPPED_AT_GOOGLE</div>
      </div>
      <div class="stat-cell">
        <div class="stat-num">2</div>
        <div class="stat-label">GOOGLE_I/O_FEATURES</div>
      </div>
      <div class="stat-cell">
        <div class="stat-num">∞</div>
        <div class="stat-label">HUMAN_PROBLEMS</div>
      </div>
    </div>
  </div>
  <div class="about-tags reveal reveal-delay-2">
    <span class="tag">User Research</span>
    <span class="tag">Product Design</span>
    <span class="tag">Design Systems</span>
    <span class="tag">Accessibility</span>
    <span class="tag">Prototyping</span>
    <span class="tag">Figma</span>
    <span class="tag">AI Prototyping</span>
    <span class="tag">UX Strategy</span>
  </div>
</section>

<!-- SKILLS -->
<section id="skills">
  <div class="section-badge reveal"><span class="badge-icon">▣</span> TOOLS</div>
  <h2 class="section-title reveal">Methods &amp;<br><em>tools</em></h2>
  <div class="skills-grid">
    <div class="skill-block reveal">
      <div class="skill-top">
        <div class="skill-name">User Research</div>
        <div class="skill-pct">01</div>
      </div>
      <div class="skill-desc">Interviews · Usability testing · Heuristic evaluation</div>
      <div class="skill-bar"><span style="--w:92%"></span></div>
    </div>
    <div class="skill-block reveal reveal-delay-1">
      <div class="skill-top">
        <div class="skill-name">Systems Design</div>
        <div class="skill-pct">02</div>
      </div>
      <div class="skill-desc">Design systems · Component libraries · Tokens · Visual hierarchy</div>
      <div class="skill-bar"><span style="--w:88%"></span></div>
    </div>
    <div class="skill-block reveal reveal-delay-2">
      <div class="skill-top">
        <div class="skill-name">Interaction Design</div>
        <div class="skill-pct">03</div>
      </div>
      <div class="skill-desc">End-to-end UX · Prototyping · Motion · Accessibility</div>
      <div class="skill-bar"><span style="--w:90%"></span></div>
    </div>
    <div class="skill-block reveal">
      <div class="skill-top">
        <div class="skill-name">Figma</div>
        <div class="skill-pct">04</div>
      </div>
      <div class="skill-desc">Components · Auto layout · Variables · FigJam facilitation</div>
      <div class="skill-bar"><span style="--w:95%"></span></div>
    </div>
    <div class="skill-block reveal reveal-delay-1">
      <div class="skill-top">
        <div class="skill-name">AI Prototyping Tools</div>
        <div class="skill-pct">05</div>
      </div>
      <div class="skill-desc">Claude Code · Cursor · Figma Make · ChatGPT</div>
      <div class="skill-bar"><span style="--w:86%"></span></div>
    </div>
    <div class="skill-block reveal reveal-delay-2">
      <div class="skill-top">
        <div class="skill-name">Strategy</div>
        <div class="skill-pct">06</div>
      </div>
      <div class="skill-desc">Journey mapping · Workshop facilitation · Stakeholder alignment</div>
      <div class="skill-bar"><span style="--w:84%"></span></div>
    </div>
  </div>
</section>

<!-- CONTACT -->
<section id="contact">
  <div class="section-badge reveal"><span class="badge-icon">✉</span> CONTACT</div>
  <h2 class="section-title reveal">Have a problem<br><em>worth solving?</em></h2>
  <div class="contact-window reveal">
    <div class="window-chrome">
      <span class="window-title">&gt;_ /CONTACT</span>
      <span class="window-controls">— □ ×</span>
    </div>
    <div class="contact-body">
      <p class="contact-prompt">Ready to collaborate. Pick a channel:</p>
      <div class="contact-links">
        <a href="mailto:lolaogundipe@gmail.com?subject=Hey%20Lola%2C%20I%20would%20love%20to%20chat%20more" class="btn-solid">Say hello</a>
        <a href="https://www.linkedin.com/in/lola-ogundipe/" target="_blank" class="btn-ghost">LinkedIn</a>
        <a href="https://drive.google.com/file/d/182oYnzfOsr-Dm9d5h4mqqN-zahc0xmPP/view" target="_blank" class="btn-ghost">Resume</a>
      </div>
    </div>
  </div>
</section>

<footer>
  <div class="footer-text">© 2026 LOLA OGUNDIPE — UX DESIGNER</div>
  <div class="footer-text">NEW YORK · AVAILABLE FOR FREELANCE &amp; FULL-TIME</div>
</footer>`
const BOOT_JS = `// ── CURSOR ────────────────────────────────────────────
(function initCursor(){
  const cursor = document.getElementById('cursor');
  const follow = document.getElementById('cursor-follow');
  const cursorLabel = document.getElementById('cursor-label');
  if (!cursor) return;

  const finePointer = window.matchMedia('(pointer: fine)').matches;
  if (!finePointer) {
    cursor.style.display = 'none';
    if (follow) follow.style.display = 'none';
    document.body.style.cursor = 'auto';
    return;
  }

  let cx = 0, cy = 0, fx = 0, fy = 0;

  document.addEventListener('mousemove', e => {
    cx = e.clientX; cy = e.clientY;
    cursor.style.left = cx + 'px';
    cursor.style.top = cy + 'px';
    if (cursorLabel) {
      cursorLabel.style.left = cx + 'px';
      cursorLabel.style.top = cy + 'px';
    }
  });

  function animateCursorFollow() {
    if (!follow) return;
    fx += (cx - fx) * 0.16;
    fy += (cy - fy) * 0.16;
    follow.style.left = fx + 'px';
    follow.style.top = fy + 'px';
    requestAnimationFrame(animateCursorFollow);
  }
  animateCursorFollow();

  document.querySelectorAll('.project-window, .project-card, .btn-solid, .btn-ghost, .contact-link, .nav-link, .nav-cta, .cs-back-link, .cs-next, .nav-logo').forEach(el => {
    el.addEventListener('mouseenter', () => {
      cursor.classList.add('hover-state');
      if (cursorLabel) {
        cursorLabel.style.opacity = el.classList.contains('project-window') || el.classList.contains('project-card') ? '1' : '0';
        cursorLabel.textContent = 'OPEN';
      }
    });
    el.addEventListener('mouseleave', () => {
      cursor.classList.remove('hover-state');
      if (cursorLabel) cursorLabel.style.opacity = '0';
    });
  });
})();

// ── TYPEWRITER ────────────────────────────────────────
(function initTypewriter(){
  const el = document.getElementById('typeTarget');
  if (!el) return;
  const full = 'PRODUCT DESIGN · UX RESEARCH';
  let i = 0;
  el.textContent = '';
  function tick() {
    if (i <= full.length) {
      el.textContent = full.slice(0, i) + (i % 2 === 0 ? '_' : '');
      i++;
      setTimeout(tick, 42 + Math.random() * 36);
    } else {
      el.textContent = full + '_';
      setInterval(() => {
        el.textContent = el.textContent.endsWith('_') ? full + ' ' : full + '_';
      }, 530);
    }
  }
  setTimeout(tick, 400);
})();

// ── NAV ACTIVE STATE ──────────────────────────────────
(function initNav(){
  const nav = document.getElementById('nav');
  if (!nav) return;

  const links = [...nav.querySelectorAll('.nav-link[data-nav]')];
  const map = {
    home: document.getElementById('hero'),
    work: document.getElementById('work'),
    about: document.getElementById('about'),
    skills: document.getElementById('skills')
  };

  function setActive(key) {
    links.forEach(link => {
      const label = link.dataset.label || 'Home';
      if (link.dataset.nav === key) {
        link.classList.add('is-active');
        link.textContent = \`< \${label} >\`;
      } else {
        link.classList.remove('is-active');
        link.textContent = label;
      }
    });
  }

  links.forEach(link => {
    link.dataset.label = link.textContent.replace(/[<>]/g, '').trim();
  });

  window.addEventListener('scroll', () => {
    nav.classList.toggle('scrolled', window.scrollY > 40);
    const order = ['skills', 'about', 'work', 'home'];
    for (const key of order) {
      const el = map[key];
      if (!el) continue;
      const top = el.getBoundingClientRect().top;
      if (top <= 90) {
        setActive(key === 'home' ? 'home' : key);
        return;
      }
    }
    setActive('home');
  }, { passive: true });
})();

// ── SCROLL REVEAL ─────────────────────────────────────
(function initReveal(){
  const revealEls = document.querySelectorAll('.reveal, .cs-section, .skill-block');
  if (!revealEls.length) return;
  const obs = new IntersectionObserver((entries) => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        e.target.classList.add('visible');
        e.target.querySelectorAll('.skill-bar span').forEach(bar => {
          bar.style.width = getComputedStyle(bar).getPropertyValue('--w') || bar.style.getPropertyValue('--w');
        });
        obs.unobserve(e.target);
      }
    });
  }, { threshold: 0.12 });
  revealEls.forEach(el => obs.observe(el));
})();

// ── FUNNEL ANIMATION ──────────────────────────────────
(function initFunnel(){
  const funnelSection = document.getElementById('funnelSection');
  if (!funnelSection) return;
  const obs = new IntersectionObserver((entries) => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        funnelSection.querySelectorAll('.funnel-bar').forEach((bar, i) => {
          const pct = bar.dataset.pct;
          setTimeout(() => { bar.style.width = pct + '%'; }, i * 80);
        });
        obs.unobserve(e.target);
      }
    });
  }, { threshold: 0.3 });
  obs.observe(funnelSection);
})();

// ── PROCESS TABS ──────────────────────────────────────
function switchTab(btn, id) {
  const tabs = btn.closest('.process-tabs');
  tabs.querySelectorAll('.process-tab-btn').forEach(b => b.classList.remove('active'));
  tabs.querySelectorAll('.process-tab-content').forEach(c => c.classList.remove('active'));
  btn.classList.add('active');
  document.getElementById('tab-' + id).classList.add('active');
}
`
const FONTS_HREF = "https://fonts.googleapis.com/css2?family=Fragment+Mono:ital,wght@0,400;1,400&family=Geist+Mono:wght@400;500;600;700&family=Inter:wght@400;500;600;700&display=swap"

/**
 * RedesignHome — local portfolio redesign ported into Framer.
 * Includes custom cursor, typewriter, scroll reveal, and full page styles.
 */
export default function RedesignHome(props) {
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
            style.textContent = CSS + `
              html, body { background: #000 !important; }
              /* Framer chrome reset inside component */
              .lola-portfolio-root, .lola-portfolio-root * { box-sizing: border-box; }
            `
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

RedesignHome.displayName = "RedesignHome"

addPropertyControls(RedesignHome, {
    note: {
        type: ControlType.String,
        title: "Page",
        defaultValue: "Home",
        displayTextArea: false,
    },
})
