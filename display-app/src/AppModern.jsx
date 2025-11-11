import { useState, useEffect } from 'react'
import axios from 'axios'
import { io } from 'socket.io-client'
import { API_URL, SOCKET_URL } from './config'
import { Clock, Users, CheckCircle, TrendingUp } from 'lucide-react'

function AppModern() {
  const [countersData, setCountersData] = useState([])
  const [waitingQueues, setWaitingQueues] = useState([])
  const [settings, setSettings] = useState({})
  const [currentTime, setCurrentTime] = useState(new Date())
  const [stats, setStats] = useState({ total: 0, waiting: 0, serving: 0, completed: 0 })
  const [operators, setOperators] = useState([])

  useEffect(() => {
    fetchSettings()
    fetchData()

    const socket = io(SOCKET_URL)
    socket.on('queue:new', fetchData)
    socket.on('queue:called', fetchData)
    socket.on('queue:serving', fetchData)
    socket.on('queue:completed', fetchData)
    socket.on('queue:cancelled', fetchData)

    const interval = setInterval(() => {
      setCurrentTime(new Date())
      fetchData()
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

  const fetchData = async () => {
    try {
      const [countersRes, waitingRes, statsRes] = await Promise.all([
        axios.get(`${API_URL}/counters`),
        axios.get(`${API_URL}/queue`, { params: { status: 'waiting' } }),
        axios.get(`${API_URL}/queue/stats/today`)
      ])

      // Get queue data for each counter
      const countersWithQueue = await Promise.all(
        countersRes.data.slice(0, 4).map(async (counter) => {
          try {
            const queueRes = await axios.get(`${API_URL}/queue`, {
              params: { status: 'called' }
            })
            const counterQueue = queueRes.data.find(q => q.counter_number === counter.counter_number)
            return { ...counter, currentQueue: counterQueue }
          } catch (error) {
            return { ...counter, currentQueue: null }
          }
        })
      )

      setCountersData(countersWithQueue)
      setWaitingQueues(waitingRes.data.slice(0, 6))
      setStats(statsRes.data)
      
      // Get operators from counters data
      const activeOperators = countersWithQueue
        .filter(c => c.operator_name)
        .map(c => ({ name: c.operator_name, username: c.operator_username || 'operator' }))
      setOperators(activeOperators.slice(0, 4))
    } catch (error) {
      console.error('Error fetching data:', error)
    }
  }

  const playNotification = () => {
    try {
      const audio = new Audio('/notification.mp3')
      audio.play().catch(e => console.log('Audio play failed:', e))
    } catch (e) {
      console.log('Audio not available')
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 text-white overflow-hidden">
      {/* Header */}
      <header className="bg-gradient-to-r from-blue-600 to-indigo-700 shadow-2xl border-b-4 border-blue-400">
        <div className="container mx-auto px-6 py-4">
          <div className="flex justify-between items-center">
            {/* Logo & Title */}
            <div className="flex items-center space-x-4">
              {settings.logo_url && (
                <img src={settings.logo_url} alt="Logo" className="h-16 w-16 object-contain bg-white rounded-lg p-2" />
              )}
              <div>
                <h1 className="text-3xl font-bold tracking-tight">{settings.office_name || 'BAPAS Bandung'}</h1>
                <p className="text-blue-100 text-sm">{settings.office_address}</p>
              </div>
            </div>

            {/* Clock */}
            <div className="text-right">
              <div className="flex items-center justify-end text-4xl font-bold mb-1">
                <Clock className="w-10 h-10 mr-3" />
                {currentTime.toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
              </div>
              <div className="text-blue-100 text-sm">
                {currentTime.toLocaleDateString('id-ID', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Running Text */}
      <div className="bg-gradient-to-r from-yellow-500 to-orange-500 py-3 overflow-hidden">
        <div className="animate-marquee whitespace-nowrap">
          <span className="text-xl font-semibold text-white mx-4">
            ★ {settings.running_text || 'Selamat datang di BAPAS Bandung'} ★
          </span>
          <span className="text-xl font-semibold text-white mx-4">
            ★ {settings.running_text || 'Selamat datang di BAPAS Bandung'} ★
          </span>
        </div>
      </div>

      <div className="container mx-auto px-6 py-6">
        <div className="grid grid-cols-12 gap-6">
          {/* Left Side - Counters (8 cols) */}
          <div className="col-span-8 space-y-6">
            {/* 4 Loket Grid */}
            <div className="grid grid-cols-2 gap-4">
              {countersData.map((counter) => (
                <div
                  key={counter.id}
                  className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-2xl shadow-2xl border-2 border-blue-500 p-6 transform transition-all hover:scale-105"
                >
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <div className="text-blue-400 text-sm font-semibold mb-1">LOKET</div>
                      <div className="text-5xl font-bold text-white">{counter.counter_number}</div>
                    </div>
                    <div className={`px-3 py-1 rounded-full text-xs font-bold ${counter.is_active ? 'bg-green-500' : 'bg-red-500'}`}>
                      {counter.is_active ? 'AKTIF' : 'NONAKTIF'}
                    </div>
                  </div>

                  {counter.currentQueue ? (
                    <div className="bg-gradient-to-r from-yellow-400 to-orange-500 rounded-xl p-4 animate-pulse">
                      <div className="text-center">
                        <div className="text-xs text-gray-800 font-semibold mb-1">NOMOR ANTRIAN</div>
                        <div className="text-4xl font-bold text-white mb-2">{counter.currentQueue.queue_number}</div>
                        <div className="text-sm text-gray-800 font-semibold">{counter.currentQueue.service_name}</div>
                        <div className="text-xs text-gray-700 mt-1">{counter.currentQueue.client_name}</div>
                      </div>
                    </div>
                  ) : (
                    <div className="bg-slate-700 rounded-xl p-4 text-center">
                      <div className="text-gray-400 text-sm">Tidak ada antrian</div>
                      <div className="text-gray-500 text-xs mt-1">Menunggu panggilan...</div>
                    </div>
                  )}

                  {counter.operator_name && (
                    <div className="mt-3 text-xs text-gray-400 flex items-center">
                      <Users className="w-3 h-3 mr-1" />
                      {counter.operator_name}
                    </div>
                  )}
                </div>
              ))}
            </div>

            {/* Video Section */}
            {settings.video_url && (
              <div className="bg-slate-800 rounded-2xl shadow-2xl border-2 border-blue-500 p-4">
                <video
                  src={settings.video_url}
                  autoPlay
                  loop
                  muted
                  className="w-full h-64 object-cover rounded-xl"
                />
              </div>
            )}
          </div>

          {/* Right Side - Info (4 cols) */}
          <div className="col-span-4 space-y-6">
            {/* Statistics */}
            <div className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-2xl shadow-2xl border-2 border-blue-500 p-6">
              <h3 className="text-xl font-bold mb-4 flex items-center">
                <TrendingUp className="w-6 h-6 mr-2 text-blue-400" />
                Statistik Hari Ini
              </h3>
              <div className="space-y-3">
                <div className="flex justify-between items-center p-3 bg-slate-700 rounded-lg">
                  <span className="text-sm text-gray-300">Total Antrian</span>
                  <span className="text-2xl font-bold text-blue-400">{stats.total}</span>
                </div>
                <div className="flex justify-between items-center p-3 bg-slate-700 rounded-lg">
                  <span className="text-sm text-gray-300">Menunggu</span>
                  <span className="text-2xl font-bold text-yellow-400">{stats.waiting}</span>
                </div>
                <div className="flex justify-between items-center p-3 bg-slate-700 rounded-lg">
                  <span className="text-sm text-gray-300">Dilayani</span>
                  <span className="text-2xl font-bold text-indigo-400">{stats.serving}</span>
                </div>
                <div className="flex justify-between items-center p-3 bg-slate-700 rounded-lg">
                  <span className="text-sm text-gray-300">Selesai</span>
                  <span className="text-2xl font-bold text-green-400">{stats.completed}</span>
                </div>
              </div>
            </div>

            {/* Waiting Queue */}
            <div className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-2xl shadow-2xl border-2 border-blue-500 p-6">
              <h3 className="text-xl font-bold mb-4">Antrian Menunggu</h3>
              <div className="space-y-2 max-h-64 overflow-y-auto">
                {waitingQueues.length > 0 ? (
                  waitingQueues.map((queue, index) => (
                    <div
                      key={queue.id}
                      className="bg-slate-700 rounded-lg p-3 flex justify-between items-center hover:bg-slate-600 transition-colors"
                    >
                      <div className="flex items-center space-x-3">
                        <div className="bg-blue-500 text-white rounded-full w-8 h-8 flex items-center justify-center text-sm font-bold">
                          {index + 1}
                        </div>
                        <div>
                          <div className="font-bold text-sm">{queue.queue_number}</div>
                          <div className="text-xs text-gray-400">{queue.service_name}</div>
                        </div>
                      </div>
                      <div className="text-xs text-gray-400">
                        {new Date(queue.created_at).toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })}
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-8 text-gray-400">
                    <CheckCircle className="w-12 h-12 mx-auto mb-2 opacity-50" />
                    <div className="text-sm">Tidak ada antrian</div>
                  </div>
                )}
              </div>
            </div>

            {/* Petugas Bertugas */}
            <div className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-2xl shadow-2xl border-2 border-blue-500 p-6">
              <h3 className="text-xl font-bold mb-4 flex items-center">
                <Users className="w-6 h-6 mr-2 text-blue-400" />
                Petugas Bertugas
              </h3>
              <div className="space-y-2">
                {operators.map((operator) => (
                  <div key={operator.id} className="bg-slate-700 rounded-lg p-3 flex items-center space-x-3">
                    <div className="bg-blue-500 text-white rounded-full w-10 h-10 flex items-center justify-center font-bold">
                      {operator.name.charAt(0)}
                    </div>
                    <div>
                      <div className="font-semibold text-sm">{operator.name}</div>
                      <div className="text-xs text-gray-400">{operator.username}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-slate-900 border-t-2 border-blue-500 py-3 mt-6">
        <div className="container mx-auto px-6 text-center">
          <p className="text-sm text-gray-400">
            <strong>Jam Operasional:</strong> {settings.working_hours || '08:00 - 16:00'} | 
            <strong className="ml-4">Telepon:</strong> {settings.office_phone || '-'}
          </p>
        </div>
      </footer>
    </div>
  )
}

export default AppModern
