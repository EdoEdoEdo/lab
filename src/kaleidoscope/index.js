import './style.scss';
import { frag } from './frag.js';

import GlslCanvas from 'glslCanvas';

var canvas = document.querySelector("canvas");
var sandbox = new GlslCanvas(canvas);

const calcSize = function () {
  let ww = window.innerWidth;
  let wh = window.innerHeight;
  let dpi = window.devicePixelRatio;

  let s = Math.max(wh, ww + 200);

  canvas.width = s * dpi;
  canvas.height = s * dpi;
  canvas.style.width = s + "px";
  canvas.style.height = s + "px";
}

calcSize()

window.addEventListener("resize", calcSize);

sandbox.load(frag);

const images = ['trails.jpg', 'flowers.jpg', 'light.jpg']
let current = 0;

canvas.addEventListener("click", function () {
  current = (current + 1) % images.length;
  sandbox.setUniform('trails', `textures/${images[current]}`);
});

sandbox.setUniform('trails', `textures/${images[current]}`);
