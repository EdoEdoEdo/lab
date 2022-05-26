import './style.scss';
import { Renderer, Program, Color, Mesh, Triangle, Plane } from 'ogl';

const vertex = /* glsl */ `
  attribute vec2 uv;
  attribute vec2 position;
  varying vec2 vUv;
  void main() {
    vUv = uv;
    gl_Position = vec4(position, 0, 1);
  }
`;

const fragment = /* glsl */ `
  precision highp float;
  uniform float uTime;
  uniform vec3 uColor;
  varying vec2 vUv;
  void main() {
    gl_FragColor.rgb = 0.5 + 0.3 * cos(vUv.xyx + uTime) + uColor;
    gl_FragColor.a = 1.0;
  }
`;

const renderer = new Renderer();
const gl = renderer.gl;
document.body.appendChild(gl.canvas);
gl.clearColor(1, 1, 1, 1);

function resize() {
    renderer.setSize(window.innerWidth, window.innerHeight);
}
window.addEventListener('resize', resize, false);
resize();

const program = new Program(gl, {
    vertex,
    fragment,
    uniforms: {
      uTime: {value: 0},
      uColor: {value: new Color(0.3, 0.3, 0.5)}
    }
})

// const geometry = new Plane(gl, {width: window.innerWidth, height: window.innerHeight});
const geometry = new Triangle(gl);
const mesh = new Mesh(gl, {geometry, program})

requestAnimationFrame(update)
function update(t) {
    requestAnimationFrame(update)

    program.uniforms.uTime.value = t * 0.001;

    renderer.render({ scene: mesh })
}
