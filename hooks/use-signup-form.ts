/**
 * Signup Form Hook
 * Manages signup form state and validation
 */

import { useState } from 'react'
import type { SignupCredentials, AuthError } from '@/types/auth.types'
import { validateEmail, validatePassword, validateName } from '@/utils/validation'
import { ERROR_MESSAGES } from '@/constants/validation'
import { signup, storeAuthToken, extractUserData } from '@/services/auth.service'

interface UseSignupFormProps {
  onSuccess?: (user: any) => void
  onClose?: () => void
}

export function useSignupForm({ onSuccess, onClose }: UseSignupFormProps = {}) {
  const [form, setForm] = useState<SignupCredentials>({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    terms: false,
  })
  const [errors, setErrors] = useState<AuthError>({})
  const [isLoading, setIsLoading] = useState(false)

  const updateField = (field: keyof SignupCredentials, value: any) => {
    setForm(prev => ({ ...prev, [field]: value }))
    // Clear error when user starts typing
    if (errors[field as keyof AuthError]) {
      setErrors(prev => ({ ...prev, [field]: undefined }))
    }
  }

  const validate = (): boolean => {
    const newErrors: AuthError = {}

    if (!form.name) {
      newErrors.name = ERROR_MESSAGES.NAME_REQUIRED
    } else if (!validateName(form.name)) {
      newErrors.name = ERROR_MESSAGES.NAME_MIN_LENGTH
    }

    if (!form.email) {
      newErrors.email = ERROR_MESSAGES.EMAIL_REQUIRED
    } else if (!validateEmail(form.email)) {
      newErrors.email = ERROR_MESSAGES.EMAIL_INVALID
    }

    if (!form.password) {
      newErrors.password = ERROR_MESSAGES.PASSWORD_REQUIRED
    } else if (!validatePassword(form.password)) {
      newErrors.password = ERROR_MESSAGES.PASSWORD_MIN_LENGTH
    }

    if (!form.confirmPassword) {
      newErrors.confirmPassword = ERROR_MESSAGES.PASSWORD_CONFIRM_REQUIRED
    } else if (form.password !== form.confirmPassword) {
      newErrors.confirmPassword = ERROR_MESSAGES.PASSWORD_MISMATCH
    }

    if (!form.terms) {
      newErrors.terms = ERROR_MESSAGES.TERMS_REQUIRED
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!validate()) return

    setIsLoading(true)

    try {
      const { confirmPassword, terms, ...credentials } = form
      const data = await signup(credentials)

      // Store token
      if (data.token) {
        storeAuthToken(data.token)
      }

      // Extract and return user data
      const userData = extractUserData(data, form.email)
      console.log('✅ Signup successful, user:', userData)

      // Reset form
      setForm({
        name: '',
        email: '',
        password: '',
        confirmPassword: '',
        terms: false,
      })
      setErrors({})

      // Call success callback
      onSuccess?.(userData)
      onClose?.()
    } catch (error: any) {
      console.error('Signup error:', error)

      if (error.status === 409) {
        setErrors({ email: ERROR_MESSAGES.EMAIL_EXISTS })
      } else if (error.message) {
        setErrors({ email: error.message })
      } else {
        setErrors({ email: ERROR_MESSAGES.SIGNUP_ERROR })
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
