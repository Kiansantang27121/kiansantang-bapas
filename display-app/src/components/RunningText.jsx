import { useState, useEffect } from 'react'

export default function RunningText({ settings }) {
  const [currentTextIndex, setCurrentTextIndex] = useState(0)
  
  const texts = [
    settings.running_text || 'SELAMAT DATANG DI BAPAS BANDUNG - MELAYANI DENGAN SEPENUH HATI',
    settings.running_text_2 || 'JAM PELAYANAN: SENIN - JUMAT, 08:00 - 16:00 WIB',
    settings.running_text_3 || 'HUBUNGI KAMI: 022-1234567 | EMAIL: INFO@BAPASBANDUNG.GO.ID'
  ].filter(text => text && text.trim() !== '') // Filter empty texts

  useEffect(() => {
    if (texts.length > 1) {
      const interval = setInterval(() => {
        setCurrentTextIndex((prev) => (prev + 1) % texts.length)
      }, 10000) // Change text every 10 seconds

      return () => clearInterval(interval)
    }
  }, [texts.length])

  const currentText = texts[currentTextIndex] || texts[0]

  return (
    <div 
      className="py-4 border-t-4 overflow-hidden flex-shrink-0"
      style={{
        background: `linear-gradient(to right, ${settings.theme_running_from || '#dc2626'}, ${settings.theme_running_to || '#ea580c'})`,
        borderTopColor: settings.theme_border_color || '#06b6d4'
      }}
    >
      <div className="flex">
        <div className="animate-marquee whitespace-nowrap flex items-center">
          <span className="text-2xl font-bold text-white mx-8">
            ★★★ {currentText} ★★★
          </span>
          <span className="text-2xl font-bold text-white mx-8">
            ★★★ {currentText} ★★★
          </span>
          <span className="text-2xl font-bold text-white mx-8">
            ★★★ {currentText} ★★★
          </span>
        </div>
      </div>
      
      {/* Text indicator dots */}
      {texts.length > 1 && (
        <div className="flex justify-center space-x-2 mt-2">
          {texts.map((_, index) => (
            <div
              key={index}
              className={`w-2 h-2 rounded-full transition-all ${
                index === currentTextIndex ? 'bg-white w-4' : 'bg-white/50'
              }`}
            />
          ))}
        </div>
      )}
    </div>
  )
}
