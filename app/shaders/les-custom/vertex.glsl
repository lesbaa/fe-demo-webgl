varying vec2 vUv;
void main() {
  vec4 ndcPos;
  vUv = uv;
  gl_Position = vec4( position , 1.0 );
}