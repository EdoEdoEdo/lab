import * as THREE from 'three';

const cloths = [
  { title: 'Print #1', src: 'cloths/image1.jpg', theme: '' },
  { title: 'Print #2', src: 'cloths/image2.jpg', theme: '' },
  { title: 'Print #3', src: 'cloths/image3.jpg', theme: 'cream' },
  { title: 'Print #4', src: 'cloths/image4.jpg', theme: 'dark' },
  { title: 'Print #5', src: 'cloths/image5.jpg', theme: '' },
]

const section = document.querySelector('section');
const description = document.querySelector('div.description');
const prevTag = document.querySelector('nav a.prev');
const nextTag = document.querySelector('nav a.next');

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera( 75, section.clientWidth / section.clientHeight, 0.1, 1000 );

const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
renderer.setClearColor( 0xff0000, 0 );
renderer.setSize( window.innerWidth, window.innerHeight );
section.appendChild( renderer.domElement );

// where are we in the slideshow
let current = 0

const geometry = new THREE.BoxGeometry();
const material = new THREE.MeshBasicMaterial( { color: 0x00ff00 } );
const cube = new THREE.Mesh( geometry, material );
scene.add( cube );

camera.position.z = 5;

const next = function () {
  current += 1;
  if (current > cloths.length - 1) {
    current = 0;
  }
  update()
}

const prev = function () {
  current -= 1;
  if (current < 0) {
    current = cloths.length - 1;
  }
  update()
}

const update = function () {
  description.innerHTML = cloths[current].title;
  document.body.className = cloths[current].theme;
}

function animate() {
	requestAnimationFrame( animate );
	renderer.render( scene, camera );
}
animate();

update()

prevTag.addEventListener('click', (e) => {
  e.preventDefault()
  prev()
});

nextTag.addEventListener('click', (e) => {
  e.preventDefault()
  next()
});
