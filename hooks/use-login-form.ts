/**
 * Login Form Hook
 * Manages login form state and validation
 */

import { useState } from 'react'
import type { LoginCredentials, AuthError } from '@/types/auth.types'
import { validateEmail } from '@/utils/validation'
import { ERROR_MESSAGES } from '@/constants/validation'
import { login, storeAuthToken, extractUserData } from '@/services/auth.service'

interface UseLoginFormProps {
  onSuccess?: (user: any) => void
  onClose?: () => void
}

export function useLoginForm({ onSuccess, onClose }: UseLoginFormProps = {}) {
  const [form, setForm] = useState<LoginCredentials>({
    email: '',
    password: '',
    remember: false,
  })
  const [errors, setErrors] = useState<AuthError>({})
  const [isLoading, setIsLoading] = useState(false)

  const updateField = (field: keyof LoginCredentials, value: any) => {
    setForm(prev => ({ ...prev, [field]: value }))
    // Clear error when user starts typing
    if (errors[field as keyof AuthError]) {
      setErrors(prev => ({ ...prev, [field]: undefined }))
    }
  }

  const validate = (): boolean => {
    const newErrors: AuthError = {}

    if (!form.email) {
      newErrors.email = ERROR_MESSAGES.EMAIL_REQUIRED
    } else if (!validateEmail(form.email)) {
      newErrors.email = ERROR_MESSAGES.EMAIL_INVALID
    }

    if (!form.password) {
      newErrors.password = ERROR_MESSAGES.PASSWORD_REQUIRED
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!validate()) return

    setIsLoading(true)

    try {
      const data = await login(form)

      // Store token (Laravel may return token or access_token)
      const token = data.token ?? data.access_token
      if (token) {
        storeAuthToken(token)
      }

      // Extract and return user data
      const userData = extractUserData(data, form.email)
      console.log('✅ Login successful, user:', userData)

      // Reset form
      setForm({ email: '', password: '', remember: false })
      setErrors({})

      // Call success callback
      onSuccess?.(userData)
      onClose?.()
    } catch (error: any) {
      console.error('Login error:', error)

      if (error.status === 401) {
        setErrors({
          email: ERROR_MESSAGES.PASSWORD_INCORRECT,
          password: ERROR_MESSAGES.PASSWORD_INCORRECT,
        })
      } else if (error.message) {
        setErrors({ email: error.message })
      } else {
        setErrors({ email: ERROR_MESSAGES.NETWORK_ERROR })
      }
    } finally {
      setIsLoading(false)
    }
  }

  return {
    form,
    errors,
    isLoading,
    updateField,
    handleSubmit,
  }
}
