// frontend/components/resume/ScanningAnimation.tsx
import './ScanningAnimation.css';

export function ScanningAnimation() {
  return (
    <div className="relative w-full h-full bg-muted/30 rounded-lg overflow-hidden p-8">
      <div className="scanner-animation"></div>
      <div className="space-y-4 opacity-20">
        <div className="h-8 bg-muted rounded w-1/3"></div>
        <div className="h-4 bg-muted rounded w-full"></div>
        <div className="h-4 bg-muted rounded w-2/3"></div>
        <div className="h-4 bg-muted rounded w-3/4"></div>
      </div>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <p className="font-semibold text-lg">Analyzing your resume...</p>
        <p className="text-sm text-muted-foreground">This may take a moment.</p>
      </div>
    </div>
  );
}