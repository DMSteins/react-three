import { useState, useEffect, useRef } from 'react'
import * as THREE from "three"

function Example3() {
    const ExampleRef = useRef(null)
    useEffect(() => {
        init()
    }, []);

    const init = ()=>{
        let geometry = new THREE.BoxGeometry(20,20,20)
        let material = new THREE.MeshLambertMaterial({
            color: 0x332299
        })
        var mesh = new THREE.Mesh(geometry, material);
        // mesh的本地坐标设置为(50, 0, 0)
        mesh.position.set(50, 0, 0);
        var group = new THREE.Group();
        // group本地坐标设置和mesh一样设置为(50, 0, 0)
        // mesh父对象设置position会影响得到mesh的世界坐标
        group.position.set(50, 0, 0);
        group.add(mesh);
        let scene = new THREE.Scene();
        scene.add(group);

        // .position属性获得本地坐标
        console.log('本地坐标',mesh.position);

        // getWorldPosition()方法获得世界坐标
        //该语句默认在threejs渲染的过程中执行,如果渲染之前想获得世界矩阵属性、世界位置属性等属性，需要通过代码更新
        scene.updateMatrixWorld(true);
        var worldPosition = new THREE.Vector3();
        mesh.getWorldPosition(worldPosition);
        console.log('世界坐标',worldPosition);

        // let w = window.innerWidth
        // let h = window.innerHeight
        // let renderer = new THREE.WebGLRenderer()
        // renderer.setSize(w, h)
        // renderer.setClearColor("#333388", 1)

        // ExampleRef.current.appendChild(renderer.domElement)

        // renderer.render(scene, camera)
    }
  
    return (
        <div ref={ExampleRef}>
        
        </div>
    )
}

export default Example3
