// Pure data (no React/three) so scripts/export_timeline.mjs can import it for the soundtrack.
import {Caption, makeCurve} from '../../lib';

export const DURATION = 75;

/* Dates verified Oct 2026.
 *   1357  Wat Phra Si Rattana Mahathat + Phra Phuttha Chinnarat cast, reign of
 *         Maha Thammaracha I (Lithai) of Sukhothai. Thai sources say
 *         "สันนิษฐานว่า" — attributed, not documented. Treated as approximate.
 *   1463  Borommatrailokanat moves the Ayutthaya capital here; 1488 it returns.
 *   1555  Naresuan born in the city; 1571 he rules it as uparaja.
 *   1767  Ayutthaya falls; Phitsanulok becomes one of the successor factions.
 *   1775  Maha Thiha Thura (อะแซหวุ่นกี้) besieges and burns the city.
 *   1957  2 January, the great fire ("พิษณุโลกวิปโยค"): ~24 hours, the central
 *         market district gone. English Wikipedia says 1955 — that is wrong;
 *         Thai sources are unanimous on 2 Jan 2500 BE.
 *   11thC Khmer-era settlement called Song Khwae. Century-level only.
 */
export const YEAR_KEYS: [number, number][] = [
  [0, 1000],
  [3, 1020],
  [8, 1120], // Khmer-era Song Khwae
  [12, 1190],
  [15, 1300],
  [18, 1357], // Phra Phuttha Chinnarat cast (attributed)
  [23, 1378],
  [26, 1442],
  [29, 1463], // capital moves to Phitsanulok
  [34, 1482],
  [36, 1488], // capital returns to Ayutthaya
  [39, 1540],
  [42, 1555], // Naresuan born
  [46, 1571], // Naresuan rules as uparaja
  [49, 1600],
  [52, 1700],
  [55, 1767], // fall of Ayutthaya
  [58, 1776], // the Burmese siege and burning
  [61, 1860],
  [63, 1935],
  [65.5, 1957], // the great fire
  [69, 1992],
  [72, 2026],
  [75, 2026],
];
export const yearAt = makeCurve(YEAR_KEYS);

export const CAPTIONS: Caption[] = [
  {t0: 3, t1: 8, title: 'สองแคว', sub: 'ชุมชนโบราณ ณ จุดบรรจบของแม่น้ำน่านและแม่น้ำแควน้อย'},
  {t0: 8, t1: 12, title: 'ยุคขอม', sub: 'วัดจุฬามณี ปรางค์ศิลาแลงเก่าแก่ที่สุดของเมือง'},
  {t0: 12, t1: 18, title: 'ใต้ร่มสุโขทัย', sub: 'เมืองสองแควเป็นหัวเมืองสำคัญ คุมเส้นทางลุ่มน้ำน่าน'},
  {t0: 18, t1: 23, title: 'พระพุทธชินราช', sub: 'สันนิษฐานว่าหล่อขึ้น พ.ศ. 1900 สมัยพระมหาธรรมราชาที่ 1 (ลิไทย)'},
  {t0: 23, t1: 29, title: 'วัดพระศรีรัตนมหาธาตุ', sub: '“วัดใหญ่” คู่บ้านคู่เมือง ปรางค์ประธานตั้งตระหง่านริมน้ำน่าน'},
  {t0: 29, t1: 36, title: 'ราชธานี 25 ปี', sub: 'พ.ศ. 2006 สมเด็จพระบรมไตรโลกนาถ ย้ายราชธานีอยุธยามาประทับที่นี่'},
  {t0: 36, t1: 42, title: 'เมืองลูกหลวง', sub: 'พ.ศ. 2031 ราชธานีกลับสู่อยุธยา พิษณุโลกคงเป็นเมืองหน้าด่านเหนือ'},
  {t0: 42, t1: 48, title: 'พระนเรศวรประสูติ', sub: 'พ.ศ. 2098 ณ พระราชวังจันทน์ ริมฝั่งตะวันตกของแม่น้ำน่าน'},
  {t0: 48, t1: 55, title: 'พระมหาอุปราช', sub: 'พ.ศ. 2114 ทรงครองเมืองพิษณุโลก ก่อนเสด็จกู้เอกราช'},
  {t0: 55, t1: 61, title: 'ศึกและไฟ', sub: 'เสียกรุงศรีอยุธยา พ.ศ. 2310 ต่อด้วยศึกอะแซหวุ่นกี้ เมืองถูกเผาและทิ้งร้าง'},
  {t0: 61, t1: 66, title: 'พิษณุโลกวิปโยค', sub: '2 มกราคม พ.ศ. 2500 ไฟไหม้ใหญ่กว่า 24 ชั่วโมง ย่านกลางเมืองวอดทั้งย่าน'},
  {t0: 66, t1: 70.6, title: 'พิษณุโลกวันนี้', sub: 'เมืองสร้างใหม่จากเถ้าถ่าน พระพุทธชินราชยังงดงามดังเดิม'},
];

export const ERAS = [
  {t: 3, label: 'สองแคว'},
  {t: 12, label: 'สุโขทัย'},
  {t: 29, label: 'ราชธานี'},
  {t: 42, label: 'พระนเรศวร'},
  {t: 55, label: 'ศึกและไฟ'},
  {t: 66, label: 'วันนี้'},
];

export const SOUND_EVENTS = {
  khmer: 1120,
  chinnarat: 1357,
  watYai: 1378,
  capital: 1463,
  capitalBack: 1488,
  naresuanBorn: 1555,
  uparaja: 1571,
  ayutthayaFalls: 1767,
  siege: 1776,
  greatFire: 1957,
  riverDive: [12, 15.5],
  marketDive: [32, 35.5],
  todayDive: [66, 70],
  night: [70.6, 75],
  finaleShift: DURATION - 60,
};
