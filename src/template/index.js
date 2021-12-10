import './style.scss';
import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import Stats from 'three/examples/jsm/libs/stats.module'
import * as dat from 'dat.gui'

/**
 * Base
 */
// Canvas
const canvas = document.querySelector('canvas.webgl')

// Scene
const scene = new THREE.Scene()

// Stats
const stats = new Stats()
document.body.appendChild(stats.dom)



const axis = new THREE.AxesHelper(4)
scene.add(axis)

/**
 * Object
 */
const geometry = new THREE.BoxGeometry(1, 1, 1)
const material = new THREE.MeshBasicMaterial({ color: 0xff0000 })
const mesh = new THREE.Mesh(geometry, material)
mesh.name = 'cube'
mesh.castShadow = true
scene.add(mesh)

// Plane
const loader = new THREE.TextureLoader();
const texture = loader.load('https://threejsfundamentals.org/threejs/resources/images/checker.png');
texture.wrapS = THREE.RepeatWrapping;
texture.wrapT = THREE.RepeatWrapping;
texture.magFilter = THREE.NearestFilter;
const repeats = 20;
texture.repeat.set(repeats, repeats);

const planeGeo = new THREE.PlaneBufferGeometry(40, 40);
const planeMat = new THREE.MeshPhongMaterial({
  map: texture,
  side: THREE.DoubleSide,
});
const plane = new THREE.Mesh(planeGeo, planeMat);
plane.receiveShadow = true;
plane.rotation.x = Math.PI * -.5;
scene.add(plane);

/**
 * Debug
 */
 const gui = new dat.GUI()
 gui
 .add(mesh.position, 'y')
 .min(- 3)
 .max(3)
 .step(0.01)
 .name('elevation')
 gui.add(mesh, 'visible')
 gui.add(material, 'wireframe')
 gui.add(axis, 'visible').name('axes')

/**
 * Sizes
 */
 const sizes = {
    width: window.innerWidth,
    height: window.innerHeight
}

// Keyboard controls
var cube = scene.getObjectByName('cube');
document.addEventListener('keydown', event => {
  document.onkeydown = function(e) {
    switch (e.keyCode) {
      case 37:
        cube.position.x -= 0.1;
        break;
      case 38:
        cube.position.y += 0.1;
        break;
      case 39:
        cube.position.x += 0.1;
        break;
      case 40:
        cube.position.y -= 0.1;
        break;
    }
  };
})

// SpotLight
// =================
const color = 0xFFFFFF;
const intensity = 1;
const light = new THREE.SpotLight(color, intensity);
light.castShadow = true;
light.position.set(0, 2, 0);
light.target.position.set(0, 0, 0);
scene.add(light);
scene.add(light.target);

// SpotLight Helper
const cameraHelper = new THREE.CameraHelper(light.shadow.camera);
scene.add(cameraHelper);
// =================

// Directional Light
// =================
// const color = 0xFFFFFF;
// const intensity = 1;
// const light = new THREE.DirectionalLight(color, intensity);
// light.castShadow = true;
// light.position.set(7, 7, -7);
// light.target.position.set(0, 0, 0);
// scene.add(light);
// scene.add(light.target);

// const cameraHelper = new THREE.CameraHelper(light.shadow.camera);
// scene.add(cameraHelper);

// const helper = new THREE.DirectionalLightHelper(light);
// scene.add(helper);
// =================

// Ambient Light
// =================
// var ambientLight = new THREE.AmbientLight(0xffffff);
// scene.add(ambientLight);
// =================

/**
 * Camera
 */
// Base camera
const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height, 0.1, 100)
// const camera = new THREE.OrthographicCamera( window.innerWidth / - 50, window.innerWidth / 50, window.innerHeight / 50, window.innerHeight / -50, - 500, 1000);
camera.position.z = 3
camera.position.y = 2
camera.position.x = 2
scene.add(camera)

// Controls
const controls = new OrbitControls(camera, canvas)
controls.enableDamping = true

/**
 * Renderer
 */
const renderer = new THREE.WebGLRenderer({
    canvas: canvas
})
renderer.setSize(sizes.width, sizes.height)
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
renderer.shadowMapEnabled = true;

/**
 * Animate
 */
const clock = new THREE.Clock()

const tick = () =>
{
    const elapsedTime = clock.getElapsedTime()

    // Update controls
    controls.update()

    // Render
    renderer.render(scene, camera)

    // Stats
    stats.update()

    // Call tick again on the next frame
    window.requestAnimationFrame(tick)
}

tick()

window.addEventListener('resize', () =>
{
    // Update sizes
    sizes.width = window.innerWidth
    sizes.height = window.innerHeight

    // Update camera
    camera.aspect = sizes.width / sizes.height
    camera.updateProjectionMatrix()

    // Update renderer
    renderer.setSize(sizes.width, sizes.height)
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
})

window.addEventListener('dblclick', () =>
{
    const fullscreenElement = document.fullscreenElement || document.webkitFullscreenElement

    if(!fullscreenElement)
    {
        if(canvas.requestFullscreen)
        {
            canvas.requestFullscreen()
        }
        else if(canvas.webkitRequestFullscreen)
        {
            canvas.webkitRequestFullscreen()
        }
    }
    else
    {
        if(document.exitFullscreen)
        {
            document.exitFullscreen()
        }
        else if(document.webkitExitFullscreen)
        {
            document.webkitExitFullscreen()
        }
    }
})
