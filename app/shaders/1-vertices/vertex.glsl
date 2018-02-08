// an attribute will receive data from a buffer
precision mediump float;
attribute vec4 les_position;
uniform float globalTime;

varying vec3 v_textcoord;
varying float sint;
varying float cost;
// all shaders have a main function
void main() {
  sint = sin(globalTime * 2.0) / 10.0;
  cost = cos(globalTime * 2.0) / 10.0;
  // gl_Position is a special variable a vertex shader
  float x = les_position.x > 0.0 ? les_position.x + sint : les_position.x + cost;
  float y = les_position.y > 0.0 ? les_position.y + cost: les_position.y + sint;
  float z = les_position.z > 0.0 ? les_position.z + sint: les_position.z + cost;

  v_textcoord = vec3(
    (les_position.x - 0.5) * -1.0,
    (les_position.y - 0.5) * -1.0,
    (les_position.z - 0.5) * -1.0
  );

  gl_Position = vec4(
    x,
    y,
    z,
    les_position.w
  );
}