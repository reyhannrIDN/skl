import React from 'react';
import { Menu } from 'lucide-react';
import { Button } from '@/components/common/Button';
import { NotificationBell } from './NotificationBell';
import { ThemeToggle } from '../common/ThemeToggle';
import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faGraduationCap } from '@fortawesome/free-solid-svg-icons';

export function Navbar({ toggleSidebar }) {

  return (
    <header className="sticky top-0 z-40 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="flex h-16 items-center px-4 md:px-6">
        <Button variant="ghost" size="icon" className="md:hidden mr-2" onClick={toggleSidebar}>
          <Menu className="h-5 w-5" />
          <span className="sr-only">Toggle Sidebar</span>
        </Button>
        <div className="flex items-center gap-2 font-semibold">
          {/* Branding moved to fixed sidebar header */}
        </div>
        
        <div className="ml-auto flex items-center space-x-2 md:space-x-4">
          <ThemeToggle />
          <NotificationBell />
        </div>
      </div>
    </header>
  );
}
