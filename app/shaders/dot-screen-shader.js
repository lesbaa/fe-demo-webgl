import fragmentSahder from './fragment_1.glsl'
import vertexShader from './vertex_1.glsl'

export default dotscreen = {
  uniforms: {
    "tDiffuse": { value: null },
    "tSize":    { value: new THREE.Vector2( 256, 256 ) },
    "center":   { value: new THREE.Vector2( 0.5, 0.5 ) },
    "angle":    { value: 1.57 },
    "scale":    { value: 1.0 }
  },
  vertexShader,
  fragmentSahder,
}