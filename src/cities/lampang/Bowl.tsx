import React, {useMemo} from 'react';
import * as THREE from 'three';

// ชามตราไก่: white porcelain on a foot ring, flaring to the rim, painted round the outside
// with the cockerel (red-orange body, black sickle tail, red comb), a banana plant and a pink
// peony -- the motif twice round the bowl. The painting is a canvas texture wrapped on the
// outer wall, so it reads from the side; the first version was a plain white cup with a red band.
const OUTER: [number, number][] = [
  [0, 0], [0.3, 0], [0.32, 0.06], [0.38, 0.09], [0.5, 0.16], [0.62, 0.26], [0.72, 0.37],
  [0.8, 0.48], [0.87, 0.59], [0.92, 0.69], [0.95, 0.76],
];
const INNER: [number, number][] = [[0, 0.1], [0.36, 0.13], [0.6, 0.3], [0.78, 0.5], [0.9, 0.7], [0.94, 0.76]];

const paint = () => {
  const W = 1024;
  const H = 256;
  const c = document.createElement('canvas');
  c.width = W;
  c.height = H;
  const g = c.getContext('2d')!;
  g.fillStyle = '#f7f4ec';
  g.fillRect(0, 0, W, H);
  // canvas top = rim (the texture is flipped onto v), the bottom third is the plain foot
  g.fillStyle = '#d9d2c4';
  g.fillRect(0, 0, W, 6);
  const motif = (ox: number) => {
    // banana plant: a trunk and broad leaves
    g.strokeStyle = '#2f7a3a';
    g.fillStyle = '#3f9a48';
    g.lineWidth = 7;
    g.beginPath();
    g.moveTo(ox + 300, 200);
    g.lineTo(ox + 305, 60);
    g.stroke();
    for (const [a, l] of [[-2.4, 90], [-0.7, 95], [-2.0, 70], [-1.1, 75], [-1.6, 60]]) {
      g.save();
      g.translate(ox + 305, 80 + (l - 60));
      g.rotate(a);
      g.beginPath();
      g.ellipse(l / 2, 0, l / 2, 13, 0, 0, Math.PI * 2);
      g.fill();
      g.restore();
    }
    // peony: pink petals round a red heart, two leaves
    g.fillStyle = '#3f9a48';
    g.beginPath();
    g.ellipse(ox + 440, 175, 30, 10, -0.4, 0, Math.PI * 2);
    g.ellipse(ox + 470, 180, 26, 9, 0.5, 0, Math.PI * 2);
    g.fill();
    for (let i = 0; i < 7; i++) {
      const a = (i / 7) * Math.PI * 2;
      g.fillStyle = i % 2 ? '#f08aa8' : '#e8607e';
      g.beginPath();
      g.arc(ox + 455 + Math.cos(a) * 18, 150 + Math.sin(a) * 16, 17, 0, Math.PI * 2);
      g.fill();
    }
    g.fillStyle = '#c8283a';
    g.beginPath();
    g.arc(ox + 455, 150, 11, 0, Math.PI * 2);
    g.fill();
    // the cockerel, facing right: legs, body, black sickle tail, neck, head, comb, wattle, beak
    const cx = ox + 140;
    const cy = 150;
    g.strokeStyle = '#d9a42a';
    g.lineWidth = 6;
    g.beginPath();
    g.moveTo(cx - 8, cy + 30);
    g.lineTo(cx - 14, cy + 62);
    g.moveTo(cx + 14, cy + 30);
    g.lineTo(cx + 18, cy + 62);
    g.stroke();
    g.strokeStyle = '#1c1a1a';
    g.lineWidth = 9;
    // sickle tail feathers rising from the body's back and curling over
    g.lineCap = 'round';
    for (let i = 0; i < 4; i++) {
      g.beginPath();
      g.moveTo(cx - 30, cy + 4);
      g.quadraticCurveTo(cx - 70 - i * 8, cy - 90 + i * 14, cx - 105 + i * 10, cy + 6 + i * 8);
      g.stroke();
    }
    g.fillStyle = '#e0482a';
    g.beginPath();
    g.ellipse(cx, cy + 8, 52, 34, -0.15, 0, Math.PI * 2);
    g.fill();
    g.fillStyle = '#1c1a1a';
    g.beginPath();
    g.ellipse(cx + 4, cy + 18, 34, 16, -0.2, 0, Math.PI * 2);
    g.fill();
    g.fillStyle = '#f08a2a';
    g.beginPath();
    g.ellipse(cx + 40, cy - 22, 20, 30, 0.35, 0, Math.PI * 2);
    g.fill();
    g.beginPath();
    g.arc(cx + 52, cy - 52, 16, 0, Math.PI * 2);
    g.fill();
    g.fillStyle = '#d42020';
    for (let i = 0; i < 4; i++) {
      g.beginPath();
      g.arc(cx + 42 + i * 7, cy - 68 - (i % 2) * 4, 7, 0, Math.PI * 2);
      g.fill();
    }
    g.beginPath();
    g.ellipse(cx + 62, cy - 34, 6, 10, 0, 0, Math.PI * 2);
    g.fill();
    g.fillStyle = '#e8b030';
    g.beginPath();
    g.moveTo(cx + 66, cy - 56);
    g.lineTo(cx + 82, cy - 50);
    g.lineTo(cx + 66, cy - 46);
    g.fill();
    g.fillStyle = '#111';
    g.beginPath();
    g.arc(cx + 56, cy - 55, 3, 0, Math.PI * 2);
    g.fill();
  };
  // the visible part of the wall is its upper half: lift the motif toward the rim
  g.translate(0, -38);
  motif(0);
  motif(W / 2);
  const tex = new THREE.CanvasTexture(c);
  tex.colorSpace = THREE.SRGBColorSpace;
  tex.anisotropy = 4;
  return tex;
};

export const RoosterBowl: React.FC = () => {
  const outer = useMemo(() => new THREE.LatheGeometry(OUTER.map(([r, y]) => new THREE.Vector2(r, y)), 40), []);
  const inner = useMemo(() => new THREE.LatheGeometry(INNER.map(([r, y]) => new THREE.Vector2(r, y)), 40), []);
  const tex = useMemo(paint, []);
  return (
    <group>
      <mesh geometry={outer} castShadow receiveShadow>
        <meshStandardMaterial map={tex} roughness={0.25} metalness={0} />
      </mesh>
      <mesh geometry={inner}>
        <meshStandardMaterial color="#f7f4ec" roughness={0.2} side={THREE.BackSide} />
      </mesh>
    </group>
  );
};
