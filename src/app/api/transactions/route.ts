import { NextRequest, NextResponse } from 'next/server'
import { FileStorage } from '@/lib/storage'
import { Transaction } from '@/types'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const limit = parseInt(searchParams.get('limit') || '50')
    const offset = parseInt(searchParams.get('offset') || '0')
    
    const allTransactions = await FileStorage.getTransactions()
    
    // Sort by date descending, then by creation date
    const sortedTransactions = allTransactions.sort((a, b) => {
      const dateA = new Date(a.date).getTime()
      const dateB = new Date(b.date).getTime()
      if (dateA !== dateB) {
        return dateB - dateA // Most recent first
      }
      // If dates are the same, sort by creation time
      const createdA = new Date(a.createdAt || 0).getTime()
      const createdB = new Date(b.createdAt || 0).getTime()
      return createdB - createdA
    })
    
    const paginatedTransactions = sortedTransactions.slice(offset, offset + limit)

    return NextResponse.json({
      success: true,
      data: paginatedTransactions,
      total: allTransactions.length
    })
  } catch (error) {
    console.error('Error fetching transactions:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to fetch transactions' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const transaction: Omit<Transaction, '_id'> = {
      amount: parseFloat(body.amount),
      date: body.date,
      description: body.description,
      category: body.category,
      type: body.type,
      createdAt: new Date(),
      updatedAt: new Date()
    }

    // Validate required fields
    if (!transaction.amount || !transaction.date || !transaction.description || !transaction.category || !transaction.type) {
      return NextResponse.json(
        { success: false, error: 'Missing required fields' },
        { status: 400 }
      )
    }

    // Validate transaction type
    if (!['income', 'expense'].includes(transaction.type)) {
      return NextResponse.json(
        { success: false, error: 'Invalid transaction type' },
        { status: 400 }
      )
    }

    // Validate amount is positive
    if (transaction.amount <= 0) {
      return NextResponse.json(
        { success: false, error: 'Amount must be greater than 0' },
        { status: 400 }
      )
    }

    const newTransaction = await FileStorage.createTransaction(transaction)
    
    return NextResponse.json({
      success: true,
      data: newTransaction
    }, { status: 201 })
  } catch (error) {
    console.error('Error creating transaction:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to create transaction' },
      { status: 500 }
    )
  }
}

