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
         0.0,     h,    0.0,
        -(w / 2), 0.0,  0.0,
         (w / 2), 0.0,  0.0,
      ],
      cols: 3,
      rows: 3,
      position: {
        x,
        y,
        z,
      },
      glPrimitive: this.gl.TRIANGLES,
      rotation: {
        x: 0,
        y: 0,
        z: 0,
      },
    }
  }
}