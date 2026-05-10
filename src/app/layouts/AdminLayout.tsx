import { Outlet, Link, useLocation } from "react-router";
import { useEffect, useState } from "react";
import { Inbox, LayoutDashboard, LogOut, Package, PlusSquare, Tags } from "lucide-react";
import { getCachedAdminProfile, getCurrentAdminProfile, signOutAdmin } from "../services/auth";

export function AdminLayout() {
  const location = useLocation();
  const isLoginRoute = location.pathname === "/admin/login";
  const cachedProfile = getCachedAdminProfile();
  const [isCheckingSession, setIsCheckingSession] = useState(
    !isLoginRoute && cachedProfile === undefined
  );
  const [isAuthenticated, setIsAuthenticated] = useState(
    isLoginRoute || Boolean(cachedProfile)
  );

  useEffect(() => {
    let isMounted = true;

    if (isLoginRoute) {
      setIsCheckingSession(false);
      setIsAuthenticated(true);
      return;
    }

    if (getCachedAdminProfile() !== undefined) {
      const profile = getCachedAdminProfile();
      setIsAuthenticated(Boolean(profile));
      setIsCheckingSession(false);
      if (!profile) {
        window.location.href = "/admin/login";
      }
      return;
    }

    setIsCheckingSession(true);
    getCurrentAdminProfile()
      .then((profile) => {
        if (!isMounted) return;
        setIsAuthenticated(Boolean(profile));
        if (!profile) {
          window.location.href = "/admin/login";
        }
      })
      .catch((error) => {
        console.error(error);
        if (isMounted) {
          setIsAuthenticated(false);
          window.location.href = "/admin/login";
        }
      })
      .finally(() => {
        if (isMounted) {
          setIsCheckingSession(false);
        }
      });

    return () => {
      isMounted = false;
    };
  }, [isLoginRoute]);

  // If it's the login page, don't show the sidebar
  if (location.pathname === "/admin/login") {
    return <Outlet />;
  }

  if (isCheckingSession) {
    return <div className="min-h-screen flex items-center justify-center bg-brand-ivory text-brand-black">Админ эрх шалгаж байна...</div>;
  }

  if (!isAuthenticated) {
    return null;
  }

  const navItems = [
    { name: "Хянах самбар", path: "/admin", icon: LayoutDashboard },
    { name: "Бүтээгдэхүүн", path: "/admin/products", icon: Package },
    { name: "Шинэ бүтээгдэхүүн", path: "/admin/products/new", icon: PlusSquare },
    { name: "Ангилал", path: "/admin/categories", icon: Tags },
    { name: "Хүсэлтүүд", path: "/admin/inquiries", icon: Inbox },
  ];

  return (
    <div className="min-h-screen bg-brand-ivory flex">
      {/* Sidebar */}
      <aside className="w-64 bg-brand-black text-brand-ivory flex-col hidden md:flex">
        <div className="h-20 flex items-center px-6 border-b border-brand-sand/20">
          <span className="text-xl font-bold text-brand-gold font-serif uppercase">Админ</span>
        </div>
        <nav className="flex-1 py-6 px-4 space-y-2">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.path || (item.path !== "/admin" && location.pathname.startsWith(item.path));
            return (
              <Link
                key={item.path}
                to={item.path}
                className={`flex items-center gap-3 px-4 py-3 rounded-sm transition-colors ${
                  isActive ? "bg-brand-brown text-white" : "text-brand-sand/70 hover:bg-brand-brown/50 hover:text-white"
                }`}
              >
                <Icon className="w-5 h-5" />
                <span className="font-medium">{item.name}</span>
              </Link>
            );
          })}
        </nav>
        <div className="p-4 border-t border-brand-sand/20">
          <button
            type="button"
            onClick={async () => {
              await signOutAdmin();
              window.location.href = "/admin/login";
            }}
            className="flex w-full items-center gap-3 px-4 py-3 rounded-sm text-brand-sand/70 hover:text-white transition-colors"
          >
            <LogOut className="w-5 h-5" />
            <span>Гарах</span>
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col min-h-screen overflow-hidden">
        {/* Admin Mobile Header */}
        <header className="md:hidden h-16 bg-white border-b border-brand-sand flex items-center px-4 justify-between">
          <span className="font-bold text-brand-brown">Админ</span>
          <Link to="/" className="text-sm text-brand-black/50">Сайт руу буцах</Link>
        </header>
        
        <div className="flex-1 overflow-auto p-4 md:p-8">
          <Outlet />
        </div>
      </main>
    </div>
  );
}
