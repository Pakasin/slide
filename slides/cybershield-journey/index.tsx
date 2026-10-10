import type { CSSProperties, ReactNode } from 'react';
import type { DesignSystem, Page, SlideMeta, SlideTransition } from '@open-slide/core';
import { Step, Steps, useSlidePageNumber } from '@open-slide/core';

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
@media (prefers-reduced-motion: reduce){ .cj-stagger > *{ animation: none; opacity: 1; } }
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

/* ═══════════════════════════════ PAGES ═══════════════════════════════ */

/* 1 — cover */
const Cover: Page = () => (
  <div style={{ ...fill, background: 'var(--osd-bg)', color: INK, position: 'relative', overflow: 'hidden' }}>
    {/* oversized ghost numeral */}
    <div style={{ position: 'absolute', right: -60, bottom: -120, fontFamily: DISPLAY, fontSize: 720, fontWeight: 700, color: PAPER2, lineHeight: 1, userSelect: 'none', animation: 'cj-fade 1.1s ease both' }}>
      01
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
        เล่าทุกขั้นตอน ตั้งแต่ชุดข้อมูล CSE-CIC-IDS2018 จนถึงการทดสอบกับเครื่องมือโจมตีจริงบน VM
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
  <div style={{ display: 'grid', gridTemplateColumns: '120px 1fr', gap: 28, alignItems: 'baseline', padding: '13px 0', borderTop: `1px solid ${RULE}` }}>
    <div style={{ fontFamily: DISPLAY, fontSize: 50, fontWeight: 700, color: ACCENT, lineHeight: 1 }}>{n}</div>
    <div>
      <div style={{ fontFamily: DISPLAY, fontSize: 33, fontWeight: 600, lineHeight: 1.25 }}>{title}</div>
      <div style={{ fontFamily: BODY, fontSize: 24, lineHeight: 1.45, color: MUTED, marginTop: 2 }}>{sub}</div>
    </div>
  </div>
);
const Agenda: Page = () => (
  <Frame part="สารบัญ" title="เรื่องที่จะเล่า 6 ตอน">
    <div style={{ flex: 1, minHeight: 0, paddingBottom: 24 }} className="cj-stagger">
      <AgendaRow n="01" title="ภาพรวมระบบ" sub="เซนเซอร์ โมเดล และไทม์ไลน์ของโปรเจกต์" />
      <AgendaRow n="02" title="ข้อมูลที่ใช้เทรน" sub="จาก CSE-CIC-IDS2018 สู่ Improved dataset พร้อม EDA 7 กราฟ" />
      <AgendaRow n="03" title="โมเดล Flow v2" sub="ดีบนเครื่องมือที่เคยเห็น แต่ทั่วไปไปยังเครื่องมือใหม่ได้น้อย" />
      <AgendaRow n="04" title="ห้องทดลองบน VM" sub="โจมตีของจริง พบว่าโมเดลมองไม่เห็น แล้วแก้ด้วย fine-tune" />
      <AgendaRow n="05" title="EDA ตอนรันในระบบ" sub="9 กราฟจากโมเดลที่ใช้งานจริง ทดสอบกับข้อมูล lab และ CIC" />
      <AgendaRow n="06" title="โมเดลอื่น ผลสด และข้อจำกัด" sub="Intrusion (R2L) · SQLi · ผลบน dashboard · สิ่งที่ยังทำไม่ได้" />
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
    <div style={{ fontSize: 46, color: ACCENT, lineHeight: 1 }}>→</div>
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

/* 19 — CIC base EDA */
const C17: Page = () => (
  <Frame part="04 — EDA ข้อมูลฐาน CIC-IDS2017 (nfstream)" title="ข้อมูลฐานที่สกัดใหม่ด้วย config ของเรา">
    <div style={{ flex: 1, minHeight: 0, display: 'grid', gridTemplateColumns: '0.7fr 1.3fr', gridTemplateRows: '1fr auto', gap: '22px 40px', paddingBottom: 20 }}>
      <Fig src={c17Counts} no="รูปที่ 8" cap="จำนวน window ต่อคลาส" />
      <Fig src={c17Dists} no="รูปที่ 9" cap="การกระจายของ feature ต่อคลาส" />
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

/* 20–28 — in-system EDA */
const R1: Page = () => (
  <WidePage part="05 — EDA ในระบบ · 1/9" title="ชุดทดสอบ lab เทียบ CIC" src={r01} no="รูปที่ 10" cap="จำนวน window ชุดทดสอบ: lab (ซ้าย) · CIC (ขวา)"
    what="จำนวน window ของชุดทดสอบ ซ้าย = lab ที่จับเอง ขวา = CIC-IDS2017 ผ่าน nfstream"
    why="รู้ว่าชุด lab ไม่สมดุล (DDoS 320, BruteForce 95) ผลรายคลาสของสองคลาสนี้จึงไม่นิ่ง"
    look="ฝั่งซ้ายคือเครื่องมือจริงที่โจมตีเอง · ฝั่งขวาคือข้อมูลสาธารณะที่สมดุล 4,000 ต่อคลาส" />
);
const R2: Page = () => (
  <WidePage part="05 — EDA ในระบบ · 2/9" title="จำนวน window ต่อ capture" src={r02} no="รูปที่ 11" cap="จำนวน window แยกตามชื่อ capture"
    what="จำนวน window ในชุดทดสอบ lab แยกตามชื่อ capture (เครื่องมือและสถานการณ์)"
    why="ตรวจว่าผลรวมไม่ถูกครอบงำด้วยไม่กี่ capture"
    look="benign_siege (3,100+) และ synflood (~1,300 สองชุด) ครอบงำ ส่วนท้ายมีสิบกว่า window — recall ไม่นิ่ง" />
);
const R3: Page = () => (
  <SidePage part="05 — EDA ในระบบ · 3/9" title="Confusion matrix บน lab" src={r03} no="รูปที่ 12" cap="แถว = จริง · คอลัมน์ = ทำนาย"
    what="แถว = ความจริง คอลัมน์ = ที่ทำนาย ในวงเล็บคือจำนวน window"
    why="ดูว่าพลาดแบบไหน สำหรับ IDS การพลาดการโจมตีแย่กว่าการเตือนผิด"
    look="DoS 318 window (8%) ถูกทำนายเป็น BENIGN · benign 23 ถูกเตือนเป็น DDoS · BruteForce ถูกทั้ง 95"
    note="ชุดนี้รวมข้อมูลที่ใช้เทรน เป็นภาพประกอบ · ตัวเลข held-out จริง: benign เตือนผิด 3.7%, DoS 0.87" />
);
const R4: Page = () => (
  <SidePage part="05 — EDA ในระบบ · 4/9" title="Confusion matrix บน CIC" src={r04} no="รูปที่ 13" cap="matrix บนชุด CIC-IDS2017"
    what="matrix แบบเดียวกัน บนชุด CIC-IDS2017 ที่สกัดด้วย nfstream"
    why="เช็กว่า fine-tune กับ lab แล้วโมเดลไม่ลืมข้อมูลฐาน"
    look="accuracy 99.5% · F1 ทุกคลาส 0.99–1.00 (DoS 0.991, BruteForce 0.994, DDoS 0.998, BENIGN 0.995)" />
);
const R5: Page = () => (
  <WidePage part="05 — EDA ในระบบ · 5/9" title="recall แยกตามเครื่องมือ" src={r05} no="รูปที่ 14" cap="recall ต่อ capture · สีตามคลาสจริง"
    what="recall ของแต่ละ capture สีตามคลาสจริง (น้ำเงิน benign, ส้ม DoS, แดง DDoS, เขียว BruteForce)"
    why="ผลรวมซ่อนจุดอ่อนไว้ ต้องดูทีละเครื่องมือจึงรู้ว่าพลาดตรงไหน"
    look="เกือบทุก capture ≈ 1.0 ยกเว้น dos_siege ≈ 0 และ dos_abflood 0.50 (โหลดต่ำ ดูคล้าย benign)" />
);
const R6: Page = () => (
  <SidePage part="05 — EDA ในระบบ · 6/9" title="ความมั่นใจของโมเดล" src={r06} no="รูปที่ 15" cap="ความมั่นใจ: ถูก (8,067) vs ผิด (348)"
    what="ฮิสโตแกรมความมั่นใจ (max softmax) แยกทำนายถูก 8,067 กับทำนายผิด 348"
    why="ใช้ตั้ง threshold แจ้งเตือน ถ้าที่ผิดมักมั่นใจต่ำ ก็กรองหรือลดระดับได้"
    look="ที่ถูกกองที่ ≈1.0 · ที่ผิดกองที่ 0.8–0.9 แต่ยังซ้อนกันบ้าง threshold อย่างเดียวจึงกรองไม่หมด" />
);
const R7: Page = () => (
  <WidePage part="05 — EDA ในระบบ · 7/9" title="ลายเซ็น feature บนข้อมูล lab" src={r07} no="รูปที่ 16" cap="ค่าเฉลี่ย feature ต่อคลาส (flow สุดท้ายของ window)"
    what="ค่าเฉลี่ยของ feature ต่อคลาส จาก flow สุดท้ายของแต่ละ window ในชุด lab"
    why="ยืนยันว่าสิ่งที่โมเดลเรียนจากข้อมูลฐานยังใช้ได้กับ traffic ของเราเอง"
    look="DoS: SYN/RST สูง · DDoS และ BruteForce: pkts/s สูง bytes/pkt ต่ำ — ตรงกับธรรมชาติการโจมตี" />
);
const R8: Page = () => (
  <WidePage part="05 — EDA ในระบบ · 8/9" title="PCA ของ window ใน lab" src={r08} no="รูปที่ 17" cap="PCA · ซ้าย คลาสจริง · ขวา จุดที่ทำนายผิด"
    what="ย่อ window ลงเหลือ 2 มิติ ซ้าย = สีตามคลาสจริง ขวา = จุดที่ทำนายผิดเป็นสีแดง"
    why="ดูภาพรวมว่าคลาสแยกกันเชิงเรขาคณิตไหม และความผิดพลาดกระจุกตรงไหน"
    look="จุดผิดกระจุกบนแนวยาวที่ benign ซ้อน DoS (คือ DoS โหลดต่ำ) · DoS บางกลุ่มแยกขาดชัด" />
);
const R9: Page = () => (
  <SidePage part="05 — EDA ในระบบ · 9/9" title="t-SNE ของ window ใน lab" src={r09} no="รูปที่ 18" cap="t-SNE · สีตามคลาสจริง"
    what="ย่อ window เป็น 2 มิติแบบ t-SNE ที่เน้นความใกล้เคียงเฉพาะที่ สีตามคลาสจริง"
    why="เห็นกลุ่มย่อยที่ PCA มองไม่เห็น เช่นแยกตามเครื่องมือ"
    look="DoS แตกเป็นกลุ่มตามเครื่องมือ · benign เป็นก้อนใหญ่ · จุด DoS ที่แทรกใน benign คือที่มาของ DoS→BENIGN ≈8%" />
);

/* 29 — live dashboard */
const Live: Page = () => (
  <Frame part="06 — ผลสดบน Dashboard" title="ผลบน dashboard ตอนโจมตีสด">
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

/* 32 — SQLi */
const SQLi: Page = () => (
  <Frame part="06 — Injection Model · SQLi" title="SQLi v1: 99.7% บนข้อสอบ แต่พลาดบนคำขอจริง">
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

/* 33 — limitations + next */
const End: Page = () => (
  <Frame part="06 — ข้อจำกัด · ก้าวต่อไป" title="สิ่งที่ยังทำไม่ได้ และก้าวต่อไป">
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
  Cover, Agenda, Architecture, Timeline, V1, Improved,
  E1, E2, E3, E4, E5, E6, E7,
  V2, V3, Lab, Round2, Attempts, C17,
  R1, R2, R3, R4, R5, R6, R7, R8, R9,
  Live, Intrusion, IntrusionLive, SQLi, End,
] satisfies Page[];
