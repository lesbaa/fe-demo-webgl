import * as THREE from 'three'
import fragmentShader from './fragment.glsl'
import vertexShader from './vertex.glsl'

export default {
  uniforms: {
    'tDiffuse': { value: null },
    'tSize':    { value: new THREE.Vector2( 256, 256 ) },
    'center':   { value: new THREE.Vector2( 0.5, 0.5 ) },
    'angle':    { value: 1.57 },
    'scale':    { value: 0.5 }
  },
  vertexShader,
  fragmentShader,
}