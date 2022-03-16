import { useState, useEffect, useRef } from 'react'
import * as THREE from "three"
import { transformSVGPath } from "../utils/svgTransform"
import { OrbitControls } from "../utils/OrbitControls"
// svg转shapePath
function Example6() {
    const ExampleRef = useRef(null)

    let renderer, scene, camera;
    let line;
    let group

    useEffect(() => {
        init()
        animate()
    }, []);

    const init = ()=>{

        // renderer
        renderer = new THREE.WebGLRenderer();
        renderer.setPixelRatio( window.devicePixelRatio );
        renderer.setSize( window.innerWidth, window.innerHeight );
        ExampleRef.current.appendChild( renderer.domElement );

        // scene
        scene = new THREE.Scene();

        // camera
        camera = new THREE.PerspectiveCamera( 45, window.innerWidth / window.innerHeight, 1, 10000 );
        // camera = new THREE.OrthographicCamera(window.innerWidth / -2, window.innerWidth / 2, window.innerHeight / 2, window.innerHeight / -2 ,0, 1000);
        camera.position.set( 0, 500, 1000 );

        // light
        const directionalLight = new THREE.DirectionalLight( 0xffffff, 0.6 );
        directionalLight.position.set( 0.75, 0.75, 1.0 ).normalize();
        scene.add( directionalLight );

        const ambientLight = new THREE.AmbientLight( 0xcccccc, 0.2 );
        scene.add( ambientLight );

        group = new THREE.Group();
		scene.add(group);

        const controls = new OrbitControls( camera, renderer.domElement );
        // controls.minDistance = 100;
        // controls.maxDistance = 1000;
        
        initShape(group);
        
    }
    
    function initShape(group){
        
        let ltPoints = [{x: 0, y: 50},{x: 50, y: 50},{x: 100, y: 50},{x: 150, y: 50},{x: 50, y: 100},{x: 50, y: 0}]
        
        ltPoints.forEach((p, i)=>{
            let shape = new THREE.ShapePath();
            shape.moveTo(p.x, p.y);
            shape.lineTo(p.x, p.y - 50);
            shape.lineTo(p.x + 50, p.y - 50);
            shape.lineTo(p.x + 50, p.y)
            shape.lineTo(p.x, p.y)

            const simpleShapes = shape.toShapes(true);

            const material = new THREE.MeshLambertMaterial({ color: 0xff66aa })
            const shape3d = new THREE.ExtrudeGeometry(simpleShapes, {
                depth: 3,
                bevelEnabled: false
            });
            const mesh = new THREE.Mesh(shape3d, material)
            mesh.name = `rect${i}`
            group.add(mesh);
        })

        setTimeout(() => {
            console.log(group)
        }, 5000);
    }
    function createRect(){

    }

    // render
    function render() {
        renderer.render( scene, camera );
    }
    var clock = new THREE.Clock();
    let isCompalted = false;
    let totalDelta = 0
    // animate
    function animate() {
        const delta = clock.getDelta()
        totalDelta += delta
        requestAnimationFrame( animate );

        if(!isCompalted && group.children.length > 0){
            for(let i = 0; i < group.children.length; i++){
                const mesh = group.children[i];

                if(totalDelta >= 0.5){
                    isCompalted = true
                    break
                }
                if(i === 1) continue
                if(i < 4){
                    mesh.rotateY(delta * Math.PI)
                }else{
                    mesh.rotateX(delta * Math.PI)
                }
                
            }
        }

        render();

    }
  
    return (
        <div ref={ExampleRef}>
        
        </div>
    )
}

export default Example6
