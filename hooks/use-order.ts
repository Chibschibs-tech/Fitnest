/**
 * Order Hook
 * Manages order creation state and delegates API calls to order service
 */

"use client"

import { useState, useCallback } from 'react'
import { createOrder } from '@/services/order.service'
import type { CreateOrderPayload } from '@/types/order.types'

export interface CreateOrderResult {
  success: boolean
  error?: string
  data?: Record<string, unknown>
}

interface UseOrderReturn {
  createOrder: (payload: CreateOrderPayload) => Promise<CreateOrderResult>
  isSubmitting: boolean
  error: string | null
  resetError: () => void
}

export function useOrder(): UseOrderReturn {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const resetError = useCallback(() => {
    setError(null)
  }, [])

  const submitOrder = useCallback(async (payload: CreateOrderPayload): Promise<CreateOrderResult> => {
    setIsSubmitting(true)
    setError(null)

    try {
      const data = await createOrder(payload)
      return { success: true, data: data as Record<string, unknown> }
    } catch (err: unknown) {
      const message =
        err && typeof err === 'object' && 'message' in err
          ? String((err as { message: string }).message)
          : 'Une erreur est survenue. Réessayez.'
      setError(message)
      return { success: false, error: message }
    } finally {
      setIsSubmitting(false)
    }
  }, [])

  return {
    createOrder: submitOrder,
    isSubmitting,
    error,
    resetError,
  }
}
