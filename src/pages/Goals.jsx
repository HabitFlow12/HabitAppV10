import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Button } from '../components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Textarea } from '../components/ui/textarea';
import { Checkbox } from '../components/ui/checkbox';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '../components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../components/ui/select';
import { Progress } from '../components/ui/progress';
import { Badge } from '../components/ui/badge';
import { Plus, Edit, Trash2, Calendar, Star, Flag } from 'lucide-react';
import { format, parseISO } from 'date-fns';

export default function Goals() {
  const { state, dispatch } = useApp();
  const [showDialog, setShowDialog] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [currentGoal, setCurrentGoal] = useState(null);

  const goals = state.goals;

  const openNewDialog = () => {
    setIsEditing(false);
    setCurrentGoal({ status: 'active', progress: 0, milestones: [] });
    setShowDialog(true);
  };
  
  const openEditDialog = (goal) => {
    setIsEditing(true);
    setCurrentGoal(goal);
    setShowDialog(true);
  };

  const handleSave = () => {
    if (isEditing) {
      dispatch({ type: 'UPDATE_GOAL', payload: { id: currentGoal.id, updates: currentGoal } });
    } else {
      dispatch({ type: 'ADD_GOAL', payload: { ...currentGoal, user_id: state.user.id } });
    }
    setShowDialog(false);
  };

  const handleDelete = (id) => {
    dispatch({ type: 'DELETE_GOAL', payload: id });
  };
  
  const handleMilestoneToggle = (goal, milestoneIndex) => {
    const updatedMilestones = goal.milestones.map((m, i) => i === milestoneIndex ? {...m, completed: !m.completed} : m);
    const completedCount = updatedMilestones.filter(m => m.completed).length;
    const progress = Math.round((completedCount / updatedMilestones.length) * 100);
    const updatedGoal = {...goal, milestones: updatedMilestones, progress };
    
    setCurrentGoal(updatedGoal);
  };

  const addMilestone = () => {
    const updatedGoal = {...currentGoal, milestones: [...(currentGoal.milestones || []), {title: '', completed: false}] };
    setCurrentGoal(updatedGoal);
  };

  const removeMilestone = (index) => {
    const updatedMilestones = currentGoal.milestones.filter((_, i) => i !== index);
    setCurrentGoal({...currentGoal, milestones: updatedMilestones});
  };

  const updateMilestone = (index, title) => {
    const updatedMilestones = currentGoal.milestones.map((m, i) => i === index ? {...m, title} : m);
    setCurrentGoal({...currentGoal, milestones: updatedMilestones});
  };

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Goals</h1>
          <p className="text-gray-600 mt-1">Set, track, and conquer your long-term ambitions.</p>
        </div>
        <Button onClick={openNewDialog}><Plus className="w-4 h-4 mr-2" />New Goal</Button>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {goals.map(goal => (
          <Card key={goal.id}>
            <CardHeader>
              <div className="flex justify-between items-start">
                <CardTitle>{goal.title}</CardTitle>
                <Badge variant={goal.status === 'completed' ? 'default' : 'secondary'}>{goal.status}</Badge>
              </div>
              <p className="text-sm text-gray-500">{goal.category}</p>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-600 mb-4">{goal.description}</p>
              <div className="space-y-2">
                <Progress value={goal.progress} />
                <p className="text-xs text-right">{goal.progress}% complete</p>
                
                {goal.milestones && goal.milestones.length > 0 && (
                  <div className="space-y-1 pt-2">
                    <h4 className="font-semibold">Milestones</h4>
                    {goal.milestones.map((m, i) => (
                      <div key={i} className={`text-sm flex items-center gap-2 ${m.completed ? 'text-gray-400 line-through' : ''}`}>
                        <Flag className="w-4 h-4"/> {m.title}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </CardContent>
            <div className="p-4 flex justify-between items-center text-sm text-gray-500">
              {goal.target_date && <span className="flex items-center gap-1"><Calendar className="w-4 h-4"/>{format(parseISO(goal.target_date), 'MMM yyyy')}</span>}
              <div>
                <Button variant="ghost" size="icon" onClick={() => openEditDialog(goal)}><Edit className="w-4 h-4"/></Button>
                <Button variant="ghost" size="icon" onClick={() => handleDelete(goal.id)}><Trash2 className="w-4 h-4 text-red-500"/></Button>
              </div>
            </div>
          </Card>
        ))}
      </div>

      <Dialog open={showDialog} onOpenChange={setShowDialog}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader><DialogTitle>{isEditing ? 'Edit' : 'Create'} Goal</DialogTitle></DialogHeader>
          <div className="space-y-4">
            <div>
              <Label>Title</Label>
              <Input value={currentGoal?.title || ''} onChange={(e) => setCurrentGoal({...currentGoal, title: e.target.value})} />
            </div>
            <div>
              <Label>Description</Label>
              <Textarea value={currentGoal?.description || ''} onChange={(e) => setCurrentGoal({...currentGoal, description: e.target.value})} />
            </div>
            <div>
              <Label>Category</Label>
              <Select value={currentGoal?.category || ''} onValueChange={(v) => setCurrentGoal({...currentGoal, category: v})}>
                <SelectTrigger><SelectValue placeholder="Select category"/></SelectTrigger>
                <SelectContent>
                  <SelectItem value="health">Health</SelectItem>
                  <SelectItem value="career">Career</SelectItem>
                  <SelectItem value="finance">Finance</SelectItem>
                  <SelectItem value="relationships">Relationships</SelectItem>
                  <SelectItem value="personal">Personal</SelectItem>
                  <SelectItem value="education">Education</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label>Target Date</Label>
              <Input type="date" value={currentGoal?.target_date || ''} onChange={(e) => setCurrentGoal({...currentGoal, target_date: e.target.value})} />
            </div>
            <div>
              <Label>Progress (%)</Label>
              <Input type="number" min="0" max="100" value={currentGoal?.progress || 0} onChange={(e) => setCurrentGoal({...currentGoal, progress: parseInt(e.target.value)})} />
            </div>
            <div>
              <div className="flex justify-between items-center">
                <Label>Milestones</Label>
                <Button type="button" variant="outline" size="sm" onClick={addMilestone}>Add Milestone</Button>
              </div>
              <div className="space-y-2 mt-2">
                {(currentGoal?.milestones || []).map((milestone, index) => (
                  <div key={index} className="flex items-center gap-2">
                    <Checkbox 
                      checked={milestone.completed} 
                      onCheckedChange={(checked) => handleMilestoneToggle(currentGoal, index)}
                    />
                    <Input 
                      value={milestone.title} 
                      onChange={(e) => updateMilestone(index, e.target.value)}
                      placeholder="Milestone title"
                    />
                    <Button type="button" variant="ghost" size="sm" onClick={() => removeMilestone(index)}>
                      <Trash2 className="w-4 h-4 text-red-500"/>
                    </Button>
                  </div>
                ))}
              </div>
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