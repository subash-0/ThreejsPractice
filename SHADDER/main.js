import * as  THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';

const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

renderer.setClearColor(0xffffff);

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 1000);


const orbit = new OrbitControls(camera, renderer.domElement);
const uniforms={
		
	u_time :{type:'f', value:0.0}

}


const geometry = new THREE.PlaneGeometry(10, 10, 30, 30);
const material = new THREE.ShaderMaterial( {
	uniforms:uniforms,
	vertexShader: document.getElementById( 'vertexShader' ).textContent,
	fragmentShader: document.getElementById( 'fragmentShader' ).textContent,

	wireframe:true

} );
const plane = new THREE.Mesh(geometry, material);
scene.add(plane);
camera.position.set(6, 8, 14);
orbit.update();

const clock = new THREE.Clock();


function animate() {
	uniforms.u_time.value = clock.getElapsedTime();
 renderer.render(scene,camera)
}
renderer.setAnimationLoop(animate);

window.addEventListener('resize', () => {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
} );