import {
  Scene,
  PerspectiveCamera,
  WebGLRenderer,
  BoxGeometry,
  MeshBasicMaterial,
  Mesh,
} from 'three'
const canvas = document.getElementById('c')
const scene = new Scene()
const cam = new PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 0.1, 1000 )

const renderer = new WebGLRenderer({
  canvas,
})

renderer.setSize( canvas.offsetWidth, canvas.offsetHeight )

const cubeGeom = new BoxGeometry(1, 1, 1)
const cubeMaterial = new MeshBasicMaterial({ color: 0x00ff00 })

const cube = new Mesh(
  cubeGeom,
  cubeMaterial,
)

scene.add(cube)

cam.position.z = 5

const loop = (time) => {
  requestAnimationFrame(loop)
  renderer.render(scene, cam)
  cube.rotation.y += .01
  cube.rotation.z += .01
}

loop()