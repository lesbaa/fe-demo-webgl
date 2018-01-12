import * as THREE from 'three'
import './modules/effect-composer'
import './modules/shader-pass'
import './modules/copy-shader'
import './modules/render-pass'
import './modules/orbit-controls'
import lesCustomShader from './shaders/les-custom'
import WebGLDebugUtil from 'webgl-debug'
import { PointLight } from 'three'

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
  ShaderMaterial,
  PlaneGeometry,
  Vector3,
  Vector2,
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

function throwOnGLError(err, funcName, args) {
  throw WebGLDebugUtils.glEnumToString(err)
  + "was caused by call to " 
  + funcName
}

renderer.context = WebGLDebugUtils.makeDebugContext(renderer.context, throwOnGLError)

renderer.setSize( canvas.offsetWidth, canvas.offsetHeight )

const normalMaterial = new MeshLambertMaterial({
  side: DoubleSide,
  color: 0x66dddd,
})

const customShaderMaterial = new ShaderMaterial(lesCustomShader)

const boxGeom = new BoxGeometry(1, 1, 1)
const sphereGeom = new SphereGeometry(1, 50, 50)
const groundGeom = new PlaneGeometry(1000, 1000, 1000, 10, 10)

const ground = new Mesh(
  groundGeom,
  customShaderMaterial,
)

// scene.add(cube)
scene.add(ground)

camera.position.z = 2.8

const loop = (e) => {
  // requestAnimationFrame(loop)
  const {
    clientX,
    clientY,
  } = e
  customShaderMaterial.uniforms['mousePos'].value = new Vector2(clientX, clientY)
  camera.lookAt(new Vector3(
    ground.position.x,
    ground.position.y,
    ground.position.z,
  ))
  renderer.render(scene, camera)
}

window.addEventListener('mousemove', loop)

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
