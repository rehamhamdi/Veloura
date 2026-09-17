import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import AdminHeader from './AdminHeader'
import AdminSidebar from './AdminSidebar'
import type { AdminShellProps } from '../../types/adminShell'

function AdminShell({ activeItem, children }: AdminShellProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const navigate = useNavigate()

  function selectNavigation(item: string) {
    setSidebarOpen(false)
    if (item === 'Orders') navigate('/admin/orders')
    if (item === 'Products') navigate('/admin/products')
    if (item === 'Categories') navigate('/admin/categories')
    if (item === 'Customers') navigate('/admin/customers')
    if (item === 'Dashboard') navigate('/admin')
  }

  return <div className="min-h-screen bg-[#f8f3ed] text-[#3b2a29]"><AdminSidebar open={sidebarOpen} activeItem={activeItem} onClose={() => setSidebarOpen(false)} onSelect={selectNavigation} /><div className="lg:pl-[248px]"><AdminHeader onMenuOpen={() => setSidebarOpen(true)} />{children}</div>{sidebarOpen && <button className="fixed inset-0 z-40 bg-[#3b2a29]/20 lg:hidden" aria-label="Close navigation overlay" onClick={() => setSidebarOpen(false)} />}</div>
}

export default AdminShell
