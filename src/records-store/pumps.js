// from: https://codepen.io/mnmxmx/pen/PpdjPO?editors=0011

import * as THREE from 'three'
import * as dat from 'dat.gui'

class SetWebgl {
  constructor(props) {
    this.props = props;
    this.init();
  }

  init() {
    var props = this.props;
    this.scene = new THREE.Scene();
    this.camera = new THREE.PerspectiveCamera(45, props.width / props.height, .1, 10000);
    var cameraZ = (this.props.height * props.camera.z) / Math.tan((45 * Math.PI / 180) / 2);
    this.camera.aspect = props.width / props.height;
    this.camera.position.set(props.camera.x, props.camera.y, cameraZ);
    this.camera.lookAt(this.scene.position);

    var wrapper = document.getElementById("wrapper");
    this.renderer = new THREE.WebGLRenderer({
      antialias: true
    });

    this.renderer.setPixelRatio(props.pixelRatio);
    this.renderer.setClearColor(props.clearColor);

    this.renderer.setSize(props.width, props.height);

    wrapper.appendChild(this.renderer.domElement);
    this.renderer.domElement.style.width = props.width + "px";
    this.renderer.domElement.style.height = props.height + "px";

    // var orbit = new THREE.OrbitControls(this.camera, this.renderer.domElement);
    // orbit.enableZoom = false;

    // this.stats = new Stats();
    // var div = document.getElementById("stats");
    // div.appendChild(this.stats.domElement);
    renderWatch.register(this);

    window.onresize = function() {
      var width = document.body.clientWidth;
      var height = window.innerHeight;
      this.renderer.setSize(width, height);
      this.camera.aspect = width / height;
      var cameraZ = (height * props.camera.z) / Math.tan((45 * Math.PI / 180) / 2);
      this.camera.position.set(props.camera.x, props.camera.y, cameraZ);
      this.camera.lookAt(this.scene.position);
      this.camera.updateProjectionMatrix();
    }.bind(this);
  }

  render() {
    // this.stats.begin();
    this.renderer.render(this.scene, this.camera);
    // this.stats.end();
  }
}

class CreateObj {
  constructor(webgl, props) {
    this.webgl = webgl;
    this.props = props;
    this.spectrumsNumArray = [];

    this.init();
  }

  init() {
    this._x = this.props.x + this.props.density * 2;
    this.mergedW = this.mergedH = (this.props.width + this._x) / this._x;

    this.objNum = Math.pow(this.mergedW, 2);

    this.snoise = [
      //
      // Description : Array and textureless GLSL 2D/3D/4D simplex
      //               noise functions.
      //      Author : Ian McEwan, Ashima Arts.
      //  Maintainer : stegu
      //     Lastmod : 20110822 (ijm)
      //     License : Copyright (C) 2011 Ashima Arts. All rights reserved.
      //               Distributed under the MIT License. See LICENSE file.
      //               https://github.com/ashima/webgl-noise
      //               https://github.com/stegu/webgl-noise
      //
      "vec3 mod289(vec3 x) {",
      "return x - floor(x * (1.0 / 289.0)) * 289.0;",
      "}",

      "vec4 mod289(vec4 x) {",
      "return x - floor(x * (1.0 / 289.0)) * 289.0;",
      "}",

      "vec4 permute(vec4 x) {",
      "return mod289(((x*34.0)+1.0)*x);",
      "}",

      "vec4 taylorInvSqrt(vec4 r)",
      "{",
      "return 1.79284291400159 - 0.85373472095314 * r;",
      "}",

      "float snoise(vec3 v)",
      "{",
      "const vec2  C = vec2(1.0/6.0, 1.0/3.0);",
      "const vec4  D = vec4(0.0, 0.5, 1.0, 2.0);",

      // First corner
      "vec3 i  = floor(v + dot(v, C.yyy) );",
      "vec3 x0 =   v - i + dot(i, C.xxx) ;",

      // Other corners
      "vec3 g = step(x0.yzx, x0.xyz);",
      "vec3 l = 1.0 - g;",
      "vec3 i1 = min( g.xyz, l.zxy );",
      "vec3 i2 = max( g.xyz, l.zxy );",

      "vec3 x1 = x0 - i1 + C.xxx;",
      "vec3 x2 = x0 - i2 + C.yyy;",
      "vec3 x3 = x0 - D.yyy;",

      // Permutations
      "i = mod289(i);",
      "vec4 p = permute( permute( permute(",
      "i.z + vec4(0.0, i1.z, i2.z, 1.0 ))",
      "+ i.y + vec4(0.0, i1.y, i2.y, 1.0 ))",
      "+ i.x + vec4(0.0, i1.x, i2.x, 1.0 ));",

      // Gradients: 7x7 points over a square, mapped onto an octahedron.
      // The ring size 17*17 = 289 is close to a multiple of 49 (49*6 = 294)
      "float n_ = 0.142857142857;", // 1.0/7.0
      "vec3  ns = n_ * D.wyz - D.xzx;",

      "vec4 j = p - 49.0 * floor(p * ns.z * ns.z);", //  mod(p,7*7)

      "vec4 x_ = floor(j * ns.z);",
      "vec4 y_ = floor(j - 7.0 * x_ );", // mod(j,N)

      "vec4 x = x_ *ns.x + ns.yyyy;",
      "vec4 y = y_ *ns.x + ns.yyyy;",
      "vec4 h = 1.0 - abs(x) - abs(y);",

      "vec4 b0 = vec4( x.xy, y.xy );",
      "vec4 b1 = vec4( x.zw, y.zw );",

      "vec4 s0 = floor(b0)*2.0 + 1.0;",
      "vec4 s1 = floor(b1)*2.0 + 1.0;",
      "vec4 sh = -step(h, vec4(0.0));",

      "vec4 a0 = b0.xzyw + s0.xzyw*sh.xxyy;",
      "vec4 a1 = b1.xzyw + s1.xzyw*sh.zzww;",

      "vec3 p0 = vec3(a0.xy,h.x);",
      "vec3 p1 = vec3(a0.zw,h.y);",
      "vec3 p2 = vec3(a1.xy,h.z);",
      "vec3 p3 = vec3(a1.zw,h.w);",

      //Normalise gradients
      "vec4 norm = taylorInvSqrt(vec4(dot(p0,p0), dot(p1,p1), dot(p2, p2), dot(p3,p3)));",
      "p0 *= norm.x;",
      "p1 *= norm.y;",
      "p2 *= norm.z;",
      "p3 *= norm.w;",

      // Mix final noise value
      "vec4 m = max(0.6 - vec4(dot(x0,x0), dot(x1,x1), dot(x2,x2), dot(x3,x3)), 0.0);",
      "m = m * m;",
      "return 42.0 * dot( m*m, vec4( dot(p0,x0), dot(p1,x1), dot(p2,x2), dot(p3,x3) ) );",
      "}",
    ];

    this.createShape();

  }

  createShape() {
    this.shapeOriginalG = new THREE.BoxBufferGeometry(this.props.x, this.props.y, this.props.z);
    this.createEdge();

    this.shapeInstanceG = new THREE.InstancedBufferGeometry();

    // 頂点
    var vertices = this.shapeOriginalG.attributes.position.clone();
    this.shapeInstanceG.addAttribute("position", vertices);

    // uv
    var uvs = this.shapeOriginalG.attributes.uv.clone();
    this.shapeInstanceG.addAttribute("uv", uvs);

    // index
    var indices = this.shapeOriginalG.index.clone();
    this.shapeInstanceG.setIndex(indices);

    var translations = new THREE.InstancedBufferAttribute(new Float32Array(this.objNum * 3), 3, false);

    for (var i = 0, _depth = this.mergedH; i < _depth; i++) {
      for (var j = 0, _width = this.mergedW; j < _width; j++) {
        var num = j + _width * i;

        var translateX = j * this._x - this.props.width / 2,
          translateY = 0,
          translateZ = i * this._x - this.props.width / 2;
        translations.setXYZ(num, translateX, translateY, translateZ);
      }
    }

    this.shapeInstanceG.addAttribute("aTranslation", translations);

    var noises = new THREE.InstancedBufferAttribute(new Float32Array(this.objNum), 1, false);
    var audioSpectrums = new THREE.InstancedBufferAttribute(new Float32Array(this.objNum), 1, false);

    var noises_edge = new THREE.InstancedBufferAttribute(new Float32Array(this.objNum), 1, false);
    var audioSpectrums_edge = new THREE.InstancedBufferAttribute(new Float32Array(this.objNum), 1, false);

    var frequencyMaxNum = 255;
    for (var i = 0, len = noises.count; i < len; i++) {
      var perX = translations.array[i * 3];
      var perZ = translations.array[i * 3 + 2];

      // var _noiseValue = noise.simplex2(perX / 30, perZ / 30);
      var _noiseValue = 1;

      var noiseValue = Math.random() * _noiseValue;

      var num255 = Math.floor(_noiseValue * frequencyMaxNum);
      this.spectrumsNumArray.push(Math.abs(num255));
      noises.setX(i, noiseValue);
      noises_edge.setX(i, noiseValue);
    }

    this.shapeInstanceG.addAttribute("aNoise", noises);
    this.shapeInstanceG.addAttribute("aAudio", audioSpectrums);

    this.edgeInstanceG.addAttribute("aNoise", noises_edge);
    this.edgeInstanceG.addAttribute("aAudio", audioSpectrums_edge);

    var uniforms = {
      uColor: {
        value: new THREE.Color(this.props.basicColor)
      },
      uTick: {
        type: "f",
        value: 0
      },
      uAudioAvr: {
        type: "f",
        value: 0
      }
    };

    this.tick_1 = uniforms["uTick"];
    this.audioAvr_1 = uniforms["uAudioAvr"];
    this.basicColor = uniforms["uColor"];

    this._vs_shape_1 = [
      "uniform float uTick;",
      "uniform float uAudioAvr;",

      "attribute vec3 aTranslation;",
      "attribute float aNoise;",
      "attribute float aAudio;",
      "varying float vNoise;",
      "varying vec3 vTranslation;",

      "const float WIDTH = " + this.props.width + ".0;"
    ];

    this._vs_shape_2 = [
      "void main(){",
      "vNoise = aNoise;",
      "vTranslation = aTranslation;",

      "float t = uTick * 0.003;",

      "vec2 st = (aTranslation.xz * 20.0) / vec2(WIDTH);",

      "float dh = snoise(vec3(0.3 * st.x, 0.2 * st.y, t));",

      "float audio = aAudio / 255.0;",
      "float noise = abs(aNoise);",

      "float scale = step(0.25, noise) * noise * 3.0 + audio * 12.0 * (1.0 + uAudioAvr / 200.0);",
      "vec3 newPos = scale * position + aTranslation + vec3(0.0, aNoise * 450.0, 0.0);",

      "newPos.y += audio * WIDTH * 0.3 + dh * 170.0 + uAudioAvr * (audio + 1.0 + uAudioAvr / 255.0);",
      "float alpha = t * (1.0 - step(0.1, noise)) * (0.12 + aNoise * 2.0) * 3.0 + t * aNoise;",
      "vec2 trigs = vec2(cos(alpha), sin(alpha));",
      "newPos.zx = mat2(trigs.x, trigs.y, -trigs.y, trigs.x) * newPos.zx;",

      "gl_Position = projectionMatrix * modelViewMatrix * (vec4(newPos, 1.0 ));",
      "}"
    ];

    this.vs_shape = this._vs_shape_1.concat(this.snoise.concat(this._vs_shape_2));

    this.fs_shape = [
      "uniform float uTick;",

      "uniform vec3 uColor;",
      "varying float vNoise;",
      "varying vec3 vTranslation;",

      "const float PI = 3.1415926;",
      "const float R120 = 2.0 * PI / 3.0;",
      "const float RATIO = 0.8;",
      "const float WIDTH = " + this.props.width + ".0;",

      "void main(){",

      "float noise = abs(vNoise);", // 0.0 ~ 1.0

      "vec3 _color;",
      "_color = vec3(uColor.x, uColor.y, uColor.z);",
      // "if(noise < 0.3){",
      // "_color = uColor;",
      // "} else if(noise < 0.6){",
      // "_color = vec3(uColor.z, uColor.x, uColor.y);",
      // "} else {",
      // "_color = vec3(uColor.x, uColor.z, uColor.y);",
      // "}",

      // "_color += noise * 0.8;",

      "float posColor = (vTranslation.x * (1.0 + noise) + vTranslation.z * (1.0 + noise) + WIDTH) * 0.3 / (2.0 * WIDTH);",
      "posColor = min(0.7 * 0.3, posColor);",
      "float time = uTick * 0.005 - vNoise * 2.0;",

      "float sinX = (sin(time + R120 ) + 1.0) / 3.0 * RATIO;",
      "float sinY = (sin(time ) + 1.0) / 3.0 * RATIO;",
      "float sinZ = (sin(time - R120) + 1.0) / 3.0 * RATIO;",

      // "_color.r += noise * 0.7 + posColor;",
      // "_color.b -= vNoise * 0.4 + posColor * 2.0;",
      // "_color.g -= vNoise * 0.3 + posColor * 2.0;",

      // "_color += vec3(sinX, sinY, sinZ);",

      "gl_FragColor = vec4(_color, 1.0);",
      "}"
    ];

    this.shapeM = new THREE.ShaderMaterial({
      uniforms: uniforms,
      vertexShader: this.vs_shape.join("\n"),
      fragmentShader: this.fs_shape.join("\n"),
      shading: THREE.FlatShading,
      side: THREE.DoubleSide,
    });

    this.edgeMesh = new THREE.LineSegments(this.edgeInstanceG, this.edgeM);
    this.webgl.scene.add(this.edgeMesh);

    this.shapeMesh = new THREE.Mesh(this.shapeInstanceG, this.shapeM);
    this.webgl.scene.add(this.shapeMesh);

    renderWatch.register(this);
  }

  createEdge() {
    // edge型設定
    this.edgesOriginalG = new THREE.EdgesGeometry(this.shapeOriginalG);

    this.edgeInstanceG = new THREE.InstancedBufferGeometry();

    // 頂点
    var vertices = this.edgesOriginalG.attributes.position.clone();
    this.edgeInstanceG.addAttribute("position", vertices);

    var translations = new THREE.InstancedBufferAttribute(new Float32Array(this.objNum * 3), 3, false);

    for (var i = 0, _depth = this.mergedH; i < _depth; i++) {
      for (var j = 0, _width = this.mergedW; j < _width; j++) {
        var num = j + _width * i;

        var translateX = j * this._x - this.props.width / 2,
          translateY = 0,
          translateZ = i * this._x - this.props.width / 2;

        translations.setXYZ(num, translateX, translateY, translateZ);
      }
    }

    this.edgeInstanceG.addAttribute("aTranslation", translations);

    var uniforms = {
      uColor: {
        value: new THREE.Color(this.props.edgeColor)
      },
      translate: {
        type: "f",
        value: 0
      },
      uTick: {
        type: "f",
        value: 0
      },
      uAudioAvr: {
        type: "f",
        value: 0
      }
    };

    this.tick_2 = uniforms["uTick"];
    this.audioAvr_2 = uniforms["uAudioAvr"];
    this.edgeColor = uniforms["uColor"];

    this.vs_edge_1 = [
      "attribute vec3 aTranslation;",
      "attribute float aNoise;",
      "attribute float aAudio;",
      "uniform float uTick;",
      "uniform float uAudioAvr;",

      "const float WIDTH = " + this.props.width + ".0;",
    ];

    this.vs_edge_2 = [
      "void main(){",

      "float t = uTick * 0.003;",
      "vec2 st = (aTranslation.xz * 20.0) / vec2(WIDTH);",
      "float dh = snoise(vec3(0.3 * st.x, 0.2 * st.y, t));",

      "float audio = aAudio / 255.0;",
      "float noise = abs(aNoise);",

      "float scale = step(0.25, noise) * noise * 3.0 + audio * 12.0 * (1.0 + uAudioAvr / 200.0);",
      "vec3 newPos = scale * position + aTranslation + vec3(0.0, aNoise * 450.0, 0.0);",

      "newPos.y += audio * WIDTH * 0.3 + dh * 170.0 + uAudioAvr * (audio + 1.0 + uAudioAvr / 255.0);",
      "float alpha = t * (1.0 - step(0.1, noise)) * (0.12 + aNoise * 2.0) * 3.0 + t * aNoise;",
      "vec2 trigs = vec2(cos(alpha), sin(alpha));",
      "newPos.zx = mat2(trigs.x, trigs.y, -trigs.y, trigs.x) * newPos.zx;",

      "gl_Position = projectionMatrix * modelViewMatrix * (vec4(newPos, 1.0 ));",
      "}"
    ];

    this.vs_edge = this.vs_edge_1.concat(this.snoise.concat(this.vs_edge_2));

    this.fs_edge = [
      "uniform vec3 uColor;",

      "void main(){",
      "gl_FragColor = vec4(uColor, 1.0);",
      "}"
    ];

    this.edgeM = new THREE.ShaderMaterial({
      uniforms: uniforms,
      vertexShader: this.vs_edge.join("\n"),
      fragmentShader: this.fs_edge.join("\n"),
    });
  }

  render(){
    this.tick_1.value++;
    this.tick_2.value++;
  }
}

class Audio {
  constructor(obj) {
    this.obj = obj;
    this.source;
    this.audioContext = (window.AudioContext) ? new AudioContext : new webkitAudioContext;
    this.fileReader = new FileReader;
    this.init();
    this.isFirst = true;
  }

  init() {
    this.analyser = this.audioContext.createAnalyser();
    this.analyser.fftSize = 2048;
    this.analyser.minDecibels = -70;
    this.analyser.maxDecibels = 20;
    this.analyser.smoothingTimeConstant = .94;

    document.querySelector('.play').addEventListener('click', function(e) {
      fetch('./kalimba.mp3')
        .then(resp => resp.blob())
        .then(blob => this.fileReader.readAsArrayBuffer(blob));
    }.bind(this));

    var _this = this;

    this.fileReader.onload = function() {
      _this.audioContext.decodeAudioData(_this.fileReader.result, function(buffer) {
        if (_this.source) {
          _this.source.stop();
        }
        _this.source = _this.audioContext.createBufferSource();
        _this.source.buffer = buffer;

        _this.source.loop = true;

        _this.source.connect(_this.analyser);

        _this.gainNode = _this.audioContext.createGain();

        _this.source.connect(_this.gainNode);
        _this.gainNode.connect(_this.audioContext.destination);
        _this.source.start(0);

        _this.frequencyArray_s = _this.obj.shapeInstanceG.attributes.aAudio.array;
        _this.frequencyArray_e = _this.obj.edgeInstanceG.attributes.aAudio.array;

        _this.frequencyArrayLength = _this.frequencyArray_s.length;

        _this.orderArray = _this.obj.spectrumsNumArray;

        if(_this.isFirst){
          _this.isFirst = false;
           renderWatch.register(_this);
        }

      });
    };
  }

  render() {

    this.obj.shapeInstanceG.attributes.aAudio.needsUpdate = true;
    this.obj.edgeInstanceG.attributes.aAudio.needsUpdate = true;

    this.spectrums = new Uint8Array(this.analyser.frequencyBinCount);
    this.analyser.getByteFrequencyData(this.spectrums);

    var avr = 0;
    for (var i = 0; i < this.frequencyArrayLength; i++) {
      var orderNum = this.orderArray[i];
      var spectrum = this.spectrums[orderNum + 20];

      avr += spectrum;

      this.frequencyArray_s[i] = spectrum;
      this.frequencyArray_e[i] = spectrum;

    }
    avr /= this.frequencyArrayLength;
    this.obj.audioAvr_1.value = this.obj.audioAvr_2.value = avr;
  }
}

class RenderWatch {
  constructor() {
    this.instances = [];
  }

  register(instance) {
    this.instances.push(instance);
  }

  render() {
    if(this.instances.length === 0) return;
    for (var i = this.instances.length - 1; i >= 0; i--) {
      this.instances[i].render();
    }
  }
}

class ColorCtrls {
  constructor(props1, props2, webgl, obj) {
    var params = {
      bgColor: props1.clearColor,
      basicColor: props2.basicColor,
      edgeColor: props2.edgeColor,
      quality: "middle",
      resetColor: false
    };

    // this.gui = new dat.GUI();

    // this.gui.add(params, "quality", ["high", "middle", "low"]).onFinishChange(function(value) {
    //   var pixelRatio = (value === "high") ? 2 : (value === "low") ? 1 : 1.5;
    //   webgl.renderer.setPixelRatio(pixelRatio);
    // });

    // this.gui.addColor(params, "bgColor").onFinishChange(function(value) {
    //   webgl.renderer.setClearColor(value);
    // });

    // this.gui.close();

    // this.gui.addColor(params, "basicColor").onFinishChange(function(value) {
    //   obj.basicColor.value = new THREE.Color(value);
    // });
    // this.gui.addColor(params, "edgeColor").onFinishChange(function(value) {
    //   obj.edgeColor.value = new THREE.Color(value);
    // });

    // this.gui.add(params, "resetColor").onFinishChange(function(value) {
    //   if (!value) return;
    //   webgl.renderer.setClearColor(props1.clearColor);
    //   obj.edgeColor.value = new THREE.Color(props2.edgeColor);
    // });

  }
}

var renderWatch = new RenderWatch();

window.onload = function() {
  var webglProps = {
    width: document.body.clientWidth,
    height: window.innerHeight,
    camera: {
      x: 0,
      y: 500,
      z: 0.84
    },
    pixelRatio: window.devicePixelRatio > 1 ? 1.5 : 1,
    clearColor: 0x000000 // 0x33cccc
  }

  var objProps = {
    x: 12,
    z: 12,
    y: 12,
    density: 45,
    basicColor: 0x772d8b,
    edgeColor: 0xffffff // 0xaa2391
  }

  objProps.width = (objProps.x + objProps.density * 2) * 12;

  render();
  function render(){
    renderWatch.render();
    requestAnimationFrame(render);
  }

  var webgl = new SetWebgl(webglProps);
  var obj = new CreateObj(webgl, objProps);
  var audio = new Audio(obj);



  var gui = new ColorCtrls(webglProps, objProps, webgl, obj);
};

