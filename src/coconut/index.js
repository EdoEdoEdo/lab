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
const canScene = new THREE.Scene();
let can;
const loader = new GLTFLoader();
loader.load( 'models/coconut/scene.gltf', function ( gltf ) {

  gltf.scene.position.set(0, 1, 4);
  gltf.scene.scale.set(0.013, 0.013, 0.013);
  gltf.scene.rotateY(Math.PI*2.55);
  can = gltf.scene;
  canScene.add( can );

  var canBox = new THREE.Box3().setFromObject( can );
  canBox.getCenter( controls.target );
  controls.update();


}, undefined, function ( error ) {

  console.error( error );

} );

/**
* Lights
*/
const light = new THREE.AmbientLight( 0xffffff, 1.5 );
scene.add( light );
canScene.add(light);


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

   // Update camera 1
   camera.aspect = sizes.width / sizes.height;
   camera.updateProjectionMatrix();

   // Update camera 2
   camera2.aspect = sizes.width / sizes.height;
   camera2.updateProjectionMatrix();

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
 const camera2 = new THREE.PerspectiveCamera(
  75,
  sizes.width / sizes.height,
  0.1,
  1000
);
camera2.position.set(0, 1, 6);
 canScene.add(camera2);

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
 const controls = new OrbitControls(camera2, canvas);
 controls.enableDamping = true;
 controls.enableZoom = false;
 controls.enablePan = false;

 /**
  * Animate
  */
 const clock = new THREE.Clock();
 renderer.autoClear = false; // important!

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
   renderer.render(canScene, camera2);

   // Call tick again on the next frame
   window.requestAnimationFrame(tick);
 };

 tick();

 dat.GUI.toggleHide();
