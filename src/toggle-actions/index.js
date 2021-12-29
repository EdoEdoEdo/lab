import './style.scss'
import gsap from 'gsap'
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

gsap.defaults({ duration: 1 });

gsap.to(".ball-1", {
  x: 400 - 20,
  scrollTrigger: {
    trigger: ".ball-1",
    start: "top 75%"
  }
});

gsap.to(".ball-2", {
  x: 400 - 20,
  scrollTrigger: {
    trigger: ".ball-2",
    start: "top 75%",
    toggleActions: "restart pause resume pause"
  }
});

gsap.to(".ball-3", {
  x: 400 - 20,
  scrollTrigger: {
    trigger: ".ball-3",
    start: "top 75%",
    toggleActions: "play complete reverse reset"
  }
});

gsap.to(".ball-4", {
  x: 400 - 20,
  scrollTrigger: {
    trigger: ".ball-4",
    start: "top 75%",
    toggleActions: "play pause resume pause"
  }
});

gsap.to(".ball-5", {
  x: 400 - 20,
  scrollTrigger: {
    trigger: ".panel-5",
    start: "top 0",
    end: "100%",
    scrub: 1,
    pin: true,
    pinSpacing: true
  }
});
