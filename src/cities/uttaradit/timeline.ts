// Pure data (no React/three) so scripts/export_timeline.mjs can import it for the soundtrack.
// Beats own their seconds (src/engine/story.ts); the beats, verbs, held years and what is approximate are the brief's
// "Storyline (60 s, v2 standard)" table (docs/briefs/uttaradit.md): forge / raise / fight / trade / arrive / rename /
// dam (rise, fill) / grow / gather. Held years: 2316, 2452, 2458, 2520; the counter lands on 2569. The wall's 2033 is a
// callout and a sub line, never a held year; the seat's move has no year of its own (sources give 2442, 2457, 2458).
// War weight: nobody hurt on screen; the fight is a giant, two swords, one breaking, and a column falling back.
// Verbs: rename is 'celebrate' (the flag goes up on the new name) and fill is 'disaster' (old Tha Pla drowned), so no
// two beats in a row share one.
import {between, type CameraKey} from '../../engine/glide';
import {buildStory} from '../../engine/story';
import {DAM, FIGHT_AT, HALL, HERO_AT, LANDING, MONUMENT, PARAMIN, PHICHAI} from './places';

type Key = CameraKey;
// [t, target x, y, z, distance, azimuth, elevation, fov]; azimuth from +z (south) toward +x (east)
// the cover: the giant anvil on the tile, the whole tile round it (owner's cover rule; distance 290-335)
const C0: Key = [0, 20, 10, 2, 288, 18, 34, 30];
const C1: Key = [2.6, 20, 10.5, 2, 294, 22, 34, 30];
// the sword rises and the camera swings south-west down the valley in one glide (2.6-5.0 s) to the fight, Phichai's
// wall going up on the way
// 2316: from the south-south-west, the giant in front on the west-bank field, the column coming down from the north
// behind him on the left, the wall across the river on the right
const FT_IN: Key = [5.0, -24, 5, 38, 80, -14, 24, 30];
const FT_MID: Key = [7.4, -23.5, 5.5, 37, 76, -20, 24, 30];
const FT_END: Key = [9.4, -24, 4, 34, 88, -28, 28, 30];
// up the Nan to Bang Pho Tha It, from the west over the river street: boats come up, the market row goes up
const TR_IN: Key = [10.4, 0, 1, 18, 92, -50, 34, 30];
const TR_MID: Key = [13.2, 1, 1, 15, 54, -62, 34, 30];
const TR_END: Key = [16.4, 1.5, 1, 12, 46, -74, 34, 30];
// 2452: the train over the Paramin bridge and north into Uttaradit station, from the west
const AR_IN: Key = [17.2, PARAMIN[0], 1, PARAMIN[1] - 4, 72, -62, 28, 30];
const AR_MID: Key = [20.0, -1.6, 1, 12, 70, -72, 28, 30];
const AR_END: Key = [23.0, -1.6, 1, 6, 62, -84, 30, 30];
// 2458: the hall rises in town and the name changes; Phichai's wall settles to fields far down the valley
const RN_IN: Key = [23.6, HALL[0], 1.4, HALL[1], 46, -100, 28, 30];
const RN_END: Key = [29.0, MONUMENT[0], 1.4, MONUMENT[1], 52, -116, 28, 30];
// the dam rises across the gorge in the NE corner (the counter runs), then 2520: the lake fills behind it
const DM_IN: Key = [30.4, DAM[0] - 6, 2, DAM[1] + 4, 96, -64, 30, 30];
const DM_MID: Key = [33.4, DAM[0] - 2, 2, DAM[1] + 1, 62, -44, 30, 30];
const DM_END: Key = [36.9, DAM[0] - 1, 2, DAM[1], 58, -28, 30, 30];
// the grow shot: the whole valley, wide, swinging round from the south
const GR_IN: Key = [38.4, 4, 1, 4, 170, 10, 34, 30];
const GR_END: Key = [45.6, 4, 1, 4, 205, 48, 34, 30];
// the January fair before the hall, at dusk; the giant sword comes back over the town
const GA_IN: Key = [47.0, MONUMENT[0], 3, MONUMENT[1], 64, 70, 24, 30];
const GA_END: Key = [53.6, MONUMENT[0], 4, MONUMENT[1], 58, 92, 22, 30];
// the landing: the whole tile again at the cover's distance, now full of town
const END: Key = [55.6, 6, 6, 6, 296, 100, 30, 30];

export const STORY = buildStory({
  duration: 60,
  standard: 1,
  before: 1480,
  after: 2026,
  camera: [
    ...between(C1, FT_IN, 7),
    ...between(FT_END, TR_IN, 4, 0.3),
    ...between(TR_END, AR_IN, 3),
    ...between(AR_END, RN_IN, 2),
    ...between(RN_END, DM_IN, 5, 0.3),
    ...between(DM_END, GR_IN, 5, 0.2),
    ...between(GR_END, GA_IN, 6, 0.1),
    ...between(GA_END, END, 5),
    END,
    [60, 6, 6, 6, 310, 106, 30, 30],
  ],
  beats: [
    {
      // the cover (owner's pick A1): a glowing bar of Nam Phi iron on a giant anvil in the hills east of the Nan, half
      // already beaten into a blade at frame 0; the hammer walks down the rest by 2.3 s; it cools to steel, the hilt
      // goes on, and it lifts. No counter and no year under the title.
      id: 'hero',
      kind: 'legend',
      t: [0, 3.0],
      year: [1480, 1484],
      era: 'อยุธยา',
      camera: [C0, C1],
    },
    {
      // the sword rises off the anvil (the anvil sinks away) and flies south-west; Phichai's wall rises on the east bank
      // (the chronicle: first walled จ.ศ. 852 = 2033; no held year)
      id: 'raise',
      kind: 'build',
      t: [3.0, 4.6],
      year: [1490, 1499],
      callouts: [{label: 'กำแพงเมืองพิชัย ราว 2033', dx: 120, dy: -160, p: [PHICHAI[0] + 2, 1.6, PHICHAI[1]], t0: 3.1, t1: 4.3}],
    },
    {
      // ปีมะเส็ง จ.ศ. 1135 (Jan 1774 CE; the counter shows 2316): the giant (Phraya Phichai, at legend scale) on the
      // west-bank field of Wat Ekka (local history), the cover's sword in his right hand and a second in his left; the
      // Burmese column comes down from the north; the right sword snaps at ~7 s; the column falls back north.
      id: 'fight',
      kind: 'fight',
      t: [4.8, 9.4],
      year: {hold: 1773},
      caption: {t0: 4.8, title: 'ศึกเมืองพิชัย', sub: 'พ.ศ. 2316 ตามพงศาวดาร พระยาพิชัยรบจนดาบหัก พม่าตีเมืองไม่แตก'},
      era: 'ธนบุรี',
      camera: [FT_IN, FT_MID, FT_END],
    },
    {
      // Bang Pho Tha It, the head of navigation (Rama III-V, no start year): big boats stop below the rapids, teak rafts
      // float down, the market row grows on the west bank
      id: 'trade',
      kind: 'trade',
      t: [10.0, 16.6],
      year: [1830, 1885],
      caption: {t0: 10.0, title: 'บางโพท่าอิฐ ท่าเหนือ', sub: 'เรือใหญ่ทวนน้ำน่านขึ้นมาได้สุดที่นี่ แพซุงสักล่องลงมาขึ้นท่า'},
      era: 'รัตนโกสินทร์',
      callouts: [{label: 'ท่าอิฐ', dx: -130, dy: -150, p: [LANDING[0], 1.2, LANDING[1]], t0: 12.0, t1: 16.2}],
      camera: [TR_IN, TR_MID, TR_END],
    },
    {
      // 15 Aug 2452: the northern line reaches Uttaradit; the train crosses the Nan at Ban Dara (the Paramin bridge,
      // opened Dec 2452) and runs north into the station; shophouses spread from the landing to the station
      id: 'arrive',
      kind: 'arrive',
      t: [17.0, 23.2],
      year: {hold: 1909},
      caption: {t0: 17.0, title: 'รถไฟสายเหนือถึงอุตรดิตถ์', sub: 'พ.ศ. 2452 ข้ามแม่น้ำน่านที่บ้านดารา เมืองขยายจากท่าน้ำมาหาสถานี'},
      camera: [AR_IN, AR_MID, AR_END],
    },
    {
      // 22 Aug 2458 (gazette vol. 32): เมืองพิไชย renamed เมืองอุตรดิฐ; the seat had already moved up to Tha It (its year is
      // disputed, so no year of its own); the hall rises, the flag goes up
      id: 'rename',
      kind: 'celebrate',
      t: [23.6, 29.0],
      year: {hold: 1915},
      caption: {t0: 23.6, title: 'เปลี่ยนนามเป็นอุตรดิตถ์', sub: 'พ.ศ. 2458 เมืองพิชัยได้ชื่อใหม่ ศาลากลางย้ายขึ้นมาอยู่ท่าอิฐแล้ว'},
      callouts: [{label: 'ศาลากลาง', dx: 130, dy: -160, p: [HALL[0], 2.2, HALL[1]], t0: 24.8, t1: 28.6}],
      camera: [RN_IN, RN_END],
    },
    {
      // works from 2511: the earth dam rises across the gorge while the counter runs and the town spreads
      id: 'dam',
      kind: 'build',
      t: [30.2, 33.4],
      year: [1917, 1976.6],
      camera: [DM_IN, DM_MID],
    },
    {
      // 4 Mar 2520: the dam opened; the lake fills behind it (old Tha Pla under it), the river below runs steady
      id: 'fill',
      kind: 'disaster',
      t: [33.6, 37.6],
      year: {hold: 1977},
      caption: {t0: 33.6, title: 'เขื่อนสิริกิติ์', sub: 'พ.ศ. 2520 กั้นแม่น้ำน่าน ท่าปลาเก่าจมใต้อ่าง'},
      camera: [DM_END],
    },
    {
      // the grow shot: the town spreads north to the Sila At yards and east; orchards on the hills
      id: 'grow',
      kind: 'grow',
      t: [38.4, 45.6],
      year: [1978, 2022],
      caption: {t0: 38.4, title: 'เมืองโตไปทางเหนือ', sub: 'ย่านรถไฟศิลาอาสน์ ถนนสายเอเชีย และสวนลางสาดบนเขาลับแล'},
      era: 'ปัจจุบัน',
      camera: [GR_IN, GR_END],
    },
    {
      // the payoff: the January fair before the hall, crowds and lights round the monument; the giant sword from the
      // cover comes back over the town, whole, and turns (the open loop closing)
      id: 'gather',
      kind: 'celebrate',
      t: [46.2, 54.0],
      year: [2025.0, 2025.5],
      caption: {t0: 46.2, t1: 54.4, title: 'งานพระยาพิชัยดาบหัก', sub: 'ทุกเดือนมกราคม ครั้งที่ 59 ในปี 2569 คนอุตรดิตถ์รำลึกถึงวีรบุรุษของเมือง'},
      callouts: [{label: 'อนุสาวรีย์พระยาพิชัยดาบหัก', dx: 150, dy: -150, p: [MONUMENT[0], 1.6, MONUMENT[1]], t0: 47.4, t1: 53.6}],
      camera: [GA_IN, GA_END],
    },
    {id: 'today', kind: 'today', t: [54.4, 55.6], year: [2025.6, 2026]},
  ],
});

/** the train (the engine's rail): north over the bridge (~19.6 s) and past the station (~20.4 s) in 2452 */
export const TRAINS: {t0: number; dur: number; dir: 1 | -1; modern: boolean}[] = [{t0: 17.2, dur: 7.2, dir: 1, modern: false}];
export const HERO_FROM = HERO_AT;
export const FIGHT_FROM = FIGHT_AT;

export const DURATION = STORY.duration;
export const yearAt = STORY.yearAt;
export const CAPTIONS = STORY.captions;
export const ERAS = STORY.eras;
