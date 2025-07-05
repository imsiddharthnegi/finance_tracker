import { NextRequest, NextResponse } from 'next/server'
import { Budget } from '@/types'
import fs from 'fs'
import path from 'path'

const DATA_DIR = path.join(process.cwd(), 'data')
const BUDGETS_FILE = path.join(DATA_DIR, 'budgets.json')

// Ensure data directory and budgets file exist
if (!fs.existsSync(DATA_DIR)) {
  fs.mkdirSync(DATA_DIR, { recursive: true })
}

if (!fs.existsSync(BUDGETS_FILE)) {
  fs.writeFileSync(BUDGETS_FILE, JSON.stringify([]))
}

class BudgetStorage {
  private static generateId(): string {
    return Date.now().toString(36) + Math.random().toString(36).substr(2)
  }

  static async getBudgets(): Promise<Budget[]> {
    try {
      const data = fs.readFileSync(BUDGETS_FILE, 'utf8')
      return JSON.parse(data)
    } catch (error) {
      console.error('Error reading budgets:', error)
      return []
    }
  }

  static async createBudget(budget: Omit<Budget, '_id'>): Promise<Budget> {
    try {
      const budgets = await this.getBudgets()
      
      // Check if budget already exists for this category and month
      const existingIndex = budgets.findIndex(
        b => b.category === budget.category && b.month === budget.month
      )
      
      if (existingIndex !== -1) {
        // Update existing budget
        budgets[existingIndex] = {
          ...budgets[existingIndex],
          amount: budget.amount,
          updatedAt: new Date()
        }
        fs.writeFileSync(BUDGETS_FILE, JSON.stringify(budgets, null, 2))
        return budgets[existingIndex]
      } else {
        // Create new budget
        const newBudget: Budget = {
          ...budget,
          _id: this.generateId(),
          createdAt: new Date(),
          updatedAt: new Date()
        }
        
        budgets.push(newBudget)
        fs.writeFileSync(BUDGETS_FILE, JSON.stringify(budgets, null, 2))
        
        return newBudget
      }
    } catch (error) {
      console.error('Error creating budget:', error)
      throw new Error('Failed to create budget')
    }
  }

  static async updateBudget(id: string, updates: Partial<Budget>): Promise<Budget | null> {
    try {
      const budgets = await this.getBudgets()
      const index = budgets.findIndex(b => b._id === id)
      
      if (index === -1) {
        return null
      }
      
      budgets[index] = {
        ...budgets[index],
        ...updates,
        updatedAt: new Date()
      }
      
      fs.writeFileSync(BUDGETS_FILE, JSON.stringify(budgets, null, 2))
      
      return budgets[index]
    } catch (error) {
      console.error('Error updating budget:', error)
      throw new Error('Failed to update budget')
    }
  }

  static async deleteBudget(id: string): Promise<boolean> {
    try {
      const budgets = await this.getBudgets()
      const index = budgets.findIndex(b => b._id === id)
      
      if (index === -1) {
        return false
      }
      
      budgets.splice(index, 1)
      fs.writeFileSync(BUDGETS_FILE, JSON.stringify(budgets, null, 2))
      
      return true
    } catch (error) {
      console.error('Error deleting budget:', error)
      throw new Error('Failed to delete budget')
    }
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const month = searchParams.get('month')
    
    const budgets = await BudgetStorage.getBudgets()
    
    // Filter by month if specified
    const filteredBudgets = month 
      ? budgets.filter(budget => budget.month === month)
      : budgets

    return NextResponse.json({
      success: true,
      data: filteredBudgets
    })
  } catch (error) {
    console.error('Error fetching budgets:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to fetch budgets' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const budget: Omit<Budget, '_id'> = {
      category: body.category,
      amount: parseFloat(body.amount),
      month: body.month
    }

    // Validate required fields
    if (!budget.category || !budget.amount || !budget.month) {
      return NextResponse.json(
        { success: false, error: 'Missing required fields' },
        { status: 400 }
      )
    }

    // Validate amount is positive
    if (budget.amount <= 0) {
      return NextResponse.json(
        { success: false, error: 'Budget amount must be greater than 0' },
        { status: 400 }
      )
    }

    // Validate month format (YYYY-MM)
    const monthRegex = /^\d{4}-\d{2}$/
    if (!monthRegex.test(budget.month)) {
      return NextResponse.json(
        { success: false, error: 'Invalid month format. Use YYYY-MM' },
        { status: 400 }
      )
    }

    const newBudget = await BudgetStorage.createBudget(budget)
    
    return NextResponse.json({
      success: true,
      data: newBudget
    }, { status: 201 })
  } catch (error) {
    console.error('Error creating budget:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to create budget' },
      { status: 500 }
    )
  }
}

