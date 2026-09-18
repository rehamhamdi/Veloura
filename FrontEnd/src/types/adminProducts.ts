export type ProductStatus = 'Active' | 'Low stock' | 'Out of stock'

export type ProductImage = {
  id?: number
  url: string
  sortOrder?: number
}

export type ApiProduct = {
  id: number
  title: string
  description: string
  price: number
  stock: number
  category: string
  images: ProductImage[]
}

export type ApiProductResponse = {
  statusCode: string
  succeeded: boolean
  message: string | null
  errors: unknown
  data: ApiProduct[]
}

export type SingleProductResponse = {
  statusCode: string
  succeeded: boolean
  message: string | null
  errors: unknown
  data: ApiProduct
}

export type ProductPayload = {
  title: string
  description: string
  price: number
  stock: number
  category: string
  images: ProductImage[]
}

export type CreateProductRequest = {
  product: ProductPayload
}

export type UpdateProductRequest = {
  id: number
  product: ProductPayload
}

export type AdminProduct = {
  id: number
  name: string
  title?: string
  description?: string
  category: string
  price: string
  rawPrice?: number
  stock: number
  sold?: number
  status: ProductStatus
  image: string
  images?: ProductImage[]
}