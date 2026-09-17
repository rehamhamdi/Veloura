import { useEffect, useState } from 'react'
import { ChevronLeft, ChevronRight, LoaderCircle, RefreshCw, Search } from 'lucide-react'
import AdminShell from '../../../components/admin/AdminShell'
import OrderDetailsModal from '../../../components/admin/OrderDetailsModal'
import { getAdminOrders } from '../../../services/adminOrders'
import type { AdminOrder } from '../../../types/adminOrders'
import { useI18n } from '../../../i18n/I18nProvider'

const statusClasses: Record<string, string> = {
  processing: 'bg-[#f6ead1] text-[#9a713c]',
  shipped: 'bg-[#e6edf2] text-[#5d778a]',
  delivered: 'bg-[#e4efe7] text-[#63846f]',
  cancelled: 'bg-[#f2e3e1] text-[#a36c69]',
}

function getOrderId(order: AdminOrder) {
  return String(order.orderId ?? order.id ?? '—')
}

function getCustomerName(order: AdminOrder) {
  return order.customerName ?? order.customer?.name ?? order.customer?.email ?? 'Unknown customer'
}

function getTotal(order: AdminOrder) {
  const total = order.totalAmount ?? order.total
  return typeof total === 'number' ? `$${total.toFixed(2)}` : '—'
}

function getStatusClass(status: string) {
  return statusClasses[status.toLowerCase()] ?? 'bg-[#f1e8e2] text-[#806967]'
}

function AdminOrders() {
  const [orders, setOrders] = useState<AdminOrder[]>([])
  const [page, setPage] = useState(1)
  const [totalPages, setTotalPages] = useState(0)
  const [totalCount, setTotalCount] = useState(0)
  const [search, setSearch] = useState('')
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState('')
  const [selectedOrderId, setSelectedOrderId] = useState<string | number | null>(null)
  const { t } = useI18n()

  async function loadOrders(nextPage = page) {
    setIsLoading(true)
    setError('')

    try {
      const result = await getAdminOrders(nextPage)
      setOrders(result.data.items)
      setPage(result.data.currentPage)
      setTotalPages(result.data.totalPages)
      setTotalCount(result.data.totalCount)
    } catch {
      setError('We could not load orders right now. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    void loadOrders(1)
  }, [])

  const filteredOrders = orders.filter((order) => {
    const query = search.toLowerCase()
    return getOrderId(order).toLowerCase().includes(query) || getCustomerName(order).toLowerCase().includes(query)
  })

  function updateOrderInList(updatedOrder: AdminOrder) {
    const updatedId = getOrderId(updatedOrder)
    setOrders((currentOrders) => currentOrders.map((order) => getOrderId(order) === updatedId ? { ...order, ...updatedOrder } : order))
  }

  return <AdminShell activeItem="Orders"><main className="min-h-[calc(100vh-76px)] bg-[#f8f3ed] px-5 py-8 sm:px-8 lg:px-10 lg:py-10"><div className="mx-auto max-w-[1440px]">
    <div className="mb-8 flex flex-col justify-between gap-5 sm:flex-row sm:items-end"><div><p className="mb-2 text-[11px] font-bold uppercase tracking-[.18em] text-[#a86f6b]">{t('admin.workspace')} / {t('admin.orders')}</p><h2 className="font-['Playfair_Display'] text-[clamp(2rem,4vw,2.75rem)] font-medium leading-tight text-[#3b2a29]">{t('admin.orders')}</h2><p className="mt-2 text-sm text-[#806967]">{t('admin.manageOrders')}</p></div><button className="inline-flex h-10 items-center justify-center gap-2 self-start rounded-[11px] border border-[#e5d6cd] bg-[#fffdf9] px-4 text-xs font-bold text-[#6d4946] transition hover:bg-[#f3e4dc] sm:self-auto" onClick={() => void loadOrders()}><RefreshCw size={15} />{t('admin.refresh')}</button></div>
    <section className="rounded-[16px] border border-[#eaded5] bg-[#fffdf9] p-5 shadow-[0_8px_25px_rgba(91,55,53,.035)] sm:p-6"><div className="mb-5 flex flex-col justify-between gap-4 sm:flex-row sm:items-center"><div><p className="m-0 text-sm font-bold text-[#493331]">All orders</p><p className="mb-0 mt-2 text-xs text-[#a38b83]">{totalCount} orders in your store</p></div><label className="flex h-10 w-full items-center gap-2.5 rounded-full border border-[#e7d9d0] bg-[#fffaf5] px-4 text-[#b09a92] sm:w-[240px]"><Search size={16} strokeWidth={1.7} /><input className="w-full bg-transparent text-xs text-[#493331] outline-none placeholder:text-[#b09a92]" placeholder="Search orders..." value={search} onChange={(event) => setSearch(event.target.value)} aria-label="Search orders" /></label></div>
      {isLoading && <div className="flex min-h-[280px] items-center justify-center gap-2 text-sm text-[#806967]"><LoaderCircle className="animate-spin" size={18} />Loading orders...</div>}
      {!isLoading && error && <div className="flex min-h-[280px] flex-col items-center justify-center gap-4 text-center"><p className="m-0 text-sm text-[#a36c69]">{error}</p><button className="rounded-[9px] bg-[#6d4946] px-4 py-2 text-xs font-bold text-[#fffaf5]" onClick={() => void loadOrders()}>Try again</button></div>}
      {!isLoading && !error && filteredOrders.length === 0 && <div className="flex min-h-[280px] flex-col items-center justify-center text-center"><div className="mb-4 grid h-12 w-12 place-items-center rounded-full bg-[#f3e4dc] text-[#a86f6b]">⌁</div><p className="m-0 font-['Playfair_Display'] text-xl text-[#493331]">{search ? 'No matching orders' : 'No orders yet'}</p><p className="mb-0 mt-2 max-w-[300px] text-xs leading-5 text-[#a38b83]">{search ? 'Try another order ID or customer name.' : 'New orders will appear here as soon as customers complete a purchase.'}</p></div>}
      {!isLoading && !error && filteredOrders.length > 0 && <div className="overflow-x-auto"><table className="w-full min-w-[700px] border-collapse text-left"><thead><tr className="border-b border-[#f0e5de] text-[10px] font-bold uppercase tracking-[.1em] text-[#b09a92]"><th className="pb-3 pl-2">Order ID</th><th className="pb-3">Customer</th><th className="pb-3">Date</th><th className="pb-3">Total</th><th className="pb-3">Status</th><th className="pb-3 pr-2 text-right">Action</th></tr></thead><tbody>{filteredOrders.map((order) => { const status = order.status ?? 'Unknown'; return <tr key={getOrderId(order)} className="border-b border-[#f3eae4] last:border-0"><td className="py-4 pl-2 text-xs font-bold text-[#6d4946]">{getOrderId(order)}</td><td className="py-4 text-xs font-semibold text-[#493331]">{getCustomerName(order)}</td><td className="py-4 text-[11px] text-[#9e8780]">{order.createdAt ?? order.date ?? '—'}</td><td className="py-4 text-xs font-bold text-[#493331]">{getTotal(order)}</td><td className="py-4"><span className={`inline-flex rounded-full px-2.5 py-1 text-[10px] font-bold ${getStatusClass(status)}`}>{status}</span></td><td className="py-4 pr-2 text-right"><button className="text-[11px] font-bold text-[#a86f6b] hover:text-[#6d4946]" onClick={() => setSelectedOrderId(order.orderId ?? order.id ?? null)} disabled={order.orderId == null && order.id == null}>View</button></td></tr> })}</tbody></table></div>}
      {!isLoading && !error && filteredOrders.length > 0 && <div className="mt-4 flex items-center justify-between border-t border-[#f0e5de] pt-4"><p className="m-0 text-[11px] text-[#aa938b]">Page {page} of {totalPages || 1}</p><div className="flex gap-1"><button disabled={page <= 1} className="grid h-7 w-7 place-items-center rounded-[7px] border border-[#eaded5] text-[#aa938b] hover:bg-[#faf2ec] disabled:cursor-not-allowed disabled:opacity-40" onClick={() => void loadOrders(page - 1)} aria-label="Previous page"><ChevronLeft size={14} /></button><button disabled={!totalPages || page >= totalPages} className="grid h-7 w-7 place-items-center rounded-[7px] border border-[#eaded5] text-[#aa938b] hover:bg-[#faf2ec] disabled:cursor-not-allowed disabled:opacity-40" onClick={() => void loadOrders(page + 1)} aria-label="Next page"><ChevronRight size={14} /></button></div></div>}
    </section>
  </div></main>{selectedOrderId !== null && <OrderDetailsModal orderId={selectedOrderId} onClose={() => setSelectedOrderId(null)} onUpdated={updateOrderInList} />}</AdminShell>
}

export default AdminOrders