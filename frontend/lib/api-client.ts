// frontend/lib/api-client.ts
import { createClient } from '@/lib/supabase'

export async function apiCall<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> {
  console.log('🔍 API Call Debug Info:')
  console.log('Endpoint:', endpoint)
  console.log('Base URL:', process.env.NEXT_PUBLIC_API_URL)
  
  const supabase = createClient()
  const { data: { session }, error: sessionError } = await supabase.auth.getSession()

  console.log('Session error:', sessionError)
  console.log('Session exists:', !!session)
  
  if (!session) {
    console.error('❌ No session found')
    throw new Error('Authentication required - please sign in again')
  }

  console.log('User ID:', session.user?.id)
  console.log('Access token (first 20 chars):', session.access_token?.substring(0, 20) + '...')
  
  // Check token expiration
  const tokenPayload = JSON.parse(atob(session.access_token.split('.')[1]))
  const tokenExp = new Date(tokenPayload.exp * 1000)
  const now = new Date()
  
  console.log('Token expires at:', tokenExp)
  console.log('Current time:', now)
  console.log('Token valid:', tokenExp > now)
  
  if (tokenExp <= now) {
    console.warn('⚠️ Token appears expired, attempting refresh...')
    const { data: { session: refreshedSession }, error: refreshError } = await supabase.auth.refreshSession()
    
    if (refreshError || !refreshedSession) {
      console.error('❌ Token refresh failed:', refreshError)
      throw new Error('Session expired - please sign in again')
    }
    
    console.log('✅ Token refreshed successfully')
    // Update session for the request
    session.access_token = refreshedSession.access_token
  }

  const fullUrl = `${process.env.NEXT_PUBLIC_API_URL}${endpoint}`
  console.log('Full request URL:', fullUrl)

  const requestOptions: RequestInit = {
    ...options,
    headers: {
      'Authorization': `Bearer ${session.access_token}`,
      'Content-Type': 'application/json',
      ...options.headers,
    },
  }

  console.log('Request headers:', {
    ...requestOptions.headers,
    'Authorization': `Bearer ${session.access_token.substring(0, 20)}...`
  })

  try {
    const res = await fetch(fullUrl, requestOptions)
    
    console.log('Response status:', res.status)
    console.log('Response headers:', Object.fromEntries(res.headers.entries()))

    if (!res.ok) {
      const errorText = await res.text()
      console.error('❌ Request failed:', {
        status: res.status,
        statusText: res.statusText,
        body: errorText
      })
      
      let errorMessage = `Request failed (${res.status})`
      try {
        const errorJson = JSON.parse(errorText)
        errorMessage = errorJson.detail || errorJson.message || errorMessage
      } catch {
        errorMessage = errorText || errorMessage
      }
      
      throw new Error(errorMessage)
    }

    const responseData = await res.json()
    console.log('✅ Request successful:', responseData)
    return responseData

  } catch (error) {
    console.error('❌ Network or parsing error:', error)
    throw error
  }
}

// Helper function to decode and inspect JWT
export function inspectToken(token: string) {
  try {
    const parts = token.split('.')
    const header = JSON.parse(atob(parts[0]))
    const payload = JSON.parse(atob(parts[1]))
    
    console.log('JWT Header:', header)
    console.log('JWT Payload:', {
      ...payload,
      exp: new Date(payload.exp * 1000),
      iat: new Date(payload.iat * 1000)
    })
    
    return { header, payload }
  } catch (error) {
    console.error('Failed to decode JWT:', error)
    return null
  }
}