import * as THREE from 'three'
import './modules/three-add-ons'
import dotScreenShader from './shaders/dot-screen'
import pixelateShader from './shaders/pixelate'
import rgbShiftShader from './shaders/rgb-shift'
import tvScreenShader from './shaders/tv-screen'

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

const envMap = textureLoader.load('assets/texture.png')
envMap.mapping = SphericalReflectionMapping

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

const light = new PointLight( 0x44ddcc, 1.00)
light.position.set(5, 5, 5)
scene.add(light)

const lightTwo = new PointLight( 0xdd3333, 1.00)
lightTwo.position.set(-5, -5, -5)
scene.add(lightTwo)

const boxGeom = new BoxGeometry(1, 1, 1)
const sphereGeom = new SphereGeometry(1, 50, 50)
const groundGeom = new PlaneGeometry(1000, 1000, 1000, 10, 10)

const cube = new Mesh(
  boxGeom,
  normalMaterial
)

const sphere = new Mesh(
  sphereGeom,
  normalMaterial
)

const ground = new Mesh(
  groundGeom,
  normalMaterial
)

scene.add(cube)
scene.add(ground)

const composer = new EffectComposer( renderer )
composer.addPass( new RenderPass( scene, camera ) )

// const pixelateEffect = new ShaderPass( pixelateShader )
// pixelateEffect.uniforms['tileSize'].value = 50.0
// pixelateEffect.renderToScreen = true
// composer.addPass( pixelateEffect )


// const tvScreenEffect = new ShaderPass( tvScreenShader )
// tvScreenEffect.renderToScreen = true
// composer.addPass( tvScreenEffect )

// const dotScreenEffect = new ShaderPass( dotScreenShader )
// dotScreenEffect.uniforms[ 'scale' ].value = 2.4
// composer.addPass( dotScreenEffect )

// const rgbShiftEffect = new ShaderPass( rgbShiftShader )
// rgbShiftEffect.uniforms[ 'amount' ].value = 0.010
// rgbShiftEffect.renderToScreen = true
// composer.addPass( rgbShiftEffect )

ground.rotation.x = 1.5708
ground.position.y = -10
camera.position.z = 2.8
camera.position.y = 1.7
const controls = new OrbitControls(camera, renderer.domElement)

const loop = (time) => {
  cube.rotation.y += 0.01
  cube.rotation.z += 0.01
  
  // rgbShiftEffect.uniforms[ 'angle' ].value += 0.1
  // rgbShiftEffect.uniforms[ 'amount' ].value = 0.1
  
  // pixelateEffect.uniforms[ 'tileSize' ].value += 0.1
  // tvScreenEffect.uniforms['tLes'].value += 1.0
  
  camera.lookAt(new Vector3(
    cube.position.x,
    cube.position.y,
    cube.position.z
  ))
  
  controls.update()
  // composer.render()
  renderer.render( scene, camera )
  requestAnimationFrame(loop)
}

loop()