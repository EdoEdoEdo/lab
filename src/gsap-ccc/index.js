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

// char by char
const chars = gsap.utils.toArray("#text path")
const tl03 = gsap.timeline()
//reveal text
.from(chars, {opacity:0, duration:0.1, stagger:0.05})
.from(chars, {scale:0.5, ease:"elastic", duration:1.2,transformOrigin:"50% 50%", stagger:0.05}, 0)

//squash and jump
.set(chars, {transformOrigin:"0% 100%"  })
.to(chars, {keyframes:{
		"20%":{scaleY:0.2, y:0},
	   "50%":{scaleY:1.3, y:-100, ease:"sine.out"},
	   "80%":{scaleY:1, y:0, ease:"sine.in"},
		"82%":{scaleY:0.5, y:0, ease:"sine.out"},
		"100%":{scaleY:1, y:0, ease:"back(2)"},

	},
	duration:1,
	stagger:0.02
})


//skew and remove
.to(chars, {skewX:30, x:-20, duration:0.3, ease:"power1.inOut"})
.to(chars, {transformOrigin:"50% 50%", skewX:-30, scale:1.5, x:"+=550",ease:"power1.in", duration:0.25,stagger:{
	each:0.02,
	from:"end"
}})
// GSDevTools.create({animation:tl})

// char by char
gsap.set(".demo", {opacity:1})
const chars2 = gsap.utils.toArray("#myText text")
const tl04 = gsap.timeline()
.from(chars2, {opacity:0, duration:0.1, stagger:0.05})
.from(chars2, {scale:0.5, duration:1.2, stagger:0.05, transformOrigin:"50% 50%", ease:"elastic"}, 0)

//squash and jump
.set(chars2, {transformOrigin:"0% 75%"  })
.to(chars2, {keyframes:{
		"20%":{scaleY:0.2, y:0},
	   "50%":{scaleY:1.3, y:-100, ease:"sine.out"},
	   "80%":{scaleY:1, y:0, ease:"sine.in"},
		"82%":{scaleY:0.5, y:0, ease:"sine.out"},
		"100%":{scaleY:1, y:0, ease:"back(2)"},

	},
	duration:1,
	stagger:0.02
})


//skew and remove
.to(chars2, {skewX:30, x:-20, duration:0.3, ease:"power1.inOut"})
.to(chars2, {transformOrigin:"50% 50%", skewX:-30, scale:1.5, x:580,ease:"power1.in", duration:0.25,stagger:{
	each:0.02,
	from:"end"
}})


GSDevTools.create({animation:tl})








