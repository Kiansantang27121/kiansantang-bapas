import { useState, useEffect } from 'react'
import { CheckCircle, XCircle, ArrowRight, User, Clock, AlertCircle, Users, FileText } from 'lucide-react'
import axios from 'axios'

const API_URL = 'http://localhost:3000/api'

export default function PKApprovalDashboard() {
  const [assignments, setAssignments] = useState([])
  const [pkList, setPkList] = useState([])
  const [loading, setLoading] = useState(true)
  const [selectedAction, setSelectedAction] = useState(null)
  const [reason, setReason] = useState('')
  const [transferToPK, setTransferToPK] = useState('')

  useEffect(() => {
    fetchAssignments()
    // Poll every 5 seconds
    const interval = setInterval(fetchAssignments, 5000)
    return () => clearInterval(interval)
  }, [])

  const fetchAssignments = async () => {
    try {
      const token = localStorage.getItem('token')
      const headers = { Authorization: `Bearer ${token}` }

      const [assignRes, pkRes] = await Promise.all([
        axios.get(`${API_URL}/workflow/my-assignments`, { headers }),
        axios.get(`${API_URL}/pk`, { headers })
      ])

      setAssignments(assignRes.data.assignments || [])
      setPkList(pkRes.data.pks || [])
      setLoading(false)
    } catch (error) {
      console.error('Error fetching assignments:', error)
      setLoading(false)
    }
  }

  const handleAction = async (workflowId, action) => {
    if (action === 'reject' && !reason) {
      alert('Alasan penolakan harus diisi')
      return
    }

    if (action === 'transfer' && !transferToPK) {
      alert('Pilih PK tujuan')
      return
    }

    try {
      const token = localStorage.getItem('token')
      await axios.post(
        `${API_URL}/workflow/pk-action`,
        {
          workflow_id: workflowId,
          action: action,
          reason: reason,
          transfer_to_pk_id: transferToPK || null
        },
        { headers: { Authorization: `Bearer ${token}` } }
      )

      const actionText = action === 'approve' ? 'disetujui' : action === 'reject' ? 'ditolak' : 'dialihkan'
      alert(`Antrian berhasil ${actionText}`)
      setSelectedAction(null)
      setReason('')
      setTransferToPK('')
      fetchAssignments()
    } catch (error) {
      console.error('Error processing action:', error)
      alert('Gagal memproses aksi')
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
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg shadow-lg p-6 text-white">
        <h1 className="text-2xl font-black mb-2">Dashboard PK</h1>
        <p className="text-blue-100">Kelola antrian yang ditugaskan kepada Anda</p>
      </div>

      {assignments.length > 0 ? (
        <div className="grid gap-6">
          {assignments.map((assignment) => (
            <div key={assignment.id} className="bg-white rounded-lg shadow-md overflow-hidden">
              {/* Header */}
              <div className="bg-gradient-to-r from-blue-500 to-purple-500 p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <span className="text-3xl font-black text-white">{assignment.queue_number}</span>
                    <div>
                      <div className="text-white font-bold">{assignment.service_name}</div>
                      <div className="text-blue-100 text-sm">
                        Ditugaskan oleh: {assignment.assigned_by_name}
                      </div>
                    </div>
                  </div>
                  <div className="bg-white/20 backdrop-blur-sm px-3 py-1 rounded-full">
                    <span className="text-white text-xs font-bold">
                      {new Date(assignment.assigned_at).toLocaleString('id-ID')}
                    </span>
                  </div>
                </div>
              </div>

              {/* Content */}
              <div className="p-6">
                <div className="grid md:grid-cols-2 gap-4 mb-6">
                  <div className="flex items-center">
                    <User className="w-5 h-5 text-gray-600 mr-3" />
                    <div>
                      <div className="text-sm text-gray-600">Nama Klien</div>
                      <div className="font-bold text-gray-800">{assignment.client_name}</div>
                    </div>
                  </div>
                  <div className="flex items-center">
                    <Clock className="w-5 h-5 text-gray-600 mr-3" />
                    <div>
                      <div className="text-sm text-gray-600">Estimasi Waktu</div>
                      <div className="font-bold text-gray-800">~{assignment.estimated_time} menit</div>
                    </div>
                  </div>
                </div>

                {assignment.notes && (
                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
                    <div className="flex items-start">
                      <FileText className="w-5 h-5 text-blue-600 mr-2 mt-0.5" />
                      <div>
                        <div className="text-sm font-bold text-blue-800 mb-1">Catatan:</div>
                        <div className="text-sm text-blue-700">{assignment.notes}</div>
                      </div>
                    </div>
                  </div>
                )}

                {/* Action Buttons */}
                {selectedAction === assignment.workflow_id ? (
                  <div className="space-y-4">
                    {/* Approve */}
                    <button
                      onClick={() => handleAction(assignment.workflow_id, 'approve')}
                      className="w-full bg-green-600 text-white py-3 rounded-lg font-bold hover:bg-green-700 transition flex items-center justify-center gap-2"
                    >
                      <CheckCircle className="w-5 h-5" />
                      Terima - Setujui Antrian
                    </button>

                    {/* Reject */}
                    <div className="space-y-2">
                      <textarea
                        value={reason}
                        onChange={(e) => setReason(e.target.value)}
                        placeholder="Alasan penolakan..."
                        className="w-full p-3 border border-gray-300 rounded-lg"
                        rows="2"
                      />
                      <button
                        onClick={() => handleAction(assignment.workflow_id, 'reject')}
                        className="w-full bg-red-600 text-white py-3 rounded-lg font-bold hover:bg-red-700 transition flex items-center justify-center gap-2"
                      >
                        <XCircle className="w-5 h-5" />
                        Tolak Antrian
                      </button>
                    </div>

                    {/* Transfer */}
                    <div className="space-y-2">
                      <select
                        value={transferToPK}
                        onChange={(e) => setTransferToPK(e.target.value)}
                        className="w-full p-3 border border-gray-300 rounded-lg"
                      >
                        <option value="">-- Pilih PK Tujuan --</option>
                        {pkList
                          .filter((pk) => pk.id !== assignment.assigned_pk_id)
                          .map((pk) => (
                            <option key={pk.id} value={pk.id}>
                              {pk.full_name}
                            </option>
                          ))}
                      </select>
                      <textarea
                        value={reason}
                        onChange={(e) => setReason(e.target.value)}
                        placeholder="Alasan pengalihan..."
                        className="w-full p-3 border border-gray-300 rounded-lg"
                        rows="2"
                      />
                      <button
                        onClick={() => handleAction(assignment.workflow_id, 'transfer')}
                        className="w-full bg-orange-600 text-white py-3 rounded-lg font-bold hover:bg-orange-700 transition flex items-center justify-center gap-2"
                      >
                        <ArrowRight className="w-5 h-5" />
                        Alihkan ke PK Lain
                      </button>
                    </div>

                    {/* Cancel */}
                    <button
                      onClick={() => {
                        setSelectedAction(null)
                        setReason('')
                        setTransferToPK('')
                      }}
                      className="w-full bg-gray-400 text-white py-3 rounded-lg font-bold hover:bg-gray-500 transition"
                    >
                      Batal
                    </button>
                  </div>
                ) : (
                  <button
                    onClick={() => setSelectedAction(assignment.workflow_id)}
                    className="w-full bg-blue-600 text-white py-3 rounded-lg font-bold hover:bg-blue-700 transition flex items-center justify-center gap-2"
                  >
                    <AlertCircle className="w-5 h-5" />
                    Proses Antrian
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="bg-white rounded-lg shadow-md p-12 text-center">
          <Users className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-xl font-bold text-gray-400 mb-2">Tidak Ada Antrian</h3>
          <p className="text-gray-500">Belum ada antrian yang ditugaskan kepada Anda</p>
        </div>
      )}
    </div>
  )
}
