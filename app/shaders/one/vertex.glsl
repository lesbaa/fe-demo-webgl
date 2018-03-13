precision highp float;
attribute vec3 aVertexPosition;
attribute vec2 aTextureCoord;

uniform mat4 uMVMatrix;
uniform mat4 uPMatrix;
uniform float globalTime;
varying vec4 uv;
varying highp vec2 vTextureCoord;

void main() {
    float x = aVertexPosition.x;
    float y = aVertexPosition.y;
    float z = aVertexPosition.z;

    gl_Position = uPMatrix * uMVMatrix * vec4(
        x,
        y,
        z,
        1.0
    );

    if (gl_Position.w > 0.0) {
      gl_PointSize = 4.0 / gl_Position.w;
    } else {
      gl_PointSize = 0.0;
    }

    vTextureCoord = aTextureCoord;
    uv = gl_Position;
}