import { includes } from './includes.js';

export const vert =  `

  ${includes}

  uniform float time;
  uniform float seed;

  uniform float roundness;
  uniform float roughness;

  varying vec3 v_position;
  varying vec3 v_normal;
  varying vec2 v_uv;
  varying float v_radius;
  varying mat3 v_rotation;

  void main() {
    vec3 newPosition = position;

    float radius = 1.0;

    float noise1 = fbm(0.6 * position + time * 0.1 + seed);
    float noise2 = fbm(2.0 * position + time * 0.05 + seed);

    radius *= mix(1.0 - roundness, 1.0 + roughness, noise1);
    radius *= mix(1.0 - roundness, 1.0 + roughness, noise2);

    newPosition *= radius;

    mat3 rotation = rotation3dY(time * 0.2);

    newPosition *= rotation;

    gl_Position = projectionMatrix * modelViewMatrix * vec4( newPosition, 1.0 );

    v_position = newPosition;
    v_normal = normal;
    v_uv = uv;
    v_radius = radius;
    v_rotation = rotation;
  }

`
