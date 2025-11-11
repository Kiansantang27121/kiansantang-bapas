import { useState, useEffect } from 'react'
import axios from 'axios'
import { API_URL } from '../config'
import { 
  Shield, BarChart3, Users, TrendingUp, Activity, 
  FileText, Award, Target, Eye, Download
} from 'lucide-react'
import { useAuth } from '../context/AuthContext'

export default function StrukturalDashboard() {
  const { user } = useAuth()
  const [stats, setStats] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchStats()
    const interval = setInterval(fetchStats, 10000)
    return () => clearInterval(interval)
  }, [])

  const fetchStats = async () => {
    try {
      const response = await axios.get(`${API_URL}/dashboard/stats`)
      setStats(response.data)
      setLoading(false)
    } catch (error) {
      console.error('Error fetching stats:', error)
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-cyan-600"></div>
      </div>
    )
  }

  const quickStats = [
    { 
      label: 'Total Antrian Bulan Ini', 
      value: stats?.month?.total || 0, 
      icon: BarChart3, 
      color: 'from-cyan-500 to-cyan-600',
      change: '+15%'
    },
    { 
      label: 'Total PK Aktif', 
      value: '63', 
      icon: Users, 
      color: 'from-blue-500 to-blue-600',
      change: '100%'
    },
    { 
      label: 'Tingkat Kehadiran', 
      value: '92%', 
      icon: Target, 
      color: 'from-green-500 to-green-600',
      change: '+5%'
    },
    { 
      label: 'Rata-rata Layanan', 
      value: '12 min', 
      icon: Activity, 
      color: 'from-purple-500 to-purple-600',
      change: '-3%'
    }
  ]

  const performanceMetrics = [
    { label: 'Total Layanan', value: '1,234', icon: FileText, color: 'text-cyan-600' },
    { label: 'Kepuasan Klien', value: '4.8/5', icon: Award, color: 'text-blue-600' },
    { label: 'Efisiensi Waktu', value: '95%', icon: TrendingUp, color: 'text-green-600' },
    { label: 'Kepatuhan SOP', value: '98%', icon: Shield, color: 'text-purple-600' }
  ]

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="bg-gradient-to-r from-cyan-600 via-cyan-700 to-blue-700 rounded-2xl shadow-2xl p-8 text-white">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-4xl font-bold mb-2">
              Selamat Datang, {user?.name}! 👋
            </h1>
            <p className="text-cyan-100 text-lg">
              Dashboard Struktural - Monitoring & Evaluasi
            </p>
            <p className="text-cyan-200 text-sm mt-1">
              Pantau kinerja dan statistik sistem secara menyeluruh
            </p>
          </div>
          <div className="hidden md:block">
            <div className="bg-white/10 backdrop-blur-lg rounded-xl p-6 border border-white/20">
              <Shield className="w-16 h-16 text-white mb-2" />
              <p className="text-sm font-semibold">Struktural</p>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {quickStats.map((stat, index) => {
          const Icon = stat.icon
          return (
            <div 
              key={index} 
              className="bg-white rounded-xl shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden"
            >
              <div className={`bg-gradient-to-br ${stat.color} p-6 text-white`}>
                <div className="flex items-center justify-between mb-4">
                  <Icon className="w-10 h-10 opacity-80" />
                  <div className={`flex items-center gap-1 text-sm font-semibold ${
                    stat.change.startsWith('+') ? 'text-green-200' : 'text-red-200'
                  }`}>
                    <TrendingUp className={`w-4 h-4 ${stat.change.startsWith('-') ? 'rotate-180' : ''}`} />
                    {stat.change}
                  </div>
                </div>
                <p className="text-3xl font-bold mb-1">{stat.value}</p>
                <p className="text-sm opacity-90">{stat.label}</p>
              </div>
            </div>
          )
        })}
      </div>

      {/* Performance Metrics */}
      <div className="bg-white rounded-xl shadow-lg p-6">
        <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center gap-2">
          <BarChart3 className="w-6 h-6 text-cyan-600" />
          Metrik Kinerja
        </h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {performanceMetrics.map((metric, index) => {
            const Icon = metric.icon
            return (
              <div 
                key={index} 
                className="bg-gradient-to-br from-gray-50 to-white rounded-lg p-4 border border-gray-100 hover:border-cyan-200 transition-all hover:shadow-md"
              >
                <Icon className={`w-8 h-8 ${metric.color} mb-2`} />
                <p className="text-2xl font-bold text-gray-800">{metric.value}</p>
                <p className="text-sm text-gray-600">{metric.label}</p>
              </div>
            )
          })}
        </div>
      </div>

      {/* Charts & Reports */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Grafik Kinerja */}
        <div className="bg-white rounded-xl shadow-lg p-6">
          <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center gap-2">
            <TrendingUp className="w-6 h-6 text-cyan-600" />
            Grafik Kinerja 7 Hari
          </h2>
          <div className="bg-gradient-to-br from-cyan-50 to-blue-50 rounded-lg p-6 border border-cyan-100">
            <div className="h-48 flex items-end justify-between gap-2">
              {[85, 72, 95, 68, 88, 92, 78].map((height, i) => (
                <div key={i} className="flex-1 flex flex-col items-center gap-2">
                  <div 
                    className="w-full bg-gradient-to-t from-cyan-500 to-cyan-400 rounded-t-lg hover:from-cyan-600 hover:to-cyan-500 transition-all cursor-pointer relative group"
                    style={{ height: `${height}%` }}
                  >
                    <span className="absolute -top-6 left-1/2 transform -translate-x-1/2 text-xs font-bold text-gray-700 opacity-0 group-hover:opacity-100 transition-opacity">
                      {height}%
                    </span>
                  </div>
                  <span className="text-xs text-gray-600 font-medium">
                    {['Sen', 'Sel', 'Rab', 'Kam', 'Jum', 'Sab', 'Min'][i]}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Top Performers */}
        <div className="bg-white rounded-xl shadow-lg p-6">
          <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center gap-2">
            <Award className="w-6 h-6 text-cyan-600" />
            Top Performers
          </h2>
          <div className="space-y-3">
            {[
              { name: 'Budiana', role: 'PK', score: 98, clients: 45 },
              { name: 'Ryan Rizkia', role: 'PK', score: 96, clients: 42 },
              { name: 'Petugas Layanan 1', role: 'Petugas', score: 95, clients: 38 },
              { name: 'Ade Suryadi', role: 'PK', score: 94, clients: 40 }
            ].map((performer, index) => (
              <div key={index} className="flex items-center justify-between p-4 bg-gradient-to-r from-cyan-50 to-blue-50 rounded-lg border border-cyan-200">
                <div className="flex items-center gap-3">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-white ${
                    index === 0 ? 'bg-yellow-500' :
                    index === 1 ? 'bg-gray-400' :
                    index === 2 ? 'bg-orange-600' : 'bg-cyan-600'
                  }`}>
                    {index + 1}
                  </div>
                  <div>
                    <p className="font-semibold text-gray-800">{performer.name}</p>
                    <p className="text-sm text-gray-600">{performer.role} • {performer.clients} klien</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-2xl font-bold text-cyan-600">{performer.score}</p>
                  <p className="text-xs text-gray-600">Score</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="bg-white rounded-xl shadow-lg p-6">
        <h2 className="text-2xl font-bold text-gray-800 mb-6">Laporan & Analisis</h2>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {[
            { label: 'Lihat Laporan Lengkap', icon: Eye, color: 'from-cyan-500 to-cyan-600' },
            { label: 'Download Laporan', icon: Download, color: 'from-blue-500 to-blue-600' },
            { label: 'Analisis Kinerja', icon: BarChart3, color: 'from-purple-500 to-purple-600' },
            { label: 'Evaluasi Bulanan', icon: FileText, color: 'from-green-500 to-green-600' }
          ].map((action, index) => {
            const Icon = action.icon
            return (
              <button
                key={index}
                className={`bg-gradient-to-br ${action.color} text-white rounded-xl p-6 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1`}
              >
                <Icon className="w-12 h-12 mb-3 mx-auto" />
                <p className="font-semibold text-sm">{action.label}</p>
              </button>
            )
          })}
        </div>
      </div>
    </div>
  )
}
