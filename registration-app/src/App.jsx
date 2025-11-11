import { useState, useEffect } from 'react'
import axios from 'axios'
import { ClipboardList, User, Phone, CreditCard, CheckCircle, XCircle, Printer, Send, Home } from 'lucide-react'
import { API_URL } from './config'
// Updated: New ticket design with Print, WhatsApp, Finish buttons

function App() {
  const [services, setServices] = useState([])
  const [settings, setSettings] = useState({})
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    service_id: '',
    client_name: '',
    client_phone: '',
    client_nik: ''
  })
  const [result, setResult] = useState(null)
  const [error, setError] = useState('')

  useEffect(() => {
    fetchServices()
    fetchSettings()
  }, [])

  const fetchServices = async () => {
    try {
      const response = await axios.get(`${API_URL}/services`)
      setServices(response.data)
    } catch (err) {
      console.error('Error fetching services:', err)
    }
  }

  const fetchSettings = async () => {
    try {
      const response = await axios.get(`${API_URL}/settings`)
      setSettings(response.data)
    } catch (err) {
      console.error('Error fetching settings:', err)
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    setResult(null)

    try {
      const response = await axios.post(`${API_URL}/queue`, formData)
      setResult(response.data)
      setFormData({
        service_id: '',
        client_name: '',
        client_phone: '',
        client_nik: ''
      })
    } catch (err) {
      setError(err.response?.data?.error || 'Terjadi kesalahan saat mendaftar')
    } finally {
      setLoading(false)
    }
  }

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
  }

  const handlePrint = () => {
    window.print()
  }

  const handleWhatsApp = () => {
    const message = `*TIKET ANTRIAN BAPAS*\n\nNomor Antrian: *${result.queue_number}*\nLayanan: ${result.service_name}\nNama: ${result.client_name}\nEstimasi: ~${result.estimated_time} menit\n\nSilakan tunggu nomor antrian Anda dipanggil.\n\n${settings.office_name || 'BAPAS Bandung'}`
    const whatsappUrl = `https://wa.me/?text=${encodeURIComponent(message)}`
    window.open(whatsappUrl, '_blank')
  }

  const handleFinish = () => {
    setResult(null)
    setError('')
    setFormData({
      service_id: '',
      client_name: '',
      client_phone: '',
      client_nik: ''
    })
  }

  if (result) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-cyan-50 to-teal-100 flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl shadow-2xl p-8 max-w-lg w-full">
          {/* Success Header */}
          <div className="text-center mb-6">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-green-100 rounded-full mb-4">
              <CheckCircle className="w-12 h-12 text-green-500" />
            </div>
            <h2 className="text-3xl font-bold text-gray-800 mb-2">Berhasil!</h2>
            <p className="text-gray-600">Nomor antrian Anda telah dibuat</p>
          </div>

          {/* Ticket Card */}
          <div className="bg-gradient-to-br from-cyan-500 to-teal-600 rounded-2xl p-8 mb-6 shadow-xl print:shadow-none">
            <div className="text-center mb-6">
              <div className="flex items-center justify-center gap-2 text-cyan-100 text-sm mb-2">
                <span className="text-2xl">✨</span>
                <span className="font-semibold tracking-wider">NOMOR ANTRIAN</span>
                <span className="text-2xl">✨</span>
              </div>
              <div className="text-white text-7xl font-bold tracking-wider mb-3">
                {result.queue_number}
              </div>
              <div className="inline-block bg-white/20 backdrop-blur-sm text-white px-6 py-2 rounded-full text-sm font-semibold">
                {result.service_name}
              </div>
            </div>
          </div>

          {/* Details */}
          <div className="space-y-4 mb-6">
            <div className="bg-gray-50 rounded-xl p-4">
              <div className="flex items-center gap-3 mb-3">
                <User className="w-5 h-5 text-gray-600" />
                <span className="text-sm text-gray-600">Nama</span>
              </div>
              <div className="font-bold text-gray-800 text-lg">
                {result.client_name}
              </div>
            </div>

            <div className="bg-blue-50 rounded-xl p-4">
              <div className="flex items-center gap-3 mb-3">
                <ClipboardList className="w-5 h-5 text-blue-600" />
                <span className="text-sm text-blue-600">Estimasi</span>
              </div>
              <div className="font-bold text-blue-800 text-lg">
                ~{result.estimated_time} menit
              </div>
            </div>

            {result.pk_name && (
              <div className="bg-purple-50 rounded-xl p-4">
                <div className="flex items-center gap-3 mb-3">
                  <User className="w-5 h-5 text-purple-600" />
                  <span className="text-sm text-purple-600">Pembimbing Kemasyarakatan</span>
                </div>
                <div className="font-bold text-purple-800 text-lg">
                  {result.pk_name}
                </div>
              </div>
            )}
          </div>

          {/* Info Box */}
          <div className="bg-blue-50 border-l-4 border-blue-500 rounded-lg p-4 mb-6">
            <div className="flex items-start gap-3">
              <div className="text-blue-500 text-xl mt-0.5">ℹ️</div>
              <div className="text-sm text-blue-800">
                <p className="font-semibold mb-1">Silakan tunggu nomor antrian Anda dipanggil.</p>
                <p>Pantau <span className="font-semibold">layar display</span> untuk informasi terkini.</p>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="grid grid-cols-3 gap-3">
            <button
              onClick={handlePrint}
              className="flex flex-col items-center justify-center gap-2 bg-gray-100 hover:bg-gray-200 text-gray-700 py-4 rounded-xl font-semibold transition-all duration-200 print:hidden"
            >
              <Printer className="w-6 h-6" />
              <span className="text-sm">Cetak</span>
            </button>
            
            <button
              onClick={handleWhatsApp}
              className="flex flex-col items-center justify-center gap-2 bg-green-500 hover:bg-green-600 text-white py-4 rounded-xl font-semibold transition-all duration-200 print:hidden"
            >
              <Send className="w-6 h-6" />
              <span className="text-sm">WhatsApp</span>
            </button>
            
            <button
              onClick={handleFinish}
              className="flex flex-col items-center justify-center gap-2 bg-gradient-to-r from-cyan-500 to-teal-600 hover:from-cyan-600 hover:to-teal-700 text-white py-4 rounded-xl font-semibold transition-all duration-200 print:hidden"
            >
              <Home className="w-6 h-6" />
              <span className="text-sm">Selesai</span>
            </button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-2xl mx-auto">
          {/* Header */}
          <div className="bg-white rounded-2xl shadow-xl p-8 mb-6">
            <div className="text-center mb-6">
              <h1 className="text-4xl font-bold text-gray-800 mb-2">
                {settings.office_name || 'BAPAS Bandung'}
              </h1>
              <p className="text-gray-600">{settings.office_address}</p>
              <p className="text-gray-600">{settings.office_phone}</p>
              <div className="mt-4 inline-block bg-blue-100 text-blue-800 px-4 py-2 rounded-full text-sm font-semibold">
                Jam Operasional: {settings.working_hours || '08:00 - 16:00'}
              </div>
            </div>
          </div>

          {/* Registration Form */}
          <div className="bg-white rounded-2xl shadow-xl p-8">
            <div className="flex items-center mb-6">
              <ClipboardList className="w-8 h-8 text-blue-600 mr-3" />
              <h2 className="text-2xl font-bold text-gray-800">Formulir Antrian</h2>
            </div>

            {error && (
              <div className="mb-6 bg-red-50 border-l-4 border-red-500 p-4 rounded">
                <div className="flex items-center">
                  <XCircle className="w-5 h-5 text-red-500 mr-2" />
                  <p className="text-red-700">{error}</p>
                </div>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Service Selection */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Pilih Layanan <span className="text-red-500">*</span>
                </label>
                <select
                  name="service_id"
                  value={formData.service_id}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
                >
                  <option value="">-- Pilih Layanan --</option>
                  {services.map(service => (
                    <option key={service.id} value={service.id}>
                      {service.name} ({service.estimated_time} menit)
                    </option>
                  ))}
                </select>
              </div>

              {/* Client Name */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Nama Lengkap <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="text"
                    name="client_name"
                    value={formData.client_name}
                    onChange={handleChange}
                    required
                    placeholder="Masukkan nama lengkap"
                    className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
                  />
                </div>
              </div>

              {/* Phone Number */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Nomor Telepon
                </label>
                <div className="relative">
                  <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="tel"
                    name="client_phone"
                    value={formData.client_phone}
                    onChange={handleChange}
                    placeholder="Contoh: 08123456789"
                    className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
                  />
                </div>
              </div>

              {/* NIK */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  NIK (Nomor Induk Kependudukan)
                </label>
                <div className="relative">
                  <CreditCard className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="text"
                    name="client_nik"
                    value={formData.client_nik}
                    onChange={handleChange}
                    placeholder="16 digit NIK"
                    maxLength="16"
                    className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
                  />
                </div>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={loading}
                className="w-full bg-gradient-to-r from-blue-500 to-indigo-600 text-white py-4 rounded-lg font-bold text-lg hover:from-blue-600 hover:to-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 shadow-lg hover:shadow-xl"
              >
                {loading ? 'Memproses...' : 'Ambil Nomor Antrian'}
              </button>
            </form>
          </div>

          {/* Info */}
          <div className="mt-6 bg-blue-50 border border-blue-200 rounded-lg p-4">
            <p className="text-sm text-blue-800 text-center">
              <strong>Catatan:</strong> Setelah mendaftar, Anda akan mendapatkan nomor antrian. 
              Silakan tunggu hingga nomor Anda dipanggil.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default App
