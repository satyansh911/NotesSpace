'use client';
import Link from 'next/link';

import { motion, AnimatePresence } from 'framer-motion';
import { usePathname } from 'next/navigation';
import { useState, useEffect } from 'react';
import { getMe, logout } from '@/lib/actions/auth';

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [user, setUser] = useState<{ id: string; email: string } | null>(null);
  const [isProfileOpen, setIsProfileOpen] = useState(false);

  useEffect(() => {
    async function loadUser() {
      const userData = await getMe();
      setUser(userData);
    }
    loadUser();
  }, []);

  const handleLogout = async () => {
    await logout();
  };

  const navItems = [
    { href: '/dashboard', icon: 'folder', label: 'All Notes' },
    { href: '/dashboard/shared', icon: 'group', label: 'Shared' },
    { href: '/dashboard/favorites', icon: 'star', label: 'Favorites' },
    { href: '/dashboard/archive', icon: 'archive', label: 'Archive' },
    { href: '/dashboard/trash', icon: 'delete', label: 'Trash' },
  ];

  const userInitial = user?.email?.[0]?.toUpperCase() || '?';
  const userName = user?.email?.split('@')[0] || 'User';

  return (
    <div className="text-on-surface font-body-md text-body-md selection:bg-secondary-fixed-dim bg-background min-h-screen">
      {/* TopAppBar */}
      <header className="fixed top-0 w-full z-50 flex items-center justify-between px-margin-mobile h-16 bg-white/80 dark:bg-black/20 backdrop-blur-xl shadow-[inset_0_1px_1px_rgba(0,122,255,0.15)] md:px-margin-desktop">
        <div className="flex items-center gap-4">
          <button className="active:scale-95 duration-200 hover:opacity-80 transition-opacity md:hidden">
            <span className="material-symbols-outlined text-primary">menu</span>
          </button>
          <h1 className="font-display-lg text-display-lg-mobile md:text-headline-sm md:font-headline-sm text-primary tracking-tight">NotesSpace</h1>
        </div>
        
        {user && (
          <div className="flex items-center gap-5 relative">
             <div className="text-right hidden sm:block">
                <p className="font-semibold text-primary text-sm tracking-tight">{userName}</p>
                <p className="text-on-surface-variant/50 text-[11px] font-label-caps tracking-wider">PREMIUM WORKSPACE</p>
             </div>
             <motion.div 
               whileHover={{ scale: 1.05, rotate: 5 }}
               whileTap={{ scale: 0.95 }}
               onClick={() => setIsProfileOpen(!isProfileOpen)}
               className="w-10 h-10 md:w-12 md:h-12 rounded-2xl bg-secondary-container flex items-center justify-center text-white font-bold shadow-lg shadow-secondary/10 cursor-pointer"
             >
               {userInitial}
             </motion.div>
             
             <AnimatePresence>
               {isProfileOpen && (
                 <motion.div 
                   initial={{ opacity: 0, y: 10, scale: 0.95 }}
                   animate={{ opacity: 1, y: 0, scale: 1 }}
                   exit={{ opacity: 0, y: 10, scale: 0.95 }}
                   className="absolute right-0 top-16 w-48 glass-card bg-white p-2 rounded-2xl shadow-2xl z-50"
                 >
                   <button 
                     onClick={handleLogout}
                     className="w-full text-left px-4 py-3 rounded-xl hover:bg-red-50 text-red-600 text-sm font-medium flex items-center gap-3 transition-colors"
                   >
                     <span className="material-symbols-outlined text-sm">logout</span>
                     Logout
                   </button>
                 </motion.div>
               )}
             </AnimatePresence>
          </div>
        )}
      </header>

      {/* Desktop Navigation Drawer (Hidden on mobile) */}
      <aside className="hidden md:flex fixed inset-y-0 left-0 z-[60] flex-col p-8 h-full w-80 rounded-r-[40px] bg-surface dark:bg-surface-container border-r border-on-surface/10">
        <div className="mb-12 flex items-center gap-4 mt-12">
          <div className="w-12 h-12 rounded-full bg-secondary-container flex items-center justify-center text-white font-bold text-lg">
            {userInitial}
          </div>
          <div>
            <h4 className="font-headline-sm text-headline-sm text-primary truncate max-w-[160px]">{userName}</h4>
            <p className="font-body-md text-on-surface-variant text-sm">Personal Workspace</p>
          </div>
        </div>
        <motion.nav 
          initial="initial"
          animate="animate"
          variants={{
            animate: { transition: { staggerChildren: 0.1 } }
          }}
          className="flex-1 space-y-2"
        >
          {navItems.map((item, i) => {
            const isActive = pathname === item.href;
            return (
              <motion.div
                key={i}
                variants={{
                  initial: { opacity: 0, x: -20 },
                  animate: { opacity: 1, x: 0 }
                }}
              >
                <Link 
                  href={item.href} 
                  className={`flex items-center gap-4 p-4 rounded-xl hover:pl-6 transition-all duration-300 group ${isActive ? 'bg-secondary/10 text-secondary font-semibold' : 'text-on-surface-variant hover:bg-surface-container-low'}`}
                >
                  <span className="material-symbols-outlined group-hover:scale-110 transition-transform" style={{fontVariationSettings: isActive ? "'FILL' 1" : ""}}>{item.icon}</span>
                  <span>{item.label}</span>
                </Link>
              </motion.div>
            );
          })}
        </motion.nav>
        <div className="mt-auto pt-8 border-t border-on-surface/5">
          <div className="glass-card bg-surface-container p-6 rounded-3xl">
            <p className="font-label-caps text-[10px] text-on-surface-variant uppercase mb-2 tracking-widest">Workspace Status</p>
            <div className="flex items-center gap-2 mb-2">
              <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
              <p className="text-[10px] text-on-surface-variant font-medium">Fully Synchronized</p>
            </div>
            <p className="text-[9px] text-on-surface-variant/60 leading-tight">Your data is secured with end-to-end encryption.</p>
          </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="md:pl-80 pt-16 pb-24 md:pb-8 h-screen overflow-y-auto">
        {children}
      </div>

      {/* BottomNavBar */}
      <nav className="fixed bottom-0 left-0 w-full z-50 flex justify-around items-center px-6 pb-6 pt-4 bg-white/80 dark:bg-black/20 backdrop-blur-2xl shadow-[0_-8px_40px_rgba(0,0,0,0.04)] md:hidden rounded-t-[40px]">
        {navItems.slice(0, 4).map((item, i) => {
          const isActive = pathname === item.href;
          return (
            <Link 
              key={i}
              href={item.href} 
              className={`flex flex-col items-center justify-center transition-all active:scale-90 duration-300 ${isActive ? 'bg-secondary-container text-on-secondary-container rounded-full px-5 py-2' : 'text-on-surface-variant hover:bg-surface-container-high/50'}`}
            >
              <span className="material-symbols-outlined" style={{fontVariationSettings: isActive ? "'FILL' 1" : ""}}>{item.icon === 'folder' ? 'description' : item.icon === 'group' ? 'group' : item.icon === 'star' ? 'star' : 'archive'}</span>
              <span className="font-label-caps text-[10px] mt-1">{item.label}</span>
            </Link>
          );
        })}
      </nav>
    </div>
  );
}

