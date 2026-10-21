import React, { useState } from 'react';
import { NavLink, Link, useNavigate, Outlet } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Inbox, 
  MapPin, 
  Compass, 
  Car, 
  Bell, 
  CalendarHeart, 
  FolderTree, 
  Image as ImageIcon, 
  Settings, 
  Users, 
  LogOut, 
  ExternalLink, 
  Menu, 
  X,
  ShieldCheck,
  MessageSquare
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

const AdminLayout = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [mobileSidebar, setMobileSidebar] = useState(false);

  const handleLogout = async () => {
    await logout();
    navigate('/admin/login');
  };

  const navItems = [
    { name: 'Dashboard Overview', path: '/admin', icon: LayoutDashboard, end: true },
    { name: 'Live Support Chat', path: '/admin/chat', icon: MessageSquare },
    { name: 'Customer Enquiries', path: '/admin/enquiries', icon: Inbox },
    { name: 'Destinations', path: '/admin/destinations', icon: MapPin },
    { name: 'Tours & Cruises', path: '/admin/tours', icon: Compass },
    { name: 'Rentals (Car & Vacation)', path: '/admin/rental-options', icon: Car },
    { name: 'Concierge Services', path: '/admin/concierge', icon: Bell },
    { name: 'Event Offerings', path: '/admin/events', icon: CalendarHeart },
    { name: 'Service Categories', path: '/admin/services', icon: FolderTree },
    { name: 'Media Library', path: '/admin/media', icon: ImageIcon },
    { name: 'Website Settings', path: '/admin/settings', icon: Settings },
    { name: 'User Management', path: '/admin/users', icon: Users },
  ];

  return (
    <div className="min-h-screen bg-slate-100 flex flex-col md:flex-row">
      
      {/* Mobile Topbar */}
      <div className="md:hidden bg-[#0c1f33] text-white px-4 py-3 flex items-center justify-between border-b border-slate-800">
        <div className="flex items-center gap-2">
          <ShieldCheck className="w-5 h-5 text-amber-500" />
          <span className="font-bold text-sm font-serif">WeCheaperTours Admin</span>
        </div>
        <button
          onClick={() => setMobileSidebar(!mobileSidebar)}
          className="p-1.5 rounded-lg text-slate-300 hover:text-white hover:bg-slate-800"
        >
          {mobileSidebar ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {/* Sidebar */}
      <aside className={`
        ${mobileSidebar ? 'block' : 'hidden'}
        md:block w-full md:w-64 bg-[#0a1829] text-slate-300 flex-shrink-0 flex flex-col justify-between border-r border-slate-800 z-30
      `}>
        <div>
          {/* Logo */}
          <div className="p-6 border-b border-slate-800 flex items-center justify-between">
            <Link to="/admin" className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-amber-600 text-white flex items-center justify-center font-bold shadow-md shadow-amber-600/30">
                W
              </div>
              <div>
                <span className="block font-bold text-sm text-white font-serif">WeCheaperTours</span>
                <span className="block text-[10px] text-amber-400 uppercase font-semibold">CMS & Admin Panel</span>
              </div>
            </Link>
          </div>

          {/* Navigation Links */}
          <nav className="p-4 space-y-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              return (
                <NavLink
                  key={item.path}
                  to={item.path}
                  end={item.end}
                  onClick={() => setMobileSidebar(false)}
                  className={({ isActive }) =>
                    `flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all ${
                      isActive
                        ? 'bg-amber-600 text-white shadow-xs'
                        : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
                    }`
                  }
                >
                  <Icon className="w-4 h-4 shrink-0" />
                  <span>{item.name}</span>
                </NavLink>
              );
            })}
          </nav>
        </div>

        {/* Footer profile & actions */}
        <div className="p-4 border-t border-slate-800 space-y-3">
          <div className="px-3 py-2 bg-slate-900/60 rounded-xl border border-slate-800 text-xs">
            <span className="block text-[11px] text-slate-400">Signed in as:</span>
            <span className="block font-bold text-white truncate">{user?.name || 'Administrator'}</span>
            <span className="text-[10px] text-amber-400 uppercase font-semibold">{user?.role || 'admin'}</span>
          </div>

          <div className="flex items-center justify-between gap-2 pt-1 text-xs">
            <Link
              to="/"
              target="_blank"
              className="flex items-center gap-1.5 text-slate-400 hover:text-amber-400 transition-colors py-1 px-2 rounded-lg hover:bg-slate-800"
            >
              <ExternalLink className="w-3.5 h-3.5" />
              <span>Public Site</span>
            </Link>
            <button
              onClick={handleLogout}
              className="flex items-center gap-1.5 text-red-400 hover:text-red-300 transition-colors py-1 px-2 rounded-lg hover:bg-red-950/40 cursor-pointer"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>Logout</span>
            </button>
          </div>
        </div>
      </aside>

      {/* Main Content Viewport */}
      <main className="flex-1 overflow-y-auto p-4 sm:p-8 min-h-screen">
        <Outlet />
      </main>

    </div>
  );
};

export default AdminLayout;
