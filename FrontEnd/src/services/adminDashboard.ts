import api from './api'
import type {
  DashboardSummaryData,
  DashboardSummaryResponse,
  RecentOrdersData,
  RecentOrdersResponse,
  SalesOverviewData,
  SalesOverviewResponse,
  TopProductItem,
  TopProductsResponse,
} from '../types/adminDashboard'

export async function getDashboardSummary(): Promise<DashboardSummaryData> {
  const response = await api.get<DashboardSummaryResponse | { data: DashboardSummaryData }>('/admin/dashboard/summary')
  if (response.data && 'data' in response.data && response.data.data) {
    return response.data.data
  }
  return response.data as unknown as DashboardSummaryData
}

export async function getSalesOverview(period: string = 'ThisWeek'): Promise<SalesOverviewData> {
  const response = await api.get<SalesOverviewResponse | { data: SalesOverviewData }>('/admin/dashboard/sales-overview', {
    params: { period },
  })
  if (response.data && 'data' in response.data && response.data.data) {
    return response.data.data
  }
  return response.data as unknown as SalesOverviewData
}

export async function getTopProducts(limit: number = 3): Promise<TopProductItem[]> {
  const response = await api.get<TopProductsResponse | TopProductItem[] | { data: TopProductItem[] }>('/admin/dashboard/top-products', {
    params: { limit },
  })
  if (Array.isArray(response.data)) {
    return response.data
  }
  if (response.data && 'data' in response.data && Array.isArray(response.data.data)) {
    return response.data.data
  }
  return []
}

export async function getRecentOrders(page: number = 1, pageSize: number = 4): Promise<RecentOrdersData> {
  const response = await api.get<RecentOrdersResponse | { data: RecentOrdersData }>('/admin/dashboard/recent-orders', {
    params: { page, pageSize },
  })
  if (response.data && 'data' in response.data && response.data.data) {
    return response.data.data
  }
  return response.data as unknown as RecentOrdersData
}
