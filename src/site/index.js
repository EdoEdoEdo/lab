import './style.scss';
import * as THREE from 'three'
import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer.js'
import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass.js'
import { GlitchPass } from 'three/examples/jsm/postprocessing/GlitchPass.js'
import gsap from 'gsap'
import { Howl } from 'howler'
import Tick from './tick.mp3'

const redBar = document.querySelector('.red-bar')

window.addEventListener('wheel', function(event)
{
 if (event.deltaY < 0)
 {
  gsap.to(redBar, 1, {
    y: event.deltaY,
  });

 }
 else if (event.deltaY > 0)
 {
  gsap.to(redBar, 1, {
    y: event.deltaY,
  });
  // play the sound
  tick.play();
 }

});


const tick = new Howl({
  src: Tick,
  autoplay: false,
  loop: false,
  volume: 0.8
})

const links = document.querySelectorAll('.page__link');
links.forEach(link => {
  link.addEventListener('mouseenter', () => {
    // play the sound
    tick.play();
  })
})

class Lights {

  constructor() {
    console.clear();

    this.scene;
    this.camera;
    this.renderer;
    this.composer;
    this.glitch;
    this.stats;
    this.gui;
    this.uniforms;
    this.speed = 0.02;
    this.intensity = 0.1;
    this.mousePosition = true;
    this.wildGlitch = false;
    this.color = [255, 0, 0];
    this.offset = { x: 3, y: 3 };
    this.mouse = { x: 0, y: 0 };
    this.innerWidth = window.innerWidth;
    this.innerHeight = window.innerHeight;
    this.container = document.getElementById('canvas');
  }

  start() {
    this.scene = new THREE.Scene();

    this.camera = new THREE.PerspectiveCamera(50, this.innerWidth / this.innerHeight, 0.5, 1000);
    this.camera.position.set(0, 0, 10);

    this.scene.add(this.camera);

    this.renderer = new THREE.WebGLRenderer({ antialias: true, preserveDrawingBuffer: true });
    this.renderer.domElement.addEventListener('mousemove', this.onMouseMove.bind(this), false);
    this.renderer.setSize(this.innerWidth, this.innerHeight);
    this.renderer.setPixelRatio(window.devicePixelRatio);
    this.renderer.setClearColor(0x000000);
    this.renderer.clear();
    this.container.appendChild(this.renderer.domElement);

    this.composer = new EffectComposer(this.renderer);
    this.composer.addPass(new RenderPass(this.scene, this.camera));

    this.glitch = new GlitchPass(64);
    this.glitch.renderToScreen = true;
    this.glitch.goWild = this.wildGlitch;
    this.composer.addPass(this.glitch);

    window.addEventListener('resize', this.resize.bind(this), false);

    this.createMesh();
    this.animate();
  }

  rgbToPercentage(arr) {
    return arr.map(value => value / 255);
  }

  randomInt(min, max) {
    return Math.random() * (max - min + 1) << 0;
  }

  easeOutQuad(t) {
    return t * (2 - t);
  }

  onMouseMove(event) {
    event.preventDefault();

    this.mouse.x = this.easeOutQuad((event.clientX - this.renderer.domElement.width / 2) / this.renderer.domElement.width);
    this.mouse.y = this.easeOutQuad(-(event.clientY - this.renderer.domElement.height / 2) / this.renderer.domElement.height);
  }

  createMesh() {

    this.uniforms = {
      time: {
        type: 'f',
        value: 0 },

      mouse: {
        type: 'v2',
        value: new THREE.Vector2(this.mouse.x, this.mouse.y) },

      resolution: {
        type: 'v2',
        value: new THREE.Vector2(this.innerWidth, this.innerHeight) },

      intensity: {
        type: 'f',
        value: this.intensity },

      mousePosition: {
        type: 'i',
        value: this.mousePosition },

      color: {
        type: 'v3',
        value: new THREE.Vector3(...this.rgbToPercentage(this.color)) },

      offsetX: {
        type: 'f',
        value: this.offset.x },

      offsetY: {
        type: 'f',
        value: this.offset.y } };



    const material = new THREE.ShaderMaterial({
      uniforms: this.uniforms,
      fragmentShader: document.getElementById('fragment_shader').textContent });


    const geometry = new THREE.PlaneGeometry(this.innerWidth, this.innerHeight, 1);
    const mesh = new THREE.Mesh(geometry, material);

    this.scene.add(mesh);
  }

  resize() {
    this.innerWidth = window.innerWidth;
    this.innerHeight = window.innerHeight;

    this.camera.aspect = this.innerWidth / this.innerHeight;
    this.camera.updateProjectionMatrix();

    this.uniforms.resolution.value.x = this.innerWidth;
    this.uniforms.resolution.value.y = this.innerHeight;

    this.composer.setSize(this.innerWidth, this.innerHeight);
    this.renderer.setSize(this.innerWidth, this.innerHeight);
  }

  animate() {
    this.uniforms.time.value += this.speed;
    this.uniforms.mouse.value.x = this.mouse.x;
    this.uniforms.mouse.value.y = this.mouse.y;
    this.render();
  }

  render() {
    window.requestAnimationFrame(this.animate.bind(this));
    this.composer.render();
  }}


new Lights().start();


class Demo3 {
  constructor() {
    this.initCursor();
    this.initHovers();
  }

  initCursor() {
    const { Back } = window;
    this.outerCursor = document.querySelector(".circle-cursor--outer");
    this.innerCursor = document.querySelector(".circle-cursor--inner");
    this.outerCursorBox = this.outerCursor.getBoundingClientRect();
    this.outerCursorSpeed = 0;
    // this.easing = Back.easeOut.config(1.7);
    this.clientX = -100;
    this.clientY = -100;
    this.showCursor = false;

    const unveilCursor = () => {
      gsap.set(this.innerCursor, {
        x: this.clientX,
        y: this.clientY
      });
      gsap.set(this.outerCursor, {
        x: this.clientX - this.outerCursorBox.width / 2,
        y: this.clientY - this.outerCursorBox.height / 2
      });
      setTimeout(() => {
        this.outerCursorSpeed = 0.2;
      }, 100);
      this.showCursor = true;
    };
    document.addEventListener("mousemove", unveilCursor);

    document.addEventListener("mousemove", e => {
      this.clientX = e.clientX;
      this.clientY = e.clientY;
    });

    const render = () => {
      gsap.set(this.innerCursor, {
        x: this.clientX,
        y: this.clientY
      });
      if (!this.isStuck) {
        gsap.to(this.outerCursor, this.outerCursorSpeed, {
          x: this.clientX - this.outerCursorBox.width / 2,
          y: this.clientY - this.outerCursorBox.height / 2
        });
      }
      if (this.showCursor) {
        document.removeEventListener("mousemove", unveilCursor);
      }
      requestAnimationFrame(render);
    };
    requestAnimationFrame(render);
  }

  initHovers() {
    const handleMouseEnter = e => {
      this.isStuck = true;
      const target = e.currentTarget;
      const box = target.getBoundingClientRect();
      this.outerCursorOriginals = {
        width: this.outerCursorBox.width,
        height: this.outerCursorBox.height
      };
      gsap.to(this.outerCursor, 0.2, {
        x: box.left,
        y: box.top,
        width: box.width,
        height: box.height,
        opacity: 0.8,
        borderColor: "#f2f2f2"
      });
    };

    const handleMouseLeave = () => {
      this.isStuck = false;
      gsap.to(this.outerCursor, 0.2, {
        width: this.outerCursorOriginals.width,
        height: this.outerCursorOriginals.height,
        opacity: 0.2,
        borderColor: "#ffffff"
      });
    };

    const linkItems = document.querySelectorAll(".page__link");
    linkItems.forEach(item => {
      item.addEventListener("mouseenter", handleMouseEnter);
      item.addEventListener("mouseleave", handleMouseLeave);
    });

    const mainNavHoverTween = gsap.to(this.outerCursor, 0.3, {
      backgroundColor: "#ffffff",
      ease: this.easing,
      paused: true
    });

    const mainNavMouseEnter = () => {
      this.outerCursorSpeed = 0;
      gsap.set(this.innerCursor, { opacity: 0 });
      mainNavHoverTween.play();
    };

    const mainNavMouseLeave = () => {
      this.outerCursorSpeed = 0.2;
      gsap.set(this.innerCursor, { opacity: 1 });
      mainNavHoverTween.reverse();
    };

    const mainNavLinks = document.querySelectorAll(".content--fixed a");
    mainNavLinks.forEach(item => {
      item.addEventListener("mouseenter", mainNavMouseEnter);
      item.addEventListener("mouseleave", mainNavMouseLeave);
    });
  }
}

new Demo3()
