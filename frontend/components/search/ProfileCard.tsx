'use client'

import { useState } from 'react';
import { ExternalLink, MapPin, Building, User } from 'lucide-react';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { PersonResult } from '@/types/search';
import { SkillBadge } from './SkillBadge';
import { cn } from '@/lib/utils';

interface ProfileCardProps {
  profile: PersonResult;
  onViewDetails?: (profile: PersonResult) => void;
  className?: string;
}

export function ProfileCard({ profile, onViewDetails, className }: ProfileCardProps) {
  const [imageError, setImageError] = useState(false);
  
  const {
    id,
    url,
    title,
    author,
    location,
    summary,
    image,
    work_experience,
    education,
    skills
  } = profile;

  // Get the most recent work experience
  const currentJob = work_experience?.[0];
  
  // Get user initials for avatar fallback
  const initials = author
    ?.split(' ')
    .map(name => name.charAt(0))
    .join('')
    .toUpperCase() || 'U';

  // Truncate summary if too long
  const truncatedSummary = summary && summary.length > 150 
    ? summary.substring(0, 150) + '...' 
    : summary;

  // Show max 4 skills, with +X indicator for remaining
  const displaySkills = skills?.slice(0, 4) || [];
  const remainingSkillsCount = Math.max(0, (skills?.length || 0) - 4);

  return (
    <Card className={cn(
      'group hover:shadow-lg transition-all duration-300',
      'hover:border-primary/20 cursor-pointer',
      'h-full flex flex-col',
      className
    )}>
      <CardHeader className="pb-3">
        <div className="flex items-start gap-3">
          <Avatar className="h-12 w-12 flex-shrink-0">
            {image && !imageError ? (
              <AvatarImage 
                src={image} 
                alt={author || 'Profile'} 
                onError={() => setImageError(true)}
              />
            ) : (
              <AvatarFallback className="bg-primary/10 text-primary font-medium">
                {initials}
              </AvatarFallback>
            )}
          </Avatar>
          
          <div className="flex-1 min-w-0 space-y-1">
            <h3 className="font-semibold text-sm leading-tight line-clamp-2">
              {title || author || 'Untitled Profile'}
            </h3>
            
            {author && title && (
              <p className="text-sm text-muted-foreground line-clamp-1">
                {author}
              </p>
            )}
            
            {currentJob && (
              <div className="flex items-center gap-1 text-xs text-muted-foreground">
                <Building className="h-3 w-3 flex-shrink-0" />
                <span className="line-clamp-1">
                  {currentJob.title} {currentJob.company && `at ${currentJob.company}`}
                </span>
              </div>
            )}
            
            {location && (
              <div className="flex items-center gap-1 text-xs text-muted-foreground">
                <MapPin className="h-3 w-3 flex-shrink-0" />
                <span className="line-clamp-1">{location}</span>
              </div>
            )}
          </div>
        </div>
      </CardHeader>

      <CardContent className="pt-0 flex-1 flex flex-col">
        {/* Summary */}
        {truncatedSummary && (
          <p className="text-sm text-muted-foreground leading-relaxed mb-4 flex-1">
            {truncatedSummary}
          </p>
        )}

        {/* Skills */}
        {displaySkills.length > 0 && (
          <div className="flex flex-wrap gap-1 mb-4">
            {displaySkills.map((skill, index) => (
              <SkillBadge key={index} skill={skill} />
            ))}
            {remainingSkillsCount > 0 && (
              <Badge variant="outline" className="text-xs">
                +{remainingSkillsCount}
              </Badge>
            )}
          </div>
        )}

        {/* Actions */}
        <div className="flex items-center justify-between pt-2 mt-auto border-t">
          <div className="flex items-center gap-2">
            {education?.[0] && (
              <Badge variant="outline" className="text-xs">
                {education[0].institution}
              </Badge>
            )}
          </div>
          
          <div className="flex items-center gap-2">
            {onViewDetails && (
              <Button
                variant="ghost"
                size="sm"
                onClick={(e) => {
                  e.preventDefault();
                  onViewDetails(profile);
                }}
                className="h-7 px-2 text-xs"
              >
                Details
              </Button>
            )}
            
            <Button
              variant="outline"
              size="sm"
              asChild
              className="h-7 px-2 text-xs"
            >
              <a 
                href={url} 
                target="_blank" 
                rel="noopener noreferrer"
                className="flex items-center gap-1"
              >
                View
                <ExternalLink className="h-3 w-3" />
              </a>
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}