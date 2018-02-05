import * as THREE from 'three'
import fragmentShader from './fragment.glsl'
import vertexShader from './vertex.glsl'

export default {
  uniforms: {
    'tDiffuse': { value: null },
    'tLes': { value: 1.0 },
    // 'mousePos': { value: new THREE.Vector2(0.0, 0.0) },
    // 'vpSize': { value: new THREE.Vector2(window.innerWidth, window.innerHeight) },
  },
  vertexShader,
  fragmentShader,
}
