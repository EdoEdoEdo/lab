import './style.scss';
import gsap from 'gsap';


gsap.set(".effect", {autoAlpha:1})
let tl = gsap.timeline()
  .from("h1", {scale:0.03, duration:2, ease:"power4.inOut"})
  .to(".blendImage, .bg", {scale:1, duration:2}, 0)
  .to(".dark", {opacity:0, duration:1}, ">-=100%")



// GSDevTools.create({animation:tl})
