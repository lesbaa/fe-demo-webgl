// an attribute will receive data from a buffer
precision mediump float;
attribute vec4 les_position;
uniform float globalTime;
uniform mat4 uMVMatrix;
uniform mat4 uPMatrix;

void main() {
  // gl_Position is a special variable a vertex shader
  float x = les_position.x; // > 0.0 ? les_position.x + sint : les_position.x + cost;
  float y = les_position.y; // > 0.0 ? les_position.y + cost: les_position.y + sint;
  float z = les_position.z; // > 0.0 ? les_position.z + sint: les_position.z + cost;

  gl_Position = vec4(
    x,
    y,
    z,
    1.0
  );
}