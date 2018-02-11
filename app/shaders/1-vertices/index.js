import fragmentShader from './fragment.glsl'
import vertexShader from './vertex.glsl'
import {
  mat4,
} from 'gl-matrix'

export default {
  uniforms: {
    'globalTime': {
      type: 'uniform1f',
      value: 1.0,
    },

    // 'uMVMatrix' : {
    //   type: 'uniformMatrix4fv',
    //   value: mat4.create(),
    // },
    // 'uPMatrix' : {
    //   type: 'uniformMatrix4fv',
    //   value: mat4.create(),
    // },
  },

  vertexShader,
  fragmentShader,
}

      
