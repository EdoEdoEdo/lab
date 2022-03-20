import { includes } from './includes.js';

export const frag = `

  ${includes}

  void main (){
    gl_FragColor = vec4(1.0, 0.0, 1.0, 1.0);
  }
`
