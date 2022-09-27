import './style.scss';
import { gsap } from 'gsap';

// weird-gliches
const tl01 = gsap.timeline()
.from("polygon", {attr:{
	points:"50 350 50 350 250 350 450 350 450 350"
}, duration:1, ease:"bounce"})
// ==================================================
// GSDevTools.create({animation:tl})


// tspan
const tl02 = gsap.timeline()
//moving the e moves the "llo" too
tl02.to(".e", {attr:{
	y:150
}})

//can only rotate around lower left corner (no transform origin)
tl02.to(".o", {attr:{
	rotate:360
}})

//try a stagger on the x. it stinks ;)
//tl.from("tspan", {attr:{x:-100}, stagger:0.1})

// GSDevTools.create({animation:tl})
