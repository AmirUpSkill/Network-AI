import { SearchMetadata as SearchMetadataType } from '@/types/search'

interface SearchMetadataProps {
  metadata: SearchMetadataType | null
}

export function SearchMetadata({ metadata }: SearchMetadataProps) {
  if (!metadata) return null

  return (
    <div className="text-center text-sm text-muted-foreground">
      <p>
        Found {metadata.total_results} results in {metadata.search_time_ms}ms
      </p>
      {metadata.enhanced_query && (
        <p className="mt-1">
          <span className="font-semibold">Enhanced Query:</span> {metadata.enhanced_query}
        </p>
      )}
    </div>
  )
}