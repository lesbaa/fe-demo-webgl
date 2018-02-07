// most of this was taking from here
//https://webglfundamentals.org/webgl/lessons/webgl-fundamentals.html
// and here
// https://webglfundamentals.org/webgl/lessons/webgl-resizing-the-canvas.html
import demoShader from './shaders/1-vertices'
import WebGLDebugUtils from 'webgl-debug'
import {
  createWebGlProgram,
  createAndSetupTexture,
  addGeomAttr,
} from './modules/utils'
const {
  vertexShader: vertexSrc,
  fragmentShader: fragmentSrc,
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

const glPrgrm = createWebGlProgram(gl, vertexSrc, fragmentSrc) // this is our set up code abstracted out

// in order to pass data / state to the shader program we need to get the location of the 'attribute'
const positionAttributeLocation = gl.getAttribLocation(glPrgrm, 'les_position')

addGeomAttr(
  gl,
  positionAttributeLocation,
  [
    -0.5, 0.5,
    -0.5, -0.5,
    0.5, 0.5,
    0.5, 0.5,
    0.5, -0.5,
    -0.5, -0.5,
  ]
)

createAndSetupTexture('./assets/doge.jpeg', gl, glPrgrm)
//////// HERE LES ////////
// finish loading texture
// fix eslint freaking out about async await

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

// binds a uniform to a location
const timeUniformLocation = gl.getUniformLocation(glPrgrm, 'globalTime')

gl.useProgram(glPrgrm) // duh

const drawScene = (now) => {
  now *= 0.001

  // pass in canvas dimensions as a uniform
  gl.uniform1f(timeUniformLocation, now)
  gl.uniform1i(gl.getUniformLocation(glPrgrm, 'u_image'), 0)


  // finally, we can draw it
  const primitiveType = gl.TRIANGLES // 
  const offset = 0 // at what point to execute it
  const count = 6 // how many times to execute the shader

  gl.drawArrays(primitiveType, offset, count)
  requestAnimationFrame(drawScene)
}

drawScene(0.0)

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
