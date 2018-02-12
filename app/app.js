// most of this was taking from here
//https://webglfundamentals.org/webgl/lessons/webgl-fundamentals.html
// and here
// https://webglfundamentals.org/webgl/lessons/webgl-resizing-the-canvas.html

// http://www.opengl-tutorial.org/beginners-tutorials/tutorial-3-matrices/
// http://math.hws.edu/graphicsbook/

/**
 * TODO
 * more geometries -
 *  cube,
 *  prism,
 *  bucky ball,
 * 
 * fix camera stuff for fragement shaders
 * 
 * named geometries, supply id / name, make it easier to access.
 * 
 * add textures
 * 
 * different materials? switching shaders for different objects
 */

import LesGl from './modules/les-gl'
import demoShader from './shaders/1-vertices'

import {
  rect,
  isoscelesTriangle,
} from './modules/les-gl/geometries'

const c = document.getElementById('c')

const lesGl = new LesGl(c, demoShader, true)

lesGl.addGeometry(
  isoscelesTriangle({
    x: 0.0,
    y: 0.0,
    z: -5.0,
    w: 2.0,
    h: 1.0,
  })
)
// lesGl.addSquare()
// lesGl.render()
let clikCb

const drawScene = (now) => {
  now *= 0.001
  lesGl.shader.uniforms.globalTime.value = now
  for (let i = 0; i < lesGl.geometries.length; i++) {
    const geometry = lesGl.geometries[i]
    geometry.position.z = -5 + Math.sin(now * 3)
  }
  lesGl.render()
  requestAnimationFrame(drawScene)
}

drawScene(0.0)
