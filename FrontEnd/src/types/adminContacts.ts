export type ContactMessageStatus = 'All messages' | 'Unread' | 'Read'

export interface AdminContactMessage {
  id: number
  name: string
  email: string
  message: string
  isRead?: boolean
  createdAt?: string
}

export interface AdminContactResponse {
  statusCode?: string
  succeeded?: boolean
  message?: string
  errors?: unknown
  data: AdminContactMessage[]
}