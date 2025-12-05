
import React from 'react';
import { EvaluationState, EmployeeInfo, KPICategory } from '../types';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid,
  PieChart, 
  Pie, 
  Cell, 
  Legend 
} from 'recharts';
import { CheckCircle2, AlertTriangle, FileText, Calendar, Layers } from 'lucide-react';

interface DashboardReportProps {
  ratings: EvaluationState;
  selectedMonth: string;
  totalScore: number;
  maxTotalScore: number;
  percent: number;
  ranking: string;
  categoryScores: any[];
  employeeInfo: EmployeeInfo;
  logoUrl: string | null;
  penaltyApplied?: boolean;
  kpiData: KPICategory[]; // New prop
}

const DashboardReport: React.FC<DashboardReportProps> = ({
  ratings,
  selectedMonth,
  totalScore,
  maxTotalScore,
  percent,
  ranking,
  categoryScores,
  employeeInfo,
  logoUrl,
  penaltyApplied,
  kpiData
}) => {
  const [year, month] = selectedMonth.split('-');
  const reportDateObj = employeeInfo.reportDate ? new Date(employeeInfo.reportDate) : new Date();

  const COLORS = ['#6366f1', '#10b981', '#f59e0b', '#f43f5e'];

  return (
    // ADJUSTED PADDING FOR TIGHTER MARGINS (5mm)
    // px-[5mm] creates a balanced 0.5cm margin on left and right.
    <div className="bg-white text-slate-900 font-sans w-full px-[5mm] py-[5mm] relative box-border flex flex-col h-full min-h-[297mm]">

      {/* ---------------- HEADER ---------------- */}
      <div className="border-b-2 border-slate-900 pb-2 mb-2">
        
        {/* TOP ROW: LOGO & META INFO */}
        <div className="flex justify-between items-center mb-2">
            
            {/* Logo Section */}
            <div className="flex items-center gap-4">
                 <div className="h-12 w-auto max-w-[150px] flex items-center">
                    <img
                        src={logoUrl || "/triviet-logo.png"}
                        alt="Logo"
                        className="h-full w-auto object-contain object-left"
                    />
                 </div>
                 <div className="h-8 w-px bg-slate-300 mx-1"></div>
                 <div className="flex flex-col justify-center items-center">
                    <p className="text-[9px] font-bold uppercase tracking-wide leading-tight text-slate-800">
                        Công Ty TNHH Năng Lượng Trí Việt Biogen
                    </p>
                    <p className="text-[10px] font-medium leading-tight text-slate-500 mt-0.5">
                        Hệ thống đánh giá KPI
                    </p>
                 </div>
            </div>

             {/* Meta Info Box */}
            <div className="flex bg-slate-50 border border-slate-200 rounded-lg overflow-hidden shadow-sm scale-90 origin-right">
              <div className="px-3 py-1.5 border-r border-slate-200 flex flex-col items-center justify-center min-w-[80px]">
                <span className="text-[8px] font-bold uppercase text-slate-400 flex items-center gap-1 mb-0.5">
                  <Calendar size={10} /> Kỳ đánh giá
                </span>
                <span className="text-blue-700 font-black text-[11px] whitespace-nowrap">
                  THÁNG {month}/{year}
                </span>
              </div>
              <div className="px-3 py-1.5 border-r border-slate-200 flex flex-col items-center justify-center min-w-[80px]">
                <span className="text-[8px] font-bold uppercase text-slate-400 flex items-center gap-1 mb-0.5">
                  <FileText size={10} /> Ngày lập
                </span>
                <span className="text-slate-800 font-bold text-[11px] whitespace-nowrap">
                  {reportDateObj.toLocaleDateString("vi-VN")}
                </span>
              </div>
              <div className="px-3 py-1.5 flex flex-col items-center justify-center min-w-[80px]">
                <span className="text-[8px] font-bold uppercase text-slate-400 flex items-center gap-1 mb-0.5">
                  <Layers size={10} /> Mã biểu mẫu
                </span>
                <span className="font-bold text-[11px] text-slate-800 whitespace-nowrap">BM-KPI-01</span>
              </div>
            </div>
        </div>

        {/* CENTER TITLE */}
        <div className="text-center w-full mt-1">
             <h1 className="text-2xl font-black text-blue-900 uppercase leading-tight tracking-tight mb-1">
                ĐÁNH GIÁ HIỆU QUẢ CÔNG VIỆC
             </h1>
             <div className="flex items-center justify-center gap-4 opacity-80">
                <div className="h-px w-12 bg-gradient-to-r from-transparent to-slate-400"></div>
                <p className="text-[9px] font-bold text-slate-500 uppercase tracking-[0.3em]">
                    Performance Appraisal Report
                </p>
                <div className="h-px w-12 bg-gradient-to-l from-transparent to-slate-400"></div>
             </div>
        </div>
      </div>



      {/* --- EMPLOYEE INFO (Single Row Compact) --- */}
      <div className="bg-slate-50 border border-slate-200 rounded p-1.5 mb-2 grid grid-cols-4 gap-4 text-[10px]">
         <div className="flex flex-col border-r border-slate-200 pr-2">
            <span className="text-slate-500 uppercase text-[8px] mb-0.5">Họ và tên</span>
            <span className="font-bold uppercase text-blue-900 text-[11px]">{employeeInfo.name || '................................'}</span>
         </div>
         <div className="flex flex-col border-r border-slate-200 pr-2">
            <span className="text-slate-500 uppercase text-[8px] mb-0.5">Mã nhân viên</span>
            <span className="font-bold text-slate-800">{employeeInfo.id || '................................'}</span>
         </div>
         <div className="flex flex-col border-r border-slate-200 pr-2">
            <span className="text-slate-500 uppercase text-[8px] mb-0.5">Chức vụ</span>
            <span className="font-bold text-slate-800">{employeeInfo.position || '................................'}</span>
         </div>
         <div className="flex flex-col">
            <span className="text-slate-500 uppercase text-[8px] mb-0.5">Bộ phận</span>
            <span className="font-bold text-slate-800">{employeeInfo.department || '................................'}</span>
         </div>
      </div>

      {/* --- DASHBOARD VISUALS (Adjusted Height) --- */}
      <div className="grid grid-cols-3 gap-2 mb-2 h-24">
         {/* KPI SCORE CARD */}
         <div className="col-span-1 bg-white rounded border border-slate-200 p-1 flex flex-col items-center justify-center text-center relative overflow-hidden shadow-sm">
            <div className="absolute top-0 right-0 p-1 opacity-5">
               <CheckCircle2 size={50} />
            </div>
            <div className="text-[9px] font-bold text-slate-500 uppercase tracking-wider mb-0.5">Tổng Điểm</div>
            <div className="text-3xl font-extrabold text-blue-900 leading-none mb-0.5">{Number(totalScore).toFixed(2)}</div>
            <div className="text-slate-400 text-[8px] font-medium mb-1">/ {maxTotalScore} điểm tối đa</div>
            <div className={`px-3 py-0.5 rounded-full text-[9px] font-bold border ${
               percent >= 90 ? 'bg-green-100 text-green-800 border-green-200' :
               percent >= 70 ? 'bg-blue-100 text-blue-800 border-blue-200' :
               'bg-red-100 text-red-800 border-red-200'
            }`}>
               XẾP LOẠI: {ranking.toUpperCase()}
            </div>
            
            {penaltyApplied && (
               <div className="text-[8px] font-bold text-red-600 mt-1 flex items-center justify-center gap-1 bg-red-50 px-2 py-0.5 rounded border border-red-100">
                 <AlertTriangle size={10} /> Đã trừ 30 điểm (Lỗi Yếu)
               </div>
            )}
         </div>

         {/* PIE CHART (Donut Style - Replacing Radar) */}
         <div className="col-span-1 border border-slate-200 rounded p-1 relative shadow-sm flex items-center justify-center">
            <div className="absolute top-1 left-2 text-[8px] font-bold text-slate-500 uppercase tracking-wider">Cơ cấu điểm</div>
            <div className="w-full h-full flex items-center justify-center">
                <PieChart width={180} height={100}>
                <Pie
                    data={categoryScores}
                    cx="50%"
                    cy="50%"
                    innerRadius={20}
                    outerRadius={35}
                    paddingAngle={2}
                    dataKey="score"
                    nameKey="shortName"
                    isAnimationActive={false}
                    labelLine={false}
                    label={({ cx, cy, midAngle, innerRadius, outerRadius, percent, index }) => {
                        const RADIAN = Math.PI / 180;
                        const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
                        const x = cx + radius * Math.cos(-midAngle * RADIAN);
                        const y = cy + radius * Math.sin(-midAngle * RADIAN);
                        return percent > 0.05 ? (
                            <text x={x} y={y} fill="white" textAnchor="middle" dominantBaseline="central" fontSize={7} fontWeight="bold">
                            {`${(percent * 100).toFixed(0)}%`}
                            </text>
                        ) : null;
                    }}
                >
                    {categoryScores.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                </Pie>
                <Legend iconSize={7} wrapperStyle={{ fontSize: '7px', bottom: 0 }} layout="horizontal" align="center" verticalAlign="bottom" />
                </PieChart>
            </div>
         </div>

         {/* BAR CHART (Vertical Columns - Dark Blue Theme) */}
         <div className="col-span-1 border border-slate-200 rounded p-1 relative shadow-sm flex items-center justify-center">
            <div className="absolute top-1 left-2 text-[8px] font-bold text-slate-500 uppercase tracking-wider">Chi tiết theo mục</div>
            <div className="w-full h-full flex items-center justify-center pl-2 pt-2">
                <BarChart width={180} height={100} data={categoryScores} margin={{ top: 10, right: 5, left: -25, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                <XAxis dataKey="shortName" tick={{fontSize: 7, fill: '#0f172a', fontWeight: 600}} interval={0} />
                <YAxis tick={{fontSize: 7, fill: '#64748b'}} domain={[0, 'dataMax']} />
                <Bar dataKey="max" fill="#cbd5e1" radius={[2, 2, 0, 0]} barSize={8} name="Tối đa" isAnimationActive={false} />
                <Bar dataKey="score" fill="#1e3a8a" radius={[2, 2, 0, 0]} barSize={8} name="Đạt được" isAnimationActive={false} />
                <Legend iconSize={7} wrapperStyle={{ fontSize: '7px', paddingTop: '2px' }} />
                </BarChart>
            </div>
         </div>
      </div>

      {/* --- DETAILED TABLE (Condensed with p-1 padding) --- */}
      <div className="mb-2 mt-2">
         <h3 className="text-[9px] font-bold text-white bg-blue-900 uppercase py-0.5 px-2 mb-0 rounded-t inline-block">Bảng điểm chi tiết</h3>
         <div className="border-t-2 border-blue-900">
            <table className="w-full text-[9px] border-collapse">
                <thead>
                <tr className="bg-slate-100 text-slate-800 uppercase font-bold">
                    <th className="border border-slate-300 p-1 text-center w-6">TT</th>
                    <th className="border border-slate-300 p-1 text-left">Nội dung / Tiêu chí đánh giá</th>
                    <th className="border border-slate-300 p-1 text-center w-8">Max</th>
                    <th className="border border-slate-300 p-1 text-center w-8">Đạt</th>
                    <th className="border border-slate-300 p-1 text-center w-14">Xếp loại</th>
                    <th className="border border-slate-300 p-1 text-left w-[30%]">Ghi chú</th>
                </tr>
                </thead>
                <tbody>
                {kpiData.map(category => (
                    <React.Fragment key={category.id}>
                        <tr className="bg-blue-50/50 font-bold text-blue-900">
                            <td className="border border-slate-300 p-1 text-center">{category.id.split('_')[1]}</td>
                            <td className="border border-slate-300 p-1" colSpan={5}>{category.name}</td>
                        </tr>
                        {category.items.map(item => {
                            const rating = ratings[item.id];
                            return (
                            <tr key={item.id}>
                                <td className="border border-slate-300 p-1 text-center text-slate-500">{item.code}</td>
                                <td className="border border-slate-300 p-1">
                                    <div className="font-semibold text-slate-800">{item.name}</div>
                                    <div className="text-slate-500 italic mt-0.5 text-[8px] leading-tight">
                                        {rating ? item.criteria[rating.level].description : `Mục tiêu: ${item.criteria['GOOD'].description}`}
                                    </div>
                                </td>
                                <td className="border border-slate-300 p-1 text-center text-slate-500">{item.maxPoints}</td>
                                <td className="border border-slate-300 p-1 text-center font-bold text-slate-800">{rating ? rating.actualScore.toFixed(2) : '0.00'}</td>
                                <td className="border border-slate-300 p-1 text-center">
                                    {rating ? (
                                        <span className={`inline-flex items-center gap-0.5 px-1.5 py-0 rounded text-[8px] font-bold border ${
                                        rating.level === 'GOOD' ? 'bg-green-50 text-green-700 border-green-200' :
                                        rating.level === 'AVERAGE' ? 'bg-yellow-50 text-yellow-700 border-yellow-200' :
                                        'bg-red-50 text-red-700 border-red-200'
                                        }`}>
                                        {rating.level === 'GOOD' ? 'TỐT' : rating.level === 'AVERAGE' ? 'TBÌNH' : 'YẾU'}
                                        </span>
                                    ) : <span className="text-slate-300">-</span>}
                                </td>
                                <td className="border border-slate-300 p-1 text-slate-600 whitespace-normal break-words">{rating?.notes}</td>
                            </tr>
                            );
                        })}
                    </React.Fragment>
                ))}
                </tbody>
            </table>
         </div>
      </div>

      {/* --- SIGNATURES (Bottom Positioned) --- */}
      <div className="grid grid-cols-3 gap-8 mt-4">
         <div className="text-center">
            <div className="font-bold text-[9px] uppercase mb-24 text-slate-800">Người được đánh giá</div>
            <div className="border-t border-slate-300 w-24 mx-auto pt-1 text-[9px] font-bold text-slate-900 uppercase">
                {employeeInfo.name || ''}
            </div>
         </div>
         <div className="text-center">
            <div className="font-bold text-[9px] uppercase mb-24 text-slate-800">Người đánh giá</div>
            <div className="border-t border-slate-300 w-24 mx-auto pt-1 text-[8px] text-slate-400 italic">Ký & ghi rõ họ tên</div>
         </div>
         <div className="text-center">
            <div className="font-bold text-[9px] uppercase mb-24 text-slate-800">Giám đốc phê duyệt</div>
            <div className="border-t border-slate-300 w-24 mx-auto pt-1 text-[8px] text-slate-400 italic">Ký & ghi rõ họ tên</div>
         </div>
      </div>
    </div>
  );
};

export default DashboardReport;
