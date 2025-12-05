
import React, { useState } from 'react';
import { Eye, Activity, ShieldCheck, Wrench, Users, AlertTriangle } from 'lucide-react';
import { MENU_ITEMS, RoleType } from '../constants';

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
  onSelectRole: (role: RoleType) => void;
  currentRole: RoleType | null;
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
  penaltyApplied,
  onSelectRole,
  currentRole
}) => {
  const [hoveredRole, setHoveredRole] = useState<RoleType | null>(null);
  
  // Scoring colors
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

  // --- CIRCULAR MENU CALCULATIONS ---
  // Center: 200, 200 (Total size 400x400 viewBox)
  const size = 400;
  const center = size / 2;
  
  // Radii configuration - Fixed dimensions
  const outerRadius = 175; 
  const innerRadius = 95; 
  const scoreRadius = 75; 
  
  const totalItems = MENU_ITEMS.length;
  const anglePerItem = 360 / totalItems;
  const rotationOffset = -90; // Start from top
  const gap = 4; // Gap between sectors

  const createSectorPath = (index: number) => {
    const startAngle = index * anglePerItem;
    const endAngle = (index + 1) * anglePerItem;

    const startRad = (startAngle + rotationOffset) * (Math.PI / 180);
    const endRad = (endAngle + rotationOffset) * (Math.PI / 180);

    const x1 = center + outerRadius * Math.cos(startRad);
    const y1 = center + outerRadius * Math.sin(startRad);
    const x2 = center + outerRadius * Math.cos(endRad);
    const y2 = center + outerRadius * Math.sin(endRad);

    const x3 = center + innerRadius * Math.cos(endRad);
    const y3 = center + innerRadius * Math.sin(endRad);
    const x4 = center + innerRadius * Math.cos(startRad);
    const y4 = center + innerRadius * Math.sin(startRad);

    return `M ${x1} ${y1} A ${outerRadius} ${outerRadius} 0 0 1 ${x2} ${y2} L ${x3} ${y3} A ${innerRadius} ${innerRadius} 0 0 0 ${x4} ${y4} Z`;
  };

  const circumference = 2 * Math.PI * scoreRadius;
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
    <div className={`h-auto min-h-[500px] xl:h-full flex flex-col bg-slate-900/80 dark:bg-[#0f172a]/80 backdrop-blur-2xl rounded-[32px] border-2 border-white/10 shadow-2xl overflow-hidden relative group transition-all duration-300 ${showPreview ? 'opacity-0 pointer-events-none' : 'opacity-100'} print:hidden`}>
        
        {/* Top Glow Accent */}
        <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-white/30 to-transparent"></div>
        <div className="absolute bottom-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-black/30 to-transparent"></div>

        {/* Content Container */}
        <div className="flex-1 flex flex-col p-3 justify-between gap-0 overflow-hidden">
            
            {/* Header */}
            <div className="flex justify-center shrink-0 mb-1">
                <h3 className="text-[10px] md:text-[11px] font-black text-white/90 uppercase tracking-[0.2em] leading-none border-b border-white/10 pb-2 px-4">Kết Quả KPI</h3>
            </div>

            {/* 1. HERO CIRCLE + MENU RING (Focal Point) */}
            {/* Reduced height to prevent overflow */}
            <div className="relative w-full flex justify-center items-center h-[220px] xl:h-[260px] shrink-0">
                <div className="aspect-square h-full max-h-full flex items-center justify-center relative">
                    
                    <svg className="w-full h-full drop-shadow-2xl overflow-visible" viewBox={`0 0 ${size} ${size}`}>
                        
                        {/* --- OUTER MENU RING --- */}
                        <g className="origin-center" style={{ transformBox: 'fill-box' }}>
                           {MENU_ITEMS.map((item, index) => {
                             const isHovered = hoveredRole === item.role;
                             const isSelected = currentRole === item.role;
                             
                             return (
                               <g key={item.role} 
                                  onClick={() => onSelectRole(item.role)}
                                  onMouseEnter={() => setHoveredRole(item.role)}
                                  onMouseLeave={() => setHoveredRole(null)}
                                  className="cursor-pointer group/sector"
                               >
                                 <path 
                                    d={createSectorPath(index)}
                                    fill={isSelected || isHovered ? item.iconHex : item.sectorHex}
                                    stroke="#0f172a"
                                    strokeWidth={gap}
                                    className={`transition-colors duration-200 ease-out origin-center`}
                                    style={{
                                      opacity: isSelected ? 1 : (isHovered ? 0.9 : 0.85),
                                      filter: isHovered || isSelected ? 'drop-shadow(0px 0px 8px rgba(255,255,255,0.15))' : 'none'
                                    }}
                                 />
                               </g>
                             );
                           })}
                        </g>

                        {/* --- INNER SCORE CIRCLE --- */}
                        {/* Background Ring */}
                        <circle
                        cx={center}
                        cy={center}
                        r={scoreRadius}
                        fill="#0f172a" // Dark background for the hub
                        stroke="#1e293b"
                        strokeWidth="8"
                        strokeLinecap="round"
                        />
                        
                        <defs>
                          <linearGradient id="scoreGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                              <stop offset="0%" stopColor={gradientStroke[0]} />
                              <stop offset="100%" stopColor={gradientStroke[1]} />
                          </linearGradient>
                        </defs>
                        
                        {/* Progress Ring (Rotated -90deg) */}
                        <circle
                        cx={center}
                        cy={center}
                        r={scoreRadius}
                        fill="transparent"
                        stroke="url(#scoreGradient)"
                        strokeWidth="8"
                        strokeDasharray={circumference}
                        strokeDashoffset={strokeDashoffset}
                        strokeLinecap="round"
                        transform={`rotate(-90 ${center} ${center})`}
                        className="transition-all duration-1000 ease-out"
                        style={{ filter: `drop-shadow(0px 0px 10px ${gradientStroke[1]}60)` }}
                        />
                    </svg>

                    {/* --- ICON & TEXT OVERLAYS FOR MENU --- */}
                    <div className="absolute inset-0 pointer-events-none">
                       {MENU_ITEMS.map((item, index) => {
                            const angle = index * anglePerItem + (anglePerItem / 2);
                            const rad = (angle + rotationOffset) * (Math.PI / 180);
                            
                            // Optimized Label Positioning
                            const radiusPercent = 33.75; 
                            
                            const left = 50 + (Math.cos(rad) * radiusPercent); 
                            const top = 50 + (Math.sin(rad) * radiusPercent);
                            
                            const Icon = item.icon;
                            const isSelected = currentRole === item.role;
                            const isHovered = hoveredRole === item.role;
                            
                            // Determine text colors based on state
                            const isActive = isSelected || isHovered;
                            const textColor = isActive ? 'text-white' : 'text-slate-900';
                            const iconColor = isActive ? 'white' : item.iconHex;

                            return (
                                <div 
                                    key={index}
                                    className="absolute transform -translate-x-1/2 -translate-y-1/2 flex flex-col items-center justify-center transition-all duration-300"
                                    style={{ 
                                        left: `${left}%`, 
                                        top: `${top}%`,
                                        zIndex: isSelected ? 20 : 10
                                    }}
                                >
                                    {/* Icon */}
                                    <div className={`p-1.5 rounded-xl transition-all duration-300 bg-transparent`}>
                                      <Icon 
                                        size={18} // FIXED SIZE
                                        style={{ color: iconColor }} 
                                        strokeWidth={2.5} 
                                        className="drop-shadow-sm transition-colors duration-200"
                                      />
                                    </div>
                                    
                                    {/* Label */}
                                    <div className={`mt-0.5 text-[8px] md:text-[9px] font-black uppercase tracking-tight whitespace-nowrap px-1.5 py-0.5 rounded transition-colors duration-200 ${textColor} ${isActive ? 'drop-shadow-md' : ''}`}>
                                      {item.label}
                                    </div>
                                </div>
                            );
                       })}
                    </div>

                    {/* --- CENTER INFO --- */}
                    <div className="absolute inset-0 flex flex-col items-center justify-center z-10 pointer-events-none">
                        <span className="text-3xl md:text-4xl font-black text-white tracking-tighter drop-shadow-lg leading-none mt-1">
                            {totalScore}
                        </span>
                        <div className="text-[8px] md:text-[9px] text-slate-400 font-bold uppercase tracking-widest mb-1 md:mb-2 opacity-60">/ 100 điểm</div>
                        
                        <div className={`px-2 py-0.5 rounded-md text-[8px] md:text-[9px] font-black uppercase tracking-widest shadow-lg border backdrop-blur-md whitespace-nowrap ${rankingColor} ${rankingBg}`}>
                            {ranking}
                        </div>

                        {penaltyApplied && (
                          <div className="absolute bottom-8 left-1/2 -translate-x-1/2 bg-rose-500/10 text-rose-500 px-2 py-0.5 rounded-full text-[8px] font-bold border border-rose-500/20 flex items-center gap-1 animate-pulse whitespace-nowrap shadow-lg shadow-rose-900/20">
                              <AlertTriangle size={8} />
                              <span>-30đ</span>
                          </div>
                        )}
                    </div>
                </div>
            </div>

            {/* 2. CATEGORY LIST - Flexible height with Scroll */}
            <div className="flex-1 min-h-0 overflow-y-auto overflow-x-hidden flex flex-col gap-1.5 justify-start py-1 no-scrollbar">
                {categoryScores.map((cat) => {
                    // Only render if this category is relevant (max > 0)
                    if (cat.max === 0) return null;

                    const style = getCategoryStyle(cat.shortName);
                    const Icon = style.Icon;
                    return (
                        <div key={cat.id} className={`relative overflow-hidden rounded-xl bg-slate-800/40 border border-white/5 p-1.5 group transition-all duration-300 hover:bg-slate-800 hover:shadow-lg ${style.shadow} hover:border-${style.text.split('-')[1]}-500/30 shrink-0`}>
                            <div className="flex items-center gap-2.5 relative z-10">
                                <div className={`w-6 h-6 rounded-lg flex items-center justify-center shrink-0 border ${style.bg} ${style.border} ${style.text}`}>
                                    <Icon size={14} strokeWidth={2.5} />
                                </div>
                                <div className="flex-1 min-w-0">
                                    <div className="flex justify-between items-center mb-0.5">
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

            {/* 3. Action Button */}
            <div className="mt-1 pt-2 border-t border-white/5 shrink-0">
                <button 
                    onClick={() => setShowPreview(true)}
                    className="w-full h-9 rounded-xl bg-white text-slate-900 font-bold text-xs uppercase tracking-widest shadow-lg shadow-indigo-500/10 hover:shadow-indigo-500/30 hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-2 group"
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
