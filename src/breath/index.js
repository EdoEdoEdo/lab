import './style.scss';
import { frag } from './frag.js';

import GlslCanvas from 'glslCanvas';

var canvas = document.querySelector("canvas");
var sandbox = new GlslCanvas(canvas);

sandbox.load(frag);
sandbox.setUniform('displacement', 'textures/displacement1.jpg');
