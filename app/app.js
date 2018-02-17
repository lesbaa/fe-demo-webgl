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
} from './modules/les-gl/geometries'

const c = document.getElementById('c')

window.lesGl = new LesGl(c, demoShader, {
  debug: true,
  clearColor: [0, 0, 0, 1.0],
})

lesGl.addObject(
  cube({
    x: 3 * (Math.random() - 0.5),
    y: 3 * (Math.random() - 0.5),
    z: -5,
    w: 1.0,
    h: 1.0,
    d: 1.0,
    texture: lesGl.createTexture({
      url: './assets/doge.jpeg',
      type: 'img',
    }),
  }),
)

lesGl.addObject(
  cube({
    x: 3 * (Math.random() - 0.5),
    y: 3 * (Math.random() - 0.5),
    z: -5,
    w: 1.0,
    h: 1.0,
    d: 1.0,
    texture: lesGl.createTexture({
      url: './assets/mov.mov',
      type: 'video',
    }),
  }),
)

lesGl.addObject(
  cube({
    x: 3 * (Math.random() - 0.5),
    y: 3 * (Math.random() - 0.5),
    z: -5,
    w: 1.0,
    h: 1.0,
    d: 1.0,
    texture: lesGl.createTexture({
      url: './assets/doge-bump.jpeg',
      type: 'img',
    }),
  }),
)
// lesGl.applyTexture(obj3D)


// lesGl.addSquare()
// lesGl.render()

// lesGl.loadTexture('./assets/doge.jpeg', 'doge')


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


const drawScene = (now) => {
  // if (~~now % 10 === 0) console.log(dogeTex)
  requestAnimationFrame(drawScene)
  now *= 0.001
  for (let i = 0; i < lesGl.objects.length; i++) {
    const obj = lesGl.objects[i]
    const wheech = (i + 1) / 3
    obj.rotation.x += wheech
    obj.rotation.y += wheech
    obj.rotation.z += wheech
  }

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
