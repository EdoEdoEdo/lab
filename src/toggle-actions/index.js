import './style.scss'
import gsap from 'gsap'
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

gsap.defaults({ x: 400 - 20, duration: 1 });

gsap.to(".ball-1", {
  scrollTrigger: {
    trigger: ".ball-1",
    start: "top 75%"
  }
});

gsap.to(".ball-2", {
  scrollTrigger: {
    trigger: ".ball-2",
    start: "top 75%",
    toggleActions: "restart pause resume pause"
  }
});

gsap.to(".ball-3", {
  scrollTrigger: {
    trigger: ".ball-3",
    start: "top 75%",
    toggleActions: "play complete reverse reset"
  }
});

gsap.to(".ball-4", {
  scrollTrigger: {
    trigger: ".ball-4",
    start: "top 75%",
    toggleActions: "play pause resume pause"
  }
});
