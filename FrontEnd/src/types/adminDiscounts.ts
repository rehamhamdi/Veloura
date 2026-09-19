export type DiscountType = 'percentage' | 'fixed' | 'free_shipping' | 'bogo'

export type DiscountStatus = 'Active' | 'Scheduled' | 'Expired' | 'Draft'

export type DiscountScope = 'all' | 'category' | 'products'

export interface AdminDiscount {
  id: string
  code: string
  title: string
  description: string
  type: DiscountType
  value: number
  minSpend?: number
  usageLimit?: number
  usageCount: number
  startDate: string
  endDate?: string
  status: DiscountStatus
  appliesTo: string
  colorTheme?: 'rose' | 'sage' | 'amber' | 'lavender'
}
