import { useState, useEffect } from 'react'
import axios from 'axios'
import { 
  ArrowLeft, User, Phone, CreditCard, Sparkles, ArrowRight, 
  RefreshCw, XCircle, Users, UserCheck, UserPlus, Database, Search, Printer
} from 'lucide-react'
import { API_URL } from '../config'
import { printThermalTicket } from '../utils/thermalPrinter'

export default function RegistrationForm({ service, settings, onSuccess, onBack }) {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [formData, setFormData] = useState({
    service_id: service.id,
    client_name: '',
    client_phone: '',
    client_nik: '',
    pk_id: '',
    client_id: ''
  })

  // For Bimbingan Wajib Lapor
  const [pkList, setPkList] = useState([])
  const [clientList, setClientList] = useState([])
  const [selectedPK, setSelectedPK] = useState(null)
  const [isManualInput, setIsManualInput] = useState(false) // Toggle manual vs existing client
  
  // Search states
  const [pkSearch, setPkSearch] = useState('')
  const [clientSearch, setClientSearch] = useState('')
  const [filteredPkList, setFilteredPkList] = useState([])
  const [filteredClientList, setFilteredClientList] = useState([])

  const isBimbinganWajibLapor = service.name.toUpperCase().includes('BIMBINGAN WAJIB LAPOR')

  useEffect(() => {
    if (isBimbinganWajibLapor) {
      fetchPKList()
    }
  }, [isBimbinganWajibLapor])

  const fetchPKList = async () => {
    try {
      const response = await axios.get(`${API_URL}/pk`)
      console.log('📋 PK Response:', response.data)
      
      // Handle both formats: { pks: [...] } or direct array
      const pkData = response.data.pks || response.data
      console.log('✅ PK List:', pkData.length, 'items')
      
      setPkList(pkData)
      setFilteredPkList(pkData)
    } catch (err) {
      console.error('❌ Error fetching PK:', err)
      alert('Gagal memuat daftar PK. Silakan refresh halaman.')
    }
  }

  // Filter PK list based on search
  useEffect(() => {
    if (pkSearch.trim() === '') {
      setFilteredPkList(pkList)
    } else {
      const filtered = pkList.filter(pk => 
        pk.name.toLowerCase().includes(pkSearch.toLowerCase()) ||
        (pk.nip && pk.nip.includes(pkSearch)) ||
        (pk.jabatan && pk.jabatan.toLowerCase().includes(pkSearch.toLowerCase()))
      )
      setFilteredPkList(filtered)
    }
  }, [pkSearch, pkList])

  // Filter client list based on search
  useEffect(() => {
    if (clientSearch.trim() === '') {
      setFilteredClientList(clientList)
    } else {
      const filtered = clientList.filter(client =>
        client.name.toLowerCase().includes(clientSearch.toLowerCase()) ||
        (client.nik && client.nik.includes(clientSearch))
      )
      setFilteredClientList(filtered)
    }
  }, [clientSearch, clientList])

  const fetchClientsByPK = async (pkId) => {
    try {
      const response = await axios.get(`${API_URL}/pk/${pkId}/clients`)
      setClientList(response.data)
      setFilteredClientList(response.data)
    } catch (err) {
      console.error('Error fetching clients:', err)
    }
  }

  const handlePKChange = (e) => {
    const pkId = e.target.value
    setFormData({ ...formData, pk_id: pkId, client_id: '', client_name: '', client_phone: '', client_nik: '' })
    
    if (pkId) {
      const pk = pkList.find(p => p.id === parseInt(pkId))
      setSelectedPK(pk)
      if (!isManualInput) {
        fetchClientsByPK(pkId)
      }
    } else {
      setSelectedPK(null)
      setClientList([])
    }
  }

  const handleToggleManualInput = () => {
    setIsManualInput(!isManualInput)
    // Reset client selection when toggling
    setFormData({ 
      ...formData, 
      client_id: '', 
      client_name: '', 
      client_phone: '', 
      client_nik: '' 
    })
  }

  const handleClientChange = (e) => {
    const clientId = e.target.value
    setFormData({ ...formData, client_id: clientId })
    
    if (clientId) {
      const client = clientList.find(c => c.id === parseInt(clientId))
      if (client) {
        setFormData({
          ...formData,
          client_id: clientId,
          client_name: client.name,
          client_phone: client.phone || '',
          client_nik: client.nik || ''
        })
      }
    } else {
      setFormData({
        ...formData,
        client_id: '',
        client_name: '',
        client_phone: '',
        client_nik: ''
      })
    }
  }

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    try {
      const response = await axios.post(`${API_URL}/queue`, formData)
      const queueData = response.data
      
      // Auto-print tiket thermal
      console.log('🖨️ Printing thermal ticket...')
      try {
        const printResult = await printThermalTicket(queueData, {
          organization_name: settings.organization_name || 'BAPAS KELAS I BANDUNG',
          system_name: 'KIANSANTANG',
          address: 'Jl. Soekarno Hatta No. 748, Bandung',
          phone: '(022) 7534015'
        })
        
        if (printResult.success) {
          console.log(`✅ Ticket printed successfully via ${printResult.method}`)
        } else {
          console.warn('⚠️ Print failed:', printResult.error)
          // Tidak menampilkan error ke user, karena registrasi tetap berhasil
        }
      } catch (printError) {
        console.error('❌ Print error:', printError)
        // Tidak menampilkan error ke user, karena registrasi tetap berhasil
      }
      
      // Lanjutkan ke success screen
      onSuccess(queueData)
    } catch (err) {
      setError(err.response?.data?.error || 'Terjadi kesalahan saat mendaftar')
    } finally {
      setLoading(false)
    }
  }

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
          {/* Back Button */}
          <button
            onClick={onBack}
            className="mb-6 flex items-center text-white hover:text-white/80 transition-colors font-semibold animate-slide-down"
          >
            <ArrowLeft className="w-5 h-5 mr-2" />
            Kembali ke Pilihan Layanan
          </button>

          {/* Header Card */}
          <div className="bg-white/95 backdrop-blur-xl rounded-3xl shadow-2xl p-8 mb-6 border border-white/20 animate-slide-down">
            <div className="text-center">
              <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl mb-6 shadow-lg">
                <Users className="w-12 h-12 text-white" />
              </div>

              <h1 className="text-4xl font-black text-gray-800 mb-3 bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
                {service.name}
              </h1>
              <p className="text-gray-600 text-lg mb-2">{service.description}</p>
              <div className="inline-block bg-blue-100 text-blue-800 px-6 py-2 rounded-full font-semibold">
                Estimasi: ~{service.estimated_time} menit
              </div>
            </div>
          </div>

          {/* Form Card */}
          <div className="bg-white/95 backdrop-blur-xl rounded-3xl shadow-2xl p-8 border border-white/20 animate-slide-up">
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
              {/* Bimbingan Wajib Lapor - Special Form */}
              {isBimbinganWajibLapor ? (
                <>
                  {/* Select PK with Search */}
                  <div className="group">
                    <label className="block text-sm font-bold text-gray-700 mb-3 flex items-center">
                      <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                        Pilih Pembimbing Kemasyarakatan (PK)
                      </span>
                      <span className="text-red-500 ml-1">*</span>
                    </label>
                    
                    {/* Search Input */}
                    <div className="relative mb-3">
                      <div className="absolute left-4 top-1/2 transform -translate-y-1/2 w-10 h-10 bg-gradient-to-br from-purple-500 to-pink-600 rounded-lg flex items-center justify-center">
                        <Search className="w-5 h-5 text-white" />
                      </div>
                      <input
                        type="text"
                        value={pkSearch}
                        onChange={(e) => setPkSearch(e.target.value)}
                        placeholder="Cari nama, NIP, atau jabatan..."
                        className="w-full pl-16 pr-5 py-3 border-2 border-gray-300 rounded-xl focus:ring-4 focus:ring-purple-500/20 focus:border-purple-500 outline-none transition-all duration-300 font-semibold text-gray-800 placeholder-gray-400"
                      />
                    </div>

                    {/* Dropdown */}
                    <div className="relative">
                      <div className="absolute left-4 top-1/2 transform -translate-y-1/2 w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                        <UserCheck className="w-5 h-5 text-white" />
                      </div>
                      <select
                        value={formData.pk_id}
                        onChange={handlePKChange}
                        required
                        className="w-full pl-16 pr-5 py-4 border-2 border-gray-300 rounded-xl focus:ring-4 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all duration-300 appearance-none bg-white font-semibold text-gray-800 cursor-pointer hover:border-blue-400"
                      >
                        <option value="">-- Pilih PK --</option>
                        {filteredPkList.map(pk => (
                          <option key={pk.id} value={pk.id}>
                            {pk.name} {pk.jabatan ? `- ${pk.jabatan}` : ''}
                          </option>
                        ))}
                      </select>
                      <ArrowRight className="absolute right-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none rotate-90" />
                    </div>
                    
                    {filteredPkList.length === 0 && pkSearch && (
                      <p className="mt-2 text-sm text-orange-600">
                        Tidak ada PK yang cocok dengan pencarian "{pkSearch}"
                      </p>
                    )}
                    
                    {selectedPK && (
                      <div className="mt-3 p-3 bg-blue-50 border border-blue-200 rounded-lg animate-fade-in">
                        <p className="text-sm text-blue-800">
                          <strong>NIP:</strong> {selectedPK.nip}<br />
                          <strong>Telepon:</strong> {selectedPK.phone}
                          {selectedPK.jabatan && (
                            <>
                              <br /><strong>Jabatan:</strong> {selectedPK.jabatan}
                            </>
                          )}
                        </p>
                      </div>
                    )}
                  </div>

                  {/* Toggle: Existing Client vs Manual Input */}
                  {formData.pk_id && (
                    <div className="animate-fade-in">
                      <div className="flex items-center justify-center gap-4 mb-6">
                        <button
                          type="button"
                          onClick={handleToggleManualInput}
                          className={`flex-1 py-3 px-6 rounded-xl font-bold transition-all duration-300 flex items-center justify-center ${
                            !isManualInput
                              ? 'bg-gradient-to-r from-green-500 to-emerald-600 text-white shadow-lg scale-105'
                              : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                          }`}
                        >
                          <Database className="w-5 h-5 mr-2" />
                          Klien dari Database
                        </button>
                        <button
                          type="button"
                          onClick={handleToggleManualInput}
                          className={`flex-1 py-3 px-6 rounded-xl font-bold transition-all duration-300 flex items-center justify-center ${
                            isManualInput
                              ? 'bg-gradient-to-r from-purple-500 to-pink-600 text-white shadow-lg scale-105'
                              : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                          }`}
                        >
                          <UserPlus className="w-5 h-5 mr-2" />
                          Input Manual
                        </button>
                      </div>

                      {/* Existing Client Selection with Search */}
                      {!isManualInput ? (
                        <div className="group">
                          <label className="block text-sm font-bold text-gray-700 mb-3 flex items-center">
                            <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                              Pilih Nama Klien
                            </span>
                            <span className="text-red-500 ml-1">*</span>
                          </label>
                          
                          {/* Search Input for Client */}
                          {clientList.length > 0 && (
                            <div className="relative mb-3">
                              <div className="absolute left-4 top-1/2 transform -translate-y-1/2 w-10 h-10 bg-gradient-to-br from-orange-500 to-red-600 rounded-lg flex items-center justify-center">
                                <Search className="w-5 h-5 text-white" />
                              </div>
                              <input
                                type="text"
                                value={clientSearch}
                                onChange={(e) => setClientSearch(e.target.value)}
                                placeholder="Cari nama atau NIK klien..."
                                className="w-full pl-16 pr-5 py-3 border-2 border-gray-300 rounded-xl focus:ring-4 focus:ring-orange-500/20 focus:border-orange-500 outline-none transition-all duration-300 font-semibold text-gray-800 placeholder-gray-400"
                              />
                            </div>
                          )}

                          {/* Dropdown */}
                          <div className="relative">
                            <div className="absolute left-4 top-1/2 transform -translate-y-1/2 w-10 h-10 bg-gradient-to-br from-green-500 to-emerald-600 rounded-lg flex items-center justify-center">
                              <Database className="w-5 h-5 text-white" />
                            </div>
                            <select
                              value={formData.client_id}
                              onChange={handleClientChange}
                              required
                              className="w-full pl-16 pr-5 py-4 border-2 border-gray-300 rounded-xl focus:ring-4 focus:ring-green-500/20 focus:border-green-500 outline-none transition-all duration-300 appearance-none bg-white font-semibold text-gray-800 cursor-pointer hover:border-green-400"
                            >
                              <option value="">-- Pilih Klien --</option>
                              {filteredClientList.map(client => (
                                <option key={client.id} value={client.id}>
                                  {client.name} {client.nik ? `(${client.nik})` : ''}
                                </option>
                              ))}
                            </select>
                            <ArrowRight className="absolute right-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none rotate-90" />
                          </div>
                          
                          {filteredClientList.length === 0 && clientSearch && (
                            <p className="mt-2 text-sm text-orange-600">
                              Tidak ada klien yang cocok dengan pencarian "{clientSearch}"
                            </p>
                          )}
                          
                          {clientList.length === 0 && (
                            <p className="mt-2 text-sm text-orange-600 bg-orange-50 p-3 rounded-lg border border-orange-200">
                              ⚠️ Tidak ada klien di database untuk PK ini. Gunakan <strong>Input Manual</strong> untuk mendaftar klien baru.
                            </p>
                          )}
                        </div>
                      ) : (
                        /* Manual Input Fields */
                        <div className="space-y-6">
                          {/* Client Name */}
                          <div className="group">
                            <label className="block text-sm font-bold text-gray-700 mb-3 flex items-center">
                              <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                                Nama Lengkap Klien
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
                                placeholder="Masukkan nama lengkap klien"
                                className="w-full pl-16 pr-5 py-4 border-2 border-gray-300 rounded-xl focus:ring-4 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all duration-300 font-semibold text-gray-800 placeholder-gray-400"
                              />
                            </div>
                          </div>

                          {/* Client Phone */}
                          <div className="group">
                            <label className="block text-sm font-bold text-gray-700 mb-3 flex items-center">
                              <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                                Nomor Telepon Klien
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

                          {/* Client NIK */}
                          <div className="group">
                            <label className="block text-sm font-bold text-gray-700 mb-3 flex items-center">
                              <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                                NIK Klien
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

                          {/* Info Box */}
                          <div className="bg-purple-50 border-2 border-purple-200 rounded-xl p-4">
                            <p className="text-sm text-purple-800">
                              <strong>ℹ️ Info:</strong> Data klien yang Anda masukkan akan tersimpan untuk pendaftaran berikutnya.
                            </p>
                          </div>
                        </div>
                      )}
                    </div>
                  )}
                </>
              ) : (
                <>
                  {/* Standard Form - Client Name */}
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
                </>
              )}

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
        </div>
      </div>
    </div>
  )
}
