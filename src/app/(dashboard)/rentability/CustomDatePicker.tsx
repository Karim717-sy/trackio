'use client'

import { useState, useRef, useEffect } from 'react'

export default function CustomDatePicker({ 
  value, 
  onChange 
}: { 
  value: string; 
  onChange: (val: string) => void 
}) {
  const [isOpen, setIsOpen] = useState(false)
  const [currentDate, setCurrentDate] = useState(new Date(value || new Date()))
  
  const year = currentDate.getFullYear()
  const month = currentDate.getMonth()
  
  const daysInMonth = new Date(year, month + 1, 0).getDate()
  const firstDayOfMonth = new Date(year, month, 1).getDay()
  
  const monthNames = ["Janvier", "Février", "Mars", "Avril", "Mai", "Juin", "Juillet", "Août", "Septembre", "Octobre", "Novembre", "Décembre"]
  const dayNames = ["Dim", "Lun", "Mar", "Mer", "Jeu", "Ven", "Sam"]
  
  const ref = useRef<HTMLDivElement>(null)
  
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (ref.current && !ref.current.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }
    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [ref])

  const handlePrevMonth = () => {
    setCurrentDate(new Date(year, month - 1, 1))
  }
  
  const handleNextMonth = () => {
    setCurrentDate(new Date(year, month + 1, 1))
  }
  
  const handleSelectDay = (day: number) => {
    const selected = new Date(Date.UTC(year, month, day))
    const formatted = selected.toISOString().split('T')[0]
    onChange(formatted)
    setIsOpen(false)
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      setIsOpen(!isOpen);
    } else if (e.key === 'Escape') {
      setIsOpen(false);
    }
  }

  // Adjust firstDayOfMonth to make Monday the first day instead of Sunday if desired,
  // but standard JS Date gets 0 for Sunday.
  const emptyDays = firstDayOfMonth; 

  return (
    <div className="relative w-full" ref={ref}>
      <div 
        tabIndex={0}
        onKeyDown={handleKeyDown}
        className="w-full px-4 py-2 border border-slate-300 rounded-lg cursor-pointer flex justify-between items-center bg-white focus:ring-2 focus:ring-indigo-500 focus:outline-none"
        onClick={() => setIsOpen(!isOpen)}
      >
        <span className="text-slate-900 font-medium">
          {value ? new Date(value).toLocaleDateString('fr-FR') : 'Sélectionner une date'}
        </span>
        <span className="text-slate-400">📅</span>
      </div>
      
      {isOpen && (
        <div className="absolute top-full mt-2 left-0 w-72 bg-white rounded-3xl shadow-[0_10px_40px_-10px_rgba(0,0,0,0.15)] border border-slate-100 z-50 p-5 overflow-hidden">
          <div className="flex justify-between items-center mb-6">
            <button 
              onClick={handlePrevMonth} 
              type="button" 
              className="p-2 hover:bg-slate-100 rounded-full text-slate-500 transition"
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m15 18-6-6 6-6"/></svg>
            </button>
            <span className="font-bold text-slate-800 text-lg">
              {monthNames[month]} {year}
            </span>
            <button 
              onClick={handleNextMonth} 
              type="button" 
              className="p-2 hover:bg-slate-100 rounded-full text-slate-500 transition"
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m9 18 6-6-6-6"/></svg>
            </button>
          </div>
          
          <div className="grid grid-cols-7 gap-1 mb-4 text-center">
            {dayNames.map(d => (
              <div key={d} className="text-xs font-semibold text-slate-400">{d}</div>
            ))}
          </div>
          
          <div className="grid grid-cols-7 gap-y-2 gap-x-1 text-center">
            {Array.from({ length: emptyDays }).map((_, i) => (
              <div key={`empty-${i}`} />
            ))}
            {Array.from({ length: daysInMonth }).map((_, i) => {
              const day = i + 1;
              const dateStr = new Date(Date.UTC(year, month, day)).toISOString().split('T')[0];
              const isSelected = value === dateStr;
              
              return (
                <button
                  key={day}
                  type="button"
                  onClick={() => handleSelectDay(day)}
                  className={`w-9 h-9 mx-auto rounded-full flex items-center justify-center text-sm transition-all duration-200 ${
                    isSelected 
                      ? 'bg-indigo-600 text-white font-bold shadow-lg shadow-indigo-200 scale-110' 
                      : 'text-slate-700 hover:bg-slate-100 font-medium'
                  }`}
                >
                  {day}
                </button>
              )
            })}
          </div>
        </div>
      )}
    </div>
  )
}
