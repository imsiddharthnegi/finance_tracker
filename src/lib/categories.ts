import { Category } from '@/types'

export const PREDEFINED_CATEGORIES: Category[] = [
  // Expense Categories
  { name: 'Food & Dining', color: '#FF6B6B', icon: '🍽️', type: 'expense' },
  { name: 'Transportation', color: '#4ECDC4', icon: '🚗', type: 'expense' },
  { name: 'Shopping', color: '#45B7D1', icon: '🛍️', type: 'expense' },
  { name: 'Entertainment', color: '#96CEB4', icon: '🎬', type: 'expense' },
  { name: 'Bills & Utilities', color: '#FFEAA7', icon: '⚡', type: 'expense' },
  { name: 'Healthcare', color: '#DDA0DD', icon: '🏥', type: 'expense' },
  { name: 'Education', color: '#98D8C8', icon: '📚', type: 'expense' },
  { name: 'Travel', color: '#F7DC6F', icon: '✈️', type: 'expense' },
  { name: 'Home & Garden', color: '#BB8FCE', icon: '🏠', type: 'expense' },
  { name: 'Personal Care', color: '#85C1E9', icon: '💄', type: 'expense' },
  { name: 'Insurance', color: '#F8C471', icon: '🛡️', type: 'expense' },
  { name: 'Taxes', color: '#EC7063', icon: '📋', type: 'expense' },
  { name: 'Gifts & Donations', color: '#A9DFBF', icon: '🎁', type: 'expense' },
  { name: 'Other Expenses', color: '#D5DBDB', icon: '📦', type: 'expense' },
  
  // Income Categories
  { name: 'Salary', color: '#58D68D', icon: '💼', type: 'income' },
  { name: 'Freelance', color: '#5DADE2', icon: '💻', type: 'income' },
  { name: 'Business', color: '#F4D03F', icon: '🏢', type: 'income' },
  { name: 'Investments', color: '#AF7AC5', icon: '📈', type: 'income' },
  { name: 'Rental Income', color: '#76D7C4', icon: '🏘️', type: 'income' },
  { name: 'Other Income', color: '#85C1E9', icon: '💰', type: 'income' },
]

export const getCategoryByName = (name: string): Category | undefined => {
  return PREDEFINED_CATEGORIES.find(cat => cat.name === name)
}

export const getExpenseCategories = (): Category[] => {
  return PREDEFINED_CATEGORIES.filter(cat => cat.type === 'expense')
}

export const getIncomeCategories = (): Category[] => {
  return PREDEFINED_CATEGORIES.filter(cat => cat.type === 'income')
}

