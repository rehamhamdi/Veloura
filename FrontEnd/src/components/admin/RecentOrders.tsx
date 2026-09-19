import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { ChevronLeft, ChevronRight, ChevronRight as ChevronRightIcon, LoaderCircle, ShoppingBag } from 'lucide-react'
import { getRecentOrders } from '../../services/adminDashboard'
import type { AdminOrder } from '../../types/adminOrders'
import OrderDetailsModal from './OrderDetailsModal'
import { useI18n } from '../../i18n/I18nProvider'

const statusClasses: Record<string, string> = {
  processing: 'bg-[#f6ead1] text-[#9a713c]',
  shipped: 'bg-[#e6edf2] text-[#5d778a]',
  delivered: 'bg-[#e4efe7] text-[#63846f]',
  cancelled: 'bg-[#f2e3e1] text-[#a36c69]',
}

function getStatusClass(status: string) {
  return statusClasses[status.toLowerCase()] ?? 'bg-[#f1e8e2] text-[#806967]'
}

function getOrderId(order: AdminOrder): string {
  const rawId = order.orderId ?? order.id
  if (rawId === undefined || rawId === null) return '—'
  const str = String(rawId)
  return str.startsWith('#') ? str : `#${str}`
}

function getCustomerName(order: AdminOrder): string {
  return order.customerName ?? order.customer?.name ?? order.customer?.email ?? 'Customer'
}

function getInitials(name: string): string {
  const parts = name.trim().split(/\s+/)
  if (parts.length >= 2) {
    return `${parts[0][0]}${parts[1][0]}`.toUpperCase()
  }
  return (name.slice(0, 2) || 'C').toUpperCase()
}

function formatDate(order: AdminOrder): string {
  const raw = order.createdAt ?? order.date
  if (!raw) return '—'
  try {
    const d = new Date(raw)
    if (isNaN(d.getTime())) return String(raw)
    return d.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    })
  } catch {
    return String(raw)
  }
}

function formatTotal(order: AdminOrder): string {
  const rawTotal = (order as Record<string, unknown>).totalAmount ?? (order as Record<string, unknown>).total
  if (typeof rawTotal === 'number') {
    return `$${rawTotal.toFixed(2)}`
  }
  if (typeof rawTotal === 'string') {
    return rawTotal.startsWith('$') ? rawTotal : `$${rawTotal}`
  }
  return '$0.00'
}

function RecentOrders() {
  const { t } = useI18n()
  const [orders, setOrders] = useState<AdminOrder[]>([])
  const [page, setPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [totalCount, setTotalCount] = useState(0)
  const [pageSize] = useState(4)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState('')
  const [selectedOrderId, setSelectedOrderId] = useState<string | number | null>(null)

  const [reloadKey, setReloadKey] = useState(0)

  useEffect(() => {
    let cancelled = false

    async function loadRecentOrders() {
      setIsLoading(true)
      setError('')
      try {
        const data = await getRecentOrders(page, pageSize)
        if (!cancelled) {
          setOrders(data.items ?? [])
          setTotalPages(data.totalPages || 1)
          setTotalCount(data.totalCount ?? (data.items?.length || 0))
        }
      } catch {
        if (!cancelled) {
          setError('Could not load recent orders')
        }
      } finally {
        if (!cancelled) {
          setIsLoading(false)
        }
      }
    }

    void loadRecentOrders()
    return () => {
      cancelled = true
    }
  }, [page, pageSize, reloadKey])

  function updateOrderInList(updatedOrder: AdminOrder) {
    const updatedId = updatedOrder.orderId ?? updatedOrder.id
    setOrders((currentOrders) =>
      currentOrders.map((o) => {
        const currentId = o.orderId ?? o.id
        return currentId === updatedId ? { ...o, ...updatedOrder } : o
      })
    )
  }

  return (
    <>
      <section className="mt-6 rounded-[16px] border border-[#eaded5] bg-[#fffdf9] p-5 sm:p-6">
        <div className="mb-5 flex items-center justify-between">
          <div>
            <div className="flex items-center gap-2">
              <span className="h-2 w-2 rounded-full bg-[#806786]" />
              <p className="m-0 text-sm font-bold text-[#493331]">{t('admin.recentOrders') ?? 'Recent orders'}</p>
            </div>
            <p className="mb-0 mt-2 text-xs text-[#a38b83]">
              {t('admin.trackRecentOrders') ?? 'Keep track of your latest customer orders'}
            </p>
          </div>
          <Link
            to="/admin/orders"
            className="hidden items-center gap-1 text-[11px] font-bold text-[#a86f6b] hover:text-[#6d4946] sm:flex"
          >
            {t('admin.viewAllOrders') ?? 'View all orders'} <ChevronRightIcon size={14} />
          </Link>
        </div>

        {isLoading ? (
          <div className="flex min-h-[200px] items-center justify-center gap-2 text-xs text-[#806967]">
            <LoaderCircle className="animate-spin text-[#8e5d5a]" size={20} />
            Loading recent orders...
          </div>
        ) : error ? (
          <div className="flex min-h-[200px] flex-col items-center justify-center gap-2 text-center">
            <p className="m-0 text-xs text-[#a36c69]">{error}</p>
            <button
              className="rounded-[7px] bg-[#6d4946] px-3 py-1.5 text-xs font-bold text-[#fffaf5]"
              onClick={() => setReloadKey((k) => k + 1)}
            >
              {t('admin.tryAgain')}
            </button>
          </div>
        ) : orders.length === 0 ? (
          <div className="flex min-h-[200px] flex-col items-center justify-center text-center text-[#a38b83]">
            <ShoppingBag size={28} className="mb-2 text-[#c29b91]" />
            <p className="m-0 text-xs font-semibold">{t('admin.noOrders') ?? 'No recent orders'}</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[680px] border-collapse text-left">
              <thead>
                <tr className="border-b border-[#f0e5de] text-[10px] font-bold uppercase tracking-[.1em] text-[#b09a92]">
                  <th className="pb-3 pl-2">{t('admin.orderId') ?? 'Order ID'}</th>
                  <th className="pb-3">{t('admin.customer') ?? 'Customer'}</th>
                  <th className="pb-3">{t('admin.date') ?? 'Date'}</th>
                  <th className="pb-3">{t('admin.total') ?? 'Total'}</th>
                  <th className="pb-3">{t('admin.status') ?? 'Status'}</th>
                  <th className="pb-3 pr-2 text-right">{t('admin.action') ?? 'Action'}</th>
                </tr>
              </thead>
              <tbody>
                {orders.map((order) => {
                  const id = getOrderId(order)
                  const customer = getCustomerName(order)
                  const initials = getInitials(customer)
                  const status = order.status ?? 'Processing'
                  const rawOrderId = order.orderId ?? order.id

                  return (
                    <tr key={id} className="border-b border-[#f3eae4] last:border-0">
                      <td className="py-4 pl-2 text-xs font-bold text-[#6d4946]">{id}</td>
                      <td className="py-4">
                        <div className="flex items-center gap-2.5">
                          <span className="grid h-7 w-7 place-items-center rounded-full bg-[#f3e4dc] text-[9px] font-bold text-[#8e5d5a]">
                            {initials}
                          </span>
                          <span className="text-xs font-semibold text-[#493331]">{customer}</span>
                        </div>
                      </td>
                      <td className="py-4 text-[11px] text-[#9e8780]">{formatDate(order)}</td>
                      <td className="py-4 text-xs font-bold text-[#493331]">{formatTotal(order)}</td>
                      <td className="py-4">
                        <span className={`inline-flex rounded-full px-2.5 py-1 text-[10px] font-bold ${getStatusClass(status)}`}>
                          {status}
                        </span>
                      </td>
                      <td className="py-4 pr-2 text-right">
                        <button
                          className="text-[11px] font-bold text-[#a86f6b] hover:text-[#6d4946] disabled:opacity-40"
                          onClick={() => setSelectedOrderId(rawOrderId ?? null)}
                          disabled={rawOrderId === undefined || rawOrderId === null}
                        >
                          {t('admin.view') ?? 'View'}
                        </button>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        )}

        {!isLoading && !error && orders.length > 0 && (
          <div className="mt-4 flex items-center justify-between border-t border-[#f0e5de] pt-4">
            <p className="m-0 text-[11px] text-[#aa938b]">
              Showing {orders.length} of {totalCount} orders (Page {page} of {totalPages})
            </p>
            <div className="flex gap-1">
              <button
                disabled={page <= 1}
                className="grid h-7 w-7 place-items-center rounded-[7px] border border-[#eaded5] text-[#aa938b] hover:bg-[#faf2ec] disabled:cursor-not-allowed disabled:opacity-40"
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                aria-label="Previous page"
              >
                <ChevronLeft size={14} />
              </button>
              <button
                disabled={page >= totalPages}
                className="grid h-7 w-7 place-items-center rounded-[7px] border border-[#eaded5] text-[#aa938b] hover:bg-[#faf2ec] disabled:cursor-not-allowed disabled:opacity-40"
                onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                aria-label="Next page"
              >
                <ChevronRight size={14} />
              </button>
            </div>
          </div>
        )}
      </section>

      {selectedOrderId !== null && (
        <OrderDetailsModal
          orderId={selectedOrderId}
          onClose={() => setSelectedOrderId(null)}
          onUpdated={updateOrderInList}
        />
      )}
    </>
  )
}

export default RecentOrders