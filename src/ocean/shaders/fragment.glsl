precision highp float;

uniform vec2 u_resolution;
uniform float u_time;

void main() {
  // gl_FragColor = vec4(0.0, 1.0, 1.0, 1.0);
  // vec2 st = gl_FragCoord.xy/u_resolution;
  // gl_FragColor = vec4(st.x,st.y,0.0,1.0);
  gl_FragColor = vec4(abs(sin(u_time)),0.5,1.0,1.0);
}
