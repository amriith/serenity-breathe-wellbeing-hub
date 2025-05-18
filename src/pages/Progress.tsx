
import React, { useState } from 'react';
import Layout from '@/components/Layout';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { getRecentMoodEntries, addMoodEntry } from '@/lib/userDataService';
import { useToast } from '@/hooks/use-toast';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';

const moodToEmoji: Record<string, string> = {
  'sad': '😞',
  'neutral': '😐',
  'good': '🙂',
  'great': '😄',
};

const moodToValue: Record<string, number> = {
  'sad': 1,
  'neutral': 2,
  'good': 3,
  'great': 4,
};

const valueToMood: Record<number, string> = {
  1: 'sad',
  2: 'neutral',
  3: 'good',
  4: 'great',
};

const MOODS = [
  { emoji: '😞', label: 'Sad', value: 'sad' },
  { emoji: '😐', label: 'Neutral', value: 'neutral' },
  { emoji: '🙂', label: 'Good', value: 'good' },
  { emoji: '😄', label: 'Great', value: 'great' },
];

const Progress = () => {
  const [selectedMood, setSelectedMood] = useState<string | null>(null);
  const [feedback, setFeedback] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const { toast } = useToast();

  // Get mood history data
  const moodEntries = getRecentMoodEntries(5);
  
  const chartData = moodEntries.map((entry) => {
    const date = new Date(entry.timestamp);
    return {
      name: `${date.getMonth() + 1}/${date.getDate()}`,
      Mood: moodToValue[entry.mood],
      Stress: entry.stressLevel / 2.5, // Scale stress level to 0-4 range for chart
      timestamp: entry.timestamp,
    };
  });

  const handleMoodUpdate = () => {
    if (!selectedMood) {
      toast({
        title: "Mood selection needed",
        description: "Please select how you're feeling now",
        variant: "destructive",
      });
      return;
    }
    
    // Add the new mood entry
    addMoodEntry(selectedMood, 5); // Default stress level to mid-point
    
    toast({
      title: "Mood updated",
      description: "Your current mood has been saved",
    });
    
    // Reset selection
    setSelectedMood(null);
    
    // Force rerender to update chart
    window.location.reload();
  };

  const handleSubmitFeedback = () => {
    if (!feedback.trim()) {
      toast({
        title: "Feedback needed",
        description: "Please enter some feedback",
        variant: "destructive",
      });
      return;
    }
    
    // In a real app, this would send feedback to a server
    console.log('Feedback submitted:', feedback);
    
    toast({
      title: "Thank you!",
      description: "Your feedback has been submitted",
    });
    
    // Clear form and show thank you message
    setFeedback('');
    setSubmitted(true);
    
    // Reset after 5 seconds
    setTimeout(() => {
      setSubmitted(false);
    }, 5000);
  };

  const formatYAxis = (value: number) => {
    return moodToEmoji[valueToMood[value]] || '';
  };

  const formatTooltip = (value: number, name: string) => {
    if (name === 'Mood') {
      return valueToMood[value] || '';
    }
    if (name === 'Stress') {
      return `${(value * 2.5).toFixed(1)}/10`;
    }
    return value;
  };

  return (
    <Layout 
      title="Your Progress" 
      subtitle="Track your mood and wellness journey"
      activePage="progress"
    >
      <div className="space-y-6 animate-fade-in">
        <div className="bg-white rounded-2xl shadow-sm p-6 card-gradient">
          <h2 className="text-xl font-medium mb-2">How are you feeling now?</h2>
          <div className="flex justify-between items-center my-6">
            {MOODS.map((mood) => (
              <button
                key={mood.value}
                onClick={() => setSelectedMood(mood.value)}
                className={`flex flex-col items-center p-3 rounded-lg transition-all duration-300 ${
                  selectedMood === mood.value
                    ? "bg-serenity-green/20 scale-110"
                    : "hover:bg-gray-50"
                }`}
              >
                <span className="text-4xl mb-2">{mood.emoji}</span>
                <span className="text-xs text-gray-700">{mood.label}</span>
              </button>
            ))}
          </div>
          <Button 
            onClick={handleMoodUpdate}
            className="w-full green-gradient border-0 hover:opacity-90"
          >
            Update Mood
          </Button>
        </div>

        <div className="bg-white rounded-2xl shadow-sm p-6 card-gradient">
          <h2 className="text-xl font-medium mb-4">Mood History</h2>
          {chartData.length > 0 ? (
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart
                  data={chartData}
                  margin={{ top: 10, right: 10, left: 10, bottom: 10 }}
                >
                  <XAxis dataKey="name" />
                  <YAxis 
                    domain={[0, 5]} 
                    tickCount={5}
                    tickFormatter={formatYAxis}
                  />
                  <Tooltip formatter={formatTooltip} />
                  <Line
                    type="monotone"
                    dataKey="Mood"
                    stroke="#B7E4C7"
                    strokeWidth={2}
                    activeDot={{ r: 8 }}
                  />
                  <Line
                    type="monotone"
                    dataKey="Stress"
                    stroke="#A9D6E5"
                    strokeWidth={2}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          ) : (
            <div className="text-center py-10 text-gray-500">
              <p>No mood data available yet. Start by logging your mood.</p>
            </div>
          )}
        </div>

        <div className="bg-white rounded-2xl shadow-sm p-6 card-gradient">
          <h2 className="text-xl font-medium mb-4">Share Your Experience</h2>
          {submitted ? (
            <div className="text-center py-6">
              <div className="text-4xl mb-2">🙏</div>
              <h3 className="text-xl font-medium mb-2">Thanks for sharing with us</h3>
              <p className="text-gray-600">Your feedback helps us improve the app for everyone.</p>
            </div>
          ) : (
            <>
              <Textarea
                placeholder="How has your experience with Serenity Breather been? Any features you'd like to see?"
                value={feedback}
                onChange={(e) => setFeedback(e.target.value)}
                className="min-h-[120px] mb-4"
              />
              <Button 
                onClick={handleSubmitFeedback}
                className="w-full blue-gradient border-0 hover:opacity-90"
              >
                Submit Feedback
              </Button>
            </>
          )}
        </div>
      </div>
    </Layout>
  );
};

export default Progress;
