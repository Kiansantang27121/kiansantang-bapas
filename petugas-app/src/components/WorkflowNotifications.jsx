import { useState, useEffect } from 'react'
import { Bell, User, Clock, CheckCircle, XCircle, ArrowRight, Phone, Users } from 'lucide-react'
import axios from 'axios'

const API_URL = 'http://localhost:3000/api'

export default function WorkflowNotifications() {
  const [notifications, setNotifications] = useState([])
  const [pendingQueues, setPendingQueues] = useState([])
  const [readyToCall, setReadyToCall] = useState([])
  const [pkList, setPkList] = useState([])
  const [loading, setLoading] = useState(true)
  const [selectedQueue, setSelectedQueue] = useState(null)
  const [selectedPK, setSelectedPK] = useState('')
  const [notes, setNotes] = useState('')

  useEffect(() => {
    fetchData()
    // Poll every 5 seconds
    const interval = setInterval(fetchData, 5000)
    return () => clearInterval(interval)
  }, [])

  const fetchData = async () => {
    try {
      const token = localStorage.getItem('token')
      const headers = { Authorization: `Bearer ${token}` }

      const [notifRes, pendingRes, readyRes, pkRes] = await Promise.all([
        axios.get(`${API_URL}/workflow/notifications?unread_only=true`, { headers }),
        axios.get(`${API_URL}/workflow/pending-queues`, { headers }),
        axios.get(`${API_URL}/workflow/ready-to-call`, { headers }),
        axios.get(`${API_URL}/pk`, { headers })
      ])

      setNotifications(notifRes.data.notifications || [])
      setPendingQueues(pendingRes.data.queues || [])
      setReadyToCall(readyRes.data.queues || [])
      setPkList(pkRes.data.pks || [])
      setLoading(false)
    } catch (error) {
      console.error('Error fetching data:', error)
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
      fetchData()
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

      // Trigger voice announcement
      if (response.data.success) {
        speakQueueNumber(queueNumber, counterNumber)
        alert(`Antrian ${queueNumber} dipanggil ke loket ${counterNumber}`)
        fetchData()
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

  const markAsRead = async (notificationId) => {
    try {
      const token = localStorage.getItem('token')
      await axios.put(
        `${API_URL}/workflow/notifications/${notificationId}/read`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      )
      fetchData()
    } catch (error) {
      console.error('Error marking notification as read:', error)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Notifications */}
      {notifications.length > 0 && (
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center mb-4">
            <Bell className="w-6 h-6 text-blue-600 mr-2" />
            <h2 className="text-xl font-bold text-gray-800">Notifikasi Baru</h2>
            <span className="ml-auto bg-red-500 text-white text-xs font-bold px-2 py-1 rounded-full">
              {notifications.length}
            </span>
          </div>
          <div className="space-y-3">
            {notifications.map((notif) => (
              <div
                key={notif.id}
                className="flex items-start p-4 bg-blue-50 rounded-lg border border-blue-200 cursor-pointer hover:bg-blue-100 transition"
                onClick={() => markAsRead(notif.id)}
              >
                <div className="flex-1">
                  <h3 className="font-bold text-gray-800">{notif.title}</h3>
                  <p className="text-sm text-gray-600 mt-1">{notif.message}</p>
                  {notif.queue_number && (
                    <span className="inline-block mt-2 text-xs font-bold text-blue-600 bg-blue-100 px-2 py-1 rounded">
                      {notif.queue_number}
                    </span>
                  )}
                </div>
                <div className="text-xs text-gray-500 ml-4">
                  {new Date(notif.created_at).toLocaleTimeString('id-ID')}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Pending Queues - Need PK Assignment */}
      {pendingQueues.length > 0 && (
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center mb-4">
            <Users className="w-6 h-6 text-orange-600 mr-2" />
            <h2 className="text-xl font-bold text-gray-800">Menunggu Assignment PK</h2>
            <span className="ml-auto bg-orange-500 text-white text-xs font-bold px-2 py-1 rounded-full">
              {pendingQueues.length}
            </span>
          </div>
          <div className="grid gap-4">
            {pendingQueues.map((queue) => (
              <div key={queue.id} className="border border-orange-200 rounded-lg p-4 bg-orange-50">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <span className="text-2xl font-black text-orange-600">{queue.queue_number}</span>
                      <span className="text-sm font-semibold text-gray-600">{queue.service_name}</span>
                    </div>
                    <div className="flex items-center text-gray-700 mb-1">
                      <User className="w-4 h-4 mr-2" />
                      <span className="font-bold">{queue.client_name}</span>
                    </div>
                    <div className="flex items-center text-gray-600 text-sm">
                      <Clock className="w-4 h-4 mr-2" />
                      <span>~{queue.estimated_time} menit</span>
                    </div>
                  </div>
                  <button
                    onClick={() => setSelectedQueue(queue.id)}
                    className="bg-orange-600 text-white px-4 py-2 rounded-lg font-bold hover:bg-orange-700 transition flex items-center gap-2"
                  >
                    <Users className="w-4 h-4" />
                    Assign ke PK
                  </button>
                </div>

                {/* Assignment Modal */}
                {selectedQueue === queue.id && (
                  <div className="mt-4 p-4 bg-white rounded-lg border-2 border-orange-300">
                    <h3 className="font-bold text-gray-800 mb-3">Pilih PK:</h3>
                    <select
                      value={selectedPK}
                      onChange={(e) => setSelectedPK(e.target.value)}
                      className="w-full p-2 border border-gray-300 rounded-lg mb-3"
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
                      placeholder="Catatan (opsional)"
                      className="w-full p-2 border border-gray-300 rounded-lg mb-3"
                      rows="2"
                    />
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleAssignToPK(queue.id)}
                        className="flex-1 bg-green-600 text-white px-4 py-2 rounded-lg font-bold hover:bg-green-700 transition"
                      >
                        Assign
                      </button>
                      <button
                        onClick={() => {
                          setSelectedQueue(null)
                          setSelectedPK('')
                          setNotes('')
                        }}
                        className="flex-1 bg-gray-400 text-white px-4 py-2 rounded-lg font-bold hover:bg-gray-500 transition"
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

      {/* Ready to Call */}
      {readyToCall.length > 0 && (
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center mb-4">
            <Phone className="w-6 h-6 text-green-600 mr-2" />
            <h2 className="text-xl font-bold text-gray-800">Siap Dipanggil</h2>
            <span className="ml-auto bg-green-500 text-white text-xs font-bold px-2 py-1 rounded-full">
              {readyToCall.length}
            </span>
          </div>
          <div className="grid gap-4">
            {readyToCall.map((queue) => (
              <div key={queue.id} className="border border-green-200 rounded-lg p-4 bg-green-50">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <span className="text-2xl font-black text-green-600">{queue.queue_number}</span>
                      <span className="text-sm font-semibold text-gray-600">{queue.service_name}</span>
                    </div>
                    <div className="flex items-center text-gray-700 mb-1">
                      <User className="w-4 h-4 mr-2" />
                      <span className="font-bold">{queue.client_name}</span>
                    </div>
                    <div className="flex items-center text-gray-600 text-sm mb-1">
                      <CheckCircle className="w-4 h-4 mr-2 text-green-600" />
                      <span>Disetujui oleh: <strong>{queue.pk_name}</strong></span>
                    </div>
                  </div>
                  <button
                    onClick={() => handleCallQueue(queue.workflow_id, queue.queue_number)}
                    className="bg-green-600 text-white px-4 py-2 rounded-lg font-bold hover:bg-green-700 transition flex items-center gap-2 animate-pulse"
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
      {notifications.length === 0 && pendingQueues.length === 0 && readyToCall.length === 0 && (
        <div className="bg-white rounded-lg shadow-md p-12 text-center">
          <Bell className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-xl font-bold text-gray-400 mb-2">Tidak Ada Notifikasi</h3>
          <p className="text-gray-500">Semua antrian sudah diproses</p>
        </div>
      )}
    </div>
  )
}
