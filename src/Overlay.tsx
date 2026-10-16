import React from 'react';
import {Img, staticFile, useCurrentFrame} from 'remotion';
import {proj} from './geometry';
import {CAPTIONS, Callout, Caption, ERAS, FINALE_LEAD, FPS, INTRO_END, SECONDS, bump, camPoint, camera, sstep, yearAt} from './lib';

const FONT = "'Kanit', sans-serif";

/**
 * TikTok / Reels safe area in video pixels (1080×1920). Tall phones crop ~100 px off each side,
 * the search bar covers the top ~215 px, captions/username cover the bottom ~440 px and the
 * action buttons sit on the right from y≈900.
 */
export const SAFE = {left: 130, right: 950, top: 250, bottom: 1460, rightLow: 860};
// "พ.ศ. 2377" never splits across lines: if a caption wraps, the year moves as one piece.
const keepYear = (s: string) => s.replace(/(พ\.ศ\.|ค\.ศ\.)\s+(?=\d)/g, '$1\u00a0');
const shadow = '0 3px 14px rgba(0,0,0,0.55), 0 1px 3px rgba(0,0,0,0.6)';

const chedi = proj(0, 0.02);
const gate = proj(0, 1.05);
const moat = proj(0.45, 1.12);
const chetYot = proj(1.35, -1.55);
const nimman = proj(1.7, -1.5);

const CALLOUTS: (Callout & {p?: number})[] = [
  {t0: 4, t1: 8.6, x: 330, y: 650, dx: 110, dy: -40, label: 'ดอยสุเทพ', p: 0.55},
  {t0: 4.4, t1: 8.6, x: 820, y: 1482, dx: -30, dy: 120, label: 'แม่น้ำปิง', p: 1.2},
  {t0: 9.6, t1: 13.8, x: 95, y: 1100, dx: 60, dy: -120, label: 'ลำพูน'},
  {t0: 16, t1: 19.2, x: moat.x, y: moat.y, dx: 90, dy: 120, label: 'คูเมือง'},
  {t0: 19.6, t1: 23.6, x: gate.x, y: gate.y - 30, dx: 150, dy: 160, label: 'ประตูท่าแพ'},
  {t0: 24.3, t1: 27.6, x: 560, y: 745, dx: 170, dy: -50, label: 'พระธาตุดอยสุเทพ', p: 0.55},
  {t0: 25.6, t1: 29.2, x: chedi.x, y: chedi.y - 160 * chedi.s * 0.95, dx: -190, dy: -110, label: 'เจดีย์หลวง'},
  {t0: 27.2, t1: 29.2, x: chetYot.x, y: chetYot.y - 40, dx: 60, dy: -120, label: 'วัดเจ็ดยอด'},
  {t0: 29.6, t1: 31.8, x: chedi.x, y: chedi.y - 100 * chedi.s * 0.95, dx: -190, dy: -150, label: 'พ.ศ. 2088'},
  {t0: 45.7, t1: 48, x: 880, y: 1590, dx: -60, dy: -120, label: 'สถานีรถไฟเชียงใหม่', p: 1.2},
  {t0: 51, t1: 55, x: nimman.x, y: nimman.y - 100, dx: -60, dy: -110, label: 'นิมมานเหมินท์'},
];

const pillWidth = (s: string) => s.replace(/[ัิ-ฺ็-๎]/g, '').length * 17 + 44;

export type ScreenCallout = {
  t0: number;
  t1: number;
  label: string;
  dx: number;
  dy: number;
  at: (t: number) => {x: number; y: number};
};

const FLAT_CALLOUTS: ScreenCallout[] = CALLOUTS.map((c) => ({
  ...c,
  at: (t: number) => camPoint(camera(t), c.p ?? 1, c.x, c.y),
}));

export type Story = {
  captions: Caption[];
  eras: {t: number; label: string}[];
  yearAt: (t: number) => number;
  intro: {kicker: string; title: string; sub: string};
  finale: {kicker: string; title: string; sub: string};
  /** Years before this are shown with "ราว" (approximate). */
  approxBefore: number;
  /** Clip length in seconds (default 60). */
  duration?: number;
  /** beat progress (src/engine/story.ts): 0 -> 1 across a beat's seconds */
  beat?: (id: string, t: number) => number;
  /** [t0, t1] per beat id, for actors and the checks */
  beats?: Record<string, [number, number]>;
};

export const CHIANG_MAI_STORY: Story = {
  captions: CAPTIONS,
  eras: ERAS,
  yearAt,
  intro: {kicker: 'ไทม์แลปส์ประวัติศาสตร์', title: 'เชียงใหม่', sub: 'จากผืนป่า สู่นครแห่งล้านนา'},
  finale: {kicker: 'พ.ศ. 1839 – 2569', title: 'เชียงใหม่', sub: '730 ปี นครพิงค์ ยังคงเปล่งแสง'},
  approxBefore: 1290,
};

const NOW = 2026;
const fmt = (n: number) => n.toLocaleString('en-US');

export const Overlay: React.FC<{callouts?: ScreenCallout[]; story?: Story}> = ({
  callouts = FLAT_CALLOUTS,
  story = CHIANG_MAI_STORY,
}) => {
  const frame = useCurrentFrame();
  const t = frame / FPS;
  const Y = story.yearAt(t);
  const be = Math.round(Y) + 543;
  const deep = Y < -100000; // geological time: millions of years ago
  const ago = !deep && Y < 300; // prehistory: years ago
  const CAPTIONS = story.captions;
  const ERAS = story.eras;

  const introOp = 1 - sstep(INTRO_END - 0.7, INTRO_END, t);
  const D = story.duration ?? SECONDS;
  const counterOp = sstep(INTRO_END - 0.1, INTRO_END + 0.5, t) * (1 - sstep(D - FINALE_LEAD - 0.6, D - FINALE_LEAD + 0.2, t));
  const finaleOp = sstep(D - FINALE_LEAD, D - FINALE_LEAD + 1, t);
  const progress = t / D;
  const leak = Math.max(0, ...ERAS.map((e) => bump(t, e.t - 0.25, e.t + 0.9, 0.4)), bump(t, D - 4.4, D - 2.8, 0.6));

  return (
    <>
      {/* light leak on era changes */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          opacity: leak * 0.55,
          mixBlendMode: 'screen',
          background:
            'radial-gradient(ellipse 70% 45% at 100% 8%, rgba(255,170,80,0.95), rgba(255,120,60,0.35) 45%, rgba(0,0,0,0) 75%)',
        }}
      />
      {/* vignette */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          background: 'radial-gradient(ellipse 85% 70% at 50% 52%, rgba(0,0,0,0) 55%, rgba(0,0,0,0.42) 100%)',
        }}
      />
      {/* film grain */}
      <div style={{position: 'absolute', inset: 0, overflow: 'hidden', opacity: 0.07, mixBlendMode: 'overlay'}}>
        <Img src={staticFile('grain.png')} style={{display: 'none'}} />
        <div
          style={{
            position: 'absolute',
            inset: 0,
            backgroundImage: `url(${staticFile('grain.png')})`,
            backgroundRepeat: 'repeat',
            backgroundPosition: `${(frame * 137) % 512}px ${(frame * 229) % 512}px`,
          }}
        />
      </div>
      {/* legibility gradients */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          background:
            'linear-gradient(180deg, rgba(5,10,25,0.55) 0%, rgba(5,10,25,0.25) 22%, rgba(5,10,25,0) 34%, rgba(5,10,25,0) 84%, rgba(5,10,25,0.6) 100%)',
        }}
      />

      {/* Year counter */}
      <div
        style={{
          position: 'absolute',
          left: SAFE.left,
          top: SAFE.top,
          opacity: counterOp,
          fontFamily: FONT,
          color: '#fff',
          textShadow: shadow,
        }}
      >
        <div style={{display: 'flex', alignItems: 'baseline', gap: 18}}>
          {(ago || deep || Y < story.approxBefore) && <span style={{fontSize: 44, fontWeight: 500, opacity: 0.9}}>ราว</span>}
          {!ago && !deep && <span style={{fontSize: 52, fontWeight: 600, color: '#f6cf73'}}>พ.ศ.</span>}
          <span style={{fontSize: 156, fontWeight: 700, lineHeight: 1, fontVariantNumeric: 'tabular-nums'}}>
            {deep ? Math.max(1, Math.round(-Y / 1e6)) : ago ? fmt(Math.round((NOW - Y) / 100) * 100) : be}
          </span>
          {(deep || ago) && (
            <span style={{fontSize: 52, fontWeight: 600, color: '#f6cf73'}}>{deep ? 'ล้านปีก่อน' : 'ปีก่อน'}</span>
          )}
        </div>
        <div style={{fontSize: 38, fontWeight: 400, opacity: 0.85, marginTop: 4, letterSpacing: 1}}>
          {deep ? 'ยุคครีเทเชียส' : ago ? 'ยุคก่อนประวัติศาสตร์' : `ค.ศ. ${Math.round(Y)}`}
        </div>
      </div>

      {/* Captions */}
      {CAPTIONS.map((c) => {
        // never fade a caption in under the intro title, whatever t0 a city chose
        const start = Math.max(c.t0, INTRO_END);
        const inn = sstep(start, start + 0.45, t);
        const out = 1 - sstep(c.t1 - 0.35, c.t1, t);
        const op = inn * out;
        if (op <= 0.001) return null;
        return (
          <div
            key={c.t0}
            style={{
              position: 'absolute',
              left: SAFE.left,
              right: 1080 - SAFE.right,
              top: SAFE.top + 228,
              opacity: op,
              transform: `translateY(${(1 - inn) * 26}px)`,
              fontFamily: FONT,
              color: '#fff',
              textShadow: shadow,
            }}
          >
            <div style={{width: 84, height: 6, borderRadius: 3, background: '#f6cf73', marginBottom: 18}} />
            <div style={{fontSize: 74, fontWeight: 600, lineHeight: 1.15}}>{keepYear(c.title)}</div>
            <div style={{fontSize: 40, fontWeight: 400, lineHeight: 1.4, marginTop: 12, opacity: 0.95}}>{keepYear(c.sub)}</div>
          </div>
        );
      })}

      {/* Callouts */}
      <svg viewBox="0 0 1080 1920" width={1080} height={1920} style={{position: 'absolute', inset: 0}}>
        {callouts.map((c) => {
          const op = bump(t, c.t0, c.t1, 0.35);
          if (op <= 0.001) return null;
          const a = c.at(t);
          const w = pillWidth(c.label);
          // keep the label pill inside the safe area (and clear of the right-hand buttons)
          const ly = Math.min(SAFE.bottom - 30, Math.max(SAFE.top + 520, a.y + c.dy));
          const rightEdge = ly > 880 ? SAFE.rightLow : SAFE.right;
          const lx = Math.min(rightEdge - w / 2, Math.max(SAFE.left + w / 2, a.x + c.dx));
          const grow = sstep(c.t0, c.t0 + 0.5, t);
          return (
            <g key={c.label} opacity={op}>
              <circle cx={a.x} cy={a.y} r={7} fill="#f6cf73" stroke="#1a1a1a" strokeWidth={2} />
              <circle cx={a.x} cy={a.y} r={7 + 14 * ((t * 1.2) % 1)} fill="none" stroke="#f6cf73" strokeWidth={2} opacity={1 - ((t * 1.2) % 1)} />
              <line
                x1={a.x}
                y1={a.y}
                x2={a.x + (lx - a.x) * grow}
                y2={a.y + (ly - a.y) * grow}
                stroke="#f6cf73"
                strokeWidth={2.5}
              />
              <g opacity={grow}>
                <rect x={lx - w / 2} y={ly - 27} width={w} height={54} rx={27} fill="rgba(12,16,32,0.78)" stroke="#f6cf73" strokeWidth={2} />
                <text x={lx} y={ly + 11} textAnchor="middle" fontFamily={FONT} fontSize={31} fontWeight={500} fill="#fff">
                  {c.label}
                </text>
              </g>
            </g>
          );
        })}
      </svg>

      {/* (era timeline bar removed: TikTok shows its own progress bar and covers the bottom) */}
      {/* Intro title */}
      {introOp > 0 && (
        <div
          style={{
            position: 'absolute',
            left: 0,
            right: 0,
            top: 470,
            textAlign: 'center',
            fontFamily: FONT,
            color: '#fff',
            textShadow: shadow,
            opacity: introOp * sstep(0, 0.6, t),
            transform: `scale(${1 + t * 0.02})`,
          }}
        >
          <div style={{fontSize: 40, fontWeight: 500, letterSpacing: 6, color: '#f6cf73'}}>{story.intro.kicker}</div>
          <div style={{fontSize: story.intro.title.length > 8 ? 150 : 190, fontWeight: 700, lineHeight: 1.15}}>{story.intro.title}</div>
          <div style={{fontSize: 50, fontWeight: 400}}>{story.intro.sub}</div>
        </div>
      )}

      {/* Finale */}
      {finaleOp > 0 && (
        <div
          style={{
            position: 'absolute',
            left: 0,
            right: 0,
            top: 330,
            textAlign: 'center',
            fontFamily: FONT,
            color: '#fff',
            opacity: finaleOp,
            transform: `translateY(${(1 - finaleOp) * 30}px)`,
            textShadow: '0 0 30px rgba(255,170,70,0.65), 0 3px 12px rgba(0,0,0,0.6)',
          }}
        >
          <div style={{fontSize: 44, fontWeight: 500, letterSpacing: 4, color: '#f6cf73'}}>{story.finale.kicker}</div>
          <div style={{fontSize: story.finale.title.length > 8 ? 160 : 200, fontWeight: 700, lineHeight: 1.15}}>{story.finale.title}</div>
          <div style={{fontSize: 52, fontWeight: 500, padding: '0 60px'}}>{story.finale.sub}</div>
        </div>
      )}
    </>
  );
};
