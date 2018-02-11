import {
  SIMPLE_TRIANGLE,
  SIMPLE_SQUARE,
} from '../geometries/types'

import {
  simpleSquare,
  simpleTriangle,
} from '../geometries'

const getVertices = (type) => {
  switch (type) {
    case SIMPLE_TRIANGLE: {
      return {
        vertices: simpleTriangle,
        totalVertices: 3,
        dimensions: 3,
      }
    }
    case SIMPLE_SQUARE: {
      return {
        vertices: simpleSquare,
        totalVertices: 4,
        dimensions: 3,
      }
    }
  }
}

const glCreateGeometry = (gl, type, attribLoc) => {
  // and create a buffer for this attribute to pass data to during the render loop and bind it
  const {
    vertices,
    dimensions,
    totalVertices,
  } = getVertices(type)
  
  const positionBuffer = gl.createBuffer()
  gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer)
  
  // pass in vertext data (clipspace coords!)
  // double check these values
  
  // turns the attribute location 'on'
  gl.enableVertexAttribArray(attribLoc)

  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertices), gl.STATIC_DRAW)
  
  return {
    vertices,
    attribLoc,
    totalVertices,
    dimensions,
    positionBuffer,
  }
}

export default glCreateGeometry
