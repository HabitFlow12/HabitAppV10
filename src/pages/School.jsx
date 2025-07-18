import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Button } from '../components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Textarea } from '../components/ui/textarea';
import { Checkbox } from '../components/ui/checkbox';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '../components/ui/dialog';
import { Plus, GraduationCap, Edit, Trash2, Calendar, BookOpen, Filter } from 'lucide-react';
import { format, parseISO, startOfWeek, endOfWeek, addDays, isSameDay } from 'date-fns';

export default function School() {
  const { state, dispatch } = useApp();
  const [showDialog, setShowDialog] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [currentAssignment, setCurrentAssignment] = useState(null);
  const [view, setView] = useState('list'); // 'list' or 'calendar'
  const [filterSubject, setFilterSubject] = useState('all');

  const assignments = state.schoolAssignments;
  const subjects = [...new Set(assignments.map(a => a.subject))];
  const filteredAssignments = assignments.filter(a => filterSubject === 'all' || a.subject === filterSubject);

  const openNewDialog = () => {
    setIsEditing(false);
    setCurrentAssignment({ due_date: format(new Date(), 'yyyy-MM-dd') });
    setShowDialog(true);
  };

  const openEditDialog = (assignment) => {
    setIsEditing(true);
    setCurrentAssignment(assignment);
    setShowDialog(true);
  };
  
  const handleSave = () => {
    if (isEditing) {
      dispatch({ type: 'UPDATE_SCHOOL_ASSIGNMENT', payload: { id: currentAssignment.id, updates: currentAssignment } });
    } else {
      dispatch({ type: 'ADD_SCHOOL_ASSIGNMENT', payload: currentAssignment });
    }
    setShowDialog(false);
  };
  
  const handleDelete = (id) => {
    dispatch({ type: 'DELETE_SCHOOL_ASSIGNMENT', payload: id });
  };
  
  const toggleComplete = (assignment) => {
    dispatch({ type: 'UPDATE_SCHOOL_ASSIGNMENT', payload: { id: assignment.id, updates: { completed: !assignment.completed } } });
  };
  
  const renderCalendarView = () => {
    const weekStart = startOfWeek(new Date());
    const days = Array.from({length: 7}, (_, i) => addDays(weekStart, i));
    
    return (
      <div className="grid grid-cols-7 gap-2">
        {days.map(day => (
          <div key={day} className="border rounded-lg p-2 min-h-[150px] bg-gray-50">
            <p className="font-bold text-center">{format(day, 'EEE')}</p>
            <p className="text-sm text-center mb-2">{format(day, 'd')}</p>
            <div className="space-y-1">
              {assignments
                .filter(a => isSameDay(parseISO(a.due_date), day))
                .map(a => (
                  <div key={a.id} className="text-xs p-1 bg-blue-100 text-blue-800 rounded truncate cursor-pointer" onClick={() => openEditDialog(a)}>
                    {a.title}
                  </div>
                ))}
            </div>
          </div>
        ))}
      </div>
    );
  };

  return (
    <div className="max-w-7xl mx-auto space-y-6">
       <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">School Organizer</h1>
          <p className="text-gray-600 mt-1">Manage your assignments and stay on top of your deadlines.</p>
        </div>
        <div className="flex items-center gap-2">
            <Button variant={view === 'list' ? 'default' : 'outline'} onClick={() => setView('list')}>List</Button>
            <Button variant={view === 'calendar' ? 'default' : 'outline'} onClick={() => setView('calendar')}>Calendar</Button>
            <Button onClick={openNewDialog}><Plus className="w-4 h-4 mr-2" />Add Assignment</Button>
        </div>
      </div>
      
      {view === 'list' && (
        <Card>
          <CardHeader>
            <div className="flex justify-between items-center">
              <CardTitle>Upcoming Assignments</CardTitle>
              <div className="flex items-center gap-2">
                <Filter className="w-4 h-4" />
                <select value={filterSubject} onChange={(e) => setFilterSubject(e.target.value)} className="p-2 border rounded-md">
                  <option value="all">All Subjects</option>
                  {subjects.map(s => <option key={s} value={s}>{s}</option>)}
                </select>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {filteredAssignments.map(a => (
                <div key={a.id} className={`flex items-start gap-4 p-4 rounded-lg ${a.completed ? 'bg-green-50' : 'bg-white'}`}>
                    <Checkbox checked={a.completed} onCheckedChange={() => toggleComplete(a)} className="mt-1"/>
                    <div className="flex-1">
                      <p className={`font-semibold ${a.completed ? 'line-through text-gray-500' : ''}`}>{a.title}</p>
                      <div className="flex items-center gap-4 text-sm text-gray-500 mt-1">
                        <span className="flex items-center gap-1"><BookOpen className="w-4 h-4"/>{a.subject}</span>
                        <span className="flex items-center gap-1"><Calendar className="w-4 h-4"/>Due: {format(parseISO(a.due_date), 'MMM dd, yyyy')}</span>
                      </div>
                      {a.notes && <p className="text-sm text-gray-600 mt-2">{a.notes}</p>}
                    </div>
                    <div className="flex gap-1">
                      <Button variant="ghost" size="icon" onClick={() => openEditDialog(a)}><Edit className="w-4 h-4"/></Button>
                      <Button variant="ghost" size="icon" onClick={() => handleDelete(a.id)}><Trash2 className="w-4 h-4 text-red-500"/></Button>
                    </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {view === 'calendar' && (
         <Card>
          <CardHeader><CardTitle>Weekly Calendar View</CardTitle></CardHeader>
          <CardContent>{renderCalendarView()}</CardContent>
        </Card>
      )}

      <Dialog open={showDialog} onOpenChange={setShowDialog}>
        <DialogContent>
          <DialogHeader><DialogTitle>{isEditing ? 'Edit' : 'Add'} Assignment</DialogTitle></DialogHeader>
          <div className="space-y-4">
            <div>
              <Label>Title</Label>
              <Input value={currentAssignment?.title || ''} onChange={(e) => setCurrentAssignment({...currentAssignment, title: e.target.value})} />
            </div>
            <div>
              <Label>Subject</Label>
              <Input value={currentAssignment?.subject || ''} onChange={(e) => setCurrentAssignment({...currentAssignment, subject: e.target.value})} />
            </div>
            <div>
              <Label>Due Date</Label>
              <Input type="date" value={currentAssignment?.due_date || ''} onChange={(e) => setCurrentAssignment({...currentAssignment, due_date: e.target.value})} />
            </div>
            <div>
              <Label>Notes</Label>
              <Textarea value={currentAssignment?.notes || ''} onChange={(e) => setCurrentAssignment({...currentAssignment, notes: e.target.value})} />
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