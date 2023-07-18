import * as THREE from 'three';

import { OrbitControls } from 'three/addons/controls/OrbitControls.js';



const canvas3dwrapper = document.querySelector('.canvas-wrapper-container');
const canvas3dholder = document.getElementById('canvas-3d-holder')

const renderer = new THREE.WebGLRenderer({alpha: false, antialias : false});
renderer.setClearColor( 0xFFFFFF, 0 );

renderer.setSize( canvas3dwrapper.offsetWidth, canvas3dwrapper.offsetWidth );
canvas3dholder.appendChild( renderer.domElement );
//addMouseHandler(renderer.domElement )

const camera = new THREE.PerspectiveCamera( 75, 1, 0.1, 800 );
const controls = new OrbitControls( camera, renderer.domElement );
controls.maxZoom = 20;
controls.minZoom = 1;
// camera.position.set( 0, 0, 100 );
// camera.lookAt( 0, 0, 0 );

const scene = new THREE.Scene();





camera.position.set( 0, 0, 20);
//camera.position.z = 30;

function render() {
    requestAnimationFrame( render );
    renderer.render( scene, camera );
}
render();





window.addEventListener('toggle-3d',function(event) {

    renderer.setSize( canvas3dwrapper.offsetWidth, canvas3dwrapper.offsetWidth );
    
    //remove old objects from scene
    while(scene.children.length > 0){ 
        scene.remove(scene.children[0]);
    }
    
    //add new texture data url to store to texture object and apply as map to cyliner
    const textureUrl = event.detail.url;
    const texture = new THREE.TextureLoader().load(textureUrl,(texture) => {
        // const ratio = texture.image.width/texture.image.height;
        // console.log(ratio);
        // const geometry = new THREE.PlaneGeometry( 30*ratio, 30);
        // const material = new THREE.MeshBasicMaterial( {map: texture, side: THREE.DoubleSide} );

        // const plain = new THREE.Mesh( geometry, material );
        // scene.add(plain);

        texture.colorSpace = THREE.SRGBColorSpace;
        const materials = [
            new THREE.MeshBasicMaterial({map: texture, side: THREE.DoubleSide})
        ];
        if(event.detail.topBottomTextureUrl) {
            const topBottomTexture = new THREE.TextureLoader().load( event.detail.topBottomTextureUrl,(texture) => {
                texture.colorSpace = THREE.SRGBColorSpace;
                const material = new THREE.MeshBasicMaterial({
                    map: texture
                })
                materials.push(material, material)
            }) 
        } else {
            const material = new THREE.MeshBasicMaterial({
                color: 0Xffffff
            });
            materials.push(material, material)
           
        }

        const geometry = new THREE.CylinderGeometry(1, 4.08, 14, 1500);

        
        
        const cylinder = new THREE.Mesh( geometry, materials );
        cylinder.position.set(0, 2, 0);
        scene.add(cylinder);

        render();

    })

})

window.addEventListener('canvas-3d-zoomin',function(event) {
    
    camera.position.set( 0, 0, (camera.position.z-=1));
    controls.update()
})

window.addEventListener('canvas-3d-zoomout',function(event) {
    camera.position.set( 0, 0, (camera.position.z+=1));
    controls.update()
})

const resizeObserver = new ResizeObserver((entries) => {
    for (const entry of entries) {
      if (entry.contentBoxSize) {
        const contentBoxSize = entry.contentBoxSize[0];
        
        renderer.setSize( contentBoxSize.inlineSize, contentBoxSize.inlineSize);
        
      }
    }
  
    //console.log("Size changed");
  });
  
resizeObserver.observe(canvas3dwrapper);


