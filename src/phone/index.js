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

  setupPlugins();
  setupAnimScrollTrigger();
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

function setupPlugins() {
  gsap.registerPlugin(ScrollTrigger);
}


Math.degToRad = degrees => degrees * (Math.PI / 180);
function setupAnimScrollTrigger() {

  // OPENING ANIMATION
  const opening = new gsap.timeline()
    .fromTo(camera.position, {z: 60}, {z: 40, ease: 'Circ.easeOut', duration: 1.5}, 'opening')
    // .fromTo(camera.rotation, {y: -Math.degToRad(30), x: -Math.degToRad(-5)}, {y: 0, x: 0, ease: 'Circ.easeOut', duration: 1.5}, 'opening')
    // SHOW THE SCROLLER
    .set(".scroller",{visibility: "visible"});

  // ROTATE THE PHONE WHEN SCROLL IN ON TOP OF SCREEN
  // const rotation = new gsap.timeline({
  //   scrollTrigger: {
  //     toggleActions: "play pause play pause",
  //     trigger: ".welcome",
  //     start: "top bottom",
  //     end: "top -1",
  //   }
  // })
  // .to(mesh.rotation, {y:Math.degToRad(360), ease:'none', repeat:-1, duration: 30});

  const animation = new gsap.timeline({
    scrollTrigger: {
      trigger: ".content",
      scrub: true,
      start: "top bottom",
      end: "bottom bottom",
    }
  })
  // ROTATE THE PHONE
  .to(mesh.rotation, {y: Math.degToRad(133.8025067+90), x: Math.degToRad(18.65275889), ease: 'power2.inOut', duration: 0.75}, 0)
  // ZOOM THE CAMERA
  .to(camera.position, {z:30, ease: 'linear', duration: 0.75}, 0)
  // HIDE SCROLLER
  .set(".scroller",{visibility: "hidden"}, 0.2)
  // MORE ROTATION
  .to(mesh.rotation, {y: -Math.degToRad(136.78344100200877-90), x: Math.degToRad(5.1083794384352), ease: 'power2.inOut', duration: 0.75}, 1)
  .to(mesh.rotation, {y: Math.degToRad(58.5876741+90), x: Math.degToRad(-14.00586857), ease: 'power2.inOut', duration: 0.75}, 2)

  .to(mesh.rotation, {y: Math.degToRad(164.1956286+90), x: Math.degToRad(-2.166284249), ease: 'power2.inOut', duration: 0.75}, 3)
  .to(mesh.rotation, {y: Math.degToRad(90), x: Math.degToRad(39.66724753), ease: 'power2.inOut', duration: 0.75}, 4)
  .to(mesh.rotation, {y: Math.degToRad(116.7076259+90), x: Math.degToRad(-2.623623306), ease: 'power2.inOut', duration: 0.75}, 5)

}

