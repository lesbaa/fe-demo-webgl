precision mediump float;
uniform float globalTime;
varying vec2 v_textcoord;
uniform sampler2D u_image;

void main() {
  // gl_FragCoord, explain this
  // remember to change the phase for cool effects!
  vec4 texturePixel = texture2D(u_image, v_textcoord.xy);
  gl_FragColor = vec4(texturePixel);
}