import * as THREE from "three";
import gsap from "gsap";
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import * as BufferGeometryUtils from 'three/addons/utils/BufferGeometryUtils.js';
//reference
//https://medium.com/@whwrd/stunning-dot-spheres-with-webgl-4b3b06592017

//mouse move
var mouse = {
    x:undefined,
    y:undefined,
    xclient:undefined,
    yclient:undefined
}
addEventListener("mousemove", (e) => {
    mouse.x = e.x;
    mouse.y = e.y;
    mouse.xclient = e.clientX;
    mouse.yclient = e.clientY;
})

//width & height values get
var width = window.innerWidth;
var height = window.innerHeight;
addEventListener("resize", () =>{
    width = window.innerWidth;
    height = window.innerHeight;
    console.log(width)
})

//scene
const scene = new THREE.Scene();
//renerer
const renderer = new THREE.WebGLRenderer();
renderer.setSize(width, height);
document.body.appendChild( renderer.domElement);

// Define an array to hold the geometries of all the dots.
const dotGeometries = [];
// Create a blank vector to be used by the dots.
const vector = new THREE.Vector3();

const LATITUDE_COUNT = 80;
const LONGITUDE_COUNT = 80;
const DOT_SIZE = 1;
const DOT_SEGMENT = 32;
const SPHERE_RADIUS = 100;
const DOT_COUNT = 100;

// //first attempt
// // Loop across the latitudes.
// for (let lat = 0; lat < LATITUDE_COUNT; lat += 1) {
//     // Defin the phi and theta angles for the dot.
//     const phi = (Math.PI / LATITUDE_COUNT) * lat;
//     // Loop across the longitudes.
//     for (let lng = 0; lng < LONGITUDE_COUNT; lng += 1) {
//       // Create a geomtry for the dot.
//         const dotGeometry = new THREE.CircleGeometry(DOT_SIZE, DOT_SEGMENT);
//         const theta = ((2 * Math.PI) / LONGITUDE_COUNT) * lng;

//         // Set the vector using the spherical coordinates generated from the sphere radius, phi and theta.
//         vector.setFromSphericalCoords(SPHERE_RADIUS, phi, theta);

//         // Make sure the dot is facing in the right direction.
//         dotGeometry.lookAt(vector);

//         // Move the dot geometry into position.
//         dotGeometry.translate(vector.x, vector.y, vector.z);

//         // Push the positioned geometry into the array.
//         dotGeometries.push(dotGeometry);
//     }
// }

// // second attempt (set number of dots)
// // Loop across the number of dots.
// // https://mathworld.wolfram.com/SphericalCoordinates.html
// for (let dot = 0; dot < DOT_COUNT; dot += 1) {
//     // Create a geomtry for the dot.
//     const dotGeometry = new THREE.CircleGeometry(DOT_SIZE, DOT_SEGMENT);
//     if (dot==10) {
//         break;
//     }
  
//     // Work out the spherical coordinates of each dot, in a phyllotaxis pattern.
//     //https://blog.design-nkt.com/osyare-threejs6/
//     const phi = Math.acos(-1+(2 * dot) / DOT_COUNT);
//     console.log(phi);
//     const theta = Math.sqrt(DOT_COUNT * Math.PI) * phi;
//     console.log(theta);
//     // Set the vector using the spherical coordinates generated from the sphere radius, phi and theta.
//     vector.setFromSphericalCoords(SPHERE_RADIUS, phi, theta);
  
//     // Make sure the dot is facing in the right direction.
//     dotGeometry.lookAt(vector);

//     // Move the dot geometry into position.
//     dotGeometry.translate(vector.x, vector.y, vector.z);

//     // Push the positioned geometry into the array.
//     dotGeometries.push(dotGeometry);
  
// }

// //third attempt
// //spiral around the sphere once
// for (let dot = 0; dot < DOT_COUNT; dot += 1) {
//     // Create a geomtry for the dot.
//     const dotGeometry = new THREE.CircleGeometry(DOT_SIZE, DOT_SEGMENT);
  
//     // Work out the spherical coordinates of each dot, in a phyllotaxis pattern.
//     const phi = Math.PI / DOT_COUNT * dot;
//     const theta = Math.PI*2  / DOT_COUNT * dot;
  
//     // Set the vector using the spherical coordinates generated from the sphere radius, phi and theta.
//     vector.setFromSphericalCoords(SPHERE_RADIUS, phi, theta);
  
//     // Make sure the dot is facing in the right direction.
//     dotGeometry.lookAt(vector);

//     // Move the dot geometry into position.
//     dotGeometry.translate(vector.x, vector.y, vector.z);

//     // Push the positioned geometry into the array.
//     dotGeometries.push(dotGeometry);
// }

// //forth attempt  completely failure
// function fib(n) {
//     let a = 1;
//     let b = 1;
//     for (let i = 3; i <= n; i++) {
//       let c = a + b;
//       a = b;
//       b = c;
//     }
//     return b;
//   }
  
// for (let dot = 0; dot < DOT_COUNT; dot += 1) {
//     // Create a geomtry for the dot.
//     const dotGeometry = new THREE.CircleGeometry(DOT_SIZE, DOT_SEGMENT);
  
//     // Work out the spherical coordinates of each dot, in a phyllotaxis pattern.
//     const phi = fib(dot) / DOT_COUNT;
//     const theta = Math.sqrt(DOT_COUNT * Math.PI) * phi;
  
//     // Set the vector using the spherical coordinates generated from the sphere radius, phi and theta.
//     vector.setFromSphericalCoords(SPHERE_RADIUS, phi * Math.PI, theta);
  
//     // Make sure the dot is facing in the right direction.
//     dotGeometry.lookAt(vector);

//     // Move the dot geometry into position.
//     dotGeometry.translate(vector.x, vector.y, vector.z);

//     // Push the positioned geometry into the array.
//     dotGeometries.push(dotGeometry);
// }

// Loop across the latitude lines.
for (let lat = 0; lat < LATITUDE_COUNT; lat += 1) {
    // Calculate the radius of the latitude line.
    // Math.cos((-90 + (180 / LATITUDE_COUNT) * lat) * (Math.PI / 180)) *SPHERE_RADIUS;
    const radius =SPHERE_RADIUS * Math.sin(Math.PI/LATITUDE_COUNT*lat) ;
    // Calculate the circumference of the latitude line.
    const latitudeCircumference = radius * Math.PI * 2 * 2;
    // Calculate the number of dots required for the latitude line.
    // if you use the example equation for radius, you do not have to set this condition
    const latitudeDotCount = Math.ceil(latitudeCircumference * DOT_DENSITY)==0? 1:Math.ceil(latitudeCircumference * DOT_DENSITY);

    // Loop across the dot count for the latitude line.
    for (let dot = 0; dot < latitudeDotCount; dot += 1) {
        const dotGeometry = new THREE.CircleGeometry(DOT_SIZE, DOT_SEGMENT);
        // Calculate the phi and theta angles for the dot.
        const phi = (Math.PI / LATITUDE_COUNT) * lat;
        const theta = ((2 * Math.PI) / latitudeDotCount) * dot;
          // Set the vector using the spherical coordinates generated from the sphere radius, phi and theta.
        vector.setFromSphericalCoords(SPHERE_RADIUS, phi, theta);

        // Make sure the dot is facing in the right direction.
        dotGeometry.lookAt(vector);

        // Move the dot geometry into position.
        dotGeometry.translate(vector.x, vector.y, vector.z);

        // Push the positioned geometry into the array.
        dotGeometries.push(dotGeometry);
    }
  }


// Merge all the dot geometries together into one buffer geometry.
const mergedDotGeometries = BufferGeometryUtils.mergeGeometries(
    dotGeometries
  );
// Define the material for the dots.
const dotMaterial = new THREE.MeshBasicMaterial({
    color: "#ffff81",
    side: THREE.DoubleSide
    //https://threejs.org/docs/#api/en/materials/Material.side
  });

// Create the dot mesh from the dot geometries and material.
const dotMesh = new THREE.Mesh(mergedDotGeometries, dotMaterial);
// Add the dot mesh to the scene.
scene.add(dotMesh);

//camera
const camera = new THREE.PerspectiveCamera(150, width/height,1,300);
scene.add(camera)
//light
// const light = new THREE.PointLight(0xffffff,1,100)
// light.position.y = -10;
// light.position.x = 0;
// light.position.z = 8;
// scene.add( light );
//controls
var controls = new OrbitControls(camera, renderer.domElement);
camera.position.set( 0,10,0);
// //geometory
// var geom = new THREE.SphereGeometry(1, 64, 64);
// var material = new THREE.MeshStandardMaterial({color: "#ff0000"})
// var mesh = new THREE.Mesh(geom, material);
// scene.add(mesh);

function animate() {

	requestAnimationFrame( animate );

	// required if controls.enableDamping or controls.autoRotate are set to true
	controls.update();

	renderer.render( scene, camera );

}
animate()