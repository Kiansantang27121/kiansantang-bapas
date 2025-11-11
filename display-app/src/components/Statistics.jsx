import { useState, useEffect } from 'react'
import { Users, Clock, CheckCircle, XCircle, TrendingUp } from 'lucide-react'

export default function Statistics({ queues, settings, position = 'bottom' }) {
  const [stats, setStats] = useState({
    total: 0,
    waiting: 0,
    called: 0,
    serving: 0,
    completed: 0,
    cancelled: 0,
    avgWaitTime: 0
  })

  useEffect(() => {
    calculateStats()
  }, [queues])

  const calculateStats = () => {
    if (!queues || queues.length === 0) {
      setStats({
        total: 0,
        waiting: 0,
        called: 0,
        serving: 0,
        completed: 0,
        cancelled: 0,
        avgWaitTime: 0
      })
      return
    }

    const total = queues.length
    const waiting = queues.filter(q => q.status === 'waiting').length
    const called = queues.filter(q => q.status === 'called').length
    const serving = queues.filter(q => q.status === 'serving').length
    const completed = queues.filter(q => q.status === 'completed').length
    const cancelled = queues.filter(q => q.status === 'cancelled').length

    // Calculate average wait time (for completed queues)
    const completedQueues = queues.filter(q => q.status === 'completed' && q.completed_at && q.created_at)
    let avgWaitTime = 0
    if (completedQueues.length > 0) {
      const totalWaitTime = completedQueues.reduce((sum, q) => {
        const wait = new Date(q.completed_at) - new Date(q.created_at)
        return sum + wait
      }, 0)
      avgWaitTime = Math.round(totalWaitTime / completedQueues.length / 60000) // Convert to minutes
    }

    setStats({
      total,
      waiting,
      called,
      serving,
      completed,
      cancelled,
      avgWaitTime
    })
  }

  const borderColor = settings.theme_border_color || '#06b6d4'
  const accentColor = settings.theme_accent || '#06b6d4'

  // Compact horizontal layout for bottom/top
  if (position === 'bottom' || position === 'top') {
    return (
      <div 
        className="py-3 px-4 border-t-2"
        style={{
          background: `linear-gradient(to right, ${settings.theme_panel_from || '#1f2937'}, ${settings.theme_panel_to || '#111827'})`,
          borderTopColor: borderColor
        }}
      >
        <div className="flex items-center justify-around text-center">
          <StatItem 
            icon={<Users className="w-5 h-5" />}
            label="Total"
            value={stats.total}
            color={accentColor}
          />
          <StatItem 
            icon={<Clock className="w-5 h-5" />}
            label="Menunggu"
            value={stats.waiting}
            color="#facc15"
          />
          <StatItem 
            icon={<TrendingUp className="w-5 h-5" />}
            label="Dilayani"
            value={stats.serving}
            color="#10b981"
          />
          <StatItem 
            icon={<CheckCircle className="w-5 h-5" />}
            label="Selesai"
            value={stats.completed}
            color="#06b6d4"
          />
          {stats.avgWaitTime > 0 && (
            <StatItem 
              icon={<Clock className="w-5 h-5" />}
              label="Rata-rata"
              value={`${stats.avgWaitTime}m`}
              color="#8b5cf6"
            />
          )}
        </div>
      </div>
    )
  }

  // Vertical sidebar layout
  return (
    <div 
      className="p-4 border-l-2 space-y-3"
      style={{
        background: `linear-gradient(to bottom, ${settings.theme_panel_from || '#1f2937'}, ${settings.theme_panel_to || '#111827'})`,
        borderLeftColor: borderColor,
        minWidth: '200px'
      }}
    >
      <h3 className="text-lg font-bold text-white text-center mb-4">
        Statistik Hari Ini
      </h3>
      
      <StatItemVertical 
        icon={<Users className="w-6 h-6" />}
        label="Total Antrian"
        value={stats.total}
        color={accentColor}
      />
      <StatItemVertical 
        icon={<Clock className="w-6 h-6" />}
        label="Menunggu"
        value={stats.waiting}
        color="#facc15"
      />
      <StatItemVertical 
        icon={<TrendingUp className="w-6 h-6" />}
        label="Sedang Dilayani"
        value={stats.serving}
        color="#10b981"
      />
      <StatItemVertical 
        icon={<CheckCircle className="w-6 h-6" />}
        label="Selesai"
        value={stats.completed}
        color="#06b6d4"
      />
      {stats.cancelled > 0 && (
        <StatItemVertical 
          icon={<XCircle className="w-6 h-6" />}
          label="Dibatalkan"
          value={stats.cancelled}
          color="#ef4444"
        />
      )}
      {stats.avgWaitTime > 0 && (
        <StatItemVertical 
          icon={<Clock className="w-6 h-6" />}
          label="Rata-rata Waktu"
          value={`${stats.avgWaitTime} menit`}
          color="#8b5cf6"
        />
      )}
    </div>
  )
}

// Horizontal stat item component
function StatItem({ icon, label, value, color }) {
  return (
    <div className="flex flex-col items-center">
      <div className="flex items-center space-x-2 mb-1">
        <div style={{ color }}>{icon}</div>
        <span className="text-2xl font-bold text-white">{value}</span>
      </div>
      <span className="text-xs text-gray-400">{label}</span>
    </div>
  )
}

// Vertical stat item component
function StatItemVertical({ icon, label, value, color }) {
  return (
    <div 
      className="p-3 rounded-lg border-2"
      style={{ borderColor: color }}
    >
      <div className="flex items-center justify-between mb-2">
        <div style={{ color }}>{icon}</div>
        <span className="text-2xl font-bold text-white">{value}</span>
      </div>
      <span className="text-sm text-gray-300">{label}</span>
    </div>
  )
}
