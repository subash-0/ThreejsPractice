import * as THREE from "three"
import { OrbitControls } from "three/examples/jsm/Addons.js";
import * as SkeletonUtils from "three/examples/jsm/utils/SkeletonUtils.js";
const Cow = new URL('../assest/Cow.gltf', import.meta.url);
const Grass = new URL('../assest/Grass_Large_Extruded.gltf', import.meta.url);

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

const ambidientLight= new THREE.AmbientLight(0xffffff, 10);
const directionLight = new THREE.DirectionalLight(0xffffff,20);
scene.add(ambidientLight)
scene.add(directionLight)
const gridHelper = new THREE.GridHelper(20,20);
scene.add(gridHelper)

const planeMesh = new THREE.Mesh(
    new THREE.PlaneGeometry(20,20),
    new THREE.MeshBasicMaterial({color:0xffffff, side: THREE.DoubleSide,visible:false }),
    
);
planeMesh.rotation.x = -Math.PI/2;
scene.add(planeMesh)
planeMesh.name = "ground";

//crating highLight Square as indicating element
const indicatorSquare = new THREE.Mesh(
    new THREE.PlaneGeometry(1,1),
    new THREE.MeshBasicMaterial({color:0xffffff, side: THREE.DoubleSide, transparent:true}),
)

scene.add(indicatorSquare)
indicatorSquare.rotateX(-Math.PI/2)
indicatorSquare.position.set(0.5,0,0.5)

//cr4eating required varibles
const mousePosition = new THREE.Vector2();
const rayCaster = new THREE.Raycaster();
let intersects;

window.addEventListener('mousemove',(e)=>{
    mousePosition.x = (e.clientX / window.innerWidth) *2 -1;
    mousePosition.y = -(e.clientY / window.innerHeight) *2 +1;
    rayCaster.setFromCamera(mousePosition, camera);
    intersects = rayCaster.intersectObjects(scene.children);
    intersects.forEach((intersect)=>{
        if(intersect.object.name === "ground"){
            const indicatingPos = new THREE.Vector3().copy(intersect.point).floor().addScalar(0.5);
            indicatorSquare.position.set(indicatingPos.x, 0 , indicatingPos.z);
            const objectExist = objects.find(function(object){
                return (object.position.x === indicatorSquare.position.x) && (object.position.z === indicatorSquare.position.z);
              })

              if(!objectExist){
                
            indicatorSquare.material.color.setHex(0xffffff);

              }else{
                
            indicatorSquare.material.color.setHex(0xFF0000);
              }
        }
    })
})



const Loader = new GLTFLoader();

let modelObjs;
let clips;
Loader.load(Cow.href,(gltf)=>{
    const model = gltf.scene;
    // scene.add(model)
  
    model.scale.set(0.3,0.3,0.1);
    modelObjs = model;
     
     clips = gltf.animations;
    
    console.log(clips)
    // clips.forEach((e)=>{
    //     const action = mixer.clipAction(e);
    //     action.play();
    // })
 
}, undefined, (error)=>{
    console.log(error)
})

Loader.load(Grass.href,(gltf)=>{
    const model = gltf.scene;
    scene.add(model)
 
}, undefined, (error)=>{
    console.log(error)
})

// const sphereMesh = new THREE.Mesh(
//     new THREE.SphereGeometry(0.4,4,2),
//     new THREE.MeshBasicMaterial({
//       wireframe:true,
//       color: 0xFFEA00,
//     })
//   )

  const objects = [];
  const mixers = [];
  window.addEventListener('mousedown',(e)=>{
    const objectExist = objects.find(function(object){
      return (object.position.x === indicatorSquare.position.x) && (object.position.z === indicatorSquare.position.z);
    })
    if(!objectExist){
    intersects.forEach(function(intersect){
      if(intersect.object.name==='ground'){
        console.log(indicatorSquare.position)
            console.log(indicatorSquare.position.x)
          const modelClone = SkeletonUtils.clone(modelObjs);
          modelClone.position.copy(indicatorSquare.position)
          scene.add(modelClone);
          objects.push(modelClone);
          let clip;
          const  mixer = new THREE.AnimationMixer(modelClone);
          if(Math.abs((indicatorSquare.position.x+0.5)%2)===0){
            clip =  THREE.AnimationClip.findByName(clips,"Walk");    
          }else {
                clip =  THREE.AnimationClip.findByName(clips,"Gallop");
                }
          const action = mixer.clipAction(clip);
          action.play();
          mixers.push(mixer);

         indicatorSquare.material.color.setHex(0xFF0000);
      }
    })
  }
  })

const clock = new THREE.Clock();
function animate(time){
    requestAnimationFrame(animate)
    indicatorSquare.material.opacity = 1+ Math.sin(time/200)
    let delta =clock.getDelta();
   mixers.forEach((mixer)=>{
    mixer.update(delta);
   })
       
    renderer.render(scene,camera)
}

animate();

window.addEventListener('resize',(e)=>{
camera.aspect = window.innerWidth / window.innerHeight;
camera.updateProjectionMatrix();
renderer.render(scene,camera); 
})