import React from 'react';
import { motion } from 'framer-motion';
import { Scale, Target, TrendingUp, Plus, Calendar, Flame } from 'lucide-react';
import { UserProfile, WeightEntry } from '../types';
import { calculateTDEE, calculateWeeklyProgress, calculateStreak, convertWeight } from '../utils/calculations';

interface DashboardProps {
  profile: UserProfile;
  weightEntries: WeightEntry[];
  onLogWeight: () => void;
}

const Dashboard: React.FC<DashboardProps> = ({ profile, weightEntries, onLogWeight }) => {
  const dailyCalories = Math.round(calculateTDEE(profile));
  const progress = calculateWeeklyProgress(profile, weightEntries);
  const streak = calculateStreak(weightEntries);

  const latestWeight = weightEntries.length > 0 
    ? weightEntries.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())[0].weight
    : profile.currentWeight;

  const weightToDisplay = profile.unitSystem === 'imperial' 
    ? convertWeight(latestWeight, 'kg', 'lbs')
    : latestWeight;

  const targetWeightToDisplay = profile.unitSystem === 'imperial'
    ? convertWeight(profile.targetWeight, 'kg', 'lbs')
    : profile.targetWeight;

  const weightUnit = profile.unitSystem === 'metric' ? 'kg' : 'lbs';

  const motivationalMessages = [
    "Every step counts! 🌟",
    "Progress, not perfection! 💪",
    "You're stronger than you think! 🔥",
    "Small changes, big results! ✨",
    "Keep pushing forward! 🚀",
    "Your future self will thank you! 🙏",
  ];

  const randomMessage = motivationalMessages[Math.floor(Math.random() * motivationalMessages.length)];

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 to-success-50 p-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Welcome back! 👋
          </h1>
          <p className="text-gray-600">{randomMessage}</p>
        </motion.div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {/* Current Weight */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.1 }}
            className="bg-white rounded-2xl p-6 shadow-lg"
          >
            <div className="flex items-center justify-between mb-4">
              <Scale className="w-8 h-8 text-primary-600" />
              <span className="text-sm text-gray-500">Current</span>
            </div>
            <div className="text-3xl font-bold text-gray-900 mb-1">
              {weightToDisplay.toFixed(1)}
            </div>
            <div className="text-sm text-gray-500">{weightUnit}</div>
          </motion.div>

          {/* Target Weight */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2 }}
            className="bg-white rounded-2xl p-6 shadow-lg"
          >
            <div className="flex items-center justify-between mb-4">
              <Target className="w-8 h-8 text-success-600" />
              <span className="text-sm text-gray-500">Target</span>
            </div>
            <div className="text-3xl font-bold text-gray-900 mb-1">
              {targetWeightToDisplay.toFixed(1)}
            </div>
            <div className="text-sm text-gray-500">{weightUnit}</div>
          </motion.div>

          {/* Daily Calories */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.3 }}
            className="bg-white rounded-2xl p-6 shadow-lg"
          >
            <div className="flex items-center justify-between mb-4">
              <Flame className="w-8 h-8 text-orange-600" />
              <span className="text-sm text-gray-500">Daily</span>
            </div>
            <div className="text-3xl font-bold text-gray-900 mb-1">
              {dailyCalories.toLocaleString()}
            </div>
            <div className="text-sm text-gray-500">calories</div>
          </motion.div>

          {/* Streak */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.4 }}
            className="bg-white rounded-2xl p-6 shadow-lg"
          >
            <div className="flex items-center justify-between mb-4">
              <Calendar className="w-8 h-8 text-purple-600" />
              <span className="text-sm text-gray-500">Streak</span>
            </div>
            <div className="text-3xl font-bold text-gray-900 mb-1">
              {streak}
            </div>
            <div className="text-sm text-gray-500">days</div>
          </motion.div>
        </div>

        {/* Progress Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="bg-white rounded-2xl p-6 shadow-lg mb-8"
        >
          <div className="flex items-center mb-6">
            <TrendingUp className="w-6 h-6 text-primary-600 mr-3" />
            <h2 className="text-xl font-semibold text-gray-900">Your Progress</h2>
          </div>

          {/* Progress Bar */}
          <div className="mb-6">
            <div className="flex justify-between text-sm text-gray-600 mb-2">
              <span>Progress to goal</span>
              <span>{progress.progress.toFixed(1)}%</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-3">
              <motion.div
                className="bg-gradient-to-r from-primary-500 to-success-500 h-3 rounded-full"
                initial={{ width: 0 }}
                animate={{ width: `${Math.min(progress.progress, 100)}%` }}
                transition={{ duration: 1, delay: 0.7 }}
              />
            </div>
          </div>

          {/* Progress Message */}
          <div className={`p-4 rounded-lg ${
            progress.onTrack ? 'bg-success-50 text-success-700' : 'bg-orange-50 text-orange-700'
          }`}>
            <p className="font-medium">{progress.message}</p>
          </div>
        </motion.div>

        {/* Action Button */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="text-center"
        >
          <button
            onClick={onLogWeight}
            className="inline-flex items-center px-8 py-4 bg-primary-600 hover:bg-primary-700 text-white font-semibold rounded-xl shadow-lg transition-colors duration-200"
          >
            <Plus className="w-5 h-5 mr-2" />
            Log Today's Weight
          </button>
        </motion.div>
      </div>
    </div>
  );
};

export default Dashboard;
