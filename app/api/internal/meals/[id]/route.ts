import { NextRequest, NextResponse } from "next/server"

const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL || 'https://api.fitness.ma/api'

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    
    const response = await fetch(`${API_BASE}/meals/${id}`, {
      headers: {
        'Accept': 'application/json',
      },
      cache: 'no-store',
    })

    if (!response.ok) {
      const errorText = await response.text()
      console.error(`External API error for meal ${id}:`, response.status, errorText)
      return NextResponse.json(
        { error: `Failed to fetch meal: ${response.status}` },
        { status: response.status }
      )
    }

    const data = await response.json()
    
    return NextResponse.json(data)
  } catch (error) {
    console.error('Error fetching meal:', error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to fetch meal' },
      { status: 500 }
    )
  }
}

