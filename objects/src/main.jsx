import * as THREE from 'three';
import {OrbitControls} from "three/examples/jsm/controls/OrbitControls";

const renderer = new THREE.WebGLRenderer();

renderer.setSize(window.innerWidth, window.innerHeight);

document.body.appendChild(renderer.domElement);

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(
      45,
      window.innerWidth / window.innerHeight,
      0.1,
      1000
);

const orbit = new OrbitControls(camera,renderer.domElement);
camera.position.set(0,6,6);

orbit.update();

const ambidientLight = new THREE.DirectionalLight(0xFFFFFF,0.8);
scene.add(ambidientLight);
ambidientLight.position.set(0,50,0);
const helper = new THREE.AxesHelper(20);
scene.add(helper);

const mousePos = new THREE.Vector2();
const instersectionPoint = new THREE.Vector3();
const normalPlane = new THREE.Vector3();
const plane = new THREE.Plane();
const rayCaster = new THREE.Raycaster();
window.addEventListener('mousemove',(e)=>{
  mousePos.x = (e.clientX / window.innerWidth)*2 -1;
  mousePos.y = -(e.clientY / window.innerHeight) +1;
  normalPlane.copy(camera.position).normalize();
  plane.setFromNormalAndCoplanarPoint(normalPlane,scene.position);
  rayCaster.setFromCamera(mousePos, camera);
  rayCaster.ray.intersectPlane(plane, instersectionPoint);
})

window.addEventListener('click',(e)=>{
  const sphereGeo = new THREE.SphereGeometry(0.125,30,30);
  const sphereMat = new THREE.MeshStandardMaterial({
    color: 'yellow',
    metalness:0,
    roughness:0,
  })
  const sphereMesh = new THREE.Mesh(sphereGeo,sphereMat);
  scene.add(sphereMesh);
  sphereMesh.position.copy(instersectionPoint);
})


function animate(){
  requestAnimationFrame(animate);
  renderer.render(scene,camera);
}
animate();

window.addEventListener('resize',()=>{
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
  
})