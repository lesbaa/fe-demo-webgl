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

export const loadImage = (imageUrl) => {
  return new Promise((res, rej) => {
    const img = document.createElement('img')
    img.src = imageUrl
    img.onload = () => { res(img) }
  })
}

export async function createAndSetupTexture (imageUrl, gl) {
  var texture = gl.createTexture()
  gl.bindTexture(gl.TEXTURE_2D, texture)
  const image = await loadImage(imageUrl)
  // Set up texture so we can render any size image and so we are
  // working with pixels.
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE)
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE)
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST)
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST)

  gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, image)
}

export const addGeomAttr = (gl, attribLoc, vertices) => {
  // and create a buffer for this attribute to pass data to during the render loop and bind it
  const positionBuffer = gl.createBuffer()

  gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer)

  // pass in vertext data (clipspace coords!)
  // double check these values

  // Tell the attribute how to get data out of positionBuffer (ARRAY_BUFFER)
  gl.vertexAttribPointer(
    attribLoc,
    2, // take out 2 elements per iteration
    gl.FLOAT, //  the data type
    false, // whether to normalize the data
    0, // stride, *look this up*  0 = move forward size * sizeof(type) each iteration to get the next position
    0 // what index in the array to start at
  )

  gl.enableVertexAttribArray(attribLoc)
  // turns the attribute location 'on'
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertices), gl.STATIC_DRAW)
}