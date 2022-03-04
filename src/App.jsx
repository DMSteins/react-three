import { useState, useEffect } from 'react'
import * as THREE from "three"

function App() {
  const [count, setCount] = useState(0)

  useEffect(() => {
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

    let material = new THREE.MeshBasicMaterial({
      color: 0x0000ff,
      side: THREE.DoubleSide
    })
    let mesh = new THREE.Mesh(geometry, material)

    let scene = new THREE.Scene()
    scene.add(mesh)

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
      specular:0x4488ee,
      shininess:12
    }); //材质对象Material
    var mesh1 = new THREE.Mesh(cube, mater); //网格模型对象Mesh
    scene.add(mesh1); //网格模型添加到场景中

    let w = window.innerWidth
    let h = window.innerHeight
    let rate = w / h
    let space = 200
    let camera = new THREE.OrthographicCamera(-space * rate, space * rate, space, -space, 1, 1000)
    camera.position.set(200, 300, 200)
    camera.lookAt(scene.position)

    let renderer = new THREE.WebGLRenderer()
    renderer.setSize(w, h)
    renderer.setClearColor(0xb9d3ff, 1)
    document.body.appendChild(renderer.domElement)

    

    let startTime = new Date()
    function draw(){
      let curTime = new Date()
      let t = curTime - startTime
      startTime = curTime

      renderer.render(scene, camera)
      mesh1.rotateY(0.001 * t)

      requestAnimationFrame(draw)
    }
    requestAnimationFrame(draw)
  }, []);
  
  return (
    <div className="App">
      
    </div>
  )
}

export default App
