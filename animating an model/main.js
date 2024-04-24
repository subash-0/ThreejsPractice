import * as THREE from "three"
import { OrbitControls } from "three/examples/jsm/Addons.js"
const Cow = new URL('./assest/Cow.gltf', import.meta.url)
const renderer = new THREE.WebGLRenderer();
import { GLTFLoader } from "three/examples/jsm/Addons.js";
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement)
const camera = new THREE.PerspectiveCamera(
    45,
    window.innerWidth / window.innerHeight,
    0.01,
    1000
);

camera.position.set(2,5,15);

const scene = new THREE.Scene();
const orbit = new OrbitControls(camera, renderer.domElement)
orbit.update()
const ambidientLight= new THREE.AmbientLight(0xffffff, 1);
const directionLight = new THREE.DirectionalLight(0xffffff,2);
scene.add(ambidientLight)
scene.add(directionLight)
const gridHelper = new THREE.GridHelper(20,20);
scene.add(gridHelper)
const Loader = new GLTFLoader();
let mixer;
Loader.load(Cow.href,(gltf)=>{
    const model = gltf.scene;
    scene.add(model)
     mixer = new THREE.AnimationMixer(model)
     const clips = gltf.animations;
    //  const clip =  THREE.AnimationClip.findByName(clips,"Walk");
    //  const action = mixer.clipAction(clip);
    //  action.play();
    clips.forEach((e)=>{
        const action = mixer.clipAction(e);
        action.play();
    })
     
     console.log(clips)

})

const clock = new THREE.Clock();
function animate(){
    requestAnimationFrame(animate)
    if(mixer)
        mixer.update(clock.getDelta());
    renderer.render(scene,camera)
}

animate();

window.addEventListener('resize',(e)=>{
camera.aspect = window.innerWidth / window.innerHeight;
camera.updateProjectionMatrix();
renderer.render(scene,camera); 
})