// most of this was taking from here
//https://webglfundamentals.org/webgl/lessons/webgl-fundamentals.html
// and here
// https://webglfundamentals.org/webgl/lessons/webgl-resizing-the-canvas.html

// http://www.opengl-tutorial.org/beginners-tutorials/tutorial-3-matrices/
// http://math.hws.edu/graphicsbook/

/**
 * TODO
 * - more geometries -
 *  prism,
 *  bucky ball, // maybe get the guys to build these?
 * 
 * - maybe should be 'objects' instead of geometries
 * - cameras
 * - lighting
 * - ability to edit geometry on the fly. buffer data every frame for certain geometries?
 * - dat.guid
 * - load multiple shaders and switch during animation
 * - different materials? switching shaders for different objects
 * - use a single buffer for each type of geometry, if you have three cubes they can all use the same buffer
 */

// tidy up code, les

import LesGl from './modules/les-gl'
import Stats from './modules/stats'
import demoShader from './shaders/one'

import {
  rect,
  isoscelesTriangle,
  cube,
  points,
} from './modules/les-gl/geometries'

const c = document.getElementById('c')

window.lesGl = new LesGl(c, demoShader, {
  debug: true,
  clearColor: [0, 0, 0, 1.0],
})

const pointies = []

for (let p = 0; p < 300; p++) {
  pointies.push(Math.random() - 0.5)
}
// https://codepen.io/AzazelN28/pen/zvXZQw
console.log(pointies.length)
const obj = lesGl.addObject(
  points({
    points: pointies,
    texture: lesGl.createTexture({
      color: [150, 150, 150, 0],
      type: 'basic',
    }),
  }),
)

const {
 width,
 height,
} = c

let accelX = 0
let accelY = 0
let accelZ = 0

const stats = new Stats()

document.body.appendChild(
  document.createElement('div').appendChild(stats.dom)
)

// obj.rotation.z = 180

// if (obj.type === 'cube') {
//   obj.rotation.z = 90
// }

const drawScene = (now) => {
  requestAnimationFrame(drawScene)
  now *= 0.001
  // obj.position.x += (Math.sin(now) - 1.0)
  // obj.position.y += (Math.cos(now) - 1.0)
  
  lesGl.shader.uniforms.globalTime.value += 0.01
  lesGl.render(now)
  stats.update()
}

window.addEventListener('keydown', ({ code }) => {
  switch (code) {
    case 'ArrowUp': {
      accelX += 1
      break
    }
    case 'ArrowRight': {
      accelZ += 1
      break
    }
    case 'ArrowDown': {
      accelX -= 1
      break
    }
    case 'ArrowLeft': {
      accelZ -= 1
      break
    }

    default: {
      return
    }
      
  }
})

drawScene(0.0)
