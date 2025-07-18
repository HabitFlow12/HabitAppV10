import React from 'react';
import { useApp } from '../context/AppContext';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '../components/ui/avatar';
import { Progress } from '../components/ui/progress';
import { Award, Target, CheckSquare, BookOpen, Star, Sparkles, Trophy } from 'lucide-react';
import { format } from 'date-fns';

const levelThresholds = Array.from({ length: 50 }, (_, i) => (i + 1) * 100 * (1 + i * 0.1));

export default function LifeStats() {
  const { state } = useApp();
  const user = state.user;

  const stats = {
    habitsCompleted: state.userHabits.reduce((sum, h) => sum + (h.total_completions || 0), 0),
    longestStreak: Math.max(0, ...state.userHabits.map(h => h.streak_longest || 0)),
    tasksCompleted: state.todos.filter(t => t.completed).length,
    goalsCompleted: state.goals.filter(g => g.status === 'completed').length,
    journalEntries: state.journalEntries.length,
  };

  const currentLevelXP = user.level > 1 ? levelThresholds[user.level - 2] : 0;
  const nextLevelXP = levelThresholds[user.level - 1];
  const xpForLevel = nextLevelXP - currentLevelXP;
  const xpInCurrentLevel = user.xp - currentLevelXP;
  const levelProgress = (xpInCurrentLevel / xpForLevel) * 100;

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      <Card className="bg-gradient-to-br from-blue-600 to-purple-600 text-white">
        <CardContent className="p-6 flex items-center gap-6">
          <Avatar className="h-24 w-24 border-4 border-white">
            <AvatarImage src={user.profile_picture} />
            <AvatarFallback className="text-3xl bg-white text-purple-600">{user.full_name?.[0] || 'U'}</AvatarFallback>
          </Avatar>
          <div>
            <h1 className="text-3xl font-bold">{user.full_name}</h1>
            <p className="text-blue-200">Member since {format(new Date(user.created_date), 'MMMM yyyy')}</p>
            <div className="mt-4 w-full">
              <div className="flex justify-between items-center mb-1">
                <p className="font-bold">Level {user.level}</p>
                <p className="text-sm">{user.xp} / {nextLevelXP} XP</p>
              </div>
              <Progress value={levelProgress} className="h-3 [&>*]:bg-yellow-400" />
            </div>
          </div>
        </CardContent>
      </Card>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
        <StatCard icon={Target} title="Habits Completed" value={stats.habitsCompleted} />
        <StatCard icon={Trophy} title="Longest Streak" value={`${stats.longestStreak} days`} />
        <StatCard icon={CheckSquare} title="Tasks Done" value={stats.tasksCompleted} />
        <StatCard icon={Star} title="Goals Achieved" value={stats.goalsCompleted} />
        <StatCard icon={BookOpen} title="Journal Entries" value={stats.journalEntries} />
      </div>

      <Card>
        <CardHeader><CardTitle>My Achievements</CardTitle></CardHeader>
        <CardContent>
          <div className="text-center text-gray-500">
            <Award className="w-16 h-16 mx-auto mb-4 text-gray-400" />
            <p>No achievements earned yet. Keep going!</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

const StatCard = ({ icon: Icon, title, value }) => (
  <Card>
    <CardContent className="p-6 text-center">
      <Icon className="w-10 h-10 mx-auto text-blue-500 mb-2"/>
      <p className="text-2xl font-bold">{value}</p>
      <p className="text-sm text-gray-500">{title}</p>
    </CardContent>
  </Card>
);