import { useState, useEffect } from 'react'
import axios from 'axios'
import { io } from 'socket.io-client'
import { API_URL, SOCKET_URL } from './config'
import { Clock, Phone } from 'lucide-react'

function App() {
  const [currentQueue, setCurrentQueue] = useState(null)
  const [waitingQueues, setWaitingQueues] = useState([])
  const [settings, setSettings] = useState({})
  const [currentTime, setCurrentTime] = useState(new Date())

  useEffect(() => {
    fetchSettings()
    fetchQueues()

    const socket = io(SOCKET_URL)
    socket.on('queue:new', fetchQueues)
    socket.on('queue:called', (data) => {
      setCurrentQueue(data)
      fetchQueues()
      playNotification()
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
      setSettings(response.data)
    } catch (error) {
      console.error('Error fetching settings:', error)
    }
  }

  const fetchQueues = async () => {
    try {
      const [calledRes, waitingRes] = await Promise.all([
        axios.get(`${API_URL}/queue`, { params: { status: 'called' } }),
        axios.get(`${API_URL}/queue`, { params: { status: 'waiting' } })
      ])

      if (calledRes.data.length > 0) {
        setCurrentQueue(calledRes.data[0])
      }
      setWaitingQueues(waitingRes.data.slice(0, 10))
    } catch (error) {
      console.error('Error fetching queues:', error)
    }
  }

  const playNotification = () => {
    // Play sound notification (optional)
    try {
      const audio = new Audio('/notification.mp3')
      audio.play().catch(e => console.log('Audio play failed:', e))
    } catch (e) {
      console.log('Audio not available')
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-600 to-indigo-800 text-white">
      {/* Header */}
      <header className="bg-white bg-opacity-10 backdrop-blur-md shadow-lg">
        <div className="container mx-auto px-8 py-6">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-4xl font-bold">{settings.office_name || 'BAPAS Bandung'}</h1>
              <p className="text-blue-100 mt-1">{settings.office_address}</p>
            </div>
            <div className="text-right">
              <div className="flex items-center justify-end text-3xl font-bold mb-1">
                <Clock className="w-8 h-8 mr-2" />
                {currentTime.toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
              </div>
              <div className="text-blue-100">{currentTime.toLocaleDateString('id-ID', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</div>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-8 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Current Queue - Left Side */}
          <div className="bg-white bg-opacity-10 backdrop-blur-md rounded-3xl shadow-2xl p-12">
            <div className="flex items-center mb-8">
              <Phone className="w-12 h-12 mr-4 animate-pulse" />
              <h2 className="text-4xl font-bold">Antrian Dipanggil</h2>
            </div>

            {currentQueue ? (
              <div className="text-center">
                <div className="bg-gradient-to-r from-yellow-400 to-orange-500 rounded-2xl p-12 mb-8 shadow-xl animate-pulse">
                  <div className="text-8xl font-bold text-white mb-4">{currentQueue.queue_number}</div>
                  <div className="text-3xl font-semibold text-white">Loket {currentQueue.counter_number}</div>
                </div>

                <div className="bg-white bg-opacity-20 rounded-xl p-6">
                  <div className="text-2xl font-semibold mb-2">{currentQueue.service_name}</div>
                  <div className="text-xl text-blue-100">{currentQueue.client_name}</div>
                </div>
              </div>
            ) : (
              <div className="text-center py-20">
                <div className="text-6xl mb-4">⏳</div>
                <div className="text-3xl font-semibold text-blue-100">Tidak ada antrian dipanggil</div>
              </div>
            )}
          </div>

          {/* Waiting Queue - Right Side */}
          <div className="bg-white bg-opacity-10 backdrop-blur-md rounded-3xl shadow-2xl p-12">
            <h2 className="text-4xl font-bold mb-8">Antrian Menunggu</h2>

            <div className="space-y-4">
              {waitingQueues.length > 0 ? (
                waitingQueues.map((queue, index) => (
                  <div
                    key={queue.id}
                    className="bg-white bg-opacity-20 rounded-xl p-6 flex justify-between items-center hover:bg-opacity-30 transition-all"
                  >
                    <div className="flex items-center">
                      <div className="bg-blue-500 text-white rounded-full w-12 h-12 flex items-center justify-center text-xl font-bold mr-4">
                        {index + 1}
                      </div>
                      <div>
                        <div className="text-2xl font-bold">{queue.queue_number}</div>
                        <div className="text-lg text-blue-100">{queue.service_name}</div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-xl font-semibold">{queue.client_name}</div>
                      <div className="text-sm text-blue-100">
                        {new Date(queue.created_at).toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })}
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-20">
                  <div className="text-6xl mb-4">✅</div>
                  <div className="text-2xl font-semibold text-blue-100">Tidak ada antrian menunggu</div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Footer Info */}
        <div className="mt-12 bg-white bg-opacity-10 backdrop-blur-md rounded-2xl p-6 text-center">
          <p className="text-xl">
            <strong>Jam Operasional:</strong> {settings.working_hours || '08:00 - 16:00'} | 
            <strong className="ml-4">Telepon:</strong> {settings.office_phone || '-'}
          </p>
        </div>
      </div>
    </div>
  )
}

export default App
