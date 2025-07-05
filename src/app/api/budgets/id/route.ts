import { NextRequest, NextResponse } from 'next/server'
import { Budget } from '@/types'
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

  static async updateBudget(id: string, updates: Partial<Budget>): Promise<Budget | null> {
    try {
      const budgets = await this.getBudgets()
      const index = budgets.findIndex(b => b._id === id)
      
      if (index === -1) {
        return null
      }
      
      budgets[index] = { ...budgets[index], ...updates }
      
      if (!fs.existsSync(DATA_DIR)) {
        fs.mkdirSync(DATA_DIR, { recursive: true })
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

export async function PUT(request: NextRequest) {
  try {
    const body = await request.json()
    const url = new URL(request.url)
    const id = url.pathname.split('/').pop()

    if (!id) {
      return NextResponse.json(
        { success: false, error: 'Invalid budget ID' },
        { status: 400 }
      )
    }

    const updateData = {
      category: body.category,
      amount: parseFloat(body.amount),
      month: body.month,
    }

    // Validate required fields
    if (!updateData.category || !updateData.amount || !updateData.month) {
      return NextResponse.json(
        { success: false, error: 'Missing required fields: category, amount, month' },
        { status: 400 }
      )
    }

    // Validate amount is positive
    if (updateData.amount <= 0) {
      return NextResponse.json(
        { success: false, error: 'Budget amount must be greater than 0' },
        { status: 400 }
      )
    }

    // Validate month format (YYYY-MM)
    const monthRegex = /^\d{4}-\d{2}$/
    if (!monthRegex.test(updateData.month)) {
      return NextResponse.json(
        { success: false, error: 'Invalid month format. Use YYYY-MM' },
        { status: 400 }
      )
    }

    const updatedBudget = await BudgetStorage.updateBudget(id, updateData)

    if (!updatedBudget) {
      return NextResponse.json(
        { success: false, error: 'Budget not found' },
        { status: 404 }
      )
    }

    return NextResponse.json({
      success: true,
      data: updatedBudget
    })
  } catch (error) {
    console.error('Error updating budget:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to update budget' },
      { status: 500 }
    )
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const url = new URL(request.url)
    const id = url.pathname.split('/').pop()

    if (!id) {
      return NextResponse.json(
        { success: false, error: 'Invalid budget ID' },
        { status: 400 }
      )
    }

    const deleted = await BudgetStorage.deleteBudget(id)

    if (!deleted) {
      return NextResponse.json(
        { success: false, error: 'Budget not found' },
        { status: 404 }
      )
    }

    return NextResponse.json({
      success: true,
      message: 'Budget deleted successfully'
    })
  } catch (error) {
    console.error('Error deleting budget:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to delete budget' },
      { status: 500 }
    )
  }
}

