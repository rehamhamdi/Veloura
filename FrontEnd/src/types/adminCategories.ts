export type CategoryStatus = 'Active' | 'Draft'

export type AdminCategory = {
  id: number
  name: string
  description: string
  productCount: number
  status: CategoryStatus
  image: string
}