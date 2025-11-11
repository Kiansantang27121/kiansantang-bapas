import { useState, useEffect } from 'react'
import axios from 'axios'
import { API_URL } from '../config'
import { Volume2, VolumeX, Settings, Save, RotateCcw } from 'lucide-react'

export default function VoiceSettings() {
  const [settings, setSettings] = useState({
    voice_enabled: 'true',
    voice_rate: '0.9',
    voice_pitch: '1.0',
    voice_volume: '1.0',
    voice_lang: 'id-ID',
    voice_repeat: '2',
    voice_delay: '2000'
  })
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [testMessage, setTestMessage] = useState('')

  useEffect(() => {
    fetchSettings()
  }, [])

  const fetchSettings = async () => {
    try {
      const response = await axios.get(`${API_URL}/settings`)
      setSettings(response.data)
      setLoading(false)
    } catch (error) {
      console.error('Error fetching settings:', error)
      setLoading(false)
    }
  }

  const handleChange = (key, value) => {
    setSettings({ ...settings, [key]: value })
  }

  const handleSave = async () => {
    setSaving(true)
    try {
      const token = localStorage.getItem('token')
      
      // Save each setting
      for (const [key, value] of Object.entries(settings)) {
        await axios.put(
          `${API_URL}/settings/${key}`,
          { value },
          { headers: { Authorization: `Bearer ${token}` } }
        )
      }
      
      alert('✅ Pengaturan berhasil disimpan!')
    } catch (error) {
      console.error('Error saving settings:', error)
      alert('❌ Gagal menyimpan pengaturan')
    } finally {
      setSaving(false)
    }
  }

  const handleReset = () => {
    if (confirm('Reset ke pengaturan default?')) {
      setSettings({
        voice_enabled: 'true',
        voice_rate: '0.9',
        voice_pitch: '1.0',
        voice_volume: '1.0',
        voice_lang: 'id-ID',
        voice_repeat: '2',
        voice_delay: '2000'
      })
    }
  }

  const handleTest = () => {
    if (!testMessage) {
      alert('Masukkan pesan test terlebih dahulu')
      return
    }

    const enabled = settings.voice_enabled === 'true'
    if (!enabled) {
      alert('Voice announcement dinonaktifkan. Aktifkan terlebih dahulu untuk test.')
      return
    }

    if ('speechSynthesis' in window) {
      const utterance = new SpeechSynthesisUtterance(testMessage)
      utterance.lang = settings.voice_lang
      utterance.rate = parseFloat(settings.voice_rate)
      utterance.pitch = parseFloat(settings.voice_pitch)
      utterance.volume = parseFloat(settings.voice_volume)
      window.speechSynthesis.speak(utterance)
    } else {
      alert('Browser tidak mendukung speech synthesis')
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-blue-600"></div>
      </div>
    )
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-bold text-gray-800 flex items-center gap-3">
          <Volume2 className="w-8 h-8 text-blue-600" />
          Pengaturan Pemanggilan Suara
        </h1>
        
        <div className="flex gap-3">
          <button
            onClick={handleReset}
            className="bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded-lg font-semibold flex items-center gap-2 transition-all"
          >
            <RotateCcw className="w-5 h-5" />
            Reset Default
          </button>
          <button
            onClick={handleSave}
            disabled={saving}
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg font-semibold flex items-center gap-2 transition-all disabled:bg-gray-400"
          >
            <Save className="w-5 h-5" />
            {saving ? 'Menyimpan...' : 'Simpan Pengaturan'}
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Settings Panel */}
        <div className="bg-white rounded-lg shadow-lg p-6">
          <h2 className="text-xl font-bold text-gray-800 mb-6 flex items-center gap-2">
            <Settings className="w-6 h-6 text-blue-600" />
            Pengaturan
          </h2>

          <div className="space-y-6">
            {/* Enable/Disable */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Status Pemanggilan Suara
              </label>
              <div className="flex items-center gap-4">
                <button
                  onClick={() => handleChange('voice_enabled', 'true')}
                  className={`flex-1 py-3 px-4 rounded-lg font-semibold transition-all ${
                    settings.voice_enabled === 'true'
                      ? 'bg-green-500 text-white'
                      : 'bg-gray-200 text-gray-600'
                  }`}
                >
                  <Volume2 className="w-5 h-5 inline mr-2" />
                  Aktif
                </button>
                <button
                  onClick={() => handleChange('voice_enabled', 'false')}
                  className={`flex-1 py-3 px-4 rounded-lg font-semibold transition-all ${
                    settings.voice_enabled === 'false'
                      ? 'bg-red-500 text-white'
                      : 'bg-gray-200 text-gray-600'
                  }`}
                >
                  <VolumeX className="w-5 h-5 inline mr-2" />
                  Nonaktif
                </button>
              </div>
            </div>

            {/* Voice Rate */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Kecepatan Suara: {settings.voice_rate}x
              </label>
              <input
                type="range"
                min="0.5"
                max="2.0"
                step="0.1"
                value={settings.voice_rate}
                onChange={(e) => handleChange('voice_rate', e.target.value)}
                className="w-full"
              />
              <div className="flex justify-between text-xs text-gray-500 mt-1">
                <span>Lambat (0.5x)</span>
                <span>Normal (1.0x)</span>
                <span>Cepat (2.0x)</span>
              </div>
            </div>

            {/* Voice Pitch */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Nada Suara: {settings.voice_pitch}
              </label>
              <input
                type="range"
                min="0.5"
                max="2.0"
                step="0.1"
                value={settings.voice_pitch}
                onChange={(e) => handleChange('voice_pitch', e.target.value)}
                className="w-full"
              />
              <div className="flex justify-between text-xs text-gray-500 mt-1">
                <span>Rendah (0.5)</span>
                <span>Normal (1.0)</span>
                <span>Tinggi (2.0)</span>
              </div>
            </div>

            {/* Voice Volume */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Volume: {Math.round(parseFloat(settings.voice_volume) * 100)}%
              </label>
              <input
                type="range"
                min="0.0"
                max="1.0"
                step="0.1"
                value={settings.voice_volume}
                onChange={(e) => handleChange('voice_volume', e.target.value)}
                className="w-full"
              />
              <div className="flex justify-between text-xs text-gray-500 mt-1">
                <span>0%</span>
                <span>50%</span>
                <span>100%</span>
              </div>
            </div>

            {/* Repeat Count */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Jumlah Pengulangan
              </label>
              <select
                value={settings.voice_repeat}
                onChange={(e) => handleChange('voice_repeat', e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              >
                <option value="1">1x (Sekali)</option>
                <option value="2">2x (Dua kali)</option>
                <option value="3">3x (Tiga kali)</option>
              </select>
            </div>

            {/* Delay */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Jeda Antar Pengulangan
              </label>
              <select
                value={settings.voice_delay}
                onChange={(e) => handleChange('voice_delay', e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              >
                <option value="1000">1 detik</option>
                <option value="2000">2 detik</option>
                <option value="3000">3 detik</option>
                <option value="5000">5 detik</option>
              </select>
            </div>
          </div>
        </div>

        {/* Test Panel */}
        <div className="bg-white rounded-lg shadow-lg p-6">
          <h2 className="text-xl font-bold text-gray-800 mb-6">
            Test Pemanggilan
          </h2>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Pesan Test
              </label>
              <textarea
                value={testMessage}
                onChange={(e) => setTestMessage(e.target.value)}
                placeholder="Contoh: Ruang Pelayanan 1. Klien atas nama Ahmad. Pembimbing Kemasyarakatan Budiana, silakan menuju Ruang Pelayanan 1"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 h-32"
              />
            </div>

            <button
              onClick={handleTest}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-lg font-semibold flex items-center justify-center gap-2 transition-all"
            >
              <Volume2 className="w-5 h-5" />
              Test Suara
            </button>

            <div className="bg-blue-50 border-2 border-blue-200 rounded-lg p-4">
              <h3 className="font-bold text-blue-900 mb-3">📋 Template Pemanggilan:</h3>
              
              <div className="space-y-4 text-sm text-blue-800">
                <div className="bg-white rounded-lg p-3 border border-blue-200">
                  <p className="font-bold text-blue-900 mb-2">🔔 Panggilan PK:</p>
                  <p className="italic leading-relaxed">
                    "<strong>[Salam]</strong>, diberitahukan kepada <strong>Pembimbing Kemasyarakatan [Nama PK]</strong>, ditunggu kehadirannya di <strong>[Nama Ruangan]</strong> karena ada klien wajib lapor atas nama <strong>[Nama Klien]</strong>. Sekali lagi, diberitahukan kepada Pembimbing Kemasyarakatan [Nama PK], ditunggu kehadirannya di [Nama Ruangan] karena ada klien wajib lapor atas nama [Nama Klien]. Atas perhatiannya diucapkan terima kasih."
                  </p>
                  <p className="text-xs text-gray-600 mt-2">
                    <strong>Salam:</strong> Selamat pagi (08:00-12:00) / Selamat siang (12:00-16:00) / Selamat sore (16:00-18:00)
                  </p>
                </div>
                
                <div className="bg-white rounded-lg p-3 border border-blue-200">
                  <p className="font-bold text-blue-900 mb-2">🔔 Panggilan Klien:</p>
                  <p className="italic leading-relaxed">
                    "<strong>[Salam]</strong>, diberitahukan kepada nomor urut <strong>[Nomor Antrian]</strong>, klien atas nama <strong>[Nama Klien]</strong>, harap segera memasuki <strong>[Nama Ruangan]</strong>. Pembimbing Kemasyarakatan <strong>[Nama PK]</strong> siap melayani Anda. Sekali lagi, diberitahukan kepada nomor urut [Nomor Antrian], klien atas nama [Nama Klien], harap segera memasuki [Nama Ruangan]. Pembimbing Kemasyarakatan [Nama PK] siap melayani Anda. Atas perhatiannya diucapkan terima kasih."
                  </p>
                  <p className="text-xs text-gray-600 mt-2">
                    <strong>Salam:</strong> Selamat pagi (08:00-12:00) / Selamat siang (12:00-16:00) / Selamat sore (16:00-18:00)
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-yellow-50 border-2 border-yellow-200 rounded-lg p-4">
              <h3 className="font-bold text-yellow-900 mb-2">⚙️ Pengaturan Saat Ini:</h3>
              <div className="space-y-1 text-sm text-yellow-800">
                <p>• Status: <strong>{settings.voice_enabled === 'true' ? 'Aktif ✅' : 'Nonaktif ❌'}</strong></p>
                <p>• Kecepatan: <strong>{settings.voice_rate}x</strong></p>
                <p>• Nada: <strong>{settings.voice_pitch}</strong></p>
                <p>• Volume: <strong>{Math.round(parseFloat(settings.voice_volume) * 100)}%</strong></p>
                <p>• Pengulangan: <strong>{settings.voice_repeat}x</strong></p>
                <p>• Jeda: <strong>{parseInt(settings.voice_delay) / 1000} detik</strong></p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
