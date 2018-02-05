precision mediump float;
uniform float t;

void main() {
  // gl_FragCoord
  float g = sin(gl_FragCoord.y / 10.0) * sin(gl_FragCoord.x / 10.0) + sin(t);
  float r = sin(gl_FragCoord.x / 10.0) * sin(gl_FragCoord.y / 10.0) + sin(t);
  float b = sin(gl_FragCoord.x / 500.0);
  float a = sin(gl_FragCoord.x / 1000.0);
  gl_FragColor = vec4(r, g, b, a);
}