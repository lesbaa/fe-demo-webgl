const loadImage = (imageUrl) => {
  return new Promise((res, rej) => {
    const img = new Image()
    img.src = imageUrl
    img.addEventListener('load', () => {
      res(img)
    })
    img.addEventListener('error', (e) => {
      console.error('Error Loading Image:', imageUrl, e)
      rej(false)
    })
  })
}

export default loadImage
