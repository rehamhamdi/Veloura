import { LoaderCircle, X } from 'lucide-react'
import { useEffect, useState } from 'react'
import { getAdminOrder, updateAdminOrderStatus } from '../../services/adminOrders'
import type { AdminOrder } from '../../types/adminOrders'
import type { OrderDetailsModalProps } from '../../types/orderDetailsModal'

const statuses = ['Processing', 'Shipped', 'Delivered', 'Cancelled']

function money(value?: number) {
  return typeof value === 'number' ? `$${value.toFixed(2)}` : '—'
}

function OrderDetailsModal({ orderId, onClose, onUpdated }: OrderDetailsModalProps) {
  const [order, setOrder] = useState<AdminOrder | null>(null)
  const [status, setStatus] = useState('')
  const [isLoading, setIsLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    let cancelled = false

    async function loadOrder() {
      setIsLoading(true)
      setError('')

      try {
        const result = await getAdminOrder(orderId)
        if (!cancelled) {
          setOrder(result)
          setStatus(result.status ?? 'Processing')
        }
      } catch {
        if (!cancelled) setError('We could not load this order. Please try again.')
      } finally {
        if (!cancelled) setIsLoading(false)
      }
    }

    void loadOrder()
    return () => { cancelled = true }
  }, [orderId])

  async function saveStatus() {
    if (!order) return
    setIsSaving(true)
    setError('')

    try {
      const updated = await updateAdminOrderStatus(orderId, status)
      const nextOrder = updated ?? { ...order, status }
      setOrder(nextOrder)
      onUpdated(nextOrder)
    } catch {
      setError('We could not update the order status. Please try again.')
    } finally {
      setIsSaving(false)
    }
  }

  const items = order?.items ?? []
  const total = order?.totalAmount ?? order?.total

  return <div className="fixed inset-0 z-[60] flex items-end justify-center bg-[#3b2a29]/35 p-0 sm:items-center sm:p-5" role="presentation" onMouseDown={(event) => { if (event.target === event.currentTarget) onClose() }}><section className="max-h-[92vh] w-full max-w-[620px] overflow-y-auto rounded-t-[20px] border border-[#eaded5] bg-[#fffdf9] p-5 shadow-[0_20px_60px_rgba(59,42,41,.2)] sm:rounded-[20px] sm:p-7" role="dialog" aria-modal="true" aria-labelledby="order-details-title"><div className="flex items-start justify-between border-b border-[#f0e5de] pb-5"><div><p className="mb-2 text-[10px] font-bold uppercase tracking-[.16em] text-[#a86f6b]">Order details</p><h2 id="order-details-title" className="m-0 font-['Playfair_Display'] text-2xl text-[#493331]">Order #{orderId}</h2></div><button className="grid h-9 w-9 place-items-center rounded-full text-[#806967] hover:bg-[#f3e4dc]" onClick={onClose} aria-label="Close order details"><X size={18} /></button></div>
    {isLoading && <div className="flex min-h-[260px] items-center justify-center gap-2 text-sm text-[#806967]"><LoaderCircle className="animate-spin" size={18} />Loading order details...</div>}
    {!isLoading && error && <div className="flex min-h-[220px] items-center justify-center text-center text-sm text-[#a36c69]">{error}</div>}
    {!isLoading && !error && order && <div className="grid gap-6 pt-6"><div className="grid gap-4 sm:grid-cols-2"><div><p className="m-0 text-[10px] font-bold uppercase tracking-[.1em] text-[#b09a92]">Customer</p><p className="mb-0 mt-2 text-sm font-semibold text-[#493331]">{order.customerName ?? order.customer?.name ?? 'Unknown customer'}</p><p className="m-0 mt-1 text-xs text-[#a38b83]">{order.customer?.email ?? '—'}</p></div><div><p className="m-0 text-[10px] font-bold uppercase tracking-[.1em] text-[#b09a92]">Payment method</p><p className="mb-0 mt-2 text-sm font-semibold text-[#493331]">{order.paymentMethod ?? '—'}</p></div><div><p className="m-0 text-[10px] font-bold uppercase tracking-[.1em] text-[#b09a92]">Shipping address</p><p className="mb-0 mt-2 text-sm text-[#806967]">{order.shippingAddress ?? order.address ?? '—'}</p></div><div><p className="m-0 text-[10px] font-bold uppercase tracking-[.1em] text-[#b09a92]">Created</p><p className="mb-0 mt-2 text-sm text-[#806967]">{order.createdAt ?? order.date ?? '—'}</p></div></div><div className="rounded-[13px] border border-[#f0e5de] bg-[#fffaf5] p-4"><p className="mb-3 mt-0 text-xs font-bold text-[#493331]">Order items</p>{items.length === 0 ? <p className="m-0 text-xs text-[#a38b83]">No item details returned for this order.</p> : <div className="grid gap-3">{items.map((item, index) => <div key={item.id ?? `${item.productName ?? item.name}-${index}`} className="flex items-center justify-between border-b border-[#f0e5de] pb-3 last:border-0 last:pb-0"><div><p className="m-0 text-xs font-semibold text-[#493331]">{item.productName ?? item.name ?? 'Product'}</p><p className="m-0 mt-1 text-[10px] text-[#a38b83]">Qty: {item.quantity ?? 1}</p></div><p className="m-0 text-xs font-bold text-[#6d4946]">{money(item.total ?? item.price ?? item.unitPrice)}</p></div>)}</div>}<div className="mt-4 flex justify-between border-t border-[#e9ddd5] pt-4"><span className="text-xs font-bold text-[#806967]">Total</span><span className="text-sm font-bold text-[#493331]">{money(total)}</span></div></div><div className="flex flex-col gap-3 border-t border-[#f0e5de] pt-5 sm:flex-row sm:items-end sm:justify-between"><label className="grid gap-2 text-xs font-bold text-[#493331]">Update status<select className="h-10 min-w-[190px] rounded-[10px] border border-[#e3d2c8] bg-[#fffdf9] px-3 text-xs font-normal text-[#493331] outline-none focus:border-[#b9827e]" value={status} onChange={(event) => setStatus(event.target.value)}>{statuses.map((item) => <option key={item}>{item}</option>)}</select></label><button className="inline-flex h-10 items-center justify-center gap-2 rounded-[10px] bg-[#6d4946] px-5 text-xs font-bold text-[#fffaf5] disabled:cursor-not-allowed disabled:opacity-60" onClick={() => void saveStatus()} disabled={isSaving || status.toLowerCase() === (order.status ?? '').toLowerCase()}>{isSaving && <LoaderCircle className="animate-spin" size={14} />}Save status</button></div></div>}
  </section></div>
}

export default OrderDetailsModal