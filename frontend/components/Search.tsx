'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { apiCall } from '@/lib/api-client'

interface SearchResult {
  id: string
  url: string
  title: string
  author: string
  location?: string
  summary?: string
}

interface SearchResponse {
  results: SearchResult[]
}

export function SearchTest() {
  const [query, setQuery] = useState('software engineers in Berlin')
  const [loading, setLoading] = useState(false)
  const [results, setResults] = useState<SearchResult[]>([])
  const [error, setError] = useState<string>('')

  const handleSearch = async () => {
    if (!query.trim()) return

    setLoading(true)
    setError('')
    setResults([])

    try {
      const response = await apiCall<SearchResponse>('/search/linkedin', {
        method: 'POST',
        body: JSON.stringify({
          query: query.trim(),
          category: 'linkedin profile',
          limit: 5
        })
      })

      setResults(response.results || [])
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Search failed')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>LinkedIn Search Test</CardTitle>
          <CardDescription>
            Test the authenticated search API integration
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="search-query">Search Query</Label>
            <Input
              id="search-query"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="e.g., software engineers in Berlin"
            />
          </div>
          
          <Button 
            onClick={handleSearch} 
            disabled={loading || !query.trim()}
            className="w-full"
          >
            {loading ? 'Searching...' : 'Search LinkedIn'}
          </Button>

          {error && (
            <div className="p-4 bg-red-50 border border-red-200 rounded-md">
              <p className="text-red-700 text-sm">{error}</p>
            </div>
          )}
        </CardContent>
      </Card>

      {results.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Search Results ({results.length})</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {results.map((result, index) => (
                <div 
                  key={result.id || index} 
                  className="p-4 border rounded-lg hover:bg-gray-50"
                >
                  <h3 className="font-semibold text-blue-600">
                    <a 
                      href={result.url} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="hover:underline"
                    >
                      {result.title}
                    </a>
                  </h3>
                  <p className="text-sm text-gray-600 mt-1">
                    By: {result.author}
                    {result.location && ` • ${result.location}`}
                  </p>
                  {result.summary && (
                    <p className="text-sm text-gray-700 mt-2 line-clamp-3">
                      {result.summary}
                    </p>
                  )}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}