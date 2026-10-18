// Pure data so scripts/export_timeline.mjs can import it. Beats own their seconds
// (src/engine/story.ts); dates and wording from docs/briefs/khonkaen.md §3. 60 s: Nakhon Si's
// 75 s lost viewers in its finale (docs/experiments.md).
import {buildStory} from '../../engine/story';
import {DIG, LAKE, PHU_WIANG, RAIL_X, STATION, STUPA} from './places';

export const STORY = buildStory({
  duration: 60,
  before: -1.32e8,
  after: 2026,
  camera: [
    [9.3, -10, 1, -4, 120, 160, 36, 30],
    [37.5, -20, 1, -16, 120, 452, 38, 30],
    [60, 0, 1, -8, 300, 580, 36, 30],
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
      // 1797: เพียเมืองแพน's people, out of Suwannaphum since ~1788 and settled near today's Ban
      // Phai (SSW), come up to Bueng Bon, and the village is raised to เมืองขอนแก่น
      id: 'founding',
      t: [10.4, 17.6],
      year: {hold: 1797},
      caption: {t0: 10.2, title: 'ตั้งเมืองขอนแก่น', sub: 'พ.ศ. 2340 เพียเมืองแพนพาผู้คนมาตั้งที่บึงบอน และได้ยกขึ้นเป็นเมืองขอนแก่น'},
      era: 'สยาม',
      callouts: [{t0: 14, t1: 17.4, label: 'บึงแก่นนคร', dx: 90, dy: -120, p: [LAKE[0], 0.3, LAKE[1]]}],
      camera: [
        [10.6, -15, 1, 40, 50, 175, 46, 30],
        [14.2, -4, 1, 6, 62, 195, 42, 30],
        [17.4, -3, 1, 1, 58, 210, 37, 30],
      ],
    },
    {
      // 1 April 1933: the north-eastern line reaches Khon Kaen. One continuous stretch with the
      // next beat: the camera rides the train north, then swings west onto the highway.
      id: 'railway',
      t: [19.2, 23.4],
      year: [1933.24, 1933.3],
      caption: {t0: 19, title: 'รถไฟถึงขอนแก่น', sub: '1 เมษายน พ.ศ. 2476 ทางรถไฟสายตะวันออกเฉียงเหนือมาถึงเมือง'},
      callouts: [{t0: 21.4, t1: 23.4, label: 'สถานีรถไฟขอนแก่น', dx: 90, dy: -130, p: [STATION[0], 1.2, STATION[1]]}],
      camera: [
        [19.4, -13, 1, 4, 62, 225, 35, 30],
        [23.2, -13, 1, -15, 58, 236, 35, 30],
      ],
    },
    {
      // 1955-57: the US builds the Friendship Highway, Korat to Nong Khai; a convoy runs north
      id: 'mittraphap',
      t: [23.8, 28.6],
      year: {hold: 1957},
      caption: {t0: 23.6, title: 'ถนนมิตรภาพ', sub: 'สหรัฐฯ สร้างจากโคราชถึงหนองคาย ได้ชื่อเมื่อ 20 กุมภาพันธ์ พ.ศ. 2500'},
      camera: [
        [24.2, -31, 1, 18, 66, 252, 37, 30],
        [28.4, -27, 1, -12, 66, 318, 40, 30],
      ],
    },
    {
      // 1976: a geologist surveying for uranium finds a sauropod femur at Phu Wiang, the first
      // dinosaur bone found in Thailand -- the opening's animals come back as bones
      id: 'discovery',
      t: [30.2, 36.8],
      year: {hold: 1976},
      caption: {t0: 30, title: 'พบกระดูกไดโนเสาร์', sub: '20 กรกฎาคม พ.ศ. 2519 นายสุธรรม แย้มนิยม พบซากไดโนเสาร์ชิ้นแรกของไทย ที่ภูเวียง'},
      callouts: [{t0: 32.6, t1: 36.6, label: 'ภูเวียง', dx: 90, dy: -130, p: [DIG[0], 1.2, DIG[1]]}],
      camera: [
        [30.4, DIG[0], 2, DIG[1], 44, 392, 36, 30],
        [33.4, DIG[0], 2, DIG[1], 32, 412, 33, 30],
        [36.6, DIG[0], 3, DIG[1], 36, 432, 34, 30],
      ],
    },
    {
      // 1996: พระมหาธาตุแก่นนคร goes up, tier by tier, on the lake shore
      id: 'stupa',
      t: [38.6, 46],
      year: {hold: 1996},
      caption: {t0: 38.4, title: 'พระมหาธาตุแก่นนคร', sub: 'พ.ศ. 2539 พระธาตุ 9 ชั้น ริมบึงแก่นนคร ฉลองเมืองขอนแก่นครบ 200 ปี'},
      era: 'ปัจจุบัน',
      callouts: [{t0: 42.4, t1: 45.8, label: 'วัดหนองแวง', dx: 90, dy: -130, p: [STUPA[0], 6, STUPA[1]]}],
      camera: [
        [38.8, STUPA[0], 3, STUPA[1], 52, 462, 34, 30],
        [45.8, STUPA[0], 4, STUPA[1], 46, 494, 33, 30],
      ],
    },
    {
      // 13 March 2019: the double track reaches Khon Kaen on a 5.4 km viaduct through town, with
      // the north-east's first elevated station -- the 1933 line's answer, 86 years on. The
      // counter holds here and only runs on to today under the finale's pull-out.
      id: 'doubletrack',
      t: [47.2, 55.6],
      year: {hold: 2019},
      caption: {t0: 47, title: 'รถไฟทางคู่ถึงขอนแก่น', sub: 'พ.ศ. 2562 สถานีรถไฟยกระดับแห่งแรกของภาคอีสาน'},
      callouts: [{t0: 52.4, t1: 55.4, label: 'สถานีขอนแก่น', dx: 90, dy: -130, p: [RAIL_X, 2.8, STATION[1]]}],
      camera: [
        [47.6, RAIL_X, 2, 22, 46, 506, 34, 30],
        [51.6, RAIL_X, 2, -5, 56, 518, 36, 30],
        [55.4, RAIL_X, 2, -14, 66, 530, 38, 30],
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
