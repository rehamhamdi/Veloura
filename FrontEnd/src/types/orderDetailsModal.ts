import type { AdminOrder } from './adminOrders'

export type OrderDetailsModalProps = {
  orderId: string | number
  onClose: () => void
  onUpdated: (order: AdminOrder) => void
}