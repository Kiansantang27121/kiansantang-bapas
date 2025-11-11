import { useState, useEffect } from 'react'
import axios from 'axios'
import { API_URL } from '../config'
import { Save, Palette, RotateCcw } from 'lucide-react'

export default function ThemeSettings() {
  const [settings, setSettings] = useState({})
  const [loading, setLoading] = useState(false)

  const themePresets = {
    default: {
      theme_border_color: '#06b6d4',
      theme_header_from: '#06b6d4',
      theme_header_to: '#14b8a6',
      theme_panel_from: '#1f2937',
      theme_panel_to: '#111827',
      theme_running_from: '#dc2626',
      theme_running_to: '#ea580c',
      theme_queue_number: '#facc15',
      theme_accent: '#06b6d4'
    },
    blue: {
      theme_border_color: '#3b82f6',
      theme_header_from: '#3b82f6',
      theme_header_to: '#2563eb',
      theme_panel_from: '#1e3a8a',
      theme_panel_to: '#1e40af',
      theme_running_from: '#1d4ed8',
      theme_running_to: '#2563eb',
      theme_queue_number: '#fbbf24',
      theme_accent: '#60a5fa'
    },
    green: {
      theme_border_color: '#10b981',
      theme_header_from: '#10b981',
      theme_header_to: '#059669',
      theme_panel_from: '#064e3b',
      theme_panel_to: '#065f46',
      theme_running_from: '#047857',
      theme_running_to: '#059669',
      theme_queue_number: '#fbbf24',
      theme_accent: '#34d399'
    },
    purple: {
      theme_border_color: '#a855f7',
      theme_header_from: '#a855f7',
      theme_header_to: '#9333ea',
      theme_panel_from: '#581c87',
      theme_panel_to: '#6b21a8',
      theme_running_from: '#7c3aed',
      theme_running_to: '#9333ea',
      theme_queue_number: '#fbbf24',
      theme_accent: '#c084fc'
    },
    red: {
      theme_border_color: '#ef4444',
      theme_header_from: '#ef4444',
      theme_header_to: '#dc2626',
      theme_panel_from: '#7f1d1d',
      theme_panel_to: '#991b1b',
      theme_running_from: '#b91c1c',
      theme_running_to: '#dc2626',
      theme_queue_number: '#fbbf24',
      theme_accent: '#f87171'
    }
  }

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
      const token = localStorage.getItem('token')
      await axios.post(`${API_URL}/settings/bulk`, settings, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })
      alert('Theme berhasil disimpan!')
    } catch (error) {
      console.error('Save error:', error)
      alert('Gagal menyimpan theme')
    } finally {
      setLoading(false)
    }
  }

  const handleChange = (key, value) => {
    setSettings({ ...settings, [key]: value })
  }

  const applyPreset = (presetName) => {
    if (confirm(`Terapkan theme ${presetName}?`)) {
      setSettings({ ...settings, ...themePresets[presetName] })
    }
  }

  const resetToDefault = () => {
    if (confirm('Reset ke theme default?')) {
      setSettings({ ...settings, ...themePresets.default })
    }
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center">
          <Palette className="w-8 h-8 mr-3 text-purple-600" />
          <h1 className="text-3xl font-bold text-gray-800">Theme Display</h1>
        </div>
        <button
          onClick={resetToDefault}
          className="flex items-center px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600"
        >
          <RotateCcw className="w-4 h-4 mr-2" />
          Reset Default
        </button>
      </div>

      {/* Theme Presets */}
      <div className="bg-white rounded-lg shadow p-6 mb-6">
        <h2 className="text-xl font-bold text-gray-800 mb-4">Theme Presets</h2>
        <div className="grid grid-cols-5 gap-4">
          {Object.keys(themePresets).map((presetName) => (
            <button
              key={presetName}
              onClick={() => applyPreset(presetName)}
              className="group relative overflow-hidden rounded-lg border-2 border-gray-300 hover:border-blue-500 transition-all"
            >
              <div 
                className="h-24 p-4"
                style={{
                  background: `linear-gradient(to right, ${themePresets[presetName].theme_header_from}, ${themePresets[presetName].theme_header_to})`
                }}
              >
                <div 
                  className="w-full h-full rounded border-4 flex items-center justify-center"
                  style={{ borderColor: themePresets[presetName].theme_border_color }}
                >
                  <span className="text-white font-bold text-xs uppercase">{presetName}</span>
                </div>
              </div>
            </button>
          ))}
        </div>
      </div>

      <form onSubmit={handleSubmit}>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          
          {/* Border & Accent */}
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-bold text-gray-800 mb-4">Border & Accent</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Warna Border
                </label>
                <div className="flex items-center space-x-3">
                  <input
                    type="color"
                    value={settings.theme_border_color || '#06b6d4'}
                    onChange={(e) => handleChange('theme_border_color', e.target.value)}
                    className="w-16 h-10 rounded cursor-pointer"
                  />
                  <input
                    type="text"
                    value={settings.theme_border_color || '#06b6d4'}
                    onChange={(e) => handleChange('theme_border_color', e.target.value)}
                    className="flex-1 px-4 py-2 border border-gray-300 rounded-lg"
                    placeholder="#06b6d4"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Warna Accent
                </label>
                <div className="flex items-center space-x-3">
                  <input
                    type="color"
                    value={settings.theme_accent || '#06b6d4'}
                    onChange={(e) => handleChange('theme_accent', e.target.value)}
                    className="w-16 h-10 rounded cursor-pointer"
                  />
                  <input
                    type="text"
                    value={settings.theme_accent || '#06b6d4'}
                    onChange={(e) => handleChange('theme_accent', e.target.value)}
                    className="flex-1 px-4 py-2 border border-gray-300 rounded-lg"
                    placeholder="#06b6d4"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Warna Nomor Antrian
                </label>
                <div className="flex items-center space-x-3">
                  <input
                    type="color"
                    value={settings.theme_queue_number || '#facc15'}
                    onChange={(e) => handleChange('theme_queue_number', e.target.value)}
                    className="w-16 h-10 rounded cursor-pointer"
                  />
                  <input
                    type="text"
                    value={settings.theme_queue_number || '#facc15'}
                    onChange={(e) => handleChange('theme_queue_number', e.target.value)}
                    className="flex-1 px-4 py-2 border border-gray-300 rounded-lg"
                    placeholder="#facc15"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Header Gradient */}
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-bold text-gray-800 mb-4">Header Gradient</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Warna Dari
                </label>
                <div className="flex items-center space-x-3">
                  <input
                    type="color"
                    value={settings.theme_header_from || '#06b6d4'}
                    onChange={(e) => handleChange('theme_header_from', e.target.value)}
                    className="w-16 h-10 rounded cursor-pointer"
                  />
                  <input
                    type="text"
                    value={settings.theme_header_from || '#06b6d4'}
                    onChange={(e) => handleChange('theme_header_from', e.target.value)}
                    className="flex-1 px-4 py-2 border border-gray-300 rounded-lg"
                    placeholder="#06b6d4"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Warna Ke
                </label>
                <div className="flex items-center space-x-3">
                  <input
                    type="color"
                    value={settings.theme_header_to || '#14b8a6'}
                    onChange={(e) => handleChange('theme_header_to', e.target.value)}
                    className="w-16 h-10 rounded cursor-pointer"
                  />
                  <input
                    type="text"
                    value={settings.theme_header_to || '#14b8a6'}
                    onChange={(e) => handleChange('theme_header_to', e.target.value)}
                    className="flex-1 px-4 py-2 border border-gray-300 rounded-lg"
                    placeholder="#14b8a6"
                  />
                </div>
              </div>

              {/* Preview */}
              <div className="mt-4">
                <label className="block text-sm font-semibold text-gray-700 mb-2">Preview</label>
                <div 
                  className="h-16 rounded-lg"
                  style={{
                    background: `linear-gradient(to right, ${settings.theme_header_from || '#06b6d4'}, ${settings.theme_header_to || '#14b8a6'})`
                  }}
                />
              </div>
            </div>
          </div>

          {/* Panel Gradient */}
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-bold text-gray-800 mb-4">Panel Gradient</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Warna Dari
                </label>
                <div className="flex items-center space-x-3">
                  <input
                    type="color"
                    value={settings.theme_panel_from || '#1f2937'}
                    onChange={(e) => handleChange('theme_panel_from', e.target.value)}
                    className="w-16 h-10 rounded cursor-pointer"
                  />
                  <input
                    type="text"
                    value={settings.theme_panel_from || '#1f2937'}
                    onChange={(e) => handleChange('theme_panel_from', e.target.value)}
                    className="flex-1 px-4 py-2 border border-gray-300 rounded-lg"
                    placeholder="#1f2937"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Warna Ke
                </label>
                <div className="flex items-center space-x-3">
                  <input
                    type="color"
                    value={settings.theme_panel_to || '#111827'}
                    onChange={(e) => handleChange('theme_panel_to', e.target.value)}
                    className="w-16 h-10 rounded cursor-pointer"
                  />
                  <input
                    type="text"
                    value={settings.theme_panel_to || '#111827'}
                    onChange={(e) => handleChange('theme_panel_to', e.target.value)}
                    className="flex-1 px-4 py-2 border border-gray-300 rounded-lg"
                    placeholder="#111827"
                  />
                </div>
              </div>

              {/* Preview */}
              <div className="mt-4">
                <label className="block text-sm font-semibold text-gray-700 mb-2">Preview</label>
                <div 
                  className="h-16 rounded-lg"
                  style={{
                    background: `linear-gradient(to bottom right, ${settings.theme_panel_from || '#1f2937'}, ${settings.theme_panel_to || '#111827'})`
                  }}
                />
              </div>
            </div>
          </div>

          {/* Running Text Gradient */}
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-bold text-gray-800 mb-4">Running Text Gradient</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Warna Dari
                </label>
                <div className="flex items-center space-x-3">
                  <input
                    type="color"
                    value={settings.theme_running_from || '#dc2626'}
                    onChange={(e) => handleChange('theme_running_from', e.target.value)}
                    className="w-16 h-10 rounded cursor-pointer"
                  />
                  <input
                    type="text"
                    value={settings.theme_running_from || '#dc2626'}
                    onChange={(e) => handleChange('theme_running_from', e.target.value)}
                    className="flex-1 px-4 py-2 border border-gray-300 rounded-lg"
                    placeholder="#dc2626"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Warna Ke
                </label>
                <div className="flex items-center space-x-3">
                  <input
                    type="color"
                    value={settings.theme_running_to || '#ea580c'}
                    onChange={(e) => handleChange('theme_running_to', e.target.value)}
                    className="w-16 h-10 rounded cursor-pointer"
                  />
                  <input
                    type="text"
                    value={settings.theme_running_to || '#ea580c'}
                    onChange={(e) => handleChange('theme_running_to', e.target.value)}
                    className="flex-1 px-4 py-2 border border-gray-300 rounded-lg"
                    placeholder="#ea580c"
                  />
                </div>
              </div>

              {/* Preview */}
              <div className="mt-4">
                <label className="block text-sm font-semibold text-gray-700 mb-2">Preview</label>
                <div 
                  className="h-16 rounded-lg flex items-center justify-center"
                  style={{
                    background: `linear-gradient(to right, ${settings.theme_running_from || '#dc2626'}, ${settings.theme_running_to || '#ea580c'})`
                  }}
                >
                  <span className="text-white font-bold">★★★ RUNNING TEXT ★★★</span>
                </div>
              </div>
            </div>
          </div>

        </div>

        {/* Save Button */}
        <div className="mt-6">
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-500 text-white py-3 rounded-lg font-semibold hover:bg-blue-600 disabled:opacity-50 flex items-center justify-center"
          >
            <Save className="w-5 h-5 mr-2" />
            {loading ? 'Menyimpan...' : 'Simpan Theme'}
          </button>
        </div>
      </form>

      {/* Info */}
      <div className="mt-6 bg-blue-50 border border-blue-200 rounded-lg p-4">
        <h3 className="font-semibold text-blue-900 mb-2">💡 Tips</h3>
        <ul className="text-sm text-blue-800 space-y-1">
          <li>• Gunakan theme presets untuk quick setup</li>
          <li>• Preview akan update real-time saat Anda mengubah warna</li>
          <li>• Klik "Simpan Theme" untuk apply ke display</li>
          <li>• Display akan auto-refresh dalam 5 detik setelah save</li>
          <li>• Gunakan color picker atau input hex code manual</li>
        </ul>
      </div>
    </div>
  )
}
