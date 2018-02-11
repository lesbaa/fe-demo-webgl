export default function({
  w = 1.0,
  h = 1.0,
  x = 0.0,
  y = 0.0,
  z = 0.0,
}) {
  return function() {
    return {
      vertices: [
         w,   h,   0,
        -w,   h,   0,
         w,  -h,   0,
        -w,  -h,   0,
      ],
      cols: 3,
      rows: 4,
      position: {
        x,
        y,
        z,
      },
      glPrimitive: this.gl.TRIANGLE_STRIP,
    }
  }
}
