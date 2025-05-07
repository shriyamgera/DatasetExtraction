import React, { useState, useEffect } from 'react';
import { Outlet, NavLink, useLocation } from 'react-router-dom';
import { Database, Upload, BarChart3, Home } from 'lucide-react';

const Layout: React.FC = () => {
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };

    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <header
        className={`fixed top-0 left-0 right-0 z-10 transition-all duration-300 ease-in-out ${
          scrolled ? 'bg-white shadow-md py-2' : 'bg-transparent py-4'
        }`}
      >
        <div className="container mx-auto px-4 flex justify-between items-center">
          <div className="flex items-center">
            <Database className="h-8 w-8 text-blue-500 mr-2" />
            <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-500 to-purple-600 bg-clip-text text-transparent">
              
            </h1>
          </div>
          <nav className="hidden md:flex space-x-6">
            {[
              { to: '/', icon: <Home size={18} />, label: 'Home' },
              { to: '/upload', icon: <Upload size={18} />, label: 'Upload' },
              { to: '/datasets', icon: <Database size={18} />, label: 'Datasets' },
              { to: '/visualization', icon: <BarChart3 size={18} />, label: 'Visualize' }
            ].map((link) => (
              <NavLink
                key={link.to}
                to={link.to}
                className={({ isActive }) => 
                  `flex items-center gap-2 px-3 py-2 rounded-lg transition-colors duration-200 
                  ${isActive 
                    ? 'bg-blue-50 text-blue-600 font-medium' 
                    : 'text-gray-700 hover:text-blue-600 hover:bg-blue-50'}`
                }
              >
                {link.icon}
                <span>{link.label}</span>
              </NavLink>
            ))}
          </nav>
          <div className="md:hidden">
            <button className="p-2 rounded-lg text-gray-700 hover:bg-gray-100">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
          </div>
        </div>
      </header>

      <main className="flex-grow pt-20 pb-12">
        <div className="container mx-auto px-4">
          <Outlet />
        </div>
      </main>

      {/* <footer className="bg-white border-t border-gray-200 py-6">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <p className="text-gray-600 mb-4 md:mb-0">
             
            </p>
            <div className="flex space-x-6">
              <a href="#" className="text-gray-600 hover:text-blue-600 transition-colors">
                Terms
              </a>
              <a href="#" className="text-gray-600 hover:text-blue-600 transition-colors">
                Privacy
              </a>
              <a href="#" className="text-gray-600 hover:text-blue-600 transition-colors">
                Contact
              </a>
            </div>
          </div>
        </div>
      </footer> */}

      {/* Mobile navigation menu */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 z-10">
        <div className="flex justify-around py-2">
          {[
            { to: '/', icon: <Home size={20} />, label: 'Home' },
            { to: '/upload', icon: <Upload size={20} />, label: 'Upload' },
            { to: '/datasets', icon: <Database size={20} />, label: 'Datasets' },
            { to: '/visualization', icon: <BarChart3 size={20} />, label: 'Visualize' }
          ].map((link) => (
            <NavLink
              key={link.to}
              to={link.to}
              className={({ isActive }) => 
                `flex flex-col items-center px-3 py-2 rounded-lg transition-colors duration-200
                ${isActive ? 'text-blue-600' : 'text-gray-600 hover:text-blue-600'}`
              }
            >
              {link.icon}
              <span className="text-xs mt-1">{link.label}</span>
            </NavLink>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Layout;