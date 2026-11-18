// Pure data (no React/three) so scripts/export_timeline.mjs can import it for the soundtrack.
// Beats own their seconds (src/engine/story.ts); the beats, verbs, held years and what is approximate are the brief's
// storyline v1 table (docs/briefs/songkhla.md; approved under the owner's delegation, 15 Nov 2569): hero / port / siege /
// boyang / trade / train / mermaid / grow / show / today. Held years: 2223 (Ayutthaya takes and razes Singora) and 2509 (the
// golden mermaid); the counter lands on 2569. Dato Mogol's landing (2145 or 2153-54) and the independence (2173 or 2185) are
// disputed; the pillar (10 Mar 2385 old count = 2386 today), the railway (1 Jan 2456 old count = 1914), the monthon seat
// (2439), the bridge (2529) and the port (2531) are named in no sub with a year: the counter does not hold them.
// Growth that the counter would jump over is avoided: the year runs continuously from 2373 to 2468 (the track is laid
// 2448-2457 and the station stands by 2456, not before the line opened) and from 2510 to 2569;
// the jumps (2223 -> 2373, 2468 -> 2509) carry nothing that is built.
import {between, type CameraKey} from '../../engine/glide';
import {buildStory} from '../../engine/story';
import {BRIDGE_N, MERMAID, PILLAR, PUPPET_BACK, STAGE} from './places';

type Key = CameraKey;
// [t, target x, y, z, distance, azimuth, elevation, fov]; azimuth from +z (south) toward +x (east)
// the cover: the puppet on the whole tile from the south-south-east, the lake on the left, the Gulf on the right
const C0: Key = [0, -7, 24, -3, 345, 14, 34, 30];
const C1: Key = [2.8, -7, 22, -4, 320, 18, 35, 30];
// port: across the channel from the east, the junks coming in round the spit's tip, Khao Daeng behind the town
const PO_IN: Key = [4.4, -17.5, 1, -32.0, 48, 120, 40, 30];
const PO_END: Key = [8.2, -20.0, 1.2, -29.0, 40, 128, 41, 30];
// siege: the army up the west shore toward the wall, the fleet at the channel; from the east-north-east
const SI_IN: Key = [9.4, -28.0, 1.5, -26.0, 54, 150, 42, 30];
const SI_END: Key = [14.2, -26.0, 1.5, -27.0, 46, 160, 42, 30];
// Bo Yang: from over the lake (west), the wall rising on the shore and the pillar carried in
const BY_IN: Key = [16.5, -1.0, 1, -1.0, 46, 252, 41, 30];
const BY_END: Key = [20.6, -0.4, 1, -0.6, 38, 238, 41, 30];
// trade: the piers on the lake shore, from the south-west over the water
const TR_IN: Key = [21.8, -2.6, 1, -1.0, 32, 228, 41, 30];
const TR_END: Key = [26.6, -2.4, 1, -4.0, 30, 212, 41, 30];
// train: down the spit from the south-east, following the train up to the station
const RA_IN: Key = [28.0, 15.0, 1, 18.0, 50, 150, 40, 30];
const RA_MID: Key = [30.4, 10.5, 1, 8.0, 46, 146, 40, 30];
const RA_END: Key = [31.5, 4.6, 1, -3.0, 38, 140, 40, 30];
const RA_HOLD: Key = [32.6, 4.2, 1, -3.6, 36, 138, 40, 30];
// mermaid: the statue on its rocks, from the sea (north-east), the beach and Khao Tang Kuan behind
const ME_IN: Key = [34.4, MERMAID[0], 1.2, MERMAID[1], 26, 150, 38, 30];
const ME_END: Key = [37.4, MERMAID[0], 1.2, MERMAID[1], 21, 172, 38, 30];
// grow: the whole spit and the far shore, swinging round to show the bridge in the south-west
const GR_IN: Key = [40.4, -12, 1, 0, 180, 10, 37, 30];
const GR_END: Key = [44.8, -22, 1, 6, 228, 30, 37, 30];
// the show: the stage on Samila from the beach's south side, the crowd in front, the giant puppet behind
const SH_IN: Key = [47.8, (STAGE[0] + PUPPET_BACK[0]) / 2, 4.0, (STAGE[1] + PUPPET_BACK[1]) / 2 + 1.0, 62, 196, 36, 30];
const SH_END: Key = [54.0, (STAGE[0] + PUPPET_BACK[0]) / 2, 4.0, (STAGE[1] + PUPPET_BACK[1]) / 2 + 0.6, 52, 206, 36, 30];
// the landing: the whole tile again at the cover's distance, now a city on both shores
const END: Key = [56.4, -7, 22, -4, 330, 18, 35, 30];

export const STORY = buildStory({
  duration: 60,
  standard: 1,
  before: 1600,
  after: 2026,
  camera: [
    ...between(C1, PO_IN, 4),
    ...between(PO_END, SI_IN, 3),
    ...between(SI_END, BY_IN, 4, 0.3),
    ...between(BY_END, TR_IN, 3),
    ...between(TR_END, RA_IN, 3, 0.1),
    ...between(RA_HOLD, ME_IN, 3, 0.1),
    ...between(ME_END, GR_IN, 4, 0.1),
    ...between(GR_END, SH_IN, 4, 0.1),
    ...between(SH_END, END, 4),
    END,
    [60, -7, 22, -4, 340, 24, 35, 30],
  ],
  beats: [
    {
      // the cover (cloud's pick A1, delegated): the giant puppet of Ai Teng cut free on the spit by 2 s, then alive.
      // No counter and no year under the title.
      id: 'hero',
      kind: 'legend',
      t: [0, 3.0],
      year: [1600, 1603],
      camera: [C0, C1],
    },
    {
      // Dato Mogol's people sail from Java and land at Hua Khao Daeng; the port of Singora and Sulaiman's forts (disputed
      // years: none on screen)
      id: 'port',
      kind: 'arrive',
      t: [3.0, 8.5],
      year: [1603, 1679],
      caption: {t0: 3.2, title: 'ตั้งเมืองท่าซิงกอรา', sub: 'ดาโต๊ะโมกอลล่องเรือจากชวา มาขึ้นฝั่งใต้เขาแดง'},
      era: 'อยุธยา',
      camera: [PO_IN, PO_END],
    },
    {
      // 2223 (1680): Narai's army under Phraya Ramdecho, with the southern towns' levies, takes Singora and razes it
      id: 'siege',
      kind: 'fight',
      t: [8.5, 15.0],
      year: {hold: 1680},
      caption: {t0: 8.6, title: 'อยุธยาตีซิงกอราแตก', sub: 'พระนารายณ์ให้รื้อเมือง เหลือแต่ซากป้อม'},
      callouts: [{label: 'ป้อมเมืองซิงกอรา', dx: 130, dy: -160, p: [-23.8, 3.8, -21.6], t0: 12.0, t1: 14.2}],
      camera: [SI_IN, SI_END],
    },
    {
      // Rama III moves the town across to Bo Yang: the stone wall (2379-2385) and the pillar of chaiyaphruek wood (10 Mar
      // 2385 old count): the counter runs 2373-2386 and holds neither
      id: 'boyang',
      kind: 'procession',
      t: [15.0, 21.0],
      year: [1830, 1843],
      caption: {t0: 15.1, title: 'ย้ายเมืองมาฝั่งบ่อยาง', sub: 'ร.3 ให้สร้างกำแพงหิน ฝังเสาหลักเมือง'},
      era: 'รัตนโกสินทร์',
      callouts: [{label: 'ศาลหลักเมือง', dx: 120, dy: -150, p: [PILLAR[0], 1.0, PILLAR[1]], t0: 19.2, t1: 20.8}],
      camera: [BY_IN, BY_END],
    },
    {
      // the port town on the lake: junks at the piers on ถนนนครนอก, Chinese shophouses; the deputy governor's mansion (2421)
      id: 'trade',
      kind: 'trade',
      t: [21.0, 27.0],
      year: [1844, 1904],
      caption: {t0: 21.1, title: 'เมืองท่าค้าขายริมทะเลสาบ', sub: 'ห้องแถวจีนริมถนนนครนอก นครใน'},
      callouts: [{label: 'จวนเจ้าเมือง', dx: -120, dy: -150, p: [-2.4, 1.2, -7.3], t0: 24.2, t1: 26.6}],
      camera: [TR_IN, TR_END],
    },
    {
      // the branch line from Hat Yai (opened 1 Jan 2456 old count, 1914; the junction moved to Hat Yai in 2465): no year
      id: 'train',
      kind: 'arrive',
      t: [27.0, 33.0],
      year: [1905, 1925],
      caption: {t0: 27.1, title: 'รถไฟวิ่งถึงเมืองสงขลา', sub: 'ทางแยกจากหาดใหญ่ ปลายทางริมทะเลสาบ'},
      callouts: [{label: 'สถานีรถไฟสงขลา', dx: 120, dy: -150, p: [4.0, 1.2, -5.2], t0: 31.6, t1: 32.6}],
      camera: [RA_IN, RA_MID, RA_END, RA_HOLD],
    },
    {
      // 1 Apr 2509: the golden mermaid unveiled at Laem Samila
      id: 'mermaid',
      kind: 'build',
      t: [33.0, 38.5],
      year: {hold: 1966},
      caption: {t0: 33.1, title: 'นางเงือกทองที่สมิหลา', sub: 'ประติมากรรมริมหาด สัญลักษณ์ของเมือง'},
      era: 'ปัจจุบัน',
      callouts: [{label: 'นางเงือกทอง', dx: -120, dy: -150, p: [MERMAID[0] + 0.6, 2.4, MERMAID[1] - 0.2], t0: 35.2, t1: 37.4}],
      camera: [ME_IN, ME_END],
    },
    {
      // the grow shot: the spit fills, the far shore builds up, the Tinsulanonda bridge to Ko Yo (2529: named, no year)
      id: 'grow',
      kind: 'grow',
      t: [38.5, 46.0],
      year: [1967, 2015],
      caption: {t0: 38.6, title: 'เมืองโตเต็มแหลม', sub: 'ข้ามไปฝั่งสิงหนคร สะพานติณสูลานนท์ไปเกาะยอ'},
      callouts: [{label: 'สะพานติณสูลานนท์', dx: 120, dy: -150, p: [(BRIDGE_N[0][0] + BRIDGE_N[1][0]) / 2, 1.2, (BRIDGE_N[0][1] + BRIDGE_N[1][1]) / 2], t0: 42.8, t1: 45.6}],
      camera: [GR_IN, GR_END],
    },
    {
      // the payoff: a nang talung show on Samila; the cover's Ai Teng rises behind the stage (the callback)
      id: 'show',
      kind: 'celebrate',
      t: [46.0, 54.4],
      year: [2016, 2025.5],
      caption: {t0: 46.1, t1: 53.8, title: 'หนังตะลุง อ้ายเท่ง', sub: 'ตัวตลกที่สร้างจากชาวบ้านสทิงพระ สงขลาตัวจริง'},
      callouts: [{label: 'อ้ายเท่ง', dx: -130, dy: -160, p: [PUPPET_BACK[0], 9.0, PUPPET_BACK[1]], t0: 48.6, t1: 53.6}],
      camera: [SH_IN, SH_END],
    },
    {id: 'today', kind: 'today', t: [54.6, 56.4], year: [2025.6, 2026]},
  ],
});

export const DURATION = STORY.duration;
export const yearAt = STORY.yearAt;
export const CAPTIONS = STORY.captions;
export const ERAS = STORY.eras;
