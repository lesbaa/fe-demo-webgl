import * as THREE from 'three'
import './modules/three-add-ons'
import dotScreenShader from './shaders/dot-screen'
import pixelateShader from './shaders/pixelate'
import rgbShiftShader from './shaders/rgb-shift'
import tvScreenShader from './shaders/tv-screen'
import lesCustomShader from './shaders/les-custom'

import {
  World,
} from 'oimo'

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

// physics stuff
const world = new World({ 
  timestep: 1 / 60,
  iterations: 8, 
  broadphase: 2, // 1 brute force, 2 sweep and prune, 3 volume tree
  worldscale: 1, // scale full world 
  random: true,  // randomize sample
  info: false,   // calculate statistic or not
  gravity: [0, -9.8, 0] 
})

const groundBody = world.add({size:[50, 10, 50], pos:[0, -5.65, 0], density:1 })

let bodies = []
let objects = []

const addObject = (i) => {
  const isOdd = i % 2 === 0
  
  const object = new Mesh(
    isOdd ? sphereGeom : boxGeom,
    shaderMaterial
  )
  
  const rndmZ = Math.random()
  const rndmX = Math.random()
  
  scene.add(object)
  object.position.set(rndmX, 10, rndmZ)

  const options = {
    type: isOdd ? 'sphere' :'box',
    size:[
      radius,
      radius,
      radius,
    ],
    pos:[rndmX, 10, rndmZ],
    density:1,
    move:true
  }

  const sphereBody = world.add( options )

  bodies.push(sphereBody)
  objects.push(object)
}

let t = 1

const loop = (time) => {
  requestAnimationFrame(loop)
  if (~~time % 3 === 0) {
    addObject(~~(3 * Math.random()))
  }
  world.step(t)
  for (let i = 0; i < objects.length; i++) {
    const child = objects[i]
    const body = bodies[i]
    if (body.getPosition().y < -5) {
      const index = bodies.indexOf(body)
      bodies.splice(index, 1)
      objects.splice(index, 1)
    } else {
      child.position.copy( body.getPosition() )
      child.quaternion.copy( body.getQuaternion() )
    }
  }

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