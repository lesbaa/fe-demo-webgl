export default function({
  w = 1.0,
  h = 1.0,
  d = 1.0,
  x = 0.0,
  y = 0.0,
  z = 0.0,
  textureId,
}) {
  return function() {
    return {
      vertices: [
         w/2,  h/2, -d/2,
        -w/2,  h/2, -d/2,
         w/2, -h/2, -d/2,
        -w/2, -h/2, -d/2,

        -w/2, -h/2, -d/2,
        -w/2, -h/2,  d/2,
        -w/2,  h/2, -d/2,
        -w/2,  h/2,  d/2,

        -w/2,  h/2,  d/2,
        -w/2,  h/2, -d/2,
         w/2,  h/2,  d/2,
         w/2,  h/2, -d/2,

         w/2,  h/2, -d/2,
         w/2, -h/2, -d/2,
         w/2,  h/2,  d/2,
         w/2, -h/2,  d/2,

         w/2, -h/2, -d/2,
         w/2, -h/2,  d/2,
        -w/2, -h/2, -d/2,
        -w/2, -h/2,  d/2,

        -w/2, -h/2,  d/2,
        -w/2,  h/2,  d/2,
         w/2, -h/2,  d/2,
         w/2,  h/2,  d/2,
      ],
      textureMap: [
        // Front
        0.0,  0.0,
        1.0,  0.0,
        1.0,  1.0,
        0.0,  1.0,
        // Back
        0.0,  0.0,
        1.0,  0.0,
        1.0,  1.0,
        0.0,  1.0,
        // Top
        0.0,  0.0,
        1.0,  0.0,
        1.0,  1.0,
        0.0,  1.0,
        // Bottom
        0.0,  0.0,
        1.0,  0.0,
        1.0,  1.0,
        0.0,  1.0,
        // Right
        0.0,  0.0,
        1.0,  0.0,
        1.0,  1.0,
        0.0,  1.0,
        // Left
        0.0,  0.0,
        1.0,  0.0,
        1.0,  1.0,
        0.0,  1.0,
      ],
      tCols: 2,
      tRows: 24,
      textureId,
      cols: 3,
      rows: 24,
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

