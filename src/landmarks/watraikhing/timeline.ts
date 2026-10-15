import {Caption, makeCurve} from '../../lib';

// Wat Rai Khing, 35 s landmark reel. Sources and disputed facts: docs/briefs/watraikhing.md.
export const DURATION = 35;

export const FOUNDED = 1851; // สันนิษฐานว่า พ.ศ. 2394 (another tradition says 2334)
export const RAFT = [1857, 1868] as const; // the raft legend is undated; shown just after the ubosot
export const RENAMED = 1903; // วัดมงคลจินดาราม, พ.ศ. 2446

export const YEAR_KEYS: [number, number][] = [
  [0, 1830],
  [3.2, 1832],
  [8.2, 1848],
  // hold the assumed founding year while its caption lands
  [8.8, FOUNDED],
  [10.6, FOUNDED + 0.5],
  [14.6, 1856],
  [15.2, RAFT[0]],
  [21.2, 1870],
  // hold พ.ศ. 2446 for the renaming caption
  [21.8, RENAMED],
  [23.6, RENAMED + 0.5],
  [26.4, 1906],
  [27.0, 2026],
  [35, 2026],
];

export const yearAt = makeCurve(YEAR_KEYS);

export const CAPTIONS: Caption[] = [
  {t0: 3.2, t1: 8.2, title: 'ไร่ขิงริมแม่น้ำท่าจีน', sub: 'ชาวจีนปลูกขิงริมแม่น้ำนครชัยศรี จนผู้คนเรียกถิ่นนี้ว่าไร่ขิง'},
  {t0: 8.8, t1: 14.6, title: 'สร้างวัดไร่ขิง', sub: 'สันนิษฐานว่า พ.ศ. 2394 พระธรรมราชานุวัตร (พุก) สร้างวัดขึ้นบนถิ่นบ้านเกิด'},
  {t0: 15.2, t1: 21.2, title: 'อัญเชิญหลวงพ่อ', sub: 'ตำนานเล่าว่าล่องแพไม้ไผ่จากวัดศาลาปูน ผ่านเจ้าพระยาเข้าสู่แม่น้ำท่าจีน'},
  {t0: 21.8, t1: 26.4, title: 'วัดมงคลจินดาราม', sub: 'พ.ศ. 2446 สมเด็จพระมหาสมณเจ้าฯ ประทานนามใหม่ แต่ชาวบ้านยังเรียกวัดไร่ขิง'},
  {t0: 27.0, t1: 30.8, title: 'งานปิดทองหลวงพ่อ', sub: 'งานประจำปีกลางเดือนห้า ผู้คนทั่วลุ่มน้ำนครชัยศรีมาปิดทองไหว้พระ'},
];

// Years the soundtrack hits (scripts/soundtrack_watraikhing.py).
export const SOUND_EVENTS = {founded: FOUNDED, raft: RAFT[0], renamed: RENAMED, fair: 2026};
