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
  PointLight,
  Matrix4,
  Object3D,
  AnimationMixer,
  ColladaLoader,
  Clock,
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

let mixer
let avatar

var markerRoot = new Object3D()
markerRoot.matrixAutoUpdate = false

const loader = new ColladaLoader()
loader.load('./assets/stormtrooper/stormtrooper.dae', (collada) => {
  const animations = collada.animations
  avatar = collada.scene
  mixer = new AnimationMixer(avatar)
  mixer.clipAction( animations[ 0 ] ).play()
  scene.add(avatar)
})

avatar.position.z = -50
markerRoot.add(avatar)
scene.add(markerRoot)

param.copyCameraMatrix(tmp, 10, 10000)
camera.projectionMatrix.setFromArray(tmp)

const tmp = new Float32Array(16)
const clock = new Clock()

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

  // if (markerCount) console.log('marker!')
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
  
  const delta = clock.getDelta()
  if (mixer !== undefined) {
    mixer.update(delta)
  }

  renderer.autoClear = false
  renderer.clear()
  renderer.render(scene, camera)

}

loop()
