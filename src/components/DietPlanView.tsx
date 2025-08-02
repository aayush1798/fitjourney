import React, { useState, useRef } from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, Download, Calendar, Utensils, Droplets, Heart, Info } from 'lucide-react';
import { DietPlan, UserProfile } from '../types';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

interface DietPlanViewProps {
  dietPlan: DietPlan;
  profile: UserProfile;
  onBack: () => void;
}

const DietPlanView: React.FC<DietPlanViewProps> = ({ dietPlan, profile, onBack }) => {
  const [selectedDay, setSelectedDay] = useState(0);
  const dietPlanRef = useRef<HTMLDivElement>(null);

  const downloadPDF = async () => {
    if (!dietPlanRef.current) return;

    try {
      const canvas = await html2canvas(dietPlanRef.current, {
        scale: 2,
        useCORS: true,
        allowTaint: true,
      });

      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF('p', 'mm', 'a4');
      
      const imgWidth = 210;
      const pageHeight = 295;
      const imgHeight = (canvas.height * imgWidth) / canvas.width;
      let heightLeft = imgHeight;
      let position = 0;

      pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
      heightLeft -= pageHeight;

      while (heightLeft >= 0) {
        position = heightLeft - imgHeight;
        pdf.addPage();
        pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
        heightLeft -= pageHeight;
      }

      pdf.save('FitJourney-Diet-Plan.pdf');
    } catch (error) {
      console.error('Error generating PDF:', error);
    }
  };

  const currentDay = dietPlan.days[selectedDay];

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 to-success-50 p-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center justify-between mb-8"
        >
          <div className="flex items-center">
            <button
              onClick={onBack}
              className="flex items-center text-gray-600 hover:text-gray-800 transition-colors mr-4"
            >
              <ArrowLeft className="w-5 h-5 mr-1" />
              Back
            </button>
            <h1 className="text-3xl font-bold text-gray-900">Your Personal Diet Plan</h1>
          </div>
          
          <button
            onClick={downloadPDF}
            className="flex items-center px-6 py-3 bg-primary-600 hover:bg-primary-700 text-white font-semibold rounded-lg transition-colors"
          >
            <Download className="w-5 h-5 mr-2" />
            Download PDF
          </button>
        </motion.div>

        <div ref={dietPlanRef} className="space-y-8">
          {/* Summary Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-white rounded-2xl p-6 shadow-lg"
          >
            <div className="flex items-center mb-6">
              <Info className="w-6 h-6 text-primary-600 mr-3" />
              <h2 className="text-xl font-semibold text-gray-900">Plan Summary</h2>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="text-center p-4 bg-primary-50 rounded-lg">
                <div className="text-2xl font-bold text-primary-600 mb-1">
                  {dietPlan.totalDailyCalories}
                </div>
                <div className="text-sm text-gray-600">Daily Calories</div>
              </div>
              
              <div className="text-center p-4 bg-success-50 rounded-lg">
                <div className="text-2xl font-bold text-success-600 mb-1">
                  {dietPlan.summary.dailyCalorieRange}
                </div>
                <div className="text-sm text-gray-600">Calorie Range</div>
              </div>
              
              <div className="text-center p-4 bg-orange-50 rounded-lg">
                <div className="text-2xl font-bold text-orange-600 mb-1">
                  7 Days
                </div>
                <div className="text-sm text-gray-600">Complete Plan</div>
              </div>
            </div>

            <div className="mt-6 p-4 bg-gray-50 rounded-lg">
              <h3 className="font-semibold text-gray-900 mb-2">Goal Alignment</h3>
              <p className="text-gray-700">{dietPlan.summary.goalAlignment}</p>
              
              {dietPlan.summary.restrictionNotes.length > 0 && (
                <div className="mt-3">
                  <h4 className="font-medium text-gray-900 mb-1">Special Considerations:</h4>
                  <ul className="list-disc list-inside text-gray-700 space-y-1">
                    {dietPlan.summary.restrictionNotes.map((note, index) => (
                      <li key={index} className="text-sm">{note}</li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </motion.div>

          {/* Day Selector */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-white rounded-2xl p-6 shadow-lg"
          >
            <div className="flex items-center mb-6">
              <Calendar className="w-6 h-6 text-primary-600 mr-3" />
              <h2 className="text-xl font-semibold text-gray-900">Daily Meal Plan</h2>
            </div>
            
            <div className="flex flex-wrap gap-2 mb-6">
              {dietPlan.days.map((day, index) => (
                <button
                  key={index}
                  onClick={() => setSelectedDay(index)}
                  className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                    selectedDay === index
                      ? 'bg-primary-600 text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  {day.day}
                </button>
              ))}
            </div>

            {/* Selected Day Meals */}
            {currentDay && (
              <div className="space-y-6">
                {/* Breakfast */}
                <div className="border border-gray-200 rounded-lg p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                    <Utensils className="w-5 h-5 mr-2 text-orange-500" />
                    Breakfast
                  </h3>
                  <MealCard meal={currentDay.breakfast} />
                </div>

                {/* Lunch */}
                <div className="border border-gray-200 rounded-lg p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                    <Utensils className="w-5 h-5 mr-2 text-green-500" />
                    Lunch
                  </h3>
                  <MealCard meal={currentDay.lunch} />
                </div>

                {/* Dinner */}
                <div className="border border-gray-200 rounded-lg p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                    <Utensils className="w-5 h-5 mr-2 text-blue-500" />
                    Dinner
                  </h3>
                  <MealCard meal={currentDay.dinner} />
                </div>

                {/* Snacks */}
                {currentDay.snacks && currentDay.snacks.length > 0 && (
                  <div className="border border-gray-200 rounded-lg p-6">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                      <Utensils className="w-5 h-5 mr-2 text-purple-500" />
                      Snacks
                    </h3>
                    <div className="space-y-4">
                      {currentDay.snacks.map((snack, index) => (
                        <MealCard key={index} meal={snack} />
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}
          </motion.div>

          {/* Lifestyle Tips */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Hydration Tips */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="bg-white rounded-2xl p-6 shadow-lg"
            >
              <div className="flex items-center mb-4">
                <Droplets className="w-6 h-6 text-blue-500 mr-3" />
                <h2 className="text-xl font-semibold text-gray-900">Hydration Tips</h2>
              </div>
              <ul className="space-y-3">
                {dietPlan.hydrationTips.map((tip, index) => (
                  <li key={index} className="flex items-start">
                    <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                    <span className="text-gray-700">{tip}</span>
                  </li>
                ))}
              </ul>
            </motion.div>

            {/* Lifestyle Tips */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="bg-white rounded-2xl p-6 shadow-lg"
            >
              <div className="flex items-center mb-4">
                <Heart className="w-6 h-6 text-red-500 mr-3" />
                <h2 className="text-xl font-semibold text-gray-900">Lifestyle Tips</h2>
              </div>
              <ul className="space-y-3">
                {dietPlan.lifestyleTips.map((tip, index) => (
                  <li key={index} className="flex items-start">
                    <div className="w-2 h-2 bg-red-500 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                    <span className="text-gray-700">{tip}</span>
                  </li>
                ))}
              </ul>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
};

interface MealCardProps {
  meal: {
    name: string;
    description: string;
    calories: number;
    protein: number;
    carbs: number;
    fats: number;
    ingredients: string[];
    instructions: string[];
  };
}

const MealCard: React.FC<MealCardProps> = ({ meal }) => {
  return (
    <div className="space-y-4">
      <div>
        <h4 className="text-lg font-semibold text-gray-900">{meal.name}</h4>
        <p className="text-gray-600">{meal.description}</p>
      </div>

      {/* Nutrition Info */}
      <div className="grid grid-cols-4 gap-4">
        <div className="text-center p-3 bg-orange-50 rounded-lg">
          <div className="text-lg font-bold text-orange-600">{meal.calories}</div>
          <div className="text-xs text-gray-600">Calories</div>
        </div>
        <div className="text-center p-3 bg-blue-50 rounded-lg">
          <div className="text-lg font-bold text-blue-600">{meal.protein}g</div>
          <div className="text-xs text-gray-600">Protein</div>
        </div>
        <div className="text-center p-3 bg-green-50 rounded-lg">
          <div className="text-lg font-bold text-green-600">{meal.carbs}g</div>
          <div className="text-xs text-gray-600">Carbs</div>
        </div>
        <div className="text-center p-3 bg-purple-50 rounded-lg">
          <div className="text-lg font-bold text-purple-600">{meal.fats}g</div>
          <div className="text-xs text-gray-600">Fats</div>
        </div>
      </div>

      {/* Ingredients */}
      <div>
        <h5 className="font-medium text-gray-900 mb-2">Ingredients:</h5>
        <div className="flex flex-wrap gap-2">
          {meal.ingredients.map((ingredient, index) => (
            <span
              key={index}
              className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm"
            >
              {ingredient}
            </span>
          ))}
        </div>
      </div>

      {/* Instructions */}
      <div>
        <h5 className="font-medium text-gray-900 mb-2">Instructions:</h5>
        <ol className="list-decimal list-inside space-y-1 text-gray-700">
          {meal.instructions.map((instruction, index) => (
            <li key={index} className="text-sm">{instruction}</li>
          ))}
        </ol>
      </div>
    </div>
  );
};

export default DietPlanView;
