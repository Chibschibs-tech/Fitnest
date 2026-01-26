import { NextResponse } from 'next/server'

const API_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:8000/api'

export async function GET(request: Request) {
  try {
    // Get the auth token from the request headers or from the Authorization header
    const authHeader = request.headers.get('Authorization')
    const token = authHeader?.replace('Bearer ', '') || request.headers.get('Cookie')?.split('authToken=')[1]?.split(';')[0]

    // Try to get from cookie if not in header
    if (!token) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      )
    }

    // Fetch orders from the backend API
    const response = await fetch(`${API_URL}/orders`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Accept': 'application/json',
      },
    })

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({ error: 'Failed to fetch orders' }))
      return NextResponse.json(
        errorData,
        { status: response.status }
      )
    }

    const data = await response.json()
    return NextResponse.json(data)
  } catch (error) {
    console.error('Error fetching orders:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
