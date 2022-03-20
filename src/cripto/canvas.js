import * as THREE from 'three'

import { frag } from './frag.js';
import { vert } from './vert.js';

const section = document.querySelector('section')

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera( 75, section.clientWidth/ section.clientHeight, 0.1, 1000 );

const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true});
renderer.setSize( section.clientWidth, section.clientHeight );
section.appendChild( renderer.domElement );

const dpi = 10;
const geometry = new THREE.SphereGeometry(3, 2 * dpi, dpi);
const material = new THREE.ShaderMaterial( {
  vertexShader:  vert,
  fragmentShader: frag,
    wireframe: true
} );
const cube = new THREE.Mesh( geometry, material );
scene.add( cube );

camera.position.z = 10;

function animate() {
	requestAnimationFrame( animate );
	renderer.render( scene, camera );
}
animate();
