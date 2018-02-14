// https://stackoverflow.com/questions/13009328/drawing-many-shapes-in-webgl

// https://stackoverflow.com/questions/19102180/how-does-gldrawarrays-know-what-to-draw#19102301

import {
  loadImage,
  isPow2,
  isMatrixUniform,
  degToRad,
} from './utils'

import {
  mat4,
} from 'gl-matrix'

import getDebuggerContext from '../debugger'

export default class {

  gl = null
  shaderProgram = null

  mvMatrix = mat4.create()
  pMatrix = mat4.create()
  mvMatrixStack = []
  textures = {}
  geometries = {}

  constructor(canvas, shader, {
    debug,
    clearColor,
  }) { // you should probably pass an options object
    try {
      this.gl = debug
        ? getDebuggerContext(canvas.getContext('webgl'))
        : canvas.getContext('webgl')
      this.canvas = canvas
    } catch (e) {
      console.error(e)
    }
    if (!this.gl) {
      console.error('Could not initialise WebGL, sorry :-(')
      return
    }
    this.gl.clearColor(...clearColor)
    this.gl.enable(this.gl.DEPTH_TEST)
    this.setShaders(shader) // move stuff to an init method
    window.addEventListener('resize', this.handleResize)
    this.handleResize()
  }

  handleResize = () => {
    // Lookup the size the browser is displaying the canvas.
    const {
      canvas,
    } = this
    var displayWidth  = canvas.clientWidth
    var displayHeight = canvas.clientHeight
   
    // Check if the canvas is not the same size.
    if (canvas.width  != displayWidth ||
        canvas.height != displayHeight) {
   
      // set the size of the drawingBuffer
      const devicePixelRatio = window.devicePixelRatio || 1
      canvas.width = window.innerWidth * devicePixelRatio
      canvas.height = window.innerHeight * devicePixelRatio
      this.gl.viewport(0, 0, canvas.width, canvas.height)
      // this tells the API how clipspace coords map to the canvas dimensions 
      /* this.context.viewport(
        clipSpaceX -1, // left
        clipSpaceY -1, // top
        clipSpaceX +1, // right
        clipSpaceY +1  // bottom
      )
      */
    }
  }

  compileShaderSrc = (src, glType) => {
    const shader = this.gl.createShader(glType)
    this.gl.shaderSource(shader, src)
    this.gl.compileShader(shader) 
    if (!this.gl.getShaderParameter(shader, this.gl.COMPILE_STATUS)) {
      console.error(this.gl.getShaderInfoLog(shader))
      return null
    }
    return shader
  }

  setShaders = ({
    f,
    v,
    uniforms,
    attributes,
  }) => {
    const vertexShader = this.compileShaderSrc(v, this.gl.VERTEX_SHADER)
    const fragmentShader = this.compileShaderSrc(f, this.gl.FRAGMENT_SHADER)

    this.shader = {
      vertexShader,
      fragmentShader,
      uniforms,
      attributes,
    }

    this.initProgram()
  }

  initProgram = () => {
    const {
      fragmentShader,
      vertexShader,
    } = this.shader
    const shaderProgram = this.gl.createProgram()
    this.gl.attachShader(shaderProgram, vertexShader)
    this.gl.attachShader(shaderProgram, fragmentShader)
    this.gl.linkProgram(shaderProgram)
    
    if (!this.gl.getProgramParameter(shaderProgram, this.gl.LINK_STATUS)) {
      console.error('initProgram: Could not initialise shaders')
    }
    
    this.gl.useProgram(shaderProgram)
    
    this.shader.program = shaderProgram
    this.shader.attributes['aVertexPosition'] = {
      location: this.gl.getAttribLocation(shaderProgram, 'aVertexPosition'),
    }

    this.shader.attributes['aTextureCoord'] = {
      location: this.gl.getAttribLocation(shaderProgram, 'aTextureCoord'),
    }

    this.shader.uniforms.uPMatrix = {
      location: this.gl.getUniformLocation(shaderProgram, 'uPMatrix'),
    }
    
    this.shader.uniforms.uMVMatrix = {
      location: this.gl.getUniformLocation(shaderProgram, 'uMVMatrix'),
    }
    
    this.shader.uniforms.uSampler = {
      location: this.gl.getUniformLocation(shaderProgram, 'uSampler'),
    }
    
    this.initUniforms()
    
  }

  initUniforms = () => {
    const {
      uniforms,
    } = this.shader
    
    const uniformKeys = Object.keys(uniforms)
    
    for (let i = 0; i < uniformKeys.length; i++) {
      const key = uniformKeys[i]
      if (![
        'uMVMatrix',
        'uPMatrix',
      ].includes(key)) {
        this.shader.uniforms[key].location = this.gl.getUniformLocation(this.shader.program, key)
      }
    }
  }

  setMatrixUniforms = () => { 
    this.gl.uniformMatrix4fv(this.shader.uniforms.uPMatrix.location, false, this.pMatrix)
    this.gl.uniformMatrix4fv(this.shader.uniforms.uMVMatrix.location, false, this.mvMatrix)
  }
  
  setUniforms = () => {
    const uniformKeys = Object.keys(this.shader.uniforms)
    for (let i = 0; i < uniformKeys.length; i++) {
      const key = uniformKeys[i]
      const {
        type,
        value,
        location,
      } = this.shader.uniforms[key]
      if (type && value && location) this.gl[type](location, value)
    }
    return
  }

  addGeometry = (geometry, useId) => {

    const {
      vertices,
      cols,
      rows,
      position,
      rotation,
      textureMap,
      tRows,
      tCols,
      glPrimitive = this.gl.TRIANGLES,
    } = geometry.bind(this)()
    const positionBuffer = this.gl.createBuffer()
    this.gl.bindBuffer(this.gl.ARRAY_BUFFER, positionBuffer)
    this.gl.bufferData(this.gl.ARRAY_BUFFER, new Float32Array(vertices), this.gl.STATIC_DRAW)
    this.geometries[useId] = {
      positionBuffer,
      vertices,
      cols,
      rows,
      textureMap,
      tRows,
      tCols,
      position,
      rotation,
      glPrimitive,
    }
  }
  
  loadTexture = async (url, id) => {
    const texture = this.gl.createTexture()
    this.gl.bindTexture(this.gl.TEXTURE_2D, texture)
  
    // Because images have to be download over the internet
    // they might take a moment until they are ready.
    // Until then put a single pixel in the texture so we can
    // use it immediately. When the image has finished downloading
    // we'll update the texture with the contents of the image.
    const level = 0
    const internalFormat = this.gl.RGBA
    const width = 1
    const height = 1
    const border = 0
    const srcFormat = this.gl.RGBA
    const srcType = this.gl.UNSIGNED_BYTE
    const pixel = new Uint8Array([0, 0, 255, 255])  // opaque blue

    this.gl.texImage2D(
      this.gl.TEXTURE_2D,
      level,
      internalFormat,
      width,
      height,
      border,
      srcFormat,
      srcType,
      pixel,
    )
  
    const image = await loadImage(url)

    this.gl.bindTexture(this.gl.TEXTURE_2D, texture)
    this.gl.texImage2D(
      this.gl.TEXTURE_2D,
      level,
      internalFormat,
      srcFormat,
      srcType,
      image
    )

    // WebGL1 has different requirements for power of 2 images
    // vs non power of 2 images so check if the image is a
    // power of 2 in both dimensions.
    if (isPow2(image.width) && isPow2(image.height)) {
      // Yes, it's a power of 2. Generate mips.
      this.gl.generateMipmap(this.gl.TEXTURE_2D)
    } else {
      // No, it's not a power of 2. Turn on mips and set
      // wrapping to clamp to edge
      this.gl.texParameteri(this.gl.TEXTURE_2D, this.gl.TEXTURE_WRAP_S, this.gl.CLAMP_TO_EDGE)
      this.gl.texParameteri(this.gl.TEXTURE_2D, this.gl.TEXTURE_WRAP_T, this.gl.CLAMP_TO_EDGE)
      this.gl.texParameteri(this.gl.TEXTURE_2D, this.gl.TEXTURE_MIN_FILTER, this.gl.LINEAR)
    }

    this.textures[id] = texture
  }
  
  applyTexture(geometryId) {
    const geometry = this.geometries[geometryId]
    console.log(geometry)
    const textureCoordBuffer = this.gl.createBuffer()
    this.gl.bindBuffer(this.gl.ARRAY_BUFFER, textureCoordBuffer)

    this.gl.bufferData(
      this.gl.ARRAY_BUFFER,
      new Float32Array(geometry.textureMap),
      this.gl.STATIC_DRAW,
    )

    this.geometries[geometryId] = {
      ...geometry,
      textureCoordBuffer,
    }
    // Build the element array buffer; this specifies the indices
    // into the vertex arrays for each face's vertices.
  }

  mvPushMatrix() {
    const copy = mat4.create()
    // Update: mat4.set(mvMatrix, copy); mat4.set() was removed from gl-matrix, use mat4.copy().
    mat4.copy(copy, this.mvMatrix)
    this.mvMatrixStack.push(copy)
  }
  mvPopMatrix() {
    if (this.mvMatrixStack.length == 0) {
      throw 'Invalid popMatrix!'
    }
    this.mvMatrix = this.mvMatrixStack.pop()
  }

  render = (now) => {
    this.gl.viewport(0, 0, this.canvas.width, this.canvas.height)
    this.gl.clear(this.gl.COLOR_BUFFER_BIT | this.gl.DEPTH_BUFFER_BIT)
    
    // talk about perspective in here?
    mat4.perspective(this.pMatrix, .90, this.canvas.width / this.canvas.height, 0.1, 100.0)
    this.setUniforms()
    const geometryKeys = Object.keys(this.geometries)

    for (let i = 0; i < geometryKeys.length; i++) {

      mat4.identity(this.mvMatrix)
      const key = geometryKeys[i]
      const geometry = this.geometries[key]
      mat4.translate(this.mvMatrix, this.mvMatrix, Object.values(geometry.position))
      this.mvPushMatrix()
      const dimensions = Object.keys(geometry.rotation)
      for (let j = 0; j < dimensions.length; j++) {
        const dimension = dimensions[j]
        const axis = [
          1 & (dimension === 'x'),
          1 & (dimension === 'y'),
          1 & (dimension === 'z'),
        ]
        mat4.rotate(
          this.mvMatrix,
          this.mvMatrix,
          degToRad(geometry.rotation[dimension]),
          axis,
        )
      }
      if (now > 0.001 && now < 0.5) console.log(this.geometries)
      this.gl.bindBuffer(this.gl.ARRAY_BUFFER, geometry.positionBuffer)
      this.gl.enableVertexAttribArray(this.shader.attributes['aVertexPosition'].location)
  
      this.gl.vertexAttribPointer(
        this.shader.attributes['aVertexPosition'].location,
        geometry.cols,
        this.gl.FLOAT,
        false,
        0,
        0
      )
      
      this.gl.bindBuffer(this.gl.ARRAY_BUFFER, geometry.textureCoordBuffer)
      this.gl.enableVertexAttribArray(this.shader.attributes['aTextureCoord'].location)

      this.gl.vertexAttribPointer(
        this.shader.attributes['aTextureCoord'].location,
        geometry.tCols,
        this.gl.FLOAT,
        false,
        0,
        0
      )

      this.setMatrixUniforms()
      this.gl.drawArrays(geometry.glPrimitive, 0, geometry.rows, 0)
      this.mvPopMatrix()

    }
    
  }
} // end class
