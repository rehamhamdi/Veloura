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