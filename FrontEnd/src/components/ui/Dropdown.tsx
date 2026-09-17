import { ChevronDown, Check } from 'lucide-react'
import { useEffect, useRef, useState } from 'react'
import type { DropdownProps } from '../../types/dropdown'

function Dropdown({ value, options, onChange, ariaLabel, icon: Icon, className = '' }: DropdownProps) {
  const [open, setOpen] = useState(false)
  const containerRef = useRef<HTMLDivElement>(null)
  const selectedOption = options.find((option) => option.value === value) ?? options[0]

  useEffect(() => {
    function closeOnOutsideClick(event: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) setOpen(false)
    }

    document.addEventListener('mousedown', closeOnOutsideClick)
    return () => document.removeEventListener('mousedown', closeOnOutsideClick)
  }, [])

  function selectOption(nextValue: string) {
    onChange(nextValue)
    setOpen(false)
  }

  return <div className={`relative ${className}`} ref={containerRef}>
    <button type="button" className={`flex h-10 w-full items-center justify-between gap-3 rounded-full border px-4 text-xs transition ${open ? 'border-[#b9827e] bg-[#fffdf9] shadow-[0_5px_16px_rgba(91,55,53,.08)]' : 'border-[#e7d9d0] bg-[#fffaf5]'} text-[#806967]`} onClick={() => setOpen((current) => !current)} aria-label={ariaLabel} aria-expanded={open}><span className="flex min-w-0 items-center gap-2">{Icon && <Icon size={14} strokeWidth={1.7} />}<span className="truncate">{selectedOption?.label}</span></span><ChevronDown className={`shrink-0 text-[#a38b83] transition-transform ${open ? 'rotate-180' : ''}`} size={14} /></button>
    {open && <div className="absolute right-0 top-[calc(100%+6px)] z-50 min-w-full overflow-hidden rounded-[12px] border border-[#eaded5] bg-[#fffdf9] p-1.5 shadow-[0_12px_30px_rgba(59,42,41,.14)]" role="listbox" aria-label={ariaLabel}>{options.map((option) => <button type="button" role="option" aria-selected={option.value === value} key={option.value} className={`flex w-full items-center justify-between whitespace-nowrap rounded-[8px] px-3 py-2.5 text-left text-xs transition ${option.value === value ? 'bg-[#f3e4dc] font-bold text-[#8e5d5a]' : 'text-[#806967] hover:bg-[#faf2ec] hover:text-[#6d4946]'}`} onClick={() => selectOption(option.value)}>{option.label}{option.value === value && <Check size={14} />}</button>)}</div>}
  </div>
}

export default Dropdown