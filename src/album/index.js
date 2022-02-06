import './style.scss';
import * as THREE from 'three'
import { frag } from './frag';
import { vert } from './vert';

const scene = new THREE.Scene()
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000)

const sectionTag = document.querySelector("section")

const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true })
renderer.setSize(window.innerWidth, window.innerHeight)
renderer.setClearColor(0xff0000, 0)
sectionTag.appendChild(renderer.domElement)

const clock = new THREE.Clock()
const loader = new THREE.TextureLoader()
const cubeLoader = new THREE.CubeTextureLoader()

const uniforms = {
  time: { value: clock.getElapsedTime() },
  cat: { value: loader.load("/textures/album/cat.jpg") },
  cube: { value: cubeLoader.load(["/textures/album/posx.jpg", "/textures/album/negx.jpg", "/textures/album/posy.jpg", "/textures/album/negy.jpg", "/textures/album/posz.jpg", "/textures/album/negz.jpg"]) }
}

const dpi = 64
//const geometry = new THREE.SphereGeometry(12, dpi, dpi)
const geometry = new THREE.TorusKnotGeometry(8, 1, 10 * dpi, dpi, 5, 9)
const material = new THREE.ShaderMaterial({
  uniforms: uniforms,
  vertexShader: vert,
  fragmentShader: frag
})
const shape = new THREE.Mesh(geometry, material)
scene.add(shape)

let aimCamera = new THREE.Vector3(0, 0, 35)
let currentCamera = new THREE.Vector3(0, 200, 100)

camera.position.copy(currentCamera)

const animate = function () {
	requestAnimationFrame(animate)

  // camera zoom
  const diff = aimCamera.clone()
  	.sub(currentCamera)
  	.multiplyScalar(0.02)

  currentCamera.add(diff)

  camera.position.copy(currentCamera)

  // update uniforms
  uniforms.time = { value: clock.getElapsedTime() }

	renderer.render(scene, camera)
}

animate()

window.addEventListener("resize", function () {
  camera.aspect = window.innerWidth / window.innerHeight
  camera.updateProjectionMatrix()

  renderer.setSize(window.innerWidth, window.innerHeight)
})

