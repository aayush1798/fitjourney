import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight, X } from 'lucide-react';
import { UserProfile } from '../types';

interface OnboardingFlowProps {
  onComplete: (profile: UserProfile) => void;
  onBack: () => void;
}

const OnboardingFlow: React.FC<OnboardingFlowProps> = ({ onComplete, onBack }) => {
  const [step, setStep] = useState(0);
  const [formData, setFormData] = useState({
    gender: '' as 'male' | 'female' | 'other',
    age: '',
    height: '',
    currentWeight: '',
    targetWeight: '',
    activityLevel: '' as 'sedentary' | 'light' | 'moderate' | 'active',
    goalType: '' as 'lose' | 'maintain' | 'gain',
    unitSystem: 'metric' as 'metric' | 'imperial',
    dietPreference: '' as 'vegetarian' | 'non-vegetarian' | 'vegan' | 'keto' | 'paleo' | 'mediterranean',
    allergies: [] as string[],
    dailyMeals: '' as '3-meals' | '5-meals',
  });

  const commonAllergies = [
    'Lactose', 'Gluten', 'Nuts', 'Shellfish', 'Eggs', 'Soy', 'Fish', 'Sesame'
  ];

  const steps = [
    {
      title: 'What\'s your gender?',
      field: 'gender',
      type: 'select',
      options: [
        { value: 'male', label: 'Male' },
        { value: 'female', label: 'Female' },
        { value: 'other', label: 'Other' },
      ]
    },
    {
      title: 'How old are you?',
      field: 'age',
      type: 'number',
      placeholder: 'Enter your age',
      suffix: 'years old'
    },
    {
      title: 'Choose your unit system',
      field: 'unitSystem',
      type: 'select',
      options: [
        { value: 'metric', label: 'Metric (kg, cm)' },
        { value: 'imperial', label: 'Imperial (lbs, ft/in)' },
      ]
    },
    {
      title: 'What\'s your height?',
      field: 'height',
      type: 'number',
      placeholder: formData.unitSystem === 'metric' ? 'Height in cm' : 'Height in inches',
      suffix: formData.unitSystem === 'metric' ? 'cm' : 'inches'
    },
    {
      title: 'Current weight?',
      field: 'currentWeight',
      type: 'number',
      placeholder: formData.unitSystem === 'metric' ? 'Weight in kg' : 'Weight in lbs',
      suffix: formData.unitSystem === 'metric' ? 'kg' : 'lbs'
    },
    {
      title: 'Target weight?',
      field: 'targetWeight',
      type: 'number',
      placeholder: formData.unitSystem === 'metric' ? 'Target in kg' : 'Target in lbs',
      suffix: formData.unitSystem === 'metric' ? 'kg' : 'lbs'
    },
    {
      title: 'Activity level?',
      field: 'activityLevel',
      type: 'select',
      options: [
        { value: 'sedentary', label: 'Sedentary (little/no exercise)' },
        { value: 'light', label: 'Light (light exercise 1-3 days/week)' },
        { value: 'moderate', label: 'Moderate (moderate exercise 3-5 days/week)' },
        { value: 'active', label: 'Active (hard exercise 6-7 days/week)' },
      ]
    },
    {
      title: 'What\'s your goal?',
      field: 'goalType',
      type: 'select',
      options: [
        { value: 'lose', label: 'Lose Weight' },
        { value: 'maintain', label: 'Maintain Weight' },
        { value: 'gain', label: 'Gain Muscle/Weight' },
      ]
    },
    {
      title: 'Diet preference?',
      field: 'dietPreference',
      type: 'select',
      options: [
        { value: 'non-vegetarian', label: 'Non-Vegetarian' },
        { value: 'vegetarian', label: 'Vegetarian' },
        { value: 'vegan', label: 'Vegan' },
        { value: 'keto', label: 'Keto' },
        { value: 'paleo', label: 'Paleo' },
        { value: 'mediterranean', label: 'Mediterranean' },
      ]
    },
    {
      title: 'Any allergies or restrictions?',
      field: 'allergies',
      type: 'multi-select',
      subtitle: 'Select all that apply'
    },
    {
      title: 'Preferred meal frequency?',
      field: 'dailyMeals',
      type: 'select',
      options: [
        { value: '3-meals', label: '3 Meals (Breakfast, Lunch, Dinner)' },
        { value: '5-meals', label: '5 Meals (3 main + 2 snacks)' },
      ]
    },
  ];

  const currentStep = steps[step];
  const isLastStep = step === steps.length - 1;
  
  const canProceed = () => {
    if (currentStep.field === 'allergies') {
      return true; // Allergies are optional
    }
    return formData[currentStep.field as keyof typeof formData] !== '';
  };

  const handleNext = () => {
    if (isLastStep) {
      // Convert units to metric for storage
      let height = parseFloat(formData.height);
      let currentWeight = parseFloat(formData.currentWeight);
      let targetWeight = parseFloat(formData.targetWeight);

      if (formData.unitSystem === 'imperial') {
        height = height * 2.54; // inches to cm
        currentWeight = currentWeight / 2.20462; // lbs to kg
        targetWeight = targetWeight / 2.20462; // lbs to kg
      }

      const profile: UserProfile = {
        id: Date.now().toString(),
        gender: formData.gender,
        age: parseInt(formData.age),
        height,
        currentWeight,
        targetWeight,
        activityLevel: formData.activityLevel,
        goalType: formData.goalType,
        unitSystem: formData.unitSystem,
        dietPreference: formData.dietPreference,
        allergies: formData.allergies,
        dailyMeals: formData.dailyMeals,
        createdAt: new Date().toISOString(),
      };

      onComplete(profile);
    } else {
      setStep(step + 1);
    }
  };

  const handlePrevious = () => {
    if (step === 0) {
      onBack();
    } else {
      setStep(step - 1);
    }
  };

  const handleInputChange = (value: string) => {
    setFormData({
      ...formData,
      [currentStep.field]: value,
    });
  };

  const handleAllergyToggle = (allergy: string) => {
    const currentAllergies = formData.allergies;
    const isSelected = currentAllergies.includes(allergy);
    
    if (isSelected) {
      setFormData({
        ...formData,
        allergies: currentAllergies.filter(a => a !== allergy)
      });
    } else {
      setFormData({
        ...formData,
        allergies: [...currentAllergies, allergy]
      });
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 to-success-50 flex items-center justify-center p-4">
      <div className="max-w-md w-full">
        <div className="bg-white rounded-2xl shadow-xl p-8">
          {/* Progress bar */}
          <div className="mb-8">
            <div className="flex justify-between text-sm text-gray-500 mb-2">
              <span>Step {step + 1} of {steps.length}</span>
              <span>{Math.round(((step + 1) / steps.length) * 100)}%</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <motion.div
                className="bg-primary-600 h-2 rounded-full"
                initial={{ width: 0 }}
                animate={{ width: `${((step + 1) / steps.length) * 100}%` }}
                transition={{ duration: 0.3 }}
              />
            </div>
          </div>

          <AnimatePresence mode="wait">
            <motion.div
              key={step}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
            >
              <h2 className="text-2xl font-bold text-gray-900 mb-2 text-center">
                {currentStep.title}
              </h2>
              {currentStep.subtitle && (
                <p className="text-gray-600 text-center mb-6">{currentStep.subtitle}</p>
              )}

              {currentStep.type === 'select' ? (
                <div className="space-y-3 mb-8">
                  {currentStep.options?.map((option) => (
                    <button
                      key={option.value}
                      onClick={() => handleInputChange(option.value)}
                      className={`w-full p-4 text-left rounded-lg border-2 transition-colors ${
                        formData[currentStep.field as keyof typeof formData] === option.value
                          ? 'border-primary-500 bg-primary-50'
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      {option.label}
                    </button>
                  ))}
                </div>
              ) : currentStep.type === 'multi-select' ? (
                <div className="mb-8">
                  <div className="grid grid-cols-2 gap-3">
                    {commonAllergies.map((allergy) => (
                      <button
                        key={allergy}
                        onClick={() => handleAllergyToggle(allergy)}
                        className={`p-3 text-sm rounded-lg border-2 transition-colors ${
                          formData.allergies.includes(allergy)
                            ? 'border-primary-500 bg-primary-50 text-primary-700'
                            : 'border-gray-200 hover:border-gray-300'
                        }`}
                      >
                        {allergy}
                        {formData.allergies.includes(allergy) && (
                          <X className="w-4 h-4 inline ml-2" />
                        )}
                      </button>
                    ))}
                  </div>
                  {formData.allergies.length > 0 && (
                    <div className="mt-4 p-3 bg-gray-50 rounded-lg">
                      <p className="text-sm text-gray-600 mb-2">Selected:</p>
                      <div className="flex flex-wrap gap-2">
                        {formData.allergies.map((allergy) => (
                          <span
                            key={allergy}
                            className="px-3 py-1 bg-primary-100 text-primary-700 rounded-full text-sm"
                          >
                            {allergy}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                <div className="mb-8">
                  <div className="relative">
                    <input
                      type={currentStep.type}
                      placeholder={currentStep.placeholder}
                      value={formData[currentStep.field as keyof typeof formData]}
                      onChange={(e) => handleInputChange(e.target.value)}
                      className="w-full p-4 text-lg border-2 border-gray-200 rounded-lg focus:border-primary-500 focus:outline-none"
                    />
                    {currentStep.suffix && (
                      <span className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-500">
                        {currentStep.suffix}
                      </span>
                    )}
                  </div>
                </div>
              )}
            </motion.div>
          </AnimatePresence>

          {/* Navigation */}
          <div className="flex justify-between">
            <button
              onClick={handlePrevious}
              className="flex items-center px-6 py-3 text-gray-600 hover:text-gray-800 transition-colors"
            >
              <ChevronLeft className="w-5 h-5 mr-1" />
              Back
            </button>

            <button
              onClick={handleNext}
              disabled={!canProceed()}
              className={`flex items-center px-6 py-3 rounded-lg font-semibold transition-colors ${
                canProceed()
                  ? 'bg-primary-600 hover:bg-primary-700 text-white'
                  : 'bg-gray-200 text-gray-400 cursor-not-allowed'
              }`}
            >
              {isLastStep ? 'Complete' : 'Next'}
              {!isLastStep && <ChevronRight className="w-5 h-5 ml-1" />}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OnboardingFlow;
