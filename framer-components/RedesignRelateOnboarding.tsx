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

/* ─── PROBLEM VIZ PANELS ────────────────────────────── */
.cs-viz-stack {
  display: flex;
  flex-direction: column;
  gap: 20px;
  margin-top: 28px;
  max-width: none;
}
.cs-viz {
  position: relative;
  overflow: hidden;
  border: 1px solid var(--border);
  background: var(--bg);
  padding: 22px 22px 16px;
}
.cs-viz::before {
  content: '';
  position: absolute;
  inset: 0;
  background:
    radial-gradient(ellipse 50% 40% at 0% 0%, rgba(184,20,20,0.16), transparent 65%),
    repeating-linear-gradient(0deg, transparent, transparent 11px, rgba(255,255,255,0.035) 11px, rgba(255,255,255,0.035) 12px),
    repeating-linear-gradient(90deg, transparent, transparent 11px, rgba(255,255,255,0.035) 11px, rgba(255,255,255,0.035) 12px);
  pointer-events: none;
}
.cs-viz > * { position: relative; z-index: 1; }
.cs-viz-top {
  display: flex;
  justify-content: space-between;
  gap: 16px;
  font-family: var(--font-mono);
  font-size: 10px;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  color: var(--text3);
  margin-bottom: 16px;
}
.cs-viz-sev { color: var(--accent-hot); }
.cs-viz-title {
  font-family: var(--font-display);
  font-size: clamp(28px, 4.2vw, 48px);
  font-weight: 700;
  letter-spacing: -0.05em;
  text-transform: uppercase;
  line-height: 0.9;
  color: var(--text);
  margin-bottom: 8px;
}
.cs-viz-cursor {
  display: inline-block;
  width: 0.42em;
  height: 0.78em;
  margin-left: 6px;
  background: var(--accent-hot);
  vertical-align: -0.04em;
  animation: blink 1.2s steps(1) infinite;
}
.cs-viz-sub {
  font-family: var(--font-mono);
  font-size: 11px;
  letter-spacing: 0.04em;
  color: var(--text2);
  margin-bottom: 22px;
}
.cs-viz-foot {
  display: flex;
  justify-content: space-between;
  gap: 12px;
  margin-top: 18px;
  font-family: var(--font-mono);
  font-size: 10px;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  color: var(--text3);
}
.cs-viz-actions { color: var(--text2); }

.cs-err-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 12px;
}
.cs-err {
  border: 1px solid var(--border);
  background: var(--bg);
  min-width: 0;
}
.cs-err:nth-child(2) { margin-top: 22px; }
.cs-err.is-featured {
  grid-column: 1 / -1;
  box-shadow: 5px 5px 0 var(--accent-hot);
}
.cs-err:nth-child(5) { margin-top: 10px; }
.cs-err-chrome {
  display: flex;
  align-items: center;
  justify-content: space-between;
  background: var(--text);
  color: var(--bg);
  padding: 8px 12px;
  font-family: var(--font-mono);
  font-size: 10px;
  letter-spacing: 0.06em;
  text-transform: uppercase;
}
.cs-err-quote {
  font-family: var(--font-body);
  font-size: 15px;
  line-height: 1.45;
  color: var(--text);
  padding: 16px 16px 18px;
}
.cs-err-hl { color: var(--accent-hot); font-weight: 600; }
.cs-err-actions {
  display: flex;
  justify-content: flex-end;
  gap: 8px;
  padding: 0 16px 16px;
}
.cs-err-btn {
  font-family: var(--font-mono);
  font-size: 10px;
  letter-spacing: 0.1em;
  text-transform: uppercase;
  padding: 8px 12px;
  border: 1px solid var(--text);
}
.cs-err-btn.is-ghost { color: var(--text); background: transparent; }
.cs-err-btn.is-solid { color: var(--bg); background: var(--text); }

.cs-leak-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
}
.cs-leak {
  display: grid;
  grid-template-columns: minmax(0, 1fr) 168px;
  border: 1px solid var(--border);
  background: var(--bg);
}
.cs-leak-main { min-width: 0; }
.cs-leak-copy {
  font-family: var(--font-body);
  font-size: 16px;
  line-height: 1.35;
  color: var(--text);
  padding: 16px 16px 10px;
}
.cs-leak-bar {
  display: flex;
  height: 18px;
  margin: 0 16px;
  border: 1px solid var(--border);
}
.cs-leak-seg.is-continue {
  background: repeating-linear-gradient(-45deg, var(--text) 0 5px, #000 5px 10px);
}
.cs-leak-seg.is-lost {
  background: repeating-linear-gradient(-45deg, var(--accent-hot) 0 5px, #3a0808 5px 10px);
}
.cs-leak-legend {
  display: flex;
  justify-content: space-between;
  gap: 8px;
  padding: 8px 16px 16px;
  font-family: var(--font-mono);
  font-size: 10px;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  color: var(--text2);
}
.cs-leak-legend .is-lost { color: var(--accent-hot); }
.cs-leak-stat {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: flex-start;
  padding: 16px 18px;
  border-left: 1px solid var(--border);
}
.cs-leak-num {
  font-family: var(--font-display);
  font-size: 36px;
  font-weight: 700;
  letter-spacing: -0.05em;
  line-height: 1;
  color: var(--accent-hot);
}
.cs-leak-label {
  font-family: var(--font-mono);
  font-size: 10px;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  color: var(--text2);
  margin-top: 8px;
}

.cs-void {
  display: grid;
  grid-template-columns: minmax(0, 1.15fr) minmax(180px, 0.85fr);
  gap: 20px 28px;
  align-items: stretch;
}
.cs-void-gates {
  list-style: none;
  margin: 0;
  padding: 0;
  display: grid;
  grid-template-rows: repeat(7, minmax(44px, 1fr));
  border: 1px solid var(--border);
  background: var(--bg);
}
.cs-void-gate {
  display: grid;
  grid-template-columns: 8px minmax(0, 1fr) auto;
  gap: 12px;
  align-items: center;
  padding: 8px 12px;
  border-bottom: 1px solid var(--border-dim);
}
.cs-void-gate:last-child { border-bottom: none; }
.cs-void-mark {
  width: 8px;
  height: 8px;
  border: 1px solid var(--text);
  background: var(--text);
}
.cs-void-gate-copy { min-width: 0; }
.cs-void-gate-title {
  font-family: var(--font-body);
  font-size: 14px;
  line-height: 1.3;
  color: var(--text);
}
.cs-void-gate-meta {
  font-family: var(--font-mono);
  font-size: 9px;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  color: var(--text3);
  margin-top: 3px;
}
.cs-void-gate-pct {
  font-family: var(--font-display);
  font-size: 16px;
  font-weight: 700;
  letter-spacing: -0.04em;
  color: var(--text);
}
.cs-void-gate.is-critical .cs-void-mark,
.cs-void-gate.is-void .cs-void-mark {
  background: var(--accent-hot);
  border-color: var(--accent-hot);
}
.cs-void-gate.is-critical .cs-void-gate-meta .is-hot,
.cs-void-gate.is-void .cs-void-gate-title,
.cs-void-gate.is-void .cs-void-gate-pct,
.cs-void-gate.is-void .cs-void-gate-meta {
  color: var(--accent-hot);
}
.cs-void-funnel {
  display: flex;
  align-items: stretch;
  min-height: 380px;
}
.cs-void-funnel svg {
  width: 100%;
  height: 100%;
  min-height: 380px;
}

.cs-viz--hazard { padding-top: 0; }
.cs-hazard-edge {
  height: 11px;
  margin: 0 -22px 18px;
  background: repeating-linear-gradient(-45deg, var(--accent-hot) 0 7px, #000 7px 14px);
  border-bottom: 1px solid var(--border);
}
.cs-constraint {
  display: grid;
  grid-template-columns: minmax(0, 1.3fr) minmax(180px, 0.7fr);
  gap: 12px;
  margin-bottom: 12px;
}
.cs-warn-copy {
  font-family: var(--font-body);
  font-size: clamp(18px, 2.2vw, 24px);
  line-height: 1.35;
  color: var(--text);
  padding: 18px 18px 20px;
}
.cs-meter {
  display: flex;
  flex-direction: column;
  justify-content: space-between;
}
.cs-meter-num {
  font-family: var(--font-display);
  font-size: clamp(56px, 7vw, 84px);
  font-weight: 700;
  letter-spacing: -0.07em;
  line-height: 0.85;
  color: var(--accent-hot);
  padding: 16px 16px 0;
}
.cs-meter-unit {
  font-family: var(--font-mono);
  font-size: 11px;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  color: var(--text2);
  padding: 8px 16px 0;
}
.cs-meter-list {
  list-style: none;
  margin: 14px 0 0;
  padding: 12px 16px 16px;
  border-top: 1px solid var(--border-dim);
  font-family: var(--font-mono);
  font-size: 10px;
  letter-spacing: 0.06em;
  text-transform: uppercase;
  color: var(--text2);
  display: flex;
  flex-direction: column;
  gap: 6px;
}
.cs-meter-list .is-hot { color: var(--accent-hot); }
.cs-phrase-panel { border: 1px solid var(--border); background: var(--bg); }
.cs-phrase-panel .cs-err-chrome { margin-bottom: 0; }
.cs-phrase-grid {
  display: grid;
  grid-template-columns: repeat(50, minmax(0, 1fr));
  gap: 2px;
  padding: 14px;
}
.cs-phrase-grid b,
.cs-phrase-grid i {
  display: block;
  aspect-ratio: 1;
  border: 1px solid var(--border-dim);
  min-height: 6px;
  font-weight: normal;
  font-style: normal;
}
.cs-phrase-grid b {
  background: var(--text);
  border-color: var(--text);
}
.cs-phrase-legend {
  display: flex;
  justify-content: space-between;
  gap: 12px;
  padding: 0 14px 14px;
  font-family: var(--font-mono);
  font-size: 10px;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  color: var(--text2);
}
.cs-phrase-legend .is-hot { color: var(--accent-hot); }
.cs-hazard-banner {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 12px;
  margin-top: 12px;
  padding: 10px 14px;
  border: 1px solid var(--border);
  background: repeating-linear-gradient(-45deg, rgba(184,20,20,0.22) 0 8px, #000 8px 16px);
  font-family: var(--font-mono);
  font-size: 10px;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  color: var(--text);
}
.cs-hazard-banner .is-hot { color: var(--accent-hot); }

.cs-patch {
  display: grid;
  grid-template-columns: minmax(200px, 0.9fr) minmax(0, 1.1fr);
  gap: 12px;
}
.cs-patch-chart {
  display: grid;
  grid-template-columns: 1fr auto 1fr;
  align-items: end;
  gap: 10px;
  min-height: 240px;
  padding: 18px 16px 14px;
  border: 1px solid var(--border);
  background: var(--bg);
}
.cs-patch-col {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: flex-end;
  gap: 8px;
  height: 100%;
}
.cs-patch-pct {
  font-family: var(--font-display);
  font-size: clamp(28px, 4vw, 40px);
  font-weight: 700;
  letter-spacing: -0.05em;
  line-height: 1;
}
.cs-patch-pct.is-before { color: var(--accent-hot); }
.cs-patch-pct.is-after { color: var(--text); }
.cs-patch-bar {
  width: min(72px, 100%);
  border: 1px solid var(--border);
}
.cs-patch-bar.is-before {
  height: 72%;
  background: repeating-linear-gradient(-45deg, var(--accent-hot) 0 5px, #3a0808 5px 10px);
  border-color: var(--accent-hot);
}
.cs-patch-bar.is-after {
  height: 51%;
  background: repeating-linear-gradient(-45deg, var(--text) 0 5px, #000 5px 10px);
}
.cs-patch-axis {
  font-family: var(--font-mono);
  font-size: 10px;
  letter-spacing: 0.1em;
  text-transform: uppercase;
  color: var(--text3);
}
.cs-patch-delta {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 4px;
  padding-bottom: 28%;
  font-family: var(--font-mono);
  font-size: 10px;
  letter-spacing: 0.1em;
  text-transform: uppercase;
  color: var(--text2);
  text-align: center;
}
.cs-patch-delta strong {
  font-family: var(--font-display);
  font-size: 28px;
  font-weight: 700;
  letter-spacing: -0.04em;
  color: var(--text);
}
.cs-patch-copy {
  font-family: var(--font-body);
  font-size: 16px;
  line-height: 1.45;
  color: var(--text);
  padding: 16px 16px 18px;
}
.cs-patch-rows {
  list-style: none;
  margin: 0;
  padding: 0;
  border: 1px solid var(--border);
  background: var(--bg);
}
.cs-patch-rows li {
  display: flex;
  align-items: baseline;
  gap: 10px;
  padding: 10px 14px;
  border-bottom: 1px solid var(--border-dim);
  font-family: var(--font-mono);
  font-size: 10px;
  letter-spacing: 0.06em;
  text-transform: uppercase;
  color: var(--text2);
}
.cs-patch-rows li:last-child { border-bottom: none; }
.cs-patch-rows .k {
  flex: 1;
  display: flex;
  align-items: baseline;
  gap: 8px;
}
.cs-patch-rows .k::after {
  content: '';
  flex: 1;
  border-bottom: 1px dotted var(--border-dim);
  transform: translateY(-4px);
}
.cs-patch-rows .v { color: var(--text); }
.cs-patch-rows .v.is-hot { color: var(--accent-hot); }

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
  .cs-err-grid { grid-template-columns: 1fr; }
  .cs-err:nth-child(2),
  .cs-err:nth-child(5) { margin-top: 0; }
  .cs-leak { grid-template-columns: 1fr; }
  .cs-leak-stat {
    border-left: none;
    border-top: 1px solid var(--border);
    flex-direction: row;
    align-items: baseline;
    gap: 12px;
  }
  .cs-void { grid-template-columns: 1fr; }
  .cs-void-funnel { min-height: 280px; }
  .cs-constraint { grid-template-columns: 1fr; }
  .cs-phrase-grid { grid-template-columns: repeat(25, minmax(0, 1fr)); }
  .cs-patch { grid-template-columns: 1fr; }
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

<nav id="nav">
  <a href="/" class="nav-logo">
    <span>Lola/</span>
    <span>Ogundipe</span>
  </a>
  <div class="nav-links">
    <a href="/" class="nav-link">Home</a>
    <a href="/#work" class="nav-link is-active">&lt; Work &gt;</a>
    <a href="/#about" class="nav-link">About</a>
    <a href="/#skills" class="nav-link">Tools</a>
  </div>
  <a href="/#contact" class="nav-cta">Contact</a>
</nav>

<!-- PAGE HEADER -->
<header class="cs-page-header cs-wide-copy">
  <a href="/#work" class="cs-back-link">← Back to work</a>
  <div class="cs-eyebrow">Case study 01 · Google · Accessibility</div>
  <h1 class="cs-page-title">Project Relate<br>Onboarding</h1>
  <p class="cs-page-sub">Redesigning the first-run experience of a machine-learning communication app for users with atypical speech — closing a 27% abandonment cliff that no one had named.</p>
  <div class="cs-hero-image">
    <img src="https://framerusercontent.com/images/KssTUJ0rabZKVZQ9BUWcUfpr2eQ.jpg" alt="Project Relate hero">
  </div>
</header>

<!-- CASE STUDY BODY -->
<section class="cs-page cs-wide-copy">
  <div class="cs-grid">

    <aside class="cs-sticky">
      <div class="cs-title reveal">At a glance</div>
      <div class="cs-meta-strip reveal">
        <div class="cs-meta-row"><span class="label">Role</span><span class="value">Product Designer</span></div>
        <div class="cs-meta-row"><span class="label">Timeline</span><span class="value">Oct–Aug 2023</span></div>
        <div class="cs-meta-row"><span class="label">Tools</span><span class="value">Figma · FigJam</span></div>
        <div class="cs-meta-row"><span class="label">Platform</span><span class="value">Android · Mobile</span></div>
        <div class="cs-meta-row"><span class="label">Methods</span><span class="value">Research · Heuristics · UJ</span></div>
      </div>
      <div class="cs-impact-callout reveal">
        <strong>27%</strong>
        Drop-off between "started app" and "recorded something" — the cliff I was hired to fix.
      </div>
      <div class="cs-impact-callout reveal" style="margin-top:12px; border-color: rgba(94,122,106,0.3); background: rgba(94,122,106,0.08); color: #5e7a6a;">
        <strong>↗ I/O</strong>
        Featured in the Accessibility segment of Google I/O, May 2024.
      </div>
    </aside>

    <div class="cs-sections">

      <div class="cs-section">
        <div class="cs-section-num">01 — About the app</div>
        <div class="cs-section-title">Why people use Project Relate</div>
        <div class="cs-section-body">
          People with atypical speech face real barriers: being misunderstood, struggling with voice recognition, and relying on caregivers to speak for them. <strong>Project Relate</strong> is a machine-learning app that helps them communicate independently — including with Google Assistant.
        </div>
        <div class="cs-media cs-media--device cs-media--cutout">
          <img src="images/relate-onboarding-phonecase.webp" alt="Project Relate recording interface" loading="lazy">
        </div>
      </div>

      <div class="cs-section">
        <div class="cs-section-num">02 — Problem framing</div>
        <div class="cs-section-title">An engineer-driven beta without the “why”</div>
        <div class="cs-section-body">
          Relate shipped without strong UX support. Users had to record <strong>500 voice samples</strong> before the app paid off — with little explanation of the benefit. Abandonment and weak product-value understanding blocked engagement.
        </div>
        <div class="pull-quote">Imagine having to record 500 voice samples without understanding what you get at the end.</div>

<div class="cs-viz cs-viz--hazard" aria-label="Training quota constraint">
          <div class="cs-hazard-edge" aria-hidden="true"></div>
          <div class="cs-viz-top">
            <span>PROJECT_RELATE // CONSTRAINT.LOG</span>
            <span class="cs-viz-sev">CRITICAL · ACCESS BLOCKED</span>
          </div>
          <div class="cs-viz-title">Constraint<span class="cs-viz-cursor" aria-hidden="true"></span></div>
          <div class="cs-viz-sub">&gt; gate detected before value delivery</div>
          <div class="cs-constraint">
            <article class="cs-err">
              <div class="cs-err-chrome">
                <span>WARN_01 / TRAINING QUOTA</span>
                <span class="window-controls">— □ ×</span>
              </div>
              <p class="cs-warn-copy">Users must train <span class="cs-err-hl">500 phrases</span> before getting access to their speech model.</p>
            </article>
            <article class="cs-err cs-meter">
              <div class="cs-err-chrome">
                <span>QUOTA_METER</span>
                <span class="window-controls">— □ ×</span>
              </div>
              <div class="cs-meter-num">500</div>
              <div class="cs-meter-unit">Phrases required</div>
              <ul class="cs-meter-list">
                <li>Reward unlocks at 100%</li>
                <li>Partial credit · none</li>
                <li class="is-hot">Model state [ locked ]</li>
              </ul>
            </article>
          </div>
          <div class="cs-phrase-panel">
            <div class="cs-err-chrome">
              <span>PHRASE_BUFFER · 060 / 500</span>
              <span class="window-controls">— □ ×</span>
            </div>
            <div class="cs-phrase-grid" aria-hidden="true"><b></b><b></b><b></b><b></b><b></b><b></b><b></b><b></b><b></b><b></b><b></b><b></b><b></b><b></b><b></b><b></b><b></b><b></b><b></b><b></b><b></b><b></b><b></b><b></b><b></b><b></b><b></b><b></b><b></b><b></b><b></b><b></b><b></b><b></b><b></b><b></b><b></b><b></b><b></b><b></b><b></b><b></b><b></b><b></b><b></b><b></b><b></b><b></b><b></b><b></b><b></b><b></b><b></b><b></b><b></b><b></b><b></b><b></b><b></b><b></b><i></i><i></i><i></i><i></i><i></i><i></i><i></i><i></i><i></i><i></i><i></i><i></i><i></i><i></i><i></i><i></i><i></i><i></i><i></i><i></i><i></i><i></i><i></i><i></i><i></i><i></i><i></i><i></i><i></i><i></i><i></i><i></i><i></i><i></i><i></i><i></i><i></i><i></i><i></i><i></i><i></i><i></i><i></i><i></i><i></i><i></i><i></i><i></i><i></i><i></i><i></i><i></i><i></i><i></i><i></i><i></i><i></i><i></i><i></i><i></i><i></i><i></i><i></i><i></i><i></i><i></i><i></i><i></i><i></i><i></i><i></i><i></i><i></i><i></i><i></i><i></i><i></i><i></i><i></i><i></i><i></i><i></i><i></i><i></i><i></i><i></i><i></i><i></i><i></i><i></i><i></i><i></i><i></i><i></i><i></i><i></i><i></i><i></i><i></i><i></i><i></i><i></i><i></i><i></i><i></i><i></i><i></i><i></i><i></i><i></i><i></i><i></i><i></i><i></i><i></i><i></i><i></i><i></i><i></i><i></i><i></i><i></i><i></i><i></i><i></i><i></i><i></i><i></i><i></i><i></i><i></i><i></i><i></i><i></i><i></i><i></i><i></i><i></i><i></i><i></i><i></i><i></i><i></i><i></i><i></i><i></i><i></i><i></i><i></i><i></i><i></i><i></i><i></i><i></i><i></i><i></i><i></i><i></i><i></i><i></i><i></i><i></i><i></i><i></i><i></i><i></i><i></i><i></i><i></i><i></i><i></i><i></i><i></i><i></i><i></i><i></i><i></i><i></i><i></i><i></i><i></i><i></i><i></i><i></i><i></i><i></i><i></i><i></i><i></i><i></i><i></i><i></i><i></i><i></i><i></i><i></i><i></i><i></i><i></i><i></i><i></i><i></i><i></i><i></i><i></i><i></i><i></i><i></i><i></i><i></i><i></i><i></i><i></i><i></i><i></i><i></i><i></i><i></i><i></i><i></i><i></i><i></i><i></i><i></i><i></i><i></i><i></i><i></i><i></i><i></i><i></i><i></i><i></i><i></i><i></i><i></i><i></i><i></i><i></i><i></i><i></i><i></i><i></i><i></i><i></i><i></i><i></i><i></i><i></i><i></i><i></i><i></i><i></i><i></i><i></i><i></i><i></i><i></i><i></i><i></i><i></i><i></i><i></i><i></i><i></i><i></i><i></i><i></i><i></i><i></i><i></i><i></i><i></i><i></i><i></i><i></i><i></i><i></i><i></i><i></i><i></i><i></i><i></i><i></i><i></i><i></i><i></i><i></i><i></i><i></i><i></i><i></i><i></i><i></i><i></i><i></i><i></i><i></i><i></i><i></i><i></i><i></i><i></i><i></i><i></i><i></i><i></i><i></i><i></i><i></i><i></i><i></i><i></i><i></i><i></i><i></i><i></i><i></i><i></i><i></i><i></i><i></i><i></i><i></i><i></i><i></i><i></i><i></i><i></i><i></i><i></i><i></i><i></i><i></i><i></i><i></i><i></i><i></i><i></i><i></i><i></i><i></i><i></i><i></i><i></i><i></i><i></i><i></i><i></i><i></i><i></i><i></i><i></i><i></i><i></i><i></i><i></i><i></i><i></i><i></i><i></i><i></i><i></i><i></i><i></i><i></i><i></i><i></i><i></i><i></i><i></i><i></i><i></i><i></i><i></i><i></i><i></i><i></i><i></i><i></i><i></i><i></i><i></i><i></i><i></i><i></i><i></i><i></i><i></i><i></i><i></i><i></i><i></i><i></i><i></i><i></i><i></i><i></i><i></i><i></i><i></i><i></i><i></i><i></i><i></i><i></i><i></i><i></i><i></i><i></i><i></i><i></i><i></i><i></i><i></i><i></i><i></i><i></i><i></i><i></i><i></i><i></i><i></i><i></i><i></i><i></i><i></i><i></i><i></i><i></i><i></i><i></i><i></i><i></i><i></i><i></i><i></i><i></i><i></i><i></i></div>
            <div class="cs-phrase-legend">
              <span>Typical user records ~60</span>
              <span class="is-hot">440 never recorded</span>
            </div>
          </div>
          <div class="cs-hazard-banner">
            <span>Warning · 500-phrase wall before any payoff</span>
            <span class="is-hot">Expected completion: 3%</span>
          </div>
          <div class="cs-viz-foot">
            <span>CONSTRAINT_LOG_V1 · 2026</span>
            <span class="cs-viz-actions">[ IGNORE ] [ SOLVE ]</span>
          </div>
        </div>
        <div class="cs-section-body" style="margin-top:20px;">
          <strong>How might we</strong> improve usability and make the product’s value obvious from the first session?
        </div>
      </div>

      <div class="cs-section">
        <div class="cs-section-num">03 — Workstream</div>
        <div class="cs-section-title">Understanding the speech experience</div>
        <div class="cs-section-body">
          Heuristic evaluation and speech-workstream review made one thing clear: users with the strongest speech difficulties often carry other challenges too. Missing UX support left them guessing.
        </div>
        <div class="cs-media">
          <img src="https://framerusercontent.com/images/hwVCLOm3QkN0vwo4vpp5qZ5sLo.png" alt="Heuristic evaluation of Project Relate" loading="lazy">
          <div class="cs-media-caption">Heuristic evaluation — surfacing usability gaps in the speech workstream.</div>
        </div>
      </div>

      <div class="cs-section">
        <div class="cs-section-num">04 — Alignment</div>
        <div class="cs-section-title">User journey workshop</div>
        <div class="cs-section-body">
          I led a brainstorming journey workshop with the impairment-specific group to unlock needs and align the team on direction before designing solutions.
        </div>
        <div class="cs-media">
          <img src="https://framerusercontent.com/images/9DmPqS6lM6VL7IX4cKMzothDpo.jpg" alt="User journey workshop artifacts" loading="lazy">
          <div class="cs-media-caption">Workshop artifacts — mapping intent, friction, and abandonment moments.</div>
        </div>
      </div>

      <div class="cs-section">
        <div class="cs-section-num">05 — Audit & research</div>
        <div class="cs-section-title">Finding the real friction</div>
        <div class="cs-section-body">
          A product audit flagged key improvement areas. A deeper SLP research review — plus collaboration with SLPs and UXRs — confirmed users were confused about features and personalization, not just “unmotivated.”
        </div>
        <div class="cs-media-grid">
          <div class="cs-media">
            <img src="https://framerusercontent.com/images/OCwxvDEaS5HyBbG0n9Wf8W8r5SM.png" alt="Usability pain points from product audit" loading="lazy">
            <div class="cs-media-caption">Product audit — key usability fails</div>
          </div>
          <div class="cs-media">
            <img src="https://framerusercontent.com/images/q1KBrp1mNMiWbQ4OYewt5NxDbJg.png" alt="User feedback quotes from research" loading="lazy">
            <div class="cs-media-caption">SLP / user feedback synthesis</div>
          </div>
        </div>
      </div>

      <div class="cs-section">
        <div class="cs-section-num">06 — The cliff</div>
        <div class="cs-section-title">Users were confused — and we were losing them</div>
        <div class="cs-section-body">
          Funnel data showed the sharpest drop between starting the app and recording something. That cliff became the design problem to solve.
        </div>
        <div class="cs-viz-stack">
          <div class="cs-viz" aria-label="User feedback log">
            <div class="cs-viz-top">
              <span>PROJECT_RELATE // USER_FEEDBACK.LOG</span>
              <span class="cs-viz-sev">SEV: HIGH · 04 ENTRIES</span>
            </div>
            <div class="cs-viz-title">Problems<span class="cs-viz-cursor" aria-hidden="true"></span></div>
            <div class="cs-viz-sub">&gt; unresolved · awaiting triage</div>
            <div class="cs-err-grid">
              <article class="cs-err">
                <div class="cs-err-chrome">
                  <span>ERR_01 / CLARITY</span>
                  <span class="window-controls">— □ ×</span>
                </div>
                <p class="cs-err-quote">“It’s a <span class="cs-err-hl">bit unclear</span> what I get after all this work.”</p>
              </article>
              <article class="cs-err is-featured">
                <div class="cs-err-chrome">
                  <span>ERR_02 / CONTROLS</span>
                  <span class="window-controls">— □ ×</span>
                </div>
                <p class="cs-err-quote">“The start and stop button is a bit <span class="cs-err-hl">confusing</span>. I thought I could just keep talking.”</p>
                <div class="cs-err-actions">
                  <span class="cs-err-btn is-ghost">Ignore</span>
                  <span class="cs-err-btn is-solid">Solve</span>
                </div>
              </article>
              <article class="cs-err">
                <div class="cs-err-chrome">
                  <span>ERR_03 / EXPECTATIONS</span>
                  <span class="window-controls">— □ ×</span>
                </div>
                <p class="cs-err-quote">“<span class="cs-err-hl">If I knew</span> I had to record 500 to get the feature, I <span class="cs-err-hl">would have done</span> it in one sitting.”</p>
              </article>
              <article class="cs-err">
                <div class="cs-err-chrome">
                  <span>ERR_04 / ONBOARDING</span>
                  <span class="window-controls">— □ ×</span>
                </div>
                <p class="cs-err-quote">“There were <span class="cs-err-hl">no instructions</span> how to use the app after signing up.”</p>
              </article>
            </div>
            <div class="cs-viz-foot">
              <span>USABILITY_REVIEW_V1 · 2026</span>
              <span class="cs-viz-actions">[ IGNORE ] [ SOLVE ]</span>
            </div>
          </div>

          <div class="cs-viz" aria-label="Funnel drop-off">
            <div class="cs-viz-top">
              <span>PROJECT_RELATE // FUNNEL_TRACE.LOG</span>
              <span class="cs-viz-sev">LEAK DETECTED · 02 STAGES</span>
            </div>
            <div class="cs-viz-title">Drop-off<span class="cs-viz-cursor" aria-hidden="true"></span></div>
            <div class="cs-viz-sub">&gt; where users vanish</div>
            <div class="cs-leak-list">
              <article class="cs-leak">
                <div class="cs-leak-main">
                  <div class="cs-err-chrome">
                    <span>LEAK_01 / ACTIVATION</span>
                    <span class="window-controls">— □ ×</span>
                  </div>
                  <p class="cs-leak-copy">Started the app → recording something</p>
                  <div class="cs-leak-bar" aria-hidden="true">
                    <div class="cs-leak-seg is-continue" style="flex: 73"></div>
                    <div class="cs-leak-seg is-lost" style="flex: 27"></div>
                  </div>
                  <div class="cs-leak-legend">
                    <span>73% continue</span>
                    <span class="is-lost">27% lost</span>
                  </div>
                </div>
                <div class="cs-leak-stat">
                  <div class="cs-leak-num">▾27%</div>
                  <div class="cs-leak-label">Decrease in users</div>
                </div>
              </article>
              <article class="cs-leak">
                <div class="cs-leak-main">
                  <div class="cs-err-chrome">
                    <span>LEAK_02 / PERSONALIZATION</span>
                    <span class="window-controls">— □ ×</span>
                  </div>
                  <p class="cs-leak-copy">Recorded something → enough for a personalized model</p>
                  <div class="cs-leak-bar" aria-hidden="true">
                    <div class="cs-leak-seg is-continue" style="flex: 84"></div>
                    <div class="cs-leak-seg is-lost" style="flex: 16"></div>
                  </div>
                  <div class="cs-leak-legend">
                    <span>84% continue</span>
                    <span class="is-lost">16% lost</span>
                  </div>
                </div>
                <div class="cs-leak-stat">
                  <div class="cs-leak-num">▾16%</div>
                  <div class="cs-leak-label">Decrease in users</div>
                </div>
              </article>
            </div>
            <div class="cs-viz-foot">
              <span>FUNNEL_TRACE_V1 · 2026</span>
              <span class="cs-viz-actions">[ IGNORE ] [ SOLVE ]</span>
            </div>
          </div>

          <div class="cs-viz" aria-label="Research funnel">
            <div class="cs-viz-top">
              <span>PROJECT_RELATE // RESEARCH_FUNNEL.TRACE</span>
              <span class="cs-viz-sev">EXIT VELOCITY: 97% · 07 GATES</span>
            </div>
            <div class="cs-viz-title">The Void<span class="cs-viz-cursor" aria-hidden="true"></span></div>
            <div class="cs-viz-sub">&gt; 100 enter the funnel · 3 come out</div>
            <div class="cs-void">
              <ol class="cs-void-gates">
                <li class="cs-void-gate">
                  <span class="cs-void-mark" aria-hidden="true"></span>
                  <div class="cs-void-gate-copy">
                    <div class="cs-void-gate-title">Completed interest form</div>
                    <div class="cs-void-gate-meta">GATE_01 · Baseline</div>
                  </div>
                  <span class="cs-void-gate-pct">100%</span>
                </li>
                <li class="cs-void-gate">
                  <span class="cs-void-mark" aria-hidden="true"></span>
                  <div class="cs-void-gate-copy">
                    <div class="cs-void-gate-title">Invited to app</div>
                    <div class="cs-void-gate-meta">GATE_02 · ▾ 21 PTS</div>
                  </div>
                  <span class="cs-void-gate-pct">79%</span>
                </li>
                <li class="cs-void-gate is-critical">
                  <span class="cs-void-mark" aria-hidden="true"></span>
                  <div class="cs-void-gate-copy">
                    <div class="cs-void-gate-title">Started app</div>
                    <div class="cs-void-gate-meta">GATE_03 · ▾ 59 PTS · <span class="is-hot">Critical</span></div>
                  </div>
                  <span class="cs-void-gate-pct">20%</span>
                </li>
                <li class="cs-void-gate">
                  <span class="cs-void-mark" aria-hidden="true"></span>
                  <div class="cs-void-gate-copy">
                    <div class="cs-void-gate-title">Recorded something</div>
                    <div class="cs-void-gate-meta">GATE_04 · ▾ 3 PTS</div>
                  </div>
                  <span class="cs-void-gate-pct">17%</span>
                </li>
                <li class="cs-void-gate">
                  <span class="cs-void-mark" aria-hidden="true"></span>
                  <div class="cs-void-gate-copy">
                    <div class="cs-void-gate-title">Recorded enough for personalized model</div>
                    <div class="cs-void-gate-meta">GATE_05 · ▾ 8 PTS</div>
                  </div>
                  <span class="cs-void-gate-pct">9%</span>
                </li>
                <li class="cs-void-gate">
                  <span class="cs-void-mark" aria-hidden="true"></span>
                  <div class="cs-void-gate-copy">
                    <div class="cs-void-gate-title">Used their model</div>
                    <div class="cs-void-gate-meta">GATE_06 · ▾ 2 PTS</div>
                  </div>
                  <span class="cs-void-gate-pct">7%</span>
                </li>
                <li class="cs-void-gate is-void">
                  <span class="cs-void-mark" aria-hidden="true"></span>
                  <div class="cs-void-gate-copy">
                    <div class="cs-void-gate-title">30-day active users</div>
                    <div class="cs-void-gate-meta">GATE_07 · ▾ 4 PTS</div>
                  </div>
                  <span class="cs-void-gate-pct">3%</span>
                </li>
              </ol>
              <div class="cs-void-funnel" aria-hidden="true">
                <svg viewBox="0 0 280 440" preserveAspectRatio="xMidYMid meet" fill="none">
                <path d="M 30.98 29.81 C 31.77 32.16 34.14 39.20 35.72 43.89 C 37.31 48.59 38.89 53.28 40.47 57.98 C 42.05 62.67 43.63 67.37 45.21 72.07 C 46.79 76.76 48.42 81.46 49.95 86.15 C 51.48 90.84 51.39 95.35 54.38 100.20 C 57.37 105.05 62.39 110.13 67.87 115.27 C 73.35 120.40 81.14 125.79 87.28 130.99 C 93.42 136.20 100.55 141.51 104.72 146.50 C 108.88 151.48 110.91 156.23 112.28 160.90 C 113.66 165.57 112.74 169.99 112.96 174.53 C 113.19 179.08 113.41 183.62 113.64 188.16 C 113.86 192.71 114.09 197.25 114.32 201.79 C 114.54 206.34 114.67 210.87 114.99 215.43 C 115.31 219.98 115.73 224.54 116.24 229.12 C 116.74 233.70 117.44 238.29 118.04 242.88 C 118.64 247.46 119.25 252.05 119.85 256.64 C 120.45 261.22 121.05 265.81 121.66 270.39 C 122.26 274.98 123.09 279.59 123.46 284.15 C 123.84 288.71 123.76 293.22 123.91 297.76 C 124.06 302.29 124.22 306.83 124.37 311.36 C 124.52 315.90 124.67 320.43 124.82 324.97 C 124.97 329.50 125.08 334.04 125.27 338.57 C 125.46 343.11 125.68 347.66 125.95 352.21 C 126.21 356.75 126.55 361.31 126.85 365.86 C 127.15 370.41 127.45 374.97 127.75 379.52 C 128.05 384.07 128.36 388.63 128.66 393.18 C 128.96 397.72 129.41 404.51 129.56 406.78" stroke="#fff" stroke-width="0.5" stroke-opacity="0.14"/>
                <path d="M 56.56 19.47 C 57.17 21.89 58.98 29.16 60.19 34.01 C 61.40 38.85 62.61 43.70 63.82 48.54 C 65.03 53.39 66.24 58.23 67.45 63.08 C 68.66 67.92 69.91 72.78 71.08 77.61 C 72.25 82.45 72.18 86.95 74.47 92.08 C 76.75 97.22 80.60 102.78 84.79 108.43 C 88.99 114.08 94.95 120.21 99.65 125.99 C 104.35 131.78 109.81 137.77 113.00 143.15 C 116.18 148.53 117.74 153.47 118.79 158.27 C 119.84 163.07 119.13 167.40 119.31 171.97 C 119.48 176.53 119.65 181.10 119.82 185.66 C 120.00 190.23 120.17 194.79 120.34 199.36 C 120.52 203.92 120.62 208.47 120.86 213.05 C 121.11 217.64 121.42 222.24 121.81 226.87 C 122.20 231.49 122.73 236.15 123.19 240.80 C 123.66 245.44 124.12 250.08 124.58 254.72 C 125.04 259.37 125.50 264.01 125.96 268.65 C 126.42 273.30 127.05 277.99 127.34 282.58 C 127.63 287.18 127.57 291.68 127.69 296.23 C 127.80 300.78 127.92 305.33 128.03 309.88 C 128.15 314.43 128.26 318.98 128.38 323.53 C 128.50 328.08 128.58 332.62 128.73 337.18 C 128.87 341.74 129.04 346.30 129.24 350.87 C 129.45 355.45 129.71 360.04 129.94 364.62 C 130.17 369.20 130.40 373.78 130.63 378.36 C 130.86 382.94 131.09 387.54 131.32 392.10 C 131.55 396.66 131.89 403.46 132.01 405.74" stroke="#fff" stroke-width="0.5" stroke-opacity="0.14"/>
                <path d="M 94.84 12.57 C 95.17 15.04 96.15 22.46 96.81 27.40 C 97.46 32.35 98.12 37.29 98.77 42.24 C 99.43 47.18 100.08 52.13 100.74 57.07 C 101.39 62.02 102.07 66.98 102.70 71.91 C 103.33 76.84 103.30 81.34 104.54 86.66 C 105.77 91.99 107.85 97.86 110.12 103.86 C 112.39 109.86 115.62 116.48 118.16 122.65 C 120.71 128.83 123.66 135.27 125.39 140.92 C 127.11 146.56 127.95 151.63 128.52 156.52 C 129.09 161.41 128.71 165.68 128.80 170.26 C 128.89 174.83 128.99 179.41 129.08 183.99 C 129.17 188.57 129.27 193.15 129.36 197.73 C 129.45 202.31 129.51 206.87 129.64 211.47 C 129.77 216.08 129.95 220.71 130.16 225.36 C 130.37 230.02 130.66 234.72 130.90 239.40 C 131.15 244.09 131.40 248.77 131.65 253.45 C 131.90 258.13 132.15 262.81 132.40 267.49 C 132.65 272.17 132.99 276.91 133.15 281.53 C 133.31 286.16 133.27 290.65 133.34 295.21 C 133.40 299.77 133.46 304.33 133.52 308.89 C 133.59 313.45 133.65 318.01 133.71 322.57 C 133.77 327.13 133.82 331.68 133.90 336.24 C 133.98 340.81 134.07 345.39 134.18 349.98 C 134.29 354.57 134.43 359.18 134.55 363.78 C 134.68 368.38 134.80 372.98 134.93 377.58 C 135.05 382.18 135.18 386.80 135.30 391.38 C 135.43 395.96 135.61 402.77 135.68 405.04" stroke="#fff" stroke-width="0.5" stroke-opacity="0.14"/>
                <path d="M 140.00 10.14 C 140.00 12.63 140.00 20.10 140.00 25.08 C 140.00 30.06 140.00 35.04 140.00 40.02 C 140.00 45.00 140.00 49.98 140.00 54.96 C 140.00 59.95 140.00 64.94 140.00 69.91 C 140.00 74.87 140.00 79.36 140.00 84.76 C 140.00 90.15 140.00 96.13 140.00 102.25 C 140.00 108.37 140.00 115.17 140.00 121.48 C 140.00 127.79 140.00 134.40 140.00 140.13 C 140.00 145.87 140.00 150.98 140.00 155.90 C 140.00 160.82 140.00 165.07 140.00 169.65 C 140.00 174.24 140.00 178.82 140.00 183.41 C 140.00 187.99 140.00 192.58 140.00 197.16 C 140.00 201.75 140.00 206.30 140.00 210.91 C 140.00 215.53 140.00 220.17 140.00 224.83 C 140.00 229.50 140.00 234.22 140.00 238.92 C 140.00 243.61 140.00 248.31 140.00 253.00 C 140.00 257.69 140.00 262.39 140.00 267.08 C 140.00 271.78 140.00 276.54 140.00 281.17 C 140.00 285.80 140.00 290.29 140.00 294.85 C 140.00 299.42 140.00 303.98 140.00 308.54 C 140.00 313.10 140.00 317.67 140.00 322.23 C 140.00 326.79 140.00 331.34 140.00 335.92 C 140.00 340.49 140.00 345.08 140.00 349.67 C 140.00 354.27 140.00 358.88 140.00 363.49 C 140.00 368.10 140.00 372.70 140.00 377.31 C 140.00 381.92 140.00 386.55 140.00 391.13 C 140.00 395.71 140.00 402.52 140.00 404.80" stroke="#fff" stroke-width="0.5" stroke-opacity="0.14"/>
                <path d="M 185.16 12.57 C 184.83 15.04 183.85 22.46 183.19 27.40 C 182.54 32.35 181.88 37.29 181.23 42.24 C 180.57 47.18 179.92 52.13 179.26 57.07 C 178.61 62.02 177.93 66.98 177.30 71.91 C 176.67 76.84 176.70 81.34 175.46 86.66 C 174.23 91.99 172.15 97.86 169.88 103.86 C 167.61 109.86 164.38 116.48 161.84 122.65 C 159.29 128.83 156.34 135.27 154.61 140.92 C 152.89 146.56 152.05 151.63 151.48 156.52 C 150.91 161.41 151.29 165.68 151.20 170.26 C 151.11 174.83 151.01 179.41 150.92 183.99 C 150.83 188.57 150.73 193.15 150.64 197.73 C 150.55 202.31 150.49 206.87 150.36 211.47 C 150.23 216.08 150.05 220.71 149.84 225.36 C 149.63 230.02 149.34 234.72 149.10 239.40 C 148.85 244.09 148.60 248.77 148.35 253.45 C 148.10 258.13 147.85 262.81 147.60 267.49 C 147.35 272.17 147.01 276.91 146.85 281.53 C 146.69 286.16 146.73 290.65 146.66 295.21 C 146.60 299.77 146.54 304.33 146.48 308.89 C 146.41 313.45 146.35 318.01 146.29 322.57 C 146.23 327.13 146.18 331.68 146.10 336.24 C 146.02 340.81 145.93 345.39 145.82 349.98 C 145.71 354.57 145.57 359.18 145.45 363.78 C 145.32 368.38 145.20 372.98 145.07 377.58 C 144.95 382.18 144.82 386.80 144.70 391.38 C 144.57 395.96 144.39 402.77 144.32 405.04" stroke="#fff" stroke-width="0.5" stroke-opacity="0.14"/>
                <path d="M 223.44 19.47 C 222.83 21.89 221.02 29.16 219.81 34.01 C 218.60 38.85 217.39 43.70 216.18 48.54 C 214.97 53.39 213.76 58.23 212.55 63.08 C 211.34 67.92 210.09 72.78 208.92 77.61 C 207.75 82.45 207.82 86.95 205.53 92.08 C 203.25 97.22 199.40 102.78 195.21 108.43 C 191.01 114.08 185.05 120.21 180.35 125.99 C 175.65 131.78 170.19 137.77 167.00 143.15 C 163.82 148.53 162.26 153.47 161.21 158.27 C 160.16 163.07 160.87 167.40 160.69 171.97 C 160.52 176.53 160.35 181.10 160.18 185.66 C 160.00 190.23 159.83 194.79 159.66 199.36 C 159.48 203.92 159.38 208.47 159.14 213.05 C 158.89 217.64 158.58 222.24 158.19 226.87 C 157.80 231.49 157.27 236.15 156.81 240.80 C 156.34 245.44 155.88 250.08 155.42 254.72 C 154.96 259.37 154.50 264.01 154.04 268.65 C 153.58 273.30 152.95 277.99 152.66 282.58 C 152.37 287.18 152.43 291.68 152.31 296.23 C 152.20 300.78 152.08 305.33 151.97 309.88 C 151.85 314.43 151.74 318.98 151.62 323.53 C 151.50 328.08 151.42 332.62 151.27 337.18 C 151.13 341.74 150.96 346.30 150.76 350.87 C 150.55 355.45 150.29 360.04 150.06 364.62 C 149.83 369.20 149.60 373.78 149.37 378.36 C 149.14 382.94 148.91 387.54 148.68 392.10 C 148.45 396.66 148.11 403.46 147.99 405.74" stroke="#fff" stroke-width="0.5" stroke-opacity="0.14"/>
                <path d="M 249.02 29.81 C 248.23 32.16 245.86 39.20 244.28 43.89 C 242.69 48.59 241.11 53.28 239.53 57.98 C 237.95 62.67 236.37 67.37 234.79 72.07 C 233.21 76.76 231.58 81.46 230.05 86.15 C 228.52 90.84 228.61 95.35 225.62 100.20 C 222.63 105.05 217.61 110.13 212.13 115.27 C 206.65 120.40 198.86 125.79 192.72 130.99 C 186.58 136.20 179.45 141.51 175.28 146.50 C 171.12 151.48 169.09 156.23 167.72 160.90 C 166.34 165.57 167.26 169.99 167.04 174.53 C 166.81 179.08 166.59 183.62 166.36 188.16 C 166.14 192.71 165.91 197.25 165.68 201.79 C 165.46 206.34 165.33 210.87 165.01 215.43 C 164.69 219.98 164.27 224.54 163.76 229.12 C 163.26 233.70 162.56 238.29 161.96 242.88 C 161.36 247.46 160.75 252.05 160.15 256.64 C 159.55 261.22 158.95 265.81 158.34 270.39 C 157.74 274.98 156.91 279.59 156.54 284.15 C 156.16 288.71 156.24 293.22 156.09 297.76 C 155.94 302.29 155.78 306.83 155.63 311.36 C 155.48 315.90 155.33 320.43 155.18 324.97 C 155.03 329.50 154.92 334.04 154.73 338.57 C 154.54 343.11 154.32 347.66 154.05 352.21 C 153.79 356.75 153.45 361.31 153.15 365.86 C 152.85 370.41 152.55 374.97 152.25 379.52 C 151.95 384.07 151.64 388.63 151.34 393.18 C 151.04 397.72 150.59 404.51 150.44 406.78" stroke="#fff" stroke-width="0.5" stroke-opacity="0.14"/>
                <path d="M 22.00 42.00 A 118.00 31.86 0 0 0 258.00 42.00" stroke="#fff" stroke-width="0.5" stroke-opacity="0.12"/>
                <path d="M 27.13 55.56 A 112.87 30.47 0 0 0 252.87 55.56" stroke="#fff" stroke-width="0.5" stroke-opacity="0.12"/>
                <path d="M 32.27 69.11 A 107.73 29.09 0 0 0 247.73 69.11" stroke="#fff" stroke-width="0.5" stroke-opacity="0.12"/>
                <path d="M 37.40 82.67 A 102.60 27.70 0 0 0 242.60 82.67" stroke="#fff" stroke-width="0.5" stroke-opacity="0.12"/>
                <path d="M 42.53 96.22 A 97.47 26.32 0 0 0 237.47 96.22" stroke="#fff" stroke-width="0.5" stroke-opacity="0.12"/>
                <path d="M 47.33 109.78 A 92.67 25.02 0 0 0 232.67 109.78" stroke="#fff" stroke-width="0.5" stroke-opacity="0.12"/>
                <path d="M 61.93 123.33 A 78.07 21.08 0 0 0 218.07 123.33" stroke="#fff" stroke-width="0.5" stroke-opacity="0.12"/>
                <path d="M 82.94 136.89 A 57.06 15.41 0 0 0 197.06 136.89" stroke="#fff" stroke-width="0.5" stroke-opacity="0.12"/>
                <path d="M 101.81 150.44 A 38.19 10.31 0 0 0 178.19 150.44" stroke="#fff" stroke-width="0.5" stroke-opacity="0.12"/>
                <path d="M 110.00 164.00 A 30.00 8.10 0 0 0 170.00 164.00" stroke="#fff" stroke-width="0.5" stroke-opacity="0.12"/>
                <path d="M 110.73 177.56 A 29.27 7.90 0 0 0 169.27 177.56" stroke="#fff" stroke-width="0.5" stroke-opacity="0.12"/>
                <path d="M 111.47 191.11 A 28.53 7.70 0 0 0 168.53 191.11" stroke="#fff" stroke-width="0.5" stroke-opacity="0.12"/>
                <path d="M 112.20 204.67 A 27.80 7.51 0 0 0 167.80 204.67" stroke="#fff" stroke-width="0.5" stroke-opacity="0.12"/>
                <path d="M 112.93 218.22 A 27.07 7.31 0 0 0 167.07 218.22" stroke="#fff" stroke-width="0.5" stroke-opacity="0.12"/>
                <path d="M 114.28 231.78 A 25.72 6.95 0 0 0 165.72 231.78" stroke="#fff" stroke-width="0.5" stroke-opacity="0.12"/>
                <path d="M 116.23 245.33 A 23.77 6.42 0 0 0 163.77 245.33" stroke="#fff" stroke-width="0.5" stroke-opacity="0.12"/>
                <path d="M 118.19 258.89 A 21.81 5.89 0 0 0 161.81 258.89" stroke="#fff" stroke-width="0.5" stroke-opacity="0.12"/>
                <path d="M 120.14 272.44 A 19.86 5.36 0 0 0 159.86 272.44" stroke="#fff" stroke-width="0.5" stroke-opacity="0.12"/>
                <path d="M 122.10 286.00 A 17.90 4.83 0 0 0 157.90 286.00" stroke="#fff" stroke-width="0.5" stroke-opacity="0.12"/>
                <path d="M 122.59 299.56 A 17.41 4.70 0 0 0 157.41 299.56" stroke="#fff" stroke-width="0.5" stroke-opacity="0.12"/>
                <path d="M 123.08 313.11 A 16.92 4.57 0 0 0 156.92 313.11" stroke="#fff" stroke-width="0.5" stroke-opacity="0.12"/>
                <path d="M 123.57 326.67 A 16.43 4.44 0 0 0 156.43 326.67" stroke="#fff" stroke-width="0.5" stroke-opacity="0.12"/>
                <path d="M 124.06 340.22 A 15.94 4.30 0 0 0 155.94 340.22" stroke="#fff" stroke-width="0.5" stroke-opacity="0.12"/>
                <path d="M 124.79 353.78 A 15.21 4.11 0 0 0 155.21 353.78" stroke="#fff" stroke-width="0.5" stroke-opacity="0.12"/>
                <path d="M 125.77 367.33 A 14.23 3.84 0 0 0 154.23 367.33" stroke="#fff" stroke-width="0.5" stroke-opacity="0.12"/>
                <path d="M 126.74 380.89 A 13.26 3.58 0 0 0 153.26 380.89" stroke="#fff" stroke-width="0.5" stroke-opacity="0.12"/>
                <path d="M 127.72 394.44 A 12.28 3.32 0 0 0 152.28 394.44" stroke="#fff" stroke-width="0.5" stroke-opacity="0.12"/>
                <path d="M 128.70 408.00 A 11.30 3.20 0 0 0 151.30 408.00" stroke="#fff" stroke-width="0.5" stroke-opacity="0.12"/>
                <path d="M 22.00 42.00 C 22.86 44.26 25.42 51.04 27.13 55.56 C 28.84 60.07 30.56 64.59 32.27 69.11 C 33.98 73.63 35.69 78.15 37.40 82.67 C 39.11 87.19 40.88 91.70 42.53 96.22 C 44.19 100.74 44.09 105.26 47.33 109.78 C 50.56 114.30 55.99 118.81 61.93 123.33 C 67.86 127.85 76.29 132.37 82.94 136.89 C 89.58 141.41 97.30 145.93 101.81 150.44 C 106.32 154.96 108.51 159.48 110.00 164.00 C 111.49 168.52 110.49 173.04 110.73 177.56 C 110.98 182.07 111.22 186.59 111.47 191.11 C 111.71 195.63 111.96 200.15 112.20 204.67 C 112.44 209.19 112.59 213.70 112.93 218.22 C 113.28 222.74 113.73 227.26 114.28 231.78 C 114.83 236.30 115.58 240.81 116.23 245.33 C 116.89 249.85 117.54 254.37 118.19 258.89 C 118.84 263.41 119.49 267.93 120.14 272.44 C 120.80 276.96 121.69 281.48 122.10 286.00 C 122.51 290.52 122.43 295.04 122.59 299.56 C 122.75 304.07 122.91 308.59 123.08 313.11 C 123.24 317.63 123.40 322.15 123.57 326.67 C 123.73 331.19 123.85 335.70 124.06 340.22 C 124.26 344.74 124.50 349.26 124.79 353.78 C 125.07 358.30 125.44 362.81 125.77 367.33 C 126.09 371.85 126.42 376.37 126.74 380.89 C 127.07 385.41 127.40 389.93 127.72 394.44 C 128.05 398.96 128.54 405.74 128.70 408.00" stroke="#fff" stroke-width="0.65" stroke-opacity="0.50"/>
                <path d="M 258.00 42.00 C 257.14 44.26 254.58 51.04 252.87 55.56 C 251.16 60.07 249.44 64.59 247.73 69.11 C 246.02 73.63 244.31 78.15 242.60 82.67 C 240.89 87.19 239.12 91.70 237.47 96.22 C 235.81 100.74 235.91 105.26 232.67 109.78 C 229.44 114.30 224.01 118.81 218.07 123.33 C 212.14 127.85 203.71 132.37 197.06 136.89 C 190.42 141.41 182.70 145.93 178.19 150.44 C 173.68 154.96 171.49 159.48 170.00 164.00 C 168.51 168.52 169.51 173.04 169.27 177.56 C 169.02 182.07 168.78 186.59 168.53 191.11 C 168.29 195.63 168.04 200.15 167.80 204.67 C 167.56 209.19 167.41 213.70 167.07 218.22 C 166.72 222.74 166.27 227.26 165.72 231.78 C 165.17 236.30 164.42 240.81 163.77 245.33 C 163.11 249.85 162.46 254.37 161.81 258.89 C 161.16 263.41 160.51 267.93 159.86 272.44 C 159.20 276.96 158.31 281.48 157.90 286.00 C 157.49 290.52 157.57 295.04 157.41 299.56 C 157.25 304.07 157.09 308.59 156.92 313.11 C 156.76 317.63 156.60 322.15 156.43 326.67 C 156.27 331.19 156.15 335.70 155.94 340.22 C 155.74 344.74 155.50 349.26 155.21 353.78 C 154.93 358.30 154.56 362.81 154.23 367.33 C 153.91 371.85 153.58 376.37 153.26 380.89 C 152.93 385.41 152.60 389.93 152.28 394.44 C 151.95 398.96 151.46 405.74 151.30 408.00" stroke="#fff" stroke-width="0.65" stroke-opacity="0.50"/>
                <path d="M 249.02 54.19 C 248.23 56.36 245.86 62.88 244.28 67.22 C 242.69 71.56 241.11 75.90 239.53 80.24 C 237.95 84.58 236.37 88.93 234.79 93.27 C 233.21 97.61 231.58 101.95 230.05 106.29 C 228.52 110.64 228.61 115.17 225.62 119.35 C 222.63 123.54 217.61 127.50 212.13 131.40 C 206.65 135.31 198.86 138.95 192.72 142.78 C 186.58 146.62 179.45 150.34 175.28 154.39 C 171.12 158.44 169.09 162.73 167.72 167.10 C 166.34 171.46 167.26 176.09 167.04 180.58 C 166.81 185.07 166.59 189.57 166.36 194.06 C 166.14 198.55 165.91 203.05 165.68 207.54 C 165.46 212.03 165.33 216.54 165.01 221.02 C 164.69 225.50 164.27 229.97 163.76 234.44 C 163.26 238.90 162.56 243.34 161.96 247.79 C 161.36 252.24 160.75 256.69 160.15 261.14 C 159.55 265.59 158.95 270.04 158.34 274.50 C 157.74 278.95 156.91 283.37 156.54 287.85 C 156.16 292.33 156.24 296.85 156.09 301.35 C 155.94 305.86 155.78 310.36 155.63 314.86 C 155.48 319.36 155.33 323.86 155.18 328.36 C 155.03 332.87 154.92 337.37 154.73 341.87 C 154.54 346.37 154.32 350.86 154.05 355.35 C 153.79 359.84 153.45 364.32 153.15 368.80 C 152.85 373.29 152.55 377.77 152.25 382.26 C 151.95 386.74 151.64 391.22 151.34 395.71 C 151.04 400.21 150.59 406.97 150.44 409.22" stroke="#fff" stroke-width="0.65" stroke-opacity="0.50"/>
                <path d="M 223.44 64.53 C 222.83 66.62 221.02 72.91 219.81 77.10 C 218.60 81.30 217.39 85.49 216.18 89.68 C 214.97 93.87 213.76 98.06 212.55 102.25 C 211.34 106.45 210.09 110.63 208.92 114.83 C 207.75 119.03 207.82 123.57 205.53 127.47 C 203.25 131.37 199.40 134.85 195.21 138.24 C 191.01 141.62 185.05 144.53 180.35 147.78 C 175.65 151.03 170.19 154.08 167.00 157.74 C 163.82 161.39 162.26 165.49 161.21 169.73 C 160.16 173.96 160.87 178.67 160.69 183.14 C 160.52 187.61 160.35 192.09 160.18 196.56 C 160.00 201.03 159.83 205.50 159.66 209.97 C 159.48 214.45 159.38 218.94 159.14 223.39 C 158.89 227.84 158.58 232.28 158.19 236.69 C 157.80 241.10 157.27 245.48 156.81 249.87 C 156.34 254.26 155.88 258.66 155.42 263.05 C 154.96 267.45 154.50 271.84 154.04 276.24 C 153.58 280.63 152.95 284.98 152.66 289.42 C 152.37 293.86 152.43 298.39 152.31 302.88 C 152.20 307.37 152.08 311.85 151.97 316.34 C 151.85 320.83 151.74 325.32 151.62 329.80 C 151.50 334.29 151.42 338.79 151.27 343.27 C 151.13 347.75 150.96 352.22 150.76 356.68 C 150.55 361.15 150.29 365.59 150.06 370.05 C 149.83 374.51 149.60 378.96 149.37 383.42 C 149.14 387.88 148.91 392.31 148.68 396.79 C 148.45 401.26 148.11 408.02 147.99 410.26" stroke="#fff" stroke-width="0.65" stroke-opacity="0.48"/>
                <path d="M 185.16 71.43 C 184.83 73.48 183.85 79.62 183.19 83.71 C 182.54 87.80 181.88 91.89 181.23 95.98 C 180.57 100.08 179.92 104.17 179.26 108.26 C 178.61 112.35 177.93 116.43 177.30 120.54 C 176.67 124.64 176.70 129.18 175.46 132.90 C 174.23 136.61 172.15 139.77 169.88 142.81 C 167.61 145.85 164.38 148.26 161.84 151.12 C 159.29 153.98 156.34 156.58 154.61 159.97 C 152.89 163.36 152.05 167.34 151.48 171.48 C 150.91 175.63 151.29 180.40 151.20 184.86 C 151.11 189.31 151.01 193.77 150.92 198.23 C 150.83 202.69 150.73 207.14 150.64 211.60 C 150.55 216.06 150.49 220.54 150.36 224.97 C 150.23 229.41 150.05 233.81 149.84 238.19 C 149.63 242.58 149.34 246.91 149.10 251.26 C 148.85 255.62 148.60 259.97 148.35 264.33 C 148.10 268.69 147.85 273.04 147.60 277.40 C 147.35 281.75 147.01 286.05 146.85 290.47 C 146.69 294.88 146.73 299.42 146.66 303.90 C 146.60 308.38 146.54 312.85 146.48 317.33 C 146.41 321.81 146.35 326.29 146.29 330.77 C 146.23 335.24 146.18 339.73 146.10 344.20 C 146.02 348.67 145.93 353.12 145.82 357.57 C 145.71 362.02 145.57 366.45 145.45 370.88 C 145.32 375.32 145.20 379.76 145.07 384.20 C 144.95 388.63 144.82 393.05 144.70 397.51 C 144.57 401.97 144.39 408.71 144.32 410.96" stroke="#fff" stroke-width="0.65" stroke-opacity="0.42"/>
                <path d="M 140.00 73.86 C 140.00 75.89 140.00 81.97 140.00 86.03 C 140.00 90.09 140.00 94.14 140.00 98.20 C 140.00 102.26 140.00 106.31 140.00 110.37 C 140.00 114.43 140.00 118.47 140.00 122.54 C 140.00 126.61 140.00 131.15 140.00 134.80 C 140.00 138.45 140.00 141.50 140.00 144.41 C 140.00 147.33 140.00 149.57 140.00 152.30 C 140.00 155.02 140.00 157.46 140.00 160.76 C 140.00 164.06 140.00 167.98 140.00 172.10 C 140.00 176.22 140.00 181.01 140.00 185.46 C 140.00 189.91 140.00 194.36 140.00 198.82 C 140.00 203.27 140.00 207.72 140.00 212.17 C 140.00 216.63 140.00 221.11 140.00 225.53 C 140.00 229.96 140.00 234.35 140.00 238.72 C 140.00 243.09 140.00 247.41 140.00 251.75 C 140.00 256.09 140.00 260.44 140.00 264.78 C 140.00 269.12 140.00 273.46 140.00 277.81 C 140.00 282.15 140.00 286.42 140.00 290.83 C 140.00 295.24 140.00 299.78 140.00 304.26 C 140.00 308.73 140.00 313.21 140.00 317.68 C 140.00 322.15 140.00 326.63 140.00 331.10 C 140.00 335.58 140.00 340.06 140.00 344.53 C 140.00 348.99 140.00 353.44 140.00 357.88 C 140.00 362.33 140.00 366.75 140.00 371.18 C 140.00 375.61 140.00 380.04 140.00 384.47 C 140.00 388.90 140.00 393.30 140.00 397.76 C 140.00 402.21 140.00 408.96 140.00 411.20" stroke="#fff" stroke-width="0.65" stroke-opacity="0.35"/>
                <path d="M 94.84 71.43 C 95.17 73.48 96.15 79.62 96.81 83.71 C 97.46 87.80 98.12 91.89 98.77 95.98 C 99.43 100.08 100.08 104.17 100.74 108.26 C 101.39 112.35 102.07 116.43 102.70 120.54 C 103.33 124.64 103.30 129.18 104.54 132.90 C 105.77 136.61 107.85 139.77 110.12 142.81 C 112.39 145.85 115.62 148.26 118.16 151.12 C 120.71 153.98 123.66 156.58 125.39 159.97 C 127.11 163.36 127.95 167.34 128.52 171.48 C 129.09 175.63 128.71 180.40 128.80 184.86 C 128.89 189.31 128.99 193.77 129.08 198.23 C 129.17 202.69 129.27 207.14 129.36 211.60 C 129.45 216.06 129.51 220.54 129.64 224.97 C 129.77 229.41 129.95 233.81 130.16 238.19 C 130.37 242.58 130.66 246.91 130.90 251.26 C 131.15 255.62 131.40 259.97 131.65 264.33 C 131.90 268.69 132.15 273.04 132.40 277.40 C 132.65 281.75 132.99 286.05 133.15 290.47 C 133.31 294.88 133.27 299.42 133.34 303.90 C 133.40 308.38 133.46 312.85 133.52 317.33 C 133.59 321.81 133.65 326.29 133.71 330.77 C 133.77 335.24 133.82 339.73 133.90 344.20 C 133.98 348.67 134.07 353.12 134.18 357.57 C 134.29 362.02 134.43 366.45 134.55 370.88 C 134.68 375.32 134.80 379.76 134.93 384.20 C 135.05 388.63 135.18 393.05 135.30 397.51 C 135.43 401.97 135.61 408.71 135.68 410.96" stroke="#fff" stroke-width="0.65" stroke-opacity="0.42"/>
                <path d="M 56.56 64.53 C 57.17 66.62 58.98 72.91 60.19 77.10 C 61.40 81.30 62.61 85.49 63.82 89.68 C 65.03 93.87 66.24 98.06 67.45 102.25 C 68.66 106.45 69.91 110.63 71.08 114.83 C 72.25 119.03 72.18 123.57 74.47 127.47 C 76.75 131.37 80.60 134.85 84.79 138.24 C 88.99 141.62 94.95 144.53 99.65 147.78 C 104.35 151.03 109.81 154.08 113.00 157.74 C 116.18 161.39 117.74 165.49 118.79 169.73 C 119.84 173.96 119.13 178.67 119.31 183.14 C 119.48 187.61 119.65 192.09 119.82 196.56 C 120.00 201.03 120.17 205.50 120.34 209.97 C 120.52 214.45 120.62 218.94 120.86 223.39 C 121.11 227.84 121.42 232.28 121.81 236.69 C 122.20 241.10 122.73 245.48 123.19 249.87 C 123.66 254.26 124.12 258.66 124.58 263.05 C 125.04 267.45 125.50 271.84 125.96 276.24 C 126.42 280.63 127.05 284.98 127.34 289.42 C 127.63 293.86 127.57 298.39 127.69 302.88 C 127.80 307.37 127.92 311.85 128.03 316.34 C 128.15 320.83 128.26 325.32 128.38 329.80 C 128.50 334.29 128.58 338.79 128.73 343.27 C 128.87 347.75 129.04 352.22 129.24 356.68 C 129.45 361.15 129.71 365.59 129.94 370.05 C 130.17 374.51 130.40 378.96 130.63 383.42 C 130.86 387.88 131.09 392.31 131.32 396.79 C 131.55 401.26 131.89 408.02 132.01 410.26" stroke="#fff" stroke-width="0.65" stroke-opacity="0.48"/>
                <path d="M 30.98 54.19 C 31.77 56.36 34.14 62.88 35.72 67.22 C 37.31 71.56 38.89 75.90 40.47 80.24 C 42.05 84.58 43.63 88.93 45.21 93.27 C 46.79 97.61 48.42 101.95 49.95 106.29 C 51.48 110.64 51.39 115.17 54.38 119.35 C 57.37 123.54 62.39 127.50 67.87 131.40 C 73.35 135.31 81.14 138.95 87.28 142.78 C 93.42 146.62 100.55 150.34 104.72 154.39 C 108.88 158.44 110.91 162.73 112.28 167.10 C 113.66 171.46 112.74 176.09 112.96 180.58 C 113.19 185.07 113.41 189.57 113.64 194.06 C 113.86 198.55 114.09 203.05 114.32 207.54 C 114.54 212.03 114.67 216.54 114.99 221.02 C 115.31 225.50 115.73 229.97 116.24 234.44 C 116.74 238.90 117.44 243.34 118.04 247.79 C 118.64 252.24 119.25 256.69 119.85 261.14 C 120.45 265.59 121.05 270.04 121.66 274.50 C 122.26 278.95 123.09 283.37 123.46 287.85 C 123.84 292.33 123.76 296.85 123.91 301.35 C 124.06 305.86 124.22 310.36 124.37 314.86 C 124.52 319.36 124.67 323.86 124.82 328.36 C 124.97 332.87 125.08 337.37 125.27 341.87 C 125.46 346.37 125.68 350.86 125.95 355.35 C 126.21 359.84 126.55 364.32 126.85 368.80 C 127.15 373.29 127.45 377.77 127.75 382.26 C 128.05 386.74 128.36 391.22 128.66 395.71 C 128.96 400.21 129.41 406.97 129.56 409.22" stroke="#fff" stroke-width="0.65" stroke-opacity="0.50"/>
                <path d="M 22.00 42.00 A 118.00 31.86 0 0 1 258.00 42.00" stroke="#fff" stroke-width="0.65" stroke-opacity="0.38"/>
                <path d="M 27.13 55.56 A 112.87 30.47 0 0 1 252.87 55.56" stroke="#fff" stroke-width="0.65" stroke-opacity="0.38"/>
                <path d="M 32.27 69.11 A 107.73 29.09 0 0 1 247.73 69.11" stroke="#fff" stroke-width="0.65" stroke-opacity="0.38"/>
                <path d="M 37.40 82.67 A 102.60 27.70 0 0 1 242.60 82.67" stroke="#fff" stroke-width="0.65" stroke-opacity="0.38"/>
                <path d="M 42.53 96.22 A 97.47 26.32 0 0 1 237.47 96.22" stroke="#fff" stroke-width="0.65" stroke-opacity="0.38"/>
                <path d="M 47.33 109.78 A 92.67 25.02 0 0 1 232.67 109.78" stroke="#fff" stroke-width="0.65" stroke-opacity="0.38"/>
                <path d="M 61.93 123.33 A 78.07 21.08 0 0 1 218.07 123.33" stroke="#fff" stroke-width="0.65" stroke-opacity="0.38"/>
                <path d="M 82.94 136.89 A 57.06 15.41 0 0 1 197.06 136.89" stroke="#fff" stroke-width="0.65" stroke-opacity="0.38"/>
                <path d="M 101.81 150.44 A 38.19 10.31 0 0 1 178.19 150.44" stroke="#fff" stroke-width="0.65" stroke-opacity="0.38"/>
                <path d="M 110.00 164.00 A 30.00 8.10 0 0 1 170.00 164.00" stroke="#fff" stroke-width="0.65" stroke-opacity="0.38"/>
                <path d="M 110.73 177.56 A 29.27 7.90 0 0 1 169.27 177.56" stroke="#fff" stroke-width="0.65" stroke-opacity="0.38"/>
                <path d="M 111.47 191.11 A 28.53 7.70 0 0 1 168.53 191.11" stroke="#fff" stroke-width="0.65" stroke-opacity="0.38"/>
                <path d="M 112.20 204.67 A 27.80 7.51 0 0 1 167.80 204.67" stroke="#fff" stroke-width="0.65" stroke-opacity="0.38"/>
                <path d="M 112.93 218.22 A 27.07 7.31 0 0 1 167.07 218.22" stroke="#fff" stroke-width="0.65" stroke-opacity="0.38"/>
                <path d="M 114.28 231.78 A 25.72 6.95 0 0 1 165.72 231.78" stroke="#fff" stroke-width="0.65" stroke-opacity="0.38"/>
                <path d="M 116.23 245.33 A 23.77 6.42 0 0 1 163.77 245.33" stroke="#fff" stroke-width="0.65" stroke-opacity="0.38"/>
                <path d="M 118.19 258.89 A 21.81 5.89 0 0 1 161.81 258.89" stroke="#fff" stroke-width="0.65" stroke-opacity="0.38"/>
                <path d="M 120.14 272.44 A 19.86 5.36 0 0 1 159.86 272.44" stroke="#fff" stroke-width="0.65" stroke-opacity="0.38"/>
                <path d="M 122.10 286.00 A 17.90 4.83 0 0 1 157.90 286.00" stroke="#fff" stroke-width="0.65" stroke-opacity="0.38"/>
                <path d="M 122.59 299.56 A 17.41 4.70 0 0 1 157.41 299.56" stroke="#fff" stroke-width="0.65" stroke-opacity="0.38"/>
                <path d="M 123.08 313.11 A 16.92 4.57 0 0 1 156.92 313.11" stroke="#fff" stroke-width="0.65" stroke-opacity="0.38"/>
                <path d="M 123.57 326.67 A 16.43 4.44 0 0 1 156.43 326.67" stroke="#fff" stroke-width="0.65" stroke-opacity="0.38"/>
                <path d="M 124.06 340.22 A 15.94 4.30 0 0 1 155.94 340.22" stroke="#fff" stroke-width="0.65" stroke-opacity="0.38"/>
                <path d="M 124.79 353.78 A 15.21 4.11 0 0 1 155.21 353.78" stroke="#fff" stroke-width="0.65" stroke-opacity="0.38"/>
                <path d="M 125.77 367.33 A 14.23 3.84 0 0 1 154.23 367.33" stroke="#fff" stroke-width="0.65" stroke-opacity="0.38"/>
                <path d="M 126.74 380.89 A 13.26 3.58 0 0 1 153.26 380.89" stroke="#fff" stroke-width="0.65" stroke-opacity="0.38"/>
                <path d="M 127.72 394.44 A 12.28 3.32 0 0 1 152.28 394.44" stroke="#fff" stroke-width="0.65" stroke-opacity="0.38"/>
                <path d="M 128.70 408.00 A 11.30 3.20 0 0 1 151.30 408.00" stroke="#fff" stroke-width="0.65" stroke-opacity="0.38"/>
                <ellipse cx="140" cy="42.00" rx="118.00" ry="31.86" stroke="#fff" stroke-width="1.6"/>
                <ellipse cx="140" cy="103.00" rx="94.90" ry="25.62" stroke="#fff" stroke-width="1.15"/>
                <ellipse cx="140" cy="164.00" rx="30.00" ry="8.10" stroke="#b81414" stroke-width="1.6"/>
                <ellipse cx="140" cy="225.00" rx="26.70" ry="7.21" stroke="#fff" stroke-width="1.15"/>
                <ellipse cx="140" cy="286.00" rx="17.90" ry="4.83" stroke="#fff" stroke-width="1.15"/>
                <ellipse cx="140" cy="347.00" rx="15.70" ry="4.24" stroke="#fff" stroke-width="1.15"/>
                <ellipse cx="140" cy="408.00" rx="11.30" ry="3.20" stroke="#b81414" stroke-width="1.6"/>
                <path d="M 240.60 58.65 C 239.87 60.79 237.68 67.21 236.22 71.48 C 234.76 75.76 233.30 80.04 231.85 84.32 C 230.39 88.59 228.93 92.87 227.47 97.15 C 226.01 101.42 224.50 105.69 223.09 109.98 C 221.68 114.26 221.76 118.79 219.01 122.86 C 216.25 126.92 211.62 130.67 206.56 134.35 C 201.50 138.03 194.32 141.36 188.65 144.94 C 182.98 148.52 176.40 151.95 172.56 155.83 C 168.71 159.72 166.84 163.93 165.58 168.23 C 164.31 172.54 165.16 177.20 164.95 181.69 C 164.74 186.17 164.53 190.65 164.33 195.14 C 164.12 199.62 163.91 204.11 163.70 208.59 C 163.49 213.07 163.37 217.57 163.07 222.04 C 162.78 226.51 162.40 230.97 161.93 235.41 C 161.46 239.85 160.82 244.26 160.26 248.69 C 159.71 253.11 159.15 257.54 158.59 261.97 C 158.04 266.39 157.48 270.82 156.93 275.25 C 156.37 279.67 155.61 284.07 155.26 288.53 C 154.91 292.99 154.98 297.52 154.84 302.01 C 154.70 306.51 154.57 311.00 154.43 315.50 C 154.29 319.99 154.15 324.49 154.01 328.99 C 153.87 333.48 153.77 337.98 153.59 342.47 C 153.42 346.96 153.21 351.45 152.97 355.92 C 152.72 360.40 152.41 364.87 152.13 369.34 C 151.86 373.81 151.58 378.29 151.30 382.76 C 151.02 387.23 150.74 391.69 150.47 396.18 C 150.19 400.66 149.77 407.42 149.63 409.67" stroke="#b81414" stroke-width="2.15" stroke-linecap="round"/>
                <text x="140" y="46.0" text-anchor="middle" fill="#fff" font-family="Geist Mono, ui-monospace, monospace" font-size="14" font-weight="700">100%</text>
                <text x="140" y="107.0" text-anchor="middle" fill="#fff" font-family="Geist Mono, ui-monospace, monospace" font-size="13" font-weight="700">79%</text>
                <text x="140" y="168.0" text-anchor="middle" fill="#fff" font-family="Geist Mono, ui-monospace, monospace" font-size="13" font-weight="700">20%</text>
                <text x="140" y="229.0" text-anchor="middle" fill="#fff" font-family="Geist Mono, ui-monospace, monospace" font-size="11" font-weight="700">17%</text>
                <text x="140" y="290.0" text-anchor="middle" fill="#fff" font-family="Geist Mono, ui-monospace, monospace" font-size="11" font-weight="700">9%</text>
                <text x="140" y="351.0" text-anchor="middle" fill="#fff" font-family="Geist Mono, ui-monospace, monospace" font-size="11" font-weight="700">7%</text>
                <text x="140" y="412.0" text-anchor="middle" fill="#b81414" font-family="Geist Mono, ui-monospace, monospace" font-size="11" font-weight="700">3%</text>
                </svg>
              </div>
            </div>
            <div class="cs-viz-foot">
              <span>RESEARCH_FUNNEL_V2 · WIREFRAME_TRACE · 2026</span>
              <span class="cs-viz-actions">[ IGNORE ] [ SOLVE ]</span>
            </div>
          </div>
        </div>
      </div>

      <div class="cs-section">
        <div class="cs-section-num">07 — Approach</div>
        <div class="cs-section-title">How we addressed the pain points</div>
        <div class="cs-section-body">Four focused moves:</div>
        <ul class="cs-list">
          <li>Explain product value from the beginning</li>
          <li>State feature benefits and differences</li>
          <li>Provide onboarding for recording phrases</li>
          <li>Re-educate when the personalized model returns</li>
        </ul>
      </div>

      <div class="cs-section">
        <div class="cs-section-num">08 — Feature education</div>
        <div class="cs-section-title">From auto-enroll confusion to clear value</div>
        <div class="cs-section-body">
          Auto-enrollment skipped explanation. We replaced it with feature education — benefits, differentiation, and personalization — so users knew what they were signing up for before recording.
        </div>
        <div class="cs-media">
          <img src="https://framerusercontent.com/images/5BEZIS8ZJOcHTDd7samEaTGPY3M.png" alt="Previous onboarding screens" loading="lazy">
          <div class="cs-media-caption">Previous screens — app skips explanation.</div>
        </div>
        <div class="cs-media-grid">
          <div class="cs-media">
            <img src="https://framerusercontent.com/images/NbLYPMyDUNlEUlqEaQv2yH1JwNU.png" alt="Previous splash screen" loading="lazy">
            <div class="cs-media-caption">Before — splash with no product value</div>
          </div>
          <div class="cs-media">
            <img src="https://framerusercontent.com/images/Sp8PcfkEWKT4ndxbbKFzsHQPfvo.png" alt="Previous early access consent screen" loading="lazy">
            <div class="cs-media-caption">Before — dense consent, weak framing</div>
          </div>
        </div>
        <div class="cs-media-grid">
          <div class="cs-media">
            <img src="https://framerusercontent.com/images/7I5PftrMVF0LWaVXn3vnLlb9dY4.png" alt="Feature education proposal" loading="lazy">
            <div class="cs-media-caption">Design iteration — feature education</div>
          </div>
          <div class="cs-media">
            <img src="https://framerusercontent.com/images/bUPjXAgFBgqVrRFliFw7yr4qgcQ.png" alt="Design iteration proposal screens" loading="lazy">
            <div class="cs-media-caption">Proposed flow</div>
          </div>
        </div>
      </div>

      <div class="cs-section">
        <div class="cs-section-num">09 — Onboarding</div>
        <div class="cs-section-title">Shaping a step-by-step mental model</div>
        <div class="cs-section-body">
          I designed a core product story with a paced recording flow aligned to users’ mental models — clear instructions, tailored for cognitive accessibility.
        </div>
        <div class="cs-media">
          <img src="https://framerusercontent.com/images/AyJjOVamfOmAeGCDo4bDTPrqgs.png" alt="Onboarding flow iteration" loading="lazy">
          <div class="cs-media-caption">Onboarding iteration — step-by-step recording guidance.</div>
        </div>
        <div class="cs-media" style="margin-top:16px;">
          <img src="https://framerusercontent.com/images/QSlNGGqlOd5oKneOwXm88sebM.png" alt="Onboarding screen details" loading="lazy">
        </div>
      </div>

      <div class="cs-section">
        <div class="cs-section-num">10 — Refinement</div>
        <div class="cs-section-title">Enhancing usability and streamlining flow</div>
        <div class="cs-section-body">
          Low-fi wireframes led to team critique and UX-expert review. We integrated research patterns, covered edge cases, and used tooltip guidance + pagination to reduce steps. Collaboration with a UX writer kept instructions concise — including an audio review point after sessions.
        </div>
        <div class="cs-media-grid">
          <div class="cs-media">
            <img src="https://framerusercontent.com/images/uO5s6ekdyXp05mECdCFoTJcgfs.png" alt="Wireframe and usability refinements" loading="lazy">
          </div>
          <div class="cs-media">
            <img src="https://framerusercontent.com/images/tJ9ZkN0UPMeQePpTP3gbu8wLqCo.png" alt="Tooltip and pagination refinements" loading="lazy">
          </div>
        </div>
      </div>

      <div class="cs-section">
        <div class="cs-section-num">11 — Re-engage</div>
        <div class="cs-section-title">Worth the wait</div>
        <div class="cs-section-body">
          When the personalized model was ready, a re-education moment closed the training-to-payoff gap — helping users understand and use what they’d built, with wait-time expectations set upfront.
        </div>
        <div class="cs-media">
          <img src="https://framerusercontent.com/images/HXGm2mlUWjN5mPxzNEGrv9oZw.png" alt="Re-education when personalized model is ready" loading="lazy">
          <div class="cs-media-caption">Re-teach moment — model ready, features reintroduced.</div>
        </div>
      </div>

      <div class="cs-section">
        <div class="cs-section-num">12 — Outcome</div>
        <div class="cs-section-title">Shipped — and highlighted at Google I/O</div>
        <div class="cs-section-body">
          Internal testing produced consistently positive testimonials. The onboarding redesign was featured in the Accessibility segment of Google I/O (May 2024).
        </div>

<div class="cs-viz" aria-label="Onboarding drop-off patched">
          <div class="cs-viz-top">
            <span>PROJECT_RELATE // PATCH_NOTES.LOG</span>
            <span class="cs-viz-sev">STATUS: RESOLVED · LEAK_01 PATCHED</span>
          </div>
          <div class="cs-viz-title">Patched<span class="cs-viz-cursor" aria-hidden="true"></span></div>
          <div class="cs-viz-sub">&gt; largest onboarding leak closed</div>
          <div class="cs-patch">
            <div class="cs-patch-chart">
              <div class="cs-patch-col">
                <div class="cs-patch-pct is-before">27%</div>
                <div class="cs-patch-bar is-before" aria-hidden="true"></div>
                <div class="cs-patch-axis">Before</div>
              </div>
              <div class="cs-patch-delta">
                <span>Delta</span>
                <strong>▾8</strong>
                <span>Points</span>
              </div>
              <div class="cs-patch-col">
                <div class="cs-patch-pct is-after">19%</div>
                <div class="cs-patch-bar is-after" aria-hidden="true"></div>
                <div class="cs-patch-axis">After</div>
              </div>
            </div>
            <div>
              <article class="cs-err">
                <div class="cs-err-chrome">
                  <span>FIX_01 / ONBOARDING</span>
                  <span class="window-controls">— □ ×</span>
                </div>
                <p class="cs-patch-copy">Reduced the largest onboarding drop-off from <span class="cs-err-hl">27%</span> to <strong>19%</strong> — more users successfully record their first sample.</p>
              </article>
              <ul class="cs-patch-rows" style="margin-top:12px;">
                <li><span class="k">Drop-off before</span><span class="v is-hot">27.0%</span></li>
                <li><span class="k">Drop-off after</span><span class="v">19.0%</span></li>
                <li><span class="k">Delta</span><span class="v">▾ 8 pts</span></li>
                <li><span class="k">Relative recovery</span><span class="v">▲ 30%</span></li>
                <li><span class="k">Continued (start → record)</span><span class="v">73 → 81</span></li>
              </ul>
            </div>
          </div>
          <div class="cs-viz-foot">
            <span>PATCH_NOTES_V1 · 2026</span>
            <span class="cs-viz-actions">[ SOLVED ]</span>
          </div>
        </div>
        <div class="cs-media">
          <img src="https://framerusercontent.com/images/EAZjGeoDUwRQQxxw8DNwhSjeLAo.png" alt="Final onboarding screens" loading="lazy">
          <div class="cs-media-caption">Final high-fidelity onboarding.</div>
        </div>
        <div class="cs-media" style="margin-top:16px;">
          <img src="https://framerusercontent.com/images/D7VOgjlSWeQfcJUXx5QFDq5VEk.png" alt="Full onboarding flow overview" loading="lazy">
          <div class="cs-media-caption">Full flow overview.</div>
        </div>
      </div>

      <div class="cs-section">
        <div class="cs-section-num">13 — Next & lessons</div>
        <div class="cs-section-title">What follows</div>
        <div class="cs-section-body"><strong>Next steps</strong></div>
        <ul class="cs-list">
          <li>Partner with marketing on a GM3 campaign for new and existing users</li>
          <li>Run usability testing against the GM2 baseline</li>
        </ul>
        <div class="cs-section-body" style="margin-top:24px;"><strong>Lessons learned</strong></div>
        <ul class="cs-list">
          <li>State product value early — purpose before effort</li>
          <li>Design for edge cases and cognitive diversity from the start</li>
          <li>Keep onboarding step-by-step so users can build a mental model</li>
        </ul>
      </div>

    </div>
  </div>
</section>

<!-- NEXT CASE STUDY -->
<a href="/relate-visual" class="cs-next">
  <div>
    <div class="cs-next-label">Next case study · 02</div>
    <div class="cs-next-title">Project Relate<br>Visual Re-design</div>
  </div>
  <div class="cs-next-arrow">→</div>
</a>

<!-- CONTACT -->
<section id="contact">
  <div class="contact-eyebrow reveal">Let's work together</div>
  <h2 class="contact-headline reveal">Have a problem<br><em>worth solving?</em></h2>
  <div class="contact-links reveal">
    <a href="mailto:hello@uxwithlola.design" class="contact-link primary">Say hello</a>
    <a href="https://www.linkedin.com/in/lola-ogundipe/" target="_blank" class="contact-link">LinkedIn</a>
    <a href="https://drive.google.com/file/d/182oYnzfOsr-Dm9d5h4mqqN-zahc0xmPP/view" target="_blank" class="contact-link">Resume</a>
  </div>
</section>

<footer>
  <div class="footer-text">© 2024 Lola Ogundipe — UX Designer</div>
  <div class="footer-text">New York · Available for freelance & full-time</div>
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
 * RedesignRelateOnboarding — local portfolio redesign ported into Framer.
 * Includes custom cursor, typewriter, scroll reveal, and full page styles.
 */
export default function RedesignRelateOnboarding(props) {
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

RedesignRelateOnboarding.displayName = "RedesignRelateOnboarding"

addPropertyControls(RedesignRelateOnboarding, {
    note: {
        type: ControlType.String,
        title: "Page",
        defaultValue: "Relate Onboarding",
        displayTextArea: false,
    },
})
