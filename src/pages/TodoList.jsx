import React, { useState } from "react";
import { useApp } from "../context/AppContext";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";
import { Badge } from "../components/ui/badge";
import { Checkbox } from "../components/ui/checkbox";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "../components/ui/select";
import { 
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../components/ui/dialog";
import { Label } from "../components/ui/label";
import { Textarea } from "../components/ui/textarea";
import { 
  CheckSquare, 
  Plus, 
  Edit, 
  Trash2, 
  Calendar,
  Filter,
  SortAsc,
  SortDesc
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { format } from "date-fns";

const categories = [
  "Work", "Personal", "Health", "Finance", "Learning", "Social", "Shopping", "Other"
];

const priorities = [
  { value: "low", label: "Low", color: "bg-green-100 text-green-800" },
  { value: "medium", label: "Medium", color: "bg-yellow-100 text-yellow-800" },
  { value: "high", label: "High", color: "bg-red-100 text-red-800" }
];

export default function TodoList() {
  const { state, dispatch } = useApp();
  const [editingTodo, setEditingTodo] = useState(null);
  const [showDialog, setShowDialog] = useState(false);
  const [filters, setFilters] = useState({
    status: "all",
    category: "all",
    priority: "all"
  });
  const [sortBy, setSortBy] = useState("created_date");
  const [sortOrder, setSortOrder] = useState("desc");
  const [newTodo, setNewTodo] = useState({
    title: "",
    description: "",
    category: "",
    priority: "medium",
    due_date: ""
  });

  const todos = state.todos;

  const handleCreateTodo = () => {
    dispatch({ type: 'ADD_TODO', payload: newTodo });
    setNewTodo({
      title: "",
      description: "",
      category: "",
      priority: "medium",
      due_date: ""
    });
    setShowDialog(false);
  };

  const handleUpdateTodo = (id, updates) => {
    dispatch({ type: 'UPDATE_TODO', payload: { id, updates } });
  };

  const handleDeleteTodo = (id) => {
    dispatch({ type: 'DELETE_TODO', payload: id });
  };

  const handleEditTodo = () => {
    dispatch({ type: 'UPDATE_TODO', payload: { id: editingTodo.id, updates: editingTodo } });
    setEditingTodo(null);
    setShowDialog(false);
  };

  const filteredAndSortedTodos = todos
    .filter(todo => {
      const statusMatch = filters.status === "all" || 
        (filters.status === "completed" && todo.completed) ||
        (filters.status === "incomplete" && !todo.completed);
      
      const categoryMatch = filters.category === "all" || todo.category === filters.category;
      const priorityMatch = filters.priority === "all" || todo.priority === filters.priority;
      
      return statusMatch && categoryMatch && priorityMatch;
    })
    .sort((a, b) => {
      let aValue, bValue;
      
      if (sortBy === "due_date") {
        aValue = a.due_date ? new Date(a.due_date) : new Date("2099-12-31");
        bValue = b.due_date ? new Date(b.due_date) : new Date("2099-12-31");
      } else {
        aValue = new Date(a.created_date);
        bValue = new Date(b.created_date);
      }
      
      if (sortOrder === "asc") {
        return aValue - bValue;
      } else {
        return bValue - aValue;
      }
    });

  const stats = {
    total: todos.length,
    completed: todos.filter(t => t.completed).length,
    incomplete: todos.filter(t => !t.completed).length,
    overdue: todos.filter(t => !t.completed && t.due_date && new Date(t.due_date) < new Date()).length
  };

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">To-Do List</h1>
          <p className="text-gray-600 mt-1">
            Stay organized and productive with your personal tasks
          </p>
        </div>
        <Dialog open={showDialog} onOpenChange={setShowDialog}>
          <DialogTrigger asChild>
            <Button 
              onClick={() => {
                setEditingTodo(null);
                setNewTodo({
                  title: "",
                  description: "",
                  category: "",
                  priority: "medium",
                  due_date: ""
                });
              }}
              className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
            >
              <Plus className="w-4 h-4 mr-2" />
              Add Task
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>
                {editingTodo ? "Edit Task" : "Add New Task"}
              </DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label htmlFor="title">Title *</Label>
                <Input
                  id="title"
                  value={editingTodo ? editingTodo.title : newTodo.title}
                  onChange={(e) => {
                    if (editingTodo) {
                      setEditingTodo({ ...editingTodo, title: e.target.value });
                    } else {
                      setNewTodo({ ...newTodo, title: e.target.value });
                    }
                  }}
                  placeholder="Enter task title"
                />
              </div>
              <div>
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  value={editingTodo ? editingTodo.description : newTodo.description}
                  onChange={(e) => {
                    if (editingTodo) {
                      setEditingTodo({ ...editingTodo, description: e.target.value });
                    } else {
                      setNewTodo({ ...newTodo, description: e.target.value });
                    }
                  }}
                  placeholder="Enter task description"
                  rows={3}
                />
              </div>
              <div>
                <Label htmlFor="category">Category</Label>
                <Select
                  value={editingTodo ? editingTodo.category : newTodo.category}
                  onValueChange={(value) => {
                    if (editingTodo) {
                      setEditingTodo({ ...editingTodo, category: value });
                    } else {
                      setNewTodo({ ...newTodo, category: value });
                    }
                  }}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map(cat => (
                      <SelectItem key={cat} value={cat}>{cat}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="priority">Priority</Label>
                <Select
                  value={editingTodo ? editingTodo.priority : newTodo.priority}
                  onValueChange={(value) => {
                    if (editingTodo) {
                      setEditingTodo({ ...editingTodo, priority: value });
                    } else {
                      setNewTodo({ ...newTodo, priority: value });
                    }
                  }}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {priorities.map(priority => (
                      <SelectItem key={priority.value} value={priority.value}>
                        {priority.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="due_date">Due Date</Label>
                <Input
                  id="due_date"
                  type="date"
                  value={editingTodo ? editingTodo.due_date : newTodo.due_date}
                  onChange={(e) => {
                    if (editingTodo) {
                      setEditingTodo({ ...editingTodo, due_date: e.target.value });
                    } else {
                      setNewTodo({ ...newTodo, due_date: e.target.value });
                    }
                  }}
                />
              </div>
              <div className="flex justify-end gap-3 pt-4">
                <Button
                  variant="outline"
                  onClick={() => setShowDialog(false)}
                >
                  Cancel
                </Button>
                <Button
                  onClick={editingTodo ? handleEditTodo : handleCreateTodo}
                  disabled={editingTodo ? !editingTodo.title : !newTodo.title}
                >
                  {editingTodo ? "Update" : "Create"}
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total Tasks</p>
                <p className="text-2xl font-bold text-gray-900">{stats.total}</p>
              </div>
              <CheckSquare className="w-8 h-8 text-blue-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Completed</p>
                <p className="text-2xl font-bold text-green-600">{stats.completed}</p>
              </div>
              <CheckSquare className="w-8 h-8 text-green-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Incomplete</p>
                <p className="text-2xl font-bold text-orange-600">{stats.incomplete}</p>
              </div>
              <CheckSquare className="w-8 h-8 text-orange-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Overdue</p>
                <p className="text-2xl font-bold text-red-600">{stats.overdue}</p>
              </div>
              <Calendar className="w-8 h-8 text-red-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters and Sort */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Filter className="w-5 h-5" />
            Filters & Sort
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
            <div>
              <Label className="text-sm text-gray-600">Status</Label>
              <Select value={filters.status} onValueChange={(value) => setFilters({...filters, status: value})}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All</SelectItem>
                  <SelectItem value="completed">Completed</SelectItem>
                  <SelectItem value="incomplete">Incomplete</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label className="text-sm text-gray-600">Category</Label>
              <Select value={filters.category} onValueChange={(value) => setFilters({...filters, category: value})}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All</SelectItem>
                  {categories.map(cat => (
                    <SelectItem key={cat} value={cat}>{cat}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label className="text-sm text-gray-600">Priority</Label>
              <Select value={filters.priority} onValueChange={(value) => setFilters({...filters, priority: value})}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All</SelectItem>
                  {priorities.map(priority => (
                    <SelectItem key={priority.value} value={priority.value}>
                      {priority.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label className="text-sm text-gray-600">Sort By</Label>
              <Select value={sortBy} onValueChange={setSortBy}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="created_date">Created Date</SelectItem>
                  <SelectItem value="due_date">Due Date</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label className="text-sm text-gray-600">Order</Label>
              <Button
                variant="outline"
                className="w-full justify-start"
                onClick={() => setSortOrder(sortOrder === "asc" ? "desc" : "asc")}
              >
                {sortOrder === "asc" ? <SortAsc className="w-4 h-4 mr-2" /> : <SortDesc className="w-4 h-4 mr-2" />}
                {sortOrder === "asc" ? "Ascending" : "Descending"}
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Tasks List */}
      <div className="space-y-4">
        <AnimatePresence>
          {filteredAndSortedTodos.map((todo, index) => {
            const priority = priorities.find(p => p.value === todo.priority);
            const isOverdue = !todo.completed && todo.due_date && new Date(todo.due_date) < new Date();
            
            return (
              <motion.div
                key={todo.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ delay: index * 0.05 }}
              >
                <Card className={`transition-all duration-300 ${
                  todo.completed 
                    ? "bg-green-50 border-green-200" 
                    : isOverdue 
                      ? "bg-red-50 border-red-200" 
                      : "hover:shadow-lg"
                }`}>
                  <CardContent className="p-4">
                    <div className="flex items-start gap-4">
                      <div className="pt-1">
                        <Checkbox
                          checked={todo.completed}
                          onCheckedChange={(checked) => handleUpdateTodo(todo.id, { completed: checked })}
                        />
                      </div>
                      
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between">
                          <div>
                            <h3 className={`text-lg font-semibold ${
                              todo.completed ? "text-gray-500 line-through" : "text-gray-900"
                            }`}>
                              {todo.title}
                            </h3>
                            {todo.description && (
                              <p className="text-gray-600 mt-1 text-sm">{todo.description}</p>
                            )}
                            <div className="flex items-center gap-2 mt-2">
                              {todo.category && (
                                <Badge variant="secondary">{todo.category}</Badge>
                              )}
                              {priority && (
                                <Badge variant="secondary" className={priority.color}>
                                  {priority.label}
                                </Badge>
                              )}
                              {todo.due_date && (
                                <Badge variant="outline" className={isOverdue ? "border-red-500 text-red-600" : ""}>
                                  <Calendar className="w-3 h-3 mr-1" />
                                  Due: {format(new Date(todo.due_date), "MMM d, yyyy")}
                                </Badge>
                              )}
                            </div>
                          </div>
                          
                          <div className="flex items-center gap-2">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => {
                                setEditingTodo(todo);
                                setShowDialog(true);
                              }}
                            >
                              <Edit className="w-4 h-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleDeleteTodo(todo.id)}
                              className="text-red-600 hover:text-red-700"
                            >
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            );
          })}
        </AnimatePresence>
      </div>

      {filteredAndSortedTodos.length === 0 && (
        <div className="text-center py-12">
          <CheckSquare className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-gray-900 mb-2">No tasks found</h3>
          <p className="text-gray-600 mb-6">
            {todos.length === 0 
              ? "Create your first task to get started!" 
              : "Try adjusting your filters or create a new task."}
          </p>
        </div>
      )}
    </div>
  );
}