import { useState, useEffect } from 'react'
import axios from 'axios'
import { API_URL } from '../config'
import { 
  Users, Clock, CheckCircle, Activity, DoorOpen, 
  ClipboardList, UserPlus, Bell, Phone, ArrowRight, User, Home
} from 'lucide-react'
import { useAuth } from '../context/AuthContext'

export default function PetugasLayananDashboard() {
  const { user } = useAuth()
  const [stats, setStats] = useState(null)
  const [loading, setLoading] = useState(true)
  const [pendingQueues, setPendingQueues] = useState([])
  const [readyToCallPK, setReadyToCallPK] = useState([]) // Antrian siap panggil PK
  const [readyToCallClient, setReadyToCallClient] = useState([]) // Antrian siap panggil klien
  const [pkList, setPkList] = useState([])
  const [rooms, setRooms] = useState([])
  const [selectedQueue, setSelectedQueue] = useState(null)
  const [selectedPK, setSelectedPK] = useState('')
  const [selectedRoom, setSelectedRoom] = useState('')
  const [notes, setNotes] = useState('')
  const [callType, setCallType] = useState('') // 'pk' or 'client'

  useEffect(() => {
    fetchAllData()
    const interval = setInterval(fetchAllData, 5000) // Refresh every 5 seconds
    return () => clearInterval(interval)
  }, [])

  const fetchAllData = async () => {
    try {
      const token = localStorage.getItem('token')
      
      if (!token) {
        console.error('❌ No token found. Please login first.')
        setLoading(false)
        return
      }

      const headers = { Authorization: `Bearer ${token}` }

      console.log('🔄 Fetching data from API...')
      console.log('📍 API URL:', API_URL)

      const [statsRes, pendingRes, readyRes, pkRes, roomsRes] = await Promise.all([
        axios.get(`${API_URL}/dashboard/stats`).catch(e => {
          console.warn('⚠️ Stats API failed:', e.message)
          return { data: { today: { total: 0, waiting: 0, serving: 0, completed: 0 } } }
        }),
        axios.get(`${API_URL}/workflow/pending-queues`, { headers }).catch(e => {
          console.error('❌ Pending queues API failed:', e.response?.data || e.message)
          return { data: { queues: [] } }
        }),
        axios.get(`${API_URL}/workflow/ready-to-call`, { headers }).catch(e => {
          console.warn('⚠️ Ready to call API failed:', e.message)
          return { data: { queues: [] } }
        }),
        axios.get(`${API_URL}/pk`, { headers }).catch(e => {
          console.warn('⚠️ PK list API failed:', e.message)
          return { data: { pks: [] } }
        }),
        axios.get(`${API_URL}/workflow/available-rooms`, { headers }).catch(e => {
          console.warn('⚠️ Rooms API failed:', e.message)
          return { data: { rooms: [] } }
        })
      ])

      console.log('✅ Stats:', statsRes.data)
      console.log('✅ Pending queues:', pendingRes.data.queues?.length || 0, 'items')
      console.log('✅ Ready to call:', readyRes.data.queues?.length || 0, 'items')
      console.log('✅ PK list:', pkRes.data.pk_users?.length || pkRes.data.pks?.length || 0, 'items')
      console.log('✅ Rooms:', roomsRes.data.rooms?.length || 0, 'items')

      setStats(statsRes.data)
      setPendingQueues(pendingRes.data.queues || [])
      
      // Split ready to call into 2 categories
      const allReady = readyRes.data.queues || []
      const pkReady = allReady.filter(q => !q.pk_called_at) // Belum dipanggil PK
      const clientReady = allReady.filter(q => q.pk_entered_at && !q.client_called_at) // PK sudah masuk, klien belum dipanggil
      
      setReadyToCallPK(pkReady)
      setReadyToCallClient(clientReady)
      
      // Use pk_users for workflow (has user IDs), fallback to pks
      setPkList(pkRes.data.pk_users || pkRes.data.pks || [])
      setRooms(roomsRes.data.rooms || [])
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
        
        // Voice announcement with greeting
        const greeting = getGreeting()
        const roomName = getRoomName(callData.room_number)
        
        const messageWithGreeting = `${greeting}, diberitahukan kepada Pembimbing Kemasyarakatan ${callData.pk_name}, ditunggu kehadirannya di ${roomName} karena ada klien wajib lapor atas nama ${callData.client_name}. Sekali lagi, diberitahukan kepada Pembimbing Kemasyarakatan ${callData.pk_name}, ditunggu kehadirannya di ${roomName} karena ada klien wajib lapor atas nama ${callData.client_name}. Atas perhatiannya diucapkan terima kasih.`
        
        speakMessage(messageWithGreeting)
        
        alert(`✅ Antrian berhasil diteruskan ke PK ${callData.pk_name} di ${roomName}${callData.auto_assigned ? ' (Auto-assigned berdasarkan jabatan)' : ''}`)
        setSelectedQueue(null)
        setSelectedRoom('')
        fetchAllData()
      }
    } catch (error) {
      console.error('Error forwarding to PK:', error)
      alert(error.response?.data?.message || 'Gagal meneruskan ke PK')
    }
  }

  const handleAssignToPK = async (queueId) => {
    if (!selectedPK) {
      alert('Pilih PK terlebih dahulu')
      return
    }

    try {
      const token = localStorage.getItem('token')
      const response = await axios.post(
        `${API_URL}/workflow/assign-to-pk`,
        {
          queue_id: queueId,
          pk_id: selectedPK,
          notes: notes
        },
        { headers: { Authorization: `Bearer ${token}` } }
      )

      if (response.data.success) {
        alert('Berhasil assign ke PK')
        setSelectedQueue(null)
        setSelectedPK('')
        setNotes('')
        fetchAllData()
      }
    } catch (error) {
      console.error('Error assigning to PK:', error)
      alert('Gagal assign ke PK')
    }
  }

  const handleCallPK = async (queueId) => {
    if (!selectedRoom) {
      alert('Pilih ruangan terlebih dahulu')
      return
    }

    try {
      const token = localStorage.getItem('token')
      const response = await axios.post(
        `${API_URL}/workflow/call-pk`,
        {
          queue_id: queueId,
          room_number: selectedRoom
        },
        { headers: { Authorization: `Bearer ${token}` } }
      )

      if (response.data.success) {
        const callData = response.data.call_data
        
        // Voice announcement with greeting and professional template
        const greeting = getGreeting()
        const roomName = getRoomName(callData.room_number)
        
        // First announcement with greeting
        const messageWithGreeting = `${greeting}, diberitahukan kepada Pembimbing Kemasyarakatan ${callData.pk_name}, ditunggu kehadirannya di ${roomName} karena ada klien wajib lapor atas nama ${callData.client_name}. Sekali lagi, diberitahukan kepada Pembimbing Kemasyarakatan ${callData.pk_name}, ditunggu kehadirannya di ${roomName} karena ada klien wajib lapor atas nama ${callData.client_name}. Atas perhatiannya diucapkan terima kasih.`
        
        speakMessage(messageWithGreeting)
        
        alert(`PK ${callData.pk_name} dipanggil ke ${roomName}`)
        setSelectedQueue(null)
        setSelectedRoom('')
        setCallType('')
        fetchAllData()
      }
    } catch (error) {
      console.error('Error calling PK:', error)
      alert(error.response?.data?.message || 'Gagal memanggil PK')
    }
  }

  const handleCallClient = async (queueId) => {
    try {
      const token = localStorage.getItem('token')
      const response = await axios.post(
        `${API_URL}/workflow/call-client`,
        { queue_id: queueId },
        { headers: { Authorization: `Bearer ${token}` } }
      )

      if (response.data.success) {
        const callData = response.data.call_data
        
        // Voice announcement with greeting and professional template
        const greeting = getGreeting()
        const roomName = getRoomName(callData.room_number)
        
        const messageWithGreeting = `${greeting}, diberitahukan kepada nomor urut ${callData.queue_number}, klien atas nama ${callData.client_name}, harap segera memasuki ${roomName}. Pembimbing Kemasyarakatan ${callData.pk_name} siap melayani Anda. Sekali lagi, diberitahukan kepada nomor urut ${callData.queue_number}, klien atas nama ${callData.client_name}, harap segera memasuki ${roomName}. Pembimbing Kemasyarakatan ${callData.pk_name} siap melayani Anda. Atas perhatiannya diucapkan terima kasih.`
        
        speakMessage(messageWithGreeting)
        
        alert(`Klien ${callData.client_name} dipanggil ke ${roomName}`)
        fetchAllData()
      }
    } catch (error) {
      console.error('Error calling client:', error)
      alert(error.response?.data?.message || 'Gagal memanggil klien')
    }
  }

  const getGreeting = () => {
    const hour = new Date().getHours()
    if (hour >= 8 && hour < 12) {
      return 'Selamat pagi'
    } else if (hour >= 12 && hour < 16) {
      return 'Selamat siang'
    } else if (hour >= 16 && hour < 18) {
      return 'Selamat sore'
    } else {
      return 'Selamat malam'
    }
  }

  const speakMessage = async (message, repeat = 2, delay = 2000) => {
    if ('speechSynthesis' in window) {
      // Get voice settings from API
      try {
        const response = await axios.get(`${API_URL}/settings`)
        const settings = response.data
        
        const enabled = settings.voice_enabled === 'true'
        const rate = parseFloat(settings.voice_rate || 0.9)
        const pitch = parseFloat(settings.voice_pitch || 1.0)
        const volume = parseFloat(settings.voice_volume || 1.0)
        const lang = settings.voice_lang || 'id-ID'
        const repeatCount = parseInt(settings.voice_repeat || 2)
        const delayMs = parseInt(settings.voice_delay || 2000)
        
        if (!enabled) {
          console.log('Voice announcement disabled in settings')
          return
        }
        
        // Speak multiple times with delay
        for (let i = 0; i < repeatCount; i++) {
          const utterance = new SpeechSynthesisUtterance(message)
          utterance.lang = lang
          utterance.rate = rate
          utterance.pitch = pitch
          utterance.volume = volume
          
          window.speechSynthesis.speak(utterance)
          
          // Wait before next repeat
          if (i < repeatCount - 1) {
            await new Promise(resolve => setTimeout(resolve, delayMs))
          }
        }
      } catch (error) {
        console.error('Error getting voice settings:', error)
        // Fallback to default settings
        const utterance = new SpeechSynthesisUtterance(message)
        utterance.lang = 'id-ID'
        utterance.rate = 0.9
        utterance.pitch = 1
        window.speechSynthesis.speak(utterance)
      }
    }
  }

  const getRoomName = (roomNumber) => {
    const room = rooms.find(r => r.room_number === roomNumber)
    return room ? room.room_name : `Ruang ${roomNumber}`
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-teal-600"></div>
      </div>
    )
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="bg-gradient-to-r from-teal-600 via-teal-700 to-cyan-700 rounded-2xl shadow-2xl p-8 text-white">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-4xl font-bold mb-2">
              Selamat Datang, {user?.name}! 👋
            </h1>
            <p className="text-teal-100 text-lg">
              Dashboard Petugas Layanan - Sistem Ruang Pelayanan Multi-PK
            </p>
            <p className="text-teal-200 text-sm mt-1">
              Kelola antrian dan layanan dengan efisien
            </p>
          </div>
          <div className="hidden md:block">
            <div className="bg-white/10 backdrop-blur-lg rounded-xl p-6 border border-white/20">
              <UserPlus className="w-16 h-16 text-white mb-2" />
              <p className="text-sm font-semibold">Petugas Layanan</p>
            </div>
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white rounded-xl shadow-lg p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm">Perlu Assignment</p>
              <p className="text-3xl font-bold text-orange-600">{pendingQueues.length}</p>
            </div>
            <ClipboardList className="w-12 h-12 text-orange-600 opacity-50" />
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-lg p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm">Panggil PK</p>
              <p className="text-3xl font-bold text-blue-600">{readyToCallPK.length}</p>
            </div>
            <Phone className="w-12 h-12 text-blue-600 opacity-50" />
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-lg p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm">Panggil Klien</p>
              <p className="text-3xl font-bold text-green-600">{readyToCallClient.length}</p>
            </div>
            <User className="w-12 h-12 text-green-600 opacity-50" />
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-lg p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm">Ruang Tersedia</p>
              <p className="text-3xl font-bold text-purple-600">{rooms.length}</p>
            </div>
            <Home className="w-12 h-12 text-purple-600 opacity-50" />
          </div>
        </div>
      </div>

      {/* Antrian Perlu Assignment PK */}
      <div className="bg-white rounded-xl shadow-lg p-6">
        <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center gap-2">
          <ClipboardList className="w-6 h-6 text-orange-600" />
          Antrian Perlu Assignment PK
          <span className="ml-auto bg-orange-500 text-white text-sm font-bold px-3 py-1 rounded-full">
            {pendingQueues.length}
          </span>
        </h2>

        {pendingQueues.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            Tidak ada antrian yang perlu di-assign
          </div>
        ) : (
          <div className="space-y-4">
            {pendingQueues.map((queue) => (
              <div key={queue.id} className="border-2 border-orange-200 rounded-xl p-5 bg-orange-50">
                <div className="flex items-start justify-between">
                  <div className="flex items-start gap-4 flex-1">
                    <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center flex-shrink-0">
                      <span className="text-orange-700 font-black text-lg">{queue.queue_number}</span>
                    </div>
                    <div className="flex-1">
                      <p className="font-bold text-gray-800 text-lg">{queue.client_name}</p>
                      <p className="text-sm text-gray-600">Layanan: {queue.service_name}</p>
                      <p className="text-sm text-gray-600">Estimasi: ~{queue.estimated_time} menit</p>
                    </div>
                  </div>
                  
                  {selectedQueue !== queue.id && (
                    <button
                      onClick={() => setSelectedQueue(queue.id)}
                      className="bg-orange-600 text-white px-4 py-2 rounded-lg hover:bg-orange-700 transition-all text-sm font-bold flex items-center gap-2"
                    >
                      <ArrowRight className="w-4 h-4" />
                      Teruskan ke PK
                    </button>
                  )}
                </div>

                {selectedQueue === queue.id && (
                  <div className="mt-4 p-5 bg-white rounded-xl border-2 border-orange-300">
                    {/* Info PK yang akan di-assign */}
                    {queue.pk_name && (
                      <div className="mb-4 p-4 bg-blue-50 border-2 border-blue-200 rounded-lg">
                        <div className="flex items-center gap-2 mb-2">
                          <User className="w-5 h-5 text-blue-600" />
                          <h3 className="font-bold text-blue-800">PK yang akan dipanggil:</h3>
                        </div>
                        <p className="text-blue-900 font-semibold text-lg">
                          {queue.pk_name}
                          {queue.pk_jabatan && (
                            <span className="ml-2 text-sm bg-blue-200 text-blue-800 px-3 py-1 rounded-full">
                              {queue.pk_jabatan}
                            </span>
                          )}
                        </p>
                        <p className="text-blue-700 text-sm mt-1">
                          ✓ Otomatis berdasarkan PK klien yang dipilih saat mendaftar
                        </p>
                      </div>
                    )}

                    {!queue.pk_name && (
                      <div className="mb-4 p-4 bg-yellow-50 border-2 border-yellow-200 rounded-lg">
                        <div className="flex items-center gap-2 mb-2">
                          <User className="w-5 h-5 text-yellow-600" />
                          <h3 className="font-bold text-yellow-800">PK akan di-assign otomatis</h3>
                        </div>
                        <p className="text-yellow-700 text-sm">
                          Sistem akan mencari PK yang sesuai berdasarkan jabatan PK klien
                        </p>
                      </div>
                    )}

                    <div className="mb-4">
                      <h3 className="font-bold text-gray-800 mb-2">Pilih Ruangan</h3>
                      <select
                        value={selectedRoom}
                        onChange={(e) => setSelectedRoom(e.target.value)}
                        className="w-full p-3 border-2 border-gray-300 rounded-lg focus:border-orange-500 focus:outline-none"
                      >
                        <option value="">-- Pilih Ruangan --</option>
                        {rooms.filter(r => r.is_available).map((room) => (
                          <option key={room.room_number} value={room.room_number}>
                            {room.room_name || `Ruang ${room.room_number}`}
                          </option>
                        ))}
                      </select>
                    </div>

                    <textarea
                      value={notes}
                      onChange={(e) => setNotes(e.target.value)}
                      placeholder="Catatan (opsional)"
                      className="w-full p-3 border-2 border-gray-300 rounded-lg mb-3 focus:border-orange-500 focus:outline-none"
                      rows="2"
                    />
                    
                    <div className="flex gap-3">
                      <button
                        onClick={() => handleForwardToPK(queue.id)}
                        disabled={!selectedRoom}
                        className="flex-1 bg-gradient-to-r from-orange-600 to-red-600 text-white px-4 py-3 rounded-lg font-bold hover:from-orange-700 hover:to-red-700 transition-all disabled:bg-gray-300 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                      >
                        <Phone className="w-5 h-5" />
                        Meneruskan & Panggil PK
                      </button>
                      <button
                        onClick={() => {
                          setSelectedQueue(null)
                          setSelectedPK('')
                          setSelectedRoom('')
                          setNotes('')
                        }}
                        className="flex-1 bg-gray-400 text-white px-4 py-3 rounded-lg font-bold hover:bg-gray-500 transition-all"
                      >
                        Batal
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Panggilan 1: PK Masuk Ruangan */}
      <div className="bg-white rounded-xl shadow-lg p-6">
        <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center gap-2">
          <Phone className="w-6 h-6 text-blue-600" />
          Panggilan 1: PK Masuk Ruangan
          <span className="ml-auto bg-blue-500 text-white text-sm font-bold px-3 py-1 rounded-full">
            {readyToCallPK.length}
          </span>
        </h2>

        {readyToCallPK.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            Tidak ada PK yang perlu dipanggil
          </div>
        ) : (
          <div className="space-y-4">
            {readyToCallPK.map((queue) => (
              <div key={queue.id} className="border-2 border-blue-200 rounded-xl p-5 bg-blue-50">
                <div className="flex items-start justify-between">
                  <div className="flex items-start gap-4 flex-1">
                    <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                      <span className="text-blue-700 font-black text-lg">{queue.queue_number}</span>
                    </div>
                    <div className="flex-1">
                      <p className="font-bold text-gray-800 text-lg">PK: {queue.pk_name}</p>
                      <p className="text-sm text-gray-600">Klien: {queue.client_name}</p>
                      <p className="text-sm text-gray-600">Layanan: {queue.service_name}</p>
                      {queue.workflow_action === 'approve' ? (
                        <p className="text-sm text-green-700 font-semibold mt-2">
                          ✅ Disetujui oleh: {queue.pk_name}
                        </p>
                      ) : (
                        <p className="text-sm text-orange-600 font-semibold mt-2">
                          ⏳ Menunggu verifikasi dari: {queue.pk_name}
                        </p>
                      )}
                    </div>
                  </div>
                  
                  {selectedQueue !== queue.id && (
                    <button
                      onClick={() => {
                        setSelectedQueue(queue.id)
                        setCallType('pk')
                      }}
                      className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-all text-sm font-bold flex items-center gap-2 animate-pulse"
                    >
                      <Phone className="w-4 h-4" />
                      Panggil PK
                    </button>
                  )}
                </div>

                {selectedQueue === queue.id && callType === 'pk' && (
                  <div className="mt-4 p-5 bg-white rounded-xl border-2 border-blue-300">
                    <h3 className="font-bold text-gray-800 mb-3">Pilih Ruangan</h3>
                    <select
                      value={selectedRoom}
                      onChange={(e) => setSelectedRoom(e.target.value)}
                      className="w-full p-3 border-2 border-gray-300 rounded-lg mb-3 focus:border-blue-500 focus:outline-none"
                    >
                      <option value="">-- Pilih Ruangan --</option>
                      {rooms.map((room) => (
                        <option key={room.id} value={room.room_number}>
                          {room.room_name} {room.is_available ? '✅' : '❌'}
                        </option>
                      ))}
                    </select>
                    <div className="flex gap-3">
                      <button
                        onClick={() => handleCallPK(queue.id)}
                        disabled={!selectedRoom}
                        className="flex-1 bg-blue-600 text-white px-4 py-3 rounded-lg font-bold hover:bg-blue-700 transition-all disabled:bg-gray-300 disabled:cursor-not-allowed"
                      >
                        📢 Panggil PK Masuk Ruangan
                      </button>
                      <button
                        onClick={() => {
                          setSelectedQueue(null)
                          setSelectedRoom('')
                          setCallType('')
                        }}
                        className="flex-1 bg-gray-400 text-white px-4 py-3 rounded-lg font-bold hover:bg-gray-500 transition-all"
                      >
                        Batal
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Panggilan 2: Klien Masuk Ruangan */}
      <div className="bg-white rounded-xl shadow-lg p-6">
        <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center gap-2">
          <User className="w-6 h-6 text-green-600" />
          Panggilan 2: Klien Masuk Ruangan
          <span className="ml-auto bg-green-500 text-white text-sm font-bold px-3 py-1 rounded-full">
            {readyToCallClient.length}
          </span>
        </h2>

        {readyToCallClient.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            Tidak ada klien yang perlu dipanggil (PK belum masuk ruangan)
          </div>
        ) : (
          <div className="space-y-4">
            {readyToCallClient.map((queue) => (
              <div key={queue.id} className="border-2 border-green-200 rounded-xl p-5 bg-green-50">
                <div className="flex items-start justify-between">
                  <div className="flex items-start gap-4 flex-1">
                    <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0">
                      <span className="text-green-700 font-black text-lg">{queue.queue_number}</span>
                    </div>
                    <div className="flex-1">
                      <p className="font-bold text-gray-800 text-lg">Klien: {queue.client_name}</p>
                      <p className="text-sm text-gray-600">PK: {queue.pk_name}</p>
                      <p className="text-sm text-gray-600">Ruangan: {getRoomName(queue.room_number)}</p>
                      <p className="text-sm text-green-700 font-semibold mt-2">
                        ✅ PK sudah berada di ruangan
                      </p>
                    </div>
                  </div>
                  
                  <button
                    onClick={() => handleCallClient(queue.id)}
                    className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-all text-sm font-bold flex items-center gap-2 animate-pulse"
                  >
                    <User className="w-4 h-4" />
                    Panggil Klien
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
