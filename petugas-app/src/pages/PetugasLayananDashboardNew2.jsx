import { useState, useEffect } from 'react'
import axios from 'axios'
import { API_URL } from '../config'
import { 
  Users, Clock, CheckCircle, Activity, Phone, ArrowRight, User, Home, Bell
} from 'lucide-react'
import { useAuth } from '../context/AuthContext'

export default function PetugasLayananDashboardNew2() {
  const { user } = useAuth()
  const [loading, setLoading] = useState(true)
  const [services, setServices] = useState([])
  const [queuesByService, setQueuesByService] = useState({})
  const [readyToCallClient, setReadyToCallClient] = useState([]) // PK sudah masuk, siap panggil klien
  const [rooms, setRooms] = useState([])
  const [selectedQueue, setSelectedQueue] = useState(null)
  const [selectedRoom, setSelectedRoom] = useState('')
  const [notes, setNotes] = useState('')

  useEffect(() => {
    fetchAllData()
    const interval = setInterval(fetchAllData, 5000)
    return () => clearInterval(interval)
  }, [])

  const fetchAllData = async () => {
    try {
      const token = localStorage.getItem('token')
      
      if (!token) {
        console.error('❌ No token found')
        setLoading(false)
        return
      }

      const headers = { Authorization: `Bearer ${token}` }

      // Fetch services, pending queues, PK entered queues, and rooms
      const [servicesRes, queuesRes, pkEnteredRes, roomsRes] = await Promise.all([
        axios.get(`${API_URL}/services`).catch(e => ({ data: [] })),
        axios.get(`${API_URL}/workflow/pending-queues`, { headers }).catch(e => ({ data: { queues: [] } })),
        axios.get(`${API_URL}/workflow/pk-entered-queues`, { headers }).catch(e => ({ data: { queues: [] } })),
        axios.get(`${API_URL}/workflow/available-rooms`, { headers }).catch(e => ({ data: { rooms: [] } }))
      ])

      setServices(servicesRes.data)
      setRooms(roomsRes.data.rooms || [])

      // PK entered queues (client auto-called)
      setReadyToCallClient(pkEnteredRes.data.queues || [])

      // Group pending queues by service
      const allQueues = queuesRes.data.queues || []
      const grouped = {}
      allQueues.forEach(queue => {
        const serviceId = queue.service_id
        if (!grouped[serviceId]) {
          grouped[serviceId] = []
        }
        grouped[serviceId].push(queue)
      })

      setQueuesByService(grouped)
      setLoading(false)
    } catch (error) {
      console.error('❌ Error fetching data:', error)
      setLoading(false)
    }
  }

  const handleForwardToPK = async (queueId) => {
    if (!selectedRoom) {
      alert('Pilih ruangan terlebih dahulu')
      return
    }

    try {
      const token = localStorage.getItem('token')
      const response = await axios.post(
        `${API_URL}/workflow/forward-to-pk`,
        {
          queue_id: queueId,
          room_number: selectedRoom
        },
        { headers: { Authorization: `Bearer ${token}` } }
      )

      if (response.data.success) {
        const callData = response.data.call_data
        
        // Voice announcement
        const greeting = getGreeting()
        const roomName = getRoomName(callData.room_number)
        
        const formattedClientName = formatNameForSpeech(callData.client_name)
        const message = `${greeting}, diberitahukan kepada Pembimbing Kemasyarakatan ${callData.pk_name}, ditunggu kehadirannya di ${roomName} karena ada klien wajib lapor atas nama ${formattedClientName}. Sekali lagi, diberitahukan kepada Pembimbing Kemasyarakatan ${callData.pk_name}, ditunggu kehadirannya di ${roomName} karena ada klien wajib lapor atas nama ${formattedClientName}. Atas perhatiannya diucapkan terima kasih.`
        
        speakMessage(message)
        
        alert(`✅ Antrian berhasil diteruskan ke PK ${callData.pk_name} di ${roomName}`)
        setSelectedQueue(null)
        setSelectedRoom('')
        setNotes('')
        fetchAllData()
      }
    } catch (error) {
      console.error('Error forwarding to PK:', error)
      alert(error.response?.data?.message || 'Gagal meneruskan ke PK')
    }
  }

  const handleCallClient = async (queue) => {
    // Petugas calls client after PK entered room
    try {
      const token = localStorage.getItem('token')
      
      const response = await axios.post(
        `${API_URL}/workflow/call-client`,
        { queue_id: queue.id },
        { headers: { Authorization: `Bearer ${token}` } }
      )

      if (response.data.success) {
        // Voice announcement
        const greeting = getGreeting()
        const roomName = getRoomName(queue.room_number)
        const formattedClientName = formatNameForSpeech(queue.client_name)
        const message = `${greeting}, nomor antrian ${queue.queue_number}, atas nama ${formattedClientName}, silakan menuju ${roomName}. Pembimbing Kemasyarakatan ${queue.pk_name} sudah menunggu di ${roomName}. Sekali lagi, nomor antrian ${queue.queue_number}, atas nama ${formattedClientName}, silakan menuju ${roomName}. Terima kasih.`
        
        speakMessage(message)
        
        alert(`✅ Klien ${queue.client_name} berhasil dipanggil ke ${roomName}`)
        fetchAllData()
      }
    } catch (error) {
      console.error('Error calling client:', error)
      alert(error.response?.data?.message || 'Gagal memanggil klien')
    }
  }

  const handleCallQueue = async (queueId, serviceName) => {
    // For non-PK services, just call the queue directly
    try {
      const token = localStorage.getItem('token')
      
      // Simple call - update status to called
      const response = await axios.post(
        `${API_URL}/queue/${queueId}/call`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      )

      if (response.data) {
        const queue = response.data
        
        // Voice announcement
        const greeting = getGreeting()
        const formattedClientName = formatNameForSpeech(queue.client_name)
        const message = `${greeting}, nomor antrian ${queue.queue_number}, layanan ${serviceName}, atas nama ${formattedClientName}, silakan menuju loket pelayanan. Sekali lagi, nomor antrian ${queue.queue_number}, atas nama ${formattedClientName}, silakan menuju loket pelayanan. Terima kasih.`
        
        speakMessage(message)
        
        alert(`✅ Antrian ${queue.queue_number} berhasil dipanggil`)
        fetchAllData()
      }
    } catch (error) {
      console.error('Error calling queue:', error)
      alert(error.response?.data?.message || 'Gagal memanggil antrian')
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
    const room = rooms.find(r => r.room_number === roomNumber)
    return room ? room.room_name : `Ruang ${roomNumber}`
  }

  // Format nama agar dibaca normal, bukan dieja
  const formatNameForSpeech = (name) => {
    if (!name) return name
    
    // Convert to title case (huruf pertama kapital, sisanya kecil)
    return name
      .toLowerCase()
      .split(' ')
      .map(word => {
        // Jangan ubah kata singkat seperti ALS, BIN, BINTI
        if (word === 'als' || word === 'bin' || word === 'binti' || word === 'alm') {
          return word
        }
        // Capitalize first letter
        return word.charAt(0).toUpperCase() + word.slice(1)
      })
      .join(' ')
  }

  const speakMessage = async (message) => {
    if ('speechSynthesis' in window) {
      try {
        const response = await axios.get(`${API_URL}/settings`)
        const settings = response.data
        
        const enabled = settings.voice_enabled === 'true'
        if (!enabled) return
        
        const rate = parseFloat(settings.voice_rate || 0.9)
        const pitch = parseFloat(settings.voice_pitch || 1.0)
        const volume = parseFloat(settings.voice_volume || 1.0)
        const lang = settings.voice_lang || 'id-ID'
        const repeatCount = parseInt(settings.voice_repeat || 2)
        const delayMs = parseInt(settings.voice_delay || 2000)
        
        for (let i = 0; i < repeatCount; i++) {
          const utterance = new SpeechSynthesisUtterance(message)
          utterance.lang = lang
          utterance.rate = rate
          utterance.pitch = pitch
          utterance.volume = volume
          
          window.speechSynthesis.speak(utterance)
          
          if (i < repeatCount - 1) {
            await new Promise(resolve => setTimeout(resolve, delayMs))
          }
        }
      } catch (error) {
        console.error('Error with voice:', error)
      }
    }
  }

  const getServiceWorkflow = (serviceName) => {
    const name = serviceName.toUpperCase()
    if (name.includes('BIMBINGAN WAJIB LAPOR')) return 'pk'
    if (name.includes('PENGHADAPAN')) return 'direct'
    if (name.includes('KUNJUNGAN')) return 'direct'
    if (name.includes('PENGADUAN')) return 'direct'
    return 'direct'
  }

  const getServiceColor = (serviceName) => {
    const name = serviceName.toUpperCase()
    if (name.includes('BIMBINGAN')) return 'blue'
    if (name.includes('PENGHADAPAN')) return 'green'
    if (name.includes('KUNJUNGAN')) return 'purple'
    if (name.includes('PENGADUAN')) return 'red'
    return 'gray'
  }

  const colorClasses = {
    blue: {
      bg: 'bg-blue-50',
      border: 'border-blue-200',
      text: 'text-blue-800',
      badge: 'bg-blue-500',
      button: 'bg-blue-600 hover:bg-blue-700'
    },
    green: {
      bg: 'bg-green-50',
      border: 'border-green-200',
      text: 'text-green-800',
      badge: 'bg-green-500',
      button: 'bg-green-600 hover:bg-green-700'
    },
    purple: {
      bg: 'bg-purple-50',
      border: 'border-purple-200',
      text: 'text-purple-800',
      badge: 'bg-purple-500',
      button: 'bg-purple-600 hover:bg-purple-700'
    },
    red: {
      bg: 'bg-red-50',
      border: 'border-red-200',
      text: 'text-red-800',
      badge: 'bg-red-500',
      button: 'bg-red-600 hover:bg-red-700'
    },
    gray: {
      bg: 'bg-gray-50',
      border: 'border-gray-200',
      text: 'text-gray-800',
      badge: 'bg-gray-500',
      button: 'bg-gray-600 hover:bg-gray-700'
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-teal-600"></div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-teal-600 via-teal-700 to-cyan-700 rounded-2xl shadow-2xl p-8 text-white">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-4xl font-bold mb-2">
              Dashboard Petugas Layanan 👋
            </h1>
            <p className="text-teal-100 text-lg">
              Selamat Datang, {user?.name}!
            </p>
            <p className="text-teal-200 text-sm mt-1">
              Kelola antrian berdasarkan jenis layanan
            </p>
          </div>
        </div>
      </div>

      {/* Status: PK Sudah Masuk Ruangan & Klien Sudah Dipanggil Otomatis */}
      {readyToCallClient.length > 0 && (
        <div className="bg-gradient-to-r from-green-500 to-emerald-600 rounded-xl shadow-2xl p-6 text-white">
          <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
            <CheckCircle className="w-6 h-6" />
            ✅ Antrian Sedang Dilayani PK
          </h2>
          <p className="text-green-100 mb-4">PK sudah masuk ruangan dan klien sudah dipanggil otomatis</p>
          <div className="space-y-3">
            {readyToCallClient.map((queue) => (
              <div key={queue.id} className="bg-white/20 backdrop-blur-lg rounded-lg p-4">
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <p className="font-bold text-lg">Antrian: {queue.queue_number}</p>
                    <p className="text-sm">Klien: {queue.client_name}</p>
                    <p className="text-sm">PK: {queue.pk_name} ({queue.pk_jabatan})</p>
                    <p className="text-sm">Ruangan: {queue.room_name || getRoomName(queue.room_number)}</p>
                  </div>
                  <div className="text-center">
                    <div className="bg-white/30 px-4 py-2 rounded-lg">
                      <CheckCircle className="w-8 h-8 mx-auto mb-1" />
                      <p className="text-xs font-bold">Klien Dipanggil</p>
                      <p className="text-xs">(Otomatis)</p>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Service Columns */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {services.map((service) => {
          const queues = queuesByService[service.id] || []
          const workflow = getServiceWorkflow(service.name)
          const color = getServiceColor(service.name)
          const colors = colorClasses[color]

          return (
            <div key={service.id} className="bg-white rounded-xl shadow-lg overflow-hidden">
              {/* Service Header */}
              <div className={`${colors.badge} text-white p-4`}>
                <div className="flex items-center justify-between">
                  <h2 className="font-bold text-lg">{service.name}</h2>
                  <span className="bg-white/20 px-3 py-1 rounded-full text-sm font-bold">
                    {queues.length}
                  </span>
                </div>
                <p className="text-white/80 text-xs mt-1">
                  {workflow === 'pk' ? '→ Diteruskan ke PK' : '→ Panggil Langsung'}
                </p>
              </div>

              {/* Queue List */}
              <div className="p-4 space-y-3 max-h-[600px] overflow-y-auto">
                {queues.length === 0 ? (
                  <div className="text-center py-8 text-gray-400">
                    <Bell className="w-12 h-12 mx-auto mb-2 opacity-50" />
                    <p className="text-sm">Tidak ada antrian</p>
                  </div>
                ) : (
                  queues.map((queue) => (
                    <div key={queue.id} className={`border-2 ${colors.border} rounded-lg p-3 ${colors.bg}`}>
                      {/* Queue Info */}
                      <div className="flex items-start justify-between mb-2">
                        <div className="flex items-center gap-2">
                          <div className={`w-12 h-12 ${colors.badge} rounded-full flex items-center justify-center flex-shrink-0`}>
                            <span className="text-white font-black text-sm">{queue.queue_number}</span>
                          </div>
                          <div>
                            <p className={`font-bold ${colors.text} text-sm`}>{queue.client_name}</p>
                            {queue.pk_name && (
                              <p className="text-xs text-gray-600">
                                PK: {queue.pk_name}
                                {queue.pk_jabatan && (
                                  <span className="ml-1 text-xs bg-gray-200 px-2 py-0.5 rounded">
                                    {queue.pk_jabatan}
                                  </span>
                                )}
                              </p>
                            )}
                            <p className="text-xs text-gray-500">~{queue.estimated_time} menit</p>
                          </div>
                        </div>
                      </div>

                      {/* Action Buttons */}
                      {selectedQueue !== queue.id && (
                        <div className="mt-2">
                          {workflow === 'pk' ? (
                            <button
                              onClick={() => setSelectedQueue(queue.id)}
                              className={`w-full ${colors.button} text-white px-3 py-2 rounded-lg text-xs font-bold flex items-center justify-center gap-1 transition-all`}
                            >
                              <ArrowRight className="w-4 h-4" />
                              Teruskan ke PK
                            </button>
                          ) : (
                            <button
                              onClick={() => handleCallQueue(queue.id, service.name)}
                              className={`w-full ${colors.button} text-white px-3 py-2 rounded-lg text-xs font-bold flex items-center justify-center gap-1 transition-all`}
                            >
                              <Phone className="w-4 h-4" />
                              Panggil Antrian
                            </button>
                          )}
                        </div>
                      )}

                      {/* PK Forward Form */}
                      {selectedQueue === queue.id && workflow === 'pk' && (
                        <div className="mt-3 p-3 bg-white rounded-lg border-2 border-blue-300">
                          <h4 className="font-bold text-xs text-gray-700 mb-2">Pilih Ruangan</h4>
                          <select
                            value={selectedRoom}
                            onChange={(e) => setSelectedRoom(e.target.value)}
                            className="w-full p-2 border-2 border-gray-300 rounded text-xs mb-2"
                          >
                            <option value="">-- Pilih Ruangan --</option>
                            {rooms.filter(r => r.is_available).map((room) => (
                              <option key={room.room_number} value={room.room_number}>
                                {room.room_name || `Ruang ${room.room_number}`}
                              </option>
                            ))}
                          </select>
                          
                          <div className="flex gap-2">
                            <button
                              onClick={() => handleForwardToPK(queue.id)}
                              disabled={!selectedRoom}
                              className="flex-1 bg-gradient-to-r from-blue-600 to-blue-700 text-white px-3 py-2 rounded text-xs font-bold disabled:bg-gray-300"
                            >
                              <Phone className="w-3 h-3 inline mr-1" />
                              Panggil PK
                            </button>
                            <button
                              onClick={() => {
                                setSelectedQueue(null)
                                setSelectedRoom('')
                              }}
                              className="flex-1 bg-gray-400 text-white px-3 py-2 rounded text-xs font-bold"
                            >
                              Batal
                            </button>
                          </div>
                        </div>
                      )}
                    </div>
                  ))
                )}
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
