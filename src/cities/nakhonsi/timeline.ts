// Pure data (no React/three) so scripts/export_timeline.mjs can import it for the soundtrack.
// Beats, dates and wording from docs/briefs/nakhonsi.md §3; holds keep each named year on the
// counter while its caption is up (the counter rounds, so a hold on X stays below X + 0.5).
import {Caption, makeCurve} from '../../lib';

export const YEAR_KEYS: [number, number][] = [
  [0, 300], // legend: the relic boat comes ashore (counter never named in a caption)
  [3, 330],
  [6, 520],
  [8, 800],
  [9, 990],
  [9.5, 1001], // Tambralinga's embassy to the Song court; junks in the Gulf
  [13.5, 1001.3],
  [14.5, 1120],
  [18.5, 1215], // Lanka bell rebuilt over the old stupa (attributed, 13th c.)
  [19.5, 1240],
  [20, 1300],
  [21, 1600],
  [22, 1684],
  [25.5, 1689], // walls redesigned under King Narai, 1685-88
  [26.5, 1760],
  [27, 1767], // Chao Nakhon's independent ชุมนุม
  [29.2, 1767.3],
  [29.8, 1769], // Taksin's army takes the city
  [34.5, 1769.45],
  [35.5, 1880],
  [36.2, 1912],
  [36.7, 1914.2], // railway branch opens 1 Oct 1914
  [40, 1914.4],
  [44, 1985],
  [44.5, 1988.1], // 22 Nov 1988 mudslides at Kathun / Khiriwong
  [48, 1988.4],
  [49, 2005],
  [50, 2017],
  [53, 2023], // แห่ผ้าขึ้นธาตุ walks while the year runs slowly
  [54, 2025.55], // World Heritage, 2026

  [60, 2026],
];
export const yearAt = makeCurve(YEAR_KEYS);

export const CAPTIONS: Caption[] = [
  {t0: 3.2, t1: 8.4, title: 'ตามตำนานพระบรมธาตุ', sub: 'เจ้าชายทนทกุมารกับนางเหมชาลา ลอยเรืออัญเชิญพระทันตธาตุจากลังกา มาขึ้นฝั่งที่หาดทรายแก้ว'},
  {t0: 9, t1: 14, title: 'เมืองท่าตามพรลิงค์', sub: 'เมืองท่าบนเส้นทางการค้าทางทะเล ส่งทูตไปราชสำนักซ่ง ราว พ.ศ. 1544'},
  {t0: 14.5, t1: 19.6, title: 'เจดีย์ทรงลังกา', sub: 'ราวพุทธศตวรรษที่ 18 ยุคพระเจ้าจันทรภาณุ สันนิษฐานว่าสร้างครอบองค์เดิม'},
  {t0: 21.4, t1: 26, title: 'กำแพงสมัยพระนารายณ์', sub: 'ช่างฝรั่งเศสออกแบบปรับปรุงกำแพงอิฐและป้อม'},
  {t0: 26.6, t1: 29.6, title: 'ชุมนุมเจ้านคร', sub: 'พ.ศ. 2310 กรุงศรีอยุธยาแตก เจ้านครตั้งตนเป็นอิสระ'},
  {t0: 29.8, t1: 34.6, title: 'พระเจ้าตากตีเมืองนคร', sub: 'พ.ศ. 2312 ทัพกรุงธนบุรียกมาปราบ รวมหัวเมืองใต้กลับคืน'},
  {t0: 36.4, t1: 40.6, title: 'รถไฟมาถึงนคร', sub: 'ทางแยกเขาชุมทอง–นครศรีธรรมราช เปิดเดินรถ 1 ตุลาคม พ.ศ. 2457'},
  {t0: 44.3, t1: 48.2, title: 'ดินโคลนถล่มเขาหลวง', sub: '22 พฤศจิกายน พ.ศ. 2531 ที่กะทูนและคีรีวง นำไปสู่การปิดป่าสัมปทานทั่วประเทศ'},
  {t0: 49.2, t1: 53, title: 'แห่ผ้าขึ้นธาตุ', sub: 'ทุกวันมาฆบูชา ผู้คนเทินผ้าพระบฏเวียนรอบองค์พระธาตุแล้วนำขึ้นห่ม'},
  {t0: 53.2, t1: 56, title: 'มรดกโลก', sub: 'วัดพระมหาธาตุวรมหาวิหาร แห่งแรกของภาคใต้ ขึ้นทะเบียน พ.ศ. 2569'},
];

export const ERAS = [
  {t: 3, label: 'ตามพรลิงค์'},
  {t: 14.5, label: 'ศรีธรรมราช'},
  {t: 21.4, label: 'อยุธยา'},
  {t: 26.6, label: 'ธนบุรี'},
  {t: 36.4, label: 'ปัจจุบัน'},
];

// the first train pulls in to the terminus during the 1914 hold
export const SOUND_EVENTS = {trains: [{t0: 36.4, dur: 3.4, dir: 1, modern: false}] as {t0: number; dur: number; dir: number; modern: boolean}[]};
