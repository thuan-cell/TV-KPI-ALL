
import React, { useState, useCallback, useEffect, useMemo } from 'react';
import InputSection from './components/InputSection';
import ResultsPanel from './components/ResultsPanel';
import Header from './components/Header';
import LandingPage from './components/LandingPage';
import { EvaluationState, RatingLevel, EmployeeInfo } from './types';
import { getKPIDataByRole, RoleType, ROLE_NAMES } from './constants';
import { User, CreditCard, Upload, Printer, X, Calendar, Award, Star, ShieldCheck, AlertOctagon, ArrowRight, LayoutGrid } from 'lucide-react';
import DashboardReport from './components/DashboardReport';
import { authService, UserAccount } from './services/authService';

function App() {
  const [ratings, setRatings] = useState<EvaluationState>({});
  const [selectedMonth, setSelectedMonth] = useState<string>(new Date().toISOString().slice(0, 7));
  
  const [darkMode, setDarkMode] = useState(() => {
    if (typeof window !== 'undefined') {
      return document.documentElement.classList.contains('dark');
    }
    return true;
  });
  
  const [companyLogo, setCompanyLogo] = useState<string | null>(null);
  
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [currentUser, setCurrentUser] = useState<{name: string, role: string, avatar?: string} | undefined>(undefined);
  
  // Navigation State
  const [currentRole, setCurrentRole] = useState<RoleType | null>(null);
  
  const [showPreview, setShowPreview] = useState(false);
  
  const [employeeInfo, setEmployeeInfo] = useState<EmployeeInfo>({
    name: '',
    id: '',
    position: '',
    department: '',
    reportDate: new Date().toISOString().slice(0, 10)
  });

  useEffect(() => {
    const sessionUser = authService.getCurrentUser();
    if (sessionUser) {
      handleLoginSuccess(sessionUser);
    }
  }, []);

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  }, [darkMode]);

  const toggleTheme = () => {
    setDarkMode(!darkMode);
  };

  const handleLoginSuccess = (user: UserAccount) => {
    setIsLoggedIn(true);
    setCurrentUser({ 
      name: user.fullName, 
      role: user.role, 
      avatar: user.avatar 
    });
  };

  const handleLogout = () => {
    authService.logout();
    setIsLoggedIn(false);
    setCurrentUser(undefined);
    setCurrentRole(null);
    setEmployeeInfo(prev => ({
        ...prev,
        name: '',
        id: '',
        position: '',
        department: ''
    }));
    setRatings({});
  };

  const handleRoleSelect = (role: RoleType) => {
    setCurrentRole(role);
    // Reset ratings when changing role
    setRatings({});
    // Update basic info based on role for convenience
    setEmployeeInfo(prev => ({
        ...prev,
        position: ROLE_NAMES[role].split('/')[0].trim(),
        department: role === RoleType.ACCOUNTANT ? 'Phòng Kế Toán' : 'Phân Xưởng Vận Hành'
    }));
  };

  const handleBackToMenu = () => {
      // In new design, we don't necessarily "go back" since menu is always on right,
      // but we can clear the selection to show the instruction placeholder
      setCurrentRole(null);
  };

  const handleRate = useCallback((id: string, level: RatingLevel, score: number) => {
    setRatings(prev => ({
      ...prev,
      [id]: {
        ...prev[id],
        level,
        actualScore: score,
        notes: prev[id]?.notes || ''
      }
    }));
  }, []);

  const handleNoteChange = useCallback((id: string, note: string) => {
    setRatings(prev => ({
      ...prev,
      [id]: {
        ...prev[id],
        notes: note
      }
    }));
  }, []);

  const handleInfoChange = (field: keyof EmployeeInfo, value: string) => {
    setEmployeeInfo(prev => ({ ...prev, [field]: value }));
  };

  const handleLogoUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setCompanyLogo(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  // If no role selected, use Manager data for the result preview circle
  const activeKPIData = useMemo(() => {
    if (currentRole) return getKPIDataByRole(currentRole);
    return getKPIDataByRole(RoleType.MANAGER);
  }, [currentRole]);

  const { categoryScores, totalScore, maxTotalScore, percent, ranking, penaltyApplied } = useMemo(() => {
    let totalScore = 0;
    let maxTotalScore = 0;
    let penaltyApplied = false;
    
    const categoryScores = activeKPIData.map(cat => {
      let catScore = 0;
      let catMax = 0;
      cat.items.forEach(item => {
        catMax += item.maxPoints;
        if (ratings[item.id]) {
          catScore += ratings[item.id].actualScore;
          if (ratings[item.id].level === RatingLevel.WEAK) {
            penaltyApplied = true;
          }
        }
      });
      
      catScore = Math.round(catScore * 100) / 100;
      totalScore += catScore;
      maxTotalScore += catMax;
      
      const percentage = catMax > 0 ? Math.round((catScore / catMax) * 100) : 0;
      
      let shortName = cat.name.split('.')[1]?.trim() || cat.name;
      const lowerName = cat.name.toLowerCase();

      if (lowerName.includes("vận hành")) shortName = "Vận hành";
      else if (lowerName.includes("an toàn")) shortName = "An toàn";
      else if (lowerName.includes("thiết bị")) shortName = "Thiết bị";
      else if (lowerName.includes("nhân sự")) shortName = "Nhân sự";
      else if (lowerName.includes("báo cáo")) shortName = "Báo cáo";
      else if (lowerName.includes("kỷ luật")) shortName = "Kỷ luật";
      else if (lowerName.includes("chuyên môn")) shortName = "Chuyên môn";

      return { 
        id: cat.id,
        name: cat.name, 
        shortName: shortName,
        score: catScore, 
        max: catMax, 
        percentage: percentage
      };
    });

    if (penaltyApplied) {
        totalScore -= 30;
    }
    if (totalScore < 0) totalScore = 0;

    totalScore = Math.round(totalScore * 100) / 100;
    const percent = maxTotalScore > 0 ? (totalScore / maxTotalScore) * 100 : 0;
    
    let ranking = "---";
    if (totalScore > 0 || penaltyApplied) {
        if (totalScore >= 90) ranking = "Xuất Sắc";
        else if (totalScore >= 70) ranking = "Đạt Yêu Cầu";
        else ranking = "Không Đạt";
    }

    return { categoryScores, totalScore, maxTotalScore, percent, ranking, penaltyApplied };
  }, [ratings, activeKPIData]);

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="min-h-screen xl:h-screen flex flex-col bg-slate-50 dark:bg-[#020617] text-slate-900 dark:text-slate-100 font-sans selection:bg-indigo-500/30 print:bg-white transition-colors duration-500 xl:overflow-hidden relative overflow-x-hidden">
      
      {isLoggedIn && (
        <div className="fixed inset-0 z-0 overflow-hidden pointer-events-none no-print">
           <div className="absolute top-[-20%] left-[20%] w-[1000px] h-[600px] bg-indigo-500/10 dark:bg-indigo-600/10 rounded-full blur-[100px] mix-blend-multiply dark:mix-blend-screen opacity-60"></div>
           <div className="absolute bottom-[-20%] right-[-10%] w-[1000px] h-[800px] bg-blue-500/10 dark:bg-blue-600/5 rounded-full blur-[120px] mix-blend-multiply dark:mix-blend-screen opacity-50"></div>
        </div>
      )}

      {isLoggedIn && (
        <Header 
          darkMode={darkMode}
          toggleTheme={toggleTheme}
          isLoggedIn={isLoggedIn}
          userProfile={currentUser}
          onLoginClick={() => {}}
          onLogoutClick={handleLogout}
          showBackButton={!!currentRole}
          onBackToMenu={handleBackToMenu}
        />
      )}

      <main className="flex-1 relative z-10 w-full max-w-[1920px] mx-auto xl:overflow-hidden flex flex-col">
        {!isLoggedIn ? (
          <LandingPage onLoginSuccess={handleLoginSuccess} />
        ) : (
          /* Main Dashboard Split View */
          <div className="flex flex-col xl:flex-row xl:h-full h-auto p-4 md:p-6 gap-4 xl:gap-6">
            
            {/* Left Panel: Input Form OR Welcome Placeholder */}
            <div className={`flex-1 order-2 xl:order-1 no-print min-w-0 xl:h-full h-auto flex flex-col transition-all duration-500`}>
              
              {!currentRole ? (
                 /* 1. WELCOME / INSTRUCTION PLACEHOLDER */
                 <div className="w-full h-full bg-slate-900/5 dark:bg-[#0f172a]/40 backdrop-blur-xl rounded-[32px] border-2 border-white/40 dark:border-white/5 shadow-2xl relative overflow-hidden animate-in fade-in zoom-in-95 duration-500 flex flex-col items-center justify-center text-center p-8">
                    {/* Decorative Background */}
                    <div className="absolute inset-0 overflow-hidden">
                        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-indigo-500/10 rounded-full blur-3xl animate-pulse-slow"></div>
                        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl animate-pulse-slow" style={{animationDelay: '1s'}}></div>
                    </div>
                    
                    <div className="relative z-10 max-w-lg">
                        <div className="w-20 h-20 mx-auto bg-gradient-to-br from-indigo-500 to-blue-600 rounded-3xl flex items-center justify-center shadow-2xl shadow-indigo-500/30 mb-8 rotate-3">
                            <LayoutGrid size={40} className="text-white" />
                        </div>
                        <h2 className="text-3xl md:text-4xl font-black text-slate-800 dark:text-white mb-4 tracking-tight">
                            Chọn Vị Trí Đánh Giá
                        </h2>
                        <p className="text-slate-500 dark:text-slate-400 text-lg font-medium leading-relaxed mb-8">
                            Vui lòng chọn một vị trí công việc từ menu vòng tròn <span className="hidden xl:inline">bên phải</span><span className="xl:hidden">bên dưới</span> để bắt đầu quy trình đánh giá KPI.
                        </p>
                        <div className="flex items-center justify-center gap-2 text-indigo-500 font-bold uppercase tracking-widest text-xs animate-bounce">
                            <span>Menu Bên Phải</span>
                            <ArrowRight size={16} />
                        </div>
                    </div>
                 </div>
              ) : (
                 /* 2. INPUT FORM (Scrollable) */
                 <div className="xl:h-full xl:overflow-y-auto scroll-smooth custom-scrollbar pr-1">
                    <div className="space-y-6 md:space-y-8 pb-10 animate-in fade-in slide-in-from-right-4 duration-300">
                        {/* User Info Card */}
                        <div className="group relative bg-white/80 dark:bg-[#0f172a]/60 backdrop-blur-xl rounded-[24px] shadow-xl shadow-slate-200/50 dark:shadow-black/20 border border-white/50 dark:border-white/5 overflow-hidden transition-all duration-500 hover:shadow-2xl hover:border-indigo-500/30">
                        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 shadow-[0_0_15px_rgba(99,102,241,0.5)]"></div>

                        <div className="px-5 py-5 md:px-8 md:py-6 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 relative z-10 bg-gradient-to-b from-white/50 to-transparent dark:from-white/5 dark:to-transparent border-b border-slate-100 dark:border-white/5">
                            <div className="flex items-center gap-4 md:gap-5">
                            <div className="flex items-center justify-center w-12 h-12 md:w-14 md:h-14 rounded-2xl bg-gradient-to-br from-indigo-50 to-white dark:from-indigo-950/50 dark:to-slate-900 text-indigo-600 dark:text-indigo-400 shadow-inner border border-white/60 dark:border-white/10 shrink-0">
                                <User size={24} strokeWidth={2} className="md:w-[26px] md:h-[26px]" />
                            </div>
                            <div>
                                <h2 className="text-lg md:text-xl font-bold text-slate-800 dark:text-white leading-tight">Thông tin nhân sự</h2>
                                <p className="text-xs md:text-sm text-slate-500 dark:text-slate-400 font-medium mt-0.5 tracking-wide flex items-center gap-1">
                                    Biểu mẫu đánh giá: <span className="text-indigo-600 dark:text-indigo-400 font-bold uppercase">{ROLE_NAMES[currentRole]}</span>
                                </p>
                            </div>
                            </div>
                            
                            <div className="relative self-start md:self-auto">
                            <input type="file" id="logo-upload" accept="image/*" className="hidden" onChange={handleLogoUpload} />
                            <label 
                                htmlFor="logo-upload" 
                                className="cursor-pointer group/btn flex items-center gap-2 text-[10px] md:text-[11px] font-bold uppercase tracking-wide bg-white dark:bg-slate-800/80 hover:bg-indigo-50 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300 px-4 py-2.5 md:px-5 md:py-3 rounded-xl transition-all border border-slate-200 dark:border-slate-700 hover:border-indigo-400 dark:hover:border-indigo-500 hover:text-indigo-600 dark:hover:text-indigo-400 shadow-sm backdrop-blur-sm"
                            >
                                {companyLogo ? (
                                <>
                                    <div className="w-5 h-5 rounded-full overflow-hidden border border-slate-200 bg-white flex items-center justify-center">
                                    <img src={companyLogo} alt="Logo" className="w-full h-full object-cover" />
                                    </div>
                                    <span className="text-emerald-600 dark:text-emerald-400 hidden sm:inline">Đã tải Logo</span>
                                    <span className="text-emerald-600 dark:text-emerald-400 sm:hidden">Xong</span>
                                </>
                                ) : (
                                <>
                                    <Upload size={16} />
                                    <span>Tải Logo</span>
                                </>
                                )}
                            </label>
                            </div>
                        </div>

                        <div className="p-5 md:p-8 grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5 md:gap-6 relative z-10">
                            <div className="space-y-2">
                                <label className="text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wide ml-1">Họ và tên nhân viên</label>
                                <div className="relative group/input">
                                    <User className="absolute left-4 top-3.5 text-slate-400 group-focus-within/input:text-indigo-500 transition-colors" size={18} />
                                    <input 
                                        type="text"
                                        placeholder="Nhập họ tên đầy đủ..."
                                        className="w-full bg-slate-50 dark:bg-[#0f172a]/80 border border-slate-200 dark:border-slate-800 rounded-xl py-3 pl-12 pr-4 text-sm font-semibold focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 outline-none transition-all dark:text-white placeholder:text-slate-400 shadow-inner"
                                        value={employeeInfo.name}
                                        onChange={e => handleInfoChange('name', e.target.value)}
                                    />
                                </div>
                            </div>
                            <div className="space-y-2">
                                <label className="text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wide ml-1">Mã nhân viên</label>
                                <div className="relative group/input">
                                    <CreditCard className="absolute left-4 top-3.5 text-slate-400 group-focus-within/input:text-indigo-500 transition-colors" size={18} />
                                    <input 
                                        type="text"
                                        placeholder="VD: NV-001"
                                        className="w-full bg-slate-50 dark:bg-[#0f172a]/80 border border-slate-200 dark:border-slate-800 rounded-xl py-3 pl-12 pr-4 text-sm font-semibold focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 outline-none transition-all dark:text-white placeholder:text-slate-400 shadow-inner"
                                        value={employeeInfo.id}
                                        onChange={e => handleInfoChange('id', e.target.value)}
                                    />
                                </div>
                            </div>
                            <div className="space-y-2">
                                <label className="text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wide ml-1">Chức vụ</label>
                                <div className="relative group/input">
                                    <CreditCard className="absolute left-4 top-3.5 text-slate-400 group-focus-within/input:text-indigo-500 transition-colors" size={18} />
                                    <input 
                                        type="text"
                                        placeholder="VD: Trưởng ca / Nhân viên"
                                        className="w-full bg-slate-50 dark:bg-[#0f172a]/80 border border-slate-200 dark:border-slate-800 rounded-xl py-3 pl-12 pr-4 text-sm font-semibold focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 outline-none transition-all dark:text-white placeholder:text-slate-400 shadow-inner"
                                        value={employeeInfo.position}
                                        onChange={e => handleInfoChange('position', e.target.value)}
                                    />
                                </div>
                            </div>
                            <div className="space-y-2">
                                <label className="text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wide ml-1">Bộ phận / Phòng ban</label>
                                <div className="relative group/input">
                                    <CreditCard className="absolute left-4 top-3.5 text-slate-400 group-focus-within/input:text-indigo-500 transition-colors" size={18} />
                                    <input 
                                        type="text"
                                        placeholder="VD: Vận Hành Lò Hơi"
                                        className="w-full bg-slate-50 dark:bg-[#0f172a]/80 border border-slate-200 dark:border-slate-800 rounded-xl py-3 pl-12 pr-4 text-sm font-semibold focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 outline-none transition-all dark:text-white placeholder:text-slate-400 shadow-inner"
                                        value={employeeInfo.department}
                                        onChange={e => handleInfoChange('department', e.target.value)}
                                    />
                                </div>
                            </div>
                            <div className="space-y-2">
                                <label className="text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wide ml-1">Kỳ đánh giá</label>
                                <div className="relative group/input">
                                    <input 
                                        type="month"
                                        className="w-full bg-slate-50 dark:bg-[#0f172a]/80 border border-slate-200 dark:border-slate-800 rounded-xl py-3 pl-12 pr-4 text-sm font-semibold focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 outline-none transition-all dark:text-white shadow-inner cursor-pointer [&::-webkit-calendar-picker-indicator]:absolute [&::-webkit-calendar-picker-indicator]:w-full [&::-webkit-calendar-picker-indicator]:h-full [&::-webkit-calendar-picker-indicator]:opacity-0 [&::-webkit-calendar-picker-indicator]:top-0 [&::-webkit-calendar-picker-indicator]:left-0"
                                        value={selectedMonth}
                                        onChange={(e) => setSelectedMonth(e.target.value)}
                                        onClick={(e) => {try{e.currentTarget.showPicker()}catch(err){}}}
                                    />
                                    <Calendar className="absolute left-4 top-3.5 text-slate-500 dark:text-white pointer-events-none" size={18} />
                                </div>
                            </div>
                            <div className="space-y-2">
                                <label className="text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wide ml-1">Ngày lập</label>
                                <div className="relative group/input">
                                    <input 
                                        type="date"
                                        className="w-full bg-slate-50 dark:bg-[#0f172a]/80 border border-slate-200 dark:border-slate-800 rounded-xl py-3 pl-12 pr-4 text-sm font-semibold focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 outline-none transition-all dark:text-white shadow-inner cursor-pointer [&::-webkit-calendar-picker-indicator]:absolute [&::-webkit-calendar-picker-indicator]:w-full [&::-webkit-calendar-picker-indicator]:h-full [&::-webkit-calendar-picker-indicator]:opacity-0 [&::-webkit-calendar-picker-indicator]:top-0 [&::-webkit-calendar-picker-indicator]:left-0"
                                        value={employeeInfo.reportDate}
                                        onChange={(e) => handleInfoChange('reportDate', e.target.value)}
                                        onClick={(e) => {try{e.currentTarget.showPicker()}catch(err){}}}
                                    />
                                    <Calendar className="absolute left-4 top-3.5 text-slate-500 dark:text-white pointer-events-none" size={18} />
                                </div>
                            </div>
                        </div>
                        </div>

                        <InputSection 
                        ratings={ratings} 
                        onRate={handleRate} 
                        onNoteChange={handleNoteChange}
                        kpiData={activeKPIData}
                        />

                        <div className="bg-white/80 dark:bg-[#0f172a]/60 backdrop-blur-xl rounded-[24px] shadow-sm hover:shadow-xl border border-white/60 dark:border-white/5 overflow-hidden transition-all duration-300">
                        
                        {/* Header */}
                        <div className="px-5 py-4 border-b border-slate-100 dark:border-white/5 flex items-center gap-3 bg-slate-50/50 dark:bg-slate-900/30">
                            <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-indigo-50 dark:bg-indigo-950/40 text-indigo-600 dark:text-indigo-400 border border-indigo-100 dark:border-indigo-500/20 shadow-inner shrink-0">
                            <Award size={20} strokeWidth={2.5} />
                            </div>
                            <div>
                                <h3 className="text-sm font-bold text-slate-800 dark:text-white uppercase tracking-tight">Tiêu chuẩn xếp loại</h3>
                            </div>
                        </div>

                        {/* Grid Content - Compact & Modern */}
                        <div className="p-4 grid grid-cols-1 md:grid-cols-3 gap-3">
                            
                            {/* Item 1: Xuất Sắc */}
                            <div className="relative group p-4 rounded-xl border border-emerald-100 dark:border-emerald-500/20 bg-emerald-50/40 dark:bg-emerald-950/20 hover:bg-emerald-100/60 dark:hover:bg-emerald-900/30 transition-all duration-300">
                                <div className="flex items-center justify-between mb-2">
                                    <div className="flex items-center gap-2">
                                        <div className="p-1 rounded bg-emerald-100 dark:bg-emerald-900/60 text-emerald-600 dark:text-emerald-400">
                                        <Star size={14} fill="currentColor" />
                                        </div>
                                        <h4 className="text-xs font-black text-emerald-800 dark:text-emerald-400 uppercase">XUẤT SẮC</h4>
                                    </div>
                                    <span className="text-[10px] font-black bg-white dark:bg-slate-900 border border-emerald-200 dark:border-emerald-500/30 text-emerald-700 dark:text-emerald-400 px-2 py-0.5 rounded shadow-sm">
                                        90 - 100 điểm
                                    </span>
                                </div>
                                <p className="text-[11px] text-slate-600 dark:text-slate-400 font-medium leading-relaxed">
                                    Hoàn thành xuất sắc nhiệm vụ, không xảy ra sự cố, tuân thủ tuyệt đối quy trình.
                                </p>
                            </div>

                            {/* Item 2: Đạt Yêu Cầu */}
                            <div className="relative group p-4 rounded-xl border border-blue-100 dark:border-blue-500/20 bg-blue-50/40 dark:bg-blue-950/20 hover:bg-blue-100/60 dark:hover:bg-blue-900/30 transition-all duration-300">
                                <div className="flex items-center justify-between mb-2">
                                    <div className="flex items-center gap-2">
                                        <div className="p-1 rounded bg-blue-100 dark:bg-blue-900/60 text-blue-600 dark:text-blue-400">
                                        <ShieldCheck size={14} />
                                        </div>
                                        <h4 className="text-xs font-black text-blue-800 dark:text-blue-400 uppercase">ĐẠT YÊU CẦU</h4>
                                    </div>
                                    <span className="text-[10px] font-black bg-white dark:bg-slate-900 border border-blue-200 dark:border-blue-500/30 text-blue-700 dark:text-blue-400 px-2 py-0.5 rounded shadow-sm">
                                        70 - 90 điểm
                                    </span>
                                </div>
                                <p className="text-[11px] text-slate-600 dark:text-slate-400 font-medium leading-relaxed">
                                    Hoàn thành nhiệm vụ được giao, còn sai sót nhỏ nhưng đã khắc phục kịp thời.
                                </p>
                            </div>

                            {/* Item 3: Không Đạt */}
                            <div className="relative group p-4 rounded-xl border border-rose-100 dark:border-rose-500/20 bg-rose-50/40 dark:bg-rose-950/20 hover:bg-rose-100/60 dark:hover:bg-rose-900/30 transition-all duration-300">
                                <div className="flex items-center justify-between mb-2">
                                    <div className="flex items-center gap-2">
                                        <div className="p-1 rounded bg-rose-100 dark:bg-rose-900/60 text-rose-600 dark:text-rose-400">
                                        <AlertOctagon size={14} />
                                        </div>
                                        <h4 className="text-xs font-black text-rose-800 dark:text-rose-400 uppercase">KHÔNG ĐẠT</h4>
                                    </div>
                                    <span className="text-[10px] font-black bg-white dark:bg-slate-900 border border-rose-200 dark:border-rose-500/30 text-rose-700 dark:text-rose-400 px-2 py-0.5 rounded shadow-sm">
                                        &lt; 70 điểm
                                    </span>
                                </div>
                                <p className="text-[11px] text-slate-600 dark:text-slate-400 font-medium leading-relaxed">
                                    Vi phạm quy trình vận hành, để xảy ra sự cố nghiêm trọng hoặc thiếu trách nhiệm.
                                </p>
                            </div>
                        </div>
                        </div>
                    </div>
                 </div>
              )}
            </div>

            {/* Right Panel: Results & Menu (Always visible) */}
            <div className="w-full xl:w-[420px] shrink-0 xl:h-full h-auto flex flex-col relative z-20 xl:order-2 order-1 xl:mb-0">
               <div className="h-full">
                   <ResultsPanel 
                      categoryScores={categoryScores}
                      totalScore={totalScore}
                      percent={percent}
                      ranking={ranking}
                      selectedMonth={selectedMonth}
                      showPreview={showPreview}
                      setShowPreview={setShowPreview}
                      onPrint={handlePrint}
                      penaltyApplied={penaltyApplied}
                      onSelectRole={handleRoleSelect}
                      currentRole={currentRole}
                   />
               </div>
            </div>
          </div>
        )}
      </main>

      {/* PRINT PREVIEW OVERLAY */}
      {showPreview && currentRole && (
        <div className="fixed inset-0 z-[100] bg-slate-950/95 backdrop-blur-md flex justify-center overflow-y-auto p-4 md:p-8 custom-scrollbar">
            
            {/* Floating Top-Right Actions */}
            <div className="fixed top-4 right-4 md:top-6 md:right-6 flex items-center gap-2 bg-slate-800/90 border border-white/10 rounded-lg p-1 shadow-2xl z-[110] backdrop-blur-md">
                <button 
                    onClick={handlePrint}
                    className="flex items-center gap-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-md text-xs font-bold uppercase tracking-wider transition-all"
                >
                    <Printer size={16} />
                    <span className="hidden sm:inline">In Báo Cáo</span>
                </button>
                <div className="w-px h-6 bg-white/10 mx-1"></div>
                <button 
                    onClick={() => setShowPreview(false)}
                    className="p-2 hover:bg-white/10 text-slate-400 hover:text-white rounded-md transition-colors"
                >
                    <X size={20} />
                </button>
            </div>
            
            <div className="w-[210mm] min-h-[297mm] bg-white shadow-2xl animate-in zoom-in-95 duration-300 origin-top my-10 relative">
                <DashboardReport 
                  ratings={ratings}
                  selectedMonth={selectedMonth}
                  totalScore={totalScore}
                  maxTotalScore={maxTotalScore}
                  percent={percent}
                  ranking={ranking}
                  categoryScores={categoryScores}
                  employeeInfo={employeeInfo}
                  logoUrl={companyLogo}
                  penaltyApplied={penaltyApplied}
                  kpiData={activeKPIData}
                />
            </div>
        </div>
      )}

    </div>
  );
}

export default App;
