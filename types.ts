

export enum RatingLevel {
  GOOD = 'GOOD',
  AVERAGE = 'AVERAGE',
  WEAK = 'WEAK',
}

export interface KPILevelDetail {
  label: string;
  description: string;
  scorePercent: number; // 1.0 for 100%, 0.8 for 80%, etc.
}

export interface KPIItem {
  id: string;
  code: string; // e.g., 1.1
  name: string;
  maxPoints: number;
  unit?: string; // Fixed: Made optional to match constants.ts definition
  checklist?: string[]; // Added field for detailed bullet points
  criteria: {
    [RatingLevel.GOOD]: KPILevelDetail;
    [RatingLevel.AVERAGE]: KPILevelDetail;
    [RatingLevel.WEAK]: KPILevelDetail;
  };
}

export interface KPICategory {
  id: string;
  name: string;
  items: KPIItem[];
}

export interface EvaluationState {
  [kpiId: string]: {
    level: RatingLevel;
    actualScore: number;
    notes: string;
  };
}

export interface EmployeeInfo {
  name: string;
  id: string;
  position: string;
  department: string;
  reportDate: string;
}

// Interface deprecated but kept for backward compatibility if needed internally
export interface SavedReport {
  version: string;
  id: string;
  timestamp: number;
  role: string;
  employeeInfo: EmployeeInfo;
  ratings: EvaluationState;
  selectedMonth: string;
}
