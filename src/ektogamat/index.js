/////////////////////////////////////////////////////////////////////////
///// IMPORT

import './style.scss';
import * as THREE from 'three'
import { TWEEN } from 'three/examples/jsm/libs/tween.module.min.js'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js'
import { DRACOLoader } from 'three/examples/jsm/loaders/DRACOLoader.js'
import gsap from 'gsap'

import vertexShader from './shaders/vertex.glsl'
import fragmentShaders from './shaders/fragment.glsl'

import firefliesVertexShader from './shaders/fireflies/vertex.glsl'
import firefliesFragmentShader from './shaders/fireflies/fragment.glsl'

/////////////////////////////////////////////////////////////////////////
//// DRACO LOADER TO LOAD DRACO COMPRESSED MODELS FROM BLENDER
const dracoLoader = new DRACOLoader()
const loader = new GLTFLoader()
dracoLoader.setDecoderPath('https://www.gstatic.com/draco/v1/decoders/')
dracoLoader.setDecoderConfig({ type: 'js' })
loader.setDRACOLoader(dracoLoader)

/////////////////////////////////////////////////////////////////////////
///// DIV CONTAINER CREATION TO HOLD THREEJS EXPERIENCE
const container = document.createElement('div')
document.body.appendChild(container)

/////////////////////////////////////////////////////////////////////////
///// SCENE CREATION
const scene = new THREE.Scene()
// scene.add(new THREE.AxesHelper(50))
scene.fog = new THREE.Fog(0xDCEAB2, 100,950);
scene.background = new THREE.Color('#DCEAB2')

/////////////////////////////////////////////////////////////////////////
///// RENDERER CONFIG
const renderer = new THREE.WebGLRenderer({ antialias: true}) // turn on antialias
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2)) //set pixel ratio
renderer.setSize(window.innerWidth, window.innerHeight) // make it full screen
renderer.outputEncoding = THREE.sRGBEncoding // set color encoding
container.appendChild(renderer.domElement) // add the renderer to html div

/////////////////////////////////////////////////////////////////////////
///// CAMERAS CONFIG
const camera = new THREE.PerspectiveCamera(35, window.innerWidth / window.innerHeight, 1, 100)
camera.position.set(50,50,50)
scene.add(camera)

/////////////////////////////////////////////////////////////////////////
///// MAKE EXPERIENCE FULL SCREEN
window.addEventListener('resize', () => {
  const width = window.innerWidth
  const height = window.innerHeight
  camera.aspect = width / height
  camera.updateProjectionMatrix()

  renderer.setSize(width, height)
  renderer.setPixelRatio(2)
})

/////////////////////////////////////////////////////////////////////////
///// CREATE ORBIT CONTROLS
const controls = new OrbitControls(camera, renderer.domElement)

/////////////////////////////////////////////////////////////////////////
///// SCENE LIGHTS
const ambient = new THREE.AmbientLight(0xaffffff, 0.82)
scene.add(ambient)

const sunLight = new THREE.DirectionalLight(0xffffff, 1.96)
sunLight.position.set(69,44,14)
scene.add(sunLight)

/////////////////////////////////////////////////////////////////////////
///// MATERIALS
const waterGeometry = new THREE.PlaneGeometry(160, 160, 512, 512);

const waterMaterial = new THREE.ShaderMaterial({
  wireframe: false,
  vertexShader: vertexShader,
  fragmentShader: fragmentShaders,
  transparent: true,
  fog: true,
  uniforms: {
    uTime: { value: 0 },
    uMouse: { value: new THREE.Vector2() },
    uBigWavesElevation: { value: 0.245 },
    uBigWavesFrequency: { value: new THREE.Vector2(4, 2) },
    uBigWaveSpeed: { value: 1.5 },
    // Small Waves
    uSmallWavesElevation: { value: 0.15 },
    uSmallWavesFrequency: { value: 3 },
    uSmallWavesSpeed: { value: 0.2 },
    uSmallWavesIterations: { value: 4 },
    // Color
    uDepthColor: { value: new THREE.Color('#56B2F8') },
    uSurfaceColor: { value: new THREE.Color('#56B2F8') },
    uColorOffset: { value: 0.08 },
    uColorMultiplier: { value: 5 },

    // Fog, contains fogColor, fogDensity, fogFar and fogNear
    ...THREE.UniformsLib["fog"]
  }
});
const water = new THREE.Mesh(waterGeometry, waterMaterial);
water.position.set(0, -0.5, 0)
water.rotation.x = -Math.PI * 0.5;
scene.add(water);

/////////////////////////////////////////////////////////////////////////
///// FIREFLIES
/**
 * Fireflies
 */
// Geometry
const firefliesGeometry = new THREE.BufferGeometry()
const firefliesCount = 300
const positionArray = new Float32Array(firefliesCount * 3)
const scaleArray = new Float32Array(firefliesCount)

for(let i = 0; i < firefliesCount; i++)
{
    positionArray[i * 3 + 0] = (Math.random() - 0.5) * 40
    positionArray[i * 3 + 1] = Math.random() * 15
    positionArray[i * 3 + 2] = (Math.random() - 0.5) * 40

    scaleArray[i] = Math.random()
}

firefliesGeometry.setAttribute('position', new THREE.BufferAttribute(positionArray, 3))
firefliesGeometry.setAttribute('aScale', new THREE.BufferAttribute(scaleArray, 1))

// Material
// const firefliesMaterial = new THREE.PointsMaterial({ size: 0.1, sizeAttenuation: true })
const firefliesMaterial = new THREE.ShaderMaterial({
    uniforms:
    {
        uPixelRatio: { value: Math.min(window.devicePixelRatio, 2) },
        uSize: { value: 1000 },
        uTime: { value: 0 },
    },
    vertexShader: firefliesVertexShader,
    fragmentShader: firefliesFragmentShader,
    transparent: true,
    blending: THREE.AdditiveBlending,
    depthWrite: false,
})
// gui.add(firefliesMaterial.uniforms.uSize, 'value').min(0).max(500).step(1).name('firefliesSize')

// Points
const fireflies = new THREE.Points(firefliesGeometry, firefliesMaterial)
scene.add(fireflies)


/////////////////////////////////////////////////////////////////////////
///// LOADING GLB/GLTF MODEL FROM BLENDER
loader.load('ektogamat/low-poly-forest-trees-scene-ii-free.glb', function (gltf) {
  gltf.scene.scale.set(5, 5, 5);
  scene.add(gltf.scene)
})

/////////////////////////////////////////////////////////////////////////
//// INTRO CAMERA ANIMATION USING TWEEN
const menu = document.querySelector('.container')

function introAnimation() {
  controls.enabled = false //disable orbit controls to animate the camera

  new TWEEN.Tween(camera.position.set(26,5,-35 )).to({ // from camera position
      x: 40, //desired x position to go
      y: 15, //desired y position to go
      z: 20 //desired z position to go
  }, 6500) // time take to animate
  .delay(1000).easing(TWEEN.Easing.Quartic.InOut).start() // define delay, easing
  .onComplete(function () { //on finish animation
      controls.enabled = true //enable orbit controls
      setOrbitControlsLimits() //enable controls limits
      // TWEEN.remove(this) // remove the animation from memory
      gsap.to(menu, {opacity: 1} ) // make the menu visible
  })
}

introAnimation() // call intro animation on start

/////////////////////////////////////////////////////////////////////////
//// VISIT
menu.addEventListener('click', function (e) {
  controls.enabled = false //disable orbit controls to animate the camera
  gsap.to(menu, {opacity: 0} ) // make the menu invisible
  new TWEEN.Tween(camera.position.set(40,15,20 )).to({ // from camera position
    x: 30, //desired x position to go
    y: 5, //desired y position to go
    z: 0 //desired z position to go
  }, 6500) // time take to animate
  .delay(100).easing(TWEEN.Easing.Quartic.InOut).start() // define delay, easing
  .onComplete(function () { //on finish animation
      controls.enabled = true //enable orbit controls
      setOrbitControlsLimits() //enable controls limits
      TWEEN.remove(this) // remove the animation from memory

  })
})

/////////////////////////////////////////////////////////////////////////
//// DEFINE ORBIT CONTROLS LIMITS
function setOrbitControlsLimits(){
  controls.enableDamping = true
  controls.dampingFactor = 0.04
  controls.minDistance = 35
  controls.maxDistance = 60
  controls.enableRotate = true
  controls.enableZoom = true
  controls.maxPolarAngle = Math.PI /2.5
}

/////////////////////////////////////////////////////////////////////////
//// RENDER LOOP FUNCTION
const clock = new THREE.Clock()
function rendeLoop() {

  const elapsedTime = clock.getElapsedTime()
  waterMaterial.uniforms.uTime.value = elapsedTime
  firefliesMaterial.uniforms.uTime.value = elapsedTime

  TWEEN.update() // update animations

  controls.update() // update orbit controls

  renderer.render(scene, camera) // render the scene using the camera

  requestAnimationFrame(rendeLoop) //loop the render function

}

rendeLoop() //start rendering
