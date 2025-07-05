import { NextRequest, NextResponse } from 'next/server'
import { FileStorage } from '@/lib/storage'

export async function PUT(request: NextRequest) {
  try {
    const body = await request.json()
    const url = new URL(request.url)
    const id = url.pathname.split('/').pop()

    if (!id) {
      return NextResponse.json(
        { success: false, error: 'Invalid transaction ID' },
        { status: 400 }
      )
    }

    const updateData = {
      amount: parseFloat(body.amount),
      category: body.category,
      description: body.description,
      type: body.type || 'expense',
    }

    // Validate required fields
    if (!updateData.amount || !updateData.category || !updateData.description) {
      return NextResponse.json(
        { success: false, error: 'Missing required fields: amount, category, description' },
        { status: 400 }
      )
    }

    // Validate amount is positive
    if (updateData.amount <= 0) {
      return NextResponse.json(
        { success: false, error: 'Amount must be greater than 0' },
        { status: 400 }
      )
    }

    const updatedTransaction = await FileStorage.updateTransaction(id, updateData)

    if (!updatedTransaction) {
      return NextResponse.json(
        { success: false, error: 'Transaction not found' },
        { status: 404 }
      )
    }

    return NextResponse.json({
      success: true,
      data: updatedTransaction
    })
  } catch (error) {
    console.error('Error updating transaction:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to update transaction' },
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
        { success: false, error: 'Invalid transaction ID' },
        { status: 400 }
      )
    }

    const deleted = await FileStorage.deleteTransaction(id)

    if (!deleted) {
      return NextResponse.json(
        { success: false, error: 'Transaction not found' },
        { status: 404 }
      )
    }

    return NextResponse.json({
      success: true,
      message: 'Transaction deleted successfully'
    })
  } catch (error) {
    console.error('Error deleting transaction:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to delete transaction' },
      { status: 500 }
    )
  }
}

