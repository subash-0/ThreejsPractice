import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import * as CANNON from 'cannon-es';


const renderer = new THREE.WebGLRenderer();
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
const controls = new OrbitControls(camera, renderer.domElement);

camera.position.set(0,40,10);
renderer.setSize(window.innerWidth, window.innerHeight);  
document.body.appendChild(renderer.domElement);
//creating box as object for the ground
const boxGeo = new THREE.BoxGeometry(2,2,2);
const boxMat = new THREE.MeshBasicMaterial({
    color:'red',
    wireframe:true,
});

const boxMesh = new THREE.Mesh(boxGeo,boxMat);
scene.add(boxMesh);

// create a Sphere for another object
const sphereGeo = new THREE.SphereGeometry(3);
const sphereMat = new THREE.MeshBasicMaterial({
    color: 'green',
    wireframe:true,
});
const sphereMesh = new THREE.Mesh(sphereGeo,sphereMat);
scene.add(sphereMesh)
//create Ground
const groundGeo = new THREE.PlaneGeometry(30,30);
const groundMat = new THREE.MeshBasicMaterial({
    color:0xffffff,
    side:THREE.DoubleSide,
    // wireframe:true,
});
const groundMesh = new THREE.Mesh(groundGeo,groundMat);
scene.add(groundMesh);

//cannon world
const world = new CANNON.World({
    gravity: new CANNON.Vec3(0,-9.81,0),

});

const groundBody = new CANNON.Body({
    // shape: new CANNON.Plane(),
    shape: new CANNON.Box(new CANNON.Vec3(15,15,0.1)),
    type: CANNON.Body.STATIC,
    // mass:0,
})

world.addBody(groundBody);
groundBody.quaternion.setFromEuler(-Math.PI/2, 0,0)

// create a body for box mesh using cannon
const boxBody = new CANNON.Body({
    mass:1,
    shape: new CANNON.Box(new CANNON.Vec3(2,2,2)),
    position: new CANNON.Vec3(-8,20,0)
})

boxBody.angularVelocity.set(0,10,0);
boxBody.angularDamping = -0.05;

const sphereBody = new CANNON.Body({
    mass:10,
    shape: new CANNON.Sphere(3),
    position: new CANNON.Vec3(3,15,0.1)
})
sphereBody.linearDamping = 0.09;

// add body to cannon world
world.addBody(boxBody);
world.addBody(sphereBody);
const timeStep = 1/60;

function animate() {
    world.step(timeStep)
    requestAnimationFrame(animate);
    groundMesh.position.copy(groundBody.position)
    groundMesh.quaternion.copy(groundBody.quaternion)
    // merge with mesh of the body
    boxMesh.position.copy(boxBody.position);
    boxMesh.quaternion.copy(boxBody.quaternion);
    sphereMesh.position.copy(sphereBody.position);
    sphereMesh.quaternion.copy(sphereBody.quaternion);

    controls.update();
    renderer.render(scene, camera);
}
animate();

window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
});