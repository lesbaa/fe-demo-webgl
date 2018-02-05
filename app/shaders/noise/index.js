import * as THREE from 'three'
import fragmentShader from './fragment.glsl'
import vertexShader from './vertex.glsl'

export default {
  uniforms: {
    time: {
      type: 'f',
      value: 0,
    },
    'resolution': {
      type: 'v2',
      value: new THREE.Vector2(window.innerWidth, window.innerHeight),
    },
    'texture': {
      type: 't',
      value: null,
    },
    // 'mousePos': { value: new THREE.Vector2(0.0, 0.0) },
    // 'vpSize': { value: new THREE.Vector2(window.innerWidth, window.innerHeight) },
  },
  vertexShader,
  fragmentShader,
}
