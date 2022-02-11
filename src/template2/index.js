import './style.scss';
import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'

import * as dat from 'dat.gui'
import vertexShader from './shaders/vertex.glsl'
import fragmentShaders from './shaders/fragment.glsl'


/**
 * Debug
 */
//  const gui = new dat.GUI({ closed: false, width: 340 });
//  const templateFolder = gui.addFolder("Template");
//  const debugObject = {
//    param1: "#51CDBB",
//    param2: "#9CFF57",
//  };
//  dat.GUI.toggleHide();


 /**
  * Base
  */
 // Canvas
 const canvas = document.querySelector("canvas.webgl");

 // Scene
 const scene = new THREE.Scene();

 /**
  * Object
  */
 const geometry = new THREE.PlaneGeometry(5, 5);

 // Material
 const material = new THREE.ShaderMaterial({
   vertexShader: vertexShader,
   fragmentShader: fragmentShaders,
   uniforms: {
     uTime: { value: 0 },
   }
 });

 const water = new THREE.Mesh(geometry, material);
 scene.add(water);

/**
* Lights
*/
const light = new THREE.AmbientLight( 0xffffff, 1.5 );
scene.add( light );

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


 // Controls
 const controls = new OrbitControls(camera, canvas);
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

   // Update time
   material.uniforms.uTime.value = elapsedTime;

   // Render
   renderer.render(scene, camera);


   // Call tick again on the next frame
   window.requestAnimationFrame(tick);
 };

 tick();
