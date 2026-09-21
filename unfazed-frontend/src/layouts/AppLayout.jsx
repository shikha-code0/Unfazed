import React, { useState } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import Sidebar from '../components/common/Sidebar';
import Topbar from '../components/common/Topbar';

const AppLayout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const location = useLocation();

  // Basic title mapping based on pathname
  let title = 'Overview';
  if (location.pathname.includes('/schedule')) title = 'Calendar';
  else if (location.pathname.includes('/clients')) title = 'Clients';
  else if (location.pathname.includes('/payments')) title = 'Payments';
  else if (location.pathname.includes('/notes')) title = 'Notes';
  else if (location.pathname.includes('/chat')) title = 'Chat';
  else if (location.pathname.includes('/analytics')) title = 'Analytics';

  return (
    <div className="app-shell">
      <div className="sidebar">
        <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      </div>
      <div className="main-area">
        <div className="topbar">
          <Topbar onOpenSidebar={() => setSidebarOpen(true)} title={title} />
        </div>
        <div className="page-content">
          <Outlet />
        </div>
      </div>
    </div>
  );
};

export default AppLayout;
