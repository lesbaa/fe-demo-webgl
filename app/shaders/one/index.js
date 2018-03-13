import vShaderSrc from './vertex.glsl'
import fShaderSrc from './fragment.glsl'

export default {
  uniforms: {
    'globalTime': {
      type: 'uniform1f',
      value: 1.0,
    },
    'windowDims': {
      type: 'uniform2fv',
      value: new Float32Array([window.innerWidth, window.innerHeight]),
    },
  },
  attributes: {},
  v: vShaderSrc,
  f: fShaderSrc,
}      
