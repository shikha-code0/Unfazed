import React, { useState } from 'react';
import { Menu, Bell, Search, ExternalLink, LogOut, User } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import NotificationsPopover from './NotificationsPopover';
import GlobalSearch from './GlobalSearch';

const Topbar = ({ onOpenSidebar, title = 'Overview' }) => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [showDropdown, setShowDropdown] = useState(false);
  const [isHoveringNav, setIsHoveringNav] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <header className="h-16 lg:h-[72px] bg-surface/90 backdrop-blur-md border-b border-border/80 px-4 lg:px-8 flex items-center justify-between w-full">
      {/* Left Title & Mobile Menu Toggle */}
      <div className="flex items-center gap-3">
        <button
          onClick={onOpenSidebar}
          className="lg:hidden p-2 -ml-2 text-slate hover:text-ink focus:outline-none"
          aria-label="Open sidebar"
        >
          <Menu className="w-5 h-5" />
        </button>
        <div>
          <h1 className="text-lg lg:text-xl font-bold text-ink tracking-tight">{title}</h1>
          <p className="text-xs text-slate hidden sm:block">Welcome back to your practice</p>
        </div>
      </div>

      {/* Right Controls */}
      <div className="flex items-center gap-3 lg:gap-4">
        
        {user?.role === 'therapist' && (
          <>
            <GlobalSearch />
            <NotificationsPopover onHover={() => setIsHoveringNav(true)} />
          </>
        )}

        {/* User Menu */}
        <div className="relative">
          <button
            onClick={() => setShowDropdown(!showDropdown)}
            className="flex items-center gap-2 p-1 rounded-full hover:ring-2 hover:ring-primary/30 transition-all focus:outline-none"
          >
            {user?.profileImage ? (
              <img
                src={user.profileImage}
                alt={user.name}
                className="w-9 h-9 rounded-full object-cover ring-1 ring-border"
              />
            ) : (
              <div className="w-9 h-9 rounded-full bg-primary-light text-primary font-bold text-sm flex items-center justify-center">
                {user?.name?.charAt(0) || 'T'}
              </div>
            )}
          </button>

          {showDropdown && (
            <div
              className="absolute right-0 mt-2 w-56 bg-surface rounded-card shadow-card border border-border py-1.5 z-50 animate-in fade-in zoom-in-95 duration-100"
              onMouseLeave={() => setShowDropdown(false)}
            >
              <div className="px-4 py-2 border-b border-border/50">
                <p className="text-xs font-semibold text-ink truncate">{user?.name}</p>
                <p className="text-[11px] text-slate truncate">{user?.email}</p>
              </div>

              {user?.slug && (
                <a
                  href={`/${user.slug}`}
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center gap-2.5 px-4 py-2 text-xs text-ink hover:bg-primary-light hover:text-primary transition-colors"
                >
                  <ExternalLink className="w-4 h-4 text-slate" />
                  <span>View Public Profile</span>
                </a>
              )}

              <button
                onClick={handleLogout}
                className="w-full flex items-center gap-2.5 px-4 py-2 text-xs text-error hover:bg-error-bg transition-colors text-left"
              >
                <LogOut className="w-4 h-4 text-error" />
                <span>Sign out</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default Topbar;
