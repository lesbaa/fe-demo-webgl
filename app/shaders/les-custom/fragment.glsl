uniform sampler2D tDiffuse;
uniform float tLes;
varying vec2 vUv;

void main() {
  vec4 color = texture2D(tDiffuse, vUv);
  float r = sin(vUv.x * 10.0 + tLes) + sin(vUv.y * 10.0 + tLes) * sin(tLes);
  float g = cos(vUv.x * 10.0 - tLes) + cos(vUv.y * 10.0 - tLes) * sin(tLes);
  float b = cos(vUv.y * 10.0 + tLes) + cos(vUv.y * 10.0 + tLes) * sin(tLes);

  gl_FragColor = vec4(
    r,
    g,
    b,
    color.a
  );
}