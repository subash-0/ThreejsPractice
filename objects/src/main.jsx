import * as THREE from 'three';
import {OrbitControls} from "three/examples/jsm/controls/OrbitControls";
import * as  CANNON from 'cannon-es';

const renderer = new THREE.WebGLRenderer({antialias:true});

renderer.setSize(window.innerWidth, window.innerHeight);
renderer.shadowMap.enabled = true;
document.body.appendChild(renderer.domElement);

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(
      45,
      window.innerWidth / window.innerHeight,
      0.1,
      1000
);

const orbit = new OrbitControls(camera,renderer.domElement);
camera.position.set(0,10,5);

orbit.update();

const ambidientLight = new THREE.DirectionalLight(0xFFFFFF,5);
scene.add(ambidientLight);
ambidientLight.position.set(-30,50,0);
ambidientLight.castShadow = true;
ambidientLight.shadow.mapSize.set(1024,1024)
// const helper = new THREE.AxesHelper(20);
// scene.add(helper);

//creating physics world
const world = new CANNON.World({
  gravity: new CANNON.Vec3(0,-9.81,0),
});
const mesh =[];
const body = [];
const planePhysMat = new CANNON.Material();
const planeGeo = new THREE.PlaneGeometry(10,10);
const planeMat = new THREE.MeshStandardMaterial({
  color:0xffffff,
  side:  THREE.DoubleSide,
});
const planeMesh = new THREE.Mesh(planeGeo,planeMat);
planeMesh.receiveShadow = true;
scene.add(planeMesh);

const planeBody = new CANNON.Body({
  type: CANNON.Body.STATIC,
  shape: new CANNON.Box( new CANNON.Vec3(5,5,0.0001)),
  material: planePhysMat,
})

planeBody.quaternion.setFromEuler(-Math.PI/2,0,0);
world.addBody(planeBody);

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
const spherePhysMat = new CANNON.Material()
window.addEventListener('click',(e)=>{
  const sphereGeo = new THREE.SphereGeometry(0.125,30,30);
  const sphereMat = new THREE.MeshStandardMaterial({
    color: Math.random() * 0xfffffff,
    metalness:0,
    roughness:0,
  })

  const sphereMesh = new THREE.Mesh(sphereGeo,sphereMat);
  sphereMesh.castShadow = true;
  sphereMesh.receiveShadow = true;
  scene.add(sphereMesh);
  // sphereMesh.position.copy(instersectionPoint);
  const sphereBody = new CANNON.Body({
    mass:0.3,
    shape: new CANNON.Sphere(0.125),
    position: new CANNON.Vec3(instersectionPoint.x, instersectionPoint.y, instersectionPoint.z),
    material: spherePhysMat,
  })
  world.addBody(sphereBody);
  mesh.push(sphereMesh);
  body.push(sphereBody);
})

const planeSphereContact = new CANNON.ContactMaterial(
  planePhysMat,
  spherePhysMat,
  {
    restitution:0.3,
    friction:0,
  }
)
world.addContactMaterial(planeSphereContact)
const timeStep = 1/60;
function animate(){
  world.step(timeStep);
  planeMesh.position.copy(planeBody.position);
  planeMesh.quaternion.copy(planeBody.quaternion);

  for(let i =0; i<mesh.length;i++){
    mesh[i].position.copy(body[i].position);
    mesh[i].quaternion.copy(body[i].quaternion);
  }


  requestAnimationFrame(animate);
  renderer.render(scene,camera);
}
animate();

window.addEventListener('resize',()=>{
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
  
})