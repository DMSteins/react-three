import { useState, useEffect, useRef } from 'react'
import * as THREE from "three"
import videoUrl from '../assets/flower.webm'
import videoUrl1 from '../assets/test.mp4'
import { OrbitControls } from "../utils/OrbitControls"


function ExampleOne() {
    const boxRef = useRef<HTMLDivElement | null>(null)
    
    let renderer: THREE.WebGLRenderer,scene : THREE.Scene, camera :THREE.Camera
    const init = () => {
        scene = new THREE.Scene()

        let w = window.innerWidth
        let h = window.innerHeight
        let rate = w / h
        let space = 200
        camera = new THREE.OrthographicCamera(-space * rate, space * rate, space, -space, 1, 1000)
        camera.position.set(200, 300, 200)
        camera.lookAt(scene.position)

        renderer = new THREE.WebGLRenderer()
        renderer.setSize(w, h)
        renderer.setClearColor(0xb9d3ff, 1)

        boxRef.current && boxRef.current.appendChild(renderer.domElement)

        const controls = new OrbitControls( camera, renderer.domElement );

        let geometry = new THREE.BufferGeometry()
        let vertices = new Float32Array([
            0, 0, 0, 
            100, 0, 0,
            0, 100, 0,
            0, 0, 10,
            0, 0, 100, 
            100, 0, 10
        ])
        let attribute = new THREE.BufferAttribute(vertices, 3)
        geometry.attributes.position = attribute

        // 面渲染
        let material = new THREE.MeshLambertMaterial({
            color: 0x0000ff,
            side: THREE.DoubleSide
        })
        let mesh = new THREE.Mesh(geometry, material)
        
        // scene.add(mesh)

        // 顶点颜色
        let vertexColors = new Float32Array([
            0,1,0,
            1,0,0,
            0,0,1,
            1,1,0,
            0.5,1,0,
            0.3,0.1,0.6
        ])
        geometry.attributes.color = new THREE.BufferAttribute(vertexColors, 3)
        // 点渲染
        let pointMater = new THREE.PointsMaterial({
            // color: 0xff0000,
            vertexColors: true,
            size: 10
        })
        
        let points = new THREE.Points(geometry, pointMater)
        // scene.add(points)

        // 线渲染
        let lineMater = new THREE.LineBasicMaterial({
        vertexColors: true,
            // color: 0xff0000
        })
        let lines = new THREE.Line(geometry, lineMater)
        scene.add(lines)



        let point = new THREE.PointLight(0xff0000)
        point.position.set(0, 150, 0)
        scene.add(point)

        var ambient = new THREE.AmbientLight(0xaab030);
        scene.add(ambient);

        /**
         * 创建网格模型
         */
        // var geometry = new THREE.SphereGeometry(60, 40, 40); //创建一个球体几何对象
        var cube = new THREE.BoxGeometry(100, 100, 100); //创建一个立方体几何对象Geometry
        var mater = new THREE.MeshLambertMaterial({
            color: 0xffffff,
            // opacity: 0.75,
            // transparent: true
            // specular:0x4488ee,
            // shininess:12
        }); //材质对象Material
        var mesh1 = new THREE.Mesh(cube, mater); //网格模型对象Mesh
        // scene.add(mesh1); //网格模型添加到场景中

        let video = document.createElement("video");
        video.style.width = "100%";
        video.style.display = "none";
        video.controls = true
        // video.src = videoUrl
        video.loop = true
        video.autoplay = true
        video.muted = true
        video.setAttribute("webkit-playsinline", "true")
        video.setAttribute("playsinline", "true")

        document.body.appendChild(video)
        
        video.onloadstart = () => {
            video.play()
        }

        let source = document.createElement("source")
        source.setAttribute("src", videoUrl)
        let source1 = document.createElement("source")
        source1.setAttribute("src", videoUrl1)

        video.appendChild(source)
        video.appendChild(source1)

        // document.body.appendChild(video)


        let videoTexture = new THREE.VideoTexture(video)
        videoTexture.wrapS = THREE.ClampToEdgeWrapping
        videoTexture.wrapT = THREE.ClampToEdgeWrapping
        videoTexture.encoding = THREE.sRGBEncoding
        // videoTexture.flipY = false
        videoTexture.minFilter = THREE.LinearFilter
        

        let textureGeo = new THREE.PlaneGeometry(100, 100)

        let textureMaterial = new THREE.MeshPhongMaterial({
            map: videoTexture
        })
        let textureMesh = new THREE.Mesh(textureGeo, textureMaterial)
        scene.add(textureMesh)
    

        
    }
    const render = () => {
        requestAnimationFrame(render)
        renderer.render(scene, camera)
    }
    useEffect(() => {
        init()
        render()
    }, []);
  
    return (
        <div ref={boxRef}>
        </div>
    )
}

export default ExampleOne
