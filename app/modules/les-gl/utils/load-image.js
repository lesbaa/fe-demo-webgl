const loadImage = (imageUrl) => {
  return new Promise((res, rej) => {
    const img = new Image()
    img.src = imageUrl
    img.addEventListener('load', () => {
      console.log(`Image dimensions: ${img.width} x ${img.height}`)
      res(img)
    })
    img.addEventListener('error', (e) => {
      console.log(e)
      rej(false)
    })
  })
}

export default loadImage
