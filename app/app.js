import './modules/three-add-ons'
import {
  // SETUP
  Scene,
  WebGLRenderer,
  Mesh,
  PerspectiveCamera,

  // GEOMETRIES
  SphereBufferGeometry,
  BoxGeometry,
  // LIGHTS
  AmbientLight,

  // MATERIALS
  MeshLambertMaterial,
  MeshNormalMaterial,

  // COMPOSER / SHADERS
  EffectComposer,
  // MATHS
  Vector3,

  // UTILS
  GridHelper,
  Clock,

} from 'three'
import WebGLDebugUtils from 'webgl-debug'

// https://github.com/mrdoob/three.js/blob/master/examples/webgl_postprocessing.html

const aspect = window.innerWidth / window.innerHeight

const canvas = document.getElementById('c')
const scene = new Scene()
const camera = new PerspectiveCamera( 75, window.innerWidth/window.innerHeight, 0.1, 1000 )
camera.position.y = 10
camera.position.x = 20
camera.position.z = 20
const renderer = new WebGLRenderer({
  // preserveDrawingBuffer: true,
  canvas,
  antialias: true,
})

function throwOnGLError(err, funcName, args) {
  throw WebGLDebugUtils.glEnumToString(err)
  + "was caused by call to "
  + funcName
}

renderer.context = WebGLDebugUtils.makeDebugContext(renderer.context, throwOnGLError)
renderer.setPixelRatio( window.devicePixelRatio )
renderer.setSize( canvas.offsetWidth, canvas.offsetHeight )

const gridHelper = new GridHelper( 40, 10 )
scene.add( gridHelper )

const shape = new Mesh(
  new BoxGeometry( 10, 10, 10 ),
  new MeshNormalMaterial({
    // side: DoubleSide,
    color: 0xffffff,
  })
)

scene.add(shape)

const light = new AmbientLight(0xffffff, 40)
scene.add(light)

const clock = new Clock()

const loop = (time) => {
  camera.lookAt(scene.position)  
  shape.rotation.y += 0.01
  shape.rotation.x += 0.01
  shape.rotation.z += 0.01
  renderer.render( scene, camera )
  requestAnimationFrame(loop)
}

loop()

const resize = () => {
  canvas.width = window.innerWidth
  canvas.height = window.innerHeight
  renderer.setSize(window.innerWidth, window.innerHeight)
  camera.updateProjectionMatrix()
}

window.addEventListener('resize', resize)
