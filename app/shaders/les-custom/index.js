import * as THREE from 'three'
import fragmentShader from './fragment.glsl'
import vertexShader from './vertex.glsl'

export default {
  uniforms: {
    'tLes': { value: 0.5 },
    'mousePos': { value: new THREE.Vector2(0.0, 0.0) },
    'vpSize': { value: new THREE.Vector2(window.innerWidth, window.innerHeight) },
  },
  vertexShader,
  fragmentShader,
}