'use client'

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { 
  Search, 
  FileText, 
  ChevronLeft, 
  ChevronRight, 
  Home,
  History
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { cn } from '@/lib/utils';

interface NavItem {
  title: string;
  href: string;
  icon: React.ComponentType<{ className?: string }>;
  description: string;
}

const navItems: NavItem[] = [
  {
    title: 'Dashboard',
    href: '/dashboard',
    icon: Home,
    description: 'Overview and quick actions'
  },
  {
    title: 'LinkedIn Search',
    href: '/dashboard/search',
    icon: Search,
    description: 'AI-powered profile search'
  },
  {
    title: 'Resume Analysis',
    href: '/dashboard/resume',
    icon: FileText,
    description: 'Match resume to jobs'
  },
];

interface VerticalNavBarProps {
  className?: string;
}

export function VerticalNavBar({ className }: VerticalNavBarProps) {
  const pathname = usePathname();
  const [isCollapsed, setIsCollapsed] = useState(false);

  const toggleCollapse = () => {
    setIsCollapsed(!isCollapsed);
  };

  return (
    <div className={cn(
      'relative flex flex-col bg-card border-r border-border',
      'transition-all duration-300 ease-in-out',
      isCollapsed ? 'w-16' : 'w-64',
      className
    )}>
      {/* Header */}
      <div className="p-4 border-b border-border">
        <div className="flex items-center justify-between">
          {!isCollapsed && (
            <div>
              <h2 className="font-semibold text-sm text-foreground">
                Network AI
              </h2>
              <p className="text-xs text-muted-foreground">
                Dashboard
              </p>
            </div>
          )}
          <Button
            variant="ghost"
            size="sm"
            onClick={toggleCollapse}
            className="h-8 w-8 p-0"
          >
            {isCollapsed ? (
              <ChevronRight className="h-4 w-4" />
            ) : (
              <ChevronLeft className="h-4 w-4" />
            )}
          </Button>
        </div>
      </div>

      {/* Navigation Items */}
      <nav className="flex-1 p-2">
        <ul className="space-y-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href || 
              (item.href !== '/dashboard' && pathname.startsWith(item.href));

            return (
              <li key={item.href}>
                <Link href={item.href}>
                  <div className={cn(
                    'flex items-center gap-3 rounded-lg px-3 py-2 transition-all',
                    'hover:bg-accent hover:text-accent-foreground',
                    'group relative',
                    isActive 
                      ? 'bg-primary text-primary-foreground shadow-sm' 
                      : 'text-muted-foreground'
                  )}>
                    <Icon className="h-4 w-4 flex-shrink-0" />
                    
                    {!isCollapsed && (
                      <div className="flex-1 min-w-0">
                        <div className="font-medium text-sm truncate">
                          {item.title}
                        </div>
                        <div className="text-xs opacity-80 truncate">
                          {item.description}
                        </div>
                      </div>
                    )}

                    {/* Tooltip for collapsed state */}
                    {isCollapsed && (
                      <div className="absolute left-full ml-2 px-2 py-1 bg-popover text-popover-foreground text-xs rounded-md shadow-md opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-50">
                        <div className="font-medium">{item.title}</div>
                        <div className="opacity-80">{item.description}</div>
                      </div>
                    )}
                  </div>
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>

      <Separator />

      {/* Footer */}
      <div className="p-3">
        {!isCollapsed ? (
          <div className="text-xs text-muted-foreground text-center">
            <p>Network AI v1.0</p>
            <p className="opacity-75">Dashboard</p>
          </div>
        ) : (
          <div className="flex justify-center">
            <div className="w-2 h-2 bg-muted-foreground rounded-full opacity-50"></div>
          </div>
        )}
      </div>
    </div>
  );
}