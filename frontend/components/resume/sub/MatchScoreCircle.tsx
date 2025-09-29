// frontend/components/resume/sub/MatchScoreCircle.tsx
'use client';

interface MatchScoreCircleProps {
  score: number;
  className?: string;
}

export function MatchScoreCircle({ score, className }: MatchScoreCircleProps) {
  const radius = 50;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (score / 100) * circumference;

  const getScoreColor = () => {
    if (score < 50) return 'stroke-destructive'; // Red
    if (score < 75) return 'stroke-yellow-500'; // Yellow
    return 'stroke-green-500'; // Green
  };

  return (
    <div className={`relative flex items-center justify-center ${className}`}>
      <svg className="transform -rotate-90" width="120" height="120" viewBox="0 0 120 120">
        {/* Background Circle */}
        <circle
          className="stroke-muted/30"
          strokeWidth="8"
          fill="transparent"
          r={radius}
          cx="60"
          cy="60"
        />
        {/* Progress Circle */}
        <circle
          className={`${getScoreColor()} transition-all duration-1000 ease-out`}
          strokeWidth="8"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          strokeLinecap="round"
          fill="transparent"
          r={radius}
          cx="60"
          cy="60"
        />
      </svg>
      <div className="absolute flex flex-col items-center justify-center">
        <span className="text-3xl font-bold">{score}%</span>
        <span className="text-xs font-medium text-muted-foreground">Match</span>
      </div>
    </div>
  );
}