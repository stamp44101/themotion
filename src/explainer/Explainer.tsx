// A 60 s vertical explainer: how the clips are made, and who does what. Seven scenes on
// stills from the clips (public/explainer/), Kanit like the Overlay, a slow push-in on each
// still, lines that rise in one by one, and a progress bar. Render: npm run render:explainer
import React, {useEffect, useState} from 'react';
import {AbsoluteFill, Audio, Img, continueRender, delayRender, interpolate, staticFile, useCurrentFrame} from 'remotion';
import {FPS, H, W} from '../lib';

const FONT = "'Kanit', sans-serif";
export const EXPLAINER_SECONDS = 60;

type Scene = {
  t: [number, number];
  bg: string;
  /** vertical focus of the still, 0..1 (where the push-in centres) */
  focus?: number;
  dark?: number;
  kicker: string;
  title: string[];
  body: string[];
  /** small cards that appear one by one under the body */
  cards?: string[];
};

const SCENES: Scene[] = [
  {
    t: [0, 6],
    bg: 'boat.jpg',
    focus: 0.35,
    kicker: 'คำถามที่เจอบ่อย',
    title: ['คนทำ', 'หรือ AI ทำ?'],
    body: ['ขอตอบให้ชัดใน 1 นาที'],
  },
  {
    t: [6, 14],
    bg: 'war.jpg',
    focus: 0.45,
    kicker: 'ข้อแรก',
    title: ['ไม่ใช่วิดีโอ', 'ที่ AI “เจน” ขึ้นมา'],
    body: ['ทุกเฟรมคือโมเดล 3D ที่คอมพิวเตอร์วาดจากโค้ด', 'เสียงประกอบก็สังเคราะห์จากโค้ด', 'ไม่มีภาพหรือวิดีโอที่ถูกเจนด้วย AI เลย'],
  },
  {
    t: [14, 23],
    bg: 'night.jpg',
    focus: 0.5,
    dark: 0.7,
    kicker: 'ที่มา',
    title: ['เริ่มจากคนก่อน'],
    body: ['ผมร่างกระบวนการทั้งหมดใน Remotion เอง', 'แล้วเขียนเป็นสเปค'],
    cards: ['เมืองหนึ่งจะเล่ายังไง', 'ปีไหนต้องหยุด ปีไหนต้องเร่ง', 'กล้องเดินแบบไหน', 'ตัวเลขปี คำบรรยาย เสียง ซิงก์กันยังไง'],
  },
  {
    t: [23, 32],
    bg: 'proc.jpg',
    focus: 0.5,
    kicker: 'AI เข้ามาตรงไหน',
    title: ['AI เขียนโค้ด', 'ตามสเปคนั้น'],
    body: ['ทีละชิ้น ทีละเมือง', 'อะไรที่ออกมาไม่ตรงกับที่ร่างไว้ ผมสั่งแก้จนตรง', 'AI ไม่ได้เลือกว่าจะเล่าอะไร', 'มันทำให้สิ่งที่ผมออกแบบไว้ทำงานได้'],
  },
  {
    t: [32, 41],
    bg: 'sheet.jpg',
    focus: 0.3,
    dark: 0.55,
    kicker: 'ข้อมูล',
    title: ['ประวัติศาสตร์', 'คืองานคน'],
    body: ['ทุกวันที่ถูกค้นและตรวจก่อนลง', 'ข้อสันนิษฐานเขียนว่า “ราว” หรือ “ตามตำนาน”', 'และไล่ดูทีละเฟรมก่อนปล่อย'],
  },
  {
    t: [41, 50],
    bg: 'war.jpg',
    focus: 0.6,
    kicker: 'ผู้ตรวจตัวจริง',
    title: ['คนดู'],
    body: ['ทุกคอมเมนต์ที่ชี้จุดผิด เราแก้จริง', 'และนำไปปรับคลิปต่อไป'],
    cards: ['ทิศของอ่าวไทย — ชลบุรี', 'ถนนมิตรภาพ — โคราช', 'ผังเมืองเก่า — นครศรีฯ'],
  },
  {
    t: [50, 60],
    bg: 'boat.jpg',
    focus: 0.35,
    dark: 0.72,
    kicker: 'สรุป',
    title: ['คนออกแบบและตรวจ', 'AI เขียนโค้ดตามสเปค', 'คอมพิวเตอร์วาด'],
    body: ['เจอจุดไหนผิด ทักมาได้เลย 🙏', 'เราอยากให้ประวัติศาสตร์เมืองถูกต้อง', 'มากกว่าอยากให้คลิปดูดี'],
  },
];

const clamp01 = (x: number) => Math.max(0, Math.min(1, x));
const ease = (x: number) => 1 - (1 - clamp01(x)) ** 3;

const SceneView: React.FC<{s: Scene; t: number}> = ({s, t}) => {
  const [t0, t1] = s.t;
  const local = t - t0;
  const len = t1 - t0;
  const fadeIn = ease(local / 0.6);
  const fadeOut = 1 - ease((local - (len - 0.6)) / 0.6);
  const alpha = Math.min(fadeIn, fadeOut);
  const zoom = 1.04 + 0.08 * (local / len);
  const line = (i: number, start: number, gap = 0.22) => {
    const k = ease((local - start - i * gap) / 0.5);
    return {opacity: k * alpha, transform: `translateY(${(1 - k) * 28}px)`};
  };
  const titleFont = s.title.some((l) => l.length > 14) ? 92 : 108;
  return (
    <AbsoluteFill style={{opacity: alpha}}>
      <Img
        src={staticFile(`explainer/${s.bg}`)}
        style={{position: 'absolute', width: '100%', height: '100%', objectFit: 'cover', objectPosition: `50% ${(s.focus ?? 0.5) * 100}%`, transform: `scale(${zoom})`, transformOrigin: `50% ${(s.focus ?? 0.5) * 100}%`}}
      />
      <AbsoluteFill style={{background: `linear-gradient(180deg, rgba(6,10,32,${s.dark ?? 0.5}) 0%, rgba(6,10,32,${(s.dark ?? 0.5) * 0.45}) 40%, rgba(6,10,32,0.92) 100%)`}} />
      <div style={{position: 'absolute', left: 110, right: 110, bottom: 330, fontFamily: FONT, color: '#fff'}}>
        <div style={{fontSize: 40, fontWeight: 500, letterSpacing: 4, color: '#f6cf73', marginBottom: 18, ...line(0, 0.1)}}>{s.kicker}</div>
        {s.title.map((l, i) => (
          <div key={i} style={{fontSize: titleFont, fontWeight: 700, lineHeight: 1.18, textShadow: '0 4px 24px rgba(0,0,0,.5)', ...line(i, 0.3)}}>
            {l}
          </div>
        ))}
        <div style={{height: 30}} />
        {s.body.map((l, i) => (
          <div key={i} style={{fontSize: 46, fontWeight: 400, lineHeight: 1.5, color: '#e9ecf5', ...line(i, 0.9 + s.title.length * 0.22)}}>
            {l}
          </div>
        ))}
        {s.cards && (
          <div style={{display: 'flex', flexWrap: 'wrap', gap: 14, marginTop: 30}}>
            {s.cards.map((c, i) => (
              <div
                key={i}
                style={{
                  fontSize: 38,
                  fontWeight: 500,
                  padding: '12px 26px',
                  borderRadius: 999,
                  background: 'rgba(246,207,115,0.16)',
                  border: '2px solid rgba(246,207,115,0.7)',
                  color: '#ffe5a3',
                  ...line(i, 1.6 + (s.title.length + s.body.length) * 0.22, 0.35),
                }}
              >
                {c}
              </div>
            ))}
          </div>
        )}
      </div>
    </AbsoluteFill>
  );
};

export const Explainer: React.FC = () => {
  const frame = useCurrentFrame();
  const t = frame / FPS;
  const [handle] = useState(() => delayRender('Loading Kanit'));
  useEffect(() => {
    Promise.all(['400', '500', '700'].map((w) => document.fonts.load(`${w} 40px Kanit`, 'ไทย 0123'))).then(() => continueRender(handle));
  }, [handle]);
  const progress = interpolate(t, [0, EXPLAINER_SECONDS], [0, 1]);
  return (
    <AbsoluteFill style={{background: '#0b1020', width: W, height: H}}>
      {SCENES.filter((s) => t >= s.t[0] - 0.01 && t < s.t[1]).map((s) => (
        <SceneView key={s.t[0]} s={s} t={t} />
      ))}
      <div style={{position: 'absolute', left: 110, right: 110, bottom: 230, height: 6, borderRadius: 3, background: 'rgba(255,255,255,0.18)'}}>
        <div style={{width: `${progress * 100}%`, height: '100%', borderRadius: 3, background: '#f6cf73'}} />
      </div>
      <div style={{position: 'absolute', right: 110, bottom: 170, fontFamily: FONT, fontSize: 34, fontWeight: 500, color: '#aab2c8'}}>1minute.city</div>
      <Audio src={staticFile('soundtrack_explainer.wav')} />
    </AbsoluteFill>
  );
};
