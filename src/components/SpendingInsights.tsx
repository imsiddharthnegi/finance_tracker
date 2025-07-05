'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Transaction } from '@/types'
import { getCategoryByName } from '@/lib/categories'
import { toast } from 'sonner'
import { 
  TrendingUp, 
  TrendingDown, 
  AlertTriangle, 
  Target,
  Calendar,
  DollarSign,
  BarChart3
} from 'lucide-react'

interface SpendingInsightsProps {
  refreshTrigger?: number
}

interface Insight {
  type: 'warning' | 'info' | 'success' | 'tip'
  title: string
  description: string
  icon: React.ReactNode
  value?: string
}

export default function SpendingInsights({ refreshTrigger }: SpendingInsightsProps) {
  const [insights, setInsights] = useState<Insight[]>([])
  const [loading, setLoading] = useState(true)

  const generateInsights = async () => {
    try {
      setLoading(true)
      const response = await fetch('/api/transactions')
      const result = await response.json()

      if (result.success) {
        const transactions: Transaction[] = result.data
        const generatedInsights = analyzeSpendingPatterns(transactions)
        setInsights(generatedInsights)
      } else {
        toast.error('Failed to fetch transaction data')
      }
    } catch (error) {
      console.error('Error generating insights:', error)
      toast.error('Failed to generate insights')
    } finally {
      setLoading(false)
    }
  }

  const analyzeSpendingPatterns = (transactions: Transaction[]): Insight[] => {
    const insights: Insight[] = []
    const currentDate = new Date()
    const currentMonth = currentDate.toISOString().slice(0, 7)
    const lastMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1)
      .toISOString().slice(0, 7)

    // Filter transactions
    const currentMonthTransactions = transactions.filter(t => 
      t.date.slice(0, 7) === currentMonth && t.type === 'expense'
    )
    const lastMonthTransactions = transactions.filter(t => 
      t.date.slice(0, 7) === lastMonth && t.type === 'expense'
    )

    // Calculate totals
    const currentMonthTotal = currentMonthTransactions.reduce((sum, t) => sum + t.amount, 0)
    const lastMonthTotal = lastMonthTransactions.reduce((sum, t) => sum + t.amount, 0)

    // Month-over-month comparison
    if (lastMonthTotal > 0) {
      const changePercent = ((currentMonthTotal - lastMonthTotal) / lastMonthTotal) * 100
      if (Math.abs(changePercent) > 10) {
        insights.push({
          type: changePercent > 0 ? 'warning' : 'success',
          title: changePercent > 0 ? 'Spending Increased' : 'Spending Decreased',
          description: `Your spending ${changePercent > 0 ? 'increased' : 'decreased'} by ${Math.abs(changePercent).toFixed(1)}% compared to last month`,
          icon: changePercent > 0 ? <TrendingUp className="w-4 h-4" /> : <TrendingDown className="w-4 h-4" />,
          value: `${changePercent > 0 ? '+' : ''}${changePercent.toFixed(1)}%`
        })
      }
    }

    // Category analysis
    const categoryTotals = new Map<string, number>()
    currentMonthTransactions.forEach(t => {
      categoryTotals.set(t.category, (categoryTotals.get(t.category) || 0) + t.amount)
    })

    // Find top spending category
    if (categoryTotals.size > 0) {
      const topCategory = Array.from(categoryTotals.entries())
        .sort((a, b) => b[1] - a[1])[0]
      
      const categoryInfo = getCategoryByName(topCategory[0])
      const percentage = currentMonthTotal > 0 ? (topCategory[1] / currentMonthTotal) * 100 : 0
      
      if (percentage > 40) {
        insights.push({
          type: 'warning',
          title: 'High Category Concentration',
          description: `${topCategory[0]} accounts for ${percentage.toFixed(1)}% of your spending this month`,
          icon: <AlertTriangle className="w-4 h-4" />,
          value: `${percentage.toFixed(1)}%`
        })
      } else {
        insights.push({
          type: 'info',
          title: 'Top Spending Category',
          description: `Your highest spending category this month is ${topCategory[0]}`,
          icon: categoryInfo?.icon ? <span className="text-lg">{categoryInfo.icon}</span> : <BarChart3 className="w-4 h-4" />,
          value: formatCurrency(topCategory[1])
        })
      }
    }

    // Average transaction analysis
    if (currentMonthTransactions.length > 0) {
      const avgTransaction = currentMonthTotal / currentMonthTransactions.length
      
      if (avgTransaction > 100) {
        insights.push({
          type: 'info',
          title: 'High Average Transaction',
          description: `Your average transaction this month is ${formatCurrency(avgTransaction)}`,
          icon: <DollarSign className="w-4 h-4" />,
          value: formatCurrency(avgTransaction)
        })
      }
    }

    // Frequency analysis
    const dailySpending = new Map<string, number>()
    currentMonthTransactions.forEach(t => {
      const day = t.date
      dailySpending.set(day, (dailySpending.get(day) || 0) + 1)
    })

    const daysWithSpending = dailySpending.size
    const daysInMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0).getDate()
    const spendingFrequency = (daysWithSpending / daysInMonth) * 100

    if (spendingFrequency > 70) {
      insights.push({
        type: 'tip',
        title: 'Frequent Spending',
        description: `You made purchases on ${daysWithSpending} out of ${daysInMonth} days this month`,
        icon: <Calendar className="w-4 h-4" />,
        value: `${spendingFrequency.toFixed(0)}%`
      })
    }

    // Weekly pattern analysis
    const weeklySpending = new Map<number, number>()
    currentMonthTransactions.forEach(t => {
      const dayOfWeek = new Date(t.date).getDay()
      weeklySpending.set(dayOfWeek, (weeklySpending.get(dayOfWeek) || 0) + t.amount)
    })

    if (weeklySpending.size > 0) {
      const weekendSpending = (weeklySpending.get(0) || 0) + (weeklySpending.get(6) || 0)
      const weekendPercentage = currentMonthTotal > 0 ? (weekendSpending / currentMonthTotal) * 100 : 0

      if (weekendPercentage > 50) {
        insights.push({
          type: 'info',
          title: 'Weekend Spender',
          description: `${weekendPercentage.toFixed(1)}% of your spending happens on weekends`,
          icon: <Calendar className="w-4 h-4" />,
          value: `${weekendPercentage.toFixed(1)}%`
        })
      }
    }

    // Add general tips if no specific insights
    if (insights.length === 0) {
      insights.push({
        type: 'tip',
        title: 'Track Your Progress',
        description: 'Keep adding transactions to get personalized spending insights',
        icon: <Target className="w-4 h-4" />
      })
    }

    // Limit to 4 insights
    return insights.slice(0, 4)
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount)
  }

  const getInsightColor = (type: string) => {
    switch (type) {
      case 'warning':
        return 'bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800'
      case 'success':
        return 'bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800'
      case 'info':
        return 'bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800'
      case 'tip':
        return 'bg-purple-50 dark:bg-purple-900/20 border-purple-200 dark:border-purple-800'
      default:
        return 'bg-muted border-border'
    }
  }

  const getInsightTextColor = (type: string) => {
    switch (type) {
      case 'warning':
        return 'text-red-700 dark:text-red-300'
      case 'success':
        return 'text-green-700 dark:text-green-300'
      case 'info':
        return 'text-blue-700 dark:text-blue-300'
      case 'tip':
        return 'text-purple-700 dark:text-purple-300'
      default:
        return 'text-foreground'
    }
  }

  useEffect(() => {
    generateInsights()
  }, [refreshTrigger])

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <BarChart3 className="w-5 h-5" />
          Spending Insights
        </CardTitle>
      </CardHeader>
      <CardContent>
        {loading ? (
          <div className="flex items-center justify-center h-32">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          </div>
        ) : (
          <div className="grid gap-4 md:grid-cols-2">
            {insights.map((insight, index) => (
              <div
                key={index}
                className={`p-4 rounded-lg border ${getInsightColor(insight.type)}`}
              >
                <div className="flex items-start justify-between mb-2">
                  <div className={`flex items-center gap-2 ${getInsightTextColor(insight.type)}`}>
                    {insight.icon}
                    <h4 className="font-medium">{insight.title}</h4>
                  </div>
                  {insight.value && (
                    <Badge variant="outline" className={getInsightTextColor(insight.type)}>
                      {insight.value}
                    </Badge>
                  )}
                </div>
                <p className="text-sm text-muted-foreground">{insight.description}</p>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  )
}

