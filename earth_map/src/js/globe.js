import * as THREE from 'three';
import {OrbitControls} from 'https://unpkg.com/three@0.142.0/examples/jsm/controls/OrbitControls.js';
 
console.log(THREE);
console.log(OrbitControls);



//reference
//https://medium.com/@whwrd/stunning-dot-spheres-with-webgl-4b3b06592017
//DOM
const header = document.querySelector("header");
const body = document.body;
const postBox = document.getElementById("post-box");
const customButton = document.getElementById("customiseButton-container");
const defaultButton = document.getElementById("defaultButton");
const saveButton = document.getElementById("saveButton");
const countrySelect = document.getElementById("countrySelect");


//!!!setting!!!
const COUNTY_JSON = "data/countries.json";
const WINDOW_WRATIO = 1;
const WINDOW_HRATIO = 1;
const canvas = document.getElementById("canvas");
const MASK_IMAGE = "img/earthmap.png";  //detect if the pixel has colour or not, blank spot should be transparent

const SCENE_ANTIALIAS = true;   //reduce noise form image and improve quality
const SCENE_ALPHA = true;     //if the background (of canvas) has alpha channel(transparent)=>adjust in CSS background
const SCENE_BACKGROUND_COLOR = undefined;

const CAMERA_FOV = 15;
const CAMERA_NEAR = 30; //make limitter
const CAMERA_FAR = 500;
const CAMERA_X = 0;
const CAMERA_Y = 200;
const CAMERA_Z = 230;

const SPHERE_RADIUS = 30;
const SPHERE_SEGUMENT = 64;
const LATITUDE_COUNT = SPHERE_RADIUS * Math.PI * 2; //0.5=>DOT_SIZE=0.25
const DOT_SIZE = 0.25;
const DOT_DENSITY = 0.9;
const DOT_SEGMENT = 16;
const white = 0xeeeeea;
const black = 0x0f1617;
const grey1 = 0xd2d4d5;//lighter
const grey2 = 0x505a5a;//darker
const green = 0x1b3b3d;
const lightGreen = 0x3C8185;
const yellow = 0xea9d3d;
const lightYellow = 0xffcb8a;
const red = 0xe64d47;
const blue = 0x256E93; 
let SPHERE_COLOR; 
let DOT_COLOR;
let INTERSECTED_DOT;
let PIN_COLOR;
let INTERSECTED_PIN;


//colours
function change_colour() {
    switch (body.classList[0]){
        case undefined:
            SPHERE_COLOR = blue; 
            DOT_COLOR = green;
            INTERSECTED_DOT = lightGreen;
            PIN_COLOR = yellow;
            INTERSECTED_PIN = lightYellow;
            break
        case "whiteB":
            SPHERE_COLOR = grey2; 
            DOT_COLOR = grey1;
            INTERSECTED_DOT = grey2;
            PIN_COLOR = black;
            INTERSECTED_PIN = grey2;
            break
        case "blackB":
            SPHERE_COLOR = grey2; 
            DOT_COLOR = white;
            INTERSECTED_DOT = black;
            PIN_COLOR = black;
            INTERSECTED_PIN = grey2;
            break
    }
}
defaultButton.addEventListener("click",()=>{
    change_colour();
    init();
});
saveButton.addEventListener("click",()=>{
    change_colour();
    init();
});

//Utility functions
//  convert a dot on a sphere into a UV point on arectangular texture or image
const spherePointToUV = (dotCenter, sphereCenter) => {
    let newVector = new THREE.Vector3();
    newVector.subVectors(sphereCenter, dotCenter).normalize();  //make vector length = 1
  
    // (0~1)=(-pi/2 ~ -pi, pi~0, 0 ~ -pi/2) clockwise-opening & 90deg difference considred 
    let uvX;
    const atan2 = Math.atan2(newVector.z, newVector.x);
    if (atan2 >=0) {
        uvX = 0.75 - (Math.atan2(newVector.z, newVector.x) / (Math.PI*2));
    }else if (atan2 >-Math.PI/2){
        uvX = 0.75 - (Math.atan2(newVector.z, newVector.x) / (Math.PI*2));
    }else {
        uvX = -(Math.atan2(newVector.z, newVector.x) / (Math.PI*2)) -0.25;
    }
    let uvY = 0.5 + Math.asin(newVector.y) / Math.PI ;
    return new THREE.Vector2(uvX, uvY);
};
//  sample the data of an image at a given point. Requires an imageData object.
const sampleImage = (imageData, uv) => {
    // return imageData.data.slice(point, point + 4);
    const point =
      4 * Math.floor(uv.x * imageData.width) +
      Math.floor(uv.y * imageData.height) * (4 * imageData.width);
  
    return imageData.data.slice(point, point + 4);
};

class ImageLoader {
    constructor(image) {
        this.image = image;
        this.imageData = this.image_load();
        this.image_width = undefined;
        this.image_height = undefined;
        this.cash ={};
    }
    image_load() {
        if (this.cash && this.image in this.cash){
            this.image_width = this.cash[this.image][1];
            this.image_height = this.cash[this.image][2];
            return new Promise((resolve)=>{
                resolve(this.cash[this.image][0]);
            })
        }
        //if there is no cash
        return new Promise((resolve)=> {
            const imageLoader = new THREE.ImageLoader();
            imageLoader.load(this.image, (img) => {
                const tempCanvas = document.createElement("canvas");
                tempCanvas.width= img.width;
                this.image_width= img.width;
                tempCanvas.height= img.height;
                this.image_height= img.height;

                const ctx = tempCanvas.getContext("2d");
                ctx.drawImage(img, 0, 0);
                const imageData = ctx.getImageData(0, 0, img.width, img.height);
                this.cash[this.image] = [imageData, img.width, img.height];
                resolve(imageData);
            });
        });
        
    }
}

//Geometries
class Globe {
    constructor (canvas_width, canvas_height, scene, camera, pins = []){
        this.width = canvas_width;
        this.height = canvas_height;
        this.camera = camera;
        this.camera_fov = CAMERA_FOV;
        this.camera_near = CAMERA_NEAR;
        this.camera_far = CAMERA_FAR;
        this.scene = scene;
        this.radius = SPHERE_RADIUS;
        this.segument = SPHERE_SEGUMENT;
        this.sphere_mesh = undefined;
        this.color = SPHERE_COLOR;
        this.lat_count = LATITUDE_COUNT;
        this.dot_size = DOT_SIZE;
        this.dot_density  = DOT_DENSITY;
        this.dot_segument = DOT_SEGMENT;
        this.dot_color = DOT_COLOR;
        this.dots ={"northern":{"east90":[],"east180":[],"west90":[],"west180":[]}, "southern":{"east90":[],"east180":[],"west90":[],"west180":[]}};
        this.pins = pins;
        this.pin_color = PIN_COLOR;
        this.mask_img = new ImageLoader(MASK_IMAGE);
    }   
    
    add2scene() {
        return new Promise((resolve, reject) =>{
            this.mask_img.imageData.then((imgData)=>{
                if (camera==undefined){
                    this.camera = new THREE.PerspectiveCamera(
                    this.camera_fov,
                    this.width / this.height,
                    this.camera_near,
                    this.camera_far
                    );
                    //controls
                    var controls = new OrbitControls(this.camera, renderer.domElement);
                    // Position the camera.
                    camera.position.set(this.camera_x, this.camera_y, this.camera_z);
                    // Update the controls (required after positioning the camera).
                    controls.update();
                }
                if (this.scene==undefined) {
                    this.scene = new THREE.Scene();
                }
                //earth base sphere
                const sphere = new THREE.SphereGeometry(this.radius, this.segument, this.segument);
                const sphere_material = new THREE.MeshBasicMaterial({
                    color: this.color
                })
                this.sphere_mesh = new THREE.Mesh(sphere, sphere_material);
                this.sphere_mesh.name = "sphere";
                this.scene.add(this.sphere_mesh);
            
                //dots
                const vector = new THREE.Vector3();
                for (let lat = 0; lat < this.lat_count; lat += 1) {
                    const radius =this.radius * Math.sin(Math.PI/this.lat_count*lat) ;
                    const latitudeCircumference = radius * Math.PI * 2 * 2;
                    const latitudeDotCount = Math.ceil(latitudeCircumference * this.dot_density)==0? 1: Math.ceil(latitudeCircumference * this.dot_density);
                    
                    for (let dot = 0; dot < latitudeDotCount; dot += 1) {
                        const dotGeometry = new THREE.CircleGeometry(this.dot_size, this.dot_segument);
                        const phi = (Math.PI / this.lat_count) * lat;
                        const theta = ((2 * Math.PI) / latitudeDotCount) * dot;
                        vector.setFromSphericalCoords(this.radius, phi, theta);
                    
                        dotGeometry.lookAt(vector);
                        dotGeometry.translate(vector.x, vector.y, vector.z);
                    
                        // Find the bounding sphere of the dot.
                        dotGeometry.computeBoundingSphere();
                        const uv = spherePointToUV(
                          dotGeometry.boundingSphere.center,
                          new THREE.Vector3() //(0,0,0)
                        );
                        const sampledPixel = sampleImage(imgData, uv);
                        if (sampledPixel[3] != 0) {
                            const dotMaterial = new THREE.MeshBasicMaterial({
                                color: DOT_COLOR,
                            });
                            const dotMesh =new THREE.Mesh(dotGeometry, dotMaterial);
                            dotMesh.name = "dot";
                            this.scene.add(dotMesh);
                            let x = dotGeometry.boundingSphere.center.x
                            let y = dotGeometry.boundingSphere.center.y
                            let z = dotGeometry.boundingSphere.center.z
                            if (0<=y) {
                                if (0<=z) {
                                    if (0<=x){
                                        this.dots["northern"]["east90"].push(dotMesh);
                                    }else {
                                        this.dots["northern"]["west90"].push(dotMesh);
                                    }
                                }else {
                                    if (0<=x){
                                        this.dots["northern"]["east180"].push(dotMesh);
                                    }else {
                                        this.dots["northern"]["west180"].push(dotMesh);
                                    }
                                }
                            }else {
                                if (0<=z) {
                                    if (0<=x){
                                        this.dots["southern"]["east90"].push(dotMesh);
                                    }else {
                                        this.dots["southern"]["west90"].push(dotMesh);
                                    }
                                }else {
                                    if (0<=x){
                                        this.dots["southern"]["east180"].push(dotMesh);
                                    }else {
                                        this.dots["southern"]["west180"].push(dotMesh);
                                    }
                                }
                            }
                        }
                    }
                }
            resolve(this.scene);
            reject("ERROR");
            });
        });
    }

    add_pin(lat, long) {
        const vector = new THREE.Vector3();
        let phi;
        let theta;

        if (lat>=0) {
            phi = (90-lat)*Math.PI/180;
        }else {
            phi = (90+lat)*Math.PI/180;
        }
        if (lat>=0) {
            theta = long*Math.PI/180;
        }else {
            theta = (360+long)*Math.PI/180;
        }
        vector.setFromSphericalCoords(this.radius, phi, theta);
        let x = vector.x;
        let y = vector.y;
        let z = vector.z;

        let dot_list;
        if (0<=y) {
            if (0<=z) {
                if (0<=x){
                    dot_list = this.dots["northern"]["east90"];
                }else {
                    dot_list = this.dots["northern"]["west90"];
                }
            }else {
                if (0<=x){
                    dot_list = this.dots["northern"]["east180"];
                }else {
                    dot_list = this.dots["northern"]["west180"];
                }
            }
        }else {
            if (0<=z) {
                if (0<=x){
                    dot_list = this.dots["southern"]["east90"];
                }else {
                    dot_list = this.dots["southern"]["west90"];
                }
            }else {
                if (0<=x){
                    dot_list = this.dots["southern"]["east180"];
                }else {
                    dot_list = this.dots["southern"]["west180"];
                }
            }
        }
        let target;
        let min_distance = 100000;

        for (let dot of dot_list){
            let dotx = dot.geometry.boundingSphere.center.x;
            let doty = dot.geometry.boundingSphere.center.y;
            let dotz = dot.geometry.boundingSphere.center.z;
            let distance = (x-dotx)**2 + (y-doty)**2 + (z-dotz)**2
            if (distance<min_distance){
                min_distance = distance;
                target = dot;
                if (distance==0){
                    break
                }
            }
        
        }
        target.material.color = new THREE.Color(this.pin_color);
        this.pins.push(target);//we might can push with infomation
    }

}

//rendering
let w_width = window.innerWidth;
let w_height = window.innerHeight;
let canvas_width = w_width*WINDOW_WRATIO;
let canvas_height = w_height*WINDOW_HRATIO;
let renderer, camera, controls, scene, raycaster, globe, intersects, pointer;
let INTERSECTED;
let isFocussed = false;
let counrtyJSON;
function init() {
    //renderer
    renderer = new THREE.WebGLRenderer({
        canvas: canvas,
        antialias: SCENE_ANTIALIAS,
        alpha: SCENE_ALPHA
      });
    renderer.setSize(canvas_width, canvas_height);
    //camera
    camera = new THREE.PerspectiveCamera(
        CAMERA_FOV,
        canvas_width / canvas_height,
        CAMERA_NEAR,
        CAMERA_FAR
    );
    //controls
    controls = new OrbitControls(camera, renderer.domElement);
    //Position the camera.
    camera.position.set(CAMERA_X, CAMERA_Y, CAMERA_Z);
    //Update the controls (required after positioning the camera).
    controls.update();
    //scene
    scene = new THREE.Scene();
    //for interaction
    raycaster = new THREE.Raycaster();
    pointer = new THREE.Vector2();

    globe =new Globe(canvas_width, canvas_height, scene, camera);
    globe.add2scene().then(()=>{
        renderer.render(scene,camera);
        document.addEventListener( 'mousemove', onPointerMove );
		window.addEventListener( 'resize', onWindowResize );
        controls.addEventListener( "change", ()=> {
            if (-150<controls.object.position.z&&controls.object.position.z<150){
                isFocussed = true;
            }else if(controls.object.position.z<=-150||150<=controls.object.position.z){
                isFocussed = false;
            }
        })
        countrySelect.addEventListener("change", (e)=> {
            let countryname = e.target.value;
            pinat_country(countryname)
        })
    })
};
change_colour();
init();
animate();

function onWindowResize() {
    camera.aspect = canvas_width / canvas_height;
    camera.updateProjectionMatrix();
    renderer.setSize( canvas_width, canvas_height );
}
function onPointerMove( event ) {
    pointer.x = ( event.clientX / canvas_width ) * 2 - 1;
    pointer.y = - ( event.clientY / canvas_height ) * 2 + 1;
}
function animate() {
    requestAnimationFrame( animate );

    controls.update();
    render();
}
function render() {
    // change_colour();
    camera.lookAt( scene.position );
    camera.updateMatrixWorld();

    // find intersections
    raycaster.setFromCamera( pointer, camera );
    intersects = raycaster.intersectObjects( scene.children, false ); //"true" = go through all children
    hover();
    document.addEventListener( 'dblclick', dobleclick );
    renderer.render( scene, camera );
}
function hover() {
    if ( intersects.length > 0 ) {
        if (isFocussed ) {
            map_focusmode();
        }
        const target = intersects[ 0 ];
        if (target.object.name !=  "sphere") {
            if (INTERSECTED) {
                if (INTERSECTED.name == "pin"){
                    INTERSECTED.material.color = new THREE.Color(PIN_COLOR);
                }else {
                    INTERSECTED.material.color = new THREE.Color(INTERSECTED.currentColor);
                }
                
                
            }
            let tmp_color;
            switch (target.object.name){
                case "dot":
                    tmp_color = INTERSECTED_DOT;
                    break
                case "pin":
                    tmp_color = INTERSECTED_PIN;
                    break
            }
            INTERSECTED = target.object;
            INTERSECTED.currentColor = INTERSECTED.material.color;
            target.object.material.color =  new THREE.Color(tmp_color);
        }else if (INTERSECTED) {
            INTERSECTED.material.color = new THREE.Color(INTERSECTED.currentColor);
            INTERSECTED=null;
        }else if(isFocussed == false){
            header.classList.remove( "hidden" );
        }
    }else {
        if (INTERSECTED) {
        INTERSECTED.material.color = new THREE.Color(INTERSECTED.currentColor);
        INTERSECTED=null;
        }
        if(isFocussed == false){
            header.classList.remove( "hidden" );
            postBox.classList.add( "hidden" );
        }
    }

}
function dobleclick() {
    if ( intersects.length > 0 ){
        for (let intersect of intersects) {
            if (intersect.object.name == "dot"){
                intersect.object.material.color = new THREE.Color(PIN_COLOR);
                intersect.object.name = "pin";
                globe.pins.push(intersect);
                renderer.render( scene, camera );
            }
        }
    }
}
function load_cjson() {
    return new Promise((resolve,reject) => {
        if (!counrtyJSON) {
            fetch(COUNTY_JSON)
            .then(response => response.json())
            .then(data => {
                counrtyJSON = data.ref_country_codes;
                resolve(counrtyJSON);
                reject("error");
            })
        }else {
            resolve(counrtyJSON);
            reject("error");
        }
        
    });
}
function pinat_country(countryname) {
    load_cjson().then((data)=>{
        for(let country of data){
            if (country.country ==countryname) {
                let lat = country.latitude
                let long = country.longitude
                console.log(lat)
                globe.add_pin(lat, long)
                break;
            }
        }
    })
}
// function randompin() {
//     let lat = Math.random() *180-90;
//     let long = Math.random() *360-180;
//     console.log(lat, long);
//     globe.add_pin(lat,long);
// }

function map_focusmode() {
    header.classList.add( "hidden" );
    customButton.classList.add( "hidden" );
    postBox.classList.remove( "hidden" );
}

addEventListener("resize", () =>{
    w_width = window.innerWidth;
    w_height = window.innerHeight;
    canvas_width = w_width * WINDOW_WRATIO;
    canvas_height = w_width * WINDOW_HRATIO;
    
    canvas.setAttribute("width", w_width * WINDOW_WRATIO);
    canvas.setAttribute("height",w_width * WINDOW_HRATIO);
    canvas.style.width = w_width * WINDOW_WRATIO + "px";
    canvas.style.height = w_width * WINDOW_HRATIO + "px";
})

countrySelect.addEventListener("change", function () {
    const selectedValue = countrySelect.value;
    console.log(selectedValue);
    // Call your custom function here with the selectedValue if needed
    // yourCustomFunction(selectedValue);
  });