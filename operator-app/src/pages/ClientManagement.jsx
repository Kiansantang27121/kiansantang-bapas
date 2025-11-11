import { useState, useEffect } from 'react'
import axios from 'axios'
import { API_URL } from '../config'
import { Plus, Edit2, Trash2, Save, X, Search, User, CreditCard, Phone, MapPin, FileText, Download, Filter } from 'lucide-react'

export default function ClientManagement() {
  const [clientList, setClientList] = useState([])
  const [filteredClientList, setFilteredClientList] = useState([])
  const [pkList, setPkList] = useState([])
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedPK, setSelectedPK] = useState('')
  const [loading, setLoading] = useState(false)
  const [editingClient, setEditingClient] = useState(null)
  const [showForm, setShowForm] = useState(false)
  const [formData, setFormData] = useState({
    pk_id: '',
    name: '',
    nik: '',
    phone: '',
    whatsapp: '',
    address: '',
    program: '',
    is_working: false,
    job: ''
  })
  const [googleSheetUrl, setGoogleSheetUrl] = useState('')
  const [syncLoading, setSyncLoading] = useState(false)

  useEffect(() => {
    fetchPKList()
    fetchClientList()
  }, [])

  useEffect(() => {
    let filtered = clientList

    // Filter by search term
    if (searchTerm) {
      filtered = filtered.filter(client => 
        client.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (client.nik && client.nik.includes(searchTerm)) ||
        (client.address && client.address.toLowerCase().includes(searchTerm.toLowerCase()))
      )
    }

    // Filter by PK
    if (selectedPK) {
      filtered = filtered.filter(client => client.pk_id === parseInt(selectedPK))
    }

    setFilteredClientList(filtered)
  }, [searchTerm, selectedPK, clientList])

  const fetchPKList = async () => {
    try {
      const response = await axios.get(`${API_URL}/pk`)
      setPkList(response.data)
    } catch (error) {
      console.error('Error fetching PK:', error)
    }
  }

  const fetchClientList = async () => {
    try {
      const response = await axios.get(`${API_URL}/clients`)
      setClientList(response.data)
      setFilteredClientList(response.data)
    } catch (error) {
      console.error('Error fetching clients:', error)
      alert('Gagal memuat data klien')
    }
  }

  const fetchGoogleSheetUrl = async (pkId) => {
    try {
      const response = await axios.get(`${API_URL}/google-sheets/clients-sheet-url/${pkId}`)
      setGoogleSheetUrl(response.data.url || '')
    } catch (error) {
      console.error('Error fetching sheet URL:', error)
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    try {
      if (editingClient) {
        await axios.put(`${API_URL}/clients/${editingClient.id}`, formData)
        alert('Klien berhasil diupdate')
      } else {
        await axios.post(`${API_URL}/clients`, formData)
        alert('Klien berhasil ditambahkan')
      }
      fetchClientList()
      resetForm()
    } catch (error) {
      console.error('Error:', error)
      alert('Gagal menyimpan data klien')
    } finally {
      setLoading(false)
    }
  }

  const handleEdit = (client) => {
    setEditingClient(client)
    setFormData({
      pk_id: client.pk_id,
      name: client.name,
      nik: client.nik || '',
      phone: client.phone || '',
      whatsapp: client.whatsapp || '',
      address: client.address || '',
      program: client.program || '',
      is_working: client.is_working || false,
      job: client.job || ''
    })
    setShowForm(true)
  }

  const handleDelete = async (id) => {
    if (!confirm('Yakin ingin menghapus klien ini?')) return
    
    try {
      await axios.delete(`${API_URL}/clients/${id}`)
      alert('Klien berhasil dihapus')
      fetchClientList()
    } catch (error) {
      console.error('Error:', error)
      alert('Gagal menghapus klien')
    }
  }

  const resetForm = () => {
    setFormData({ 
      pk_id: '', 
      name: '', 
      nik: '', 
      phone: '', 
      whatsapp: '',
      address: '', 
      program: '',
      is_working: false,
      job: ''
    })
    setEditingClient(null)
    setShowForm(false)
  }

  const handleSyncGoogleSheets = async () => {
    if (!selectedPK) {
      alert('Pilih PK terlebih dahulu')
      return
    }

    if (!googleSheetUrl) {
      alert('Masukkan URL Google Sheets terlebih dahulu')
      return
    }

    setSyncLoading(true)
    try {
      const response = await axios.post(`${API_URL}/google-sheets/sync-clients`, {
        sheetUrl: googleSheetUrl,
        pkId: selectedPK
      })
      alert(`Sync berhasil!\n${response.data.synced} klien baru ditambahkan\n${response.data.updated} klien diupdate`)
      fetchClientList()
    } catch (error) {
      console.error('Error:', error)
      alert(error.response?.data?.error || 'Gagal sync dari Google Sheets')
    } finally {
      setSyncLoading(false)
    }
  }

  const exportToCSV = () => {
    const headers = ['Nama', 'NIK', 'Telepon', 'Alamat', 'PK']
    const rows = filteredClientList.map(client => {
      const pk = pkList.find(p => p.id === client.pk_id)
      return [
        client.name,
        client.nik || '',
        client.phone || '',
        client.address || '',
        pk?.name || ''
      ]
    })
    
    const csvContent = [
      headers.join(','),
      ...rows.map(row => row.map(cell => `"${cell}"`).join(','))
    ].join('\n')
    
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
    const link = document.createElement('a')
    link.href = URL.createObjectURL(blob)
    link.download = `data-klien-${new Date().toISOString().split('T')[0]}.csv`
    link.click()
  }

  const getPKName = (pkId) => {
    const pk = pkList.find(p => p.id === pkId)
    return pk?.name || '-'
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-gray-800">Management Klien</h1>
        <div className="flex gap-3">
          <button
            onClick={exportToCSV}
            className="bg-green-500 text-white px-6 py-2 rounded-lg font-semibold hover:bg-green-600 flex items-center"
          >
            <Download className="w-5 h-5 mr-2" />
            Export CSV
          </button>
          <button
            onClick={() => setShowForm(true)}
            className="bg-blue-500 text-white px-6 py-2 rounded-lg font-semibold hover:bg-blue-600 flex items-center"
          >
            <Plus className="w-5 h-5 mr-2" />
            Tambah Klien
          </button>
        </div>
      </div>

      {/* Google Sheets Sync */}
      <div className="bg-gradient-to-r from-orange-50 to-red-50 rounded-lg shadow-md p-6 mb-6 border-2 border-orange-200">
        <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center">
          <FileText className="w-6 h-6 mr-2 text-orange-600" />
          Sync Klien dari Google Sheets
        </h2>
        
        {/* Format Info */}
        <div className="bg-white rounded-lg p-4 mb-4 border-2 border-orange-200">
          <p className="font-semibold text-gray-700 mb-2">📋 Format Google Sheets (Baris 1 - Header):</p>
          <div className="bg-gray-100 p-3 rounded font-mono text-sm overflow-x-auto">
            <table className="min-w-full">
              <thead>
                <tr className="border-b-2 border-gray-300">
                  <th className="px-4 py-2 text-left">Nama</th>
                  <th className="px-4 py-2 text-left">NIK</th>
                  <th className="px-4 py-2 text-left">Telepon</th>
                  <th className="px-4 py-2 text-left">Alamat</th>
                </tr>
              </thead>
              <tbody>
                <tr className="text-gray-600">
                  <td className="px-4 py-2">Andi Wijaya</td>
                  <td className="px-4 py-2">3201010101900001</td>
                  <td className="px-4 py-2">081234560001</td>
                  <td className="px-4 py-2">Jl. Merdeka No. 10, Bandung</td>
                </tr>
              </tbody>
            </table>
          </div>
          <p className="text-xs text-gray-600 mt-2">
            ⚠️ <strong>Penting:</strong> Header harus di baris 1, urutan kolom harus sama persis. Buat tab terpisah per PK.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mb-3">
          <select
            value={selectedPK}
            onChange={(e) => {
              setSelectedPK(e.target.value)
              if (e.target.value) {
                fetchGoogleSheetUrl(e.target.value)
              }
            }}
            className="px-4 py-2 border-2 border-orange-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
          >
            <option value="">-- Pilih PK --</option>
            {pkList.map(pk => (
              <option key={pk.id} value={pk.id}>{pk.name}</option>
            ))}
          </select>
          <input
            type="text"
            value={googleSheetUrl}
            onChange={(e) => setGoogleSheetUrl(e.target.value)}
            placeholder="https://docs.google.com/spreadsheets/d/.../edit#gid=123"
            className="md:col-span-2 px-4 py-2 border-2 border-orange-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
          />
        </div>
        <div className="flex gap-3">
          <button
            onClick={handleSyncGoogleSheets}
            disabled={syncLoading || !selectedPK}
            className="bg-gradient-to-r from-orange-500 to-red-500 text-white px-6 py-2 rounded-lg font-semibold hover:from-orange-600 hover:to-red-600 disabled:opacity-50 flex items-center"
          >
            {syncLoading ? 'Syncing...' : '🔄 Sync Now'}
          </button>
        </div>
        <p className="text-sm text-gray-600 mt-2">
          ✅ URL harus include <code className="bg-gray-200 px-1 rounded">gid=</code> (tab ID). Sheet di-share "Anyone with the link" → "Viewer"
        </p>
      </div>

      {/* Search & Filter */}
      <div className="bg-white rounded-lg shadow-md p-4 mb-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Cari nama, NIK, atau alamat..."
              className="w-full pl-10 pr-4 py-2 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          <div className="relative">
            <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <select
              value={selectedPK}
              onChange={(e) => setSelectedPK(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="">-- Semua PK --</option>
              {pkList.map(pk => (
                <option key={pk.id} value={pk.id}>{pk.name}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Form Modal */}
      {showForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl p-8 max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-gray-800">
                {editingClient ? 'Edit Klien' : 'Tambah Klien Baru'}
              </h2>
              <button onClick={resetForm} className="text-gray-500 hover:text-gray-700">
                <X className="w-6 h-6" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Pilih PK *
                </label>
                <select
                  value={formData.pk_id}
                  onChange={(e) => setFormData({ ...formData, pk_id: e.target.value })}
                  required
                  className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="">-- Pilih PK --</option>
                  {pkList.map(pk => (
                    <option key={pk.id} value={pk.id}>{pk.name}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Nama Lengkap *
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  required
                  placeholder="Contoh: Andi Wijaya"
                  className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  NIK (16 digit)
                </label>
                <input
                  type="text"
                  value={formData.nik}
                  onChange={(e) => setFormData({ ...formData, nik: e.target.value })}
                  placeholder="3201010101900001"
                  maxLength="16"
                  className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Nomor Telepon
                </label>
                <input
                  type="text"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  placeholder="081234567890"
                  className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Nomor WhatsApp
                </label>
                <input
                  type="text"
                  value={formData.whatsapp}
                  onChange={(e) => setFormData({ ...formData, whatsapp: e.target.value })}
                  placeholder="081234567890"
                  className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Alamat Lengkap
                </label>
                <textarea
                  value={formData.address}
                  onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                  placeholder="Jl. Merdeka No. 10, Bandung"
                  rows="3"
                  className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Program *
                </label>
                <select
                  value={formData.program}
                  onChange={(e) => setFormData({ ...formData, program: e.target.value })}
                  required
                  className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="">-- Pilih Program --</option>
                  <option value="PB">PB (Pembimbingan)</option>
                  <option value="CB">CB (Cuti Bersyarat)</option>
                  <option value="CMB">CMB (Cuti Menjelang Bebas)</option>
                  <option value="Asimilasi">Asimilasi</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Status Pekerjaan
                </label>
                <div className="flex items-center space-x-4">
                  <label className="flex items-center">
                    <input
                      type="radio"
                      checked={formData.is_working === false}
                      onChange={() => setFormData({ ...formData, is_working: false, job: '' })}
                      className="mr-2"
                    />
                    <span>Tidak Bekerja</span>
                  </label>
                  <label className="flex items-center">
                    <input
                      type="radio"
                      checked={formData.is_working === true}
                      onChange={() => setFormData({ ...formData, is_working: true })}
                      className="mr-2"
                    />
                    <span>Bekerja</span>
                  </label>
                </div>
              </div>

              {formData.is_working && (
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Pekerjaan *
                  </label>
                  <input
                    type="text"
                    value={formData.job}
                    onChange={(e) => setFormData({ ...formData, job: e.target.value })}
                    required={formData.is_working}
                    placeholder="Contoh: Karyawan Toko, Buruh Bangunan, Wiraswasta"
                    className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
              )}

              <div className="flex gap-3 pt-4">
                <button
                  type="submit"
                  disabled={loading}
                  className="flex-1 bg-blue-500 text-white py-3 rounded-lg font-semibold hover:bg-blue-600 disabled:opacity-50 flex items-center justify-center"
                >
                  <Save className="w-5 h-5 mr-2" />
                  {loading ? 'Menyimpan...' : 'Simpan'}
                </button>
                <button
                  type="button"
                  onClick={resetForm}
                  className="flex-1 bg-gray-300 text-gray-700 py-3 rounded-lg font-semibold hover:bg-gray-400"
                >
                  Batal
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Client List */}
      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gradient-to-r from-orange-500 to-red-500">
              <tr>
                <th className="px-6 py-4 text-left text-xs font-bold text-white uppercase tracking-wider">
                  Nama
                </th>
                <th className="px-6 py-4 text-left text-xs font-bold text-white uppercase tracking-wider">
                  NIK
                </th>
                <th className="px-6 py-4 text-left text-xs font-bold text-white uppercase tracking-wider">
                  Telepon
                </th>
                <th className="px-6 py-4 text-left text-xs font-bold text-white uppercase tracking-wider">
                  Alamat
                </th>
                <th className="px-6 py-4 text-left text-xs font-bold text-white uppercase tracking-wider">
                  PK
                </th>
                <th className="px-6 py-4 text-left text-xs font-bold text-white uppercase tracking-wider">
                  Aksi
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredClientList.length === 0 ? (
                <tr>
                  <td colSpan="6" className="px-6 py-8 text-center text-gray-500">
                    {searchTerm || selectedPK ? 'Tidak ada hasil pencarian' : 'Belum ada data klien'}
                  </td>
                </tr>
              ) : (
                filteredClientList.map((client) => (
                  <tr key={client.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center">
                        <User className="w-5 h-5 text-orange-500 mr-2" />
                        <span className="font-semibold text-gray-800">{client.name}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      {client.nik ? (
                        <div className="flex items-center text-gray-600">
                          <CreditCard className="w-4 h-4 mr-1 text-blue-500" />
                          {client.nik}
                        </div>
                      ) : '-'}
                    </td>
                    <td className="px-6 py-4">
                      {client.phone ? (
                        <div className="flex items-center text-gray-600">
                          <Phone className="w-4 h-4 mr-1 text-green-500" />
                          {client.phone}
                        </div>
                      ) : '-'}
                    </td>
                    <td className="px-6 py-4">
                      {client.address ? (
                        <div className="flex items-start text-gray-600">
                          <MapPin className="w-4 h-4 mr-1 text-red-500 mt-0.5" />
                          <span className="text-sm">{client.address}</span>
                        </div>
                      ) : '-'}
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-sm font-medium text-purple-600">
                        {getPKName(client.pk_id)}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex gap-2">
                        <button
                          onClick={() => handleEdit(client)}
                          className="bg-yellow-500 text-white p-2 rounded hover:bg-yellow-600 transition-colors"
                          title="Edit"
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDelete(client.id)}
                          className="bg-red-500 text-white p-2 rounded hover:bg-red-600 transition-colors"
                          title="Hapus"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Stats */}
      <div className="mt-6 bg-gradient-to-r from-orange-50 to-red-50 rounded-lg shadow-md p-6 border-2 border-orange-200">
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          <div>
            <p className="text-sm text-gray-600">Total Klien</p>
            <p className="text-3xl font-bold text-orange-600">{clientList.length}</p>
          </div>
          <div>
            <p className="text-sm text-gray-600">Hasil Filter</p>
            <p className="text-3xl font-bold text-red-600">{filteredClientList.length}</p>
          </div>
          <div>
            <p className="text-sm text-gray-600">Total PK</p>
            <p className="text-3xl font-bold text-purple-600">{pkList.length}</p>
          </div>
        </div>
      </div>
    </div>
  )
}
