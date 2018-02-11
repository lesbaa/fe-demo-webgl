import glCreateShader from './create-shader'

const glCreateProgram = (gl, shader) => {
  const {
    vertexShader,
    fragmentShader,
  } = shader

  const program = gl.createProgram()
  try {
    gl.attachShader(program, vertexShader)
    gl.attachShader(program, fragmentShader)
    gl.linkProgram(program)
  } catch (e) {
    console.error('glCreateProgram: error attaching shader:\n', e)
  }
  
  const success = gl.getProgramParameter(program, gl.LINK_STATUS)
  if (success) {
    return program
  }

  console.error(gl.getProgramInfoLog(program))
  gl.deleteProgram(program)
}

export default glCreateProgram
