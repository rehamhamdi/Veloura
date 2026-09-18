import { Languages, LogOut, Settings, X } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { logout } from '../../features/auth/authSlice'
import { useAppDispatch } from '../../store/hooks'
import type { AdminSidebarProps } from '../../types/adminSidebar'
import { navigation } from './adminData'
import { useI18n } from '../../i18n/I18nProvider'

function AdminSidebar({ open, activeItem, onClose, onSelect }: AdminSidebarProps) {
  const dispatch = useAppDispatch()
  const navigate = useNavigate()
  const { direction, language, t, toggleLanguage } = useI18n()
  const labels: Record<string, string> = { Dashboard: t('admin.dashboard'), Products: t('admin.products'), Categories: t('admin.categories'), Orders: t('admin.orders'), Contacts: t('admin.contacts'), Customers: t('admin.contacts') }

  function handleLogout() {
    dispatch(logout())
    onClose()
    navigate('/login', { replace: true })
  }

  const sideClasses = direction === 'rtl'
    ? `fixed inset-y-0 right-0 z-50 flex w-[248px] flex-col border-l border-[#eadcd2] bg-[#fffdf9] px-5 py-7 transition-transform duration-300 lg:translate-x-0 ${open ? 'translate-x-0' : 'translate-x-full'}`
    : `fixed inset-y-0 left-0 z-50 flex w-[248px] flex-col border-r border-[#eadcd2] bg-[#fffdf9] px-5 py-7 transition-transform duration-300 lg:translate-x-0 ${open ? 'translate-x-0' : '-translate-x-full'}`

  return <aside className={sideClasses}>
    <div className="mb-7 flex items-center gap-3 px-3"><span className="grid h-9 w-9 place-items-center rounded-full bg-[#ecd5cc] font-['Playfair_Display'] text-[18px] text-[#79504b]">V</span><span className="font-['Playfair_Display'] text-[22px] font-semibold tracking-[.02em]">Veloura</span><button className="ml-auto text-[#806967] lg:hidden" onClick={onClose} aria-label="Close menu"><X size={19} /></button></div>
    <button className="mx-auto mb-10 flex h-9 items-center gap-2 rounded-full border border-[#eaded5] bg-[#fffaf5] px-3 text-[11px] font-bold text-[#8e5d5a] transition hover:bg-[#f3e4dc]" type="button" onClick={toggleLanguage} aria-label={t('nav.language')}><Languages size={14} strokeWidth={1.7} /><span>{language === 'ar' ? 'English' : 'العربية'}</span></button>
    <p className="mb-3 px-3 text-[10px] font-bold uppercase tracking-[.18em] text-[#b69d94]">{t('admin.workspace')}</p>
    <nav className="grid gap-1" aria-label={t('admin.workspace')}>{navigation.map(({ label, icon: Icon }) => <button key={label} onClick={() => onSelect(label)} className={`flex h-11 items-center gap-3 rounded-[12px] px-3 text-[13px] font-semibold transition ${activeItem === label ? 'bg-[#f3e4dc] text-[#8e5d5a]' : 'text-[#806967] hover:bg-[#faf2ec] hover:text-[#6d4946]'}`}><Icon size={17} strokeWidth={1.7} />{labels[label]}</button>)}</nav>
    <div className="mt-8 border-t border-[#f0e5de] pt-6"><button className={`flex h-11 w-full items-center gap-3 rounded-[12px] px-3 text-[13px] font-semibold ${activeItem === 'Settings' ? 'bg-[#f3e4dc] text-[#8e5d5a]' : 'text-[#806967] hover:bg-[#faf2ec] hover:text-[#6d4946]'}`} onClick={() => onSelect('Settings')}><Settings size={17} strokeWidth={1.7} />{t('admin.settings')}</button></div>
    <div className="mt-auto border-t border-[#f0e5de] pt-5"><button className="flex h-11 w-full items-center gap-3 rounded-[12px] px-3 text-[13px] font-semibold text-[#806967] hover:bg-[#faf2ec] hover:text-[#6d4946]" onClick={handleLogout}><LogOut size={17} strokeWidth={1.7} />{t('admin.logout')}</button><div className="mt-4 flex items-center gap-3 px-3"><div className="grid h-8 w-8 place-items-center rounded-full bg-[#d7b6ac] text-[11px] font-bold text-[#684744]">AM</div><div><p className="m-0 text-xs font-bold text-[#493331]">Admin Morgan</p><p className="m-0 mt-0.5 text-[10px] text-[#aa938b]">{t('admin.storeOwner')}</p></div></div></div>
  </aside>
}

export default AdminSidebar