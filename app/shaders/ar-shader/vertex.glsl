precision highp float;
precision lowp int;

uniform mat4 cameraMatrix;
uniform mat4 transformationMatrix;

varying vec2 vUv;

void main(void)
{
	vUv = uv;
	gl_Position = cameraMatrix * transformationMatrix * vec4(position, 1.0);
}