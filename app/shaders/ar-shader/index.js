import * as THREE from 'three'
import fragmentShader from './fragment.glsl'
import vertexShader from './vertex.glsl'

export default {
  uniforms: {
    cameraMatrix: {
      type: 'm4',
      value: new THREE.Matrix4(),
    },
    transformationMatrix: {
      type: 'm4',
      value: new THREE.Matrix4(),
    }
  },
  vertexShader,
  fragmentShader,
}