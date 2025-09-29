import { createClient } from '@/lib/supabase'

export async function apiCall<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> {
  const supabase = createClient()
  const { data: { session }, error: sessionError } = await supabase.auth.getSession()

  if (!session) {
    throw new Error('Authentication required - please sign in again')
  }

  const tokenPayload = JSON.parse(atob(session.access_token.split('.')[1]))
  const tokenExp = new Date(tokenPayload.exp * 1000)
  const now = new Date()
  
  if (tokenExp <= now) {
    const { data: { session: refreshedSession }, error: refreshError } = await supabase.auth.refreshSession()
    
    if (refreshError || !refreshedSession) {
      throw new Error('Session expired - please sign in again')
    }
    
    session.access_token = refreshedSession.access_token
  }

  const fullUrl = `${process.env.NEXT_PUBLIC_API_URL}${endpoint}`

  const requestOptions: RequestInit = {
    ...options,
    headers: {
      'Authorization': `Bearer ${session.access_token}`,
      'Content-Type': 'application/json',
      ...options.headers,
    },
  }

  const res = await fetch(fullUrl, requestOptions)

  if (!res.ok) {
    const errorText = await res.text()
    
    let errorMessage = `Request failed (${res.status})`
    try {
      const errorJson = JSON.parse(errorText)
      errorMessage = errorJson.detail || errorJson.message || errorMessage
    } catch {
      errorMessage = errorText || errorMessage
    }
    
    throw new Error(errorMessage)
  }

  return await res.json()
}