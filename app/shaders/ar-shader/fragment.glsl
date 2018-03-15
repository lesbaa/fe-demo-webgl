precision highp float;
precision lowp int;

varying vec2 vUv;

void main(void)
{
	gl_FragColor = vec4(vUv, 1.0, 1.0);
}