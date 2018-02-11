

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
