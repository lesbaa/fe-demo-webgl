uniform float tLes;
uniform vec2 mousePos;
uniform vec2 vpSize;
varying vec2 vUv;


void main() {
  vec4 ndcPos;
  ndcPos.xy = ((gl_FragCoord.xy / vpSize.xy) * 2.0) - 1.0;
  ndcPos.w = 1.0;
  vec2 mousePosInClip = mousePos / vpSize;
  vec4 clipPos = ndcPos / gl_FragCoord.w;

  gl_FragColor = vec4(clipPos.x / mousePosInClip.x, clipPos.y / mousePosInClip.y, 1, 1);
}
