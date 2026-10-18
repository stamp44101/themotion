// Pure data so scripts/export_timeline.mjs can import it. Beats own their seconds
// (src/engine/story.ts); dates and wording from docs/briefs/khonkaen.md §3. 60 s: Nakhon Si's
// 75 s lost viewers in its finale (docs/experiments.md).
import {buildStory} from '../../engine/story';
import {DAM, KKU, LAKE, PHU_WIANG, STATION, STUPA} from './places';

export const STORY = buildStory({
  duration: 60,
  before: -1.32e8,
  after: 2026,
  camera: [
    [9.3, -10, 1, -4, 120, 160, 36, 30],
    [38.3, 0, 1, -6, 220, 330, 38, 30],
    [60, 0, 1, -8, 300, 440, 36, 30],
  ],
  beats: [
    {
      // the hero stupa on the whole tile under the title, then the sauropods below Phu Wiang
      id: 'dinos',
      t: [0, 8],
      year: [-1.305e8, -1.3e8],
      caption: {t0: 3.3, title: 'ภูเวียง แผ่นดินไดโนเสาร์', sub: 'ราว 130 ล้านปีก่อน ที่นี่คือที่พบกระดูกไดโนเสาร์ชิ้นแรกของไทย'},
      era: 'ยุคไดโนเสาร์',
      callouts: [{t0: 4.8, t1: 7.8, label: 'ภูเวียง', dx: -80, dy: -120, p: [PHU_WIANG[0] + 3, 7.5, PHU_WIANG[1] + 2]}],
      camera: [
        [0, 2, 1, -2, 330, 135, 34, 30],
        [2.4, 0, 3, -2, 140, 140, 33, 30],
        [4.6, PHU_WIANG[0] + 9, 4, PHU_WIANG[1] + 6, 108, 150, 38, 30],
        [7.6, PHU_WIANG[0] + 9, 4, PHU_WIANG[1] + 6, 98, 166, 39, 30],
      ],
    },
    {
      // 1797: settlers from Suwannaphum come up to Bueng Bon; the village becomes a town
      id: 'founding',
      t: [10.4, 17.6],
      year: {hold: 1797},
      caption: {t0: 10.2, title: 'ตั้งเมืองขอนแก่น', sub: 'พ.ศ. 2340 ท้าวเพียเมืองแพนพาผู้คนจากเมืองสุวรรณภูมิ มาตั้งบ้านเรือนริมบึงบอน'},
      era: 'สยาม',
      callouts: [{t0: 14, t1: 17.4, label: 'บึงแก่นนคร', dx: 90, dy: -120, p: [LAKE[0], 0.3, LAKE[1]]}],
      camera: [
        [10.6, 22, 1, 16, 48, 175, 46, 30],
        [14.2, 7, 1, 1, 60, 195, 42, 30],
        [17.4, 2, 1, -3, 58, 210, 37, 30],
      ],
    },
    {
      // 1 April 1933: the north-eastern line reaches Khon Kaen
      id: 'railway',
      t: [19.2, 24.4],
      year: [1933.24, 1933.3],
      caption: {t0: 19, title: 'รถไฟถึงขอนแก่น', sub: '1 เมษายน พ.ศ. 2476 ทางรถไฟสายตะวันออกเฉียงเหนือมาถึงเมือง'},
      callouts: [{t0: 22, t1: 24.4, label: 'สถานีรถไฟขอนแก่น', dx: 90, dy: -130, p: [STATION[0], 1.2, STATION[1]]}],
      camera: [
        [19.4, -13, 1, 6, 64, 225, 35, 30],
        [22.2, -12, 1, -14, 58, 238, 35, 30],
        [24.2, -11, 1, -19, 56, 246, 36, 30],
      ],
    },
    {
      // 1955-57: the US builds the Friendship Highway, Korat to Nong Khai
      id: 'mittraphap',
      t: [25.8, 30.8],
      year: [1956, 1957.2],
      caption: {t0: 25.6, title: 'ถนนมิตรภาพ', sub: 'สหรัฐฯ สร้างจากโคราชถึงหนองคาย ได้ชื่อเมื่อ 20 กุมภาพันธ์ พ.ศ. 2500'},
      camera: [
        [26, -34, 1, 26, 66, 260, 36, 30],
        [30.6, -27, 1, -16, 66, 276, 36, 30],
      ],
    },
    {
      // 1964-66: Ubolratana dam on the Phong; the reservoir fills
      id: 'dam',
      t: [32.2, 37.6],
      year: [1964.8, 1966.3],
      caption: {t0: 32, title: 'เขื่อนอุบลรัตน์', sub: 'พ.ศ. 2509 เขื่อนผลิตไฟฟ้าแห่งแรกของภาคอีสาน กั้นแม่น้ำพอง'},
      callouts: [{t0: 33.6, t1: 37.4, label: 'เขื่อนอุบลรัตน์', dx: 90, dy: -120, p: [DAM[0] + 4, 1.5, DAM[1] + 4]}],
      camera: [
        [32.4, DAM[0], 2, DAM[1], 74, 292, 50, 30],
        [37.4, DAM[0], 2, DAM[1], 68, 312, 50, 30],
      ],
    },
    {
      // 1996: พระมหาธาตุแก่นนคร goes up, tier by tier, on the lake shore
      id: 'stupa',
      t: [39.6, 46.6],
      year: {hold: 1996},
      caption: {t0: 39.4, title: 'พระมหาธาตุแก่นนคร', sub: 'พ.ศ. 2539 พระธาตุ 9 ชั้น ริมบึงแก่นนคร ฉลองเมืองขอนแก่นครบ 200 ปี'},
      era: 'ปัจจุบัน',
      callouts: [{t0: 43.4, t1: 46.4, label: 'วัดหนองแวง', dx: 90, dy: -130, p: [STUPA[0], 6, STUPA[1]]}],
      camera: [
        [39.8, STUPA[0], 3, STUPA[1], 52, 340, 34, 30],
        [46.4, STUPA[0], 4, STUPA[1], 46, 372, 33, 30],
      ],
    },
    {
      // the city today: university town, crossroads of the north-east
      id: 'modern',
      t: [48, 56],
      year: [2005, 2026],
      caption: {t0: 47.8, title: 'ขอนแก่นวันนี้', sub: 'เมืองมหาวิทยาลัย และศูนย์กลางการเดินทางของภาคอีสาน'},
      callouts: [{t0: 50, t1: 53.6, label: 'มหาวิทยาลัยขอนแก่น', dx: 80, dy: -120, p: [KKU[0], 1.5, KKU[1]]}],
      camera: [
        [48.4, -6, 1, -20, 110, 392, 36, 30],
        [53.6, -6, 1, -26, 130, 410, 37, 30],
      ],
    },
  ],
});

export const DURATION = STORY.duration;
export const yearAt = STORY.yearAt;
export const CAPTIONS = STORY.captions;
export const ERAS = STORY.eras;

// the first train arrives from Korat (the south) as the railway caption lands
const [rail0] = STORY.at('railway');
export const SOUND_EVENTS = {
  trains: [{t0: rail0 - 0.3, dur: 4.2, dir: 1, modern: false}] as {t0: number; dur: number; dir: number; modern: boolean}[],
};
