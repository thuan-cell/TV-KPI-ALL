import React from 'react';
import { Eye, Activity, ShieldCheck, Wrench, Users, AlertTriangle } from 'lucide-react';

interface CategoryScore {
  id: string;
  name: string;
  shortName: string;
  score: number;
  max: number;
  percentage: number;
}

interface ResultsPanelProps {
  categoryScores: CategoryScore[];
  totalScore: number;
  percent: number;
  ranking: string;
  selectedMonth: string;
  showPreview: boolean;
  setShowPreview: (show: boolean) => void;
  onPrint: () => void;
  penaltyApplied?: boolean;
}

const ResultsPanel: React.FC<ResultsPanelProps> = ({ 
  categoryScores,
  totalScore,
  percent,
  ranking,
  selectedMonth, 
  showPreview,
  setShowPreview,
  onPrint,
  penaltyApplied
}) => {
  
  let rankingColor = "text-slate-400";
  let rankingBg = "bg-slate-100 dark:bg-slate-800";
  let gradientStroke = ["#94a3b8", "#64748b"]; 
  
  if (percent > 0 || penaltyApplied) {
      if (percent >= 90) { 
          rankingColor = "text-emerald-400";
          rankingBg = "bg-emerald-500/10 border-emerald-500/20";
          gradientStroke = ["#34d399", "#10b981"];
      } else if (percent >= 70) {
          rankingColor = "text-blue-400";
          rankingBg = "bg-blue-500/10 border-blue-500/20";
          gradientStroke = ["#60a5fa", "#3b82f6"];
      } else {
          rankingColor = "text-rose-400";
          rankingBg = "bg-rose-500/10 border-rose-500/20";
          gradientStroke = ["#fb7185", "#f43f5e"];
      }
  }

  // Large Circle Config - Responsive Scaling via CSS classes, keeping SVG standardized
  const radius = 88; 
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (percent / 100) * circumference;

  const getCategoryStyle = (shortName: string) => {
    switch (shortName) {
      case "Vận hành": return { Icon: Activity, bg: "bg-indigo-500/10", text: "text-indigo-400", border: "border-indigo-500/20", bar: "bg-indigo-500", shadow: "shadow-indigo-500/10" };
      case "An toàn": return { Icon: ShieldCheck, bg: "bg-emerald-500/10", text: "text-emerald-400", border: "border-emerald-500/20", bar: "bg-emerald-500", shadow: "shadow-emerald-500/10" };
      case "Thiết bị": return { Icon: Wrench, bg: "bg-amber-500/10", text: "text-amber-400", border: "border-amber-500/20", bar: "bg-amber-500", shadow: "shadow-amber-500/10" };
      case "Nhân sự": return { Icon: Users, bg: "bg-rose-500/10", text: "text-rose-400", border: "border-rose-500/20", bar: "bg-rose-500", shadow: "shadow-rose-500/10" };
      default: return { Icon: Activity, bg: "bg-slate-800", text: "text-slate-500", border: "border-slate-700", bar: "bg-slate-500", shadow: "shadow-slate-500/10" };
    }
  }

  return (
    // MAIN FRAME CONTAINER
    // Added min-h-[500px] for mobile stacking, xl:h-full for desktop
    <div className={`h-auto min-h-[500px] xl:h-full flex flex-col bg-slate-900/80 dark:bg-[#0f172a]/80 backdrop-blur-2xl rounded-[32px] border-2 border-white/10 shadow-2xl overflow-hidden relative group transition-all duration-300 ${showPreview ? 'opacity-0 pointer-events-none' : 'opacity-100'} print:hidden`}>
        
        {/* Top Glow Accent */}
        <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-white/30 to-transparent"></div>
        <div className="absolute bottom-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-black/30 to-transparent"></div>

        {/* Content Container - Compacted padding and gaps */}
        <div className="flex-1 flex flex-col p-4 justify-between gap-2">
            
            {/* Header */}
            <div className="flex justify-center shrink-0 mb-0">
                <h3 className="text-[10px] md:text-[11px] font-black text-white/90 uppercase tracking-[0.2em] leading-none border-b border-white/10 pb-2 px-4">Kết Quả KPI</h3>
            </div>

            {/* 1. HERO CIRCLE (Focal Point) - Compacted Size */}
            <div className="relative w-full flex justify-center items-center py-0 flex-1 min-h-[160px]">
                {/* Responsive width/height: w-40 on mobile, w-48 on desktop */}
                <div className="relative w-40 h-40 md:w-48 md:h-48 flex items-center justify-center">
                    {/* Background Ring */}
                    <svg className="w-full h-full transform -rotate-90 drop-shadow-2xl" viewBox="0 0 200 200">
                        <circle
                        cx="100"
                        cy="100"
                        r={radius}
                        fill="transparent"
                        stroke="currentColor"
                        strokeWidth="12"
                        strokeLinecap="round"
                        className="text-slate-800/80"
                        />
                        <defs>
                          <linearGradient id="scoreGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                              <stop offset="0%" stopColor={gradientStroke[0]} />
                              <stop offset="100%" stopColor={gradientStroke[1]} />
                          </linearGradient>
                        </defs>
                        <circle
                        cx="100"
                        cy="100"
                        r={radius}
                        fill="transparent"
                        stroke="url(#scoreGradient)"
                        strokeWidth="12"
                        strokeDasharray={circumference}
                        strokeDashoffset={strokeDashoffset}
                        strokeLinecap="round"
                        className="transition-all duration-1000 ease-out"
                        style={{ filter: `drop-shadow(0px 0px 15px ${gradientStroke[1]}50)` }}
                        />
                    </svg>

                    {/* Center Info - Compacted Fonts */}
                    <div className="absolute inset-0 flex flex-col items-center justify-center">
                        <span className="text-4xl md:text-5xl font-black text-white tracking-tighter drop-shadow-lg leading-none mt-1">
                            {totalScore}
                        </span>
                        <div className="text-[8px] md:text-[9px] text-slate-400 font-bold uppercase tracking-widest mb-1 md:mb-2 opacity-60">/ 100 điểm</div>
                        
                        <div className={`px-2 py-1 rounded-md text-[8px] md:text-[9px] font-black uppercase tracking-widest shadow-lg border backdrop-blur-md whitespace-nowrap ${rankingColor} ${rankingBg}`}>
                            {ranking}
                        </div>

                        {penaltyApplied && (
                          <div className="absolute -bottom-10 left-1/2 -translate-x-1/2 bg-rose-500/10 text-rose-500 px-3 py-1 rounded-full text-[10px] font-bold border border-rose-500/20 flex items-center gap-1.5 animate-pulse whitespace-nowrap shadow-lg shadow-rose-900/20">
                              <AlertTriangle size={12} />
                              <span>Trừ 30đ (Lỗi Yếu)</span>
                          </div>
                        )}
                    </div>
                </div>
            </div>

            {/* 2. CATEGORY LIST - Compacted Gaps & Padding */}
            <div className="flex flex-col gap-2">
                {categoryScores.map((cat) => {
                    const style = getCategoryStyle(cat.shortName);
                    const Icon = style.Icon;
                    return (
                        <div key={cat.id} className={`relative overflow-hidden rounded-xl bg-slate-800/40 border border-white/5 p-2 group transition-all duration-300 hover:bg-slate-800 hover:shadow-lg ${style.shadow} hover:border-${style.text.split('-')[1]}-500/30`}>
                            <div className="flex items-center gap-3 relative z-10">
                                <div className={`w-7 h-7 rounded-lg flex items-center justify-center shrink-0 border ${style.bg} ${style.border} ${style.text}`}>
                                    <Icon size={16} strokeWidth={2.5} />
                                </div>
                                <div className="flex-1 min-w-0">
                                    <div className="flex justify-between items-center mb-1">
                                        <span className="text-[9px] font-bold text-slate-400 uppercase tracking-wider leading-normal group-hover:text-white transition-colors">{cat.shortName}</span>
                                        <div className="flex items-end gap-1">
                                            <span className="text-xs font-black text-white leading-none">
                                                {cat.score}
                                            </span>
                                            <span className="text-[8px] text-slate-500 font-medium leading-none mb-px">/{cat.max}</span>
                                        </div>
                                    </div>
                                    <div className="h-1 w-full bg-slate-700/50 rounded-full overflow-hidden">
                                        <div 
                                            className={`h-full rounded-full transition-all duration-700 ease-out shadow-[0_0_8px_currentColor] ${style.bar}`}
                                            style={{ width: `${cat.percentage}%` }}
                                        ></div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    );
                })}
            </div>

            {/* 3. Action Button - Compacted */}
            <div className="mt-2 pt-2 border-t border-white/5">
                <button 
                    onClick={() => setShowPreview(true)}
                    className="w-full h-10 rounded-xl bg-white text-slate-900 font-bold text-xs uppercase tracking-widest shadow-lg shadow-indigo-500/10 hover:shadow-indigo-500/30 hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-2 group"
                >
                    <Eye size={14} className="group-hover:text-indigo-600 transition-colors" />
                    <span>Xem Báo Cáo</span>
                </button>
            </div>
        </div>
    </div>
  );
};

export default ResultsPanel;