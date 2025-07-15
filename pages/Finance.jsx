import React, { useState, useEffect, useMemo } from 'react';
import { FinanceTransaction } from '@/entities/FinanceTransaction';
import { Budget } from '@/entities/Budget';
import { User } from '@/entities/User';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Plus, TrendingUp, TrendingDown, DollarSign, PiggyBank, Filter, Edit, Trash2 } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { format, startOfMonth, endOfMonth, parseISO } from 'date-fns';

const categories = {
  income: ["Job", "Freelance", "Investment", "Gift", "Other"],
  expense: ["Food", "Rent", "Transportation", "Entertainment", "Utilities", "Health", "Shopping", "Other"]
};

export default function Finance() {
  const [transactions, setTransactions] = useState([]);
  const [budgets, setBudgets] = useState([]);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showDialog, setShowDialog] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [currentTransaction, setCurrentTransaction] = useState(null);
  const [currentMonth, setCurrentMonth] = useState(format(new Date(), 'yyyy-MM'));

  useEffect(() => {
    const loadData = async () => {
      try {
        const userData = await User.me();
        setUser(userData);
        const [transData, budgetData] = await Promise.all([
          FinanceTransaction.filter({ user_id: userData.id }),
          Budget.filter({ user_id: userData.id })
        ]);
        setTransactions(transData);
        setBudgets(budgetData);
      } catch (error) {
        console.error("Error loading finance data:", error);
      }
      setLoading(false);
    };
    loadData();
  }, []);

  const openNewDialog = () => {
    setIsEditing(false);
    setCurrentTransaction({ type: 'expense', date: format(new Date(), 'yyyy-MM-dd') });
    setShowDialog(true);
  };

  const openEditDialog = (transaction) => {
    setIsEditing(true);
    setCurrentTransaction(transaction);
    setShowDialog(true);
  };

  const handleDelete = async (id) => {
    await FinanceTransaction.delete(id);
    setTransactions(transactions.filter(t => t.id !== id));
  };

  const handleSave = async () => {
    if (isEditing) {
      await FinanceTransaction.update(currentTransaction.id, currentTransaction);
    } else {
      await FinanceTransaction.create({ ...currentTransaction, user_id: user.id });
    }
    const transData = await FinanceTransaction.filter({ user_id: user.id });
    setTransactions(transData);
    setShowDialog(false);
  };

  const monthlyData = useMemo(() => {
    const monthStart = startOfMonth(parseISO(currentMonth));
    const monthEnd = endOfMonth(parseISO(currentMonth));
    
    return transactions.filter(t => {
      const tDate = parseISO(t.date);
      return tDate >= monthStart && tDate <= monthEnd;
    });
  }, [transactions, currentMonth]);

  const stats = useMemo(() => {
    const income = monthlyData.filter(t => t.type === 'income').reduce((sum, t) => sum + t.amount, 0);
    const expense = monthlyData.filter(t => t.type === 'expense').reduce((sum, t) => sum + t.amount, 0);
    return { income, expense, net: income - expense };
  }, [monthlyData]);

  const chartData = useMemo(() => {
    const expenseByCategory = monthlyData
      .filter(t => t.type === 'expense')
      .reduce((acc, t) => {
        acc[t.category] = (acc[t.category] || 0) + t.amount;
        return acc;
      }, {});
    
    return Object.entries(expenseByCategory).map(([name, amount]) => ({ name, amount }));
  }, [monthlyData]);

  if (loading) return <div>Loading...</div>;

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Finance Center</h1>
          <p className="text-gray-600 mt-1">Track your income, expenses, and budgets.</p>
        </div>
        <div className="flex items-center gap-2">
            <Input 
              type="month"
              value={currentMonth}
              onChange={(e) => setCurrentMonth(e.target.value)}
              className="w-48"
            />
          <Button onClick={openNewDialog}><Plus className="w-4 h-4 mr-2" />Add Transaction</Button>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader><CardTitle className="flex items-center gap-2"><TrendingUp className="text-green-500"/>Total Income</CardTitle></CardHeader>
          <CardContent><p className="text-3xl font-bold text-green-600">${stats.income.toFixed(2)}</p></CardContent>
        </Card>
        <Card>
          <CardHeader><CardTitle className="flex items-center gap-2"><TrendingDown className="text-red-500"/>Total Expenses</CardTitle></CardHeader>
          <CardContent><p className="text-3xl font-bold text-red-600">${stats.expense.toFixed(2)}</p></CardContent>
        </Card>
        <Card>
          <CardHeader><CardTitle className="flex items-center gap-2"><PiggyBank className="text-blue-500"/>Net Savings</CardTitle></CardHeader>
          <CardContent><p className={`text-3xl font-bold ${stats.net >= 0 ? 'text-blue-600' : 'text-red-600'}`}>${stats.net.toFixed(2)}</p></CardContent>
        </Card>
      </div>
      
      <Card>
          <CardHeader><CardTitle>Spending by Category</CardTitle></CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip formatter={(value) => `$${value.toFixed(2)}`} />
                <Bar dataKey="amount" fill="#8884d8" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
      </Card>
      
      <Card>
          <CardHeader><CardTitle>Recent Transactions</CardTitle></CardHeader>
          <CardContent>
            <div className="space-y-4">
                {monthlyData.map(t => (
                  <div key={t.id} className="flex items-center justify-between p-3 rounded-lg bg-gray-50">
                    <div className="flex items-center gap-4">
                      <div className={`w-10 h-10 rounded-full flex items-center justify-center ${t.type === 'income' ? 'bg-green-100' : 'bg-red-100'}`}>
                        {t.type === 'income' ? <TrendingUp className="text-green-500"/> : <TrendingDown className="text-red-500"/>}
                      </div>
                      <div>
                        <p className="font-semibold">{t.description}</p>
                        <p className="text-sm text-gray-500">{t.category} - {format(parseISO(t.date), 'MMM dd, yyyy')}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                        <p className={`font-bold ${t.type === 'income' ? 'text-green-600' : 'text-red-600'}`}>
                          {t.type === 'income' ? '+' : '-'}${t.amount.toFixed(2)}
                        </p>
                        <Button variant="ghost" size="icon" onClick={() => openEditDialog(t)}><Edit className="w-4 h-4"/></Button>
                        <Button variant="ghost" size="icon" onClick={() => handleDelete(t.id)}><Trash2 className="w-4 h-4 text-red-500"/></Button>
                    </div>
                  </div>
                ))}
            </div>
          </CardContent>
      </Card>

      <Dialog open={showDialog} onOpenChange={setShowDialog}>
        <DialogContent>
          <DialogHeader><DialogTitle>{isEditing ? 'Edit' : 'Add'} Transaction</DialogTitle></DialogHeader>
          <div className="space-y-4">
            <div>
              <Label>Type</Label>
              <Select value={currentTransaction?.type} onValueChange={(v) => setCurrentTransaction({...currentTransaction, type: v})}>
                <SelectTrigger><SelectValue/></SelectTrigger>
                <SelectContent>
                  <SelectItem value="income">Income</SelectItem>
                  <SelectItem value="expense">Expense</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label>Description</Label>
              <Input value={currentTransaction?.description || ''} onChange={(e) => setCurrentTransaction({...currentTransaction, description: e.target.value})} />
            </div>
            <div>
              <Label>Amount</Label>
              <Input type="number" value={currentTransaction?.amount || ''} onChange={(e) => setCurrentTransaction({...currentTransaction, amount: parseFloat(e.target.value)})} />
            </div>
            <div>
              <Label>Category</Label>
              <Select value={currentTransaction?.category} onValueChange={(v) => setCurrentTransaction({...currentTransaction, category: v})}>
                <SelectTrigger><SelectValue/></SelectTrigger>
                <SelectContent>
                  {(categories[currentTransaction?.type] || []).map(c => <SelectItem key={c} value={c}>{c}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label>Date</Label>
              <Input type="date" value={currentTransaction?.date || ''} onChange={(e) => setCurrentTransaction({...currentTransaction, date: e.target.value})} />
            </div>
            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={() => setShowDialog(false)}>Cancel</Button>
              <Button onClick={handleSave}>Save</Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
