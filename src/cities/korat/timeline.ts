// Pure data (no React/three) so scripts/export_timeline.mjs can import it for the soundtrack.
import {Caption, makeCurve} from '../../lib';

// seconds -> year (negative = BCE; below -100000 the counter shows "million years ago").
export const YEAR_KEYS: [number, number][] = [
  [0, -118e6],
  [3, -112e6],
  [7.6, -98e6],
  [8.2, -1000],
  [11.8, 560],
  [14.5, 900],
  [17, 1250],
  [18, 1640],
  [24, 1668], // King Narai builds Nakhon Ratchasima (reign 1656–1688)
  [27, 1810],
  [28.5, 1824],
  [33, 1828], // 1826: Chao Anouvong seizes Korat; Thao Suranari
  [34.5, 1880],
  [36, 1898],
  [39, 1902], // 21 Dec 1900: Bangkok–Nakhon Ratchasima railway opens
  [40.2, 1931],
  [43.5, 1936], // 1934: Thao Suranari Monument
  [45, 1952],
  [47.5, 1960], // 1958: Mittraphap (Friendship) Highway handed over
  [50, 1990],
  [56, 2026],
  [60, 2026],
];
export const yearAt = makeCurve(YEAR_KEYS);

export const CAPTIONS: Caption[] = [
  {t0: 3, t1: 8.2, title: 'ยุคไดโนเสาร์', sub: 'ที่ราบสูงโคราชเคยเป็นถิ่นไดโนเสาร์ อย่าง “สิรินธรนา โคราชเอนซิส”'},
  {t0: 8.2, t1: 12, title: 'บ้านปราสาท', sub: 'ราว 3,000 ปีก่อน ชุมชนโบราณตั้งรกราก ทำนา ปั้นหม้อ และฝังศพบรรพชน'},
  {t0: 12, t1: 17.2, title: 'เสมา และ พิมาย', sub: 'เมืองเสมาสมัยทวารวดีกับพระนอนหินทราย · ขอมสร้างปราสาทหินพิมาย'},
  {t0: 17.2, t1: 22.6, title: 'พระนารายณ์สร้างเมือง', sub: 'นครราชสีมา เมืองหน้าด่านสู่อีสาน มีกำแพง คูเมือง และประตูสี่ทิศ'},
  {t0: 22.6, t1: 27, title: 'ประตูชุมพล', sub: 'ประตูเมืองด้านตะวันตก ประตูหลักของเมืองโคราช'},
  {t0: 27, t1: 30.6, title: 'ศึกเจ้าอนุวงศ์', sub: 'พ.ศ. 2369 ทัพเวียงจันทน์ยกมายึดเมืองโคราช'},
  {t0: 30.6, t1: 34.5, title: 'วีรกรรมท้าวสุรนารี', sub: 'คุณหญิงโม “ย่าโม” รวบรวมชาวโคราชลุกขึ้นสู้ที่ทุ่งสัมฤทธิ์'},
  {t0: 34.5, t1: 40, title: 'รถไฟสายแรกของสยาม', sub: 'กรุงเทพฯ–นครราชสีมา เปิดใช้ 21 ธันวาคม พ.ศ. 2443'},
  {t0: 40, t1: 45, title: 'อนุสาวรีย์ย่าโม', sub: 'สร้างหน้าประตูชุมพล เปิดเมื่อ พ.ศ. 2477'},
  {t0: 45, t1: 50, title: 'ถนนมิตรภาพ', sub: 'ทางหลวงมาตรฐานสายแรก มอบให้ไทยเมื่อ พ.ศ. 2501 เส้นทางหลักสู่อีสาน'},
  {t0: 50, t1: 55.6, title: 'ประตูสู่อีสาน', sub: 'ศูนย์กลางการค้า การศึกษา และการเดินทางของภาคอีสาน'},
];

export const ERAS = [
  {t: 3, label: 'ไดโนเสาร์'},
  {t: 8.2, label: 'บ้านปราสาท'},
  {t: 12, label: 'ทวารวดี–ขอม'},
  {t: 17.2, label: 'อยุธยา'},
  {t: 27, label: 'ศึกอนุวงศ์'},
  {t: 34.5, label: 'รถไฟ'},
  {t: 45, label: 'ปัจจุบัน'},
];

/** Moments the soundtrack hits (seconds are derived from the year curve). */
export const SOUND_EVENTS = {
  dinoRoars: [3.6, 5.4, 7.0],
  founding: 1657,
  wallsDone: 1663,
  warStart: 1826.0,
  victory: 1826.9,
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
