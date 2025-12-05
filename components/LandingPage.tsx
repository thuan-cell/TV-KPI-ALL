
import React, { useState } from 'react';
import { ArrowRight, User, Lock, Mail, Eye, EyeOff, Loader2 } from 'lucide-react';
import { authService, UserAccount } from '../services/authService';

interface LandingPageProps {
  onLoginSuccess: (user: UserAccount) => void;
}

const LandingPage: React.FC<LandingPageProps> = ({ onLoginSuccess }) => {
  const [isRegister, setIsRegister] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);
  
  const [formData, setFormData] = useState({
    fullName: '',
    username: '', 
    password: '',
    confirmPassword: '',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!formData.username || !formData.password) {
        setError("Vui lòng nhập đầy đủ thông tin.");
        return;
    }

    if (isRegister) {
         if (!formData.fullName) {
             setError("Vui lòng nhập họ tên.");
             return;
         }
         if (formData.password !== formData.confirmPassword) {
            setError("Mật khẩu xác nhận không khớp.");
            return;
         }
         if (formData.password.length < 6) {
            setError("Mật khẩu phải có ít nhất 6 ký tự.");
            return;
         }
    }

    setIsLoading(true);
    
    setTimeout(() => {
        if (isRegister) {
            const result = authService.register({
                username: formData.username,
                password: formData.password,
                fullName: formData.fullName,
                role: 'Nhân viên',
                department: 'Vận Hành',
                avatar: `https://ui-avatars.com/api/?name=${encodeURIComponent(formData.fullName)}&background=random`
            });
            if (result.success && result.user) {
                onLoginSuccess(result.user);
            } else {
                setError(result.message);
            }
        } else {
             const result = authService.login(formData.username, formData.password);
             if (result.success && result.user) {
                onLoginSuccess(result.user);
             } else {
                setError(result.message);
             }
        }
        setIsLoading(false);
    }, 800);
  };

  const toggleMode = () => {
      setIsRegister(!isRegister);
      setError(null);
      setFormData({
        fullName: '',
        username: '',
        password: '',
        confirmPassword: '',
      });
  };

  return (
    <div className="flex-1 flex items-center justify-center relative overflow-hidden bg-slate-50 dark:bg-[#020617]">
      
      {/* Background Effect - Smooth Aurora */}
      <div className="absolute top-[-20%] left-[-10%] w-[1000px] h-[1000px] bg-indigo-500/10 dark:bg-indigo-600/10 rounded-full blur-[150px] pointer-events-none mix-blend-multiply dark:mix-blend-screen opacity-70"></div>
      <div className="absolute bottom-[-10%] right-[-10%] w-[800px] h-[800px] bg-blue-500/10 dark:bg-blue-600/10 rounded-full blur-[150px] pointer-events-none mix-blend-multiply dark:mix-blend-screen opacity-70"></div>

      <div className="relative z-10 w-full max-w-[380px] mx-auto px-4 animate-in fade-in duration-1000 zoom-in-95">
        
        <div className="bg-white/80 dark:bg-[#0f172a]/70 backdrop-blur-2xl rounded-[32px] shadow-2xl shadow-slate-200/50 dark:shadow-black/50 border border-white/60 dark:border-white/10 p-8 md:p-10 relative overflow-hidden">
            
            {/* Top Shine */}
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-indigo-500/50 to-transparent"></div>

            <div className="mb-8 text-center">
                <h2 className="text-3xl font-black text-slate-900 dark:text-white mb-2 tracking-tight">
                    {isRegister ? 'Tạo tài khoản' : 'Đăng nhập'}
                </h2>
                <p className="text-sm text-slate-500 dark:text-slate-400 font-medium">
                    {isRegister ? 'Nhập thông tin để đăng ký hệ thống' : 'Vui lòng nhập thông tin xác thực'}
                </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-5">
                
                {error && (
                    <div className="p-3 rounded-xl bg-rose-50 dark:bg-rose-500/10 border border-rose-200 dark:border-rose-500/20 text-rose-600 dark:text-rose-400 text-xs font-bold text-center animate-in slide-in-from-top-2">
                        {error}
                    </div>
                )}

                {isRegister && (
                    <div className="space-y-1.5 animate-in slide-in-from-left-2 fade-in duration-300">
                        <div className="relative group">
                            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400 group-focus-within:text-indigo-500 transition-colors">
                                <User size={18} />
                            </div>
                            <input 
                                type="text"
                                placeholder="Họ và tên"
                                className="w-full bg-slate-50 dark:bg-slate-950/50 border border-slate-200 dark:border-slate-800 rounded-xl py-3.5 pl-11 pr-4 text-sm font-semibold focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 outline-none transition-all dark:text-white placeholder:text-slate-400"
                                value={formData.fullName}
                                onChange={e => setFormData({...formData, fullName: e.target.value})}
                            />
                        </div>
                    </div>
                )}

                <div className="space-y-1.5">
                    <div className="relative group">
                        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400 group-focus-within:text-indigo-500 transition-colors">
                            <Mail size={18} />
                        </div>
                        <input 
                            type="text"
                            placeholder="Tên đăng nhập"
                            className="w-full bg-slate-50 dark:bg-slate-950/50 border border-slate-200 dark:border-slate-800 rounded-xl py-3.5 pl-11 pr-4 text-sm font-semibold focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 outline-none transition-all dark:text-white placeholder:text-slate-400"
                            value={formData.username}
                            onChange={e => setFormData({...formData, username: e.target.value})}
                        />
                    </div>
                </div>
                
                <div className="space-y-1.5">
                    <div className="relative group">
                        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400 group-focus-within:text-indigo-500 transition-colors">
                            <Lock size={18} />
                        </div>
                        <input 
                            type={showPassword ? "text" : "password"}
                            placeholder="Mật khẩu"
                            className="w-full bg-slate-50 dark:bg-slate-950/50 border border-slate-200 dark:border-slate-800 rounded-xl py-3.5 pl-11 pr-10 text-sm font-semibold focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 outline-none transition-all dark:text-white placeholder:text-slate-400"
                            value={formData.password}
                            onChange={e => setFormData({...formData, password: e.target.value})}
                        />
                        <button 
                            type="button"
                            onClick={() => setShowPassword(!showPassword)}
                            className="absolute right-3 top-3.5 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 transition-colors"
                        >
                            {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                        </button>
                    </div>
                </div>

                {isRegister && (
                        <div className="space-y-1.5 animate-in slide-in-from-left-2 fade-in duration-300">
                        <div className="relative group">
                            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400 group-focus-within:text-indigo-500 transition-colors">
                                <Lock size={18} />
                            </div>
                            <input 
                                type="password"
                                placeholder="Xác nhận mật khẩu"
                                className="w-full bg-slate-50 dark:bg-slate-950/50 border border-slate-200 dark:border-slate-800 rounded-xl py-3.5 pl-11 pr-4 text-sm font-semibold focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 outline-none transition-all dark:text-white placeholder:text-slate-400"
                                value={formData.confirmPassword}
                                onChange={e => setFormData({...formData, confirmPassword: e.target.value})}
                            />
                        </div>
                    </div>
                )}

                <div className="pt-4">
                    <button 
                        type="submit" 
                        disabled={isLoading}
                        className="w-full bg-gradient-to-r from-slate-900 to-slate-800 dark:from-indigo-600 dark:to-blue-600 hover:from-slate-800 hover:to-slate-700 dark:hover:from-indigo-500 dark:hover:to-blue-500 text-white font-bold py-4 rounded-xl shadow-xl shadow-indigo-500/20 active:scale-[0.98] transition-all flex items-center justify-center gap-2 group"
                    >
                        {isLoading ? <Loader2 size={20} className="animate-spin" /> : (
                            <>
                                <span>{isRegister ? 'Đăng Ký' : 'Đăng Nhập'}</span>
                                <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
                            </>
                        )}
                    </button>
                </div>
            </form>

            <div className="text-center mt-8">
                <button 
                    type="button"
                    onClick={toggleMode}
                    className="text-xs text-slate-500 dark:text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 font-bold transition-colors focus:outline-none uppercase tracking-wide"
                >
                    {isRegister ? 'Đã có tài khoản? Đăng nhập' : 'Chưa có tài khoản? Đăng ký ngay'}
                </button>
            </div>
        </div>
      </div>
    </div>
  );
};

export default LandingPage;
