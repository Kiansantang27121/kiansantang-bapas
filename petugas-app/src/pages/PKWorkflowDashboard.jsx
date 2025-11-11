import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'
import { 
  UserCheck, Users, Clock, CheckCircle, AlertCircle,
  ThumbsUp, ThumbsDown, ArrowRight, FileText, DoorOpen, Bell, ClipboardList
} from 'lucide-react'
import { useAuth } from '../context/AuthContext'
import { API_URL } from '../config'

export default function PKWorkflowDashboard() {
  const { user } = useAuth()
  const navigate = useNavigate()
  const [assignments, setAssignments] = useState([])
  const [calledToRoom, setCalledToRoom] = useState([]) // Antrian yang dipanggil masuk ruangan
  const [readyToCallClient, setReadyToCallClient] = useState([]) // Antrian yang siap panggil klien
  const [loading, setLoading] = useState(true)
  const [selectedQueue, setSelectedQueue] = useState(null)
  const [action, setAction] = useState('')
  const [reason, setReason] = useState('')
  const [transferToPK, setTransferToPK] = useState('')
  const [pkList, setPkList] = useState([])

  useEffect(() => {
    fetchData()
    const interval = setInterval(fetchData, 5000) // Refresh every 5 seconds
    return () => clearInterval(interval)
  }, [])

  const fetchData = async () => {
    try {
      const token = localStorage.getItem('token')
      
      if (!token) {
        console.error('❌ No token found')
        setLoading(false)
        return
      }

      const headers = { Authorization: `Bearer ${token}` }

      console.log('🔄 Fetching PK assignments...')

      const [assignmentsRes, pkRes] = await Promise.all([
        axios.get(`${API_URL}/workflow/my-assignments`, { headers }).catch(e => {
          console.error('❌ Assignments API failed:', e.response?.data || e.message)
          return { data: { assignments: [] } }
        }),
        axios.get(`${API_URL}/pk`, { headers }).catch(e => {
          console.warn('⚠️ PK list API failed:', e.message)
          return { data: { pks: [] } }
        })
      ])

      console.log('✅ Assignments:', assignmentsRes.data.assignments?.length || 0, 'items')
      console.log('✅ In Process:', assignmentsRes.data.in_process?.length || 0, 'items')
      console.log('✅ PK list:', pkRes.data.pks?.length || 0, 'items')

      // Assignments = antrian yang perlu aksi PK (approve/reject/transfer)
      const needAction = assignmentsRes.data.assignments || []
      
      // In Process = antrian yang sudah dalam proses
      const inProcess = assignmentsRes.data.in_process || []
      
      // Split in_process:
      // 1. Sudah dipanggil masuk ruangan tapi PK belum masuk
      // 2. PK sudah masuk ruangan, siap panggil klien (handled by petugas now)
      const called = inProcess.filter(a => a.pk_called_at && !a.pk_entered_at)
      const readyForClient = inProcess.filter(a => a.pk_entered_at && !a.client_called_at)
      
      setAssignments(needAction)  // Antrian yang perlu aksi
      setCalledToRoom(called)
      setReadyToCallClient(readyForClient)
      setPkList(pkRes.data.pks || [])
      setLoading(false)
    } catch (error) {
      console.error('❌ Error fetching data:', error)
      setLoading(false)
    }
  }

  const handlePKAction = async (queueId, actionType) => {
    try {
      const token = localStorage.getItem('token')
      const payload = {
        queue_id: queueId,
        action: actionType
      }

      if (actionType === 'reject' && reason) {
        payload.reason = reason
      }

      if (actionType === 'transfer' && transferToPK) {
        payload.transfer_to_pk_id = transferToPK
        payload.reason = reason
      }

      const response = await axios.post(
        `${API_URL}/workflow/pk-action`,
        payload,
        { headers: { Authorization: `Bearer ${token}` } }
      )

      if (response.data.success) {
        alert(`Antrian berhasil ${actionType === 'approve' ? 'disetujui' : actionType === 'reject' ? 'ditolak' : 'dialihkan'}`)
        setSelectedQueue(null)
        setAction('')
        setReason('')
        setTransferToPK('')
        fetchData()
      }
    } catch (error) {
      console.error('Error processing PK action:', error)
      alert('Gagal memproses aksi')
    }
  }

  const handleEnterRoom = async (queueId) => {
    try {
      const token = localStorage.getItem('token')
      const response = await axios.post(
        `${API_URL}/workflow/pk-enter-room`,
        { queue_id: queueId },
        { headers: { Authorization: `Bearer ${token}` } }
      )

      if (response.data.success) {
        alert(`Anda telah masuk ke ${response.data.room_number ? 'Ruang ' + response.data.room_number : 'ruangan'}. Silakan panggil klien.`)
        fetchData()
      }
    } catch (error) {
      console.error('Error entering room:', error)
      alert(error.response?.data?.message || 'Gagal konfirmasi masuk ruangan')
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

  const getRoomName = (roomNumber) => {
    return roomNumber ? `Ruang Pelayanan ${roomNumber}` : 'Ruangan'
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
        const token = localStorage.getItem('token')
        const response = await axios.get(`${API_URL}/settings`, {
          headers: { Authorization: `Bearer ${token}` }
        })
        const settings = response.data
        
        const enabled = settings.voice_enabled === 'true'
        const rate = parseFloat(settings.voice_rate || 0.9)
        const pitch = parseFloat(settings.voice_pitch || 1.0)
        const volume = parseFloat(settings.voice_volume || 1.0)
        const repeatCount = parseInt(settings.voice_repeat || 2)
        const delayMs = parseInt(settings.voice_delay || 2000)
        
        if (!enabled) return
        
        for (let i = 0; i < repeatCount; i++) {
          const utterance = new SpeechSynthesisUtterance(message)
          utterance.lang = 'id-ID'
          utterance.rate = rate
          utterance.pitch = pitch
          utterance.volume = volume
          
          window.speechSynthesis.speak(utterance)
          
          if (i < repeatCount - 1) {
            await new Promise(resolve => setTimeout(resolve, delayMs))
          }
        }
      } catch (error) {
        console.error('Error with voice settings:', error)
        // Fallback to default
        const utterance = new SpeechSynthesisUtterance(message)
        utterance.lang = 'id-ID'
        utterance.rate = 0.9
        window.speechSynthesis.speak(utterance)
      }
    }
  }

  const handleCallClient = async (queueId) => {
    try {
      const token = localStorage.getItem('token')
      const response = await axios.post(
        `${API_URL}/workflow/pk-call-client`,
        { queue_id: queueId },
        { headers: { Authorization: `Bearer ${token}` } }
      )

      if (response.data.success) {
        const callData = response.data.call_data
        
        // Voice announcement with professional template
        const greeting = getGreeting()
        const roomName = getRoomName(callData.room_number)
        const formattedClientName = formatNameForSpeech(callData.client_name)
        
        const messageWithGreeting = `${greeting}, diberitahukan kepada nomor urut ${callData.queue_number}, klien atas nama ${formattedClientName}, harap segera memasuki ${roomName}. Pembimbing Kemasyarakatan ${callData.pk_name} siap melayani Anda. Sekali lagi, diberitahukan kepada nomor urut ${callData.queue_number}, klien atas nama ${formattedClientName}, harap segera memasuki ${roomName}. Pembimbing Kemasyarakatan ${callData.pk_name} siap melayani Anda. Atas perhatiannya diucapkan terima kasih.`
        
        speakMessage(messageWithGreeting)
        
        alert(`Klien ${callData.client_name} (${callData.queue_number}) dipanggil ke ${roomName}`)
        fetchData()
      }
    } catch (error) {
      console.error('Error calling client:', error)
      alert(error.response?.data?.message || 'Gagal memanggil klien')
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
    <div className="space-y-8">
      {/* Header */}
      <div className="bg-gradient-to-r from-teal-600 via-teal-700 to-cyan-700 rounded-2xl shadow-2xl p-8 text-white">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-4xl font-bold mb-2">
              Selamat Datang, {user?.name}! 👋
            </h1>
            <p className="text-teal-100 text-lg">
              Dashboard Pembimbing Kemasyarakatan (PK)
            </p>
            <p className="text-teal-200 text-sm mt-1">
              Kelola antrian Bimbingan Wajib Lapor
            </p>
          </div>
          <div className="hidden md:block">
            <div className="bg-white/10 backdrop-blur-lg rounded-xl p-6 border border-white/20">
              <UserCheck className="w-16 h-16 text-white mb-2" />
              <p className="text-sm font-semibold">PK</p>
            </div>
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white rounded-xl shadow-lg p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm">Total Assignment</p>
              <p className="text-3xl font-bold text-teal-600">{assignments.length}</p>
            </div>
            <Users className="w-12 h-12 text-teal-600 opacity-50" />
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-lg p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm">Menunggu Aksi</p>
              <p className="text-3xl font-bold text-orange-600">
                {assignments.filter(a => a.status === 'waiting').length}
              </p>
            </div>
            <Clock className="w-12 h-12 text-orange-600 opacity-50" />
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-lg p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm">Dipanggil Masuk</p>
              <p className="text-3xl font-bold text-blue-600">
                {calledToRoom.length}
              </p>
            </div>
            <Bell className="w-12 h-12 text-blue-600 opacity-50" />
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-lg p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm">Disetujui</p>
              <p className="text-3xl font-bold text-green-600">
                {assignments.filter(a => a.status === 'approved').length}
              </p>
            </div>
            <CheckCircle className="w-12 h-12 text-green-600 opacity-50" />
          </div>
        </div>
      </div>

      {/* Notifikasi Panggilan Ruangan */}
      {calledToRoom.length > 0 && (
        <div className="bg-gradient-to-r from-blue-500 to-blue-600 rounded-xl shadow-2xl p-6 text-white animate-pulse">
          <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
            <Bell className="w-6 h-6" />
            🔔 Anda Dipanggil Masuk Ruangan!
          </h2>
          <div className="space-y-3">
            {calledToRoom.map((queue) => (
              <div key={queue.id} className="bg-white/20 backdrop-blur-lg rounded-lg p-4 flex items-center justify-between">
                <div>
                  <p className="font-bold text-lg">Antrian: {queue.queue_number}</p>
                  <p className="text-sm">Klien: {queue.client_name}</p>
                  {queue.pk_name && (
                    <p className="text-sm">
                      PK: {queue.pk_name}
                      {queue.pk_jabatan && <span className="ml-2 bg-white/30 px-2 py-0.5 rounded text-xs">{queue.pk_jabatan}</span>}
                    </p>
                  )}
                  <p className="text-sm">Ruangan: {queue.room_number ? `Ruang Pelayanan ${queue.room_number}` : 'Belum ditentukan'}</p>
                </div>
                <button
                  onClick={() => handleEnterRoom(queue.id)}
                  className="bg-white text-blue-600 px-6 py-3 rounded-lg font-bold hover:bg-blue-50 transition-all flex items-center gap-2"
                >
                  <DoorOpen className="w-5 h-5" />
                  Konfirmasi Masuk
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Siap Panggil Klien */}
      {readyToCallClient.length > 0 && (
        <div className="bg-gradient-to-r from-green-500 to-green-600 rounded-xl shadow-2xl p-6 text-white">
          <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
            <Bell className="w-6 h-6" />
            📢 Siap Panggil Klien
          </h2>
          <div className="space-y-3">
            {readyToCallClient.map((queue) => (
              <div key={queue.id} className="bg-white/20 backdrop-blur-lg rounded-lg p-4">
                <div className="flex items-center justify-between mb-3">
                  <div>
                    <p className="font-bold text-lg">Antrian: {queue.queue_number}</p>
                    <p className="text-sm">Klien: {queue.client_name}</p>
                    <p className="text-sm">Ruangan: {queue.room_number ? `Ruang Pelayanan ${queue.room_number}` : 'Belum ditentukan'}</p>
                  </div>
                  <button
                    onClick={() => handleCallClient(queue.id)}
                    className="bg-white text-green-600 px-6 py-3 rounded-lg font-bold hover:bg-green-50 transition-all flex items-center gap-2"
                  >
                    <Bell className="w-5 h-5" />
                    Panggil Klien
                  </button>
                </div>
                <button
                  onClick={() => navigate('/service-process')}
                  className="w-full bg-teal-700 text-white px-6 py-3 rounded-lg font-bold hover:bg-teal-800 transition-all flex items-center justify-center gap-2"
                >
                  <ClipboardList className="w-5 h-5" />
                  Mulai Layanan (SOP)
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Assignments List */}
      <div className="bg-white rounded-xl shadow-lg p-6">
        <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center gap-2">
          <FileText className="w-6 h-6 text-teal-600" />
          Antrian Saya
          <span className="ml-auto bg-teal-500 text-white text-sm font-bold px-3 py-1 rounded-full">
            {assignments.length}
          </span>
        </h2>

        {assignments.length === 0 ? (
          <div className="text-center py-12">
            <AlertCircle className="w-20 h-20 text-gray-300 mx-auto mb-4" />
            <h3 className="text-xl font-bold text-gray-400 mb-2">Tidak Ada Assignment</h3>
            <p className="text-gray-500">Belum ada antrian yang ditugaskan kepada Anda</p>
          </div>
        ) : (
          <div className="space-y-4">
            {assignments.map((assignment) => (
              <div key={assignment.id} className="border-2 border-teal-200 rounded-xl p-5 bg-teal-50 hover:shadow-lg transition-all">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-start gap-4 flex-1">
                    <div className="w-16 h-16 bg-teal-100 rounded-full flex items-center justify-center flex-shrink-0">
                      <span className="text-teal-700 font-black text-lg">{assignment.queue_number}</span>
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <UserCheck className="w-4 h-4 text-gray-600" />
                        <p className="font-bold text-gray-800 text-lg">{assignment.client_name}</p>
                      </div>
                      {assignment.pk_name && (
                        <div className="mb-2 flex items-center gap-2">
                          <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded font-semibold">
                            PK: {assignment.pk_name}
                          </span>
                          {assignment.pk_jabatan && (
                            <span className="text-xs bg-purple-100 text-purple-800 px-2 py-1 rounded font-semibold">
                              {assignment.pk_jabatan}
                            </span>
                          )}
                        </div>
                      )}
                      <p className="text-sm text-gray-600 mb-1">
                        <span className="font-semibold">Layanan:</span> {assignment.service_name}
                      </p>
                      <p className="text-sm text-gray-600 mb-1">
                        <span className="font-semibold">Estimasi:</span> ~{assignment.estimated_time} menit
                      </p>
                      {assignment.assigned_by_name && (
                        <p className="text-sm text-teal-700 mt-2">
                          <span className="font-semibold">Ditugaskan oleh:</span> {assignment.assigned_by_name}
                        </p>
                      )}
                    </div>
                  </div>
                  
                  {selectedQueue !== assignment.id && (
                    <div className="flex gap-2">
                      <button
                        onClick={() => {
                          setSelectedQueue(assignment.id)
                          setAction('approve')
                        }}
                        className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-all text-sm font-bold flex items-center gap-2"
                      >
                        <ThumbsUp className="w-4 h-4" />
                        Terima
                      </button>
                      <button
                        onClick={() => {
                          setSelectedQueue(assignment.id)
                          setAction('reject')
                        }}
                        className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-all text-sm font-bold flex items-center gap-2"
                      >
                        <ThumbsDown className="w-4 h-4" />
                        Tolak
                      </button>
                      <button
                        onClick={() => {
                          setSelectedQueue(assignment.id)
                          setAction('transfer')
                        }}
                        className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-all text-sm font-bold flex items-center gap-2"
                      >
                        <ArrowRight className="w-4 h-4" />
                        Alihkan
                      </button>
                    </div>
                  )}
                </div>

                {/* Action Modal */}
                {selectedQueue === assignment.id && (
                  <div className="mt-4 p-5 bg-white rounded-xl border-2 border-teal-300 shadow-inner">
                    {action === 'approve' && (
                      <>
                        <h3 className="font-bold text-gray-800 mb-3 text-lg">Setujui Antrian</h3>
                        <p className="text-gray-600 mb-4">
                          Anda akan menyetujui antrian <strong>{assignment.queue_number}</strong> untuk <strong>{assignment.client_name}</strong>
                        </p>
                        <div className="flex gap-3">
                          <button
                            onClick={() => handlePKAction(assignment.id, 'approve')}
                            className="flex-1 bg-green-600 text-white px-4 py-3 rounded-lg font-bold hover:bg-green-700 transition-all"
                          >
                            ✓ Konfirmasi Terima
                          </button>
                          <button
                            onClick={() => {
                              setSelectedQueue(null)
                              setAction('')
                            }}
                            className="flex-1 bg-gray-400 text-white px-4 py-3 rounded-lg font-bold hover:bg-gray-500 transition-all"
                          >
                            Batal
                          </button>
                        </div>
                      </>
                    )}

                    {action === 'reject' && (
                      <>
                        <h3 className="font-bold text-gray-800 mb-3 text-lg">Tolak Antrian</h3>
                        <textarea
                          value={reason}
                          onChange={(e) => setReason(e.target.value)}
                          placeholder="Alasan penolakan (opsional)"
                          className="w-full p-3 border-2 border-gray-300 rounded-lg mb-3 focus:border-red-500 focus:outline-none"
                          rows="3"
                        />
                        <div className="flex gap-3">
                          <button
                            onClick={() => handlePKAction(assignment.id, 'reject')}
                            className="flex-1 bg-red-600 text-white px-4 py-3 rounded-lg font-bold hover:bg-red-700 transition-all"
                          >
                            ✓ Konfirmasi Tolak
                          </button>
                          <button
                            onClick={() => {
                              setSelectedQueue(null)
                              setAction('')
                              setReason('')
                            }}
                            className="flex-1 bg-gray-400 text-white px-4 py-3 rounded-lg font-bold hover:bg-gray-500 transition-all"
                          >
                            Batal
                          </button>
                        </div>
                      </>
                    )}

                    {action === 'transfer' && (
                      <>
                        <h3 className="font-bold text-gray-800 mb-3 text-lg">Alihkan ke PK Lain</h3>
                        <select
                          value={transferToPK}
                          onChange={(e) => setTransferToPK(e.target.value)}
                          className="w-full p-3 border-2 border-gray-300 rounded-lg mb-3 focus:border-blue-500 focus:outline-none"
                        >
                          <option value="">-- Pilih PK --</option>
                          {pkList.filter(pk => pk.id !== user?.id).map((pk) => (
                            <option key={pk.id} value={pk.id}>
                              {pk.name}
                            </option>
                          ))}
                        </select>
                        <textarea
                          value={reason}
                          onChange={(e) => setReason(e.target.value)}
                          placeholder="Alasan pengalihan (opsional)"
                          className="w-full p-3 border-2 border-gray-300 rounded-lg mb-3 focus:border-blue-500 focus:outline-none"
                          rows="2"
                        />
                        <div className="flex gap-3">
                          <button
                            onClick={() => handlePKAction(assignment.id, 'transfer')}
                            disabled={!transferToPK}
                            className="flex-1 bg-blue-600 text-white px-4 py-3 rounded-lg font-bold hover:bg-blue-700 transition-all disabled:bg-gray-300 disabled:cursor-not-allowed"
                          >
                            ✓ Konfirmasi Alihkan
                          </button>
                          <button
                            onClick={() => {
                              setSelectedQueue(null)
                              setAction('')
                              setReason('')
                              setTransferToPK('')
                            }}
                            className="flex-1 bg-gray-400 text-white px-4 py-3 rounded-lg font-bold hover:bg-gray-500 transition-all"
                          >
                            Batal
                          </button>
                        </div>
                      </>
                    )}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
