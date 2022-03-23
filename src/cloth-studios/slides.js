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
const camera = new THREE.PerspectiveCamera( 50, section.clientWidth / section.clientHeight, 0.1, 1000 );

const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
renderer.setClearColor( 0xff0000, 0 );
renderer.setSize( window.innerWidth, window.innerHeight );
section.appendChild( renderer.domElement );

// where are we in the slideshow
let current = 0
let currentRotationY = 0
let aimRotationY = 0

const arc = Math.PI * 2 / cloths.length

// loop over all of the cloths data
cloths.forEach((cloth, index) => {
  const geometry = new THREE.PlaneGeometry(4, 6);
  const material = new THREE.MeshBasicMaterial( { color: 0x00ff00 } );
  const shape = new THREE.Mesh( geometry, material );

  const group = new THREE.Group();
  group.rotation.set(0, index * arc, 0)

  shape.position.set(0, 0, -10);

  group.add( shape );
  scene.add( group );
})

const next = function () {
  current += 1;
  aimRotationY -= arc;

  if (current > cloths.length - 1) {
    current = 0;
  }
  update()
}

const prev = function () {
  current -= 1;
  aimRotationY += arc;

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
  const diffY = (aimRotationY - currentRotationY) * 0.025
  currentRotationY += diffY

  camera.rotation.set(0, currentRotationY, 0)

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
