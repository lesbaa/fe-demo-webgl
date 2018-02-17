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
import Stats from './modules/stats'
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

const dogeTexture = lesGl.loadTexture({
  url: './assets/doge.jpeg',
  id: 'doge-1',
  type: 'img',
})

for (let i = 0; i < 10; i++) {

const size = Math.random() * 2
lesGl.addObject(
  cube({
    x: 2 * (Math.random() - 0.5),
    y: 2 * (Math.random() - 0.5),
    z: -5,
    w: size,
    h: size,
    d: size,
    texture: dogeTexture,
  }),
)
  
}
// lesGl.applyTexture(obj3D)

lesGl.loadTexture({
  url: './assets/doge-bump.jpeg',
  id: 'doge-2',
  type: 'img',
})


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
