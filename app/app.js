/* global 
NyARRgbRaster_Canvas2D
FLARParam
FLARMultiIdMarkerDetector
NyARTransMatResult
*/
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

import copyMarkerMatrix from './modules/copy-marker-matrix'

Matrix4.prototype.setFromArray = function(m) {
  return this.set(
    m[0], m[4], m[8], m[12],
    m[1], m[5], m[9], m[13],
    m[2], m[6], m[10], m[14],
    m[3], m[7], m[11], m[15]
  )
}

// https://www.html5rocks.com/en/tutorials/webgl/jsartoolkit_webrtc/#toc-setup

const DETECTION_THRESHOLD = 75

document.body.addEventListener('click', () => loop())

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
      width: 640,
      height: 480,
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

const shaderMaterial = new ShaderMaterial(lesCustomShader)

const light = new PointLight( 0x44ddcc, 1.00)
light.position.set(5, 5, 5)
scene.add(light)

const lightTwo = new PointLight( 0xdd3333, 1.00)
lightTwo.position.set(-5, -5, -5)
scene.add(lightTwo)

const radius = 1
// physics stuff
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



const rasterCanvas = document.createElement('canvas') // canvas to draw our video on
rasterCanvas.width = window.innerWidth
rasterCanvas.height = window.innerHeight

const ctx = rasterCanvas.getContext('2d')
// Create a RGB raster object for the 2D canvas.
// JSARToolKit uses raster objects to read image data.
// Note that you need to set canvas.changed = true on every frame.
const raster = new NyARRgbRaster_Canvas2D(rasterCanvas)

// FLARParam is the thing used by FLARToolKit to set camera parameters.
// Here we create a FLARParam for images with window.innerWidthxwindow.innerHeight pixel dimensions.
const param = new FLARParam(window.innerWidth, window.innerHeight)

// The FLARMultiIdMarkerDetector is the actual detection engine for marker detection.
// It detects multiple ID markers. ID markers are special markers that encode a number.
const detector = new FLARMultiIdMarkerDetector(param, 120)

// For tracking video set continue mode to true. In continue mode, the detector
// tracks markers across multiple frames.
detector.setContinueMode(true)

// Copy the camera perspective matrix from the FLARParam to the WebGL library camera matrix.
// The second and third parameters determine the zNear and zFar planes for the perspective matrix.
param.copyCameraMatrix(camera.matrix, 10, 10000)

window.s = scene
window.o = objects
window.b = bodies

let t = 0

var markerRoot = new Object3D()
markerRoot.matrixAutoUpdate = false

// Add the marker models and suchlike into your marker root object.
var cube = new THREE.Mesh(
  new THREE.CubeGeometry(100,100,100),
  new THREE.MeshBasicMaterial({color: 0xff00ff})
)

cube.position.z = -50
markerRoot.add(cube)
scene.add(markerRoot)

const tmp = new Float32Array(16)

param.copyCameraMatrix(tmp, 10, 10000)
camera.projectionMatrix.setFromArray(tmp)


const loop = (time) => {
  requestAnimationFrame(loop)
  // Draw the video frame to the raster canvas, scaled to window.innerWidthxwindow.innerHeight.
  ctx.drawImage(video, 0, 0, rasterCanvas.width, rasterCanvas.height)

  // Tell the raster object that the underlying canvas has changed.
  rasterCanvas.changed = true

  // Do marker detection by using the detector object on the raster object.
  // The threshold parameter determines the threshold value
  // for turning the video frame into a 1-bit black-and-white image.
  //
  const markerCount = detector.detectMarkerLite(raster, DETECTION_THRESHOLD)
  const resultMat = new NyARTransMatResult()

  const markers = {}

  if (markerCount) console.log('marker!')
  for (let idx = 0; idx < markerCount; idx++) {
    // Get the ID marker data for the current marker.
    // ID markers are special kind of markers that encode a number.
    // The bytes for the number are in the ID marker data.
    const id = detector.getIdMarkerData(idx)
    
    // Read bytes from the id packet.
    let currId = -1
    // This code handles only 32-bit numbers or shorter.
    if (id.packetLength <= 4) {
      currId = 0
      for (let i = 0; i < id.packetLength; i++) {
        currId = (currId << 8) | id.getPacketData(i)
      }
    }
  
    // If this is a new id, let's start tracking it.
    if (markers[currId] == null) {
      markers[currId] = {}
    }
    // Get the transformation matrix for the detected marker.
    detector.getTransformMatrix(idx, resultMat)
    copyMarkerMatrix(resultMat, tmp)
    // Copy the result matrix into our marker tracker object.
    markerRoot.matrix.setFromArray(tmp)
  }

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

  renderer.autoClear = false
  renderer.clear()
  renderer.render(scene, camera)

}

loop()
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
