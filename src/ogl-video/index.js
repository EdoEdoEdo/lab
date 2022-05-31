import './style.scss';
import { Renderer, Camera, Transform, Texture, TextureLoader, Program, Geometry, Mesh, Box } from 'ogl';

const vertex = /* glsl */ `
    attribute vec2 uv;
    attribute vec3 position;
    attribute vec3 normal;
    uniform mat4 modelViewMatrix;
    uniform mat4 projectionMatrix;
    uniform mat3 normalMatrix;
    varying vec2 vUv;
    varying vec3 vNormal;
    void main() {
        vUv = uv;
        vNormal = normalize(normalMatrix * normal);

        gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
    }
`;

const fragment = /* glsl */ `
    precision highp float;
    uniform sampler2D tMap;
    varying vec2 vUv;
    varying vec3 vNormal;
    void main() {
        vec3 normal = normalize(vNormal);
        vec3 tex = texture2D(tMap, vUv).rgb;

        vec3 light = normalize(vec3(0.5, 1.0, -0.3));
        float shading = dot(normal, light) * 0.15;

        gl_FragColor.rgb = tex + shading;
        gl_FragColor.a = 1.0;
    }
`;

{
    const renderer = new Renderer({ dpr: 2 });
    const gl = renderer.gl;
    document.body.appendChild(gl.canvas);
    gl.clearColor(1, 1, 1, 1);

    const camera = new Camera(gl, { fov: 45 });
    camera.position.set(3, 1.5, 4);
    camera.lookAt([1, 0.2, 0]);

    function resize() {
        renderer.setSize(window.innerWidth, window.innerHeight);
        camera.perspective({ aspect: gl.canvas.width / gl.canvas.height });
    }
    window.addEventListener('resize', resize, false);
    resize();

    const scene = new Transform();

    const videoGeometry = new Box(gl, { width: 1.78, height: 1, depth: 1.78 });

    // Init empty texture while source loading
    const videoTexture = new Texture(gl, {
        generateMipmaps: false,
        width: 1024,
        height: 512,
    });

    // Create video with attributes that let it autoplay
    // Check update loop to see when video is attached to texture
    let video = document.createElement('video');
    video.src = 'ogl/laputa.mp4';

    // Disclaimer: video autoplay is a confusing, constantly-changing browser feature.
    // The best approach is to never assume that it will work, and therefore prepare for a fallback.
    // Tested on mac: Chrome, Safari, Firefox; android: chrome
    video.loop = true;
    video.muted = true;
    video.play();

    // TODO: test ios. Possible add following
    // video.setAttribute('crossorigin', 'anonymous');
    // video.setAttribute('webkit-playsinline', true);
    // video.setAttribute('playsinline', true);

    const videoProgram = new Program(gl, {
        vertex,
        fragment,
        uniforms: {
            tMap: { value: videoTexture },
        },
        cullFace: null,
    });
    const videoMesh = new Mesh(gl, {
        geometry: videoGeometry,
        program: videoProgram,
    });
    videoMesh.position.set(0, 0.5, -4);
    videoMesh.scale.set(1.5);
    videoMesh.setParent(scene);

    requestAnimationFrame(update);
    function update(t) {
        requestAnimationFrame(update);

        // Attach video and/or update texture when video is ready
        if (video.readyState >= video.HAVE_ENOUGH_DATA) {
            if (!videoTexture.image) videoTexture.image = video;
            videoTexture.needsUpdate = true;
        }

        videoMesh.rotation.y += 0.003;
        renderer.render({ scene, camera });
    }
}
