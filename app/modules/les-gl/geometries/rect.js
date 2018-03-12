// with the texture map we're telling webgl how to map the texture to each vertex
// where 0.0 

export default function({
  w = 1.0,
  h = 1.0,
  x = 0.0,
  y = 0.0,
  z = 0.0,
  texture = null,
}) {
  return function() {
    return {
      vertices: [
         w/2,  h/2, 0.0,
        -w/2,  h/2, 0.0,
         w/2, -h/2, 0.0,
        -w/2, -h/2, 0.0,
      ],
      textureMap: [
        1.0,  1.0,
        0.0,  1.0,
        1.0,  0.0,
        0.0,  0.0,
      ],
      tCols: 2,
      tRows: 4,
      texture,
      cols: 3,
      rows: 4,
      position: {
        x,
        y,
        z,
      },
      glPrimitive: this.gl.TRIANGLE_STRIP,
      rotation: {
        x: 0,
        y: 0,
        z: 0,
      },
    }
  }
}
