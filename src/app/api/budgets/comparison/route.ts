import { NextRequest, NextResponse } from 'next/server'
import { Budget, BudgetComparison } from '@/types'
import { FileStorage } from '@/lib/storage'
import fs from 'fs'
import path from 'path'

const DATA_DIR = path.join(process.cwd(), 'data')
const BUDGETS_FILE = path.join(DATA_DIR, 'budgets.json')

class BudgetStorage {
  static async getBudgets(): Promise<Budget[]> {
    try {
      const data = fs.readFileSync(BUDGETS_FILE, 'utf8')
      return JSON.parse(data)
    } catch (error) {
      console.error('Error reading budgets:', error)
      return []
    }
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const month = searchParams.get('month')
    
    if (!month) {
      return NextResponse.json(
        { success: false, error: 'Month parameter is required (format: YYYY-MM)' },
        { status: 400 }
      )
    }

    // Validate month format
    const monthRegex = /^\d{4}-\d{2}$/
    if (!monthRegex.test(month)) {
      return NextResponse.json(
        { success: false, error: 'Invalid month format. Use YYYY-MM' },
        { status: 400 }
      )
    }

    // Get budgets for the specified month
    const budgets = await BudgetStorage.getBudgets()
    const monthBudgets = budgets.filter(budget => budget.month === month)

    // Get transactions for the specified month
    const transactions = await FileStorage.getTransactions()
    const monthTransactions = transactions.filter(transaction => {
      const transactionMonth = transaction.date.slice(0, 7) // YYYY-MM format
      return transactionMonth === month && transaction.type === 'expense'
    })

    // Calculate actual spending by category
    const actualSpending = new Map<string, number>()
    monthTransactions.forEach(transaction => {
      const current = actualSpending.get(transaction.category) || 0
      actualSpending.set(transaction.category, current + transaction.amount)
    })

    // Create budget comparison data
    const comparisons: BudgetComparison[] = monthBudgets.map(budget => {
      const actual = actualSpending.get(budget.category) || 0
      const percentage = budget.amount > 0 ? (actual / budget.amount) * 100 : 0
      
      let status: 'under' | 'over' | 'on-track'
      if (percentage <= 80) {
        status = 'under'
      } else if (percentage > 100) {
        status = 'over'
      } else {
        status = 'on-track'
      }

      return {
        category: budget.category,
        budgeted: budget.amount,
        actual,
        percentage,
        status
      }
    })

    // Add categories with spending but no budget
    actualSpending.forEach((amount, category) => {
      const hasBudget = monthBudgets.some(budget => budget.category === category)
      if (!hasBudget) {
        comparisons.push({
          category,
          budgeted: 0,
          actual: amount,
          percentage: 0,
          status: 'over'
        })
      }
    })

    // Sort by budgeted amount descending, then by actual amount
    comparisons.sort((a, b) => {
      if (a.budgeted !== b.budgeted) {
        return b.budgeted - a.budgeted
      }
      return b.actual - a.actual
    })

    // Calculate summary statistics
    const totalBudgeted = comparisons.reduce((sum, comp) => sum + comp.budgeted, 0)
    const totalActual = comparisons.reduce((sum, comp) => sum + comp.actual, 0)
    const overallPercentage = totalBudgeted > 0 ? (totalActual / totalBudgeted) * 100 : 0
    
    let overallStatus: 'under' | 'over' | 'on-track'
    if (overallPercentage <= 80) {
      overallStatus = 'under'
    } else if (overallPercentage > 100) {
      overallStatus = 'over'
    } else {
      overallStatus = 'on-track'
    }

    return NextResponse.json({
      success: true,
      data: {
        month,
        comparisons,
        summary: {
          totalBudgeted,
          totalActual,
          percentage: overallPercentage,
          status: overallStatus,
          categoriesWithBudget: monthBudgets.length,
          categoriesOverBudget: comparisons.filter(c => c.status === 'over').length
        }
      }
    })
  } catch (error) {
    console.error('Error generating budget comparison:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to generate budget comparison' },
      { status: 500 }
    )
  }
}

