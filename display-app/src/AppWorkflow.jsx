import { useState, useEffect } from 'react'
import axios from 'axios'
import { io } from 'socket.io-client'
import { API_URL, SOCKET_URL } from './config'
import { Clock, Phone, Users, CheckCircle, Bell, DoorOpen, UserCheck } from 'lucide-react'

function AppWorkflow() {
  const [currentCall, setCurrentCall] = useState(null)
  const [activities, setActivities] = useState([])
  const [settings, setSettings] = useState({})
  const [currentTime, setCurrentTime] = useState(new Date())
  const [stats, setStats] = useState({
    waiting: 0,
    pkCalled: 0,
    clientCalled: 0,
    completed: 0
  })

  useEffect(() => {
    fetchSettings()
    fetchActivities()
    fetchStats()

    const socket = io(SOCKET_URL)
    
    // Listen to all workflow events
    socket.on('pk:called', (data) => {
      console.log('PK Called:', data)
      handlePKCalled(data)
    })
    
    socket.on('pk:entered', (data) => {
      console.log('PK Entered:', data)
      handlePKEntered(data)
    })
    
    socket.on('client:called', (data) => {
      console.log('Client Called:', data)
      handleClientCalled(data)
    })
    
    socket.on('queue:completed', (data) => {
      console.log('Queue Completed:', data)
      fetchActivities()
      fetchStats()
    })

    const interval = setInterval(() => {
      setCurrentTime(new Date())
      fetchActivities()
      fetchStats()
    }, 5000)

    return () => {
      socket.disconnect()
      clearInterval(interval)
    }
  }, [])

  const fetchSettings = async () => {
    try {
      const response = await axios.get(`${API_URL}/settings`)
      setSettings(response.data)
    } catch (error) {
      console.error('Error fetching settings:', error)
    }
  }

  const fetchActivities = async () => {
    try {
      const response = await axios.get(`${API_URL}/workflow/activities`)
      setActivities(response.data.activities || [])
    } catch (error) {
      console.error('Error fetching activities:', error)
    }
  }

  const fetchStats = async () => {
    try {
      const response = await axios.get(`${API_URL}/workflow/stats`)
      setStats(response.data.stats || stats)
    } catch (error) {
      console.error('Error fetching stats:', error)
    }
  }

  const getGreeting = () => {
    const hour = new Date().getHours()
    if (hour >= 8 && hour < 12) return 'Selamat pagi'
    else if (hour >= 12 && hour < 16) return 'Selamat siang'
    else if (hour >= 16 && hour < 18) return 'Selamat sore'
    else return 'Selamat malam'
  }

  const getRoomName = (roomNumber) => {
    return roomNumber ? `Ruang Pelayanan ${roomNumber}` : 'Ruangan'
  }

  const speakMessage = async (message) => {
    if ('speechSynthesis' in window) {
      try {
        const enabled = settings.voice_enabled === 'true'
        const rate = parseFloat(settings.voice_rate || 0.9)
        const pitch = parseFloat(settings.voice_pitch || 1.0)
        const volume = parseFloat(settings.voice_volume || 1.0)
        const repeatCount = parseInt(settings.voice_repeat || 2)
        const delayMs = parseInt(settings.voice_delay || 2000)
        
        if (!enabled) return
        
        // Cancel any ongoing speech
        window.speechSynthesis.cancel()
        
        for (let i = 0; i < repeatCount; i++) {
          const utterance = new SpeechSynthesisUtterance(message)
          utterance.lang = 'id-ID'
          utterance.rate = rate
          utterance.pitch = pitch
          utterance.volume = volume
          
          window.speechSynthesis.speak(utterance)
          
          if (i < repeatCount - 1) {
            await new Promise(resolve => {
              utterance.onend = () => setTimeout(resolve, delayMs)
            })
          }
        }
      } catch (error) {
        console.error('Error with voice:', error)
      }
    }
  }

  const handlePKCalled = (data) => {
    const greeting = getGreeting()
    const roomName = getRoomName(data.room_number)
    
    const message = `${greeting}, diberitahukan kepada Pembimbing Kemasyarakatan ${data.pk_name}, ditunggu kehadirannya di ${roomName} karena ada klien wajib lapor atas nama ${data.client_name}. Sekali lagi, diberitahukan kepada Pembimbing Kemasyarakatan ${data.pk_name}, ditunggu kehadirannya di ${roomName} karena ada klien wajib lapor atas nama ${data.client_name}. Atas perhatiannya diucapkan terima kasih.`
    
    setCurrentCall({
      type: 'pk',
      queue_number: data.queue_number,
      name: data.pk_name,
      room: roomName,
      client_name: data.client_name,
      timestamp: new Date()
    })
    
    speakMessage(message)
    fetchActivities()
    fetchStats()
    
    // Clear after 10 seconds
    setTimeout(() => setCurrentCall(null), 10000)
  }

  const handlePKEntered = (data) => {
    fetchActivities()
    fetchStats()
  }

  const handleClientCalled = (data) => {
    const greeting = getGreeting()
    const roomName = getRoomName(data.room_number)
    
    const message = `${greeting}, diberitahukan kepada nomor urut ${data.queue_number}, klien atas nama ${data.client_name}, harap segera memasuki ${roomName}. Pembimbing Kemasyarakatan ${data.pk_name} siap melayani Anda. Sekali lagi, diberitahukan kepada nomor urut ${data.queue_number}, klien atas nama ${data.client_name}, harap segera memasuki ${roomName}. Pembimbing Kemasyarakatan ${data.pk_name} siap melayani Anda. Atas perhatiannya diucapkan terima kasih.`
    
    setCurrentCall({
      type: 'client',
      queue_number: data.queue_number,
      name: data.client_name,
      room: roomName,
      pk_name: data.pk_name,
      timestamp: new Date()
    })
    
    speakMessage(message)
    fetchActivities()
    fetchStats()
    
    // Clear after 10 seconds
    setTimeout(() => setCurrentCall(null), 10000)
  }

  const getActivityIcon = (type) => {
    switch(type) {
      case 'pk_called': return <Bell className="w-5 h-5 text-blue-400" />
      case 'pk_entered': return <DoorOpen className="w-5 h-5 text-green-400" />
      case 'client_called': return <Phone className="w-5 h-5 text-purple-400" />
      case 'completed': return <CheckCircle className="w-5 h-5 text-green-400" />
      default: return <Users className="w-5 h-5 text-gray-400" />
    }
  }

  const getActivityText = (activity) => {
    switch(activity.type) {
      case 'pk_called':
        return `PK ${activity.pk_name} dipanggil ke ${getRoomName(activity.room_number)}`
      case 'pk_entered':
        return `PK ${activity.pk_name} masuk ${getRoomName(activity.room_number)}`
      case 'client_called':
        return `Klien ${activity.client_name} (${activity.queue_number}) dipanggil ke ${getRoomName(activity.room_number)}`
      case 'completed':
        return `Layanan ${activity.queue_number} selesai`
      default:
        return activity.description || 'Aktivitas'
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-teal-600 via-cyan-700 to-blue-800 text-white">
      {/* Header */}
      <header className="bg-white bg-opacity-10 backdrop-blur-md shadow-lg">
        <div className="container mx-auto px-8 py-6">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-4xl font-bold">{settings.office_name || 'BAPAS Bandung'}</h1>
              <p className="text-blue-100 mt-1">Sistem Antrian Bimbingan Wajib Lapor</p>
            </div>
            <div className="text-right">
              <div className="flex items-center justify-end text-3xl font-bold mb-1">
                <Clock className="w-8 h-8 mr-2" />
                {currentTime.toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
              </div>
              <div className="text-blue-100">
                {currentTime.toLocaleDateString('id-ID', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
              </div>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-8 py-8">
        {/* Stats */}
        <div className="grid grid-cols-4 gap-6 mb-8">
          <div className="bg-white bg-opacity-10 backdrop-blur-md rounded-xl p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-blue-100">Menunggu</p>
                <p className="text-4xl font-bold">{stats.waiting}</p>
              </div>
              <Users className="w-12 h-12 text-blue-300 opacity-50" />
            </div>
          </div>

          <div className="bg-white bg-opacity-10 backdrop-blur-md rounded-xl p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-blue-100">PK Dipanggil</p>
                <p className="text-4xl font-bold">{stats.pkCalled}</p>
              </div>
              <Bell className="w-12 h-12 text-yellow-300 opacity-50" />
            </div>
          </div>

          <div className="bg-white bg-opacity-10 backdrop-blur-md rounded-xl p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-blue-100">Klien Dipanggil</p>
                <p className="text-4xl font-bold">{stats.clientCalled}</p>
              </div>
              <Phone className="w-12 h-12 text-purple-300 opacity-50" />
            </div>
          </div>

          <div className="bg-white bg-opacity-10 backdrop-blur-md rounded-xl p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-blue-100">Selesai Hari Ini</p>
                <p className="text-4xl font-bold">{stats.completed}</p>
              </div>
              <CheckCircle className="w-12 h-12 text-green-300 opacity-50" />
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Current Call - Left Side */}
          <div className="bg-white bg-opacity-10 backdrop-blur-md rounded-3xl shadow-2xl p-12">
            <div className="flex items-center mb-8">
              <Phone className="w-12 h-12 mr-4 animate-pulse" />
              <h2 className="text-3xl font-bold">Panggilan Saat Ini</h2>
            </div>

            {currentCall ? (
              <div className="text-center animate-pulse">
                <div className="mb-6">
                  {currentCall.type === 'pk' ? (
                    <UserCheck className="w-24 h-24 mx-auto text-yellow-300" />
                  ) : (
                    <Phone className="w-24 h-24 mx-auto text-purple-300" />
                  )}
                </div>
                
                <div className="bg-white bg-opacity-20 rounded-2xl p-8 mb-6">
                  <p className="text-6xl font-black mb-4">{currentCall.queue_number}</p>
                  <p className="text-3xl font-bold mb-2">{currentCall.name}</p>
                  {currentCall.type === 'pk' && (
                    <p className="text-xl text-blue-100">Klien: {currentCall.client_name}</p>
                  )}
                  {currentCall.type === 'client' && (
                    <p className="text-xl text-blue-100">PK: {currentCall.pk_name}</p>
                  )}
                </div>

                <div className="bg-gradient-to-r from-yellow-500 to-orange-500 rounded-xl p-6">
                  <p className="text-2xl font-bold">
                    {currentCall.type === 'pk' ? '📢 Silakan Menuju' : '🚪 Silakan Masuk'}
                  </p>
                  <p className="text-4xl font-black mt-2">{currentCall.room}</p>
                </div>
              </div>
            ) : (
              <div className="text-center py-20">
                <Phone className="w-32 h-32 mx-auto text-white opacity-20 mb-6" />
                <p className="text-3xl font-bold text-white opacity-50">Tidak Ada Panggilan</p>
                <p className="text-xl text-blue-100 mt-2">Menunggu panggilan berikutnya...</p>
              </div>
            )}
          </div>

          {/* Activity Log - Right Side */}
          <div className="bg-white bg-opacity-10 backdrop-blur-md rounded-3xl shadow-2xl p-8">
            <div className="flex items-center mb-6">
              <CheckCircle className="w-10 h-10 mr-3" />
              <h2 className="text-2xl font-bold">Aktivitas Workflow</h2>
            </div>

            <div className="space-y-3 max-h-[600px] overflow-y-auto">
              {activities.length === 0 ? (
                <div className="text-center py-12">
                  <Users className="w-20 h-20 mx-auto text-white opacity-20 mb-4" />
                  <p className="text-xl text-white opacity-50">Belum ada aktivitas</p>
                </div>
              ) : (
                activities.map((activity, index) => (
                  <div
                    key={index}
                    className="bg-white bg-opacity-10 backdrop-blur-sm rounded-xl p-4 hover:bg-opacity-20 transition-all"
                  >
                    <div className="flex items-start gap-3">
                      <div className="mt-1">{getActivityIcon(activity.type)}</div>
                      <div className="flex-1">
                        <p className="font-semibold text-lg">{getActivityText(activity)}</p>
                        <p className="text-sm text-blue-100 mt-1">
                          {new Date(activity.timestamp).toLocaleTimeString('id-ID')}
                        </p>
                      </div>
                      {activity.status && (
                        <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                          activity.status === 'completed' ? 'bg-green-500' :
                          activity.status === 'in_progress' ? 'bg-yellow-500' :
                          'bg-blue-500'
                        }`}>
                          {activity.status}
                        </span>
                      )}
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Running Text */}
      <div className="fixed bottom-0 left-0 right-0 bg-gradient-to-r from-yellow-500 to-orange-500 py-4 overflow-hidden">
        <div className="animate-marquee whitespace-nowrap">
          <span className="text-2xl font-bold mx-8">
            {settings.running_text || 'Selamat Datang di BAPAS Bandung - Sistem Antrian Bimbingan Wajib Lapor'}
          </span>
        </div>
      </div>
    </div>
  )
}

export default AppWorkflow
