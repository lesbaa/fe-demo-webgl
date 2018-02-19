import * as THREE from 'three'
import fragmentShader from './fragment.glsl'
import vertexShader from './vertex.glsl'

export default {
  uniforms: {
    'tLes': { value: 0.5 },
    'tDiffuse': { value: null },
  },
  vertexShader,
  fragmentShader,
}