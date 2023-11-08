import React, {useRef, useEffect} from "react"
import * as THREE from "three"
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import { DRACOLoader } from 'three/addons/loaders/DRACOLoader.js';
import { RGBELoader } from 'three/addons/loaders/RGBELoader.js';

const Models = ()=>{
    const ExampleRef = useRef(null)
    let camera, scene, renderer;

    useEffect(() => {
        init()
    }, []);

    function init() {

        const container = document.createElement( 'div' );
        ExampleRef.current.appendChild( container );

        camera = new THREE.PerspectiveCamera( 45, window.innerWidth / window.innerHeight, 0.25, 1000 );
        camera.position.set( 580, 560, 527 );
        camera.lookAt(0,0,0)

        scene = new THREE.Scene();

        new RGBELoader()
            .setPath( '/' )
            .load( 'test.hdr', function ( texture ) {

                texture.mapping = THREE.EquirectangularReflectionMapping;

                scene.background = texture;
                scene.environment = texture;

                render();

                // model

                const loader = new GLTFLoader().setPath( '/' );
                const dracoLoader = new DRACOLoader().setDecoderPath('/draco/')
                loader.setDRACOLoader(dracoLoader)
                loader.load( 'shop.gltf', async function ( gltf ) {

                    const model = gltf.scene;

                    // wait until the model can be added to the scene without blocking due to shader compilation

                    await renderer.compileAsync( model, camera, scene );

                    scene.add( model );

                    render();
    
                } );

            } );

        renderer = new THREE.WebGLRenderer( { antialias: true } );
        renderer.setPixelRatio( window.devicePixelRatio );
        renderer.setSize( window.innerWidth, window.innerHeight );
        renderer.toneMapping = THREE.ACESFilmicToneMapping;
        renderer.toneMappingExposure = 1;
        container.appendChild( renderer.domElement );

        const controls = new OrbitControls( camera, renderer.domElement );
        controls.addEventListener( 'change', render ); // use if there is no animation loop
        controls.minDistance = 2;
        controls.maxDistance = 100;
        controls.target.set( 0, 0, - 0.2 );
        controls.update();

        window.addEventListener( 'resize', onWindowResize );

    }

    function onWindowResize() {

        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();

        renderer.setSize( window.innerWidth, window.innerHeight );

        render();

    }

    //

    function render() {

        renderer.render( scene, camera );

    }
    return (
        <div ref={ExampleRef}></div>
    )
}
export default Models