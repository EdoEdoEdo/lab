import { includes } from './includes.js';

export const frag = `

  ${includes}

  uniform float time;
  uniform float lightStrength;
  uniform float saturation;
  uniform float brightness;
  uniform float gradientMix;
  uniform float seed;
  uniform vec2 mouse;

  varying vec3 v_position;
  varying vec3 v_normal;
  varying vec2 v_uv;
  varying float v_radius;
  varying mat3 v_rotation;

  struct Light {
    vec3 position;
    vec3 color;
  };

  struct Hue {
    float s;
    float e;
    float speed;
  };

  vec3 addLight(Light l) {
    // get the surface directions
    vec3 dx = dFdx(v_position);
    vec3 dy = dFdy(v_position);

    // get new arrow pointing away from the surface
    vec3 newNormal = normalize(cross(dx, dy));

    // mix the old and new normals
    vec3 N = mix(v_normal, newNormal, 0.1);

    // ambient color
    float ambientStrength = 0.9;
    vec3 ambientColor = ambientStrength * l.color;

    // deffuse color
    vec3 L = normalize(l.position - v_position);
    float deffuseScore = max(dot(L, N), 0.0);

    vec3 deffuseColor = deffuseScore * l.color;

    return ambientColor + deffuseColor;
  }

  float createNoise(float level) {
    vec3 wind = vec3(
      fbm(v_position * inverse(v_rotation) * level + time * 0.1 + seed),
      fbm(v_position * inverse(v_rotation) * level + time * 0.2 - seed),
      fbm(v_position * inverse(v_rotation) * level + time * 0.3 + seed)
    );

    return fbm(v_position * inverse(v_rotation) * level + wind + seed);
  }

  vec3 createColor(Hue h) {
    vec3 hsv1 = vec3(h.s + h.speed * time + seed, saturation, brightness);
    vec3 hsv2 = vec3(h.e + h.speed * time + seed, saturation, brightness);

    vec3 rgb1 = hsv2rgb(hsv1);
    vec3 rgb2 = hsv2rgb(hsv2);

    float n = createNoise(gradientMix);

    return mix(rgb1, rgb2, n);
  }

  void main (){

    Light l = Light(
      vec3(mouse.x * 5.0, mouse.y * 5.0, 5.0) * inverse(v_rotation),
      vec3(lightStrength)
    );

    Hue hue1 = Hue(0.0, 0.3, 0.1);
    Hue hue2 = Hue(0.3, 0.6, 0.02);
    Hue hue3 = Hue(0.7, 0.9, 0.03);

    vec3 color1 = createColor(hue1);
    vec3 color2 = createColor(hue2);
    vec3 color3 = createColor(hue3);

    float mixer1 = smoothstep(0.2, 0.7, createNoise(gradientMix - 0.05));
    float mixer2 = smoothstep(0.3, 0.7, createNoise(gradientMix + 0.05));

    vec3 objectColor = mix(color1, color2, mixer1);
    objectColor = mix(objectColor, color3, mixer2);

    vec3 rgb = addLight(l) * objectColor;

    gl_FragColor = vec4(rgb, 1.0);
  }
`
