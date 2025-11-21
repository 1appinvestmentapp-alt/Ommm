import React from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Home, PieChart, Wallet, History, LogOut, Settings, User as UserIcon, Menu, Share2, Users, Clock } from 'lucide-react';
import { Role, User } from '../types';
import { setSession } from '../services/storage';

interface LayoutProps {
  children: React.ReactNode;
  user: User;
  setUser: (u: User | null) => void;
}

const Layout: React.FC<LayoutProps> = ({ children, user, setUser }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = React.useState(false);

  const handleLogout = () => {
    setSession(null);
    setUser(null);
    navigate('/login');
  };

  const isAdmin = user.role === Role.ADMIN;

  // --- ADMIN LAYOUT (Sidebar) ---
  if (isAdmin) {
      const NavItem = ({ to, icon: Icon, label }: { to: string; icon: any; label: string }) => {
        const active = location.pathname === to;
        return (
          <Link
            to={to}
            onClick={() => setMobileMenuOpen(false)}
            className={`flex items-center gap-3 px-4 py-3 rounded-lg mb-1 transition-colors ${
              active 
                ? 'bg-apso-gold text-apso-dark font-bold shadow-md' 
                : 'text-gray-300 hover:bg-white/10 hover:text-white'
            }`}
          >
            <Icon className="w-5 h-5" />
            <span>{label}</span>
          </Link>
        );
      };

      return (
        <div className="min-h-screen bg-slate-50 flex font-sans">
          <aside className="hidden md:flex w-64 bg-apso-dark flex-col fixed h-full z-10">
            <div className="p-6 border-b border-white/10">
                <h1 className="text-2xl font-bold text-white tracking-tight">
                    APSO<span className="text-apso-gold">.</span>
                </h1>
                <p className="text-xs text-gray-400 mt-1">Admin Panel</p>
            </div>
            <nav className="flex-1 p-4 mt-4">
                 <div className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3 px-4">Admin</div>
                 <NavItem to="/admin" icon={PieChart} label="Dashboard" />
                 <NavItem to="/admin/users" icon={UserIcon} label="Users" />
                 <NavItem to="/admin/transactions" icon={History} label="Transactions" />
                 <NavItem to="/admin/plans" icon={Wallet} label="Manage Plans" />
            </nav>
            <div className="p-4 border-t border-white/10">
                <button onClick={handleLogout} className="flex items-center gap-3 px-4 py-3 text-red-400 hover:bg-white/5 w-full rounded-lg transition-colors">
                    <LogOut className="w-5 h-5" />
                    <span>Sign Out</span>
                </button>
            </div>
          </aside>

          {/* Mobile Header for Admin */}
          <div className="md:hidden fixed top-0 w-full bg-apso-dark z-20 flex items-center justify-between p-4 shadow-md">
              <h1 className="text-xl font-bold text-white">APSO Admin</h1>
              <button onClick={() => setMobileMenuOpen(!mobileMenuOpen)} className="text-white">
                <Menu className="w-6 h-6" />
              </button>
          </div>

          {/* Admin Mobile Menu Overlay */}
          {mobileMenuOpen && (
            <div className="fixed inset-0 bg-apso-dark z-30 flex flex-col p-6 md:hidden">
                <div className="flex justify-between items-center mb-8">
                     <h2 className="text-2xl font-bold text-white">Menu</h2>
                     <button onClick={() => setMobileMenuOpen(false)} className="text-white"><X className="w-6 h-6" /></button>
                </div>
                 <nav className="flex-1">
                    <NavItem to="/admin" icon={PieChart} label="Dashboard" />
                    <NavItem to="/admin/users" icon={UserIcon} label="Users" />
                    <NavItem to="/admin/transactions" icon={History} label="Transactions" />
                    <NavItem to="/admin/plans" icon={Wallet} label="Plans" />
                </nav>
                <button onClick={handleLogout} className="flex items-center gap-3 px-4 py-3 text-red-400 bg-white/5 rounded-lg mt-4">
                    <LogOut className="w-5 h-5" />
                    <span>Sign Out</span>
                </button>
            </div>
          )}

          <main className="flex-1 md:ml-64 p-4 md:p-8 pt-20 md:pt-8 overflow-y-auto">
            <div className="max-w-6xl mx-auto">
                {children}
            </div>
          </main>
        </div>
      );
  }

  // --- USER LAYOUT (Bottom Nav) ---
  const NavBtn = ({ to, icon: Icon, label }: { to: string; icon: any; label: string }) => {
      const active = location.pathname === to;
      return (
        <Link to={to} className="flex flex-col items-center justify-center w-full py-2 transition-colors">
            <Icon className={`w-5 h-5 mb-1 ${active ? 'text-apso-dark fill-current' : 'text-gray-400'}`} />
            <span className={`text-[10px] font-medium ${active ? 'text-apso-dark' : 'text-gray-400'}`}>{label}</span>
        </Link>
      );
  };

  return (
    <div className="min-h-screen bg-slate-50 font-sans pb-24 relative">
      {/* Top Header */}
      <div className="bg-apso-dark text-white p-4 sticky top-0 z-20 shadow-md flex justify-between items-center">
          <h1 className="text-xl font-bold">APSO<span className="text-apso-gold">.</span></h1>
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-white/10 rounded-full flex items-center justify-center text-xs font-bold text-apso-gold">
                {user.fullName.charAt(0)}
            </div>
          </div>
      </div>

      {/* Main Content */}
      <main className="p-4 max-w-lg mx-auto">
        {children}
      </main>

      {/* Fixed Bottom Navigation */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 flex justify-between items-center px-1 py-1 shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.05)] z-30 pb-safe">
        <NavBtn to="/dashboard" icon={Home} label="Home" />
        <NavBtn to="/referral" icon={Share2} label="Referral" />
        <NavBtn to="/team" icon={Users} label="Team" />
        <NavBtn to="/history" icon={Clock} label="History" />
        <NavBtn to="/profile" icon={UserIcon} label="Profile" />
      </div>
      
    </div>
  );
};

function X(props: any) {
    return (
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><path d="M18 6 6 18"/><path d="m6 6 18 18"/></svg>
    )
}

export default Layout;