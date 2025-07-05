'use client'

import { useState, useEffect } from 'react'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts'
import { BudgetComparison } from '@/types'
import { getCategoryByName } from '@/lib/categories'
import { toast } from 'sonner'

interface SummaryData {
  totalBudgeted: number
  totalSpent: number
  totalActual: number
  overallStatus: number
  overBudgetCount: number
  totalBudgets: number
  status: 'over' | 'under' | 'on-track'
  percentage: number
  categoriesOverBudget: number
  categoriesWithBudget: number
}

interface ChartData {
  category: string
  budgeted: number
  actual: number
}

interface BudgetComparisonChartProps {
  month: string
  refreshTrigger?: number
}

export default function BudgetComparisonChart({ month, refreshTrigger }: BudgetComparisonChartProps) {
  const [data, setData] = useState<ChartData[]>([])
  const [loading, setLoading] = useState(true)
  const [summary, setSummary] = useState<SummaryData | null>(null)

  const fetchComparisonData = async () => {
    try {
      setLoading(true)
      const response = await fetch(`/api/budgets/comparison?month=${month}`)
      const result = await response.json()

      if (result.success) {
        const chartData: ChartData[] = result.data.comparisons.map((comp: BudgetComparison) => ({
          category: comp.category,
          budgeted: comp.budgeted,
          actual: comp.actual,
          status: comp.status,
          shortName: comp.category.length > 12 ? comp.category.substring(0, 12) + '...' : comp.category
        }))
        
        setData(chartData)
        setSummary(result.data.summary)
      } else {
        toast.error('Failed to fetch budget comparison data')
      }
    } catch (error) {
      console.error('Error fetching comparison data:', error)
      toast.error('Failed to fetch budget comparison data')
    } finally {
      setLoading(false)
    }
  }

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value)
  }

  const CustomTooltip = ({ active, payload }: {
    active?: boolean
    payload?: Array<{
      value: number
      dataKey: string
      color: string
      payload: {
        category: string
        budgeted: number
        actual: number
      }
    }>
  }) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload
      const categoryInfo = getCategoryByName(data.category)
      
      // Calculate status
      const status = data.actual > data.budgeted ? 'over' : 
                    data.actual < data.budgeted * 0.8 ? 'under' : 'on-track'
      
      return (
        <div className="bg-background border border-border rounded-lg p-3 shadow-lg">
          <div className="flex items-center gap-2 mb-2">
            <span>{categoryInfo?.icon}</span>
            <p className="font-medium">{data.category}</p>
          </div>
          <div className="space-y-1">
            <p className="text-sm">
              <span className="text-muted-foreground">Budgeted:</span>{' '}
              <span className="font-medium">{formatCurrency(data.budgeted)}</span>
            </p>
            <p className="text-sm">
              <span className="text-muted-foreground">Actual:</span>{' '}
              <span className="font-medium">{formatCurrency(data.actual)}</span>
            </p>
            <p className="text-sm">
              <span className="text-muted-foreground">Status:</span>{' '}
              <span className={
                status === 'over' ? 'text-red-600' : 
                status === 'under' ? 'text-green-600' : 'text-yellow-600'
              }>
                {status === 'over' ? 'Over Budget' : 
                 status === 'under' ? 'Under Budget' : 'On Track'}
              </span>
            </p>
          </div>
        </div>
      )
    }
    return null
  }

  const formatMonthLabel = (monthString: string) => {
    const date = new Date(monthString + '-01')
    return date.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })
  }

  useEffect(() => {
    fetchComparisonData()
  }, [month, refreshTrigger])

  if (loading) {
    return (
      <div className="space-y-4">
        <div className="flex items-center justify-center h-[300px]">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        </div>
      </div>
    )
  }

  const hasData = data.length > 0

  if (!hasData) {
    return (
      <div className="space-y-4">
        <div className="flex items-center justify-center h-[300px]">
          <div className="text-center">
            <p className="text-muted-foreground">No budget data available</p>
            <p className="text-sm text-muted-foreground mt-2">
              Set some budgets for {formatMonthLabel(month)} to see the comparison
            </p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      {/* Summary Cards */}
      {summary && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
          <div className="bg-blue-50 dark:bg-blue-900/20 p-3 rounded-lg">
            <div className="text-sm text-blue-600 dark:text-blue-400">Total Budgeted</div>
            <div className="text-lg font-bold text-blue-700 dark:text-blue-300">
              {formatCurrency(summary.totalBudgeted)}
            </div>
          </div>
          <div className="bg-orange-50 dark:bg-orange-900/20 p-3 rounded-lg">
            <div className="text-sm text-orange-600 dark:text-orange-400">Total Spent</div>
            <div className="text-lg font-bold text-orange-700 dark:text-orange-300">
              {formatCurrency(summary.totalActual)}
            </div>
          </div>
          <div className={`p-3 rounded-lg ${
            summary.status === 'over' ? 'bg-red-50 dark:bg-red-900/20' :
            summary.status === 'under' ? 'bg-green-50 dark:bg-green-900/20' :
            'bg-yellow-50 dark:bg-yellow-900/20'
          }`}>
            <div className={`text-sm ${
              summary.status === 'over' ? 'text-red-600 dark:text-red-400' :
              summary.status === 'under' ? 'text-green-600 dark:text-green-400' :
              'text-yellow-600 dark:text-yellow-400'
            }`}>
              Overall Status
            </div>
            <div className={`text-lg font-bold ${
              summary.status === 'over' ? 'text-red-700 dark:text-red-300' :
              summary.status === 'under' ? 'text-green-700 dark:text-green-300' :
              'text-yellow-700 dark:text-yellow-300'
            }`}>
              {summary.percentage.toFixed(0)}%
            </div>
          </div>
          <div className="bg-purple-50 dark:bg-purple-900/20 p-3 rounded-lg">
            <div className="text-sm text-purple-600 dark:text-purple-400">Over Budget</div>
            <div className="text-lg font-bold text-purple-700 dark:text-purple-300">
              {summary.categoriesOverBudget} / {summary.categoriesWithBudget}
            </div>
          </div>
        </div>
      )}

      {/* Chart */}
      <div className="h-[400px] w-full">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data} margin={{ top: 20, right: 30, left: 20, bottom: 60 }}>
            <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
            <XAxis 
              dataKey="shortName" 
              className="text-xs"
              tick={{ fontSize: 12 }}
              angle={-45}
              textAnchor="end"
              height={80}
            />
            <YAxis 
              className="text-xs"
              tick={{ fontSize: 12 }}
              tickFormatter={formatCurrency}
            />
            <Tooltip content={<CustomTooltip />} />
            <Legend />
            <Bar 
              dataKey="budgeted" 
              fill="hsl(var(--chart-1))" 
              name="Budgeted"
              radius={[2, 2, 0, 0]}
            />
            <Bar 
              dataKey="actual" 
              fill="hsl(var(--chart-2))" 
              name="Actual"
              radius={[2, 2, 0, 0]}
            />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  )
}

