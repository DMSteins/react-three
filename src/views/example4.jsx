import { useState, useEffect, useRef } from 'react'
import * as THREE from "three"
// 帧动画demo
function Example4() {
    const ExampleRef = useRef(null)
    useEffect(() => {
        init()
    }, []);

    const init = ()=>{
        let w = window.innerWidth
        let h = window.innerHeight
        let renderer = new THREE.WebGLRenderer()
        renderer.setSize(w, h)
        renderer.setClearColor("#2266aa", 1)

        let scene = new THREE.Scene()
        let s = 200
        let camera = new THREE.OrthographicCamera( - w / 2, w/2, h/2,-h/2,1,2000)
        camera.position.set(300, 350, 450)
        camera.lookAt(scene.position)

        let light = new THREE.DirectionalLight(0xffffff)
        light.position.set(100,150,200)
        scene.add(light)

        /**
         * 创建两个网格模型并设置一个父对象group
         */
        let group = new THREE.Group()
        let box1 = new THREE.BoxBufferGeometry(50,50,50)

        let material1 = new THREE.MeshLambertMaterial({
            color: 0xaa1188,
        })
        let mesh1 = new THREE.Mesh(box1, material1)

        let box2 = new THREE.SphereGeometry(25)
        let material2 = new THREE.MeshLambertMaterial({
            color: 0x6600ff
        })
        let mesh2 = new THREE.Mesh(box2, material2)
        mesh2.position.set(100,0,0)

        mesh1.name = "Box"; //网格模型1命名
        mesh2.name = "Sphere"; //网格模型2命名
        group.add(mesh1); //网格模型添加到组中
        // group.add(mesh2); //网格模型添加到组中

        
        /**
         * 编辑group子对象网格模型mesh1和mesh2的帧动画数据
         */
        // 创建名为Box对象的关键帧数据
        var times = [0, 10]; //关键帧时间数组，离散的时间点序列
        var values = [0, 0, 0, 150, 0, 0]; //与时间点对应的值组成的数组
        // 创建位置关键帧对象：0时刻对应位置0, 0, 0   10时刻对应位置150, 0, 0
        // var posTrack = new THREE.KeyframeTrack('Box.position', times, values);
        // 创建颜色关键帧对象：10时刻对应颜色1, 0, 0   20时刻对应颜色0, 0, 1
        // var colorKF = new THREE.KeyframeTrack('Box.material.color', [0, 10], [1, 0, 0, 0, 0, 1]);
        // 创建名为Sphere对象的关键帧数据  从0~20时间段，尺寸scale缩放3倍
        // var scaleTrack = new THREE.KeyframeTrack('Sphere.scale', [0, 20], [1, 1, 1, 3, 3, 3]);
        var rotateTrack = new THREE.KeyframeTrack('Box.rotation[z]', [0, 10], [0, Math.PI / 2]);

        // duration决定了默认的播放时间，一般取所有帧动画的最大时间
        // duration偏小，帧动画数据无法播放完，偏大，播放完帧动画会继续空播放
        var duration = 20;
        // 多个帧动画作为元素创建一个剪辑clip对象，命名"default"，持续时间20
        var clip = new THREE.AnimationClip("default", duration, [rotateTrack]);
        let planeVertices1 = new Float32Array([
            -100,0,0,
            -100,0,100,
            0,0,100,
            0,0,100,
            0,0,0,
            -100,0,0,
        ])
        let planeGeo1 = new THREE.BufferGeometry()
        planeGeo1.attributes.position = new THREE.BufferAttribute(planeVertices1, 3)
        planeGeo1.attributes.normal = new THREE.BufferAttribute(new Float32Array([
            0,1,0,
            0,1,0,
            0,1,0,
            0,1,0,
            0,1,0,
            0,1,0,
        ]), 3)
        let planeMater1 = new THREE.MeshLambertMaterial({
            color: 0x6600ff,
            side: THREE.DoubleSide
        })
        let planeMesh1 = new THREE.Mesh(planeGeo1, planeMater1)
        scene.add(planeMesh1)

        let planeVertices = new Float32Array([
            0,0,0,
            0,0,100,
            100,0,100,
            100,0,100,
            100,0,0,
            0,0,0
        ])
        let planeGeo = new THREE.BufferGeometry()
        planeGeo.attributes.position = new THREE.BufferAttribute(planeVertices, 3)
        planeGeo.attributes.normal = new THREE.BufferAttribute(new Float32Array([
            0,1,0,
            0,1,0,
            0,1,0,
            0,1,0,
            0,1,0,
            0,1,0,
        ]), 3)
        let planeMater = new THREE.MeshLambertMaterial({
            color: 0x6600ff,
            side: THREE.DoubleSide
        })
        let planeMesh = new THREE.Mesh(planeGeo, planeMater)
        
        planeMesh.name = "Plane"
        let rotateKF = new THREE.KeyframeTrack('Plane.rotation[z]', [0, 60], [0, Math.PI / 2])
        let planeClip = new THREE.AnimationClip("planeClip", 60, [rotateKF])
        let planeMixer = new THREE.AnimationMixer(planeMesh)
        
        let action = planeMixer.clipAction(planeClip)
        action.timeScale = 60
        action.clampWhenFinished = true
        action.loop = THREE.LoopOnce
        action.play()

        scene.add(planeMesh)
        /**
         * 播放编辑好的关键帧数据
         */
        // group作为混合器的参数，可以播放group中所有子对象的帧动画
        var mixer = new THREE.AnimationMixer(group);
        // 剪辑clip作为参数，通过混合器clipAction方法返回一个操作对象AnimationAction
        var AnimationAction = mixer.clipAction(clip);
        //通过操作Action设置播放方式
        AnimationAction.timeScale = 20;//默认1，可以调节播放速度
        AnimationAction.loop = THREE.LoopOnce; //不循环播放
        AnimationAction.play();//开始播放


        // scene.add(group)

        // 创建一个时钟对象Clock
        var clock = new THREE.Clock();
        // 渲染函数
        function render() {
            renderer.render(scene, camera)
            requestAnimationFrame(render); //请求再次执行渲染函数render，渲染下一帧

            //clock.getDelta()方法获得两帧的时间间隔
            // 更新混合器相关的时间
            // mixer.update(clock.getDelta());
            planeMixer.update(clock.getDelta());
        }
        render();


        ExampleRef.current.appendChild(renderer.domElement)

        
    }
  
    return (
        <div ref={ExampleRef}>
        
        </div>
    )
}

export default Example4
