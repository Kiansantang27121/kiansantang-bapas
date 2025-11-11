import { useState, useEffect, useRef } from 'react'
import axios from 'axios'
import { useAuth } from '../context/AuthContext'
import { 
  FileText, Camera, CheckCircle, AlertCircle, Send, 
  User, MapPin, Briefcase, Users, MessageSquare,
  Smile, Meh, Frown, Save, ArrowLeft, ArrowRight
} from 'lucide-react'

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api'

export default function PKServiceProcess() {
  const { user } = useAuth()
  const [activeQueue, setActiveQueue] = useState(null)
  const [currentStep, setCurrentStep] = useState(1)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  
  // Form data
  const [formData, setFormData] = useState({
    // 5 Template Pertanyaan Wajib
    question1: '', // Kondisi saat ini
    question2: '', // Kegiatan/pekerjaan
    question3: '', // Lingkungan sosial
    question4: '', // Kendala yang dihadapi
    question5: '', // Rencana ke depan
    
    // Dokumentasi
    photos: [],
    notes: '',
    
    // Survey Kepuasan
    satisfaction: null, // 1: Frown, 2: Meh, 3: Smile
    feedback: ''
  })
  
  const videoRef = useRef(null)
  const canvasRef = useRef(null)
  const [cameraActive, setCameraActive] = useState(false)
  const [stream, setStream] = useState(null)

  useEffect(() => {
    fetchActiveQueue()
    return () => {
      stopCamera()
    }
  }, [])

  const fetchActiveQueue = async () => {
    try {
      const token = localStorage.getItem('token')
      const response = await axios.get(`${API_URL}/workflow/active-service`, {
        headers: { Authorization: `Bearer ${token}` }
      })
      
      if (response.data.success && response.data.queue) {
        setActiveQueue(response.data.queue)
        
        // Load existing data if any
        if (response.data.queue.service_data) {
          setFormData(JSON.parse(response.data.queue.service_data))
        }
      }
      setLoading(false)
    } catch (error) {
      console.error('Error fetching active queue:', error)
      setLoading(false)
    }
  }

  const startCamera = async () => {
    try {
      const mediaStream = await navigator.mediaDevices.getUserMedia({ 
        video: { facingMode: 'user' } 
      })
      setStream(mediaStream)
      if (videoRef.current) {
        videoRef.current.srcObject = mediaStream
      }
      setCameraActive(true)
    } catch (error) {
      console.error('Error accessing camera:', error)
      alert('Tidak dapat mengakses kamera. Pastikan izin kamera diberikan.')
    }
  }

  const stopCamera = () => {
    if (stream) {
      stream.getTracks().forEach(track => track.stop())
      setStream(null)
    }
    setCameraActive(false)
  }

  const capturePhoto = () => {
    if (videoRef.current && canvasRef.current) {
      const canvas = canvasRef.current
      const video = videoRef.current
      
      canvas.width = video.videoWidth
      canvas.height = video.videoHeight
      
      const context = canvas.getContext('2d')
      context.drawImage(video, 0, 0)
      
      const photoData = canvas.toDataURL('image/jpeg', 0.8)
      
      setFormData(prev => ({
        ...prev,
        photos: [...prev.photos, {
          data: photoData,
          timestamp: new Date().toISOString()
        }]
      }))
      
      stopCamera()
    }
  }

  const removePhoto = (index) => {
    setFormData(prev => ({
      ...prev,
      photos: prev.photos.filter((_, i) => i !== index)
    }))
  }

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }))
  }

  const saveProgress = async () => {
    setSaving(true)
    try {
      const token = localStorage.getItem('token')
      await axios.post(
        `${API_URL}/workflow/save-service-progress`,
        {
          queue_id: activeQueue.id,
          service_data: JSON.stringify(formData),
          current_step: currentStep
        },
        { headers: { Authorization: `Bearer ${token}` } }
      )
      alert('Progress tersimpan!')
    } catch (error) {
      console.error('Error saving progress:', error)
      alert('Gagal menyimpan progress')
    } finally {
      setSaving(false)
    }
  }

  const completeService = async () => {
    // Validasi
    if (!formData.question1 || !formData.question2 || !formData.question3 || 
        !formData.question4 || !formData.question5) {
      alert('Mohon lengkapi semua pertanyaan wajib!')
      return
    }
    
    if (formData.photos.length === 0) {
      alert('Mohon ambil minimal 1 foto dokumentasi!')
      return
    }
    
    if (!formData.satisfaction) {
      alert('Mohon isi survey kepuasan!')
      return
    }

    setSaving(true)
    try {
      const token = localStorage.getItem('token')
      const response = await axios.post(
        `${API_URL}/workflow/complete-service`,
        {
          queue_id: activeQueue.id,
          service_data: formData
        },
        { headers: { Authorization: `Bearer ${token}` } }
      )
      
      if (response.data.success) {
        alert('Layanan selesai! Terima kasih.')
        // Reset and fetch next queue
        setFormData({
          question1: '', question2: '', question3: '', question4: '', question5: '',
          photos: [], notes: '', satisfaction: null, feedback: ''
        })
        setCurrentStep(1)
        fetchActiveQueue()
      }
    } catch (error) {
      console.error('Error completing service:', error)
      alert('Gagal menyelesaikan layanan')
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-teal-600"></div>
      </div>
    )
  }

  if (!activeQueue) {
    return (
      <div className="flex items-center justify-center h-screen bg-gray-50">
        <div className="text-center">
          <Users className="w-24 h-24 mx-auto text-gray-300 mb-4" />
          <h2 className="text-2xl font-bold text-gray-700 mb-2">Tidak Ada Layanan Aktif</h2>
          <p className="text-gray-500">Silakan panggil klien terlebih dahulu</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      {/* Header */}
      <div className="bg-gradient-to-r from-teal-600 to-cyan-600 text-white p-6 shadow-lg">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-2xl font-bold mb-2">Proses Layanan Bimbingan</h1>
          <div className="bg-white bg-opacity-20 rounded-lg p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm opacity-90">Nomor Antrian</p>
                <p className="text-2xl font-bold">{activeQueue.queue_number}</p>
              </div>
              <div>
                <p className="text-sm opacity-90">Klien</p>
                <p className="text-lg font-semibold">{activeQueue.client_name}</p>
              </div>
              <div>
                <p className="text-sm opacity-90">Ruangan</p>
                <p className="text-lg font-semibold">Ruang {activeQueue.room_number}</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Progress Steps */}
      <div className="max-w-4xl mx-auto mt-6 px-4">
        <div className="flex items-center justify-between mb-8">
          {[1, 2, 3, 4].map((step) => (
            <div key={step} className="flex items-center flex-1">
              <div className={`flex items-center justify-center w-10 h-10 rounded-full font-bold ${
                currentStep >= step 
                  ? 'bg-teal-600 text-white' 
                  : 'bg-gray-300 text-gray-600'
              }`}>
                {step}
              </div>
              {step < 4 && (
                <div className={`flex-1 h-1 mx-2 ${
                  currentStep > step ? 'bg-teal-600' : 'bg-gray-300'
                }`} />
              )}
            </div>
          ))}
        </div>

        <div className="text-center mb-6">
          <h2 className="text-xl font-bold text-gray-800">
            {currentStep === 1 && 'Pertanyaan Wajib (SOP)'}
            {currentStep === 2 && 'Dokumentasi Foto'}
            {currentStep === 3 && 'Survey Kepuasan'}
            {currentStep === 4 && 'Ringkasan & Selesai'}
          </h2>
        </div>

        {/* Step 1: Pertanyaan Wajib */}
        {currentStep === 1 && (
          <div className="space-y-6">
            {/* Question 1 */}
            <div className="bg-white rounded-xl shadow-md p-6">
              <div className="flex items-start gap-3 mb-4">
                <User className="w-6 h-6 text-teal-600 mt-1" />
                <div className="flex-1">
                  <label className="block text-lg font-semibold text-gray-800 mb-2">
                    1. Bagaimana kondisi Anda saat ini?
                  </label>
                  <p className="text-sm text-gray-600 mb-3">
                    (Kesehatan fisik, mental, emosional)
                  </p>
                  <textarea
                    value={formData.question1}
                    onChange={(e) => handleInputChange('question1', e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                    rows="4"
                    placeholder="Jelaskan kondisi Anda saat ini..."
                  />
                </div>
              </div>
            </div>

            {/* Question 2 */}
            <div className="bg-white rounded-xl shadow-md p-6">
              <div className="flex items-start gap-3 mb-4">
                <Briefcase className="w-6 h-6 text-teal-600 mt-1" />
                <div className="flex-1">
                  <label className="block text-lg font-semibold text-gray-800 mb-2">
                    2. Apa kegiatan/pekerjaan Anda saat ini?
                  </label>
                  <p className="text-sm text-gray-600 mb-3">
                    (Pekerjaan, pendidikan, atau aktivitas sehari-hari)
                  </p>
                  <textarea
                    value={formData.question2}
                    onChange={(e) => handleInputChange('question2', e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                    rows="4"
                    placeholder="Jelaskan kegiatan/pekerjaan Anda..."
                  />
                </div>
              </div>
            </div>

            {/* Question 3 */}
            <div className="bg-white rounded-xl shadow-md p-6">
              <div className="flex items-start gap-3 mb-4">
                <Users className="w-6 h-6 text-teal-600 mt-1" />
                <div className="flex-1">
                  <label className="block text-lg font-semibold text-gray-800 mb-2">
                    3. Bagaimana lingkungan sosial Anda?
                  </label>
                  <p className="text-sm text-gray-600 mb-3">
                    (Keluarga, teman, tetangga, masyarakat)
                  </p>
                  <textarea
                    value={formData.question3}
                    onChange={(e) => handleInputChange('question3', e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                    rows="4"
                    placeholder="Jelaskan lingkungan sosial Anda..."
                  />
                </div>
              </div>
            </div>

            {/* Question 4 */}
            <div className="bg-white rounded-xl shadow-md p-6">
              <div className="flex items-start gap-3 mb-4">
                <AlertCircle className="w-6 h-6 text-teal-600 mt-1" />
                <div className="flex-1">
                  <label className="block text-lg font-semibold text-gray-800 mb-2">
                    4. Apa kendala yang Anda hadapi?
                  </label>
                  <p className="text-sm text-gray-600 mb-3">
                    (Masalah atau hambatan dalam kehidupan sehari-hari)
                  </p>
                  <textarea
                    value={formData.question4}
                    onChange={(e) => handleInputChange('question4', e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                    rows="4"
                    placeholder="Jelaskan kendala yang Anda hadapi..."
                  />
                </div>
              </div>
            </div>

            {/* Question 5 */}
            <div className="bg-white rounded-xl shadow-md p-6">
              <div className="flex items-start gap-3 mb-4">
                <MapPin className="w-6 h-6 text-teal-600 mt-1" />
                <div className="flex-1">
                  <label className="block text-lg font-semibold text-gray-800 mb-2">
                    5. Apa rencana Anda ke depan?
                  </label>
                  <p className="text-sm text-gray-600 mb-3">
                    (Target, tujuan, atau harapan untuk masa depan)
                  </p>
                  <textarea
                    value={formData.question5}
                    onChange={(e) => handleInputChange('question5', e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                    rows="4"
                    placeholder="Jelaskan rencana Anda ke depan..."
                  />
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Step 2: Dokumentasi Foto */}
        {currentStep === 2 && (
          <div className="space-y-6">
            <div className="bg-white rounded-xl shadow-md p-6">
              <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
                <Camera className="w-6 h-6 text-teal-600" />
                Foto Dokumentasi
              </h3>
              
              {!cameraActive ? (
                <button
                  onClick={startCamera}
                  className="w-full bg-teal-600 text-white py-4 rounded-lg font-semibold hover:bg-teal-700 transition-colors flex items-center justify-center gap-2"
                >
                  <Camera className="w-6 h-6" />
                  Buka Kamera
                </button>
              ) : (
                <div className="space-y-4">
                  <div className="relative bg-black rounded-lg overflow-hidden">
                    <video
                      ref={videoRef}
                      autoPlay
                      playsInline
                      className="w-full"
                    />
                  </div>
                  <div className="flex gap-3">
                    <button
                      onClick={capturePhoto}
                      className="flex-1 bg-green-600 text-white py-3 rounded-lg font-semibold hover:bg-green-700 transition-colors"
                    >
                      📸 Ambil Foto
                    </button>
                    <button
                      onClick={stopCamera}
                      className="flex-1 bg-gray-600 text-white py-3 rounded-lg font-semibold hover:bg-gray-700 transition-colors"
                    >
                      Tutup Kamera
                    </button>
                  </div>
                </div>
              )}
              
              <canvas ref={canvasRef} style={{ display: 'none' }} />
              
              {/* Photo Gallery */}
              {formData.photos.length > 0 && (
                <div className="mt-6">
                  <h4 className="font-semibold text-gray-800 mb-3">
                    Foto Tersimpan ({formData.photos.length})
                  </h4>
                  <div className="grid grid-cols-2 gap-4">
                    {formData.photos.map((photo, index) => (
                      <div key={index} className="relative group">
                        <img
                          src={photo.data}
                          alt={`Foto ${index + 1}`}
                          className="w-full h-48 object-cover rounded-lg"
                        />
                        <button
                          onClick={() => removePhoto(index)}
                          className="absolute top-2 right-2 bg-red-600 text-white p-2 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                          ✕
                        </button>
                        <p className="text-xs text-gray-600 mt-1">
                          {new Date(photo.timestamp).toLocaleTimeString('id-ID')}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Catatan Tambahan */}
            <div className="bg-white rounded-xl shadow-md p-6">
              <label className="block text-lg font-semibold text-gray-800 mb-3">
                Catatan Tambahan (Opsional)
              </label>
              <textarea
                value={formData.notes}
                onChange={(e) => handleInputChange('notes', e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                rows="4"
                placeholder="Tambahkan catatan jika diperlukan..."
              />
            </div>
          </div>
        )}

        {/* Step 3: Survey Kepuasan */}
        {currentStep === 3 && (
          <div className="space-y-6">
            <div className="bg-white rounded-xl shadow-md p-8">
              <h3 className="text-xl font-semibold text-gray-800 mb-6 text-center">
                Bagaimana kepuasan Anda terhadap pelayanan hari ini?
              </h3>
              
              <div className="flex justify-center gap-8 mb-8">
                {/* Tidak Puas */}
                <button
                  onClick={() => handleInputChange('satisfaction', 1)}
                  className={`flex flex-col items-center p-6 rounded-xl transition-all ${
                    formData.satisfaction === 1
                      ? 'bg-red-100 border-4 border-red-500 scale-110'
                      : 'bg-gray-100 hover:bg-red-50 border-2 border-gray-300'
                  }`}
                >
                  <Frown className={`w-24 h-24 ${
                    formData.satisfaction === 1 ? 'text-red-600' : 'text-gray-400'
                  }`} />
                  <p className="mt-3 font-semibold text-gray-800">Tidak Puas</p>
                </button>

                {/* Cukup */}
                <button
                  onClick={() => handleInputChange('satisfaction', 2)}
                  className={`flex flex-col items-center p-6 rounded-xl transition-all ${
                    formData.satisfaction === 2
                      ? 'bg-yellow-100 border-4 border-yellow-500 scale-110'
                      : 'bg-gray-100 hover:bg-yellow-50 border-2 border-gray-300'
                  }`}
                >
                  <Meh className={`w-24 h-24 ${
                    formData.satisfaction === 2 ? 'text-yellow-600' : 'text-gray-400'
                  }`} />
                  <p className="mt-3 font-semibold text-gray-800">Cukup</p>
                </button>

                {/* Sangat Puas */}
                <button
                  onClick={() => handleInputChange('satisfaction', 3)}
                  className={`flex flex-col items-center p-6 rounded-xl transition-all ${
                    formData.satisfaction === 3
                      ? 'bg-green-100 border-4 border-green-500 scale-110'
                      : 'bg-gray-100 hover:bg-green-50 border-2 border-gray-300'
                  }`}
                >
                  <Smile className={`w-24 h-24 ${
                    formData.satisfaction === 3 ? 'text-green-600' : 'text-gray-400'
                  }`} />
                  <p className="mt-3 font-semibold text-gray-800">Sangat Puas</p>
                </button>
              </div>

              {/* Feedback */}
              <div className="mt-6">
                <label className="block text-lg font-semibold text-gray-800 mb-3">
                  Saran atau Masukan (Opsional)
                </label>
                <textarea
                  value={formData.feedback}
                  onChange={(e) => handleInputChange('feedback', e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                  rows="4"
                  placeholder="Berikan saran atau masukan Anda..."
                />
              </div>
            </div>
          </div>
        )}

        {/* Step 4: Ringkasan */}
        {currentStep === 4 && (
          <div className="space-y-6">
            <div className="bg-white rounded-xl shadow-md p-6">
              <h3 className="text-xl font-semibold text-gray-800 mb-6 flex items-center gap-2">
                <CheckCircle className="w-6 h-6 text-green-600" />
                Ringkasan Layanan
              </h3>

              {/* Pertanyaan */}
              <div className="space-y-4 mb-6">
                <div className="border-l-4 border-teal-600 pl-4">
                  <p className="font-semibold text-gray-800">Kondisi Saat Ini:</p>
                  <p className="text-gray-600">{formData.question1}</p>
                </div>
                <div className="border-l-4 border-teal-600 pl-4">
                  <p className="font-semibold text-gray-800">Kegiatan/Pekerjaan:</p>
                  <p className="text-gray-600">{formData.question2}</p>
                </div>
                <div className="border-l-4 border-teal-600 pl-4">
                  <p className="font-semibold text-gray-800">Lingkungan Sosial:</p>
                  <p className="text-gray-600">{formData.question3}</p>
                </div>
                <div className="border-l-4 border-teal-600 pl-4">
                  <p className="font-semibold text-gray-800">Kendala:</p>
                  <p className="text-gray-600">{formData.question4}</p>
                </div>
                <div className="border-l-4 border-teal-600 pl-4">
                  <p className="font-semibold text-gray-800">Rencana Ke Depan:</p>
                  <p className="text-gray-600">{formData.question5}</p>
                </div>
              </div>

              {/* Dokumentasi */}
              <div className="mb-6">
                <p className="font-semibold text-gray-800 mb-2">Dokumentasi:</p>
                <p className="text-gray-600">{formData.photos.length} foto tersimpan</p>
              </div>

              {/* Survey */}
              <div className="mb-6">
                <p className="font-semibold text-gray-800 mb-2">Kepuasan Klien:</p>
                <div className="flex items-center gap-2">
                  {formData.satisfaction === 1 && <><Frown className="w-6 h-6 text-red-600" /> <span>Tidak Puas</span></>}
                  {formData.satisfaction === 2 && <><Meh className="w-6 h-6 text-yellow-600" /> <span>Cukup</span></>}
                  {formData.satisfaction === 3 && <><Smile className="w-6 h-6 text-green-600" /> <span>Sangat Puas</span></>}
                </div>
              </div>

              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <p className="text-sm text-blue-800">
                  ✓ Data akan tersimpan di database klien dan PK sebagai bukti wajib lapor
                </p>
                <p className="text-sm text-blue-800 mt-1">
                  ✓ Laporan harian akan otomatis dibuat
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Navigation Buttons */}
        <div className="flex gap-4 mt-8">
          {currentStep > 1 && (
            <button
              onClick={() => setCurrentStep(currentStep - 1)}
              className="flex-1 bg-gray-600 text-white py-4 rounded-lg font-semibold hover:bg-gray-700 transition-colors flex items-center justify-center gap-2"
            >
              <ArrowLeft className="w-5 h-5" />
              Sebelumnya
            </button>
          )}
          
          <button
            onClick={saveProgress}
            disabled={saving}
            className="flex-1 bg-blue-600 text-white py-4 rounded-lg font-semibold hover:bg-blue-700 transition-colors flex items-center justify-center gap-2 disabled:bg-gray-400"
          >
            <Save className="w-5 h-5" />
            {saving ? 'Menyimpan...' : 'Simpan Progress'}
          </button>

          {currentStep < 4 ? (
            <button
              onClick={() => setCurrentStep(currentStep + 1)}
              className="flex-1 bg-teal-600 text-white py-4 rounded-lg font-semibold hover:bg-teal-700 transition-colors flex items-center justify-center gap-2"
            >
              Selanjutnya
              <ArrowRight className="w-5 h-5" />
            </button>
          ) : (
            <button
              onClick={completeService}
              disabled={saving}
              className="flex-1 bg-green-600 text-white py-4 rounded-lg font-semibold hover:bg-green-700 transition-colors flex items-center justify-center gap-2 disabled:bg-gray-400"
            >
              <Send className="w-5 h-5" />
              {saving ? 'Memproses...' : 'Selesai & Kirim'}
            </button>
          )}
        </div>
      </div>
    </div>
  )
}
