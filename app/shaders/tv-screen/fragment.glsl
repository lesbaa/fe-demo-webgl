uniform float tLes;
// uniform vec2 mousePos;
// uniform vec2 vpSize;
uniform sampler2D tDiffuse;
varying vec2 vUv;

float random(vec2 c){
  return fract(sin(dot( c.xy, vec2(12.9898,78.233))) * 43758.5453);
}

void main() {
  vec4 color = texture2D( tDiffuse, vUv );
  float rndm = random( vec2(vUv.x + tLes, vUv.y + tLes) ) / 4.0;
  float modifyWithSin = sin(vUv.y * 1000.0);
  float r = color.r + rndm * modifyWithSin;
  float g = color.g + rndm * modifyWithSin;
  float b = color.b + rndm * modifyWithSin;
  float a = 0.0;
  gl_FragColor = vec4(r,g,b,a);
}
