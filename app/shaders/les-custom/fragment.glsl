uniform float tLes;

varying vec2 vUv;

void main() {
  float red = 400.0 * vUv.x;
  float grn = 400.0 * vUv.x;
  float blu = 400.0 * vUv.x;
  gl_FragColor = vec4( red, grn, blu, 1 );
}
