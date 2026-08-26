'use client'

import { useState, useRef, useEffect } from 'react'

export default function CustomDropdown({ 
  value, 
  options, 
  onChange, 
  icon 
}: { 
  value: string; 
  options: {label: string, value: string}[]; 
  onChange: (val: string) => void;
  icon: string;
}) {
  const [isOpen, setIsOpen] = useState(false)
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

  const selectedLabel = options.find(o => o.value === value)?.label || value

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      setIsOpen(!isOpen);
    } else if (e.key === 'Escape') {
      setIsOpen(false);
    }
  }

  return (
    <div className="relative w-full sm:w-auto" ref={ref}>
      <div 
        tabIndex={0}
        onKeyDown={handleKeyDown}
        className="w-full sm:w-48 pl-4 pr-10 py-2 border border-slate-300 rounded-lg text-sm bg-white cursor-pointer hover:bg-slate-50 transition flex items-center justify-between font-medium text-slate-800 focus:ring-2 focus:ring-indigo-500 focus:outline-none shadow-sm"
        onClick={() => setIsOpen(!isOpen)}
      >
        <span className="truncate">{selectedLabel}</span>
        <span className="absolute right-3">{icon}</span>
      </div>
      
      {isOpen && (
        <div className="absolute top-full mt-2 left-0 w-full min-w-[200px] bg-white rounded-2xl shadow-[0_10px_40px_-10px_rgba(0,0,0,0.15)] border border-slate-100 z-50 py-2 overflow-hidden">
          {options.map(opt => (
            <div 
              key={opt.value}
              className={`px-4 py-2.5 text-sm cursor-pointer transition-colors ${
                value === opt.value 
                  ? 'bg-indigo-50 text-indigo-700 font-bold' 
                  : 'text-slate-700 hover:bg-slate-50 hover:text-slate-900 font-medium'
              }`}
              onClick={() => {
                onChange(opt.value);
                setIsOpen(false);
              }}
            >
              {opt.label}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
