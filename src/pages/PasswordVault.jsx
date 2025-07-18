import React, { useState } from 'react';
import { Button } from '../components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '../components/ui/dialog';
import { Plus, Lock, Eye, EyeOff, Copy, Edit, Trash2 } from 'lucide-react';

export default function PasswordVault() {
  const [passwords, setPasswords] = useState([]);
  const [showDialog, setShowDialog] = useState(false);
  const [showPasswords, setShowPasswords] = useState({});
  const [newPassword, setNewPassword] = useState({ website: '', username: '', password: '', notes: '' });

  const handleSave = () => {
    setPasswords([...passwords, { ...newPassword, id: Date.now().toString() }]);
    setNewPassword({ website: '', username: '', password: '', notes: '' });
    setShowDialog(false);
  };

  const togglePasswordVisibility = (id) => {
    setShowPasswords(prev => ({ ...prev, [id]: !prev[id] }));
  };

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
  };

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Password Vault</h1>
          <p className="text-gray-600 mt-1">Securely store your passwords and login information.</p>
        </div>
        <Dialog open={showDialog} onOpenChange={setShowDialog}>
          <DialogTrigger asChild>
            <Button><Plus className="w-4 h-4 mr-2" />Add Password</Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader><DialogTitle>Add New Password</DialogTitle></DialogHeader>
            <div className="space-y-4">
              <div>
                <Label>Website/Service</Label>
                <Input value={newPassword.website} onChange={(e) => setNewPassword({...newPassword, website: e.target.value})} />
              </div>
              <div>
                <Label>Username/Email</Label>
                <Input value={newPassword.username} onChange={(e) => setNewPassword({...newPassword, username: e.target.value})} />
              </div>
              <div>
                <Label>Password</Label>
                <Input type="password" value={newPassword.password} onChange={(e) => setNewPassword({...newPassword, password: e.target.value})} />
              </div>
              <div>
                <Label>Notes</Label>
                <Input value={newPassword.notes} onChange={(e) => setNewPassword({...newPassword, notes: e.target.value})} />
              </div>
              <div className="flex justify-end gap-2">
                <Button variant="outline" onClick={() => setShowDialog(false)}>Cancel</Button>
                <Button onClick={handleSave}>Save</Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {passwords.length === 0 ? (
        <Card>
          <CardContent className="text-center py-12">
            <Lock className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 mb-2">No passwords stored</h3>
            <p className="text-gray-600">Add your first password to get started.</p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {passwords.map(password => (
            <Card key={password.id}>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Lock className="w-5 h-5" />
                  {password.website}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div>
                  <Label className="text-sm text-gray-600">Username</Label>
                  <div className="flex items-center gap-2">
                    <Input value={password.username} readOnly className="text-sm" />
                    <Button variant="ghost" size="icon" onClick={() => copyToClipboard(password.username)}>
                      <Copy className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
                <div>
                  <Label className="text-sm text-gray-600">Password</Label>
                  <div className="flex items-center gap-2">
                    <Input 
                      type={showPasswords[password.id] ? "text" : "password"} 
                      value={password.password} 
                      readOnly 
                      className="text-sm" 
                    />
                    <Button variant="ghost" size="icon" onClick={() => togglePasswordVisibility(password.id)}>
                      {showPasswords[password.id] ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </Button>
                    <Button variant="ghost" size="icon" onClick={() => copyToClipboard(password.password)}>
                      <Copy className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
                {password.notes && (
                  <div>
                    <Label className="text-sm text-gray-600">Notes</Label>
                    <p className="text-sm text-gray-700">{password.notes}</p>
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}