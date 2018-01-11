uniform float tLes;

varying vec2 vUv;


void main() {
  float val = 1.0;
  gl_FragColor = vec4(sin(gl_FragCoord.x / 10.0 + tLes * 10.0), 0.5, val, 1 );
}
