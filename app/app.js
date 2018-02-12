// most of this was taking from here
//https://webglfundamentals.org/webgl/lessons/webgl-fundamentals.html
// and here
// https://webglfundamentals.org/webgl/lessons/webgl-resizing-the-canvas.html

// http://www.opengl-tutorial.org/beginners-tutorials/tutorial-3-matrices/
// http://math.hws.edu/graphicsbook/

/**
 * TODO
 * more geometries -
 *  prism,
 *  bucky ball, // maybe get the guys to build these?
 *  
 * constructor options, clear color etc
 * 
 * fix camera stuff for fragement shaders, try and use gl_FragCoord instead of uv
 * 
 * named geometries, supply id / name, make it easier to access.
 * ability to edit geometry on the fly. buffer data every frame for certain geometries?
 * add textures
 * 
 * different materials? switching shaders for different objects
 */

import LesGl from './modules/les-gl'
import demoShader from './shaders/1-vertices'

import {
  rect,
  isoscelesTriangle,
  cube,
} from './modules/les-gl/geometries'

const c = document.getElementById('c')

const lesGl = new LesGl(c, demoShader, true)


lesGl.addGeometry(
  cube({
    x: 0.0,
    y: 0.0,
    z: -5.0,
    w: 1.5,
    h: 1.5,
    d: 1.5,
  })
)

// lesGl.addSquare()
// lesGl.render()

const drawScene = (now) => {
  requestAnimationFrame(drawScene)
  now *= 0.001
  lesGl.shader.uniforms.globalTime.value += 0.01
  for (let i = 0; i < lesGl.geometries.length; i++) {
    const geometry = lesGl.geometries[i]
    geometry.rotation.x += 1
    geometry.rotation.y += 1
    geometry.rotation.z += 1
    geometry.position.z = -10 + Math.sin(now / 1.4) * 6
  }
  lesGl.render()
}

drawScene(0.0)
