/**
 * Authentication Service
 * Handles all authentication-related API calls
 */

import type { LoginCredentials, SignupCredentials, AuthResponse, User } from '@/types/auth.types'

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api'

/**
 * Login user
 */
export async function login(credentials: LoginCredentials): Promise<AuthResponse> {
  const response = await fetch(`${API_URL}/login`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(credentials),
  })

  const data = await response.json()

  if (!response.ok) {
    throw {
      status: response.status,
      message: data.error || data.message || 'Login failed',
      data,
    }
  }

  return data
}

/**
 * Sign up new user
 */
export async function signup(credentials: Omit<SignupCredentials, 'confirmPassword' | 'terms'>): Promise<AuthResponse> {  
  const response = await fetch(`${API_URL}/register`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(credentials),
  })

  const data = await response.json()
  console.log('📥 Signup Response:', { status: response.status, data })

  if (!response.ok) {
    throw {
      status: response.status,
      message: data.error || data.message || 'Signup failed',
      data,
    }
  }

  return data
}

/**
 * Logout user
 */
export async function logout(): Promise<void> {
  const token = localStorage.getItem('authToken')
  
  if (!token) return

  try {
    await fetch(`${API_URL}/logout`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    })
  } catch (error) {
    console.error('Logout error:', error)
  }
}

/**
 * Store auth token
 */
export function storeAuthToken(token: string): void {
  localStorage.setItem('authToken', token)
  console.log('🔑 Token stored')
}

/**
 * Get auth token
 */
export function getAuthToken(): string | null {
  return localStorage.getItem('authToken')
}

/**
 * Clear auth token
 */
export function clearAuthToken(): void {
  localStorage.removeItem('authToken')
  localStorage.removeItem('user')
}

/**
 * Extract user data from API response
 */
export function extractUserData(data: any, fallbackEmail?: string): User {
  return {
    id: data.user?.id || data.id,
    name: data.user?.name || data.name || fallbackEmail?.split('@')[0] || 'User',
    email: data.user?.email || data.email || fallbackEmail || '',
    avatar: data.user?.avatar || data.avatar,
    role: data.user?.role || data.role,
  }
}
