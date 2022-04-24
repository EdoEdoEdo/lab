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
import { TextPlugin } from "gsap/TextPlugin";
import { EXRLoader } from 'three/examples/jsm/loaders/EXRLoader.js'

import vertexShader from './shaders/vertex.glsl'
import fragmentShader from './shaders/fragment.glsl'

/////////////////////////////////////////////////////////////////////////
//// FEATURES

const features = [
  {
    title: 'Accessories',
    coords: {
      cover: 'Shockproof Smartphone Protector',
      earplugs: 'Get up to 5 hrs music playback per charge'
    },
    selector: '.f1'
  },
  {
    title: 'Super High Res',
    coords: {
      UltraHD: '3840×2160',
      Resolution: '4K Ultra HD'
    },
    selector: '.f2'
  },
  {
    title: 'Water Resistent',
    coords: {
      waterproof: '100 feet/30 meters IPX8',
      Factor: 'Dry Bag'
    },
    selector: '.f3'
  },
  {
    title: 'ideal for music',
    coords: {
      sound: 'supersopund system 2khZ',
      duration: '12 hours'
    },
    selector: '.f4'
  },
  {
    title: 'Games',
    coords: {
      games: '2000 games',
      online: 'multiplayer support'
    },
    selector: '.f5'
  },
  {
    title: 'Slim Look',
    coords: {
      width: '2cm',
      wide: '1cm'
    },
    selector: '.f6'
  },
  {
    title: 'Best Cameras',
    coords: {
      wide: '12 MP dual-pixe',
      medium: '16 MP ultrawide rear camera'
    },
    selector: '.f7'
  },
]

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
scene.add(ambient)

const sunLight = new THREE.DirectionalLight(0xffffff, 1.96)
sunLight.position.set(80,80,80)
scene.add(sunLight)
// const helper = new THREE.DirectionalLightHelper( sunLight, 5 );
// scene.add( helper );

let mesh
/////////////////////////////////////////////////////////////////////////
///// MATERIALS
// Screen light material
const screenLightMaterial = new THREE.ShaderMaterial({
  vertexShader: vertexShader,
  fragmentShader: fragmentShader,
  uniforms:
  {
      uTime: { value: 0 }
  },
})

/////////////////////////////////////////////////////////////////////////
///// LOADING GLB/GLTF MODEL FROM BLENDER
loader.load('models/phone/generic-phone.glb', function (gltf) {
  gltf.scene.scale.set(70, 70, 70);
  mesh = gltf.scene
  scene.add(mesh)

  // traverse the model to search for glass objects
  gltf.scene.traverse((obj) => {
    if (obj.isMesh) {
      if(obj.material.name === 'Screen') {
        obj.material = screenLightMaterial
      }
    }
  })

  setupPlugins();
  setupAnimScrollTrigger();
  setupContentScrollTrigger();
})

/////////////////////////////////////////////////////////////////////////
///// PMREM GENERATOR FOR SCENE ENVIRONMENT
const pmremGenerator = new THREE.PMREMGenerator(renderer)
console.log('pmremGenerator', pmremGenerator)
pmremGenerator.compileEquirectangularShader()

function loadObjectAndAndEnvMap() {
console.log('newEnvMap2 loading', newEnvMap2)
    scene.environment = newEnvMap2

}

let newEnvMap2
new EXRLoader()
.load(
    "models/phone/mine02.exr",
    function (texture) {
        const exrCubeRenderTarget = pmremGenerator.fromEquirectangular(texture)
        newEnvMap2 = exrCubeRenderTarget ? exrCubeRenderTarget.texture : null
        // newEnvMap.offset.y = 500
        loadObjectAndAndEnvMap() // Add envmap once the texture has been loaded

        texture.dispose()
    }
)

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
  screenLightMaterial.uniforms.uTime.value = elapsedTime

  TWEEN.update() // update animations

  // controls.update() // update orbit controls

  renderer.render(scene, camera) // render the scene using the camera

  requestAnimationFrame(rendeLoop) //loop the render function

}
rendeLoop() //start rendering

function setupPlugins() {
  gsap.registerPlugin(ScrollTrigger);
  gsap.registerPlugin(TextPlugin);
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
  // .to(this.camera.position, {z:3000, ease: 'linear', duration: 0.75}, 0)
  .set(".scroller",{visibility: "hidden"}, 0.2)
  .set(".buy",{visibility: "visible"}, 0.2)
  .to(mesh.rotation, {y: -Math.degToRad(10), x: Math.degToRad(5.1083794384352), ease: 'power2.inOut', duration: 0.75}, 1)
  .to(mesh.rotation, {y: Math.degToRad(58.5876741+90), x: Math.degToRad(-14.00586857), ease: 'power2.inOut', duration: 0.75}, 2)
  .to(mesh.rotation, {y: Math.degToRad(164.1956286+90), x: Math.degToRad(-2.166284249), ease: 'power2.inOut', duration: 0.75}, 3)
  .to(mesh.rotation, {y: Math.degToRad(90), x: Math.degToRad(39.66724753), ease: 'power2.inOut', duration: 0.75}, 4)
  .to(mesh.rotation, {y: Math.degToRad(116.7076259+90), x: Math.degToRad(-2.623623306), ease: 'power2.inOut', duration: 0.75}, 5)
  .to(camera.position, {z: 30, ease: 'linear'}, 6)
}

function setupContentScrollTrigger() {

  const onUpdate = function() {
    const target = this.targets()[0];
    const time = this.time();
    const duration = this.duration();

    if (time >= duration || time <= 0) {
      target.classList.remove('editing');
      return;
    }
    if (!target.classList.contains('editing')) {
      target.classList.add('editing');
    }
  };

  const getLines = obj => {
    const lines = [];
    Object.keys(obj).forEach(x => {
      lines.push(`${x}: ${obj[x]}`);
    });
    return lines;
  };

  ScrollTrigger.addEventListener("scrollEnd", function(e){
    const target = document.querySelectorAll('.editing')[0];
    if (target) {
      target.classList.add('blink');
    }
  });

  ScrollTrigger.addEventListener("scrollStart", function(e){
    const target = document.querySelectorAll('.editing')[0];
    if (target) {
      target.classList.remove('blink');
    }
  });

  features.forEach((item, i, arr) => {
    console.log(item);
    const timeline = new gsap.timeline({
        scrollTrigger: {
          trigger: item.selector,
          scrub: true,
          start: 'top 75%',
          end: `bottom ${i < arr.length - 1 ? '75%' : 'bottom'}`,
          //markers: {startColor: "green", endColor: "red", fontSize: "12px"}
        }
      })
      .to(`${item.selector} .title`, {text:`${item.title}`, ease: 'linear', duration: 0.25, onUpdate}, 0)
      .to(`${item.selector} .lat`, {text: `${getLines(item.coords)[0]}`, ease: 'linear', duration: 0.125, onUpdate}, 0.25)
      .to(`${item.selector} .lon`, {text: `${getLines(item.coords)[1]}`, ease: 'linear', duration: 0.125, onUpdate}, 0.375)
      .set(`${item.selector} .image-container`, {visibility: 'visible'})
      .fromTo(`${item.selector} .image-container`, {width: '0%'}, {width: '20vw', duration: 0.125}, 0.75)
      .fromTo(`${item.selector} .image-container`, {height: '0%'}, {height: 'auto', duration: 0.125}, 0.875);

      if(i < arr.length - 1) {
        timeline.yoyo(true)
          .repeat(1)
          .repeatDelay(0.5);
      }

  });
}
