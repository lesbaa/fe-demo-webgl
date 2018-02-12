precision highp float;
varying vec4 uv;
varying mat4 uMVMat;
varying mat4 uPMat;

void main(void) {
  
    vec4 depthOffset = uMVMat * uPMat * vec4(1.0, 1.0, 1.0, 1.0);
    gl_FragColor = (1.0 - depthOffset.z / 8.0) * vec4(1.0, 1.0, 1.0, 1.0);
}

// old scool screen
// float random(vec2 c){
//   return fract(sin(dot( c.xy, vec2(12.9898,78.233))) * 43758.5453);
// }
// void main() {
//   float texPositionX = v_textcoord.x;
//   float texPositionY = v_textcoord.y;

//   vec2 texPosition = vec2(texPositionX, texPositionY);
//   vec4 texturePixel = texture2D(u_image, texPosition);

//   float rndm = random( vec2(texPositionX + globalTime, texPositionY + globalTime) ) / 4.0;

//   float modifyWithSin = sin(texPositionY * 850.0);  

//   float r = 0.0;
//   float g = (modifyWithSin * texturePixel.y + rndm) > 0.5 ? 0.9 : 0.0;
//   float b = 0.0;
//   float a = (modifyWithSin * texturePixel.w - rndm) > 0.5 ? 1.0 : 0.0;
//   gl_FragColor = vec4(
//     r,
//     g,
//     b,
//     a
//   );
// }

// jelly doge
// void main() {
//   float texPositionX = v_textcoord.x + sin((v_textcoord.y * 20.0) + globalTime * 10.0) / 100.0;
//   float texPositionY = v_textcoord.y + sin((v_textcoord.x * 20.0) + globalTime * 10.0) / 100.0;
//   vec2 texPosition = vec2(texPositionX, texPositionY);
//   vec4 texturePixel = texture2D(u_image, texPosition);
//   float r = texturePixel.x;
//   float g = texturePixel.y;
//   float b = texturePixel.z;
//   float a = texturePixel.w;
//   gl_FragColor = vec4(
//     r,
//     g,
//     b,
//     a
//   );
// }

// black and white
// void main() {
//   vec4 texturePixel = texture2D(u_image, v_textcoord.xy);
//   float r = texturePixel.x;
//   float g = texturePixel.x;
//   float b = texturePixel.x;
//   float a = texturePixel.w;
//   gl_FragColor = vec4(
//     r,
//     g,
//     b,
//     a
//   );
// }

// posterise filter
// void main() {
//   vec4 texturePixel = texture2D(u_image, v_textcoord.xy);
//   float r = texturePixel.x > 0.5 ? 1.0 : 0.0;
//   float g = texturePixel.y > 0.5 ? 1.0 : 0.0;
//   float b = texturePixel.z > 0.5 ? 1.0 : 0.0;
//   float a = texturePixel.w;
//   gl_FragColor = vec4(
//     r,
//     g,
//     b,
//     a
//   );
// }