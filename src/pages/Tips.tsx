
import React, { useState, useEffect } from 'react';
import Layout from '@/components/Layout';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { completeGoal, isGoalCompleted, resetCompletedGoals } from '@/lib/userDataService';
import { CheckSquare } from 'lucide-react';
import confetti from 'canvas-confetti';

interface Goal {
  id: string;
  text: string;
}

interface Quote {
  text: string;
  author: string;
}

const DAILY_GOALS: Goal[] = [
  { id: 'water', text: 'Drink water (8 glasses)' },
  { id: 'walk', text: 'Take a 10-minute walk' },
  { id: 'friend', text: 'Call or text a friend' },
  { id: 'meditate', text: 'Take 5 minutes to meditate' },
  { id: 'stretch', text: 'Do some light stretching' },
];

const QUOTES: Quote[] = [
  { text: "Breathe. Let go. And remind yourself that this very moment is the only one you know you have for sure.", author: "Oprah Winfrey" },
  { text: "Within you, there is a stillness and a sanctuary to which you can retreat at any time.", author: "Hermann Hesse" },
  { text: "The present moment is filled with joy and happiness. If you are attentive, you will see it.", author: "Thich Nhat Hanh" },
  { text: "Calm mind brings inner strength and self-confidence.", author: "Dalai Lama" },
  { text: "Peace is the result of retraining your mind to process life as it is, rather than as you think it should be.", author: "Wayne Dyer" },
  { text: "Breathing in, I calm body and mind. Breathing out, I smile.", author: "Thich Nhat Hanh" },
  { text: "Don't believe every worried thought you have. Worried thoughts are notoriously inaccurate.", author: "Renee Jain" },
];

// Function to trigger confetti explosion
const triggerConfetti = () => {
  confetti({
    particleCount: 100,
    spread: 70,
    origin: { y: 0.6 }
  });
};

const Tips = () => {
  const [completedGoals, setCompletedGoals] = useState<Record<string, boolean>>({});
  const [quoteOfDay, setQuoteOfDay] = useState<Quote | null>(null);
  const [lastResetDate, setLastResetDate] = useState<string | null>(null);
  
  // Check if we need to reset goals for a new day
  useEffect(() => {
    const today = new Date().toDateString();
    const storedLastReset = localStorage.getItem('last_goals_reset_date');
    
    setLastResetDate(storedLastReset);
    
    if (storedLastReset !== today) {
      // It's a new day, reset goals
      resetCompletedGoals();
      localStorage.setItem('last_goals_reset_date', today);
      setLastResetDate(today);
    }
    
    // Load completed goals state
    const loadedGoals: Record<string, boolean> = {};
    DAILY_GOALS.forEach(goal => {
      loadedGoals[goal.id] = isGoalCompleted(goal.id);
    });
    setCompletedGoals(loadedGoals);
    
    // Set quote of the day
    const randomIndex = Math.floor(Math.random() * QUOTES.length);
    setQuoteOfDay(QUOTES[randomIndex]);
  }, []);

  const handleGoalToggle = (goalId: string) => {
    // Toggle the goal's completed status
    const newCompletedState = !completedGoals[goalId];
    
    if (newCompletedState) {
      completeGoal(goalId);
      
      // Trigger confetti for completed goals
      triggerConfetti();
    }
    
    setCompletedGoals(prev => ({
      ...prev,
      [goalId]: newCompletedState
    }));
  };

  const allGoalsCompleted = Object.values(completedGoals).every(Boolean);
  
  return (
    <Layout 
      title="Daily Goals & Tips" 
      subtitle="Small steps for better wellbeing"
      activePage="tips"
    >
      <div className="space-y-6 animate-fade-in">
        {quoteOfDay && (
          <div className="bg-white rounded-2xl shadow-sm p-6 card-gradient">
            <h2 className="text-xl font-medium mb-4">Quote of the Day</h2>
            <blockquote className="italic text-gray-700 border-l-4 border-serenity-green pl-4 py-2">
              "{quoteOfDay.text}"
              <footer className="text-sm text-gray-500 mt-2">— {quoteOfDay.author}</footer>
            </blockquote>
          </div>
        )}

        <div className="bg-white rounded-2xl shadow-sm p-6 card-gradient">
          <h2 className="text-xl font-medium mb-4">Micro Goals</h2>
          <div className="space-y-3">
            {DAILY_GOALS.map((goal) => (
              <div 
                key={goal.id} 
                className={`flex items-start space-x-3 p-3 rounded-lg transition-all ${
                  completedGoals[goal.id] ? 'bg-serenity-green/20' : 'hover:bg-gray-50'
                }`}
              >
                <Checkbox 
                  id={`goal-${goal.id}`}
                  checked={completedGoals[goal.id]} 
                  onCheckedChange={() => handleGoalToggle(goal.id)}
                  className="mt-0.5"
                />
                <label 
                  htmlFor={`goal-${goal.id}`} 
                  className="text-gray-700 cursor-pointer flex-1"
                >
                  {goal.text}
                </label>
              </div>
            ))}
          </div>
          
          {allGoalsCompleted && (
            <div className="mt-6 p-4 bg-serenity-green/20 rounded-lg text-center">
              <CheckSquare className="inline-block mr-2 text-serenity-green" size={20} />
              <span className="font-medium">Amazing job! You've completed all your goals today.</span>
            </div>
          )}
        </div>

        <div className="bg-white rounded-2xl shadow-sm p-6 card-gradient">
          <h2 className="text-xl font-medium mb-4">Quick Wellness Tips</h2>
          <ul className="list-disc list-inside space-y-2 text-gray-700">
            <li>Take short breaks between study sessions</li>
            <li>Practice gratitude - note three things you're thankful for</li>
            <li>Limit screen time before bedtime</li>
            <li>Stay hydrated throughout the day</li>
            <li>Connect with supportive friends regularly</li>
          </ul>
        </div>

        <Button 
          onClick={() => window.open('https://www.healthline.com/health/stress/college-student-stress-relief', '_blank')}
          className="w-full py-6 text-lg blue-gradient border-0 hover:opacity-90 transition-opacity rounded-xl"
        >
          Get More Wellness Tips
        </Button>
      </div>
    </Layout>
  );
};

export default Tips;
