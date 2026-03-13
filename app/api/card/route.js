import { NextResponse } from 'next/server'

const BACKEND_URL = process.env.BACKEND_URL || 'http://localhost:5000'

export async function GET(request) {
  const { searchParams } = new URL(request.url)
  const cardNumber = searchParams.get('bin') || searchParams.get('cardNumber')
  
  if (!cardNumber || cardNumber.length !== 6) {
    return NextResponse.json(
      { error: 'Please provide exactly 6 digits (BIN/IIN)' },
      { status: 400 }
    )
  }
  
  try {
    // Call Python backend API
    const response = await fetch(`${BACKEND_URL}/api/card/${cardNumber}`, {
      method: 'GET',
      headers: {
        'Accept': 'application/json'
      }
    })
    
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}))
      return NextResponse.json(
        { error: errorData.error || `Backend API Error: ${response.status}` },
        { status: response.status }
      )
    }
    
    const data = await response.json()
    
    // Backend already formats the data, just return it
    return NextResponse.json(data)
    
  } catch (error) {
    console.error('Server Error:', error)
    return NextResponse.json(
      { error: 'Failed to connect to backend server', message: error.message },
      { status: 500 }
    )
  }
}
