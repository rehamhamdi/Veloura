import type { AdminOrder } from './adminOrders'

export interface DashboardMetric {
  value: number
  percentageChange: number | null
}

export interface DashboardSummaryData {
  totalSales: DashboardMetric
  totalOrders: DashboardMetric
  totalProducts: DashboardMetric
  totalCustomers: DashboardMetric
}

export interface DashboardSummaryResponse {
  statusCode: string | number
  succeeded: boolean
  message: string
  errors: string[] | null
  data: DashboardSummaryData
}

export interface SalesOverviewPoint {
  label: string
  value: number
}

export interface SalesOverviewData {
  period: string
  points: SalesOverviewPoint[]
}

export interface SalesOverviewResponse {
  statusCode: string | number
  succeeded: boolean
  message: string
  errors: string[] | null
  data: SalesOverviewData
}

export interface TopProductItem {
  id?: number | string
  productId?: number | string
  name?: string
  productName?: string
  title?: string
  category?: string
  categoryName?: string
  sold?: number | string
  soldCount?: number
  totalSold?: number
  quantitySold?: number
  unitsSold?: number
  revenue?: number | string
  totalRevenue?: number
  price?: number
  image?: string
  imageUrl?: string
  productImageUrl?: string
}

export interface TopProductsResponse {
  statusCode: string | number
  succeeded: boolean
  message: string
  errors: string[] | null
  data: TopProductItem[]
}

export interface RecentOrdersData {
  items: AdminOrder[]
  totalCount: number
  currentPage: number
  totalPages: number
  pageSize: number
}

export interface RecentOrdersResponse {
  statusCode: string | number
  succeeded: boolean
  message: string
  errors: string[] | null
  data: RecentOrdersData
}

export type SalesPeriod = 'Today' | 'ThisWeek' | 'ThisMonth' | 'ThisYear'
