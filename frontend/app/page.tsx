import { Button } from '@/components/ui/button'
import Link from 'next/link'

export default function HomePage() {
  return (
    <div className="container flex min-h-[calc(100vh-4rem)] flex-col items-center justify-center px-4 text-center">
      <h1 className="text-4xl font-bold tracking-tight sm:text-5xl md:text-6xl">
        Google for LinkedIn Networking
      </h1>
      <p className="mt-6 max-w-2xl text-lg text-muted-foreground">
        Find the right people, companies, and jobs on LinkedIn — powered by AI.
        Tailor your resume, connect smarter, and land your first job.
      </p>
      <div className="mt-8 flex gap-4">
        <Button asChild size="lg">
          <Link href="/auth">Get Started</Link>
        </Button>
        <Button variant="outline" size="lg" asChild>
          <Link href="#demo">View Demo</Link>
        </Button>
      </div>
    </div>
  )
}