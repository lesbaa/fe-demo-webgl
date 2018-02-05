precision mediump float;
uniform float t;

void main() {
  gl_FragColor = vec4(sin(t / 10.0), cos(t / 10.0), 0.5, 1);
}