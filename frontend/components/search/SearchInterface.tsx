'use client'

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useSearch } from '@/hooks/useSearch';
import { Loader2, Search as SearchIcon } from 'lucide-react';

export function SearchInterface() {
  const { isLoading, fetchResults } = useSearch();
  const [query, setQuery] = useState('software engineer in London');
  const [category, setCategory] = useState('linkedin profile');
  const [limit, setLimit] = useState(10);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim()) return;
    fetchResults({
      query: query.trim(),
      category: category as any,
      limit,
    });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>AI Network Search</CardTitle>
        <CardDescription>
          Semantically search for LinkedIn profiles, companies, and jobs.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSearch} className="space-y-6"> {/* Increased space-y-6 for more vertical breathing room */}
          <div className="relative">
            <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
            <Input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="e.g., Senior AI engineers at Google in SF with AI experience"
              className="pl-10"
            />
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6"> {/* Stacks vertically by default, side-by-side on large screens; increased gap-6 */}
            <div className="space-y-2">
              <Label className="mb-2">Category</Label> {/* Added mb-2 for more space under label */}
              <Select value={category} onValueChange={setCategory}>
                <SelectTrigger className="w-full px-4 py-2"> {/* Added w-full and extra padding for more space */}
                  <SelectValue placeholder="Select a category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="linkedin profile">LinkedIn Profiles</SelectItem>
                  <SelectItem value="company">Companies</SelectItem>
                  <SelectItem value="job offers">Job Offers</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label className="mb-2">Results Limit</Label> {/* Added mb-2 for more space under label */}
              <Select value={String(limit)} onValueChange={(val) => setLimit(Number(val))}>
                <SelectTrigger className="w-full px-4 py-2"> {/* Added w-full and extra padding for more space */}
                  <SelectValue placeholder="Select a limit" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="5">5</SelectItem>
                  <SelectItem value="10">10</SelectItem>
                  <SelectItem value="20">20</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <Button type="submit" disabled={isLoading || !query.trim()} className="w-full">
            {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            {isLoading ? 'Searching...' : 'Search'}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}