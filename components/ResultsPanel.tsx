
import React, { useRef } from 'react';
import { Eye, Activity, ShieldCheck, Wrench, Users, Download, Upload, FileUp } from 'lucide-react';
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
  hoveredRole: RoleType | null;
  setHoveredRole: (role: RoleType | null) => void;
  darkMode: boolean;
  // onExport removed
  onImport: (file: File) => void;
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
  currentRole,
  hoveredRole,
  setHoveredRole,
  darkMode,
  onImport
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Scoring colors - Neon Palette
  let rankingColor = "text-slate-500";
  let rankingBg = "bg-slate-800/50 border-slate-700";
  let gradientStroke = ["#94a3b8", "#64748b"]; 
  let glowColor = "rgba(148, 163, 184, 0.5)";
  
  if (percent > 0 || penaltyApplied) {
      if (percent >= 90) { 
          rankingColor = "text-emerald-400";
          rankingBg = "bg-emerald-950/30 border-emerald-500/30";
          gradientStroke = ["#34d399", "#059669"];
          glowColor = "rgba(16, 185, 129, 0.6)";
      } else if (percent >= 70) {
          rankingColor = "text-blue-400";
          rankingBg = "bg-blue-950/30 border-blue-500/30";
          gradientStroke = ["#60a5fa", "#2563eb"];
          glowColor = "rgba(37, 99, 235, 0.6)";
      } else {
          rankingColor = "text-rose-400";
          rankingBg = "bg-rose-950/30 border-rose-500/30";
          gradientStroke = ["#fb7185", "#e11d48"];
          glowColor = "rgba(225, 29, 72, 0.6)";
      }
  }

  // --- CIRCULAR MENU CALCULATIONS ---
  const size = 400;
  const center = size / 2;
  
  // Adjusted dimensions to increase size within the box
  const outerRadius = 190;
  const innerRadius = 105;
  const scoreRadius = 85;
  
  const totalItems = MENU_ITEMS.length;
  const anglePerItem = 360 / totalItems;
  const rotationOffset = -90; // Start from top
  
  // Gap width (simulated by stroke)
  const gapStrokeWidth = 4; 

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
      case "Vận hành": return { Icon: Activity, accent: "indigo" };
      case "An toàn": return { Icon: ShieldCheck, accent: "emerald" };
      case "Thiết bị": return { Icon: Wrench, accent: "amber" };
      case "Nhân sự": return { Icon: Users, accent: "rose" };
      default: return { Icon: Activity, accent: "slate" };
    }
  }

  // Helper map for Tailwind dynamic classes (safelist workaround)
  const colorMap: Record<string, { bg: string, text: string, bar: string, border: string }> = {
    indigo: { bg: "bg-indigo-500/10", text: "text-indigo-400", bar: "bg-indigo-500", border: "border-l-indigo-500" },
    emerald: { bg: "bg-emerald-500/10", text: "text-emerald-400", bar: "bg-emerald-500", border: "border-l-emerald-500" },
    amber: { bg: "bg-amber-500/10", text: "text-amber-400", bar: "bg-amber-500", border: "border-l-amber-500" },
    rose: { bg: "bg-rose-500/10", text: "text-rose-400", bar: "bg-rose-500", border: "border-l-rose-500" },
    slate: { bg: "bg-slate-500/10", text: "text-slate-400", bar: "bg-slate-500", border: "border-l-slate-500" },
  };

  // Theme-based colors
  const bgColor = darkMode ? '#0f172a' : '#ffffff';
  const borderColor = darkMode ? '#1e293b' : '#e2e8f0';
  const gapColor = darkMode ? '#0f172a' : '#ffffff';

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      onImport(file);
    }
    // Reset value so same file can be selected again
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    // MAIN FRAME - HUD Style
    <div className={`w-full h-full flex flex-col bg-white dark:bg-[#0f172a] rounded-[24px] border border-slate-200 dark:border-slate-800 shadow-2xl overflow-hidden relative group transition-all duration-300 ${showPreview ? 'opacity-0 pointer-events-none' : 'opacity-100'} print:hidden`}>
        
        {/* Subtle Background Pattern */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_var(--tw-gradient-stops))] from-slate-50 via-white to-white dark:from-slate-800/20 dark:via-[#0f172a] dark:to-[#0f172a] pointer-events-none"></div>

        {/* Content Container */}
        <div className="flex-1 flex flex-col p-3 md:p-4 justify-between gap-2 overflow-hidden relative z-10 h-full">
            
            {/* Header - Sleek Capsule */}
            <div className="flex justify-center shrink-0 mb-1">
                <div className="px-4 py-1.5 rounded-full bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm flex items-center gap-2">
                   <div className="w-1.5 h-1.5 rounded-full bg-indigo-500 animate-pulse"></div>
                   <h3 className="text-[10px] font-bold text-slate-600 dark:text-slate-300 uppercase tracking-widest leading-none">Kết Quả KPI</h3>
                </div>
            </div>

            {/* 1. HERO CIRCLE + MENU RING (Focal Point) */}
            <div className="relative w-full flex justify-center items-center h-[180px] xl:h-[210px] shrink-0">
                <div className="aspect-square h-full max-h-full flex items-center justify-center relative">
                    
                    <svg className="w-full h-full drop-shadow-2xl overflow-visible" viewBox={`0 0 ${size} ${size}`}>
                        <defs>
                          <linearGradient id="scoreGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                              <stop offset="0%" stopColor={gradientStroke[0]} />
                              <stop offset="100%" stopColor={gradientStroke[1]} />
                          </linearGradient>
                          <filter id="neonGlow" x="-50%" y="-50%" width="200%" height="200%">
                             <feGaussianBlur stdDeviation="2.5" result="coloredBlur"/>
                             <feMerge>
                                <feMergeNode in="coloredBlur"/>
                                <feMergeNode in="SourceGraphic"/>
                             </feMerge>
                          </filter>
                        </defs>

                        {/* --- OUTER MENU RING --- */}
                        <g className="origin-center" style={{ transformBox: 'fill-box' }}>
                           {MENU_ITEMS.map((item, index) => {
                             const isHovered = hoveredRole === item.role;
                             const isSelected = currentRole === item.role;
                             const isActive = isSelected || isHovered;
                             
                             const sectorPath = createSectorPath(index);

                             return (
                               <g key={item.role} 
                                  onClick={() => onSelectRole(item.role)}
                                  onMouseEnter={() => setHoveredRole(item.role)}
                                  onMouseLeave={() => setHoveredRole(null)}
                                  className="cursor-pointer group/sector"
                               >
                                 <path 
                                    d={sectorPath}
                                    fill={isActive ? item.iconHex : item.sectorHex} 
                                    fillOpacity={1}
                                    stroke={gapColor} 
                                    strokeWidth={gapStrokeWidth}
                                    className="transition-colors duration-200 ease-out origin-center"
                                    style={{
                                       transform: 'scale(1)' 
                                    }}
                                 />
                               </g>
                             );
                           })}
                        </g>

                        {/* --- INNER SCORE CIRCLE --- */}
                        <circle
                            cx={center}
                            cy={center}
                            r={scoreRadius}
                            fill={bgColor} 
                            stroke={borderColor}
                            strokeWidth="6"
                            className="drop-shadow-inner transition-colors duration-300"
                        />
                        
                        <circle
                            cx={center}
                            cy={center}
                            r={scoreRadius}
                            fill="transparent"
                            stroke="url(#scoreGradient)"
                            strokeWidth="6"
                            strokeDasharray={circumference}
                            strokeDashoffset={strokeDashoffset}
                            strokeLinecap="round"
                            transform={`rotate(-90 ${center} ${center})`}
                            className="transition-all duration-1000 ease-out"
                            style={{ 
                                filter: `drop-shadow(0px 0px 8px ${glowColor})` 
                            }}
                        />
                    </svg>

                    {/* --- ICON & TEXT OVERLAYS --- */}
                    <div className="absolute inset-0 pointer-events-none">
                       {MENU_ITEMS.map((item, index) => {
                            const angle = index * anglePerItem + (anglePerItem / 2);
                            const rad = (angle + rotationOffset) * (Math.PI / 180);
                            
                            const radiusPercent = 36.8; 
                            
                            const left = 50 + (Math.cos(rad) * radiusPercent); 
                            const top = 50 + (Math.sin(rad) * radiusPercent);
                            
                            const Icon = item.icon;
                            const isSelected = currentRole === item.role;
                            const isHovered = hoveredRole === item.role;
                            const isActive = isSelected || isHovered;
                            
                            const iconColor = isActive ? 'white' : item.iconHex;
                            const textColor = isActive ? 'text-white' : 'text-slate-900';

                            return (
                                <div 
                                    key={index}
                                    className="absolute transform -translate-x-1/2 -translate-y-1/2 flex flex-col items-center justify-center transition-none"
                                    style={{ 
                                        left: `${left}%`, 
                                        top: `${top}%`,
                                        zIndex: isSelected ? 20 : 10,
                                    }}
                                >
                                    <div className={`p-1.5 rounded-xl bg-transparent`}>
                                      <Icon 
                                        size={18} 
                                        style={{ 
                                            color: iconColor,
                                            filter: isActive && darkMode ? `drop-shadow(0 0 4px rgba(255,255,255,0.5))` : 'none'
                                        }} 
                                        strokeWidth={2.5} 
                                        className={`transition-colors duration-200`}
                                      />
                                    </div>
                                    <div className={`mt-0.5 text-[8px] md:text-[9px] font-bold uppercase tracking-tight whitespace-nowrap px-1.5 py-0.5 rounded transition-colors duration-200 ${textColor} ${isActive ? 'drop-shadow-md' : ''}`}>
                                      {item.label}
                                    </div>
                                </div>
                            );
                       })}
                    </div>

                    {/* --- CENTER HUD INFO --- */}
                    <div className="absolute inset-0 flex flex-col items-center justify-center z-10 pointer-events-none">
                        <span className="text-3xl md:text-4xl font-black text-slate-900 dark:text-white tracking-tighter drop-shadow-lg leading-none mt-1 tabular-nums">
                            {totalScore.toFixed(0)}
                        </span>
                        <div className="text-[8px] md:text-[9px] text-slate-400 dark:text-slate-500 font-bold uppercase tracking-widest mb-1 opacity-80">/ 100</div>
                        
                        <div className={`px-2 py-0.5 rounded text-[8px] md:text-[9px] font-black uppercase tracking-widest border backdrop-blur-md whitespace-nowrap shadow-lg ${rankingColor} ${rankingBg}`}>
                            {ranking}
                        </div>
                    </div>
                </div>
            </div>

            {/* 2. CATEGORY LIST */}
            <div className="flex-1 min-h-0 overflow-y-auto overflow-x-hidden flex flex-col gap-1 justify-start py-1 no-scrollbar px-1">
                {categoryScores.map((cat) => {
                    if (cat.max === 0) return null;

                    const style = getCategoryStyle(cat.shortName);
                    const theme = colorMap[style.accent];
                    const Icon = style.Icon;

                    return (
                        <div key={cat.id} className={`relative rounded-r-lg ${darkMode ? theme.border : 'border-l-slate-200'} border-l-[3px] bg-gradient-to-r from-slate-100 via-slate-50 to-transparent dark:from-slate-900 dark:via-slate-900/50 dark:to-transparent p-1.5 group transition-all duration-300 hover:from-slate-200 dark:hover:from-slate-800 shrink-0`}>
                            <div className="flex items-center gap-3 relative z-10">
                                <div className={`w-7 h-7 rounded bg-white dark:bg-slate-800/50 flex items-center justify-center shrink-0 border border-slate-200 dark:border-white/5 ${theme.text}`}>
                                    <Icon size={14} strokeWidth={2} />
                                </div>
                                <div className="flex-1 min-w-0 flex flex-col justify-center gap-1">
                                    <div className="flex justify-between items-end leading-none">
                                        <span className="text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wide group-hover:text-slate-800 dark:group-hover:text-slate-200 transition-colors">{cat.shortName}</span>
                                        <div className="flex items-baseline gap-1">
                                            <span className="text-xs font-bold text-slate-900 dark:text-white tabular-nums">
                                                {cat.score}
                                            </span>
                                            <span className="text-[9px] text-slate-400 dark:text-slate-600 font-medium">/{cat.max}</span>
                                        </div>
                                    </div>
                                    <div className="h-1 w-full bg-slate-200 dark:bg-slate-800 rounded-full overflow-hidden">
                                        <div 
                                            className={`h-full rounded-full transition-all duration-700 ease-out shadow-[0_0_8px_currentColor] ${theme.bar}`}
                                            style={{ width: `${cat.percentage}%` }}
                                        ></div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    );
                })}
            </div>

            {/* 3. Action Buttons - Grouped in Grid */}
            <div className="mt-auto pt-2 border-t border-slate-200 dark:border-slate-800 shrink-0 grid grid-cols-2 gap-2">
                
                {/* PDF Import Button */}
                <div className="flex gap-2">
                  <button 
                      onClick={() => fileInputRef.current?.click()}
                      className="flex-1 h-9 rounded-lg bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300 font-bold text-[10px] uppercase tracking-wider transition-all flex items-center justify-center gap-1.5 group border border-slate-200 dark:border-slate-700 hover:border-amber-500/50"
                      title="Nạp file PDF báo cáo để sửa lại"
                  >
                      <FileUp size={14} className="text-slate-500 group-hover:text-amber-500 transition-colors" />
                      <span>Nạp PDF</span>
                  </button>
                  <input 
                    type="file" 
                    ref={fileInputRef} 
                    onChange={handleFileChange} 
                    accept=".pdf" 
                    className="hidden" 
                  />
                </div>
                
                {/* View Report (Primary) */}
                <button 
                    onClick={() => setShowPreview(true)}
                    className="col-span-1 h-9 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs uppercase tracking-widest shadow-lg shadow-indigo-500/20 hover:shadow-indigo-500/30 transition-all flex items-center justify-center gap-2 group border border-indigo-500/50"
                >
                    <Eye size={14} className="text-indigo-200 group-hover:text-white transition-colors" />
                    <span>Xem Báo Cáo</span>
                </button>
            </div>
        </div>
    </div>
  );
};

export default ResultsPanel;
