import { useState, useEffect, useRef } from 'react'
import * as THREE from "three"
// 贴图案例
function Example4() {
    const ExampleRef = useRef(null)
    useEffect(() => {
        init()
    }, []);

    const init = ()=>{
        let scene = new THREE.Scene()

        let camera = new THREE.OrthographicCamera(-200, 200, 200, -200 ,1,1000)
        camera.position.set(300, 300, 300)
        camera.lookAt(scene.position)

        let light = new THREE.DirectionalLight(0xffffff)
        light.position.set(100,150,200)
        scene.add(light)

        let w = window.innerWidth
        let h = window.innerHeight
        let renderer = new THREE.WebGLRenderer()
        renderer.setSize(w, h)
        renderer.setClearColor("#2266aa", 1)

        


        let box = new THREE.BoxGeometry(100,100,100)

        let material = new THREE.MeshLambertMaterial({
            color: 0xaa1188
        })
        let mesh = new THREE.Mesh(box, material)
        mesh.position.set(0,0,0)
        scene.add(mesh)


        ExampleRef.current.appendChild(renderer.domElement)

        renderer.render(scene, camera)
    }
  
    return (
        <div ref={ExampleRef}>
        
        </div>
    )
}

export default Example4
