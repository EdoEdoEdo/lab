import './style.scss';
import { Howl, Howler } from 'howler'
import Tick from './tick.mp3'

const tick = new Howl({
  src: Tick,
  autoplay: false,
  loop: false,
  volume: 0.4
})

const links = document.querySelectorAll('.link');
links.forEach(link => {
  link.addEventListener('mouseenter', () => {
    // unselect all the links
    links.forEach(link => {
      link.classList.remove('active');
    })
    // select the link
    link.classList.add('active');
    // play the sound
    tick.play();
  })
})
