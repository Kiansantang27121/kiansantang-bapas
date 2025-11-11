import { useState, useEffect } from 'react'
import axios from 'axios'
import { 
  ClipboardList, User, Phone, CreditCard, CheckCircle, XCircle, 
  Sparkles, Clock, ArrowRight, RefreshCw, Info, Shield
} from 'lucide-react'
import { API_URL } from './config'

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
  const [selectedService, setSelectedService] = useState(null)

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
      setSelectedService(null)
    } catch (err) {
      setError(err.response?.data?.error || 'Terjadi kesalahan saat mendaftar')
    } finally {
      setLoading(false)
    }
  }

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData({
      ...formData,
      [name]: value
    })

    if (name === 'service_id') {
      const service = services.find(s => s.id === parseInt(value))
      setSelectedService(service)
    }
  }

  const handleNewRegistration = () => {
    setResult(null)
    setError('')
  }

  // Success Screen
  if (result) {
    return (
      <div className="min-h-screen relative overflow-hidden">
        {/* Animated Background */}
        <div className="absolute inset-0 bg-gradient-to-br from-emerald-400 via-cyan-500 to-blue-600">
          <div className="absolute inset-0 opacity-30">
            <div className="absolute top-0 -left-4 w-72 h-72 bg-purple-300 rounded-full mix-blend-multiply filter blur-xl animate-blob"></div>
            <div className="absolute top-0 -right-4 w-72 h-72 bg-yellow-300 rounded-full mix-blend-multiply filter blur-xl animate-blob animation-delay-2000"></div>
            <div className="absolute -bottom-8 left-20 w-72 h-72 bg-pink-300 rounded-full mix-blend-multiply filter blur-xl animate-blob animation-delay-4000"></div>
          </div>
        </div>

        {/* Content */}
        <div className="relative min-h-screen flex items-center justify-center p-4">
          <div className="bg-white/95 backdrop-blur-xl rounded-3xl shadow-2xl p-8 max-w-lg w-full border border-white/20 animate-scale-in">
            {/* Success Icon */}
            <div className="text-center mb-8">
              <div className="inline-flex items-center justify-center w-24 h-24 bg-gradient-to-br from-emerald-400 to-cyan-500 rounded-full mb-6 animate-bounce-slow">
                <CheckCircle className="w-14 h-14 text-white" strokeWidth={2.5} />
              </div>
              <h2 className="text-4xl font-black text-gray-800 mb-3 bg-gradient-to-r from-emerald-600 to-cyan-600 bg-clip-text text-transparent">
                Berhasil!
              </h2>
              <p className="text-gray-600 text-lg">Nomor antrian Anda telah dibuat</p>
            </div>

            {/* Queue Number Card */}
            <div className="relative mb-8 group">
              <div className="absolute -inset-1 bg-gradient-to-r from-emerald-500 via-cyan-500 to-blue-500 rounded-2xl blur opacity-75 group-hover:opacity-100 transition duration-1000 animate-pulse"></div>
              <div className="relative bg-gradient-to-br from-emerald-500 via-cyan-500 to-blue-600 rounded-2xl p-8 text-center">
                <div className="flex items-center justify-center mb-3">
                  <Sparkles className="w-6 h-6 text-yellow-300 mr-2 animate-pulse" />
                  <span className="text-white/90 text-sm font-semibold uppercase tracking-wider">
                    Nomor Antrian
                  </span>
                  <Sparkles className="w-6 h-6 text-yellow-300 ml-2 animate-pulse" />
                </div>
                <div className="text-white text-7xl font-black mb-3 tracking-tight drop-shadow-lg">
                  {result.queue_number}
                </div>
                <div className="inline-block bg-white/20 backdrop-blur-sm px-4 py-2 rounded-full">
                  <span className="text-white text-sm font-semibold">
                    {result.service_name}
                  </span>
                </div>
              </div>
            </div>

            {/* Details Grid */}
            <div className="grid grid-cols-2 gap-4 mb-8">
              <div className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl p-4 border border-gray-200">
                <div className="flex items-center text-gray-600 text-sm mb-2">
                  <User className="w-4 h-4 mr-2" />
                  Nama
                </div>
                <div className="font-bold text-gray-800 text-lg truncate">
                  {result.client_name}
                </div>
              </div>
              <div className="bg-gradient-to-br from-blue-50 to-cyan-50 rounded-xl p-4 border border-blue-200">
                <div className="flex items-center text-blue-600 text-sm mb-2">
                  <Clock className="w-4 h-4 mr-2" />
                  Estimasi
                </div>
                <div className="font-bold text-blue-800 text-lg">
                  ~{result.estimated_time} menit
                </div>
              </div>
            </div>

            {/* Info Box */}
            <div className="bg-gradient-to-r from-blue-50 to-cyan-50 border-2 border-blue-200 rounded-xl p-4 mb-8">
              <div className="flex items-start">
                <Info className="w-5 h-5 text-blue-600 mr-3 mt-0.5 flex-shrink-0" />
                <p className="text-blue-800 text-sm leading-relaxed">
                  Silakan tunggu nomor antrian Anda dipanggil. Pantau <strong>layar display</strong> untuk informasi terkini.
                </p>
              </div>
            </div>

            {/* Action Button */}
            <button
              onClick={handleNewRegistration}
              className="w-full bg-gradient-to-r from-emerald-500 via-cyan-500 to-blue-600 text-white py-4 rounded-xl font-bold text-lg hover:shadow-2xl hover:scale-105 transition-all duration-300 flex items-center justify-center group"
            >
              <RefreshCw className="w-5 h-5 mr-2 group-hover:rotate-180 transition-transform duration-500" />
              Daftar Antrian Baru
            </button>
          </div>
        </div>
      </div>
    )
  }

  // Registration Form
  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Animated Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-500 via-purple-500 to-pink-500">
        <div className="absolute inset-0 opacity-30">
          <div className="absolute top-0 -left-4 w-96 h-96 bg-purple-300 rounded-full mix-blend-multiply filter blur-xl animate-blob"></div>
          <div className="absolute top-0 -right-4 w-96 h-96 bg-yellow-300 rounded-full mix-blend-multiply filter blur-xl animate-blob animation-delay-2000"></div>
          <div className="absolute -bottom-8 left-20 w-96 h-96 bg-pink-300 rounded-full mix-blend-multiply filter blur-xl animate-blob animation-delay-4000"></div>
        </div>
      </div>

      {/* Content */}
      <div className="relative container mx-auto px-4 py-8">
        <div className="max-w-3xl mx-auto">
          {/* Header Card */}
          <div className="bg-white/95 backdrop-blur-xl rounded-3xl shadow-2xl p-8 mb-6 border border-white/20 animate-slide-down">
            <div className="text-center">
              {/* Logo/Icon */}
              <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl mb-6 shadow-lg">
                {settings.logo_url ? (
                  <img src={settings.logo_url} alt="Logo" className="w-12 h-12 object-contain" />
                ) : (
                  <Shield className="w-12 h-12 text-white" />
                )}
              </div>

              {/* Title */}
              <h1 className="text-5xl font-black text-gray-800 mb-3 bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
                {settings.office_name || 'BAPAS Bandung'}
              </h1>
              <p className="text-gray-600 text-lg mb-2">{settings.office_address}</p>
              <p className="text-gray-600 mb-4">{settings.office_phone}</p>

              {/* Operating Hours Badge */}
              <div className="inline-flex items-center bg-gradient-to-r from-blue-500 to-purple-600 text-white px-6 py-3 rounded-full shadow-lg">
                <Clock className="w-5 h-5 mr-2" />
                <span className="font-bold">
                  {settings.working_hours || '08:00 - 16:00'}
                </span>
              </div>
            </div>
          </div>

          {/* Registration Form Card */}
          <div className="bg-white/95 backdrop-blur-xl rounded-3xl shadow-2xl p-8 border border-white/20 animate-slide-up">
            {/* Form Header */}
            <div className="flex items-center mb-8">
              <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center mr-4 shadow-lg">
                <ClipboardList className="w-7 h-7 text-white" />
              </div>
              <div>
                <h2 className="text-3xl font-black text-gray-800">Pendaftaran Layanan</h2>
                <p className="text-gray-600">Isi formulir di bawah untuk mendaftar</p>
              </div>
            </div>

            {/* Error Alert */}
            {error && (
              <div className="mb-6 bg-red-50 border-l-4 border-red-500 p-4 rounded-xl animate-shake">
                <div className="flex items-center">
                  <XCircle className="w-6 h-6 text-red-500 mr-3 flex-shrink-0" />
                  <p className="text-red-700 font-semibold">{error}</p>
                </div>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Service Selection */}
              <div className="group">
                <label className="block text-sm font-bold text-gray-700 mb-3 flex items-center">
                  <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                    Pilih Layanan
                  </span>
                  <span className="text-red-500 ml-1">*</span>
                </label>
                <div className="relative">
                  <select
                    name="service_id"
                    value={formData.service_id}
                    onChange={handleChange}
                    required
                    className="w-full px-5 py-4 border-2 border-gray-300 rounded-xl focus:ring-4 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all duration-300 appearance-none bg-white font-semibold text-gray-800 cursor-pointer hover:border-blue-400"
                  >
                    <option value="">-- Pilih Layanan --</option>
                    {services.map(service => (
                      <option key={service.id} value={service.id}>
                        {service.name} (~{service.estimated_time} menit)
                      </option>
                    ))}
                  </select>
                  <ArrowRight className="absolute right-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none rotate-90" />
                </div>
                {selectedService && (
                  <div className="mt-3 p-3 bg-blue-50 border border-blue-200 rounded-lg animate-fade-in">
                    <p className="text-sm text-blue-800">
                      <strong>Deskripsi:</strong> {selectedService.description || 'Layanan ' + selectedService.name}
                    </p>
                  </div>
                )}
              </div>

              {/* Client Name */}
              <div className="group">
                <label className="block text-sm font-bold text-gray-700 mb-3 flex items-center">
                  <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                    Nama Lengkap
                  </span>
                  <span className="text-red-500 ml-1">*</span>
                </label>
                <div className="relative">
                  <div className="absolute left-4 top-1/2 transform -translate-y-1/2 w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                    <User className="w-5 h-5 text-white" />
                  </div>
                  <input
                    type="text"
                    name="client_name"
                    value={formData.client_name}
                    onChange={handleChange}
                    required
                    placeholder="Masukkan nama lengkap Anda"
                    className="w-full pl-16 pr-5 py-4 border-2 border-gray-300 rounded-xl focus:ring-4 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all duration-300 font-semibold text-gray-800 placeholder-gray-400"
                  />
                </div>
              </div>

              {/* Phone Number */}
              <div className="group">
                <label className="block text-sm font-bold text-gray-700 mb-3 flex items-center">
                  <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                    Nomor Telepon
                  </span>
                  <span className="text-gray-400 ml-2 text-xs">(Opsional)</span>
                </label>
                <div className="relative">
                  <div className="absolute left-4 top-1/2 transform -translate-y-1/2 w-10 h-10 bg-gradient-to-br from-green-500 to-emerald-600 rounded-lg flex items-center justify-center">
                    <Phone className="w-5 h-5 text-white" />
                  </div>
                  <input
                    type="tel"
                    name="client_phone"
                    value={formData.client_phone}
                    onChange={handleChange}
                    placeholder="Contoh: 08123456789"
                    className="w-full pl-16 pr-5 py-4 border-2 border-gray-300 rounded-xl focus:ring-4 focus:ring-green-500/20 focus:border-green-500 outline-none transition-all duration-300 font-semibold text-gray-800 placeholder-gray-400"
                  />
                </div>
              </div>

              {/* NIK */}
              <div className="group">
                <label className="block text-sm font-bold text-gray-700 mb-3 flex items-center">
                  <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                    NIK (Nomor Induk Kependudukan)
                  </span>
                  <span className="text-gray-400 ml-2 text-xs">(Opsional)</span>
                </label>
                <div className="relative">
                  <div className="absolute left-4 top-1/2 transform -translate-y-1/2 w-10 h-10 bg-gradient-to-br from-orange-500 to-red-600 rounded-lg flex items-center justify-center">
                    <CreditCard className="w-5 h-5 text-white" />
                  </div>
                  <input
                    type="text"
                    name="client_nik"
                    value={formData.client_nik}
                    onChange={handleChange}
                    placeholder="16 digit NIK"
                    maxLength="16"
                    className="w-full pl-16 pr-5 py-4 border-2 border-gray-300 rounded-xl focus:ring-4 focus:ring-orange-500/20 focus:border-orange-500 outline-none transition-all duration-300 font-semibold text-gray-800 placeholder-gray-400"
                  />
                </div>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={loading}
                className="relative w-full bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 text-white py-5 rounded-xl font-black text-xl hover:shadow-2xl hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 transition-all duration-300 overflow-hidden group"
              >
                <span className="relative z-10 flex items-center justify-center">
                  {loading ? (
                    <>
                      <RefreshCw className="w-6 h-6 mr-3 animate-spin" />
                      Memproses...
                    </>
                  ) : (
                    <>
                      <Sparkles className="w-6 h-6 mr-3 group-hover:rotate-12 transition-transform" />
                      Daftar Sekarang
                      <ArrowRight className="w-6 h-6 ml-3 group-hover:translate-x-2 transition-transform" />
                    </>
                  )}
                </span>
                <div className="absolute inset-0 bg-gradient-to-r from-pink-600 via-purple-600 to-blue-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              </button>
            </form>
          </div>

          {/* Info Footer */}
          <div className="mt-6 bg-white/90 backdrop-blur-xl border-2 border-blue-200 rounded-2xl p-6 shadow-lg animate-fade-in">
            <div className="flex items-start">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-lg flex items-center justify-center mr-4 flex-shrink-0">
                <Info className="w-6 h-6 text-white" />
              </div>
              <div>
                <h3 className="font-bold text-gray-800 mb-2">Informasi Penting:</h3>
                <ul className="text-sm text-gray-700 space-y-1">
                  <li>• Setelah mendaftar, Anda akan mendapatkan <strong>nomor antrian</strong></li>
                  <li>• Silakan tunggu hingga nomor Anda <strong>dipanggil</strong></li>
                  <li>• Pantau <strong>layar display</strong> untuk informasi terkini</li>
                  <li>• Harap datang <strong>tepat waktu</strong> saat nomor dipanggil</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default App
