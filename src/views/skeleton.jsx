import { useState, useEffect, useRef } from 'react'
import * as THREE from "three"
import { OrbitControls } from "../utils/OrbitControls"
import StarrySkyShader from '../utils/StarrySkyShader';
// 骨骼动画
function SkeletonExam() {
    const ExampleRef = useRef(null)

    let renderer, scene, camera;
    let line;
    let group;
    let skeleton;

    useEffect(() => {
        init()
        animate()
    }, []);

    const init = ()=>{
        
        // renderer
        renderer = new THREE.WebGLRenderer();
        renderer.setPixelRatio( window.devicePixelRatio );
        renderer.setSize( window.innerWidth, window.innerHeight );
        renderer.setClearColor(0xffffff)
        ExampleRef.current.appendChild( renderer.domElement );

        // scene
        scene = new THREE.Scene();

        // camera
        camera = new THREE.PerspectiveCamera( 45, window.innerWidth / window.innerHeight, 1, 10000 );
        // camera = new THREE.OrthographicCamera(window.innerWidth / -2, window.innerWidth / 2, window.innerHeight / 2, window.innerHeight / -2 ,0, 1000);
        camera.position.set( 0, 300, 300 );

        // light
        const directionalLight = new THREE.DirectionalLight( 0xff0000, 0.6 );
        directionalLight.position.set( 100, 1000, 100 ).normalize();
        scene.add( directionalLight );

        const ambientLight = new THREE.AmbientLight( 0xffffff, 0.6 );
        scene.add( ambientLight );


        const controls = new OrbitControls( camera, renderer.domElement );
        // controls.minDistance = 100;
        // controls.maxDistance = 1000;

        // 天空盒
        /*  ::Starry SkyDome ShaderMaterial :: 
        * 
        * The parameters on this shader can be played around with for different effects. 
        * 
        * Use the offset parameter to shift the noise pattern, avoiding large clusters in places you don't want them. The rest of the parameters are better described visually.
        * 
        */

        var skyDomeRadius = 500.01;
        var sphereMaterial = new THREE.ShaderMaterial({
            uniforms: {
                skyRadius: { value: skyDomeRadius },
                env_c1: { value: new THREE.Color("#0d1a2f") },
                env_c2: { value: new THREE.Color("#0f8682") },
                noiseOffset: { value: new THREE.Vector3(100.01, 100.01, 100.01) },
                starSize: { value: 0.01 },
                starDensity: { value: 0.09 },
                clusterStrength: { value: 0.2 },
                clusterSize: { value: 0.2 },
            },
            vertexShader: StarrySkyShader.vertexShader,
            fragmentShader: StarrySkyShader.fragmentShader,
            side: THREE.DoubleSide,
        })
        var sphereGeometry = new THREE.SphereGeometry(skyDomeRadius, 20, 20);
        var skyDome = new THREE.Mesh(sphereGeometry, sphereMaterial);
        scene.add(skyDome);
        
        createSkeletonAnim();
        
    }
    const createSkeletonAnim = ()=>{
        /**
         * 创建骨骼网格模型SkinnedMesh
         */
        // 创建一个圆柱几何体，高度120，顶点坐标y分量范围[-60,60]
        var geometry = new THREE.CylinderGeometry(5, 10, 120, 50, 300);
        geometry.translate(0, 60, 0); //平移后，y分量范围[0,120]
        console.log("name", geometry.vertices); //控制台查看顶点坐标
        let vertices = geometry.vertices || geometry.attributes.position.array
        //
        /**
         * 设置几何体对象Geometry的蒙皮索引skinIndices、权重skinWeights属性
         * 实现一个模拟腿部骨骼运动的效果
         */
        //遍历几何体顶点，为每一个顶点设置蒙皮索引、权重属性
        //根据y来分段，0~60一段、60~100一段、100~120一段
        for (var i = 0; i < vertices.length; i++) {
        var vertex = vertices[i]; //第i个顶点
        if (vertex.y <= 60) {
            // 设置每个顶点蒙皮索引属性  受根关节Bone1影响
            geometry.skinIndices.push(new THREE.Vector4(0, 0, 0, 0));
            // 设置每个顶点蒙皮权重属性
            // 影响该顶点关节Bone1对应权重是1-vertex.y/60
            geometry.skinWeights.push(new THREE.Vector4(1 - vertex.y / 60, 0, 0, 0));
        } else if (60 < vertex.y && vertex.y <= 60 + 40) {
            // Vector4(1, 0, 0, 0)表示对应顶点受关节Bone2影响
            geometry.skinIndices.push(new THREE.Vector4(1, 0, 0, 0));
            // 影响该顶点关节Bone2对应权重是1-(vertex.y-60)/40
            geometry.skinWeights.push(new THREE.Vector4(1 - (vertex.y - 60) / 40, 0, 0, 0));
        } else if (60 + 40 < vertex.y && vertex.y <= 60 + 40 + 20) {
            // Vector4(2, 0, 0, 0)表示对应顶点受关节Bone3影响
            geometry.skinIndices.push(new THREE.Vector4(2, 0, 0, 0));
            // 影响该顶点关节Bone3对应权重是1-(vertex.y-100)/20
            geometry.skinWeights.push(new THREE.Vector4(1 - (vertex.y - 100) / 20, 0, 0, 0));
        }
        }
        // 材质对象
        var material = new THREE.MeshPhongMaterial({
        skinning: true, //允许蒙皮动画
        // wireframe:true,
        });
        // 创建骨骼网格模型
        var SkinnedMesh = new THREE.SkinnedMesh(geometry, material);
        SkinnedMesh.position.set(50, 120, 50); //设置网格模型位置
        SkinnedMesh.rotateX(Math.PI); //旋转网格模型
        scene.add(SkinnedMesh); //网格模型添加到场景中

        /**
         * 骨骼系统
         */
        var Bone1 = new THREE.Bone(); //关节1，用来作为根关节
        var Bone2 = new THREE.Bone(); //关节2
        var Bone3 = new THREE.Bone(); //关节3
        // 设置关节父子关系   多个骨头关节构成一个树结构
        Bone1.add(Bone2);
        Bone2.add(Bone3);
        // 设置关节之间的相对位置
        //根关节Bone1默认位置是(0,0,0)
        Bone2.position.y = 60; //Bone2相对父对象Bone1位置
        Bone3.position.y = 40; //Bone3相对父对象Bone2位置

        // 所有Bone对象插入到Skeleton中，全部设置为.bones属性的元素
        skeleton = new THREE.Skeleton([Bone1, Bone2, Bone3]); //创建骨骼系统
        // console.log(skeleton.bones);
        // 返回所有关节的世界坐标
        // skeleton.bones.forEach(elem => {
        //   console.log(elem.getWorldPosition(new THREE.Vector3()));
        // });
        //骨骼关联网格模型
        SkinnedMesh.add(Bone1); //根骨头关节添加到网格模型
        SkinnedMesh.bind(skeleton); //网格模型绑定到骨骼系统
        console.log(SkinnedMesh);
        /**
         * 骨骼辅助显示
         */
        var skeletonHelper = new THREE.SkeletonHelper(SkinnedMesh);
        scene.add(skeletonHelper);

        // 转动关节带动骨骼网格模型出现弯曲效果  好像腿弯曲一样
        skeleton.bones[1].rotation.x = 0.5;
        skeleton.bones[2].rotation.x = 0.5;
    }

    // render
    function render() {
        renderer.render( scene, camera );
    }
    var clock = new THREE.Clock();
    let isCompalted = false;
    let totalDelta = 0

    let n = 0, t = 50, step = 0.01
    // animate
    function animate() {
        render();
        requestAnimationFrame( animate );

        n += 1
        if(n < t){
            skeleton.bones[0].rotation.x = skeleton.bones[0].rotation.x - step
            skeleton.bones[1].rotation.x = skeleton.bones[1].rotation.x + step
            skeleton.bones[2].rotation.x = skeleton.bones[2].rotation.x + 2 * step
        }else if(n < 2 * t && n > t){
            skeleton.bones[0].rotation.x = skeleton.bones[0].rotation.x + step
            skeleton.bones[1].rotation.x = skeleton.bones[1].rotation.x - step
            skeleton.bones[2].rotation.x = skeleton.bones[2].rotation.x - 2 * step
        }

        if(n === 2 * t){
            n = 0
        }
    }
  
    return (
        <div ref={ExampleRef}>
        
        </div>
    )
}

export default SkeletonExam
