import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import LandingPage from './components/LandingPage';
import OnboardingFlow from './components/OnboardingFlow';
import Dashboard from './components/Dashboard';
import WeightLogger from './components/WeightLogger';
import DietPlanView from './components/DietPlanView';
import { AppState, UserProfile, WeightEntry, DietPlan } from './types';
import { getUserProfile, getWeightEntries, saveUserProfile, addWeightEntry as addWeightEntryToStorage, deleteWeightEntry } from './utils/storage';
import { generateDietPlan } from './services/geminiService';

function App() {
  const [appState, setAppState] = useState<AppState>({
    currentView: 'landing',
    userProfile: null,
    weightEntries: [],
    dietPlan: null,
    onboardingStep: 0,
  });

  const [isGeneratingDietPlan, setIsGeneratingDietPlan] = useState(false);

  useEffect(() => {
    // Load data from localStorage on app start
    const profile = getUserProfile();
    const entries = getWeightEntries();
    
    if (profile) {
      setAppState(prev => ({
        ...prev,
        currentView: 'dashboard',
        userProfile: profile,
        weightEntries: entries,
      }));
    }
  }, []);

  const handleStartJourney = () => {
    setAppState(prev => ({ ...prev, currentView: 'onboarding' }));
  };

  const handleOnboardingComplete = async (profile: UserProfile) => {
    saveUserProfile(profile);
    setAppState(prev => ({
      ...prev,
      currentView: 'dashboard',
      userProfile: profile,
    }));

    // Generate diet plan in background
    setIsGeneratingDietPlan(true);
    try {
      const dietPlan = await generateDietPlan(profile);
      setAppState(prev => ({
        ...prev,
        dietPlan,
      }));
    } catch (error) {
      console.error('Failed to generate diet plan:', error);
    } finally {
      setIsGeneratingDietPlan(false);
    }
  };

  const handleBackToLanding = () => {
    setAppState(prev => ({ ...prev, currentView: 'landing' }));
  };

  const handleLogWeight = () => {
    setAppState(prev => ({ ...prev, currentView: 'weight-log' }));
  };

  const handleViewDietPlan = async () => {
    if (!appState.dietPlan && appState.userProfile) {
      setIsGeneratingDietPlan(true);
      try {
        const dietPlan = await generateDietPlan(appState.userProfile);
        setAppState(prev => ({
          ...prev,
          dietPlan,
          currentView: 'diet-plan',
        }));
      } catch (error) {
        console.error('Failed to generate diet plan:', error);
      } finally {
        setIsGeneratingDietPlan(false);
      }
    } else {
      setAppState(prev => ({ ...prev, currentView: 'diet-plan' }));
    }
  };

  const handleBackToDashboard = () => {
    setAppState(prev => ({ ...prev, currentView: 'dashboard' }));
  };

  const handleAddWeightEntry = (entry: WeightEntry) => {
    const updatedEntries = addWeightEntryToStorage(entry);
    setAppState(prev => ({
      ...prev,
      weightEntries: updatedEntries,
    }));
  };

  const handleDeleteWeightEntry = (entryId: string) => {
    const updatedEntries = deleteWeightEntry(entryId);
    setAppState(prev => ({
      ...prev,
      weightEntries: updatedEntries,
    }));
  };

  if (isGeneratingDietPlan) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-primary-50 to-success-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-primary-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Generating Your Diet Plan</h2>
          <p className="text-gray-600">Please wait while we create a personalized plan for you...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="App">
      <motion.div
        key={appState.currentView}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.3 }}
      >
        {appState.currentView === 'landing' && (
          <LandingPage onStartJourney={handleStartJourney} />
        )}

        {appState.currentView === 'onboarding' && (
          <OnboardingFlow 
            onComplete={handleOnboardingComplete}
            onBack={handleBackToLanding}
          />
        )}

        {appState.currentView === 'dashboard' && appState.userProfile && (
          <Dashboard
            profile={appState.userProfile}
            weightEntries={appState.weightEntries}
            onLogWeight={handleLogWeight}
            onViewDietPlan={handleViewDietPlan}
          />
        )}

        {appState.currentView === 'weight-log' && appState.userProfile && (
          <WeightLogger
            profile={appState.userProfile}
            weightEntries={appState.weightEntries}
            onAddEntry={handleAddWeightEntry}
            onDeleteEntry={handleDeleteWeightEntry}
            onBack={handleBackToDashboard}
          />
        )}

        {appState.currentView === 'diet-plan' && appState.userProfile && appState.dietPlan && (
          <DietPlanView
            dietPlan={appState.dietPlan}
            profile={appState.userProfile}
            onBack={handleBackToDashboard}
          />
        )}
      </motion.div>
    </div>
  );
}

export default App;
