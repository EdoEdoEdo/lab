import './style.scss'
import { Renderer, Camera, Transform, Program, Mesh, Sphere, Polyline, Orbit, Vec3, Color, Curve, Torus } from 'ogl'

const vertex = /* glsl */ `
    attribute vec3 position;
    attribute vec3 normal;

    uniform mat3 normalMatrix;
    uniform mat4 modelViewMatrix;
    uniform mat4 projectionMatrix;

    varying vec3 vNormal;

    void main() {
        vNormal = normalize(normalMatrix * normal);
        gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
    }
`;

const fragment = /* glsl */ `
    precision highp float;

    varying vec3 vNormal;

    void main() {
        gl_FragColor.rgb = normalize(vNormal);
        gl_FragColor.a = 1.0;
    }
`;


const renderer = new Renderer({dpr: 2})
const gl = renderer.gl;
document.body.append(gl.canvas)
gl.clearColor(0.9, 0.9, 0.9, 1);

const camera = new Camera({ fov: 35 })
camera.position.set(0, 0, 5)

const controls = new Orbit(camera, {
    taget: new Vec3(0, 0, 0)
})

function resize(){
    renderer.setSize(window.innerWidth, window.innerHeight)
    camera.perspective({ aspect: gl.canvas.width / gl.canvas.height })
}
window.addEventListener('resize', resize, false)
resize()

const scene = new Transform()

const sphereGeometry = new Sphere(gl, {widthSegments: 200})

const program = new Program(gl, {
    vertex,
    fragment,
    cullFace: null
})

const sphere = new Mesh(gl, { geometry: sphereGeometry, program })
sphere.setParent(scene)
sphere.position.set(-2, 0, 0)

const curve = new Curve({
    points: [new Vec3(0, 0.5, 0), new Vec3(0, 1, 1), new Vec3(0, -1, 1), new Vec3(0, -0.5, 0)],
    type: Curve.CUBICBEZIER,
})

const points = curve.getPoints(20)

curve.type = Curve.CATMULLROM
const points2 = curve.getPoints(20)

curve.type = Curve.QUADRATICBEZIER
const points3 = curve.getPoints(20)

const polyline = new Polyline(gl, {
    points,
    uniforms: {
        uColor: { value: new Color('#f00')},
        uThickness: { value: 3 }
    }
})

const polyline2 = new Polyline(gl, {
    points: points2,
    uniforms: {
        uColor: { value: new Color('#00f') },
        uThickness: { value: 2 },
    },
});

const polyline3 = new Polyline(gl, {
    points: points3,
    uniforms: {
        uColor: { value: new Color('#0f0') },
        uThickness: { value: 4 },
    },
});

for (let i = 0; i <= 60; i++) {
    const p = [polyline, polyline2, polyline3][i % 3];
    const mesh = new Mesh(gl, { geometry: p.geometry, program: p.program });
    mesh.setParent(sphere);
    mesh.rotation.y = (i * Math.PI) / 60;
}

// TORUS
// ========================================
const torusGeometry = new Torus(gl, {
    radius: 1,
    tube: 0.4,
    radialSegments: 16,
    tubularSegments: 32,
})

const torus = new Mesh(gl, { geometry: torusGeometry, program })
torus.setParent(scene)
torus.position.set(2, 0, 0)

// ========================================

requestAnimationFrame(update)
function update(){
    requestAnimationFrame(update)

    sphere.rotation.y -= 0.01;

    torus.rotation.x += 0.001;
    torus.rotation.y += 0.005;
    torus.rotation.z += 0.003;

    controls.update()
    renderer.render({scene, camera})
}
