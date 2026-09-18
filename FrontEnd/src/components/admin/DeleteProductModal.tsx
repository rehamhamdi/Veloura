import { useState } from 'react'
import { AlertTriangle, LoaderCircle, X } from 'lucide-react'
import { deleteAdminProduct } from '../../services/adminProducts'
import type { ApiProduct } from '../../types/adminProducts'
import { useI18n } from '../../i18n/I18nProvider'

interface DeleteProductModalProps {
  product: ApiProduct
  onClose: () => void
  onSuccess: (productId: number) => void
}

export default function DeleteProductModal({
  product,
  onClose,
  onSuccess,
}: DeleteProductModalProps) {
  const { t } = useI18n()
  const [isDeleting, setIsDeleting] = useState(false)
  const [error, setError] = useState('')

  async function handleDelete() {
    setIsDeleting(true)
    setError('')

    try {
      await deleteAdminProduct(product.id)
      onSuccess(product.id)
      onClose()
    } catch (err: any) {
      const msg =
        err?.response?.data?.message ??
        err?.message ??
        (t('admin.productDeleteError') ?? 'Failed to delete product. Please try again.')
      setError(msg)
    } finally {
      setIsDeleting(false)
    }
  }

  return (
    <div
      className="fixed inset-0 z-[60] flex items-center justify-center bg-[#3b2a29]/35 p-4 backdrop-blur-xs"
      role="presentation"
      onMouseDown={(e) => {
        if (e.target === e.currentTarget && !isDeleting) onClose()
      }}
    >
      <section
        className="w-full max-w-[440px] rounded-[24px] border border-[#eaded5] bg-[#fffdf9] p-6 shadow-[0_20px_60px_rgba(59,42,41,.2)]"
        role="dialog"
        aria-modal="true"
        aria-labelledby="delete-modal-title"
      >
        <div className="flex items-start justify-between">
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[#fbeae8] text-[#a36c69]">
            <AlertTriangle size={22} />
          </div>
          <button
            type="button"
            className="grid h-8 w-8 place-items-center rounded-full text-[#806967] transition hover:bg-[#f3e4dc]"
            onClick={onClose}
            disabled={isDeleting}
            aria-label="Close"
          >
            <X size={16} />
          </button>
        </div>

        <div className="mt-4">
          <h3 id="delete-modal-title" className="m-0 font-['Playfair_Display'] text-xl font-medium text-[#493331]">
            {t('admin.deleteProductTitle') ?? 'Delete Product'}
          </h3>
          <p className="mt-2 text-xs leading-relaxed text-[#806967]">
            {t('admin.deleteProductConfirm') ?? 'Are you sure you want to delete this product?'}
          </p>

          <div className="mt-4 flex items-center gap-3 rounded-xl border border-[#eee3dc] bg-[#fffaf5] p-3">
            {product.images?.[0]?.url ? (
              <img
                src={product.images[0].url}
                alt=""
                className="h-10 w-10 rounded-lg object-cover bg-[#eee3dc]"
                onError={(e) => {
                  ;(e.target as HTMLImageElement).src =
                    'https://placehold.co/100x100?text=No+Image'
                }}
              />
            ) : (
              <div className="grid h-10 w-10 place-items-center rounded-lg bg-[#eee3dc] text-xs font-bold text-[#806967]">
                VL
              </div>
            )}
            <div className="min-w-0 flex-1">
              <p className="m-0 truncate text-xs font-bold text-[#493331]">{product.title}</p>
              <p className="m-0 text-[10px] text-[#a38b83]">
                {product.category} · ${product.price}
              </p>
            </div>
          </div>

          {error && (
            <div className="mt-3 rounded-xl border border-[#f2dede] bg-[#fdf7f7] p-3 text-xs font-medium text-[#a36c69]">
              {error}
            </div>
          )}
        </div>

        <div className="mt-6 flex items-center justify-end gap-3 border-t border-[#f0e5de] pt-4">
          <button
            type="button"
            onClick={onClose}
            disabled={isDeleting}
            className="h-9.5 rounded-xl border border-[#e5d6cd] bg-[#fffdf9] px-4 text-xs font-bold text-[#806967] transition hover:bg-[#f3e4dc]"
          >
            {t('admin.cancel') ?? 'Cancel'}
          </button>
          <button
            type="button"
            onClick={handleDelete}
            disabled={isDeleting}
            className="inline-flex h-9.5 items-center justify-center gap-2 rounded-xl bg-[#a36c69] px-4.5 text-xs font-bold text-[#fffaf5] shadow-sm transition hover:bg-[#8e5a57] disabled:cursor-not-allowed disabled:opacity-60"
          >
            {isDeleting ? (
              <>
                <LoaderCircle className="animate-spin" size={14} />
                {t('admin.deleting') ?? 'Deleting...'}
              </>
            ) : (
              t('admin.delete') ?? 'Delete'
            )}
          </button>
        </div>
      </section>
    </div>
  )
}
