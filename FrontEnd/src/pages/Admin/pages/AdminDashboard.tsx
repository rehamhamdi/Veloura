import { Sparkles } from 'lucide-react'
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import AdminHeader from '../../../components/admin/AdminHeader'
import AdminSidebar from '../../../components/admin/AdminSidebar'
import RecentOrders from '../../../components/admin/RecentOrders'
import SalesOverview from '../../../components/admin/SalesOverview'
import StatsGrid from '../../../components/admin/StatsGrid'
import TopProducts from '../../../components/admin/TopProducts'

function AdminDashboard() {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [activeNav, setActiveNav] = useState('Dashboard')
  const navigate = useNavigate()

  function selectNavigation(item: string) {
    setActiveNav(item)
    setSidebarOpen(false)

    if (item === 'Orders') navigate('/admin/orders')
    if (item === 'Dashboard') navigate('/admin')
  }

  return <div className="min-h-screen bg-[#f8f3ed] text-[#3b2a29]">
    <AdminSidebar open={sidebarOpen} activeItem={activeNav} onClose={() => setSidebarOpen(false)} onSelect={selectNavigation} />
    <div className="lg:pl-[248px]">
      <AdminHeader onMenuOpen={() => setSidebarOpen(true)} />
      <main className="mx-auto max-w-[1440px] px-5 py-8 sm:px-8 lg:px-10 lg:py-10">
        <div className="mb-8 flex flex-col justify-between gap-5 sm:flex-row sm:items-end"><div><p className="mb-2 text-[11px] font-bold uppercase tracking-[.18em] text-[#a86f6b]">Wednesday, September 16, 2026</p><h2 className="font-['Playfair_Display'] text-[clamp(2rem,4vw,2.75rem)] font-medium leading-tight text-[#3b2a29]">Good morning, Admin <span className="font-sans text-[.72em]">👋</span></h2><p className="mt-2 text-sm text-[#806967]">Here's what's happening with your store today.</p></div><button className="inline-flex h-10 items-center justify-center gap-2 self-start rounded-[11px] bg-[#6d4946] px-4 text-xs font-bold text-[#fffaf5] shadow-[0_8px_18px_rgba(109,73,70,.14)] transition hover:bg-[#583a38] sm:self-auto"><Sparkles size={15} />View store</button></div>
        <StatsGrid />
        <section className="mt-6 grid gap-6 xl:grid-cols-[minmax(0,1.45fr)_minmax(340px,1fr)]"><SalesOverview /><TopProducts /></section>
        <RecentOrders />
      </main>
    </div>
    {sidebarOpen && <button className="fixed inset-0 z-40 bg-[#3b2a29]/20 lg:hidden" aria-label="Close navigation overlay" onClick={() => setSidebarOpen(false)} />}
  </div>
}

export default AdminDashboard
