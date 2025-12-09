
import React, { useState } from 'react';
import { UserCog, Users, Wrench, Truck, Hammer, Calculator, LogOut, ChevronRight, MousePointer2 } from 'lucide-react';
import { RoleType } from '../constants';

interface PositionMenuProps {
  onSelectRole: (role: RoleType) => void;
  currentUser?: { name: string; avatar?: string };
  onLogout: () => void;
  onHoverRole?: (role: RoleType | null) => void;
}

// Define menu configuration with Pastel Sectors and Vivid Icons (Synced with constants.ts)
const MENU_ITEMS = [
  { 
      role: RoleType.MANAGER, 
      icon: UserCog, 
      label: "Quản Lý",
      sectorHex: '#E9D5FF', // Pastel Purple
      iconHex: '#9333EA',   // Vivid Purple
      desc: "Giám sát & Điều hành"
  },
  { 
      role: RoleType.SHIFT_LEADER, 
      icon: Users, 
      label: "Trưởng Ca",
      sectorHex: '#E2E8F0', // Pastel Slate
      iconHex: '#3B82F6',   // Vivid Blue
      desc: "Quản lý ca trực"
  },
  { 
      role: RoleType.OPERATOR, 
      icon: Wrench, 
      label: "Vận Hành",
      sectorHex: '#DCFCE7', // Pastel Green
      iconHex: '#16A34A',   // Vivid Green
      desc: "Kỹ thuật lò hơi"
  },
  { 
      role: RoleType.DRIVER, 
      icon: Truck, 
      label: "Lái Xe",
      sectorHex: '#FEF3C7', // Pastel Yellow
      iconHex: '#D97706',   // Vivid Amber
      desc: "Vận chuyển hàng"
  },
  { 
      role: RoleType.WORKER, 
      icon: Hammer, 
      label: "LĐPT",
      sectorHex: '#E0F2FE', // Pastel Sky
      iconHex: '#0284C7',   // Vivid Sky
      desc: "Công việc chung"
  },
  { 
      role: RoleType.ACCOUNTANT, 
      icon: Calculator, 
      label: "Kế Toán",
      sectorHex: '#FFEDD5', // Pastel Orange
      iconHex: '#EA580C',   // Vivid Orange
      desc: "Thống kê số liệu"
  },
];

// Helper to get initials from name (e.g. "Văn Quốc Thu" -> "VT")
const getInitials = (name: string) => {
  if (!name) return 'VT';
  const parts = name.trim().split(/\s+/);
  if (parts.length === 0) return 'VT';
  if (parts.length === 1) return parts[0].substring(0, 2).toUpperCase();
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
};

const PositionMenu: React.FC<PositionMenuProps> = ({ onSelectRole, currentUser, onLogout, onHoverRole }) => {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  
  // Adjusted configuration to prevent overflow
  const size = 500;
  const center = size / 2;
  const outerRadius = 215; // Decreased from 250 to 215 to allow hover expansion
  const innerRadius = 90;
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

  const initials = getInitials(currentUser?.name || 'User');

  const handleMouseEnter = (index: number, role: RoleType) => {
    setHoveredIndex(index);
    if (onHoverRole) onHoverRole(role);
  };

  const handleMouseLeave = () => {
    setHoveredIndex(null);
    if (onHoverRole) onHoverRole(null);
  };

  return (
    <div className="w-full h-full flex flex-col items-center justify-center relative overflow-hidden p-0 sm:p-4">
      
      {/* Background glow specific to menu area */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[80%] h-[80%] bg-indigo-500/5 rounded-full blur-[80px] pointer-events-none"></div>

      <div className="relative z-10 w-full max-w-4xl mx-auto flex flex-col items-center justify-center h-full">
        
        {/* Menu Header - Only visible if enough height */}
        <div className="mb-4 xl:mb-8 text-center shrink-0">
             <h2 className="text-xl md:text-2xl font-black text-slate-900 dark:text-white mb-2 uppercase tracking-tight flex items-center justify-center gap-2">
               <MousePointer2 size={24} className="text-indigo-500 animate-bounce" />
               Chọn Vị Trí
            </h2>
            <p className="text-slate-500 dark:text-slate-400 font-medium text-xs md:text-sm max-w-md mx-auto">
              Di chuột vào từng mục để xem tiêu chí đánh giá bên phải
            </p>
        </div>

        {/* Scalable SVG Container */}
        <div className="relative w-full max-w-[360px] md:max-w-[420px] aspect-square group/menu select-none origin-center transition-all duration-500 shrink-0">
            
            <svg 
                viewBox={`0 0 ${size} ${size}`} 
                className="w-full h-full drop-shadow-2xl overflow-visible"
                style={{ filter: 'drop-shadow(0px 10px 30px rgba(0,0,0,0.15))' }}
            >
                {MENU_ITEMS.map((item, index) => {
                    const isHovered = hoveredIndex === index;
                    return (
                        <path
                            key={index}
                            d={createSectorPath(index)}
                            fill={isHovered ? item.iconHex : item.sectorHex}
                            stroke="white" 
                            strokeWidth={gap}
                            className="cursor-pointer transition-all duration-300 ease-out origin-center dark:stroke-[#020617] hover:brightness-110"
                            style={{
                                opacity: 1, 
                                transformBox: 'fill-box',
                                transformOrigin: 'center',
                                transform: 'scale(1)', // REMOVED SCALING
                                filter: isHovered ? 'drop-shadow(0px 0px 10px rgba(0,0,0,0.1))' : 'none'
                            }}
                            onMouseEnter={() => handleMouseEnter(index, item.role)}
                            onMouseLeave={handleMouseLeave}
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
                    
                    const radiusPercent = 30.5; 
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
                                scale: 1, // REMOVED SCALING
                                zIndex: isHovered ? 20 : 10
                            }}
                        >
                            <div className={`p-2.5 rounded-2xl shadow-sm mb-1 transition-all duration-300 bg-transparent`}>
                                <Icon 
                                    size={20} 
                                    style={{ color: isHovered ? 'white' : item.iconHex }} 
                                />
                            </div>
                            <span className={`font-black text-[9px] md:text-[10px] uppercase tracking-wider px-2 py-0.5 rounded-md backdrop-blur-sm transition-all ${
                                isHovered 
                                ? 'text-white drop-shadow-md' 
                                : 'text-slate-600 dark:text-slate-400'
                            }`}>
                                {item.label}
                            </span>
                        </div>
                    );
                })}
            </div>

            {/* Center Hub */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[22%] h-[22%] flex items-center justify-center z-20">
                <div className="absolute inset-0 rounded-full border-[6px] border-[#020617] dark:border-slate-950 shadow-2xl z-10 flex flex-col items-center justify-center overflow-hidden group cursor-default bg-slate-900">
                    
                    {/* Default Center Content */}
                    <div className="absolute inset-0 bg-gradient-to-br from-red-600 to-rose-700 flex flex-col items-center justify-center transition-opacity duration-300">
                        <div className="flex flex-col items-center justify-center">
                            <span className="text-2xl md:text-3xl font-bold text-white tracking-tighter drop-shadow-lg leading-none">
                                {initials}
                            </span>
                        </div>
                        <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-b from-white/10 to-transparent pointer-events-none"></div>
                    </div>

                    {/* Hover Overlay Content */}
                    {hoveredIndex !== null && (
                      <CenterInfo item={MENU_ITEMS[hoveredIndex]} />
                    )}
                </div>
            </div>

        </div>

        <div className="mt-8 flex flex-col items-center gap-3 shrink-0">
            <button 
                onClick={onLogout}
                className="flex items-center gap-2 text-xs font-bold text-slate-400 hover:text-rose-500 transition-colors px-5 py-2 rounded-full hover:bg-rose-50 dark:hover:bg-rose-900/20 border border-transparent hover:border-rose-200 dark:hover:border-rose-800/50"
            >
                <LogOut size={14} /> <span>Đăng xuất hệ thống</span>
            </button>
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
    <div className="absolute inset-0 z-20 bg-white dark:bg-slate-900 flex flex-col items-center justify-center p-2 text-center animate-in zoom-in-90 duration-200">
      <div 
        className="p-1 rounded-full mb-0.5"
        style={{ backgroundColor: item.sectorHex, color: item.iconHex }}
      >
          <Icon size={14} />
      </div>
      <h3 className="text-[10px] font-black text-slate-800 dark:text-white uppercase leading-tight mb-px truncate w-full px-1">
          {item.label}
      </h3>
      <div className="mt-0.5 text-[8px] font-bold text-indigo-500 flex items-center gap-0.5">
          Chọn <ChevronRight size={8} />
      </div>
    </div>
  );
};

export default PositionMenu;
