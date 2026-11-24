export type PeriodKey =
  | "today" | "yesterday" | "last_7_days" | "last_30_days" | "this_week" | "last_week"
  | "this_month" | "last_month" | "this_year" | "all_time" | "custom";

// the standard filter, used by almost every endpoint
export type PeriodFilter =
  | { period?: Exclude<PeriodKey, "custom"> }
  | { period: "custom"; start_date: string; end_date: string }; // YYYY-MM-DD, inclusive

// transactions-list also accepts last_30_days (its default)
export type TransactionsPeriodFilter = PeriodFilter | { period: "last_30_days" };

export interface PeriodInfo {
  key: PeriodKey | "last_30_days";
  start_date: string;
  end_date: string;
  compared_to: { start_date: string; end_date: string } | null; // null for all_time
}

export type ChangePercent = number | null; // null = show a dash, no arrow

export type ProductCode = "PMS" | "AGO" | "DPK" | "LPG";

export interface Pagination {
  page: number;
  page_size: number;
  total: number;
  total_pages: number;
  showing_from: number;
  showing_to: number;
}

// ---- dashboard ----
export interface DashboardSummary {
  period: PeriodInfo;
  total_stations: { total: number; online: number; offline: number; maintenance: number };
  total_staff: number;
  total_sales: { amount: number; change_percent: ChangePercent };
  transactions: { count: number; change_percent: ChangePercent };
  litres_sold: { litres: number; lpg_kg: number; change_percent: ChangePercent };
  orders: { lifetime: number; pending: number; in_period: number };
  low_stock_alerts: number;
  total_pumps: number;
  total_managers: { active: number; off_duty: number; total: number };
}

export interface ProductPoint { sales: number; quantity: number; transactions: number }

export interface ProductsChart {
  period: PeriodInfo;
  total_sales: number;
  group_by: GroupBy;
  points: {
    start: string; // carries the Lagos +01:00 offset
    label: string; // ready for the x axis
    products: Record<ProductCode, ProductPoint>;
  }[];
  products: {
    code: ProductCode;
    name: string;
    sales: number;
    share_percent: number;
    quantity: number;
    unit: "L" | "kg";
    transactions: number;
  }[];
}

export type GroupBy = "hour" | "day" | "week" | "month";

export interface RevenueChart {
  period: PeriodInfo;
  group_by: GroupBy;
  points: { start: string; label: string; revenue: number; cashback: number }[];
  totals: { revenue: number; cashback: number };
}

export interface TopStations {
  period: PeriodInfo;
  stations: {
    rank: number;
    id: string;
    name: string;
    station_code: string;
    location: string;
    sales: number;
    transactions: number;
  }[];
}

export type RecentStatus = "confirmed" | "awaiting_payment" | "expired" | "cancelled";

export interface RecentTransactions {
  transactions: {
    id: string;
    transaction_id: string;
    status: RecentStatus;
    amount: number;
    quantity: number;
    unit: "L" | "kg";
    product_code: ProductCode;
    product_name: string;
    pump: string | null;
    station: { id: string; name: string; city: string };
    customer_name: string | null;
    time: string; // UTC
  }[];
}

export type StationState = "online" | "offline" | "maintenance";

export interface StationsStatus {
  counts: { total: number; online: number; offline: number; maintenance: number };
  stations: {
    id: string;
    name: string;
    station_code: string;
    location: string;
    status: StationState;
    attendants_on_duty: number;
  }[];
}

// ---- revenue analytics ----
export interface RevenueSummary {
  period: PeriodInfo
  total_revenue: { amount: number; change_percent: number | null }
  total_cashback: { amount: number; change_percent: number | null }
  settlement: {
    amount: number
    change_percent: number | null
    income: { service_charge: number; withdrawal_fee: number }
    costs: { cashback: number; deposit_fees: number }
  }
}

export interface CashbackBreakdown {
  period: PeriodInfo
  products: { code: ProductCode; name: string; amount: number; change_percent: number | null }[]
  total: { amount: number; change_percent: number | null }
}

// ---- sales overview ----
export interface SalesOverview {
  period: PeriodInfo;
  total_sales: { amount: number; change_percent: ChangePercent };
  litres_sold: { litres: number; lpg_kg: number; change_percent: ChangePercent };
  transactions: { count: number; change_percent: ChangePercent };
  sales_growth: { change_percent: ChangePercent };
}

export interface PeakHours {
  period: PeriodInfo;
  total_sales: number;
  slots: {
    label: string;
    range: string;
    start_hour: number;
    end_hour: number;
    sales: number;
    transactions: number;
    share_percent: number;
    is_peak: boolean;
  }[];
  peak: { label: string; range: string; sales: number } | null; // null when total_sales is 0
  hours: { hour: number; label: string; sales: number; transactions: number }[];
}

// ---- transactions ----
export interface TransactionsOverview {
  period: PeriodInfo;
  products: { litres: number; lpg_kg: number; change_percent: ChangePercent };
  total_income: { amount: number; change_percent: ChangePercent; fuel: number; services: number };
  total_cashback: { amount: number; change_percent: ChangePercent };
  number_of_sales: { count: number; change_percent: ChangePercent; fuel: number; services: number };
}

export type TransactionStatus = "completed" | "pending" | "failed" | "expired" | "cancelled";
export type TransactionCategory =
  | "fuel" | "airtime" | "data" | "electricity" | "cable_tv" | "betting" | "education";

export interface TransactionRow {
  id: string;
  kind: "fuel" | "bill";
  transaction_id: string;
  status: TransactionStatus;
  status_label: string;
  amount: number;
  quantity: number | null;
  unit: "L" | "kg" | null;
  unit_price: number | null;
  product_code: ProductCode | null;
  product_name: string;
  category: TransactionCategory;
  pump: string | null;
  provider: string | null;
  biller_code: string | null;
  customer_identifier: string | null;
  station: { id: string; name: string; station_code: string; city: string; location: string } | null;
  customer_name: string | null;
  time: string; // UTC
}

export interface TransactionsList {
  period: PeriodInfo;
  pagination: Pagination;
  transactions: TransactionRow[];
}

interface DetailBase {
  id: string;
  transaction_id: string;
  status: TransactionStatus;
  status_label: string;
  amount: number;
  cashback: number;
  customer_name: string | null;
  time: string;
  created_at: string;
}

export interface FuelTransactionDetail extends DetailBase {
  kind: "fuel";
  category: "fuel";
  purchase_reference: string;
  quantity: number;
  unit: "L" | "kg";
  unit_price: number;
  product_code: ProductCode;
  product_name: string;
  pump: string | null;
  confirmed_at: string | null; // null when never paid
  station: { id: string; name: string; station_code: string; address: string; city: string; state: string; location: string };
  managers: { name: string }[];
}

export interface BillTransactionDetail extends DetailBase {
  kind: "bill";
  category: Exclude<TransactionCategory, "fuel">;
  purchase_reference: string | null;
  product_name: string;
  provider: string;
  biller_code: string;
  customer_identifier: string;
  customer_identifier_name: string | null;
  meter_type: "prepaid" | "postpaid" | null;
  failure_reason: string | null;
  updated_at: string;
  station: null;
  managers: [];
}

export type TransactionDetail = FuelTransactionDetail | BillTransactionDetail;

export interface StationsTransactions {
  period: PeriodInfo;
  pagination: Pagination;
  stations: {
    id: string;
    station_code: string;
    name: string;
    address: string;
    location: string;
    status: string;
    sales: number;
    transactions: number;
    litres: number;
  }[];
}


// ---- station transactions pop-up ----
export interface StationTransactionProduct {
  product_code: ProductCode;
  product_name: string;
  title: string; // "Petrol (PMS)"
  unit: "L" | "kg";
  sold: number;
  capacity: number;
  percent_of_capacity: number | null;
  stock_remaining: number | null; // null = starting stock not set
  sales: number;
  transactions: number;
}

export interface StationTransactionPump {
  id: string;
  name: string;
  product_code: ProductCode;
  unit: "L" | "kg";
  is_active: boolean;
  sales_count: number;
  sold: number;
  sales: number;
  meter_before: number | null;
  meter_latest: number | null;
  meter_latest_at: string | null;
  dispensed: number | null;
  percent_through_app: number | null;
}

export interface StationTransactionDetail {
  period: PeriodInfo;
  station: { id: string; station_code: string; name: string; address: string; location: string; status: string };
  manager: { full_name: string; avatar_url: string | null } | null;
  products: StationTransactionProduct[];
  pumps: StationTransactionPump[];
}

// ---- sales performance chart ----
export type SalesRange = "day" | "week" | "month" | "year";

export interface SalesPerformance {
  range: SalesRange;
  period: PeriodInfo;
  group_by: GroupBy;
  points: { start: string; label: string; value: number; volume: number; transactions: number }[];
  totals: { value: number; volume: number; transactions: number };
}

export type StationStatus = 'healthy' | 'refill_required' | 'not_accessible' | 'setup_pending'

// export interface InventoryStationCard {
//   id: string; name: string; station_code: string; city: string; state: string
//   created_at: string; status: StationStatus; status_label: string
//   sales: number; transactions: number
//   change_percent: number | null; change_direction: 'up' | 'down' | 'flat' | null
// }



