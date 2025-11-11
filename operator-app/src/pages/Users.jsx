import { useState, useEffect } from 'react'
import axios from 'axios'
import { API_URL } from '../config'
import { Plus, Edit, Trash, Users as UsersIcon, UserCheck, Shield, Info } from 'lucide-react'

export default function Users() {
  const [users, setUsers] = useState([])
  const [showModal, setShowModal] = useState(false)
  const [editingUser, setEditingUser] = useState(null)
  const [formData, setFormData] = useState({ username: '', password: '', name: '', role: 'operator' })
  const [filterRole, setFilterRole] = useState('all')

  useEffect(() => {
    fetchUsers()
  }, [])

  const fetchUsers = async () => {
    try {
      const response = await axios.get(`${API_URL}/users`)
      setUsers(response.data)
    } catch (error) {
      console.error('Error:', error)
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      if (editingUser) {
        const data = { ...formData }
        if (!data.password) delete data.password
        await axios.put(`${API_URL}/users/${editingUser.id}`, data)
      } else {
        await axios.post(`${API_URL}/users`, formData)
      }
      fetchUsers()
      handleCloseModal()
    } catch (error) {
      alert(error.response?.data?.error || 'Gagal menyimpan')
    }
  }

  const handleEdit = (user) => {
    setEditingUser(user)
    setFormData({ username: user.username, password: '', name: user.name, role: user.role })
    setShowModal(true)
  }

  const handleDelete = async (id) => {
    if (!confirm('Yakin hapus pengguna ini?')) return
    try {
      await axios.delete(`${API_URL}/users/${id}`)
      fetchUsers()
    } catch (error) {
      alert(error.response?.data?.error || 'Gagal menghapus')
    }
  }

  const handleCloseModal = () => {
    setShowModal(false)
    setEditingUser(null)
    setFormData({ username: '', password: '', name: '', role: 'operator' })
  }

  const filteredUsers = filterRole === 'all' 
    ? users 
    : users.filter(user => user.role === filterRole)

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-800">Kelola Pengguna</h1>
        <button onClick={() => setShowModal(true)} className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 flex items-center">
          <Plus className="w-5 h-5 mr-2" />
          Tambah Pengguna
        </button>
      </div>

      {/* Info Card */}
      <div className="mb-6 bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-lg p-4">
        <div className="flex items-start gap-3">
          <Info className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" />
          <div>
            <h3 className="font-semibold text-blue-900 mb-2">Informasi Role Petugas</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-sm">
              <div className="flex items-start gap-2">
                <UsersIcon className="w-4 h-4 text-emerald-600 mt-0.5" />
                <div>
                  <p className="font-semibold text-emerald-700">Petugas Layanan</p>
                  <p className="text-gray-600">Kelola antrian dan layanan umum</p>
                </div>
              </div>
              <div className="flex items-start gap-2">
                <UserCheck className="w-4 h-4 text-teal-600 mt-0.5" />
                <div>
                  <p className="font-semibold text-teal-700">PK</p>
                  <p className="text-gray-600">Kelola klien wajib lapor</p>
                </div>
              </div>
              <div className="flex items-start gap-2">
                <Shield className="w-4 h-4 text-cyan-600 mt-0.5" />
                <div>
                  <p className="font-semibold text-cyan-700">Struktural</p>
                  <p className="text-gray-600">Monitor dan evaluasi kinerja</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="mb-6 bg-white rounded-lg shadow p-4">
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => setFilterRole('all')}
            className={`px-4 py-2 rounded-lg font-semibold transition-all ${
              filterRole === 'all' 
                ? 'bg-blue-500 text-white shadow-md' 
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            Semua ({users.length})
          </button>
          <button
            onClick={() => setFilterRole('admin')}
            className={`px-4 py-2 rounded-lg font-semibold transition-all inline-flex items-center gap-2 ${
              filterRole === 'admin' 
                ? 'bg-purple-500 text-white shadow-md' 
                : 'bg-purple-50 text-purple-700 hover:bg-purple-100'
            }`}
          >
            Admin ({users.filter(u => u.role === 'admin').length})
          </button>
          <button
            onClick={() => setFilterRole('operator')}
            className={`px-4 py-2 rounded-lg font-semibold transition-all ${
              filterRole === 'operator' 
                ? 'bg-blue-500 text-white shadow-md' 
                : 'bg-blue-50 text-blue-700 hover:bg-blue-100'
            }`}
          >
            Operator ({users.filter(u => u.role === 'operator').length})
          </button>
          <button
            onClick={() => setFilterRole('petugas_layanan')}
            className={`px-4 py-2 rounded-lg font-semibold transition-all inline-flex items-center gap-2 ${
              filterRole === 'petugas_layanan' 
                ? 'bg-emerald-500 text-white shadow-md' 
                : 'bg-emerald-50 text-emerald-700 hover:bg-emerald-100'
            }`}
          >
            <UsersIcon className="w-4 h-4" />
            Petugas Layanan ({users.filter(u => u.role === 'petugas_layanan').length})
          </button>
          <button
            onClick={() => setFilterRole('pk')}
            className={`px-4 py-2 rounded-lg font-semibold transition-all inline-flex items-center gap-2 ${
              filterRole === 'pk' 
                ? 'bg-teal-500 text-white shadow-md' 
                : 'bg-teal-50 text-teal-700 hover:bg-teal-100'
            }`}
          >
            <UserCheck className="w-4 h-4" />
            PK ({users.filter(u => u.role === 'pk').length})
          </button>
          <button
            onClick={() => setFilterRole('struktural')}
            className={`px-4 py-2 rounded-lg font-semibold transition-all inline-flex items-center gap-2 ${
              filterRole === 'struktural' 
                ? 'bg-cyan-500 text-white shadow-md' 
                : 'bg-cyan-50 text-cyan-700 hover:bg-cyan-100'
            }`}
          >
            <Shield className="w-4 h-4" />
            Struktural ({users.filter(u => u.role === 'struktural').length})
          </button>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow overflow-hidden">
        <table className="min-w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Username</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Nama</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Role</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Aksi</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {filteredUsers.map(user => (
              <tr key={user.id}>
                <td className="px-6 py-4 font-semibold">{user.username}</td>
                <td className="px-6 py-4">{user.name}</td>
                <td className="px-6 py-4">
                  <span className={`px-3 py-1 rounded-full text-xs font-semibold inline-flex items-center gap-1 ${
                    user.role === 'admin' ? 'bg-purple-100 text-purple-800' : 
                    user.role === 'petugas_layanan' ? 'bg-emerald-100 text-emerald-800' :
                    user.role === 'pk' ? 'bg-teal-100 text-teal-800' :
                    user.role === 'struktural' ? 'bg-cyan-100 text-cyan-800' :
                    'bg-blue-100 text-blue-800'
                  }`}>
                    {user.role === 'petugas_layanan' && <UsersIcon className="w-3 h-3" />}
                    {user.role === 'pk' && <UserCheck className="w-3 h-3" />}
                    {user.role === 'struktural' && <Shield className="w-3 h-3" />}
                    {user.role === 'petugas_layanan' ? 'Petugas Layanan' : 
                     user.role === 'pk' ? 'PK' :
                     user.role === 'struktural' ? 'Struktural' :
                     user.role}
                  </span>
                </td>
                <td className="px-6 py-4">
                  <button onClick={() => handleEdit(user)} className="text-blue-600 hover:text-blue-800 mr-3">
                    <Edit className="w-5 h-5" />
                  </button>
                  <button onClick={() => handleDelete(user.id)} className="text-red-600 hover:text-red-800">
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
            <h2 className="text-2xl font-bold mb-4">{editingUser ? 'Edit' : 'Tambah'} Pengguna</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-semibold mb-2">Username</label>
                <input type="text" value={formData.username} onChange={(e) => setFormData({...formData, username: e.target.value})} required className="w-full px-4 py-2 border rounded-lg" />
              </div>
              <div>
                <label className="block text-sm font-semibold mb-2">Password {editingUser && '(kosongkan jika tidak diubah)'}</label>
                <input type="password" value={formData.password} onChange={(e) => setFormData({...formData, password: e.target.value})} required={!editingUser} className="w-full px-4 py-2 border rounded-lg" />
              </div>
              <div>
                <label className="block text-sm font-semibold mb-2">Nama Lengkap</label>
                <input type="text" value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})} required className="w-full px-4 py-2 border rounded-lg" />
              </div>
              <div>
                <label className="block text-sm font-semibold mb-2">Role</label>
                <select value={formData.role} onChange={(e) => setFormData({...formData, role: e.target.value})} className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent">
                  <optgroup label="Admin & Operator">
                    <option value="admin">Admin</option>
                    <option value="operator">Operator</option>
                  </optgroup>
                  <optgroup label="Petugas">
                    <option value="petugas_layanan">Petugas Layanan</option>
                    <option value="pk">PK (Pembimbing Kemasyarakatan)</option>
                    <option value="struktural">Struktural</option>
                  </optgroup>
                </select>
                <p className="text-xs text-gray-500 mt-2">
                  {formData.role === 'admin' && '✓ Akses penuh ke Panel Admin'}
                  {formData.role === 'operator' && '✓ Akses terbatas ke Panel Admin'}
                  {formData.role === 'petugas_layanan' && '✓ Akses ke Aplikasi Petugas - Dashboard Petugas Layanan'}
                  {formData.role === 'pk' && '✓ Akses ke Aplikasi Petugas - Dashboard PK'}
                  {formData.role === 'struktural' && '✓ Akses ke Aplikasi Petugas - Dashboard Struktural'}
                </p>
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
