import { useState, useEffect, useRef } from 'react'
import * as THREE from "three"

function ExampleTwo() {
    const ExampleRef = useRef(null)
    useEffect(() => {
        init()
    }, []);

    const init = ()=>{
        var geometry = new THREE.BufferGeometry(); //声明一个空几何体对象
        //类型数组创建顶点位置position数据
        var vertices = new Float32Array([
            0, 0, 0, //顶点1坐标
            0, 100, 0, //顶点2坐标
            100, 0, 0, //顶点3坐标

            // 0, 0, 0, //顶点4坐标   和顶点1位置相同
            0, 0, 100, //顶点5坐标  和顶点3位置相同
            // 100, 0, 0, //顶点6坐标
        ]);
        // 创建属性缓冲区对象
        var attribue = new THREE.BufferAttribute(vertices, 3); //3个为一组
        // 设置几何体attributes属性的位置position属性
        geometry.attributes.position = attribue
        var colors = new Float32Array([
            1, 0, 0, //顶点1颜色
            0, 1, 0, //顶点2颜色
            0, 0, 1, //顶点3颜色
          
            1, 1, 0, //顶点4颜色
            0, 1, 1, //顶点5颜色
            1, 0, 1, //顶点6颜色
          ]);
          // 设置几何体attributes属性的颜色color属性
        //   geometry.attributes.color = new THREE.BufferAttribute(colors, 3); //3个为一组,表示一个顶点的颜色数据RGB
        let indexVector = new Uint32Array([
            0,1,2,
            0,2,3
        ])
        // 顶点索引复用
        geometry.index = new THREE.BufferAttribute(indexVector, 1)
        var normals = new Float32Array([
            0, 1, 0, //顶点1法向量
            0, 1, 0, //顶点2法向量
            0, 1, 0, //顶点3法向量

            0, 0, 1, //顶点4法向量
            0, 0, 1, //顶点5法向量
            0, 0, 1, //顶点6法向量
        ]);
        // 设置几何体attributes属性的位置normal属性
        geometry.attributes.normal = new THREE.BufferAttribute(normals, 3); //3个为一组,表示一个顶点的xyz坐标
        
        // THREE.MeshBasicMaterial是一种非常简单的材质，这种材质不考虑场景中光照的影响
        let material = new THREE.MeshLambertMaterial({
            color: "#ffff00",
            side: THREE.DoubleSide,
            // color: THREE.VertexColors,
            // size: 10
        })
        let mesh = new THREE.Mesh(geometry, material);
    
        let scene = new THREE.Scene();
        scene.add(mesh);
        let origin = new THREE.Vector3(0,0,0);
        let camera = new THREE.OrthographicCamera(-100, 100, 100, -100 ,1,1000)
        camera.position.set(300, 300, 300)
        camera.lookAt(scene.position)

        let light = new THREE.AmbientLight(0xffffff)
        // light.position.set(0,300,0)
        // scene.add(light)

        let pointLight = new THREE.PointLight({
            color: "#fff000",
        })
        pointLight.position.set(200, 100, 50)
        scene.add(pointLight)

        let cube = new THREE.BoxGeometry(10, 10, 10)
        let cubeMat = new THREE.MeshLambertMaterial({
            color: "#ffffff"
        })
        let cubeMesh = new THREE.Mesh(cube, cubeMat)
        cubeMesh.position.set(5, 5, 5)
        scene.add(cubeMesh)

        let w = window.innerWidth
        let h = window.innerHeight
        let renderer = new THREE.WebGLRenderer()
        renderer.setSize(w, h)
        renderer.setClearColor("#333388", 1)

        ExampleRef.current.appendChild(renderer.domElement)

        renderer.render(scene, camera)
    }
  
    return (
        <div ref={ExampleRef}>
        
        </div>
    )
}

export default ExampleTwo
