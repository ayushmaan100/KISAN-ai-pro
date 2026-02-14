import React from 'react';
import { Outlet, Link, useLocation } from 'react-router-dom';
import { Sprout, LayoutDashboard, Calendar, Settings, LogOut, Sparkles} from 'lucide-react';
import { useTranslation } from 'react-i18next'; // <--- Import hook

export default function Layout() {
  const { t } = useTranslation(); // <--- Initialize translation hook
  const location = useLocation();

  const navItems = [
    { icon: LayoutDashboard, label: t('nav.dashboard'), path: '/dashboard' },
    { icon: Sprout, label: t('nav.farms'), path: '/farms' },
    { icon: Calendar, label: t('nav.planner'), path: '/planner' },
    { icon: Settings, label: t('nav.settings'), path: '/settings' },
    { icon: Sparkles, label: t('nav.doctor'), path: '/doctor' },
  ];

  return (
    <div className="flex h-screen bg-earth-100">
      {/* Sidebar */}
      <aside className="w-64 bg-white border-r border-gray-200 hidden md:flex flex-col">
        <div className="p-6 border-b border-gray-100">
          <h1 className="text-2xl font-bold text-primary-600 flex items-center gap-2">
            <Sprout className="w-8 h-8" />
            Kisan AI
          </h1>
        </div>

        <nav className="flex-1 p-4 space-y-2">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.path;
            return (
              <Link
                key={item.path}
                to={item.path}
                className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${
                  isActive 
                    ? 'bg-primary-50 text-primary-700 font-semibold' 
                    : 'text-gray-600 hover:bg-gray-50'
                }`}
              >
                <Icon className="w-5 h-5" />
                {item.label}
              </Link>
            );
          })}
        </nav>

        <div className="p-4 border-t border-gray-100">
          <button className="flex items-center gap-3 px-4 py-3 text-red-600 hover:bg-red-50 w-full rounded-xl transition-colors">
            <LogOut className="w-5 h-5" />
            Logout
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto">
        <div className="p-8">
          <Outlet />
        </div>
      </main>
    </div>
  );
}