// most of this was taking from here
//https://webglfundamentals.org/webgl/lessons/webgl-fundamentals.html
// and here
// https://webglfundamentals.org/webgl/lessons/webgl-resizing-the-canvas.html

// http://www.opengl-tutorial.org/beginners-tutorials/tutorial-3-matrices/
// http://math.hws.edu/graphicsbook/

import LesGl from './modules/les-gl'
import demoShader from './shaders/1-vertices'

const c = document.getElementById('c')

const lesGl = new LesGl(c, demoShader, true)

lesGl.addTriangle()
// lesGl.addSquare()
// lesGl.render()

const drawScene = (now) => {
  now *= 0.001 
  for (let i = 0; i < lesGl.geometries.length; i++) {
    const geometry = lesGl.geometries[i]
    geometry.position.z = -5 + Math.sin(now)
  }
  lesGl.render()
  requestAnimationFrame(drawScene)
}

drawScene(0.0)
