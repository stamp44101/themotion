// Pure data (no React/three) so scripts/export_timeline.mjs can import it for the soundtrack.
// Beats own their seconds (src/engine/story.ts); the beats, verbs, held years and what is approximate are the brief's
// storyline v1 table (docs/briefs/samutsongkhram.md, approved by the owner on 12 Nov 2569): hero / catch / bangkung / fort /
// train / market / road / grow / payoff / today. Held years: 2448 (the railway) and 2516 (Rama II road); the counter
// lands on 2569. Ban Laem's settling (~2307) is a sub line; the netting of Luang Pho Ban Laem is legend and undated; the
// battle of Bang Kung is 2310 or 2311 by source, so no year is held; the fort is "Rama III's reign", no year.
import {between, type CameraKey} from '../../engine/glide';
import {buildStory} from '../../engine/story';
import {BANG_KUNG, DON_HOI_LOT, FORT, NET_AT, RAMA2_BRIDGE, RAIL_Z, STATION, TRAY_AT, WAT_PHET} from './places';

type Key = CameraKey;
// [t, target x, y, z, distance, azimuth, elevation, fov]; azimuth from +z (south) toward +x (east)
// the cover: the tray on the whole tile, seen from the south-south-west, the gulf at the bottom right
const C0: Key = [0, TRAY_AT[0] - 4, 5, TRAY_AT[1] - 8, 300, -22, 36, 30];
const C1: Key = [2.8, TRAY_AT[0] - 2, 5, TRAY_AT[1] - 3, 250, -14, 34, 30];
// the catch: down to the estuary from the sea side; the net comes up full of fish and a standing Buddha
const CA_IN: Key = [4.6, NET_AT[0], 2, NET_AT[1], 56, 8, 30, 30];
const CA_END: Key = [8.9, NET_AT[0], 3, NET_AT[1] - 1, 40, 24, 28, 30];
// the battle at Bang Kung (far place): up the river to the camp, from the south-west across the water
const BK_IN: Key = [10.4, BANG_KUNG[0] - 0.6, 1, BANG_KUNG[1] + 1, 52, -36, 34, 30];
const BK_END: Key = [15.6, BANG_KUNG[0] - 0.4, 1, BANG_KUNG[1], 40, -12, 32, 30];
// the fort: the town on its bank, seen from the west across the Mae Klong
const FO_IN: Key = [17.2, FORT[0] + 0.6, 1, FORT[1] - 1.8, 42, -78, 32, 30];
const FO_END: Key = [22.6, WAT_PHET[0] + 1.0, 1, WAT_PHET[1] + 1.4, 34, -118, 32, 30];
// the train: alongside it from the north as it comes in through the orchards to the terminus
const TR_IN: Key = [23.8, 30, 1, RAIL_Z, 46, -168, 30, 30];
const TR_MID: Key = [26.4, 4, 1, RAIL_Z, 36, -178, 31, 30];
const TR_END: Key = [28.8, STATION[0] + 1.4, 1, RAIL_Z, 30, -156, 32, 30];
// the market: the landing and the shophouses, from the south-west over the water
const MA_IN: Key = [30.2, STATION[0] - 0.4, 1, RAIL_Z - 1.0, 32, -134, 34, 30];
const MA_END: Key = [34.6, STATION[0] + 0.4, 1, RAIL_Z - 0.8, 28, -114, 34, 30];
// the road: the Rama II bridge over the Mae Klong, from the west-north-west (continuing the market shot's swing)
const RD_IN: Key = [35.8, RAMA2_BRIDGE[0] + 1, 1, RAMA2_BRIDGE[1], 40, -76, 32, 30];
const RD_END: Key = [39.6, RAMA2_BRIDGE[0] + 5, 1, RAMA2_BRIDGE[1] - 0.6, 34, -48, 32, 30];
// the grow shot: the whole town from the south-east, the coast and Don Hoi Lot in front, swinging round to the north
const GR_IN: Key = [41.4, 4, 1, 12, 170, -210, 36, 30];
const GR_END: Key = [47.2, 2, 1, 8, 210, -164, 36, 30];
// the payoff: the railway market from the north, the train coming in under the awnings
const PA_IN: Key = [48.8, -2.2, 1, RAIL_Z, 22, -192, 34, 30];
const PA_END: Key = [54.0, -2.6, 1, RAIL_Z, 18, -172, 32, 30];
// the landing: the whole tile again at the cover's distance, now a town on the river and the sea
const END: Key = [56.4, 2, 5, 12, 300, -22, 36, 30];

export const STORY = buildStory({
  duration: 60,
  standard: 1,
  before: 1747,
  after: 2026,
  camera: [
    ...between(C1, CA_IN, 4),
    ...between(CA_END, BK_IN, 4, 0.3),
    ...between(BK_END, FO_IN, 4, 0.2),
    ...between(FO_END, TR_IN, 3),
    ...between(TR_END, MA_IN, 3),
    ...between(MA_END, RD_IN, 3, 0.2),
    ...between(RD_END, GR_IN, 4, 0.1),
    ...between(GR_END, PA_IN, 4, 0.1),
    ...between(PA_END, END, 4),
    END,
    [60, 2, 5, 12, 310, -16, 36, 30],
  ],
  beats: [
    {
      // the cover (owner's pick A1): a giant steel steaming tray of bamboo baskets on open ground by the sea, half the
      // baskets already packed with three pla thu each at frame 0; the rest packed by 2.1 s, then the tray steams.
      // No counter and no year under the title.
      id: 'hero',
      kind: 'legend',
      t: [0, 3.0],
      year: [1747, 1750],
      camera: [C0, C1],
    },
    {
      // fishermen drag a net at the mouth; it comes up full of fish and a gilded standing Buddha (Luang Pho Ban Laem,
      // legend, undated); the Ban Laem people from Phetchaburi settle at Mae Klong ~2307 (chronicle; sub line only)
      id: 'catch',
      kind: 'discover',
      t: [3.0, 9.4],
      year: [1750, 1764],
      caption: {t0: 3.2, title: 'หลวงพ่อติดอวน', sub: 'ชาวบ้านแหลมจากเพชรบุรีมาตั้งบ้านริมแม่กลอง'},
      era: 'อยุธยา',
      callouts: [{label: 'หลวงพ่อบ้านแหลม', dx: 130, dy: -160, p: [NET_AT[0], 3.6, NET_AT[1]], t0: 6.2, t1: 9.0}],
      camera: [CA_IN, CA_END],
    },
    {
      // the battle of Bang Kung (2310 or 2311 by source): the Chinese camp holds, Taksin's fleet comes round the bend
      id: 'bangkung',
      kind: 'fight',
      t: [9.8, 16.0],
      year: [1765, 1769],
      caption: {t0: 9.8, title: 'ศึกบางกุ้ง', sub: 'ค่ายจีนบางกุ้งต้านทัพพม่า ทัพเรือพระเจ้าตากมาช่วย'},
      era: 'ธนบุรี',
      callouts: [{label: 'ค่ายบางกุ้ง', dx: 130, dy: -150, p: [BANG_KUNG[0], 1.2, BANG_KUNG[1]], t0: 11.2, t1: 15.4}],
      camera: [BK_IN, BK_END],
    },
    {
      // the fort on the bank (Rama III's reign; abolished 2425); Wat Ban Laem and the houses along the river
      id: 'fort',
      kind: 'build',
      t: [16.6, 23.0],
      year: [1770, 1904],
      caption: {t0: 16.6, title: 'ป้อมพิฆาตข้าศึก', sub: 'สมัยรัชกาลที่ 3 · บ้านเรือนเต็มริมแม่น้ำ'},
      era: 'รัตนโกสินทร์',
      callouts: [{label: 'ป้อมพิฆาตข้าศึก', dx: 130, dy: -150, p: [FORT[0], 0.8, FORT[1]], t0: 18.0, t1: 22.4}],
      camera: [FO_IN, FO_END],
    },
    {
      // 10 Jun 2448: the Ban Laem - Mae Klong line and Mae Klong station open (Royal Gazette vol. 22)
      id: 'train',
      kind: 'arrive',
      t: [23.4, 29.4],
      year: {hold: 1905},
      caption: {t0: 23.4, title: 'รถไฟถึงแม่กลอง', sub: '10 มิ.ย. 2448 สายบ้านแหลม–แม่กลอง'},
      callouts: [{label: 'สถานีแม่กลอง', dx: -130, dy: -150, p: [STATION[0], 0.8, STATION[1] - 0.6], t0: 28.0, t1: 29.2}],
      camera: [TR_IN, TR_MID, TR_END],
    },
    {
      // boats unload at the landing in front of the station; shophouses along the bank and the track (the municipality
      // 28 Nov 2479, sub line)
      id: 'market',
      kind: 'trade',
      t: [29.8, 35.0],
      year: [1906, 1966],
      caption: {t0: 29.8, title: 'ตลาดแม่กลอง', sub: 'เรือปลาเทียบท่าหน้าสถานี ตึกแถวเรียงริมราง'},
      camera: [MA_IN, MA_END],
    },
    {
      // 1 Apr 2516: Rama II road and its Mae Klong bridge (สะพานสมเด็จพระพุทธเลิศหล้านภาลัย) open
      id: 'road',
      kind: 'build',
      t: [35.4, 40.6],
      year: {hold: 1973},
      caption: {t0: 35.4, title: 'ถนนพระราม 2', sub: '1 เม.ย. 2516 สะพานสมเด็จพระพุทธเลิศหล้านภาลัย'},
      camera: [RD_IN, RD_END],
    },
    {
      // the grow shot: the town spreads; Don Hoi Lot's flats by the sea (Ramsar 5 Jul 2544), Amphawa's market (11 Aug 2547)
      id: 'grow',
      kind: 'grow',
      t: [41.0, 48.2],
      year: [1974, 2017],
      caption: {t0: 41.0, title: 'เมืองโตถึงชายทะเล', sub: 'ดอนหอยหลอด พื้นที่ชุ่มน้ำแรมซาร์ · ตลาดน้ำอัมพวา'},
      era: 'ปัจจุบัน',
      callouts: [{label: 'ดอนหอยหลอด', dx: 120, dy: -150, p: [DON_HOI_LOT[0], 0.4, DON_HOI_LOT[1]], t0: 42.4, t1: 46.6}],
      camera: [GR_IN, GR_END],
    },
    {
      // the payoff: the railway market; the cover's baskets of pla thu on the stalls, the awnings fold for the train
      id: 'payoff',
      kind: 'celebrate',
      t: [48.6, 54.4],
      year: [2018, 2025.5],
      caption: {t0: 48.6, t1: 53.8, title: 'ตลาดร่มหุบ', sub: 'รถไฟผ่านกลางตลาดวันละ 8 เที่ยว'},
      camera: [PA_IN, PA_END],
    },
    {id: 'today', kind: 'today', t: [54.6, 56.4], year: [2025.6, 2026]},
  ],
});

export const DURATION = STORY.duration;
export const yearAt = STORY.yearAt;
export const CAPTIONS = STORY.captions;
export const ERAS = STORY.eras;
/** the trains on the Mae Klong line: the first steam train in 2448 pulls in and parks; the payoff's train comes in under
 *  the market's awnings and parks at the platform */
export const TRAINS = [
  {t0: 23.0, dur: 5.2, dir: 1 as const, modern: false, park: 2.0},
  {t0: 48.8, dur: 4.4, dir: 1 as const, modern: true, park: 2.0},
];
