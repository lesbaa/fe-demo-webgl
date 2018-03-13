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

    // gl_Position = vec4(
    //     x,
    //     y,
    //     z + sin(globalTime),
    //     1.0
    // );
    // good video on vectors, matrices and transformations
    // https://www.youtube.com/watch?v=vQ60rFwh2ig
    gl_Position = uPMatrix * uMVMatrix * vec4(
        x,
        y,
        z,
        1.0
    );

    vTextureCoord = aTextureCoord;
    uv = gl_Position;
}