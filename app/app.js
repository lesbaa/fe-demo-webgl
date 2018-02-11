// most of this was taking from here
//https://webglfundamentals.org/webgl/lessons/webgl-fundamentals.html
// and here
// https://webglfundamentals.org/webgl/lessons/webgl-resizing-the-canvas.html

// http://www.opengl-tutorial.org/beginners-tutorials/tutorial-3-matrices/
// http://math.hws.edu/graphicsbook/

import getDebuggerContext from './modules/debugger'
import LesGl from './modules/les-gl'
import demoShader from './shaders/1-vertices'
import {
  SIMPLE_TRIANGLE,
  SIMPLE_SQUARE,
} from './modules/les-gl/geometries/types'

const c = document.getElementById('c')

const lesGl = new LesGl(c, demoShader, true)
window.lesGl = lesGl
lesGl.addGeometry({
  type: SIMPLE_TRIANGLE,
  attributeName: 'les_position',
})

const drawScene = (now) => {
  now *= 0.001
  lesGl.render()
  requestAnimationFrame(drawScene)
}

drawScene(0.0)
