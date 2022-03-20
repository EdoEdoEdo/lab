import AutoBind from 'auto-bind'

import './style.scss';
import { Mesh, Plane, Program, Texture, Transform, Renderer, Camera, Vec2 } from 'ogl'
import fragment from './shaders/fragment.glsl'
import vertex from './shaders/vertex.glsl'
import GSAP from 'gsap'
import Textures from './textures';

class Scene {
  constructor() {

    AutoBind(this)

    this.position = new Vec2()
    this.normalized = new Vec2()

    this.createRenderer()
    this.createCamera()
    this.createGroup()

    this.onResize()

    // this.createTexture()
    // this.createMask()
    this.createTitles()
    this.createBounds()
    this.createMesh()

    this.updateRatio()
    this.updateScale()
    this.updatePosition()

    this.addListeners()

    this.update()


  }

  createRenderer () {
    this.renderer = new Renderer({
      alpha: true,
      dpr: Math.min(window.devicePixelRatio, 1.5)
    })

    this.gl = this.renderer.gl
    this.gl.canvas.classList.add('canvas')

    Textures.set(this.gl)

    document.body.appendChild(this.gl.canvas)
  }

  createCamera () {
    this.camera = new Camera(this.gl)
    this.camera.fov = 45
    this.camera.position.z = 5
  }

  createGroup () {
    this.group = new Transform()
  }

  createTexture () {
    this.texture = new Texture(this.gl, {
      generateMipmaps: false
    })

    const image = new window.Image()

    image.crossOrigin = 'anonymous'
    image.src = document.querySelector('.fake__media__image').src
    image.onload = _ => {
      this.texture.image = image
    }
  }

  createTitles() {
    this.element = document.querySelector('.smoke')
  }

  // createMask () {
  //   this.mask = new Texture(this.gl, {
  //     generateMipmaps: false
  //   })

  //   const image = new window.Image()

  //   image.crossOrigin = 'anonymous'
  //   image.src = document.querySelector('.fake__media__image').src
  //   image.onload = _ => {
  //     this.mask.image = image
  //   }
  // }

  createBounds () {
    this.bounds = this.element.getBoundingClientRect()
  }

  createMesh () {
    console.log('element', this.element)
    const geometry = new Plane(this.gl)

    this.textureDesktop = Textures.load('https://images.prismic.io/el-hempe/43bc08d5-89f9-48d7-a5b9-9bf5ea7ab97d_intro-title.png?auto=compress,format')
    this.textureMask = Textures.load(`/smoke/mask.mp4?0`, { loop: false })

    console.log('this.textureMask', this.textureMask)


    const program = new Program(this.gl, {
      depthTest: true,
      depthWrite: false,
      fragment,
      vertex,
      uniforms: {
        uAlpha: { value: 1 },
        tMap: { value: this.textureDesktop },
        tMask: { value: this.textureMask },
        uResolution: { value: [0, 0, 0, 0] },
        uSpeed: { value: 0 }
      },
      transparent: true
    })

    console.log('program', program)

    this.mesh = new Mesh(this.gl, {
      geometry,
      program
    })

    this.mesh.setParent(this.group)
  }

  onResize () {
    // this.bounds = document.querySelector('.fake__media__image').getBoundingClientRect()

    this.windowInnerSizes = {
      height: window.innerHeight,
      width: window.innerWidth
    }

    this.sizes = this.windowInnerSizes

    this.renderer.setSize(this.sizes.width, this.sizes.height)

    this.camera.perspective({
      aspect: this.sizes.width / this.sizes.height
    })

    const fov = this.camera.fov * (Math.PI / 180)
    const height = 2 * Math.tan(fov / 2) * this.camera.position.z
    const width = height * this.camera.aspect

    this.area = {
      height,
      width
    }
  }

  updateRatio () {
    if (!this.texture?.image) return

    this.aspect = this.texture.image.height / this.texture.image.width

    let a1
    let a2

    if (this.bounds.height / this.bounds.width > this.aspect) {
      a1 = (this.bounds.width / this.bounds.height) * this.aspect
      a2 = 1
    } else {
      a1 = 1
      a2 = (this.bounds.height / this.bounds.width) / this.aspect
    }

    this.mesh.program.uniforms.uResolution.value = [this.bounds.width, this.bounds.height, a1, a2]
  }

  updateScale () {
    this.mesh.scale.x = this.area.width * this.bounds.width / this.sizes.width
    this.mesh.scale.y = this.area.height * this.bounds.height / this.sizes.height
  }

  updatePosition () {
    this.mesh.position.y = (this.area.height / 2) - (this.mesh.scale.y / 2) - ((this.bounds.top) / this.sizes.height) * this.area.height
    this.mesh.position.x = -(this.area.width / 2) + (this.mesh.scale.x / 2) + ((this.bounds.left) / this.sizes.width) * this.area.width
  }

  addListeners() {
    window.addEventListener('mousemove', (event)=> {
      const x = event.offsetX
      const y = event.offsetY

      const xNorm = x / this.sizes.width - 0.5
      const yNorm = y / this.sizes.height - 0.5

      this.normalized.set(xNorm, yNorm)

      const lerp = GSAP.utils.interpolate


      this.x = lerp(this.normalized.x, this.normalized.x, 0.1)
      this.y = lerp(this.normalized.y, this.normalized.y, 0.1)



    })
  }

  update () {

    this.textureMask.updateVideo()

    this.renderer.render({
      scene: this.group,
      camera: this.camera
    })

    // console.log('x,y', this.x, this.y);
    // if(this.x && this.y) {
    //   this.mesh.program.uniforms.uMouse.value = [this.x, this.y]
    // }

    requestAnimationFrame(this.update)
  }
}

new Scene();



