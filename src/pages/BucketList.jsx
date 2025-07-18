import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Button } from '../components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Textarea } from '../components/ui/textarea';
import { Checkbox } from '../components/ui/checkbox';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '../components/ui/dialog';
import { Plus, Edit, Trash2, Calendar, List, Camera } from 'lucide-react';
import { format, parseISO } from 'date-fns';

export default function BucketList() {
  const { state, dispatch } = useApp();
  const [showDialog, setShowDialog] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [currentItem, setCurrentItem] = useState(null);

  const items = state.bucketListItems;

  const openNewDialog = () => {
    setIsEditing(false);
    setCurrentItem({});
    setShowDialog(true);
  };
  
  const openEditDialog = (item) => {
    setIsEditing(true);
    setCurrentItem(item);
    setShowDialog(true);
  };

  const handleSave = () => {
    if (isEditing) {
      dispatch({ type: 'UPDATE_BUCKET_LIST_ITEM', payload: { id: currentItem.id, updates: currentItem } });
    } else {
      dispatch({ type: 'ADD_BUCKET_LIST_ITEM', payload: { ...currentItem, user_id: state.user.id } });
    }
    setShowDialog(false);
  };
  
  const handleDelete = (id) => {
    dispatch({ type: 'DELETE_BUCKET_LIST_ITEM', payload: id });
  };
  
  const toggleComplete = (item) => {
    dispatch({ type: 'UPDATE_BUCKET_LIST_ITEM', payload: { id: item.id, updates: { completed: !item.completed } } });
  };

  const completedItems = items.filter(i => i.completed);
  const incompleteItems = items.filter(i => !i.completed);

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Bucket List</h1>
          <p className="text-gray-600 mt-1">Dream big. Live fully. Track your life goals.</p>
        </div>
        <Button onClick={openNewDialog}><Plus className="w-4 h-4 mr-2" />Add Item</Button>
      </div>
      
      <div>
        <h2 className="text-2xl font-semibold mb-4">To-Do ({incompleteItems.length})</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {incompleteItems.map(item => (
            <Card key={item.id} className="flex flex-col">
              {item.photo_url && <img src={item.photo_url} alt={item.title} className="w-full h-48 object-cover rounded-t-lg"/>}
              <CardHeader>
                <div className="flex items-start gap-4">
                  <Checkbox className="mt-1" checked={item.completed} onCheckedChange={() => toggleComplete(item)}/>
                  <CardTitle>{item.title}</CardTitle>
                </div>
              </CardHeader>
              <CardContent className="flex-grow">
                <p className="text-gray-600 text-sm">{item.description}</p>
              </CardContent>
              <div className="p-4 flex justify-between items-center text-sm text-gray-500">
                {item.target_date && <span className="flex items-center gap-1"><Calendar className="w-4 h-4"/>{format(parseISO(item.target_date), 'MMM yyyy')}</span>}
                <div>
                  <Button variant="ghost" size="icon" onClick={() => openEditDialog(item)}><Edit className="w-4 h-4"/></Button>
                  <Button variant="ghost" size="icon" onClick={() => handleDelete(item.id)}><Trash2 className="w-4 h-4 text-red-500"/></Button>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </div>
      
      <div>
        <h2 className="text-2xl font-semibold mb-4">Completed ({completedItems.length})</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
           {completedItems.map(item => (
            <Card key={item.id} className="opacity-70 bg-green-50">
              {item.photo_url && <img src={item.photo_url} alt={item.title} className="w-full h-48 object-cover rounded-t-lg"/>}
              <CardHeader>
                <div className="flex items-start gap-4">
                  <Checkbox className="mt-1" checked={item.completed} onCheckedChange={() => toggleComplete(item)}/>
                  <CardTitle className="line-through">{item.title}</CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 text-sm">{item.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      <Dialog open={showDialog} onOpenChange={setShowDialog}>
        <DialogContent>
          <DialogHeader><DialogTitle>{isEditing ? 'Edit' : 'Add'} Bucket List Item</DialogTitle></DialogHeader>
          <div className="space-y-4">
            <div>
              <Label>Title</Label>
              <Input value={currentItem?.title || ''} onChange={(e) => setCurrentItem({...currentItem, title: e.target.value})} />
            </div>
            <div>
              <Label>Description</Label>
              <Textarea value={currentItem?.description || ''} onChange={(e) => setCurrentItem({...currentItem, description: e.target.value})} />
            </div>
            <div>
              <Label>Target Date</Label>
              <Input type="date" value={currentItem?.target_date || ''} onChange={(e) => setCurrentItem({...currentItem, target_date: e.target.value})} />
            </div>
            <div>
              <Label>Photo URL</Label>
              <Input value={currentItem?.photo_url || ''} onChange={(e) => setCurrentItem({...currentItem, photo_url: e.target.value})} placeholder="https://example.com/photo.jpg" />
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