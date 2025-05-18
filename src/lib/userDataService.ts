interface MoodEntry {
  timestamp: number;
  mood: string;
  stressLevel: number;
}

interface UserData {
  moodHistory: MoodEntry[];
  favorites: string[];
  completedGoals: string[];
}

const USER_DATA_KEY = 'serenity_user_data';

// Initialize with default data if none exists
const defaultUserData: UserData = {
  moodHistory: [],
  favorites: [],
  completedGoals: []
};

// Load user data from localStorage
export const loadUserData = (): UserData => {
  const storedData = localStorage.getItem(USER_DATA_KEY);
  if (storedData) {
    try {
      return JSON.parse(storedData);
    } catch (error) {
      console.error('Failed to parse user data', error);
      return { ...defaultUserData };
    }
  }
  return { ...defaultUserData };
};

// Save user data to localStorage
export const saveUserData = (userData: UserData): void => {
  localStorage.setItem(USER_DATA_KEY, JSON.stringify(userData));
};

// Add a mood entry
export const addMoodEntry = (mood: string, stressLevel: number): void => {
  const userData = loadUserData();
  
  userData.moodHistory.push({
    timestamp: Date.now(),
    mood,
    stressLevel
  });
  
  // Keep only the last 20 entries
  if (userData.moodHistory.length > 20) {
    userData.moodHistory = userData.moodHistory.slice(-20);
  }
  
  saveUserData(userData);
};

// Get recent mood entries
export const getRecentMoodEntries = (count = 5): MoodEntry[] => {
  const userData = loadUserData();
  return userData.moodHistory.slice(-count);
};

// Toggle a favorite track
export const toggleFavorite = (trackId: string): boolean => {
  const userData = loadUserData();
  
  const index = userData.favorites.indexOf(trackId);
  if (index === -1) {
    // Add to favorites
    userData.favorites.push(trackId);
    saveUserData(userData);
    return true;
  } else {
    // Remove from favorites
    userData.favorites.splice(index, 1);
    saveUserData(userData);
    return false;
  }
};

// Check if a track is favorited
export const isFavorite = (trackId: string): boolean => {
  const userData = loadUserData();
  return userData.favorites.includes(trackId);
};

// Mark goal as completed
export const completeGoal = (goalId: string): void => {
  const userData = loadUserData();
  
  if (!userData.completedGoals.includes(goalId)) {
    userData.completedGoals.push(goalId);
    saveUserData(userData);
  }
};

// Check if goal is completed
export const isGoalCompleted = (goalId: string): boolean => {
  const userData = loadUserData();
  return userData.completedGoals.includes(goalId);
};

// Reset completed goals (e.g., for daily goals)
export const resetCompletedGoals = (): void => {
  const userData = loadUserData();
  userData.completedGoals = [];
  saveUserData(userData);
};
