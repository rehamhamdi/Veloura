export type CustomerMessageStatus = 'New' | 'Read' | 'Replied'

export type AdminCustomerMessage = {
  id: number
  name: string
  email: string
  subject: string
  message: string
  date: string
  status: CustomerMessageStatus
}