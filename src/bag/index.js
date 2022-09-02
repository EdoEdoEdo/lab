import './style.scss';
import gsap from 'gsap';


const bag = document.querySelector('.square');
bag.addEventListener('mouseenter', () => {
  bag.querySelectorAll('.b').forEach((b, i) => {
    gsap.to(b, {
      duration: 0.3,
      y: -200,
      ease: 'back',
      scale: 1.5,
    });
  });
});

bag.addEventListener('mouseleave', () => {
  bag.querySelectorAll('.b').forEach((b, i) => {
    gsap.to(b, {
      duration: 0.5,
      y: 0,
      ease: 'ease',
      scale: 1,
    });
  });
});
