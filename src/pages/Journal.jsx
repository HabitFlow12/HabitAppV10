import React, { useState } from "react";
import { useApp } from "../context/AppContext";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";
import { Badge } from "../components/ui/badge";
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
  BookOpen, 
  Plus, 
  Edit, 
  Trash2, 
  Search,
  Calendar,
  Tag,
  Smile,
  Frown,
  Meh,
  Angry,
  Heart
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { format } from "date-fns";

const moodOptions = [
  { value: "very_happy", label: "Very Happy", emoji: "😄", color: "bg-green-100 text-green-800" },
  { value: "happy", label: "Happy", emoji: "😊", color: "bg-blue-100 text-blue-800" },
  { value: "neutral", label: "Neutral", emoji: "😐", color: "bg-gray-100 text-gray-800" },
  { value: "sad", label: "Sad", emoji: "😢", color: "bg-orange-100 text-orange-800" },
  { value: "very_sad", label: "Very Sad", emoji: "😞", color: "bg-red-100 text-red-800" }
];

export default function Journal() {
  const { state, dispatch } = useApp();
  const [showDialog, setShowDialog] = useState(false);
  const [editingEntry, setEditingEntry] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedDate, setSelectedDate] = useState("");
  const [newEntry, setNewEntry] = useState({
    title: "",
    content: "",
    date: format(new Date(), "yyyy-MM-dd"),
    mood: "neutral",
    tags: []
  });
  const [newTag, setNewTag] = useState("");

  const entries = state.journalEntries;

  const handleCreateEntry = () => {
    dispatch({ type: 'ADD_JOURNAL_ENTRY', payload: newEntry });
    setNewEntry({
      title: "",
      content: "",
      date: format(new Date(), "yyyy-MM-dd"),
      mood: "neutral",
      tags: []
    });
    setShowDialog(false);
  };

  const handleUpdateEntry = () => {
    dispatch({ type: 'UPDATE_JOURNAL_ENTRY', payload: { id: editingEntry.id, updates: editingEntry } });
    setEditingEntry(null);
    setShowDialog(false);
  };

  const handleDeleteEntry = (id) => {
    dispatch({ type: 'DELETE_JOURNAL_ENTRY', payload: id });
  };

  const addTag = () => {
    if (newTag.trim()) {
      const currentEntry = editingEntry || newEntry;
      const tags = [...(currentEntry.tags || []), newTag.trim()];
      
      if (editingEntry) {
        setEditingEntry({ ...editingEntry, tags });
      } else {
        setNewEntry({ ...newEntry, tags });
      }
      setNewTag("");
    }
  };

  const removeTag = (tagToRemove) => {
    const currentEntry = editingEntry || newEntry;
    const tags = (currentEntry.tags || []).filter(tag => tag !== tagToRemove);
    
    if (editingEntry) {
      setEditingEntry({ ...editingEntry, tags });
    } else {
      setNewEntry({ ...newEntry, tags });
    }
  };

  const filteredEntries = entries.filter(entry => {
    const matchesSearch = !searchTerm || 
      entry.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      entry.content.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (entry.tags || []).some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()));
    
    const matchesDate = !selectedDate || entry.date === selectedDate;
    
    return matchesSearch && matchesDate;
  });

  const getMoodOption = (mood) => {
    return moodOptions.find(option => option.value === mood) || moodOptions[2];
  };

  const stats = {
    total: entries.length,
    thisMonth: entries.filter(e => {
      const entryDate = new Date(e.date);
      const now = new Date();
      return entryDate.getMonth() === now.getMonth() && entryDate.getFullYear() === now.getFullYear();
    }).length,
    streak: calculateStreak(entries),
    averageMood: calculateAverageMood(entries)
  };

  function calculateStreak(entries) {
    if (entries.length === 0) return 0;
    
    let streak = 0;
    const today = new Date();
    let currentDate = new Date(today);
    
    for (let i = 0; i < 30; i++) {
      const dateString = format(currentDate, "yyyy-MM-dd");
      const hasEntry = entries.some(entry => entry.date === dateString);
      
      if (hasEntry) {
        streak++;
      } else if (streak > 0) {
        break;
      }
      
      currentDate.setDate(currentDate.getDate() - 1);
    }
    
    return streak;
  }

  function calculateAverageMood(entries) {
    if (entries.length === 0) return "neutral";
    
    const moodValues = entries.map(entry => {
      const index = moodOptions.findIndex(option => option.value === entry.mood);
      return index !== -1 ? index : 2; // default to neutral
    });
    
    const average = moodValues.reduce((sum, value) => sum + value, 0) / moodValues.length;
    return moodOptions[Math.round(average)]?.value || "neutral";
  }

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Personal Journal</h1>
          <p className="text-gray-600 mt-1">
            Reflect on your thoughts and experiences
          </p>
        </div>
        <Dialog open={showDialog} onOpenChange={setShowDialog}>
          <DialogTrigger asChild>
            <Button 
              onClick={() => {
                setEditingEntry(null);
                setNewEntry({
                  title: "",
                  content: "",
                  date: format(new Date(), "yyyy-MM-dd"),
                  mood: "neutral",
                  tags: []
                });
              }}
              className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
            >
              <Plus className="w-4 h-4 mr-2" />
              Write Entry
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>
                {editingEntry ? "Edit Journal Entry" : "New Journal Entry"}
              </DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label htmlFor="title">Title *</Label>
                <Input
                  id="title"
                  value={editingEntry ? editingEntry.title : newEntry.title}
                  onChange={(e) => {
                    if (editingEntry) {
                      setEditingEntry({ ...editingEntry, title: e.target.value });
                    } else {
                      setNewEntry({ ...newEntry, title: e.target.value });
                    }
                  }}
                  placeholder="What's on your mind?"
                />
              </div>

              <div>
                <Label htmlFor="date">Date</Label>
                <Input
                  id="date"
                  type="date"
                  value={editingEntry ? editingEntry.date : newEntry.date}
                  onChange={(e) => {
                    if (editingEntry) {
                      setEditingEntry({ ...editingEntry, date: e.target.value });
                    } else {
                      setNewEntry({ ...newEntry, date: e.target.value });
                    }
                  }}
                />
              </div>

              <div>
                <Label htmlFor="mood">How are you feeling?</Label>
                <div className="grid grid-cols-5 gap-2 mt-2">
                  {moodOptions.map((mood) => (
                    <Button
                      key={mood.value}
                      variant="outline"
                      className={`p-3 h-auto flex-col gap-1 ${
                        (editingEntry ? editingEntry.mood : newEntry.mood) === mood.value
                          ? "border-purple-500 bg-purple-50"
                          : ""
                      }`}
                      onClick={() => {
                        if (editingEntry) {
                          setEditingEntry({ ...editingEntry, mood: mood.value });
                        } else {
                          setNewEntry({ ...newEntry, mood: mood.value });
                        }
                      }}
                    >
                      <span className="text-2xl">{mood.emoji}</span>
                      <span className="text-xs">{mood.label}</span>
                    </Button>
                  ))}
                </div>
              </div>

              <div>
                <Label htmlFor="content">Content *</Label>
                <Textarea
                  id="content"
                  value={editingEntry ? editingEntry.content : newEntry.content}
                  onChange={(e) => {
                    if (editingEntry) {
                      setEditingEntry({ ...editingEntry, content: e.target.value });
                    } else {
                      setNewEntry({ ...newEntry, content: e.target.value });
                    }
                  }}
                  placeholder="Write your thoughts here..."
                  rows={8}
                  className="resize-none"
                />
              </div>

              <div>
                <Label>Tags</Label>
                <div className="flex gap-2 mt-2">
                  <Input
                    value={newTag}
                    onChange={(e) => setNewTag(e.target.value)}
                    placeholder="Add a tag"
                    onKeyPress={(e) => e.key === 'Enter' && addTag()}
                  />
                  <Button type="button" onClick={addTag} variant="outline">
                    Add
                  </Button>
                </div>
                <div className="flex flex-wrap gap-2 mt-2">
                  {((editingEntry ? editingEntry.tags : newEntry.tags) || []).map((tag, index) => (
                    <Badge
                      key={index}
                      variant="secondary"
                      className="cursor-pointer"
                      onClick={() => removeTag(tag)}
                    >
                      {tag} ×
                    </Badge>
                  ))}
                </div>
              </div>

              <div className="flex justify-end gap-3 pt-4">
                <Button
                  variant="outline"
                  onClick={() => setShowDialog(false)}
                >
                  Cancel
                </Button>
                <Button
                  onClick={editingEntry ? handleUpdateEntry : handleCreateEntry}
                  disabled={
                    editingEntry 
                      ? !editingEntry.title || !editingEntry.content
                      : !newEntry.title || !newEntry.content
                  }
                >
                  {editingEntry ? "Update" : "Save Entry"}
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
                <p className="text-sm text-gray-600">Total Entries</p>
                <p className="text-2xl font-bold text-gray-900">{stats.total}</p>
              </div>
              <BookOpen className="w-8 h-8 text-purple-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">This Month</p>
                <p className="text-2xl font-bold text-blue-600">{stats.thisMonth}</p>
              </div>
              <Calendar className="w-8 h-8 text-blue-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Writing Streak</p>
                <p className="text-2xl font-bold text-orange-600">{stats.streak} days</p>
              </div>
              <Heart className="w-8 h-8 text-orange-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Average Mood</p>
                <p className="text-2xl">{getMoodOption(stats.averageMood).emoji}</p>
              </div>
              <Smile className="w-8 h-8 text-green-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Search and Filters */}
      <Card>
        <CardContent className="p-4">
          <div className="flex gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <Input
                placeholder="Search entries..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <Input
              type="date"
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
              className="w-48"
            />
            <Button
              variant="outline"
              onClick={() => {
                setSearchTerm("");
                setSelectedDate("");
              }}
            >
              Clear
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Entries List */}
      <div className="space-y-6">
        <AnimatePresence>
          {filteredEntries.map((entry, index) => {
            const moodOption = getMoodOption(entry.mood);
            return (
              <motion.div
                key={entry.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ delay: index * 0.1 }}
              >
                <Card className="hover:shadow-lg transition-all duration-300">
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div>
                        <CardTitle className="text-xl text-gray-900">
                          {entry.title}
                        </CardTitle>
                        <div className="flex items-center gap-3 mt-2">
                          <Badge variant="outline" className="flex items-center gap-1">
                            <Calendar className="w-3 h-3" />
                            {format(new Date(entry.date), "MMMM d, yyyy")}
                          </Badge>
                          <Badge variant="secondary" className={moodOption.color}>
                            {moodOption.emoji} {moodOption.label}
                          </Badge>
                          {(entry.tags || []).map((tag, tagIndex) => (
                            <Badge key={tagIndex} variant="outline" className="flex items-center gap-1">
                              <Tag className="w-3 h-3" />
                              {tag}
                            </Badge>
                          ))}
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => {
                            setEditingEntry(entry);
                            setShowDialog(true);
                          }}
                        >
                          <Edit className="w-4 h-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleDeleteEntry(entry.id)}
                          className="text-red-600 hover:text-red-700"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-gray-700 whitespace-pre-wrap leading-relaxed">
                      {entry.content}
                    </p>
                  </CardContent>
                </Card>
              </motion.div>
            );
          })}
        </AnimatePresence>
      </div>

      {filteredEntries.length === 0 && (
        <div className="text-center py-12">
          <BookOpen className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-gray-900 mb-2">
            {entries.length === 0 ? "Start Your Journaling Journey" : "No entries found"}
          </h3>
          <p className="text-gray-600 mb-6">
            {entries.length === 0 
              ? "Write your first journal entry to begin capturing your thoughts and experiences."
              : "Try adjusting your search criteria or create a new entry."}
          </p>
        </div>
      )}
    </div>
  );
}