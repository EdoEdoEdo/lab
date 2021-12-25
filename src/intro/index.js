import './style.scss'

import gsap from 'gsap'

// gsap.defaults({duration:1});
gsap.to('.dots .dot', {rotate: 360, stagger: {amount: 1}});

let animation = gsap.timeline()
  .to('.ball', {scale:3, rotation:360, duration:1, repeat: -1, yoyo: true, ease: "slow(0.7, 0.7, false)"})
  .add('test')
  .to('.container', {opacity: 0, duration: 2})
  .to('body', {backgroundColor: '#ffffff'})
  .to('.container', {display: 'none'})

// controls
document.addEventListener('click', function (event) {
  if (event.target.matches('button')) {
    event.target.focus()
  }
})


let tween = gsap.to(".ball-ctrl", {duration:3, scale:6, ease:"linear", paused:true});


document.getElementById("play").onclick = ()=> tween.play();
document.getElementById("pause").onclick = ()=> tween.pause();
document.getElementById("reverse").onclick = ()=> tween.reverse();
document.getElementById("restart").onclick = ()=> tween.restart();

document.getElementById("test").onclick = ()=> animation.play('test');
