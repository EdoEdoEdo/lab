import * as THREE from 'three'

import { frag } from './frag.js';
import { vert } from './vert.js';

const section = document.querySelector('section')

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera( 75, section.clientWidth/ section.clientHeight, 0.1, 1000 );

const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true, preserveDrawingBuffer: true});
renderer.setSize( section.clientWidth, section.clientHeight );
section.appendChild( renderer.domElement );

const dpi = 100;
const geometry = new THREE.SphereGeometry(5, 2 * dpi, dpi);

const clock = new THREE.Clock()
const mouse = new THREE.Vector2(0, 0)

const uniforms = {
  time: { value: clock.getElapsedTime() },
  seed: { value: Math.random() },
  mouse: { value: mouse },
}

const material = new THREE.ShaderMaterial( {
  uniforms: uniforms,
  vertexShader:  vert,
  fragmentShader: frag,
  // wireframe: true,
} );
const cube = new THREE.Mesh( geometry, material );
scene.add( cube );

camera.position.z = 10;

function animate() {

  uniforms.time.value = clock.getElapsedTime()
  uniforms.mouse = { value: mouse }

	requestAnimationFrame( animate );
	renderer.render( scene, camera );
}

// pick all my sliders, and loop each time
const sliders = document.querySelectorAll('input')
sliders.forEach(slider => {
  const name = slider.getAttribute('name')

  uniforms[name] = { value: parseFloat(slider.value) }
  slider.addEventListener('input', () => {
    uniforms[name] = { value: parseFloat(slider.value) }
  })
})

window.addEventListener('resize', () => {
  camera.aspect = section.clientWidth/ section.clientHeight
  camera.updateProjectionMatrix()

  renderer.setSize(section.clientWidth, section.clientHeight)
})

const button = document.querySelector('button')
button.addEventListener('click', (e) => {
  e.preventDefault()

  const canvas = document.querySelector('canvas')
  const url = canvas.toDataURL()

  const link = document.createElement('a')
  link.setAttribute('href', url)
  link.setAttribute('target', '_blank')

  link.setAttribute('download', 'rock.png')

  link.click()
})


section.addEventListener('mousemove', (e) => {
  mouse.x = e.clientX / section.clientWidth * 2 - 1
  mouse.y = e.clientY / section.clientHeight * -2 + 1
})


animate();
