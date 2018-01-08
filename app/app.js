import * as THREE from 'three'
import './modules/effect-composer'
import './modules/shader-pass'
import './modules/copy-shader'
import './modules/render-pass'
import dotScreenShader from './shaders/dot-screen-shader'

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
  PlaneGeometry,
  Vector3,
  EffectComposer,
} = THREE

// https://github.com/mrdoob/three.js/blob/master/examples/webgl_postprocessing.html

const canvas = document.getElementById('c')
const scene = new Scene()
const cam = new PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 0.1, 1000 )
const textureLoader = new TextureLoader()

const envMap = textureLoader.load('assets/texture.png')
envMap.mapping = SphericalReflectionMapping

const renderer = new WebGLRenderer({
  canvas,
  antialias: true,
})

renderer.setSize( canvas.offsetWidth, canvas.offsetHeight )

const normalMaterial = new MeshNormalMaterial({
  side: DoubleSide,
})

const boxGeom = new BoxGeometry(1, 1, 1)
const sphereGeom = new SphereGeometry(1, 50, 50)
const groundGeom = new PlaneGeometry(1000, 1000, 1000, 10, 10)

const cube = new Mesh(
  boxGeom,
  normalMaterial,
)

const sphere = new Mesh(
  sphereGeom,
  normalMaterial,
)

const ground = new Mesh(
  groundGeom,
  normalMaterial,
)

scene.add(cube)
scene.add(ground)


const composer = new THREE.EffectComposer( renderer );
composer.addPass( new THREE.RenderPass( scene, cam ) );

const effect = new THREE.ShaderPass( dotScreenShader );
effect.uniforms[ 'scale' ].value = 4;
composer.addPass( effect );

ground.rotation.x = 1.5708
ground.position.y = -10
cam.position.z = 5
cam.position.y = 2

// cube.rotation.x = 0.34
cube.position.y = 2

const loop = (time) => {
  cube.rotation.x += 0.01
  cube.rotation.y += 0.03
  cube.rotation.z += 0.01
  requestAnimationFrame(loop)
  // cam.position.z = Math.sin((time / 1000) - 0.5) * 2
  // cam.position.x = Math.cos((time / 1000) - 0.5) * 2
  cam.lookAt(new Vector3(
    cube.position.x,
    cube.position.y,
    cube.position.z,
  ))
  renderer.render(scene, cam)
}

loop()