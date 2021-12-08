import './style.scss'
import gsap from 'gsap';
import { ScrollTrigger } from "gsap/ScrollTrigger";
import * as THREE from 'three'
import { ObjectLoader } from 'three';


function loadModel()
{
	gsap.registerPlugin(ScrollTrigger);
	// gsap.registerPlugin(DrawSVGPlugin); //TODO
  gsap.set('#line-length', {drawSVG: 0})
	gsap.set('#line-wingspan', {drawSVG: 0})
	gsap.set('#circle-phalange', {drawSVG: 0})

	var object;

	function onModelLoaded() {
		object.traverse( function ( child ) {
			let mat = new THREE.MeshPhongMaterial( { color: 0x171511, specular: 0xD0CBC7, shininess: 5, flatShading: true } );
			child.material = mat;
		});

		setupAnimation(object);
	}

	var manager = new THREE.LoadingManager( onModelLoaded );
	manager.onProgress = ( item, loaded, total ) => console.log( item, loaded, total );

	var loader = new ObjectLoader( manager );
	loader.load( '/airplanes/1405+Plane_1.obj', function ( obj ) { object = obj; });
}

loadModel();

