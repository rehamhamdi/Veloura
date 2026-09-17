import api from './api'
import type { AdminOrder, AdminOrdersResponse } from '../types/adminOrders'

export async function getAdminOrders(page = 1, pageSize = 15) {
  const response = await api.get<AdminOrdersResponse>('/admin/orders', {
    params: { pageNumber: page, pageSize },
  })

  return response.data
}

export async function getAdminOrder(orderId: string | number) {
  const response = await api.get<{ data: AdminOrder }>(`/admin/orders/${orderId}`)
  return response.data.data
}

export async function updateAdminOrderStatus(orderId: string | number, status: string) {
  const response = await api.put<{ data?: AdminOrder }>(`/admin/orders/${orderId}/status`, { status })
  return response.data.data
}