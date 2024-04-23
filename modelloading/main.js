import * as THREE from "three"
import { GLTFLoader } from "three/examples/jsm/Addons.js";
import { GUI } from "dat.gui";
import { OrbitControls } from "three/examples/jsm/Addons.js";
const fileUrl = new URL('./assests/Donkey.gltf', import.meta.url);
const renderer = new THREE.WebGLRenderer();
const camera = new THREE.PerspectiveCamera(
    45,
    window.innerWidth / window.innerHeight,
    0.01,
    1000
)
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setClearColor(0xfffffff);
document.body.appendChild(renderer.domElement);
camera.position.set(0,5,10);
const scene = new THREE.Scene();

const orbit = new OrbitControls(camera, renderer.domElement)
orbit.update();

const ambientLight = new THREE.AmbientLight(0xededed, 1);
scene.add(ambientLight);

const directionalLight = new THREE.DirectionalLight(0xffffff,2)
scene.add(directionalLight)
// scene.rotation.z=(-Math.PI)
const gridHelper = new THREE.GridHelper(20,20);
scene.add(gridHelper)

const gui = new GUI();

const options = {
    "Main": 0xe00000,
    "Main Light": 0xffffff,
    "Hooves": 0xfffef,
    "Hair": 0x00,
    "Muzzle": 0x7C7C7C,
    "Eye Dark": 0x9d3737,
    "Eye White": 0x7C7C7C,
    "Main Dark": 0xa0404,

}


const modelLoader = new GLTFLoader();
modelLoader.load(fileUrl.href,(gltf)=>{
    const model = gltf.scene;
    // model.rotation.y=(Math.PI)
    console.log(model.getObjectByName("Cube_1"))
    gui.addColor(options, 'Main').onChange((e)=>{
        model.getObjectByName('Cube').material.color.setHex(e);
    })
        gui.addColor(options, 'Main Light').onChange((e)=>{
        model.getObjectByName('Cube_1').material.color.setHex(e);
    })
        gui.addColor(options, 'Main Dark').onChange((e)=>{
        model.getObjectByName('Cube_2').material.color.setHex(e);
    })
        gui.addColor(options, 'Hooves').onChange((e)=>{
        model.getObjectByName('Cube_3').material.color.setHex(e);
    })
        gui.addColor(options, 'Muzzle').onChange((e)=>{
        model.getObjectByName('Cube_5').material.color.setHex(e);
    })
        gui.addColor(options, 'Eye Dark').onChange((e)=>{
        model.getObjectByName('Cube_6').material.color.setHex(e);
    })
        gui.addColor(options, 'Eye White').onChange((e)=>{
        model.getObjectByName('Cube_7').material.color.setHex(e);
    })
    gui.addColor(options, 'Hair').onChange((e)=>{
        model.getObjectByName('Cube_4').material.color.setHex(e);
    })
    
    
    scene.add(model)
}, undefined,(error)=>{
    console.error(error);
});

function animate(){
    requestAnimationFrame(animate)
    renderer.render(scene,camera);
}
animate();




window.addEventListener('resize',(e)=>{
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
})

