'use client'

import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Search, FileText, ArrowRight, CheckCircle, Brain } from 'lucide-react';

export default function DashboardPage() {
  const router = useRouter();

  return (
    <div className="space-y-12 max-w-7xl mx-auto px-4 py-8">
      {/* Hero Section */}
      <section className="text-center space-y-8 py-12">
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-medium">
          <Brain className="h-4 w-4" />
          AI-Powered Dashboard
        </div>
        
        <div className="space-y-6">
          <h1 className="text-5xl md:text-6xl font-bold bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">
            Everything you need to land your dream job
          </h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
            Powerful AI tools designed specifically for fresh graduates and job seekers
          </p>
        </div>
      </section>

      {/* Feature Cards Section */}
      <section className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto">
        {/* LinkedIn Search Feature */}
        <Card className="group hover:shadow-xl transition-all duration-300 hover:border-primary/30 relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-muted/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
          
          <CardHeader className="relative pb-4">
            <div className="flex items-center gap-3 mb-2">
              <div className="p-3 bg-muted rounded-xl group-hover:scale-110 transition-transform">
                <Search className="h-7 w-7 text-muted-foreground" />
              </div>
              <div>
                <CardTitle className="text-2xl">Smart LinkedIn Search</CardTitle>
                <CardDescription className="text-base">AI-powered semantic search</CardDescription>
              </div>
            </div>
          </CardHeader>
          
          <CardContent className="relative space-y-6">
            <p className="text-muted-foreground leading-relaxed">
              Search LinkedIn profiles, companies, and job opportunities using natural language. 
              Our AI enhances your queries to find the most relevant results.
            </p>
            
            <ul className="space-y-3">
              <li className="flex items-center gap-3">
                <CheckCircle className="h-5 w-5 text-green-500 flex-shrink-0" />
                <span className="text-sm">Semantic profile matching</span>
              </li>
              <li className="flex items-center gap-3">
                <CheckCircle className="h-5 w-5 text-green-500 flex-shrink-0" />
                <span className="text-sm">Company and job discovery</span>
              </li>
              <li className="flex items-center gap-3">
                <CheckCircle className="h-5 w-5 text-green-500 flex-shrink-0" />
                <span className="text-sm">Advanced filtering options</span>
              </li>
            </ul>
            
            <Button 
              onClick={() => router.push('/dashboard/search')}
              className="w-full group/btn"
              size="lg"
            >
              Start Searching
              <ArrowRight className="ml-2 h-4 w-4 group-hover/btn:translate-x-1 transition-transform" />
            </Button>
          </CardContent>
        </Card>

        {/* Resume Analysis Feature */}
        <Card className="group hover:shadow-xl transition-all duration-300 hover:border-primary/30 relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-muted/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
          
          <CardHeader className="relative pb-4">
            <div className="flex items-center gap-3 mb-2">
              <div className="p-3 bg-muted rounded-xl group-hover:scale-110 transition-transform">
                <FileText className="h-7 w-7 text-muted-foreground" />
              </div>
              <div>
                <CardTitle className="text-2xl">Resume Analysis</CardTitle>
                <CardDescription className="text-base">Match your resume to any job</CardDescription>
              </div>
            </div>
          </CardHeader>
          
          <CardContent className="relative space-y-6">
            <p className="text-muted-foreground leading-relaxed">
              Upload your resume and get detailed analysis against job postings. 
              Receive actionable feedback to improve your application success rate.
            </p>
            
            <ul className="space-y-3">
              <li className="flex items-center gap-3">
                <CheckCircle className="h-5 w-5 text-green-500 flex-shrink-0" />
                <span className="text-sm">Compatibility scoring</span>
              </li>
              <li className="flex items-center gap-3">
                <CheckCircle className="h-5 w-5 text-green-500 flex-shrink-0" />
                <span className="text-sm">Keyword optimization</span>
              </li>
              <li className="flex items-center gap-3">
                <CheckCircle className="h-5 w-5 text-green-500 flex-shrink-0" />
                <span className="text-sm">Improvement suggestions</span>
              </li>
            </ul>
            
            <Button 
              onClick={() => router.push('/dashboard/resume')}
              className="w-full group/btn"
              size="lg"
            >
              Analyze Resume
              <ArrowRight className="ml-2 h-4 w-4 group-hover/btn:translate-x-1 transition-transform" />
            </Button>
          </CardContent>
        </Card>
      </section>

      {/* Footer */}
      <section className="text-center pt-8 pb-4">
        <p className="text-sm text-muted-foreground">
          Powered by Exa AI, Gemini, and cutting-edge machine learning technology
        </p>
      </section>
    </div>
  );
}