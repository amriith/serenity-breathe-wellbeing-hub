
import React, { useState, useEffect } from 'react';
import { useToast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import Layout from '@/components/Layout';
import { addMoodEntry } from '@/lib/userDataService';
import { useNavigate } from 'react-router-dom';

const MOODS = [
  { emoji: '😞', label: 'Sad', value: 'sad' },
  { emoji: '😐', label: 'Neutral', value: 'neutral' },
  { emoji: '🙂', label: 'Good', value: 'good' },
  { emoji: '😄', label: 'Great', value: 'great' },
];

const QUOTES = [
  { text: "Breathe in peace, breathe out stress.", mood: "sad" },
  { text: "Every breath is a fresh beginning.", mood: "neutral" },
  { text: "Calm mind, calm life.", mood: "good" },
  { text: "Your peace is your power.", mood: "great" },
  { text: "This moment is yours to embrace.", mood: "any" },
];

const Home = () => {
  const [selectedMood, setSelectedMood] = useState<string | null>(null);
  const [stressLevel, setStressLevel] = useState<number>(5);
  const [quote, setQuote] = useState<string>("");
  const { toast } = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    // Select a relevant quote based on mood or pick a general one
    if (selectedMood) {
      const relevantQuotes = QUOTES.filter(q => q.mood === selectedMood || q.mood === 'any');
      const randomQuote = relevantQuotes[Math.floor(Math.random() * relevantQuotes.length)];
      setQuote(randomQuote.text);
    }
  }, [selectedMood]);

  const handleContinue = () => {
    if (!selectedMood) {
      toast({
        title: "Mood selection needed",
        description: "Please select how you're feeling today",
        variant: "destructive",
      });
      return;
    }
    
    // Save the mood data
    addMoodEntry(selectedMood, stressLevel);
    
    // Suggest a route based on stress level
    if (stressLevel > 7) {
      toast({
        title: "Breathing exercise recommended",
        description: "Let's try a calming breathing exercise",
      });
      navigate("/breathing");
    } else if (stressLevel > 4) {
      toast({
        title: "Music therapy recommended",
        description: "Some calming music might help you relax",
      });
      navigate("/music");
    } else {
      toast({
        title: "Mood tracked successfully",
        description: "Feel free to explore the app",
      });
    }
  };

  return (
    <Layout title="Welcome" subtitle="How are you feeling today?" activePage="home">
      <div className="space-y-8 animate-fade-in">
        <div className="bg-white rounded-2xl shadow-sm p-6 card-gradient">
          <h2 className="text-xl font-medium mb-4">Select your mood</h2>
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
                <span className="text-sm text-gray-700">{mood.label}</span>
              </button>
            ))}
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-sm p-6 card-gradient">
          <h2 className="text-xl font-medium mb-4">Stress level</h2>
          <div className="py-4">
            <Slider
              defaultValue={[5]}
              max={10}
              step={1}
              value={[stressLevel]}
              onValueChange={(value) => setStressLevel(value[0])}
              className="my-6"
            />
            <div className="flex justify-between text-sm text-gray-500 mt-2">
              <span>Low (0)</span>
              <span>High (10)</span>
            </div>
          </div>
          <div className="text-center mt-2 text-gray-600">
            Selected: {stressLevel}/10
          </div>
        </div>

        {quote && (
          <div className="text-center p-4 italic text-gray-600">
            "{quote}"
          </div>
        )}

        <Button 
          onClick={handleContinue}
          className="w-full py-6 text-lg green-gradient border-0 hover:opacity-90 transition-opacity rounded-xl"
        >
          Continue
        </Button>
      </div>
    </Layout>
  );
};

export default Home;
