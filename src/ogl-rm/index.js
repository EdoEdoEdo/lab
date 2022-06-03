import './style.scss'
// Polylines
import { Renderer, Transform, Vec3, Color, Polyline } from 'ogl'
// MSDF Font
import { Camera, Geometry, Texture, Program, Mesh, Orbit, Text } from 'ogl'

// Polylines
const vertexPoly = /* glsl */ `
  precision highp float;
  attribute vec3 position;
  attribute vec3 next;
  attribute vec3 prev;
  attribute vec2 uv;
  attribute float side;
  uniform vec2 uResolution;
  uniform float uDPR;
  uniform float uThickness;
  vec4 getPosition() {
      vec4 current = vec4(position, 1);
      vec2 aspect = vec2(uResolution.x / uResolution.y, 1);
      vec2 nextScreen = next.xy * aspect;
      vec2 prevScreen = prev.xy * aspect;

      // Calculate the tangent direction
      vec2 tangent = normalize(nextScreen - prevScreen);

      // Rotate 90 degrees to get the normal
      vec2 normal = vec2(-tangent.y, tangent.x);
      normal /= aspect;
      // Taper the line to be fatter in the middle, and skinny at the ends using the uv.y
      normal *= mix(1.0, 0.1, pow(abs(uv.y - 0.5) * 2.0, 2.0) );
      // When the points are on top of each other, shrink the line to avoid artifacts.
      float dist = length(nextScreen - prevScreen);
      normal *= smoothstep(0.0, 0.02, dist);
      float pixelWidthRatio = 1.0 / (uResolution.y / uDPR);
      float pixelWidth = current.w * pixelWidthRatio;
      normal *= pixelWidth * uThickness;
      current.xy -= normal * side;

      return current;
  }
  void main() {
      gl_Position = getPosition();
  }
`;

// MSDF Text
const vertex = /* glsl */ `
  attribute vec2 uv;
  attribute vec3 position;
  uniform mat4 modelViewMatrix;
  uniform mat4 projectionMatrix;
  varying vec2 vUv;
  void main() {
      vUv = uv;

      gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`;

const fragment = /* glsl */ `
  uniform sampler2D tMap;
  varying vec2 vUv;
  void main() {
      vec3 tex = texture2D(tMap, vUv).rgb;
      float signedDist = max(min(tex.r, tex.g), min(max(tex.r, tex.g), tex.b)) - 0.5;
      float d = fwidth(signedDist);
      float alpha = smoothstep(-d, d, signedDist);
      if (alpha < 0.01) discard;
      gl_FragColor.rgb = vec3(0.0);
      gl_FragColor.a = alpha;
  }
`;

const vertex100 =
  /* glsl */ `
` + vertex;

const fragment100 =
  /* glsl */ `#extension GL_OES_standard_derivatives : enable
  precision highp float;
` + fragment;

const vertex300 =
  /* glsl */ `#version 300 es
  #define attribute in
  #define varying out
` + vertex;

const fragment300 =
  /* glsl */ `#version 300 es
  precision highp float;
  #define varying in
  #define texture2D texture
  #define gl_FragColor FragColor
  out vec4 FragColor;
` + fragment;


const renderer = new Renderer({dpr: 2})
const gl = renderer.gl;
document.body.append(gl.canvas)
gl.clearColor(0.9, 0.9, 0.9, 1);

const camera = new Camera(gl, { fov: 45 });
camera.position.set(0, 0, 7);

const controls = new Orbit(camera);

const scene = new Transform()



// Polylines ================================================
const lines = []



function random(a, b) {
    const alpha = Math.random();
    return a * (1.0 - alpha) + b * alpha;
}

['#7972E6', '#EFAF07', '#E89DCC', '#ECA0D1', '#97E1CA'].forEach((color, i) => {
    // Store a few values for each lines' spring movement
    const line = {
        spring: random(0.02, 0.1),
        friction: random(0.7, 0.95),
        mouseVelocity: new Vec3(),
        mouseOffset: new Vec3(random(-1, 1) * 0.02),
    };

    // Create an array of Vec3s (eg [[0, 0, 0], ...])
    // Note: Only pass in one for each point on the line - the class will handle
    // the doubling of vertices for the polyline effect.
    const count = 20;
    const points = (line.points = []);
    for (let i = 0; i < count; i++) points.push(new Vec3());

    // Pass in the points, and any custom elements - for example here we've made
    // custom shaders, and accompanying uniforms.
    line.polyline = new Polyline(gl, {
        points,
        vertex: vertexPoly,
        uniforms: {
            uColor: { value: new Color(color) },
            uThickness: { value: random(20, 50) },
        },
    });

    line.polyline.mesh.setParent(scene);

    lines.push(line);
});

// Polylines [end] ================================================

// MSDF Text ================================================
const texture = new Texture(gl, {
  generateMipmaps: false,
});
const img = new Image();
img.onload = () => (texture.image = img);
img.src = 'ogl/fonts/FiraSans-Bold.png';

const program = new Program(gl, {
  // Get fallback shader for WebGL1 - needed for OES_standard_derivatives ext
  vertex: renderer.isWebgl2 ? vertex300 : vertex100,
  fragment: renderer.isWebgl2 ? fragment300 : fragment100,
  uniforms: {
      tMap: { value: texture },
  },
  transparent: true,
  cullFace: null,
  depthWrite: false,
});

loadText();
async function loadText() {
  const font = await (await fetch('ogl/fonts/FiraSans-Bold.json')).json();

  const text = new Text({
      font,
      text: "Rafaela Mascaro",
      width: 4,
      align: 'center',
      letterSpacing: -0.05,
      size: 1,
      lineHeight: 1.1,
  });

  // Pass the generated buffers into a geometry
  const geometry = new Geometry(gl, {
      position: { size: 3, data: text.buffers.position },
      uv: { size: 2, data: text.buffers.uv },
      // id provides a per-character index, for effects that may require it
      id: { size: 1, data: text.buffers.id },
      index: { data: text.buffers.index },
  });

  const mesh = new Mesh(gl, { geometry, program });

  // Use the height value to position text vertically. Here it is centered.
  mesh.position.y = text.height * 0.5;
  mesh.setParent(scene);
}

// MSDF Text [end] ================================================


function resize(){
  renderer.setSize(window.innerWidth, window.innerHeight)

  lines.forEach((line) => line.polyline.resize())
}
window.addEventListener('resize', resize, false)
resize()

// Add handlers to get mouse position
const mouse = new Vec3();
if ('ontouchstart' in window) {
    window.addEventListener('touchstart', updateMouse, false);
    window.addEventListener('touchmove', updateMouse, false);
} else {
    window.addEventListener('mousemove', updateMouse, false);
}

function updateMouse(e) {
    if (e.changedTouches && e.changedTouches.length) {
        e.x = e.changedTouches[0].pageX;
        e.y = e.changedTouches[0].pageY;
    }
    if (e.x === undefined) {
        e.x = e.pageX;
        e.y = e.pageY;
    }

    // Get mouse value in -1 to 1 range, with y flipped
    mouse.set((e.x / gl.renderer.width) * 2 - 1, (e.y / gl.renderer.height) * -2 + 1, 0);
}

const tmp = new Vec3();


requestAnimationFrame(update)
function update(t){
    requestAnimationFrame(update)

    lines.forEach((line) => {
        // Update polyline input points
        for (let i = line.points.length - 1; i >= 0; i--) {
            if (!i) {
                // For the first point, spring ease it to the mouse position
                tmp.copy(mouse).add(line.mouseOffset).sub(line.points[i]).multiply(line.spring);
                line.mouseVelocity.add(tmp).multiply(line.friction);
                line.points[i].add(line.mouseVelocity);
            } else {
                // The rest of the points ease to the point in front of them, making a line
                line.points[i].lerp(line.points[i - 1], 0.9);
            }
        }
        line.polyline.updateGeometry();
    });


    controls.update();
    renderer.render({scene, camera})
}
