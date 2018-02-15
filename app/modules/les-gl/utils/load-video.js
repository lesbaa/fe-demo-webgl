const loadVideo = (url) => {
  return new Promise((res, rej) => {
    console.log('Loading video:', url, '...')
    const video = document.createElement('video')
    
    video.src = url
    video.autoplay = false
    video.muted = true
    video.loop = true

    // document.body.appendChild(video)

    video.addEventListener('canplay', () => {
      console.log('Video loaded:', url)
      res(video)
    })
    video.addEventListener('error', (e) => {
      console.error('Error Loading Video:', url, video.error.message)
      rej(video)
    })
  })
}

export default loadVideo
