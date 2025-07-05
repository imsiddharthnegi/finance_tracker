'use client'

import { useState, useEffect } from 'react'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'
import { Transaction, MonthlyData } from '@/types'
import { toast } from 'sonner'

interface MonthlyExpensesChartProps {
  refreshTrigger?: number
}

export default function MonthlyExpensesChart({ refreshTrigger }: MonthlyExpensesChartProps) {
  const [data, setData] = useState<MonthlyData[]>([])
  const [loading, setLoading] = useState(true)

  const fetchAndProcessData = async () => {
    try {
      setLoading(true)
      const response = await fetch('/api/transactions')
      const result = await response.json()

      if (result.success) {
        const transactions: Transaction[] = result.data
        const monthlyData = processMonthlyData(transactions)
        setData(monthlyData)
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

  const processMonthlyData = (transactions: Transaction[]): MonthlyData[] => {
    const monthlyMap = new Map<string, { income: number; expenses: number }>()

    // Get last 12 months
    const months = []
    for (let i = 11; i >= 0; i--) {
      const date = new Date()
      date.setMonth(date.getMonth() - i)
      const monthKey = date.toISOString().slice(0, 7) // YYYY-MM format
      months.push(monthKey)
      monthlyMap.set(monthKey, { income: 0, expenses: 0 })
    }

    // Process transactions
    transactions.forEach((transaction) => {
      const monthKey = transaction.date.slice(0, 7) // YYYY-MM format
      const monthData = monthlyMap.get(monthKey)
      
      if (monthData) {
        if (transaction.type === 'income') {
          monthData.income += transaction.amount
        } else {
          monthData.expenses += transaction.amount
        }
      }
    })

    // Convert to array format for chart
    return months.map((month) => {
      const data = monthlyMap.get(month)!
      const date = new Date(month + '-01')
      const monthName = date.toLocaleDateString('en-US', { month: 'short', year: 'numeric' })
      
      return {
        month: monthName,
        income: data.income,
        expenses: data.expenses,
        balance: data.income - data.expenses
      }
    })
  }

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value)
  }

  const CustomTooltip = ({ active, payload, label }: {
    active?: boolean
    payload?: Array<{
      value: number
      name: string
      color: string
    }>
    label?: string
  }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-background border border-border rounded-lg p-3 shadow-lg">
          <p className="font-medium">{label}</p>
          {payload.map((entry, index: number) => (
            <p key={index} style={{ color: entry.color }} className="text-sm">
              {entry.name}: {formatCurrency(entry.value)}
            </p>
          ))}
        </div>
      )
    }
    return null
  }

  useEffect(() => {
    fetchAndProcessData()
  }, [refreshTrigger])

  if (loading) {
    return (
      <div className="flex items-center justify-center h-[300px]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    )
  }

  const hasData = data.some(item => item.expenses > 0 || item.income > 0)

  if (!hasData) {
    return (
      <div className="flex items-center justify-center h-[300px]">
        <div className="text-center">
          <p className="text-muted-foreground">No data available</p>
          <p className="text-sm text-muted-foreground mt-2">
            Add some transactions to see your monthly overview
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className="h-[300px] w-full">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
          <XAxis 
            dataKey="month" 
            className="text-xs"
            tick={{ fontSize: 12 }}
          />
          <YAxis 
            className="text-xs"
            tick={{ fontSize: 12 }}
            tickFormatter={formatCurrency}
          />
          <Tooltip content={<CustomTooltip />} />
          <Bar 
            dataKey="income" 
            fill="hsl(var(--chart-1))" 
            name="Income"
            radius={[2, 2, 0, 0]}
          />
          <Bar 
            dataKey="expenses" 
            fill="hsl(var(--chart-2))" 
            name="Expenses"
            radius={[2, 2, 0, 0]}
          />
        </BarChart>
      </ResponsiveContainer>
    </div>
  )
}

