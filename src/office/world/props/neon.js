// The neon sign.
import * as THREE from 'three';
import { scene } from '../../scene/renderer.js';
import { canvasTex, mat, put, rbox } from '../../scene/blocks.js';
import { LAY } from '../layout.js';
import { nightHooks } from './trinkets.js';

let neonTex;
export const neonG = new THREE.Group();
export let neonM;

export function setup() {
  /* neon sign above the library: CTS · SHIP IT in electric blue & cyan gradient */
  neonTex = canvasTex(512, 128, (g) => {
    g.clearRect(0, 0, 512, 128);
    g.font = '900 64px "Be Vietnam Pro", system-ui, sans-serif';
    g.textAlign = 'center'; g.textBaseline = 'middle'; g.lineWidth = 5;
    const grad = g.createLinearGradient(40, 0, 420, 0);
    grad.addColorStop(0, '#60A5FA'); grad.addColorStop(0.5, '#38BDF8'); grad.addColorStop(1, '#22D3EE');
    g.shadowBlur = 24; g.shadowColor = '#0284C7'; g.strokeStyle = '#38BDF8';
    g.strokeText('CTS · SHIP IT', 232, 66);
    g.fillStyle = grad; g.fillText('CTS · SHIP IT', 232, 66);
    g.shadowColor = '#38BDF8'; g.fillStyle = '#E0F2FE'; g.font = '900 58px system-ui, sans-serif';
    g.fillText('✦', 462, 64);
  });
   neonG.position.set(LAY.neon[0], LAY.neon[1], LAY.neon[2]);
   neonG.rotation.y = LAY.neon[3];
   scene.add(neonG);
  put(neonG, rbox(2.7, 0.72, 0.05, mat('#0F172A', { roughness: 0.6 }), 0.03), 0, 0, 0);
  neonM = new THREE.MeshBasicMaterial({ map: neonTex, transparent: true });
  put(neonG, new THREE.Mesh(new THREE.PlaneGeometry(2.6, 0.62), neonM), 0, 0, 0.03);
  nightHooks.push((on) => neonM.color.setScalar(on ? 2.6 : 1.25));
}
