// Pure data (no React/three) so scripts/export_timeline.mjs can import it for the soundtrack.
// Beats own their seconds (src/engine/story.ts); dates and wording from docs/briefs/phuket.md
// §3a/§3d and phuket_field.md §3 (the Thai-connection pass). Built to the storyline standard
// (docs/storyline.md): the cover's two turtles, Bowrey's elephants in the first beat, the 2328
// siege in the danger zone, one verb per beat, a wide grow shot, and the turtles back at Mai
// Khao before the counter lands on today. 75 s, owner's call; the extra time is all action.
import {buildStory} from '../../engine/story';
import {BATTLE, CHINPRACHA, DREDGE, HEROINES, KATHU, LIPON, MAI_KHAO, SARASIN, STOCKADE} from './places';

export const STORY = buildStory({
  // 75 s (owner, 21 ต.ค. 2569: "เส้นเรื่องดูรีบไปหมด"); the extra 15 s go to the moving beats --
  // the elephants, the siege, the miners, the cars, the payoff -- never to longer holds
  duration: 75,
  standard: 1,
  before: 1500,
  after: 2026,
  // transitions between beats
  camera: [
    [19.9, -10, 1, -26, 90, 10, 37, 30],
    [27.9, -6, 1, -10, 70, 20, 39, 30],
    [35.3, 30, 1, 8, 90, 45, 37, 30],
    [42.2, 14, 1, -26, 130, 20, 40, 30],
    [49.9, -6, 1, -12, 160, 20, 36, 30],
    [57.9, -20, 1, -34, 130, -140, 37, 30],
    [75, -6, 2, -4, 240, -320, 36, 30],
  ],
  beats: [
    {
      // the cover: a leatherback and a green turtle haul out of the Andaman onto the west beach
      // at hero scale and dig in under their own sand. Then Bowrey's ship rides off the north
      // shore: the Raja's elephants carry its captain up the forest track to Luppoone while lumps
      // of tin go out to the ship by boat
      id: 'tin',
      kind: 'trade',
      t: [0, 9.4],
      year: {hold: 1675},
      caption: {t0: 3.4, title: 'ขี่ช้างขึ้นเมืองกลางเกาะ', sub: 'ราว พ.ศ. 2218 พ่อค้าอังกฤษบันทึกว่าเจ้าเมืองส่งช้างมารับ ดีบุกออกทางเรือ'},
      era: 'อยุธยา',
      callouts: [{t0: 8.3, t1: 9.3, label: 'ถลาง', dx: -90, dy: -130, p: [LIPON[0], 1.2, LIPON[1]]}],
      camera: [
        [0, -18, 1, -8, 340, -40, 36, 30],
        [3, -22, 1, -10, 270, -36, 36, 30],
        [3.9, -12, 1, -24, 170, -20, 38, 30],
        [4.9, 6, 1, -46, 56, -6, 40, 30],
        [7.4, 1, 1, -38, 54, 0, 42, 30],
        [9.3, -6, 1, -32, 56, 4, 42, 30],
      ],
    },
    {
      // the Burmese army lands from its boats and camps on the field west of the town; the
      // townspeople hold the stockade, a column with flashing blades marches out (the women of
      // the legend), cannon smoke, and the army withdraws north-west to its boats
      id: 'siege',
      kind: 'fight',
      t: [9.8, 19.6],
      year: {hold: 1785},
      caption: {t0: 9.7, title: 'ศึกถลาง พ.ศ. 2328', sub: 'ท้าวเทพกระษัตรี ท้าวศรีสุนทร นำชาวเมืองรับทัพพม่า (ขบวนหญิงแต่งเป็นชายตามตำนาน)'},
      callouts: [{t0: 11.6, t1: 15.0, label: 'ทุ่งถลางชนะศึก', dx: -90, dy: -130, p: [BATTLE[0], 0.8, BATTLE[1]]}],
      camera: [
        [10.0, -16, 1, -35, 62, -14, 36, 30],
        [14.8, -15, 1, -33, 56, 6, 36, 30],
        [19.4, -14, 1, -33, 64, 22, 37, 30],
      ],
    },
    {
      // Hokkien miners at Kathu; the pits spread down คลองบางใหญ่ to the bay and the new town at
      // Thung Kha rises along the canal
      id: 'mines',
      kind: 'arrive',
      t: [20.2, 27.6],
      year: [1849, 1869],
      caption: {t0: 20.0, title: 'ย้ายเมืองมาทุ่งคา', sub: 'สมัยพระยาวิชิตสงคราม เหมืองดีบุกขยายจากกะทู้ตามคลองบางใหญ่'},
      era: 'รัตนโกสินทร์',
      callouts: [{t0: 21.6, t1: 25.0, label: 'กะทู้', dx: -90, dy: -130, p: [KATHU[0], 0.8, KATHU[1]]}],
      camera: [
        [20.4, -13, 1, -17, 56, 14, 38, 30],
        [27.4, -3, 1, -13, 56, 30, 38, 30],
      ],
    },
    {
      // the Sino-European shophouse streets go up a block north of the Chartered corner
      id: 'oldtown',
      kind: 'build',
      t: [28.2, 35.0],
      year: [1901, 1906],
      caption: {t0: 28.0, title: 'ตึกแถวชิโน-ยูโรเปียน', sub: 'ยุคพระยารัษฎาฯ (คอซิมบี้) ถนนถลาง บ้านชินประชา พ.ศ. 2446'},
      callouts: [{t0: 30.4, t1: 34.8, label: 'บ้านชินประชา', dx: -90, dy: -130, p: [CHINPRACHA[0], 1.2, CHINPRACHA[1]]}],
      camera: [
        [28.4, -7, 1, -9, 40, 30, 42, 30],
        [34.8, -7, 1, -9, 36, 6, 42, 30],
      ],
    },
    {
      // the bucket dredge works Tongkah Bay off the east shore: chain turning, stack smoking
      id: 'dredge',
      kind: 'trade',
      t: [35.6, 41.6],
      year: {hold: 1909},
      caption: {t0: 35.4, title: 'เรือขุดแร่ในทะเล', sub: 'ลำแรกของโลก พ.ศ. 2452 กัปตันเอ็ดเวิร์ด ไมลส์ อ่าวทุ่งคา'},
      callouts: [{t0: 37.0, t1: 41.4, label: 'อ่าวทุ่งคา', dx: -90, dy: -130, p: [DREDGE[0], 1.0, DREDGE[1]]}],
      camera: [
        [35.8, DREDGE[0] - 4, 1, DREDGE[1], 48, 40, 36, 30],
        [41.5, DREDGE[0] - 4, 1, DREDGE[1], 42, 66, 36, 30],
      ],
    },
    {
      // the first cars come over สะพานสารสิน from the mainland and drive south past the heroines
      id: 'bridge',
      kind: 'arrive',
      t: [42.6, 49.6],
      year: {hold: 1967},
      caption: {t0: 42.4, title: 'สะพานสารสิน', sub: '7 ก.ค. 2510 ถนนเส้นแรกที่ข้ามจากฝั่งพังงาสู่เกาะ'},
      era: 'ปัจจุบัน',
      callouts: [
        {t0: 43.4, t1: 46.4, label: 'สะพานสารสิน', dx: 90, dy: -130, p: [SARASIN[0], 0.8, SARASIN[1]]},
      ],
      camera: [
        // tracking the middle car down the bridge and onto the island, the cars in the lower
        // two-thirds of the frame, clear of the caption
        [43.2, -14, 1, -63, 50, -10, 38, 30],
        [46.0, -14, 1, -56, 46, -6, 37, 30],
        [49.4, -13, 1, -48, 48, 0, 37, 30],
      ],
    },
    {
      // the wide shot sweeping round the island: mining ends, the pits turn to lagoons, the
      // town fills, planes land by Mai Khao, the Big Buddha on its hill
      id: 'growth',
      kind: 'grow',
      t: [50.2, 57.6],
      year: [1973, 2015],
      caption: {t0: 50.0, title: 'เมืองแร่สู่เมืองท่องเที่ยว', sub: 'เหมืองปิด หาดฝั่งตะวันตกกลายเป็นเมือง พระใหญ่บนเขานาคเกิด'},
      camera: [
        [50.4, -8, 1, -8, 180, 30, 37, 30],
        [54.0, -8, 1, -10, 200, -40, 37, 30],
        [57.4, -12, 1, -18, 190, -110, 37, 30],
      ],
    },
    {
      // the payoff at Mai Khao on the north shore: the leatherback mother back to the sea with
      // her hatchlings; west along the beach a crowd lets young green turtles go on Songkran
      id: 'turtles',
      kind: 'celebrate',
      t: [58.2, 67.0],
      year: {hold: 2024},
      caption: {t0: 58.0, title: 'ไม้ขาว บ้านของเต่าทะเล', sub: 'เต่ามะเฟืองยังขึ้นวางไข่ เต่าตนุปล่อยคืนทะเลทุกวันสงกรานต์'},
      callouts: [{t0: 59.6, t1: 63.4, label: 'หาดไม้ขาว', dx: 90, dy: -130, p: [MAI_KHAO[0] - 6, 0.6, MAI_KHAO[1]]}],
      camera: [
        [58.4, -29, 1, -45, 72, -160, 42, 30],
        [62.6, -29, 1, -45, 68, -150, 42, 30],
        [66.8, -30, 1, -44, 70, -138, 42, 30],
      ],
    },
    {
      // the counter lands on 2569 and holds it before the finale card
      id: 'today',
      kind: 'today',
      t: [67.4, 70.6],
      year: [2025.6, 2026],
    },
  ],
});

export const DURATION = STORY.duration;
export const yearAt = STORY.yearAt;
export const CAPTIONS = STORY.captions;
export const ERAS = STORY.eras;
export const SOUND_EVENTS = {trains: [] as {t0: number; dur: number; dir: number; modern: boolean}[]};
