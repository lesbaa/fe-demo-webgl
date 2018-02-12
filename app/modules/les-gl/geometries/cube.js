export default function({
  w = 1.0,
  h = 1.0,
  d = 1.0,
  x = 0.0,
  y = 0.0,
  z = 0.0,
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

