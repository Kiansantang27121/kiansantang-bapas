import { useState, useEffect } from 'react'
import { Eye, X } from 'lucide-react'

export default function DisplayPreview({ settings, onClose }) {
  const [currentTextIndex, setCurrentTextIndex] = useState(0)
  
  const texts = [
    settings.running_text || 'SELAMAT DATANG DI BAPAS BANDUNG',
    settings.running_text_2 || 'JAM PELAYANAN: SENIN - JUMAT, 08:00 - 16:00 WIB',
    settings.running_text_3 || 'HUBUNGI KAMI: 022-1234567'
  ].filter(text => text && text.trim() !== '')

  useEffect(() => {
    if (texts.length > 1) {
      const interval = setInterval(() => {
        setCurrentTextIndex((prev) => (prev + 1) % texts.length)
      }, 3000) // Faster for preview (3 seconds)

      return () => clearInterval(interval)
    }
  }, [texts.length])

  const currentText = texts[currentTextIndex] || texts[0]

  // Mock queue data for preview
  const mockQueues = [
    { counter_number: 1, queue_number: 'A001', service_name: 'Pendaftaran' },
    { counter_number: 2, queue_number: 'B015', service_name: 'Konsultasi' },
    { counter_number: 3, queue_number: 'C008', service_name: 'Pelaporan' },
    { counter_number: 4, queue_number: 'A022', service_name: 'Administrasi' },
  ]

  // Mock statistics
  const mockStats = {
    total: 45,
    waiting: 12,
    serving: 3,
    completed: 28,
    cancelled: 2
  }

  const columns = parseInt(settings.display_columns || '4')

  return (
    <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-6xl w-full max-h-[90vh] overflow-auto">
        {/* Preview Header */}
        <div className="sticky top-0 bg-gradient-to-r from-blue-600 to-blue-700 text-white p-4 flex items-center justify-between rounded-t-2xl">
          <div className="flex items-center space-x-3">
            <Eye className="w-6 h-6" />
            <div>
              <h2 className="text-xl font-bold">Preview Display</h2>
              <p className="text-sm text-blue-100">Pratinjau tampilan sebelum disimpan</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-white/20 rounded-lg transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Preview Content */}
        <div className="p-6 bg-gray-100">
          <div className="bg-black rounded-xl overflow-hidden shadow-2xl">
            {/* Mini Display Preview */}
            <div 
              className="border-4 rounded-xl overflow-hidden"
              style={{ borderColor: settings.theme_border_color || '#06b6d4' }}
            >
              {/* Header */}
              <div 
                className="py-4 px-6 border-b-4"
                style={{
                  background: `linear-gradient(to right, ${settings.theme_header_from || '#06b6d4'}, ${settings.theme_header_to || '#14b8a6'})`,
                  borderBottomColor: settings.theme_border_color || '#06b6d4'
                }}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    {settings.logo_url && (
                      <img 
                        src={settings.logo_url} 
                        alt="Logo" 
                        className="h-12 w-12 object-contain"
                      />
                    )}
                    <div>
                      <h1 className="text-xl font-bold text-white">
                        {settings.office_name || 'BAPAS BANDUNG'}
                      </h1>
                      <p className="text-sm text-white/90">
                        {settings.office_address || 'Jl. Contoh No. 123, Bandung'}
                      </p>
                    </div>
                  </div>
                  <div className="text-right text-white">
                    <div className="text-sm">Jam Operasional</div>
                    <div className="text-lg font-bold">
                      {settings.working_hours || '08:00 - 16:00'}
                    </div>
                  </div>
                </div>
              </div>

              {/* Statistics - Top */}
              {settings.show_statistics === 'true' && settings.statistics_position === 'top' && (
                <div 
                  className="py-2 px-4 border-b-2"
                  style={{
                    background: `linear-gradient(to right, ${settings.theme_panel_from || '#1f2937'}, ${settings.theme_panel_to || '#111827'})`,
                    borderBottomColor: settings.theme_border_color || '#06b6d4'
                  }}
                >
                  <div className="flex items-center justify-around text-center text-xs">
                    <StatPreview label="Total" value={mockStats.total} color={settings.theme_accent || '#06b6d4'} />
                    <StatPreview label="Menunggu" value={mockStats.waiting} color="#facc15" />
                    <StatPreview label="Dilayani" value={mockStats.serving} color="#10b981" />
                    <StatPreview label="Selesai" value={mockStats.completed} color="#06b6d4" />
                  </div>
                </div>
              )}

              {/* Current Queue Display */}
              <div 
                className="py-6 px-6"
                style={{
                  background: `linear-gradient(to bottom, ${settings.theme_panel_from || '#1f2937'}, ${settings.theme_panel_to || '#111827'})`
                }}
              >
                <div className="text-center">
                  <div 
                    className="text-lg font-bold mb-2"
                    style={{ color: settings.theme_accent || '#06b6d4' }}
                  >
                    ANTRIAN DIPANGGIL
                  </div>
                  <div className="flex items-center justify-center space-x-3">
                    <span 
                      className="text-4xl font-bold"
                      style={{ color: settings.theme_accent || '#06b6d4' }}
                    >
                      A
                    </span>
                    <span 
                      className="text-6xl font-bold"
                      style={{ color: settings.theme_queue_number || '#facc15' }}
                    >
                      042
                    </span>
                  </div>
                  <div 
                    className="text-xl font-bold mt-2"
                    style={{ color: settings.theme_accent || '#06b6d4' }}
                  >
                    LOKET 2
                  </div>
                </div>
              </div>

              {/* Loket Preview - Configurable Columns */}
              <div className="px-4 py-3">
                <div 
                  className="grid gap-2"
                  style={{
                    gridTemplateColumns: `repeat(${columns}, minmax(0, 1fr))`
                  }}
                >
                  {mockQueues.slice(0, columns).map((queue, idx) => (
                    <div 
                      key={idx}
                      className="rounded-lg p-2 border-2"
                      style={{
                        background: `linear-gradient(to bottom right, ${settings.theme_panel_from || '#1f2937'}, ${settings.theme_panel_to || '#111827'})`,
                        borderColor: settings.theme_border_color || '#06b6d4'
                      }}
                    >
                      <div className="text-center">
                        <div 
                          className="text-xs font-bold mb-1"
                          style={{ color: settings.theme_accent || '#06b6d4' }}
                        >
                          Loket {queue.counter_number}
                        </div>
                        <div className="flex items-center justify-center space-x-1">
                          <span 
                            className="text-sm font-bold"
                            style={{ color: settings.theme_accent || '#06b6d4' }}
                          >
                            {queue.queue_number.charAt(0)}
                          </span>
                          <span 
                            className="text-lg font-bold"
                            style={{ color: settings.theme_queue_number || '#facc15' }}
                          >
                            {queue.queue_number.slice(1)}
                          </span>
                        </div>
                        <div className="text-xs text-gray-400 mt-1 truncate">
                          {queue.service_name}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Statistics - Bottom */}
              {settings.show_statistics === 'true' && settings.statistics_position === 'bottom' && (
                <div 
                  className="py-2 px-4 border-t-2"
                  style={{
                    background: `linear-gradient(to right, ${settings.theme_panel_from || '#1f2937'}, ${settings.theme_panel_to || '#111827'})`,
                    borderTopColor: settings.theme_border_color || '#06b6d4'
                  }}
                >
                  <div className="flex items-center justify-around text-center text-xs">
                    <StatPreview label="Total" value={mockStats.total} color={settings.theme_accent || '#06b6d4'} />
                    <StatPreview label="Menunggu" value={mockStats.waiting} color="#facc15" />
                    <StatPreview label="Dilayani" value={mockStats.serving} color="#10b981" />
                    <StatPreview label="Selesai" value={mockStats.completed} color="#06b6d4" />
                  </div>
                </div>
              )}

              {/* Running Text */}
              <div 
                className="py-3 border-t-2 overflow-hidden"
                style={{
                  background: `linear-gradient(to right, ${settings.theme_running_from || '#dc2626'}, ${settings.theme_running_to || '#ea580c'})`,
                  borderTopColor: settings.theme_border_color || '#06b6d4'
                }}
              >
                <div className="text-center">
                  <div className="text-lg font-bold text-white animate-pulse">
                    ★★★ {currentText} ★★★
                  </div>
                  {texts.length > 1 && (
                    <div className="flex justify-center space-x-2 mt-2">
                      {texts.map((_, index) => (
                        <div
                          key={index}
                          className={`w-2 h-2 rounded-full transition-all ${
                            index === currentTextIndex ? 'bg-white w-3' : 'bg-white/50'
                          }`}
                        />
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Preview Info */}
          <div className="mt-4 bg-blue-50 border-2 border-blue-200 rounded-lg p-4">
            <h3 className="font-bold text-blue-900 mb-2">ℹ️ Informasi Preview:</h3>
            <ul className="text-sm text-blue-800 space-y-1">
              <li>• <strong>Kolom Loket:</strong> {columns} kolom</li>
              <li>• <strong>Running Text:</strong> {texts.length} teks (berganti setiap 3 detik di preview)</li>
              <li>• <strong>Statistik:</strong> {settings.show_statistics === 'true' ? `Aktif (${settings.statistics_position})` : 'Tidak aktif'}</li>
              <li>• <strong>Data:</strong> Menggunakan data contoh untuk preview</li>
            </ul>
          </div>

          {/* Action Buttons */}
          <div className="mt-4 flex justify-end space-x-3">
            <button
              onClick={onClose}
              className="px-6 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors"
            >
              Tutup Preview
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

function StatPreview({ label, value, color }) {
  return (
    <div className="flex flex-col items-center">
      <span className="text-lg font-bold text-white" style={{ color }}>
        {value}
      </span>
      <span className="text-gray-400">{label}</span>
    </div>
  )
}
