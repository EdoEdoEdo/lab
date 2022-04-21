/////////////////////////////////////////////////////////////////////////
///// IMPORT

import './style.scss';
import * as THREE from 'three'
import { TWEEN } from 'three/examples/jsm/libs/tween.module.min.js'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js'
import { DRACOLoader } from 'three/examples/jsm/loaders/DRACOLoader.js'
import gsap from 'gsap'
import { ScrollTrigger } from "gsap/ScrollTrigger";

import vertexShader from './shaders/vertex.glsl'
import fragmentShaders from './shaders/fragment.glsl'

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
scene.background = new THREE.Color('#ffffff')


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
camera.position.set(0,0,30)
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
// const controls = new OrbitControls(camera, renderer.domElement)

/////////////////////////////////////////////////////////////////////////
///// SCENE LIGHTS
const ambient = new THREE.AmbientLight(0xaffffff, 0.82)
// scene.add(ambient)

const sunLight = new THREE.DirectionalLight(0xffffff, 1.96)
sunLight.position.set(69,44,14)
scene.add(sunLight)

let mesh
/////////////////////////////////////////////////////////////////////////
///// LOADING GLB/GLTF MODEL FROM BLENDER
loader.load('models/phone/generic-phone.glb', function (gltf) {
  gltf.scene.scale.set(70, 70, 70);
  mesh = gltf.scene
  scene.add(mesh)

  gsap.registerPlugin(ScrollTrigger);

gsap.to(mesh.rotation, {
  scrollTrigger: {
  trigger: "#trigger",
  start: "top top",
  end: "bottom top",
  scrub: true,
  toggleActions: "restart pause resume pause"
},
  y: Math.PI
});

})

/////////////////////////////////////////////////////////////////////////
//// INTRO CAMERA ANIMATION USING TWEEN
const menu = document.querySelector('.container')

function introAnimation() {
  controls.enabled = false //disable orbit controls to animate the camera

  new TWEEN.Tween(camera.position.set(10, 10, 10)).to({ // from camera position
      x: -20, //desired x position to go
      y: -20, //desired y position to go
      z: -20 //desired z position to go
  }, 6500) // time take to animate
  .delay(1000).easing(TWEEN.Easing.Quartic.InOut).start() // define delay, easing
  .onComplete(function () { //on finish animation
      controls.enabled = true //enable orbit controls
      setOrbitControlsLimits() //enable controls limits
      // TWEEN.remove(this) // remove the animation from memory
      gsap.to(menu, {opacity: 1} ) // make the menu visible
  })
}

// introAnimation() // call intro animation on start


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

  TWEEN.update() // update animations

  // controls.update() // update orbit controls

  renderer.render(scene, camera) // render the scene using the camera

  requestAnimationFrame(rendeLoop) //loop the render function

}

rendeLoop() //start rendering


