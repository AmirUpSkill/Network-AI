'use client'

import { useState, useEffect } from 'react';
import { X, ExternalLink, MapPin, Building, GraduationCap } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { PersonResult } from '@/types/search';
import { SkillBadge } from './SkillBadge';

interface ProfileDetailModalProps {
  profile: PersonResult;
  onClose: () => void;
}

export function ProfileDetailModal({ profile, onClose }: ProfileDetailModalProps) {
  const [imageError, setImageError] = useState(false);

  // Handle escape key
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleEscape);
    return () => window.removeEventListener('keydown', handleEscape);
  }, [onClose]);

  const initials = profile.author
    ?.split(' ')
    .map(name => name.charAt(0))
    .join('')
    .toUpperCase() || 'U';

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
      <Card className="w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <CardHeader className="flex flex-row items-start justify-between space-y-0 pb-4">
          <div className="flex items-start gap-4">
            <Avatar className="h-16 w-16">
              {profile.image && !imageError ? (
                <AvatarImage 
                  src={profile.image} 
                  alt={profile.author || 'Profile'} 
                  onError={() => setImageError(true)}
                />
              ) : (
                <AvatarFallback className="bg-primary/10 text-primary font-medium text-lg">
                  {initials}
                </AvatarFallback>
              )}
            </Avatar>
            <div className="space-y-1">
              <h2 className="text-xl font-semibold">
                {profile.title || profile.author || 'Untitled Profile'}
              </h2>
              {profile.author && profile.title && (
                <p className="text-muted-foreground">{profile.author}</p>
              )}
              {profile.location && (
                <div className="flex items-center gap-1 text-sm text-muted-foreground">
                  <MapPin className="h-4 w-4" />
                  <span>{profile.location}</span>
                </div>
              )}
            </div>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={onClose}
            className="h-8 w-8 p-0"
          >
            <X className="h-4 w-4" />
          </Button>
        </CardHeader>

        <CardContent className="space-y-6">
          {/* Summary */}
          {profile.summary && (
            <div>
              <h3 className="font-semibold mb-2">About</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                {profile.summary}
              </p>
            </div>
          )}

          {/* Work Experience */}
          {profile.work_experience && profile.work_experience.length > 0 && (
            <div>
              <h3 className="font-semibold mb-3">Work Experience</h3>
              <div className="space-y-3">
                {profile.work_experience.map((exp, index) => (
                  <div key={index} className="flex items-start gap-3 p-3 bg-muted/30 rounded-lg">
                    <Building className="h-4 w-4 mt-1 text-muted-foreground flex-shrink-0" />
                    <div className="space-y-1">
                      <p className="font-medium text-sm">
                        {exp.title} {exp.company && `at ${exp.company}`}
                      </p>
                      <p className="text-xs text-muted-foreground">{exp.duration}</p>
                      {exp.location && (
                        <p className="text-xs text-muted-foreground">{exp.location}</p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Education */}
          {profile.education && profile.education.length > 0 && (
            <div>
              <h3 className="font-semibold mb-3">Education</h3>
              <div className="space-y-3">
                {profile.education.map((edu, index) => (
                  <div key={index} className="flex items-start gap-3 p-3 bg-muted/30 rounded-lg">
                    <GraduationCap className="h-4 w-4 mt-1 text-muted-foreground flex-shrink-0" />
                    <div className="space-y-1">
                      <p className="font-medium text-sm">{edu.institution}</p>
                      <p className="text-xs text-muted-foreground">
                        {edu.degree} {edu.field_of_study && `in ${edu.field_of_study}`}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Skills */}
          {profile.skills && profile.skills.length > 0 && (
            <div>
              <h3 className="font-semibold mb-3">Skills</h3>
              <div className="flex flex-wrap gap-2">
                {profile.skills.map((skill, index) => (
                  <SkillBadge key={index} skill={skill} />
                ))}
              </div>
            </div>
          )}

          {/* Actions */}
          <div className="flex gap-3 pt-4 border-t">
            <Button asChild className="flex-1">
              <a 
                href={profile.url} 
                target="_blank" 
                rel="noopener noreferrer"
                className="flex items-center gap-2"
              >
                View LinkedIn Profile
                <ExternalLink className="h-4 w-4" />
              </a>
            </Button>
            <Button variant="outline" onClick={onClose}>
              Close
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}