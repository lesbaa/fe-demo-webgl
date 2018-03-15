import * as THREE from 'three'
import './modules/three-add-ons'
import lesCustomShader from './shaders/les-custom'
import arShader from './shaders/ar-shader'

import {
  World,
} from 'oimo'

const {
  Scene,
  PerspectiveCamera,
  WebGLRenderer,
  BoxGeometry,
  Mesh,
  SphereGeometry,
  TextureLoader,
  DoubleSide,
  ShaderMaterial,
  MeshLambertMaterial,
  MeshNormalMaterial,
  PlaneGeometry,
  Vector3,
  OrbitControls,
  PointLight,
  Matrix4,
  Object3D,
} = THREE

import {
  ARCameraParam,
  ARController,
} from 'jsartoolkit5'

console.log('wat')

const USE_SHADER = true
const DEBUG = false

document.body.addEventListener('click', () => loop())

const arShaderMaterial = new ShaderMaterial(arShader)

const video = document.getElementById('v')

navigator.mediaDevices.enumerateDevices()
  .then(getMedia)
  .then((mediaStream) => {
    video.srcObject = mediaStream
    video.addEventListener('canplay', () => {
      video.play()
    })
  })
  .catch(e => console.log(e, video.readyState))

function getMedia(devices) {
  const [ deviceId ] = devices
    .filter(d => (d.label.includes('back')) )
    .map(d => d.deviceId )
  const constraints = {
    audio: false,
    video: {
      deviceId: { exact: deviceId },
    },
  }
  return navigator.mediaDevices.getUserMedia(constraints)
}

const canvas = document.getElementById('c')
const scene = new Scene()
const camera = new PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 0.1, 1000 )

const renderer = new WebGLRenderer({
  // preserveDrawingBuffer: true,
  alpha: true,
  canvas,
  antialias: true,
})

renderer.setSize( canvas.offsetWidth, canvas.offsetHeight )

var markerRoot = new Object3D()

markerRoot.wasVisible = false
markerRoot.markerMatrix = new Float64Array(12)
markerRoot.matrixAutoUpdate = false
camera.matrixAutoUpdate = false

const cube = new Mesh(
  new BoxGeometry(1, 1, 1),
  new MeshNormalMaterial()
)

let arController = null

markerRoot.add(cube)
scene.add(markerRoot)

const cameraParam = new ARCameraParam()
cameraParam.onload = cameraParam.onload = function() {

  arController = new ARController(
    undefined,
    undefined,
    cameraParam
  )
  // arController.debugSetup()

  const camera_mat = arController.getCameraMatrix()

  if (USE_SHADER) {
    arShaderMaterial.uniforms.cameraMatrix.value.set(camera_mat)
  } else {
    camera.projectionMatrix.set(camera_mat)
  }
}

// cameraParam.load('assets/camera_para.dat')

// const shaderMaterial = new ShaderMaterial(lesCustomShader)

const light = new PointLight( 0x44ddcc, 1.00)
light.position.set(5, 5, 5)
scene.add(light)

const lightTwo = new PointLight( 0xdd3333, 1.00)
lightTwo.position.set(-5, -5, -5)
scene.add(lightTwo)

const radius = 1


// // physics stuff
// const world = new World({ 
//   timestep: 1 / 60,
//   iterations: 8, 
//   broadphase: 2, // 1 brute force, 2 sweep and prune, 3 volume tree
//   worldscale: 1, // scale full world 
//   random: true,  // randomize sample
//   info: false,   // calculate statistic or not
//   gravity: [0, -9.8, 0] 
// })

// const groundBody = world.add({size:[100, 10, 100], pos:[0, -5.65, 0], density:1 })

let bodies = []
let objects = []


window.s = scene
window.o = objects
window.b = bodies

let t = 1

const loop = (time) => {
  requestAnimationFrame(loop)
  if (!arController) return
  
  arController.detectMarker(video) // this will need
  const markerNum = arController.getMarkerNum()
  if (markerNum > 0) {
    if (markerRoot.visible) {
      arController.getTransMatSquareCont(
        0,
        1,
        markerRoot.markerMatrix,
        markerRoot.markerMatrix
      )
    } else {
      arController.getTransMatSquare(
        0,
        1,
        markerRoot.markerMatrix
      )
      markerRoot.visible = true
      if (USE_SHADER) {
        arController.transMatToGLMat(
          markerRoot.markerMatrix,arShaderMaterial.uniforms.transformationMatrix.value.elements
        )
      } else {
        arController.transMatToGLMat(
          markerRoot.markerMatrix,
          markerRoot.matrix.elements
        )
      }
    } 
  } else {
    markerRoot.visible = false
  }
  
  // if (DEBUG) arController.debugDraw()

  // Render the scene.
  renderer.autoClear = false
  renderer.clear()
  renderer.render(scene, camera)
  
  // if (~~time % 5 === 0) {
  //   addObject(~~(1 * Math.random()))
  // }
  // world.step(t)
  // for (let i = 0; i < objects.length; i++) {
  //   const child = objects[i]
  //   const body = bodies[i]
  //   if (body.getPosition().x > 20 || body.getPosition().x < -20 || body.getPosition().z < -20 || body.getPosition().z > 20 ) {
  //     const index = bodies.indexOf(body)
  //     const sceneIndex = scene.children.indexOf(objects[i])
  //     bodies.splice(index, 1)
  //     objects.splice(index, 1)
  //     scene.children.splice(sceneIndex, 1)
  //   } else {
  //     child.position.copy( body.getPosition() )
  //     child.quaternion.copy( body.getQuaternion() )
  //   }
  // }

  // shaderMaterial.uniforms.tLes.value += 0.

  renderer.render( scene, camera )
}

// renderer.render( scene, camera )

function addObject () {
  const nr = (~~(Math.random() * 3) + 1) * radius
  
  const sphereGeom = new SphereGeometry(nr, 10, 10)
  
  const object = new Mesh(
    sphereGeom,
    shaderMaterial
  )

  const rndmZ = (Math.random() * 30) - 15
  const rndmX = (Math.random() * 30) - 15

  scene.add(object)
  object.position.set(rndmX, 50, rndmZ)

  const options = {
    type: 'sphere',
    size:[
      nr,
      nr,
      nr,
    ],
    pos:[rndmX, 50, rndmZ],
    density: 1,
    move: true,
  }

  const sphereBody = world.add(options)

  bodies.push(sphereBody)
  objects.push(object)
}
