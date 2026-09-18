import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { LoaderCircle, Package } from 'lucide-react'
import { getTopProducts } from '../../services/adminDashboard'
import type { TopProductItem } from '../../types/adminDashboard'
import { useI18n } from '../../i18n/I18nProvider'

const DEFAULT_IMAGE = 'https://images.unsplash.com/photo-1556228720-195a672e8a03?auto=format&fit=crop&w=160&q=85'

function formatSold(product: TopProductItem): string {
  if (typeof product.sold === 'number') return `${product.sold} units`
  if (typeof product.sold === 'string') return product.sold.includes('unit') ? product.sold : `${product.sold} units`
  if (typeof product.soldCount === 'number') return `${product.soldCount} units`
  if (typeof product.totalSold === 'number') return `${product.totalSold} units`
  if (typeof product.quantitySold === 'number') return `${product.quantitySold} units`
  if (typeof product.unitsSold === 'number') return `${product.unitsSold} units`
  return '0 units'
}

function formatRevenue(product: TopProductItem): string {
  const rev = product.revenue ?? product.totalRevenue ?? product.price
  if (typeof rev === 'number') {
    return `$${rev.toLocaleString('en-US', { minimumFractionDigits: 0, maximumFractionDigits: 2 })}`
  }
  if (typeof rev === 'string') {
    return rev.startsWith('$') ? rev : `$${rev}`
  }
  return '$0'
}

function TopProducts() {
  const { t } = useI18n()
  const [products, setProducts] = useState<TopProductItem[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState('')

  const [reloadKey, setReloadKey] = useState(0)

  useEffect(() => {
    let cancelled = false

    async function loadTopProducts() {
      setIsLoading(true)
      setError('')
      try {
        const data = await getTopProducts(3)
        if (!cancelled) {
          setProducts(data)
        }
      } catch {
        if (!cancelled) {
          setError('Could not load top products')
        }
      } finally {
        if (!cancelled) {
          setIsLoading(false)
        }
      }
    }

    void loadTopProducts()
    return () => {
      cancelled = true
    }
  }, [reloadKey])

  return (
    <article className="rounded-[16px] border border-[#eaded5] bg-[#fffdf9] p-5 sm:p-6">
      <div className="flex items-center justify-between">
        <div>
          <div className="flex items-center gap-2">
            <span className="h-2 w-2 rounded-full bg-[#9a7b52]" />
            <p className="m-0 text-sm font-bold text-[#493331]">{t('admin.topProducts') ?? 'Top products'}</p>
          </div>
          <p className="mb-0 mt-2 text-xs text-[#a38b83]">
            {t('admin.bestSellers') ?? 'Your best sellers this month'}
          </p>
        </div>
        <Link to="/admin/products" className="text-[11px] font-bold text-[#a86f6b] hover:text-[#6d4946]">
          {t('admin.viewAll') ?? 'View all'}
        </Link>
      </div>

      <div className="mt-5 grid min-h-[180px] gap-1">
        {isLoading && (
          <div className="flex flex-col gap-3 py-2">
            {[1, 2, 3].map((idx) => (
              <div key={idx} className="flex animate-pulse items-center gap-3 py-2">
                <span className="h-4 w-4 rounded bg-[#eee3dc]" />
                <div className="h-12 w-12 rounded-[10px] bg-[#eee3dc]" />
                <div className="flex-1 space-y-2">
                  <div className="h-3 w-32 rounded bg-[#eee3dc]" />
                  <div className="h-2 w-20 rounded bg-[#f3eae4]" />
                </div>
                <div className="h-4 w-12 rounded bg-[#eee3dc]" />
              </div>
            ))}
          </div>
        )}

        {!isLoading && error && (
          <div className="flex flex-col items-center justify-center py-6 text-center">
            <p className="m-0 text-xs text-[#a36c69]">{error}</p>
            <button
              className="mt-2 rounded-[7px] bg-[#6d4946] px-3 py-1 text-xs font-bold text-[#fffaf5]"
              onClick={() => setReloadKey((k) => k + 1)}
            >
              {t('admin.tryAgain')}
            </button>
          </div>
        )}

        {!isLoading && !error && products.length === 0 && (
          <div className="flex flex-col items-center justify-center py-8 text-center text-[#a38b83]">
            <Package size={28} className="mb-2 text-[#c29b91]" />
            <p className="m-0 text-xs font-semibold">{t('admin.noProducts') ?? 'No top products found'}</p>
          </div>
        )}

        {!isLoading &&
          !error &&
          products.map((product, index) => {
            const name = product.name ?? product.productName ?? product.title ?? 'Product'
            const category = product.category ?? product.categoryName ?? 'Skincare'
            const img = product.imageUrl || product.image || product.productImageUrl || DEFAULT_IMAGE

            return (
              <div
                key={product.id ?? `${name}-${index}`}
                className="flex items-center gap-3 border-b border-[#f3eae4] py-3 last:border-0"
              >
                <span className="w-4 text-[10px] font-bold text-[#b9a39b]">
                  {String(index + 1).padStart(2, '0')}
                </span>
                <img
                  className="h-12 w-12 rounded-[10px] bg-[#eee3dc] object-cover"
                  src={img}
                  alt={name}
                  onError={(e) => {
                    ;(e.target as HTMLImageElement).src = DEFAULT_IMAGE
                  }}
                />
                <div className="min-w-0 flex-1">
                  <p className="m-0 truncate text-xs font-bold text-[#493331]">{name}</p>
                  <p className="m-0 mt-1 text-[10px] text-[#a38b83]">
                    {category} · {formatSold(product)}
                  </p>
                </div>
                <p className="m-0 text-xs font-bold text-[#6d4946]">{formatRevenue(product)}</p>
              </div>
            )
          })}
      </div>
    </article>
  )
}

export default TopProducts