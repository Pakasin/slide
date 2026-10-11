import { useEffect, useState } from 'react';
import type { CSSProperties, ReactNode } from 'react';
import type { DesignSystem, Page, SlideMeta, SlideTransition } from '@open-slide/core';
import { Step, Steps, useIsActivePage, useSlidePageNumber } from '@open-slide/core';

import t1 from './assets/t1_class_dist.png';
import t2 from './assets/t2_tools.png';
import t3 from './assets/t3_per_day.png';
import t4 from './assets/t4_src_flows.png';
import t5 from './assets/t5_signature.png';
import t6 from './assets/t6_dists.png';
import t7 from './assets/t7_corr.png';
import c17Counts from './assets/c17_class_counts.png';
import c17Dists from './assets/c17_dists.png';
import r01 from './assets/01_input_class_dist.png';
import r02 from './assets/02_input_per_tool.png';
import r03 from './assets/03_confusion_lab.png';
import r04 from './assets/04_confusion_cic.png';
import r05 from './assets/05_per_tool_recall.png';
import r06 from './assets/06_confidence.png';
import r07 from './assets/07_feature_signature.png';
import r08 from './assets/08_pca.png';
import r09 from './assets/09_tsne.png';
import nsl01 from './assets/n01_taxonomy.png';
import nsl02 from './assets/n02_scope_balance.png';
import nsl03 from './assets/n03_subtypes.png';
import nsl04 from './assets/n04_categorical.png';
import nsl05 from './assets/n05_numeric.png';
import nsl06 from './assets/n06_signature.png';
import nsl07 from './assets/n07_corr.png';
import nsl08 from './assets/n08_runs.png';
import nsl09 from './assets/n09_smote.png';
import nsl10 from './assets/n10_models.png';
import nsl11 from './assets/n11_curves.png';
import nsl12 from './assets/n12_confusion.png';
import nsl13 from './assets/n13_subtype_recall.png';
import nsl14 from './assets/n14_seeds.png';
import nsl15 from './assets/n15_live_overview.png';
import nsl16 from './assets/n16_live_vs_kdd_features.png';
import nsl17 from './assets/n17_live_pca.png';
import nsl18 from './assets/n18_live_distance.png';
import sq01 from './assets/s01_v1_dataset.png';
import sq02 from './assets/s02_composition.png';
import sq03 from './assets/s03_punct_detector.png';
import sq04 from './assets/s04_scores.png';
import sq05 from './assets/s05_threshold.png';
import sq07 from './assets/s07_v1_curves.png';
import sq08 from './assets/s08_chars.png';
import sq09 from './assets/s09_v1_vs_v2.png';
import lab01 from './assets/f01_lab_captures.png';
import lab02 from './assets/f02_lab_summary.png';
import lab03 from './assets/f03_lab_signature.png';
import lab04 from './assets/f04_lab_scatter.png';
import lab05 from './assets/f05_lab_rates.png';
import lab06 from './assets/f06_lab_timeline.png';
import lab07 from './assets/f07_finetune_effect.png';
import lab08 from './assets/f08_four_attempts.png';

/* ───────────────────────────── fonts ─────────────────────────────
   Kanit (display, Thai+Latin geometric) · Sarabun (body, Thai+Latin) ·
   IBM Plex Mono (metrics / paths). Loaded once in <head>, slide-keyed. */
const FONT_HREF =
  'https://fonts.googleapis.com/css2?family=Kanit:wght@500;600;700&family=Sarabun:wght@400;500;600;700&family=IBM+Plex+Mono:wght@400;500;600&display=swap';
const FONT_LINK_ID = 'osd-webfont-cybershield-journey';
if (typeof document !== 'undefined') {
  let link = document.getElementById(FONT_LINK_ID) as HTMLLinkElement | null;
  if (!link) {
    link = document.createElement('link');
    link.id = FONT_LINK_ID;
    link.rel = 'stylesheet';
    document.head.appendChild(link);
  }
  if (link.href !== FONT_HREF) link.href = FONT_HREF;
}

/* in-page entrance keyframes (create-or-update so HMR refreshes it) */
const STYLE_ID = 'osd-styles-cybershield-journey';
const CSS = `
@keyframes cj-rise { from { opacity: 0; transform: translateY(18px); } to { opacity: 1; transform: translateY(0); } }
@keyframes cj-fade { from { opacity: 0; } to { opacity: 1; } }
@keyframes cj-wipe { from { transform: scaleX(0); } to { transform: scaleX(1); } }
@keyframes cj-grow { from { transform: scaleX(0); } to { transform: scaleX(1); } }
.cj-stagger > * { opacity: 0; animation: cj-rise 0.62s cubic-bezier(0.2,0.7,0.2,1) forwards; }
.cj-stagger > *:nth-child(1){ animation-delay: .05s } .cj-stagger > *:nth-child(2){ animation-delay: .13s }
.cj-stagger > *:nth-child(3){ animation-delay: .21s } .cj-stagger > *:nth-child(4){ animation-delay: .29s }
.cj-stagger > *:nth-child(5){ animation-delay: .37s } .cj-stagger > *:nth-child(6){ animation-delay: .45s }
.cj-stagger > *:nth-child(7){ animation-delay: .53s } .cj-stagger > *:nth-child(8){ animation-delay: .61s }
@keyframes cj-nudge { 0%,100% { transform: translateX(0); } 50% { transform: translateX(10px); } }
@keyframes cj-travel { from { transform: translateX(-40px); opacity: 0; } 12% { opacity: 1; } 88% { opacity: 1; } to { transform: translateX(1500px); opacity: 0; } }
@keyframes cj-ping { 0% { transform: scale(0.6); opacity: .9; } 100% { transform: scale(2.6); opacity: 0; } }
@keyframes cj-line { from { transform: scaleX(0); } to { transform: scaleX(1); } }
.cj-nudge { display: inline-block; animation: cj-nudge 1.6s ease-in-out infinite; }
.cj-packet { position: absolute; width: 14px; height: 14px; border-radius: 50%; animation: cj-travel 7s linear infinite; }
.cj-ping { position: absolute; width: 22px; height: 22px; border-radius: 50%; border: 2px solid #d8402a; animation: cj-ping 2.2s ease-out infinite; }
@media (prefers-reduced-motion: reduce){ .cj-stagger > *{ animation: none; opacity: 1; } .cj-nudge,.cj-packet,.cj-ping{ animation: none; } }
`;
if (typeof document !== 'undefined') {
  let st = document.getElementById(STYLE_ID);
  if (!st) {
    st = document.createElement('style');
    st.id = STYLE_ID;
    document.head.appendChild(st);
  }
  if (st.textContent !== CSS) st.textContent = CSS;
}

const DISPLAY = "'Kanit', 'Noto Sans Thai', system-ui, sans-serif";
const BODY = "'Sarabun', 'Noto Sans Thai', system-ui, sans-serif";
const MONO = "'IBM Plex Mono', ui-monospace, Menlo, monospace";

/* ───────────────────────────── palette ──────────────────────────── */
const PAPER = '#f4f1ea';
const PAPER2 = '#ece6d9';
const INK = '#1b1a17';
const MUTED = '#6b6459';
const FAINT = '#9a9284';
const RULE = '#d8d2c4';
const ACCENT = '#d8402a'; // vermilion
const BLUE = '#2f6db0';
const AMBER = '#c17d1f';
const RED = '#cc3b2e';
const TEAL = '#2b8075';
const WHITE = '#fffdf8';

export const design: DesignSystem = {
  palette: { bg: '#f4f1ea', text: '#1b1a17', accent: '#d8402a' },
  fonts: { display: DISPLAY, body: BODY },
  typeScale: { hero: 180, body: 32 },
  radius: 6,
};

/* ───────────────────────── transition family ────────────────────── */
const EASE = 'cubic-bezier(0, 0, 0.2, 1)';
const EASE_IN = 'cubic-bezier(0.4, 0, 1, 1)';
export const transition: SlideTransition = {
  duration: 300,
  exit: { duration: 300, easing: EASE_IN, keyframes: [{ opacity: 1 }, { opacity: 1 }] },
  enter: {
    duration: 300,
    easing: EASE,
    keyframes: [
      { opacity: 0, transform: 'translateY(10px)' },
      { opacity: 1, transform: 'translateY(0)' },
    ],
  },
};

const fill = { width: '100%', height: '100%', fontFamily: BODY } as const;

/* ───────────────────────── building blocks ──────────────────────── */
const Tick = ({ color = ACCENT }: { color?: string }) => (
  <span style={{ display: 'inline-block', width: 26, height: 3, background: color, verticalAlign: 'middle', marginRight: 14 }} />
);

const Frame = ({
  part,
  title,
  children,
  accent = ACCENT,
}: {
  part: string;
  title: ReactNode;
  children: ReactNode;
  accent?: string;
}) => {
  const { current, total } = useSlidePageNumber();
  const ch = parseInt((part.match(/^(\d+)/) ?? [])[1] ?? '0', 10);
  return (
    <div style={{ ...fill, background: 'var(--osd-bg)', color: INK, display: 'flex', flexDirection: 'column', padding: '64px 96px 0' }}>
      <div style={{ display: 'flex', alignItems: 'center', fontFamily: MONO, fontSize: 21, letterSpacing: '0.16em', color: MUTED, textTransform: 'uppercase' }}>
        <Tick color={accent} />
        {part}
      </div>
      <h2 style={{ fontFamily: DISPLAY, fontSize: 60, fontWeight: 600, lineHeight: 1.32, margin: '14px 0 0', letterSpacing: '-0.01em' }}>
        {title}
      </h2>
      <div style={{ height: 2, background: RULE, margin: '22px 0 0' }} />
      <div style={{ flex: 1, minHeight: 0, marginTop: 30, display: 'flex', flexDirection: 'column' }}>{children}</div>
      <div
        style={{
          height: 74,
          flex: 'none',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          fontFamily: MONO,
          fontSize: 19,
          color: FAINT,
          borderTop: `1px solid ${RULE}`,
        }}
      >
        <span style={{ letterSpacing: '0.08em' }}>CYBERSHIELD — จากข้อมูลสู่ระบบจริง</span>
        <span style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
          {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
            <span key={i} style={{ width: i === ch ? 56 : 22, height: 6, borderRadius: 3, background: i === ch ? accent : i < ch ? FAINT : RULE, transition: 'width .3s' }} />
          ))}
        </span>
        <span>
          <span style={{ color: accent }}>{String(current).padStart(2, '0')}</span>
          <span style={{ color: FAINT }}> / {String(total).padStart(2, '0')}</span>
        </span>
      </div>
    </div>
  );
};

/* editorial figure panel with figure number + caption */
const Fig = ({ src, no, caption, grow = 1 }: { src: string; no: string; caption?: string; grow?: number }) => (
  <figure style={{ margin: 0, display: 'flex', flexDirection: 'column', minHeight: 0, flex: grow }}>
    <div style={{ position: 'relative', flex: 1, minHeight: 0, background: WHITE, border: `1px solid ${RULE}`, borderRadius: 6, overflow: 'hidden', boxShadow: '0 1px 0 rgba(0,0,0,0.03)' }}>
      <img src={src} style={{ position: 'absolute', inset: 18, width: 'calc(100% - 36px)', height: 'calc(100% - 36px)', objectFit: 'contain' }} />
    </div>
    {caption ? (
      <figcaption style={{ marginTop: 12, fontFamily: MONO, fontSize: 18, color: MUTED, letterSpacing: '0.02em' }}>
        <span style={{ color: ACCENT }}>{no}</span> · {caption}
      </figcaption>
    ) : null}
  </figure>
);

/* editorial annotation block — label + text, no card, hairline on the left */
const Note = ({ label, color = ACCENT, children }: { label: string; color?: string; children: ReactNode }) => (
  <div style={{ paddingLeft: 20, borderLeft: `3px solid ${color}` }}>
    <div style={{ fontFamily: MONO, fontSize: 19, letterSpacing: '0.12em', textTransform: 'uppercase', color }}>{label}</div>
    <p style={{ margin: '8px 0 0', fontFamily: BODY, fontSize: 30, lineHeight: 1.62, color: INK }}>{children}</p>
  </div>
);

const notesCol: CSSProperties = { display: 'flex', flexDirection: 'column', gap: 30, justifyContent: 'center' };

/* three editorial notes revealed in turn — reused by chart pages */
const WhyWhatLook = ({ what, why, look }: { what: string; why: string; look: string }) => (
  <Steps>
    <Step>
      <Note label="กราฟนี้คืออะไร">{what}</Note>
    </Step>
    <Step>
      <Note label="ทำไมต้องดู" color={AMBER}>
        {why}
      </Note>
    </Step>
    <Step>
      <Note label="ดูอะไรบ้าง" color={BLUE}>
        {look}
      </Note>
    </Step>
  </Steps>
);

const Bullet = ({ children, color = ACCENT }: { children: ReactNode; color?: string }) => (
  <div style={{ display: 'flex', gap: 16, fontFamily: BODY, fontSize: 31, lineHeight: 1.55, color: INK }}>
    <span style={{ color, fontFamily: MONO, flex: 'none', fontWeight: 600 }}>→</span>
    <span>{children}</span>
  </div>
);

const Stat = ({ value, label, color = INK, sub }: { value: string; label: string; color?: string; sub?: string }) => (
  <div>
    <div style={{ fontFamily: DISPLAY, fontSize: 92, fontWeight: 700, lineHeight: 1.0, color, letterSpacing: '-0.02em' }}>{value}</div>
    <div style={{ fontFamily: BODY, fontSize: 28, lineHeight: 1.5, color: INK, marginTop: 10 }}>{label}</div>
    {sub ? <div style={{ fontFamily: BODY, fontSize: 23, lineHeight: 1.5, color: MUTED, marginTop: 4 }}>{sub}</div> : null}
  </div>
);

/* horizontal bar — editorial, thin, ink track */
const Bar = ({ label, value, color, text, max = 1 }: { label: string; value: number; color: string; text?: string; max?: number }) => (
  <div style={{ display: 'flex', alignItems: 'center', gap: 20 }}>
    <div style={{ width: 230, fontFamily: BODY, fontSize: 27, color: INK }}>{label}</div>
    <div style={{ flex: 1, height: 26, background: PAPER2, borderRadius: 2, position: 'relative', overflow: 'hidden' }}>
      <div style={{ width: `${Math.max(1.2, (value / max) * 100)}%`, height: '100%', background: color, borderRadius: 2, transformOrigin: 'left', animation: 'cj-grow 0.7s cubic-bezier(0.2,0.7,0.2,1) both', animationDelay: '0.2s' }} />
    </div>
    <div style={{ width: 150, fontFamily: MONO, fontSize: 26, textAlign: 'right', color: INK }}>{text ?? value.toFixed(2)}</div>
  </div>
);

const Pill = ({ children, color = INK }: { children: ReactNode; color?: string }) => (
  <span style={{ fontFamily: MONO, fontSize: 23, padding: '7px 18px', border: `1.5px solid ${color}`, borderRadius: 999, color }}>{children}</span>
);

/* chart page, side layout (chart left, notes right) */
const SidePage = ({ part, title, src, no, cap, what, why, look, note }:
  { part: string; title: ReactNode; src: string; no: string; cap: string; what: string; why: string; look: string; note?: string }) => (
  <Frame part={part} title={title}>
    <div style={{ flex: 1, minHeight: 0, display: 'grid', gridTemplateColumns: '1.45fr 1fr', gap: 54, paddingBottom: 28 }}>
      <Fig src={src} no={no} caption={cap} />
      <div style={notesCol}>
        <WhyWhatLook what={what} why={why} look={look} />
        {note ? <p style={{ margin: 0, fontFamily: BODY, fontSize: 24, lineHeight: 1.55, color: MUTED }}>{note}</p> : null}
      </div>
    </div>
  </Frame>
);

/* chart page, wide layout (chart top, three notes below) */
const WidePage = ({ part, title, src, no, cap, what, why, look }:
  { part: string; title: ReactNode; src: string; no: string; cap: string; what: string; why: string; look: string }) => (
  <Frame part={part} title={title}>
    <Fig src={src} no={no} caption={cap} grow={1} />
    <div style={{ flex: 'none', display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 44, marginTop: 24, marginBottom: 22 }}>
      <Steps>
        <Step>
          <Note label="กราฟนี้คืออะไร">{what}</Note>
        </Step>
        <Step>
          <Note label="ทำไมต้องดู" color={AMBER}>{why}</Note>
        </Step>
        <Step>
          <Note label="ดูอะไรบ้าง" color={BLUE}>{look}</Note>
        </Step>
      </Steps>
    </div>
  </Frame>
);


/* count-up number — animates only on the instance the audience is watching */
const CountUp = ({ to, decimals = 0, suffix = '', ms = 1200 }: { to: number; decimals?: number; suffix?: string; ms?: number }) => {
  const active = useIsActivePage();
  const [v, setV] = useState(active ? 0 : to);
  useEffect(() => {
    if (!active) { setV(to); return; }
    let raf = 0;
    const t0 = performance.now();
    const tick = (t: number) => {
      const p = Math.min(1, (t - t0) / ms);
      setV(to * (1 - Math.pow(1 - p, 3)));
      if (p < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [active, to, ms]);
  return <>{v.toLocaleString('en-US', { minimumFractionDigits: decimals, maximumFractionDigits: decimals })}{suffix}</>;
};

const BigNum = ({ to, decimals = 0, suffix = '', label, sub, color = INK }: { to: number; decimals?: number; suffix?: string; label: string; sub?: string; color?: string }) => (
  <div style={{ borderTop: `3px solid ${color}`, paddingTop: 16 }}>
    <div style={{ fontFamily: DISPLAY, fontSize: 96, fontWeight: 700, lineHeight: 1, color, letterSpacing: '-0.02em' }}>
      <CountUp to={to} decimals={decimals} suffix={suffix} />
    </div>
    <div style={{ fontFamily: BODY, fontSize: 28, lineHeight: 1.4, color: INK, marginTop: 10 }}>{label}</div>
    {sub ? <div style={{ fontFamily: BODY, fontSize: 22, lineHeight: 1.45, color: MUTED, marginTop: 4 }}>{sub}</div> : null}
  </div>
);

/* chapter divider */
const Divider = ({ n, title, sub, items, color = ACCENT }: { n: string; title: string; sub: string; items: string[]; color?: string }) => (
  <div style={{ ...fill, background: INK, color: PAPER, position: 'relative', overflow: 'hidden' }}>
    <div style={{ position: 'absolute', right: 40, top: -90, fontFamily: DISPLAY, fontSize: 900, fontWeight: 700, color: '#26241f', lineHeight: 1, userSelect: 'none', animation: 'cj-fade 1s ease both' }}>{n}</div>
    <div style={{ position: 'absolute', left: 110, right: 110, top: 0, bottom: 0, display: 'flex', flexDirection: 'column', justifyContent: 'center' }} className="cj-stagger">
      <div style={{ fontFamily: MONO, fontSize: 26, letterSpacing: '0.22em', color, textTransform: 'uppercase' }}>บทที่ {n}</div>
      <h2 style={{ fontFamily: DISPLAY, fontSize: 112, fontWeight: 700, lineHeight: 1.1, margin: '22px 0 0', letterSpacing: '-0.02em' }}>{title}</h2>
      <div style={{ height: 4, width: 220, background: color, margin: '34px 0 30px', transformOrigin: 'left', animation: 'cj-line 0.9s cubic-bezier(0.2,0.7,0.2,1) 0.3s both' }} />
      <p style={{ fontFamily: BODY, fontSize: 38, lineHeight: 1.5, color: '#cfc8b8', margin: 0, maxWidth: 1250 }}>{sub}</p>
      <div style={{ display: 'flex', gap: 14, marginTop: 40, flexWrap: 'wrap' }}>
        {items.map((t) => (
          <span key={t} style={{ fontFamily: MONO, fontSize: 23, padding: '8px 18px', border: `1.5px solid ${color}`, borderRadius: 999, color: PAPER }}>{t}</span>
        ))}
      </div>
    </div>
  </div>
);

/* process table — ทำอะไร / ทำไม / ได้ผลอย่างไร */
const ProcHead = () => (
  <div style={{ display: 'grid', gridTemplateColumns: '64px 1.05fr 1.25fr 1.1fr', gap: 26, padding: '0 0 10px', fontFamily: MONO, fontSize: 19, letterSpacing: '0.12em', color: MUTED }}>
    <span>#</span><span style={{ color: ACCENT }}>ทำอะไร</span><span style={{ color: AMBER }}>ทำไมต้องทำ</span><span style={{ color: TEAL }}>ได้ผลอย่างไร</span>
  </div>
);
const ProcRow = ({ n, what, why, result, bad = false }: { n: string; what: string; why: string; result: string; bad?: boolean }) => (
  <div style={{ display: 'grid', gridTemplateColumns: '64px 1.05fr 1.25fr 1.1fr', gap: 26, padding: '15px 0', borderTop: `1px solid ${RULE}`, alignItems: 'start' }}>
    <div style={{ fontFamily: DISPLAY, fontSize: 38, fontWeight: 700, color: ACCENT, lineHeight: 1.1 }}>{n}</div>
    <div style={{ fontFamily: DISPLAY, fontSize: 25, fontWeight: 600, lineHeight: 1.4 }}>{what}</div>
    <div style={{ fontFamily: BODY, fontSize: 24, lineHeight: 1.45, color: INK }}>{why}</div>
    <div style={{ fontFamily: BODY, fontSize: 24, lineHeight: 1.45, color: bad ? RED : TEAL, fontWeight: 600 }}>{result}</div>
  </div>
);
const ProcPage = ({ part, title, accent = ACCENT, children }: { part: string; title: ReactNode; accent?: string; children: ReactNode }) => (
  <Frame part={part} title={title} accent={accent}>
    <div style={{ flex: 1, minHeight: 0, paddingBottom: 18 }}>
      <ProcHead />
      <div className="cj-stagger">{children}</div>
    </div>
  </Frame>
);

/* ═══════════════════════════════ PAGES ═══════════════════════════════ */

/* 1 — cover */
const Cover: Page = () => (
  <div style={{ ...fill, background: 'var(--osd-bg)', color: INK, position: 'relative', overflow: 'hidden' }}>
    {/* oversized ghost numeral */}
    <div style={{ position: 'absolute', right: -60, bottom: -120, fontFamily: DISPLAY, fontSize: 720, fontWeight: 700, color: PAPER2, lineHeight: 1, userSelect: 'none', animation: 'cj-fade 1.1s ease both' }}>
      01
    </div>
    <div style={{ position: 'absolute', left: 110, right: 110, bottom: 96, height: 14 }}>
      <div style={{ position: 'absolute', left: 0, right: 0, top: 6, height: 2, background: RULE }} />
      <div className="cj-packet" style={{ background: BLUE, animationDelay: '0s' }} />
      <div className="cj-packet" style={{ background: AMBER, animationDelay: '2.3s' }} />
      <div className="cj-packet" style={{ background: RED, animationDelay: '4.6s' }} />
    </div>
    <div style={{ position: 'absolute', inset: 0, padding: '0 110px', display: 'flex', flexDirection: 'column', justifyContent: 'center' }} className="cj-stagger">
      <div style={{ display: 'flex', alignItems: 'center', fontFamily: MONO, fontSize: 26, letterSpacing: '0.2em', color: MUTED, textTransform: 'uppercase' }}>
        <Tick />
        AI Cyber Attack Detection
      </div>
      <h1 style={{ fontFamily: DISPLAY, fontSize: 'var(--osd-size-hero)', fontWeight: 700, lineHeight: 1.0, margin: '30px 0 0', letterSpacing: '-0.03em' }}>
        Cyber<span style={{ color: ACCENT }}>Shield</span>
      </h1>
      <p style={{ fontFamily: DISPLAY, fontWeight: 500, fontSize: 46, lineHeight: 1.35, color: INK, margin: '26px 0 0', maxWidth: 1300 }}>
        ระบบตรวจจับการโจมตีเครือข่ายแบบเรียลไทม์ด้วยโมเดล&nbsp;LSTM
      </p>
      <p style={{ fontFamily: BODY, fontSize: 32, lineHeight: 1.6, color: MUTED, margin: '16px 0 0', maxWidth: 1250 }}>
        เล่าทุกขั้นตอนของทั้ง 3 โมเดล: สำรวจข้อมูล (EDA) ทำอะไร ทำไม ได้ผลอย่างไร จนถึงการเรียนรู้จากข้อมูลของ sensor เราเอง
      </p>
      <div style={{ display: 'flex', gap: 14, marginTop: 50, flexWrap: 'wrap' }}>
        <Pill color={BLUE}>Flow Model</Pill>
        <Pill color={AMBER}>Intrusion Model</Pill>
        <Pill color={RED}>Injection Model</Pill>
        <Pill color={MUTED}>nfstream · mitmproxy · FastAPI · React</Pill>
      </div>
    </div>
  </div>
);

/* 2 — agenda */
const AgendaRow = ({ n, title, sub }: { n: string; title: string; sub: string }) => (
  <div style={{ display: 'grid', gridTemplateColumns: '110px 1fr', gap: 24, alignItems: 'baseline', padding: '8px 0', borderTop: `1px solid ${RULE}` }}>
    <div style={{ fontFamily: DISPLAY, fontSize: 44, fontWeight: 700, color: ACCENT, lineHeight: 1 }}>{n}</div>
    <div>
      <div style={{ fontFamily: DISPLAY, fontSize: 30, fontWeight: 600, lineHeight: 1.2 }}>{title}</div>
      <div style={{ fontFamily: BODY, fontSize: 22, lineHeight: 1.35, color: MUTED, marginTop: 1 }}>{sub}</div>
    </div>
  </div>
);
const Agenda: Page = () => (
  <Frame part="สารบัญ" title="เรื่องที่จะเล่า 8 ตอน">
    <div style={{ flex: 1, minHeight: 0, paddingBottom: 14 }} className="cj-stagger">
      <AgendaRow n="01" title="ภาพรวมระบบ" sub="เซนเซอร์ โมเดล และไทม์ไลน์ของโปรเจกต์" />
      <AgendaRow n="02" title="Flow Model · ข้อมูลที่ใช้เทรน" sub="CSE-CIC-IDS2018 → Improved dataset พร้อม EDA 7 กราฟ" />
      <AgendaRow n="03" title="Flow v2 และ v3" sub="ดีบนเครื่องมือที่เคยเห็น แต่ทั่วไปไปยังเครื่องมือใหม่ได้น้อย" />
      <AgendaRow n="04" title="ห้องทดลอง VM และ fine-tune" sub="โจมตีของจริง · EDA ข้อมูล lab 215,396 flow · fine-tune ด้วยข้อมูลของ sensor" />
      <AgendaRow n="05" title="EDA ตอนรันในระบบ" sub="9 กราฟจากโมเดล Flow ที่ใช้งานจริง ทดสอบกับ lab และ CIC" />
      <AgendaRow n="06" title="Intrusion Model · NSL-KDD" sub="EDA 14 กราฟ · เติมข้อมูลจริง 1,276 แถวจาก sensor แล้วทดสอบสด" />
      <AgendaRow n="07" title="Injection Model · SQLi" sub="EDA ชุด Kaggle เทียบข้อมูล HTTP จริง · v1 → v2" />
      <AgendaRow n="08" title="ผลสดและข้อจำกัด" sub="ผลบน dashboard · สิ่งที่ยังทำไม่ได้ · ก้าวต่อไป" />
    </div>
  </Frame>
);

/* 2b — numbers at a glance */
const Glance: Page = () => (
  <Frame part="ภาพรวมข้อมูล" title="ตัวเลขที่ใช้ตลอดทั้งโปรเจกต์">
    <div style={{ flex: 1, minHeight: 0, display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gridTemplateRows: 'repeat(2, 1fr)', gap: '34px 56px', paddingBottom: 26 }}>
      <BigNum to={5459432} label="flow ใน Improved CIC-IDS" sub="Flow v2 · 10 วัน · 52 features" color={BLUE} />
      <BigNum to={1502470} label="flow จาก CIC-IDS2017 pcap ดิบ" sub="สกัดใหม่ด้วย nfstream config เรา" color={BLUE} />
      <BigNum to={215396} label="flow จาก LAN ของเราเอง" sub="42 ไฟล์ capture · hping3 ab siege hydra" color={TEAL} />
      <BigNum to={125973} label="แถว NSL-KDD (train)" sub="Intrusion Model · 3 คลาส 68,390 แถว" color={AMBER} />
      <BigNum to={1276} label="แถว R2L จริงจาก FTP/Telnet sensor" sub="เติมเข้า NSL-KDD แล้วทดสอบสด" color={ACCENT} />
      <BigNum to={43254} label="request จาก CSIC-2010 (train)" sub="Injection Model v2 · ค่าปกติจริง" color={RED} />
    </div>
  </Frame>
);

/* 3 — architecture */
const Node = ({ title, sub, color = INK }: { title: string; sub: string; color?: string }) => (
  <div style={{ background: WHITE, border: `1px solid ${RULE}`, borderLeft: `4px solid ${color}`, borderRadius: 6, padding: '18px 22px' }}>
    <div style={{ fontFamily: MONO, fontSize: 22, color, lineHeight: 1.35 }}>{title}</div>
    <div style={{ fontFamily: BODY, fontSize: 25, lineHeight: 1.45, color: INK, marginTop: 4 }}>{sub}</div>
  </div>
);
const Flow = ({ label }: { label?: string }) => (
  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 6 }}>
    {label ? <div style={{ fontFamily: MONO, fontSize: 18, color: MUTED, textAlign: 'center', lineHeight: 1.4 }}>{label}</div> : null}
    <div className="cj-nudge" style={{ fontSize: 46, color: ACCENT, lineHeight: 1 }}>→</div>
  </div>
);
const Architecture: Page = () => (
  <Frame part="01 — ภาพรวมระบบ" title="ระบบทำงานอย่างไร">
    <div style={{ flex: 1, minHeight: 0, display: 'flex', flexDirection: 'column', gap: 26, paddingBottom: 26 }}>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 210px 1.2fr 190px 1fr', alignItems: 'center', flex: 1, minHeight: 0 }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
          <Node title="NETWORK SENSOR · root" sub="nfstream แปลงแพ็กเก็ตเป็น Flow" color={BLUE} />
          <Node title="HTTP SENSOR · root" sub="mitmproxy ดึง query และ body" color={RED} />
        </div>
        <Flow label="POST /internal/event" />
        <div style={{ background: WHITE, border: `1px solid ${RULE}`, borderRadius: 6, padding: '26px 30px', display: 'flex', flexDirection: 'column', gap: 14 }}>
          <div style={{ fontFamily: MONO, fontSize: 21, color: ACCENT, letterSpacing: '0.08em' }}>FASTAPI :8000 · ไม่ใช่ root</div>
          <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
            <Pill color={BLUE}>Flow</Pill>
            <Pill color={AMBER}>Intrusion</Pill>
            <Pill color={RED}>Injection</Pill>
          </div>
          <Bullet>ให้คะแนนด้วยโมเดล</Bullet>
          <Bullet>เทียบ threshold เป็น alert</Bullet>
          <Bullet>เก็บ SQLite แล้วกระจายผ่าน WebSocket</Bullet>
        </div>
        <Flow label="WebSocket /ws/feed" />
        <Node title="REACT DASHBOARD" sub="nginx :80 · Live · Logs · Incidents · Test" />
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 20, flex: 'none' }}>
        <Node title="FLOW MODEL" sub="DoS · DDoS · BruteForce" color={BLUE} />
        <Node title="INTRUSION MODEL" sub="R2L · U2R" color={AMBER} />
        <Node title="INJECTION MODEL" sub="SQL Injection" color={RED} />
      </div>
      <div style={{ fontFamily: BODY, fontSize: 25, lineHeight: 1.5, color: MUTED, flex: 'none' }}>
        แต่ละโมเดลรับผิดชอบคลาสของตัวเอง ไม่ทับกัน · เซนเซอร์รันเป็น root เพื่อจับแพ็กเก็ต จึงแยกจาก backend ที่รันแบบไม่ใช่ root
      </div>
    </div>
  </Frame>
);

/* 4 — timeline */
const TLItem = ({ date, title, desc, color = INK }: { date: string; title: string; desc: string; color?: string }) => (
  <div style={{ display: 'flex', flexDirection: 'column', gap: 7 }}>
    <div style={{ height: 4, background: color, width: 48 }} />
    <div style={{ fontFamily: MONO, fontSize: 20, color, marginTop: 4 }}>{date}</div>
    <div style={{ fontFamily: DISPLAY, fontSize: 29, fontWeight: 600, lineHeight: 1.28 }}>{title}</div>
    <div style={{ fontFamily: BODY, fontSize: 24, lineHeight: 1.5, color: MUTED }}>{desc}</div>
  </div>
);
const Timeline: Page = () => (
  <Frame part="01 — ไทม์ไลน์" title="เส้นทางของโปรเจกต์">
    <div style={{ flex: 1, minHeight: 0, display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gridTemplateRows: 'repeat(2, 1fr)', gap: '34px 40px', paddingBottom: 28 }} className="cj-stagger">
      <TLItem date="ก.ค.–ส.ค. 2026" title="Flow v1 (GRU)" desc="เทรนบน CSE-CIC-IDS2018 เดิม คะแนนสูงแต่มาจากการจัดข้อมูลที่ไม่สมจริง" color={FAINT} />
      <TLItem date="ส.ค. 2026" title="Intrusion Model" desc="เปลี่ยนจาก UNSW-NB15 เป็น NSL-KDD เพราะ schema ไม่ตรงกับ R2L/U2R" color={AMBER} />
      <TLItem date="3 ต.ค." title="Flow v2" desc="Improved dataset มี Src IP จึง window ต่อผู้ส่ง 52 features" color={BLUE} />
      <TLItem date="4–5 ต.ค." title="v3 เพิ่มข้อมูล" desc="รวม CIC-IDS2017 แล้วไม่ดีขึ้น จึงไม่ใช้ และหันไปทดสอบของจริง" color={RED} />
      <TLItem date="5–6 ต.ค." title="ห้องทดลอง VM" desc="โจมตีจริงด้วย hping3 ab siege hydra พบ v2 แทบมองไม่เห็นบน nfstream" color={TEAL} />
      <TLItem date="7 ต.ค." title="Fine-tune → ใช้งานจริง" desc="CIC-IDS2017 จาก pcap ดิบ แล้วปรับกับ LAN ของเราเอง" color={ACCENT} />
      <TLItem date="9 ต.ค." title="SQLi v2" desc="เทรนใหม่ด้วยข้อความที่ sensor ส่งจริง ลด false alarm ลงมาก" color={RED} />
      <TLItem date="10–11 ต.ค." title="R2L จากของจริง" desc="จับ FTP/Telnet brute-force มาเติม แล้วทดสอบกับ traffic สด" color={AMBER} />
    </div>
  </Frame>
);

const D2: Page = () => (
  <Divider n="02" title="Flow Model: ข้อมูลที่ใช้เทรน" sub="จากชุดข้อมูลดั้งเดิมที่คะแนนสูงเกินจริง สู่ Improved dataset ที่ตรงกับตอนใช้งานจริง" items={['5.46 ล้าน flow', 'window ต่อ Source IP', 'EDA 7 กราฟ']} color={BLUE} />
);

/* 5 — v1 */
const V1: Page = () => (
  <Frame part="02 — ข้อมูล · v1" title="เริ่มจาก CSE-CIC-IDS2018 ดั้งเดิม">
    <div style={{ flex: 1, minHeight: 0, display: 'grid', gridTemplateColumns: '1fr 1.1fr', gap: 64, paddingBottom: 30 }}>
      <div style={{ ...notesCol, gap: 24 }}>
        <div style={{ fontFamily: MONO, fontSize: 21, letterSpacing: '0.1em', color: MUTED }}>FLOW v1 · GRU</div>
        <Bullet color={MUTED}>เทรนจาก 3 วัน (14, 16, 21 ก.พ. 2018)</Bullet>
        <Bullet color={MUTED}>78 features → ใช้ 71</Bullet>
        <Bullet color={MUTED}>ไม่มี Src IP → window ตามเวลา แยกตาม subtype</Bullet>
        <Stat value="f1 0.993" label="คะแนนที่รายงานตอนนั้น — แต่เชื่อไม่ได้" color={FAINT} />
      </div>
      <div style={{ ...notesCol, gap: 24, paddingLeft: 48, borderLeft: `1px solid ${RULE}` }} className="cj-stagger">
        <Note label="ทำไมไม่เชื่อคะแนนนี้" color={RED}>สุ่มข้อมูลตามคลาส ทำให้ window หนาแน่นเกินจริง</Note>
        <Note label="ของจริงจางกว่ามาก" color={RED}>Slowloris มี ~3.5 flow/วินาที เทียบ benign ~130 flow/วินาที จึงจมหายใน window รวม</Note>
        <Note label="label รั่ว" color={RED}>แบ่ง window ตาม subtype ที่กำลังทำนาย ซึ่งตอนใช้งานจริงไม่มีให้ (train/serve ไม่ตรงกัน)</Note>
      </div>
    </div>
  </Frame>
);

/* 6 — improved + pipeline */
const PStep = ({ n, text, sub }: { n: string; text: string; sub?: string }) => (
  <div style={{ display: 'flex', alignItems: 'center', gap: 20, padding: '13px 0', borderTop: `1px solid ${RULE}` }}>
    <div style={{ fontFamily: DISPLAY, fontSize: 30, fontWeight: 700, color: ACCENT, width: 36, flex: 'none' }}>{n}</div>
    <div style={{ fontFamily: BODY, fontSize: 28, lineHeight: 1.45 }}>
      {text}
      {sub ? <span style={{ color: MUTED, fontSize: 23 }}> · {sub}</span> : null}
    </div>
  </div>
);
const Improved: Page = () => (
  <Frame part="02 — ข้อมูล · Improved" title="เปลี่ยนเป็น Improved CIC และสร้าง window ใหม่">
    <div style={{ flex: 1, minHeight: 0, display: 'grid', gridTemplateColumns: '1fr 1.05fr', gap: 64, paddingBottom: 30 }}>
      <div style={{ ...notesCol, gap: 22 }}>
        <div style={{ fontFamily: MONO, fontSize: 20, letterSpacing: '0.08em', color: MUTED }}>IMPROVED CICIDS2017 + CSE-CIC-IDS2018</div>
        <Bullet>แก้ label ที่ผิดของชุดเดิม (Engelen et al.)</Bullet>
        <Bullet>มี Src IP จึงสร้าง window ต่อผู้ส่งได้ ตรงกับตอนใช้งานจริง</Bullet>
        <Bullet>ใช้ 10 วัน รวม 5,459,432 flow</Bullet>
        <Bullet>ใช้เฉพาะค่าที่ nfstream วัดได้จริง ตัด fingerprint (header length, MSS, port)</Bullet>
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
        <PStep n="1" text="nfstream" sub="accounting_mode=3, idle_timeout=120" />
        <PStep n="2" text="43 ค่าพื้นฐาน" sub="log1p + 6 ค่าคำนวณ = 49" />
        <PStep n="3" text="+3 ค่าพฤติกรรมผู้ส่ง = 52" sub="gap, same dst IP, same dst port" />
        <PStep n="4" text="window 10 flow ต่อ Source IP" sub="ไม่ padding" />
        <div style={{ display: 'flex', gap: 7, padding: '12px 0 12px 56px' }}>
          {[0, 1, 2, 3, 4, 5, 6, 7, 8, 9].map((i) => (
            <div key={i} style={{ flex: 1, height: 44, borderRadius: 3, background: i === 9 ? ACCENT : PAPER2, border: i === 9 ? 'none' : `1px solid ${RULE}` }} />
          ))}
        </div>
        <PStep n="5" text="LSTM(48) → 4 คลาส" sub="BENIGN · DoS · DDoS · BruteForce" />
      </div>
    </div>
  </Frame>
);

/* 7–13 — training EDA */
const E1: Page = () => (
  <SidePage part="02 — EDA ข้อมูลเทรน · 1/7" title="สัดส่วนแต่ละคลาส" src={t1} no="รูปที่ 1" cap="จำนวน flow ต่อคลาส (แกนตั้ง log)"
    what="จำนวน flow ต่อคลาส หลังเตรียมข้อมูล รวม 5.46 ล้าน flow"
    why="ดูความไม่สมดุลก่อนเทรน benign 4.78 ล้านเทียบ BruteForce 30,000 ต่างราว 160 เท่า"
    look="DoS (61,050) น้อยกว่า DDoS (591,855) ราว 10 เท่า จึงต้องวัดผลรายคลาส ไม่ใช่แค่ accuracy" />
);
const E2: Page = () => (
  <SidePage part="02 — EDA ข้อมูลเทรน · 2/7" title="เครื่องมือโจมตีในข้อมูล" src={t2} no="รูปที่ 2" cap="จำนวน flow แยกตามเครื่องมือโจมตี"
    what="ที่มาของแต่ละคลาส แยกตามเครื่องมือโจมตีที่ใช้สร้าง"
    why="ถ้ามีเครื่องมือน้อย โมเดลจะจำลายเซ็นของเครื่องมือ แทนที่จะเรียนรู้พฤติกรรม"
    look="DoS 3 เครื่องมือ · DDoS 3 (HOIC เกินครึ่ง) · BruteForce มีแค่ SSH — ข้อจำกัดนี้ตามถึงผลทดสอบ" />
);
const E3: Page = () => (
  <WidePage part="02 — EDA ข้อมูลเทรน · 3/7" title="จำนวน flow รายวัน" src={t3} no="รูปที่ 3" cap="flow ต่อวันของ 10 วัน แยกสีตามคลาส"
    what="จำนวน flow ต่อวันของ 10 วัน แยกสีตามคลาส"
    why="เช็กว่าการโจมตีกระจุกวันไหน ถ้าแบ่งตามเวลา โมเดลอาจไม่เคยเห็นเครื่องมือนั้นเลย"
    look="BruteForce มีแค่ 14/02 · DDoS มีแค่ 20–21/02 · benign ถูกจำกัดราว 4.8 แสนต่อวัน" />
);
const E4: Page = () => (
  <SidePage part="02 — EDA ข้อมูลเทรน · 4/7" title="flow ต่อ Source IP" src={t4} no="รูปที่ 4" cap="flow ต่อ Source IP (สองแกน log)"
    what="จำนวน flow ต่อ Source IP แยกตามคลาส"
    why="เป็นเหตุผลที่สร้าง window ต่อ Source IP และเผยว่าผู้โจมตีในข้อมูลมีน้อยมาก"
    look="DoS 3 IP · DDoS 10 IP · BruteForce 1 IP เทียบ benign 61,986 IP — โมเดลอาจจำตัว IP แทนพฤติกรรม" />
);
const E5: Page = () => (
  <WidePage part="02 — EDA ข้อมูลเทรน · 5/7" title="ลายเซ็น feature ของแต่ละคลาส" src={t5} no="รูปที่ 5" cap="ค่าเฉลี่ย z-score ของ 43 feature ต่อคลาส"
    what="ค่าเฉลี่ย (z-score หลัง log1p) ของ 43 feature ต่อคลาส แดง = สูงกว่าค่ารวม น้ำเงิน = ต่ำกว่า"
    why="ดูว่าแต่ละคลาสมีลายเซ็นของตัวเองที่โมเดลใช้แยกได้จริงหรือไม่"
    look="BruteForce เด่นที่แพ็กเก็ต/PSH · DDoS เด่นที่ CWR/ECE · DoS เด่นที่ IAT สูง · URG เกือบศูนย์" />
);
const E6: Page = () => (
  <SidePage part="02 — EDA ข้อมูลเทรน · 6/7" title="การกระจายของ feature สำคัญ" src={t6} no="รูปที่ 6" cap="ฮิสโตแกรม 6 feature (log1p) แยกคลาส"
    what="ฮิสโตแกรมของ 6 feature (log1p) แยกสีตามคลาส"
    why="ถ้ากระจายซ้อนกันมาก feature เดี่ยวแยกคลาสไม่ได้ ต้องพึ่งลำดับ 10 flow ของ LSTM"
    look="BruteForce เป็นแท่งแหลม (ทำซ้ำเหมือนกันทุก flow) · benign กระจายกว้าง · DoS กับ DDoS ซ้อนบางส่วน" />
);
const E7: Page = () => (
  <SidePage part="02 — EDA ข้อมูลเทรน · 7/7" title="ความสัมพันธ์ระหว่าง feature" src={t7} no="รูปที่ 7" cap="สหสัมพันธ์ Pearson r ระหว่าง 43 feature"
    what="สหสัมพันธ์ (Pearson r) ระหว่าง 43 feature เรียงให้กลุ่มที่คล้ายกันอยู่ติดกัน"
    why="รู้ว่า feature ซ้ำซ้อนกันเท่าไร ก่อนตัดสินใจเลือกและสร้าง feature"
    look="34 จาก 903 คู่มี |r| > 0.9 เช่น CWR กับ ECE · แถวว่างคือ feature ค่าคงที่ (URG)" />
);

const D3: Page = () => (
  <Divider n="03" title="Flow v2 และ v3" sub="วัดว่าโมเดลเรียนรู้พฤติกรรม หรือแค่จำเครื่องมือโจมตี" items={['hold-out ทั้งเครื่องมือ', 'เพิ่มข้อมูล CIC-IDS2017', 'ผลที่ไม่ดีขึ้น']} color={AMBER} />
);

/* 14 — v2 */
const V2: Page = () => (
  <Frame part="03 — Flow v2" title="จำเครื่องมือได้ แต่ไปไม่ถึงเครื่องมือใหม่">
    <div style={{ flex: 1, minHeight: 0, display: 'grid', gridTemplateColumns: '0.8fr 1.2fr', gap: 60, paddingBottom: 30 }}>
      <div style={{ ...notesCol, gap: 30 }}>
        <div style={{ fontFamily: MONO, fontSize: 20, color: MUTED, letterSpacing: '0.08em' }}>เครื่องมือที่เคยเห็น</div>
        <Stat value="99.92%" label="accuracy (seed 11) · เครื่องมือเดิม ผู้โจมตีเดิม" color={TEAL} />
        <Stat value="≈0.01%" label="benign ถูกเตือนผิด" color={BLUE} />
        <div style={{ fontFamily: BODY, fontSize: 24, color: MUTED }}>LSTM(48) + GaussianNoise + Dropout · 8 epochs</div>
      </div>
      <div style={{ ...notesCol, gap: 20, paddingLeft: 52, borderLeft: `1px solid ${RULE}` }}>
        <div style={{ fontFamily: MONO, fontSize: 20, color: AMBER, letterSpacing: '0.06em' }}>ซ่อนทั้งเครื่องมือออก แล้ววัด RECALL (3 seeds × 3 folds)</div>
        <Bar label="LOIC-HTTP" value={0.8} color={BLUE} />
        <Bar label="GoldenEye" value={0.68} color={BLUE} />
        <Bar label="Slowloris" value={0.51} color={AMBER} />
        <Bar label="LOIC-UDP" value={0.34} color={AMBER} />
        <Bar label="Hulk" value={0.02} color={RED} />
        <Bar label="HOIC" value={0.01} color={RED} />
        <div style={{ fontFamily: BODY, fontSize: 24, lineHeight: 1.5, color: MUTED }}>
          ข้อมูลมี DoS แค่ 3 เครื่องมือ DDoS 3 เครื่องมือ จึงพิสูจน์ไม่ได้ว่าโมเดลเรียนรู้ “พฤติกรรม”
        </div>
      </div>
    </div>
  </Frame>
);

/* 15 — v3 */
const V3: Page = () => (
  <Frame part="03 — Flow v3" title="เพิ่มข้อมูลแล้ว ไม่ได้ดีขึ้น">
    <div style={{ flex: 1, minHeight: 0, display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 64, paddingBottom: 30 }}>
      <div style={{ ...notesCol, gap: 24 }}>
        <Note label="v3 = v2 + CIC-IDS2017 improved" color={RED}>recall เครื่องมือที่ซ่อน: HOIC 0.00, Hulk 0.05–0.09</Note>
        <Note label="ข้ามชุดข้อมูล 2017 → 2018" color={RED}>HOIC 0, LOIC-UDP ≈ 0</Note>
        <Note label="คะแนน CV" color={RED}>0.78 ต่ำกว่า v2 (0.85) จึงไม่ติดตั้ง</Note>
      </div>
      <div style={{ ...notesCol, gap: 24, paddingLeft: 52, borderLeft: `1px solid ${RULE}` }}>
        <Note label="บทเรียน">ข้อมูลเครื่องมือเดิมเพิ่มขึ้น ไม่ได้สอนพฤติกรรมใหม่</Note>
        <Note label="ช่องว่าง" color={AMBER}>ตัวเลขบน Kaggle ยังไม่บอกว่าใช้กับ traffic จริงได้ไหม</Note>
        <Note label="ทางออก" color={TEAL}>สร้างห้องทดลองเอง โจมตีจริง แล้วจับด้วย nfstream ตัวเดียวกับระบบ</Note>
      </div>
    </div>
  </Frame>
);

const D4: Page = () => (
  <Divider n="04" title="ห้องทดลอง VM และ fine-tune" sub="โจมตีของจริงเอง เก็บข้อมูลจาก sensor ของเรา แล้วนำไป fine-tune โมเดล" items={['215,396 flow จาก LAN', 'EDA ข้อมูล lab', 'fine-tune → FA 3.7%']} color={TEAL} />
);

/* 16 — lab */
const LabBox = ({ title, lines, color = INK }: { title: string; lines: string[]; color?: string }) => (
  <div style={{ background: WHITE, border: `1px solid ${RULE}`, borderLeft: `4px solid ${color}`, borderRadius: 6, padding: '20px 24px' }}>
    <div style={{ fontFamily: MONO, fontSize: 23, color, lineHeight: 1.35 }}>{title}</div>
    {lines.map((l) => (
      <div key={l} style={{ fontFamily: BODY, fontSize: 27, lineHeight: 1.5, color: INK }}>{l}</div>
    ))}
  </div>
);
const Lab: Page = () => (
  <Frame part="04 — ห้องทดลอง VM" title="ห้องทดลองโจมตีจริงบน VM">
    <div style={{ flex: 1, minHeight: 0, display: 'grid', gridTemplateColumns: '1.9fr 160px 0.9fr', paddingBottom: 30, alignItems: 'stretch' }}>
      <div style={{ ...notesCol, gap: 26 }}>
        <div style={{ fontFamily: MONO, fontSize: 21, color: ACCENT, letterSpacing: '0.06em' }}>VIRTUALBOX VM “project” · UBUNTU</div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 90px 1fr', alignItems: 'center' }}>
          <LabBox title="NETNS atk" lines={['hping3 · ab · siege', 'slowhttptest · hydra']} color={RED} />
          <Flow label="veth" />
          <LabBox title="ROOT NETNS · vetgt" lines={['nginx :80', 'sshd :22 · ftp :21 · telnet :23']} color={BLUE} />
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 90px 1fr', alignItems: 'center' }}>
          <LabBox title="tcpdump" lines={['เขียน pcap หมุนทุก 5 วินาที']} />
          <Flow />
          <LabBox title="live_sensor_lite.py" lines={['nfstream (ออฟไลน์) + rate rules']} />
        </div>
        <div style={{ fontFamily: BODY, fontSize: 24, lineHeight: 1.5, color: MUTED }}>
          nfstream จับ loopback ไม่ได้ และโหมดสดทิ้ง burst สั้นๆ จึงใช้ tcpdump → pcap แทน
        </div>
      </div>
      <Flow label="SSH reverse tunnel" />
      <div style={{ ...notesCol, gap: 22 }}>
        <div style={{ fontFamily: MONO, fontSize: 21, color: ACCENT, letterSpacing: '0.06em' }}>HOST · WINDOWS</div>
        <LabBox title="FastAPI :8000" lines={['/api/predict', 'TensorFlow 2.17']} color={AMBER} />
        <LabBox title="React :5173" lines={['dashboard แสดงผลสด']} />
      </div>
    </div>
  </Frame>
);

/* 17 — round 2 */
const Round2: Page = () => (
  <Frame part="04 — ห้องทดลอง VM · รอบ 2" title="โมเดล v2 แทบมองไม่เห็นบน traffic จริง">
    <div style={{ flex: 1, minHeight: 0, display: 'grid', gridTemplateColumns: '1.2fr 0.8fr', gap: 60, paddingBottom: 30 }}>
      <div style={{ ...notesCol, gap: 22 }}>
        <div style={{ fontFamily: MONO, fontSize: 20, color: RED, letterSpacing: '0.06em' }}>v2 บน nfstream flow จริง (9 สถานการณ์)</div>
        <Bar label="DoS recall" value={0.131} color={AMBER} text="0.131" />
        <Bar label="DDoS recall" value={0} color={RED} text="0.000" />
        <Bar label="BruteForce" value={0} color={RED} text="0.000" />
        <Bar label="benign เตือนผิด" value={0.135} color={BLUE} text="13.5%" />
        <div style={{ fontFamily: BODY, fontSize: 24, lineHeight: 1.5, color: MUTED }}>
          ที่ Kaggle ดูดี แต่ CICFlowMeter ≠ nfstream และ LAN จริง ≠ ข้อมูลองค์กร
        </div>
      </div>
      <div style={{ ...notesCol, gap: 16, paddingLeft: 52, borderLeft: `1px solid ${RULE}` }}>
        <div style={{ fontFamily: MONO, fontSize: 20, color: TEAL, letterSpacing: '0.06em' }}>rate rules ปรับจากข้อมูลจริง</div>
        {[['DoS flows', '500 → 300'], ['DDoS sources', '20 → 5'], ['DDoS flows', '150 → 50'], ['BruteForce flows', '15 → 10']].map(([k, v]) => (
          <div key={k} style={{ display: 'flex', justifyContent: 'space-between', fontFamily: BODY, fontSize: 28, borderBottom: `1px solid ${RULE}`, paddingBottom: 8 }}>
            <span style={{ color: INK }}>{k}</span>
            <span style={{ fontFamily: MONO, color: ACCENT }}>{v}</span>
          </div>
        ))}
        <div style={{ fontFamily: BODY, fontSize: 24, lineHeight: 1.5, color: MUTED }}>ตอนนั้น rate rules ไม่ใช่ LSTM คือสิ่งที่จับการโจมตีได้จริง</div>
      </div>
    </div>
  </Frame>
);

/* 17b — flow pipeline, step by step */
const ProcFlow: Page = () => (
  <ProcPage part="04 — สรุปขั้นตอน · Flow Model" title="จาก v2 ที่มองไม่เห็น สู่โมเดลที่ใช้งานจริง" accent={TEAL}>
    <ProcRow n="1" what="สกัด CIC-IDS2017 จาก pcap ดิบด้วย nfstream config เรา" why="CICFlowMeter ≠ nfstream: v2 ได้ DoS recall 0.13 บนของจริง" result="1.50 ล้าน flow → 157,310 window" />
    <ProcRow n="2" what="จับ traffic LAN เอง 42 ไฟล์ จากเครื่องมือจริง" why="สภาพแวดล้อมเครือข่ายต่างกัน ข้อมูลสาธารณะอย่างเดียวไม่พอ" result="215,396 flow · benign 21 · DoS 14 · DDoS 3 · BF 3 ชุด" />
    <ProcRow n="3" what="ลองใช้ข้อมูลสาธารณะ 3 วิธี" why="หาให้ได้ว่าอะไรทำให้ย้ายข้ามสภาพแวดล้อมไม่ได้" result="benign เตือนผิด 94% · 100% · 89%" bad />
    <ProcRow n="4" what="fine-tune โมเดลฐาน CIC ด้วยข้อมูล lab" why="เก็บความรู้จากเครื่องมือหลากหลาย แล้วปรับให้เข้ากับ LAN" result="FA 3.7% · DoS 0.87 · DDoS 0.99 · BF 1.0" />
    <ProcRow n="5" what="ทดสอบ leave-one-tool-out และรันบน dashboard สด" why="ดูว่าเจอเครื่องมือที่ไม่เคยเห็นได้ไหม ไม่ใช่แค่ที่เคยเห็น" result="DoS ≈1.0 ส่วนใหญ่ · siege/ab โหลดต่ำยังพลาด" />
    <ProcRow n="6" what="เสริม rate rules ที่ปรับเกณฑ์จากข้อมูล lab" why="เป็นชั้นป้องกันที่ไม่ขึ้นกับเครื่องมือโจมตี" result="เกณฑ์ 300 · 5 · 50 · 10 จับครบทุกเครื่องมือที่เก็บมา" />
  </ProcPage>
);


/* 18 — four attempts */
const Attempt = ({ n, title, fa, color, sub }: { n: string; title: string; fa: string; color: string; sub: string }) => (
  <div style={{ display: 'flex', flexDirection: 'column', gap: 10, paddingTop: 16, borderTop: `3px solid ${color}` }}>
    <div style={{ fontFamily: MONO, fontSize: 20, color }}>ครั้งที่ {n}</div>
    <div style={{ fontFamily: DISPLAY, fontSize: 28, fontWeight: 600, lineHeight: 1.3 }}>{title}</div>
    <div style={{ fontFamily: DISPLAY, fontSize: 80, fontWeight: 700, lineHeight: 1.05, color, letterSpacing: '-0.02em' }}>{fa}</div>
    <div style={{ fontFamily: BODY, fontSize: 23, color: MUTED }}>benign เตือนผิดบน lab</div>
    <div style={{ fontFamily: BODY, fontSize: 24, lineHeight: 1.5, color: INK }}>{sub}</div>
  </div>
);
const Attempts: Page = () => (
  <Frame part="04 — ข้อมูลสาธารณะ" title="ข้อมูลสาธารณะอย่างเดียวย้ายมาไม่ได้">
    <div style={{ flex: 1, minHeight: 0, display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 40, paddingBottom: 18 }} className="cj-stagger">
      <Attempt n="1" title="CSV nfstream สำเร็จรูป" fa="94%" color={RED} sub="เทรนบนมันเกือบสมบูรณ์ แต่ config ของ nfstream ไม่ตรงกับระบบเรา" />
      <Attempt n="2" title="สกัดใหม่จาก pcap ดิบ ด้วย config เรา" fa="100%" color={RED} sub="extractor ตรงแล้ว แต่สภาพแวดล้อมต่างกัน (องค์กร vs lab)" />
      <Attempt n="3" title="รวม CIC + lab ตั้งแต่ต้น" fa="89%" color={AMBER} sub="benign ของ CIC ท่วม benign ของ lab" />
      <Attempt n="4" title="Fine-tune CIC → lab" fa="3.7%" color={TEAL} sub="DoS 0.87 · DDoS 0.99 · BruteForce 1.0 และยังจำ CIC ได้ (0.97–1.0)" />
    </div>
    <div style={{ flex: 'none', fontFamily: BODY, fontSize: 25, lineHeight: 1.5, color: MUTED, paddingBottom: 20, borderTop: `1px solid ${RULE}`, paddingTop: 18 }}>
      บทเรียน: ต้องตรงทั้ง config ของ extractor และสภาพแวดล้อมเครือข่าย · ถ้าย้ายไปที่ใหม่ ต้องจับ benign และ attack ของที่นั้นมา fine-tune
    </div>
  </Frame>
);

const AttemptsChart: Page = () => (
  <WidePage part='04 — ข้อมูลสาธารณะ' title='สี่วิธีกับข้อมูลสาธารณะ เห็นผลชัดในกราฟเดียว' src={lab08} no="รูปที่ 8" cap='benign เตือนผิดบน lab ของแต่ละวิธี'
    what='เปอร์เซ็นต์ benign ที่ถูกเตือนผิดบนข้อมูล lab ของเรา แยกตามวิธีที่ใช้ข้อมูลสาธารณะ'
    why='เป็นเกณฑ์ตัดสินว่าโมเดลใช้งานจริงได้ไหม โมเดล IDS ที่เตือนผิดมากกว่าจับได้ ไม่มีใครใช้'
    look='สามวิธีแรก 89–100% มีแต่ fine-tune ที่เหลือ 3.7% — ต้องตรงทั้ง extractor และสภาพแวดล้อม' />
);

/* 19 — CIC base EDA */
const C17: Page = () => (
  <Frame part="04 — EDA ข้อมูลฐาน CIC-IDS2017 (nfstream)" title="ข้อมูลฐานที่สกัดใหม่ด้วย config ของเรา">
    <div style={{ flex: 1, minHeight: 0, display: 'grid', gridTemplateColumns: '0.7fr 1.3fr', gridTemplateRows: '1fr auto', gap: '22px 40px', paddingBottom: 20 }}>
      <Fig src={c17Counts} no="รูปที่ 9" cap="จำนวน window ต่อคลาส" />
      <Fig src={c17Dists} no="รูปที่ 10" cap="การกระจายของ feature ต่อคลาส" />
      <div style={{ gridColumn: '1 / 2' }}>
        <Steps>
          <Step>
            <Note label="กราฟซ้าย">benign และ DDoS 60,000 · DoS 30,365 · BruteForce 6,945 — ดูความสมดุลของข้อมูลฐานก่อน fine-tune</Note>
          </Step>
        </Steps>
      </div>
      <div style={{ gridColumn: '2 / 3' }}>
        <Steps>
          <Step>
            <Note label="กราฟขวา" color={BLUE}>ดูว่าคลาสแยกด้วย feature ใดได้ · BruteForce เป็นแท่งแหลมแคบ (ทำซ้ำทุก flow) · benign กระจายกว้างและมียอดที่ศูนย์</Note>
          </Step>
        </Steps>
      </div>
    </div>
  </Frame>
);

const L1: Page = () => (
  <SidePage part='04 — EDA ข้อมูล lab · 1/6' title='จับอะไรมาบ้าง: 42 ไฟล์ 215,396 flow' src={lab01} no="รูปที่ 11" cap='จำนวน flow ต่อ capture (แกน log) สีตามคลาส'
    what='จำนวน flow ในแต่ละ capture ที่ nfstream สกัดจาก pcap สีตามคลาสจริง'
    why='ดูความสมดุลก่อน fine-tune ถ้าคลาสใดจมหาย โมเดลจะไม่เรียนรู้คลาสนั้น'
    look='synflood สองชุดรวม 131,072 flow = 67% ของ DoS · DDoS มี 560 · BruteForce เหลือ 131 flow' />
);
const L2: Page = () => (
  <SidePage part='04 — EDA ข้อมูล lab · 2/6' title='ความหลากหลายของผู้โจมตี' src={lab02} no="รูปที่ 12" cap='flow · captures · tools · source IP ต่อคลาส'
    what='สรุปต่อคลาส: จำนวน flow จำนวน capture จำนวนเครื่องมือ และจำนวน IP ต้นทาง'
    why='ถ้าผู้โจมตีมีน้อย โมเดลอาจจำ IP แทนพฤติกรรม ซึ่งเป็นปัญหาเดียวกับชุดสาธารณะ'
    look='DoS ทั้งหมดมาจาก 2 IP · BruteForce 2 IP · DDoS 30 IP (จำลองด้วย alias) · benign 21 สถานการณ์' />
);
const L3: Page = () => (
  <SidePage part='04 — EDA ข้อมูล lab · 3/6' title='ลายเซ็น feature ของแต่ละคลาส' src={lab03} no="รูปที่ 13" cap='ค่าเฉลี่ยคลาสเทียบค่ากลางของ 4 คลาส'
    what='ค่าเฉลี่ย (log1p) ของ feature ต่อคลาส เทียบกับค่าเฉลี่ยของ 4 คลาส แดงสูงกว่า น้ำเงินต่ำกว่า'
    why='ยืนยันว่าแต่ละคลาสมีลายเซ็นของตัวเอง และตรงกับธรรมชาติของการโจมตี'
    look='DoS: SYN/RST และ IAT สูง แพ็กเก็ตเล็ก · BruteForce: RST และ Fwd IAT Min สูง · DDoS/benign: ความยาวแพ็กเก็ตมาก' />
);
const L4: Page = () => (
  <SidePage part='04 — EDA ข้อมูล lab · 4/6' title='flow เดี่ยวแยกคลาสไม่ได้' src={lab04} no="รูปที่ 14" cap='duration กับจำนวนแพ็กเก็ตของ flow (สุ่มคลาสละ 3,000)'
    what='จุดละ 1 flow แกนนอนระยะเวลา แกนตั้งจำนวนแพ็กเก็ต (log ทั้งคู่)'
    why='ตอบว่าทำไมต้องใช้ window 10 flow ต่อ source ไม่ใช่ทำนายทีละ flow'
    look='ทุกคลาสกองซ้อนกันเป็นส่วนใหญ่ — ความต่างอยู่ที่ลำดับและจังหวะของ flow ต่อเนื่อง ซึ่งเป็นงานของ LSTM' />
);
const L5: Page = () => (
  <SidePage part='04 — EDA ข้อมูล lab · 5/6' title='rate rules: เกณฑ์ที่ตัดแยกข้อมูล lab' src={lab05} no="รูปที่ 15" cap='จำนวน flow สูงสุดใน 10 วินาที ต่อ capture'
    what='จำนวน flow สูงสุดใน 10 วินาทีจาก 1 source ไป 1 ปลายทาง (ซ้าย) และไปพอร์ต auth (ขวา)'
    why='ใช้ปรับเกณฑ์ของ rate rules จากข้อมูลจริง ไม่ใช่เดา'
    look='DoS ทุกเครื่องมือเกิน 300 · แต่ benign_siege 7,7xx, b_moderate 1,201, benign_ab 800 ก็เกิน (FA ที่ยังเหลือ) · BruteForce เกิน 10 ยกเว้น ssh ที่ใช้พอร์ต 2222' />
);
const L6: Page = () => (
  <WidePage part='04 — EDA ข้อมูล lab · 6/6' title='จังหวะเวลาของแต่ละ capture' src={lab06} no="รูปที่ 16" cap='flow ต่อวินาที ของ 4 capture ตัวอย่าง'
    what='จำนวน flow ต่อวินาทีตามเวลา ของ benign_siege, synflood, DDoS HTTP และ hydra'
    why='แต่ละคลาสมีจังหวะต่างกัน จึงเลือกหน้าต่าง 10 วินาทีสำหรับกฎอัตรา'
    look='benign_siege พุ่งแล้วลดลงใน 40 วินาที · synflood 58 พันใน 1 วินาทีแรก · hydra มาเป็นสองก้อนห่างกัน ~12,000 วินาที' />
);
const L7: Page = () => (
  <SidePage part='04 — fine-tune ด้วยข้อมูลจาก sensor' title='ผลของการ fine-tune ด้วยข้อมูล lab' src={lab07} no="รูปที่ 17" cap='recall และ benign FA บนทราฟฟิก nfstream จริง'
    what='เทียบโมเดล v2 เดิม กับโมเดลที่ fine-tune ด้วยข้อมูล lab บนทราฟฟิก nfstream ของเรา'
    why='นี่คือคำตอบว่าการเอาข้อมูลจาก sensor ไป retrain คุ้มไหม'
    look='DoS 0.13 → 0.87 · DDoS 0.00 → 0.99 · BruteForce 0.00 → 1.00 · false alarm 13.5% → 3.7%' note='ตัวเลขชุด lab 70/30 แบ่งตามเครื่องมือ · VM เดียว ตัวอย่าง DDoS 320 และ BF 95 window จึงไม่นิ่ง' />
);

const D5: Page = () => (
  <Divider n="05" title="EDA ตอนรันในระบบ" sub="เอาโมเดลที่ fine-tune แล้วไปรันกับข้อมูล lab และ CIC แล้วดูว่าพลาดตรงไหน เพราะอะไร" items={['confusion matrix', 'recall ต่อเครื่องมือ', 'PCA · t-SNE']} color={RED} />
);


/* 20–28 — in-system EDA */
const R1: Page = () => (
  <WidePage part="05 — EDA ในระบบ · 1/9" title="ชุดทดสอบ lab เทียบ CIC" src={r01} no="รูปที่ 18" cap="จำนวน window ชุดทดสอบ: lab (ซ้าย) · CIC (ขวา)"
    what="จำนวน window ของชุดทดสอบ ซ้าย = lab ที่จับเอง ขวา = CIC-IDS2017 ผ่าน nfstream"
    why="รู้ว่าชุด lab ไม่สมดุล (DDoS 320, BruteForce 95) ผลรายคลาสของสองคลาสนี้จึงไม่นิ่ง"
    look="ฝั่งซ้ายคือเครื่องมือจริงที่โจมตีเอง · ฝั่งขวาคือข้อมูลสาธารณะที่สมดุล 4,000 ต่อคลาส" />
);
const R2: Page = () => (
  <WidePage part="05 — EDA ในระบบ · 2/9" title="จำนวน window ต่อ capture" src={r02} no="รูปที่ 19" cap="จำนวน window แยกตามชื่อ capture"
    what="จำนวน window ในชุดทดสอบ lab แยกตามชื่อ capture (เครื่องมือและสถานการณ์)"
    why="ตรวจว่าผลรวมไม่ถูกครอบงำด้วยไม่กี่ capture"
    look="benign_siege (3,100+) และ synflood (~1,300 สองชุด) ครอบงำ ส่วนท้ายมีสิบกว่า window — recall ไม่นิ่ง" />
);
const R3: Page = () => (
  <SidePage part="05 — EDA ในระบบ · 3/9" title="Confusion matrix บน lab" src={r03} no="รูปที่ 20" cap="แถว = จริง · คอลัมน์ = ทำนาย"
    what="แถว = ความจริง คอลัมน์ = ที่ทำนาย ในวงเล็บคือจำนวน window"
    why="ดูว่าพลาดแบบไหน สำหรับ IDS การพลาดการโจมตีแย่กว่าการเตือนผิด"
    look="DoS 318 window (8%) ถูกทำนายเป็น BENIGN · benign 23 ถูกเตือนเป็น DDoS · BruteForce ถูกทั้ง 95"
    note="ชุดนี้รวมข้อมูลที่ใช้เทรน เป็นภาพประกอบ · ตัวเลข held-out จริง: benign เตือนผิด 3.7%, DoS 0.87" />
);
const R4: Page = () => (
  <SidePage part="05 — EDA ในระบบ · 4/9" title="Confusion matrix บน CIC" src={r04} no="รูปที่ 21" cap="matrix บนชุด CIC-IDS2017"
    what="matrix แบบเดียวกัน บนชุด CIC-IDS2017 ที่สกัดด้วย nfstream"
    why="เช็กว่า fine-tune กับ lab แล้วโมเดลไม่ลืมข้อมูลฐาน"
    look="accuracy 99.5% · F1 ทุกคลาส 0.99–1.00 (DoS 0.991, BruteForce 0.994, DDoS 0.998, BENIGN 0.995)" />
);
const R5: Page = () => (
  <WidePage part="05 — EDA ในระบบ · 5/9" title="recall แยกตามเครื่องมือ" src={r05} no="รูปที่ 22" cap="recall ต่อ capture · สีตามคลาสจริง"
    what="recall ของแต่ละ capture สีตามคลาสจริง (น้ำเงิน benign, ส้ม DoS, แดง DDoS, เขียว BruteForce)"
    why="ผลรวมซ่อนจุดอ่อนไว้ ต้องดูทีละเครื่องมือจึงรู้ว่าพลาดตรงไหน"
    look="เกือบทุก capture ≈ 1.0 ยกเว้น dos_siege ≈ 0 และ dos_abflood 0.50 (โหลดต่ำ ดูคล้าย benign)" />
);
const R6: Page = () => (
  <SidePage part="05 — EDA ในระบบ · 6/9" title="ความมั่นใจของโมเดล" src={r06} no="รูปที่ 23" cap="ความมั่นใจ: ถูก (8,067) vs ผิด (348)"
    what="ฮิสโตแกรมความมั่นใจ (max softmax) แยกทำนายถูก 8,067 กับทำนายผิด 348"
    why="ใช้ตั้ง threshold แจ้งเตือน ถ้าที่ผิดมักมั่นใจต่ำ ก็กรองหรือลดระดับได้"
    look="ที่ถูกกองที่ ≈1.0 · ที่ผิดกองที่ 0.8–0.9 แต่ยังซ้อนกันบ้าง threshold อย่างเดียวจึงกรองไม่หมด" />
);
const R7: Page = () => (
  <WidePage part="05 — EDA ในระบบ · 7/9" title="ลายเซ็น feature บนข้อมูล lab" src={r07} no="รูปที่ 24" cap="ค่าเฉลี่ย feature ต่อคลาส (flow สุดท้ายของ window)"
    what="ค่าเฉลี่ยของ feature ต่อคลาส จาก flow สุดท้ายของแต่ละ window ในชุด lab"
    why="ยืนยันว่าสิ่งที่โมเดลเรียนจากข้อมูลฐานยังใช้ได้กับ traffic ของเราเอง"
    look="DoS: SYN/RST สูง · DDoS และ BruteForce: pkts/s สูง bytes/pkt ต่ำ — ตรงกับธรรมชาติการโจมตี" />
);
const R8: Page = () => (
  <WidePage part="05 — EDA ในระบบ · 8/9" title="PCA ของ window ใน lab" src={r08} no="รูปที่ 25" cap="PCA · ซ้าย คลาสจริง · ขวา จุดที่ทำนายผิด"
    what="ย่อ window ลงเหลือ 2 มิติ ซ้าย = สีตามคลาสจริง ขวา = จุดที่ทำนายผิดเป็นสีแดง"
    why="ดูภาพรวมว่าคลาสแยกกันเชิงเรขาคณิตไหม และความผิดพลาดกระจุกตรงไหน"
    look="จุดผิดกระจุกบนแนวยาวที่ benign ซ้อน DoS (คือ DoS โหลดต่ำ) · DoS บางกลุ่มแยกขาดชัด" />
);
const R9: Page = () => (
  <SidePage part="05 — EDA ในระบบ · 9/9" title="t-SNE ของ window ใน lab" src={r09} no="รูปที่ 26" cap="t-SNE · สีตามคลาสจริง"
    what="ย่อ window เป็น 2 มิติแบบ t-SNE ที่เน้นความใกล้เคียงเฉพาะที่ สีตามคลาสจริง"
    why="เห็นกลุ่มย่อยที่ PCA มองไม่เห็น เช่นแยกตามเครื่องมือ"
    look="DoS แตกเป็นกลุ่มตามเครื่องมือ · benign เป็นก้อนใหญ่ · จุด DoS ที่แทรกใน benign คือที่มาของ DoS→BENIGN ≈8%" />
);

const D6: Page = () => (
  <Divider n="06" title="Intrusion Model · NSL-KDD" sub="R2L และ U2R: EDA ครบทุกขั้น และเมื่อเอาข้อมูลจริงจาก sensor ไปเติม ผลเป็นอย่างไร" items={['EDA 14 กราฟ', 'SimpleRNN', 'เติมข้อมูลจริง 1,276 แถว']} color={AMBER} />
);

/* 6.0 — intrusion pipeline */
const ProcNsl: Page = () => (
  <ProcPage part="06 — สรุปขั้นตอน · Intrusion Model" title="ขั้นตอนของโมเดล R2L / U2R" accent={AMBER}>
    <ProcRow n="1" what="เลือกขอบเขต: เก็บ Normal / R2L / U2R ตัด DoS และ Probe" why="DoS กับ Probe เป็นหน้าที่ของ Flow Model ไม่ให้ซ้ำซ้อน" result="train 68,390 แถว: 67,343 · 995 · 52" />
    <ProcRow n="2" what="สำรวจข้อมูล (EDA) ก่อนเทรน 11 กราฟ" why="รู้ความไม่สมดุล ชนิดย่อยที่ test เพิ่มเข้ามา และฟีเจอร์ที่แยกคลาสได้" result="R2L 1:68 · U2R 1:1,295 · R2L 23.8% ของ test เป็นชนิดใหม่" bad />
    <ProcRow n="3" what="label-encode 3 คอลัมน์ + StandardScaler (fit บน train เท่านั้น)" why="กันข้อมูล test รั่วเข้ามาตอนสเกล" result="41 features" />
    <ProcRow n="4" what="สร้าง window 10 แถวตามลำดับไฟล์ แล้วทำ SMOTE เฉพาะ train" why="ให้ LSTM เห็นลำดับ และเพิ่มคลาสที่น้อยมากโดยไม่แตะ test" result="R2L 995→5,000 · U2R 52→1,000 (ลำดับแถวไม่มีสัญญาณเวลา: ดูหน้า EDA 8)" />
    <ProcRow n="5" what="เทรน 4 สถาปัตยกรรม เทียบกับ Random Forest แบบ flat" why="เลือกตัวที่ดีที่สุดอย่างเป็นธรรม ข้อมูลและ window ชุดเดียวกัน" result="SimpleRNN ดีสุด macro F1 0.474 (RF 0.337)" />
    <ProcRow n="6" what="ประเมินบน KDDTest+ แล้วเติมข้อมูลจริงจาก sensor" why="ตอบว่า R2L recall ต่ำเพราะอะไร และข้อมูลจริงช่วยได้ไหม" result="R2L recall 0.069 · เติมแล้วจับสดได้ 8/14 แต่ FA 2/7" bad />
  </ProcPage>
);

const N1: Page = () => (
  <SidePage part='06 — EDA Intrusion · 1/14' title='NSL-KDD มี 5 กลุ่ม เราดูแลแค่ 3' src={nsl01} no="รูปที่ 27" cap='จำนวนแถวต่อกลุ่ม: train (ทึบ) test (ลายเฉียง)'
    what='จำนวนแถวของแต่ละกลุ่มการโจมตี ใน KDDTrain+ (ทึบ) และ KDDTest+ (ลายเฉียง) แกน log'
    why='กำหนดขอบเขต: DoS และ Probe เป็นของ Flow Model จึงไม่ปนกับโมเดลนี้'
    look='ในขอบเขต Normal 67,343 · R2L 995 · U2R 52 · แต่ test มี R2L ถึง 2,887 มากกว่า train ราว 3 เท่า' />
);
const N2: Page = () => (
  <SidePage part='06 — EDA Intrusion · 2/14' title='ความไม่สมดุลของ 3 คลาส' src={nsl02} no="รูปที่ 28" cap='ขนาดคลาสและสัดส่วนต่อ Normal'
    what='ขนาดแต่ละคลาสในขอบเขต พร้อมสัดส่วนเทียบ Normal ใน train'
    why='ความไม่สมดุลกำหนดวิธีเทรน (SMOTE, class weight) และการเลือก metric'
    look='R2L 1:68 · U2R 1:1,295 (0.08%) · ทายว่า Normal ทุกแถวก็ได้ 76.7% บน test ขณะที่โมเดลจริงได้ 78.3%' note='จึงไม่ดู accuracy อย่างเดียว ต้องดู recall รายคลาส' />
);
const N3: Page = () => (
  <WidePage part='06 — EDA Intrusion · 3/14' title='ชนิดย่อยของ R2L และ U2R' src={nsl03} no="รูปที่ 29" cap='จำนวนแถวต่อชนิดย่อย: train (ทึบ) test (จาง) · ★ ไม่เคยอยู่ใน train'
    what='จำนวนแถวต่อชนิดการโจมตีย่อย แยก train กับ test ★ คือชนิดที่ไม่เคยปรากฏใน train'
    why='ถ้า test มีชนิดใหม่ recall จะต่ำโดยธรรมชาติ ไม่ใช่เพราะโมเดลแย่อย่างเดียว'
    look='R2L ใน test 23.8% และ U2R 44.8% เป็นชนิดใหม่ · R2L ใน train 890 จาก 995 แถวเป็น warezclient ชนิดเดียว' />
);
const N4: Page = () => (
  <SidePage part='06 — EDA Intrusion · 4/14' title='protocol, flag และ service' src={nsl04} no="รูปที่ 30" cap='สัดส่วนของแต่ละคลาสที่ใช้ค่าต่างๆ'
    what='ในแต่ละคลาส กี่ % ใช้ protocol / TCP flag / service ค่าใดบ้าง'
    why='คอลัมน์หมวดหมู่ต้อง label-encode จึงต้องรู้ว่าแยกคลาสได้ไหม'
    look='R2L อยู่บน ftp_data 61% และ ftp 31% · U2R เกือบทั้งหมด telnet 65% · Normal ส่วนใหญ่ http 57% — service คือลายเซ็นแรงสุด' />
);
const N5: Page = () => (
  <SidePage part='06 — EDA Intrusion · 5/14' title='การกระจายของ feature ตัวเลข' src={nsl05} no="รูปที่ 31" cap='ฮิสโตแกรม log1p ของ 6 feature แยกคลาส'
    what='ฮิสโตแกรมของ 6 feature ตัวเลข (log1p) แยกสีตามคลาส'
    why='ดูว่า feature เดี่ยวแยกคลาสได้ไหม และคลาสเล็กมีรูปร่างแบบไหน'
    look='R2L และ U2R เป็นแท่งแหลมที่ค่าเดิมซ้ำๆ (แถวคล้ายกันมาก) ส่วน Normal กระจายกว้าง — ซ้อนกันมากจึงแยกยาก' />
);
const N6: Page = () => (
  <SidePage part='06 — EDA Intrusion · 6/14' title='ลายเซ็น feature ของแต่ละคลาส' src={nsl06} no="รูปที่ 32" cap='z-score เฉลี่ยของ 22 feature ที่แยกคลาสได้ดีสุด'
    what='ค่าเฉลี่ย z-score ของ 22 feature ที่ต่างจากค่าเฉลี่ยรวมมากที่สุด แดง = สูงกว่า'
    why='บอกว่าโมเดลต้องพึ่ง feature ชนิดไหนในการแยก R2L และ U2R'
    look='U2R: root_shell +10.0, num_shells +4.4 · R2L: hot +2.8, is_guest_login +2.3 · Normal ≈ 0 เพราะเป็น 98%' note='feature เหล่านี้เป็น content features ที่ nfstream วัดไม่ได้ จึงปิด Intrusion บน traffic สด' />
);
const N7: Page = () => (
  <SidePage part='06 — EDA Intrusion · 7/14' title='ความสัมพันธ์ระหว่าง feature' src={nsl07} no="รูปที่ 33" cap='สหสัมพันธ์ Pearson ของ 36 feature ตัวเลข'
    what='สหสัมพันธ์ (Pearson r) ของ 36 feature ตัวเลข จัดกลุ่มที่คล้ายกันให้อยู่ติดกัน'
    why='ดูความซ้ำซ้อนก่อนตัดสินใจเก็บหรือตัด feature'
    look='มีเพียง 3 จาก 630 คู่ที่ |r| > 0.9 (กลุ่ม rerror_rate ทั้งสี่ตัว) — ส่วนใหญ่เป็นอิสระต่อกัน จึงเก็บครบ 41 ตัว' />
);
const N8: Page = () => (
  <SidePage part='06 — EDA Intrusion · 8/14' title='ลำดับแถวมีข้อมูลเชิงเวลาจริงไหม' src={nsl08} no="รูปที่ 34" cap='ลำดับในไฟล์เทียบกับการสุ่มสลับ'
    what='ตรวจว่าแถวที่อยู่ติดกันในไฟล์ต่างจากการสุ่มหรือไม่: ความยาวช่วง label เดียวกัน, อัตราเปลี่ยน label, autocorrelation lag-1'
    why='เรา window 10 แถวตามลำดับไฟล์ ถ้าลำดับไม่มีความหมาย window ก็คือการมัดแถวสุ่ม 10 แถวเข้าด้วยกัน'
    look='label เปลี่ยน 3.00% เทียบสุ่ม 3.02% · autocorrelation 0.0019 เทียบ 0.0024 ± 0.0005 — ไม่ต่างจากสุ่ม (ช่วงยาวเฉลี่ย 33 แถวมาจาก Normal 98% ล้วน)' />
);
const N9: Page = () => (
  <SidePage part='06 — EDA Intrusion · 9/14' title='จัดการความไม่สมดุล' src={nsl09} no="รูปที่ 35" cap='SMOTE เฉพาะ train และ class_weight'
    what='ซ้าย: จำนวนแถวหลัง SMOTE (เฉพาะ train) ขวา: class_weight = N / (3 × จำนวน)'
    why='ให้คลาสเล็กมีน้ำหนักพอในการเรียนรู้ โดยไม่แตะ test'
    look='R2L 995 → 5,000 · U2R 52 → 1,000 · class_weight U2R 438.4 R2L 22.9 Normal 0.34' note='SMOTE สร้างจุดใหม่จากการสอดแทรกของจุดเดิม จึงเพิ่มความแยกกันไม่ได้ถ้า feature ไม่แยก' />
);
const N10: Page = () => (
  <WidePage part='06 — EDA Intrusion · 10/14' title='เทียบ 4 สถาปัตยกรรมกับ Random Forest' src={nsl10} no="รูปที่ 36" cap='macro F1, R2L recall และ U2R recall บน KDDTest+'
    what='เทียบ SimpleRNN, GRU, LSTM, BiLSTM กับ RF แบบ flat ข้อมูลและ window ชุดเดียวกัน'
    why='เลือกสถาปัตยกรรมอย่างเป็นธรรม และตอบว่าโมเดลลำดับคุ้มกว่าโมเดลธรรมดาไหม'
    look='SimpleRNN ดีที่สุด macro F1 0.474 (RF 0.337) ด้วยพารามิเตอร์น้อยสุด 36,291 และเทรน 267 วินาที · BiLSTM ใหญ่สุด 342,659 แต่แย่กว่า' />
);
const N11: Page = () => (
  <SidePage part='06 — EDA Intrusion · 11/14' title='เส้นโค้งการเรียนรู้' src={nsl11} no="รูปที่ 37" cap='validation loss และ accuracy ต่อ epoch'
    what='validation loss และ accuracy ของ 4 โมเดล จุดวงกลมคือ epoch ที่ early stopping เลือก'
    why='ดูว่า overfit เมื่อไร และเลือกจุดหยุดอย่างไร'
    look='loss ต่ำสุดที่ epoch 5–8 แล้วเพิ่มขึ้น (SimpleRNN 7, GRU 5, LSTM 7, BiLSTM 8) · val accuracy ≈ 0.99' note='0.99 บน validation แต่ 0.78 บน KDDTest+ : ช่องว่างนี้คือ distribution shift ของข้อมูลทดสอบ' />
);
const N12: Page = () => (
  <SidePage part='06 — EDA Intrusion · 12/14' title='Confusion matrix บน KDDTest+' src={nsl12} no="รูปที่ 38" cap='ซ้าย จำนวน window · ขวา สัดส่วนต่อแถวจริง'
    what='ผลทำนายของ SimpleRNN ที่ใช้งานจริงบน 12,656 window ของ KDDTest+ (รันซ้ำจากไฟล์โมเดล)'
    why='IDS ที่พลาดการโจมตีแย่กว่าที่เตือนผิด จึงดูว่าพลาดไปทางไหน'
    look='Normal ถูก 99.8% · R2L ถูกเพียง 6.9% (199 จาก 2,885) และ 92.9% ถูกทายเป็น Normal · U2R ถูก 29.9% (20 จาก 67)' />
);
const N13: Page = () => (
  <SidePage part='06 — EDA Intrusion · 13/14' title='R2L พลาดเพราะไม่เคยเห็น หรือเห็นแล้วก็ยังพลาด' src={nsl13} no="รูปที่ 39" cap='recall ของ R2L แยกตามชนิดย่อย'
    what='recall ของ R2L แยกตามชนิดย่อย amber = เคยอยู่ใน train แดง = ไม่เคย'
    why='แยกสาเหตุสองอย่างที่ปนกัน: ตัวอย่างไม่พอ หรือ feature แยกไม่ได้'
    look='ชนิดที่เคยเห็น recall เพียง 0.089 (n=2,197) ชนิดใหม่ 0.004 (n=688) — แม้เห็นแล้วยังต่ำ จึงเป็นข้อจำกัดของ feature ไม่ใช่แค่จำนวนตัวอย่าง' />
);

/* 30 — intrusion KDDTest+ */
const Intrusion: Page = () => (
  <Frame part="06 — Intrusion Model · NSL-KDD" title="R2L: ข้อมูลจริงช่วยจริงหรือแค่ดูเหมือน">
    <div style={{ flex: 1, minHeight: 0, display: 'grid', gridTemplateColumns: '0.8fr 1.2fr', gap: 60, paddingBottom: 30 }}>
      <div style={{ ...notesCol, gap: 24 }}>
        <div style={{ fontFamily: MONO, fontSize: 20, color: AMBER, letterSpacing: '0.06em' }}>โจทย์</div>
        <Bullet color={AMBER}>train มี R2L แค่ 995 แถว (Normal 67,343, U2R 52)</Bullet>
        <Bullet color={AMBER}>23.8% ของ R2L ใน test เป็นชนิดที่ไม่เคยอยู่ใน train</Bullet>
        <Bullet color={AMBER}>เติมแถวจริง 1,276 แถว (hydra/medusa/ncrack บน FTP/Telnet)</Bullet>
      </div>
      <div style={{ ...notesCol, gap: 18, paddingLeft: 52, borderLeft: `1px solid ${RULE}` }}>
        <div style={{ fontFamily: MONO, fontSize: 20, color: AMBER, letterSpacing: '0.06em' }}>R2L RECALL ของ SimpleRNN บน KDDTest+</div>
        <Bar label="ก่อนเติม" value={0.069} color={FAINT} text="0.069" max={0.4} />
        <Bar label="รันแรก" value={0.333} color={AMBER} text="0.333" max={0.4} />
        <Bar label="5 seeds เฉลี่ย" value={0.285} color={AMBER} text="0.285" max={0.4} />
        <Bar label="แถวจริงใน train" value={0.062} color={RED} text="0.062" max={0.4} />
        <div style={{ fontFamily: BODY, fontSize: 25, lineHeight: 1.5, color: INK }}>
          ดีขึ้นจริงและซ้ำได้ แต่ best epoch = 1 ทั้ง 5 seed · พอย้ายแถวจริงเข้า train จริง recall กลับไปที่ 0.062
        </div>
        <div style={{ fontFamily: BODY, fontSize: 25, lineHeight: 1.5, color: MUTED }}>
          ข้อสรุปบน KDDTest+: ผลที่ดูดีน่าจะมาจากการเลือก checkpoint ไม่ใช่การเรียนรู้จากแถวจริง
        </div>
      </div>
    </div>
  </Frame>
);

const N14: Page = () => (
  <SidePage part='06 — เติมข้อมูลจาก sensor · 1/5' title='ผลบน KDDTest+ เป็นภาพลวง' src={nsl14} no="รูปที่ 40" cap='R2L recall: 5 seeds × 2 วิธีวางข้อมูลจริง'
    what='R2L recall บน KDDTest+ ของ 5 seeds เมื่อแถวจริงอยู่ท้ายไฟล์ (ตกใน validation) เทียบกับเมื่อย้ายเข้า train'
    why='ตรวจว่าที่ recall ดีขึ้นมาจากการเรียนรู้จริง หรือจากวิธีเลือก checkpoint'
    look='ท้ายไฟล์: 0.285 โดยทุก seed ได้ best epoch = 1 · ย้ายเข้า train: 0.062 ≈ baseline 0.069 — ไม่ได้เรียนรู้จากแถวจริง' />
);
const N15: Page = () => (
  <WidePage part='06 — เติมข้อมูลจาก sensor · 2/5' title='ข้อมูลที่ sensor ของเราเก็บได้' src={nsl15} no="รูปที่ 41" cap='1,276 connection ตามเวลา, service และ TCP flag'
    what='R2L 1,276 connection ที่ FTP/Telnet sensor เก็บตอนโจมตีด้วย hydra, medusa, ncrack บน VM'
    why='ชุดสาธารณะเก่าตั้งแต่ปี 1999 แต่ feature ของ sensor เรามี extractor ของตัวเอง'
    look='telnet 1,091 · ftp 185 · flag S0 802 (ไม่มีการตอบ) และ SF 473 · มาจาก IP เดียว (10.9.9.2) ในห้องทดลอง' />
);
const N16: Page = () => (
  <SidePage part='06 — เติมข้อมูลจาก sensor · 3/5' title='แถวจริงเทียบกับ R2L ใน NSL-KDD' src={nsl16} no="รูปที่ 42" cap='ฮิสโตแกรมของ 6 feature: Normal, R2L เดิม, R2L จาก sensor'
    what='เทียบการกระจายของ feature เดียวกันระหว่าง NSL-KDD กับแถวที่ sensor เราสร้าง'
    why='ถ้าสองแหล่งต่างกัน โมเดลที่เทรนจาก KDD อย่างเดียวจะมองไม่เห็นของเรา'
    look='R2L จาก sensor เกือบทั้งหมด duration, src_bytes, dst_bytes = 0 หรือราว 20 ไบต์ · R2L เดิมมี bytes หลักร้อยถึงพัน' />
);
const N17: Page = () => (
  <SidePage part='06 — เติมข้อมูลจาก sensor · 4/5' title='แถวจริงอยู่ตรงไหนของพื้นที่ feature' src={nsl17} no="รูปที่ 43" cap='PCA ที่ fit บน NSL-KDD แล้วฉายแถวจริงลงไป'
    what='ย่อ 41 feature ลง 2 มิติด้วย PCA ที่ fit บน NSL-KDD เท่านั้น แล้ววางแถวจากทั้งสองแหล่ง'
    why='ดูว่าข้อมูลใหม่ครอบคลุมพื้นที่ใหม่หรือซ้ำของเดิม'
    look='จุดแดงส่วนใหญ่รวมเป็นเส้นแคบที่ PC2 ต่ำกว่า −4 ซึ่ง NSL-KDD แทบไม่มีจุด — เป็นรูปแบบใหม่ ไม่ใช่ R2L เดิม' />
);
const N18: Page = () => (
  <SidePage part='06 — เติมข้อมูลจาก sensor · 5/5' title='แถวจริงเหมือน R2L หรือ Normal ของ KDD มากกว่า' src={nsl18} no="รูปที่ 44" cap='ระยะห่างถึงแถวที่ใกล้ที่สุดของแต่ละคลาส'
    what='ระยะจากแถวจริงแต่ละแถวถึง R2L ที่ใกล้ที่สุดและ Normal ที่ใกล้ที่สุดของ NSL-KDD'
    why='อธิบายว่าทำไมโมเดลเก่าจับ R2L ของเราได้แค่ 1 จาก 14'
    look='ระยะมัธยฐานถึง R2L 6.46 เทียบ Normal 6.67 · 49.1% ใกล้ Normal มากกว่า — ไม่เหมือน R2L เดิมมากไปกว่า Normal' />
);

/* 31 — intrusion live test */
const IntrusionLive: Page = () => (
  <Frame part="06 — Intrusion Model · ทดสอบสด" title="บน traffic สดจริง ผลกลับตาลปัตร">
    <div style={{ flex: 1, minHeight: 0, display: 'grid', gridTemplateColumns: '0.85fr 1.15fr', gap: 60, paddingBottom: 30 }}>
      <div style={{ ...notesCol, gap: 24 }}>
        <div style={{ fontFamily: MONO, fontSize: 20, color: MUTED, letterSpacing: '0.06em' }}>วิธีทดสอบ</div>
        <Bullet>สร้าง netns แยกบน VM โจมตี FTP/Telnet ของ VM เอง</Bullet>
        <Bullet>traffic สดใหม่ทั้งหมด ไม่ใช่แถวที่ใช้เทรน</Bullet>
        <Bullet>ให้โมเดล production กับโมเดลที่เติมข้อมูลจริง ทำนาย window เดียวกัน</Bullet>
      </div>
      <div style={{ ...notesCol, gap: 20, paddingLeft: 52, borderLeft: `1px solid ${RULE}` }}>
        <div style={{ fontFamily: MONO, fontSize: 20, color: TEAL, letterSpacing: '0.04em' }}>จับ R2L ถูก (14 window attack) · เตือนผิด (7 window benign)</div>
        <Bar label="Production · จับ" value={1 / 14} color={FAINT} text="1/14" max={1} />
        <Bar label="เติมข้อมูล · จับ" value={8 / 14} color={TEAL} text="8/14" max={1} />
        <Bar label="Production · เตือนผิด" value={0 / 7} color={FAINT} text="0/7" max={1} />
        <Bar label="เติมข้อมูล · เตือนผิด" value={2 / 7} color={RED} text="2/7" max={1} />
        <div style={{ fontFamily: BODY, fontSize: 26, lineHeight: 1.55, color: INK }}>
          โมเดลที่เติมข้อมูลจับ attack ได้มากกว่ามาก แต่ก็เตือน benign login ผิด 2/7 ด้วย — <b>แลกด้วย false alarm ที่สูงเกินไป จึงยังไม่ deploy</b>
        </div>
        <div style={{ fontFamily: BODY, fontSize: 23, lineHeight: 1.5, color: MUTED }}>
          ตัวอย่างเล็ก (attack 14, benign 7 window) · ก้าวต่อไปคือลด false alarm ก่อนค่อยใช้จริง
        </div>
      </div>
    </div>
  </Frame>
);

const D7: Page = () => (
  <Divider n="07" title="Injection Model · SQLi" sub="ทำไมโมเดลที่ได้ 99.8% บนข้อสอบ จึงเตือนผิดครึ่งหนึ่งบนคำขอ HTTP จริง" items={['EDA ชุด Kaggle', 'CSIC-2010', 'v1 → v2']} color={RED} />
);

const ProcSqli: Page = () => (
  <ProcPage part="07 — สรุปขั้นตอน · Injection Model" title="ขั้นตอนของโมเดล SQLi" accent={RED}>
    <ProcRow n="1" what="ใช้ชุด Kaggle SQL Injection 30,919 แถว (benign 63%)" why="ชุดสาธารณะที่ label ชัด เริ่มได้เร็ว" result="v1 · Embedding + LSTM · 20 epochs" />
    <ProcRow n="2" what="เข้ารหัสระดับตัวอักษร vocab 105 ตัว pad/truncate 221" why="SQLi ขึ้นกับเครื่องหมาย ตัดเป็นคำแล้วเสียสัญญาณ" result="ไม่ต้องมี scaler" />
    <ProcRow n="3" what="วัดบนชุดทดสอบของ Kaggle" why="รายงานความแม่นยำมาตรฐาน" result="validation accuracy ≈ 99.8% (รายงาน 99.7%)" />
    <ProcRow n="4" what="ทดสอบกับคำขอ HTTP จริง (CSIC-2010)" why="ดูว่าข้อสอบกับของจริงต่างกันไหม" result="ค่าปกติถูกเตือน 45.4% · โจมตีจับ 81.9%" bad />
    <ProcRow n="5" what="EDA เทียบข้อความ Kaggle กับค่าจริง" why="หาสาเหตุที่ 99.8% ไม่ตามมา" result="benign ของ v1 = อีเมล/คำเดี่ยว โมเดลจึงนับเครื่องหมาย" bad />
    <ProcRow n="6" what="ดึงค่าทีละตัว + กฎ signature + เทรน v2 บนค่าจริงของ CSIC และ SecLists" why="ให้โมเดลเห็นสิ่งเดียวกับที่ sensor ส่งจริง" result="เตือนผิด 0.06% · recall 96.5% (ทั้ง pipeline 0/10,800)" />
  </ProcPage>
);
const S1: Page = () => (
  <SidePage part='07 — EDA Injection · 1/8' title='ชุด Kaggle ที่ใช้เทรน v1' src={sq01} no="รูปที่ 45" cap='จำนวน ความยาว และเครื่องหมายต่อ query'
    what='ขนาดคลาส ความยาว และจำนวนเครื่องหมายวรรคตอนต่อ query ของชุด Kaggle (30,919 แถว)'
    why='ดูว่าอะไรแยก label ได้ง่ายที่สุด ก่อนสรุปว่าโมเดลเรียนรู้อะไร'
    look='SQLi ยาวกว่า (มัธยฐาน 85 vs 35 ตัวอักษร) และมีเครื่องหมาย 12 ตัว vs 2 — แค่นับเครื่องหมายก็แยกได้มาก' />
);
const S2: Page = () => (
  <WidePage part='07 — EDA Injection · 2/8' title='ตัวอักษรที่ประกอบเป็นข้อความ' src={sq02} no="รูปที่ 46" cap='สัดส่วนตัวอักษร: Kaggle กับ CSIC จริง'
    what='สัดส่วนตัวอักษร ตัวเลข ช่องว่าง และเครื่องหมาย ของข้อความ 4 กลุ่ม'
    why='เปรียบเทียบชุดฝึกกับค่าที่ sensor จะเจอจริงบนเว็บ'
    look='benign ของ Kaggle มีเครื่องหมาย 7% แต่ benign จริงใน CSIC 12% และตัวเลข 14% — ข้อความเว็บจริงยุ่งกว่าที่ v1 เคยเห็น' />
);
const S3: Page = () => (
  <WidePage part='07 — EDA Injection · 3/8' title='ทำไม v1 กลายเป็นตัวนับเครื่องหมาย' src={sq03} no="รูปที่ 47" cap='จำนวนเครื่องหมายต่อค่า: Kaggle benign, CSIC benign, Kaggle SQLi'
    what='การกระจายจำนวนเครื่องหมายวรรคตอนต่อค่า ของ benign (Kaggle), benign จริง (CSIC) และ SQLi (Kaggle)'
    why='แสดงสาเหตุของ false alarm ครึ่งหนึ่ง: benign จริงอยู่ใกล้ SQLi มากกว่า benign ที่โมเดลเคยเห็น'
    look='มัธยฐาน 2 (Kaggle benign) · 9 (CSIC benign) · 12 (Kaggle SQLi) — ค่าปกติจริงถูกมองเป็น SQLi' />
);
const S4: Page = () => (
  <SidePage part='07 — EDA Injection · 4/8' title='v1 เรียนได้ดีบนข้อสอบ' src={sq07} no="รูปที่ 48" cap='loss และ accuracy ของ v1 ต่อ epoch'
    what='loss และ accuracy ของ train กับ validation ของ v1 ตลอด 20 epoch'
    why='ตรวจว่าเทรนปกติ ไม่ overfit และตัวเลข 99.8% มาจากไหน'
    look='val accuracy ≈ 0.998 ที่ epoch 20 loss ลู่เข้าหากัน — เทรนถูกต้องทุกอย่าง แต่ validation มาจากชุดเดียวกับที่ฝึก' note='โมเดลที่เทรนสมบูรณ์แบบ ยังตอบผิดโจทย์ได้ถ้าข้อมูลไม่ตรงงานจริง' />
);
const S5: Page = () => (
  <SidePage part='07 — EDA Injection · 5/8' title='คะแนนของ v1 กับ v2 บนค่าจริงของ CSIC' src={sq04} no="รูปที่ 49" cap='การกระจายคะแนน P[SQLi] (แกนตั้ง log) เส้นประ = threshold 0.75'
    what='ฮิสโตแกรมคะแนนของ v1 (บน) และ v2 (ล่าง) บนค่าปกติ 3,399 ค่า และค่าโจมตี 432 ค่า ที่ไม่เคยใช้เทรน'
    why='ดูว่าโมเดลแยกสองกลุ่มได้ชัดไหม ไม่ใช่แค่ผ่านเกณฑ์หรือไม่'
    look='v1: ค่าปกติกองที่ 0 และ 1 เท่าๆ กัน (45.4% ≥ 0.75) · v2: ค่าปกติแทบอยู่ที่ 0 (0.1%) และโจมตีอยู่ที่ 1 (96.5%)' />
);
const S6: Page = () => (
  <WidePage part='07 — EDA Injection · 6/8' title='เลื่อน threshold ช่วย v1 ได้ไหม' src={sq05} no="รูปที่ 50" cap='false alarm และ recall ที่ threshold ต่างๆ'
    what='เปอร์เซ็นต์ค่าปกติที่ถูกเตือนผิด (ซ้าย) และค่าโจมตีที่จับได้ (ขวา) เมื่อเปลี่ยน threshold'
    why='ตรวจว่าแก้ที่ threshold ได้โดยไม่ต้องเทรนใหม่ไหม'
    look='v1 ที่ 0.99 ก็ยังเตือนผิดกว่า 38% ขณะที่ recall ตกลง — คะแนนแยกไม่ออก ไม่ใช่เกณฑ์ผิด · v2 ราบใกล้ 0 ทุกเกณฑ์' />
);
const S7: Page = () => (
  <WidePage part='07 — EDA Injection · 7/8' title='ตัวอักษรที่ต่างกันที่สุดระหว่างปกติกับโจมตี' src={sq08} no="รูปที่ 51" cap='สัดส่วนของ 22 ตัวอักษรที่ต่างกันมากสุด (CSIC test)'
    what='ตัวอักษร 22 ตัวที่สัดส่วนต่างกันมากที่สุดระหว่างค่าปกติกับค่าโจมตีใน CSIC test'
    why='ยืนยันว่าสัญญาณระดับตัวอักษรมีจริงและ vocab ครอบคลุมพอ'
    look="เครื่องหมาย ' และ ; พุ่งในค่าโจมตี (~4.7% vs ~0) · แต่ตัวอักษรไทยอยู่นอก vocab ทั้งหมด (เช่น “รองเท้า” 7 จาก 7 ตัว)" />
);
const S8: Page = () => (
  <WidePage part='07 — EDA Injection · 8/8' title='v1 เทียบ v2 บนชุดเดียวกัน' src={sq09} no="รูปที่ 52" cap='เตือนผิดและ recall ที่ threshold 0.75 (ML ล้วน)'
    what='เทียบ v1 กับ v2 สามตัวชี้วัดบนชุด CSIC test ที่ไม่เคยใช้เทรน ใช้ ML ล้วนก่อนกฎและด่านโครงสร้าง'
    why='สรุปผลของการเปลี่ยนข้อมูลเทรน ไม่ใช่การเปลี่ยนสถาปัตยกรรม'
    look='ค่าปกติเตือนผิด 45.4% → 0.1% · ทั้ง request 40.5% → 5.9% · recall 81.9% → 96.5% (เมื่อรวมกฎ+ด่าน: 0/10,800 request)' />
);

/* 32 — SQLi */
const SQLi: Page = () => (
  <Frame part="07 — Injection Model · SQLi" title="SQLi v1: 99.7% บนข้อสอบ แต่พลาดบนคำขอจริง">
    <div style={{ flex: 1, minHeight: 0, display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 64, paddingBottom: 30 }}>
      <div style={{ ...notesCol, gap: 22 }}>
        <Note label="v1 บนคำขอ HTTP จริง" color={RED}>ส่ง URL เต็มให้โมเดล จับได้แค่ 1 จาก 12 การโจมตี</Note>
        <Note label="โมเดลเป็นตัวตรวจเครื่องหมาย" color={RED}>benign ใน CSIC 45.4% ได้คะแนน ≥ 0.75</Note>
        <Note label="ข้อมูลเทรนไม่ตรง" color={RED}>เทรนจาก benign ที่เป็นอีเมลและคำเดี่ยว</Note>
      </div>
      <div style={{ ...notesCol, gap: 22, paddingLeft: 52, borderLeft: `1px solid ${RULE}` }}>
        <Note label="v2 + ดึงค่าทีละตัว + rules" color={TEAL}>benign เตือนผิด 0.06% (v1 45.4%) · จับได้ 96.5%</Note>
        <Note label="ทั้ง pipeline">0 จาก 10,800 benign ถูกเตือน · จับ 311 จาก 311</Note>
        <Note label="ชุดเขียนเอง">จับ 42/42 · เตือนผิด 1/33</Note>
        <div style={{ fontFamily: BODY, fontSize: 23, lineHeight: 1.5, color: MUTED }}>
          ยังไม่ผ่านการทดสอบกับ traffic จริงบน LAN หรือ HTTPS · CSIC เป็นเว็บเดียวที่มีการโจมตีสังเคราะห์
        </div>
      </div>
    </div>
  </Frame>
);

const D8: Page = () => (
  <Divider n="08" title="ผลสดและข้อจำกัด" sub="สิ่งที่พิสูจน์แล้ว สิ่งที่ยังไม่พิสูจน์ และก้าวต่อไป" items={['ผลบน dashboard', 'ข้อจำกัด', 'ก้าวต่อไป']} color={ACCENT} />
);

/* 29 — live dashboard */
const Live: Page = () => (
  <Frame part="08 — ผลสดบน Dashboard" title="ผลบน dashboard ตอนโจมตีสด">
    <div style={{ flex: 1, minHeight: 0, display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 64, paddingBottom: 30 }}>
      <div style={{ ...notesCol, gap: 30 }}>
        <div style={{ fontFamily: MONO, fontSize: 20, color: MUTED, letterSpacing: '0.06em' }}>FLOW MODEL ที่ fine-tune แล้ว</div>
        <Stat value="DoS 0.97" label="ความมั่นใจที่ทำนายจาก IP ผู้โจมตี" color={AMBER} />
        <Stat value="DDoS 0.96–0.99" label="จากแหล่งโจมตี .11–.18 (ของเดิม v2 ได้ DDoS recall 0)" color={RED} />
      </div>
      <div style={{ ...notesCol, gap: 22, paddingLeft: 52, borderLeft: `1px solid ${RULE}` }}>
        <Note label="ที่ทำงานคู่กัน">rate rules ยังเป็นชั้นป้องกันที่ไม่ขึ้นกับเครื่องมือ</Note>
        <Note label="ยังไม่พิสูจน์" color={AMBER}>ทดสอบในห้องทดลองเดียว (VM เดียว) ยังไม่ใช่ LAN ที่มี traffic หลากหลาย</Note>
        <Note label="ปิดไว้" color={AMBER}>Intrusion Model บน traffic สด ปิดไว้ เพราะเติมได้แค่ 6 จาก 41 feature ที่เหลือ nfstream วัดไม่ได้</Note>
        <Note label="ยังไม่บังคับ" color={AMBER}>“Blocked IPs” เป็นแค่บันทึก ยังไม่ได้ block ที่ firewall</Note>
      </div>
    </div>
  </Frame>
);

/* 33 — limitations + next */
const End: Page = () => (
  <Frame part="08 — ข้อจำกัด · ก้าวต่อไป" title="สิ่งที่ยังทำไม่ได้ และก้าวต่อไป">
    <div style={{ flex: 1, minHeight: 0, display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 64, paddingBottom: 30 }}>
      <div style={{ ...notesCol, gap: 20 }}>
        <div style={{ fontFamily: MONO, fontSize: 20, color: AMBER, letterSpacing: '0.06em' }}>ข้อจำกัดที่ตรวจพบ</div>
        <Bullet color={AMBER}>DoS โหลดต่ำ (siege/ab) ดูคล้าย benign จึงพลาด</Bullet>
        <Bullet color={AMBER}>DDoS/BruteForce เครื่องมือใหม่ เพราะมีตัวอย่างเครื่องมือน้อย</Bullet>
        <Bullet color={AMBER}>ข้อมูล lab มาจาก VM เดียว ถ้าย้ายที่ต้องจับของที่นั่นใหม่</Bullet>
        <Bullet color={AMBER}>R2L มีเพดานบน KDDTest+ และ SQLi ยังไม่ทดสอบ HTTPS</Bullet>
      </div>
      <div style={{ ...notesCol, gap: 20, paddingLeft: 52, borderLeft: `3px solid ${ACCENT}` }}>
        <div style={{ fontFamily: MONO, fontSize: 20, color: ACCENT, letterSpacing: '0.06em' }}>ก้าวต่อไป</div>
        <Bullet>จับ traffic LAN จริงให้หลากหลายขึ้น แล้ว fine-tune ซ้ำ</Bullet>
        <Bullet>เพิ่มเครื่องมือ DDoS และ BruteForce หลายแบบ</Bullet>
        <Bullet>วัด false alarm ของโมเดล R2L ที่เติมข้อมูลจริง ก่อน deploy</Bullet>
        <div style={{ fontFamily: DISPLAY, fontWeight: 500, fontSize: 30, lineHeight: 1.45, color: INK, marginTop: 6 }}>
          ผลที่ซื่อสัตย์สำคัญกว่าตัวเลขสวย: ทุกจุดอ่อนข้างต้นวัดและบันทึกไว้แล้ว
        </div>
      </div>
    </div>
  </Frame>
);

export const meta: SlideMeta = {
  title: 'CyberShield: เส้นทางตั้งแต่ข้อมูลจนถึงระบบจริง',
  createdAt: '2026-10-10T20:46:04.539Z',
};

export default [
  Cover, Agenda, Glance, Architecture, Timeline,
  D2, V1, Improved, E1, E2, E3, E4, E5, E6, E7,
  D3, V2, V3,
  D4, Lab, Round2, ProcFlow, Attempts, AttemptsChart, C17,
  L1, L2, L3, L4, L5, L6, L7,
  D5, R1, R2, R3, R4, R5, R6, R7, R8, R9,
  D6, ProcNsl, N1, N2, N3, N4, N5, N6, N7, N8, N9, N10, N11, N12, N13, Intrusion, N14, N15, N16, N17, N18, IntrusionLive,
  D7, ProcSqli, S1, S2, S3, S4, S5, S6, S7, S8, SQLi,
  D8, Live, End,
] satisfies Page[];
