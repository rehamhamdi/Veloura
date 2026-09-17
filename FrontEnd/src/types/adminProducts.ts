export type ProductStatus = 'Active' | 'Low stock' | 'Out of stock'

export type AdminProduct = {
  id: number
  name: string
  category: string
  price: string
  stock: number
  sold: number
  status: ProductStatus
  image: string
}