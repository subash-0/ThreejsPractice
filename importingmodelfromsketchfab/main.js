import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/Addons.js'
import { GLTFLoader, RGBELoader } from 'three/examples/jsm/Addons.js';
const renderer = new THREE.WebGLRenderer({antialias:true});
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement)
renderer.setClearColor(0xA3A3A3);
const camera = new THREE.PerspectiveCamera(
  45,
  window.innerWidth / window.innerHeight,
  0.01,
  1000
)

camera.position.set(6,6,6);
const scene = new THREE.Scene();
const orbit = new OrbitControls(camera, renderer.domElement);
orbit.update();

const gridHelper =new THREE.GridHelper(30,30);
scene.add(gridHelper)
const loadingManager = new THREE.LoadingManager();
const progressBar = document.getElementById('progress-bar');

loadingManager.onProgress =(url, loaded, total)=>{
    progressBar.value = (loaded / total)*100;
}
const containerProgress = document.querySelector('#app');
loadingManager.onLoad = (url, loaded, tatol)=>{
  containerProgress.style.display = "none"
}
const reflectionLoader = new RGBELoader(loadingManager);
const modelLoader = new GLTFLoader(loadingManager);


let car;
renderer.toneMapping = THREE.ACESFilmicToneMapping;
renderer.toneMappingExposure = 4;


reflectionLoader.load("./assests/MR_INT-005_WhiteNeons_NAD (1).hdr",(texture)=>{
  texture.mapping = THREE.EquirectangularReflectionMapping;
  scene.environment = texture;
  modelLoader.load('./assests/porshe_911/scene.gltf',(gltf)=>{
    const model = gltf.scene;
    scene.add(model)
    car = model;
  })
})
function animate(time){
  requestAnimationFrame(animate)
  if(car)
  car.rotation.y =  time/3000;
  renderer.render(scene, camera)

}

animate();


window.addEventListener('resize',(e)=>{
  camera.aspect = window.innerWidth / window.innerHeight,
  camera.updateProjectionMatrix();
  renderer.render(scene,camera)

})