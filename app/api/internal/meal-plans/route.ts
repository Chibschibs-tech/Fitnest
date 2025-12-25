import { NextResponse } from "next/server"

const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL || 'https://api.fitness.ma/api'

export async function GET() {
  try {
    const response = await fetch(`${API_BASE}/meal-plans?status=active`, {
      headers: {
        'Accept': 'application/json',
      },
      next: { revalidate: 3600 },
    })

    if (!response.ok) {
      throw new Error(`API request failed: ${response.status}`)
    }

    const data = await response.json()
    
    return NextResponse.json(data)
  } catch (error) {
    console.error('Error fetching meal plans:', error)
    return NextResponse.json(
      { error: 'Failed to fetch meal plans' },
      { status: 500 }
    )
  }
}

