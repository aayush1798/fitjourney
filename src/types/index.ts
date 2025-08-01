export interface UserProfile {
  id: string;
  gender: 'male' | 'female' | 'other';
  age: number;
  height: number; // in cm
  currentWeight: number; // in kg
  targetWeight: number; // in kg
  activityLevel: 'sedentary' | 'light' | 'moderate' | 'active';
  goalType: 'lose' | 'maintain' | 'gain';
  unitSystem: 'metric' | 'imperial';
  createdAt: string;
}

export interface WeightEntry {
  id: string;
  date: string;
  weight: number; // in kg
  notes?: string;
  createdAt: string;
}

export interface AppState {
  currentView: 'landing' | 'onboarding' | 'dashboard' | 'weight-log';
  userProfile: UserProfile | null;
  weightEntries: WeightEntry[];
  onboardingStep: number;
}
