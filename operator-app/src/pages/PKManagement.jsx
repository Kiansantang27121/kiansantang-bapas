import { useState, useEffect } from 'react'
import axios from 'axios'
import { API_URL } from '../config'
import { Plus, Edit2, Trash2, Save, X, Search, UserCheck, Phone, Briefcase, FileText, Download } from 'lucide-react'

export default function PKManagement() {
  const [pkList, setPkList] = useState([])
  const [filteredPkList, setFilteredPkList] = useState([])
  const [searchTerm, setSearchTerm] = useState('')
  const [loading, setLoading] = useState(false)
  const [editingPK, setEditingPK] = useState(null)
  const [showForm, setShowForm] = useState(false)
  const [formData, setFormData] = useState({
    name: '',
    nip: '',
    phone: '',
    jabatan: ''
  })
  const [googleSheetUrl, setGoogleSheetUrl] = useState('')
  const [syncLoading, setSyncLoading] = useState(false)

  useEffect(() => {
    fetchPKList()
    fetchGoogleSheetUrl()
  }, [])

  useEffect(() => {
    const filtered = pkList.filter(pk => 
      pk.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (pk.nip && pk.nip.includes(searchTerm)) ||
      (pk.jabatan && pk.jabatan.toLowerCase().includes(searchTerm.toLowerCase()))
    )
    setFilteredPkList(filtered)
  }, [searchTerm, pkList])

  const fetchPKList = async () => {
    try {
      const response = await axios.get(`${API_URL}/pk`)
      setPkList(response.data)
      setFilteredPkList(response.data)
    } catch (error) {
      console.error('Error fetching PK:', error)
      alert('Gagal memuat data PK')
    }
  }

  const fetchGoogleSheetUrl = async () => {
    try {
      const response = await axios.get(`${API_URL}/google-sheets/pk-sheet-url`)
      setGoogleSheetUrl(response.data.url || '')
    } catch (error) {
      console.error('Error fetching sheet URL:', error)
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    try {
      if (editingPK) {
        await axios.put(`${API_URL}/pk/${editingPK.id}`, formData)
        alert('PK berhasil diupdate')
      } else {
        await axios.post(`${API_URL}/pk`, formData)
        alert('PK berhasil ditambahkan')
      }
      fetchPKList()
      resetForm()
    } catch (error) {
      console.error('Error:', error)
      alert('Gagal menyimpan data PK')
    } finally {
      setLoading(false)
    }
  }

  const handleEdit = (pk) => {
    setEditingPK(pk)
    setFormData({
      name: pk.name,
      nip: pk.nip || '',
      phone: pk.phone || '',
      jabatan: pk.jabatan || ''
    })
    setShowForm(true)
  }

  const handleDelete = async (id) => {
    if (!confirm('Yakin ingin menghapus PK ini?')) return
    
    try {
      await axios.delete(`${API_URL}/pk/${id}`)
      alert('PK berhasil dihapus')
      fetchPKList()
    } catch (error) {
      console.error('Error:', error)
      alert('Gagal menghapus PK')
    }
  }

  const resetForm = () => {
    setFormData({ name: '', nip: '', phone: '', jabatan: '' })
    setEditingPK(null)
    setShowForm(false)
  }

  const handleSyncGoogleSheets = async () => {
    if (!googleSheetUrl) {
      alert('Masukkan URL Google Sheets terlebih dahulu')
      return
    }

    setSyncLoading(true)
    try {
      const response = await axios.post(`${API_URL}/google-sheets/sync-pk`, {
        sheetUrl: googleSheetUrl
      })
      alert(`Sync berhasil!\n${response.data.synced} PK baru ditambahkan\n${response.data.updated} PK diupdate`)
      fetchPKList()
    } catch (error) {
      console.error('Error:', error)
      alert(error.response?.data?.error || 'Gagal sync dari Google Sheets')
    } finally {
      setSyncLoading(false)
    }
  }

  const exportToCSV = () => {
    const headers = ['Nama', 'NIP', 'Telepon', 'Jabatan']
    const rows = pkList.map(pk => [
      pk.name,
      pk.nip || '',
      pk.phone || '',
      pk.jabatan || ''
    ])
    
    const csvContent = [
      headers.join(','),
      ...rows.map(row => row.map(cell => `"${cell}"`).join(','))
    ].join('\n')
    
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
    const link = document.createElement('a')
    link.href = URL.createObjectURL(blob)
    link.download = `data-pk-${new Date().toISOString().split('T')[0]}.csv`
    link.click()
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-gray-800">Management PK</h1>
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
            Tambah PK
          </button>
        </div>
      </div>

      {/* Google Sheets Sync */}
      <div className="bg-gradient-to-r from-purple-50 to-blue-50 rounded-lg shadow-md p-6 mb-6 border-2 border-purple-200">
        <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center">
          <FileText className="w-6 h-6 mr-2 text-purple-600" />
          Sync dari Google Sheets
        </h2>
        
        {/* Format Info */}
        <div className="bg-white rounded-lg p-4 mb-4 border-2 border-purple-200">
          <p className="font-semibold text-gray-700 mb-2">📋 Format Google Sheets (Baris 1 - Header):</p>
          <div className="bg-gray-100 p-3 rounded font-mono text-sm overflow-x-auto">
            <table className="min-w-full">
              <thead>
                <tr className="border-b-2 border-gray-300">
                  <th className="px-4 py-2 text-left">Nama</th>
                  <th className="px-4 py-2 text-left">NIP</th>
                  <th className="px-4 py-2 text-left">Telepon</th>
                  <th className="px-4 py-2 text-left">Jabatan</th>
                </tr>
              </thead>
              <tbody>
                <tr className="text-gray-600">
                  <td className="px-4 py-2">Budi Santoso, S.Sos</td>
                  <td className="px-4 py-2">198501012010011001</td>
                  <td className="px-4 py-2">081234567890</td>
                  <td className="px-4 py-2">Pembimbing Kemasyarakatan Ahli Muda</td>
                </tr>
              </tbody>
            </table>
          </div>
          <p className="text-xs text-gray-600 mt-2">
            ⚠️ <strong>Penting:</strong> Header harus di baris 1, urutan kolom harus sama persis seperti di atas.
          </p>
        </div>

        <div className="flex gap-3">
          <input
            type="text"
            value={googleSheetUrl}
            onChange={(e) => setGoogleSheetUrl(e.target.value)}
            placeholder="https://docs.google.com/spreadsheets/d/YOUR_SHEET_ID/edit"
            className="flex-1 px-4 py-2 border-2 border-purple-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
          />
          <button
            onClick={handleSyncGoogleSheets}
            disabled={syncLoading}
            className="bg-gradient-to-r from-purple-500 to-blue-500 text-white px-6 py-2 rounded-lg font-semibold hover:from-purple-600 hover:to-blue-600 disabled:opacity-50 flex items-center whitespace-nowrap"
          >
            {syncLoading ? 'Syncing...' : '🔄 Sync Now'}
          </button>
        </div>
        <p className="text-sm text-gray-600 mt-2">
          ✅ Pastikan sheet di-share dengan "Anyone with the link" → "Viewer"
        </p>
      </div>

      {/* Search */}
      <div className="bg-white rounded-lg shadow-md p-4 mb-6">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Cari nama, NIP, atau jabatan..."
            className="w-full pl-10 pr-4 py-2 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>
      </div>

      {/* Form Modal */}
      {showForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl p-8 max-w-2xl w-full mx-4">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-gray-800">
                {editingPK ? 'Edit PK' : 'Tambah PK Baru'}
              </h2>
              <button onClick={resetForm} className="text-gray-500 hover:text-gray-700">
                <X className="w-6 h-6" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Nama Lengkap *
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  required
                  placeholder="Contoh: Budi Santoso, S.Sos"
                  className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  NIP (18 digit)
                </label>
                <input
                  type="text"
                  value={formData.nip}
                  onChange={(e) => setFormData({ ...formData, nip: e.target.value })}
                  placeholder="198501012010011001"
                  maxLength="18"
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
                  Jabatan
                </label>
                <select
                  value={formData.jabatan}
                  onChange={(e) => setFormData({ ...formData, jabatan: e.target.value })}
                  className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="">-- Pilih Jabatan --</option>
                  <option value="APK">APK (Ahli Pembimbing Kemasyarakatan)</option>
                  <option value="PK Madya">PK Madya</option>
                  <option value="PK Muda">PK Muda</option>
                  <option value="PK Pertama">PK Pertama</option>
                </select>
                <p className="text-xs text-gray-500 mt-1">
                  💡 Jabatan ini akan digunakan untuk routing antrian otomatis
                </p>
              </div>

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

      {/* PK List */}
      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gradient-to-r from-blue-500 to-purple-500">
              <tr>
                <th className="px-6 py-4 text-left text-xs font-bold text-white uppercase tracking-wider">
                  Nama
                </th>
                <th className="px-6 py-4 text-left text-xs font-bold text-white uppercase tracking-wider">
                  NIP
                </th>
                <th className="px-6 py-4 text-left text-xs font-bold text-white uppercase tracking-wider">
                  Telepon
                </th>
                <th className="px-6 py-4 text-left text-xs font-bold text-white uppercase tracking-wider">
                  Jabatan
                </th>
                <th className="px-6 py-4 text-left text-xs font-bold text-white uppercase tracking-wider">
                  Aksi
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredPkList.length === 0 ? (
                <tr>
                  <td colSpan="5" className="px-6 py-8 text-center text-gray-500">
                    {searchTerm ? 'Tidak ada hasil pencarian' : 'Belum ada data PK'}
                  </td>
                </tr>
              ) : (
                filteredPkList.map((pk) => (
                  <tr key={pk.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center">
                        <UserCheck className="w-5 h-5 text-blue-500 mr-2" />
                        <span className="font-semibold text-gray-800">{pk.name}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-gray-600">
                      {pk.nip || '-'}
                    </td>
                    <td className="px-6 py-4">
                      {pk.phone ? (
                        <div className="flex items-center text-gray-600">
                          <Phone className="w-4 h-4 mr-1 text-green-500" />
                          {pk.phone}
                        </div>
                      ) : '-'}
                    </td>
                    <td className="px-6 py-4">
                      {pk.jabatan ? (
                        <div className="flex items-center">
                          <Briefcase className="w-4 h-4 mr-1 text-purple-500" />
                          <span className="text-sm text-gray-600">{pk.jabatan}</span>
                        </div>
                      ) : '-'}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex gap-2">
                        <button
                          onClick={() => handleEdit(pk)}
                          className="bg-yellow-500 text-white p-2 rounded hover:bg-yellow-600 transition-colors"
                          title="Edit"
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDelete(pk.id)}
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
      <div className="mt-6 bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg shadow-md p-6 border-2 border-blue-200">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-gray-600">Total PK</p>
            <p className="text-3xl font-bold text-blue-600">{pkList.length}</p>
          </div>
          <div>
            <p className="text-sm text-gray-600">Hasil Pencarian</p>
            <p className="text-3xl font-bold text-purple-600">{filteredPkList.length}</p>
          </div>
        </div>
      </div>
    </div>
  )
}
