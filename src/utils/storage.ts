import { UserProfile, WeightEntry } from '../types';

const STORAGE_KEYS = {
  USER_PROFILE: 'fitjourney_user_profile',
  WEIGHT_ENTRIES: 'fitjourney_weight_entries',
};

export const saveUserProfile = (profile: UserProfile): void => {
  localStorage.setItem(STORAGE_KEYS.USER_PROFILE, JSON.stringify(profile));
};

export const getUserProfile = (): UserProfile | null => {
  const data = localStorage.getItem(STORAGE_KEYS.USER_PROFILE);
  return data ? JSON.parse(data) : null;
};

export const saveWeightEntries = (entries: WeightEntry[]): void => {
  localStorage.setItem(STORAGE_KEYS.WEIGHT_ENTRIES, JSON.stringify(entries));
};

export const getWeightEntries = (): WeightEntry[] => {
  const data = localStorage.getItem(STORAGE_KEYS.WEIGHT_ENTRIES);
  return data ? JSON.parse(data) : [];
};

export const addWeightEntry = (entry: WeightEntry): WeightEntry[] => {
  const entries = getWeightEntries();
  const newEntries = [...entries, entry];
  saveWeightEntries(newEntries);
  return newEntries;
};

export const deleteWeightEntry = (entryId: string): WeightEntry[] => {
  const entries = getWeightEntries();
  const filteredEntries = entries.filter(entry => entry.id !== entryId);
  saveWeightEntries(filteredEntries);
  return filteredEntries;
};

export const clearAllData = (): void => {
  localStorage.removeItem(STORAGE_KEYS.USER_PROFILE);
  localStorage.removeItem(STORAGE_KEYS.WEIGHT_ENTRIES);
};
