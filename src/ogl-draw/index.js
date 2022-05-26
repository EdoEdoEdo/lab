import './style.scss';
import { Renderer, Camera, Transform, Geometry, Program, Mesh } from 'ogl';

const vertex = /* glsl */ `
  attribute vec2 uv;
  attribute vec3 position;
  uniform mat4 modelViewMatrix;
  uniform mat4 projectionMatrix;
  varying vec2 vUv;
  void main() {
      vUv = uv;

      gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);

      // gl_PointSize only applicable for gl.POINTS draw mode
      gl_PointSize = 5.0;
  }
`;

const fragment = /* glsl */ `
  precision highp float;
  uniform float uTime;
  varying vec2 vUv;
  void main() {
      gl_FragColor.rgb = 0.5 + 0.3 * sin(vUv.yxx + uTime) + vec3(0.2, 0.0, 0.1);
      gl_FragColor.a = 1.0;
  }
`;


const renderer = new Renderer();
const gl = renderer.gl;
document.body.appendChild(gl.canvas);
gl.clearColor(1, 1, 1, 1);

const camera = new Camera(gl, {fov: 15})
camera.position.z = 15;

function resize() {
  renderer.setSize(window.innerWidth, window.innerHeight)
  camera.perspective({ aspect: gl.canvas.width / gl.canvas.height })
}
window.addEventListener('resize', resize, false)
resize();

const scene = new Transform();

 // Geometry is an indexed square, comprised of 4 vertices.
 const geometry = new Geometry(gl, {
  position: { size: 3, data: new Float32Array(
  //   [
  //     -0.7,-0.1,0,
  //     -0.3,0.6,0,
  //     -0.3,-0.3,0,
  //     0.2,0.6,0,
  //     0.3,-0.3,0,
  //     0.7,0.6,0
  //  ]
    [
      -0.5, 0.5, 0,
      -0.8, -0.5, 0,
      0.5, 0.5, 0,
      0.5, -0.5, 0]
  ) },
  uv: { size: 2, data: new Float32Array([0, 1, 1, 1, 0, 0, 1, 0]) },
  index: { data: new Uint16Array([0, 1, 2, 1, 3, 2]) },
});


const program = new Program(gl, {
  vertex,
  fragment,
  uniforms: {
      uTime: { value: 0 },
  },
});

const points = new Mesh(gl, {mode: gl.POINTS, geometry, program })
points.setParent(scene)
points.position.set(-1, 1, 0)

const lineStrip = new Mesh(gl, { mode: gl.LINES, geometry, program })
lineStrip.setParent(scene)
lineStrip.position.set(1, 1, 0)

const lineLoop = new Mesh(gl, {mode: gl.LINE_LOOP, geometry, program})
lineLoop.setParent(scene)
lineLoop.position.set(-1, -1, 0)

const triangles = new Mesh(gl, {mode: gl.TRIANGLES, geometry, program})
triangles.setParent(scene)
triangles.position.set(1, -1, 0)

requestAnimationFrame(update)
function update(t){
  requestAnimationFrame(update)


  renderer.render({ scene, camera })
}
