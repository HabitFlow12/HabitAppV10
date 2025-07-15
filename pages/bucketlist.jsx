import React, { useState, useEffect } from 'react';
import { BucketListItem } from '@/entities/BucketListItem';
import { User } from '@/entities/User';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Plus, Edit, Trash2, Calendar, List, Camera } from 'lucide-react';
import { format, parseISO } from 'date-fns';

export default function BucketList() {
  const [items, setItems] = useState([]);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showDialog, setShowDialog] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [currentItem, setCurrentItem] = useState(null);

  useEffect(() => {
    const loadData = async () => {
      try {
        const userData = await User.me();
        setUser(userData);
        const itemData = await BucketListItem.filter({ user_id: userData.id });
        setItems(itemData);
      } catch (error) {
        console.error("Error loading bucket list:", error);
      }
      setLoading(false);
    };
    loadData();
  }, []);

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

  const handleSave = async () => {
    if (isEditing) {
      await BucketListItem.update(currentItem.id, currentItem);
    } else {
      await BucketListItem.create({ ...currentItem, user_id: user.id });
    }
    const itemData = await BucketListItem.filter({ user_id: user.id });
    setItems(itemData);
    setShowDialog(false);
  };
  
  const handleDelete = async (id) => {
    await BucketListItem.delete(id);
    setItems(items.filter(item => item.id !== id));
  };
  
  const toggleComplete = async (item) => {
    await BucketListItem.update(item.id, { completed: !item.completed });
    setItems(items.map(i => i.id === item.id ? { ...i, completed: !i.completed } : i));
  };

  if (loading) return <div>Loading...</div>;

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
  
