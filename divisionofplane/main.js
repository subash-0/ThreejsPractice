import * as THREE from 'three'
import {OrbitControls} from 'three/examples/jsm/controls/OrbitControls';

const renderer = new THREE.WebGLRenderer();
const camera  = new THREE.PerspectiveCamera(
  45,
  window.innerWidth / window.innerHeight,
  0.1,
  1000,
);
renderer.setSize( window.innerWidth , window.innerHeight);

document.body.appendChild(renderer.domElement);
camera.position.set(10,15,-22);

const scene = new THREE.Scene();
const orbit = new OrbitControls(camera, renderer.domElement);
orbit.update();

const lightAmb = new THREE.AmbientLight(0xffffff);
scene.add(lightAmb);
// const directionalLight = new THREE.DirectionalLight(0xffffff, 10);
// scene.add(directionalLight)
const grid = new THREE.GridHelper(20, 20);
scene.add(grid);
const planeGeo = new THREE.PlaneGeometry(20, 20);
const planeMat = new THREE.MeshBasicMaterial({
  color: 0xffffff,
  side: THREE.DoubleSide,
  visible:false,
});

const plane = new THREE.Mesh(planeGeo, planeMat);
scene.add(plane);
plane.rotateX(-Math.PI/2);
plane.name = 'ground';

const highlightSquare = new THREE.Mesh(
  new THREE.PlaneGeometry(1,1),
  new THREE.MeshBasicMaterial({
    side: THREE.DoubleSide,
    transparent:true,
  })
);
scene.add(highlightSquare);
highlightSquare.position.set(0.5,0,0.5)
highlightSquare.rotateX(-Math.PI/2);

//creatinh raycast6er  and variables for casting
const mousePosition = new THREE.Vector2();
const raycaster = new THREE.Raycaster();
let intersects;


window.addEventListener('mousemove',function(e){
  mousePosition.x = (e.clientX / window.innerWidth)*2-1;
  mousePosition.y = -(e.clientY / window.innerHeight) *2 +1;
  raycaster.setFromCamera(mousePosition,camera);
  intersects = raycaster.intersectObjects(scene.children);
  intersects.forEach(function(intersect){
    if(intersect.object.name==='ground'){
      
      const hightlightPos = new THREE.Vector3().copy(intersect.point).floor().addScalar(0.5);
      highlightSquare.position.set(hightlightPos.x,0, hightlightPos.z);

      const objectExist = objects.find(function(object){
        return (object.position.x === highlightSquare.position.x) && (object.position.z === highlightSquare.position.z);
      })
      if(!objectExist)
        highlightSquare.material.color.setHex(0xFFFFFF)
      else
        highlightSquare.material.color.setHex(0xFF0000);
    }
  }
  )


})

const sphereMesh = new THREE.Mesh(
  new THREE.SphereGeometry(0.4,4,2),
  new THREE.MeshBasicMaterial({
    wireframe:true,
    color: 0xFFEA00,
  })
)
const circularMesh = new THREE.Mesh(
  new THREE.CircleGeometry(0.5),
  new THREE.MeshBasicMaterial({
    wireframe:true,
    color: 0xFFEF00,
  })
)
circularMesh.rotateX(-Math.PI/2)
const objects = [];
window.addEventListener('mousedown',(e)=>{
  const objectExist = objects.find(function(object){
    return (object.position.x === highlightSquare.position.x) && (object.position.z === highlightSquare.position.z);
  })
  if(!objectExist){
  intersects.forEach(function(intersect){
    if(intersect.object.name==='ground'){
      console.log(highlightSquare.position)
      if((Math.abs(highlightSquare.position.x+0.5)%2)===0 && (Math.abs(highlightSquare.position.z+0.5)%2)===0){

        const sphereClone = sphereMesh.clone();
        sphereClone.position.copy(highlightSquare.position)
        scene.add(sphereClone);
        objects.push(sphereClone);
   
      }else{
        const circularClone = circularMesh.clone();
        circularClone.position.copy(highlightSquare.position)
        scene.add(circularClone);
        objects.push(circularClone);
      }

    
     highlightSquare.material.color.setHex(0xFF0000);
    }
  })
}
})

function animate (time){
  requestAnimationFrame(animate);
  highlightSquare.material.opacity = 1+ Math.sin(time /120);
  objects.forEach((object)=>{
  object.rotation.x = time / 1000;
  object.rotation.z = time / 1000;
  object.position.y = 1+ 0.5 *Math.abs(Math.sin(time/1000));
  
  })
  renderer.render(scene,camera);
}

animate();



window.addEventListener('resize',()=>{
  camera.aspect =window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth , window.innerHeight);

})