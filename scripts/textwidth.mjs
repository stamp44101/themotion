// Width of a line of Kanit text in px, read straight from the @fontsource font
// files (advance widths from cmap + hmtx), so the story check knows whether a
// caption title fits on one line without opening a browser. Kerning is ignored;
// against Chrome's own layout it is within a few px on our titles.
import fs from 'node:fs';
import path from 'node:path';
import zlib from 'node:zlib';

const DIR = path.resolve('node_modules/@fontsource/kanit/files');
const cache = new Map();

// WOFF 1.0 -> {unitsPerEm, advance(codepoint) | undefined}
const loadWoff = (file) => {
  const b = fs.readFileSync(file);
  const n = b.readUInt16BE(12);
  const tables = {};
  for (let i = 0; i < n; i++) {
    const o = 44 + i * 20;
    const tag = b.toString('latin1', o, o + 4);
    const off = b.readUInt32BE(o + 4);
    const comp = b.readUInt32BE(o + 8);
    const orig = b.readUInt32BE(o + 12);
    const raw = b.subarray(off, off + comp);
    tables[tag] = comp < orig ? zlib.inflateSync(raw) : raw;
  }
  const unitsPerEm = tables.head.readUInt16BE(18);
  const nHM = tables.hhea.readUInt16BE(34);
  const hmtx = tables.hmtx;
  const adv = (g) => hmtx.readUInt16BE(Math.min(g, nHM - 1) * 4);

  // cmap: prefer a format 12 subtable, fall back to format 4
  const cmap = tables.cmap;
  const subs = [];
  for (let i = 0; i < cmap.readUInt16BE(2); i++) subs.push(cmap.readUInt32BE(4 + i * 8 + 4));
  const map = new Map();
  for (const so of subs) {
    const fmt = cmap.readUInt16BE(so);
    if (fmt === 12) {
      const ng = cmap.readUInt32BE(so + 12);
      for (let i = 0; i < ng; i++) {
        const g = so + 16 + i * 12;
        const [s, e, id] = [cmap.readUInt32BE(g), cmap.readUInt32BE(g + 4), cmap.readUInt32BE(g + 8)];
        for (let c = s; c <= e; c++) map.set(c, id + c - s);
      }
    } else if (fmt === 4) {
      const seg = cmap.readUInt16BE(so + 6) / 2;
      const ends = so + 14;
      const starts = ends + seg * 2 + 2;
      const deltas = starts + seg * 2;
      const ranges = deltas + seg * 2;
      for (let i = 0; i < seg; i++) {
        const [e, s] = [cmap.readUInt16BE(ends + i * 2), cmap.readUInt16BE(starts + i * 2)];
        const d = cmap.readInt16BE(deltas + i * 2);
        const ro = cmap.readUInt16BE(ranges + i * 2);
        for (let c = s; c <= e && c !== 0xffff; c++) {
          let g;
          if (ro === 0) g = (c + d) & 0xffff;
          else {
            g = cmap.readUInt16BE(ranges + i * 2 + ro + (c - s) * 2);
            if (g) g = (g + d) & 0xffff;
          }
          if (g && !map.has(c)) map.set(c, g);
        }
      }
    }
  }
  return {unitsPerEm, advance: (c) => (map.has(c) ? adv(map.get(c)) : undefined)};
};

const fonts = (weight) => {
  if (!cache.has(weight))
    cache.set(weight, ['thai', 'latin', 'latin-ext'].map((s) => loadWoff(path.join(DIR, `kanit-${s}-${weight}-normal.woff`))));
  return cache.get(weight);
};

/** Width in px of `text` set in Kanit at `px` and `weight` (400 or 600), on one line. */
export const textWidth = (text, px, weight) => {
  let w = 0;
  for (const ch of text) {
    const c = ch === ' ' ? 0x20 : ch.codePointAt(0);
    for (const f of fonts(weight)) {
      const a = f.advance(c);
      if (a !== undefined) {
        w += (a / f.unitsPerEm) * px;
        break;
      }
    }
  }
  return w;
};
