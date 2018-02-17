const loadVideo = (url) => {
  return new Promise((res, rej) => {
    const video = document.createElement('video')
    
    video.src = url
    video.autoplay = false
    video.muted = true
    video.loop = true

    video.addEventListener('canplay', () => {
      console.log('Video loaded from: ', url)
      res(video)
    })
    video.addEventListener('error', (e) => {
      console.error('Error Loading Video: ', url, video.error.message)
      rej(video)
    })
  })
}

export default loadVideo
