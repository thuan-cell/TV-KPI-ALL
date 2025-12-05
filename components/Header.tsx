
import React, { useState, useEffect } from 'react';
import { Sun, Moon, ChevronDown, User, LogOut, Settings, Flame, BarChart3, Bell, Clock, CalendarDays, Search } from 'lucide-react';

interface HeaderProps {
  darkMode: boolean;
  toggleTheme: () => void;
  isLoggedIn: boolean;
  userProfile?: { name: string; role: string; avatar?: string };
  onLoginClick: () => void;
  onLogoutClick: () => void;
}

const Header: React.FC<HeaderProps> = ({ 
  darkMode, 
  toggleTheme, 
  isLoggedIn, 
  userProfile, 
  onLoginClick,
  onLogoutClick 
}) => {
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  // Format Date: Thứ Hai, 12/05/2025
  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('vi-VN', {
      weekday: 'long',
      day: '2-digit',
      month: '2-digit',
    }).format(date);
  };

  // Format Time: 14:30:45
  const formatTime = (date: Date) => {
    return new Intl.DateTimeFormat('vi-VN', {
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: false
    }).format(date);
  };

  return (
    // Floating Glass Header
    <header className="shrink-0 z-50 w-full no-print sticky top-0 py-3 transition-all duration-300 px-4 md:px-6 lg:px-8">
        <div className="max-w-[1800px] mx-auto h-[72px] flex items-center justify-between rounded-2xl bg-white/90 dark:bg-[#0f172a]/90 backdrop-blur-xl border border-white/50 dark:border-white/10 shadow-xl shadow-slate-200/50 dark:shadow-black/40 px-6 relative overflow-visible">
          
          {/* Decor: Top highlight */}
          <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-indigo-500/30 to-transparent"></div>

          {/* LEFT: Branding & Organization */}
          <div className="flex items-center gap-4">
              <div className="relative group cursor-pointer">
                  <div className="absolute -inset-3 bg-indigo-500/20 rounded-full blur-md opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                  <div className="relative w-12 h-12 rounded-xl bg-gradient-to-br from-slate-900 to-indigo-900 dark:from-indigo-600 dark:to-blue-700 text-white flex items-center justify-center shadow-lg shadow-indigo-900/20 ring-1 ring-black/5 dark:ring-white/20 group-hover:scale-105 transition-transform duration-300">
                      <Flame size={24} className="animate-pulse-slow text-orange-400" fill="currentColor" fillOpacity={1} strokeWidth={1.5} />
                  </div>
              </div>
              <div className="flex flex-col justify-center">
                  <div className="text-[10px] font-extrabold text-slate-400 dark:text-slate-500 uppercase tracking-[0.2em] leading-tight mb-0.5">
                      Tri Viet Biogen
                  </div>
                  <h1 className="text-xl font-black text-slate-800 dark:text-white uppercase tracking-tight leading-none flex items-center gap-1">
                      Boiler <span className="text-indigo-600 dark:text-indigo-400">KPI</span>
                  </h1>
              </div>
          </div>

          {/* CENTER: Live Clock & Date (Desktop Only) */}
          <div className="hidden lg:flex absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 items-center gap-6 px-6 py-2 rounded-full bg-slate-100/50 dark:bg-slate-800/50 border border-slate-200/50 dark:border-white/5 backdrop-blur-md shadow-inner">
             <div className="flex items-center gap-2">
                <CalendarDays size={14} className="text-slate-500 dark:text-slate-400" />
                <span className="text-xs font-bold text-slate-600 dark:text-slate-300 uppercase tracking-wide">
                  {formatDate(currentTime)}
                </span>
             </div>
             <div className="w-px h-3 bg-slate-300 dark:bg-slate-700"></div>
             <div className="flex items-center gap-2">
                <Clock size={14} className="text-indigo-500" />
                <span className="text-xs font-black text-slate-800 dark:text-white tabular-nums tracking-widest">
                  {formatTime(currentTime)}
                </span>
             </div>
          </div>
          
          {/* RIGHT: Actions */}
          <div className="flex items-center gap-3">
            
            {/* Notification Bell (Visual Only) */}
            {isLoggedIn && (
               <button className="relative p-2.5 rounded-xl text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-all hover:text-indigo-600 dark:hover:text-indigo-400 border border-transparent hover:border-slate-200 dark:hover:border-slate-700 group">
                  <Bell size={20} strokeWidth={2} />
                  <span className="absolute top-2.5 right-2.5 w-2 h-2 bg-rose-500 rounded-full border-2 border-white dark:border-[#0f172a] group-hover:scale-110 transition-transform"></span>
               </button>
            )}

            {/* Theme Toggle */}
            <button 
                onClick={toggleTheme}
                className="p-2.5 rounded-xl text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-all hover:text-indigo-500 dark:hover:text-indigo-400 border border-transparent hover:border-slate-200 dark:hover:border-slate-700 active:scale-95"
                title="Đổi giao diện"
            >
                {darkMode ? <Sun size={20} strokeWidth={2} /> : <Moon size={20} strokeWidth={2} />}
            </button>

            <div className="h-8 w-px bg-slate-200 dark:bg-white/10 hidden md:block mx-1"></div>

            {/* Login / User Profile */}
            <div>
                {isLoggedIn && userProfile ? (
                    <div className="flex items-center gap-3 group cursor-pointer relative pl-1">
                        <div className="text-right hidden md:block">
                            <div className="text-sm font-bold text-slate-800 dark:text-white leading-tight">{userProfile.name}</div>
                        </div>
                        <div className="w-11 h-11 rounded-full bg-slate-200 dark:bg-slate-800 overflow-hidden border-2 border-white dark:border-slate-700 shadow-md transition-transform group-hover:scale-105 group-hover:border-indigo-500/50 relative">
                            {userProfile.avatar ? (
                                <img src={userProfile.avatar} alt="User" className="w-full h-full object-cover" />
                            ) : (
                                <div className="w-full h-full flex items-center justify-center bg-indigo-100 dark:bg-indigo-900/30 text-indigo-600">
                                    <User size={20} />
                                </div>
                            )}
                        </div>
                        
                        {/* Dropdown */}
                        <div className="absolute top-full right-0 mt-5 w-60 bg-white dark:bg-[#0f172a] rounded-2xl shadow-2xl border border-slate-100 dark:border-white/10 p-2 hidden group-hover:block animate-in fade-in slide-in-from-top-2 duration-200 backdrop-blur-3xl z-[60]">
                             {/* Mobile Name View */}
                             <div className="px-4 py-3 border-b border-slate-100 dark:border-white/5 md:hidden">
                                <p className="text-sm font-bold text-slate-900 dark:text-white">{userProfile.name}</p>
                             </div>
                             
                             <div className="p-2 space-y-1">
                                <button className="w-full flex items-center gap-3 px-3 py-2.5 text-xs font-bold text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 rounded-xl transition-colors">
                                    <Settings size={16} className="text-slate-400" /> Cài đặt tài khoản
                                </button>
                                <button className="w-full flex items-center gap-3 px-3 py-2.5 text-xs font-bold text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 rounded-xl transition-colors">
                                    <BarChart3 size={16} className="text-slate-400" /> Lịch sử đánh giá
                                </button>
                             </div>

                             <div className="h-px bg-slate-100 dark:bg-white/5 my-1 mx-2"></div>
                             
                             <div className="p-2">
                                <button 
                                    onClick={onLogoutClick}
                                    className="w-full flex items-center gap-3 px-3 py-2.5 text-xs font-bold text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-900/20 rounded-xl transition-colors"
                                >
                                    <LogOut size={16} /> Đăng xuất
                                </button>
                             </div>
                        </div>
                    </div>
                ) : (
                    <button 
                        onClick={onLoginClick}
                        className="flex items-center gap-2 px-6 py-3 rounded-xl bg-slate-900 dark:bg-indigo-600 text-white text-xs font-bold hover:bg-slate-800 dark:hover:bg-indigo-500 transition-all shadow-lg shadow-indigo-500/20 active:scale-95 group"
                    >
                        <span>Đăng Nhập</span>
                        <ChevronDown size={14} className="-rotate-90 group-hover:rotate-0 transition-transform duration-300" />
                    </button>
                )}
            </div>
          </div>
        </div>
    </header>
  );
};

export default Header;
