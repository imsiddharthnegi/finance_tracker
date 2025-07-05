'use client'

import { useState, useEffect } from 'react'
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts'
import { Transaction, CategoryData } from '@/types'
import { getCategoryByName } from '@/lib/categories'
import { toast } from 'sonner'

interface CategoryPieChartProps {
  refreshTrigger?: number
  type?: 'income' | 'expense' | 'all'
}

export default function CategoryPieChart({ refreshTrigger, type = 'expense' }: CategoryPieChartProps) {
  const [data, setData] = useState<CategoryData[]>([])
  const [loading, setLoading] = useState(true)

  const fetchAndProcessData = async () => {
    try {
      setLoading(true)
      const response = await fetch('/api/transactions')
      const result = await response.json()

      if (result.success) {
        const transactions: Transaction[] = result.data
        const categoryData = processCategoryData(transactions)
        setData(categoryData)
      } else {
        toast.error('Failed to fetch transaction data')
      }
    } catch (error) {
      console.error('Error fetching data:', error)
      toast.error('Failed to fetch transaction data')
    } finally {
      setLoading(false)
    }
  }

  const processCategoryData = (transactions: Transaction[]): CategoryData[] => {
    // Filter transactions by type if specified
    const filteredTransactions = type === 'all' 
      ? transactions 
      : transactions.filter(t => t.type === type)

    // Group by category and sum amounts
    const categoryMap = new Map<string, number>()
    
    filteredTransactions.forEach((transaction) => {
      const current = categoryMap.get(transaction.category) || 0
      categoryMap.set(transaction.category, current + transaction.amount)
    })

    // Convert to array and calculate percentages
    const totalAmount = Array.from(categoryMap.values()).reduce((sum, amount) => sum + amount, 0)
    
    if (totalAmount === 0) {
      return []
    }

    const categoryData: CategoryData[] = Array.from(categoryMap.entries()).map(([category, amount]) => {
      const categoryInfo = getCategoryByName(category)
      return {
        category,
        amount,
        color: categoryInfo?.color || '#8884d8',
        percentage: (amount / totalAmount) * 100
      }
    })

    // Sort by amount descending
    return categoryData.sort((a, b) => b.amount - a.amount)
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
      payload: {
        category: string
        amount: number
        color: string
        percentage: number
      }
    }>
  }) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload
      return (
        <div className="bg-background border border-border rounded-lg p-3 shadow-lg">
          <p className="font-medium">{data.category}</p>
          <p className="text-sm" style={{ color: data.color }}>
            Amount: {formatCurrency(data.amount)}
          </p>
          <p className="text-sm text-muted-foreground">
            {data.percentage.toFixed(1)}% of total
          </p>
        </div>
      )
    }
    return null
  }

  const CustomLegend = ({ payload }: {
    payload?: Array<{
      value: string
      color: string
    }>
  }) => {
    if (!payload || payload.length === 0) return null

    return (
      <div className="flex flex-wrap gap-2 justify-center mt-4">
        {payload.slice(0, 6).map((entry, index: number) => (
          <div key={index} className="flex items-center gap-1 text-xs">
            <div 
              className="w-3 h-3 rounded-full" 
              style={{ backgroundColor: entry.color }}
            />
            <span className="truncate max-w-[80px]">{entry.value}</span>
          </div>
        ))}
        {payload.length > 6 && (
          <div className="text-xs text-muted-foreground">
            +{payload.length - 6} more
          </div>
        )}
      </div>
    )
  }

  useEffect(() => {
    fetchAndProcessData()
  }, [refreshTrigger, type])

  if (loading) {
    return (
      <div className="flex items-center justify-center h-[300px]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    )
  }

  const hasData = data.length > 0

  if (!hasData) {
    return (
      <div className="flex items-center justify-center h-[300px]">
        <div className="text-center">
          <p className="text-muted-foreground">No data available</p>
          <p className="text-sm text-muted-foreground mt-2">
            Add some {type === 'all' ? 'transactions' : type === 'income' ? 'income' : 'expenses'} to see the breakdown
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className="h-[300px] w-full">
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            innerRadius={60}
            outerRadius={100}
            paddingAngle={2}
            dataKey="amount"
          >
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={entry.color} />
            ))}
          </Pie>
          <Tooltip content={<CustomTooltip />} />
          <Legend content={<CustomLegend />} />
        </PieChart>
      </ResponsiveContainer>
    </div>
  )
}

