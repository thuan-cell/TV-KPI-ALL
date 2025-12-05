import React from 'react';
import { RatingLevel, EvaluationState, KPIItem, KPICategory } from '../types';
import { CheckCircle, ShieldCheck, AlertCircle, XCircle, Pencil, Activity, Wrench, Users, Truck, Hammer, Calculator } from 'lucide-react';

interface InputSectionProps {
  ratings: EvaluationState;
  onRate: (id: string, level: RatingLevel, score: number) => void;
  onNoteChange: (id: string, note: string) => void;
  kpiData: KPICategory[]; // New prop
}

const InputSection: React.FC<InputSectionProps> = ({ ratings, onRate, onNoteChange, kpiData }) => {
  
  // Helper to get icon and style based on category ID or Name keyword
  const getCategoryConfig = (cat: KPICategory) => {
    const name = cat.name.toLowerCase();
    
    if (name.includes('vận hành') || name.includes('chuyên môn')) {
        return {
          Icon: Activity,
          color: "text-indigo-600 dark:text-indigo-400",
          bg: "bg-indigo-50 dark:bg-indigo-950/40",
          border: "border-indigo-100 dark:border-indigo-500/20",
          accent: "bg-indigo-500",
          glow: "shadow-indigo-500/20"
        };
    } else if (name.includes('an toàn') || name.includes('kỷ luật')) {
        return {
          Icon: ShieldCheck,
          color: "text-emerald-600 dark:text-emerald-400",
          bg: "bg-emerald-50 dark:bg-emerald-950/40",
          border: "border-emerald-100 dark:border-emerald-500/20",
          accent: "bg-emerald-500",
          glow: "shadow-emerald-500/20"
        };
    } else if (name.includes('thiết bị') || name.includes('bảo quản') || name.includes('vận chuyển')) {
        return {
          Icon: name.includes('vận chuyển') ? Truck : Wrench,
          color: "text-amber-600 dark:text-amber-400",
          bg: "bg-amber-50 dark:bg-amber-950/40",
          border: "border-amber-100 dark:border-amber-500/20",
          accent: "bg-amber-500",
          glow: "shadow-amber-500/20"
        };
    } else if (name.includes('nhân sự') || name.includes('đào tạo') || name.includes('công việc')) {
        return {
          Icon: name.includes('công việc') ? Hammer : Users,
          color: "text-rose-600 dark:text-rose-400",
          bg: "bg-rose-50 dark:bg-rose-950/40",
          border: "border-rose-100 dark:border-rose-500/20",
          accent: "bg-rose-500",
          glow: "shadow-rose-500/20"
        };
    } else if (name.includes('báo cáo') || name.includes('tuân thủ')) {
        return {
           Icon: Calculator,
           color: "text-purple-600 dark:text-purple-400",
           bg: "bg-purple-50 dark:bg-purple-950/40",
           border: "border-purple-100 dark:border-purple-500/20",
           accent: "bg-purple-500",
           glow: "shadow-purple-500/20"
        }
    }
    
    // Default
    return {
        Icon: Activity,
        color: "text-slate-500",
        bg: "bg-slate-100",
        border: "border-slate-100",
        accent: "bg-slate-500",
        glow: "shadow-slate-500/20"
    };
  };

  return (
    <div className="space-y-8 pb-10">
      {kpiData.map((category) => {
        const config = getCategoryConfig(category);
        const CategoryIcon = config.Icon;
        
        return (
          <div 
            key={category.id} 
            className="bg-white/80 dark:bg-[#0f172a]/60 backdrop-blur-xl rounded-[24px] shadow-sm hover:shadow-xl border border-white/60 dark:border-white/5 overflow-hidden scroll-mt-24 transition-all duration-300"
          >
            
            {/* Category Header Frame - Refined */}
            <div className="px-5 py-5 md:px-8 border-b border-slate-100 dark:border-white/5 flex items-center gap-4 md:gap-5 group bg-slate-50/50 dark:bg-slate-900/30">
               <div className={`flex items-center justify-center w-12 h-12 rounded-2xl ${config.bg} ${config.color} border ${config.border} shadow-inner transition-transform duration-300 group-hover:scale-105 shrink-0`}>
                  <CategoryIcon size={22} strokeWidth={2.5} />
               </div>
               <div className="flex-1">
                  <h3 className="text-lg font-bold text-slate-800 dark:text-white uppercase tracking-tight transition-colors duration-300 group-hover:text-slate-900 dark:group-hover:text-slate-100">
                      {category.name.replace(/^\d+\.\s*/, '')}
                  </h3>
                  {/* Glowing progress line */}
                  <div className={`h-1 w-12 rounded-full mt-2 opacity-80 ${config.accent} ${config.glow} shadow-lg group-hover:w-24 transition-all duration-500`}></div>
               </div>
            </div>
            
            {/* Items Container Body */}
            <div className="p-4 md:p-6 bg-slate-50/20 dark:bg-transparent">
              <div className="space-y-4">
                {category.items.map((item) => (
                  <KPIItemRow 
                    key={item.id} 
                    item={item} 
                    currentRating={ratings[item.id]} 
                    onRate={onRate}
                    onNoteChange={onNoteChange}
                    categoryColorClass={config.color}
                    accentColor={config.accent}
                  />
                ))}
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};

interface KPIItemRowProps {
  item: KPIItem;
  currentRating: EvaluationState[string] | undefined;
  onRate: (id: string, level: RatingLevel, score: number) => void;
  onNoteChange: (id: string, note: string) => void;
  categoryColorClass?: string;
  accentColor?: string;
}

const KPIItemRow: React.FC<KPIItemRowProps> = ({ item, currentRating, onRate, onNoteChange, categoryColorClass, accentColor }) => {
  
  const handleSelect = (level: RatingLevel) => {
    const criteria = item.criteria[level];
    const score = Math.round(item.maxPoints * criteria.scorePercent * 100) / 100;
    onRate(item.id, level, score);
  };

  // Determine styles based on rating
  let containerClassName = `p-4 md:p-5 relative group bg-white dark:bg-[#151e32] rounded-2xl border transition-all duration-300 ease-out `;
  let leftBorderClass = "hidden"; 
  
  if (currentRating?.level === RatingLevel.GOOD) {
    containerClassName += "border-emerald-500/30 shadow-lg shadow-emerald-500/5 dark:shadow-emerald-900/10 z-10";
    leftBorderClass = "bg-gradient-to-b from-emerald-400 to-emerald-600";
  } else if (currentRating?.level === RatingLevel.AVERAGE) {
    containerClassName += "border-amber-500/30 shadow-lg shadow-amber-500/5 dark:shadow-amber-900/10 z-10";
    leftBorderClass = "bg-gradient-to-b from-amber-400 to-amber-600";
  } else if (currentRating?.level === RatingLevel.WEAK) {
    containerClassName += "border-rose-500/30 shadow-lg shadow-rose-500/5 dark:shadow-rose-900/10 z-10";
    leftBorderClass = "bg-gradient-to-b from-rose-400 to-rose-600";
  } else {
    // Not rated state
    containerClassName += "border-slate-100 dark:border-white/5 hover:border-indigo-300 dark:hover:border-indigo-500/30 hover:shadow-lg hover:shadow-indigo-500/5 hover:-translate-y-0.5";
  }

  return (
    <div className={containerClassName}>
      
      {/* Active Indicator Line - Gradient */}
      {currentRating && (
         <div className={`absolute left-0 top-6 bottom-6 w-1 rounded-r-full ${leftBorderClass} animate-in fade-in duration-500 shadow-[0_0_8px_currentColor]`}></div>
      )}

      <div className="flex flex-col xl:flex-row gap-5 md:gap-6 lg:gap-8">
         
         {/* LEFT: Content & Checklist */}
         <div className="flex-1 flex flex-col justify-center">
            <div className="flex items-start gap-3 md:gap-4 mb-2">
               <div className={`flex items-center justify-center w-8 h-8 rounded-lg border text-[11px] font-bold shrink-0 mt-0.5 transition-colors duration-300 ${
                 currentRating 
                 ? 'bg-slate-900 text-white border-slate-900 dark:bg-white dark:text-slate-900' 
                 : 'bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-500 dark:text-slate-400'
               }`}>
                  {item.code}
               </div>
               
               <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-3">
                      <h4 className={`text-base font-bold leading-tight transition-colors duration-300 ${
                        currentRating ? 'text-slate-900 dark:text-white' : 'text-slate-700 dark:text-slate-200 group-hover:text-indigo-700 dark:group-hover:text-indigo-300'
                      }`}>
                          {item.name}
                      </h4>
                      <div className="shrink-0 inline-flex items-center px-2.5 py-1 rounded-md bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700/50 text-[11px] font-bold text-slate-600 dark:text-slate-300 whitespace-nowrap shadow-sm">
                          {item.maxPoints}đ
                      </div>
                  </div>
                  
                  {/* Checklist Points */}
                  <div className="mt-3 pt-3 border-t border-dashed border-slate-100 dark:border-white/5">
                      <div className="grid gap-1.5">
                        {item.checklist?.map((point, idx) => (
                            <div key={idx} className="flex items-start gap-2.5 group/item opacity-80 hover:opacity-100 transition-opacity">
                                <div className={`mt-[6px] w-1.5 h-1.5 rounded-full shrink-0 ${accentColor ? 'bg-' + accentColor.replace('bg-', '') : 'bg-slate-300'} opacity-60 shadow-[0_0_5px_currentColor]`}></div>
                                <span className="text-xs leading-relaxed text-slate-600 dark:text-slate-400 font-medium group-hover/item:text-slate-800 dark:group-hover/item:text-slate-300 transition-colors">
                                {point}
                                </span>
                            </div>
                        ))}
                      </div>
                  </div>
               </div>
            </div>
         </div>

         {/* RIGHT: Actions - Optimized Grid */}
         <div className="w-full xl:w-[400px] shrink-0 flex flex-col gap-4 border-t xl:border-t-0 xl:border-l border-slate-100 dark:border-white/5 pt-4 xl:pt-0 xl:pl-6 justify-center">
            
            {/* Rating Buttons - Enhanced Visuals */}
            <div className="grid grid-cols-3 gap-2 md:gap-2.5 h-auto min-h-[100px]">
               {/* Good Button */}
               <button
                  onClick={() => handleSelect(RatingLevel.GOOD)}
                  className={`flex flex-col items-center justify-center text-center gap-1.5 py-2 px-1 rounded-xl border transition-all duration-300 active:scale-95 ${
                     currentRating?.level === RatingLevel.GOOD
                     ? 'bg-gradient-to-br from-emerald-500 to-emerald-600 border-emerald-400 text-white shadow-lg shadow-emerald-500/25 ring-1 ring-emerald-400/50'
                     : 'bg-white dark:bg-slate-800/40 border-slate-200 dark:border-white/10 hover:border-emerald-500/50 hover:bg-emerald-50/50 dark:hover:bg-emerald-900/20 group/btn'
                  }`}
               >
                  <div className={`p-1 rounded-full transition-transform duration-300 ${currentRating?.level === RatingLevel.GOOD ? 'bg-white/20' : 'bg-emerald-100 dark:bg-emerald-900/30'}`}>
                    <CheckCircle size={18} className={`transition-colors duration-300 ${currentRating?.level === RatingLevel.GOOD ? 'text-white' : 'text-emerald-500'}`} />
                  </div>
                  <div className="flex flex-col gap-0.5 w-full overflow-hidden justify-center py-0.5">
                      <span className={`text-[10px] md:text-[11px] font-bold uppercase leading-normal tracking-wide ${currentRating?.level === RatingLevel.GOOD ? 'text-white' : 'text-emerald-700 dark:text-emerald-400'}`}>
                        {item.criteria[RatingLevel.GOOD].label}
                      </span>
                      <span className={`text-[9px] font-medium px-0.5 line-clamp-3 leading-tight whitespace-normal ${
                          currentRating?.level === RatingLevel.GOOD ? 'text-emerald-50' : 'text-slate-400 dark:text-slate-500'
                      }`}>
                        {item.criteria[RatingLevel.GOOD].description}
                      </span>
                  </div>
               </button>

               {/* Average Button */}
               <button
                  onClick={() => handleSelect(RatingLevel.AVERAGE)}
                  className={`flex flex-col items-center justify-center text-center gap-1.5 py-2 px-1 rounded-xl border transition-all duration-300 active:scale-95 ${
                     currentRating?.level === RatingLevel.AVERAGE
                     ? 'bg-gradient-to-br from-amber-400 to-amber-500 border-amber-400 text-white shadow-lg shadow-amber-500/25 ring-1 ring-amber-400/50'
                     : 'bg-white dark:bg-slate-800/40 border-slate-200 dark:border-white/10 hover:border-amber-500/50 hover:bg-amber-50/50 dark:hover:bg-amber-900/20 group/btn'
                  }`}
               >
                  <div className={`p-1 rounded-full transition-transform duration-300 ${currentRating?.level === RatingLevel.AVERAGE ? 'bg-white/20' : 'bg-amber-100 dark:bg-amber-900/30'}`}>
                    <AlertCircle size={18} className={`transition-colors duration-300 ${currentRating?.level === RatingLevel.AVERAGE ? 'text-white' : 'text-amber-500'}`} />
                  </div>
                  <div className="flex flex-col gap-0.5 w-full overflow-hidden justify-center py-0.5">
                      <span className={`text-[10px] md:text-[11px] font-bold uppercase leading-normal tracking-wide ${currentRating?.level === RatingLevel.AVERAGE ? 'text-white' : 'text-amber-700 dark:text-amber-500'}`}>
                        {item.criteria[RatingLevel.AVERAGE].label}
                      </span>
                      <span className={`text-[9px] font-medium px-0.5 line-clamp-3 leading-tight whitespace-normal ${
                          currentRating?.level === RatingLevel.AVERAGE ? 'text-amber-50' : 'text-slate-400 dark:text-slate-500'
                      }`}>
                        {item.criteria[RatingLevel.AVERAGE].description}
                      </span>
                  </div>
               </button>

               {/* Weak Button */}
               <button
                  onClick={() => handleSelect(RatingLevel.WEAK)}
                  className={`flex flex-col items-center justify-center text-center gap-1.5 py-2 px-1 rounded-xl border transition-all duration-300 active:scale-95 ${
                     currentRating?.level === RatingLevel.WEAK
                     ? 'bg-gradient-to-br from-rose-500 to-rose-600 border-rose-400 text-white shadow-lg shadow-rose-500/25 ring-1 ring-rose-400/50'
                     : 'bg-white dark:bg-slate-800/40 border-slate-200 dark:border-white/10 hover:border-rose-500/50 hover:bg-rose-50/50 dark:hover:bg-rose-900/20 group/btn'
                  }`}
               >
                  <div className={`p-1 rounded-full transition-transform duration-300 ${currentRating?.level === RatingLevel.WEAK ? 'bg-white/20' : 'bg-rose-100 dark:bg-rose-900/30'}`}>
                    <XCircle size={18} className={`transition-colors duration-300 ${currentRating?.level === RatingLevel.WEAK ? 'text-white' : 'text-rose-500'}`} />
                  </div>
                  <div className="flex flex-col gap-0.5 w-full overflow-hidden justify-center py-0.5">
                      <span className={`text-[10px] md:text-[11px] font-bold uppercase leading-normal tracking-wide ${currentRating?.level === RatingLevel.WEAK ? 'text-white' : 'text-rose-700 dark:text-rose-400'}`}>
                        {item.criteria[RatingLevel.WEAK].label}
                      </span>
                      <span className={`text-[9px] font-medium px-0.5 line-clamp-3 leading-tight whitespace-normal ${
                          currentRating?.level === RatingLevel.WEAK ? 'text-rose-50' : 'text-slate-400 dark:text-slate-500'
                      }`}>
                        {item.criteria[RatingLevel.WEAK].description}
                      </span>
                  </div>
               </button>
            </div>

            {/* Note Input - Minimal & Sleek */}
            <div className="relative group/note">
               <Pencil size={12} className="absolute top-3 left-3 text-slate-400 group-focus-within/note:text-indigo-500 transition-colors" />
               <textarea
                  value={currentRating?.notes || ''}
                  onChange={(e) => onNoteChange(item.id, e.target.value)}
                  placeholder="Ghi chú..."
                  className="w-full bg-slate-50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-800 rounded-lg pl-9 pr-3 py-2.5 text-xs font-medium text-slate-700 dark:text-slate-300 placeholder:text-slate-400 focus:border-indigo-500 dark:focus:border-indigo-500 focus:bg-white dark:focus:bg-slate-900 outline-none resize-none h-[38px] min-h-[38px] transition-all hover:border-slate-300 dark:hover:border-slate-700 focus:shadow-sm"
               />
            </div>
         </div>
      </div>
    </div>
  );
};

export default InputSection;