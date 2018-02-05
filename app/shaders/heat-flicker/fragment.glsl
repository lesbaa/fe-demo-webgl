uniform float tLes;
// uniform vec2 mousePos;
uniform float wavelength;
uniform vec2 vpSize;
uniform sampler2D tDiffuse;
varying vec2 vUv;

const vec2 clipOffset = vec2(0.5, -0.5);
const float gridSqrSize = 0.05;

void main() { 
  float shift = 0.0;
  if (sin(vUv.y * wavelength) > 0.1 && cos(vUv.x * wavelength) > 0.1) {
    shift = 0.005;
  }
  vec4 color = texture2D(
    tDiffuse,
    vec2(
      vUv.x + sin((vUv.y + tLes) * 200.0) / 1000.0 + cos((vUv.y + tLes) * 199.0) / 1000.0,
      vUv.y
    )
  );
  float r = color.r;
  float g = color.g;
  float b = color.b;
  float a = color.a;
  gl_FragColor = vec4(r,g,b,a);
}
