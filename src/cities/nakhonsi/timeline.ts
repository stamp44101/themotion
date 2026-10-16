// Pure data (no React/three) so scripts/export_timeline.mjs can import it for the soundtrack.
// The story is a list of beats (src/engine/story.ts): each owns its seconds on the 75 s clip
// and the years it covers; the year curve, captions, eras, callouts and camera keys are
// derived from them, and the landmarks move on beat progress. Dates and wording from
// docs/briefs/nakhonsi.md §3. 75 s, not 60: the extra time went only to beats with
// something happening on screen (the siege, the procession, the Gulf junks, the grown
// city and the night finale), never to holds or text.
import {buildStory} from '../../engine/story';
import {CHEDI, HO_PHRA_ISUAN, LANDING, NORTH_GATE} from './Landmarks';

export const STORY = buildStory({
  duration: 75,
  before: 300,
  after: 2026,
  // transitions between beats
  camera: [
    [22.4, CHEDI[0], 2.5, CHEDI[1], 52, 290, 32, 30],
    [49.26, 2, 1, 4, 155, 480, 38, 30],
    [75, CHEDI[0], 2, CHEDI[1] - 4, 125, 590, 35, 30],
  ],
  beats: [
    {
      // the relic boat sails in from the Gulf and comes ashore; the first stupa rises
      id: 'legend',
      t: [0, 9],
      year: [300, 820],
      caption: {t0: 3.43, title: 'ตามตำนานพระบรมธาตุ', sub: 'เจ้าชายทนทกุมารกับนางเหมชาลา ลอยเรืออัญเชิญพระทันตธาตุจากลังกา มาขึ้นฝั่งที่หาดทรายแก้ว'},
      era: 'ตามพรลิงค์',
      callouts: [{t0: 5.89, label: 'พระบรมธาตุเจดีย์', dx: 90, dy: -120, p: [CHEDI[0], 2.4, CHEDI[1]]}],
      camera: [
        [0, 44, 1, -12, 34, 100, 28, 30],
        [3.21, LANDING[0] - 4, 1, LANDING[1], 52, 100, 30, 30],
        [6.96, CHEDI[0], 2, CHEDI[1], 58, 115, 30, 30],
      ],
    },
    {
      // Tambralinga's embassy to the Song court; junks in the Gulf
      id: 'trade',
      t: [10.15, 15.35],
      year: {hold: 1001},
      caption: {t0: 9.5, t1: 16, title: 'เมืองท่าตามพรลิงค์', sub: 'เมืองท่าบนเส้นทางการค้าทางทะเล ส่งทูตไปราชสำนักซ่ง ราว พ.ศ. 1544'},
      callouts: [{t0: 10.8, label: 'อ่าวไทย', dx: 80, dy: 110, p: [42, 0, 0]}],
      camera: [
        [10.15, 36, 1, 2, 80, 112, 34, 30],
        [15.35, 32, 1, -2, 82, 140, 34, 30],
      ],
    },
    {
      // the Lanka bell rebuilt over the old stupa (attributed, 13th c.), Chandrabhanu's reign
      id: 'lanka',
      t: [16.5, 21.5],
      year: [1120, 1240],
      caption: {t1: 21.6, title: 'เจดีย์ทรงลังกา', sub: 'ราวพุทธศตวรรษที่ 18 ยุคพระเจ้าจันทรภาณุ สันนิษฐานว่าสร้างครอบองค์เดิม'},
      era: 'ศรีธรรมราช',
      camera: [
        [17.5, CHEDI[0], 2.5, CHEDI[1], 48, 230, 32, 30],
        [20.5, CHEDI[0], 2.5, CHEDI[1], 48, 255, 32, 30],
      ],
    },
    {
      // walls redesigned under King Narai, 1685-88
      id: 'walls',
      t: [23.83, 27.48],
      year: [1684, 1689],
      caption: {t0: 23.2, t1: 28, title: 'กำแพงสมัยพระนารายณ์', sub: 'ช่างฝรั่งเศสออกแบบปรับปรุงกำแพงอิฐและป้อม'},
      era: 'อยุธยา',
      callouts: [{t0: 24.87, t1: 27.79, label: 'ประตูชัยเหนือ', dx: -90, dy: -130, p: [NORTH_GATE[0], 1.5, NORTH_GATE[1]]}],
      camera: [
        [24.35, 0, 1, -2, 110, 330, 38, 30],
        [27.48, NORTH_GATE[0], 1, NORTH_GATE[1] + 2, 55, 370, 34, 30],
      ],
    },
    {
      // Chao Nakhon's independent ชุมนุม after the fall of Ayutthaya
      id: 'chaonakhon',
      t: [29.05, 31.55],
      year: {hold: 1767},
      caption: {t0: 28.6, t1: 32, title: 'ชุมนุมเจ้านคร', sub: 'พ.ศ. 2310 กรุงศรีอยุธยาแตก เจ้านครตั้งตนเป็นอิสระ'},
      era: 'ธนบุรี',
      callouts: [{t0: 29.73, t1: 32, label: 'หอพระอิศวร', dx: -100, dy: -120, p: [HO_PHRA_ISUAN[0], 0.8, HO_PHRA_ISUAN[1]]}],
      camera: [[29.62, 0, 1, -8, 80, 400, 36, 30]],
    },
    {
      // Taksin's army marches in, clashes at the north gate, the town falls, the army enters
      id: 'siege',
      t: [32.2, 39.35],
      year: {hold: 1769},
      caption: {t1: 39.5, title: 'พระเจ้าตากตีเมืองนคร', sub: 'พ.ศ. 2312 ทัพกรุงธนบุรียกมาปราบ รวมหัวเมืองใต้กลับคืน'},
      callouts: [{t0: 33.42, t1: 36.46, label: 'ทัพกรุงธนบุรี', dx: 90, dy: -120, p: [-0.5, 0.8, -19]}],
      camera: [
        [32.5, -0.5, 1, -17, 62, 420, 36, 30],
        [39.04, -0.5, 1, -15, 58, 445, 36, 30],
      ],
    },
    {
      // the railway branch opens 1 Oct 1914: the first train pulls in to the Tha Wang terminus
      id: 'railway',
      t: [41.6, 44.9],
      year: [1914.2, 1914.4],
      caption: {t0: 41.3, t1: 45.5, title: 'รถไฟมาถึงนคร', sub: 'ทางแยกเขาชุมทอง–นครศรีธรรมราช เปิดเดินรถ 1 ตุลาคม พ.ศ. 2457'},
      era: 'ปัจจุบัน',
      callouts: [{t0: 43.8, t1: 45.5, label: 'สถานีรถไฟนครศรีธรรมราช', dx: 80, dy: -130, p: [-8.9, 1.2, -31.4]}],
      camera: [
        [41.3, -11, 1, 26, 55, 455, 34, 30],
        [42.6, -11, 1, 2, 55, 450, 34, 30],
        [43.5, -10, 1, -20, 55, 444, 34, 30],
        [45.63, -9, 1, -30, 60, 446, 35, 30],
      ],
    },
    {
      // 22 Nov 1988 mudslides at Kathun / Khiriwong
      id: 'mudslide',
      t: [50.5, 54],
      year: [1988.1, 1988.4],
      caption: {t0: 50.3, t1: 54.2, title: 'ดินโคลนถล่มเขาหลวง', sub: '22 พฤศจิกายน พ.ศ. 2531 ที่กะทูนและคีรีวง นำไปสู่การปิดป่าสัมปทานทั่วประเทศ'},
      callouts: [{t0: 50.8, label: 'เขาหลวง', dx: 80, dy: -110, p: [-45, 19.4, -4]}],
      camera: [
        [50.8, -36, 8, -4, 120, 495, 32, 30],
        [53.8, -36, 8, -4, 115, 505, 32, 30],
      ],
    },
    {
      // แห่ผ้าขึ้นธาตุ: the procession carries the cloth down the town to the chedi
      id: 'procession',
      t: [56.89, 64],
      year: [2017, 2023],
      caption: {t0: 55, title: 'แห่ผ้าขึ้นธาตุ', sub: 'ทุกวันมาฆบูชา ผู้คนเทินผ้าพระบฏเวียนรอบองค์พระธาตุแล้วนำขึ้นห่ม'},
      callouts: [{t1: 63.53, label: 'วัดพระมหาธาตุวรมหาวิหาร', dx: 90, dy: -120, p: [CHEDI[0], 5.5, CHEDI[1]]}],
      camera: [
        [55.71, 0.5, 1, 2, 48, 525, 38, 30],
        [64, CHEDI[0], 2, CHEDI[1], 50, 560, 34, 30],
      ],
    },
    {
      // World Heritage, 2026 (whc.unesco.org gives the year only)
      id: 'heritage',
      t: [66.21, 71],
      year: [2025.55, 2026],
      caption: {t0: 64.3, title: 'มรดกโลก', sub: 'วัดพระมหาธาตุวรมหาวิหาร แห่งแรกของภาคใต้ ขึ้นทะเบียน พ.ศ. 2569'},
      camera: [[71, CHEDI[0], 2.5, CHEDI[1], 95, 575, 34, 30]],
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
  trains: [{t0: rail0 - 0.3, dur: rail1 - rail0 + 0.1, dir: 1, modern: false}] as {t0: number; dur: number; dir: number; modern: boolean}[],
};
