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
      console.log('✅ PK list:', pkRes.data.pks?.length || 0, 'items')
      console.log('✅ Rooms:', roomsRes.data.rooms?.length || 0, 'items')

      setStats(statsRes.data)
      setPendingQueues(pendingRes.data.queues || [])
      
      // Split ready to call into 2 categories
      const allReady = readyRes.data.queues || []
      const pkReady = allReady.filter(q => !q.pk_called_at) // Belum dipanggil PK
      const clientReady = allReady.filter(q => q.pk_entered_at && !q.client_called_at) // PK sudah masuk, klien belum dipanggil
      
      setReadyToCallPK(pkReady)
      setReadyToCallClient(clientReady)
      
      setPkList(pkRes.data.pks || [])
      setRooms(roomsRes.data.rooms || [])
      setLoading(false)
    } catch (error) {
      console.error('❌ Error fetching data:', error)
      setLoading(false)
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
        
        // Voice announcement
        const message = `${callData.pk_name}, silakan menuju ${getRoomName(callData.room_number)}, untuk antrian nomor ${callData.queue_number}`
        speakMessage(message)
        
        alert(`PK ${callData.pk_name} dipanggil ke ${getRoomName(callData.room_number)}`)
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
        
        // Voice announcement
        const message = `Nomor antrian ${callData.queue_number}, ${callData.client_name}, silakan menuju ${getRoomName(callData.room_number)}`
        speakMessage(message)
        
        alert(`Klien ${callData.client_name} dipanggil ke ${getRoomName(callData.room_number)}`)
        fetchAllData()
      }
    } catch (error) {
      console.error('Error calling client:', error)
      alert(error.response?.data?.message || 'Gagal memanggil klien')
    }
  }

  const speakMessage = (message) => {
    if ('speechSynthesis' in window) {
      const utterance = new SpeechSynthesisUtterance(message)
      utterance.lang = 'id-ID'
      utterance.rate = 0.9
      utterance.pitch = 1
      window.speechSynthesis.speak(utterance)
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
                    <h3 className="font-bold text-gray-800 mb-3">Pilih PK</h3>
                    <select
                      value={selectedPK}
                      onChange={(e) => setSelectedPK(e.target.value)}
                      className="w-full p-3 border-2 border-gray-300 rounded-lg mb-3 focus:border-orange-500 focus:outline-none"
                    >
                      <option value="">-- Pilih PK --</option>
                      {pkList.map((pk) => (
                        <option key={pk.id} value={pk.id}>
                          {pk.name}
                        </option>
                      ))}
                    </select>
                    <textarea
                      value={notes}
                      onChange={(e) => setNotes(e.target.value)}
                      placeholder="Catatan (opsional)"
                      className="w-full p-3 border-2 border-gray-300 rounded-lg mb-3 focus:border-orange-500 focus:outline-none"
                      rows="2"
                    />
                    <div className="flex gap-3">
                      <button
                        onClick={() => handleAssignToPK(queue.id)}
                        disabled={!selectedPK}
                        className="flex-1 bg-orange-600 text-white px-4 py-3 rounded-lg font-bold hover:bg-orange-700 transition-all disabled:bg-gray-300 disabled:cursor-not-allowed"
                      >
                        ✓ Teruskan ke PK
                      </button>
                      <button
                        onClick={() => {
                          setSelectedQueue(null)
                          setSelectedPK('')
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
                      <p className="text-sm text-blue-700 font-semibold mt-2">
                        ✅ Disetujui oleh: {queue.pk_name}
                      </p>
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
