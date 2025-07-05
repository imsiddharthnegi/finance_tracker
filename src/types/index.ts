export interface Transaction {
  _id?: string
  amount: number
  date: string
  description: string
  category: string
  type: 'income' | 'expense'
  createdAt?: Date
  updatedAt?: Date
}

export interface Category {
  _id?: string
  name: string
  color: string
  icon: string
  type: 'income' | 'expense'
}

export interface Budget {
  _id?: string
  category: string
  amount: number
  month: string // Format: YYYY-MM
  spent?: number
  createdAt?: Date
  updatedAt?: Date
}

export interface DashboardStats {
  totalIncome: number
  totalExpenses: number
  balance: number
  transactionCount: number
  topCategories: Array<{
    category: string
    amount: number
    percentage: number
  }>
}

export interface MonthlyData {
  month: string
  income: number
  expenses: number
  balance: number
}

export interface CategoryData {
  category: string
  amount: number
  color: string
  percentage: number
}

export interface BudgetComparison {
  category: string
  budgeted: number
  actual: number
  percentage: number
  status: 'under' | 'over' | 'on-track'
}

