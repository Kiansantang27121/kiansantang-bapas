import { CheckCircle, Sparkles, Clock, User, RefreshCw, Info, UserCheck, Printer, Send, Home } from 'lucide-react'

export default function SuccessScreen({ result, onNewRegistration }) {
  const handlePrint = () => {
    window.print()
  }

  const handleWhatsApp = () => {
    const message = `*NOMOR ANTRIAN BAPAS BANDUNG*%0A%0A` +
      `Nomor: *${result.queue_number}*%0A` +
      `Layanan: ${result.service_name}%0A` +
      `Nama: ${result.client_name}%0A` +
      `Estimasi: ~${result.estimated_time} menit%0A` +
      (result.pk_name ? `PK: ${result.pk_name}%0A` : '') +
      `%0ASilakan tunggu nomor antrian Anda dipanggil.`
    
    window.open(`https://wa.me/?text=${message}`, '_blank')
  }

  const handleFinish = () => {
    window.location.href = '/'
  }
  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Animated Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-emerald-400 via-cyan-500 to-blue-600">
        <div className="absolute inset-0 opacity-30">
          <div className="absolute top-0 -left-4 w-72 h-72 bg-purple-300 rounded-full mix-blend-multiply filter blur-xl animate-blob"></div>
          <div className="absolute top-0 -right-4 w-72 h-72 bg-yellow-300 rounded-full mix-blend-multiply filter blur-xl animate-blob animation-delay-2000"></div>
          <div className="absolute -bottom-8 left-20 w-72 h-72 bg-pink-300 rounded-full mix-blend-multiply filter blur-xl animate-blob animation-delay-4000"></div>
        </div>
      </div>

      {/* Content */}
      <div className="relative min-h-screen flex items-center justify-center p-4">
        <div className="bg-white/95 backdrop-blur-xl rounded-3xl shadow-2xl p-8 max-w-lg w-full border border-white/20 animate-scale-in">
          {/* Success Icon */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-24 h-24 bg-gradient-to-br from-emerald-400 to-cyan-500 rounded-full mb-6 animate-bounce-slow">
              <CheckCircle className="w-14 h-14 text-white" strokeWidth={2.5} />
            </div>
            <h2 className="text-4xl font-black text-gray-800 mb-3 bg-gradient-to-r from-emerald-600 to-cyan-600 bg-clip-text text-transparent">
              Berhasil!
            </h2>
            <p className="text-gray-600 text-lg">Nomor antrian Anda telah dibuat</p>
          </div>

          {/* Queue Number Card */}
          <div className="relative mb-8 group">
            <div className="absolute -inset-1 bg-gradient-to-r from-emerald-500 via-cyan-500 to-blue-500 rounded-2xl blur opacity-75 group-hover:opacity-100 transition duration-1000 animate-pulse"></div>
            <div className="relative bg-gradient-to-br from-emerald-500 via-cyan-500 to-blue-600 rounded-2xl p-8 text-center">
              <div className="flex items-center justify-center mb-3">
                <Sparkles className="w-6 h-6 text-yellow-300 mr-2 animate-pulse" />
                <span className="text-white/90 text-sm font-semibold uppercase tracking-wider">
                  Nomor Antrian
                </span>
                <Sparkles className="w-6 h-6 text-yellow-300 ml-2 animate-pulse" />
              </div>
              <div className="text-white text-7xl font-black mb-3 tracking-tight drop-shadow-lg">
                {result.queue_number}
              </div>
              <div className="inline-block bg-white/20 backdrop-blur-sm px-4 py-2 rounded-full">
                <span className="text-white text-sm font-semibold">
                  {result.service_name}
                </span>
              </div>
            </div>
          </div>

          {/* Details Grid */}
          <div className="space-y-4 mb-8">
            {/* Nama - Full Width */}
            <div className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl p-4 border border-gray-200">
              <div className="flex items-center text-gray-600 text-sm mb-2">
                <User className="w-4 h-4 mr-2" />
                Nama
              </div>
              <div className="font-bold text-gray-800 text-lg break-words leading-tight">
                {result.client_name}
              </div>
            </div>
            
            {/* Estimasi */}
            <div className="bg-gradient-to-br from-blue-50 to-cyan-50 rounded-xl p-4 border border-blue-200">
              <div className="flex items-center text-blue-600 text-sm mb-2">
                <Clock className="w-4 h-4 mr-2" />
                Estimasi
              </div>
              <div className="font-bold text-blue-800 text-lg">
                ~{result.estimated_time} menit
              </div>
            </div>
          </div>

          {/* PK Info (if Bimbingan Wajib Lapor) */}
          {result.pk_name && (
            <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-xl p-4 border border-purple-200 mb-8 animate-fade-in">
              <div className="flex items-center text-purple-600 text-sm mb-2">
                <UserCheck className="w-4 h-4 mr-2" />
                Pembimbing Kemasyarakatan
              </div>
              <div className="font-bold text-purple-800 text-lg">
                {result.pk_name}
              </div>
            </div>
          )}

          {/* Info Box */}
          <div className="bg-gradient-to-r from-blue-50 to-cyan-50 border-2 border-blue-200 rounded-xl p-4 mb-8">
            <div className="flex items-start">
              <Info className="w-5 h-5 text-blue-600 mr-3 mt-0.5 flex-shrink-0" />
              <p className="text-blue-800 text-sm leading-relaxed">
                Silakan tunggu nomor antrian Anda dipanggil. Pantau <strong>layar display</strong> untuk informasi terkini.
              </p>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="grid grid-cols-3 gap-3">
            {/* Print Button */}
            <button
              onClick={handlePrint}
              className="bg-gradient-to-br from-blue-500 to-blue-600 text-white py-3 rounded-xl font-bold text-sm hover:shadow-xl hover:scale-105 transition-all duration-300 flex flex-col items-center justify-center group"
            >
              <Printer className="w-6 h-6 mb-1 group-hover:scale-110 transition-transform" />
              <span>Print</span>
            </button>

            {/* WhatsApp Button */}
            <button
              onClick={handleWhatsApp}
              className="bg-gradient-to-br from-green-500 to-green-600 text-white py-3 rounded-xl font-bold text-sm hover:shadow-xl hover:scale-105 transition-all duration-300 flex flex-col items-center justify-center group"
            >
              <Send className="w-6 h-6 mb-1 group-hover:translate-x-1 transition-transform" />
              <span>WhatsApp</span>
            </button>

            {/* Finish Button */}
            <button
              onClick={handleFinish}
              className="bg-gradient-to-br from-purple-500 to-purple-600 text-white py-3 rounded-xl font-bold text-sm hover:shadow-xl hover:scale-105 transition-all duration-300 flex flex-col items-center justify-center group"
            >
              <Home className="w-6 h-6 mb-1 group-hover:scale-110 transition-transform" />
              <span>Selesai</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
