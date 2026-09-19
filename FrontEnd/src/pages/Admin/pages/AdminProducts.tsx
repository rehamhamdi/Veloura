import { useEffect, useMemo, useState } from 'react'
import {
  Edit3,
  LoaderCircle,
  MoreVertical,
  Plus,
  RefreshCw,
  Search,
  SlidersHorizontal,
  Trash2,
} from 'lucide-react'
import AdminShell from '../../../components/admin/AdminShell'
import Dropdown from '../../../components/ui/Dropdown'
import ProductFormModal from '../../../components/admin/ProductFormModal'
import DeleteProductModal from '../../../components/admin/DeleteProductModal'
import { getAdminProducts } from '../../../services/adminProducts'
import type { ApiProduct } from '../../../types/adminProducts'
import { useI18n } from '../../../i18n/I18nProvider'

const DEFAULT_IMAGE =
  'https://images.unsplash.com/photo-1556228720-195a672e8a03?auto=format&fit=crop&w=600&q=85'

function getProductStatus(stock: number): { label: string; style: string } {
  if (stock === 0) {
    return { label: 'Out of stock', style: 'bg-[#f2e3e1] text-[#a36c69]' }
  }
  if (stock <= 20) {
    return { label: 'Low stock', style: 'bg-[#f6ead1] text-[#9a713c]' }
  }
  return { label: 'In stock', style: 'bg-[#e4efe7] text-[#63846f]' }
}

function AdminProducts() {
  const [products, setProducts] = useState<ApiProduct[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState('')
  const [search, setSearch] = useState('')
  const [category, setCategory] = useState('All categories')
  const [status, setStatus] = useState('All status')

  // Modals state
  const [isFormModalOpen, setIsFormModalOpen] = useState(false)
  const [editingProduct, setEditingProduct] = useState<ApiProduct | null>(null)
  const [deletingProduct, setDeletingProduct] = useState<ApiProduct | null>(null)
  const [activeMenuId, setActiveMenuId] = useState<number | null>(null)

  const { t } = useI18n()

  async function loadProducts() {
    setIsLoading(true)
    setError('')

    try {
      const data = await getAdminProducts()
      setProducts(data)
    } catch {
      setError(
        t('admin.loadProductsError') ??
          'We could not load products right now. Please try again.'
      )
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    void loadProducts()
  }, [])

  // Categories extracted from real products
  const categories = useMemo(() => {
    const set = new Set<string>()
    products.forEach((p) => {
      if (p.category) set.add(p.category)
    })
    return ['All categories', ...Array.from(set)]
  }, [products])

  const categoryOptions = useMemo(
    () =>
      categories.map((item) => ({
        label: item === 'All categories' ? (t('admin.allCategories') ?? item) : item,
        value: item,
      })),
    [categories, t]
  )

  const statusOptions = useMemo(
    () => [
      { label: t('admin.allStatus') ?? 'All status', value: 'All status' },
      { label: t('admin.inStock') ?? 'In stock', value: 'In stock' },
      { label: t('admin.lowStock') ?? 'Low stock', value: 'Low stock' },
      { label: t('admin.outOfStock') ?? 'Out of stock', value: 'Out of stock' },
    ],
    [t]
  )

  // Filtered products list
  const filteredProducts = useMemo(() => {
    return products.filter((product) => {
      const searchTarget = `${product.title} ${product.category} ${product.description ?? ''}`.toLowerCase()
      const matchesSearch = searchTarget.includes(search.toLowerCase())

      const matchesCategory =
        category === 'All categories' || product.category === category

      let matchesStatus = true
      if (status === 'In stock') matchesStatus = product.stock > 20
      else if (status === 'Low stock') matchesStatus = product.stock > 0 && product.stock <= 20
      else if (status === 'Out of stock') matchesStatus = product.stock === 0

      return matchesSearch && matchesCategory && matchesStatus
    })
  }, [products, search, category, status])

  // Statistics
  const totalCount = products.length
  const inStockCount = products.filter((p) => p.stock > 20).length
  const lowStockCount = products.filter((p) => p.stock > 0 && p.stock <= 20).length
  const outOfStockCount = products.filter((p) => p.stock === 0).length

  // Handlers for CRUD
  function handleProductSaved(savedProduct: ApiProduct) {
    setProducts((prev) => {
      const exists = prev.some((p) => p.id === savedProduct.id)
      if (exists) {
        return prev.map((p) => (p.id === savedProduct.id ? savedProduct : p))
      }
      return [savedProduct, ...prev]
    })
  }

  function handleProductDeleted(productId: number) {
    setProducts((prev) => prev.filter((p) => p.id !== productId))
  }

  function openCreateModal() {
    setEditingProduct(null)
    setIsFormModalOpen(true)
  }

  function openEditModal(product: ApiProduct) {
    setEditingProduct(product)
    setIsFormModalOpen(true)
    setActiveMenuId(null)
  }

  function openDeleteModal(product: ApiProduct) {
    setDeletingProduct(product)
    setActiveMenuId(null)
  }

  return (
    <AdminShell activeItem="Products">
      <main
        className="min-h-[calc(100vh-76px)] bg-[#f8f3ed] px-5 py-8 sm:px-8 lg:px-10 lg:py-10"
        onClick={() => setActiveMenuId(null)}
      >
        <div className="mx-auto max-w-[1440px]">
          {/* Header */}
          <div className="mb-8 flex flex-col justify-between gap-5 sm:flex-row sm:items-end">
            <div>
              <p className="mb-2 text-[11px] font-bold uppercase tracking-[.18em] text-[#a86f6b]">
                {t('admin.workspace')} / {t('admin.products')}
              </p>
              <h2 className="font-['Playfair_Display'] text-[clamp(2rem,4vw,2.75rem)] font-medium leading-tight text-[#3b2a29]">
                {t('admin.products')}
              </h2>
              <p className="mt-2 text-sm text-[#806967]">
                {t('admin.manageProducts')}
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-2.5 sm:self-auto">
              <button
                onClick={() => void loadProducts()}
                className="inline-flex h-10 items-center justify-center gap-2 rounded-[11px] border border-[#e5d6cd] bg-[#fffdf9] px-3.5 text-xs font-bold text-[#6d4946] shadow-xs transition hover:bg-[#f3e4dc]"
                title={t('admin.refresh') ?? 'Refresh'}
              >
                <RefreshCw size={14} className={isLoading ? 'animate-spin' : ''} />
                <span className="hidden sm:inline">{t('admin.refresh') ?? 'Refresh'}</span>
              </button>

              <button
                onClick={openCreateModal}
                className="inline-flex h-10 items-center justify-center gap-2 rounded-[11px] bg-[#6d4946] px-4.5 text-xs font-bold text-[#fffaf5] shadow-[0_8px_18px_rgba(109,73,70,.14)] transition hover:bg-[#583a38]"
              >
                <Plus size={16} />
                {t('admin.addProduct') ?? 'Add product'}
              </button>
            </div>
          </div>

          {/* Stats Section */}
          <section className="mb-6 grid gap-3 sm:grid-cols-4">
            <div className="rounded-[14px] border border-[#eaded5] bg-[#fffdf9] p-4 shadow-xs">
              <p className="m-0 text-[11px] font-semibold text-[#a38b83]">
                {t('admin.totalProducts') ?? 'Total products'}
              </p>
              <p className="mb-0 mt-2 font-['Playfair_Display'] text-2xl font-bold text-[#493331]">
                {isLoading ? '—' : totalCount}
              </p>
            </div>

            <div className="rounded-[14px] border border-[#eaded5] bg-[#fffdf9] p-4 shadow-xs">
              <p className="m-0 text-[11px] font-semibold text-[#a38b83]">
                {t('admin.activeProducts') ?? 'In stock'}
              </p>
              <p className="mb-0 mt-2 font-['Playfair_Display'] text-2xl font-bold text-[#63846f]">
                {isLoading ? '—' : inStockCount}
              </p>
            </div>

            <div className="rounded-[14px] border border-[#eaded5] bg-[#fffdf9] p-4 shadow-xs">
              <p className="m-0 text-[11px] font-semibold text-[#a38b83]">
                {t('admin.lowStockAlerts') ?? 'Low stock alerts'}
              </p>
              <p className="mb-0 mt-2 font-['Playfair_Display'] text-2xl font-bold text-[#9a713c]">
                {isLoading ? '—' : lowStockCount}
              </p>
            </div>

            <div className="rounded-[14px] border border-[#eaded5] bg-[#fffdf9] p-4 shadow-xs">
              <p className="m-0 text-[11px] font-semibold text-[#a38b83]">
                {t('admin.outOfStockAlerts') ?? 'Out of stock'}
              </p>
              <p className="mb-0 mt-2 font-['Playfair_Display'] text-2xl font-bold text-[#a36c69]">
                {isLoading ? '—' : outOfStockCount}
              </p>
            </div>
          </section>

          {/* Catalog & Filter Section */}
          <section className="rounded-[16px] border border-[#eaded5] bg-[#fffdf9] p-5 shadow-[0_8px_25px_rgba(91,55,53,.035)] sm:p-6">
            <div className="mb-6 flex flex-col justify-between gap-4 lg:flex-row lg:items-center">
              <div>
                <p className="m-0 text-sm font-bold text-[#493331]">
                  {t('admin.catalog') ?? 'Product catalog'}
                </p>
                <p className="mb-0 mt-1 text-xs text-[#a38b83]">
                  {products.length} {t('admin.products') ?? 'products'}
                </p>
              </div>

              <div className="flex flex-col gap-2.5 sm:flex-row sm:items-center">
                <label className="flex h-10 w-full items-center gap-2.5 rounded-full border border-[#e7d9d0] bg-[#fffaf5] px-4 text-[#b09a92] sm:w-[220px]">
                  <Search size={16} strokeWidth={1.7} />
                  <input
                    className="w-full bg-transparent text-xs text-[#493331] outline-none placeholder:text-[#b09a92]"
                    placeholder={t('admin.searchProducts') ?? 'Search products...'}
                    value={search}
                    onChange={(event) => setSearch(event.target.value)}
                    aria-label="Search products"
                  />
                </label>

                <Dropdown
                  className="sm:w-[175px]"
                  value={category}
                  options={categoryOptions}
                  onChange={setCategory}
                  ariaLabel="Filter by category"
                  icon={SlidersHorizontal}
                />

                <Dropdown
                  className="sm:w-[135px]"
                  value={status}
                  options={statusOptions}
                  onChange={setStatus}
                  ariaLabel="Filter by status"
                />
              </div>
            </div>

            {/* Loading state */}
            {isLoading && (
              <div className="flex min-h-[300px] flex-col items-center justify-center gap-3 text-center text-sm text-[#806967]">
                <LoaderCircle className="animate-spin text-[#6d4946]" size={26} />
                <p className="m-0 text-xs font-semibold">
                  {t('admin.loadingProducts') ?? 'Loading products...'}
                </p>
              </div>
            )}

            {/* Error state */}
            {!isLoading && error && (
              <div className="flex min-h-[260px] flex-col items-center justify-center gap-4 text-center">
                <p className="m-0 max-w-[360px] text-xs font-medium text-[#a36c69]">{error}</p>
                <button
                  className="rounded-xl bg-[#6d4946] px-4 py-2 text-xs font-bold text-[#fffaf5] shadow-xs transition hover:bg-[#583a38]"
                  onClick={() => void loadProducts()}
                >
                  {t('admin.tryAgain') ?? 'Try again'}
                </button>
              </div>
            )}

            {/* Empty state */}
            {!isLoading && !error && filteredProducts.length === 0 && (
              <div className="flex min-h-[280px] flex-col items-center justify-center text-center">
                <div className="mb-3 grid h-12 w-12 place-items-center rounded-full bg-[#f3e4dc] text-lg font-bold text-[#a86f6b]">
                  📦
                </div>
                <p className="m-0 font-['Playfair_Display'] text-xl font-medium text-[#493331]">
                  {t('admin.noProducts') ?? 'No products found'}
                </p>
                <p className="mb-0 mt-2 text-xs text-[#a38b83]">
                  {t('admin.noProductsMatch') ?? 'Try changing your search or filters.'}
                </p>
              </div>
            )}

            {/* Products grid */}
            {!isLoading && !error && filteredProducts.length > 0 && (
              <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
                {filteredProducts.map((product) => {
                  const statusInfo = getProductStatus(product.stock)
                  const imageUrl = product.images?.[0]?.url || DEFAULT_IMAGE

                  return (
                    <article
                      key={product.id}
                      className="group relative flex flex-col overflow-hidden rounded-[16px] border border-[#eee3dc] bg-[#fffaf5] transition-all duration-300 hover:-translate-y-0.5 hover:shadow-[0_12px_30px_rgba(91,55,53,.08)]"
                    >
                      {/* Image header */}
                      <div className="relative h-[200px] w-full overflow-hidden bg-[#ead9cf]">
                        <img
                          className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
                          src={imageUrl}
                          alt={product.title}
                          onError={(e) => {
                            ;(e.target as HTMLImageElement).src = DEFAULT_IMAGE
                          }}
                        />

                        {/* Status badge */}
                        <span
                          className={`absolute bottom-3 left-3 rounded-full px-2.5 py-1 text-[10px] font-bold shadow-xs ${statusInfo.style}`}
                        >
                          {statusInfo.label}
                        </span>

                        {/* More menu trigger */}
                        <div
                          className="absolute right-3 top-3"
                          onClick={(e) => e.stopPropagation()}
                        >
                          <button
                            type="button"
                            className="grid h-8 w-8 place-items-center rounded-full bg-[#fffdf9]/95 text-[#6d4946] shadow-sm backdrop-blur-xs transition hover:bg-[#fffdf9]"
                            onClick={() =>
                              setActiveMenuId(activeMenuId === product.id ? null : product.id)
                            }
                            aria-label={`Actions for ${product.title}`}
                          >
                            <MoreVertical size={16} />
                          </button>

                          {/* Action popup menu */}
                          {activeMenuId === product.id && (
                            <div className="absolute right-0 top-10 z-20 w-36 overflow-hidden rounded-xl border border-[#eaded5] bg-[#fffdf9] p-1 shadow-lg">
                              <button
                                type="button"
                                onClick={() => openEditModal(product)}
                                className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-xs font-semibold text-[#493331] transition hover:bg-[#f8f3ed]"
                              >
                                <Edit3 size={14} className="text-[#a86f6b]" />
                                {t('admin.edit') ?? 'Edit'}
                              </button>
                              <button
                                type="button"
                                onClick={() => openDeleteModal(product)}
                                className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-xs font-semibold text-[#a36c69] transition hover:bg-[#fbeae8]"
                              >
                                <Trash2 size={14} />
                                {t('admin.delete') ?? 'Delete'}
                              </button>
                            </div>
                          )}
                        </div>
                      </div>

                      {/* Content */}
                      <div className="flex flex-1 flex-col justify-between p-4.5">
                        <div>
                          <div className="flex items-start justify-between gap-3">
                            <div className="min-w-0 flex-1">
                              <h3 className="m-0 truncate text-sm font-bold text-[#493331]">
                                {product.title}
                              </h3>
                              <p className="m-0 mt-1 text-[11px] font-medium text-[#a38b83]">
                                {product.category || 'Skincare'}
                              </p>
                            </div>
                            <p className="m-0 text-base font-bold text-[#6d4946]">
                              ${Number(product.price).toFixed(2)}
                            </p>
                          </div>

                          {product.description && (
                            <p className="mb-0 mt-2.5 line-clamp-2 text-xs text-[#806967]">
                              {product.description}
                            </p>
                          )}
                        </div>

                        {/* Footer details */}
                        <div className="mt-5 flex items-center justify-between border-t border-[#f0e5de] pt-3">
                          <div>
                            <p className="m-0 text-[10px] uppercase tracking-wider text-[#a38b83]">
                              {t('admin.inventory') ?? 'Inventory'}
                            </p>
                            <p
                              className={`m-0 mt-1 text-xs font-bold ${
                                product.stock === 0
                                  ? 'text-[#a36c69]'
                                  : product.stock <= 20
                                    ? 'text-[#9a713c]'
                                    : 'text-[#63846f]'
                              }`}
                            >
                              {product.stock} {t('admin.units') ?? 'units'}
                            </p>
                          </div>

                          <div className="flex items-center gap-1.5">
                            <button
                              type="button"
                              onClick={() => openEditModal(product)}
                              className="grid h-8 w-8 place-items-center rounded-lg border border-[#e5d6cd] bg-[#fffaf5] text-[#6d4946] transition hover:bg-[#f3e4dc]"
                              title={t('admin.edit') ?? 'Edit'}
                            >
                              <Edit3 size={14} />
                            </button>
                            <button
                              type="button"
                              onClick={() => openDeleteModal(product)}
                              className="grid h-8 w-8 place-items-center rounded-lg border border-[#f2dede] bg-[#fffaf5] text-[#a36c69] transition hover:bg-[#fbeae8]"
                              title={t('admin.delete') ?? 'Delete'}
                            >
                              <Trash2 size={14} />
                            </button>
                          </div>
                        </div>
                      </div>
                    </article>
                  )
                })}
              </div>
            )}
          </section>
        </div>
      </main>

      {/* Modals */}
      {isFormModalOpen && (
        <ProductFormModal
          product={editingProduct}
          categories={categories}
          onClose={() => setIsFormModalOpen(false)}
          onSuccess={handleProductSaved}
        />
      )}

      {deletingProduct && (
        <DeleteProductModal
          product={deletingProduct}
          onClose={() => setDeletingProduct(null)}
          onSuccess={handleProductDeleted}
        />
      )}
    </AdminShell>
  )
}

export default AdminProducts

