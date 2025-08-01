import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import LandingPage from './components/LandingPage';
import OnboardingFlow from './components/OnboardingFlow';
import Dashboard from './components/Dashboard';
import WeightLogger from './components/WeightLogger';
import { AppState, UserProfile, WeightEntry } from './types';
import { getUserProfile, getWeightEntries, saveUserProfile, addWeightEntry as addWeightEntryToStorage, deleteWeightEntry } from './utils/storage';

function App() {
  const [appState, setAppState] = useState<AppState>({
    currentView: 'landing',
    userProfile: null,
    weightEntries: [],
    onboardingStep: 0,
  });

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

  const handleOnboardingComplete = (profile: UserProfile) => {
    saveUserProfile(profile);
    setAppState(prev => ({
      ...prev,
      currentView: 'dashboard',
      userProfile: profile,
    }));
  };

  const handleBackToLanding = () => {
    setAppState(prev => ({ ...prev, currentView: 'landing' }));
  };

  const handleLogWeight = () => {
    setAppState(prev => ({ ...prev, currentView: 'weight-log' }));
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
      </motion.div>
    </div>
  );
}

export default App;
