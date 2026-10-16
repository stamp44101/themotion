// Pure data (no React/three) so scripts/export_timeline.mjs can import it for the soundtrack.

import {buildStory} from '../../engine/story';
import {BAN_PRASAT, MONUMENT, PHIMAI, RUNWAY, SEMA, THUNG_SAMRIT} from './Landmarks';

// The story as beats (src/engine/story.ts): each owns its seconds and the years it covers;
// the year curve, captions, eras, callouts and camera keys are derived, and the armies move
// on beat progress. Years below -100000 show as "million years ago" on the counter.
export const STORY = buildStory({
  duration: 60,
  before: -118e6,
  after: 2026,
  camera: [
    [11.6, -40, 2, 5, 96, 40, 28, 30],
    [27, -12, 2, 0, 34, -40, 26, 30],
    [33.8, THUNG_SAMRIT[0], 0, THUNG_SAMRIT[1], 70, 36, 36, 30],
    [35.6, -22, 0, 4, 82, 30, 32, 30],
    [57, 0, 6, 0, 150, 52, 26, 30],
    [60, -2, 6, -2, 230, 54, 26, 30],
  ],
  beats: [
    {
      id: 'dinos',
      t: [0, 7.6],
      year: [-118e6, -98e6],
      caption: {t0: 3, t1: 8.2, title: 'ยุคไดโนเสาร์', sub: 'ที่ราบสูงโคราชเคยเป็นถิ่นไดโนเสาร์ อย่าง “สิรินธรนา โคราชเอนซิส”'},
      era: 'ไดโนเสาร์',
      callouts: [{t0: 4, t1: 7.8, label: 'ลำตะคอง', dx: 60, dy: 110, p: [5, 0, -13]}],
      camera: [
        [0, -4, 2, -6, 320, 38, 34, 30],
        [3, -4, 2, -4, 150, 40, 30, 30],
        [7.4, -2, 2, -4, 110, 46, 30, 30],
      ],
    },
    {
      id: 'banprasat',
      t: [8.2, 11.6],
      year: [-1000, 660],
      caption: {t1: 12, title: 'บ้านปราสาท', sub: 'ราว 3,000 ปีก่อน ชุมชนโบราณตั้งรกราก ทำนา ปั้นหม้อ และฝังศพบรรพชน'},
      era: 'บ้านปราสาท',
      callouts: [{t0: 8.8, t1: 11.0, label: 'แหล่งโบราณคดีบ้านปราสาท', dx: -120, dy: -140, p: [BAN_PRASAT[0], 0.5, BAN_PRASAT[1]]}],
      camera: [
        [8.6, 20, 0, -36, 80, 44, 32, 30],
        [11, 20, 0, -36, 70, 48, 34, 30],
      ],
    },
    {
      // Sema's reclining Buddha (7th-8th c.) is up as its caption lands
      id: 'sema',
      t: [12, 14.4],
      year: [680, 760],
      caption: {t1: 14.6, title: 'พระนอนเมืองเสมา', sub: 'เมืองโบราณสมัยทวารวดี พระพุทธไสยาสน์หินทราย ราวพุทธศตวรรษที่ 13'},
      era: 'ทวารวดี–ขอม',
      callouts: [{t0: 12.2, label: 'พระนอนเมืองเสมา', dx: 60, dy: -130, p: [SEMA[0], 1.5, SEMA[1]]}],
      camera: [[14.2, -40, 2, 6, 88, 46, 28, 30]],
    },
    {
      // Phimai complete; the counter stays in พ.ศ. 1653-1693 for its caption
      id: 'phimai',
      t: [14.8, 17],
      year: [1110, 1150],
      caption: {t0: 14.6, t1: 17.2, title: 'ปราสาทหินพิมาย', sub: 'ศิลปะขอม สร้างราวพุทธศตวรรษที่ 16–17 บนเส้นทางสู่เมืองพระนคร'},
      callouts: [{t0: 15.0, t1: 17.2, label: 'ปราสาทหินพิมาย', dx: -60, dy: -130, p: [PHIMAI[0], 6, PHIMAI[1]]}],
      camera: [
        [14.9, 32, 3, -31, 100, 50, 28, 30],
        [17, 30, 3, -30, 92, 54, 28, 30],
      ],
    },
    {
      // King Narai builds Nakhon Ratchasima (reign 1656-1688)
      id: 'narai',
      t: [18, 24],
      year: [1640, 1668],
      caption: {t0: 17.2, t1: 22.6, title: 'พระนารายณ์สร้างเมือง', sub: 'นครราชสีมา เมืองหน้าด่านสู่อีสาน มีกำแพง คูเมือง และประตูสี่ทิศ'},
      era: 'อยุธยา',
      callouts: [{t0: 19, t1: 22.2, label: 'คูเมือง', dx: 80, dy: 120, p: [12.4, 0, 3]}],
      camera: [
        [18.6, 0, 0, 0, 84, 48, 36, 30],
        [22.6, 0, 0, 0, 66, 58, 40, 30],
      ],
    },
    {
      id: 'chumphon',
      t: [24, 26.6],
      year: [1668, 1805],
      caption: {t0: 22.6, t1: 27, title: 'ประตูชุมพล', sub: 'ประตูเมืองด้านตะวันตก ประตูหลักของเมืองโคราช'},
      callouts: [{t0: 23.2, t1: 27, label: 'ประตูชุมพล', dx: 100, dy: -150, p: [-11, 3.6, 0]}],
      camera: [[24.4, -12, 2, 0, 38, -50, 26, 30]],
    },
    {
      // 1826 (พ.ศ. 2369) through both war captions; the Lao army marches in across this beat
      id: 'anouvong',
      t: [27.4, 30.6],
      year: [1826, 1826.2],
      caption: {t0: 27, title: 'ศึกเจ้าอนุวงศ์', sub: 'พ.ศ. 2369 ทัพเวียงจันทน์ยกมายึดเมืองโคราช'},
      era: 'ศึกอนุวงศ์',
      camera: [
        [28.6, 0, 0, -2, 82, -10, 38, 30],
        [30.6, 2, 1, -4, 72, 10, 36, 30],
      ],
    },
    {
      // the counter rounds, so the hold stays under 1826.5; both armies march to Thung
      // Samrit over the first third, then face each other for the callout
      id: 'yamo',
      t: [30.6, 33.6],
      year: [1826.2, 1826.45],
      caption: {t1: 34.5, title: 'วีรกรรมท้าวสุรนารี', sub: 'คุณหญิงโม “ย่าโม” รวบรวมชาวโคราชลุกขึ้นสู้ที่ทุ่งสัมฤทธิ์'},
      callouts: [{t0: 31.8, label: 'ทุ่งสัมฤทธิ์', dx: 60, dy: -120, p: [THUNG_SAMRIT[0], 0.5, THUNG_SAMRIT[1]]}],
      camera: [[31.6, THUNG_SAMRIT[0], 0, THUNG_SAMRIT[1], 74, 22, 36, 30]],
    },
    {
      // 21 Dec 1900: Bangkok-Nakhon Ratchasima railway opens
      id: 'railway',
      t: [36, 39],
      year: [1898, 1902],
      caption: {t0: 34.5, t1: 40, title: 'รถไฟสายแรกของสยาม', sub: 'กรุงเทพฯ–นครราชสีมา เปิดใช้ 21 ธันวาคม พ.ศ. 2443'},
      era: 'รถไฟ',
      callouts: [{t0: 36.8, t1: 40, label: 'สถานีรถไฟนครราชสีมา', dx: 40, dy: -130, p: [-29, 1.6, 9]}],
      camera: [
        [36.6, -27, 0, 8, 56, 25, 30, 30],
        [39.6, -27, 0, 8, 52, 35, 30, 30],
      ],
    },
    {
      // 1934: Thao Suranari Monument
      id: 'monument',
      t: [40.2, 43.5],
      year: [1931, 1936],
      caption: {t0: 40, t1: 45, title: 'อนุสาวรีย์ย่าโม', sub: 'สร้างหน้าประตูชุมพล เปิดเมื่อ พ.ศ. 2477'},
      callouts: [{t0: 41.7, t1: 45, label: 'อนุสาวรีย์ท้าวสุรนารี', dx: 120, dy: -150, p: [MONUMENT[0], 2.6, MONUMENT[1]]}],
      camera: [
        [41.2, -14.6, 1.5, 0, 30, -60, 22, 30],
        [44, -14.6, 1.5, 0, 26, -45, 22, 30],
      ],
    },
    {
      // 1958: Mittraphap (Friendship) Highway handed over; hold พ.ศ. 2501
      id: 'mittraphap',
      t: [46, 47.6],
      year: [1958, 1958.4],
      caption: {t0: 45, t1: 50, title: 'ถนนมิตรภาพ', sub: 'ทางหลวงมาตรฐานสายแรก มอบให้ไทยเมื่อ พ.ศ. 2501 เส้นทางหลักสู่อีสาน'},
      era: 'ปัจจุบัน',
      callouts: [{t0: 46.2, t1: 49.6, label: 'ถนนมิตรภาพ', dx: 70, dy: 120, p: [-37.5, 0.4, 4]}],
      camera: [
        [46, -32, 0, 8, 120, -20, 32, 30],
        [49, -24, 0, 4, 140, 20, 32, 30],
      ],
    },
    {
      id: 'modern',
      t: [50, 56],
      year: [1990, 2026],
      caption: {t1: 55.6, title: 'ประตูสู่อีสาน', sub: 'ศูนย์กลางการค้า การศึกษา และการเดินทางของภาคอีสาน'},
      callouts: [{t0: 50.4, t1: 53.8, label: 'กองบิน 1', dx: 80, dy: 120, p: [RUNWAY[0] + 8, 0, RUNWAY[1]]}],
      camera: [
        [52, -16, 1, 18, 140, 34, 30, 30],
        [55, -8, 2, 8, 140, 48, 30, 30],
      ],
    },
  ],
});

export const yearAt = STORY.yearAt;
export const CAPTIONS = STORY.captions;
export const ERAS = STORY.eras;

/** Moments the soundtrack hits (seconds are derived from the year curve). */
export const SOUND_EVENTS = {
  dinoRoars: [3.6, 5.4, 7.0],
  founding: 1657,
  wallsDone: 1663,
  warStart: 1826.0,
  victory: 1826.43,
  railway: 1900,
  monument: 1934,
  highway: 1958,
  trains: [
    {t0: 37.4, dur: 3.0, dir: -1, modern: false},
    {t0: 51.0, dur: 2.8, dir: 1, modern: true},
  ],
  jets: [47.6, 49.2],
  plane: [50.5, 54],
  trafficFrom: 1955,
  finale: 'fireworks',
};
