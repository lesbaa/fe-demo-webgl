attribute vec3 aVertexPosition;
uniform mat4 uMVMatrix;
uniform mat4 uPMatrix;
uniform float globalTime;
varying mat4 uMVMat;
varying mat4 uPMat;
varying vec4 uv;

void main() {
    float x = aVertexPosition.x;
    float y = aVertexPosition.y;
    float z;
    if (x > 0.0) {
        z = aVertexPosition.z + sin(globalTime) * 2.0;
    } else {
        z = aVertexPosition.z + cos(globalTime) * 2.0;
    }
    gl_Position = uPMatrix * uMVMatrix * vec4(
        x,
        y,
        z,
        1.0
    );

    uMVMat = uMVMatrix;
    uPMat = uPMatrix;
    uv = gl_Position;
}