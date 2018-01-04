import {
  Scene,
  PerspectiveCamera,
  WebGLRenderer,
  BoxGeometry,
  MeshBasicMaterial,
  Mesh,
  AmbientLight,
  AdditiveBlending,
  GridHelper,
  MeshLambertMaterial,
  SpotLight,
  SphereGeometry,
  TextureLoader,
  SphericalReflectionMapping,
  DoubleSide,
} from 'three'
import TWEEN from '@tweenjs/tween.js'

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

const sphereGeom = new SphereGeometry(10, 20, 20)

const gridHelper = new GridHelper( 1000, 10 )
gridHelper.position.y = - 120
scene.add( gridHelper )

const materials = [
    new MeshBasicMaterial({
      color: 0x00ff00,
      wireframe: true,
      side: DoubleSide,
      
    }),
    new MeshBasicMaterial({
      color: 0x00ddee,
      blending: AdditiveBlending,
      opacity: 0.5,
    }),
    new MeshLambertMaterial({
      color: 0x00ddee,
    })

]

const light = new AmbientLight({ color: 0x202020 })
const spot = new SpotLight(0x00aadd)
spot.position.set(100,100,100)

scene.add(spot)

const spheres = materials.map((material, i) => {
  const sphere = new Mesh(
    sphereGeom,
    material,
  )
  const unit = 30
  sphere.position.x = (unit * i) - ((materials.length / 2) * unit)
  sphere.rotation.x = 0.2 * i
  sphere.rotation.y = 0.2 * i
  return sphere
})

spheres.forEach(sphere => {
  scene.add(sphere)
})

cam.position.y = 100

const state = {
  x: 0,
  y: 0,
}

const endState = {
  x: 6 * Math.PI,
  y: 6 * Math.PI,
}

const loop = (time) => {
  requestAnimationFrame(loop)
  renderer.render(scene, cam)
  spheres.forEach((sphere, i) => {
    sphere.rotation.x += 0.01
    sphere.rotation.y += 0.01
  })
  cam.position.z = Math.sin(time * 0.0005) * 100
  cam.position.x = Math.cos(time * 0.0005) * 100
  cam.lookAt(scene.position)
}

loop()