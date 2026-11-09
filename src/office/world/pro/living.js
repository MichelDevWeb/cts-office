// CTS Office — Living Quarters & IT Wellness Suite (vừa là văn phòng làm việc vừa là nơi ở cho đội ngũ IT):
//   1. Sleep Pods / Bedroom Suite (x: 5.05 → 8.5, z: 5.15 → 8.85): two modern double-deck sleep pods with memory-foam
//      mattresses, CTS blue duvets, privacy curtains, warm reading LEDs, a nightstand and a personal wardrobe/locker unit.
//   2. Shower & Laundry Corner (inside the restroom wing, x: -5.5 → -3.8, z: 7.2 → 8.85): a frosted-glass shower cabin
//      with rainfall showerhead, a front-load washer-dryer with spinning drum window, and folded towels.
//   3. IT Fitness / Gym Corner (in the lounge, x: 8.85 → 9.8, z: 2.2 → 3.5): a blue yoga/stretch mat, foam roller and
//      a two-tier dumbbell rack for developers to stretch between coding sprints.
//   4. 24/7 IT Energy Station (in the pantry, x: 13.52, z: -6.45): a glass-door energy drink & cold-brew cooler lit in
//      cyan LED with midnight cup-noodle stacks on top.
import * as THREE from 'three';
import { PRO } from '../../core/env.js';
import { scene } from '../../scene/renderer.js';
import { cyl, mat, put, rbox, rug } from '../../scene/blocks.js';
import { metal, potPlant, woodDark, woodMid } from '../terrace.js';
import { nightHooks } from '../props/trinkets.js';
import { PRO_FX, floorZone, glassWall, lowWall, plateTex, speckTex } from './pieces.js';
import { t as tr } from '../../../i18n/index.js';

export const LIVING_FX = { pods: [], washerDrum: null, showerLight: null };

function buildSleepPod(x, z, ry = 0) {
  const pod = new THREE.Group();
  pod.position.set(x, 0, z);
  pod.rotation.y = ry;
  scene.add(pod);

  const shellM = mat('#1E293B', { roughness: 0.55 });
  const trimM = mat('#38BDF8', { roughness: 0.35, metalness: 0.2 });
  const sheetM = mat('#F8FAFC', { roughness: 0.85 });
  const duvetM = mat('#2563EB', { roughness: 0.82 });
  const pillowM = mat('#E0F2FE', { roughness: 0.78 });
  const curtainM = mat('#334155', { roughness: 0.9, side: THREE.DoubleSide });

  const W = 1.92, D = 0.98, H = 2.08;
  // outer frame: back wall, two side panels, roof
  put(pod, rbox(W, H, 0.06, shellM, 0.02), 0, H / 2, -D / 2 + 0.03);
  for (const sx of [-1, 1]) {
    put(pod, rbox(0.06, H, D, shellM, 0.02), sx * (W / 2 - 0.03), H / 2, 0);
    // glowing blue accent strip along the front posts
    put(pod, rbox(0.02, H - 0.12, 0.02, trimM, 0.005), sx * (W / 2 - 0.03), H / 2, D / 2);
  }
  put(pod, rbox(W, 0.07, D, shellM, 0.02), 0, H - 0.035, 0);

  // two bunks: lower (y = 0.28) and upper (y = 1.18)
  for (const [k, by] of [[0, 0.28], [1, 1.18]]) {
    put(pod, rbox(W - 0.08, 0.08, D - 0.06, woodMid, 0.02), 0, by, 0);                        // bed base
    put(pod, rbox(W - 0.14, 0.12, D - 0.12, sheetM, 0.04), 0, by + 0.09, 0);                  // mattress
    put(pod, rbox((W - 0.18) * 0.66, 0.135, D - 0.14, duvetM, 0.045), 0.24, by + 0.1, 0);     // CTS blue duvet
    put(pod, rbox(0.34, 0.09, 0.56, pillowM, 0.04), -0.62, by + 0.17, 0).rotation.z = -0.12;  // pillow
    // warm reading LED strip inside the pod head
    const ledM = new THREE.MeshBasicMaterial({ color: '#7DD3FC' });
    put(pod, rbox(0.02, 0.03, 0.55, ledM, 0.005), -W / 2 + 0.08, by + 0.52, 0);
    // half-drawn privacy curtain on the front rail
    put(pod, rbox(0.55, 0.72, 0.02, curtainM, 0.01), -W / 2 + 0.34, by + 0.45, D / 2 - 0.02);
    // safety rail for the upper bunk
    if (k === 1) put(pod, rbox(0.85, 0.18, 0.025, metal, 0.008), 0.35, by + 0.2, D / 2 - 0.02);
  }

  // side ladder on the right front corner
  for (const sx of [0.68, 0.88]) put(pod, cyl(0.014, 0.014, 1.35, metal, 8), sx, 0.72, D / 2 + 0.02);
  for (let r = 0; r < 4; r++) put(pod, cyl(0.012, 0.012, 0.2, metal, 8), 0.78, 0.28 + r * 0.3, D / 2 + 0.02).rotation.z = Math.PI / 2;

  LIVING_FX.pods.push(pod);
}

function buildLivingQuarters() {
  /* ---------- 1. Sleep Pods / Co-Living Bedroom Suite (x: 5.05 → 8.5, z: 5.15 → 8.85) ---------- */
  floorZone(5.05, 8.55, 5.15, 8.95, speckTex('#24344D', 3000, 0.05), 0.8);
  rug(6.8, 7.05, 2.7, 3.0, '#1E3A8A');
  // Frosted glass partition on the north side (z = 5.15) with a doorway at x = 6.95 → 7.95 (along the R3-R4 aisle)
  glassWall(5.05, 5.15, 8.58, 5.15, [[1.85, 2.85]]);
  // Low partition wall on the west side (x = 5.05) separating Pod 2 from the quiet bedroom
  lowWall(5.05, 5.15, 5.05, 8.95, [], 1.35, mat('#1E293B', { roughness: 0.75 }));

  // Door plaque: SLEEP PODS · PHÒNG NGỦ IT
  {
    const m = new THREE.Mesh(
      new THREE.PlaneGeometry(0.76, 0.22),
      new THREE.MeshBasicMaterial({
        map: plateTex(tr('world.plaque.bedroom') || 'SLEEP PODS', tr('world.plaque.bedroomSub') || 'IT Co-Living', {
          bg: '#0F2342', fg: '#E0F2FE', sub: '#38BDF8',
        }),
        polygonOffset: true, polygonOffsetFactor: -2, polygonOffsetUnits: -2,
      })
    );
    m.position.set(6.0, 1.62, 5.11);
    m.rotation.y = Math.PI;
    scene.add(m);
    PRO_FX.plaques.push(m);
  }

  // Two double-deck Sleep Pods along the west wall of the bedroom, facing east (into the room)
  buildSleepPod(5.65, 6.22, Math.PI / 2);
  buildSleepPod(5.65, 8.05, Math.PI / 2);

  // Personal Wardrobe & IT Lockers against the south/east corner (x: 8.15, z: 7.95)
  {
    const wd = new THREE.Group();
    wd.position.set(8.15, 0, 8.2);
    wd.rotation.y = -Math.PI / 2;
    scene.add(wd);
    put(wd, rbox(1.15, 1.85, 0.48, mat('#1E293B', { roughness: 0.5 }), 0.03), 0, 0.925, 0);
    for (const sx of [-0.28, 0.28]) {
      put(wd, rbox(0.52, 1.74, 0.02, mat('#334155', { roughness: 0.55 }), 0.015), sx, 0.93, 0.245);
      put(wd, rbox(0.025, 0.24, 0.03, metal, 0.006), sx * 0.35, 1.0, 0.26);
    }
    // folded hoodies on top of the locker
    put(wd, rbox(0.32, 0.08, 0.26, mat('#2563EB', { roughness: 0.85 }), 0.02), -0.25, 1.89, 0);
    put(wd, rbox(0.32, 0.07, 0.26, mat('#06B6D4', { roughness: 0.85 }), 0.02), -0.25, 1.96, 0);
  }

  // Nightstand with ambient blue lamp between the two sleep pods
  {
    const ns = new THREE.Group();
    ns.position.set(5.45, 0, 7.14);
    scene.add(ns);
    put(ns, rbox(0.38, 0.52, 0.38, woodDark, 0.02), 0, 0.26, 0);
    put(ns, cyl(0.06, 0.08, 0.03, metal, 12), 0, 0.535, 0);
    const glow = new THREE.MeshBasicMaterial({ color: '#38BDF8' });
    put(ns, cyl(0.07, 0.09, 0.18, glow, 14), 0, 0.64, 0);
    nightHooks.push((on) => glow.color.set(on ? '#38BDF8' : '#BAE6FD'));
  }
  potPlant(8.25, 5.55, 0.42, 'monstera');

  /* ---------- 2. Shower Cabin & Laundry Station (inside Restroom wing, x: -5.4 → -3.85, z: 7.4 → 8.85) ---------- */
  {
    // Frosted glass shower stall at (-4.18, 8.32)
    const sh = new THREE.Group();
    sh.position.set(-4.18, 0, 8.32);
    scene.add(sh);
    put(sh, rbox(0.92, 0.06, 0.92, mat('#E2E8F0', { roughness: 0.35 }), 0.02), 0, 0.03, 0); // shower tray
    const glassM = new THREE.MeshStandardMaterial({ color: '#BAE6FD', transparent: true, opacity: 0.28, roughness: 0.1, metalness: 0.25, depthWrite: false });
    put(sh, new THREE.Mesh(new THREE.BoxGeometry(0.03, 1.95, 0.88), glassM), -0.44, 1.0, 0);
    put(sh, new THREE.Mesh(new THREE.BoxGeometry(0.88, 1.95, 0.03), glassM), 0, 1.0, -0.44);
    put(sh, rbox(0.04, 1.98, 0.04, metal, 0.008), -0.44, 1.0, -0.44);
    // Rainfall showerhead & riser pipe
    put(sh, cyl(0.012, 0.012, 1.65, metal, 8), 0.32, 1.05, 0.32);
    put(sh, cyl(0.11, 0.11, 0.025, metal, 16), 0.18, 1.88, 0.18);

    // Front-load Washer-Dryer combo & Towel shelf at (-5.12, 8.42)
    const wm = new THREE.Group();
    wm.position.set(-5.12, 0, 8.42);
    wm.rotation.y = Math.PI;
    scene.add(wm);
    put(wm, rbox(0.68, 0.88, 0.62, mat('#F1F5F9', { roughness: 0.35 }), 0.04), 0, 0.44, 0);
    put(wm, rbox(0.64, 0.12, 0.02, mat('#1E293B', { roughness: 0.4 }), 0.01), 0, 0.78, 0.31); // control panel
    put(wm, cyl(0.022, 0.022, 0.02, '#38BDF8', 12), 0.18, 0.78, 0.32).rotation.x = Math.PI / 2;
    // round drum door
    const drum = new THREE.Mesh(new THREE.CylinderGeometry(0.21, 0.21, 0.04, 24), mat('#0F172A', { metalness: 0.5, roughness: 0.2 }));
    drum.rotation.x = Math.PI / 2; drum.position.set(0, 0.42, 0.31); wm.add(drum);
    const water = new THREE.Mesh(new THREE.CircleGeometry(0.16, 20), new THREE.MeshBasicMaterial({ color: '#38BDF8' }));
    water.position.set(0, 0.42, 0.332); wm.add(water);
    // Clean folded towels stacked on top of the washer
    put(wm, rbox(0.36, 0.06, 0.32, mat('#38BDF8', { roughness: 0.85 }), 0.02), -0.1, 0.91, 0);
    put(wm, rbox(0.36, 0.06, 0.32, mat('#E0F2FE', { roughness: 0.85 }), 0.02), -0.1, 0.97, 0);
  }

  /* ---------- 3. IT Fitness / Stretch Corner (in the Lounge, x: 9.25, z: 2.65) ---------- */
  {
    const gym = new THREE.Group();
    gym.position.set(9.25, 0, 2.65);
    scene.add(gym);
    // Yoga / Exercise Mat in CTS Blue Gradient tones
    put(gym, rbox(0.68, 0.018, 1.55, mat('#0284C7', { roughness: 0.75 }), 0.008), 0, 0.012, 0);
    put(gym, rbox(0.58, 0.02, 1.45, mat('#38BDF8', { roughness: 0.8 }), 0.006), 0, 0.016, 0);
    // Foam roller at one end
    const roller = cyl(0.065, 0.065, 0.46, mat('#1E3A8A', { roughness: 0.6 }), 16);
    roller.rotation.z = Math.PI / 2; roller.position.set(0, 0.075, -0.58); gym.add(roller);
    // Compact Dumbbell Rack beside the mat
    const rack = new THREE.Group();
    rack.position.set(-0.42, 0, 0.45);
    gym.add(rack);
    put(rack, rbox(0.28, 0.46, 0.42, mat('#1E293B', { roughness: 0.5 }), 0.02), 0, 0.23, 0);
    for (const [y, r] of [[0.24, 0.045], [0.42, 0.055]]) {
      for (const dz of [-0.1, 0.1]) {
        put(rack, cyl(0.014, 0.014, 0.22, metal, 8), 0, y, dz).rotation.z = Math.PI / 2;
        for (const sx of [-0.09, 0.09]) put(rack, cyl(r, r, 0.035, mat('#0F172A', { roughness: 0.4 }), 12), sx, y, dz).rotation.z = Math.PI / 2;
      }
    }
  }

  /* ---------- 4. 24/7 IT Energy Drink & Midnight Ramen Cooler (Pantry, x: 13.52, z: -6.45) ---------- */
  {
    const ef = new THREE.Group();
    ef.position.set(13.52, 0, -6.45);
    ef.rotation.y = -Math.PI / 2;
    scene.add(ef);
    put(ef, rbox(0.68, 1.62, 0.64, mat('#0F172A', { roughness: 0.35, metalness: 0.3 }), 0.04), 0, 0.81, 0);
    // Illuminated cyan interior
    const inner = new THREE.MeshBasicMaterial({ color: '#0284C7' });
    put(ef, new THREE.Mesh(new THREE.PlaneGeometry(0.56, 1.36), inner), 0, 0.84, 0.322);
    // Shelves with colourful energy drink cans
    for (const [sy, col] of [[0.42, '#38BDF8'], [0.72, '#22D3EE'], [1.02, '#60A5FA'], [1.3, '#3DDC84']]) {
      put(ef, rbox(0.54, 0.018, 0.04, metal, 0.004), 0, sy, 0.31);
      for (let c = -2; c <= 2; c++) put(ef, cyl(0.028, 0.028, 0.11, mat(col, { metalness: 0.4, roughness: 0.25 }), 10), c * 0.095, sy + 0.065, 0.3);
    }
    // Midnight cup-ramen stack on top of the energy fridge
    for (const [dx, dz, col] of [[-0.14, 0, '#EF4444'], [0.04, 0.04, '#F59E0B'], [-0.05, -0.06, '#3B82F6']]) {
      put(ef, cyl(0.055, 0.042, 0.11, mat(col, { roughness: 0.6 }), 12), dx, 1.675, dz);
      put(ef, cyl(0.058, 0.058, 0.012, '#F8FAFC', 12), dx, 1.73, dz);
    }
  }
}

export function setup() {
  if (PRO) buildLivingQuarters();
}
