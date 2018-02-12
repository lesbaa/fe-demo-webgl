// https://stackoverflow.com/questions/13009328/drawing-many-shapes-in-webgl

import {
  loadImage,
  isPow2,
  isMatrixUniform,
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

  geometries = []

  constructor(canvas, shader, debug) { // you should probably pass an options object
    try {
      this.gl = debug
        ? getDebuggerContext(canvas.getContext('webgl'))
        : canvas.getContext('webgl')
      this.canvas = canvas
    } catch (e) {
      console.log(e)
    }
    if (!this.gl) {
      console.error('Could not initialise WebGL, sorry :-(')
      return
    }
    this.gl.clearColor(0.1, 0.1, 0.1, 1.0)
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
    
    this.gl.enableVertexAttribArray(this.shader.attributes['aVertexPosition'].location)

    this.shader.uniforms.pMatrixUniform = {
      location: this.gl.getUniformLocation(shaderProgram, 'uPMatrix'),
    }
    
    this.shader.uniforms.mvMatrixUniform = {
      location: this.gl.getUniformLocation(shaderProgram, 'uMVMatrix'),
    }
  }

  // add another method for updating uniforms

  setMatrixUniforms = () => { 
    this.gl.uniformMatrix4fv(this.shader.uniforms.pMatrixUniform.location, false, this.pMatrix)
    this.gl.uniformMatrix4fv(this.shader.uniforms.mvMatrixUniform.location, false, this.mvMatrix)
  }

  addGeometry = (geometry) => {

    const {
      vertices,
      cols,
      rows,
      position,
      glPrimitive = this.gl.TRIANGLES,
    } = geometry.bind(this)()

    const buffer = this.gl.createBuffer()
    this.gl.bindBuffer(this.gl.ARRAY_BUFFER, buffer)
    this.gl.bufferData(this.gl.ARRAY_BUFFER, new Float32Array(vertices), this.gl.STATIC_DRAW)
    this.geometries.push({
      buffer,
      vertices,
      cols,
      rows,
      position,
      glPrimitive,
    })
  }

  render = () => {
    this.gl.viewport(0, 0, this.canvas.width, this.canvas.height)
    this.gl.clear(this.gl.COLOR_BUFFER_BIT | this.gl.DEPTH_BUFFER_BIT)
    
    // talk about perspective in here?
    mat4.perspective(this.pMatrix, 0.78, this.canvas.width / this.canvas.height, 0.1, 100.0)
    mat4.identity(this.mvMatrix)

    for (let i = 0; i < this.geometries.length; i++) {
      const geometry = this.geometries[i]
      mat4.translate(this.mvMatrix, this.mvMatrix, Object.values(geometry.position))
      this.gl.bindBuffer(this.gl.ARRAY_BUFFER, geometry.buffer)
      this.gl.vertexAttribPointer(
        this.shader.attributes['aVertexPosition'].location,
        geometry.cols,
        this.gl.FLOAT,
        false,
        0,
        0
      )
      this.setMatrixUniforms()      
      this.gl.drawArrays(geometry.glPrimitive, 0, geometry.rows, 0)
    }
  }
} // end class
