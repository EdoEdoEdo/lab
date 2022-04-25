
import './style.scss';
import gsap from 'gsap'



function init() {
	gsap.set("body", {opacity:1})

  let t = gsap.to(".bar",
	{xPercent:-100,
	 ease:"power1.inOut",
	 duration:0.8,
	 	stagger:{
			each:0.08,
			from:"end",
			ease:"power1.in"
		}
	}
)
}

window.addEventListener('load', (event) => {
  console.log('page is fully loaded');
});

document.querySelector('button').addEventListener('click', (event) => {
  init()
});




