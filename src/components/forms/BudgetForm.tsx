'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Budget } from '@/types'
import { getExpenseCategories } from '@/lib/categories'
import { toast } from 'sonner'
import { DollarSign, Plus } from 'lucide-react'

interface BudgetFormProps {
  onSuccess?: () => void
  trigger?: React.ReactNode
  existingBudget?: Budget
}

export default function BudgetForm({ onSuccess, trigger, existingBudget }: BudgetFormProps) {
  const [open, setOpen] = useState(false)
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    category: existingBudget?.category || '',
    amount: existingBudget?.amount?.toString() || '',
    month: existingBudget?.month || new Date().toISOString().slice(0, 7) // Current month YYYY-MM
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!formData.category || !formData.amount || !formData.month) {
      toast.error('Please fill in all fields')
      return
    }

    const amount = parseFloat(formData.amount)
    if (isNaN(amount) || amount <= 0) {
      toast.error('Please enter a valid amount greater than 0')
      return
    }

    setLoading(true)

    try {
      const url = existingBudget 
        ? `/api/budgets/${existingBudget._id}`
        : '/api/budgets'
      
      const method = existingBudget ? 'PUT' : 'POST'

      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          category: formData.category,
          amount: amount,
          month: formData.month
        }),
      })

      const result = await response.json()

      if (result.success) {
        toast.success(existingBudget ? 'Budget updated successfully' : 'Budget created successfully')
        setOpen(false)
        setFormData({
          category: '',
          amount: '',
          month: new Date().toISOString().slice(0, 7)
        })
        onSuccess?.()
      } else {
        toast.error(result.error || 'Failed to save budget')
      }
    } catch (error) {
      console.error('Error saving budget:', error)
      toast.error('Failed to save budget')
    } finally {
      setLoading(false)
    }
  }

  const formatMonthLabel = (monthString: string) => {
    const date = new Date(monthString + '-01')
    return date.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })
  }

  const generateMonthOptions = () => {
    const options = []
    const currentDate = new Date()
    
    // Generate options for current month and next 11 months
    for (let i = 0; i < 12; i++) {
      const date = new Date(currentDate.getFullYear(), currentDate.getMonth() + i, 1)
      const monthString = date.toISOString().slice(0, 7)
      options.push({
        value: monthString,
        label: formatMonthLabel(monthString)
      })
    }
    
    return options
  }

  const defaultTrigger = (
    <Button className="gap-2">
      <Plus className="w-4 h-4" />
      {existingBudget ? 'Edit Budget' : 'Set Budget'}
    </Button>
  )

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {trigger || defaultTrigger}
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <DollarSign className="w-5 h-5" />
            {existingBudget ? 'Edit Budget' : 'Set Monthly Budget'}
          </DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="month">Month</Label>
            <Select
              value={formData.month}
              onValueChange={(value) => setFormData(prev => ({ ...prev, month: value }))}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select month" />
              </SelectTrigger>
              <SelectContent>
                {generateMonthOptions().map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="category">Category</Label>
            <Select
              value={formData.category}
              onValueChange={(value) => setFormData(prev => ({ ...prev, category: value }))}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select category" />
              </SelectTrigger>
              <SelectContent>
                {getExpenseCategories().map((category) => (
                  <SelectItem key={category.name} value={category.name}>
                    <div className="flex items-center gap-2">
                      <span>{category.icon}</span>
                      <span>{category.name}</span>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="amount">Budget Amount</Label>
            <Input
              id="amount"
              type="number"
              step="0.01"
              min="0"
              placeholder="0.00"
              value={formData.amount}
              onChange={(e) => setFormData(prev => ({ ...prev, amount: e.target.value }))}
            />
          </div>

          <div className="flex justify-end gap-2 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => setOpen(false)}
              disabled={loading}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? 'Saving...' : existingBudget ? 'Update Budget' : 'Set Budget'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}

