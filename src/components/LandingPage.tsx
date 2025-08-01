import React from 'react';
import { motion } from 'framer-motion';
import { Scale, Target, TrendingUp, Heart } from 'lucide-react';

interface LandingPageProps {
  onStartJourney: () => void;
}

const LandingPage: React.FC<LandingPageProps> = ({ onStartJourney }) => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 to-success-50 flex items-center justify-center p-4">
      <div className="max-w-lg w-full">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center"
        >
          {/* Logo/Icon */}
          <motion.div
            initial={{ scale: 0.8 }}
            animate={{ scale: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="flex justify-center mb-8"
          >
            <div className="bg-white rounded-full p-6 shadow-lg">
              <Scale className="w-12 h-12 text-primary-600" />
            </div>
          </motion.div>

          {/* Heading */}
          <motion.h1
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="text-4xl md:text-5xl font-bold text-gray-900 mb-4"
          >
            Fit<span className="text-primary-600">Journey</span>
          </motion.h1>

          {/* Subtitle */}
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6 }}
            className="text-lg text-gray-600 mb-8 leading-relaxed"
          >
            Track your weight, set meaningful goals, and monitor your progress with a clean, simple interface designed for your success.
          </motion.p>

          {/* Features */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8 }}
            className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8"
          >
            <div className="bg-white rounded-lg p-4 shadow-sm">
              <Target className="w-6 h-6 text-primary-500 mx-auto mb-2" />
              <p className="text-sm text-gray-600">Set Goals</p>
            </div>
            <div className="bg-white rounded-lg p-4 shadow-sm">
              <TrendingUp className="w-6 h-6 text-success-500 mx-auto mb-2" />
              <p className="text-sm text-gray-600">Track Progress</p>
            </div>
            <div className="bg-white rounded-lg p-4 shadow-sm">
              <Heart className="w-6 h-6 text-red-500 mx-auto mb-2" />
              <p className="text-sm text-gray-600">Stay Motivated</p>
            </div>
          </motion.div>

          {/* CTA Button */}
          <motion.button
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 1 }}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={onStartJourney}
            className="w-full bg-primary-600 hover:bg-primary-700 text-white font-semibold py-4 px-8 rounded-xl shadow-lg transition-colors duration-200"
          >
            Start My Journey
          </motion.button>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.2 }}
            className="text-sm text-gray-500 mt-4"
          >
            No signup required • All data stored locally • Completely free
          </motion.p>
        </motion.div>
      </div>
    </div>
  );
};

export default LandingPage;
