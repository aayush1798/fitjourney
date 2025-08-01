import { UserProfile, WeightEntry } from '../types';

export const calculateBMR = (profile: UserProfile): number => {
  const { gender, age, height, currentWeight } = profile;
  
  // Mifflin-St Jeor Equation
  if (gender === 'male') {
    return 10 * currentWeight + 6.25 * height - 5 * age + 5;
  } else {
    return 10 * currentWeight + 6.25 * height - 5 * age - 161;
  }
};

export const calculateTDEE = (profile: UserProfile): number => {
  const bmr = calculateBMR(profile);
  const activityMultipliers = {
    sedentary: 1.2,
    light: 1.375,
    moderate: 1.55,
    active: 1.725
  };
  
  return bmr * activityMultipliers[profile.activityLevel];
};

export const calculateWeeklyProgress = (
  profile: UserProfile,
  entries: WeightEntry[]
): { progress: number; onTrack: boolean; message: string } => {
  if (entries.length === 0) {
    return {
      progress: 0,
      onTrack: false,
      message: 'Start logging your weight to track progress'
    };
  }

  const sortedEntries = entries.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
  const latestEntry = sortedEntries[sortedEntries.length - 1];
  const startWeight = profile.currentWeight;
  const currentWeight = latestEntry.weight;
  const targetWeight = profile.targetWeight;

  const totalWeightToLose = Math.abs(targetWeight - startWeight);
  const weightLostSoFar = Math.abs(currentWeight - startWeight);
  const progress = totalWeightToLose > 0 ? (weightLostSoFar / totalWeightToLose) * 100 : 0;

  // Calculate if on track (assuming 0.5kg per week is healthy)
  const weeksSinceStart = Math.max(1, (new Date().getTime() - new Date(profile.createdAt).getTime()) / (7 * 24 * 60 * 60 * 1000));
  const expectedWeightLoss = weeksSinceStart * 0.5;
  const onTrack = weightLostSoFar >= expectedWeightLoss * 0.8; // 80% tolerance

  let message = '';
  if (profile.goalType === 'lose') {
    if (onTrack) {
      message = `Great job! You're on track to reach your goal.`;
    } else {
      message = `Keep going! Small steps lead to big changes.`;
    }
  } else if (profile.goalType === 'gain') {
    if (onTrack) {
      message = `Excellent progress towards your weight gain goal!`;
    } else {
      message = `Stay consistent with your nutrition plan.`;
    }
  } else {
    message = `You're maintaining your weight well!`;
  }

  return { progress: Math.min(progress, 100), onTrack, message };
};

export const calculateStreak = (entries: WeightEntry[]): number => {
  if (entries.length === 0) return 0;

  const sortedEntries = entries.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  let streak = 0;
  let currentDate = new Date();
  currentDate.setHours(0, 0, 0, 0);

  for (const entry of sortedEntries) {
    const entryDate = new Date(entry.date);
    entryDate.setHours(0, 0, 0, 0);
    
    const diffDays = Math.floor((currentDate.getTime() - entryDate.getTime()) / (24 * 60 * 60 * 1000));
    
    if (diffDays === streak || (streak === 0 && diffDays <= 1)) {
      streak++;
      currentDate.setDate(currentDate.getDate() - 1);
    } else {
      break;
    }
  }

  return streak;
};

export const convertWeight = (weight: number, from: 'kg' | 'lbs', to: 'kg' | 'lbs'): number => {
  if (from === to) return weight;
  if (from === 'kg' && to === 'lbs') return weight * 2.20462;
  if (from === 'lbs' && to === 'kg') return weight / 2.20462;
  return weight;
};

export const convertHeight = (height: number, from: 'cm' | 'ft', to: 'cm' | 'ft'): number => {
  if (from === to) return height;
  if (from === 'cm' && to === 'ft') return height / 30.48;
  if (from === 'ft' && to === 'cm') return height * 30.48;
  return height;
};
