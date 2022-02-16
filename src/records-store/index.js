import './style.scss';
import './pumps.scss';

import './pumps.js';
import { frag } from './frag.js';
import GlslCanvas from 'glslCanvas';
import { gsap } from 'gsap';


const canvas = document.querySelector('canvas');
const sandbox = new GlslCanvas(canvas);

const sizer = function () {

  const s = window.innerWidth
  const dpi = window.devicePixelRatio;

  canvas.width = s * dpi;
  canvas.height = s * dpi;
  canvas.style.width = s + 'px';
  canvas.style.height = s + 'px';

}

sizer()

window.addEventListener('resize', sizer);


sandbox.load(frag)
sandbox.setUniform("scroll", 0)

sandbox.setUniform("innerColors",
                   [0.5, 0.5, 0.5, 1.0],
                   [0.977, 0.989, 0.641, 1.0],
                   [0.773, 0.711, 1.000, 1.0],
                  )

sandbox.setUniform("midColors",
                   [0.5, 0.5, 0.5, 1.0],
                   [1.000, 0.713, 0.216, 1.0],
                   [0.730, 0.901, 0.201, 1.0],
                  )

sandbox.setUniform("outerColors",
                   [0.1, 0.1, 0.1, 1.0],
                   [1.000, 0.245, 0.226, 1.0],
                   [0.071, 0.557, 0.300, 1.0],
                  )

window.addEventListener('scroll', function () {
  const pixels = window.pageYOffset;
  const wh = window.innerHeight;

  sandbox.setUniform('scroll',  pixels / wh);
});

document.querySelector('.play').addEventListener('click', function () {

  gsap.to('.needle', {rotate: 10, duration: 2, ease: 'power2.inOut'})
  gsap.to('.container', {opacity:0, duration:1, delay:1})
  gsap.to('.more-info', {opacity:1, duration:1, delay:1, x:100})
  sandbox.setUniform("midColors",
                   [0.619, 0.01, 0.839, 1.0],
                   [1.000, 0.245, 0.226, 1.0],
                   [0.071, 0.557, 0.300, 1.0],
                  )
  sandbox.setUniform("innerColors",
                  [0.619, 0.45, 0.001, 1.0],
                  [1.000, 0.245, 0.226, 1.0],
                  [0.071, 0.557, 0.300, 1.0],
                 )
})



