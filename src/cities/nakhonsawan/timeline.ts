import {Caption, makeCurve} from '../../lib';

export const DURATION = 60;

export const YEAR_KEYS: [number, number][] = [
  [0, 1357],
  [3.2, 1357], // Mueang Phra Bang (Sukhothai border outpost)
  [7.5, 1450],
  [12.0, 1569], // Renamed Nakhon Sawan under Ayutthaya
  [15.5, 1700],
  [17.5, 1785], // Nine Armies War (King Rama I redoubts at San Khu)
  [22.5, 1850],
  [24.5, 1870], // Great Teak Raft Depot & Floating City boom
  [29.5, 1895],
  [31.0, 1901], // Golden Dragon Parade & Thepharak Shrine
  [38.5, 1905], // Northern Railway reaches Pak Nam Pho
  [44.5, 1950], // Dechatiwong Bridge opens across Chao Phraya
  [48.5, 1981], // Phra Chulamani Chedi atop Khao Khiriwong
  [51.5, 2019], // Pasan architectural landmark at Koh Yom
  [56.0, 2026],
  [60.0, 2026],
];

export const yearAt = makeCurve(YEAR_KEYS);

export const CAPTIONS: Caption[] = [
  {
    t0: 3.2,
    t1: 8.5,
    title: 'เมืองพระบาง พ.ศ. 1900',
    sub: 'เมืองหน้าด่านทิศใต้แห่งอาณาจักรสุโขทัย ริมฝั่งแม่น้ำปิง',
  },
  {
    t0: 9.5,
    t1: 15.0,
    title: 'กำเนิดเมืองนครสวรรค์',
    sub: 'พ.ศ. 2112 ชุมทางทัพเรือและคลังเสบียงหลวงยุคอยุธยา',
  },
  {
    t0: 16.0,
    t1: 22.0,
    title: 'สงครามเก้าทัพ พ.ศ. 2328',
    sub: 'ทัพหลวงรัชกาลที่ 1 ตั้งค่ายคูเมืองสันคูสกัดทัพพม่า',
  },
  {
    t0: 23.0,
    t1: 29.5,
    title: 'ชุมชนแพซุงปากน้ำโพ',
    sub: 'ศูนย์กลางการค้าไม้สักทางน้ำและตลาดลอยน้ำที่ใหญ่ที่สุด',
  },
  {
    t0: 30.5,
    t1: 37.0,
    title: 'มังกรทองปากน้ำโพ',
    sub: 'พ.ศ. 2444 อัญเชิญเจ้าพ่อ-เจ้าแม่ปัดเป่าโรคภัย สู่ประเพณีตรุษจีน',
  },
  {
    t0: 38.0,
    t1: 43.5,
    title: 'รถไฟสายเหนือ พ.ศ. 2448',
    sub: 'ทางรถไฟเชื่อมสยามตอนกลาง เปิดสถานีปากน้ำโพสู่ภาคเหนือ',
  },
  {
    t0: 44.5,
    t1: 50.0,
    title: 'สะพานเดชาติวงศ์',
    sub: 'พ.ศ. 2493 สะพานข้ามแม่น้ำเจ้าพระยา ประตูสู่ภาคเหนือ',
  },
  {
    t0: 51.0,
    t1: 55.5,
    title: 'พาสาน ต้นน้ำเจ้าพระยา',
    sub: 'สถาปัตยกรรมรวมแม่น้ำสี่สาย ปิง วัง ยม น่าน ณ แหลมเกาะยม',
  },
];

export const ERAS = [
  {t: 3, label: 'เมืองพระบาง'},
  {t: 12, label: 'อยุธยา'},
  {t: 17, label: 'สงครามเก้าทัพ'},
  {t: 24, label: 'แพซุงปากน้ำโพ'},
  {t: 31, label: 'มังกรทอง'},
  {t: 38, label: 'รถไฟสายเหนือ'},
  {t: 44, label: 'สะพานเดชาติวงศ์'},
  {t: 51, label: 'พาสาน'},
  {t: 56, label: 'ปัจจุบัน'},
];

export const SOUND_EVENTS = {
  phraBangFounding: 1357,
  nakhonSawanRenamed: 1569,
  nineArmiesWar: 1785,
  teakBoom: 1870,
  dragonParade: 1901,
  railwayOpens: 1905,
  dechatiwongOpens: 1950,
  chulamaniChedi: 1981,
  pasanOpens: 2019,
};
