import './style.scss';
import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js'
import { RGBELoader } from 'three/examples/jsm/loaders/RGBELoader.js'
import Stats from 'three/examples/jsm/libs/stats.module'
import * as dat from 'dat.gui'

// import * as THREE from "three";
// global.THREE = THREE;

// require("three/examples/js/controls/OrbitControls");
// require("three/examples/js/loaders/GLTFLoader.js");
// require("three/examples/js/loaders/RGBELoader.js");
// const { GUI } = require("dat.gui");

let canvas, renderer, camera, scene;
let meshes = [];
let options = {
  roughness: 0,
  transmission: 1,
  thickness: 2
};

init();
render();

function init() {
  canvas = document.querySelector("#c");
  renderer = new THREE.WebGLRenderer({ canvas });
  renderer.setPixelRatio(window.devicePixelRatio);
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.setClearColor(0x1f1e1c, 1);

  const gui = new dat.GUI();

  const fov = 45;
  const near = 0.1;
  const far = 500;
  camera = new THREE.PerspectiveCamera(
    fov,
    window.innerWidth / window.innerHeight,
    near,
    far
  );
  camera.position.z = 20;

  scene = new THREE.Scene();

  new OrbitControls(camera, canvas);

  const hdrEquirect = new RGBELoader().load(
    "refraction/empty.hdr",
    () => {
      hdrEquirect.mapping = THREE.EquirectangularReflectionMapping;
    }
  );

  const textureLoader = new THREE.TextureLoader();
  const bgTexture = textureLoader.load("refraction/stained-glass.jpg");
  const bgGeometry = new THREE.PlaneGeometry(19.2, 14.4);
  const bgMaterial = new THREE.MeshBasicMaterial({ map: bgTexture });
  const bgMesh = new THREE.Mesh(bgGeometry, bgMaterial);
  bgMesh.position.set(0, 0, -1);
  scene.add(bgMesh);

  const material1 = new THREE.MeshPhysicalMaterial({
    roughness: options.roughness,
    transmission: options.transmission,
    thickness: options.thickness
  });

  const spGeom = new THREE.SphereGeometry(3, 32, 32);
  const sp1 = new THREE.Mesh(spGeom, material1);
  sp1.position.set(0, 0, 3);
  scene.add(sp1);
  meshes.push(sp1);

  let dirLight = new THREE.DirectionalLight(0xffffff, 1);
  scene.add(dirLight);

  gui.add(options, "transmission", 0, 1, 0.01).onChange((val) => {
    material1.transmission = val;
  });

  gui.add(options, "thickness", 0, 5, 0.1).onChange((val) => {
    material1.thickness = val;
  });

  gui.add(options, "roughness", 0, 1, 0.01).onChange((val) => {
    material1.roughness = val;
  });
}

function update(deltaTime) {
  const ROTATE_TIME = 10; // Time in seconds for a full rotation
  const rotateX = (deltaTime / ROTATE_TIME) * Math.PI * 2;
  const rotateY = (deltaTime / ROTATE_TIME) * Math.PI * 2;

  meshes.forEach((mesh) => {
    mesh.rotateX(rotateX);
    mesh.rotateY(rotateY);
  });
}

function render() {
  requestAnimationFrame(render);

  update(0.01);

  renderer.render(scene, camera);
}
