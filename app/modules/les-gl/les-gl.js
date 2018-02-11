import {
  glCreateProgram,
  glCreateGeometry,
  glCreateShader,
} from './methods'
import getDebuggerContext from '../debugger'

import {
  loadImage,
  isPow2,
  isMatrixUniform,
} from './utils'

import {
  mat4,
} from 'gl-matrix'

export default class LesGl {

  geometries = []
  context = null
  shader = {}
  prgrm = {}

  constructor(canvas, shader, debug) {
    this.context = debug
      ? getDebuggerContext(canvas.getContext('webgl'))
      : canvas.getContext('webgl')
    this.canvas = canvas
    
    if (shader) this.useShader(shader)
    this.createProgram()
    
    // we need to tell the API what size to render the content to
    const devicePixelRatio = window.devicePixelRatio || 1

    this.canvas.width = window.innerWidth * devicePixelRatio
    this.canvas.height = window.innerHeight * devicePixelRatio

    window.addEventListener('resize', this.handleResize)
    this.handleResize()
  }

  init = () => {
    this.prgrm = this.createProgram()
    this.context.useProgram(this.prgrm)
  }

  createProgram = () => {
    // this will need to be edited use 
    try {
      this.prgrm = glCreateProgram(this.context, this.shader)
      this.getAttributeLocations()
      
    } catch (e) {
      console.error('error in LesGl.createProgram:\n',e)
    }
  }

  useShader = (shader) => {
    const {
      vertexShader,
      fragmentShader,
      uniforms,
      attributes,
    } = shader
    
    this.shader = {
      vertexShader: glCreateShader(this.context, this.context.VERTEX_SHADER, vertexShader),
      fragmentShader: glCreateShader(this.context, this.context.FRAGMENT_SHADER, fragmentShader),
      uniforms,
      attributes,
    }
    
  }

  updateShader = () => {
    const {
      uniforms,
      attributes,
    } = this.shader
    const uniformObjs = Object.values(uniforms)

    for (let i = 0; i < uniformObjs.length; i++) {
      const uniform = uniformObjs[i]
      const {
        type,
        location,
        value,
      } = uniform
      if (isMatrixUniform(type)) {
        this.context[type](location, false, value)
      } else {
        this.context[type](location, value)
      }
    }
  }

  getAttributeLocations = () => {
    const {
      uniforms,
    } = this.shader
    // freaking out here
    const uniformNames = Object.keys(uniforms)

    for (let i = 0; i < uniformNames.length; i++) {
      const uniformKey = uniformNames[i]
      this.shader.uniforms[uniformKey].location = this.context.getUniformLocation(this.prgrm, uniformKey)
    }

  }

  addGeometry = ({
    type,
    attributeName,
  }) => {
    const attribLoc = this.context.getAttribLocation(this.prgrm, attributeName)
    const geometry = glCreateGeometry(
      this.context,
      type,
      attribLoc,
    )
    this.geometries.push(geometry)
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
      this.context.viewport(0, 0, canvas.width, canvas.height)
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

  render = (now) => {
    const {
      viewportWidth,
      viewportHeight,
      COLOR_BUFFER_BIT,
      DEPTH_BUFFER_BIT,
      FLOAT,
      TRIANGLES,
    } = this.context
    this.context.viewport(0, 0, viewportWidth, viewportHeight)
    // this.context.clear(COLOR_BUFFER_BIT | DEPTH_BUFFER_BIT)
    // mat4.perspective(this.shader.uniforms['uPMatrix'], 0.7853982, viewportWidth / viewportHeight, 0.1, 100.0 )
    // mat4.identity(this.shader.uniforms['uMVMatrix'])
    this.context.useProgram(this.prgrm)
    for (let i = 0; i < this.geometries.length; i++) {
      const {
        attribLoc,
        totalVertices,
        dimensions,
        positionBuffer,
        primitiveType = TRIANGLES,
      } = this.geometries[i]    

      this.context.enableVertexAttribArray(attribLoc)
      this.context.bindBuffer(this.context.ARRAY_BUFFER, positionBuffer)

      this.context.vertexAttribPointer(
        attribLoc,
        dimensions, // take out 2 elements per iteration
        FLOAT, //  the data type
        false, // whether to normalize the data
        0, // stride, *look this up*  0 = move forward size * sizeof(type) each iteration to get the next position
        0 // what index in the array to start at
      )

      this.updateShader(now)
      
      this.context.drawArrays(primitiveType, 0, totalVertices)
      // for each geometry, draw arrays
    }
  }
}