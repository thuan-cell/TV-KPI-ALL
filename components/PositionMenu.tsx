
import React, { useState } from 'react';
import { UserCog, Users, Wrench, Truck, Hammer, Calculator, LogOut, ChevronRight } from 'lucide-react';
import { RoleType } from '../constants';

interface PositionMenuProps {
  onSelectRole: (role: RoleType) => void;
  currentUser?: { name: string; avatar?: string };
  onLogout: () => void;
}

// Define menu configuration outside component to prevent re-creation on render
const MENU_ITEMS = [
  { 
      role: RoleType.MANAGER, 
      icon: UserCog, 
      label: "Quản Lý",
      color: '#818cf8', 
      bg: 'bg-indigo-50',
      text: 'text-indigo-600',
      desc: "Giám sát & Điều hành"
  },
  { 
      role: RoleType.SHIFT_LEADER, 
      icon: Users, 
      label: "Trưởng Ca",
      color: '#60a5fa', 
      bg: 'bg-blue-50',
      text: 'text-blue-600',
      desc: "Quản lý ca trực"
  },
  { 
      role: RoleType.OPERATOR, 
      icon: Wrench, 
      label: "Vận Hành",
      color: '#34d399', 
      bg: 'bg-emerald-50',
      text: 'text-emerald-600',
      desc: "Kỹ thuật lò hơi"
  },
  { 
      role: RoleType.DRIVER, 
      icon: Truck, 
      label: "Lái Xe",
      color: '#fbbf24', 
      bg: 'bg-amber-50',
      text: 'text-amber-600',
      desc: "Vận chuyển hàng"
  },
  { 
      role: RoleType.WORKER, 
      icon: Hammer, 
      label: "LĐPT",
      color: '#f472b6', 
      bg: 'bg-pink-50',
      text: 'text-pink-600',
      desc: "Công việc chung"
  },
  { 
      role: RoleType.ACCOUNTANT, 
      icon: Calculator, 
      label: "Kế Toán",
      color: '#a78bfa', 
      bg: 'bg-purple-50',
      text: 'text-purple-600',
      desc: "Thống kê số liệu"
  },
];

const PositionMenu: React.FC<PositionMenuProps> = ({ onSelectRole, currentUser, onLogout }) => {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  
  // Configuration
  const size = 500;
  const center = size / 2;
  const outerRadius = size / 2;
  const innerRadius = 100;
  const gap = 4;
  
  const totalItems = MENU_ITEMS.length;
  const anglePerItem = 360 / totalItems;
  const rotationOffset = -90;

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

  return (
    <div className="flex-1 flex flex-col items-center justify-center h-[calc(100vh-100px)] min-h-[500px] relative overflow-hidden bg-slate-50 dark:bg-[#020617] p-4">
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-indigo-500/5 rounded-full blur-[80px] pointer-events-none"></div>

      <div className="relative z-10 w-full max-w-5xl mx-auto flex flex-col items-center">
        
        <div className="mb-4 text-center">
             <h2 className="text-2xl font-black text-slate-900 dark:text-white mb-2 uppercase tracking-tight">
            Chọn Vị Trí Đánh Giá
            </h2>
            <p className="text-slate-500 dark:text-slate-400 font-medium text-sm">
            Hệ thống quản lý chỉ số hiệu suất (KPI)
            </p>
        </div>

        <div className="relative w-[300px] h-[300px] xl:w-[420px] xl:h-[420px] group/menu select-none origin-center transition-all duration-500">
            
            <svg 
                viewBox={`0 0 ${size} ${size}`} 
                className="w-full h-full drop-shadow-2xl"
                style={{ filter: 'drop-shadow(0px 10px 20px rgba(0,0,0,0.1))' }}
            >
                {MENU_ITEMS.map((item, index) => {
                    const isHovered = hoveredIndex === index;
                    return (
                        <path
                            key={index}
                            d={createSectorPath(index)}
                            fill={item.color}
                            stroke="white" 
                            strokeWidth={gap}
                            className="cursor-pointer transition-all duration-300 ease-out origin-center dark:stroke-slate-900"
                            style={{
                                opacity: isHovered ? 1 : 0.2,
                                transformBox: 'fill-box',
                                transformOrigin: 'center',
                                transform: isHovered ? 'scale(1.05)' : 'scale(1)'
                            }}
                            onMouseEnter={() => setHoveredIndex(index)}
                            onMouseLeave={() => setHoveredIndex(null)}
                            onClick={() => onSelectRole(item.role)}
                        />
                    );
                })}
            </svg>

            {/* Icon Labels Overlay */}
            <div className="absolute inset-0 pointer-events-none">
                {MENU_ITEMS.map((item, index) => {
                    const angle = index * anglePerItem + (anglePerItem / 2);
                    const rad = (angle + rotationOffset) * (Math.PI / 180);
                    const radiusPercent = 33; 
                    const left = 50 + (Math.cos(rad) * radiusPercent); 
                    const top = 50 + (Math.sin(rad) * radiusPercent);
                    const isHovered = hoveredIndex === index;
                    const Icon = item.icon;

                    return (
                        <div 
                            key={index}
                            className="absolute flex flex-col items-center justify-center text-center transition-all duration-300 transform -translate-x-1/2 -translate-y-1/2"
                            style={{ 
                                left: `${left}%`, 
                                top: `${top}%`,
                                opacity: hoveredIndex !== null && !isHovered ? 0.5 : 1,
                                scale: isHovered ? 1.1 : 1
                            }}
                        >
                            <div className="bg-white/90 dark:bg-slate-900/90 backdrop-blur-sm p-2 rounded-xl shadow-sm mb-1">
                                <Icon 
                                    size={20} 
                                    className={isHovered ? '' : 'text-slate-600 dark:text-slate-300'}
                                    style={{ color: isHovered ? item.color : undefined }}
                                />
                            </div>
                            <span className={`font-black text-[9px] md:text-[10px] uppercase tracking-wider bg-white/80 dark:bg-black/50 px-2 py-0.5 rounded backdrop-blur-sm ${isHovered ? 'text-slate-900 dark:text-white' : 'text-slate-600 dark:text-slate-400'}`}>
                                {item.label}
                            </span>
                        </div>
                    );
                })}
            </div>

            {/* Center Hub */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[110px] h-[110px] xl:w-[130px] xl:h-[130px] flex items-center justify-center z-20">
                <div className="absolute inset-0 rounded-full border-4 border-white dark:border-slate-800 shadow-2xl bg-white dark:bg-slate-900 z-10 flex flex-col items-center justify-center overflow-hidden group cursor-default">
                    
                    {/* Default Center Content */}
                    <div className="absolute inset-0 bg-slate-50 dark:bg-slate-900 flex flex-col items-center justify-center transition-opacity duration-300">
                         {currentUser?.avatar ? (
                            <img src={currentUser.avatar} alt="User" className="w-full h-full object-cover opacity-90" />
                        ) : (
                            <div className="w-full h-full bg-indigo-50 dark:bg-indigo-900/30 flex items-center justify-center text-indigo-500">
                                <UserCog size={40} strokeWidth={1.5} />
                            </div>
                        )}
                        <div className="absolute bottom-0 w-full bg-gradient-to-t from-slate-900/90 to-transparent pt-6 pb-2 px-2 text-center">
                            <p className="text-white text-[10px] font-bold uppercase tracking-widest truncate">
                                {currentUser?.name || 'User'}
                            </p>
                        </div>
                    </div>

                    {/* Hover Overlay Content */}
                    {hoveredIndex !== null && (
                      <CenterInfo item={MENU_ITEMS[hoveredIndex]} />
                    )}
                </div>
            </div>

        </div>

        <div className="mt-6 flex flex-col items-center gap-3">
            <button 
                onClick={onLogout}
                className="flex items-center gap-2 text-xs font-bold text-slate-400 hover:text-rose-500 transition-colors px-5 py-2 rounded-full hover:bg-rose-50 dark:hover:bg-rose-900/20 border border-transparent hover:border-rose-200 dark:hover:border-rose-800/50"
            >
                <LogOut size={14} /> <span>Đăng xuất hệ thống</span>
            </button>
            <p className="text-[9px] text-slate-300 dark:text-slate-600 uppercase tracking-[0.2em]">
                Tri Viet Biogen KPI System v2.3
            </p>
        </div>

      </div>
    </div>
  );
};

// Sub-component for rendering hover content safely
const CenterInfo: React.FC<{ item: typeof MENU_ITEMS[0] }> = ({ item }) => {
  const Icon = item.icon;
  if (!Icon) return null;

  return (
    <div className="absolute inset-0 z-20 bg-white/95 dark:bg-slate-900/95 flex flex-col items-center justify-center p-3 text-center animate-in fade-in duration-200">
      <div className={`p-1.5 rounded-full mb-1 ${item.bg} ${item.text}`}>
          <Icon size={18} />
      </div>
      <h3 className="text-xs font-black text-slate-800 dark:text-white uppercase leading-tight mb-0.5">
          {item.label}
      </h3>
      <p className="text-[9px] text-slate-500 font-medium leading-tight line-clamp-2">
          {item.desc}
      </p>
      <div className="mt-1.5 text-[9px] font-bold text-indigo-500 flex items-center gap-0.5">
          Chọn <ChevronRight size={10} />
      </div>
    </div>
  );
};

export default PositionMenu;
