precision highp float;

uniform float uAlpha;
uniform sampler2D tMap;
uniform sampler2D tMask;

varying vec2 vUv;

void main()	{
  vec4 color = texture2D(tMap, vUv);
  vec4 mask = texture2D(tMask, vUv);

  color.a *= uAlpha * mask.r;
  // color.a *= uAlpha;

  gl_FragColor = color;
  // gl_FragColor = vec4(1.0, 0.0, 0.0, 1.0);
}
