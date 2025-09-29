'use client'

import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { 
  Search, 
  FileText, 
  Brain, 
  Zap, 
  Users, 
  Target,
  ArrowRight,
  CheckCircle
} from 'lucide-react'

export default function HomePage() {
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative py-20 px-4 text-center">
        <div className="max-w-4xl mx-auto space-y-8">
          <Badge variant="outline" className="px-4 py-2">
            <Brain className="h-4 w-4 mr-2" />
            AI-Powered Networking Platform
          </Badge>
          
          <div className="space-y-6">
            <h1 className="text-5xl md:text-6xl font-bold bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">
              Network AI
            </h1>
            <p className="text-xl md:text-2xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
              AI-powered LinkedIn networking app that semantically searches profiles, companies, 
              and jobs while analyzing resumes against opportunities for fresh graduates.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button asChild size="lg" className="px-8 py-3 text-lg">
              <Link href="/auth">
                Get Started
                <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            </Button>
            <Button variant="outline" size="lg" className="px-8 py-3 text-lg">
              View Demo
            </Button>
          </div>
        </div>
      </section>

      {/* Demo Section */}
      <section className="py-16 px-4 bg-muted/30">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              See Network AI in Action
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Watch how our AI-powered tools help you find the perfect connections and opportunities
            </p>
          </div>

          {/* Demo Thumbnail */}
          <div className="max-w-4xl mx-auto">
            <div className="relative group cursor-pointer">
              <div className="aspect-video bg-black rounded-xl border border-gray-200 dark:border-gray-700 flex items-center justify-center overflow-hidden">
                {/* Placeholder content */}
                <div className="text-center space-y-4">
                  <div className="w-20 h-20 mx-auto bg-white/10 rounded-full flex items-center justify-center backdrop-blur-sm">
                    <svg className="h-10 w-10 text-white ml-1" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <div className="text-white">
                    <h3 className="text-lg font-semibold mb-2">Interactive Demo</h3>
                    <p className="text-gray-300 text-sm">Coming Soon</p>
                  </div>
                </div>
                
                {/* Hover overlay */}
                <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-xl" />
              </div>
              
              {/* Play button overlay */}
              <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <div className="w-20 h-20 bg-white/90 rounded-full flex items-center justify-center shadow-lg">
                  <svg className="h-8 w-8 text-gray-900 ml-1" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clipRule="evenodd" />
                  </svg>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-16 px-4">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              How Network AI Works
            </h2>
            <p className="text-xl text-muted-foreground">
              Three simple steps to supercharge your job search
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center space-y-4">
              <div className="w-16 h-16 mx-auto bg-primary/10 rounded-full flex items-center justify-center">
                <Users className="h-8 w-8 text-primary" />
              </div>
              <h3 className="text-xl font-semibold">1. Search & Discover</h3>
              <p className="text-muted-foreground">
                Use natural language to find relevant profiles, companies, and opportunities 
                that match your interests and skills.
              </p>
            </div>

            <div className="text-center space-y-4">
              <div className="w-16 h-16 mx-auto bg-primary/10 rounded-full flex items-center justify-center">
                <Target className="h-8 w-8 text-primary" />
              </div>
              <h3 className="text-xl font-semibold">2. Analyze & Optimize</h3>
              <p className="text-muted-foreground">
                Upload your resume and get detailed analysis against job requirements. 
                Receive personalized improvement recommendations.
              </p>
            </div>

            <div className="text-center space-y-4">
              <div className="w-16 h-16 mx-auto bg-primary/10 rounded-full flex items-center justify-center">
                <Zap className="h-8 w-8 text-primary" />
              </div>
              <h3 className="text-xl font-semibold">3. Connect & Apply</h3>
              <p className="text-muted-foreground">
                Use insights to craft better applications and make meaningful connections 
                that lead to job opportunities.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 px-4 bg-primary/5">
        <div className="max-w-2xl mx-auto text-center space-y-6">
          <h2 className="text-3xl md:text-4xl font-bold">
            Ready to accelerate your career?
          </h2>
          <p className="text-xl text-muted-foreground">
            Join thousands of job seekers who are using AI to land their dream jobs faster.
          </p>
          <Button asChild size="lg" className="px-8 py-3 text-lg">
            <Link href="/auth">
              Start Your Journey
              <ArrowRight className="ml-2 h-5 w-5" />
            </Link>
          </Button>
        </div>
      </section>

      <footer className="py-12 px-4 border-t">
        <div className="max-w-4xl mx-auto text-center space-y-4">
          <div className="flex items-center justify-center gap-2">
            <Brain className="h-6 w-6 text-primary" />
            <span className="font-bold text-xl">Network AI</span>
          </div>
          <p className="text-muted-foreground">
            Powered by Exa AI, Gemini, and cutting-edge machine learning technology
          </p>
          <div className="flex justify-center gap-6 text-sm text-muted-foreground">
            <span>© 2025 Network AI</span>
            <span>•</span>
            <span>Built for job seekers</span>
            <span>•</span>
            <span>AI-powered networking</span>
          </div>
        </div>
      </footer>
    </div>
  )
}