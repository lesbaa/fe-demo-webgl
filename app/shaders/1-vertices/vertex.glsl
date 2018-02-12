attribute vec3 aVertexPosition;
uniform mat4 uMVMatrix;
uniform mat4 uPMatrix;
varying vec4 uv;
uniform float globalTime;
void main() {
    gl_Position = uPMatrix * uMVMatrix * vec4(
      aVertexPosition.x + sin(globalTime),
      aVertexPosition.y + cos(globalTime),
      aVertexPosition.z + sin(globalTime),
      1.0
    );
    uv = gl_Position;
}