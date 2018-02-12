attribute vec3 aVertexPosition;
uniform mat4 uMVMatrix;
uniform mat4 uPMatrix;
uniform float globalTime;
varying vec4 uv;

void main() {
    float x = aVertexPosition.x;
    float y = aVertexPosition.y;
    float z;
    if (x > 0.0) {
        z = aVertexPosition.z + sin(globalTime * 5.0);
    } else {
        z = aVertexPosition.z - cos(globalTime * 5.0);
    }
    gl_Position = uPMatrix * uMVMatrix * vec4(
        x,
        y,
        z,
        1.0
    );

    uv = gl_Position;
}