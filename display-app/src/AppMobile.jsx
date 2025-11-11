import { useState, useEffect } from 'react'
import axios from 'axios'
import { io } from 'socket.io-client'
import { API_URL, SOCKET_URL } from './config'
import VideoPlayer from './components/VideoPlayer'
import Statistics from './components/Statistics'
import RunningText from './components/RunningText'

function AppMobile() {
  const [currentQueue, setCurrentQueue] = useState(null)
  const [waitingQueues, setWaitingQueues] = useState([])
  const [settings, setSettings] = useState({})
  const [currentTime, setCurrentTime] = useState(new Date())
  const [allQueues, setAllQueues] = useState([])

  useEffect(() => {
    fetchSettings()
    fetchQueues()

    const socket = io(SOCKET_URL)
    socket.on('queue:new', fetchQueues)
    socket.on('queue:called', (data) => {
      setCurrentQueue(data)
      fetchQueues()
    })
    socket.on('queue:serving', fetchQueues)
    socket.on('queue:completed', fetchQueues)
    socket.on('queue:cancelled', fetchQueues)

    const interval = setInterval(() => {
      setCurrentTime(new Date())
      fetchQueues()
    }, parseInt(settings.display_refresh_interval) || 5000)

    return () => {
      socket.disconnect()
      clearInterval(interval)
    }
  }, [settings.display_refresh_interval])

  const fetchSettings = async () => {
    try {
      const response = await axios.get(`${API_URL}/settings`)
      console.log('Settings loaded:', response.data)
      console.log('Video URL:', response.data.video_url)
      setSettings(response.data)
    } catch (error) {
      console.error('Error fetching settings:', error)
    }
  }

  const fetchQueues = async () => {
    try {
      const [calledRes, waitingRes, allRes] = await Promise.all([
        axios.get(`${API_URL}/queue`, { params: { status: 'called' } }),
        axios.get(`${API_URL}/queue`, { params: { status: 'waiting' } }),
        axios.get(`${API_URL}/queue`) // Get all queues for statistics
      ])

      if (calledRes.data.length > 0) {
        setCurrentQueue(calledRes.data[0])
      }
      
      setWaitingQueues(waitingRes.data.slice(0, 4))
      setAllQueues(allRes.data) // All queues for statistics
    } catch (error) {
      console.error('Error fetching queues:', error)
    }
  }

  return (
    <div className="min-h-screen bg-black text-white overflow-hidden flex flex-col">
      {/* Main Container - Portrait Mode */}
      <div 
        className="m-2 border-4 rounded-2xl overflow-hidden flex flex-col" 
        style={{ 
          height: 'calc(100vh - 1rem)',
          borderColor: settings.theme_border_color || '#06b6d4'
        }}
      >
        
        {/* Header */}
        <div 
          className="px-4 py-3 flex flex-col items-center border-b-4"
          style={{
            background: `linear-gradient(to right, ${settings.theme_header_from || '#06b6d4'}, ${settings.theme_header_to || '#14b8a6'})`,
            borderBottomColor: settings.theme_border_color || '#06b6d4'
          }}
        >
          <div className="flex items-center space-x-3 mb-2">
            {settings.logo_url && (
              <img 
                src={settings.logo_url} 
                alt="Logo" 
                className="h-12 w-12 object-contain bg-white rounded-full p-1"
              />
            )}
            <div className="text-center">
              <h1 className="text-xl font-bold tracking-wide text-black">
                {settings.office_name || 'BAPAS Bandung'}
              </h1>
              <p className="text-xs text-black font-semibold">
                {settings.office_address || 'Jl. Contoh No. 123, Bandung'}
              </p>
            </div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-black">
              {currentTime.toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
            </div>
            <div className="text-xs text-black font-semibold">
              {currentTime.toLocaleDateString('id-ID', { day: '2-digit', month: '2-digit', year: 'numeric' })}
            </div>
          </div>
        </div>

        {/* Main Content - Vertical Layout */}
        <div className="flex-1 overflow-y-auto p-3 space-y-3">
          
          {/* Current Queue Display */}
          <div className="space-y-2">
            {/* Loket Label */}
            <div 
              className="rounded-lg p-2 border-2"
              style={{
                background: `linear-gradient(to right, ${settings.theme_panel_from || '#1f2937'}, ${settings.theme_panel_to || '#111827'})`,
                borderColor: settings.theme_border_color || '#06b6d4'
              }}
            >
              <h2 
                className="text-2xl font-bold text-center"
                style={{ color: settings.theme_queue_number || '#facc15' }}
              >
                LOKET {currentQueue?.counter_number || '1'}
              </h2>
            </div>

            {/* Nomor Antrian Label */}
            <div 
              className="rounded-lg p-2 border-2"
              style={{
                background: `linear-gradient(to right, ${settings.theme_panel_from || '#1f2937'}, ${settings.theme_panel_to || '#111827'})`,
                borderColor: settings.theme_border_color || '#06b6d4'
              }}
            >
              <h3 className="text-lg font-bold text-white text-center">
                NOMOR ANTRIAN
              </h3>
            </div>

            {/* Big Queue Number */}
            <div 
              className="rounded-lg p-6 flex items-center justify-center border-2" 
              style={{ 
                minHeight: '150px',
                background: `linear-gradient(to bottom right, ${settings.theme_panel_from || '#1f2937'}, ${settings.theme_panel_to || '#111827'})`,
                borderColor: settings.theme_border_color || '#06b6d4'
              }}
            >
              {currentQueue ? (
                <div className="text-center">
                  <div className="flex items-center justify-center space-x-2">
                    <span 
                      className="text-5xl font-bold"
                      style={{ color: settings.theme_accent || '#06b6d4' }}
                    >
                      {currentQueue.queue_number.charAt(0)}
                    </span>
                    <span 
                      className="text-6xl font-bold animate-pulse"
                      style={{ color: settings.theme_queue_number || '#facc15' }}
                    >
                      {currentQueue.queue_number.slice(1)}
                    </span>
                  </div>
                  <div className="mt-2 text-base text-cyan-300 font-semibold">
                    {currentQueue.service_name}
                  </div>
                  <div className="mt-1 text-sm text-gray-400">
                    {currentQueue.client_name}
                  </div>
                </div>
              ) : (
                <div className="text-center text-gray-600">
                  <div className="text-4xl mb-2">-</div>
                  <div className="text-base">Menunggu Panggilan</div>
                </div>
              )}
            </div>
          </div>

          {/* Video Display */}
          <div 
            className="rounded-lg overflow-hidden border-2"
            style={{ 
              height: '200px',
              borderColor: settings.theme_border_color || '#06b6d4'
            }}
          >
            <VideoPlayer 
              src={settings.video_url} 
              borderColor={settings.theme_border_color || '#06b6d4'}
            />
          </div>

          {/* Statistics - Mobile */}
          {settings.show_statistics === 'true' && (
            <Statistics queues={allQueues} settings={settings} position="bottom" />
          )}

          {/* Loket Preview (Configurable) */}
          <div 
            className="grid gap-2"
            style={{
              gridTemplateColumns: `repeat(${Math.min(parseInt(settings.display_columns || '4'), 2)}, minmax(0, 1fr))`
            }}
          >
            {Array.from({ length: parseInt(settings.display_columns || '4') }, (_, i) => i + 1).map((loketNum) => {
              const queue = allQueues.find(q => q.counter_number === loketNum) || 
                           waitingQueues.find((q, idx) => idx === loketNum - 1)
              
              return (
                <div 
                  key={loketNum} 
                  className="rounded-lg p-2 border-2"
                  style={{
                    background: `linear-gradient(to bottom right, ${settings.theme_panel_from || '#1f2937'}, ${settings.theme_panel_to || '#111827'})`,
                    borderColor: settings.theme_border_color || '#06b6d4'
                  }}
                >
                  <div className="text-center">
                    <div 
                      className="text-xs font-bold mb-1"
                      style={{ color: settings.theme_accent || '#06b6d4' }}
                    >
                      Loket {loketNum}
                    </div>
                    <div className="flex items-center justify-center space-x-1">
                      <span 
                        className="text-lg font-bold"
                        style={{ color: settings.theme_accent || '#06b6d4' }}
                      >
                        {queue?.queue_number?.charAt(0) || '-'}
                      </span>
                      <span 
                        className="text-xl font-bold"
                        style={{ color: settings.theme_queue_number || '#facc15' }}
                      >
                        {queue?.queue_number?.slice(1) || '---'}
                      </span>
                    </div>
                    {queue && (
                      <div className="text-xs text-gray-400 mt-1 truncate">
                        {queue.service_name}
                      </div>
                    )}
                  </div>
                </div>
              )
            })}
          </div>
        </div>

        {/* Running Text at Bottom - 3 Texts Rotation */}
        <RunningText settings={settings} />

      </div>
    </div>
  )
}

export default AppMobile
