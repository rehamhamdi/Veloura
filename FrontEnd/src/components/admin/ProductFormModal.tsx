import React, { useState, useEffect, useRef } from 'react'
import { X, LoaderCircle, Upload, Image as ImageIcon, Sparkles, Trash2 } from 'lucide-react'
import { createAdminProduct, updateAdminProduct } from '../../services/adminProducts'
import type { ApiProduct, ProductPayload } from '../../types/adminProducts'
import { useI18n } from '../../i18n/I18nProvider'

interface ProductFormModalProps {
  product?: ApiProduct | null
  categories?: string[]
  onClose: () => void
  onSuccess: (product: ApiProduct) => void
}

const DEFAULT_CATEGORIES = [
  'Cleansers',
  'Serums',
  'Moisturizers',
  'Sunscreen',
  'Face oils',
  'Exfoliators',
  'Masks',
  'Eye Care',
  'Lip Care',
]

export default function ProductFormModal({
  product,
  categories = DEFAULT_CATEGORIES,
  onClose,
  onSuccess,
}: ProductFormModalProps) {
  const { t } = useI18n()
  const isEditing = Boolean(product)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const [title, setTitle] = useState(product?.title ?? '')
  const [description, setDescription] = useState(product?.description ?? '')
  const [price, setPrice] = useState(product?.price != null ? String(product.price) : '')
  const [stock, setStock] = useState(product?.stock != null ? String(product.stock) : '0')
  const [category, setCategory] = useState(product?.category ?? 'Cleansers')
  const [customCategory, setCustomCategory] = useState('')
  const [imageUrl, setImageUrl] = useState(product?.images?.[0]?.url ?? '')
  const [fileName, setFileName] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState('')

  const availableCategories = Array.from(
    new Set([...DEFAULT_CATEGORIES, ...categories.filter((c) => c && c !== 'All categories')])
  )

  useEffect(() => {
    if (product) {
      setTitle(product.title)
      setDescription(product.description)
      setPrice(String(product.price))
      setStock(String(product.stock))
      setCategory(product.category)
      setImageUrl(product.images?.[0]?.url ?? '')
      setFileName('')
    }
  }, [product])

  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return

    setFileName(file.name)
    const reader = new FileReader()
    reader.onload = () => {
      if (typeof reader.result === 'string') {
        setImageUrl(reader.result)
      }
    }
    reader.readAsDataURL(file)
  }

  function handleRemoveImage() {
    setImageUrl('')
    setFileName('')
    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError('')

    const trimmedTitle = title.trim()
    if (!trimmedTitle) {
      setError(t('admin.productTitleRequired') ?? 'Product name is required.')
      return
    }

    const numPrice = parseFloat(price)
    if (isNaN(numPrice) || numPrice < 0) {
      setError(t('admin.productPriceInvalid') ?? 'Please enter a valid price.')
      return
    }

    const numStock = parseInt(stock, 10)
    if (isNaN(numStock) || numStock < 0) {
      setError(t('admin.productStockInvalid') ?? 'Please enter a valid stock quantity.')
      return
    }

    const finalCategory = category === '__custom__' ? customCategory.trim() : category.trim()
    if (!finalCategory) {
      setError(t('admin.productCategoryRequired') ?? 'Please select or enter a category.')
      return
    }

    const trimmedImageUrl = imageUrl.trim()
    if (trimmedImageUrl.length > 500) {
      setError('Image URL is too long (must be 500 characters or fewer). Please use an image web link.')
      return
    }

    const payload: ProductPayload = {
      title: trimmedTitle,
      description: description.trim(),
      price: numPrice,
      stock: numStock,
      category: finalCategory,
      images: trimmedImageUrl
        ? [
            {
              id: product?.images?.[0]?.id ?? 0,
              url: trimmedImageUrl,
              sortOrder: 0,
            },
          ]
        : [],
    }

    setIsSubmitting(true)
    try {
      if (isEditing && product) {
        const updated = await updateAdminProduct(product.id, payload)
        onSuccess(updated)
      } else {
        const created = await createAdminProduct(payload)
        onSuccess(created)
      }
      onClose()
    } catch (err: any) {
      const backendErrors = err?.response?.data?.errors
      let msg = ''
      if (Array.isArray(backendErrors) && backendErrors.length > 0) {
        msg = backendErrors.join(' | ')
      } else if (typeof backendErrors === 'object' && backendErrors !== null) {
        msg = Object.values(backendErrors).flat().join(' | ')
      } else {
        msg =
          err?.response?.data?.message ??
          err?.message ??
          (t('admin.productSaveError') ?? 'Failed to save product. Please try again.')
      }
      setError(msg)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div
      className="fixed inset-0 z-[60] flex items-end justify-center bg-[#3b2a29]/35 p-0 backdrop-blur-xs sm:items-center sm:p-5"
      role="presentation"
      onMouseDown={(e) => {
        if (e.target === e.currentTarget && !isSubmitting) onClose()
      }}
    >
      <section
        className="max-h-[92vh] w-full max-w-[640px] overflow-y-auto rounded-t-[24px] border border-[#eaded5] bg-[#fffdf9] p-5 shadow-[0_20px_60px_rgba(59,42,41,.2)] sm:rounded-[24px] sm:p-7"
        role="dialog"
        aria-modal="true"
        aria-labelledby="product-modal-title"
      >
        {/* Header */}
        <div className="flex items-start justify-between border-b border-[#f0e5de] pb-5">
          <div>
            <p className="mb-1 text-[10px] font-bold uppercase tracking-[.18em] text-[#a86f6b]">
              {isEditing ? t('admin.editProduct') ?? 'Edit Product' : t('admin.newProduct') ?? 'New Product'}
            </p>
            <h2 id="product-modal-title" className="m-0 font-['Playfair_Display'] text-2xl font-medium text-[#493331]">
              {isEditing ? product?.title : t('admin.addProduct') ?? 'Add New Product'}
            </h2>
          </div>
          <button
            type="button"
            className="grid h-9 w-9 place-items-center rounded-full text-[#806967] transition hover:bg-[#f3e4dc]"
            onClick={onClose}
            disabled={isSubmitting}
            aria-label="Close"
          >
            <X size={18} />
          </button>
        </div>

        {/* Error message */}
        {error && (
          <div className="mt-4 rounded-xl border border-[#f2dede] bg-[#fdf7f7] p-3.5 text-xs font-medium text-[#a36c69]">
            {error}
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="mt-6 space-y-4.5">
          {/* Title / Name */}
          <div>
            <label className="mb-1.5 block text-xs font-bold text-[#493331]">
              {t('admin.productName') ?? 'Product Name'} <span className="text-[#a36c69]">*</span>
            </label>
            <input
              type="text"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. Hydrating Face Cleanser"
              className="h-11 w-full rounded-xl border border-[#eaded5] bg-[#fffaf5] px-3.5 text-xs text-[#493331] outline-none transition focus:border-[#a86f6b] focus:ring-1 focus:ring-[#a86f6b]"
            />
          </div>

          {/* Category & Price Grid */}
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className="mb-1.5 block text-xs font-bold text-[#493331]">
                {t('admin.category') ?? 'Category'} <span className="text-[#a36c69]">*</span>
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="h-11 w-full rounded-xl border border-[#eaded5] bg-[#fffaf5] px-3 text-xs text-[#493331] outline-none transition focus:border-[#a86f6b] focus:ring-1 focus:ring-[#a86f6b]"
              >
                {availableCategories.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
                <option value="__custom__">+ {t('admin.otherCategory') ?? 'Custom Category...'}</option>
              </select>

              {category === '__custom__' && (
                <input
                  type="text"
                  value={customCategory}
                  onChange={(e) => setCustomCategory(e.target.value)}
                  placeholder="Enter category name"
                  className="mt-2 h-10 w-full rounded-xl border border-[#eaded5] bg-[#fffaf5] px-3.5 text-xs text-[#493331] outline-none transition focus:border-[#a86f6b]"
                />
              )}
            </div>

            <div>
              <label className="mb-1.5 block text-xs font-bold text-[#493331]">
                {t('admin.price') ?? 'Price'} ($) <span className="text-[#a36c69]">*</span>
              </label>
              <input
                type="number"
                step="0.01"
                min="0"
                required
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                placeholder="0.00"
                className="h-11 w-full rounded-xl border border-[#eaded5] bg-[#fffaf5] px-3.5 text-xs text-[#493331] outline-none transition focus:border-[#a86f6b] focus:ring-1 focus:ring-[#a86f6b]"
              />
            </div>
          </div>

          {/* Stock */}
          <div>
            <label className="mb-1.5 block text-xs font-bold text-[#493331]">
              {t('admin.stock') ?? 'Stock Quantity'} <span className="text-[#a36c69]">*</span>
            </label>
            <input
              type="number"
              min="0"
              required
              value={stock}
              onChange={(e) => setStock(e.target.value)}
              placeholder="0"
              className="h-11 w-full rounded-xl border border-[#eaded5] bg-[#fffaf5] px-3.5 text-xs text-[#493331] outline-none transition focus:border-[#a86f6b] focus:ring-1 focus:ring-[#a86f6b]"
            />
          </div>

          {/* Image Input */}
          <div>
            <div className="mb-1.5 flex items-center justify-between">
              <label className="block text-xs font-bold text-[#493331]">
                {t('admin.productImage') ?? 'Product Image URL'}
              </label>
            </div>

            <div className="flex gap-2">
              <input
                type="url"
                value={imageUrl}
                onChange={(e) => {
                  setImageUrl(e.target.value)
                  setFileName('')
                }}
                placeholder="https://images.unsplash.com/... (Image web link)"
                className="h-11 flex-1 rounded-xl border border-[#eaded5] bg-[#fffaf5] px-3.5 text-xs text-[#493331] outline-none transition focus:border-[#a86f6b] focus:ring-1 focus:ring-[#a86f6b]"
              />
              {imageUrl && (
                <button
                  type="button"
                  onClick={handleRemoveImage}
                  className="grid h-11 w-11 place-items-center rounded-xl border border-[#f2dede] bg-[#fffaf5] text-[#a36c69] transition hover:bg-[#fbeae8]"
                  title="Clear"
                >
                  <Trash2 size={16} />
                </button>
              )}
            </div>

            {imageUrl && (
              <div className="mt-2.5 flex items-center gap-3 rounded-xl border border-[#eee3dc] bg-[#fffaf5] p-2.5">
                <img
                  src={imageUrl}
                  alt="Preview"
                  className="h-14 w-14 rounded-lg object-cover bg-[#eee3dc] shadow-xs"
                  onError={(e) => {
                    ;(e.target as HTMLImageElement).src =
                      'https://placehold.co/100x100?text=Invalid+URL'
                  }}
                />
                <div className="min-w-0 flex-1">
                  <p className="m-0 truncate text-xs font-semibold text-[#493331]">{imageUrl}</p>
                  <p className="m-0 text-[10px] text-[#63846f] font-medium">✓ Image preview</p>
                </div>
              </div>
            )}
          </div>

          {/* Description */}
          <div>
            <label className="mb-1.5 block text-xs font-bold text-[#493331]">
              {t('admin.description') ?? 'Description'}
            </label>
            <textarea
              rows={3}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Brief description of the product benefits, ingredients, and usage..."
              className="w-full resize-none rounded-xl border border-[#eaded5] bg-[#fffaf5] p-3 text-xs text-[#493331] outline-none transition focus:border-[#a86f6b] focus:ring-1 focus:ring-[#a86f6b]"
            />
          </div>

          {/* Footer buttons */}
          <div className="mt-6 flex items-center justify-end gap-3 border-t border-[#f0e5de] pt-5">
            <button
              type="button"
              onClick={onClose}
              disabled={isSubmitting}
              className="h-10 rounded-xl border border-[#e5d6cd] bg-[#fffdf9] px-4 text-xs font-bold text-[#806967] transition hover:bg-[#f3e4dc]"
            >
              {t('admin.cancel') ?? 'Cancel'}
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="inline-flex h-10 items-center justify-center gap-2 rounded-xl bg-[#6d4946] px-5 text-xs font-bold text-[#fffaf5] shadow-sm transition hover:bg-[#583a38] disabled:cursor-not-allowed disabled:opacity-60"
            >
              {isSubmitting ? (
                <>
                  <LoaderCircle className="animate-spin" size={15} />
                  {t('admin.saving') ?? 'Saving...'}
                </>
              ) : isEditing ? (
                t('admin.saveChanges') ?? 'Save Changes'
              ) : (
                <>
                  <Sparkles size={15} />
                  {t('admin.createProduct') ?? 'Create Product'}
                </>
              )}
            </button>
          </div>
        </form>
      </section>
    </div>
  )
}


