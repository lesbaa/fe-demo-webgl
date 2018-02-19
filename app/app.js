import * as THREE from 'three'
import './modules/three-add-ons'
import dotScreenShader from './shaders/dot-screen'
import pixelateShader from './shaders/pixelate'
import rgbShiftShader from './shaders/rgb-shift'
import tvScreenShader from './shaders/tv-screen'
import lesCustomShader from './shaders/les-custom'

import {
  World,
  Box,
  Sphere,
  NaiveBroadphase,
  Body,
  Plane,
} from 'cannon'

const {
  Scene,
  PerspectiveCamera,
  WebGLRenderer,
  BoxGeometry,
  Mesh,
  AmbientLight,
  AdditiveBlending,
  GridHelper,
  SpotLight,
  SphereGeometry,
  TextureLoader,
  SphericalReflectionMapping,
  DoubleSide,
  MeshNormalMaterial,
  ShaderMaterial,
  MeshLambertMaterial,
  PlaneGeometry,
  Vector3,
  EffectComposer,
  OrbitControls,
  ShaderPass,
  RenderPass,
  PointLight,
} = THREE

// https://github.com/mrdoob/three.js/blob/master/examples/webgl_postprocessing.html

const canvas = document.getElementById('c')
const scene = new Scene()
const camera = new PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 0.1, 1000 )
const textureLoader = new TextureLoader()

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

const boxGeom = new BoxGeometry(1, 1, 1)
const sphereGeom = new SphereGeometry(0.5, 10, 10)
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

// physics stuff
const world = new World()
world.gravity.set(0, -9.82, -0)
world.broadphase = new NaiveBroadphase()

const groundShape = new Plane()
const groundBody = new Body({ mass: 0, shape: groundShape })
groundBody.position.set(0, -1, 0)
world.add(groundBody)

const bodies = []
const objects = []

for (let i = 0; i < 1; i++) {
  // const cube = new Mesh(
  //   boxGeom,
  //   shaderMaterial,
  // )
  // scene.add(cube)
  
  const sphere = new Mesh(
    sphereGeom,
    shaderMaterial
  )
  const sphereShape = new Sphere(0.5)
  const sphereBody = new Body({
    mass: 1.0,
    shape: sphereShape,
  })
  const rndmZ = Math.random()
  bodies.push(sphereBody)
  objects.push(sphere)
  sphereBody.position.set(0, i, 0)
  sphere.position.set(0, i, 0)
  world.add(sphereBody)
  scene.add(sphere)  
}

let step = 0

const loop = (time) => {
  requestAnimationFrame(loop)
  
  world.step(step / 1000)
  step++
  for (let i = 0;  i < bodies.length; i++) {
    const child = objects[i]
    debugger
    const body = bodies[i]
    debugger
    child.position.x = body.position.x
    debugger
    child.position.y = body.position.y
    debugger
    child.position.z = body.position.z
    debugger
  }

  shaderMaterial.uniforms.tLes.value += 0.1
  
  camera.lookAt(new Vector3(
    0,
    0,
    0,
  ))

  controls.update()
  renderer.render( scene, camera )
}

renderer.render( scene, camera )
window.loop = loop