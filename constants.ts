
import { KPICategory, RatingLevel, KPIItem } from './types';
import { UserCog, Users, Wrench, Truck, Hammer, Calculator } from 'lucide-react';

// -----------------------
// ENUMS & TYPES
// -----------------------

export enum RoleType {
  MANAGER = 'MANAGER',
  SHIFT_LEADER = 'SHIFT_LEADER',
  OPERATOR = 'OPERATOR',
  DRIVER = 'DRIVER',
  WORKER = 'WORKER',
  ACCOUNTANT = 'ACCOUNTANT'
}

export const ROLE_NAMES: Record<RoleType, string> = {
  [RoleType.MANAGER]: 'Quản Lý / Giám Đốc',
  [RoleType.SHIFT_LEADER]: 'Trưởng Ca Vận Hành',
  [RoleType.OPERATOR]: 'Nhân Viên Vận Hành',
  [RoleType.DRIVER]: 'Lái Xe / Vận Chuyển',
  [RoleType.WORKER]: 'Lao Động Phổ Thông',
  [RoleType.ACCOUNTANT]: 'Kế Toán / Thống Kê'
};

// -----------------------
// MENU CONFIGURATION
// -----------------------
export const MENU_ITEMS = [
  { 
      role: RoleType.MANAGER, 
      icon: UserCog, 
      label: "Quản Lý",
      sectorHex: '#f3e8ff', // Pastel Purple
      iconHex: '#9333ea',   // Vivid Purple
      desc: "Giám sát & Điều hành"
  },
  { 
      role: RoleType.SHIFT_LEADER, 
      icon: Users, 
      label: "Trưởng Ca",
      sectorHex: '#dbeafe', // Pastel Blue
      iconHex: '#2563eb',   // Vivid Blue
      desc: "Quản lý ca trực"
  },
  { 
      role: RoleType.OPERATOR, 
      icon: Wrench, 
      label: "Vận Hành",
      sectorHex: '#d1fae5', // Pastel Emerald/Teal
      iconHex: '#059669',   // Vivid Emerald
      desc: "Kỹ thuật lò hơi"
  },
  { 
      role: RoleType.DRIVER, 
      icon: Truck, 
      label: "Lái Xe",
      sectorHex: '#fef9c3', // Pastel Yellow
      iconHex: '#ca8a04',   // Vivid Yellow
      desc: "Vận chuyển hàng"
  },
  { 
      role: RoleType.WORKER, 
      icon: Hammer, 
      label: "LĐPT",
      sectorHex: '#e0f2fe', // Pastel Sky/Cyan
      iconHex: '#0284c7',   // Vivid Sky
      desc: "Công việc chung"
  },
  { 
      role: RoleType.ACCOUNTANT, 
      icon: Calculator, 
      label: "Kế Toán",
      sectorHex: '#ffedd5', // Pastel Orange
      iconHex: '#ea580c',   // Vivid Orange
      desc: "Thống kê số liệu"
  },
];

// -----------------------
// DATASETS
// -----------------------

const DATA_MANAGER = [
  {
    name: '1. VẬN HÀNH',
    items: [
      {
        name: 'Kiểm soát sự cố',
        maxPoints: 9, 
        checklist: [
          'Theo dõi các ca vận hành, chủ động điều chỉnh khi có dấu hiệu bất thường',
          'Chỉ đạo xử lý sự cố đúng quy trình, đảm bảo an toàn và hạn chế tổn thất',
          'Phân tích nguyên nhân gốc rễ và triển khai biện pháp ngăn ngừa tái diễn',
        ],
        criteria: {
          [RatingLevel.GOOD]: { label: 'Tốt', description: 'Không có gián đoạn cấp hơi', scorePercent: 1.0 },
          [RatingLevel.AVERAGE]: { label: 'Trung bình', description: 'Có sự cố, nhưng không phải bồi thường', scorePercent: 0.7 },
          [RatingLevel.WEAK]: { label: 'Yếu', description: 'Để xảy ra sự gián đoạn cấp hơi phải bồi thường', scorePercent: 0.0 },
        },
      },
      {
        name: 'Chất lượng dịch vụ',
        maxPoints: 10, 
        checklist: [
          'Đảm bảo chất lượng hơi đầu ra ổn định theo tiêu chuẩn khách hàng',
          'Giám sát áp suất, nhiệt độ, chất lượng đạt chuẩn',
          'Không để phát sinh khiếu nại hoặc phản ánh tiêu cực từ khách hàng',
        ],
        criteria: {
          [RatingLevel.GOOD]: { label: 'Tốt', description: 'Ổn định, không có khiếu nại của khách hàng', scorePercent: 1.0 },
          [RatingLevel.AVERAGE]: { label: 'Trung bình', description: 'Có chênh lệch nhỏ so với tiêu chuẩn', scorePercent: 0.7 },
          [RatingLevel.WEAK]: { label: 'Yếu', description: 'Bị khách hàng phản ánh về chất lượng', scorePercent: 0 },
        },
      },
      {
        name: 'Kiểm soát tiêu hao',
        maxPoints: 9, 
        checklist: [
          'Giám sát tiêu hao nhiên liệu theo ca/kíp và phát hiện chênh lệch bất thường',
          'Theo dõi tiêu hao điện, nước, hóa chất và cảnh báo khi vượt định mức',
          'Triển khai giải pháp tối ưu hóa hiệu suất đốt để giảm lãng phí',
        ],
        criteria: {
          [RatingLevel.GOOD]: { label: 'Tốt', description: 'Tiêu hao nhiên liệu ≤ định mức', scorePercent: 1.0 },
          [RatingLevel.AVERAGE]: { label: 'Trung bình', description: 'Vượt định mức cho phép (+1–5%)', scorePercent: 0.7 },
          [RatingLevel.WEAK]: { label: 'Yếu', description: 'Vượt quá định mức cho phép (>10%)', scorePercent: 0.0 },
        },
      },
    ],
  },
  {
    name: '2. AN TOÀN',
    items: [
      {
        name: 'An toàn – PCCC – Môi trường',
        maxPoints: 9,
        checklist: [
          'Giám sát tuân thủ đầy đủ quy định ATLĐ và PCCC theo ca/kíp',
          'Kiểm soát khí thải, nước thải đảm bảo đạt chuẩn môi trường',
          'Chỉ đạo khắc phục ngay khi có vi phạm và tổ chức huấn luyện lại',
        ],
        criteria: {
          [RatingLevel.GOOD]: { label: 'Tốt', description: 'Không có sự cố Khí Thải, ATLĐ & PCCC', scorePercent: 1.0 },
          [RatingLevel.AVERAGE]: { label: 'Trung bình', description: 'Có vi phạm nhỏ, đã khắc phục ngay', scorePercent: 0.7 },
          [RatingLevel.WEAK]: { label: 'Yếu', description: 'Vi phạm nghiêm trọng hoặc tái diễn nhiều lần', scorePercent: 0.0 },
        },
      },
      {
        name: 'Kỷ luật – BHLĐ – Giám sát nội quy',
        maxPoints: 9, 
        checklist: [
          'Giám sát việc sử dụng đầy đủ PPE/BHLĐ trong toàn bộ thời gian làm việc',
          'Kiểm soát tuân thủ nội quy, thời gian làm việc và khu vực hạn chế',
          'Xử lý vi phạm đúng thẩm quyền và báo cáo kịp thời cho cấp trên',
        ],
        criteria: {
          [RatingLevel.GOOD]: { label: 'Tốt', description: 'Đảm bảo 100% nhân sự tuân thủ nội quy', scorePercent: 1.0 },
          [RatingLevel.AVERAGE]: { label: 'Trung bình', description: 'Nhắc nhở một số trường hợp vi phạm nhỏ', scorePercent: 0.7 },
          [RatingLevel.WEAK]: { label: 'Yếu', description: 'Có nhân sự vi phạm kỷ luật nghiêm trọng', scorePercent: 0.0 },
        },
      },
    ],
  },
  {
    name: '3. THIẾT BỊ',
    items: [
      {
        name: 'Giám sát kiểm tra máy móc, hạ tầng',
        maxPoints: 9, 
        checklist: [
          'Thực hiện kiểm tra – đánh giá hạ tầng nhà máy theo tần suất định kỳ',
          'Kiểm tra tình trạng thiết bị lò hàng ngày và ghi nhận đầy đủ',
          'Phát hiện sớm hư hỏng và đề xuất sửa chữa kịp thời',
        ],
        criteria: {
          [RatingLevel.GOOD]: { label: 'Tốt', description: 'Thực hiện kiểm tra đầy đủ 100% theo lịch tháng', scorePercent: 1.0 },
          [RatingLevel.AVERAGE]: { label: 'Trung bình', description: 'Thực hiện kiểm tra đạt 70–80% kế hoạch', scorePercent: 0.7 },
          [RatingLevel.WEAK]: { label: 'Yếu', description: 'Thực hiện kiểm tra dưới 70% kế hoạch', scorePercent: 0.0 },
        },
      },
      {
        name: 'Tuân thủ PM/CM – quản lý bảo trì',
        maxPoints: 9, 
        checklist: [
          'Tổ chức và tuân thủ bảo trì định kỳ theo kế hoạch (ngưng 24 giờ theo HĐ)',
          'Nghiệm thu chất lượng bảo trì theo tiêu chuẩn kỹ thuật',
          'Đề xuất thay thế hoặc nâng cấp thiết bị khi có dấu hiệu suy giảm',
        ],
        criteria: {
          [RatingLevel.GOOD]: { label: 'Tốt', description: 'Hoàn thành ≥98% hạng mục bảo trì', scorePercent: 1.0 },
          [RatingLevel.AVERAGE]: { label: 'Trung bình', description: 'Hoàn thành 70–80% hạng mục bảo trì', scorePercent: 0.7 },
          [RatingLevel.WEAK]: { label: 'Yếu', description: 'Không ngừng máy bảo trì đúng HĐ', scorePercent: 0 },
        },
      },
      {
        name: 'Kiểm soát 5S',
        maxPoints: 9,
        checklist: [
          'Phát hiện và ghi nhận sai phạm 5S của các ca/kíp',
          'Xử lý báo cáo đúng mức độ và đúng thời gian yêu cầu',
          'Huấn luyện lại và đề xuất cải tiến khi lỗi tái diễn',
        ],
        criteria: {
          [RatingLevel.GOOD]: { label: 'Tốt', description: 'Kiểm soát tốt 5S, không lỗi tái diễn', scorePercent: 1.0 },
          [RatingLevel.AVERAGE]: { label: 'Trung bình', description: 'Còn lỗi vi phạm nhẹ, ít tái diễn', scorePercent: 0.7 },
          [RatingLevel.WEAK]: { label: 'Yếu', description: '5S không đạt, lỗi tái diễn thường xuyên', scorePercent: 0.0 },
        },
      },
      {
        name: 'Báo cáo bảo trì, thiết bị định kỳ và đột xuất',
        maxPoints: 9,
        checklist: [
          'Gửi đầy đủ báo cáo tổng hợp tuần/tháng đúng thời hạn',
          'Báo cáo chi tiết tình trạng thiết bị – bảo trì định kỳ và đột xuất',
          'Phân tích xu hướng hư hỏng và cảnh báo nguy cơ trước khi xảy ra',
        ],
        criteria: {
          [RatingLevel.GOOD]: { label: 'Tốt', description: 'Báo cáo đầy đủ, chính xác và đúng thời hạn', scorePercent: 1.0 },
          [RatingLevel.AVERAGE]: { label: 'Trung bình', description: 'Báo cáo trễ nhẹ hoặc phải nhắc nhở', scorePercent: 0.7 },
          [RatingLevel.WEAK]: { label: 'Yếu', description: 'Không gửi báo cáo hoặc báo cáo không đúng', scorePercent: 0.0 },
        },
      },
    ],
  },
  {
    name: '4. NHÂN SỰ',
    items: [
      {
        name: 'Quản lý nhân sự',
        maxPoints: 9,
        checklist: [
          'Sắp xếp – điều phối nhân sự đảm bảo đủ quân số cho mọi ca',
          'Xử lý nghỉ đột xuất hoặc thiếu người mà không ảnh hưởng vận hành',
          'Đánh giá năng lực – thái độ và đề xuất luân chuyển phù hợp',
        ],
        criteria: {
          [RatingLevel.GOOD]: { label: 'Tốt', description: 'Đảm bảo đủ nhân sự, không trống ca', scorePercent: 1.0 },
          [RatingLevel.AVERAGE]: { label: 'Trung bình', description: 'Thiếu hụt nhân sự nhưng đã xử lý ổn thỏa', scorePercent: 0.7 },
          [RatingLevel.WEAK]: { label: 'Yếu', description: 'Thiếu nhân sự gây ảnh hưởng vận hành', scorePercent: 0.0 },
        },
      },
      {
        name: 'Đào tạo',
        maxPoints: 9,
        checklist: [
          'Đào tạo nhân viên mới và nhân viên chuyển vị trí (có hồ sơ đào tạo)',
          'Truyền đạt đầy đủ quy trình và các thay đổi mới',
          'Đánh giá năng lực định kỳ và huấn luyện sau sự cố',
        ],
        criteria: {
          [RatingLevel.GOOD]: { label: 'Tốt', description: '100% nhân viên mới được đào tạo đạt yêu cầu', scorePercent: 1.0 },
          [RatingLevel.AVERAGE]: { label: 'Trung bình', description: 'Đào tạo đạt yêu cầu ở mức khá (70-94%)', scorePercent: 0.7 },
          [RatingLevel.WEAK]: { label: 'Yếu', description: 'Công tác đào tạo chưa đạt yêu cầu (<70%)', scorePercent: 0.0 },
        },
      },
    ],
  },
];

const DATA_SHIFT_LEADER = [
    {
        name: '1. VẬN HÀNH CA',
        items: [
            {
                name: 'Điều hành ca trực',
                maxPoints: 10,
                checklist: ['Phân công nhiệm vụ rõ ràng đầu ca', 'Giám sát thông số vận hành liên tục', 'Ghi chép nhật ký đầy đủ'],
                criteria: {
                    [RatingLevel.GOOD]: { label: 'Tốt', description: 'Ca trực vận hành ổn định, không sự cố', scorePercent: 1.0 },
                    [RatingLevel.AVERAGE]: { label: 'TB', description: 'Có sai sót nhỏ trong phân công/ghi chép', scorePercent: 0.7 },
                    [RatingLevel.WEAK]: { label: 'Yếu', description: 'Để xảy ra sự cố do thiếu giám sát', scorePercent: 0.0 },
                }
            },
            {
                name: 'Xử lý sự cố cấp ca',
                maxPoints: 10,
                checklist: ['Phản ứng nhanh khi có báo động', 'Phối hợp tốt với nhân viên bảo trì', 'Báo cáo cấp trên kịp thời'],
                criteria: {
                    [RatingLevel.GOOD]: { label: 'Tốt', description: 'Xử lý triệt để sự cố trong phạm vi ca', scorePercent: 1.0 },
                    [RatingLevel.AVERAGE]: { label: 'TB', description: 'Xử lý được nhưng còn chậm', scorePercent: 0.7 },
                    [RatingLevel.WEAK]: { label: 'Yếu', description: 'Không xử lý được, gây hậu quả', scorePercent: 0.0 },
                }
            }
        ]
    },
    {
        name: '2. QUẢN LÝ NHÂN VIÊN',
        items: [
            {
                name: 'Kỷ luật lao động',
                maxPoints: 10,
                checklist: ['Kiểm tra đồng phục/PPE nhân viên', 'Giám sát giờ giấc làm việc', 'Nhắc nhở vi phạm'],
                criteria: {
                    [RatingLevel.GOOD]: { label: 'Tốt', description: '100% nhân viên ca tuân thủ', scorePercent: 1.0 },
                    [RatingLevel.AVERAGE]: { label: 'TB', description: 'Có nhân viên vi phạm nhẹ', scorePercent: 0.7 },
                    [RatingLevel.WEAK]: { label: 'Yếu', description: 'Mất kiểm soát kỷ luật ca', scorePercent: 0.0 },
                }
            }
        ]
    },
    {
        name: '3. BÁO CÁO',
        items: [
             {
                name: 'Báo cáo giao ca',
                maxPoints: 10,
                checklist: ['Số liệu chính xác', 'Ghi chú rõ các vấn đề tồn đọng', 'Giao ca đúng giờ'],
                criteria: {
                    [RatingLevel.GOOD]: { label: 'Tốt', description: 'Báo cáo chi tiết, không sai sót', scorePercent: 1.0 },
                    [RatingLevel.AVERAGE]: { label: 'TB', description: 'Có sai số nhỏ', scorePercent: 0.7 },
                    [RatingLevel.WEAK]: { label: 'Yếu', description: 'Báo cáo sai lệch nghiêm trọng', scorePercent: 0.0 },
                }
            }
        ]
    }
];

const DATA_OPERATOR = [
     {
        name: '1. VẬN HÀNH THIẾT BỊ',
        items: [
            {
                name: 'Tuân thủ quy trình',
                maxPoints: 15,
                checklist: ['Thực hiện đúng thao tác vận hành', 'Kiểm tra thông số lò hơi thường xuyên', 'Vệ sinh đầu đốt/ghi lò đúng lịch'],
                criteria: {
                    [RatingLevel.GOOD]: { label: 'Tốt', description: 'Vận hành đúng 100% quy trình', scorePercent: 1.0 },
                    [RatingLevel.AVERAGE]: { label: 'TB', description: 'Có lỗi thao tác nhỏ', scorePercent: 0.7 },
                    [RatingLevel.WEAK]: { label: 'Yếu', description: 'Vi phạm quy trình gây nguy hiểm', scorePercent: 0.0 },
                }
            },
            {
                 name: 'Hiệu suất vận hành',
                 maxPoints: 15,
                 checklist: ['Duy trì áp suất ổn định', 'Tối ưu hóa nhiên liệu', 'Xả đáy đúng quy định'],
                 criteria: {
                    [RatingLevel.GOOD]: { label: 'Tốt', description: 'Áp suất ổn định, nhiên liệu tối ưu', scorePercent: 1.0 },
                    [RatingLevel.AVERAGE]: { label: 'TB', description: 'Có dao động áp suất', scorePercent: 0.7 },
                    [RatingLevel.WEAK]: { label: 'Yếu', description: 'Gây lãng phí nhiên liệu lớn', scorePercent: 0.0 },
                 }
            }
        ]
    },
    {
        name: '2. AN TOÀN & 5S',
        items: [
             {
                name: 'Thực hiện 5S',
                maxPoints: 10,
                checklist: ['Khu vực làm việc sạch sẽ', 'Dụng cụ sắp xếp gọn gàng', 'Không để vật tư bừa bãi'],
                criteria: {
                    [RatingLevel.GOOD]: { label: 'Tốt', description: 'Khu vực luôn sạch sẽ', scorePercent: 1.0 },
                    [RatingLevel.AVERAGE]: { label: 'TB', description: 'Còn bừa bộn nhẹ', scorePercent: 0.7 },
                    [RatingLevel.WEAK]: { label: 'Yếu', description: 'Khu vực bẩn, mất vệ sinh', scorePercent: 0.0 },
                }
            },
            {
                name: 'Tuân thủ PPE',
                maxPoints: 10,
                checklist: ['Đeo mũ, giày, găng tay đầy đủ', 'Đeo nút tai chống ồn', 'Đeo khẩu trang khi tiếp xúc bụi'],
                criteria: {
                     [RatingLevel.GOOD]: { label: 'Tốt', description: 'Luôn tuân thủ 100%', scorePercent: 1.0 },
                     [RatingLevel.AVERAGE]: { label: 'TB', description: 'Phải nhắc nhở 1-2 lần', scorePercent: 0.7 },
                     [RatingLevel.WEAK]: { label: 'Yếu', description: 'Cố tình không tuân thủ', scorePercent: 0.0 },
                }
            }
        ]
    }
];

const DATA_DRIVER = [
    {
        name: '1. VẬN CHUYỂN',
        items: [
            {
                name: 'An toàn giao thông',
                maxPoints: 15,
                checklist: ['Tuân thủ luật GTĐB', 'Không uống rượu bia', 'Lái xe đúng tốc độ'],
                criteria: {
                    [RatingLevel.GOOD]: { label: 'Tốt', description: 'Không vi phạm, không va quẹt', scorePercent: 1.0 },
                    [RatingLevel.AVERAGE]: { label: 'TB', description: 'Có va quẹt nhẹ', scorePercent: 0.7 },
                    [RatingLevel.WEAK]: { label: 'Yếu', description: 'Gây tai nạn hoặc bị phạt nặng', scorePercent: 0.0 },
                }
            },
            {
                name: 'Đáp ứng tiến độ',
                maxPoints: 15,
                checklist: ['Giao/nhận hàng đúng giờ', 'Sẵn sàng tăng ca khi cần', 'Lộ trình di chuyển hợp lý'],
                criteria: {
                    [RatingLevel.GOOD]: { label: 'Tốt', description: 'Luôn đúng giờ', scorePercent: 1.0 },
                    [RatingLevel.AVERAGE]: { label: 'TB', description: 'Trễ giờ 1-2 lần có lý do', scorePercent: 0.7 },
                    [RatingLevel.WEAK]: { label: 'Yếu', description: 'Thường xuyên trễ giờ', scorePercent: 0.0 },
                }
            }
        ]
    },
    {
        name: '2. BẢO QUẢN XE',
        items: [
            {
                name: 'Bảo trì bảo dưỡng',
                maxPoints: 10,
                checklist: ['Kiểm tra xe hàng ngày', 'Vệ sinh xe sạch sẽ', 'Báo cáo hư hỏng kịp thời'],
                criteria: {
                    [RatingLevel.GOOD]: { label: 'Tốt', description: 'Xe luôn sạch, máy móc ổn định', scorePercent: 1.0 },
                    [RatingLevel.AVERAGE]: { label: 'TB', description: 'Xe bẩn hoặc quên kiểm tra', scorePercent: 0.7 },
                    [RatingLevel.WEAK]: { label: 'Yếu', description: 'Để xe hư hỏng do thiếu chăm sóc', scorePercent: 0.0 },
                }
            },
            {
                name: 'Định mức nhiên liệu',
                maxPoints: 10,
                checklist: ['Chạy đúng định mức khoán', 'Không gian lận nhiên liệu'],
                criteria: {
                    [RatingLevel.GOOD]: { label: 'Tốt', description: 'Đạt hoặc thấp hơn định mức', scorePercent: 1.0 },
                    [RatingLevel.AVERAGE]: { label: 'TB', description: 'Vượt định mức <5%', scorePercent: 0.7 },
                    [RatingLevel.WEAK]: { label: 'Yếu', description: 'Vượt định mức >5%', scorePercent: 0.0 },
                }
            }
        ]
    }
];

const DATA_WORKER = [
     {
        name: '1. CÔNG VIỆC',
        items: [
            {
                name: 'Hiệu quả công việc',
                maxPoints: 20,
                checklist: ['Hoàn thành khối lượng được giao', 'Chất lượng công việc đảm bảo', 'Chủ động trong công việc'],
                criteria: {
                    [RatingLevel.GOOD]: { label: 'Tốt', description: 'Hoàn thành xuất sắc, vượt định mức', scorePercent: 1.0 },
                    [RatingLevel.AVERAGE]: { label: 'TB', description: 'Hoàn thành đủ định mức', scorePercent: 0.7 },
                    [RatingLevel.WEAK]: { label: 'Yếu', description: 'Không hoàn thành định mức', scorePercent: 0.0 },
                }
            }
        ]
     },
     {
        name: '2. KỶ LUẬT',
        items: [
            {
                name: 'Giờ giấc & Nội quy',
                maxPoints: 15,
                checklist: ['Đi làm đúng giờ', 'Không làm việc riêng', 'Tuân thủ chỉ đạo của tổ trưởng'],
                criteria: {
                    [RatingLevel.GOOD]: { label: 'Tốt', description: 'Chấp hành nghiêm chỉnh', scorePercent: 1.0 },
                    [RatingLevel.AVERAGE]: { label: 'TB', description: 'Có vi phạm nhỏ (đi trễ)', scorePercent: 0.7 },
                    [RatingLevel.WEAK]: { label: 'Yếu', description: 'Chống đối hoặc thường xuyên vắng', scorePercent: 0.0 },
                }
            },
            {
                name: 'Vệ sinh & 5S',
                maxPoints: 15,
                checklist: ['Dọn dẹp sạch sẽ sau khi làm', 'Sắp xếp dụng cụ đúng nơi quy định'],
                criteria: {
                    [RatingLevel.GOOD]: { label: 'Tốt', description: 'Luôn gọn gàng sạch sẽ', scorePercent: 1.0 },
                    [RatingLevel.AVERAGE]: { label: 'TB', description: 'Còn sót rác/dụng cụ', scorePercent: 0.7 },
                    [RatingLevel.WEAK]: { label: 'Yếu', description: 'Bừa bãi, gây cản trở', scorePercent: 0.0 },
                }
            }
        ]
     }
];

const DATA_ACCOUNTANT = [
    {
        name: '1. CHUYÊN MÔN',
        items: [
            {
                name: 'Độ chính xác số liệu',
                maxPoints: 20,
                checklist: ['Nhập liệu chính xác', 'Không sai sót số học', 'Đối chiếu công nợ/tồn kho đúng'],
                criteria: {
                    [RatingLevel.GOOD]: { label: 'Tốt', description: 'Số liệu chính xác 100%', scorePercent: 1.0 },
                    [RatingLevel.AVERAGE]: { label: 'TB', description: 'Sai sót nhỏ, đã sửa kịp thời', scorePercent: 0.7 },
                    [RatingLevel.WEAK]: { label: 'Yếu', description: 'Sai lệch số liệu nghiêm trọng', scorePercent: 0.0 },
                }
            },
            {
                name: 'Tiến độ báo cáo',
                maxPoints: 15,
                checklist: ['Gửi báo cáo ngày/tuần đúng giờ', 'Hoàn thành quyết toán tháng đúng hạn'],
                criteria: {
                    [RatingLevel.GOOD]: { label: 'Tốt', description: 'Luôn đúng hoặc sớm hơn hạn', scorePercent: 1.0 },
                    [RatingLevel.AVERAGE]: { label: 'TB', description: 'Trễ hạn 1-2 lần (có lý do)', scorePercent: 0.7 },
                    [RatingLevel.WEAK]: { label: 'Yếu', description: 'Thường xuyên trễ hạn', scorePercent: 0.0 },
                }
            }
        ]
    },
    {
        name: '2. TUÂN THỦ',
        items: [
             {
                name: 'Quy trình kế toán',
                maxPoints: 15,
                checklist: ['Lưu trữ chứng từ khoa học', 'Tuân thủ quy định tài chính công ty', 'Bảo mật thông tin lương/giá'],
                criteria: {
                    [RatingLevel.GOOD]: { label: 'Tốt', description: 'Tuân thủ tuyệt đối', scorePercent: 1.0 },
                    [RatingLevel.AVERAGE]: { label: 'TB', description: 'Có lỗi sắp xếp chứng từ', scorePercent: 0.7 },
                    [RatingLevel.WEAK]: { label: 'Yếu', description: 'Làm mất chứng từ hoặc lộ thông tin', scorePercent: 0.0 },
                }
            }
        ]
    }
];


// -----------------------
// HELPER FUNCTIONS
// -----------------------

function processData(rawData: any[]): KPICategory[] {
    return rawData.map((cat, catIndex) => ({
        id: `cat_${catIndex + 1}`,
        name: cat.name,
        items: cat.items.map((item: any, itemIndex: number) => ({
            ...item,
            id: `${catIndex + 1}.${itemIndex + 1}`,
            code: `${catIndex + 1}.${itemIndex + 1}`,
            unit: `${item.maxPoints}đ`,
        }))
    }));
}

export const getKPIDataByRole = (role: RoleType): KPICategory[] => {
    switch (role) {
        case RoleType.MANAGER: return processData(DATA_MANAGER);
        case RoleType.SHIFT_LEADER: return processData(DATA_SHIFT_LEADER);
        case RoleType.OPERATOR: return processData(DATA_OPERATOR);
        case RoleType.DRIVER: return processData(DATA_DRIVER);
        case RoleType.WORKER: return processData(DATA_WORKER);
        case RoleType.ACCOUNTANT: return processData(DATA_ACCOUNTANT);
        default: return processData(DATA_MANAGER);
    }
}

// For backward compatibility
export const KPI_DATA = processData(DATA_MANAGER);
