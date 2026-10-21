// Pure data (no React/three) so scripts/export_timeline.mjs can import it for the soundtrack.
// Beats own their seconds (src/engine/story.ts); dates and wording from docs/briefs/phuket.md
// §3a/§3d and phuket_field.md §3 (the Thai-connection pass). Built to the storyline standard
// (docs/storyline.md): the cover's two turtles, Bowrey's elephants in the first beat, the 2328
// siege in the danger zone, one verb per beat, a wide grow shot, and the turtles back at Mai
// Khao before the counter lands on today.
import {buildStory} from '../../engine/story';
import {BATTLE, CHINPRACHA, DREDGE, HEROINES, KATHU, LIPON, MAI_KHAO, SARASIN, STOCKADE} from './places';

export const STORY = buildStory({
  duration: 60,
  standard: 1,
  before: 1500,
  after: 2026,
  // transitions between beats
  camera: [
    [17.8, -10, 1, -26, 90, 10, 37, 30],
    [24.3, -6, 1, -10, 70, 20, 39, 30],
    [30.0, 10, 1, 4, 80, 45, 37, 30],
    [35.5, 0, 1, -28, 110, 10, 36, 30],
    [41.0, -6, 1, -12, 160, 20, 36, 30],
    [47.0, -16, 1, -30, 110, -40, 37, 30],
    [60, -6, 2, -4, 240, 40, 36, 30],
  ],
  beats: [
    {
      // the cover: a leatherback and a green turtle haul out on the west shore at hero scale and
      // dig in before the caption. Then Bowrey's ship anchors in the bay: the Raja's elephants carry
      // its captain up the forest track to Luppoone, while lumps of tin go out to the ship by boat
      id: 'tin',
      kind: 'trade',
      t: [0, 8.6],
      year: {hold: 1675},
      caption: {t0: 3.4, title: 'ขี่ช้างขึ้นเมืองกลางเกาะ', sub: 'ราว พ.ศ. 2218 พ่อค้าอังกฤษบันทึกว่าเจ้าเมืองส่งช้างมารับ ดีบุกออกทางเรือ'},
      era: 'อยุธยา',
      callouts: [{t0: 7.0, t1: 8.5, label: 'ถลาง', dx: -90, dy: -130, p: [LIPON[0], 1.2, LIPON[1]]}],
      camera: [
        [0, -22, 1, -6, 270, -40, 36, 30],
        [3, -22, 1, -8, 230, -36, 36, 30],
        [3.9, -16, 1, -12, 170, -20, 38, 30],
        [4.9, 19, 1, -30, 54, 10, 42, 30],
        [6.7, -1, 1, -31, 62, 4, 42, 30],
        [8.5, -6, 1, -31, 60, 0, 42, 30],
      ],
    },
    {
      // the Burmese army camps on the field west of the town; the townspeople hold the stockade,
      // a column of "soldiers" marches out with flashing blades (the women of the legend), cannon
      // smoke, and the army withdraws north-west to its boats
      id: 'siege',
      kind: 'fight',
      t: [8.8, 17.4],
      year: {hold: 1785},
      caption: {t0: 8.7, title: 'ศึกถลาง พ.ศ. 2328', sub: 'ท้าวเทพกระษัตรี ท้าวศรีสุนทร นำชาวเมืองรับทัพพม่า (ขบวนหญิงแต่งเป็นชายตามตำนาน)'},
      callouts: [{t0: 10.4, t1: 13.4, label: 'ทุ่งถลางชนะศึก', dx: -90, dy: -130, p: [BATTLE[0], 0.8, BATTLE[1]]}],
      camera: [
        [9.0, -15, 1, -33, 62, -14, 36, 30],
        [13.2, -15, 1, -33, 56, 6, 36, 30],
        [17.2, -14, 1, -33, 64, 22, 37, 30],
      ],
    },
    {
      // Hokkien miners at Kathu; the pits spread down คลองบางใหญ่ to the bay and the new town at
      // Thung Kha rises along the canal
      id: 'mines',
      kind: 'arrive',
      t: [18.2, 24.0],
      year: [1849, 1869],
      caption: {t0: 18.0, title: 'ย้ายเมืองมาทุ่งคา', sub: 'สมัยพระยาวิชิตสงคราม เหมืองดีบุกขยายจากกะทู้ตามคลองบางใหญ่'},
      era: 'รัตนโกสินทร์',
      callouts: [{t0: 19.4, t1: 22.0, label: 'กะทู้', dx: -90, dy: -130, p: [KATHU[0], 0.8, KATHU[1]]}],
      camera: [
        [18.4, -13, 1, -17, 56, 14, 38, 30],
        [23.8, -3, 1, -13, 56, 30, 38, 30],
      ],
    },
    {
      // the Sino-European shophouse streets go up a block north of the Chartered corner
      id: 'oldtown',
      kind: 'build',
      t: [24.6, 29.8],
      year: [1901, 1906],
      caption: {t0: 24.4, title: 'ตึกแถวชิโน-ยูโรเปียน', sub: 'ยุคพระยารัษฎาฯ (คอซิมบี้) ถนนถลาง บ้านชินประชา พ.ศ. 2446'},
      callouts: [{t0: 26.4, t1: 29.6, label: 'บ้านชินประชา', dx: -90, dy: -130, p: [CHINPRACHA[0], 1.2, CHINPRACHA[1]]}],
      camera: [
        [24.8, -7, 1, -9, 40, 30, 42, 30],
        [29.6, -7, 1, -9, 36, 6, 42, 30],
      ],
    },
    {
      // the bucket dredge works Tongkah Bay: chain turning, stack smoking, tailings spilling
      id: 'dredge',
      kind: 'trade',
      t: [30.2, 35.2],
      year: {hold: 1909},
      caption: {t0: 30.0, title: 'เรือขุดแร่ในทะเล', sub: 'ลำแรกของโลก พ.ศ. 2452 กัปตันเอ็ดเวิร์ด ไมลส์ อ่าวทุ่งคา'},
      callouts: [{t0: 31.6, t1: 35.0, label: 'อ่าวทุ่งคา', dx: 90, dy: -130, p: [DREDGE[0], 1.0, DREDGE[1]]}],
      camera: [
        [30.4, DREDGE[0] - 2, 1, DREDGE[1], 46, 40, 36, 30],
        [35.0, DREDGE[0] - 2, 1, DREDGE[1], 40, 66, 36, 30],
      ],
    },
    {
      // the first cars cross สะพานสารสิน from the mainland and drive south past the heroines
      id: 'bridge',
      kind: 'arrive',
      t: [35.8, 40.6],
      year: {hold: 1967},
      caption: {t0: 35.6, title: 'สะพานสารสิน', sub: '7 ก.ค. 2510 ถนนเส้นแรกที่ข้ามจากฝั่งพังงาสู่เกาะ'},
      era: 'ปัจจุบัน',
      callouts: [
        {t0: 36.4, t1: 38.6, label: 'สะพานสารสิน', dx: 90, dy: -130, p: [SARASIN[0], 0.8, SARASIN[1]]},
        {t0: 38.8, t1: 40.4, label: 'อนุสาวรีย์วีรสตรี', dx: 90, dy: -130, p: [HEROINES[0], 1.6, HEROINES[1]]},
      ],
      camera: [
        [36.0, -13, 1, -42, 50, -10, 36, 30],
        [40.4, -10, 1, -34, 56, 4, 36, 30],
      ],
    },
    {
      // the wide shot: mining ends, the pits turn to lagoons, the west beaches and the town fill,
      // planes land at Mai Khao, the Big Buddha on its hill
      id: 'growth',
      kind: 'grow',
      t: [41.2, 46.6],
      year: [1973, 2015],
      caption: {t0: 41.0, title: 'เมืองแร่สู่เมืองท่องเที่ยว', sub: 'เหมืองปิด หาดฝั่งตะวันตกกลายเป็นเมือง พระใหญ่บนเขานาคเกิด'},
      camera: [
        [41.4, -8, 1, -8, 170, 30, 37, 30],
        [46.4, -8, 1, -12, 200, -10, 37, 30],
      ],
    },
    {
      // the payoff at Mai Khao: the leatherback mother back to the sea with her hatchlings; a
      // crowd at the waterline lets young green turtles go on Songkran
      id: 'turtles',
      kind: 'celebrate',
      t: [47.2, 53.8],
      year: {hold: 2024},
      caption: {t0: 47.0, title: 'ไม้ขาว บ้านของเต่าทะเล', sub: 'เต่ามะเฟืองยังขึ้นวางไข่ เต่าตนุปล่อยคืนทะเลทุกวันสงกรานต์'},
      callouts: [{t0: 48.4, t1: 51.4, label: 'หาดไม้ขาว', dx: 90, dy: -130, p: [MAI_KHAO[0], 0.6, MAI_KHAO[1]]}],
      camera: [
        [47.4, MAI_KHAO[0] - 4, 1, MAI_KHAO[1] + 6, 62, -62, 38, 30],
        [53.6, MAI_KHAO[0] - 4, 1, MAI_KHAO[1] + 5, 54, -48, 38, 30],
      ],
    },
    {
      // the counter lands on 2569 and holds it before the finale card
      id: 'today',
      kind: 'today',
      t: [54.2, 56.0],
      year: [2025.6, 2026],
    },
  ],
});

export const DURATION = STORY.duration;
export const yearAt = STORY.yearAt;
export const CAPTIONS = STORY.captions;
export const ERAS = STORY.eras;
export const SOUND_EVENTS = {trains: [] as {t0: number; dur: number; dir: number; modern: boolean}[]};
