import api from './api'
import type { AdminContactMessage, AdminContactResponse } from '../types/adminContacts'

export async function getAdminContacts(): Promise<AdminContactMessage[]> {
  const response = await api.get<AdminContactResponse | AdminContactMessage[] | { data: AdminContactMessage[] }>('/admin/contact')
  if (Array.isArray(response.data)) {
    return response.data
  }
  if (response.data && 'data' in response.data && Array.isArray(response.data.data)) {
    return response.data.data
  }
  return []
}