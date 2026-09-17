import api from './api'

export type AdminOrder = {
  id?: string | number
  orderId?: string | number
  customerName?: string
  customer?: { name?: string; email?: string }
  createdAt?: string
  date?: string
  total?: number
  totalAmount?: number
  status?: string
  items?: AdminOrderItem[]
  shippingAddress?: string
  address?: string
  paymentMethod?: string
}

export type AdminOrderItem = {
  id?: string | number
  productName?: string
  name?: string
  quantity?: number
  unitPrice?: number
  price?: number
  total?: number
  imageUrl?: string
}

export type AdminOrdersResponse = {
  statusCode: number
  succeeded: boolean
  message: string
  errors: string[] | null
  data: {
    items: AdminOrder[]
    totalCount: number
    currentPage: number
    totalPages: number
    pageSize: number
  }
}

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