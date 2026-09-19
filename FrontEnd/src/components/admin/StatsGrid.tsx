import { useEffect, useState } from 'react'
import { Package, ShoppingBag, Store, Users, LoaderCircle } from 'lucide-react'
import { getDashboardSummary } from '../../services/adminDashboard'
import type { DashboardSummaryData } from '../../types/adminDashboard'
import { useI18n } from '../../i18n/I18nProvider'

function StatsGrid() {
  const { t } = useI18n()
  const [summary, setSummary] = useState<DashboardSummaryData | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState('')

  const [reloadKey, setReloadKey] = useState(0)

  useEffect(() => {
    let cancelled = false

    async function loadSummary() {
      setIsLoading(true)
      setError('')
      try {
        const data = await getDashboardSummary()
        if (!cancelled) {
          setSummary(data)
        }
      } catch {
        if (!cancelled) {
          setError('Could not load summary')
        }
      } finally {
        if (!cancelled) {
          setIsLoading(false)
        }
      }
    }

    void loadSummary()
    return () => {
      cancelled = true
    }
  }, [reloadKey])

  const cards = [
    {
      key: 'sales',
      label: t('admin.totalSales'),
      value: summary?.totalSales ? `$${summary.totalSales.value.toLocaleString('en-US', { minimumFractionDigits: 0, maximumFractionDigits: 2 })}` : '$0',
      change: summary?.totalSales?.percentageChange,
      icon: Store,
      tone: 'bg-[#f3e4dc] text-[#a86f6b]',
    },
    {
      key: 'orders',
      label: t('admin.totalOrders'),
      value: summary?.totalOrders ? summary.totalOrders.value.toLocaleString() : '0',
      change: summary?.totalOrders?.percentageChange,
      icon: ShoppingBag,
      tone: 'bg-[#eee8dc] text-[#9a7b52]',
    },
    {
      key: 'products',
      label: t('admin.totalProducts'),
      value: summary?.totalProducts ? summary.totalProducts.value.toLocaleString() : '0',
      change: summary?.totalProducts?.percentageChange,
      icon: Package,
      tone: 'bg-[#e7eee8] text-[#698674]',
    },
    {
      key: 'customers',
      label: t('admin.totalCustomers'),
      value: summary?.totalCustomers ? summary.totalCustomers.value.toLocaleString() : '0',
      change: summary?.totalCustomers?.percentageChange,
      icon: Users,
      tone: 'bg-[#e9e3ed] text-[#806786]',
    },
  ]

  if (isLoading) {
    return (
      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {[1, 2, 3, 4].map((index) => (
          <article
            key={index}
            className="animate-pulse rounded-[16px] border border-[#eaded5] bg-[#fffdf9] p-5 shadow-[0_8px_25px_rgba(91,55,53,.035)]"
          >
            <div className="flex items-start justify-between">
              <div className="w-2/3">
                <div className="h-3 w-20 rounded bg-[#eee3dc]" />
                <div className="mt-3 h-7 w-28 rounded bg-[#f3eae4]" />
              </div>
              <div className="h-10 w-10 rounded-[12px] bg-[#eee3dc]" />
            </div>
            <div className="mt-5 h-3 w-24 rounded bg-[#eee3dc]" />
          </article>
        ))}
      </section>
    )
  }

  if (error && !summary) {
    return (
      <section className="rounded-[16px] border border-[#eaded5] bg-[#fffdf9] p-4 text-center">
        <p className="m-0 text-xs text-[#a36c69]">{error}</p>
        <button
          className="mt-2 rounded-[7px] bg-[#6d4946] px-3 py-1 text-xs font-bold text-[#fffaf5]"
          onClick={() => setReloadKey((k) => k + 1)}
        >
          {t('admin.tryAgain')}
        </button>
      </section>
    )
  }

  return (
    <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
      {cards.map(({ key, label, value, change, icon: Icon, tone }) => {
        const hasChange = change !== null && change !== undefined
        const isPositive = hasChange && change > 0
        const isNegative = hasChange && change < 0

        return (
          <article
            key={key}
            className="rounded-[16px] border border-[#eaded5] bg-[#fffdf9] p-5 shadow-[0_8px_25px_rgba(91,55,53,.035)]"
          >
            <div className="flex items-start justify-between">
              <div>
                <p className="m-0 text-xs font-semibold text-[#806967]">{label}</p>
                <p className="mb-0 mt-3 font-['Playfair_Display'] text-[29px] leading-none text-[#493331]">{value}</p>
              </div>
              <span className={`grid h-10 w-10 place-items-center rounded-[12px] ${tone}`}>
                <Icon size={18} strokeWidth={1.7} />
              </span>
            </div>
            <p className="mt-5 mb-0 text-[11px] text-[#a38b83]">
              {hasChange ? (
                <>
                  <span className={`font-bold ${isPositive ? 'text-[#71917b]' : isNegative ? 'text-[#a36c69]' : 'text-[#806967]'}`}>
                    {isPositive ? `+${change}%` : `${change}%`}
                  </span>
                  <span className="ml-1">{t('admin.fromLastMonth')}</span>
                </>
              ) : (
                <span className="text-[#b9a39b]">—</span>
              )}
            </p>
          </article>
        )
      })}
    </section>
  )
}

export default StatsGrid