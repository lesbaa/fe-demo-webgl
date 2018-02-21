import * as THREE from 'three'
import './modules/three-add-ons'
import dotScreenShader from './shaders/dot-screen'
import pixelateShader from './shaders/pixelate'
import rgbShiftShader from './shaders/rgb-shift'
import tvScreenShader from './shaders/tv-screen'
import lesCustomShader from './shaders/les-custom'

import GPU from 'gpu.js'

const {
  Scene,
  PerspectiveCamera,
  WebGLRenderer,
  BoxGeometry,
  Mesh,
  SphereGeometry,
  DoubleSide,
  ShaderMaterial,
  MeshLambertMaterial,
  PlaneGeometry,
  Vector3,
  OrbitControls,
  PointLight,
} = THREE

// https://github.com/mrdoob/three.js/blob/master/examples/webgl_postprocessing.html

const canvas = document.getElementById('c')
const scene = new Scene()
const camera = new PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 0.1, 1000 )

const renderer = new WebGLRenderer({
  // preserveDrawingBuffer: true,
  canvas,
  antialias: true,
})

renderer.setSize( canvas.offsetWidth, canvas.offsetHeight )

const normalMaterial = new MeshLambertMaterial({
  side: DoubleSide,
  color: 0x66dddd,
})

const shaderMaterial = new ShaderMaterial(lesCustomShader)

const light = new PointLight( 0x44ddcc, 1.00)
light.position.set(5, 5, 5)
scene.add(light)

const lightTwo = new PointLight( 0xdd3333, 1.00)
lightTwo.position.set(-5, -5, -5)
scene.add(lightTwo)

const radius = 1

const boxGeom = new BoxGeometry(radius, radius, radius)
const sphereGeom = new SphereGeometry(radius, 10, 10)
const groundGeom = new PlaneGeometry(1000, 1000, 1000, 10, 10)

const ground = new Mesh(
  groundGeom,
  normalMaterial
)
scene.add(ground)

ground.rotation.x = 1.5708
ground.position.y = -1
camera.position.z = 15
camera.position.y = 1.7

const controls = new OrbitControls(camera, renderer.domElement)



let t = 1

const gpu = new GPU()

const totalNumObjects = 10

const myWorld = []

for (let i = 0; i < totalNumObjects; i++) {
  const sphere = new Mesh(
    sphereGeom,
    normalMaterial,
  )
  
  sphere.position.x = ~~(Math.random() * 2)
  sphere.position.y = (i + radius) * 2
  sphere.position.z = ~~(Math.random() * 2)

  scene.add(sphere)
  myWorld.push({
    x: sphere.position.x,
    y: sphere.position.y,
    z: sphere.position.z,
    dx: 0.0,
    dy: -9.82,
    dz: 0.0,
    r: radius,
  })
}

const updateWorldState = gpu.createKernel(function (object, otherObject) {
  // h^2 = b^2 + c^2
  function collision(a, b) {
    var diffX = a.x - b.x
    var diffY = a.y - b.y
    var diffZ = a.z - b.z
    var hyp = Math.sqrt(
      Math.pow(diffX, 2) +
      Math.pow(diffY, 2) +
      Math.pow(diffZ, 2)
    )
    return hyp > (a.r + b.r)
  }

  if (object.y >= 0) {
    object.y = object.y + object.dy;
  }
  
  if (object.y <= 0) {
    object.dy = object.dy * -1
  }

  if (collision(object, otherObject)) {
    object.dx = ( object.dx + otherObject.dx ) / 2;
    otherObject.dx = ( object.dx + otherObject.dx ) / 2;
    object.dy = ( object.dy + otherObject.dy ) / 2;
    otherObject.dy = ( object.dy + otherObject.dy ) / 2;
    object.dz = ( object.dz + otherObject.dz ) / 2;
    otherObject.dz = ( object.dz + otherObject.dz ) / 2;
  }

  return world
}).setOutput([totalNumObjects])

const loop = (time) => {
  requestAnimationFrame(loop)
  
  // for (let i = 0; i < myWorld.length; i++) {
  //   const worldState = updateWorldState
  //   const object = myWorld[i]

  // }
  
  shaderMaterial.uniforms.tLes.value += 0.1
  camera.lookAt(
    new Vector3(
      0,
      0,
      0
    )
  )

  controls.update()
  renderer.render( scene, camera )
}

// renderer.render( scene, camera )
loop()