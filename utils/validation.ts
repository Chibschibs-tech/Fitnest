/**
 * Validation Utilities
 * Reusable validation functions
 */

import { VALIDATION_RULES } from '@/constants/validation'

export const validateEmail = (email: string): boolean => {
  return VALIDATION_RULES.EMAIL_REGEX.test(email)
}

export const validatePassword = (password: string): boolean => {
  return password.length >= VALIDATION_RULES.PASSWORD_MIN_LENGTH
}

export const validateName = (name: string): boolean => {
  return name.length >= VALIDATION_RULES.NAME_MIN_LENGTH
}

export const getPasswordStrength = (password: string): 'weak' | 'medium' | 'strong' => {
  const length = password.length
  
  if (length < 8) return 'weak'
  if (length < 12) return 'medium'
  return 'strong'
}

export const getPasswordStrengthWidth = (password: string): string => {
  const strength = getPasswordStrength(password)
  
  switch (strength) {
    case 'weak': return 'w-1/3'
    case 'medium': return 'w-2/3'
    case 'strong': return 'w-full'
  }
}

export const getPasswordStrengthColor = (password: string): string => {
  const strength = getPasswordStrength(password)
  
  switch (strength) {
    case 'weak': return 'bg-red-500'
    case 'medium': return 'bg-yellow-500'
    case 'strong': return 'bg-green-500'
  }
}

export const getPasswordStrengthLabel = (password: string): string => {
  const strength = getPasswordStrength(password)
  
  switch (strength) {
    case 'weak': return 'Faible'
    case 'medium': return 'Moyen'
    case 'strong': return 'Fort'
  }
}
