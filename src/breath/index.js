import './style.scss';

import GlslCanvas from 'glslCanvas';

var canvas = document.querySelector("canvas");
var sandbox = new GlslCanvas(canvas);

sandbox.load(frag);
sandbox.setUniform('displacement', 'textures/displacement1.jpg');
