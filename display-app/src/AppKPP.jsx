import { useState, useEffect } from 'react'
import axios from 'axios'
import { io } from 'socket.io-client'
import { API_URL, SOCKET_URL } from './config'
import VideoPlayer from './components/VideoPlayer'
import Statistics from './components/Statistics'
import RunningText from './components/RunningText'

function AppKPP() {
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
      {/* Main Container with Custom Border */}
      <div 
        className="m-4 border-8 rounded-3xl overflow-hidden flex flex-col" 
        style={{ 
          height: 'calc(100vh - 2rem)',
          borderColor: settings.theme_border_color || '#06b6d4'
        }}
      >
        
        {/* Header */}
        <div 
          className="px-8 py-4 flex justify-between items-center border-b-4"
          style={{
            background: `linear-gradient(to right, ${settings.theme_header_from || '#06b6d4'}, ${settings.theme_header_to || '#14b8a6'})`,
            borderBottomColor: settings.theme_border_color || '#06b6d4'
          }}
        >
          <div className="flex items-center space-x-4">
            {settings.logo_url && (
              <img 
                src={settings.logo_url} 
                alt="Logo" 
                className="h-20 w-20 object-contain bg-white rounded-full p-2"
              />
            )}
            <div>
              <h1 className="text-3xl font-bold tracking-wide text-black">
                {settings.office_name || 'BAPAS BANDUNG'}
              </h1>
              <p className="text-sm text-black font-semibold">
                {settings.office_address || 'Jl. Contoh No. 123, Bandung'}
              </p>
            </div>
          </div>
          <div className="text-right">
            <div className="text-4xl font-bold text-black">
              {currentTime.toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
            </div>
            <div className="text-sm text-black font-semibold">
              {currentTime.toLocaleDateString('id-ID', { day: '2-digit', month: '2-digit', year: 'numeric' })}
            </div>
          </div>
        </div>

        {/* Main Content Area */}
        <div className="grid grid-cols-12 gap-4 p-6 flex-1 overflow-hidden">
          
          {/* Left Side - Current Queue */}
          <div className="col-span-5 space-y-4">
            {/* Loket Label */}
            <div 
              className="rounded-xl p-4 border-4"
              style={{
                background: `linear-gradient(to right, ${settings.theme_panel_from || '#1f2937'}, ${settings.theme_panel_to || '#111827'})`,
                borderColor: settings.theme_border_color || '#06b6d4'
              }}
            >
              <h2 
                className="text-4xl font-bold text-center"
                style={{ color: settings.theme_queue_number || '#facc15' }}
              >
                LOKET {currentQueue?.counter_number || '1'}
              </h2>
            </div>

            {/* Nomor Antrian Label */}
            <div 
              className="rounded-xl p-3 border-4"
              style={{
                background: `linear-gradient(to right, ${settings.theme_panel_from || '#1f2937'}, ${settings.theme_panel_to || '#111827'})`,
                borderColor: settings.theme_border_color || '#06b6d4'
              }}
            >
              <h3 className="text-2xl font-bold text-white text-center">
                NOMOR ANTRIAN
              </h3>
            </div>

            {/* Big Queue Number */}
            <div 
              className="rounded-xl p-8 flex items-center justify-center border-4" 
              style={{ 
                minHeight: '250px',
                background: `linear-gradient(to bottom right, ${settings.theme_panel_from || '#1f2937'}, ${settings.theme_panel_to || '#111827'})`,
                borderColor: settings.theme_border_color || '#06b6d4'
              }}
            >
              {currentQueue ? (
                <div className="text-center">
                  <div className="flex items-center justify-center space-x-4">
                    <span 
                      className="text-8xl font-bold"
                      style={{ color: settings.theme_accent || '#06b6d4' }}
                    >
                      {currentQueue.queue_number.charAt(0)}
                    </span>
                    <span 
                      className="text-9xl font-bold animate-pulse"
                      style={{ color: settings.theme_queue_number || '#facc15' }}
                    >
                      {currentQueue.queue_number.slice(1)}
                    </span>
                  </div>
                  <div className="mt-4 text-xl text-cyan-300 font-semibold">
                    {currentQueue.service_name}
                  </div>
                  <div className="mt-2 text-lg text-gray-400">
                    {currentQueue.client_name}
                  </div>
                </div>
              ) : (
                <div className="text-center text-gray-600">
                  <div className="text-6xl mb-4">-</div>
                  <div className="text-xl">Menunggu Panggilan</div>
                </div>
              )}
            </div>
          </div>

          {/* Right Side - Video/Document Display */}
          <div className="col-span-7">
            <div 
              className="bg-black rounded-xl overflow-hidden h-full border-4"
              style={{ borderColor: settings.theme_border_color || '#06b6d4' }}
            >
              <VideoPlayer 
                src={settings.video_url} 
                borderColor={settings.theme_border_color || '#06b6d4'}
              />
            </div>
          </div>
        </div>

        {/* Statistics - Top Position */}
        {settings.show_statistics === 'true' && settings.statistics_position === 'top' && (
          <Statistics queues={allQueues} settings={settings} position="top" />
        )}

        {/* Bottom - Loket Queue Display (Configurable Columns) */}
        <div className="px-6 pb-4 flex-shrink-0">
          <div 
            className="grid gap-3"
            style={{
              gridTemplateColumns: `repeat(${settings.display_columns || '4'}, minmax(0, 1fr))`
            }}
          >
            {Array.from({ length: parseInt(settings.display_columns || '4') }, (_, i) => i + 1).map((loketNum) => {
              const queue = allQueues.find(q => q.counter_number === loketNum) || 
                           waitingQueues.find((q, idx) => idx === loketNum - 1)
              
              return (
                <div 
                  key={loketNum} 
                  className="rounded-xl p-3 border-4"
                  style={{
                    background: `linear-gradient(to bottom right, ${settings.theme_panel_from || '#1f2937'}, ${settings.theme_panel_to || '#111827'})`,
                    borderColor: settings.theme_border_color || '#06b6d4'
                  }}
                >
                  <div className="text-center">
                    <div 
                      className="text-sm font-bold mb-1"
                      style={{ color: settings.theme_accent || '#06b6d4' }}
                    >
                      Loket {loketNum}
                    </div>
                    <div className="flex items-center justify-center space-x-2">
                      <span 
                        className="text-2xl font-bold"
                        style={{ color: settings.theme_accent || '#06b6d4' }}
                      >
                        {queue?.queue_number?.charAt(0) || '-'}
                      </span>
                      <span 
                        className="text-3xl font-bold"
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

        {/* Statistics - Bottom Position */}
        {settings.show_statistics === 'true' && settings.statistics_position === 'bottom' && (
          <Statistics queues={allQueues} settings={settings} position="bottom" />
        )}

        {/* Running Text at Bottom - 3 Texts Rotation */}
        <RunningText settings={settings} />

      </div>
    </div>
  )
}

export default AppKPP
