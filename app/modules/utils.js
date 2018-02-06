export const createShader = (gl, type, source) => {
  const shader = gl.createShader(type)
  gl.shaderSource(shader, source)
  gl.compileShader(shader)
  const success = gl.getShaderParameter(shader, gl.COMPILE_STATUS)
  if (success) {
    return shader
  }
 
  console.log(gl.getShaderInfoLog(shader))
  gl.deleteShader(shader)
}

// now we need to link and compile the shaders...

export const createWebGlProgram = (gl, vertexSrc, fragmentSrc) => {
  const vertexShader = createShader(gl, gl.VERTEX_SHADER, vertexSrc)
  const fragmentShader = createShader(gl, gl.FRAGMENT_SHADER, fragmentSrc)
  const program = gl.createProgram()
  gl.attachShader(program, vertexShader)
  gl.attachShader(program, fragmentShader)
  gl.linkProgram(program)
  const success = gl.getProgramParameter(program, gl.LINK_STATUS)
  if (success) {
    return program
  }

  console.log(gl.getProgramInfoLog(program))
  gl.deleteProgram(program)
}
