/**
 * Order Types
 * Defines the shape of order-related data for the Express Shop checkout flow
 */

export interface DeliveryAddress {
  street: string
  city: string
  state: string
  zip_code: string
  country: string
  additional_info: string
}

export interface CreateOrderProduct {
  product_id: string
  quantity: number
}

export interface CreateOrderPayload {
  contact_name: string
  contact_email: string
  contact_phone: string
  total_price: number
  delivery_address: DeliveryAddress
  products: CreateOrderProduct[]
}

export interface OrderResponse {
  id?: string
  order_id?: string
  success?: boolean
  message?: string
  [key: string]: unknown
}
