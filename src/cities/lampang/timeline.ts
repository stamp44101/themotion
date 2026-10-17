// Pure data (no React/three) so scripts/export_timeline.mjs can import it for the soundtrack.
// Beats own their seconds (src/engine/story.ts); dates and wording from docs/briefs/lampang.md §3.
// Shaped by Korat's retention curve (docs/experiments.md): the hero carriage holds the first
// 3 s, the legend gets one short beat, and every beat after it has people or things moving.
import {buildStory} from '../../engine/story';
import {BRIDGE, KILNS, LAMPANG_LUANG, MAE_MOH, STATION, WAT_PHRA_KAEW, WAT_SI_CHUM} from './places';

export const STORY = buildStory({
  duration: 60,
  before: 600,
  after: 2026,
  // transitions between beats
  camera: [
    [13.2, -14, 1, 18, 120, 195, 38, 30],
    [41.6, -2, 1, 6, 230, 385, 38, 30],
    [60, 0, 1, 4, 290, 500, 36, 30],
  ],
  beats: [
    {
      // the whole forest tile with the carriage on it under the title, then the legend:
      // the hunter เขลางค์ leads the hermits and an oval earth wall rises on the Wang
      id: 'legend',
      t: [0, 6.6],
      year: [660, 700],
      caption: {t0: 3.2, title: 'ตามตำนานเขลางค์นคร', sub: 'พระนางจามเทวีให้ฤๅษีสร้างเมืองให้เจ้าอนันตยศ มีพรานเขลางค์นำทาง'},
      era: 'หริภุญชัย',
      camera: [
        [0, -8, 1, -6, 320, 135, 34, 30],
        [2.4, -14, 2, -14, 150, 145, 33, 30],
        [5.4, 1, 1, -1, 62, 160, 36, 30],
      ],
    },
    {
      // the white elephant carries พระแก้วมรกต in through ประตูม้า to วัดพระแก้วดอนเต้า
      id: 'emerald',
      t: [7.4, 12.6],
      year: [1436, 1436.4],
      caption: {t0: 7.2, title: 'พระแก้วมรกตมาลำปาง', sub: 'พ.ศ. 1979 ประดิษฐานที่วัดพระแก้วดอนเต้านาน 32 ปี ก่อนอัญเชิญไปเชียงใหม่'},
      era: 'ล้านนา',
      callouts: [{t0: 10.4, t1: 12.6, label: 'วัดพระแก้วดอนเต้า', dx: 90, dy: -120, p: [WAT_PHRA_KAEW[0], 1.6, WAT_PHRA_KAEW[1]]}],
      camera: [
        [7.6, 4, 1, -16, 58, 165, 36, 30],
        [12.2, 4.5, 1, -5, 48, 180, 37, 30],
      ],
    },
    {
      // ท้าวมหายศ's army camps in the walled Lampang Luang; หนานทิพย์ช้าง slips in and shoots him
      id: 'thipchang',
      t: [14.2, 22],
      year: {hold: 1732},
      caption: {t0: 14, title: 'หนานทิพย์ช้าง', sub: 'ราว พ.ศ. 2275 ลอบเข้าวัดพระธาตุลำปางหลวง ยิงท้าวมหายศ ทัพลำพูนแตกพ่าย'},
      era: 'เจ้าเจ็ดตน',
      callouts: [{t0: 15, t1: 18.4, label: 'วัดพระธาตุลำปางหลวง', dx: 90, dy: -130, p: [LAMPANG_LUANG[0], 3.5, LAMPANG_LUANG[1]]}],
      camera: [
        [14.6, LAMPANG_LUANG[0] + 4, 1, LAMPANG_LUANG[1] - 4, 70, 205, 37, 30],
        [21.6, LAMPANG_LUANG[0] - 3, 1, LAMPANG_LUANG[1], 58, 230, 38, 30],
      ],
    },
    {
      // กาวิละ goes over to Siam; the Lampang army marches north with Taksin's to Chiang Mai
      id: 'kawila',
      t: [23.4, 27.6],
      year: [1774.08, 1774.22],
      caption: {t0: 23, title: 'กาวิละร่วมทัพพระเจ้าตาก', sub: 'พ.ศ. 2317 ทัพลำปางยกขึ้นเหนือ ร่วมขับพม่าออกจากเชียงใหม่'},
      camera: [
        [23.6, 2, 1, -8, 62, 255, 37, 30],
        [27.4, -12, 1, -19, 66, 280, 38, 30],
      ],
    },
    {
      // teak: rafts of logs down the Wang, working elephants, the Burmese-style วัดศรีชุม
      id: 'teak',
      t: [29, 33.6],
      year: [1889.6, 1892],
      caption: {t0: 28.6, title: 'ยุคค้าไม้สัก', sub: 'ซุงล่องแม่น้ำวัง พ่อค้าไม้ชาวพม่าสร้างวัดศรีชุม ราว พ.ศ. 2433'},
      era: 'สยาม',
      callouts: [{t0: 32.6, t1: 33.8, label: 'วัดศรีชุม', dx: -90, dy: -120, p: [WAT_SI_CHUM[0], 1.4, WAT_SI_CHUM[1]]}],
      camera: [
        // down the Wang with the logs, ending over the bridge with วัดศรีชุม beyond
        [29.2, 18, 1, -12, 44, 300, 35, 30],
        [31.4, 9, 1, 1, 46, 312, 35, 30],
        [33.4, -4, 1, 14.5, 52, 325, 36, 30],
      ],
    },
    {
      // 1 April 1916: the first train pulls in to Lampang, then the end of the line
      id: 'railway',
      t: [35.4, 40.4],
      year: [1916.24, 1916.32],
      caption: {t0: 35, title: 'รถไฟถึงลำปาง', sub: '1 เมษายน พ.ศ. 2459 สถานีปลายทางเหนือสุดของสยามในเวลานั้น รถม้าเริ่มวิ่งรับส่งในเมือง'},
      callouts: [{t0: 38.6, t1: 40.4, label: 'สถานีรถไฟนครลำปาง', dx: 80, dy: -130, p: [STATION[0], 1.2, STATION[1]]}],
      camera: [
        // tracking the train in from the east to the terminus
        [35.4, 22, 1, 27, 84, 345, 35, 30],
        [37.2, -16, 1, 27, 74, 352, 35, 30],
        [38.8, -37, 1, 26, 60, 358, 35, 30],
        [40.4, -39, 1, 23, 60, 366, 36, 30],
      ],
    },
    {
      // 1955: kaolin found at แจ้ห่ม; Chinese potters fire the rooster bowls
      id: 'bowls',
      t: [43, 46.6],
      year: [1955, 1956.2],
      caption: {t0: 42.8, title: 'ชามตราไก่', sub: 'พ.ศ. 2498 พบดินขาวที่แจ้ห่ม ช่างชาวจีนตั้งเตาเผาชามลายไก่'},
      era: 'ปัจจุบัน',
      callouts: [{t0: 44, t1: 46.6, label: 'เตาชามไก่', dx: 90, dy: -110, p: [KILNS[0], 1.5, KILNS[1]]}],
      camera: [
        [43.4, KILNS[0], 1.5, KILNS[1], 46, 405, 36, 30],
        [46.4, KILNS[0] + 0.4, 1.5, KILNS[1] + 1, 40, 412, 36, 30],
      ],
    },
    {
      // Mae Moh: the lignite pit (opened 1954) and the power station going up from 1972
      id: 'maemoh',
      t: [48, 51.6],
      year: [1972, 1973.2],
      caption: {t0: 47.8, title: 'แม่เมาะ', sub: 'พ.ศ. 2515 เริ่มสร้างโรงไฟฟ้า ข้างเหมืองลิกไนต์ที่เปิดมาเกือบ 20 ปี'},
      callouts: [{t0: 48.6, t1: 51.6, label: 'เหมืองแม่เมาะ', dx: -100, dy: -120, p: [MAE_MOH[0], 2, MAE_MOH[1]]}],
      camera: [
        [48.2, MAE_MOH[0] - 4, 2, MAE_MOH[1], 72, 430, 36, 30],
        [51.4, MAE_MOH[0] - 4, 2, MAE_MOH[1] + 2, 64, 445, 36, 30],
      ],
    },
    {
      // the city today: carriages on the white bridge at dusk
      id: 'modern',
      t: [52.6, 56],
      year: [1995, 2026],
      caption: {t0: 52.4, title: 'เมืองรถม้า', sub: 'รถม้ายังวิ่งรอบเมืองเก่า ข้ามสะพานรัษฎาภิเศก'},
      callouts: [{t0: 53.4, t1: 55.6, label: 'สะพานรัษฎาภิเศก', dx: 80, dy: -120, p: [BRIDGE[0], 0.6, BRIDGE[1]]}],
      camera: [
        [52.8, BRIDGE[0] + 2, 1, BRIDGE[1], 70, 470, 36, 30],
        [55.6, BRIDGE[0] + 3, 1, BRIDGE[1] - 1, 96, 482, 36, 30],
      ],
    },
  ],
});

export const DURATION = STORY.duration;
export const yearAt = STORY.yearAt;
export const CAPTIONS = STORY.captions;
export const ERAS = STORY.eras;

// the first train pulls in to the terminus as the railway caption lands
const [rail0, rail1] = STORY.at('railway');
export const SOUND_EVENTS = {
  trains: [{t0: rail0 - 0.4, dur: 4.4, dir: 1, modern: false}] as {t0: number; dur: number; dir: number; modern: boolean}[],
};
