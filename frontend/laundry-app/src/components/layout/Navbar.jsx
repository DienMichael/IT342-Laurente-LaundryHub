import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { FaTshirt } from 'react-icons/fa';

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  // Navigation items based on user role
  const getNavigationItems = () => {
    if (!user) return [];

    const roleUpperCase = user.role?.toUpperCase();
    
    if (roleUpperCase === 'CUSTOMER') {
      return [
        { name: 'Dashboard', href: '/customer'},
        { name: 'New Booking', href: '/booking'},
        { name: 'My Orders', href: '/orders'},
      ];
    } else if (roleUpperCase === 'STAFF' || roleUpperCase === 'ADMIN') {
      return [
        { name: 'Dashboard', href: '/staff'},
        { name: 'Manage Orders', href: '/staff/orders'},
      ];
    }
    
    return [];
  };

  const navigation = getNavigationItems();

  return (
    <nav className="bg-white shadow-lg sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          {/* Logo and Brand */}
          <div className="flex items-center">
            <Link to="/" className="flex items-center space-x-2">
              <div className="bg-blue-600 p-2 rounded-lg">
                <FaTshirt className="h-6 w-6 text-white" />
              </div>
              <span className="text-xl font-bold text-gray-900">Smart Laundry</span>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            {navigation.map((item) => (
              <Link
                key={item.name}
                to={item.href}
                className="text-gray-700 hover:text-blue-600 px-3 py-2 rounded-md text-sm font-medium transition-colors duration-200"
              >
                <span className="mr-2">{item.icon}</span>
                {item.name}
              </Link>
            ))}
          </div>

          {/* User Menu */}
          <div className="flex items-center space-x-4">
            <div className="hidden md:flex items-center space-x-3">
              <div className="flex items-center space-x-2">
                <div className="bg-blue-100 rounded-full p-2">
                  <span className="text-blue-600 text-sm font-semibold">
                    {user?.name?.charAt(0).toUpperCase()}
                  </span>
                </div>
                <div className="text-sm">
                  <p className="text-gray-900 font-medium">{user?.name}</p>
                  <p className="text-gray-500 text-xs capitalize">{user?.role}</p>
                </div>
              </div>
              <button
                onClick={handleLogout}
                className="bg-red-600 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-red-700 transition-colors duration-200"
              >
                Logout
              </button>
            </div>

            {/* Mobile menu button */}
            <div className="md:hidden">
              <button
                onClick={handleLogout}
                className="bg-red-600 text-white px-3 py-1 rounded-md text-sm"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Navigation */}
      <div className="md:hidden border-t border-gray-200">
        <div className="px-2 pt-2 pb-3 space-y-1">
          {navigation.map((item) => (
            <Link
              key={item.name}
              to={item.href}
              className="text-gray-700 hover:text-blue-600 block px-3 py-2 rounded-md text-base font-medium"
            >
              <span className="mr-2">{item.icon}</span>
              {item.name}
            </Link>
          ))}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;