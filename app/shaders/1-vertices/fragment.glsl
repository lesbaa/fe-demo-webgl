precision mediump float;
uniform float u_t;

void main() {
  gl_FragColor = vec4(sin(u_t / 10.0), cos(u_t / 10.0), 0.5, 1);
}