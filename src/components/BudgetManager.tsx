import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import BudgetForm from '@/components/forms/BudgetForm'
import { Budget } from '@/types'
import { getCategoryByName } from '@/lib/categories'
import { toast } from 'sonner'
import { 
  Edit, 
  Trash2, 
  DollarSign,
  Plus,
  AlertTriangle
} from 'lucide-react'

interface BudgetManagerProps {
  refreshTrigger?: number
  onUpdate?: () => void
}

export default function BudgetManager({ refreshTrigger, onUpdate }: BudgetManagerProps) {
  const [budgets, setBudgets] = useState<Budget[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedMonth, setSelectedMonth] = useState(new Date().toISOString().slice(0, 7))

  const fetchBudgets = async () => {
    try {
      setLoading(true)
      const response = await fetch(`/api/budgets?month=${selectedMonth}`)
      const result = await response.json()

      if (result.success) {
        setBudgets(result.data)
      } else {
        toast.error('Failed to fetch budgets')
      }
    } catch (error) {
      console.error('Error fetching budgets:', error)
      toast.error('Failed to fetch budgets')
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async (budgetId: string) => {
    if (!confirm('Are you sure you want to delete this budget?')) {
      return
    }

    try {
      const response = await fetch(`/api/budgets/${budgetId}`, {
        method: 'DELETE',
      })

      const result = await response.json()

      if (result.success) {
        toast.success('Budget deleted successfully')
        fetchBudgets()
        onUpdate?.()
      } else {
        toast.error(result.error || 'Failed to delete budget')
      }
    } catch (error) {
      console.error('Error deleting budget:', error)
      toast.error('Failed to delete budget')
    }
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount)
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

  const getTotalBudget = () => {
    return budgets.reduce((total, budget) => total + budget.amount, 0)
  }

  useEffect(() => {
    fetchBudgets()
  }, [selectedMonth, refreshTrigger])

  const handleBudgetSuccess = () => {
    fetchBudgets()
    onUpdate?.()
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <DollarSign className="w-5 h-5" />
            Budget Manager
          </CardTitle>
          <BudgetForm onSuccess={handleBudgetSuccess} />
        </div>
        
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <label className="text-sm font-medium">Month:</label>
            <Select value={selectedMonth} onValueChange={setSelectedMonth}>
              <SelectTrigger className="w-[180px]">
                <SelectValue />
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
          
          {budgets.length > 0 && (
            <div className="flex items-center gap-2 text-sm">
              <span className="text-muted-foreground">Total Budget:</span>
              <span className="font-bold text-primary">{formatCurrency(getTotalBudget())}</span>
            </div>
          )}
        </div>
      </CardHeader>
      
      <CardContent>
        {loading ? (
          <div className="flex items-center justify-center h-32">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          </div>
        ) : budgets.length === 0 ? (
          <div className="text-center py-8">
            <AlertTriangle className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
            <p className="text-muted-foreground mb-4">
              No budgets set for {formatMonthLabel(selectedMonth)}
            </p>
            <BudgetForm 
              onSuccess={handleBudgetSuccess}
              trigger={
                <Button variant="outline" className="gap-2">
                  <Plus className="w-4 h-4" />
                  Set Your First Budget
                </Button>
              }
            />
          </div>
        ) : (
          <div className="space-y-4">
            {budgets.map((budget) => {
              const categoryInfo = getCategoryByName(budget.category)
              
              return (
                <div
                  key={budget._id}
                  className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/50 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <div className="text-2xl">{categoryInfo?.icon}</div>
                    <div>
                      <div className="font-medium">{budget.category}</div>
                      <div className="text-sm text-muted-foreground">
                        {formatMonthLabel(budget.month)}
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-4">
                    <div className="text-right">
                      <div className="font-bold text-lg">{formatCurrency(budget.amount)}</div>
                      <Badge variant="outline" className="text-xs">
                        Monthly Budget
                      </Badge>
                    </div>
                    
                    <div className="flex items-center gap-2">
                      <BudgetForm
                        existingBudget={budget}
                        onSuccess={handleBudgetSuccess}
                        trigger={
                          <Button variant="outline" size="sm" className="gap-1">
                            <Edit className="w-3 h-3" />
                            Edit
                          </Button>
                        }
                      />
                      <Button
                        variant="outline"
                        size="sm"
                        className="gap-1 text-red-600 hover:text-red-700"
                        onClick={() => handleDelete(budget._id!)}
                      >
                        <Trash2 className="w-3 h-3" />
                        Delete
                      </Button>
                    </div>
                  </div>
                </div>
              )
            })}
            
            <div className="pt-4 border-t">
              <div className="flex items-center justify-between text-sm text-muted-foreground">
                <span>{budgets.length} budget{budgets.length !== 1 ? 's' : ''} set for {formatMonthLabel(selectedMonth)}</span>
                <span>Total: {formatCurrency(getTotalBudget())}</span>
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}

