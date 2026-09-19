import api from './api'
import type {
  ApiProduct,
  ApiProductResponse,
  ProductPayload,
  SingleProductResponse,
} from '../types/adminProducts'

export async function getAdminProducts(): Promise<ApiProduct[]> {
  const response = await api.get<ApiProductResponse | ApiProduct[]>('/Product')
  if (Array.isArray(response.data)) {
    return response.data
  }
  return response.data?.data ?? []
}

export async function getAdminProduct(id: number | string): Promise<ApiProduct> {
  const response = await api.get<SingleProductResponse | ApiProduct>(`/Product/${id}`)
  if (response.data && typeof response.data === 'object' && 'data' in response.data && response.data.data) {
    return response.data.data
  }
  return response.data as ApiProduct
}

export async function createAdminProduct(payload: ProductPayload): Promise<ApiProduct> {
  const response = await api.post<SingleProductResponse | ApiProduct>('/Product', {
    product: payload,
  })
  if (response.data && typeof response.data === 'object' && 'data' in response.data && response.data.data) {
    return response.data.data
  }
  return response.data as ApiProduct
}

export async function updateAdminProduct(id: number, payload: ProductPayload): Promise<ApiProduct> {
  const response = await api.put<SingleProductResponse | ApiProduct>(`/Product/${id}`, {
    id,
    product: payload,
  })
  if (response.data && typeof response.data === 'object' && 'data' in response.data && response.data.data) {
    return response.data.data
  }
  return response.data as ApiProduct
}

export async function deleteAdminProduct(id: number | string): Promise<void> {
  await api.delete(`/Product/${id}`)
}