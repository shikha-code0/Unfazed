import React from 'react';
import { NavLink, useNavigate, useLocation } from 'react-router-dom';
import {
  LayoutDashboard,
  Calendar,
  Users,
  FileText,
  CreditCard,
  BarChart3,
  LogOut,
  ExternalLink,
  X,
  MessageSquare
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

const Sidebar = ({ isOpen, onClose }) => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const navItems = [
    { name: 'Overview', path: '/dashboard', icon: LayoutDashboard },
    { name: 'Calendar', path: '/schedule', icon: Calendar },
    { name: 'Clients', path: '/clients', icon: Users },
    { name: 'Notes', path: '/notes', icon: FileText },
    { name: 'Payments', path: '/payments', icon: CreditCard },
    { name: 'Chat', path: '/chat', icon: MessageSquare },
    { name: 'Analytics', path: '/analytics', icon: BarChart3 },
  ];

  return (
    <>
      {/* Mobile Backdrop */}
      {isOpen && (
        <div
          onClick={onClose}
          className="fixed inset-0 bg-black/40 z-40 lg:hidden"
          aria-hidden="true"
        />
      )}

      {/* Sidebar Container */}
      <aside
        className={`
          h-full bg-bg-dark-sidebar border-r border-white/10 flex flex-col
          transition-transform duration-300 ease-in-out
          fixed top-0 left-0 bottom-0 z-50 w-[260px]
          lg:static lg:translate-x-0
          ${isOpen ? 'translate-x-0' : '-translate-x-full'}
        `}
      >
        {/* Logo Area */}
        <div className="flex-shrink-0 h-[72px] px-6 flex items-center justify-between border-b border-white/10">
          <div className="flex items-center gap-2.5">
            <span className="w-3 h-3 rounded-full bg-sage ring-4 ring-sage/20"></span>
            <span className="text-xl font-bold tracking-tight text-white">unfazed</span>
          </div>
          <button
            onClick={onClose}
            className="lg:hidden p-1.5 text-white/60 hover:text-white hover:bg-white/10 rounded-md focus:outline-none transition-colors"
            aria-label="Close sidebar"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Nav Links — scrollable middle section */}
        <nav className="flex-1 overflow-y-auto p-4 space-y-1 min-h-0">
          {navItems.map((item) => {
            const isActive = location.pathname === item.path ||
              (item.path !== '/dashboard' && location.pathname.startsWith(item.path));
            return (
              <NavLink
                key={item.name}
                to={item.path}
                onClick={onClose}
                className={`flex items-center gap-3 px-3.5 h-11 rounded-lg font-medium text-sm transition-colors ${
                  isActive
                    ? 'bg-primary text-white font-semibold shadow-sm'
                    : 'text-white/70 hover:text-white hover:bg-white/10'
                }`}
              >
                <item.icon
                  className={`w-5 h-5 flex-shrink-0 ${isActive ? 'text-white' : 'text-white/60'}`}
                />
                <span>{item.name}</span>
              </NavLink>
            );
          })}
        </nav>

        {/* Footer — always visible at bottom */}
        <div className="flex-shrink-0 p-4 border-t border-white/10 space-y-3">
          {/* Public Profile Link */}
          {user?.slug && (
            <a
              href={`/${user.slug}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-between p-2.5 rounded-lg bg-white/5 hover:bg-white/10 text-white/80 hover:text-white text-xs font-medium transition-colors border border-white/10 group"
            >
              <span className="truncate">View Public Profile</span>
              <ExternalLink className="w-3.5 h-3.5 text-sage/80 group-hover:translate-x-0.5 transition-transform flex-shrink-0" />
            </a>
          )}

          {/* User Profile Summary & Logout */}
          <div className="flex items-center justify-between gap-2 pt-1">
            <div className="flex items-center gap-2.5 min-w-0">
              {user?.profileImage ? (
                <img
                  src={user.profileImage}
                  alt={user.name}
                  className="w-9 h-9 rounded-full object-cover ring-2 ring-white/20 flex-shrink-0"
                />
              ) : (
                <div className="w-9 h-9 rounded-full bg-primary text-white font-bold text-sm flex items-center justify-center flex-shrink-0">
                  {user?.name?.charAt(0)?.toUpperCase() || 'U'}
                </div>
              )}
              <div className="min-w-0">
                <p className="text-xs font-bold text-white truncate leading-tight">{user?.name || 'Therapist'}</p>
                <p className="text-[11px] text-white/50 truncate">{user?.email}</p>
              </div>
            </div>
            <button
              onClick={handleLogout}
              title="Sign Out"
              className="p-1.5 text-white/50 hover:text-red-400 hover:bg-red-400/10 rounded-md transition-colors flex-shrink-0"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;
