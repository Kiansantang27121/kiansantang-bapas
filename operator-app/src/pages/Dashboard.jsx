import { useState, useEffect } from 'react'
import axios from 'axios'
import { API_URL } from '../config'
import { Users, Clock, CheckCircle, XCircle } from 'lucide-react'

export default function Dashboard() {
  const [stats, setStats] = useState(null)

  useEffect(() => {
    fetchStats()
    const interval = setInterval(fetchStats, 10000)
    return () => clearInterval(interval)
  }, [])

  const fetchStats = async () => {
    try {
      const response = await axios.get(`${API_URL}/dashboard/stats`)
      setStats(response.data)
    } catch (error) {
      console.error('Error fetching stats:', error)
    }
  }

  if (!stats) return <div>Loading...</div>

  const statCards = [
    { label: 'Total Hari Ini', value: stats.today.total, icon: Users, color: 'blue' },
    { label: 'Menunggu', value: stats.today.waiting, icon: Clock, color: 'yellow' },
    { label: 'Sedang Dilayani', value: stats.today.serving, icon: Users, color: 'indigo' },
    { label: 'Selesai', value: stats.today.completed, icon: CheckCircle, color: 'green' }
  ]

  return (
    <div>
      <h1 className="text-3xl font-bold text-gray-800 mb-8">Dashboard</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {statCards.map((stat, index) => {
          const Icon = stat.icon
          return (
            <div key={index} className="bg-white rounded-lg shadow p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 mb-1">{stat.label}</p>
                  <p className="text-3xl font-bold text-gray-800">{stat.value}</p>
                </div>
                <Icon className={`w-12 h-12 text-${stat.color}-500`} />
              </div>
            </div>
          )
        })}
      </div>

      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-xl font-bold text-gray-800 mb-4">Antrian per Layanan</h2>
        <div className="space-y-3">
          {stats.byService.map((service, index) => (
            <div key={index} className="flex justify-between items-center p-3 bg-gray-50 rounded">
              <span className="font-semibold text-gray-700">{service.name}</span>
              <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-semibold">
                {service.count} antrian
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
