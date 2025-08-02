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
  dietPreference: 'vegetarian' | 'non-vegetarian' | 'vegan' | 'keto' | 'paleo' | 'mediterranean';
  allergies: string[];
  dailyMeals: '3-meals' | '5-meals';
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
  currentView: 'landing' | 'onboarding' | 'dashboard' | 'weight-log' | 'diet-plan';
  userProfile: UserProfile | null;
  weightEntries: WeightEntry[];
  dietPlan: DietPlan | null;
  onboardingStep: number;
}

export interface MealInfo {
  name: string;
  description: string;
  calories: number;
  protein: number;
  carbs: number;
  fats: number;
  ingredients: string[];
  instructions: string[];
}

export interface DayPlan {
  day: string;
  breakfast: MealInfo;
  lunch: MealInfo;
  dinner: MealInfo;
  snacks?: MealInfo[];
}

export interface DietPlan {
  id: string;
  userId: string;
  days: DayPlan[];
  totalDailyCalories: number;
  hydrationTips: string[];
  lifestyleTips: string[];
  summary: {
    dailyCalorieRange: string;
    goalAlignment: string;
    restrictionNotes: string[];
  };
  createdAt: string;
}
