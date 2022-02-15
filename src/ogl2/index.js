import { Renderer, Color, Camera, Transform, Program, Mesh, Orbit, Geometry , Text} from 'ogl';
import font from './fonts/radikal-bold.json'
import srcPNG from './fonts/radikal-bold.png'

const vertex = /* glsl */ `#version 300 es

    #define attribute in
    #define varying out

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

const fragment = /* glsl */ `#version 300 es

    precision highp float;

    #define varying in
    #define texture2D texture
    #define gl_FragColor FragColor

    out vec4 FragColor;

    uniform float uAlpha;
    uniform vec3 uColor;
    uniform sampler2D tMap;

    varying vec2 vUv;

    void main() {
      vec3 color = texture2D(tMap, vUv).rgb;

      float signed = max(min(color.r, color.g), min(max(color.r, color.g), color.b)) - 0.5;
      float d = fwidth(signed);
      float alpha = smoothstep(-d, d, signed);

      if (alpha < 0.02) discard;

      gl_FragColor = vec4(uColor, alpha * uAlpha);
    }

`;

{
    const renderer = new Renderer({ dpr: 2 });
    const gl = renderer.gl;
    document.body.appendChild(gl.canvas);
    gl.clearColor(1, 1, 1, 1);

    const camera = new Camera(gl, { fov: 35 });
    camera.position.set(0, 1, 7);
    camera.lookAt([0, 0, 0]);
    const controls = new Orbit(camera);

    function resize() {
        renderer.setSize(window.innerWidth, window.innerHeight);
        camera.perspective({ aspect: gl.canvas.width / gl.canvas.height });
    }
    window.addEventListener('resize', resize, false);
    resize();

    const scene = new Transform();

    const program2 = new Program(gl, {
        cullFace: null,
        depthWrite: false,
        transparent: true,
        fragment: fragment,
        vertex: vertex,
        uniforms: {
          uAlpha: { value: 0 },
          uColor: { value: new Color('#f4d8cc') },
          uSpeed: { value: 0 },
          tMap: { value: srcPNG }
        }
      })

      const text = new Text({
        align: 'left',
        font,
        letterSpacing: -0.05,
        lineHeight: 0.7,
        size: 10.1,
        text: document.querySelector('.text').textContent
      })

      const geometry = new Geometry(gl, {
        position: { size: 3, data: text.buffers.position },
        uv: { size: 2, data: text.buffers.uv },
        id: { size: 1, data: text.buffers.id },
        index: { data: text.buffers.index }
      })

      const mesh = new Mesh(gl, { geometry, program: program2 })
      mesh.visible = true
      mesh.position.set(-1.3, 0, 0);
      mesh.setParent(scene)

    requestAnimationFrame(update);
    function update() {
        requestAnimationFrame(update);
        controls.update();

        renderer.render({ scene, camera });
    }
}
