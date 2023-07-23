
//Scene
const scene = new THREE.Scene();

//Create our shape
const geometry = new THREE.BoxGeometry( 1, 1, 1 );
    //basic=has brightness itself, standard=need lightning
const material = new THREE.MeshBasicMaterial( { color: "#00ff83" } );
const cube = new THREE.Mesh( geometry, material );
cube.position.x = -1;
scene.add( cube );

const geometry2 = new THREE.SphereGeometry(1,64,64);
const material2 = new THREE.MeshStandardMaterial( { color: "#00ff83" } );
const sphere = new THREE.Mesh( geometry2, material2);
sphere.position.x =1;
sphere.position.y = 1;
scene.add( sphere );

//Camera
// (fildOfVeiw, aspect racio, near, far)
const camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 0.1, 1000 );
//scene.add= add at position  of (0,0,0)
camera.position.z = 5;
// camera.position.x = 0;
scene.add(camera);

//Light
const light = new THREE.PointLight(0xffffff,1,100)
light.position.y = 1;
light.position.x = 3;
light.position.z = 5;
scene.add( light );
const light2 = new THREE.PointLight(0xff0000,1,100);
light2.position.y = 1;
light2.position.x = -3;
light2.position.z = 5;
scene.add(light2);

//Renderer
//1, append canvas element to DOM
// const renderer = new THREE.WebGLRenderer();
// renderer.setSize( window.innerWidth, window.innerHeight );
// document.body.appendChild( renderer.domElement );

//2, put webGL in to already exsist canvas
const canvas = document.querySelector('.webgl' );
const renderer = new THREE.WebGLRenderer({canvas})
renderer.setSize(window.innerWidth, window.innerHeight);

function animate() {
	requestAnimationFrame( animate );
    cube.rotation.x += 0.01;
    cube.rotation.y += 0.01;
	renderer.render( scene, camera );
}
animate();
