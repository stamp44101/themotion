// Pure data (no React/three) so scripts/export_timeline.mjs can import it for the soundtrack.
// Beats own their seconds (src/engine/story.ts); dates from docs/briefs/suratthani.md (Gemini's research
// cross-checked on the web, 2 Nov 2026). Built to the 0-to-100 spine: at the cover the tile is forest,
// mangrove, the Tapi and the bay; a legend-scale coconut monkey drops a coconut into the river (style frame
// A1, picked for the owner in the loop experiment); Srivijaya's ships sail into the bay; the Burmese burn
// Chaiya; a royal shipyard starts the village at Ban Don; Tha Thong moves in; Rama VI's barge names the town
// and the river; the train crosses the Tapi at Tha Kham; the town fills both banks; Chak Phra on the Tapi
// closes the clip with the monkey back on a palm.
import {between, type CameraKey} from '../../engine/glide';
import {buildStory} from '../../engine/story';
import {CHAIYA, LANDING, PALM_BASE, PALM_OVER, SHIPYARD, SRI_SURAT, STATION, THA_KHAM} from './places';

type Key = CameraKey;
// [t, target x, y, z, distance, azimuth, elevation, fov]
/** the palm's height at legend scale (the cover, style frame A1); the monkey is 0.3 of it */
export const H_HERO = 38;

const [CX, CZ] = CHAIYA;
const [SX, SZ] = SHIPYARD;
const [TX, TZ] = THA_KHAM;
// the cover pulls back and swings north-west over the bay as the junks come in toward Laem Pho
const HERO_END: Key = [6.6, -26, 2, -57, 86, 318, 31, 30];
// Chaiya burning, the two armies on the shore
const FI_IN: Key = [7.4, CX + 3.5, 1.5, CZ + 5, 64, 316, 34, 30];
const FI_END: Key = [11.6, CX + 3.5, 1.5, CZ + 5, 56, 296, 34, 30];
// the shipyard on the Ban Don bank, seen from across the river
const SY_IN: Key = [12.8, SX, 1, SZ, 66, 266, 34, 30];
const SY_END: Key = [17.4, SX, 1, SZ, 36, 238, 34, 30];
// Tha Thong's boats come up the lower reach to Ban Don; houses go up along the bank
const MV_IN: Key = [18.2, SX + 2, 1, SZ - 2, 58, 222, 36, 30];
const MV_END: Key = [22.6, SX - 1, 1, SZ + 3, 50, 204, 36, 30];
// Rama VI's barge comes down the Tapi from the west to the Ban Don landing
const RY_IN: Key = [23.6, -9, 1, 1.5, 50, 196, 33, 30];
const RY_END: Key = [28.1, LANDING[0] - 1, 1, LANDING[1] + 1, 46, 170, 33, 30];
// the first train over the Tapi at Tha Kham, seen down the line from the south
const TR_IN: Key = [29.6, TX + 1, 1, TZ + 2, 60, 156, 31, 30];
const TR_END: Key = [34.0, TX + 2, 1, TZ + 1, 50, 140, 32, 30];
// the long wide shot: the town over the south-east bank, the bridges, the bay
const GR_IN: Key = [35.6, 4, 2, -12, 160, 112, 36, 30];
const GR_END: Key = [43.0, 6, 2, -14, 210, 70, 36, 30];
// Chak Phra on the Tapi between Ko Lamphu and the landing
const PY_IN: Key = [44.4, -1.0, 1.5, -4.0, 50, 28, 32, 30];
const PY_END: Key = [53.6, -1.0, 1.5, -4.0, 44, 4, 31, 30];
// the landing: the whole tile again, as on the cover, now the full town
const END: Key = [55.8, 0, 4, -18, 320, -12, 30, 30];

export const STORY = buildStory({
  duration: 60,
  standard: 1,
  before: 757,
  after: 2026,
  camera: [
    ...between(HERO_END, FI_IN, 4, 0.05),
    ...between(FI_END, SY_IN, 4, 0.3),
    ...between(SY_END, MV_IN, 4),
    ...between(MV_END, RY_IN, 4),
    ...between(RY_END, TR_IN, 5, 0.5),
    ...between(TR_END, GR_IN, 5, 0.2),
    ...between(GR_END, PY_IN, 4),
    ...between(PY_END, END, 4),
    END,
    [60, 0, 4, -18, 350, -20, 30, 30],
  ],
  beats: [
    {
      // the cover (owner's style frame A1, picked in the loop): the coconut monkey; then Srivijaya's ships
      // sail into Bandon Bay for Laem Pho (Tang ceramics; FAD) while Phra Borommathat Chaiya stands on the
      // far shore (13th-14th Buddhist century, so the counter reads "ราว 1300")
      id: 'hero',
      kind: 'trade',
      t: [0, 6.6],
      year: {hold: 757},
      caption: {t0: 3.3, t1: 6.85, title: 'ท่าเรือศรีวิชัยที่ไชยา', sub: 'ราว พ.ศ. 1300 สำเภาจีน อินเดีย อาหรับ แวะแหลมโพธิ์'},
      era: 'ศรีวิชัย',
      camera: [
        [0, (PALM_BASE[0] + PALM_OVER[0]) / 2, 0.8 * H_HERO, PALM_BASE[1] + 1, 285, 336, 22, 30],
        [3, (PALM_BASE[0] + PALM_OVER[0]) / 2 - 2, 0.7 * H_HERO, PALM_BASE[1] - 4, 250, 330, 25, 30],
        HERO_END,
      ],
    },
    {
      // the Nine Armies War: the Burmese southern army burns Chaiya, 2328; the Siamese army comes down and
      // drives them out of the south (Rattanakosin chronicle R1 via Gemini; who fought at Chaiya is not
      // confirmed, so the caption names no commander)
      id: 'fight',
      kind: 'fight',
      t: [7.4, 11.6],
      year: {hold: 1785},
      caption: {t0: 7.4, t1: 11.8, title: 'พม่าเผาเมืองไชยา', sub: 'พ.ศ. 2328 สงครามเก้าทัพ ทัพไทยยกลงมาขับพม่า'},
      era: 'รัตนโกสินทร์',
      callouts: [{label: 'พระบรมธาตุไชยา', dx: -150, dy: -150, p: [CX, 3.0, CZ], t0: 8.0, t1: 11.2}],
      camera: [FI_IN, FI_END],
    },
    {
      // a royal shipyard on the right bank at Ban Don under Chao Phraya Nakhon (Noi), Rama III: timber
      // floated down the river, warships sent to Bangkok (th.wikipedia ท่าทอง; ~2375 approximate)
      id: 'shipyard',
      kind: 'build',
      t: [12.8, 17.4],
      year: {hold: 1832},
      caption: {t0: 12.8, t1: 17.6, title: 'อู่ต่อเรือหลวงที่บ้านดอน', sub: 'ราว พ.ศ. 2375 ต่อเรือรบส่งกรุงเทพฯ ชุมชนแรกริมแม่น้ำ'},
      camera: [SY_IN, SY_END],
    },
    {
      // Rama IV moves the town of Tha Thong to Ban Don and names it Kanchanadit (no year found; the
      // counter runs through his reign)
      id: 'move',
      kind: 'arrive',
      t: [18.2, 22.6],
      year: [1855, 1866],
      caption: {t0: 18.2, t1: 22.8, title: 'ท่าทองย้ายมาบ้านดอน', sub: 'สมัยรัชกาลที่ 4 ตั้งชื่อเมืองกาญจนดิษฐ์ ตลาดจีนริมน้ำ'},
      camera: [MV_IN, MV_END],
    },
    {
      // Rama VI comes by royal barge from Tha Kham to the Ban Don landing (28 Jul 2458) and names the
      // town Surat Thani and the river the Tapi (29 Jul 2458; gazette vol. 32)
      id: 'royal',
      kind: 'procession',
      t: [23.6, 28.1],
      year: {hold: 1915},
      caption: {t0: 23.6, t1: 28.3, title: 'ร.6 ตั้งชื่อสุราษฎร์ธานี', sub: '29 ก.ค. 2458 เมืองคนดี และชื่อแม่น้ำตาปี'},
      camera: [RY_IN, RY_END],
    },
    {
      // the Southern Line runs through Phun Phin and over the Tapi at Tha Kham, 2459 (SRT; Tha Kham)
      id: 'train',
      kind: 'arrive',
      t: [29.6, 34.0],
      year: {hold: 1916},
      caption: {t0: 29.6, t1: 34.2, title: 'รถไฟสายใต้ข้ามแม่น้ำตาปี', sub: 'พ.ศ. 2459 สถานีพุนพิน ท่าข้าม'},
      callouts: [{label: 'สถานีพุนพิน', dx: 150, dy: -110, p: [STATION[0], 0.8, STATION[1]], t0: 31.2, t1: 33.8}],
      camera: [TR_IN, TR_END],
    },
    {
      // municipality 2.67 km2 (2478) to city 68.97 km2 (2550); ferries to Samui (2524); the Sri Surat
      // bridge over the mouth (1 Oct 2556); oyster farms in the bay (suratcity.go.th; doh.go.th; GI)
      id: 'growth',
      kind: 'grow',
      t: [35.6, 43.0],
      year: [1935, 2016],
      caption: {t0: 35.6, t1: 43.2, title: 'เมืองโตเต็มสองฝั่งตาปี', sub: 'เทศบาลนคร 69 ตร.กม. ฟาร์มหอยอ่าวบ้านดอน เรือไปสมุย'},
      callouts: [{label: 'สะพานศรีสุราษฎร์', dx: -150, dy: -120, p: [SRI_SURAT[0], 0.6, SRI_SURAT[1]], t0: 40.4, t1: 42.8}],
      era: 'ปัจจุบัน',
      camera: [GR_IN, GR_END],
    },
    {
      // Chak Phra, Thot Pha Pa and the long-boat races at the end of Lent, on the Tapi at Saphan Narit
      // (annual; 4-12 Oct 2568); the monkey back on a palm on Ko Lamphu (the callback)
      id: 'payoff',
      kind: 'celebrate',
      t: [44.4, 53.6],
      year: {hold: 2025},
      caption: {t0: 44.4, t1: 53.8, title: 'ชักพระ ทอดผ้าป่า แข่งเรือ', sub: 'วันออกพรรษา เรือพนมพระล่องแม่น้ำตาปี ลิงกังยังขึ้นมะพร้าว'},
      callouts: [{label: 'แม่น้ำตาปี', dx: -150, dy: -120, p: [0.6, 0.2, -4.0], t0: 48.6, t1: 51.6}],
      camera: [PY_IN, PY_END],
    },
    {id: 'today', kind: 'today', t: [54.0, 55.8], year: [2025.6, 2026]},
  ],
});

export const DURATION = STORY.duration;
export const yearAt = STORY.yearAt;
export const CAPTIONS = STORY.captions;
export const ERAS = STORY.eras;

// the first train comes down from Bangkok (the north, dir 1 runs toward -z ... set in index.ts) as the
// caption lands, over the bridge and into Phun Phin
const [tr0] = STORY.at('train');
export const SOUND_EVENTS = {
  trains: [{t0: tr0 + 0.1, dur: 4.2, dir: -1, modern: false, park: 0.6}] as {t0: number; dur: number; dir: number; modern: boolean; park?: number}[],
};
