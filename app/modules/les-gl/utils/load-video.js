const loadVideo = (url) => {
  return new Promise((res, rej) => {
    
    const video = document.createElement('video')
    
    video.src = url
    video.autoplay = false
    video.muted = true
    video.loop = true

    // document.body.appendChild(video)

    video.addEventListener('canplay', () => {
      console.info('video can play!')
      res(video)
    })
    video.addEventListener('error', (e) => {
      console.error('video load error', video.error.message)
      rej(video)
    })
  })
}

export default loadVideo
