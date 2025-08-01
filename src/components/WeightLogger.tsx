import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, Scale, Calendar, MessageCircle, TrendingUp, Trash2, X } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { UserProfile, WeightEntry } from '../types';
import { convertWeight, calculateStreak } from '../utils/calculations';

interface WeightLoggerProps {
  profile: UserProfile;
  weightEntries: WeightEntry[];
  onAddEntry: (entry: WeightEntry) => void;
  onDeleteEntry: (entryId: string) => void;
  onBack: () => void;
}

const WeightLogger: React.FC<WeightLoggerProps> = ({ profile, weightEntries, onAddEntry, onDeleteEntry, onBack }) => {
  const [weight, setWeight] = useState('');
  const [notes, setNotes] = useState('');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [deleteModalEntry, setDeleteModalEntry] = useState<WeightEntry | null>(null);

  const weightUnit = profile.unitSystem === 'metric' ? 'kg' : 'lbs';
  const streak = calculateStreak(weightEntries);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!weight) return;

    let weightInKg = parseFloat(weight);
    if (profile.unitSystem === 'imperial') {
      weightInKg = weightInKg / 2.20462; // Convert lbs to kg for storage
    }

    const entry: WeightEntry = {
      id: Date.now().toString(),
      date,
      weight: weightInKg,
      notes: notes.trim() || undefined,
      createdAt: new Date().toISOString(),
    };

    onAddEntry(entry);
    setWeight('');
    setNotes('');
    setDate(new Date().toISOString().split('T')[0]);
  };

  const handleDeleteClick = (entry: WeightEntry) => {
    setDeleteModalEntry(entry);
  };

  const handleConfirmDelete = () => {
    if (deleteModalEntry) {
      onDeleteEntry(deleteModalEntry.id);
      setDeleteModalEntry(null);
    }
  };

  const handleCancelDelete = () => {
    setDeleteModalEntry(null);
  };

  // Prepare chart data
  const chartData = weightEntries
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
    .map(entry => ({
      date: new Date(entry.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
      weight: profile.unitSystem === 'imperial' 
        ? convertWeight(entry.weight, 'kg', 'lbs') 
        : entry.weight,
    }));

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 to-success-50 p-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center mb-8"
        >
          <button
            onClick={onBack}
            className="flex items-center text-gray-600 hover:text-gray-800 transition-colors mr-4"
          >
            <ArrowLeft className="w-5 h-5 mr-1" />
            Back
          </button>
          <h1 className="text-3xl font-bold text-gray-900">Weight Logger</h1>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Left Column - Form */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 }}
          >
            {/* Stats */}
            <div className="grid grid-cols-2 gap-4 mb-6">
              <div className="bg-white rounded-2xl p-4 shadow-lg">
                <div className="flex items-center mb-2">
                  <Scale className="w-5 h-5 text-primary-600 mr-2" />
                  <span className="text-sm text-gray-500">Entries</span>
                </div>
                <div className="text-2xl font-bold text-gray-900">
                  {weightEntries.length}
                </div>
              </div>
              
              <div className="bg-white rounded-2xl p-4 shadow-lg">
                <div className="flex items-center mb-2">
                  <Calendar className="w-5 h-5 text-success-600 mr-2" />
                  <span className="text-sm text-gray-500">Streak</span>
                </div>
                <div className="text-2xl font-bold text-gray-900">
                  {streak} days
                </div>
              </div>
            </div>

            {/* Form */}
            <div className="bg-white rounded-2xl p-6 shadow-lg">
              <h2 className="text-xl font-semibold text-gray-900 mb-6">Log New Entry</h2>
              
              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Date
                  </label>
                  <input
                    type="date"
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                    className="w-full p-4 border-2 border-gray-200 rounded-lg focus:border-primary-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Weight ({weightUnit})
                  </label>
                  <div className="relative">
                    <input
                      type="number"
                      step="0.1"
                      value={weight}
                      onChange={(e) => setWeight(e.target.value)}
                      placeholder={`Enter weight in ${weightUnit}`}
                      className="w-full p-4 border-2 border-gray-200 rounded-lg focus:border-primary-500 focus:outline-none"
                      required
                    />
                    <span className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-500">
                      {weightUnit}
                    </span>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Notes (Optional)
                  </label>
                  <textarea
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    placeholder="How are you feeling? Any observations..."
                    rows={3}
                    className="w-full p-4 border-2 border-gray-200 rounded-lg focus:border-primary-500 focus:outline-none resize-none"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full bg-primary-600 hover:bg-primary-700 text-white font-semibold py-4 px-6 rounded-lg transition-colors duration-200"
                >
                  Add Entry
                </button>
              </form>
            </div>
          </motion.div>

          {/* Right Column - Chart & History */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="space-y-6"
          >
            {/* Chart */}
            {chartData.length > 0 && (
              <div className="bg-white rounded-2xl p-6 shadow-lg">
                <div className="flex items-center mb-6">
                  <TrendingUp className="w-6 h-6 text-primary-600 mr-3" />
                  <h2 className="text-xl font-semibold text-gray-900">Progress Chart</h2>
                </div>
                
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={chartData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="date" />
                    <YAxis domain={['dataMin - 2', 'dataMax + 2']} />
                    <Tooltip 
                      formatter={(value: number) => [`${value.toFixed(1)} ${weightUnit}`, 'Weight']}
                    />
                    <Line 
                      type="monotone" 
                      dataKey="weight" 
                      stroke="#0ea5e9" 
                      strokeWidth={3}
                      dot={{ fill: '#0ea5e9', strokeWidth: 2, r: 6 }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            )}

            {/* Recent Entries */}
            <div className="bg-white rounded-2xl p-6 shadow-lg">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-semibold text-gray-900">Recent Entries</h2>
                {weightEntries.length > 0 && (
                  <div className="flex items-center text-sm text-gray-500">
                    <Trash2 className="w-4 h-4 mr-1" />
                    <span>Click trash icon to delete</span>
                  </div>
                )}
              </div>
              
              {weightEntries.length === 0 ? (
                <div className="text-center py-8 text-gray-500">
                  <Scale className="w-12 h-12 mx-auto mb-4 opacity-50" />
                  <p>No entries yet. Add your first weight entry!</p>
                </div>
              ) : (
                <div className="space-y-3 max-h-80 overflow-y-auto">
                  {weightEntries
                    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
                    .slice(0, 10)
                    .map((entry) => (
                      <motion.div 
                        key={entry.id} 
                        layout
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.9 }}
                        className="group flex items-start justify-between p-4 bg-gray-50 rounded-lg border border-gray-100 hover:bg-gray-100 hover:border-gray-200 hover:shadow-md transition-all duration-200"
                      >
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between mb-1">
                            <span className="font-semibold text-gray-900 text-lg">
                              {(profile.unitSystem === 'imperial' 
                                ? convertWeight(entry.weight, 'kg', 'lbs') 
                                : entry.weight
                              ).toFixed(1)} {weightUnit}
                            </span>
                          </div>
                          <div className="text-sm text-gray-500 mb-2">
                            {new Date(entry.date).toLocaleDateString('en-US', { 
                              weekday: 'short', 
                              month: 'short', 
                              day: 'numeric',
                              year: 'numeric'
                            })}
                          </div>
                          {entry.notes && (
                            <div className="flex items-start text-sm text-gray-600">
                              <MessageCircle className="w-4 h-4 mr-2 mt-0.5 flex-shrink-0" />
                              <span className="break-words">{entry.notes}</span>
                            </div>
                          )}
                        </div>
                        
                        {/* Delete Button - Much More Visible */}
                        <div className="ml-4 flex-shrink-0">
                          <button
                            onClick={() => handleDeleteClick(entry)}
                            className="p-2 rounded-lg text-gray-600 hover:text-red-600 hover:bg-red-50 transition-all duration-200 group-hover:text-red-500 group-hover:bg-red-50 border border-gray-200 hover:border-red-200"
                            title="Delete this entry"
                          >
                            <Trash2 className="w-5 h-5" />
                          </button>
                        </div>
                      </motion.div>
                    ))}
                </div>
              )}
            </div>
          </motion.div>
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      <AnimatePresence>
        {deleteModalEntry && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50"
            onClick={handleCancelDelete}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white rounded-2xl p-6 max-w-md w-full"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="text-center">
                <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Trash2 className="w-8 h-8 text-red-600" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">Delete Weight Entry</h3>
                <div className="mb-4 p-4 bg-gray-50 rounded-lg">
                  <p className="font-medium text-gray-900">
                    {(profile.unitSystem === 'imperial' 
                      ? convertWeight(deleteModalEntry.weight, 'kg', 'lbs') 
                      : deleteModalEntry.weight
                    ).toFixed(1)} {weightUnit}
                  </p>
                  <p className="text-sm text-gray-600">
                    {new Date(deleteModalEntry.date).toLocaleDateString('en-US', { 
                      weekday: 'long', 
                      month: 'long', 
                      day: 'numeric',
                      year: 'numeric'
                    })}
                  </p>
                  {deleteModalEntry.notes && (
                    <p className="text-sm text-gray-600 mt-2 italic">"{deleteModalEntry.notes}"</p>
                  )}
                </div>
                <p className="text-gray-600 mb-6">
                  Are you sure you want to delete this weight entry? This action cannot be undone.
                </p>
                <div className="flex space-x-3">
                  <button
                    onClick={handleCancelDelete}
                    className="flex-1 px-6 py-3 text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg font-medium transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleConfirmDelete}
                    className="flex-1 px-6 py-3 text-white bg-red-600 hover:bg-red-700 rounded-lg font-medium transition-colors"
                  >
                    Delete Entry
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default WeightLogger;
