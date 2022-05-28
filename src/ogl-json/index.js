import './style.scss'
import { Renderer, Camera, Transform, Texture, Program, Geometry, Mesh } from 'ogl'

const vertex = /* glsl */ `
    attribute vec2 uv;
    attribute vec3 position;
    attribute vec3 normal;

    uniform mat4 modelViewMatrix;
    uniform mat4 projectionMatrix;
    uniform mat3 normalMatrix;

    varying vec2 vUv;
    varying vec3 vNormal;

    void main() {
        vUv = uv;
        vNormal = normalize(normalMatrix * normal);

        gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
    }
`;

const fragment = /* glsl */ `
    precision highp float;
    uniform float uTime;

    uniform sampler2D tMap;

    varying vec2 vUv;
    varying vec3 vNormal;
    void main() {
        vec3 normal = normalize(vNormal);
        vec3 tex = texture2D(tMap, vUv).rgb;

        vec3 light = normalize(vec3(0.5, 1.0, -0.3));
        float shading = dot(normal, light) * 0.15;
        gl_FragColor.rgb = tex + shading;
        gl_FragColor.a = 1.0;
    }
`;
const renderer = new Renderer({ dpr: 2 });
const gl = renderer.gl;
document.body.appendChild(gl.canvas);
gl.clearColor(1, 1, 1, 1);

const camera = new Camera(gl, { fov: 35 });
camera.position.set(8, 5, 15);
camera.lookAt([0, 1.5, 0]);

function resize() {
    renderer.setSize(window.innerWidth, window.innerHeight);
    camera.perspective({ aspect: gl.canvas.width / gl.canvas.height });
}
window.addEventListener('resize', resize, false);
resize();

const scene = new Transform();

const texture = new Texture(gl);
const img = new Image();
img.onload = () => (texture.image = img);
img.src = 'ogl/fox.jpeg';

const program = new Program(gl, {
    vertex,
    fragment,
    uniforms: {
        tMap: { value: texture },
    },
});

let mesh, meshWire;
loadModel();
async function loadModel() {
    const data = await (await fetch(`ogl/fox.json`)).json();

    // Mesh
    // ================================================================
    const geometry = new Geometry(gl, {
        position: { size: 3, data: new Float32Array(data.position) },
        uv: { size: 2, data: new Float32Array(data.uv) },
        normal: { size: 3, data: new Float32Array(data.normal) },
    });

    mesh = new Mesh(gl, { geometry, program });
    mesh.setParent(scene);
    mesh.position.x = 4;

    // Mesh (wireframe)
    // ================================================================

    // For an accurate wireframe, triangle vertices need to be duplicated to make line pairs.
    // Here we do so by generating indices. If your geometry is already indexed, this needs to be adjusted.
    let index = new Uint16Array((data.position.length / 3 / 3) * 6);
    for (let i = 0; i < data.position.length / 3; i += 3) {
        // For every triangle, make three line pairs (start, end)
        index.set([i, i + 1, i + 1, i + 2, i + 2, i], i * 2);
    }

    const wireframeGeometry = new Geometry(gl, {
        position: { size: 3, data: new Float32Array(data.position) },
        uv: { size: 2, data: new Float32Array(data.uv) },
        normal: { size: 3, data: new Float32Array(data.normal) },
        index: { data: index },
    });

    meshWire = new Mesh(gl, { mode: gl.LINES, geometry: wireframeGeometry, program });
    meshWire.setParent(scene);
    meshWire.position.x = -4;
}

requestAnimationFrame(update);
function update() {
    requestAnimationFrame(update);

    if (mesh) mesh.rotation.y -= 0.005;
    if (meshWire) meshWire.rotation.y -= 0.005;

    renderer.render({ scene, camera });
}
