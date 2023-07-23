//https://threejs.org/
//https://greensock.com/showcase/


import * as THREE from "three";
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import gsap from "gsap";

var width = window.innerWidth;;
var height =  window.innerHeight;

const scene = new THREE.Scene();

//shape
const geometry = new THREE.SphereGeometry(1,64,64);
const material = new THREE.MeshStandardMaterial( {
    color: "#00ff83"
})
const sphere = new THREE.Mesh( geometry, material);
scene.add( sphere );

//camera
const camera = new THREE.PerspectiveCamera(45, width/height, 1, 100);
scene.add( camera );

//light
const light = new THREE.PointLight(0xffffff,5,100)
light.position.set(0,10,10)
scene.add( light );

//render
const canvas = document.querySelector('.webgl' );
const renderer = new THREE.WebGLRenderer({canvas})
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setPixelRatio(2);

//controls
const controls = new OrbitControls(camera, canvas)
camera.position.set(0,0,7);
controls.autoRotate = true;
controls.autoRotateSpeed =5;
console.log(controls)
// controls.update();

addEventListener("resize", ()=> {
    width = window.innerWidth;;
    height =  window.innerHeight;

    //update camera
    camera.aspect = width/height;
    camera.updateProjectionMatrix();
    renderer.setSize(width, height);
})

function animate() {
    controls.update();
    renderer.render(scene,camera);
    requestAnimationFrame( animate );
}
animate();

//timeline magic
//does not have to get element by my self!?
//the animation work in this writing order (time line)
const tl = gsap.timeline({defaults: {duration:1}});
tl.fromTo(sphere.scale, {z:0, x:0, y:0}, {z:1, x:1, y:1});
tl.fromTo("nav", {y:"-100%"}, {y:"0%"});
tl.fromTo(".title", {opacity:0}, {opacity:1});

//mouse animation colour
let mouseDown = false;
let rgb=[];
addEventListener("mousedown", ()=> {
    mouseDown = true;
})
addEventListener("mouseup", ()=> {
    mouseDown = false;
})
addEventListener("mousemove", (e)=> {
    if(mouseDown) {
        rgb = [
            Math.round(e.x/width)*255,
            Math.round(e.y/height)*255,
            150
        ]
        let newColour = new THREE.Color(`rgb(${rgb.join(",")})`)
        gsap.to(sphere.material.color, {
            r: newColour.r,
            g: newColour.g,
            b: newColour.b
        })
    }
})