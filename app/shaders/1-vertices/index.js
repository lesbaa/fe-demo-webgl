import vShaderSrc from './vertex.glsl'
import fShaderSrc from './fragment.glsl'

export default {
  uniforms: {
    'globalTime': {
      type: 'uniform1f',
      value: 1.0,
    },
  },
  attributes: {},
  v: vShaderSrc,
  f: fShaderSrc,
}      
