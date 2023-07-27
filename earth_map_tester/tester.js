import * as THREE from "three";
import gsap from "gsap";
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import * as BufferGeometryUtils from 'three/addons/utils/BufferGeometryUtils.js';



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
                document.body.appendChild(tempCanvas);
                const imageData = ctx.getImageData(0, 0, img.width, img.height);
                this.cash[this.image] = [imageData, img.width, img.height];
                resolve(imageData);
            });
        });
        
    }
}

var img = new ImageLoader("img/smile.png")
console.log(img);