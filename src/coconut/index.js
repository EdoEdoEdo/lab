import './style.scss';
import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';

import Stats from 'three/examples/jsm/libs/stats.module'
import * as dat from 'dat.gui'
import vertexShader from './shaders/vertex.glsl'
import fragmentShaders from './shaders/fragment.glsl'

import creatureVert from './shaders/creatureVert.glsl'
import creatureFrag from './shaders/creatureFrag.glsl'


/**
 * Debug
 */
 const gui = new dat.GUI({ closed: false, width: 340 });
 const bigWavesFolder = gui.addFolder("Large Waves");
 const smallWavesFolder = gui.addFolder("Small Waves");
 const colorFolder = gui.addFolder("Colors");
 const debugObject = {
   waveDepthColor: "#51CDBB",
   waveSurfaceColor: "#9CFF57",
   fogNear: 1,
   fogFar: 3,
   fogColor: "#FAF5BD"
 };

 /**
  * Base
  */
 // Canvas
 const canvas = document.querySelector("canvas.webgl");

 // Scene
 const scene = new THREE.Scene();
 scene.fog = new THREE.Fog(
   debugObject.fogColor,
   debugObject.fogNear,
   debugObject.fogFar
 );
 scene.background = new THREE.Color(debugObject.fogColor);

 const hemisphereLight = new THREE.HemisphereLight(0xaaaaaa,0x000000, .9)
 hemisphereLight.position.set(0, 0, 5);
//  const shadowLight = new THREE.DirectionalLight(0xffffff, .9);
//  shadowLight.position.set(150, 350, 350);
//  shadowLight.castShadow = true;
//  shadowLight.shadow.camera.left = -400;
//  shadowLight.shadow.camera.right = 400;
//  shadowLight.shadow.camera.top = 400;
//  shadowLight.shadow.camera.bottom = -400;
//  shadowLight.shadow.camera.near = 1;
//  shadowLight.shadow.camera.far = 1000;
//  shadowLight.shadow.mapSize.width = 2048;
//  shadowLight.shadow.mapSize.height = 2048;

//  const helper = new THREE.HemisphereLightHelper( hemisphereLight, 5 );
//  scene.add( helper );
 scene.add(hemisphereLight);

//  scene.add(shadowLight);

 const light = new THREE.AmbientLight( 0xffffff, 1.5 ); // soft white light
 scene.add( light );

 // SpotLight
// =================
// let spotLight = new THREE.SpotLight( 0xcccccc, 0.6 );
// spotLight.position.set( 0, 1, 0 );
// scene.add( spotLight );
// scene.add( spotLight.target ); // add target to the scene

// // SpotLight Helper
// const cameraHelper = new THREE.CameraHelper(spotLight.shadow.camera);
// scene.add(cameraHelper);

//  const axis = new THREE.AxesHelper(40)
//  scene.add(axis)

 /**
  * Object
  */
 const waterGeometry = new THREE.PlaneGeometry(20, 20, 512, 512);

 // Material
 const waterMaterial = new THREE.ShaderMaterial({
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
     uDepthColor: { value: new THREE.Color(debugObject.waveDepthColor) },
     uSurfaceColor: { value: new THREE.Color(debugObject.waveSurfaceColor) },
     uColorOffset: { value: 0.08 },
     uColorMultiplier: { value: 5 },

     // Fog, contains fogColor, fogDensity, fogFar and fogNear
     ...THREE.UniformsLib["fog"]
   }
 });

 const water = new THREE.Mesh(waterGeometry, waterMaterial);
 water.rotation.x = -Math.PI * 0.5;
 scene.add(water);

/**
* Cans
*/
let can;
const loader = new GLTFLoader();
loader.load( 'models/coconut/scene.gltf', function ( gltf ) {

  gltf.scene.position.set(0, 1, 4);
  gltf.scene.scale.set(0.013, 0.013, 0.013);
  gltf.scene.rotateY(Math.PI*2.55);
  can = gltf.scene;
  scene.add( can );

  var canBox = new THREE.Box3().setFromObject( can );
 canBox.getCenter( controls.target );
 controls.update();


}, undefined, function ( error ) {

  console.error( error );

} );


// /**
// * Creature
// */
// const clock = new THREE.Clock()
// const loader = new THREE.TextureLoader()
// const cubeLoader = new THREE.CubeTextureLoader()

// const uniforms = {
//   time: { value: clock.getElapsedTime() },
//   cat: { value: loader.load("/textures/album/cat.jpg") },
//   cube: { value: cubeLoader.load(["/textures/album/posx.jpg", "/textures/album/negx.jpg", "/textures/album/posy.jpg", "/textures/album/negy.jpg", "/textures/album/posz.jpg", "/textures/album/negz.jpg"]) }
// }

// const dpi = 12
// const geometry = new THREE.SphereGeometry(1, dpi, dpi)
// // const geometry = new THREE.ConeGeometry( 1, 1, 32 );
// // const geometry = new THREE.TorusGeometry( 2, 1, 16, 100 );
// // const geometry = new THREE.TorusKnotGeometry( 5, 1, 80, 50 );
// // const geometry = new THREE.TorusKnotGeometry(5, 1, 10 * dpi, dpi, 5, 9)
// // const geometry = new THREE.TorusKnotGeometry(0.05, 0.4, 100, 16)
// // const geometry = new THREE.TorusGeometry( 10, 3, 16, 100 );

// const material = new THREE.ShaderMaterial({
//   uniforms: uniforms,
//   vertexShader: creatureVert,
//   fragmentShader: creatureFrag,
//   wireframe: true
// })
// const shape = new THREE.Mesh(geometry, material)
// shape.position.y = 1;
// shape.position.z = 1;
// scene.add(shape)



 /**
  * Sizes
  */
 const sizes = {
   width: window.innerWidth,
   height: window.innerHeight
 };

 window.addEventListener("resize", () => {
   // Update sizes
   sizes.width = window.innerWidth;
   sizes.height = window.innerHeight;

   // Update camera
   camera.aspect = sizes.width / sizes.height;
   camera.updateProjectionMatrix();

   // Update renderer
   renderer.setSize(sizes.width, sizes.height);
   renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
 });

 /**
  * Camera
  */

 // Base camera
 const camera = new THREE.PerspectiveCamera(
   75,
   sizes.width / sizes.height,
   0.1,
   1000
 );
 camera.position.set(0, 1, 6);
 scene.add(camera);

 /**
  * Renderer
  */
 const renderer = new THREE.WebGLRenderer({
   canvas: canvas, alpha: true, antialias: true
 });
 renderer.setSize(sizes.width, sizes.height);
 renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

 /**
  * Add GUI
  */
 // Big Waves
 bigWavesFolder
   .add(waterMaterial.uniforms.uBigWavesElevation, "value")
   .min(0)
   .max(1)
   .step(0.001)
   .name("Elevation");
 bigWavesFolder
   .add(waterMaterial.uniforms.uBigWavesFrequency.value, "x")
   .min(0)
   .max(10)
   .step(0.001)
   .name("Frequency X");
 bigWavesFolder
   .add(waterMaterial.uniforms.uBigWavesFrequency.value, "y")
   .min(0)
   .max(10)
   .step(0.001)
   .name("Frequency Y");
 bigWavesFolder
   .add(waterMaterial.uniforms.uBigWaveSpeed, "value")
   .min(0.25)
   .max(5)
   .step(0.001)
   .name("Speed");

 // Small Waves
 smallWavesFolder
   .add(waterMaterial.uniforms.uSmallWavesElevation, "value")
   .min(0.0)
   .max(0.3)
   .step(0.001)
   .name("Elevation");
 smallWavesFolder
   .add(waterMaterial.uniforms.uSmallWavesFrequency, "value")
   .min(0)
   .max(30)
   .step(0.001)
   .name("Frequency");
 smallWavesFolder
   .add(waterMaterial.uniforms.uSmallWavesSpeed, "value")
   .min(0.0)
   .max(1)
   .step(0.001)
   .name("Speed");
 smallWavesFolder
   .add(waterMaterial.uniforms.uSmallWavesIterations, "value")
   .min(0)
   .max(10)
   .step(1)
   .name("Iterations");

 // Colors
 colorFolder
   .add(waterMaterial.uniforms.uColorOffset, "value")
   .min(0)
   .max(0.15)
   .step(0.0001)
   .name("Color Offset");
 colorFolder
   .add(waterMaterial.uniforms.uColorMultiplier, "value")
   .min(0.0)
   .max(10.0)
   .step(0.001)
   .name("Color multiplier");
 colorFolder
   .addColor(debugObject, "waveDepthColor")
   .name("Wave depth color")
   .onChange(() => {
     waterMaterial.uniforms.uDepthColor.value.set(debugObject.waveDepthColor);
   });
 colorFolder
   .addColor(debugObject, "waveSurfaceColor")
   .name("Wave surface color")
   .onChange(() => {
     waterMaterial.uniforms.uSurfaceColor.value.set(
       debugObject.waveSurfaceColor
     );
   });
 colorFolder
   .addColor(debugObject, "fogColor")
   .name("Fog Color")
   .onChange(() => {
     waterMaterial.uniforms.fogColor.value.set(debugObject.fogColor);
     scene.background.set(debugObject.fogColor);
     scene.fog = new THREE.Fog(
       debugObject.fogColor,
       debugObject.fogNear,
       debugObject.fogFar
     );
   });

 // Controls
 const controls = new OrbitControls(camera, canvas);
 controls.enableDamping = true;

 /**
  * Animate
  */
 const clock = new THREE.Clock();

 const tick = () => {
   const elapsedTime = clock.getElapsedTime();

   // Update controls
   controls.update();

  // // update uniforms
  // uniforms.time = { value: clock.getElapsedTime() }

   // Update time
   waterMaterial.uniforms.uTime.value = elapsedTime;

   if (can) can.rotation.y += 0.001;

   // Render
   renderer.render(scene, camera);

   // Call tick again on the next frame
   window.requestAnimationFrame(tick);
 };

 tick();

 dat.GUI.toggleHide();
