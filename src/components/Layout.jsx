import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { createPageUrl } from "../utils";
import { useApp } from "../context/AppContext";
import { 
  Home, 
  Target, 
  BarChart3, 
  Settings, 
  Calendar,
  CheckSquare,
  BookOpen,
  Apple,
  DollarSign,
  GraduationCap,
  TrendingUp,
  Star,
  Mail,
  Sun,
  List,
  Lock,
  LogOut,
  User as UserIcon,
  Menu,
  X
} from "lucide-react";
import { Button } from "./ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";
import { motion, AnimatePresence } from "framer-motion";

const navigationItems = [
  { title: "Home", url: createPageUrl("Home"), icon: Home },
  { title: "My Habits", url: createPageUrl("Habits"), icon: Target },
  { title: "Progress", url: createPageUrl("Progress"), icon: BarChart3 },
  { title: "Features", url: createPageUrl("Features"), icon: Settings },
];

const featureItems = [
  { title: "To-Do List", url: createPageUrl("TodoList"), icon: CheckSquare },
  { title: "Calendar", url: createPageUrl("Calendar"), icon: Calendar },
  { title: "Journal", url: createPageUrl("Journal"), icon: BookOpen },
  { title: "Food Tracker", url: createPageUrl("FoodTracker"), icon: Apple },
  { title: "Finance", url: createPageUrl("Finance"), icon: DollarSign },
  { title: "School", url: createPageUrl("School"), icon: GraduationCap },
  { title: "Life Stats", url: createPageUrl("LifeStats"), icon: TrendingUp },
  { title: "Goals", url: createPageUrl("Goals"), icon: Star },
  { title: "Future Self", url: createPageUrl("FutureSelf"), icon: Mail },
  { title: "Unpack Day", url: createPageUrl("UnpackDay"), icon: Sun },
  { title: "Bucket List", url: createPageUrl("BucketList"), icon: List },
  { title: "Password Vault", url: createPageUrl("PasswordVault"), icon: Lock },
];

export default function Layout({ children }) {
  const { state } = useApp();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const location = useLocation();
  const user = state.user;

  const handleLogout = () => {
    // In a real app, this would handle logout
    console.log("Logout clicked");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      <style>{`
        :root {
          --primary: 59 130 246;
          --secondary: 147 51 234;
          --accent: 16 185 129;
          --background: 248 250 252;
          --card: 255 255 255;
          --text: 15 23 42;
          --text-muted: 100 116 139;
          --border: 226 232 240;
        }
        
        .glass-effect {
          backdrop-filter: blur(20px);
          background: rgba(255, 255, 255, 0.85);
          border: 1px solid rgba(255, 255, 255, 0.2);
        }
        
        .gradient-text {
          background: linear-gradient(135deg, rgb(59, 130, 246), rgb(147, 51, 234));
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }
      `}</style>

      {/* Mobile Header */}
      <div className="lg:hidden bg-white/80 backdrop-blur-md border-b border-gray-200 sticky top-0 z-50">
        <div className="flex items-center justify-between px-4 py-3">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
              <Target className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl font-bold gradient-text">HabitAppV9</span>
          </div>
          <div className="flex items-center gap-3">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="relative">
                  <Avatar className="h-8 w-8">
                    <AvatarImage src={user.profile_picture} />
                    <AvatarFallback className="bg-gradient-to-r from-blue-600 to-purple-600 text-white">
                      {user.full_name?.[0] || user.email?.[0]}
                    </AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-64">
                <div className="px-4 py-3 border-b">
                  <p className="font-semibold">{user.full_name || "User"}</p>
                  <p className="text-sm text-gray-500">{user.email}</p>
                </div>
                <DropdownMenuItem onClick={handleLogout}>
                  <LogOut className="w-4 h-4 mr-2" />
                  Sign Out
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </Button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="lg:hidden fixed inset-x-0 top-16 z-40 bg-white/95 backdrop-blur-md border-b border-gray-200 shadow-lg"
          >
            <div className="px-4 py-6 space-y-4">
              {navigationItems.map((item) => (
                <Link
                  key={item.title}
                  to={item.url}
                  onClick={() => setMobileMenuOpen(false)}
                  className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${
                    location.pathname === item.url
                      ? "bg-gradient-to-r from-blue-600 to-purple-600 text-white"
                      : "hover:bg-gray-100"
                  }`}
                >
                  <item.icon className="w-5 h-5" />
                  <span className="font-medium">{item.title}</span>
                </Link>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="flex">
        {/* Desktop Sidebar */}
        <div className="hidden lg:flex w-80 flex-col fixed inset-y-0 z-50">
          <div className="flex-1 flex flex-col min-h-0 glass-effect">
            <div className="flex items-center gap-3 p-6 border-b border-gray-200">
              <div className="w-10 h-10 bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl flex items-center justify-center">
                <Target className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold gradient-text">HabitAppV9</h1>
                <p className="text-sm text-gray-500">Build better habits</p>
              </div>
            </div>
            
            <nav className="flex-1 px-4 py-6 space-y-2">
              {navigationItems.map((item) => (
                <Link
                  key={item.title}
                  to={item.url}
                  className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${
                    location.pathname === item.url
                      ? "bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg"
                      : "hover:bg-gray-100 text-gray-700"
                  }`}
                >
                  <item.icon className="w-5 h-5" />
                  <span className="font-medium">{item.title}</span>
                </Link>
              ))}
              
              <div className="pt-6">
                <p className="text-sm font-semibold text-gray-500 uppercase tracking-wide px-4 mb-3">
                  Features
                </p>
                <div className="space-y-1">
                  {featureItems.map((item) => (
                    <Link
                      key={item.title}
                      to={item.url}
                      className={`flex items-center gap-3 px-4 py-2 rounded-lg transition-all text-sm ${
                        location.pathname === item.url
                          ? "bg-gradient-to-r from-blue-600 to-purple-600 text-white"
                          : "hover:bg-gray-100 text-gray-600"
                      }`}
                    >
                      <item.icon className="w-4 h-4" />
                      <span>{item.title}</span>
                    </Link>
                  ))}
                </div>
              </div>
            </nav>
            
            <div className="p-4 border-t border-gray-200">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="w-full justify-start p-3">
                    <Avatar className="h-8 w-8 mr-3">
                      <AvatarImage src={user.profile_picture} />
                      <AvatarFallback className="bg-gradient-to-r from-blue-600 to-purple-600 text-white">
                        {user.full_name?.[0] || user.email?.[0]}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1 text-left">
                      <p className="font-semibold">{user.full_name || "User"}</p>
                      <p className="text-sm text-gray-500">{user.email}</p>
                    </div>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-64">
                  <DropdownMenuItem onClick={handleLogout}>
                    <LogOut className="w-4 h-4 mr-2" />
                    Sign Out
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="lg:ml-80 flex-1 min-h-screen">
          <div className="p-4 lg:p-8">
            {children}
          </div>
        </div>
      </div>
    </div>
  );
}