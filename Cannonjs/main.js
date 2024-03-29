import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import * as CANNON from 'cannon-es';


const renderer = new THREE.WebGLRenderer();
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
const controls = new OrbitControls(camera, renderer.domElement);

camera.position.set(0,30,20);
renderer.setSize(window.innerWidth, window.innerHeight);  
document.body.appendChild(renderer.domElement);
//create Ground
const groundGeo = new THREE.PlaneGeometry(30,30);
const groundMat = new THREE.MeshBasicMaterial({
    color:0xffffff,
    side:THREE.DoubleSide,
    wireframe:true,
});
const groundMesh = new THREE.Mesh(groundGeo,groundMat);
scene.add(groundMesh);

//cannon world
const world = new CANNON.World({
    gravity: new CANNON.Vec3(0,-9.81,0),

});

const groundBody = new CANNON.Body({
    shape: new CANNON.Plane(),
    type: CANNON.Body.STATIC,
    // mass:0,
})

world.addBody(groundBody);
groundBody.quaternion.setFromEuler(-Math.PI/2, 0,0)
const timeStep = 1/60;

function animate() {
    world.step(timeStep)
    requestAnimationFrame(animate);
    groundMesh.position.copy(groundBody.position)
    groundMesh.quaternion.copy(groundBody.quaternion)


    controls.update();
    renderer.render(scene, camera);
}
animate();

window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
});