import * as THREE from "three";
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import * as BufferGeometryUtils from 'three/addons/utils/BufferGeometryUtils.js';
//reference
//https://medium.com/@whwrd/stunning-dot-spheres-with-webgl-4b3b06592017

//mouse move

const canvas = document.getElementById("canvas");

//width & height values get
var w_width = window.innerWidth;
var w_height = window.innerHeight;
const WINDOW_RATIO = 1;
var width = w_width*WINDOW_RATIO;
var height = w_width*WINDOW_RATIO;

const SCENE_ANTIALIAS = true;
const SCENE_ALPHA = true;
const SCENE_BACKGROUND_COLOR = 0xffffff;

const CAMERA_FOV = 20;
const CAMERA_NEAR = 1;
const CAMERA_FAR = 500;
const CAMERA_X = -100;
const CAMERA_Y = 100;
const CAMERA_Z = 220;

const MASK_IMAGE = "img/drawing.svg";

const SPHERE_RADIUS = 30;
const SPHERE_COLOR = 0x256E93;
const LATITUDE_COUNT = SPHERE_RADIUS * Math.PI * 2;
const DOT_DENSITY = 0.9;

const DOT_SIZE = 0.2;
const DOT_SEGMENT = 32;
const DOT_COLOR = 0x1B3D3B;
const PIN_COLOR = 0xE52820;


//renerer
const renderer = new THREE.WebGLRenderer({
    canvas: canvas,
    antialias: SCENE_ANTIALIAS,
    alpha: SCENE_ALPHA
  });
renderer.setSize(width, height);

// Utility function to convert a dot on a sphere into a UV point on a
// rectangular texture or image.
const spherePointToUV = (dotCenter, sphereCenter) => {
    // Create a new vector and give it a direction from the center of the sphere
    // to the center of the dot.
    const newVector = new THREE.Vector3();
    //subVectors(vec1,vec2).normalize() = make the vector of difference of thouse vector as the main vector
    //normalize() = make venctor's magnitude(length) 1(so every number become between -1&1)
    //=sphere's radius is 1 in this vector
    newVector.subVectors(sphereCenter, dotCenter).normalize();
  
    // Calculate the  UV coordinates of the dot and return them as a vector.
    //atan(x,y) = returns the angle between (0,0) & (x,y)
    // console.log(Math.atan2(newVector.z, newVector.x))
    //https://en.wikipedia.org/wiki/UV_mapping
    //https://www.google.com/search?q=atan+vs+atan2&source=lmns&bih=764&biw=1440&hl=en-GB&sa=X&ved=2ahUKEwi4iZaplaaAAxXdsCcCHdi9BIsQ_AUoAHoECAEQAA
    //https://amycoders.org/tutorials/tm_approx.html


    //-1:aunticlockwise-opening = inside would be outer side
    //-2:clockwise-opening = outside would be outer side
    //related to the coordinate system? Three.js is right handed
    //https://www.evl.uic.edu/ralph/508S98/coordinates.html
    //attempt1−1(-pi ~ pi) 
    // const uvX = 0.5 + Math.atan2(newVector.z, newVector.x) / (Math.PI*2);
    //attempt1-2 (pi ~ -pi) => middle of the pic would be on the left side
    const uvX = 1 - (0.5 + Math.atan2(newVector.z, newVector.x) / (Math.PI*2));
    //attempt2-1 (0 ~ pi,-pi ~ 0)=> inside out?why
    // var uvX;
    // if (Math.atan2(newVector.z, newVector.x)>=0) {
    //     uvX = Math.atan2(newVector.z, newVector.x) / (Math.PI*2);
    // }else {
    //     uvX = 1 + (Math.atan2(newVector.z, newVector.x) / (Math.PI*2));
    // }
    //attempt2-2 (0 ~ -pi,pi ~ 0) => left of the pic would be on the left side
    //この逆の理論がわからん！！！
    // var uvX;
    // if (Math.atan2(newVector.z, newVector.x)>=0) {
    //     uvX = 1 - (Math.atan2(newVector.z, newVector.x) / (Math.PI*2));
    // }else {
    //     uvX = -(Math.atan2(newVector.z, newVector.x) / (Math.PI*2));
    // }
    //attempt3-1(-pi/2 ~ -pi, 0~pi, 0 ~ -pi/2) => left of the pic would be on the middle(0point in vector)
    // var uvX;
    // const atan2 = Math.atan2(newVector.z, newVector.x);
    // if (atan2 >=0) {
    //     uvX = 0.25 +  (Math.atan2(newVector.z, newVector.x) / (Math.PI*2));
    // }else if (atan2 >=-Math.PI/2){
    //     uvX = 0.75-(Math.atan2(newVector.z, newVector.x) / (Math.PI*2));
    // }else {
    //     uvX = -(Math.atan2(newVector.z, newVector.x) / (Math.PI*2));
    // }
    // attempt3-2(-pi/2 ~ -pi, pi~0, 0 ~ -pi/2) => left of the pic would be on the middle(0point in vector)
    // var uvX;
    // const atan2 = Math.atan2(newVector.z, newVector.x);
    // if (atan2 >=0) {
    //     uvX = 0.75 - (Math.atan2(newVector.z, newVector.x) / (Math.PI*2));
    // }else if (atan2 >-Math.PI/2){
    //     uvX = 0.75 - (Math.atan2(newVector.z, newVector.x) / (Math.PI*2));
    // }else {
    //     uvX = -(Math.atan2(newVector.z, newVector.x) / (Math.PI*2)) -0.25;
    // }

    // // console.log(uvX);
    // console.log(Math.asin(newVector.y/SPHERE_RADIUS))=console.log(Math.asin(newVector.y/1))
    // const uvY = 0.5 + Math.asin(newVector.y/SPHERE_RADIUS) / Math.PI *SPHERE_RADIUS;
    const uvY = 0.5 + Math.asin(newVector.y) / Math.PI ;
  
    return new THREE.Vector2(uvX, uvY);
};
// Utility function to sample the data of an image at a given point. Requires
// an imageData object.
const sampleImage = (imageData, uv) => {
    // 1pixcel deta = 4array
    const point =
      4 * Math.floor(uv.x * imageData.width) +
      Math.floor(uv.y * imageData.height) * (4 * imageData.width);
  
    return imageData.data.slice(point, point + 4);
};


const renderScene = (imageData) => {

    //camera
    const camera = new THREE.PerspectiveCamera(
        CAMERA_FOV,
        width / height,
        CAMERA_NEAR,
        CAMERA_FAR
      );

    //controls
    var controls = new OrbitControls(camera, renderer.domElement);
    // Position the camera.
    camera.position.set(CAMERA_X, CAMERA_Y, CAMERA_Z);
    // Update the controls (required after positioning the camera).
    controls.update();

    //scene
    const scene = new THREE.Scene();
    // scene.background = new THREE.Color(SCENE_BACKGROUND_COLOR);

    //sphere
    //test "philength"
    const sphere = new THREE.SphereGeometry(SPHERE_RADIUS,64,64, -Math.PI/2, -Math.PI/2); 
    // const sphere = new THREE.SphereGeometry(SPHERE_RADIUS,64,64);
    const sphereMaterial = new THREE.MeshBasicMaterial({
        color: SPHERE_COLOR,
        side: THREE.DoubleSide
    })
    
    // immediately use the texture for material creation 
    // const texture = new THREE.TextureLoader().load('img/spheremap12.png'); 
    // const sphereMaterial = new THREE.MeshBasicMaterial( { map:texture } );
    
    const sphereMesh = new THREE.Mesh(sphere, sphereMaterial);
    scene.add(sphereMesh);

    scene.add(new THREE.Mesh(
        new THREE.SphereGeometry(SPHERE_RADIUS/2,64,64),
        new THREE.MeshBasicMaterial({color:0xff0000})
    ))

    const dotGeometries = [];
    // Create a blank vector to be used by the dots.
    const vector = new THREE.Vector3();
    
    for (let lat = 0; lat < LATITUDE_COUNT; lat += 1) {
        // Calculate the radius of the latitude line.
        // const radius = Math.cos((-90 + (180 / LATITUDE_COUNT) * lat) * (Math.PI / 180)) *SPHERE_RADIUS;
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
    
            // Find the bounding sphere of the dot.
            dotGeometry.computeBoundingSphere();
    
            // Find the UV position of the dot on the land image.
            const uv = spherePointToUV(
              dotGeometry.boundingSphere.center,
              new THREE.Vector3() //(0,0,0)
            );
            
            // Sample the pixel on the land image at the given UV position.
            const sampledPixel = sampleImage(imageData, uv);
            
            // If the pixel contains a color value (in other words, is not transparent),
            // continue to create the dot. Otherwise don't bother.
            if (sampledPixel[3]) {
              // Push the positioned geometry into the array.
              dotGeometries.push(dotGeometry);
            }
        }
      }

    const mergedDotGeometries = BufferGeometryUtils.mergeGeometries(dotGeometries);
    // Define the material for the dots.
    const dotMaterial = new THREE.MeshBasicMaterial({
        color: DOT_COLOR,
        side: THREE.DoubleSide
        //https://threejs.org/docs/#api/en/materials/Material.side
      });
    
    // Create the dot mesh from the dot geometries and material.
    const dotMesh = new THREE.Mesh(mergedDotGeometries, dotMaterial);
    // Add the dot mesh to the scene.
    scene.add(dotMesh);

    //addpin
    const add_pin = (lat, long) => {
        let vector = new THREE.Vector3();
        let dot = new THREE.CircleGeometry(0.5, DOT_SEGMENT);
        let phi;
        let theta;

        if (lat>=0) {
            phi = (90-lat)*Math.PI/180;
        }else {
            phi = (90+lat)*Math.PI/180;
        }
        // if (lat>=0) {
        //     theta = long-90*Math.PI/180;
        // }else {
        //     theta = (450+long)*Math.PI/180;
        // }
        //90degree difference is made by oppisit use of theta & phi between Sphere construction and vector3
        //Sphere = start point is "-x" direction, use "phi" (as longtitude)
        //Vector = start point is "+z" direction, use "theta"
        //both of them go around the sphere circumference　anticlockwise direction = right handed?
        //=>Math.PI/2=90degree difference
        //=>adjust inUV mapping
        if (lat>=0) {
            theta = long*Math.PI/180;
        }else {
            theta = (360+long)*Math.PI/180;
        }
        vector.setFromSphericalCoords(SPHERE_RADIUS, phi, theta);
        dot.lookAt(vector);
        dot.translate(vector.x, vector.y, vector.z);
        let material = new THREE.MeshBasicMaterial({
            color: PIN_COLOR,
            side: THREE.DoubleSide
            //https://threejs.org/docs/#api/en/materials/Material.side
          });
        let mesh = new THREE.Mesh(dot,material);
        scene.add(mesh);
    }

    // add_pin(35.6762, 139.6503);
    add_pin(0, 0);

    const animate = (time)=> {
        // Reduce the current timestamp to something manageable.
        time *= 0.001;
        // dotMesh.rotation.y =Math.PI * time * 0.1;
        controls.update();
        renderer.render(scene, camera);
        requestAnimationFrame( animate );
    }

    animate();
};

// Initialise an image loader.
const imageLoader = new THREE.ImageLoader();
// Load the image used to determine where dots are displayed. The sphere
// cannot be initialised until this is complete.

function   yeah()  {
    imageLoader.load(MASK_IMAGE, (image) => {
    // Create an HTML canvas, get its context and draw the image on it.
    const tempCanvas = document.createElement("canvas");

    tempCanvas.width = image.width;
    tempCanvas.height = image.height;

    const ctx = tempCanvas.getContext("2d");

    ctx.drawImage(image, 0, 0);

    // Read the image data from the canvas context.
    const imageData = ctx.getImageData(0, 0, image.width, image.height);

    renderScene(imageData);
    });
}
yeah();

addEventListener("resize", () =>{
    w_width = window.innerWidth;
    w_height = window.innerHeight;
    width = w_width*WINDOW_RATIO;
    height = w_width*WINDOW_RATIO;
    
    canvas.setAttribute("width", w_width*WINDOW_RATIO);
    canvas.setAttribute("height",w_width*WINDOW_RATIO);
    canvas.style.width = w_width*WINDOW_RATIO + "px";
    canvas.style.height = w_width*WINDOW_RATIO + "px";
    renderer.setSize(width, height);
    yeah();
})


