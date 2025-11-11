import { useEffect, useRef, useState } from 'react'

export default function VideoPlayer({ src, borderColor }) {
  const videoRef = useRef(null)
  const [error, setError] = useState(null)
  const [isLoading, setIsLoading] = useState(true)
  const [videoUrl, setVideoUrl] = useState('')

  useEffect(() => {
    if (!src) {
      setVideoUrl('')
      return
    }

    // Ensure URL is properly formatted
    let url = src
    if (!url.startsWith('http://') && !url.startsWith('https://')) {
      // If relative URL, make it absolute
      url = `http://localhost:3000${url.startsWith('/') ? url : '/' + url}`
    }
    
    console.log('Video URL:', url)
    setVideoUrl(url)
  }, [src])

  useEffect(() => {
    const video = videoRef.current
    if (!video || !videoUrl) return

    setIsLoading(true)
    setError(null)

    // Timeout untuk loading (30 detik)
    const loadTimeout = setTimeout(() => {
      if (isLoading) {
        console.error('Video load timeout')
        setError('Video load timeout - File terlalu besar atau format tidak didukung')
        setIsLoading(false)
      }
    }, 30000)

    const handleCanPlay = () => {
      console.log('Video can play')
      clearTimeout(loadTimeout)
      setIsLoading(false)
      // Try to play the video
      video.play().catch(err => {
        console.error('Autoplay failed:', err)
        // Autoplay might be blocked, but video is ready
        setIsLoading(false)
      })
    }

    const handleError = (e) => {
      console.error('Video error:', e, video.error)
      clearTimeout(loadTimeout)
      const errorMsg = video.error ? 
        `Error code: ${video.error.code} - ${getErrorMessage(video.error.code)}` :
        'Failed to load video'
      setError(errorMsg)
      setIsLoading(false)
    }

    const handleLoadedData = () => {
      console.log('Video loaded successfully')
      clearTimeout(loadTimeout)
      setIsLoading(false)
    }

    const handleLoadStart = () => {
      console.log('Video load started')
    }

    const handleStalled = () => {
      console.warn('Video stalled - network issue or slow connection')
    }

    const handleSuspend = () => {
      console.warn('Video suspended - browser stopped loading')
      // If suspended multiple times, show error
      setTimeout(() => {
        if (isLoading) {
          setError('Video tidak dapat dimuat - Format mungkin tidak didukung browser')
          setIsLoading(false)
        }
      }, 5000)
    }

    video.addEventListener('canplay', handleCanPlay)
    video.addEventListener('error', handleError)
    video.addEventListener('loadeddata', handleLoadedData)
    video.addEventListener('loadstart', handleLoadStart)
    video.addEventListener('stalled', handleStalled)
    video.addEventListener('suspend', handleSuspend)

    // Force load
    video.load()

    return () => {
      clearTimeout(loadTimeout)
      video.removeEventListener('canplay', handleCanPlay)
      video.removeEventListener('error', handleError)
      video.removeEventListener('loadeddata', handleLoadedData)
      video.removeEventListener('loadstart', handleLoadStart)
      video.removeEventListener('stalled', handleStalled)
      video.removeEventListener('suspend', handleSuspend)
    }
  }, [videoUrl, isLoading])

  const getErrorMessage = (code) => {
    switch(code) {
      case 1: return 'MEDIA_ERR_ABORTED - Video loading aborted'
      case 2: return 'MEDIA_ERR_NETWORK - Network error'
      case 3: return 'MEDIA_ERR_DECODE - Video decode error'
      case 4: return 'MEDIA_ERR_SRC_NOT_SUPPORTED - Video format not supported'
      default: return 'Unknown error'
    }
  }

  if (!src) {
    return (
      <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-gray-900 to-black">
        <div className="text-center text-gray-600">
          <div className="text-6xl mb-4">📺</div>
          <div className="text-2xl">Video Display</div>
          <div className="text-sm mt-2">Upload video dari dashboard operator</div>
        </div>
      </div>
    )
  }

  return (
    <div className="relative w-full h-full">
      {isLoading && (
        <div className="absolute inset-0 flex items-center justify-center bg-black z-10">
          <div className="text-center">
            <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 mx-auto mb-4"
              style={{ borderColor: borderColor || '#06b6d4' }}
            />
            <div className="text-white mb-4">Loading video...</div>
            <div className="text-xs text-gray-400 mb-4">
              Jika loading terlalu lama, video mungkin terlalu besar<br/>
              atau format tidak didukung
            </div>
            <button
              onClick={() => {
                setIsLoading(false)
                setError('Loading cancelled - Video mungkin terlalu besar atau format salah')
              }}
              className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 text-sm"
            >
              Cancel Loading
            </button>
          </div>
        </div>
      )}
      
      {error && (
        <div className="absolute inset-0 flex items-center justify-center bg-black z-10">
          <div className="text-center text-red-500 p-4 max-w-2xl">
            <div className="text-6xl mb-4">⚠️</div>
            <div className="text-xl mb-2">Failed to load video</div>
            <div className="text-sm mb-4">{error}</div>
            
            <div className="bg-gray-900 rounded p-4 mb-4">
              <div className="text-xs text-gray-400 mb-2">Video URL:</div>
              <div className="text-xs text-gray-300 break-all">{videoUrl}</div>
            </div>
            
            <div className="text-left text-xs text-gray-400 space-y-2">
              <div className="font-bold text-white mb-2">💡 Solusi:</div>
              <div>1. <span className="text-yellow-400">Convert video ke MP4 (H.264)</span></div>
              <div>2. <span className="text-yellow-400">Compress video jika &gt; 50MB</span></div>
              <div>3. <span className="text-yellow-400">Re-upload via operator app</span></div>
              <div>4. <span className="text-yellow-400">Test URL di browser</span>: Copy URL → Paste di tab baru</div>
              <div>5. <span className="text-yellow-400">Check backend running</span>: Port 3000</div>
            </div>
          </div>
        </div>
      )}

      <video
        ref={videoRef}
        autoPlay
        loop
        muted
        playsInline
        preload="auto"
        className="w-full h-full object-cover"
        crossOrigin="anonymous"
      >
        <source src={videoUrl} type="video/mp4" />
        <source src={videoUrl} type="video/webm" />
        <source src={videoUrl} type="video/ogg" />
        Your browser does not support the video tag.
      </video>
    </div>
  )
}
