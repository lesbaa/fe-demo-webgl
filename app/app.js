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
    -0.9, 0.9,
    -0.9, -0.9,
    0.9, 0.9,
    0.9, 0.9,
    0.9, -0.9,
    -0.9, -0.9,
  ]
)

// createAndSetupTexture(
//   './assets/doge.jpeg',
//   gl,
//   gl.TEXTURE0,
//   glPrgrm,
//   gl.getUniformLocation('')
// )

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
const timeUniformLocation = gl.getUniformLocation(glPrgrm, 'u_globalTime')
const mouseXUniformLocation = gl.getUniformLocation(glPrgrm, 'u_mouseX')
const mouseYUniformLocation = gl.getUniformLocation(glPrgrm, 'u_mouseY')

gl.useProgram(glPrgrm) // duh
const imageUniform = gl.getUniformLocation(glPrgrm, 'u_image')
createAndSetupTexture('./assets/doge.jpeg', gl, { glSlot:'TEXTURE0', ind: 0 }, imageUniform, glPrgrm)
const mapUniform = gl.getUniformLocation(glPrgrm, 'u_map')
createAndSetupTexture('./assets/doge-bump.jpeg', gl, { glSlot: 'TEXTURE1', ind: 1 }, mapUniform, glPrgrm)

let mouseX = 0
let mouseY = 0

const drawScene = (now) => {
  requestAnimationFrame(drawScene)  

  now *= 0.001

  // pass in canvas dimensions as a uniform
  gl.uniform1f(timeUniformLocation, now)
  gl.uniform1f(mouseYUniformLocation, mouseX)
  gl.uniform1f(mouseYUniformLocation, mouseY)
  gl.activeTexture(gl.TEXTURE0)
  gl.uniform1i(imageUniform, 0)
  gl.activeTexture(gl.TEXTURE1)
  gl.uniform1i(mapUniform, 1)

  // finally, we can draw it
  const primitiveType = gl.TRIANGLES // 
  const offset = 0 // at what point to execute it
  const count = 6 // how many times to execute the shader

  gl.drawArrays(primitiveType, offset, count)
}

drawScene(0.0)

const handleMouse = ({
  clientX,
  clientY,
}) => {
  mouseX = clientX / 200
  mouseY = clientY / 200
}

const handleResize = () => {
  // Lookup the size the browser is displaying the canvas.
  let displayWidth  = c.clientWidth
  let displayHeight = c.clientHeight
 
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

window.addEventListener('resize', handleResize)
window.addEventListener('mousemove', handleMouse)
