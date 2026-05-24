import { useEffect, useMemo, useState } from "react";
import { api, getSavedSession, saveSession, clearSession } from "./services/api";
import AdminApp from "./AdminApp";

const PLATFORM = {
  name: "MB Tech",
  shortName: "MB",
  productName: "MB Agenda IA",
  tagline: "Automação, atendimento e agenda inteligente para empresas de eventos.",
  supportEmail: "suporte@mbtech.com.br",
};

const TODAY = new Date().toISOString().slice(0, 10);
const WEEK_PT = ["Seg", "Ter", "Qua", "Qui", "Sex", "Sáb", "Dom"];

function fmtDate(d) {
  if (!d) return "—";
  const parts = String(d).slice(0, 10).split("-");
  if (parts.length !== 3) return d;
  const [, m, day] = parts;
  return `${day}/${m}`;
}

function fmtDateFull(d) {
  if (!d) return "—";
  const parts = String(d).slice(0, 10).split("-");
  if (parts.length !== 3) return d;
  const [y, m, day] = parts;
  return `${day}/${m}/${y}`;
}

function getWeekDays(base = TODAY) {
  const date = new Date(base + "T12:00:00");
  const dow = date.getDay();
  const diff = dow === 0 ? -6 : 1 - dow;
  const mon = new Date(date);
  mon.setDate(date.getDate() + diff);
  return Array.from({ length: 7 }, (_, i) => {
    const d = new Date(mon);
    d.setDate(mon.getDate() + i);
    return d.toISOString().slice(0, 10);
  });
}

function initials(name) {
  return String(name || "")
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((p) => p[0]?.toUpperCase())
    .join("");
}

function getErrorMessage(error) {
  if (error?.message) return error.message;
  return "Não foi possível concluir a operação.";
}

const css = `
  @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap');

  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

  :root {
    --f: 'Plus Jakarta Sans', sans-serif;

    /* amber */
    --a50:  #fffbeb; --a100: #fef3c7; --a200: #fde68a;
    --a400: #fbbf24; --a500: #f59e0b; --a600: #d97706; --a700: #b45309;
    /* green */
    --g50:  #ecfdf5; --g100: #d1fae5; --g600: #059669;
    /* red */
    --r50:  #fef2f2; --r100: #fee2e2; --r500: #ef4444; --r600: #dc2626;
    /* blue */
    --b50:  #eff6ff; --b100: #dbeafe; --b600: #2563eb;
    /* neutral scale */
    --n0:   #ffffff; --n50: #f9f9f8; --n100: #f2f2f0;
    --n200: #e4e4e1; --n300: #c8c8c4; --n400: #9d9d98;
    --n500: #6b6b67; --n600: #4a4a47; --n700: #2e2e2b;
    --n800: #1a1a18; --n900: #0f0f0d;
    /* sidebar */
    --s-bg:   #101010; --s-border: rgba(255,255,255,.07);
    --s-muted: rgba(255,255,255,.45); --s-act: #fde68a;
    --s-act-bg: rgba(245,158,11,.13);
    /* layout */
    --border: var(--n200);
    --bg:     var(--n50);
    --card:   var(--n0);
    /* radii */
    --r4: 4px; --r6: 6px; --r8: 8px; --r12: 12px;
    --r16: 16px; --r20: 20px; --r24: 24px; --r99: 9999px;
    /* shadows */
    --sh0: 0 1px 2px rgba(0,0,0,.04);
    --sh1: 0 2px 8px rgba(0,0,0,.06), 0 1px 2px rgba(0,0,0,.04);
    --sh2: 0 8px 24px rgba(0,0,0,.08);
    --sh3: 0 24px 64px rgba(0,0,0,.12);
    --sh4: 0 40px 120px rgba(0,0,0,.20);
  }

  html, body { font-family: var(--f); font-size: 14px; background: var(--bg); color: var(--n800); width: 100%; min-height: 100%; -webkit-font-smoothing: antialiased; }
  #root { min-height: 100vh; }
  button, input, select, textarea { font: inherit; }
  button { cursor: pointer; border: none; background: none; }

  @keyframes fadeUp  { from { opacity:0; transform:translateY(10px); } to { opacity:1; transform:translateY(0); } }
  @keyframes fadeIn  { from { opacity:0; } to { opacity:1; } }
  @keyframes scaleIn { from { opacity:0; transform:scale(.97); } to { opacity:1; transform:scale(1); } }
  @keyframes barUp   { from { transform:scaleY(0); } to { transform:scaleY(1); } }
  @keyframes spin    { to { transform:rotate(360deg); } }
  @keyframes pulse   { 0%,100% { opacity:1; } 50% { opacity:.35; } }
  @keyframes slideIn { from { opacity:0; transform:translateX(-8px); } to { opacity:1; transform:translateX(0); } }


  /* ── MB TECH LOGO ───────────────────────────
     Logo construído em CSS para não depender de imagem externa.
  ────────────────────────────────────────── */

  .mb-logo {
    position: relative;
    width: 44px;
    height: 44px;
    border-radius: 14px;
    display: flex;
    align-items: center;
    justify-content: center;
    overflow: hidden;
    flex-shrink: 0;
    box-shadow: var(--sh1);
  }

  .mb-logo span {
    position: relative;
    z-index: 2;
    color: #fff;
    font-size: 13px;
    line-height: 1;
    font-weight: 800;
    letter-spacing: -0.08em;
  }

  .mb-logo i {
    position: absolute;
    right: -8px;
    bottom: -8px;
    width: 24px;
    height: 24px;
    border-radius: 999px;
    background: rgba(255,255,255,.18);
  }

  .mb-logo.dark {
    background: linear-gradient(135deg, #111827 0%, #020617 55%, #d97706 160%);
    border: 1px solid rgba(255,255,255,.12);
  }

  .mb-logo.light {
    background: linear-gradient(135deg, #0f172a 0%, #111827 58%, #d97706 160%);
    border: 1px solid rgba(15,23,42,.08);
  }

  .sb-logo .mb-logo {
    width: 38px;
    height: 38px;
    border-radius: 12px;
    box-shadow: none;
  }

  .sb-logo .mb-logo span {
    font-size: 12px;
  }


  /* ── LOGIN ───────────────────────────────── */

  .l-page {
    width:100%; min-height:100vh;
    display:flex; align-items:center; justify-content:center;
    padding:24px; background:#0e0e0e; overflow-y:auto;
  }
  .l-shell {
    width:min(1080px,100%);
    min-height:min(660px,calc(100vh - 48px));
    display:grid; grid-template-columns:1fr 390px;
    border-radius:26px; overflow:hidden;
    box-shadow:var(--sh4); animation:fadeIn .25s ease both;
    border:1px solid rgba(255,255,255,.06);
  }

  /* hero */
  .l-hero {
    background:#141414;
    padding:clamp(40px,6vw,70px);
    display:flex; flex-direction:column; justify-content:space-between;
    position:relative; overflow:hidden;
    border-right:1px solid rgba(255,255,255,.05);
  }
  .l-hero::before {
    content:''; position:absolute; inset:0; pointer-events:none;
    background:
      radial-gradient(circle at 10% 12%, rgba(245,158,11,.16) 0%, transparent 38%),
      radial-gradient(circle at 90% 90%, rgba(16,185,129,.09) 0%, transparent 34%);
  }
  .l-pill {
    position:relative; display:inline-flex; align-items:center; gap:7px;
    padding:5px 13px; border-radius:var(--r99);
    background:rgba(255,255,255,.06); border:1px solid rgba(255,255,255,.09);
    font-size:12px; font-weight:600; color:rgba(255,255,255,.55);
    width:fit-content; margin-bottom:24px;
  }
  .l-pill-dot { width:6px; height:6px; border-radius:50%; background:var(--a500); }

  /* hero headline: 800 weight, tight tracking */
  .l-h1 {
    position:relative;
    font-size:clamp(34px,4.6vw,60px); font-weight:800;
    color:#fff; line-height:1.08; letter-spacing:-0.03em; max-width:500px;
  }
  .l-h1 em { font-style:normal; color:var(--a500); }

  .l-sub {
    position:relative; margin-top:18px;
    font-size:15px; font-weight:400;
    color:rgba(255,255,255,.42); line-height:1.7; max-width:440px;
  }

  .l-stats {
    position:relative; display:grid; grid-template-columns:repeat(3,1fr);
    gap:9px; margin-top:38px; max-width:440px;
  }
  .l-stat {
    padding:15px; background:rgba(255,255,255,.05);
    border:1px solid rgba(255,255,255,.07); border-radius:var(--r16);
  }
  /* stat numbers: 800 for impact */
  .l-stat-n { font-size:28px; font-weight:800; color:#fff; letter-spacing:-0.04em; line-height:1; }
  /* stat labels: 500 muted */
  .l-stat-l { margin-top:5px; font-size:11px; font-weight:500; color:rgba(255,255,255,.35); text-transform:uppercase; letter-spacing:.06em; }

  /* form panel */
  .l-form {
    background:var(--n0);
    padding:clamp(34px,5vw,52px);
    display:flex; flex-direction:column; justify-content:center;
  }
  .l-logo { display:flex; align-items:center; gap:12px; margin-bottom:34px; }
  .l-logo .mb-logo {
    width:42px;
    height:42px;
    border-radius:var(--r12);
  }
  /* logo text: clear two levels */
  .l-logo-name { font-size:16px; font-weight:800; color:var(--n800); letter-spacing:-0.01em; }
  .l-logo-sub  { font-size:11.5px; font-weight:500; color:var(--n400); margin-top:1px; }

  /* form heading */
  .l-title { font-size:24px; font-weight:800; color:var(--n800); letter-spacing:-0.025em; line-height:1.2; }
  .l-sub2  { margin-top:5px; margin-bottom:26px; font-size:13.5px; font-weight:400; color:var(--n400); line-height:1.5; }

  .l-err {
    margin-bottom:12px; padding:10px 13px;
    background:var(--r50); border:1px solid var(--r100);
    border-radius:var(--r8); font-size:13px; font-weight:600; color:var(--r600);
  }
  .l-hint { margin-top:14px; text-align:center; font-size:12px; font-weight:400; color:var(--n400); }
  .l-hint strong { font-weight:600; color:var(--n600); }

  /* ── FORM FIELDS ───────────────────────────── */

  .fld { display:block; }
  .fld label {
    display:block; margin-bottom:5px;
    font-size:12.5px; font-weight:600; color:var(--n600);
  }
  .fld input, .fld select, .fld textarea {
    width:100%; padding:10px 12px;
    font-size:13.5px; font-weight:400; color:var(--n800);
    background:var(--n50); border:1.5px solid var(--border);
    border-radius:var(--r8); outline:none;
    transition:border-color .14s, box-shadow .14s, background .14s;
  }
  .fld textarea { min-height:84px; resize:vertical; }
  .fld input::placeholder, .fld textarea::placeholder { color:var(--n300); }
  .fld input:focus, .fld select:focus, .fld textarea:focus {
    border-color:var(--a600);
    box-shadow:0 0 0 3px rgba(217,119,6,.10);
    background:var(--n0);
  }

  /* ── BUTTONS ─────────────────────────────── */

  .btn {
    display:inline-flex; align-items:center; justify-content:center; gap:6px;
    padding:9px 15px; border-radius:var(--r8);
    font-size:13px; font-weight:700;
    transition:background .13s, transform .1s, box-shadow .13s;
  }
  .btn:active { transform:scale(.97); }
  .btn-ink  { background:var(--n800); color:#fff; box-shadow:0 2px 6px rgba(0,0,0,.14); }
  .btn-ink:hover  { background:var(--n700); }
  .btn-gold { background:var(--a600); color:#fff; box-shadow:0 2px 8px rgba(217,119,6,.22); }
  .btn-gold:hover { background:var(--a700); }
  .btn-outline { background:var(--n0); color:var(--n700); border:1.5px solid var(--border); }
  .btn-outline:hover { background:var(--n50); border-color:var(--n300); }
  .btn-del { background:var(--r50); color:var(--r600); border:1.5px solid var(--r100); }
  .btn-sm { padding:5px 10px; font-size:12px; }

  /* ── APP SHELL ────────────────────────────── */

  .app { display:flex; min-height:100vh; }

  .sidebar {
    width:252px; min-height:100vh;
    position:sticky; top:0; flex-shrink:0;
    display:flex; flex-direction:column;
    background:var(--s-bg);
    border-right:1px solid var(--s-border);
  }
  .sb-logo {
    padding:22px 18px 17px;
    border-bottom:1px solid var(--s-border);
    display:flex; align-items:center; gap:11px;
  }
  .sb-mark {
    width:38px;
    height:38px;
    border-radius:var(--r8);
    flex-shrink:0;
  }
  /* sidebar company name: 700, clean */
  .sb-name { font-size:13.5px; font-weight:700; color:#fff; line-height:1.25; }
  .sb-app  { font-size:11px; font-weight:500; color:rgba(255,255,255,.3); margin-top:1px; }

  .sb-nav  { padding:14px 10px 8px; }
  .sb-lbl  { padding:0 9px 7px; font-size:10px; font-weight:700; color:rgba(255,255,255,.25); text-transform:uppercase; letter-spacing:.09em; }

  .sb-item {
    width:100%; display:flex; align-items:center; gap:9px;
    padding:9px 11px; border-radius:var(--r8);
    font-size:13.5px; font-weight:600; color:var(--s-muted);
    transition:background .12s, color .12s;
    animation:slideIn .3s ease both;
  }
  .sb-item:hover { background:rgba(255,255,255,.05); color:rgba(255,255,255,.82); }
  .sb-item.on    { background:var(--s-act-bg); color:var(--s-act); }

  .sb-foot {
    margin-top:auto; padding:13px;
    border-top:1px solid var(--s-border);
  }
  .sb-user {
    display:flex; align-items:center; gap:10px;
    padding:9px 11px; border-radius:var(--r8);
    background:rgba(255,255,255,.04);
  }
  .sb-av {
    width:32px; height:32px; border-radius:50%; flex-shrink:0;
    background:var(--a600); color:#fff;
    display:flex; align-items:center; justify-content:center;
    font-size:11.5px; font-weight:700;
  }
  /* user chip: two clean levels */
  .sb-uname { font-size:12.5px; font-weight:700; color:#fff; }
  .sb-urole { font-size:11px; font-weight:500; color:rgba(255,255,255,.32); margin-top:1px; }

  .main { flex:1; min-width:0; display:flex; flex-direction:column; }

  .topbar {
    position:sticky; top:0; z-index:20;
    height:60px; padding:0 28px;
    display:flex; align-items:center; justify-content:space-between;
    background:rgba(249,249,248,.92); backdrop-filter:blur(14px);
    border-bottom:1px solid var(--n100);
  }
  /* topbar title: single weight, no confusion */
  .topbar-title { font-size:17px; font-weight:700; color:var(--n800); letter-spacing:-0.02em; }
  .topbar-sub { margin-top:2px; font-size:11.5px; font-weight:500; color:var(--n400); }

  .page { padding:26px 28px; flex:1; }

  /* ── TYPOGRAPHY SYSTEM ──────────────────────
     Every text element maps to exactly one class.
     No inline font-weight or font-size mixing.
  ────────────────────────────────────────── */

  /* page title — used once per page */
  .tx-title { font-size:21px; font-weight:800; color:var(--n800); letter-spacing:-0.025em; line-height:1.2; }
  /* section heading inside a card */
  .tx-section { font-size:15px; font-weight:700; color:var(--n800); letter-spacing:-0.01em; }
  /* ALL-CAPS label: table headers, card labels */
  .tx-label { font-size:11px; font-weight:700; color:var(--n400); text-transform:uppercase; letter-spacing:.07em; }
  /* body copy */
  .tx-body { font-size:13.5px; font-weight:400; color:var(--n500); line-height:1.6; }
  /* helper / timestamp */
  .tx-meta { font-size:12px; font-weight:500; color:var(--n400); }
  /* large number on metric card */
  .tx-num  { font-size:34px; font-weight:800; color:var(--n800); letter-spacing:-0.045em; line-height:1; }

  /* ── CARDS ───────────────────────────────── */

  .card {
    background:var(--card); border:1px solid var(--n100);
    border-radius:var(--r20); box-shadow:var(--sh1); overflow:hidden;
  }
  .p20 { padding:20px; }
  .p24 { padding:24px; }

  .metric-grid { display:grid; grid-template-columns:repeat(4,1fr); gap:14px; }
  .metric-card {
    background:var(--card); border:1px solid var(--n100);
    border-radius:var(--r20); padding:18px 20px;
    box-shadow:var(--sh1); animation:fadeUp .4s ease both;
    position:relative; overflow:hidden;
  }
  .metric-card::after {
    content:''; position:absolute; bottom:0; left:0; right:0;
    height:2px; background:var(--a500); opacity:.45;
  }

  /* ── BADGES ──────────────────────────────── */

  .badge {
    display:inline-flex; align-items:center; gap:5px;
    padding:3px 9px; border-radius:var(--r99);
    font-size:11.5px; font-weight:700; border:1px solid transparent;
  }
  .badge::before { content:''; width:5px; height:5px; border-radius:50%; }
  .badge-green { background:var(--g50);  color:#065f46; border-color:var(--g100); }
  .badge-green::before  { background:var(--g600); }
  .badge-amber { background:var(--a50);  color:#92400e; border-color:var(--a100); }
  .badge-amber::before  { background:var(--a600); }
  .badge-red   { background:var(--r50);  color:#991b1b; border-color:var(--r100); }
  .badge-red::before    { background:var(--r600); }
  .badge-blue  { background:var(--b50);  color:#1e40af; border-color:var(--b100); }
  .badge-blue::before   { background:var(--b600); }

  /* ── WEEK CALENDAR ────────────────────────── */

  .wk-grid { display:grid; grid-template-columns:repeat(7,1fr); gap:9px; }
  .wk-day {
    min-height:110px; padding:11px 9px;
    background:var(--n50); border:1px solid var(--n100);
    border-radius:var(--r12); animation:fadeUp .4s ease both;
  }
  .wk-day.today { background:var(--a50); border-color:var(--a200); }
  .wk-day-name { font-size:10px; font-weight:700; color:var(--n400); text-transform:uppercase; letter-spacing:.07em; }
  .wk-day-num  { font-size:20px; font-weight:800; color:var(--n800); letter-spacing:-0.04em; line-height:1.1; margin-top:2px; }
  .wk-day.today .wk-day-num { color:var(--a600); }
  .ev-chip {
    margin-top:6px; width:100%; padding:5px 7px;
    border-radius:var(--r6); border:none;
    font-size:11px; font-weight:700; line-height:1.35; cursor:pointer;
    text-align:left;
  }
  .ch-ok  { background:var(--g100); color:#065f46; }
  .ch-pnd { background:var(--a100); color:#92400e; }

  /* ── BAR CHART ───────────────────────────── */

  .bar {
    flex:1; border-radius:4px 4px 0 0;
    background:var(--a500);
    transform-origin:bottom; animation:barUp .5s ease both;
  }

  /* ── TABLE ───────────────────────────────── */

  .t-wrap { overflow-x:auto; border-radius:var(--r16); border:1px solid var(--n100); }
  table { width:100%; border-collapse:collapse; }
  thead th {
    padding:11px 15px; background:var(--n50);
    text-align:left; border-bottom:1px solid var(--n100);
    font-size:11px; font-weight:700; color:var(--n400);
    text-transform:uppercase; letter-spacing:.07em;
  }
  tbody tr { border-bottom:1px solid var(--n100); transition:background .1s; }
  tbody tr:last-child { border-bottom:none; }
  tbody tr:hover { background:var(--a50); }
  tbody td { padding:12px 15px; font-size:13.5px; color:var(--n700); }

  /* ── CHAT LIST ───────────────────────────── */

  .ch-item {
    display:flex; align-items:flex-start; gap:11px;
    padding:13px 0; border-bottom:1px solid var(--n100);
    animation:fadeUp .32s ease both;
  }
  .ch-item:last-child { border-bottom:none; }
  .ch-av {
    width:36px; height:36px; border-radius:50%; flex-shrink:0;
    background:var(--a100); color:var(--a700);
    display:flex; align-items:center; justify-content:center;
    font-size:12px; font-weight:700;
  }
  /* chat typography: clear 3-level hierarchy */
  .ch-name { font-size:13.5px; font-weight:700; color:var(--n800); }
  .ch-msg  { font-size:13px; font-weight:400; color:var(--n600); margin-top:2px; line-height:1.5; }
  .ch-ai   { margin-top:4px; padding:4px 8px; background:var(--a50); border-radius:var(--r6); font-size:12px; font-weight:500; color:#92400e; }
  .ch-time { font-size:11px; font-weight:500; color:var(--n400); white-space:nowrap; }
  .rev-dot { width:7px; height:7px; border-radius:50%; background:var(--r500); animation:pulse 1.4s ease infinite; flex-shrink:0; }

  /* ── SEARCH / TABS ───────────────────────── */

  .s-wrap {
    display:flex; align-items:center; gap:7px;
    padding:8px 12px; border:1.5px solid var(--border);
    background:var(--n0); border-radius:var(--r8); box-shadow:var(--sh0);
  }
  .s-wrap input {
    border:none; outline:none; background:none;
    font-size:13px; font-weight:400; color:var(--n800); width:190px;
  }
  .s-wrap input::placeholder { color:var(--n300); }

  .tabs { display:flex; gap:3px; background:var(--n100); border-radius:var(--r8); padding:3px; }
  .tab {
    padding:6px 13px; border-radius:var(--r6);
    font-size:12.5px; font-weight:700; color:var(--n500);
    transition:background .12s, color .12s;
  }
  .tab.on { background:var(--n0); color:var(--n800); box-shadow:var(--sh0); }

  /* ── MODAL ───────────────────────────────── */

  .m-bg {
    position:fixed; inset:0; z-index:200;
    display:flex; align-items:center; justify-content:center; padding:20px;
    background:rgba(0,0,0,.5); backdrop-filter:blur(6px);
    animation:fadeIn .16s ease both;
  }
  .modal {
    width:min(860px,100%); max-height:92vh; overflow-y:auto;
    background:var(--n0); border-radius:var(--r24);
    box-shadow:var(--sh3); animation:scaleIn .2s ease both;
  }
  .m-head {
    position:sticky; top:0; z-index:10;
    padding:20px 24px;
    background:rgba(255,255,255,.95); backdrop-filter:blur(10px);
    border-bottom:1px solid var(--n100);
    display:flex; align-items:center; justify-content:space-between; gap:12px;
  }
  /* modal title: single weight */
  .m-title { font-size:17px; font-weight:700; color:var(--n800); letter-spacing:-0.015em; }
  .m-sub   { font-size:12.5px; font-weight:400; color:var(--n400); margin-top:2px; }
  .m-body  { padding:22px 24px; }
  .m-foot  { padding:16px 24px; border-top:1px solid var(--n100); display:flex; justify-content:flex-end; gap:8px; }

  .fg { display:grid; grid-template-columns:repeat(3,1fr); gap:13px; }
  .c2 { grid-column:span 2; } .c3 { grid-column:span 3; }
  .fsect {
    grid-column:span 3;
    font-size:10.5px; font-weight:700; color:var(--n400);
    text-transform:uppercase; letter-spacing:.08em;
    padding-bottom:6px; border-bottom:1px solid var(--n100); margin-top:4px;
  }

  /* ── TOGGLE ──────────────────────────────── */

  .tg-wrap { display:inline-flex; align-items:center; gap:8px; cursor:pointer; }
  .tg {
    width:36px; height:21px; border-radius:var(--r99);
    background:var(--n200); position:relative; transition:background .18s;
  }
  .tg.on { background:var(--g600); }
  .tg::after {
    content:''; position:absolute; top:2px; left:2px;
    width:17px; height:17px; border-radius:50%;
    background:#fff; box-shadow:0 1px 3px rgba(0,0,0,.16);
    transition:transform .18s;
  }
  .tg.on::after { transform:translateX(15px); }

  /* ── AI PARAMS ───────────────────────────── */

  .p-row {
    display:flex; align-items:flex-start; gap:13px;
    padding:15px; border-radius:var(--r16);
    background:var(--n0); border:1px solid var(--n100);
    box-shadow:var(--sh0); animation:fadeUp .32s ease both;
  }
  .p-key {
    display:inline-flex; padding:3px 7px;
    border-radius:var(--r4); background:var(--n800); color:#fff;
    font-family:monospace; font-size:11.5px; font-weight:700; flex-shrink:0;
  }

  /* ── MISC ────────────────────────────────── */

  .sec-h { display:flex; align-items:center; justify-content:space-between; gap:14px; margin-bottom:18px; }
  .divider { height:1px; background:var(--n100); margin:18px 0; }
  .empty { padding:44px; text-align:center; }
  .empty-ico { font-size:34px; opacity:.35; margin-bottom:9px; }
  .empty-txt { font-size:13.5px; font-weight:500; color:var(--n400); }

  ::-webkit-scrollbar { width:5px; height:5px; }
  ::-webkit-scrollbar-track { background:transparent; }
  ::-webkit-scrollbar-thumb { background:var(--n200); border-radius:99px; }

  /* ── RESPONSIVE ──────────────────────────── */

  @media (max-width:1100px) {
    .metric-grid { grid-template-columns:repeat(2,1fr); }
    .l-shell { grid-template-columns:1fr 370px; }
  }
  @media (max-width:840px) {
    .l-page { padding:0; }
    .l-shell { grid-template-columns:1fr; border-radius:0; min-height:100vh; }
    .l-hero { padding:38px 22px; }
    .l-form { padding:34px 22px; }
    .sidebar { width:100%; min-height:auto; position:relative; }
    .sb-nav { display:flex; gap:5px; overflow-x:auto; }
    .sb-lbl { display:none; }
    .sb-item { white-space:nowrap; width:auto; }
    .sb-foot { display:none; }
    .page { padding:18px 14px; }
    .l-stats { grid-template-columns:1fr; }
  }
  @media (max-width:560px) {
    .metric-grid { grid-template-columns:1fr; }
    .wk-grid { grid-template-columns:repeat(2,1fr); }
    .fg { grid-template-columns:1fr; }
    .c2,.c3 { grid-column:span 1; }
    .fsect { grid-column:span 1; }
  }
`;

const Ic = {
  dash: <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="7" height="9" /><rect x="14" y="3" width="7" height="5" /><rect x="14" y="12" width="7" height="9" /><rect x="3" y="16" width="7" height="5" /></svg>,
  cal: <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="4" width="18" height="18" rx="2" /><line x1="16" y1="2" x2="16" y2="6" /><line x1="8" y1="2" x2="8" y2="6" /><line x1="3" y1="10" x2="21" y2="10" /></svg>,
  wa: <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z" /><path d="M12 0C5.373 0 0 5.373 0 12c0 2.137.563 4.14 1.547 5.875L0 24l6.324-1.518A11.946 11.946 0 0012 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm0 22c-1.89 0-3.659-.502-5.19-1.378l-.37-.22-3.755.901.918-3.661-.242-.378A9.952 9.952 0 012 12C2 6.477 6.477 2 12 2s10 4.477 10 10-4.477 10-10 10z" /></svg>,
  bot: <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="11" width="18" height="10" rx="2" /><circle cx="12" cy="5" r="2" /><path d="M12 7v4" /><line x1="8" y1="16" x2="8" y2="16" /><line x1="16" y1="16" x2="16" y2="16" /></svg>,
  plus: <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" /></svg>,
  x: <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" /></svg>,
  edit: <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7" /><path d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z" /></svg>,
  srch: <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" /></svg>,
  out: <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4" /><polyline points="16 17 21 12 16 7" /><line x1="21" y1="12" x2="9" y2="12" /></svg>,
  trnd: <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="23 6 13.5 15.5 8.5 10.5 1 18" /><polyline points="17 6 23 6 23 12" /></svg>,
  usrs: <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2" /><circle cx="9" cy="7" r="4" /><path d="M23 21v-2a4 4 0 00-3-3.87" /><path d="M16 3.13a4 4 0 010 7.75" /></svg>,
  clip: <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M16 4h2a2 2 0 012 2v14a2 2 0 01-2 2H6a2 2 0 01-2-2V6a2 2 0 012-2h2" /><rect x="8" y="2" width="8" height="4" rx="1" /></svg>,
  chk: <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12" /></svg>,
  del: <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="3 6 5 6 21 6" /><path d="M19 6l-1 14a2 2 0 01-2 2H8a2 2 0 01-2-2L5 6" /><path d="M10 11v6" /><path d="M14 11v6" /><path d="M9 6V4h6v2" /></svg>,

};

function LogoMark({ variant = "dark" }) {
  return (
    <div className={`mb-logo ${variant === "light" ? "light" : "dark"}`} aria-label="MB Tech">
      <span>MB</span>
      <i />
    </div>
  );
}

function Bdg({ status }) {
  const key = String(status || "").toLowerCase();
  const c = {
    confirmado: "badge-green",
    confirmed: "badge-green",
    pendente: "badge-amber",
    pending: "badge-amber",
    cancelado: "badge-red",
    canceled: "badge-red",
    cancelled: "badge-red",
    novo_lead: "badge-blue",
    open: "badge-blue",
    negociando: "badge-amber",
    contrato_solicitado: "badge-green",
    revisao_humana: "badge-red",
  };
  const l = {
    confirmado: "Confirmado",
    confirmed: "Confirmado",
    pendente: "Pendente",
    pending: "Pendente",
    cancelado: "Cancelado",
    canceled: "Cancelado",
    cancelled: "Cancelado",
    novo_lead: "Novo Lead",
    open: "Aberto",
    negociando: "Negociando",
    contrato_solicitado: "Contrato",
    revisao_humana: "Revisão",
  };
  return <span className={`badge ${c[key] || "badge-amber"}`}>{l[key] || status || "—"}</span>;
}

function Login({ onLogin }) {
  const [email, setEmail] = useState("admin@danonagourmet.com");
  const [password, setPassword] = useState("123456");
  const [err, setErr] = useState("");
  const [busy, setBusy] = useState(false);

  async function submit(e) {
    e.preventDefault();
    setBusy(true);
    setErr("");
    try {
      const data = await api.login(email, password);
      saveSession(data);
      onLogin({ user: data.user, company: data.company });
    } catch (error) {
      setErr(getErrorMessage(error));
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="l-page">
      <style>{css}</style>
      <div className="l-shell">
        <div className="l-hero">
          <div>
            <div className="l-pill"><div className="l-pill-dot" /> MB Tech · Plataforma SaaS</div>
            <h1 className="l-h1">Gestão inteligente<br />em <em> IA </em> para seu negócio</h1>
            <p className="l-sub">A MB Tech centraliza atendimento WhatsApp, agenda de eventos, parâmetros da IA e contratos — cada cliente com seus dados isolados.</p>
            <div className="l-stats">
              {[["24/7", "IA ativa"], ["SaaS", "Multiempresa"], ["100%", "Isolado"]].map(([n, l]) => (
                <div className="l-stat" key={l}><div className="l-stat-n">{n}</div><div className="l-stat-l">{l}</div></div>
              ))}
            </div>
          </div>
        </div>
        <div className="l-form">
          <div className="l-logo">
            <LogoMark variant="light" />
            <div><div className="l-logo-name">{PLATFORM.name}</div><div className="l-logo-sub">{PLATFORM.productName}</div></div>
          </div>
          <h2 className="l-title">Acesso do cliente</h2>
          <p className="l-sub2">Acesse o painel do seu cliente com segurança.</p>
          {err && <div className="l-err">{err}</div>}
          <form onSubmit={submit}>
            <div className="fld" style={{ marginBottom: 13 }}>
              <label>E-mail</label>
              <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="cliente@empresa.com" required />
            </div>
            <div className="fld" style={{ marginBottom: 18 }}>
              <label>Senha</label>
              <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="••••••••" required />
            </div>
            <button type="submit" className="btn btn-ink" style={{ width: "100%", padding: "12px", fontSize: 14 }} disabled={busy}>
              {busy ? <span style={{ width: 15, height: 15, border: "2px solid rgba(255,255,255,.28)", borderTopColor: "#fff", borderRadius: "50%", animation: "spin .8s linear infinite", display: "inline-block" }} /> : "Entrar no painel"}
            </button>
            <button
              type="button"
              className="btn btn-outline"
              style={{ width: "100%", padding: "12px", fontSize: 14, marginTop: 10 }}
              onClick={() => {
                window.location.href = "/admin";
              }}
            >
              Acesso administrativo MB Tech
            </button>
          </form>
          <p className="l-hint">Cliente: use o usuário criado na administração. Admin MB Tech: <strong>/admin</strong></p>
        </div>
      </div>
    </div>
  );
}

function Sidebar({ user, company, tab, setTab, onLogout }) {
  const nav = [
    { id: "dashboard", label: "Dashboard", icon: Ic.dash },
    { id: "agenda", label: "Agenda", icon: Ic.cal },
    { id: "whatsapp", label: "WhatsApp IA", icon: Ic.wa },
    { id: "parametros", label: "Parâmetros IA", icon: Ic.bot },
  ];
  return (
    <nav className="sidebar">
      <div className="sb-logo">
        <LogoMark variant="dark" />
        <div><div className="sb-name">{company?.name || "Empresa"}</div><div className="sb-app">Cliente MB Tech</div></div>
      </div>
      <div className="sb-nav">
        <div className="sb-lbl">Menu</div>
        {nav.map((item, i) => (
          <button key={item.id} className={`sb-item ${tab === item.id ? "on" : ""}`} style={{ animationDelay: `${i * 0.05}s` }} onClick={() => setTab(item.id)}>
            {item.icon} {item.label}
          </button>
        ))}
      </div>
      <div className="sb-foot">
        <div className="sb-user">
          <div className="sb-av">{initials(user?.name)}</div>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div className="sb-uname" style={{ overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{user?.name}</div>
            <div className="sb-urole">{user?.role}</div>
          </div>
          <button onClick={onLogout} style={{ color: "rgba(255,255,255,.3)", padding: 4 }} title="Sair">{Ic.out}</button>
        </div>
      </div>
    </nav>
  );
}

function LoadingPage() {
  return (
    <div className="page">
      <div className="card p24" style={{ textAlign: "center" }}>
        <span style={{ width: 22, height: 22, border: "3px solid var(--n200)", borderTopColor: "var(--a600)", borderRadius: "50%", animation: "spin .8s linear infinite", display: "inline-block" }} />
        <div className="tx-meta" style={{ marginTop: 10 }}>Carregando dados...</div>
      </div>
    </div>
  );
}

function Dashboard({ company, dashboard, loading }) {
  const stats = dashboard?.stats || { total_chats: 0, new_leads: 0, contracts_requested: 0, events_created: 0, pending_human_review: 0, conversion_rate: 0, avg_response_time_seconds: 0, weekly: [0, 0, 0, 0, 0, 0, 0], recent: [] };
  const events = dashboard?.events || [];
  const weekDays = getWeekDays(dashboard?.today || TODAY);
  const maxBar = Math.max(1, ...(stats.weekly || []));
  const metrics = [
    { icon: Ic.wa, label: "Conversas hoje", value: stats.total_chats, sub: `↑ ${stats.new_leads} novos leads`, ib: "#dcfce7", ic: "#16a34a" },
    { icon: Ic.usrs, label: "Leads captados", value: stats.new_leads, sub: "Contatos interessados", ib: "#dbeafe", ic: "#2563eb" },
    { icon: Ic.clip, label: "Contratos pedidos", value: stats.contracts_requested, sub: "Aguardando envio", ib: "#fef3c7", ic: "#d97706" },
    { icon: Ic.trnd, label: "Taxa conversão", value: `${stats.conversion_rate}%`, sub: `Resp. média: ${stats.avg_response_time_seconds || 0}s`, ib: "#f0fdf4", ic: "#16a34a" },
  ];
  if (loading) return <LoadingPage />;
  return (
    <div className="page">
      <div style={{ marginBottom: 22, animation: "fadeUp .4s ease both" }}>
        <div className="tx-title">Visão geral</div>
        <div className="tx-meta" style={{ marginTop: 3 }}>Hoje, {fmtDateFull(dashboard?.today || TODAY)} · {company.name}</div>
      </div>
      <div className="metric-grid" style={{ marginBottom: 20 }}>
        {metrics.map((m, i) => (
          <div className="metric-card" key={m.label} style={{ animationDelay: `${i * 0.07}s` }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
              <div><div className="tx-label" style={{ marginBottom: 8 }}>{m.label}</div><div className="tx-num">{m.value}</div><div className="tx-meta" style={{ marginTop: 5 }}>{m.sub}</div></div>
              <div style={{ width: 38, height: 38, borderRadius: 10, background: m.ib, color: m.ic, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>{m.icon}</div>
            </div>
          </div>
        ))}
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 240px", gap: 16, marginBottom: 20 }}>
        <div className="card p20">
          <div className="sec-h" style={{ marginBottom: 14 }}><div><div className="tx-section">Agenda da semana</div><div className="tx-meta" style={{ marginTop: 2 }}>Eventos programados</div></div></div>
          <div className="wk-grid">
            {weekDays.map((day, i) => {
              const de = events.filter((e) => e.event_date === day);
              return (
                <div key={day} className={`wk-day ${day === (dashboard?.today || TODAY) ? "today" : ""}`} style={{ animationDelay: `${i * 0.04}s` }}>
                  <div className="wk-day-name">{WEEK_PT[i]}</div><div className="wk-day-num">{day.slice(8)}</div>
                  {de.map((ev) => <button key={ev.id} className={`ev-chip ${ev.status === "confirmado" ? "ch-ok" : "ch-pnd"}`}>{ev.event_time} {ev.event_type}</button>)}
                  {de.length === 0 && <div className="tx-meta" style={{ marginTop: 7 }}>Livre</div>}
                </div>
              );
            })}
          </div>
        </div>
        <div className="card p20">
          <div className="tx-section" style={{ marginBottom: 2 }}>Conversas</div><div className="tx-meta" style={{ marginBottom: 16 }}>WhatsApp · 7 dias</div>
          <div style={{ display: "flex", alignItems: "flex-end", gap: 4, height: 76 }}>
            {(stats.weekly || []).map((v, i) => <div key={i} className="bar" style={{ height: `${(Number(v) / maxBar) * 100}%`, opacity: i === 6 ? 1 : 0.45, animationDelay: `${i * 0.06}s` }} title={`${WEEK_PT[i]}: ${v}`} />)}
          </div>
          <div style={{ display: "flex", justifyContent: "space-between", marginTop: 5 }}>{WEEK_PT.map((d) => <span key={d} style={{ fontSize: 9, fontWeight: 600, color: "var(--n400)" }}>{d}</span>)}</div>
          <div className="divider" />
          {[{ l: "Revisão humana", v: stats.pending_human_review, c: "var(--r600)" }, { l: "Eventos criados", v: stats.events_created, c: "var(--g600)" }].map((r) => (
            <div key={r.l} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8 }}><span className="tx-body" style={{ fontSize: 12.5 }}>{r.l}</span><span style={{ fontSize: 13.5, fontWeight: 700, color: r.c }}>{r.v}</span></div>
          ))}
        </div>
      </div>
      <div className="card p20">
        <div className="sec-h"><div><div className="tx-section">Atendimentos recentes</div><div className="tx-meta" style={{ marginTop: 2 }}>WhatsApp · hoje</div></div><span className="badge badge-blue">{stats.total_chats} conversas</span></div>
        {(stats.recent || []).length === 0 ? <div className="empty"><div className="empty-ico">💬</div><div className="empty-txt">Nenhum atendimento ainda</div></div> : stats.recent.map((c, i) => <ConversationItem key={c.id} c={c} i={i} />)}
      </div>
    </div>
  );
}

const EV0 = { customer_name: "", customer_phone: "", document: "", street: "", number: "", district: "", city: "", zip_code: "", room_name: "", room_address: "", ceremonial_contact: "", event_date: "", event_time: "", event_type: "", guests: "", notes: "", status: "pendente" };

function EvModal({ ev, onClose, onSave }) {
  const [f, sf] = useState(ev ? { ...EV0, ...ev } : { ...EV0 });
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState("");
  const s = (k, v) => sf((p) => ({ ...p, [k]: v }));
  async function save(e) {
    e.preventDefault();
    setBusy(true);
    setErr("");
    try {
      await onSave({ ...f, guests: Number(f.guests || 0) });
    } catch (error) {
      setErr(getErrorMessage(error));
    } finally {
      setBusy(false);
    }
  }
  return (
    <div className="m-bg" onClick={(e) => e.target === e.currentTarget && onClose()}>
      <form className="modal" onSubmit={save}>
        <div className="m-head"><div><div className="m-title">{ev ? "Editar evento" : "Novo evento"}</div><div className="m-sub">Dados salvos no PostgreSQL/Supabase</div></div><button type="button" className="btn btn-outline btn-sm" onClick={onClose}>{Ic.x}</button></div>
        <div className="m-body">
          {err && <div className="l-err">{err}</div>}
          <div className="fg">
            <div className="fsect">Cliente</div>
            <div className="fld c2"><label>Nome completo *</label><input required value={f.customer_name || ""} onChange={(e) => s("customer_name", e.target.value)} /></div>
            <div className="fld"><label>CPF / CNPJ</label><input value={f.document || ""} onChange={(e) => s("document", e.target.value)} /></div>
            <div className="fld"><label>Telefone</label><input value={f.customer_phone || ""} onChange={(e) => s("customer_phone", e.target.value)} /></div>
            <div className="fld"><label>Rua</label><input value={f.street || ""} onChange={(e) => s("street", e.target.value)} /></div>
            <div className="fld"><label>Número</label><input value={f.number || ""} onChange={(e) => s("number", e.target.value)} /></div>
            <div className="fld"><label>Bairro</label><input value={f.district || ""} onChange={(e) => s("district", e.target.value)} /></div>
            <div className="fld"><label>Cidade</label><input value={f.city || ""} onChange={(e) => s("city", e.target.value)} /></div>
            <div className="fld"><label>CEP</label><input value={f.zip_code || ""} onChange={(e) => s("zip_code", e.target.value)} /></div>
            <div className="fsect">Evento</div>
            <div className="fld"><label>Tipo *</label><select required value={f.event_type || ""} onChange={(e) => s("event_type", e.target.value)}><option value="">Selecione...</option>{["Casamento", "15 anos", "Aniversário", "Corporativo", "Formatura", "Batizado", "Outro"].map((t) => <option key={t}>{t}</option>)}</select></div>
            <div className="fld"><label>Data *</label><input type="date" required value={f.event_date || ""} onChange={(e) => s("event_date", e.target.value)} /></div>
            <div className="fld"><label>Horário</label><input type="time" value={f.event_time || ""} onChange={(e) => s("event_time", e.target.value)} /></div>
            <div className="fld"><label>Convidados</label><input type="number" min="0" value={f.guests || ""} onChange={(e) => s("guests", e.target.value)} /></div>
            <div className="fld c2"><label>Nome do salão</label><input value={f.room_name || ""} onChange={(e) => s("room_name", e.target.value)} /></div>
            <div className="fld c3"><label>Endereço do evento</label><input value={f.room_address || ""} onChange={(e) => s("room_address", e.target.value)} /></div>
            <div className="fld c2"><label>Contato da(o) cerimonialista</label><input value={f.ceremonial_contact || ""} onChange={(e) => s("ceremonial_contact", e.target.value)} /></div>
            <div className="fld"><label>Status</label><select value={f.status || "pendente"} onChange={(e) => s("status", e.target.value)}><option value="pendente">Pendente</option><option value="confirmado">Confirmado</option><option value="cancelado">Cancelado</option></select></div>
            <div className="fld c3"><label>Observações</label><textarea value={f.notes || ""} onChange={(e) => s("notes", e.target.value)} placeholder="Cascata de chocolate, restrições alimentares, horário de montagem..." /></div>
          </div>
        </div>
        <div className="m-foot"><button type="button" className="btn btn-outline" onClick={onClose}>Cancelar</button><button type="submit" className="btn btn-gold" disabled={busy}>{Ic.chk} {busy ? "Salvando..." : "Salvar evento"}</button></div>
      </form>
    </div>
  );
}

function Agenda({ company, events, setEvents, refreshDashboard }) {
  const [q, setQ] = useState("");
  const [ev, setEv] = useState(null);
  const [cr, setCr] = useState(false);
  const [vw, setVw] = useState("table");
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState("");

  async function load() {
    setLoading(true);
    setErr("");
    try {
      const data = await api.getAppointments(q);
      setEvents(data.events || []);
    } catch (error) {
      setErr(getErrorMessage(error));
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => { load(); }, []);

  const list = useMemo(() => {
    const t = q.toLowerCase();
    if (!t) return events;
    return events.filter((e) => [e.customer_name, e.event_type, e.room_name, e.status, e.event_date, e.city].some((v) => String(v || "").toLowerCase().includes(t)));
  }, [events, q]);

  async function save(data) {
    const saved = data.id ? await api.updateAppointment(data.id, data) : await api.createAppointment(data);
    const event = saved.event;
    setEvents((es) => (es.find((e) => e.id === event.id) ? es.map((e) => (e.id === event.id ? event : e)) : [event, ...es]));
    setCr(false);
    setEv(null);
    refreshDashboard?.();
  }

  return (
    <div className="page">
      {(cr || ev) && <EvModal ev={ev} onClose={() => { setCr(false); setEv(null); }} onSave={save} />}
      <div className="sec-h" style={{ marginBottom: 20 }}>
        <div><div className="tx-title">Agenda de eventos</div><div className="tx-meta" style={{ marginTop: 3 }}>{list.length} evento(s) · {company.name}</div></div>
        <div style={{ display: "flex", gap: 8, alignItems: "center", flexWrap: "wrap" }}>
          <div className="s-wrap">{Ic.srch}<input value={q} onChange={(e) => setQ(e.target.value)} onKeyDown={(e) => e.key === "Enter" && load()} placeholder="Buscar..." /></div>
          <button className="btn btn-outline" onClick={load}>Buscar</button>
          <div className="tabs"><button className={`tab ${vw === "table" ? "on" : ""}`} onClick={() => setVw("table")}>Lista</button><button className={`tab ${vw === "calendar" ? "on" : ""}`} onClick={() => setVw("calendar")}>Semana</button></div>
          <button className="btn btn-gold" onClick={() => setCr(true)}>{Ic.plus} Novo evento</button>
        </div>
      </div>
      {err && <div className="l-err">{err}</div>}
      {loading && <div className="tx-meta" style={{ marginBottom: 10 }}>Carregando eventos...</div>}
      {vw === "table" && <EventsTable list={list} setEv={setEv} />}
      {vw === "calendar" && <EventsCalendar events={events} setEv={setEv} />}
    </div>
  );
}

function EventsTable({ list, setEv }) {
  return (
    <div className="card"><div className="t-wrap"><table><thead><tr><th>Cliente</th><th>Tipo</th><th>Data</th><th>Salão / Cidade</th><th style={{ textAlign: "center" }}>Conv.</th><th>Status</th><th></th></tr></thead><tbody>
      {list.length === 0 && <tr><td colSpan={7} style={{ textAlign: "center", padding: 40, color: "var(--n400)" }}>Nenhum evento encontrado</td></tr>}
      {list.map((ev, i) => <tr key={ev.id} style={{ animation: `fadeUp .32s ease ${i * 0.04}s both` }}><td><div style={{ display: "flex", alignItems: "center", gap: 9 }}><div style={{ width: 32, height: 32, borderRadius: "50%", background: "var(--a100)", color: "var(--a700)", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 700, fontSize: 11.5, flexShrink: 0 }}>{initials(ev.customer_name)}</div><div><div style={{ fontWeight: 600, fontSize: 13.5, color: "var(--n800)" }}>{ev.customer_name}</div><div className="tx-meta">{ev.document || ev.customer_phone || "—"}</div></div></div></td><td style={{ fontWeight: 600 }}>{ev.event_type}</td><td>{fmtDateFull(ev.event_date)}{ev.event_time && <span className="tx-meta"> · {ev.event_time}</span>}</td><td><div style={{ fontWeight: 500 }}>{ev.room_name}</div><div className="tx-meta">{ev.city}</div></td><td style={{ textAlign: "center", fontWeight: 600 }}>{ev.guests || "—"}</td><td><Bdg status={ev.status} /></td><td><button className="btn btn-outline btn-sm" onClick={() => setEv(ev)}>{Ic.edit} Editar</button></td></tr>)}
    </tbody></table></div></div>
  );
}

function EventsCalendar({ events, setEv }) {
  return <div className="card p20"><div className="wk-grid">{getWeekDays().map((day, i) => { const de = events.filter((e) => e.event_date === day); return <div key={day} className={`wk-day ${day === TODAY ? "today" : ""}`} style={{ minHeight: 140, animationDelay: `${i * 0.04}s` }}><div className="wk-day-name">{WEEK_PT[i]}</div><div className="wk-day-num">{day.slice(8)}/{day.slice(5, 7)}</div>{de.map((ev) => <button key={ev.id} className={`ev-chip ${ev.status === "confirmado" ? "ch-ok" : "ch-pnd"}`} onClick={() => setEv(ev)}>{ev.event_time && `${ev.event_time} · `}{ev.event_type}<br /><span style={{ fontWeight: 400 }}>{ev.customer_name}</span></button>)}{de.length === 0 && <div className="tx-meta" style={{ marginTop: 7 }}>Sem eventos</div>}</div>; })}</div></div>;
}

function ConversationItem({ c, i }) {
  return <div className="ch-item" style={{ animationDelay: `${i * 0.05}s` }}><div className="ch-av">{initials(c.customer_name)}</div><div style={{ flex: 1, minWidth: 0 }}><div style={{ display: "flex", alignItems: "center", gap: 7, flexWrap: "wrap" }}><span className="ch-name">{c.customer_name}</span><Bdg status={c.status} />{c.human_review_required && <div className="rev-dot" />}</div><div className="ch-msg">{c.last_message}</div>{c.ai_summary && <div className="ch-ai">🤖 {c.ai_summary}</div>}<div className="tx-meta" style={{ marginTop: 3 }}>📱 {c.customer_phone || c.customer_username || "—"}</div></div><div className="ch-time">{String(c.created_at || c.last_message_at || "").slice(11, 16)}</div></div>;
}

function WhatsApp({ dashboard }) {
  const [conversations, setConversations] = useState([]);
  const [q, setQ] = useState("");
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState("");
  const stats = dashboard?.stats || { total_chats: 0, new_leads: 0, contracts_requested: 0, pending_human_review: 0, conversion_rate: 0, avg_response_time_seconds: 0, weekly: [0, 0, 0, 0, 0, 0, 0] };
  const maxBar = Math.max(1, ...(stats.weekly || []));
  async function load() { setLoading(true); setErr(""); try { const data = await api.getConversations({ q }); setConversations(data.conversations || []); } catch (error) { setErr(getErrorMessage(error)); } finally { setLoading(false); } }
  useEffect(() => { load(); }, []);
  const metrics = [{ l: "Conversas", v: stats.total_chats, e: "💬" }, { l: "Novos leads", v: stats.new_leads, e: "🎯" }, { l: "Contratos", v: stats.contracts_requested, e: "📋" }, { l: "Revisão humana", v: stats.pending_human_review, e: "⚠️" }];
  return <div className="page"><div style={{ marginBottom: 22, animation: "fadeUp .4s ease both" }}><div className="tx-title">Atendimentos WhatsApp</div><div className="tx-meta" style={{ marginTop: 3 }}>Hoje, {fmtDateFull(TODAY)}</div></div><div className="metric-grid" style={{ marginBottom: 20 }}>{metrics.map((m, i) => <div className="metric-card" key={m.l} style={{ animationDelay: `${i * 0.07}s` }}><div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}><div><div className="tx-label" style={{ marginBottom: 8 }}>{m.l}</div><div className="tx-num">{m.v}</div></div><span style={{ fontSize: 24 }}>{m.e}</span></div></div>)}</div><div style={{ display: "grid", gridTemplateColumns: "260px 1fr", gap: 16 }}><div className="card p20"><div className="tx-section" style={{ marginBottom: 2 }}>Volume semanal</div><div className="tx-meta" style={{ marginBottom: 18 }}>WhatsApp · 7 dias</div><div style={{ display: "flex", alignItems: "flex-end", gap: 4, height: 86 }}>{(stats.weekly || []).map((v, i) => <div key={i} style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", gap: 4 }}><span style={{ fontSize: 9, fontWeight: 600, color: "var(--n400)" }}>{v}</span><div className="bar" style={{ width: "100%", height: `${(Number(v) / maxBar) * 70}px`, opacity: i === 6 ? 1 : 0.45, animationDelay: `${i * 0.06}s` }} /><span style={{ fontSize: 9, fontWeight: 600, color: "var(--n400)" }}>{WEEK_PT[i]}</span></div>)}</div><div className="divider" /><div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 9 }}>{[{ l: "Conversão", v: `${stats.conversion_rate}%`, bg: "var(--g50)", c: "#065f46" }, { l: "Resp. média", v: `${stats.avg_response_time_seconds || 0}s`, bg: "var(--b50)", c: "#1e40af" }].map((r) => <div key={r.l} style={{ padding: "11px", background: r.bg, borderRadius: "var(--r8)" }}><div style={{ fontSize: 10, fontWeight: 700, color: r.c, textTransform: "uppercase", letterSpacing: ".06em", marginBottom: 3 }}>{r.l}</div><div style={{ fontSize: 20, fontWeight: 800, color: r.c, letterSpacing: "-0.04em" }}>{r.v}</div></div>)}</div></div><div className="card p20"><div className="sec-h"><div><div className="tx-section">Conversas recentes</div><div className="tx-meta" style={{ marginTop: 2 }}>Atendimentos salvos no banco</div></div><div style={{ display: "flex", gap: 8 }}><div className="s-wrap">{Ic.srch}<input value={q} onChange={(e) => setQ(e.target.value)} onKeyDown={(e) => e.key === "Enter" && load()} placeholder="Buscar..." /></div><button className="btn btn-outline" onClick={load}>Buscar</button></div></div>{err && <div className="l-err">{err}</div>}{loading && <div className="tx-meta">Carregando conversas...</div>}{conversations.length === 0 ? <div className="empty"><div className="empty-ico">💬</div><div className="empty-txt">Nenhuma conversa</div></div> : conversations.map((c, i) => <ConversationItem key={c.id} c={c} i={i} />)}</div></div></div>;
}

const PM0 = { parameter_key: "", parameter_value: "", description: "", is_active: true };
function PModal({ param, onClose, onSave }) {
  const [f, sf] = useState(param ? { ...param } : { ...PM0 });
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState("");
  const s = (k, v) => sf((p) => ({ ...p, [k]: v }));
  async function save() { setBusy(true); setErr(""); try { await onSave(f); } catch (error) { setErr(getErrorMessage(error)); } finally { setBusy(false); } }
  return <div className="m-bg" onClick={(e) => e.target === e.currentTarget && onClose()}><div className="modal" style={{ maxWidth: 500 }}><div className="m-head"><div className="m-title">{param ? "Editar parâmetro" : "Novo parâmetro"}</div><button className="btn btn-outline btn-sm" onClick={onClose}>{Ic.x}</button></div><div className="m-body">{err && <div className="l-err">{err}</div>}<div style={{ display: "flex", flexDirection: "column", gap: 13 }}><div className="fld"><label>Chave (parameter_key)</label><input placeholder="ex.: servicos_oferecidos" value={f.parameter_key || ""} onChange={(e) => s("parameter_key", e.target.value.replace(/\s/g, "_"))} /></div><div className="fld"><label>Valor</label><textarea placeholder="Valor que a IA usará ao responder clientes..." value={f.parameter_value || ""} onChange={(e) => s("parameter_value", e.target.value)} /></div><div className="fld"><label>Descrição (interna)</label><input placeholder="Para que serve este parâmetro?" value={f.description || ""} onChange={(e) => s("description", e.target.value)} /></div><div className="tg-wrap" onClick={() => s("is_active", !f.is_active)}><div className={`tg ${f.is_active ? "on" : ""}`} /><span style={{ fontSize: 13.5, fontWeight: 500, color: "var(--n700)" }}>Parâmetro ativo</span></div></div></div><div className="m-foot"><button className="btn btn-outline" onClick={onClose}>Cancelar</button><button className="btn btn-gold" onClick={save} disabled={busy || !f.parameter_key || !f.parameter_value}>{Ic.chk} {busy ? "Salvando..." : "Salvar"}</button></div></div></div>;
}

function AiParams({ company }) {
  const [params, setParams] = useState([]);
  const [modal, setModal] = useState(null);
  const [cr, setCr] = useState(false);
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState("");
  async function load() { setLoading(true); setErr(""); try { const data = await api.getAiParameters(); setParams(data.params || data.ai_parameters || []); } catch (error) { setErr(getErrorMessage(error)); } finally { setLoading(false); } }
  useEffect(() => { load(); }, []);
  async function save(data) { const saved = data.id ? await api.updateAiParameter(data.id, data) : await api.createAiParameter(data); const param = saved.param; setParams((ps) => (ps.find((p) => p.id === param.id) ? ps.map((p) => (p.id === param.id ? param : p)) : [...ps, param])); setCr(false); setModal(null); }
  async function remove(id) { if (!window.confirm("Remover?")) return; await api.deleteAiParameter(id); setParams((ps) => ps.filter((p) => p.id !== id)); }
  async function toggle(p) { const saved = await api.updateAiParameter(p.id, { is_active: !p.is_active, description: p.description ?? "" }); setParams((ps) => ps.map((x) => (x.id === p.id ? saved.param : x))); }
  return <div className="page">{(cr || modal) && <PModal param={modal} onClose={() => { setCr(false); setModal(null); }} onSave={save} />}<div className="sec-h"><div><div className="tx-title">Parâmetros da IA</div><div className="tx-meta" style={{ marginTop: 3 }}>Dados que o agente N8N usa para responder clientes · {company.name}</div></div><button className="btn btn-gold" onClick={() => setCr(true)}>{Ic.plus} Novo parâmetro</button></div><div className="card p20" style={{ marginBottom: 16, display: "flex", alignItems: "flex-start", gap: 13 }}><div style={{ width: 36, height: 36, background: "var(--a50)", borderRadius: "var(--r8)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 18, flexShrink: 0 }}>🤖</div><div><div style={{ fontSize: 14, fontWeight: 700, color: "var(--n800)", marginBottom: 3 }}>Como funciona</div><div className="tx-body" style={{ fontSize: 13 }}>O agente do N8N consulta estes parâmetros via API usando a empresa autenticada. Cada empresa tem dados completamente isolados.</div></div></div>{err && <div className="l-err">{err}</div>}{loading && <div className="tx-meta">Carregando parâmetros...</div>}{params.length === 0 ? <div className="empty card p20"><div className="empty-ico">🔑</div><div className="empty-txt">Nenhum parâmetro cadastrado.</div></div> : <div style={{ display: "flex", flexDirection: "column", gap: 9 }}>{params.map((p, i) => <div key={p.id} className="p-row" style={{ animationDelay: `${i * 0.05}s` }}><div style={{ flex: 1, minWidth: 0 }}><div style={{ display: "flex", alignItems: "center", gap: 7, marginBottom: 5 }}><span className="p-key">{p.parameter_key}</span>{!p.is_active && <span className="badge badge-amber">Inativo</span>}</div><div style={{ fontSize: 13.5, fontWeight: 400, color: "var(--n600)", lineHeight: 1.55, marginBottom: 2 }}>{p.parameter_value}</div>{p.description && <div className="tx-meta">{p.description}</div>}</div><div style={{ display: "flex", alignItems: "center", gap: 7, flexShrink: 0 }}><div className="tg-wrap" onClick={() => toggle(p)}><div className={`tg ${p.is_active ? "on" : ""}`} style={{ transform: "scale(.82)" }} /></div><button className="btn btn-outline btn-sm" onClick={() => setModal(p)}>{Ic.edit}</button><button className="btn btn-del btn-sm" onClick={() => remove(p.id)}>{Ic.del}</button></div></div>)}</div>}</div>;
}


function isPublicPolicyPath(pathname) {
  const cleanPath = String(pathname || "/").replace(/\/+$/, "") || "/";

  return (
    cleanPath === "/politicas" ||
    cleanPath === "/politicas/bibliotech" ||
    cleanPath === "/politicas/churchapp"
  );
}

const policyStyles = {
  page: {
    minHeight: "100vh",
    background: "#f8f7f4",
    color: "#1b1b18",
    fontFamily:
      "'Plus Jakarta Sans', system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
    padding: "40px 20px",
  },
  centerPage: {
    minHeight: "100vh",
    background: "#f8f7f4",
    color: "#1b1b18",
    fontFamily:
      "'Plus Jakarta Sans', system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
    padding: "40px 20px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  document: {
    width: "100%",
    maxWidth: 920,
    margin: "0 auto",
    background: "#ffffff",
    border: "1px solid #eeeeeb",
    borderRadius: 28,
    padding: 32,
    boxShadow: "0 20px 60px rgba(0,0,0,.08)",
  },
  card: {
    width: "100%",
    maxWidth: 760,
    background: "#ffffff",
    border: "1px solid #eeeeeb",
    borderRadius: 28,
    padding: 32,
    boxShadow: "0 20px 60px rgba(0,0,0,.08)",
  },
  badge: {
    display: "inline-flex",
    padding: "7px 12px",
    borderRadius: 999,
    background: "#fffbeb",
    color: "#b45309",
    fontSize: 12,
    fontWeight: 800,
    textTransform: "uppercase",
    letterSpacing: ".08em",
    marginBottom: 16,
  },
  title: {
    fontSize: 38,
    lineHeight: 1.1,
    fontWeight: 800,
    letterSpacing: "-.04em",
    margin: 0,
    marginBottom: 10,
  },
  description: {
    fontSize: 15,
    lineHeight: 1.8,
    color: "#4b4b46",
    margin: 0,
    marginBottom: 12,
  },
  updated: {
    color: "#777771",
    fontSize: 14,
    margin: 0,
  },
  header: {
    borderBottom: "1px solid #eeeeeb",
    paddingBottom: 22,
    marginBottom: 26,
  },
  section: {
    marginBottom: 24,
  },
  subtitle: {
    fontSize: 19,
    fontWeight: 800,
    margin: 0,
    marginBottom: 10,
    color: "#1b1b18",
  },
  contact: {
    fontSize: 15,
    fontWeight: 800,
    color: "#b45309",
    margin: 0,
  },
  links: {
    display: "grid",
    gap: 12,
    marginTop: 24,
  },
  linkCard: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 16,
    padding: 18,
    borderRadius: 18,
    background: "#fafaf8",
    border: "1px solid #eeeeeb",
    textDecoration: "none",
    color: "#1b1b18",
  },
  linkTitle: {
    display: "block",
    fontSize: 16,
    fontWeight: 800,
    marginBottom: 4,
  },
  linkDescription: {
    fontSize: 13,
    color: "#777771",
    margin: 0,
    lineHeight: 1.5,
  },
  arrow: {
    width: 34,
    height: 34,
    borderRadius: 999,
    background: "#101010",
    color: "#ffffff",
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    fontWeight: 800,
    flexShrink: 0,
  },
};

function PolicyListPage() {
  return (
    <main style={policyStyles.centerPage}>
      <style>{css}</style>

      <section style={policyStyles.card}>
        <div style={policyStyles.badge}>MB Tech</div>

        <h1 style={policyStyles.title}>Políticas de Privacidade</h1>

        <p style={policyStyles.description}>
          Esta página reúne as políticas de privacidade públicas dos aplicativos
          disponibilizados pela MB Tech.
        </p>

        <div style={policyStyles.links}>
          <a href="/politicas/bibliotech" style={policyStyles.linkCard}>
            <div>
              <strong style={policyStyles.linkTitle}>Bibliotech</strong>
              <p style={policyStyles.linkDescription}>
                Política de privacidade do aplicativo Bibliotech.
              </p>
            </div>
            <span style={policyStyles.arrow}>→</span>
          </a>

          <a href="/politicas/churchapp" style={policyStyles.linkCard}>
            <div>
              <strong style={policyStyles.linkTitle}>ChurchApp</strong>
              <p style={policyStyles.linkDescription}>
                Política de privacidade do aplicativo ChurchApp.
              </p>
            </div>
            <span style={policyStyles.arrow}>→</span>
          </a>
        </div>
      </section>
    </main>
  );
}

function PolicyDocumentPage({ app }) {
  const isBibliotech = app === "bibliotech";

  const appName = isBibliotech ? "Bibliotech" : "ChurchApp";
  const updatedAt = "22 de maio de 2026";
  const contactEmail = PLATFORM.supportEmail || "suporte@mbtech.com.br";

  return (
    <main style={policyStyles.page}>
      <style>{css}</style>

      <article style={policyStyles.document}>
        <header style={policyStyles.header}>
          <div style={policyStyles.badge}>{appName}</div>

          <h1 style={policyStyles.title}>Política de Privacidade</h1>

          <p style={policyStyles.updated}>
            Última atualização: {updatedAt}
          </p>
        </header>

        <section style={policyStyles.section}>
          <p style={policyStyles.description}>
            Esta Política de Privacidade descreve como o aplicativo {appName}
            coleta, utiliza, armazena e protege as informações dos usuários.
            Ao utilizar o aplicativo, o usuário declara estar ciente e de acordo
            com as práticas descritas nesta política.
          </p>
        </section>

        <section style={policyStyles.section}>
          <h2 style={policyStyles.subtitle}>1. Informações coletadas</h2>

          {isBibliotech ? (
            <>
              <p style={policyStyles.description}>
                O Bibliotech pode coletar informações fornecidas diretamente pelo
                usuário, como nome, e-mail, dados de perfil, preferências de
                leitura, livros cadastrados, status de leitura e demais
                informações inseridas voluntariamente no aplicativo.
              </p>

              <p style={policyStyles.description}>
                Também podem ser coletadas informações técnicas necessárias para
                o funcionamento da aplicação, como identificadores do dispositivo,
                dados de autenticação, registros de acesso e informações de uso.
              </p>
            </>
          ) : (
            <>
              <p style={policyStyles.description}>
                O ChurchApp pode coletar informações fornecidas diretamente pelo
                usuário, como nome, e-mail, telefone, foto de perfil, vínculo com
                igreja, permissões de acesso, participação em células, eventos,
                avisos e demais informações necessárias para o funcionamento da
                aplicação.
              </p>

              <p style={policyStyles.description}>
                Também podem ser coletadas informações técnicas relacionadas ao
                uso do aplicativo, autenticação, dispositivo, registros de acesso
                e interações realizadas dentro da plataforma.
              </p>
            </>
          )}
        </section>

        <section style={policyStyles.section}>
          <h2 style={policyStyles.subtitle}>2. Uso das informações</h2>

          {isBibliotech ? (
            <>
              <p style={policyStyles.description}>
                As informações coletadas são utilizadas para permitir o
                funcionamento do aplicativo, gerenciar bibliotecas pessoais,
                organizar livros, exibir informações relacionadas ao perfil do
                usuário e melhorar a experiência de uso.
              </p>

              <p style={policyStyles.description}>
                Os dados também podem ser utilizados para autenticação,
                segurança, prevenção de uso indevido, suporte ao usuário e
                melhoria contínua dos recursos oferecidos.
              </p>
            </>
          ) : (
            <>
              <p style={policyStyles.description}>
                As informações coletadas são utilizadas para permitir o
                funcionamento do ChurchApp, incluindo cadastro de membros,
                gerenciamento de igrejas, células, eventos, notícias,
                aniversariantes, permissões de acesso e demais funcionalidades
                relacionadas à comunidade.
              </p>

              <p style={policyStyles.description}>
                Os dados também podem ser utilizados para autenticação,
                segurança, comunicação interna, suporte ao usuário e melhoria
                contínua da aplicação.
              </p>
            </>
          )}
        </section>

        <section style={policyStyles.section}>
          <h2 style={policyStyles.subtitle}>3. Compartilhamento de informações</h2>

          {isBibliotech ? (
            <p style={policyStyles.description}>
              O Bibliotech não vende dados pessoais dos usuários. As informações
              poderão ser compartilhadas apenas quando necessário para o
              funcionamento do serviço, cumprimento de obrigação legal, proteção
              dos direitos da aplicação ou mediante consentimento do usuário.
            </p>
          ) : (
            <>
              <p style={policyStyles.description}>
                O ChurchApp não vende dados pessoais dos usuários. Algumas
                informações podem ser visualizadas por administradores ou membros
                autorizados da igreja, de acordo com as permissões e
                funcionalidades disponíveis no aplicativo.
              </p>

              <p style={policyStyles.description}>
                O compartilhamento também poderá ocorrer quando necessário para
                cumprimento de obrigação legal, proteção de direitos ou operação
                técnica do serviço.
              </p>
            </>
          )}
        </section>

        <section style={policyStyles.section}>
          <h2 style={policyStyles.subtitle}>4. Armazenamento e segurança</h2>

          <p style={policyStyles.description}>
            As informações são armazenadas em ambientes protegidos e utilizadas
            com medidas técnicas e organizacionais razoáveis para preservar a
            segurança dos dados. Apesar dos esforços de proteção, nenhum sistema
            eletrônico é completamente livre de riscos.
          </p>
        </section>

        {!isBibliotech && (
          <section style={policyStyles.section}>
            <h2 style={policyStyles.subtitle}>5. Permissões do aplicativo</h2>

            <p style={policyStyles.description}>
              O ChurchApp poderá solicitar permissões do dispositivo apenas
              quando forem necessárias para funcionalidades específicas, como
              seleção de imagens, envio de fotos ou recursos relacionados à
              experiência do usuário.
            </p>
          </section>
        )}

        <section style={policyStyles.section}>
          <h2 style={policyStyles.subtitle}>
            {isBibliotech ? "5" : "6"}. Direitos do usuário
          </h2>

          <p style={policyStyles.description}>
            O usuário pode solicitar acesso, correção ou exclusão de seus dados,
            quando aplicável, entrando em contato pelos canais oficiais de
            suporte informados nesta política.
          </p>
        </section>

        <section style={policyStyles.section}>
          <h2 style={policyStyles.subtitle}>
            {isBibliotech ? "6" : "7"}. Alterações nesta política
          </h2>

          <p style={policyStyles.description}>
            Esta Política de Privacidade poderá ser atualizada periodicamente.
            A versão mais recente estará sempre disponível nesta página pública.
          </p>
        </section>

        <section style={policyStyles.section}>
          <h2 style={policyStyles.subtitle}>
            {isBibliotech ? "7" : "8"}. Contato
          </h2>

          <p style={policyStyles.description}>
            Em caso de dúvidas sobre esta Política de Privacidade, entre em
            contato pelo e-mail:
          </p>

          <p style={policyStyles.contact}>{contactEmail}</p>
        </section>
      </article>
    </main>
  );
}

function PublicPolicyRouter() {
  const cleanPath = String(window.location.pathname || "/").replace(/\/+$/, "") || "/";

  if (cleanPath === "/politicas/bibliotech") {
    return <PolicyDocumentPage app="bibliotech" />;
  }

  if (cleanPath === "/politicas/churchapp") {
    return <PolicyDocumentPage app="churchapp" />;
  }

  return <PolicyListPage />;
}


export default function App() {
  if (isPublicPolicyPath(window.location.pathname)) {
    return <PublicPolicyRouter />;
  }

  if (window.location.pathname.startsWith("/admin")) {
    return <AdminApp />;
  }

  const [session, setSession] = useState(() => getSavedSession());
  const [tab, setTab] = useState("dashboard");
  const [events, setEvents] = useState([]);
  const [dashboard, setDashboard] = useState(null);
  const [loading, setLoading] = useState(false);
  const [booting, setBooting] = useState(Boolean(getSavedSession()?.token));

  async function loadDashboard() {
    if (!getSavedSession()?.token) return;
    setLoading(true);
    try {
      const data = await api.getDashboard();
      setDashboard(data);
      setEvents(data.events || []);
    } catch (error) {
      if (String(error.message || "").includes("401") || String(error.message || "").toLowerCase().includes("sessão")) {
        clearSession();
        setSession(null);
      }
      console.error(error);
    } finally {
      setLoading(false);
      setBooting(false);
    }
  }

  useEffect(() => {
    async function boot() {
      const saved = getSavedSession();
      if (!saved?.token) return;
      try {
        const me = await api.me();
        const full = { ...saved, user: me.user, company: me.company };
        saveSession(full);
        setSession({ user: me.user, company: me.company });
      } catch (error) {
        clearSession();
        setSession(null);
      } finally {
        setBooting(false);
      }
    }
    boot();
  }, []);

  useEffect(() => {
    if (session) loadDashboard();
  }, [session]);

  function logout() {
    clearSession();
    setSession(null);
    setDashboard(null);
    setEvents([]);
    setTab("dashboard");
  }

  if (!session && !booting) return <Login onLogin={setSession} />;
  if (booting || !session) return <><style>{css}</style><LoadingPage /></>;

  const { user, company } = session;
  const TL = { dashboard: "Dashboard", agenda: "Agenda", whatsapp: "WhatsApp IA", parametros: "Parâmetros IA" };

  return (
    <>
      <style>{css}</style>
      <div className="app">
        <Sidebar user={user} company={company} tab={tab} setTab={setTab} onLogout={logout} />
        <div className="main">
          <div className="topbar">
            <div><div className="topbar-title">{TL[tab]}</div><div className="topbar-sub">Cliente: {company.name} · Powered by {PLATFORM.name}</div></div>
            <span className="badge badge-green"><span style={{ width: 5, height: 5, background: "var(--g600)", borderRadius: "50%", animation: "pulse 2s ease infinite" }} /> IA ativa</span>
          </div>
          {tab === "dashboard" && <Dashboard company={company} dashboard={dashboard} loading={loading} />}
          {tab === "agenda" && <Agenda company={company} events={events} setEvents={setEvents} refreshDashboard={loadDashboard} />}
          {tab === "whatsapp" && <WhatsApp dashboard={dashboard} />}
          {tab === "parametros" && <AiParams company={company} />}
        </div>
      </div>
    </>
  );
}
