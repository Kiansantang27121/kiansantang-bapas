import { useState, useEffect } from 'react'
import axios from 'axios'
import { useAuth } from '../context/AuthContext'
import { 
  FileText, Calendar, Users, Smile, Meh, Frown, 
  TrendingUp, Download, Eye, ChevronDown, ChevronUp
} from 'lucide-react'

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api'

export default function PKDailyReport() {
  const { user } = useAuth()
  const [reports, setReports] = useState([])
  const [stats, setStats] = useState(null)
  const [loading, setLoading] = useState(true)
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0])
  const [expandedReport, setExpandedReport] = useState(null)

  useEffect(() => {
    fetchDailyReport()
  }, [selectedDate])

  const fetchDailyReport = async () => {
    setLoading(true)
    try {
      const token = localStorage.getItem('token')
      const response = await axios.get(`${API_URL}/service/daily-report`, {
        params: { date: selectedDate },
        headers: { Authorization: `Bearer ${token}` }
      })
      
      if (response.data.success) {
        setReports(response.data.reports)
        setStats(response.data.stats)
      }
    } catch (error) {
      console.error('Error fetching daily report:', error)
    } finally {
      setLoading(false)
    }
  }

  const getSatisfactionIcon = (satisfaction) => {
    switch(satisfaction) {
      case 1: return <Frown className="w-6 h-6 text-red-600" />
      case 2: return <Meh className="w-6 h-6 text-yellow-600" />
      case 3: return <Smile className="w-6 h-6 text-green-600" />
      default: return null
    }
  }

  const getSatisfactionText = (satisfaction) => {
    switch(satisfaction) {
      case 1: return 'Tidak Puas'
      case 2: return 'Cukup'
      case 3: return 'Sangat Puas'
      default: return '-'
    }
  }

  const getSatisfactionColor = (satisfaction) => {
    switch(satisfaction) {
      case 1: return 'bg-red-100 text-red-800'
      case 2: return 'bg-yellow-100 text-yellow-800'
      case 3: return 'bg-green-100 text-green-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const toggleReportDetail = (reportId) => {
    setExpandedReport(expandedReport === reportId ? null : reportId)
  }

  const downloadReport = () => {
    // Generate CSV
    let csv = 'No,Nomor Antrian,Nama Klien,Waktu,Kepuasan,Feedback\n'
    reports.forEach((report, index) => {
      csv += `${index + 1},${report.queue_number},${report.client_name},${new Date(report.created_at).toLocaleTimeString('id-ID')},${getSatisfactionText(report.satisfaction)},"${report.feedback || '-'}"\n`
    })
    
    const blob = new Blob([csv], { type: 'text/csv' })
    const url = window.URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `laporan-harian-${selectedDate}.csv`
    a.click()
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-teal-600"></div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      {/* Header */}
      <div className="max-w-7xl mx-auto mb-6">
        <div className="bg-gradient-to-r from-teal-600 to-cyan-600 rounded-xl shadow-lg p-6 text-white">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold mb-2">Laporan Harian Pelayanan</h1>
              <p className="text-blue-100">PK: {user?.name}</p>
            </div>
            <FileText className="w-16 h-16 opacity-50" />
          </div>
        </div>
      </div>

      {/* Date Selector & Download */}
      <div className="max-w-7xl mx-auto mb-6">
        <div className="bg-white rounded-xl shadow-md p-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Calendar className="w-5 h-5 text-gray-600" />
            <input
              type="date"
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
            />
          </div>
          <button
            onClick={downloadReport}
            disabled={reports.length === 0}
            className="flex items-center gap-2 bg-teal-600 text-white px-4 py-2 rounded-lg hover:bg-teal-700 transition-colors disabled:bg-gray-400"
          >
            <Download className="w-5 h-5" />
            Download CSV
          </button>
        </div>
      </div>

      {/* Statistics */}
      {stats && (
        <div className="max-w-7xl mx-auto mb-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="bg-white rounded-xl shadow-md p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 mb-1">Total Layanan</p>
                  <p className="text-3xl font-bold text-gray-800">{stats.total}</p>
                </div>
                <Users className="w-12 h-12 text-blue-500 opacity-50" />
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-md p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 mb-1">Sangat Puas</p>
                  <p className="text-3xl font-bold text-green-600">{stats.satisfied}</p>
                </div>
                <Smile className="w-12 h-12 text-green-500 opacity-50" />
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-md p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 mb-1">Cukup</p>
                  <p className="text-3xl font-bold text-yellow-600">{stats.neutral}</p>
                </div>
                <Meh className="w-12 h-12 text-yellow-500 opacity-50" />
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-md p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 mb-1">Rata-rata</p>
                  <p className="text-3xl font-bold text-teal-600">{stats.avg_satisfaction}</p>
                </div>
                <TrendingUp className="w-12 h-12 text-teal-500 opacity-50" />
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Reports List */}
      <div className="max-w-7xl mx-auto">
        <div className="bg-white rounded-xl shadow-md p-6">
          <h2 className="text-xl font-bold text-gray-800 mb-4">
            Daftar Layanan ({reports.length})
          </h2>

          {reports.length === 0 ? (
            <div className="text-center py-12">
              <FileText className="w-20 h-20 mx-auto text-gray-300 mb-4" />
              <p className="text-xl text-gray-500">Belum ada layanan pada tanggal ini</p>
            </div>
          ) : (
            <div className="space-y-3">
              {reports.map((report) => (
                <div key={report.id} className="border border-gray-200 rounded-lg overflow-hidden">
                  {/* Report Header */}
                  <div 
                    className="p-4 bg-gray-50 cursor-pointer hover:bg-gray-100 transition-colors"
                    onClick={() => toggleReportDetail(report.id)}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <div className="bg-teal-600 text-white px-4 py-2 rounded-lg font-bold">
                          {report.queue_number}
                        </div>
                        <div>
                          <p className="font-semibold text-gray-800">{report.client_name}</p>
                          <p className="text-sm text-gray-600">
                            {new Date(report.created_at).toLocaleTimeString('id-ID')} • Ruang {report.room_number}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-4">
                        <div className={`flex items-center gap-2 px-4 py-2 rounded-lg ${getSatisfactionColor(report.satisfaction)}`}>
                          {getSatisfactionIcon(report.satisfaction)}
                          <span className="font-semibold">{getSatisfactionText(report.satisfaction)}</span>
                        </div>
                        {expandedReport === report.id ? (
                          <ChevronUp className="w-6 h-6 text-gray-600" />
                        ) : (
                          <ChevronDown className="w-6 h-6 text-gray-600" />
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Report Detail */}
                  {expandedReport === report.id && (
                    <div className="p-6 bg-white border-t border-gray-200">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {/* Questions */}
                        <div className="space-y-4">
                          <h3 className="font-bold text-gray-800 mb-3">Pertanyaan Wajib:</h3>
                          
                          <div className="border-l-4 border-teal-600 pl-3">
                            <p className="text-sm font-semibold text-gray-700">1. Kondisi Saat Ini:</p>
                            <p className="text-sm text-gray-600">{report.question1}</p>
                          </div>
                          
                          <div className="border-l-4 border-teal-600 pl-3">
                            <p className="text-sm font-semibold text-gray-700">2. Kegiatan/Pekerjaan:</p>
                            <p className="text-sm text-gray-600">{report.question2}</p>
                          </div>
                          
                          <div className="border-l-4 border-teal-600 pl-3">
                            <p className="text-sm font-semibold text-gray-700">3. Lingkungan Sosial:</p>
                            <p className="text-sm text-gray-600">{report.question3}</p>
                          </div>
                          
                          <div className="border-l-4 border-teal-600 pl-3">
                            <p className="text-sm font-semibold text-gray-700">4. Kendala:</p>
                            <p className="text-sm text-gray-600">{report.question4}</p>
                          </div>
                          
                          <div className="border-l-4 border-teal-600 pl-3">
                            <p className="text-sm font-semibold text-gray-700">5. Rencana Ke Depan:</p>
                            <p className="text-sm text-gray-600">{report.question5}</p>
                          </div>
                        </div>

                        {/* Documentation & Feedback */}
                        <div className="space-y-4">
                          <div>
                            <h3 className="font-bold text-gray-800 mb-2">Dokumentasi:</h3>
                            <p className="text-sm text-gray-600">{report.photos_count} foto tersimpan</p>
                            {report.notes && (
                              <div className="mt-2 bg-gray-50 p-3 rounded-lg">
                                <p className="text-sm font-semibold text-gray-700">Catatan:</p>
                                <p className="text-sm text-gray-600">{report.notes}</p>
                              </div>
                            )}
                          </div>

                          <div>
                            <h3 className="font-bold text-gray-800 mb-2">Feedback Klien:</h3>
                            {report.feedback ? (
                              <div className="bg-blue-50 p-3 rounded-lg">
                                <p className="text-sm text-gray-700">{report.feedback}</p>
                              </div>
                            ) : (
                              <p className="text-sm text-gray-500 italic">Tidak ada feedback</p>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
