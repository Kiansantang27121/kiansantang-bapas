import { useState, useEffect } from 'react'
import axios from 'axios'
import { io } from 'socket.io-client'
import { API_URL, SOCKET_URL } from '../config'
import { Phone, CheckCircle, XCircle, Play, Square, Trash2, AlertTriangle } from 'lucide-react'

export default function QueueManagement() {
  const [queues, setQueues] = useState([])
  const [counters, setCounters] = useState([])
  const [selectedCounter, setSelectedCounter] = useState('')
  const [filter, setFilter] = useState('waiting')

  useEffect(() => {
    fetchQueues()
    fetchCounters()

    const socket = io(SOCKET_URL)
    socket.on('queue:new', () => fetchQueues())
    socket.on('queue:called', () => fetchQueues())
    socket.on('queue:serving', () => fetchQueues())
    socket.on('queue:completed', () => fetchQueues())
    socket.on('queue:cancelled', () => fetchQueues())

    return () => socket.disconnect()
  }, [filter])

  const fetchQueues = async () => {
    try {
      const response = await axios.get(`${API_URL}/queue`, { params: { status: filter } })
      setQueues(response.data)
    } catch (error) {
      console.error('Error fetching queues:', error)
    }
  }

  const fetchCounters = async () => {
    try {
      const response = await axios.get(`${API_URL}/counters`)
      setCounters(response.data.filter(c => c.is_active))
    } catch (error) {
      console.error('Error fetching counters:', error)
    }
  }

  const handleCall = async (queueId) => {
    if (!selectedCounter) {
      alert('Pilih loket terlebih dahulu')
      return
    }

    try {
      await axios.post(`${API_URL}/queue/${queueId}/call`, { counter_number: selectedCounter })
      fetchQueues()
    } catch (error) {
      alert(error.response?.data?.error || 'Gagal memanggil antrian')
    }
  }

  const handleServe = async (queueId) => {
    try {
      await axios.post(`${API_URL}/queue/${queueId}/serve`)
      fetchQueues()
    } catch (error) {
      alert(error.response?.data?.error || 'Gagal memulai layanan')
    }
  }

  const handleComplete = async (queueId) => {
    const notes = prompt('Catatan (opsional):')
    try {
      await axios.post(`${API_URL}/queue/${queueId}/complete`, { notes })
      fetchQueues()
    } catch (error) {
      alert(error.response?.data?.error || 'Gagal menyelesaikan layanan')
    }
  }

  const handleCancel = async (queueId) => {
    const notes = prompt('Alasan pembatalan:')
    if (!notes) return

    try {
      await axios.post(`${API_URL}/queue/${queueId}/cancel`, { notes })
      fetchQueues()
    } catch (error) {
      alert(error.response?.data?.error || 'Gagal membatalkan antrian')
    }
  }

  const handleResetToday = async () => {
    const confirmed = window.confirm(
      '⚠️ PERINGATAN!\n\n' +
      'Anda akan menghapus SEMUA antrian HARI INI.\n' +
      'Tindakan ini TIDAK DAPAT dibatalkan!\n\n' +
      'Apakah Anda yakin ingin melanjutkan?'
    )
    
    if (!confirmed) return

    try {
      const token = localStorage.getItem('token')
      const response = await axios.post(
        `${API_URL}/queue/reset/today`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      )
      
      alert(`✅ ${response.data.message}`)
      fetchQueues()
    } catch (error) {
      alert(error.response?.data?.error || 'Gagal mereset antrian hari ini')
    }
  }

  const handleResetAll = async () => {
    const confirmed = window.confirm(
      '🚨 PERINGATAN KERAS!\n\n' +
      'Anda akan menghapus SEMUA antrian (SEMUA HARI).\n' +
      'Tindakan ini SANGAT BERBAHAYA dan TIDAK DAPAT dibatalkan!\n\n' +
      'Apakah Anda BENAR-BENAR yakin?'
    )
    
    if (!confirmed) return

    const doubleConfirm = window.confirm(
      '⚠️ KONFIRMASI KEDUA\n\n' +
      'Ini adalah konfirmasi terakhir.\n' +
      'Semua data antrian akan HILANG PERMANEN!\n\n' +
      'Ketik OK untuk melanjutkan.'
    )

    if (!doubleConfirm) return

    try {
      const token = localStorage.getItem('token')
      const response = await axios.post(
        `${API_URL}/queue/reset`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      )
      
      alert(`✅ ${response.data.message}`)
      fetchQueues()
    } catch (error) {
      alert(error.response?.data?.error || 'Gagal mereset semua antrian')
    }
  }

  const getStatusBadge = (status) => {
    const badges = {
      waiting: 'bg-yellow-100 text-yellow-800',
      called: 'bg-blue-100 text-blue-800',
      serving: 'bg-indigo-100 text-indigo-800',
      completed: 'bg-green-100 text-green-800',
      cancelled: 'bg-red-100 text-red-800'
    }
    const labels = {
      waiting: 'Menunggu',
      called: 'Dipanggil',
      serving: 'Dilayani',
      completed: 'Selesai',
      cancelled: 'Dibatalkan'
    }
    return <span className={`px-3 py-1 rounded-full text-sm font-semibold ${badges[status]}`}>{labels[status]}</span>
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-bold text-gray-800">Manajemen Antrian</h1>
        
        {/* Reset Buttons */}
        <div className="flex gap-3">
          <button
            onClick={handleResetToday}
            className="bg-orange-500 hover:bg-orange-600 text-white px-4 py-2 rounded-lg font-semibold flex items-center gap-2 transition-all shadow-lg hover:shadow-xl"
          >
            <Trash2 className="w-5 h-5" />
            Reset Hari Ini
          </button>
          <button
            onClick={handleResetAll}
            className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg font-semibold flex items-center gap-2 transition-all shadow-lg hover:shadow-xl"
          >
            <AlertTriangle className="w-5 h-5" />
            Reset Semua
          </button>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow p-6 mb-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Pilih Loket</label>
            <select
              value={selectedCounter}
              onChange={(e) => setSelectedCounter(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            >
              <option value="">-- Pilih Loket --</option>
              {counters.map(counter => (
                <option key={counter.id} value={counter.counter_number}>
                  Loket {counter.counter_number} - {counter.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Filter Status</label>
            <select
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            >
              <option value="">Semua</option>
              <option value="waiting">Menunggu</option>
              <option value="called">Dipanggil</option>
              <option value="serving">Dilayani</option>
              <option value="completed">Selesai</option>
              <option value="cancelled">Dibatalkan</option>
            </select>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">No. Antrian</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Nama</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Layanan</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Loket</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Aksi</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {queues.map(queue => (
              <tr key={queue.id}>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-lg font-bold text-gray-900">{queue.queue_number}</div>
                  <div className="text-xs text-gray-500">{new Date(queue.created_at).toLocaleTimeString('id-ID')}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="font-semibold text-gray-900">{queue.client_name}</div>
                  {queue.client_phone && <div className="text-sm text-gray-500">{queue.client_phone}</div>}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{queue.service_name}</td>
                <td className="px-6 py-4 whitespace-nowrap">{getStatusBadge(queue.status)}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {queue.counter_number ? `Loket ${queue.counter_number}` : '-'}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm">
                  <div className="flex space-x-2">
                    {queue.status === 'waiting' && (
                      <button
                        onClick={() => handleCall(queue.id)}
                        className="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600 flex items-center"
                      >
                        <Phone className="w-4 h-4 mr-1" />
                        Panggil
                      </button>
                    )}
                    {queue.status === 'called' && (
                      <button
                        onClick={() => handleServe(queue.id)}
                        className="bg-indigo-500 text-white px-3 py-1 rounded hover:bg-indigo-600 flex items-center"
                      >
                        <Play className="w-4 h-4 mr-1" />
                        Mulai
                      </button>
                    )}
                    {queue.status === 'serving' && (
                      <button
                        onClick={() => handleComplete(queue.id)}
                        className="bg-green-500 text-white px-3 py-1 rounded hover:bg-green-600 flex items-center"
                      >
                        <CheckCircle className="w-4 h-4 mr-1" />
                        Selesai
                      </button>
                    )}
                    {['waiting', 'called', 'serving'].includes(queue.status) && (
                      <button
                        onClick={() => handleCancel(queue.id)}
                        className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600 flex items-center"
                      >
                        <XCircle className="w-4 h-4 mr-1" />
                        Batal
                      </button>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {queues.length === 0 && (
          <div className="text-center py-12 text-gray-500">
            Tidak ada antrian
          </div>
        )}
      </div>
    </div>
  )
}
