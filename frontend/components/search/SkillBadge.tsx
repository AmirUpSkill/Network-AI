import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

interface SkillBadgeProps {
  skill: string;
  variant?: 'default' | 'secondary' | 'outline';
  className?: string;
}

export function SkillBadge({ skill, variant = 'secondary', className }: SkillBadgeProps) {
  return (
    <Badge 
      variant={variant} 
      className={cn(
        'text-xs font-medium px-2 py-1 rounded-full',
        'bg-blue-50 text-blue-700 border-blue-200',
        'dark:bg-blue-950 dark:text-blue-300 dark:border-blue-800',
        'hover:bg-blue-100 dark:hover:bg-blue-900 transition-colors',
        className
      )}
    >
      {skill}
    </Badge>
  );
}