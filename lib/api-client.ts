/**
 * API Client Utility
 * Handles authenticated requests to Laravel backend
 */

const API_URL = process.env.NEXT_PUBLIC_API_BASE_URL

/**
 * Get auth token from localStorage
 */
export function getAuthToken(): string | null {
  if (typeof window === 'undefined') return null
  return localStorage.getItem('authToken')
}

/**
 * Make an authenticated API request
 */
export async function apiRequest(
  endpoint: string,
  options: RequestInit = {}
) {
  const token = getAuthToken()
  
  const headers: HeadersInit = {
    'Content-Type': 'application/json',
    ...options.headers,
  }

  // Add Authorization header if token exists
  if (token) {
    (headers as Record<string, string>)['Authorization'] = `Bearer ${token}`
  }

  const url = endpoint.startsWith('http') ? endpoint : `${API_URL}${endpoint}`

  const response = await fetch(url, {
    ...options,
    headers,
  })

  return response
}

/**
 * Helper methods for common HTTP methods
 */
export const api = {
  get: (endpoint: string, options?: RequestInit) =>
    apiRequest(endpoint, { ...options, method: 'GET' }),

  post: (endpoint: string, data?: any, options?: RequestInit) =>
    apiRequest(endpoint, {
      ...options,
      method: 'POST',
      body: data ? JSON.stringify(data) : undefined,
    }),

  put: (endpoint: string, data?: any, options?: RequestInit) =>
    apiRequest(endpoint, {
      ...options,
      method: 'PUT',
      body: data ? JSON.stringify(data) : undefined,
    }),

  patch: (endpoint: string, data?: any, options?: RequestInit) =>
    apiRequest(endpoint, {
      ...options,
      method: 'PATCH',
      body: data ? JSON.stringify(data) : undefined,
    }),

  delete: (endpoint: string, options?: RequestInit) =>
    apiRequest(endpoint, { ...options, method: 'DELETE' }),
}

/**
 * Example usage:
 * 
 * // GET request
 * const response = await api.get('/user/profile')
 * const data = await response.json()
 * 
 * // POST request
 * const response = await api.post('/orders', { meal_plan_id: 1 })
 * const data = await response.json()
 * 
 * // With error handling
 * try {
 *   const response = await api.get('/protected-route')
 *   if (!response.ok) {
 *     throw new Error('Request failed')
 *   }
 *   const data = await response.json()
 * } catch (error) {
 *   console.error('API Error:', error)
 * }
 */
