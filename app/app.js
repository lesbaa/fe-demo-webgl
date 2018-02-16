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
 * - load multiple textures, use different textures for different objects
 * - dat.guid and stats
 * - load multiple shaders and switch during animation
 * - different materials? switching shaders for different objects
 */

// tidy up code, les

import LesGl from './modules/les-gl'
import demoShader from './shaders/one'

import {
  rect,
  isoscelesTriangle,
  cube,
} from './modules/les-gl/geometries'

const c = document.getElementById('c')

const lesGl = new LesGl(c, demoShader, {
  debug: true,
  clearColor: [0, 0, 0, 1.0],
})

lesGl.addGeometry(
  cube({
    x: .25,
    y: 0.0,
    z: -5.0,
    w: 0.5,
    h: 0.5,
    d: 0.5,
    textureId: 'movie-1',
  }),
  'cube-1',
)

lesGl.addGeometry(
  cube({
    x: -.25,
    y: 0.0,
    z: -5.0,
    w: .5,
    h: .5,
    d: .5,
    textureId: 'doge-1',
  }),
  'cube-2',
)

lesGl.loadTexture({
  url: './assets/doge.jpeg',
  id: 'doge-1',
  type: 'img',
})

// lesGl.loadTexture({
//   url: './assets/mov.mov',
//   id: 'movie-1',
//   type: 'video',
// })


lesGl.applyTexture('cube-1')
lesGl.applyTexture('cube-2')
// lesGl.addSquare()
// lesGl.render()

// lesGl.loadTexture('./assets/doge.jpeg', 'doge')


const geometry1 = lesGl.geometries['cube-1']
const geometry2 = lesGl.geometries['cube-2']

const {
 width,
 height,
} = c

let accelX = 0
let accelY = 0
let accelZ = 0

const drawScene = (now) => {
  requestAnimationFrame(drawScene)
  now *= 0.001
  lesGl.shader.uniforms.globalTime.value += 0.01
  geometry1.position.z = -3.5 + Math.sin(now / 1.4) * 1.5
  geometry2.position.z = -3.5 + Math.sin(now / 1.4) * 1.5
  geometry1.rotation.x -= 1
  geometry2.rotation.x += 1
  geometry1.rotation.y -= 1
  geometry2.rotation.y += 1
  geometry1.rotation.z -= 1
  geometry2.rotation.z += 1
  lesGl.render(now)
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
