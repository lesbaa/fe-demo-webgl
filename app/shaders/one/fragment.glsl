precision highp float;
varying vec4 uv;
uniform float globalTime;
varying highp vec2 vTextureCoord;
uniform sampler2D uSampler;

void main(void) {
  vec4 texColor = texture2D(
    uSampler,
    vec2(
      vTextureCoord.x,
      vTextureCoord.y
    )
  );
  
  float r = texColor.x;
  float g = texColor.y;
  float b = texColor.z;
  float a = texColor.w;

//   gl_FragColor = vec4(
//     g * 1.0,
//     r * 1.0,
//     b * 1.0,
//     a
//   );
// }

  gl_FragColor = vec4(
      r * 1.0 - (uv.z / 3.0) + .7,
      g * 1.0 - (uv.z / 3.0) + .7,
      b * 1.0 - (uv.z / 3.0) + .7,
      a
  );
}
