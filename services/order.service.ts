/**
 * Order Service
 * Handles order API calls. Matches Laravel backend contract exactly.
 * Uses Next.js /api/orders proxy (same-origin) to avoid CORS.
 */

import { getAuthToken } from '@/services/auth.service'
import type { CreateOrderPayload, OrderResponse } from '@/types/order.types'

/**
 * Create order - POST /api/orders (proxied to Laravel)
 * Payload matches Laravel: contact_name, contact_email, contact_phone,
 * total_price, delivery_address, products.
 */
export async function createOrder(payload: CreateOrderPayload): Promise<OrderResponse> {
  const token = getAuthToken()
  const headers: Record<string, string> = {
    Accept: 'application/json',
    'Content-Type': 'application/json',
  }
  if (token) {
    headers.Authorization = `Bearer ${token}`
  }

  const res = await fetch('/api/orders', {
    method: 'POST',
    headers,
    body: JSON.stringify(payload),
  })

  const data = (await res.json().catch(() => ({}))) as Record<string, unknown>
  if (!res.ok) {
    const msg = (data?.message as string) || (data?.error as string) || 'Échec de la création de la commande'
    throw new Error(msg)
  }
  return data as OrderResponse
}
