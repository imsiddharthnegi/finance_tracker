'use client'

import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import TransactionForm from '@/components/forms/TransactionForm'
import BudgetForm from '@/components/forms/BudgetForm'
import TransactionList from '@/components/TransactionList'
import MonthlyExpensesChart from '@/components/charts/MonthlyExpensesChart'
import CategoryPieChart from '@/components/charts/CategoryPieChart'
import BudgetComparisonChart from '@/components/charts/BudgetComparisonChart'
import SummaryCards from '@/components/dashboard/SummaryCards'
import BudgetManager from '@/components/BudgetManager'
import SpendingInsights from '@/components/SpendingInsights'
import { Wallet, TrendingUp, TrendingDown, DollarSign, BarChart3, PieChart, Target, Sparkles } from 'lucide-react'

export default function HomePage() {
  const [refreshTrigger, setRefreshTrigger] = useState(0)
  const [selectedMonth, setSelectedMonth] = useState(new Date().toISOString().slice(0, 7))

  const handleTransactionSuccess = () => {
    setRefreshTrigger(prev => prev + 1)
  }

  const handleBudgetUpdate = () => {
    setRefreshTrigger(prev => prev + 1)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 dark:from-slate-900 dark:via-slate-800 dark:to-slate-700 custom-scrollbar">
      <div className="container mx-auto px-4 py-6 sm:py-8 max-w-7xl">
        {/* Enhanced Header */}
        <div className="mb-8 animate-fade-in">
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 mb-6">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl shadow-soft">
                <Wallet className="w-8 h-8 text-white" />
              </div>
              <div>
                <h1 className="text-responsive-xl font-bold tracking-tight bg-gradient-to-r from-slate-900 to-slate-600 dark:from-white dark:to-slate-300 bg-clip-text text-transparent">
                  Personal Finance Tracker
                </h1>
                <p className="text-muted-foreground text-sm sm:text-base">
                  Take control of your finances with smart tracking and insights
                </p>
              </div>
            </div>
            
            <div className="flex items-center gap-2 ml-auto">
              <div className="flex items-center gap-1 px-2 py-1 bg-gradient-to-r from-emerald-100 to-green-100 dark:from-emerald-900/30 dark:to-green-900/30 rounded-full">
                <Sparkles className="w-3 h-3 text-emerald-600" />
                <span className="text-xs font-medium text-emerald-700 dark:text-emerald-400">Stage 3</span>
              </div>
            </div>
          </div>
          
          <div className="flex flex-col lg:flex-row gap-4 items-start lg:items-center justify-between">
            <div className="flex flex-wrap gap-2">
              <div className="flex items-center gap-2 px-3 py-2 bg-gradient-to-r from-green-100 to-emerald-100 dark:from-green-900/20 dark:to-emerald-900/20 rounded-full shadow-soft">
                <TrendingUp className="w-4 h-4 text-green-600" />
                <span className="text-sm font-medium text-green-700 dark:text-green-400">Income Tracking</span>
              </div>
              <div className="flex items-center gap-2 px-3 py-2 bg-gradient-to-r from-red-100 to-pink-100 dark:from-red-900/20 dark:to-pink-900/20 rounded-full shadow-soft">
                <TrendingDown className="w-4 h-4 text-red-600" />
                <span className="text-sm font-medium text-red-700 dark:text-red-400">Expense Management</span>
              </div>
              <div className="flex items-center gap-2 px-3 py-2 bg-gradient-to-r from-blue-100 to-indigo-100 dark:from-blue-900/20 dark:to-indigo-900/20 rounded-full shadow-soft">
                <DollarSign className="w-4 h-4 text-blue-600" />
                <span className="text-sm font-medium text-blue-700 dark:text-blue-400">Budget Insights</span>
              </div>
            </div>
            
            <div className="flex gap-3">
              <TransactionForm 
                onSuccess={handleTransactionSuccess}
                trigger={
                  <button className="btn-animate px-4 py-2 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white rounded-lg shadow-soft focus-enhanced flex items-center gap-2 text-sm font-medium">
                    <TrendingUp className="w-4 h-4" />
                    Add Transaction
                  </button>
                }
              />
              <BudgetForm 
                onSuccess={handleBudgetUpdate}
                trigger={
                  <button className="btn-animate px-4 py-2 bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800 text-white rounded-lg shadow-soft focus-enhanced flex items-center gap-2 text-sm font-medium">
                    <Target className="w-4 h-4" />
                    Set Budget
                  </button>
                }
              />
            </div>
          </div>
        </div>

        {/* Enhanced Main Content Tabs */}
        <Tabs defaultValue="dashboard" className="space-y-6 animate-slide-in-up">
          <TabsList className="grid w-full grid-cols-2 lg:grid-cols-4 h-auto p-1 bg-white/50 dark:bg-slate-800/50 backdrop-blur-sm border shadow-soft">
            <TabsTrigger 
              value="dashboard" 
              className="flex items-center gap-2 py-3 px-4 data-[state=active]:bg-white data-[state=active]:shadow-soft data-[state=active]:text-blue-600 transition-all duration-200"
            >
              <BarChart3 className="w-4 h-4" />
              <span className="hidden sm:inline">Dashboard</span>
            </TabsTrigger>
            <TabsTrigger 
              value="budgets" 
              className="flex items-center gap-2 py-3 px-4 data-[state=active]:bg-white data-[state=active]:shadow-soft data-[state=active]:text-purple-600 transition-all duration-200"
            >
              <Target className="w-4 h-4" />
              <span className="hidden sm:inline">Budgets</span>
            </TabsTrigger>
            <TabsTrigger 
              value="insights" 
              className="flex items-center gap-2 py-3 px-4 data-[state=active]:bg-white data-[state=active]:shadow-soft data-[state=active]:text-green-600 transition-all duration-200"
            >
              <PieChart className="w-4 h-4" />
              <span className="hidden sm:inline">Insights</span>
            </TabsTrigger>
            <TabsTrigger 
              value="transactions" 
              className="flex items-center gap-2 py-3 px-4 data-[state=active]:bg-white data-[state=active]:shadow-soft data-[state=active]:text-orange-600 transition-all duration-200"
            >
              <DollarSign className="w-4 h-4" />
              <span className="hidden sm:inline">Transactions</span>
            </TabsTrigger>
          </TabsList>

          {/* Dashboard Tab */}
          <TabsContent value="dashboard" className="space-y-6 animate-fade-in">
            {/* Enhanced Dashboard Summary Cards */}
            <div className="animate-scale-in">
              <SummaryCards refreshTrigger={refreshTrigger} />
            </div>

            {/* Enhanced Charts Section */}
            <div className="grid gap-6">
              <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
                {/* Monthly Overview Chart */}
                <Card className="card-hover shadow-soft border-0 bg-white/70 dark:bg-slate-800/70 backdrop-blur-sm">
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
                    <CardTitle className="flex items-center gap-2 text-responsive-lg">
                      <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
                        <BarChart3 className="w-5 h-5 text-blue-600" />
                      </div>
                      Monthly Overview
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="chart-animate">
                    <MonthlyExpensesChart refreshTrigger={refreshTrigger} />
                  </CardContent>
                </Card>

                {/* Category Breakdown Chart */}
                <Card className="card-hover shadow-soft border-0 bg-white/70 dark:bg-slate-800/70 backdrop-blur-sm">
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
                    <CardTitle className="flex items-center gap-2 text-responsive-lg">
                      <div className="p-2 bg-purple-100 dark:bg-purple-900/30 rounded-lg">
                        <PieChart className="w-5 h-5 text-purple-600" />
                      </div>
                      Category Breakdown
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="chart-animate">
                    <CategoryPieChart refreshTrigger={refreshTrigger} type="expense" />
                  </CardContent>
                </Card>
              </div>

              {/* Enhanced Quick Actions */}
              <Card className="shadow-soft border-0 bg-white/70 dark:bg-slate-800/70 backdrop-blur-sm">
                <CardHeader>
                  <CardTitle className="text-responsive-lg">Quick Actions</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                    <TransactionForm 
                      onSuccess={handleTransactionSuccess}
                      trigger={
                        <Card className="card-hover cursor-pointer border-2 border-dashed border-green-200 hover:border-green-400 bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-900/10 dark:to-emerald-900/10 shadow-soft">
                          <CardContent className="flex flex-col items-center justify-center p-6 text-center">
                            <div className="p-3 bg-green-100 dark:bg-green-900/30 rounded-full mb-3">
                              <TrendingUp className="w-6 h-6 text-green-600" />
                            </div>
                            <span className="font-medium text-green-700 dark:text-green-400">Add Income</span>
                            <span className="text-xs text-green-600/70 mt-1">Record earnings</span>
                          </CardContent>
                        </Card>
                      }
                    />
                    
                    <TransactionForm 
                      onSuccess={handleTransactionSuccess}
                      trigger={
                        <Card className="card-hover cursor-pointer border-2 border-dashed border-red-200 hover:border-red-400 bg-gradient-to-br from-red-50 to-pink-50 dark:from-red-900/10 dark:to-pink-900/10 shadow-soft">
                          <CardContent className="flex flex-col items-center justify-center p-6 text-center">
                            <div className="p-3 bg-red-100 dark:bg-red-900/30 rounded-full mb-3">
                              <TrendingDown className="w-6 h-6 text-red-600" />
                            </div>
                            <span className="font-medium text-red-700 dark:text-red-400">Add Expense</span>
                            <span className="text-xs text-red-600/70 mt-1">Track spending</span>
                          </CardContent>
                        </Card>
                      }
                    />

                    <BudgetForm
                      onSuccess={handleBudgetUpdate}
                      trigger={
                        <Card className="card-hover cursor-pointer border-2 border-dashed border-purple-200 hover:border-purple-400 bg-gradient-to-br from-purple-50 to-indigo-50 dark:from-purple-900/10 dark:to-indigo-900/10 shadow-soft">
                          <CardContent className="flex flex-col items-center justify-center p-6 text-center">
                            <div className="p-3 bg-purple-100 dark:bg-purple-900/30 rounded-full mb-3">
                              <Target className="w-6 h-6 text-purple-600" />
                            </div>
                            <span className="font-medium text-purple-700 dark:text-purple-400">Set Budget</span>
                            <span className="text-xs text-purple-600/70 mt-1">Plan spending</span>
                          </CardContent>
                        </Card>
                      }
                    />

                    <Card className="border-2 border-dashed border-blue-200 bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-900/10 dark:to-indigo-900/10 shadow-soft">
                      <CardContent className="flex flex-col items-center justify-center p-6 text-center">
                        <div className="p-3 bg-blue-100 dark:bg-blue-900/30 rounded-full mb-3">
                          <BarChart3 className="w-6 h-6 text-blue-600" />
                        </div>
                        <span className="font-medium text-blue-700 dark:text-blue-400">View Reports</span>
                        <span className="text-xs text-blue-600/70 mt-1">Coming soon</span>
                      </CardContent>
                    </Card>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Budgets Tab */}
          <TabsContent value="budgets" className="space-y-6 animate-fade-in">
            <div className="grid gap-6">
              {/* Enhanced Budget Manager */}
              <div className="animate-scale-in">
                <BudgetManager refreshTrigger={refreshTrigger} onUpdate={handleBudgetUpdate} />
              </div>
              
              {/* Enhanced Budget vs Actual Chart */}
              <Card className="shadow-soft border-0 bg-white/70 dark:bg-slate-800/70 backdrop-blur-sm">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-responsive-lg">
                    <div className="p-2 bg-green-100 dark:bg-green-900/30 rounded-lg">
                      <Target className="w-5 h-5 text-green-600" />
                    </div>
                    Budget vs Actual Comparison
                  </CardTitle>
                  <div className="flex items-center gap-2">
                    <label className="text-sm font-medium">Month:</label>
                    <select 
                      value={selectedMonth} 
                      onChange={(e) => setSelectedMonth(e.target.value)}
                      className="px-3 py-2 border rounded-lg text-sm bg-white dark:bg-slate-800 shadow-soft focus-enhanced"
                    >
                      {Array.from({ length: 12 }, (_, i) => {
                        const date = new Date()
                        date.setMonth(date.getMonth() + i)
                        const monthString = date.toISOString().slice(0, 7)
                        const label = date.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })
                        return (
                          <option key={monthString} value={monthString}>
                            {label}
                          </option>
                        )
                      })}
                    </select>
                  </div>
                </CardHeader>
                <CardContent className="chart-animate">
                  <BudgetComparisonChart month={selectedMonth} refreshTrigger={refreshTrigger} />
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Insights Tab */}
          <TabsContent value="insights" className="space-y-6 animate-fade-in">
            <div className="grid gap-6">
              {/* Enhanced Spending Insights */}
              <div className="animate-scale-in">
                <SpendingInsights refreshTrigger={refreshTrigger} />
              </div>
              
              {/* Enhanced Additional Charts */}
              <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
                <Card className="card-hover shadow-soft border-0 bg-white/70 dark:bg-slate-800/70 backdrop-blur-sm">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-responsive-lg">
                      <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
                        <PieChart className="w-5 h-5 text-blue-600" />
                      </div>
                      Income Sources
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="chart-animate">
                    <CategoryPieChart refreshTrigger={refreshTrigger} type="income" />
                  </CardContent>
                </Card>
                
                <Card className="card-hover shadow-soft border-0 bg-white/70 dark:bg-slate-800/70 backdrop-blur-sm">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-responsive-lg">
                      <div className="p-2 bg-orange-100 dark:bg-orange-900/30 rounded-lg">
                        <BarChart3 className="w-5 h-5 text-orange-600" />
                      </div>
                      Expense Trends
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="chart-animate">
                    <CategoryPieChart refreshTrigger={refreshTrigger} type="expense" />
                  </CardContent>
                </Card>
              </div>
            </div>
          </TabsContent>

          {/* Transactions Tab */}
          <TabsContent value="transactions" className="space-y-6 animate-fade-in">
            <div className="animate-scale-in">
              <TransactionList refreshTrigger={refreshTrigger} />
            </div>
          </TabsContent>
        </Tabs>

        {/* Enhanced Footer */}
        <div className="mt-12 text-center text-sm text-muted-foreground animate-fade-in">
          <div className="flex items-center justify-center gap-2 mb-2">
            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
            <p className="font-medium">Personal Finance Tracker - Built with Next.js, React, and MongoDB</p>
          </div>
          <p className="flex items-center justify-center gap-2">
            <Sparkles className="w-4 h-4 text-purple-500" />
            Stage 3: Budgeting & Insights Implementation Complete
            <Sparkles className="w-4 h-4 text-purple-500" />
          </p>
        </div>
      </div>
    </div>
  )
}

