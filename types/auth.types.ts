/**
 * Authentication Types
 * Central location for all auth-related type definitions
 */

export interface User {
  id?: string | number
  name: string
  email: string
  avatar?: string
  role?: string
}

export interface LoginCredentials {
  email: string
  password: string
  remember?: boolean
}

export interface SignupCredentials {
  name: string
  email: string
  password: string
  confirmPassword: string
  terms: boolean
}

export interface AuthResponse {
  token?: string
  user: User
  success?: boolean
}

export interface AuthError {
  email?: string
  password?: string
  name?: string
  confirmPassword?: string
  terms?: string
}

export type AuthTab = 'login' | 'signup'
