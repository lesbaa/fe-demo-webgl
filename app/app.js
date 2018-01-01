import {
  Scene,
  PerspectiveCamera,
  WebGLRenderer,
  BoxGeometry,
  MeshBasicMaterial,
  Mesh,
} from 'three'
import TWEEN from '@tweenjs/tween.js'

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

const state = {
  rotation: {
    x: 0,
    y: 0,
  }
}

const endState = {
  rotation: {
    x: 6 * Math.PI,
    y: 6 * Math.PI,
  }
}

const tween = new TWEEN.Tween(state)
  .to(endState, 10000)
  .easing(TWEEN.Easing.Quadratic.Out)
  .onUpdate(() => {
    cube = {...cube, ...state}
  })
  .start()

const loop = (time) => {
  requestAnimationFrame(loop)
  renderer.render(scene, cam)
  tween.update(time)
}

loop()