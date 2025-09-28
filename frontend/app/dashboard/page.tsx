'use client'

import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { createClient } from '@/lib/supabase'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'

export default function DashboardPage() {
  const router = useRouter()
  const [user, setUser] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const supabase = createClient()

    const checkUser = async () => {
      const { data: { session } } = await supabase.auth.getSession()
      if (!session) {
        router.push('/auth')
        return
      }
      setUser(session.user)
      setLoading(false)
    }

    checkUser()
  }, [router])

  const handleSignOut = async () => {
    const supabase = createClient()
    await supabase.auth.signOut()
    router.push('/')
  }

  if (loading) {
    return (
      <div className="container flex min-h-[calc(100vh-4rem)] items-center justify-center">
        <div className="text-center">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent mx-auto mb-4"></div>
          <p>Loading...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="container py-8 px-4">
      <Card className="max-w-2xl mx-auto">
        <CardHeader>
          <CardTitle>Welcome to Your Dashboard!</CardTitle>
          <CardDescription>
            Authentication successful. You're now logged in.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="p-4 bg-muted rounded-lg">
            <p className="font-medium">User Details:</p>
            <p className="text-sm text-muted-foreground">Email: {user?.email}</p>
            <p className="text-sm text-muted-foreground">ID: {user?.id}</p>
            <p className="text-sm text-muted-foreground">Provider: Google</p>
          </div>

          <div className="space-y-2">
            <p className="font-medium">Next Steps:</p>
            <ul className="text-sm text-muted-foreground space-y-1">
              <li>• LinkedIn Search (Coming Soon)</li>
              <li>• Resume Analysis (Coming Soon)</li>
              <li>• AI-Powered Networking (Coming Soon)</li>
            </ul>
          </div>

          <Button onClick={handleSignOut} variant="outline" className="w-full">
            Sign Out
          </Button>
        </CardContent>
      </Card>
    </div>
  )
}