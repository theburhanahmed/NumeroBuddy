/**
 * Numerobuddy Engines API types (rule-based, conflict resolution).
 */

export interface EngineWarning {
  type: string;
  severity: 'high' | 'medium' | 'low' | 'info';
  message: string;
  override?: boolean;
  number?: number;
  digit?: string;
  blocked_remedies?: string[];
  [key: string]: unknown;
}

export interface ValidationReport {
  summary: {
    total_calculations: number;
    total_ignored: number;
    recommendations_allowed: number;
    recommendations_blocked: number;
    risks_detected: number;
    conflicts_resolved: number;
    warnings_emitted: number;
  };
  validation_summary?: {
    deterministic_calculations: number;
    high_severity_warnings: number;
    validation_passed: boolean;
  };
  calculations?: unknown[];
  warnings_emitted?: EngineWarning[];
  conflicts_resolved?: unknown[];
}

export interface EnginesCoreNumbersResult {
  birth_number: number;
  destiny_number: number;
  master_numbers: number[];
  karmic_debts: number[];
  birth_traits: Record<string, unknown>;
  destiny_traits: Record<string, unknown>;
  warnings: EngineWarning[] | Array<Record<string, unknown>>;
  mark: string;
  validation_report?: ValidationReport;
}

export interface EnginesPersonalYearParams {
  birth_day: number;
  birth_month: number;
  birth_year: number;
  target_year: number;
  driver_number: number;
  compound_number?: number;
  enable_validation?: boolean;
}

export interface EnginesPersonalYearResult {
  universal_year: number;
  personal_year: number;
  running_age: number;
  status: string;
  symbol: string;
  py_significance?: string;
  positive_aspects?: string[];
  negative_aspects?: string[];
  personal_months?: Array<{ month: number; value: number }>;
  warning: EngineWarning[] | Record<string, unknown> | null;
  remedy: Record<string, unknown> | null;
  mark: string;
  validation_report?: ValidationReport;
}

export interface EnginesCompatibility81Params {
  psychic1: number;
  destiny1: number;
  psychic2?: number;
  destiny2?: number;
  enable_validation?: boolean;
}

export interface EnginesCompatibility81Result {
  internal_rating: string;
  punch_line: string;
  is_opposite_conflict: boolean;
  lucky_numbers: number[];
  neutral_numbers: number[];
  enemy_numbers: number[];
  warnings: EngineWarning[];
  partner_compatibility?: {
    relation: string;
    rating?: string;
    note: string;
    overridden?: boolean;
  };
  mark: string;
  validation_report?: ValidationReport;
}

export interface EnginesLoShuParams {
  dob_day: number;
  dob_month: number;
  dob_year: number;
  driver: number;
  conductor: number;
  birth_number?: number;
  destiny_number?: number;
  enable_validation?: boolean;
}

export interface EnginesLoShuResult {
  counts: Record<string, number>;
  missing_info: Array<{
    number: number;
    trait?: string;
    remedy?: Record<string, unknown>;
    donation?: string;
  }>;
  traits: Record<string, string>;
  warnings: EngineWarning[];
  mark: string;
  validation_report?: ValidationReport;
}

export interface EnginesCompoundParams {
  number: number;
  prominent_numbers?: number[];
  destiny_number?: number;
  birth_number?: number;
  enable_validation?: boolean;
}

export interface EnginesCompoundResult {
  number: number;
  traits: string[];
  specific_traits?: string[];
  warning: EngineWarning[] | Record<string, unknown> | null;
  remedy: Record<string, unknown> | null;
  mark: string;
  error?: string;
  validation_report?: ValidationReport;
}

export interface EnginesBusinessParams {
  company_name: string;
  birth_number: number;
  destiny_number?: number;
  phone_number?: string;
  enable_validation?: boolean;
}

export interface EnginesBusinessResult {
  business_name_analysis: {
    company_name: string;
    name_total: number;
    root_number: number;
    is_harmonious: boolean;
    warnings: EngineWarning[];
    mark: string;
  };
  mobile_analysis?: {
    phone_number: string;
    total: number;
    root_total: number;
    malefic_combos: string[];
    warnings: EngineWarning[];
    mark: string;
  };
  validation_report?: ValidationReport;
}

export interface EnginesKuaResult {
  kua_number: number;
  original_kua?: number;
  group: string;
  directions?: Record<string, string>;
  avoid?: Record<string, string>;
  donation?: string;
  usage_rule?: string;
  warnings: EngineWarning[] | null;
  mark: string;
  validation_report?: ValidationReport;
}

export interface EnginesHealthKabalaResult {
  name: string;
  kabala_total: number;
  kabala_number: number;
  health_trait?: string;
  share_market_sectors?: string[];
  warnings: EngineWarning[] | null;
  mark: string;
  validation_report?: ValidationReport;
}
