import { useState, useEffect } from 'react'
import axios from 'axios'
import { API_URL } from '../config'
import { Save, Hash, Calendar, Type, Minus } from 'lucide-react'

export default function Settings() {
  const [settings, setSettings] = useState({})
  const [loading, setLoading] = useState(false)
  const [previewQueueNumber, setPreviewQueueNumber] = useState('A202501090001')

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

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    try {
      await axios.post(`${API_URL}/settings/bulk`, settings)
      alert('Pengaturan berhasil disimpan')
    } catch (error) {
      alert('Gagal menyimpan pengaturan')
    } finally {
      setLoading(false)
    }
  }

  const handleChange = (key, value) => {
    setSettings({ ...settings, [key]: value })
    updatePreview({ ...settings, [key]: value })
  }

  const updatePreview = (currentSettings) => {
    const prefixType = currentSettings.queue_number_prefix_type || 'service'
    const customPrefix = currentSettings.queue_number_custom_prefix || 'A'
    const dateFormat = currentSettings.queue_number_date_format || 'YYYYMMDD'
    const digits = parseInt(currentSettings.queue_number_digits || '3')
    const separator = currentSettings.queue_number_separator || ''

    // Generate preview
    let prefix = prefixType === 'service' ? 'B' : customPrefix
    
    let datePart = ''
    if (dateFormat !== 'none') {
      const now = new Date()
      const year = now.getFullYear().toString()
      const month = String(now.getMonth() + 1).padStart(2, '0')
      const day = String(now.getDate()).padStart(2, '0')

      switch (dateFormat) {
        case 'YYYYMMDD':
          datePart = year + month + day
          break
        case 'YYMMDD':
          datePart = year.substring(2) + month + day
          break
        case 'DDMMYY':
          datePart = day + month + year.substring(2)
          break
        case 'DDMMYYYY':
          datePart = day + month + year
          break
        default:
          datePart = year + month + day
      }
    }

    const number = String(1).padStart(digits, '0')

    const parts = []
    if (prefix) parts.push(prefix)
    if (datePart) parts.push(datePart)
    parts.push(number)

    setPreviewQueueNumber(parts.join(separator))
  }

  return (
    <div>
      <h1 className="text-3xl font-bold text-gray-800 mb-8">Pengaturan</h1>

      <div className="bg-white rounded-lg shadow p-8">
        <form onSubmit={handleSubmit} className="space-y-6">
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
            <label className="block text-sm font-semibold text-gray-700 mb-2">Interval Refresh Display (ms)</label>
            <input
              type="number"
              value={settings.display_refresh_interval || 5000}
              onChange={(e) => handleChange('display_refresh_interval', e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Queue Number Settings */}
          <div className="border-t-2 border-gray-200 pt-6 mt-8">
            <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center">
              <Hash className="w-6 h-6 mr-2 text-blue-500" />
              Pengaturan Nomor Antrian
            </h2>

            {/* Preview */}
            <div className="bg-gradient-to-r from-blue-500 to-purple-500 rounded-lg p-6 mb-6">
              <div className="text-center">
                <p className="text-white text-sm font-semibold mb-2">Preview Nomor Antrian:</p>
                <div className="bg-white rounded-lg py-4 px-6 inline-block">
                  <span className="text-4xl font-bold text-gray-800">{previewQueueNumber}</span>
                </div>
              </div>
            </div>

            {/* Prefix Type */}
            <div className="mb-4">
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                <Type className="w-4 h-4 inline mr-1" />
                Tipe Prefix
              </label>
              <select
                value={settings.queue_number_prefix_type || 'service'}
                onChange={(e) => handleChange('queue_number_prefix_type', e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              >
                <option value="service">Huruf Pertama Layanan (B untuk Bimbingan)</option>
                <option value="custom">Custom Prefix</option>
              </select>
            </div>

            {/* Custom Prefix */}
            {settings.queue_number_prefix_type === 'custom' && (
              <div className="mb-4">
                <label className="block text-sm font-semibold text-gray-700 mb-2">Custom Prefix</label>
                <input
                  type="text"
                  value={settings.queue_number_custom_prefix || 'A'}
                  onChange={(e) => handleChange('queue_number_custom_prefix', e.target.value.toUpperCase())}
                  maxLength="3"
                  placeholder="A, B, BP, dll"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                />
                <p className="text-xs text-gray-500 mt-1">Maksimal 3 karakter</p>
              </div>
            )}

            {/* Date Format */}
            <div className="mb-4">
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                <Calendar className="w-4 h-4 inline mr-1" />
                Format Tanggal
              </label>
              <select
                value={settings.queue_number_date_format || 'YYYYMMDD'}
                onChange={(e) => handleChange('queue_number_date_format', e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              >
                <option value="YYYYMMDD">YYYYMMDD (20250109)</option>
                <option value="YYMMDD">YYMMDD (250109)</option>
                <option value="DDMMYY">DDMMYY (090125)</option>
                <option value="DDMMYYYY">DDMMYYYY (09012025)</option>
                <option value="none">Tanpa Tanggal</option>
              </select>
            </div>

            {/* Number Digits */}
            <div className="mb-4">
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                <Hash className="w-4 h-4 inline mr-1" />
                Jumlah Digit Nomor Urut
              </label>
              <select
                value={settings.queue_number_digits || '3'}
                onChange={(e) => handleChange('queue_number_digits', e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              >
                <option value="1">1 digit (1, 2, 3, ...)</option>
                <option value="2">2 digit (01, 02, 03, ...)</option>
                <option value="3">3 digit (001, 002, 003, ...)</option>
                <option value="4">4 digit (0001, 0002, 0003, ...)</option>
                <option value="5">5 digit (00001, 00002, 00003, ...)</option>
              </select>
            </div>

            {/* Separator */}
            <div className="mb-4">
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                <Minus className="w-4 h-4 inline mr-1" />
                Separator (Pemisah)
              </label>
              <select
                value={settings.queue_number_separator || ''}
                onChange={(e) => handleChange('queue_number_separator', e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Tanpa Separator (A202501090001)</option>
                <option value="-">Dash - (A-20250109-0001)</option>
                <option value=".">Dot . (A.20250109.0001)</option>
                <option value="/">Slash / (A/20250109/0001)</option>
                <option value=" ">Spasi ( A 20250109 0001 )</option>
              </select>
            </div>

            {/* Reset Daily */}
            <div className="mb-4">
              <label className="flex items-center">
                <input
                  type="checkbox"
                  checked={settings.queue_reset_daily === 'true'}
                  onChange={(e) => handleChange('queue_reset_daily', e.target.checked ? 'true' : 'false')}
                  className="w-5 h-5 text-blue-500 border-gray-300 rounded focus:ring-2 focus:ring-blue-500"
                />
                <span className="ml-3 text-sm font-semibold text-gray-700">
                  Reset Nomor Antrian Setiap Hari
                </span>
              </label>
              <p className="text-xs text-gray-500 mt-1 ml-8">
                Jika dicentang, nomor antrian akan mulai dari awal setiap hari
              </p>
            </div>

            {/* Start Number */}
            <div className="mb-4">
              <label className="block text-sm font-semibold text-gray-700 mb-2">Nomor Awal</label>
              <input
                type="number"
                value={settings.queue_start_number || '1'}
                onChange={(e) => handleChange('queue_start_number', e.target.value)}
                min="0"
                max="999"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              />
              <p className="text-xs text-gray-500 mt-1">
                Nomor antrian akan dimulai dari angka ini (default: 1)
              </p>
            </div>

            {/* Examples */}
            <div className="bg-gray-50 rounded-lg p-4 mt-6">
              <h3 className="font-semibold text-gray-700 mb-3">Contoh Format:</h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">Service + YYYYMMDD + 3 digit:</span>
                  <span className="font-mono font-bold">B202501090001</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Custom (BP) + YYMMDD + 4 digit:</span>
                  <span className="font-mono font-bold">BP2501090001</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">A + Tanpa tanggal + 2 digit:</span>
                  <span className="font-mono font-bold">A01</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Service + DDMMYY + dash + 3 digit:</span>
                  <span className="font-mono font-bold">B-090125-001</span>
                </div>
              </div>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-500 text-white py-3 rounded-lg font-semibold hover:bg-blue-600 disabled:opacity-50 flex items-center justify-center"
          >
            <Save className="w-5 h-5 mr-2" />
            {loading ? 'Menyimpan...' : 'Simpan Pengaturan'}
          </button>
        </form>
      </div>
    </div>
  )
}
