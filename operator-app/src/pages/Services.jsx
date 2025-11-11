import { useState, useEffect } from 'react'
import axios from 'axios'
import { API_URL } from '../config'
import { Plus, Edit, Trash } from 'lucide-react'

export default function Services() {
  const [services, setServices] = useState([])
  const [showModal, setShowModal] = useState(false)
  const [editingService, setEditingService] = useState(null)
  const [formData, setFormData] = useState({ name: '', description: '', estimated_time: 30, is_active: true })

  useEffect(() => {
    fetchServices()
  }, [])

  const fetchServices = async () => {
    try {
      const response = await axios.get(`${API_URL}/services/all`)
      setServices(response.data)
    } catch (error) {
      console.error('Error:', error)
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      if (editingService) {
        await axios.put(`${API_URL}/services/${editingService.id}`, formData)
      } else {
        await axios.post(`${API_URL}/services`, formData)
      }
      fetchServices()
      handleCloseModal()
    } catch (error) {
      alert(error.response?.data?.error || 'Gagal menyimpan')
    }
  }

  const handleEdit = (service) => {
    setEditingService(service)
    setFormData(service)
    setShowModal(true)
  }

  const handleDelete = async (id) => {
    if (!confirm('Yakin hapus layanan ini?')) return
    try {
      await axios.delete(`${API_URL}/services/${id}`)
      fetchServices()
    } catch (error) {
      alert(error.response?.data?.error || 'Gagal menghapus')
    }
  }

  const handleCloseModal = () => {
    setShowModal(false)
    setEditingService(null)
    setFormData({ name: '', description: '', estimated_time: 30, is_active: true })
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-gray-800">Kelola Layanan</h1>
        <button onClick={() => setShowModal(true)} className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 flex items-center">
          <Plus className="w-5 h-5 mr-2" />
          Tambah Layanan
        </button>
      </div>

      <div className="bg-white rounded-lg shadow overflow-hidden">
        <table className="min-w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Nama</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Deskripsi</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Estimasi (menit)</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Aksi</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {services.map(service => (
              <tr key={service.id}>
                <td className="px-6 py-4 font-semibold">{service.name}</td>
                <td className="px-6 py-4 text-sm text-gray-600">{service.description}</td>
                <td className="px-6 py-4">{service.estimated_time}</td>
                <td className="px-6 py-4">
                  <span className={`px-2 py-1 rounded text-xs font-semibold ${service.is_active ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                    {service.is_active ? 'Aktif' : 'Nonaktif'}
                  </span>
                </td>
                <td className="px-6 py-4">
                  <button onClick={() => handleEdit(service)} className="text-blue-600 hover:text-blue-800 mr-3">
                    <Edit className="w-5 h-5" />
                  </button>
                  <button onClick={() => handleDelete(service.id)} className="text-red-600 hover:text-red-800">
                    <Trash className="w-5 h-5" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-8 max-w-md w-full">
            <h2 className="text-2xl font-bold mb-4">{editingService ? 'Edit' : 'Tambah'} Layanan</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-semibold mb-2">Nama Layanan</label>
                <input type="text" value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})} required className="w-full px-4 py-2 border rounded-lg" />
              </div>
              <div>
                <label className="block text-sm font-semibold mb-2">Deskripsi</label>
                <textarea value={formData.description} onChange={(e) => setFormData({...formData, description: e.target.value})} className="w-full px-4 py-2 border rounded-lg" rows="3"></textarea>
              </div>
              <div>
                <label className="block text-sm font-semibold mb-2">Estimasi Waktu (menit)</label>
                <input type="number" value={formData.estimated_time} onChange={(e) => setFormData({...formData, estimated_time: parseInt(e.target.value)})} required className="w-full px-4 py-2 border rounded-lg" />
              </div>
              <div className="flex items-center">
                <input type="checkbox" checked={formData.is_active} onChange={(e) => setFormData({...formData, is_active: e.target.checked})} className="mr-2" />
                <label className="text-sm font-semibold">Aktif</label>
              </div>
              <div className="flex space-x-3">
                <button type="submit" className="flex-1 bg-blue-500 text-white py-2 rounded-lg hover:bg-blue-600">Simpan</button>
                <button type="button" onClick={handleCloseModal} className="flex-1 bg-gray-300 text-gray-700 py-2 rounded-lg hover:bg-gray-400">Batal</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
