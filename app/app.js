import {
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
  PlaneGeometry,
} from 'three'

import {
  World,
  Vec3,
} from 'cannon'

// https://github.com/mrdoob/three.js/blob/master/examples/webgl_postprocessing.html

const canvas = document.getElementById('c')
const scene = new Scene()
const cam = new PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 0.1, 1000 )
const textureLoader = new TextureLoader()

const envMap = textureLoader.load('assets/texture.png')
envMap.mapping = SphericalReflectionMapping

const renderer = new WebGLRenderer({
  canvas,
})

renderer.setSize( canvas.offsetWidth, canvas.offsetHeight )

const world = new World({
  gravity: new Vec3(0, 0, -9.82)
})

const normalMaterial = new MeshNormalMaterial({
  side: DoubleSide,
})

const boxGeom = new BoxGeometry(1, 1, 1)
const groundGeom = new PlaneGeometry(1000, 1000, 1000, 10, 10)
// const gridHelper = new GridHelper( 1000, 10 )
// scene.add( gridHelper )


const cube = new Mesh(
  boxGeom,
  normalMaterial,
)

const ground = new Mesh(
  groundGeom,
  normalMaterial,
)

scene.add(cube)
scene.add(ground)

ground.position.y = -10
ground.rotation.x = 1.5708
cam.position.z = 5

const loop = (time) => {
  renderer.render(scene, cam)
  requestAnimationFrame(loop)
}

loop()