import vertexShader from './vertex.glsl'
import fragmentShader from './fragment.glsl'

export default {

  uniforms: {
    'tDiffuse': { value: 0.045 },
    'amount':   { value: 0.005 },
    'angle':    { value: 0.0 }

  },

  vertexShader,
  fragmentShader,
}
