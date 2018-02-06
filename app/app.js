// most of this was taking from here
//https://webglfundamentals.org/webgl/lessons/webgl-fundamentals.html
// and here
// https://webglfundamentals.org/webgl/lessons/webgl-resizing-the-canvas.html
import demoShader from './shaders/1-vertices'
import WebGLDebugUtils from 'webgl-debug'
import {
  createWebGlProgram,
} from './modules/utils'
const {
  vertexShader: vertexSrc,
  fragmentShader: fragmentSrc,
  uniforms,
  attributes,
} = demoShader

const c = document.getElementById('c')

// this is just a handy tool for debugging the stuff with the things
function throwOnGLError(err, funcName, args) {
  throw WebGLDebugUtils.glEnumToString(err)
  + 'was caused by call to '
  + funcName
}

const gl = WebGLDebugUtils.makeDebugContext(c.getContext('webgl'), throwOnGLError)

window.gl = gl

const glPrgrm = createWebGlProgram(gl, vertexSrc, fragmentSrc)

// in order to pass data / state to the shader program we need to get the location of the 'attribute'
const positionAttributeLocation = gl.getAttribLocation(glPrgrm, 'les_position')

// and create a buffer for this attribute to pass data to during the render loop and bind it
const positionBuffer = gl.createBuffer()
gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer)

// pass in vertext data (clipspace coords!)
// double check these values
const positions = [
  -0.5, 0.5,
  -0.5, -0.5,
  0.5, 0.5,
  0.5, 0.5,
  0.5, -0.5,
  -0.5, -0.5,
]

// buffer it
gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(positions), gl.STATIC_DRAW)

// binds a uniform to a location
const timeUniformLocation = gl.getUniformLocation(glPrgrm, 't')

// we need to tell the API what size to render the content to
const devicePixelRatio = window.devicePixelRatio || 1
c.width = window.innerWidth * devicePixelRatio
c.height = window.innerHeight * devicePixelRatio

gl.viewport(0, 0, c.width, c.height)
// this tells the API how clipspace coords map to the canvas dimensions 
/* gl.viewport(
  clipSpaceX -1, // left
  clipSpaceY -1, // top
  clipSpaceX +1, // right
  clipSpaceY +1  // bottom
)
*/

gl.useProgram(glPrgrm) // duh
const drawScene = (now) => {
  now *= 0.001

  gl.enableVertexAttribArray(positionAttributeLocation)
  // turns the attribute location 'on'

  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(positions), gl.STATIC_DRAW)

  // pass in canvas dimensions as a uniform
  gl.uniform1f(timeUniformLocation, now)

  // Tell the attribute how to get data out of positionBuffer (ARRAY_BUFFER)
  gl.vertexAttribPointer(
    positionAttributeLocation,
    2, // take out 2 elements per iteration
    gl.FLOAT, //  the data type
    false, // whether to normalize the data
    0, // stride, *look this up*  0 = move forward size * sizeof(type) each iteration to get the next position
    0 // what index in the array to start at
  )

  // finally, we can draw it
  const primitiveType = gl.TRIANGLES // 
  const offset = 0 // at what point to execute it
  const count = 6 // how many times to execute the shader

  gl.drawArrays(primitiveType, offset, count)
  requestAnimationFrame(drawScene)
}

drawScene()

window.addEventListener('resize', handleResize)

function handleResize() {
  // Lookup the size the browser is displaying the canvas.
  var displayWidth  = c.clientWidth
  var displayHeight = c.clientHeight
 
  // Check if the canvas is not the same size.
  if (c.width  != displayWidth ||
      c.height != displayHeight) {
 
    // set the size of the drawingBuffer
    const devicePixelRatio = window.devicePixelRatio || 1
    c.width = window.innerWidth * devicePixelRatio
    c.height = window.innerHeight * devicePixelRatio
    gl.viewport(0, 0, c.width, c.height)

  }
}
