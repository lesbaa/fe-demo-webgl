const loadImage = (imageUrl) => {
  return new Promise((res, rej) => {
    console.info('Loading Image:', imageUrl, '...')
    const img = new Image()
    img.src = imageUrl
    img.addEventListener('load', () => {
      console.info('Image loaded:', imageUrl)
      console.info(`Image dimensions: ${img.width} x ${img.height}`)
      res(img)
    })
    img.addEventListener('error', (e) => {
      console.error('Error Loading Image:', imageUrl, e)
      rej(false)
    })
  })
}

export default loadImage
