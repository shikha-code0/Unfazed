import React from 'react';
import { NavLink, useNavigate, useLocation } from 'react-router-dom';
import {
  LayoutDashboard,
  Calendar,
  Users,
  FileText,
  CreditCard,
  BarChart3,
  Sparkles,
  HelpCircle,
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
    { name: 'Overview', path: '/dashboard', icon: LayoutDashboard, active: true },
    { name: 'Calendar', path: '/schedule', icon: Calendar, active: true },
    { name: 'Clients', path: '/clients', icon: Users, active: true },
    { name: 'Notes', path: '/notes', icon: FileText, active: true },
    { name: 'Payments', path: '/payments', icon: CreditCard, active: true },
    { name: 'Chat', path: '/chat', icon: MessageSquare, active: true },
    { name: 'Analytics', path: '/analytics', icon: BarChart3, active: true },
  ];

  return (
    <>
      {/* Mobile Backdrop */}
      {isOpen && (
        <div
          onClick={onClose}
          className="fixed inset-0 bg-ink/30 backdrop-blur-xs z-40 lg:hidden transition-opacity"
        />
      )}

      {/* Sidebar Container */}
      <aside
        className={`h-full bg-dark-sidebar border-r border-border/20 flex flex-col justify-between transition-transform duration-300 ease-in-out lg:static lg:translate-x-0 fixed top-0 left-0 bottom-0 z-50 w-[252px] ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div>
          {/* Logo Area */}
          <div className="h-[72px] px-6 flex items-center justify-between border-b border-border/20">
            <div className="flex items-center gap-2.5">
              <span className="w-3 h-3 rounded-full bg-sage ring-4 ring-sage/20"></span>
              <span className="text-xl font-bold tracking-tight text-white">unfazed</span>
            </div>
            <button
              onClick={onClose}
              className="lg:hidden p-1 text-slate hover:text-white focus:outline-none"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Nav Links */}
          <nav className="p-4 space-y-1">
            {navItems.map((item) => {
              const isActive = location.pathname === item.path;
              return item.active ? (
                <NavLink
                  key={item.name}
                  to={item.path}
                  onClick={onClose}
                  className={`flex items-center gap-3 px-3.5 h-12 rounded-lg font-medium text-sm transition-colors ${
                    isActive
                      ? 'bg-primary text-bg-main font-semibold shadow-sm'
                      : 'text-slate hover:text-bg-main hover:bg-white/5'
                  }`}
                >
                  <item.icon className={`w-5 h-5 flex-shrink-0 ${isActive ? 'text-bg-main' : 'text-slate'}`} />
                  <span>{item.name}</span>
                </NavLink>
              ) : (
                <div
                  key={item.name}
                  className="flex items-center justify-between px-3.5 h-12 rounded-lg text-sm text-slate/50 cursor-not-allowed select-none"
                  title="Coming in future modules"
                >
                  <div className="flex items-center gap-3">
                    <item.icon className="w-5 h-5 flex-shrink-0 text-slate/40" />
                    <span>{item.name}</span>
                  </div>
                  <span className="text-[10px] font-semibold tracking-wide uppercase px-1.5 py-0.5 rounded-full bg-slate-100 text-slate">
                    {item.badge}
                  </span>
                </div>
              );
            })}
          </nav>
        </div>

        {/* Footer Area */}
        <div className="p-4 border-t border-border/20 space-y-3">
          {/* Public Profile Link Preview */}
          {user?.slug && (
            <a
              href={`/${user.slug}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-between p-2.5 rounded-lg bg-white/5 hover:bg-white/10 text-bg-main text-xs font-medium transition-colors border border-white/5 group"
            >
              <span className="truncate">View Public Profile</span>
              <ExternalLink className="w-3.5 h-3.5 text-sage group-hover:translate-x-0.5 transition-transform" />
            </a>
          )}

          {/* User Profile Summary & Logout */}
          <div className="pt-2 border-t border-border/20 flex items-center justify-between">
            <div className="flex items-center gap-2.5 overflow-hidden">
              {user?.profileImage ? (
                <img
                  src={user.profileImage}
                  alt={user.name}
                  className="w-9 h-9 rounded-full object-cover ring-1 ring-border/20 flex-shrink-0"
                />
              ) : (
                <div className="w-9 h-9 rounded-full bg-primary text-bg-main font-bold text-sm flex items-center justify-center flex-shrink-0">
                  {user?.name?.charAt(0) || 'U'}
                </div>
              )}
              <div className="overflow-hidden text-left">
                <p className="text-xs font-bold text-white truncate leading-tight">{user?.name || 'Therapist'}</p>
                <p className="text-[11px] text-slate truncate">{user?.email}</p>
              </div>
            </div>
            <button
              onClick={handleLogout}
              title="Sign Out"
              className="p-1.5 text-slate hover:text-error hover:bg-error/10 rounded-md transition-colors"
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
