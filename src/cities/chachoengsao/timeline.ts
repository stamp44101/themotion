// Pure data (no React/three) so scripts/export_timeline.mjs can import it for the soundtrack.
import {Caption, makeCurve} from '../../lib';

export const DURATION = 60;

/* Dates verified Oct 2026:
 *   1548  King Maha Chakkraphat establishes Chachoengsao as an eastern military outpost.
 *   1767  Fall of Ayutthaya; Phraya Tak (King Taksin) defeats Burmese force at Pak Nam Jolo.
 *   1770  Luang Pho Sothon floats down the Bang Pakong River, enshrined at Wat Hong (Wat Sothon). (Attributed / สันนิษฐานว่า)
 *   1834  King Rama III builds the brick fortress and bastions on Bang Pakong (Annam-Siam War).
 *   1848  The Ang-Yi (Secret Society) rebellion; Chinese mill workers clash with royal army at the fortress.
 *   1897  King Rama V visits; establishes Monthon Prachinburi center under Prince Marubongs Siripat.
 *   1908  Eastern Railway line opens (Bangkok–Chachoengsao) with steel bridge across the Bang Pakong.
 *   1996  Construction begins on the grand modern marble Ubosot of Wat Sothon.
 */
export const YEAR_KEYS: [number, number][] = [
  [0, 1548],
  [4, 1600],
  [7, 1700],
  [11, 1767], // King Taksin at Pak Nam Jolo
  [14, 1770], // Luang Pho Sothon enshrined
  [17.5, 1782], // Early Bangkok era
  [19.2, 1834], // Rama III fortress & wall built (synchronous with caption at t0: 19)
  [23.5, 1836], // Fortress complete
  [26.5, 1845],
  [27.5, 1848], // Ang-Yi rebellion (synchronous with caption at t0: 27)
  [33, 1860],
  [35.5, 1897], // Rama V visit / Monthon administration (caption at t0: 35)
  [42.2, 1908], // Eastern Railway & Talat Ban Mai boom (caption at t0: 42)
  [48, 1950],
  [49.5, 1996], // New marble Ubosot (caption at t0: 49)
  [55, 2026],
  [60, 2026],
];
export const yearAt = makeCurve(YEAR_KEYS);

export const CAPTIONS: Caption[] = [
  {t0: 3, t1: 7, title: 'แปดริ้วโบราณ', sub: 'ชุมชนลุ่มน้ำบางปะกง แหล่งปลาชุกชุม เมืองหน้าด่านทิศตะวันออก'},
  {t0: 7, t1: 13, title: 'ทัพพระยาตาก พ.ศ. 2310', sub: 'พระเจ้าตากสินตีฝ่าพม่ามาทางตะวันออก รบชนะข้าศึกที่ปากน้ำโจ้โล้'},
  {t0: 13, t1: 19, title: 'หลวงพ่อโสธรลอยน้ำ', sub: 'สันนิษฐานว่าราว พ.ศ. 2313 อัญเชิญพระพุทธรูปศักดิ์สิทธิ์ขึ้นประดิษฐาน ณ วัดหงษ์'},
  {t0: 19, t1: 27, title: 'ป้อมและกำแพงเมือง พ.ศ. 2377', sub: 'รัชกาลที่ 3 ทรงสร้างกำแพงอิฐและป้อมปืนริมน้ำบางปะกง รับศึกอานามสยามยุทธ'},
  {t0: 27, t1: 35, title: 'ศึกปราบกบฏอั้งยี่ พ.ศ. 2391', sub: 'คนงานจีนโรงหีบอ้อยก่อการจลาจล ทัพหลวงยกเข้าปราบ ณ แนวกำแพงเมือง'},
  {t0: 35, t1: 42, title: 'มณฑลปราจีนบุรี พ.ศ. 2440', sub: 'รัชกาลที่ 5 เสด็จประพาส เมืองแปดริ้วเป็นศูนย์กลางมณฑล ศาลหลักเมืองและที่ว่าการ'},
  {t0: 42, t1: 49, title: 'รถไฟสายตะวันออก พ.ศ. 2451', sub: 'ทางรถไฟข้ามแม่น้ำบางปะกง ยุคทองการค้าทางน้ำ ตลาดบ้านใหม่ 100 ปี'},
  {t0: 49, t1: 55.5, title: 'พระอุโบสถหินอ่อน', sub: 'สร้างพระอุโบสถหลังใหม่วัดโสธรฯ งดงามวิจิตรริมแม่น้ำบางปะกง'},
];

export const ERAS = [
  {t: 2, label: 'อยุธยา'},
  {t: 13, label: 'หลวงพ่อโสธร'},
  {t: 19, label: 'กำแพงเมือง'},
  {t: 27, label: 'กบฏอั้งยี่'},
  {t: 35, label: 'มณฑล'},
  {t: 42, label: 'รถไฟ'},
  {t: 55, label: 'ปัจจุบัน'},
];

export const SOUND_EVENTS = {
  taksinBattle: 1767,
  sothonArrives: 1770,
  fortressBuilt: 1834,
  angYiUprising: 1848,
  monthonFormed: 1897,
  railwayOpens: 1908,
  marbleUbosot: 1996,
  riverDive: [13, 17],
  fortressDive: [21, 26],
  angYiClash: [28, 33],
  trainDive: [43, 47],
  todayDive: [52, 57],
};
