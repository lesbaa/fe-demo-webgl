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

  console.error(gl.getProgramInfoLog(program))
  gl.deleteProgram(program)
}

export const loadImage = (imageUrl) => {
  return new Promise((res, rej) => {
    const img = document.createElement('img')
    img.src = imageUrl
    img.addEventListener('load', () => {
      console.log(img.width, img.height)
      res(img)
    })
  })
}

export async function createAndSetupTexture (imageUrl, gl, glTextureSlot, uniformLoc, glPrgrm) {
  const texture = gl.createTexture()
  
  // Tell WebGL we want to affect texture unit 0
  gl.activeTexture(gl[glTextureSlot.glSlot])

  // Bind the texture to texture unit 0
  gl.bindTexture(gl.TEXTURE_2D, texture)

  // Tell the shader we bound the texture to texture unit 0
  gl.uniform1i(uniformLoc, glTextureSlot.ind)
  try {
    const image = await loadImage(imageUrl)
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, image)
    // Set up texture so we can render any size image and so we are
    // working with pixels.
    setupTextureFilteringAndMips(image.width, image.height)
  } catch(e) {
    console.log(e)
  }
// https://stackoverflow.com/questions/44940952/how-to-load-multiple-textures-into-the-fragment-shader#44941054
// https://developer.mozilla.org/en-US/docs/Web/API/WebGL_API/Tutorial/Using_textures_in_WebGL
}

export const isPowerOf2 = num => (num & (num - 1)) == 0

export function setupTextureFilteringAndMips(width, height) {
  if (isPowerOf2(width) && isPowerOf2(height)) {
    // the dimensions are power of 2 so generate mips and turn on 
    // tri-linear filtering.
    gl.generateMipmap(gl.TEXTURE_2D)
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR_MIPMAP_LINEAR)
  } else {
    // at least one of the dimensions is not a power of 2 so set the filtering
    // so WebGL will render it.
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE)
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE)
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR)
  }
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