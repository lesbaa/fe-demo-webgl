import WebGLDebugUtils from 'webgl-debug'

function throwOnGLError(err, funcName, args) {
  throw WebGLDebugUtils.glEnumToString(err)
  + ' was caused by call to '
  + funcName
}

const getDebuggerContext = gl => WebGLDebugUtils.makeDebugContext(gl, throwOnGLError)

export default getDebuggerContext