import { useState, useEffect } from 'react'
import axios from 'axios'
import { API_URL } from '../config'
import { 
  Users, Clock, CheckCircle, Settings, Database, Shield, 
  Activity, TrendingUp, BarChart3, Zap, Server, Eye,
  UserCheck, UserPlus, FileText, Bell, Calendar, Award
} from 'lucide-react'
import { useAuth } from '../context/AuthContext'

export default function AdminDashboard() {
  const { user } = useAuth()
  const [stats, setStats] = useState(null)
  const [systemHealth, setSystemHealth] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchData()
    const interval = setInterval(fetchData, 10000)
    return () => clearInterval(interval)
  }, [])

  const fetchData = async () => {
    try {
      const [statsRes, healthRes] = await Promise.all([
        axios.get(`${API_URL}/dashboard/stats`),
        axios.get(`${API_URL}/health`)
      ])
      setStats(statsRes.data)
      setSystemHealth(healthRes.data)
      setLoading(false)
    } catch (error) {
      console.error('Error fetching data:', error)
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-purple-600"></div>
      </div>
    )
  }

  const quickStats = [
    { 
      label: 'Total Antrian Hari Ini', 
      value: stats?.today?.total || 0, 
      icon: Users, 
      color: 'from-blue-500 to-blue-600',
      change: '+12%',
      trend: 'up'
    },
    { 
      label: 'Antrian Aktif', 
      value: (stats?.today?.waiting || 0) + (stats?.today?.serving || 0), 
      icon: Activity, 
      color: 'from-purple-500 to-purple-600',
      change: '+8%',
      trend: 'up'
    },
    { 
      label: 'Selesai Hari Ini', 
      value: stats?.today?.completed || 0, 
      icon: CheckCircle, 
      color: 'from-green-500 to-green-600',
      change: '+15%',
      trend: 'up'
    },
    { 
      label: 'Rata-rata Waktu', 
      value: '12 min', 
      icon: Clock, 
      color: 'from-orange-500 to-orange-600',
      change: '-5%',
      trend: 'down'
    }
  ]

  const systemMetrics = [
    { label: 'Total Users', value: '70', icon: UserCheck, color: 'text-blue-600' },
    { label: 'Active Services', value: '12', icon: Zap, color: 'text-purple-600' },
    { label: 'Database Size', value: '2.4 MB', icon: Database, color: 'text-green-600' },
    { label: 'API Uptime', value: '99.9%', icon: Server, color: 'text-orange-600' }
  ]

  const recentActivities = [
    { action: 'New user registered', user: 'Admin', time: '2 min ago', icon: UserPlus, color: 'bg-blue-100 text-blue-600' },
    { action: 'Queue completed', user: 'Operator 1', time: '5 min ago', icon: CheckCircle, color: 'bg-green-100 text-green-600' },
    { action: 'Settings updated', user: 'Admin', time: '10 min ago', icon: Settings, color: 'bg-purple-100 text-purple-600' },
    { action: 'New service added', user: 'Admin', time: '15 min ago', icon: Zap, color: 'bg-orange-100 text-orange-600' }
  ]

  const quickActions = [
    { label: 'Kelola Pengguna', icon: Users, color: 'from-blue-500 to-blue-600', link: '/users' },
    { label: 'Kelola Layanan', icon: Zap, color: 'from-purple-500 to-purple-600', link: '/services' },
    { label: 'Pengaturan Sistem', icon: Settings, color: 'from-green-500 to-green-600', link: '/settings' },
    { label: 'Lihat Laporan', icon: BarChart3, color: 'from-orange-500 to-orange-600', link: '/reports' }
  ]

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="bg-gradient-to-r from-purple-600 via-purple-700 to-indigo-700 rounded-2xl shadow-2xl p-8 text-white">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-4xl font-bold mb-2">
              Selamat Datang, {user?.name}! 👋
            </h1>
            <p className="text-purple-100 text-lg">
              KIANSANTANG - Panel Pengaturan Administrator
            </p>
            <p className="text-purple-200 text-sm mt-1">
              Kelola sistem antrian dengan mudah dan efisien
            </p>
          </div>
          <div className="hidden md:block">
            <div className="bg-white/10 backdrop-blur-lg rounded-xl p-6 border border-white/20">
              <Shield className="w-16 h-16 text-white mb-2" />
              <p className="text-sm font-semibold">Admin Access</p>
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
              className="bg-white rounded-xl shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden group"
            >
              <div className={`bg-gradient-to-br ${stat.color} p-6 text-white`}>
                <div className="flex items-center justify-between mb-4">
                  <Icon className="w-10 h-10 opacity-80" />
                  <div className={`flex items-center gap-1 text-sm font-semibold ${
                    stat.trend === 'up' ? 'text-green-200' : 'text-red-200'
                  }`}>
                    <TrendingUp className={`w-4 h-4 ${stat.trend === 'down' ? 'rotate-180' : ''}`} />
                    {stat.change}
                  </div>
                </div>
                <p className="text-3xl font-bold mb-1">{stat.value}</p>
                <p className="text-sm opacity-90">{stat.label}</p>
              </div>
              <div className="bg-gradient-to-r from-gray-50 to-white p-3">
                <button className="text-sm text-gray-600 hover:text-gray-900 font-medium flex items-center gap-1 group-hover:gap-2 transition-all">
                  Lihat Detail
                  <Eye className="w-4 h-4" />
                </button>
              </div>
            </div>
          )
        })}
      </div>

      {/* System Metrics & Quick Actions */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* System Metrics */}
        <div className="lg:col-span-2 bg-white rounded-xl shadow-lg p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
              <Activity className="w-6 h-6 text-purple-600" />
              Metrik Sistem
            </h2>
            <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm font-semibold">
              Healthy
            </span>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {systemMetrics.map((metric, index) => {
              const Icon = metric.icon
              return (
                <div 
                  key={index} 
                  className="bg-gradient-to-br from-gray-50 to-white rounded-lg p-4 border border-gray-100 hover:border-purple-200 transition-all hover:shadow-md"
                >
                  <Icon className={`w-8 h-8 ${metric.color} mb-2`} />
                  <p className="text-2xl font-bold text-gray-800">{metric.value}</p>
                  <p className="text-sm text-gray-600">{metric.label}</p>
                </div>
              )
            })}
          </div>

          {/* Chart Placeholder */}
          <div className="mt-6 bg-gradient-to-br from-purple-50 to-indigo-50 rounded-lg p-6 border border-purple-100">
            <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
              <BarChart3 className="w-5 h-5 text-purple-600" />
              Grafik Antrian 7 Hari Terakhir
            </h3>
            <div className="h-48 flex items-end justify-between gap-2">
              {[65, 45, 78, 52, 88, 72, 95].map((height, i) => (
                <div key={i} className="flex-1 flex flex-col items-center gap-2">
                  <div 
                    className="w-full bg-gradient-to-t from-purple-500 to-purple-400 rounded-t-lg hover:from-purple-600 hover:to-purple-500 transition-all cursor-pointer"
                    style={{ height: `${height}%` }}
                  ></div>
                  <span className="text-xs text-gray-600 font-medium">
                    {['Sen', 'Sel', 'Rab', 'Kam', 'Jum', 'Sab', 'Min'][i]}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Recent Activities */}
        <div className="bg-white rounded-xl shadow-lg p-6">
          <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center gap-2">
            <Bell className="w-6 h-6 text-purple-600" />
            Aktivitas Terbaru
          </h2>
          <div className="space-y-4">
            {recentActivities.map((activity, index) => {
              const Icon = activity.icon
              return (
                <div 
                  key={index} 
                  className="flex items-start gap-3 p-3 rounded-lg hover:bg-gray-50 transition-all cursor-pointer"
                >
                  <div className={`${activity.color} p-2 rounded-lg`}>
                    <Icon className="w-4 h-4" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-gray-800 truncate">
                      {activity.action}
                    </p>
                    <p className="text-xs text-gray-600">{activity.user}</p>
                    <p className="text-xs text-gray-400 mt-1">{activity.time}</p>
                  </div>
                </div>
              )
            })}
          </div>
          <button className="w-full mt-4 py-2 text-sm text-purple-600 hover:text-purple-700 font-semibold hover:bg-purple-50 rounded-lg transition-all">
            Lihat Semua Aktivitas
          </button>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="bg-white rounded-xl shadow-lg p-6">
        <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center gap-2">
          <Zap className="w-6 h-6 text-purple-600" />
          Aksi Cepat
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {quickActions.map((action, index) => {
            const Icon = action.icon
            return (
              <button
                key={index}
                onClick={() => window.location.href = action.link}
                className={`bg-gradient-to-br ${action.color} text-white rounded-xl p-6 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 group`}
              >
                <Icon className="w-12 h-12 mb-3 group-hover:scale-110 transition-transform" />
                <p className="font-semibold text-lg">{action.label}</p>
              </button>
            )
          })}
        </div>
      </div>

      {/* System Status */}
      <div className="bg-gradient-to-br from-gray-50 to-white rounded-xl shadow-lg p-6 border border-gray-100">
        <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center gap-2">
          <Server className="w-6 h-6 text-purple-600" />
          Status Sistem
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
              <div className="w-6 h-6 bg-green-500 rounded-full animate-pulse"></div>
            </div>
            <div>
              <p className="text-sm text-gray-600">Backend API</p>
              <p className="text-lg font-bold text-gray-800">Online</p>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
              <Database className="w-6 h-6 text-green-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Database</p>
              <p className="text-lg font-bold text-gray-800">Connected</p>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
              <Activity className="w-6 h-6 text-green-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Real-time Updates</p>
              <p className="text-lg font-bold text-gray-800">Active</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
