import { Shield, Clock, ArrowRight, Sparkles, Users, FileText, MessageSquare, Briefcase, UserPlus, ClipboardList, MessageCircle, FileCheck, FolderOpen, Calendar, UserCheck, BookOpen, HeartHandshake, Info, AlertCircle, QrCode, Smartphone } from 'lucide-react'
import { QRCodeSVG } from 'qrcode.react'
import { useState } from 'react'

// Urutan layanan: Penghadapan, Bimbingan Wajib Lapor, Kunjungan, Informasi dan Pengaduan
const serviceOrder = [
  'Penghadapan',
  'Bimbingan Wajib Lapor',
  'Kunjungan',
  'Informasi dan Pengaduan'
]

// Status layanan - Semua aktif kecuali yang disebutkan coming soon
const comingSoonServices = [
  'Penghadapan',
  'Kunjungan', 
  'Pengaduan',
  'Informasi dan Pengaduan'
]

// Function to check if service is active
const isServiceActive = (serviceName) => {
  // Check if service name contains any coming soon keywords
  return !comingSoonServices.some(cs => 
    serviceName.toLowerCase().includes(cs.toLowerCase()) ||
    cs.toLowerCase().includes(serviceName.toLowerCase())
  )
}

// Function to get icon based on service name with flexible matching
const getServiceIcon = (serviceName) => {
  const name = serviceName.toLowerCase()
  
  if (name.includes('penghadapan')) return Calendar
  if (name.includes('bimbingan') && name.includes('wajib')) return UserCheck
  if (name.includes('kunjungan')) return HeartHandshake
  if (name.includes('pengaduan') || name.includes('informasi')) return AlertCircle
  if (name.includes('pendaftaran') || name.includes('klien')) return UserPlus
  if (name.includes('konsultasi')) return MessageCircle
  if (name.includes('pelaporan')) return ClipboardList
  if (name.includes('administrasi')) return FolderOpen
  if (name.includes('bimbingan') && !name.includes('wajib')) return BookOpen
  
  return Briefcase // default
}

// Function to get colors based on service name with flexible matching
const getServiceColors = (serviceName) => {
  const name = serviceName.toLowerCase()
  
  if (name.includes('penghadapan')) {
    return { 
      gradient: 'from-rose-500 via-pink-500 to-fuchsia-500', 
      shadow: 'shadow-rose-500/50', 
      hover: 'hover:shadow-rose-500/70',
      bg: 'bg-rose-500'
    }
  }
  
  if (name.includes('bimbingan') && name.includes('wajib')) {
    return { 
      gradient: 'from-blue-500 via-indigo-500 to-violet-500', 
      shadow: 'shadow-blue-500/50', 
      hover: 'hover:shadow-blue-500/70',
      bg: 'bg-blue-500'
    }
  }
  
  if (name.includes('kunjungan')) {
    return { 
      gradient: 'from-emerald-500 via-teal-500 to-cyan-500', 
      shadow: 'shadow-emerald-500/50', 
      hover: 'hover:shadow-emerald-500/70',
      bg: 'bg-emerald-500'
    }
  }
  
  if (name.includes('pengaduan') || name.includes('informasi')) {
    return { 
      gradient: 'from-orange-500 via-amber-500 to-yellow-500', 
      shadow: 'shadow-orange-500/50', 
      hover: 'hover:shadow-orange-500/70',
      bg: 'bg-orange-500'
    }
  }
  
  if (name.includes('pendaftaran') || name.includes('klien')) {
    return { 
      gradient: 'from-green-500 via-lime-500 to-emerald-500', 
      shadow: 'shadow-green-500/50', 
      hover: 'hover:shadow-green-500/70',
      bg: 'bg-green-500'
    }
  }
  
  if (name.includes('konsultasi')) {
    return { 
      gradient: 'from-purple-500 via-violet-500 to-indigo-500', 
      shadow: 'shadow-purple-500/50', 
      hover: 'hover:shadow-purple-500/70',
      bg: 'bg-purple-500'
    }
  }
  
  if (name.includes('pelaporan')) {
    return { 
      gradient: 'from-red-500 via-rose-500 to-pink-500', 
      shadow: 'shadow-red-500/50', 
      hover: 'hover:shadow-red-500/70',
      bg: 'bg-red-500'
    }
  }
  
  if (name.includes('administrasi')) {
    return { 
      gradient: 'from-indigo-500 via-blue-500 to-sky-500', 
      shadow: 'shadow-indigo-500/50', 
      hover: 'hover:shadow-indigo-500/70',
      bg: 'bg-indigo-500'
    }
  }
  
  // Default color
  return { 
    gradient: 'from-gray-500 via-slate-500 to-zinc-500', 
    shadow: 'shadow-gray-500/50', 
    hover: 'hover:shadow-gray-500/70',
    bg: 'bg-gray-500'
  }
}

export default function ServiceSelection({ services, settings, onSelectService }) {
  const [showQR, setShowQR] = useState({})
  
  // Sort services based on serviceOrder with flexible matching
  const sortedServices = [...services].sort((a, b) => {
    // Find matching index with flexible matching
    const findOrderIndex = (serviceName) => {
      return serviceOrder.findIndex(order => 
        serviceName.toLowerCase().includes(order.toLowerCase()) ||
        order.toLowerCase().includes(serviceName.toLowerCase())
      )
    }
    
    const indexA = findOrderIndex(a.name)
    const indexB = findOrderIndex(b.name)
    
    // If both are in the order list, sort by order
    if (indexA !== -1 && indexB !== -1) {
      return indexA - indexB
    }
    // If only A is in the order list, A comes first
    if (indexA !== -1) return -1
    // If only B is in the order list, B comes first
    if (indexB !== -1) return 1
    // If neither is in the order list, keep original order
    return 0
  })
  
  const toggleQR = (serviceId) => {
    setShowQR(prev => ({ ...prev, [serviceId]: !prev[serviceId] }))
  }
  
  const getServiceURL = (serviceId) => {
    return `${window.location.origin}?service=${serviceId}`
  }

  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Animated Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-500 via-purple-500 to-pink-500">
        <div className="absolute inset-0 opacity-30">
          <div className="absolute top-0 -left-4 w-96 h-96 bg-purple-300 rounded-full mix-blend-multiply filter blur-xl animate-blob"></div>
          <div className="absolute top-0 -right-4 w-96 h-96 bg-yellow-300 rounded-full mix-blend-multiply filter blur-xl animate-blob animation-delay-2000"></div>
          <div className="absolute -bottom-8 left-20 w-96 h-96 bg-pink-300 rounded-full mix-blend-multiply filter blur-xl animate-blob animation-delay-4000"></div>
        </div>
      </div>

      {/* Content */}
      <div className="relative container mx-auto px-4 py-4">
        <div className="max-w-6xl mx-auto">
          {/* Header - Compact */}
          <div className="text-center mb-6 animate-slide-down">
            {/* Logo */}
            <div className="inline-flex items-center justify-center w-16 h-16 bg-white/95 backdrop-blur-xl rounded-2xl mb-3 shadow-xl">
              {settings.logo_url ? (
                <img src={settings.logo_url} alt="Logo" className="w-10 h-10 object-contain" />
              ) : (
                <Shield className="w-10 h-10 text-blue-600" />
              )}
            </div>

            {/* Title */}
            <h1 className="text-3xl font-black text-white mb-2 drop-shadow-lg">
              {settings.office_name || 'BAPAS Bandung'}
            </h1>
            <p className="text-white/90 text-sm mb-1 drop-shadow">{settings.office_address}</p>
            <p className="text-white/90 text-xs mb-3 drop-shadow">{settings.office_phone}</p>

            {/* Operating Hours Badge */}
            <div className="inline-flex items-center bg-white/95 backdrop-blur-xl text-gray-800 px-4 py-2 rounded-full shadow-xl">
              <Clock className="w-4 h-4 mr-2 text-blue-600" />
              <span className="font-bold text-sm">
                {settings.working_hours || '08:00 - 16:00'}
              </span>
            </div>
          </div>

          {/* Service Selection Title */}
          <div className="text-center mb-4 animate-fade-in">
            <div className="inline-flex items-center bg-white/95 backdrop-blur-xl px-5 py-2.5 rounded-xl shadow-xl">
              <Sparkles className="w-5 h-5 text-purple-600 mr-2" />
              <h2 className="text-xl font-black text-gray-800">
                Pilih Jenis Layanan
              </h2>
              <Sparkles className="w-5 h-5 text-purple-600 ml-2" />
            </div>
          </div>

          {/* Services Grid - Centered and Symmetric */}
          <div className="flex justify-center mb-4">
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 max-w-7xl">
              {sortedServices.map((service, index) => {
                const Icon = getServiceIcon(service.name)
                const colors = getServiceColors(service.name)
                const isActive = isServiceActive(service.name)
                
                return (
                  <button
                    key={service.id}
                    onClick={() => isActive && onSelectService(service)}
                    disabled={!isActive}
                    className={`group relative bg-white/95 backdrop-blur-xl rounded-2xl p-4 shadow-xl ${colors.shadow} transition-all duration-500 border-2 border-white/30 text-left animate-slide-up overflow-hidden ${
                      isActive 
                        ? `${colors.hover} hover:scale-105 hover:-translate-y-2 cursor-pointer` 
                        : 'opacity-60 cursor-not-allowed grayscale hover:grayscale-0'
                    }`}
                    style={{ animationDelay: `${index * 100}ms` }}
                  >
                    {/* Status Badge */}
                    <div className="absolute top-2 right-2 z-10">
                      {isActive ? (
                        <div className="flex items-center gap-1 bg-green-500 text-white px-2 py-1 rounded-full text-[10px] font-bold shadow-md">
                          <div className="w-1.5 h-1.5 bg-white rounded-full animate-pulse"></div>
                          <span>AKTIF</span>
                        </div>
                      ) : (
                        <div className="flex items-center gap-1 bg-gradient-to-r from-orange-500 to-amber-500 text-white px-2 py-1 rounded-full text-[10px] font-bold shadow-md">
                          <Clock className="w-2.5 h-2.5" />
                          <span>SOON</span>
                        </div>
                      )}
                    </div>

                    {/* Decorative Corner */}
                    <div className={`absolute top-0 right-0 w-12 h-12 bg-gradient-to-br ${colors.gradient} opacity-10 rounded-bl-full`}></div>
                    
                    {/* Icon Container with Glow */}
                    <div className="relative mb-3">
                      <div className={`absolute inset-0 bg-gradient-to-br ${colors.gradient} blur-lg opacity-50 group-hover:opacity-70 transition-opacity duration-300`}></div>
                      <div className={`relative w-14 h-14 bg-gradient-to-br ${colors.gradient} rounded-xl flex items-center justify-center shadow-lg group-hover:scale-110 group-hover:rotate-6 transition-all duration-500`}>
                        <Icon className="w-8 h-8 text-white drop-shadow-lg" strokeWidth={2.5} />
                      </div>
                    </div>

                    {/* Service Name */}
                    <h3 className="text-sm font-black text-gray-800 mb-1.5 group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-blue-600 group-hover:to-purple-600 transition-all duration-300 leading-tight">
                      {service.name}
                    </h3>

                    {/* Description */}
                    <p className="text-gray-600 text-xs mb-2 leading-relaxed line-clamp-2">
                      {service.description}
                    </p>

                    {/* Estimated Time Badge */}
                    <div className={`inline-flex items-center bg-gradient-to-r ${colors.gradient} text-white px-2 py-1 rounded-full text-[10px] font-bold shadow-sm mb-2`}>
                      <Clock className="w-3 h-3 mr-1" />
                      <span>~{service.estimated_time} mnt</span>
                    </div>

                    {/* QR Code Toggle Button - Only for active services */}
                    {isActive && (
                      <button
                        onClick={(e) => {
                          e.stopPropagation()
                          toggleQR(service.id)
                        }}
                        className="flex items-center gap-1 text-[10px] text-gray-600 hover:text-blue-600 transition-colors duration-200 font-medium"
                      >
                        <QrCode className="w-3 h-3" />
                        <span>{showQR[service.id] ? 'Hide QR' : 'Show QR'}</span>
                      </button>
                    )}

                    {/* QR Code Display */}
                    {showQR[service.id] && (
                      <div className="mt-2 p-2 bg-white rounded-xl border border-gray-200 shadow-inner">
                        <div className="flex flex-col items-center">
                          <QRCodeSVG 
                            value={getServiceURL(service.id)}
                            size={80}
                            level="H"
                            includeMargin={true}
                            className="mb-1"
                          />
                          <div className="text-center">
                            <p className="text-[10px] font-bold text-gray-800">Scan untuk Akses</p>
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Arrow Icon - Bottom Right - Only for active services */}
                    {isActive && (
                      <div className={`absolute bottom-2 right-2 w-7 h-7 bg-gradient-to-br ${colors.gradient} rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300 shadow-md group-hover:scale-110`}>
                        <ArrowRight className="w-4 h-4 text-white group-hover:translate-x-0.5 transition-transform" strokeWidth={3} />
                      </div>
                    )}

                    {/* Coming Soon Overlay */}
                    {!isActive && (
                      <div className="absolute inset-0 bg-gradient-to-br from-gray-900/5 to-gray-900/10 rounded-2xl flex items-center justify-center pointer-events-none">
                        <div className="text-center">
                          <div className="text-2xl mb-1">🚧</div>
                          <p className="text-[10px] font-bold text-gray-600">Segera Hadir</p>
                        </div>
                      </div>
                    )}

                    {/* Animated Border Glow */}
                    <div className={`absolute inset-0 bg-gradient-to-br ${colors.gradient} opacity-0 group-hover:opacity-20 rounded-3xl transition-opacity duration-500 blur-sm`}></div>
                    
                    {/* Shine Effect */}
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000 ease-in-out"></div>
                  </button>
                )
              })}
            </div>
          </div>

          {/* Info Footer - Compact */}
          <div className="grid md:grid-cols-2 gap-3 animate-fade-in">
            {/* Cara Menggunakan */}
            <div className="bg-white/90 backdrop-blur-xl border border-blue-200 rounded-xl p-3 shadow-md">
              <div className="flex items-start">
                <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-lg flex items-center justify-center mr-2 flex-shrink-0">
                  <Sparkles className="w-4 h-4 text-white" />
                </div>
                <div>
                  <h3 className="font-bold text-gray-800 text-sm mb-1">Cara Menggunakan:</h3>
                  <ol className="text-xs text-gray-700 space-y-0.5 list-decimal list-inside">
                    <li><strong>Pilih layanan</strong> di atas</li>
                    <li><strong>Isi formulir</strong> pendaftaran</li>
                    <li><strong>Dapatkan nomor</strong> antrian</li>
                    <li><strong>Tunggu</strong> dipanggil</li>
                  </ol>
                </div>
              </div>
            </div>

            {/* Akses Opsional */}
            <div className="bg-gradient-to-br from-purple-50 to-pink-50 border border-purple-200 rounded-xl p-3 shadow-md">
              <div className="flex items-start">
                <div className="w-8 h-8 bg-gradient-to-br from-purple-500 to-pink-500 rounded-lg flex items-center justify-center mr-2 flex-shrink-0">
                  <Smartphone className="w-4 h-4 text-white" />
                </div>
                <div>
                  <h3 className="font-bold text-gray-800 text-sm mb-1">Akses Opsional:</h3>
                  <div className="text-xs text-gray-700 space-y-1">
                    <div className="flex items-start gap-1.5">
                      <div className="w-4 h-4 bg-blue-500 text-white rounded-full flex items-center justify-center text-[10px] font-bold flex-shrink-0">1</div>
                      <p><strong>Klik panel</strong> untuk akses langsung</p>
                    </div>
                    <div className="flex items-start gap-1.5">
                      <div className="w-4 h-4 bg-purple-500 text-white rounded-full flex items-center justify-center text-[10px] font-bold flex-shrink-0">2</div>
                      <p><strong>Scan QR</strong> dengan HP</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
