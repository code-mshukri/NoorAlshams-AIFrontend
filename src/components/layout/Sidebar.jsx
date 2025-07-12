import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import {
  LayoutDashboard, Users, Calendar, Settings, MessageCircle, User,
  Home, Bell, Star, Menu, X
} from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';

const Sidebar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { user } = useAuth();
  const location = useLocation();
  const role = user?.role;

  const toggleSidebar = () => setIsOpen(!isOpen);

  const sidebarLinks = {
    client: [
      { name: 'لوحة التحكم', path: '/client/dashboard', icon: <LayoutDashboard /> },
      { name: 'حجوزاتي', path: '/client/appointments', icon: <Calendar /> },
      { name: 'احجز موعد', path: '/client/booking', icon: <Calendar /> },
      { name: 'حسابي', path: '/client/profile', icon: <User /> },
    ],
    staff: [
      { name: 'لوحة التحكم', path: '/staff/dashboard', icon: <LayoutDashboard /> },
      { name: 'جدولي', path: '/staff/schedule', icon: <Calendar /> },
      { name: 'حسابي', path: '/staff/profile', icon: <User /> },
    ],
    admin: [
      { name: 'لوحة التحكم', path: '/admin/dashboard', icon: <LayoutDashboard /> },
      { name: 'إدارة المستخدمين', path: '/admin/users', icon: <Users /> },
      { name: 'إدارة الخدمات', path: '/admin/services', icon: <Settings /> },
      { name: 'إدارة الإعلانات', path: '/admin/announcements', icon: <Bell /> },
      { name: 'إدارة المواعيد', path: '/admin/appointments', icon: <Calendar /> },
      { name: 'إدارة الموظفات', path: '/admin/staff', icon: <Users /> },
      { name: 'إدارة التقييمات', path: '/admin/feedback', icon: <Star /> },
      { name: 'حسابي', path: '/admin/profile', icon: <User /> },
    ],
  };

  const links = sidebarLinks[role] || [];

  return (
    <>
      {/* Toggle Button */}
      <button
        onClick={toggleSidebar}
        className="fixed top-4 left-4 z-50 p-2 bg-primary-200 text-white rounded-full shadow-lg md:hidden"
      >
        {isOpen ? <X size={24} /> : <Menu size={24} />}
      </button>

      {/* Sidebar */}
      <div
        className={`fixed top-0 left-0 h-full bg-white shadow-xl z-40 transition-all duration-300 ease-in-out overflow-y-auto
        ${isOpen ? 'w-64' : 'w-0 md:w-64'}`}
      >
        <div className="p-4 bg-primary-100">
          <h2 className="text-xl font-bold text-primary-200">
            {role === 'admin' ? 'المشرف' : role === 'staff' ? 'الموظف' : role === 'client' ? 'العميل' : 'الحساب'}
          </h2>
          <p className="text-sm text-gray-600">مرحبًا بك، {user?.full_name || 'مستخدم'}</p>
        </div>

        <div className="p-4">
          <ul className="space-y-2">
            {links.map((link, idx) => (
              <li key={idx}>
                <Link
                  to={link.path}
                  className={`flex items-center p-2 rounded-lg text-sm font-medium transition-colors
                    ${location.pathname === link.path
                      ? 'bg-primary-100 text-primary-200'
                      : 'text-gray-700 hover:bg-primary-50 hover:text-primary-200'}`}
                  onClick={() => setIsOpen(false)}
                >
                  <span className="ml-2">{link.icon}</span>
                  <span>{link.name}</span>
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-30 md:hidden"
          onClick={() => setIsOpen(false)}
        />
      )}
    </>
  );
};

export default Sidebar;
