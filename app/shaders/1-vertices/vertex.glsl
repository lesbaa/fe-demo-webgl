// an attribute will receive data from a buffer
precision mediump float;
attribute vec4 les_position;
uniform float t;

attribute vec2 a_textcoord;
varying vec2 v_textcoord;
// all shaders have a main function
void main() {

  // gl_Position is a special variable a vertex shader
  // is responsible for setting
  v_textcoord = a_textcoord;
  gl_Position = vec4(
    les_position.xyzw
  );
}
// the below vertex shader renders according to screenSpace instead of clipspace
// // an attribute will receive data from a buffer
// attribute vec2 les_position;
// uniform vec2 les_resolution;
// uniform float t;

// void main() {
//   // convert the position from pixels to 0.0 to 1.0
//   vec2 zeroToOne = les_position / les_resolution;

//   // convert from 0->1 to 0->2
//   vec2 zeroToTwo = zeroToOne * 2.0;

//   // convert from 0->2 to -1->+1 (clipspace)
//   vec2 clipSpace = zeroToTwo - 1.0;

//   gl_Position = vec4(clipSpace * vec2(1, -1), 0, 1);
// }