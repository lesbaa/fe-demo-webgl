const isMatrixUniform = type => [
  'uniformMatrix2fv',
  'uniformMatrix3fv',
  'uniformMatrix4fv',
].includes(type)

export default isMatrixUniform
