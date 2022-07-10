import './style.scss';

import gsap from "gsap";
import Splitting from "splitting";
import throttle from "lodash.throttle";

const elipse = document.querySelector("[data-elipse]");
const trail = document.querySelector("[data-trail]");


/* Cursor */
const onMouseMove = (e) => {
  const { clientX, clientY } = e;
  const x = Math.round((clientX / window.innerWidth) * 100);
  const y = Math.round((clientY / window.innerHeight) * 100);

  gsap.to(elipse, {
    "--x": `${x}%`,
    "--y": `${y}%`,
    duration: 0.3,
    ease: "sine.out",
  });

  gsap.to(trail, {
    "--x": `${x}%`,
    "--y": `${y}%`,
    duration: 0.3,
    ease: "sine.out",
  });
};


window.addEventListener("mousemove", throttle(onMouseMove, 30));
