import React, { useState } from "react";
import { Outlet, Link, useLocation } from "react-router-dom";
import ApperIcon from "@/components/ApperIcon";
import { cn } from "@/utils/cn";

const Layout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const location = useLocation();

  const navigation = [
    { name: "Dashboard", href: "/", icon: "LayoutDashboard", current: location.pathname === "/" },
    { name: "Transactions", href: "/transactions", icon: "Receipt", current: location.pathname === "/transactions" },
    { name: "Budgets", href: "/budgets", icon: "PiggyBank", current: location.pathname === "/budgets" },
    { name: "Goals", href: "/goals", icon: "Target", current: location.pathname === "/goals" },
    { name: "Reports", href: "/reports", icon: "BarChart3", current: location.pathname === "/reports" },
  ];

  // Desktop Sidebar
  const DesktopSidebar = () => (
    <div className="hidden lg:flex lg:w-64 lg:flex-col lg:fixed lg:inset-y-0">
      <div className="flex flex-col flex-grow bg-white border-r border-gray-200 pt-5 pb-4 overflow-y-auto">
        <div className="flex items-center flex-shrink-0 px-4">
          <div className="flex items-center">
            <div className="w-8 h-8 bg-gradient-to-br from-primary-500 to-secondary-500 rounded-lg flex items-center justify-center">
              <ApperIcon name="DollarSign" size={20} className="text-white" />
            </div>
            <span className="ml-2 text-xl font-bold gradient-text">SmartFinance</span>
          </div>
        </div>
        
        <div className="mt-8 flex-grow flex flex-col">
          <nav className="flex-1 px-2 space-y-1">
            {navigation.map((item) => (
              <Link
                key={item.name}
                to={item.href}
                className={cn(
                  item.current
                    ? "bg-gradient-to-r from-primary-50 to-secondary-50 text-primary-700 border-r-2 border-primary-600"
                    : "text-gray-600 hover:bg-gray-50 hover:text-gray-900",
                  "group flex items-center px-2 py-2 text-sm font-medium rounded-md transition-colors duration-200"
                )}
              >
                <ApperIcon
                  name={item.icon}
                  size={20}
                  className={cn(
                    item.current ? "text-primary-600" : "text-gray-400 group-hover:text-gray-500",
                    "mr-3 flex-shrink-0"
                  )}
                />
                {item.name}
              </Link>
            ))}
          </nav>
        </div>

        <div className="flex-shrink-0 px-4 py-4 border-t border-gray-200">
          <div className="flex items-center">
            <div className="w-8 h-8 bg-gradient-to-br from-accent-400 to-accent-600 rounded-full flex items-center justify-center">
              <ApperIcon name="User" size={16} className="text-white" />
            </div>
            <div className="ml-3">
              <p className="text-sm font-medium text-gray-700">Welcome back!</p>
              <p className="text-xs text-gray-500">Manage your finances</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  // Mobile Sidebar
  const MobileSidebar = () => (
    <>
      {sidebarOpen && (
        <div 
          className="fixed inset-0 flex z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        >
          <div className="fixed inset-0 bg-gray-600 bg-opacity-75" />
          
          <div 
            className="relative flex-1 flex flex-col max-w-xs w-full bg-white transform transition-transform duration-300 ease-in-out translate-x-0"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="absolute top-0 right-0 -mr-12 pt-2">
              <button
                type="button"
                className="ml-1 flex items-center justify-center h-10 w-10 rounded-full focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white"
                onClick={() => setSidebarOpen(false)}
              >
                <ApperIcon name="X" size={24} className="text-white" />
              </button>
            </div>
            
            <div className="flex-1 h-0 pt-5 pb-4 overflow-y-auto">
              <div className="flex items-center flex-shrink-0 px-4">
                <div className="flex items-center">
                  <div className="w-8 h-8 bg-gradient-to-br from-primary-500 to-secondary-500 rounded-lg flex items-center justify-center">
                    <ApperIcon name="DollarSign" size={20} className="text-white" />
                  </div>
                  <span className="ml-2 text-xl font-bold gradient-text">SmartFinance</span>
                </div>
              </div>
              
              <nav className="mt-8 flex-1 px-2 space-y-1">
                {navigation.map((item) => (
                  <Link
                    key={item.name}
                    to={item.href}
                    onClick={() => setSidebarOpen(false)}
                    className={cn(
                      item.current
                        ? "bg-gradient-to-r from-primary-50 to-secondary-50 text-primary-700"
                        : "text-gray-600 hover:bg-gray-50 hover:text-gray-900",
                      "group flex items-center px-2 py-2 text-base font-medium rounded-md transition-colors duration-200"
                    )}
                  >
                    <ApperIcon
                      name={item.icon}
                      size={24}
                      className={cn(
                        item.current ? "text-primary-600" : "text-gray-400",
                        "mr-4 flex-shrink-0"
                      )}
                    />
                    {item.name}
                  </Link>
                ))}
              </nav>
            </div>
          </div>
        </div>
      )}
    </>
  );

  return (
    <div className="h-screen flex overflow-hidden bg-background">
      <DesktopSidebar />
      <MobileSidebar />
      
      <div className="flex flex-col w-0 flex-1 overflow-hidden lg:pl-64">
        {/* Mobile header */}
        <div className="lg:hidden">
          <div className="flex items-center justify-between bg-white px-4 py-3 border-b border-gray-200">
            <div className="flex items-center">
              <button
                type="button"
                className="-ml-0.5 -mt-0.5 h-10 w-10 inline-flex items-center justify-center rounded-md text-gray-500 hover:text-gray-900 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-primary-500"
                onClick={() => setSidebarOpen(true)}
              >
                <ApperIcon name="Menu" size={24} />
              </button>
              <div className="ml-3 flex items-center">
                <div className="w-6 h-6 bg-gradient-to-br from-primary-500 to-secondary-500 rounded-md flex items-center justify-center">
                  <ApperIcon name="DollarSign" size={14} className="text-white" />
                </div>
                <span className="ml-2 text-lg font-bold gradient-text">SmartFinance</span>
              </div>
            </div>
          </div>
        </div>

        {/* Main content */}
        <main className="flex-1 relative overflow-y-auto focus:outline-none">
          <div className="py-6 px-4 sm:px-6 lg:px-8">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
};

export default Layout;