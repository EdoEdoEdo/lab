import './style.scss';
import { gsap } from 'gsap';

// weird-gliches
const tl = gsap.timeline()
.from("polygon", {attr:{
	points:"50 350 50 350 250 350 450 350 450 350"
}, duration:1, ease:"bounce"})
// ==================================================
// GSDevTools.create({animation:tl})
