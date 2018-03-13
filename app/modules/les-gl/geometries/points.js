// with the texture map we're telling webgl how to map the texture to each vertex
// where 0.0 

export default function({
  x = 0,
  y = 0,
  z = 0,
  points,
  texture = null,
}) {
  return function() {
    console.log(points.length / 3)
    return {
      type: 'points',
      vertices: points,
      textureMap: [
        1.0,  1.0,
      ],
      tCols: 2,
      tRows: 1,
      texture,
      cols: 3,
      rows: points.length / 3,
      position: {
        x,
        y,
        z,
      },
      glPrimitive: this.gl.POINTS,
      rotation: {
        x: 0,
        y: 0,
        z: 0,
      },
    }
  }
}

