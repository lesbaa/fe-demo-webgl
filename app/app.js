import * as THREE from 'three'
import './modules/effect-composer'
import './modules/shader-pass'
import './modules/copy-shader'
import './modules/render-pass'
import './modules/orbit-controls'
import dotScreenShader from './shaders/dot-screen'
import rgbShiftShader from './shaders/rgb-shift'
import { PointLight } from 'three';

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
} = THREE

// https://github.com/mrdoob/three.js/blob/master/examples/webgl_postprocessing.html

const canvas = document.getElementById('c')
const scene = new Scene()
const camera = new PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 0.1, 1000 )
const textureLoader = new TextureLoader()
const RESOLUTION = 10
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


const composer = new THREE.EffectComposer( renderer )
composer.addPass( new THREE.RenderPass( scene, camera ) )

const dotScreenEffect = new THREE.ShaderPass( dotScreenShader )
dotScreenEffect.uniforms[ 'scale' ].value = 2.4
composer.addPass( dotScreenEffect )

const rgbShiftEffect = new THREE.ShaderPass( rgbShiftShader )
rgbShiftEffect.uniforms[ 'amount' ].value = 0.010
rgbShiftEffect.renderToScreen = true
composer.addPass( rgbShiftEffect )

ground.rotation.x = 1.5708
ground.position.y = -10
camera.position.z = 2.8
camera.position.y = 1.7
const controls = new OrbitControls(camera, renderer.domElement)

const loop = (time) => {
  requestAnimationFrame(loop)
  // cube.rotation.x = 0.5
  cube.rotation.y = 1.57 / 2
  // cube.rotation.z += 0.01
  // rgbShiftEffect.uniforms[ 'amount' ].value = Math.sin(time / 100) / 100
  // rgbShiftEffect.uniforms[ 'angle' ].value = -time / 1000

  camera.lookAt(new Vector3(
    cube.position.x,
    cube.position.y,
    cube.position.z,
  ))
  controls.update()
  composer.render()
}

window.saveAsImage = (filename = 'image.jpg') => {

  try {
      const strMime = "image/jpeg";
      const imgData = renderer.domElement.toDataURL(strMime)

      saveFile(imgData.replace(strMime, 'image/octet-stream'), filename)
  } catch (e) {
      console.log(e)
      return
  }
}

const saveFile = (strData, filename) => {
  const link = document.createElement('a');
  if (typeof link.download === 'string') {
      document.body.appendChild(link); //Firefox requires the link to be in the body
      link.download = filename;
      link.href = strData;
      link.click();
      document.body.removeChild(link); //remove the link when done
  } else {
      location.replace(uri);
  }
}

loop()