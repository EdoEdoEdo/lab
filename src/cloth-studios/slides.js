import * as THREE from 'three';
import { frag } from './frag.js';
import { vert } from './vert.js';

const cloths = [
  { title: "Print #1", src: "cloths/image1.jpg", theme: "" },
  { title: "Print #2", src: "cloths/image2.jpg", theme: "" },
  { title: "Print #3", src: "cloths/image3.jpg", theme: "cream" },
  { title: "Print #4", src: "cloths/image4.jpg", theme: "dark" },
  { title: "Print #5", src: "cloths/image5.jpg", theme: "dark" }
]

// get the tags from HTML
const section = document.querySelector("section")
const description = document.querySelector("div.description")
const prevTag = document.querySelector("nav a.prev")
const nextTag = document.querySelector("nav a.next")

// set up a scene + camera
const scene = new THREE.Scene()
const camera = new THREE.PerspectiveCamera(50, section.clientWidth / section.clientHeight, 0.1, 1000)

// add a three.js canvas to the section tag
const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true })
renderer.setClearColor(0xff0000, 0)
renderer.setSize(section.clientWidth, section.clientHeight)
section.appendChild(renderer.domElement)

// where are we in the slideshow
let current = 0
let currentRotationX = Math.PI / 4
let aimRotationX = 0
let currentRotationY = 0
let aimRotationY = 0


// setup tools
const loader = new THREE.TextureLoader()
const clock = new THREE.Clock()
const raycaster = new THREE.Raycaster()
const mouse = new THREE.Vector2()

// angle between each cloth
const arc = Math.PI * 2 / cloths.length

// loop over all of the cloths data
cloths.forEach((cloth, index) => {
  // make a uniform PER shape
  cloth.uniforms = {
    image: { value: loader.load(cloth.src) },
    time: { value: clock.getElapsedTime() },
    mouse: { value: mouse },
    touchUv: { value: new THREE.Vector2(0.5, 0.5) },
    touchStrength: { value: 0 },
    touchStrengthAim: { value: 0 }
  }

  // set up the shape
  const dpi = 50
  const geometry = new THREE.PlaneGeometry(4, 6, dpi, dpi * 1.5)
	const material = new THREE.ShaderMaterial({
    uniforms: cloth.uniforms,
   	vertexShader: vert,
    fragmentShader: frag
  })

	const shape = new THREE.Mesh(geometry, material)

  // make a group/layer to put the shape into and rotate
  const group = new THREE.Group()
  group.rotation.set(0, index * arc, 0)

  // push the shape away from the camera
	shape.position.set(0, 0, -10)

  // add the shape to the cloth data
  cloth.shape = shape

  // add shape to group, then group to scene
	group.add(shape)
  scene.add(group)
})


// set up next function
const next = function () {
  current += 1
  aimRotationY -= arc

  if (current > cloths.length - 1) {
    current = 0
  }

  update()
}

// set up prev function
const prev = function () {
  current -= 1
  aimRotationY += arc

  if (current < 0) {
    current = cloths.length - 1
  }

  update()
}

// when either prev or next is run
const update = function () {
  description.innerHTML = cloths[current].title

  document.body.className = cloths[current].theme
}

// every page frame (e.g. 60 frames a second)
const animate = function () {

  // camera rotations
  const diffX = (aimRotationX - currentRotationX) * 0.015
  currentRotationX += diffX

  const diffY = (aimRotationY - currentRotationY) * 0.025
  currentRotationY += diffY

  camera.rotation.set(currentRotationX, currentRotationY, 0)

  // set raycaster from the mouse 2d position vs camera
  raycaster.setFromCamera(mouse, camera)

  // for each cloth in the array
  cloths.forEach(cloth => {
    // update its uniforms
    cloth.uniforms.time = { value: clock.getElapsedTime() }
    cloth.uniforms.mouse = { value: mouse }

    // check if the shape is intersecting with the mouse
    const intersects  = raycaster.intersectObject(cloth.shape)

    // if there's one (or more) intersection
    if (intersects.length > 0) {
      // tell the uniforms where
      cloth.uniforms.touchUv = { value: intersects[0].uv }
      cloth.uniforms.touchStrengthAim = { value: 1 }
    } else {
      cloth.uniforms.touchStrengthAim = { value: 0 }
    }

    // tween the touch strength based on the aim
    // similar to the camera movement code
    const currentStrength = cloth.uniforms.touchStrength.value
    const aimStrength = cloth.uniforms.touchStrengthAim.value
    const diffStrength = (aimStrength - currentStrength) * 0.05

    cloth.uniforms.touchStrength = { value: currentStrength + diffStrength }
  })

  // run again on next frame
	requestAnimationFrame( animate );
	renderer.render( scene, camera );
}

// interactions below
animate()
update()

// on click of prev tag
prevTag.addEventListener("click", function (event) {
  event.preventDefault()
  prev()
})

// on click of next tag
nextTag.addEventListener("click", function (event) {
  event.preventDefault()
  next()
})

// if the mouse is moving, where is it in pixels
// then convert to a 0-1 by diving by section width/height
// then converted to -1 to 1 by doubling and minus one
window.addEventListener("mousemove", function (event) {
  mouse.x = event.clientX / section.clientWidth * 2 - 1
  mouse.y = event.clientY / section.clientHeight * -2 + 1
})

// update camera aspect ratio and canvas sizes
window.addEventListener("resize", function () {
  camera.aspect = section.clientWidth / section.clientHeight
  camera.updateProjectionMatrix()

  renderer.setSize(section.clientWidth, section.clientHeight)
})
