import { Transaction } from '@/types'
import fs from 'fs'
import path from 'path'

const DATA_DIR = path.join(process.cwd(), 'data')
const TRANSACTIONS_FILE = path.join(DATA_DIR, 'transactions.json')

// Ensure data directory exists
if (!fs.existsSync(DATA_DIR)) {
  fs.mkdirSync(DATA_DIR, { recursive: true })
}

// Initialize transactions file if it doesn't exist
if (!fs.existsSync(TRANSACTIONS_FILE)) {
  fs.writeFileSync(TRANSACTIONS_FILE, JSON.stringify([]))
}

export class FileStorage {
  private static generateId(): string {
    return Date.now().toString(36) + Math.random().toString(36).substr(2)
  }

  static async getTransactions(): Promise<Transaction[]> {
    try {
      const data = fs.readFileSync(TRANSACTIONS_FILE, 'utf8')
      return JSON.parse(data)
    } catch (error) {
      console.error('Error reading transactions:', error)
      return []
    }
  }

  static async createTransaction(transaction: Omit<Transaction, '_id'>): Promise<Transaction> {
    try {
      const transactions = await this.getTransactions()
      const newTransaction: Transaction = {
        ...transaction,
        _id: this.generateId(),
        createdAt: new Date(),
        updatedAt: new Date()
      }
      
      transactions.push(newTransaction)
      fs.writeFileSync(TRANSACTIONS_FILE, JSON.stringify(transactions, null, 2))
      
      return newTransaction
    } catch (error) {
      console.error('Error creating transaction:', error)
      throw new Error('Failed to create transaction')
    }
  }

  static async updateTransaction(id: string, updates: Partial<Transaction>): Promise<Transaction | null> {
    try {
      const transactions = await this.getTransactions()
      const index = transactions.findIndex(t => t._id === id)
      
      if (index === -1) {
        return null
      }
      
      transactions[index] = {
        ...transactions[index],
        ...updates,
        updatedAt: new Date()
      }
      
      fs.writeFileSync(TRANSACTIONS_FILE, JSON.stringify(transactions, null, 2))
      
      return transactions[index]
    } catch (error) {
      console.error('Error updating transaction:', error)
      throw new Error('Failed to update transaction')
    }
  }

  static async deleteTransaction(id: string): Promise<boolean> {
    try {
      const transactions = await this.getTransactions()
      const index = transactions.findIndex(t => t._id === id)
      
      if (index === -1) {
        return false
      }
      
      transactions.splice(index, 1)
      fs.writeFileSync(TRANSACTIONS_FILE, JSON.stringify(transactions, null, 2))
      
      return true
    } catch (error) {
      console.error('Error deleting transaction:', error)
      throw new Error('Failed to delete transaction')
    }
  }
}

