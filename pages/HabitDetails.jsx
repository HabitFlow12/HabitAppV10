import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { Habit } from "@/entities/Habit";
import { UserHabit } from "@/entities/UserHabit";
import { User } from "@/entities/User";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  ArrowLeft, 
  Target, 
  Lightbulb, 
  Star, 
  CheckCircle,
  ArrowRight,
  Clock,
  BookOpen,
  Zap
} from "lucide-react";
import { motion } from "framer-motion";

export default function HabitDetail() {
  const navigate = useNavigate();
  const [habit, setHabit] = useState(null);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const urlParams = new URLSearchParams(window.location.search);
  const habitId = urlParams.get("id");

  useEffect(() => {
    loadHabitDetail();
  }, [habitId]);

  const loadHabitDetail = async () => {
    try {
      const [habitData, userData] = await Promise.all([
        Habit.list().then(habits => habits.find(h => h.id === habitId)),
        User.me()
      ]);
      
      setHabit(habitData);
      setUser(userData);
    } catch (error) {
      console.error("Error loading habit detail:", error);
    }
    setLoading(false);
  };

  const handleStartHabit = () => {
    navigate(createPageUrl(`HabitForm?habitId=${habitId}`));
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!habit) {
    return (
      <div className="text-center py-12">
        <Target className="w-16 h-16 text-gray-400 mx-auto mb-4" />
        <h3 className="text-xl font-semibold text-gray-900 mb-2">Habit not found</h3>
        <Button onClick={() => navigate(createPageUrl("Home"))}>
          Go back home
        </Button>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Button
          variant="outline"
          size="icon"
          onClick={() => navigate(-1)}
        >
          <ArrowLeft className="w-4 h-4" />
        </Button>
        <div>
          <div className="flex items-center gap-3 mb-2">
            <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${
              habit.type === "build" 
                ? "bg-gradient-to-r from-green-500 to-emerald-500" 
                : "bg-gradient-to-r from-red-500 to-pink-500"
            }`}>
              <Target className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">{habit.title}</h1>
              <Badge variant="secondary" className="mt-1">
                {habit.category}
              </Badge>
            </div>
          </div>
          <p className="text-gray-600 text-lg">{habit.description}</p>
        </div>
      </div>

      {/* Main Content */}
      <div className="grid lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          {/* Techniques */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Lightbulb className="w-5 h-5 text-yellow-500" />
                  Science-Backed Techniques
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {habit.techniques?.map((technique, index) => (
                  <div key={index} className="p-4 bg-gray-50 rounded-lg">
                    <h4 className="font-semibold text-gray-900 mb-2">{technique.name}</h4>
                    <p className="text-gray-700 mb-3">{technique.description}</p>
                    <div className="flex items-start gap-2">
                      <BookOpen className="w-4 h-4 text-blue-500 mt-1 flex-shrink-0" />
                      <p className="text-sm text-blue-700 italic">{technique.scientific_backing}</p>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          </motion.div>

          {/* Benefits */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Star className="w-5 h-5 text-amber-500" />
                  Key Benefits
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-2 gap-3">
                  {habit.benefits?.map((benefit, index) => (
                    <div key={index} className="flex items-center gap-3 p-3 bg-green-50 rounded-lg">
                      <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0" />
                      <span className="text-gray-700">{benefit}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Start Habit Card */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
          >
            <Card className="bg-gradient-to-br from-blue-50 to-purple-50 border-blue-200">
              <CardHeader>
                <CardTitle className="text-center">
                  Ready to {habit.type === "build" ? "Build" : "Break"} This Habit?
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="text-center space-y-2">
                  <div className="w-16 h-16 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full flex items-center justify-center mx-auto">
                    <Zap className="w-8 h-8 text-white" />
                  </div>
                  <p className="text-gray-600">
                    Let's customize this habit to fit your lifestyle
                  </p>
                </div>
                <Button 
                  onClick={handleStartHabit}
                  className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 h-12 text-lg font-semibold"
                >
                  Start Habit
                  <ArrowRight className="w-5 h-5 ml-2" />
                </Button>
              </CardContent>
            </Card>
          </motion.div>

          {/* Quick Stats */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4 }}
          >
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Habit Overview</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">Category</span>
                  <Badge variant="secondary">{habit.category}</Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">Type</span>
                  <Badge variant={habit.type === "build" ? "default" : "destructive"}>
                    {habit.type === "build" ? "Build" : "Break"}
                  </Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">Techniques</span>
                  <span className="font-semibold">{habit.techniques?.length || 0}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">Benefits</span>
                  <span className="font-semibold">{habit.benefits?.length || 0}</span>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Success Tips */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.5 }}
          >
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-lg">
                  <Clock className="w-5 h-5 text-green-500" />
                  Success Tips
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="space-y-2">
                  <p className="text-sm text-gray-700">
                    <strong>Start Small:</strong> Begin with just 5-10 minutes daily
                  </p>
                  <p className="text-sm text-gray-700">
                    <strong>Be Consistent:</strong> Daily practice is more important than duration
                  </p>
                  <p className="text-sm text-gray-700">
                    <strong>Track Progress:</strong> Use our built-in tracking features
                  </p>
                  <p className="text-sm text-gray-700">
                    <strong>Be Patient:</strong> Habits typically take 21-66 days to form
                  </p>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
