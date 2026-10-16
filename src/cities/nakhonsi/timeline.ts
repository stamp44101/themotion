// Pure data (no React/three) so scripts/export_timeline.mjs can import it for the soundtrack.
// Beats, dates and wording from docs/briefs/nakhonsi.md §3; holds keep each named year on the
// counter while its caption is up (the counter rounds, so a hold on X stays below X + 0.5).
import {Caption, makeCurve} from '../../lib';

export const YEAR_KEYS: [number, number][] = [
  [0, 311], // legend: the tooth relic and the first chedi (counter never named in a caption)
  [3, 340],
  [7.5, 640],
  [8.5, 775], // Ligor stele, inscription no. 23
  [11.5, 775.3],
  [12.5, 960],
  [13, 1001], // Tambralinga embassy in Song records
  [16, 1001.3],
  [17, 1120],
  [20.5, 1215], // Lanka bell rebuilt over the old stupa (attributed, 13th c.)
  [21.5, 1230], // Chandrabhanu, Sri Dharmaraja
  [24.5, 1230.3],
  [25.5, 1330],
  [26.5, 1350], // c. 1350: a major provincial city of Ayutthaya (attributed)
  [28.5, 1350.3],
  [29.5, 1600],
  [30.5, 1684],
  [33.5, 1690], // walls redesigned under King Narai, 1685-88
  [34.5, 1760],
  [35, 1767], // Chao Nakhon's independent ชุมนุม
  [36.8, 1767.3],
  [37.3, 1769], // Taksin takes the city
  [38.6, 1769.3],
  [39.5, 1912],
  [40, 1914.2], // railway branch opens 1 Oct 1914
  [43, 1914.4],
  [47, 1985],
  [47.5, 1988.1], // 22 Nov 1988 mudslides at Kathun / Khiriwong
  [50.5, 1988.4],
  [52.5, 2026], // World Heritage, 25 Jul 2026
  [60, 2026],
];
export const yearAt = makeCurve(YEAR_KEYS);

export const CAPTIONS: Caption[] = [
  {t0: 3.2, t1: 7.8, title: 'ตามตำนานพระบรมธาตุ', sub: 'เจ้าชายทนทกุมารกับนางเหมชาลา อัญเชิญพระทันตธาตุจากลังกามาประดิษฐานที่หาดทรายแก้ว'},
  {t0: 8.2, t1: 12.2, title: 'จารึกหลักที่ 23', sub: 'พ.ศ. 1318 จารึกที่เชื่อมโยงดินแดนนี้กับศรีวิชัย'},
  {t0: 12.6, t1: 16.6, title: 'แคว้นตามพรลิงค์', sub: 'ปรากฏในบันทึกราชสำนักซ่ง ราว พ.ศ. 1544'},
  {t0: 17, t1: 21, title: 'เจดีย์ทรงลังกา', sub: 'ราวพุทธศตวรรษที่ 18 สันนิษฐานว่าสร้างครอบองค์เดิม'},
  {t0: 21.3, t1: 25.2, title: 'พระเจ้าจันทรภาณุ', sub: 'พ.ศ. 1773 ขึ้นครองราชย์ ทรงพระนาม “ศรีธรรมราช”'},
  {t0: 25.6, t1: 29.4, title: 'หัวเมืองของอยุธยา', sub: 'ราว พ.ศ. 1893 เป็นหัวเมืองสำคัญทางใต้ของกรุงศรีอยุธยา'},
  {t0: 29.8, t1: 34.2, title: 'กำแพงสมัยพระนารายณ์', sub: 'ช่างฝรั่งเศสออกแบบปรับปรุงกำแพงอิฐและป้อม'},
  {t0: 34.6, t1: 39, title: 'ชุมนุมเจ้านคร', sub: 'พ.ศ. 2310 ตั้งตนเป็นอิสระ จนพระเจ้าตากเสด็จตีเมืองนคร พ.ศ. 2312'},
  {t0: 39.4, t1: 43.6, title: 'รถไฟมาถึงนคร', sub: 'ทางแยกเขาชุมทอง–นครศรีธรรมราช เปิดเดินรถ 1 ตุลาคม พ.ศ. 2457'},
  {t0: 47.2, t1: 51, title: 'ดินโคลนถล่มเขาหลวง', sub: '22 พฤศจิกายน พ.ศ. 2531 ที่กะทูนและคีรีวง นำไปสู่การปิดป่าสัมปทานทั่วประเทศ'},
  {t0: 52, t1: 56, title: 'มรดกโลก', sub: 'วัดพระมหาธาตุวรมหาวิหาร แห่งแรกของภาคใต้ ขึ้นทะเบียน 25 กรกฎาคม พ.ศ. 2569'},
];

export const ERAS = [
  {t: 3, label: 'ตามพรลิงค์'},
  {t: 8.2, label: 'ศรีวิชัย'},
  {t: 21.3, label: 'ศรีธรรมราช'},
  {t: 25.6, label: 'อยุธยา'},
  {t: 34.6, label: 'เจ้านคร'},
  {t: 39.4, label: 'ปัจจุบัน'},
];

// the first train pulls in to the terminus during the 1914 hold
export const SOUND_EVENTS = {trains: [{t0: 40.2, dur: 3.4, dir: 1, modern: false}] as {t0: number; dur: number; dir: number; modern: boolean}[]};
