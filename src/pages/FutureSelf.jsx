import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Button } from '../components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Textarea } from '../components/ui/textarea';
import { Plus, Lock, Unlock, Mail, Calendar } from 'lucide-react';
import { format, parseISO, isPast } from 'date-fns';

export default function FutureSelf() {
  const { state, dispatch } = useApp();
  const [isWriting, setIsWriting] = useState(false);
  const [newLetter, setNewLetter] = useState({ title: '', content: '', unlock_date: '' });

  const letters = state.futureLetters;

  const handleSave = () => {
    dispatch({ type: 'ADD_FUTURE_LETTER', payload: { ...newLetter, user_id: state.user.id } });
    setIsWriting(false);
    setNewLetter({ title: '', content: '', unlock_date: '' });
  };

  const lockedLetters = letters.filter(l => !isPast(parseISO(l.unlock_date)));
  const unlockedLetters = letters.filter(l => isPast(parseISO(l.unlock_date)));

  if (isWriting) {
    return (
      <div className="max-w-4xl mx-auto space-y-6">
        <h1 className="text-3xl font-bold">Write to Your Future Self</h1>
        <Card>
          <CardContent className="p-6 space-y-4">
            <div><Label>Title</Label><Input value={newLetter.title} onChange={e => setNewLetter({...newLetter, title: e.target.value})} placeholder="A message of hope" /></div>
            <div><Label>Your Letter</Label><Textarea value={newLetter.content} onChange={e => setNewLetter({...newLetter, content: e.target.value})} rows={10} placeholder="Dear Future Me..."/></div>
            <div><Label>Unlock Date</Label><Input type="date" value={newLetter.unlock_date} onChange={e => setNewLetter({...newLetter, unlock_date: e.target.value})} /></div>
            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={() => setIsWriting(false)}>Cancel</Button>
              <Button onClick={handleSave}>Lock Letter</Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <div><h1 className="text-3xl font-bold">Letters to My Future Self</h1></div>
        <Button onClick={() => setIsWriting(true)}><Plus className="w-4 h-4 mr-2" />Write a New Letter</Button>
      </div>
      
      <div>
        <h2 className="text-2xl font-semibold mb-4 flex items-center gap-2"><Lock className="text-gray-500"/>Locked Letters</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {lockedLetters.map(l => (
            <Card key={l.id} className="bg-gray-100">
              <CardHeader><CardTitle className="truncate">{l.title}</CardTitle></CardHeader>
              <CardContent className="text-center py-8">
                <Lock className="w-16 h-16 text-gray-400 mx-auto"/>
                <p className="mt-4 text-gray-600">Unlocks on {format(parseISO(l.unlock_date), 'MMMM d, yyyy')}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
      
       <div>
        <h2 className="text-2xl font-semibold mb-4 flex items-center gap-2"><Unlock className="text-green-500"/>Unlocked Letters</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {unlockedLetters.map(l => (
            <Card key={l.id} className="cursor-pointer hover:shadow-lg">
              <CardHeader><CardTitle className="truncate">{l.title}</CardTitle></CardHeader>
              <CardContent>
                <p className="text-gray-600 text-sm italic truncate">{l.content}</p>
                 <p className="mt-4 text-xs text-gray-500">Unlocked on {format(parseISO(l.unlock_date), 'MMMM d, yyyy')}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}