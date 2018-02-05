// most of this was taking from here
//https://webglfundamentals.org/webgl/lessons/webgl-fundamentals.html
// and here
// https://webglfundamentals.org/webgl/lessons/webgl-resizing-the-canvas.html
import demoShader from './shaders/1-vertices'

const {
  vertexShader: vertexSrc,
  fragmentShader: fragmentSrc,
  uniforms,
  attributes,
} = demoShader

const c = document.getElementById('c')
const gl = c.getContext('webgl')

// we need a function that creates the shaders in a usable format for the API

const createShader = (gl, type, source) => {
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

const vertexShader = createShader(gl, gl.VERTEX_SHADER, vertexSrc)
const fragmentShader = createShader(gl, gl.FRAGMENT_SHADER, fragmentSrc)

// now we need to link and compile the shaders...

const createProgram = (gl, vertexShader, fragmentShader) => {
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

const glPrgrm = createProgram(gl, vertexShader, fragmentShader)

// in order to pass data / state to the shader program we need to get the location of the 'attribute'
const positionAttributeLocation = gl.getAttribLocation(glPrgrm, 'les_position')

// and create a buffer for this attribute to pass data to during the render loop and bind it
const positionBuffer = gl.createBuffer()
gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer)

// pass in vertext data (clipspace coords!)
// double check these values
const positions = [
  0, 0,
  0, 0.5,
  0.7, 0,
]

// buffer it
gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(positions), gl.STATIC_DRAW)

// we need to tell the API what size to render the content to
gl.viewport(0, 0, c.width, c.height)
// this tells the API how clipspace maps to the canvas dimensions 
/* gl.viewport(
  clipSpaceX -1, // left
  clipSpaceY -1, // top
  clipSpaceX +1, // right
  clipSpaceY +1  // bottom
) // double check these values les!
*/

gl.useProgram(glPrgrm) // duh

gl.enableVertexAttribArray(positionAttributeLocation)
// turns the attribute location 'on'

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
const count = 3 // how many times to execute the shader
gl.drawArrays(primitiveType, offset, count)

window.addEventListener('resize', handleResize)

function handleResize() {
  // Lookup the size the browser is displaying the canvas.
  var displayWidth  = c.clientWidth
  var displayHeight = c.clientHeight
 
  // Check if the canvas is not the same size.
  if (c.width  != displayWidth ||
      c.height != displayHeight) {
 
    // Make the canvas the same size
    c.width  = displayWidth
    c.height = displayHeight
    gl.viewport(0, 0, c.width, c.height)
  }
}