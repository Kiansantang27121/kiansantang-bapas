import { useState, useEffect } from 'react'
import axios from 'axios'
import { API_URL } from '../config'
import { 
  Users, Clock, CheckCircle, Activity, TrendingUp, 
  ClipboardList, UserPlus, Bell, Calendar, Phone, ArrowRight, User
} from 'lucide-react'
import { useAuth } from '../context/AuthContext'

export default function PetugasLayananDashboard() {
  const { user } = useAuth()
  const [stats, setStats] = useState(null)
  const [loading, setLoading] = useState(true)
  const [pendingQueues, setPendingQueues] = useState([])
  const [readyToCall, setReadyToCall] = useState([])
  const [pkList, setPkList] = useState([])
  const [selectedQueue, setSelectedQueue] = useState(null)
  const [selectedPK, setSelectedPK] = useState('')
  const [notes, setNotes] = useState('')

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

      const [statsRes, pendingRes, readyRes, pkRes] = await Promise.all([
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
        })
      ])

      console.log('✅ Stats:', statsRes.data)
      console.log('✅ Pending queues:', pendingRes.data.queues?.length || 0, 'items')
      console.log('✅ Ready to call:', readyRes.data.queues?.length || 0, 'items')
      console.log('✅ PK list:', pkRes.data.pks?.length || 0, 'items')

      setStats(statsRes.data)
      setPendingQueues(pendingRes.data.queues || [])
      setReadyToCall(readyRes.data.queues || [])
      setPkList(pkRes.data.pks || [])
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
      await axios.post(
        `${API_URL}/workflow/assign-to-pk`,
        {
          queue_id: queueId,
          pk_id: selectedPK,
          notes: notes
        },
        { headers: { Authorization: `Bearer ${token}` } }
      )

      alert('Berhasil assign ke PK')
      setSelectedQueue(null)
      setSelectedPK('')
      setNotes('')
      fetchAllData()
    } catch (error) {
      console.error('Error assigning to PK:', error)
      alert('Gagal assign ke PK')
    }
  }

  const handleCallQueue = async (workflowId, queueNumber) => {
    const counterNumber = prompt('Masukkan nomor loket:')
    if (!counterNumber) return

    try {
      const token = localStorage.getItem('token')
      const response = await axios.post(
        `${API_URL}/workflow/call-queue`,
        {
          workflow_id: workflowId,
          counter_number: counterNumber
        },
        { headers: { Authorization: `Bearer ${token}` } }
      )

      if (response.data.success) {
        // Trigger voice announcement
        speakQueueNumber(queueNumber, counterNumber)
        alert(`Antrian ${queueNumber} dipanggil ke loket ${counterNumber}`)
        fetchAllData()
      }
    } catch (error) {
      console.error('Error calling queue:', error)
      alert('Gagal memanggil antrian')
    }
  }

  const speakQueueNumber = (queueNumber, counterNumber) => {
    if ('speechSynthesis' in window) {
      const text = `Nomor antrian ${queueNumber}, silakan menuju loket ${counterNumber}`
      const utterance = new SpeechSynthesisUtterance(text)
      utterance.lang = 'id-ID'
      utterance.rate = 0.9
      window.speechSynthesis.speak(utterance)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-emerald-600"></div>
      </div>
    )
  }

  const quickStats = [
    { 
      label: 'Total Antrian Hari Ini', 
      value: stats?.today?.total || 0, 
      icon: Users, 
      color: 'from-emerald-500 to-emerald-600',
      change: '+12%'
    },
    { 
      label: 'Menunggu', 
      value: stats?.today?.waiting || 0, 
      icon: Clock, 
      color: 'from-amber-500 to-amber-600',
      change: '+5%'
    },
    { 
      label: 'Sedang Dilayani', 
      value: stats?.today?.serving || 0, 
      icon: Activity, 
      color: 'from-blue-500 to-blue-600',
      change: '+3%'
    },
    { 
      label: 'Selesai', 
      value: stats?.today?.completed || 0, 
      icon: CheckCircle, 
      color: 'from-green-500 to-green-600',
      change: '+18%'
    }
  ]

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="bg-gradient-to-r from-emerald-600 via-emerald-700 to-teal-700 rounded-2xl shadow-2xl p-8 text-white">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-4xl font-bold mb-2">
              Selamat Datang, {user?.name}! 👋
            </h1>
            <p className="text-emerald-100 text-lg">
              Dashboard Petugas Layanan
            </p>
            <p className="text-emerald-200 text-sm mt-1">
              Kelola antrian dan layanan dengan efisien
            </p>
          </div>
          <div className="hidden md:block">
            <div className="bg-white/10 backdrop-blur-lg rounded-xl p-6 border border-white/20">
              <Users className="w-16 h-16 text-white mb-2" />
              <p className="text-sm font-semibold">Petugas Layanan</p>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {quickStats.map((stat, index) => {
          const Icon = stat.icon
          return (
            <div 
              key={index} 
              className="bg-white rounded-xl shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden"
            >
              <div className={`bg-gradient-to-br ${stat.color} p-6 text-white`}>
                <div className="flex items-center justify-between mb-4">
                  <Icon className="w-10 h-10 opacity-80" />
                  <div className="flex items-center gap-1 text-sm font-semibold text-white/90">
                    <TrendingUp className="w-4 h-4" />
                    {stat.change}
                  </div>
                </div>
                <p className="text-3xl font-bold mb-1">{stat.value}</p>
                <p className="text-sm opacity-90">{stat.label}</p>
              </div>
            </div>
          )
        })}
      </div>

      {/* Main Content */}
      <div className="grid grid-cols-1 gap-6">
        {/* Antrian Perlu Assignment PK */}
        {pendingQueues.length > 0 && (
          <div className="bg-white rounded-xl shadow-lg p-6">
            <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center gap-2">
              <Users className="w-6 h-6 text-orange-600" />
              Antrian Perlu Assignment PK
              <span className="ml-auto bg-orange-500 text-white text-sm font-bold px-3 py-1 rounded-full">
                {pendingQueues.length}
              </span>
            </h2>
            <div className="space-y-4">
              {pendingQueues.map((queue) => (
                <div key={queue.id} className="border-2 border-orange-200 rounded-xl p-5 bg-orange-50 hover:shadow-lg transition-all">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-start gap-4 flex-1">
                      <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center flex-shrink-0">
                        <span className="text-orange-700 font-black text-lg">{queue.queue_number}</span>
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <User className="w-4 h-4 text-gray-600" />
                          <p className="font-bold text-gray-800 text-lg">{queue.client_name}</p>
                        </div>
                        <p className="text-sm text-gray-600 mb-1">
                          <span className="font-semibold">Layanan:</span> {queue.service_name}
                        </p>
                        <p className="text-sm text-gray-600">
                          <span className="font-semibold">Estimasi:</span> ~{queue.estimated_time} menit
                        </p>
                        {queue.pk_name && (
                          <p className="text-sm text-orange-700 mt-2 font-semibold">
                            PK: {queue.pk_name}
                          </p>
                        )}
                      </div>
                    </div>
                    <button
                      onClick={() => setSelectedQueue(queue.id)}
                      className="bg-orange-600 text-white px-5 py-2.5 rounded-lg hover:bg-orange-700 transition-all text-sm font-bold flex items-center gap-2 whitespace-nowrap"
                    >
                      <ArrowRight className="w-4 h-4" />
                      Teruskan ke PK
                    </button>
                  </div>

                  {/* Assignment Modal */}
                  {selectedQueue === queue.id && (
                    <div className="mt-4 p-5 bg-white rounded-xl border-2 border-orange-300 shadow-inner">
                      <h3 className="font-bold text-gray-800 mb-3 text-lg">Pilih PK:</h3>
                      <select
                        value={selectedPK}
                        onChange={(e) => setSelectedPK(e.target.value)}
                        className="w-full p-3 border-2 border-gray-300 rounded-lg mb-3 focus:border-orange-500 focus:outline-none"
                      >
                        <option value="">-- Pilih PK --</option>
                        {pkList.map((pk) => (
                          <option key={pk.id} value={pk.id}>
                            {pk.full_name}
                          </option>
                        ))}
                      </select>
                      <textarea
                        value={notes}
                        onChange={(e) => setNotes(e.target.value)}
                        placeholder="Catatan untuk PK (opsional)"
                        className="w-full p-3 border-2 border-gray-300 rounded-lg mb-3 focus:border-orange-500 focus:outline-none"
                        rows="2"
                      />
                      <div className="flex gap-3">
                        <button
                          onClick={() => handleAssignToPK(queue.id)}
                          className="flex-1 bg-green-600 text-white px-4 py-3 rounded-lg font-bold hover:bg-green-700 transition-all"
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
          </div>
        )}

        {/* Antrian Siap Dipanggil */}
        {readyToCall.length > 0 && (
          <div className="bg-white rounded-xl shadow-lg p-6">
            <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center gap-2">
              <Phone className="w-6 h-6 text-green-600" />
              Antrian Siap Dipanggil
              <span className="ml-auto bg-green-500 text-white text-sm font-bold px-3 py-1 rounded-full">
                {readyToCall.length}
              </span>
            </h2>
            <div className="space-y-4">
              {readyToCall.map((queue) => (
                <div key={queue.id} className="border-2 border-green-200 rounded-xl p-5 bg-green-50 hover:shadow-lg transition-all">
                  <div className="flex items-start justify-between">
                    <div className="flex items-start gap-4 flex-1">
                      <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0">
                        <span className="text-green-700 font-black text-lg">{queue.queue_number}</span>
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <User className="w-4 h-4 text-gray-600" />
                          <p className="font-bold text-gray-800 text-lg">{queue.client_name}</p>
                        </div>
                        <p className="text-sm text-gray-600 mb-1">
                          <span className="font-semibold">Layanan:</span> {queue.service_name}
                        </p>
                        <p className="text-sm text-green-700 font-semibold flex items-center gap-1">
                          <CheckCircle className="w-4 h-4" />
                          Disetujui oleh: {queue.pk_name}
                        </p>
                      </div>
                    </div>
                    <button
                      onClick={() => handleCallQueue(queue.workflow_id, queue.queue_number)}
                      className="bg-green-600 text-white px-5 py-2.5 rounded-lg hover:bg-green-700 transition-all text-sm font-bold flex items-center gap-2 animate-pulse whitespace-nowrap"
                    >
                      <Phone className="w-4 h-4" />
                      Panggil
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Empty State */}
        {pendingQueues.length === 0 && readyToCall.length === 0 && (
          <div className="bg-white rounded-xl shadow-lg p-12 text-center">
            <ClipboardList className="w-20 h-20 text-gray-300 mx-auto mb-4" />
            <h3 className="text-xl font-bold text-gray-400 mb-2">Tidak Ada Antrian</h3>
            <p className="text-gray-500">Semua antrian sudah diproses</p>
          </div>
        )}
      </div>

      {/* Quick Actions */}
      <div className="bg-white rounded-xl shadow-lg p-6">
        <h2 className="text-2xl font-bold text-gray-800 mb-6">Aksi Cepat</h2>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {[
            { label: 'Lihat Semua Antrian', icon: ClipboardList, color: 'from-emerald-500 to-emerald-600' },
            { label: 'Daftar Klien Baru', icon: UserPlus, color: 'from-blue-500 to-blue-600' },
            { label: 'Jadwal Hari Ini', icon: Calendar, color: 'from-purple-500 to-purple-600' },
            { label: 'Laporan Harian', icon: Activity, color: 'from-orange-500 to-orange-600' }
          ].map((action, index) => {
            const Icon = action.icon
            return (
              <button
                key={index}
                className={`bg-gradient-to-br ${action.color} text-white rounded-xl p-6 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1`}
              >
                <Icon className="w-12 h-12 mb-3 mx-auto" />
                <p className="font-semibold text-sm">{action.label}</p>
              </button>
            )
          })}
        </div>
      </div>
    </div>
  )
}
