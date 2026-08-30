'use client'

import React, { useState, useEffect, useRef } from 'react';
import { DayPicker, DateRange } from 'react-day-picker';
import 'react-day-picker/dist/style.css';
import { format, startOfDay } from 'date-fns';
import { fr } from 'date-fns/locale';
import { CalendarIcon, ChevronDown } from 'lucide-react';

export interface DateRangePickerProps {
  value: { from: Date | undefined; to: Date | undefined };
  onChange: (range: { from: Date | undefined; to: Date | undefined }) => void;
  trigger?: React.ReactNode;
  isOpenProp?: boolean;
  setIsOpenProp?: (open: boolean) => void;
}

export default function DateRangePicker({ value, onChange, trigger, isOpenProp, setIsOpenProp }: DateRangePickerProps) {
  const [internalIsOpen, setInternalIsOpen] = useState(false);
  const isOpen = isOpenProp !== undefined ? isOpenProp : internalIsOpen;
  const setIsOpen = setIsOpenProp !== undefined ? setIsOpenProp : setInternalIsOpen;

  // État local pour le calendrier, on applique seulement au clic sur "Mettre à jour"
  const [selectedRange, setSelectedRange] = useState<DateRange | undefined>({
    from: value.from,
    to: value.to
  });

  const popoverRef = useRef<HTMLDivElement>(null);

  // Synchroniser la prop avec l'état local à l'ouverture
  useEffect(() => {
    if (isOpen) {
      setSelectedRange({ from: value.from, to: value.to });
    }
  }, [isOpen, value]);

  // Fermer le popover si on clique en dehors
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (popoverRef.current && !popoverRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [setIsOpen]);

  const handleUpdate = () => {
    onChange({ from: selectedRange?.from, to: selectedRange?.to });
    setIsOpen(false);
  };

  const handleCancel = () => {
    setIsOpen(false);
  };

  const formatDate = (date: Date | undefined) => {
    if (!date) return '';
    return format(date, 'd MMM yyyy', { locale: fr });
  };

  // Texte du bouton déclencheur (si pas de trigger perso)
  let buttonText = 'Sélectionner des dates';
  if (value.from && value.to) {
    if (value.from.getTime() === value.to.getTime()) {
      buttonText = formatDate(value.from);
    } else {
      buttonText = `${formatDate(value.from)} - ${formatDate(value.to)}`;
    }
  } else if (value.from) {
    buttonText = formatDate(value.from);
  }

  // Désactiver les dates futures
  const disabledDays = { after: startOfDay(new Date()) };

  return (
    <div className="relative inline-block text-left" ref={popoverRef}>
      {trigger ? (
        trigger
      ) : (
        <button
          type="button"
          onClick={() => setIsOpen(!isOpen)}
          className="flex items-center gap-2 px-3 py-1.5 border border-slate-200 bg-white rounded-lg text-xs font-medium text-slate-700 hover:bg-slate-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-colors h-[38px]"
        >
          <CalendarIcon className="w-4 h-4 text-slate-500" />
          <span>{buttonText}</span>
          <ChevronDown className="w-4 h-4 text-slate-400 ml-1" />
        </button>
      )}

      {isOpen && (
        <div className="absolute z-50 mt-2 p-3 bg-white rounded-xl shadow-xl border border-slate-100" style={{ width: 'max-content' }}>
          
          <DayPicker
            mode="range"
            defaultMonth={value.from || new Date()}
            selected={selectedRange}
            onSelect={setSelectedRange}
            numberOfMonths={2}
            locale={fr}
            disabled={disabledDays}
            classNames={{
              months: "flex flex-col sm:flex-row gap-4",
              month: "space-y-2",
              caption: "flex justify-center pt-1 relative items-center",
              caption_label: "text-sm font-semibold text-slate-800 capitalize",
              nav: "space-x-1 flex items-center",
              nav_button: "h-7 w-7 bg-transparent p-0 flex items-center justify-center rounded-md hover:bg-slate-100 transition-colors",
              nav_button_previous: "absolute left-1",
              nav_button_next: "absolute right-1",
              table: "w-full border-collapse space-y-1",
              head_row: "flex",
              head_cell: "text-slate-500 rounded-md w-8 font-medium text-[11px] capitalize",
              row: "flex w-full mt-1",
              cell: "text-center text-xs p-0 relative [&:has([aria-selected])]:bg-indigo-50 first:[&:has([aria-selected])]:rounded-l-md last:[&:has([aria-selected])]:rounded-r-md focus-within:relative focus-within:z-20",
              day: "h-8 w-8 p-0 font-medium rounded-md aria-selected:opacity-100 hover:bg-slate-100 hover:text-slate-900 transition-colors cursor-pointer",
              day_selected: "bg-indigo-600 text-white hover:bg-indigo-700 hover:text-white focus:bg-indigo-600 focus:text-white",
              day_today: "bg-slate-100 text-slate-900 font-bold",
              day_outside: "text-slate-400 opacity-50",
              day_disabled: "text-slate-300 cursor-not-allowed opacity-50",
              day_range_middle: "aria-selected:bg-indigo-50 aria-selected:text-indigo-900 rounded-none",
              day_hidden: "invisible",
            }}
          />

          <div className="mt-4 pt-3 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-3">
            <div className="flex items-center gap-2 w-full sm:w-auto">
              <div className="px-2 py-1.5 border border-slate-200 rounded-md text-xs w-28 bg-slate-50 text-slate-700 text-center shadow-sm">
                {formatDate(selectedRange?.from) || 'Date de début'}
              </div>
              <span className="text-slate-400 font-medium text-xs">-</span>
              <div className="px-2 py-1.5 border border-slate-200 rounded-md text-xs w-28 bg-slate-50 text-slate-700 text-center shadow-sm">
                {formatDate(selectedRange?.to) || 'Date de fin'}
              </div>
            </div>
            
            <div className="flex gap-2 w-full sm:w-auto justify-end">
              <button 
                onClick={handleCancel}
                className="px-3 py-1.5 border border-slate-200 bg-white rounded-md text-xs font-medium text-slate-700 hover:bg-slate-50 transition-colors shadow-sm"
              >
                Annuler
              </button>
              <button 
                onClick={handleUpdate}
                disabled={!selectedRange?.from}
                className="px-3 py-1.5 bg-indigo-600 text-white rounded-md text-xs font-medium hover:bg-indigo-700 transition-colors shadow-sm disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Mettre à jour
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
