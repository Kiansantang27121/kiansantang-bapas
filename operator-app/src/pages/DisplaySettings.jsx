import { useState, useEffect } from 'react'
import axios from 'axios'
import { API_URL } from '../config'
import { Save, Upload, X, Monitor, Eye } from 'lucide-react'
import DisplayPreview from '../components/DisplayPreview'

export default function DisplaySettings() {
  const [settings, setSettings] = useState({})
  const [loading, setLoading] = useState(false)
  const [logoFile, setLogoFile] = useState(null)
  const [videoFile, setVideoFile] = useState(null)
  const [uploading, setUploading] = useState(false)
  const [showPreview, setShowPreview] = useState(false)

  useEffect(() => {
    fetchSettings()
  }, [])

  const fetchSettings = async () => {
    try {
      const response = await axios.get(`${API_URL}/settings`)
      setSettings(response.data)
    } catch (error) {
      console.error('Error:', error)
    }
  }

  const handleFileChange = (e, type) => {
    const file = e.target.files[0]
    if (file) {
      if (type === 'logo') {
        setLogoFile(file)
      } else {
        setVideoFile(file)
      }
    }
  }

  const uploadFile = async (file, type) => {
    try {
      setUploading(true)
      
      // Validate file size (max 50MB)
      const maxSize = 50 * 1024 * 1024 // 50MB
      if (file.size > maxSize) {
        alert('File terlalu besar! Maksimal 50MB')
        setUploading(false)
        return
      }

      const reader = new FileReader()
      
      reader.onload = async (e) => {
        try {
          const base64Data = e.target.result
          
          // Get token from localStorage
          const token = localStorage.getItem('token')
          
          const response = await axios.post(`${API_URL}/upload/file`, {
            filename: file.name,
            data: base64Data,
            type: type
          }, {
            headers: {
              'Authorization': `Bearer ${token}`
            }
          })

          // Update settings with new URL - construct full URL
          const key = type === 'logo' ? 'logo_url' : 'video_url'
          const fullUrl = `http://localhost:3000${response.data.url}`
          
          await axios.put(`${API_URL}/settings/${key}`, {
            value: fullUrl
          }, {
            headers: {
              'Authorization': `Bearer ${token}`
            }
          })

          fetchSettings()
          
          // Show conversion info if video was converted
          if (response.data.converted) {
            alert(`Video berhasil diupload dan diconvert!\n\nFormat asli: ${response.data.originalFormat.toUpperCase()}\nFormat hasil: MP4 (H.264)\n\nVideo siap digunakan!`)
          } else if (response.data.warning) {
            alert(`Video berhasil diupload!\n\nPeringatan: ${response.data.warning}`)
          } else {
            alert(`${type === 'logo' ? 'Logo' : 'Video'} berhasil diupload!`)
          }
          
          if (type === 'logo') setLogoFile(null)
          else setVideoFile(null)
        } catch (uploadError) {
          console.error('Upload error:', uploadError)
          alert(`Gagal upload: ${uploadError.response?.data?.error || uploadError.message}`)
        }
      }

      reader.onerror = (error) => {
        console.error('FileReader error:', error)
        alert('Gagal membaca file')
        setUploading(false)
      }

      reader.readAsDataURL(file)
    } catch (error) {
      alert('Gagal upload file')
      console.error('Upload error:', error)
      setUploading(false)
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    try {
      const token = localStorage.getItem('token')
      await axios.post(`${API_URL}/settings/bulk`, settings, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })
      alert('Pengaturan display berhasil disimpan')
    } catch (error) {
      console.error('Save settings error:', error)
      alert('Gagal menyimpan pengaturan')
    } finally {
      setLoading(false)
    }
  }

  const handleChange = (key, value) => {
    setSettings({ ...settings, [key]: value })
  }

  const removeFile = async (type) => {
    if (!confirm(`Hapus ${type === 'logo' ? 'logo' : 'video'}?`)) return
    
    try {
      const token = localStorage.getItem('token')
      const key = type === 'logo' ? 'logo_url' : 'video_url'
      
      await axios.put(`${API_URL}/settings/${key}`, { value: '' }, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })
      
      fetchSettings()
      alert(`${type === 'logo' ? 'Logo' : 'Video'} berhasil dihapus`)
    } catch (error) {
      console.error('Remove file error:', error)
      alert('Gagal menghapus file')
    }
  }

  return (
    <div>
      <div className="flex items-center mb-8">
        <Monitor className="w-8 h-8 mr-3 text-blue-600" />
        <h1 className="text-3xl font-bold text-gray-800">Pengaturan Display</h1>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Left Column - Basic Settings */}
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-bold text-gray-800 mb-4">Informasi Umum</h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Nama Kantor</label>
              <input
                type="text"
                value={settings.office_name || ''}
                onChange={(e) => handleChange('office_name', e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Alamat Kantor</label>
              <input
                type="text"
                value={settings.office_address || ''}
                onChange={(e) => handleChange('office_address', e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Nomor Telepon</label>
              <input
                type="text"
                value={settings.office_phone || ''}
                onChange={(e) => handleChange('office_phone', e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Jam Operasional</label>
              <input
                type="text"
                value={settings.working_hours || ''}
                onChange={(e) => handleChange('working_hours', e.target.value)}
                placeholder="Contoh: 08:00 - 16:00"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Running Text 1</label>
              <textarea
                value={settings.running_text || ''}
                onChange={(e) => handleChange('running_text', e.target.value)}
                rows="2"
                placeholder="Teks berjalan pertama (contoh: sambutan)"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Running Text 2</label>
              <textarea
                value={settings.running_text_2 || ''}
                onChange={(e) => handleChange('running_text_2', e.target.value)}
                rows="2"
                placeholder="Teks berjalan kedua (contoh: jam pelayanan)"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Running Text 3</label>
              <textarea
                value={settings.running_text_3 || ''}
                onChange={(e) => handleChange('running_text_3', e.target.value)}
                rows="2"
                placeholder="Teks berjalan ketiga (contoh: kontak)"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Jumlah Kolom Loket</label>
              <select
                value={settings.display_columns || '4'}
                onChange={(e) => handleChange('display_columns', e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              >
                <option value="2">2 Kolom</option>
                <option value="3">3 Kolom</option>
                <option value="4">4 Kolom</option>
              </select>
              <p className="text-xs text-gray-500 mt-1">Jumlah kolom preview loket di display</p>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Tampilkan Statistik</label>
              <select
                value={settings.show_statistics || 'true'}
                onChange={(e) => handleChange('show_statistics', e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              >
                <option value="true">Ya, Tampilkan</option>
                <option value="false">Tidak</option>
              </select>
              <p className="text-xs text-gray-500 mt-1">Tampilkan statistik antrian di display</p>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Posisi Statistik</label>
              <select
                value={settings.statistics_position || 'bottom'}
                onChange={(e) => handleChange('statistics_position', e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                disabled={settings.show_statistics === 'false'}
              >
                <option value="top">Atas (Header)</option>
                <option value="bottom">Bawah (Footer)</option>
                <option value="sidebar">Sidebar (Samping)</option>
              </select>
              <p className="text-xs text-gray-500 mt-1">Posisi tampilan statistik</p>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Interval Refresh (ms)</label>
              <input
                type="number"
                value={settings.display_refresh_interval || 5000}
                onChange={(e) => handleChange('display_refresh_interval', e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              />
              <p className="text-xs text-gray-500 mt-1">Waktu refresh otomatis display (default: 5000ms)</p>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => setShowPreview(true)}
                className="bg-purple-500 text-white py-3 rounded-lg font-semibold hover:bg-purple-600 flex items-center justify-center"
              >
                <Eye className="w-5 h-5 mr-2" />
                Preview
              </button>
              <button
                type="submit"
                disabled={loading}
                className="bg-blue-500 text-white py-3 rounded-lg font-semibold hover:bg-blue-600 disabled:opacity-50 flex items-center justify-center"
              >
                <Save className="w-5 h-5 mr-2" />
                {loading ? 'Menyimpan...' : 'Simpan'}
              </button>
            </div>
          </form>
        </div>

        {/* Right Column - Media Upload */}
        <div className="space-y-6">
          {/* Logo Upload */}
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-bold text-gray-800 mb-4">Logo Instansi</h2>
            
            {settings.logo_url ? (
              <div className="mb-4">
                <div className="border-2 border-gray-200 rounded-lg p-4 bg-gray-50">
                  <img src={settings.logo_url} alt="Logo" className="max-h-32 mx-auto object-contain" />
                </div>
                <button
                  onClick={() => removeFile('logo')}
                  className="mt-3 w-full bg-red-500 text-white py-2 rounded-lg hover:bg-red-600 flex items-center justify-center"
                >
                  <X className="w-4 h-4 mr-2" />
                  Hapus Logo
                </button>
              </div>
            ) : (
              <div className="mb-4 border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
                <Upload className="w-12 h-12 mx-auto text-gray-400 mb-2" />
                <p className="text-sm text-gray-500">Belum ada logo</p>
              </div>
            )}

            <div>
              <input
                type="file"
                accept="image/*"
                onChange={(e) => handleFileChange(e, 'logo')}
                className="w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
              />
              {logoFile && (
                <button
                  onClick={() => uploadFile(logoFile, 'logo')}
                  disabled={uploading}
                  className="mt-3 w-full bg-green-500 text-white py-2 rounded-lg hover:bg-green-600 disabled:opacity-50 flex items-center justify-center"
                >
                  <Upload className="w-4 h-4 mr-2" />
                  {uploading ? 'Uploading...' : 'Upload Logo'}
                </button>
              )}
            </div>
          </div>

          {/* Video Upload */}
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-bold text-gray-800 mb-4">Video Display</h2>
            
            {settings.video_url ? (
              <div className="mb-4">
                <div className="border-2 border-gray-200 rounded-lg overflow-hidden bg-gray-50">
                  <video src={settings.video_url} controls className="w-full max-h-48" />
                </div>
                <button
                  onClick={() => removeFile('video')}
                  className="mt-3 w-full bg-red-500 text-white py-2 rounded-lg hover:bg-red-600 flex items-center justify-center"
                >
                  <X className="w-4 h-4 mr-2" />
                  Hapus Video
                </button>
              </div>
            ) : (
              <div className="mb-4 border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
                <Upload className="w-12 h-12 mx-auto text-gray-400 mb-2" />
                <p className="text-sm text-gray-500">Belum ada video</p>
              </div>
            )}

            <div>
              <input
                type="file"
                accept="video/mp4,video/x-msvideo,video/quicktime,video/x-ms-wmv,video/x-flv,video/x-matroska,video/webm,video/mpeg,video/3gpp,video/x-m4v,video/ogg,video/MP2T,.mp4,.avi,.mov,.wmv,.flv,.mkv,.webm,.mpeg,.mpg,.3gp,.m4v,.ogv,.vob,.ts"
                onChange={(e) => handleFileChange(e, 'video')}
                className="w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
              />
              <p className="text-xs text-gray-500 mt-2">
                📹 Support: MP4, AVI, MOV, WMV, FLV, MKV, WebM, MPEG, 3GP, M4V, OGV, VOB, TS
                <br />
                ⚡ Auto-convert ke MP4 (H.264) jika perlu
              </p>
              {videoFile && (
                <button
                  onClick={() => uploadFile(videoFile, 'video')}
                  disabled={uploading}
                  className="mt-3 w-full bg-green-500 text-white py-2 rounded-lg hover:bg-green-600 disabled:opacity-50 flex items-center justify-center"
                >
                  <Upload className="w-4 h-4 mr-2" />
                  {uploading ? 'Uploading...' : 'Upload Video'}
                </button>
              )}
            </div>
            <p className="text-xs text-gray-500 mt-2">Format: MP4, WebM, OGG (Max 50MB)</p>
          </div>

          {/* Preview Link */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <h3 className="font-semibold text-blue-900 mb-2">Preview Display</h3>
            <a
              href="http://localhost:5175"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 hover:text-blue-800 underline text-sm"
            >
              Buka Display di Tab Baru →
            </a>
          </div>
        </div>
      </div>

      {/* Display Preview Modal */}
      {showPreview && (
        <DisplayPreview 
          settings={settings} 
          onClose={() => setShowPreview(false)} 
        />
      )}
    </div>
  )
}
