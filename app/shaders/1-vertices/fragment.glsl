precision mediump float;
uniform float globalTime;
varying vec3 v_textcoord;
uniform sampler2D u_image;
varying float sint;
varying float cost;

void main() {
  vec4 texturePixel = texture2D(u_image, v_textcoord.xy);
  float r = texturePixel.x;
  float g = texturePixel.y;
  float b = texturePixel.z;
  float a = texturePixel.w;
  gl_FragColor = vec4(
    r,
    g,
    b,
    a
  );
}

// black and white
// void main() {
//   vec4 texturePixel = texture2D(u_image, v_textcoord.xy);
//   float r = texturePixel.x;
//   float g = texturePixel.x;
//   float b = texturePixel.x;
//   float a = texturePixel.w;
//   gl_FragColor = vec4(
//     r,
//     g,
//     b,
//     a
//   );
// }

// posterise filter
// void main() {
//   vec4 texturePixel = texture2D(u_image, v_textcoord.xy);
//   float r = texturePixel.x > 0.5 ? 1.0 : 0.0;
//   float g = texturePixel.y > 0.5 ? 1.0 : 0.0;
//   float b = texturePixel.z > 0.5 ? 1.0 : 0.0;
//   float a = texturePixel.w;
//   gl_FragColor = vec4(
//     r,
//     g,
//     b,
//     a
//   );
// }