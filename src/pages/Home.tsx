import React, { useState, useEffect } from 'react';
import { useToast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { Input } from '@/components/ui/input';
import { LogIn, User, ArrowRight, Play, Heart } from 'lucide-react';
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
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);
  const [username, setUsername] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const { toast } = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    // Check if user is already logged in
    const savedUser = localStorage.getItem('serenity_user');
    if (savedUser) {
      setIsLoggedIn(true);
      setUsername(JSON.parse(savedUser).username);
    }
  }, []);

  useEffect(() => {
    // Select a relevant quote based on mood or pick a general one
    if (selectedMood) {
      const relevantQuotes = QUOTES.filter(q => q.mood === selectedMood || q.mood === 'any');
      const randomQuote = relevantQuotes[Math.floor(Math.random() * relevantQuotes.length)];
      setQuote(randomQuote.text);
    }
  }, [selectedMood]);

  const handleLogin = () => {
    if (!username.trim() || !email.trim()) {
      toast({
        title: "Login details required",
        description: "Please enter both username and email",
        variant: "destructive",
      });
      return;
    }
    
    // Save user data
    localStorage.setItem('serenity_user', JSON.stringify({ username, email }));
    setIsLoggedIn(true);
    
    toast({
      title: "Welcome to Serenity Breather!",
      description: `Hello ${username}, let's start your wellness journey`,
    });
  };

  const handleLogout = () => {
    localStorage.removeItem('serenity_user');
    setIsLoggedIn(false);
    setUsername("");
    setEmail("");
    setSelectedMood(null);
    setStressLevel(5);
    setQuote("");
    
    toast({
      title: "Logged out",
      description: "Thank you for using Serenity Breather",
    });
  };

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

  const handleTryDemo = () => {
    toast({
      title: "Demo Mode",
      description: "Let's try a quick breathing exercise!",
    });
    navigate("/breathing");
  };

  const handleExploreMusic = () => {
    toast({
      title: "Discover Calm",
      description: "Explore our collection of soothing sounds",
    });
    navigate("/music");
  };

  const handleViewProgress = () => {
    if (!isLoggedIn) {
      toast({
        title: "Login Required",
        description: "Please log in to view your progress",
        variant: "destructive",
      });
      return;
    }
    navigate("/progress");
  };

  return (
    <Layout title="Serenity Breather" subtitle="Your personal wellness companion" activePage="home">
      <div className="space-y-8 animate-fade-in">
        {/* Login Section */}
        {!isLoggedIn ? (
          <div className="bg-white rounded-2xl shadow-sm p-6 card-gradient">
            <div className="flex items-center mb-4">
              <LogIn className="w-6 h-6 text-serenity-green mr-2" />
              <h2 className="text-xl font-medium">Welcome</h2>
            </div>
            <div className="space-y-4">
              <Input
                type="text"
                placeholder="Enter your username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="rounded-xl"
              />
              <Input
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="rounded-xl"
              />
              <Button 
                onClick={handleLogin}
                className="w-full py-3 green-gradient border-0 hover:opacity-90 transition-opacity rounded-xl"
              >
                <LogIn className="w-4 h-4 mr-2" />
                Start Your Journey
              </Button>
            </div>
          </div>
        ) : (
          <div className="bg-white rounded-2xl shadow-sm p-6 card-gradient">
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <User className="w-6 h-6 text-serenity-green mr-2" />
                <div>
                  <h2 className="text-xl font-medium">Welcome back, {username}!</h2>
                  <p className="text-sm text-gray-600">Ready for your wellness check-in?</p>
                </div>
              </div>
              <Button 
                onClick={handleLogout}
                variant="outline"
                size="sm"
                className="rounded-xl"
              >
                Logout
              </Button>
            </div>
          </div>
        )}

        {/* App Description */}
        <div className="bg-white rounded-2xl shadow-sm p-6 card-gradient">
          <h3 className="text-lg font-medium mb-3 text-serenity-green">About Serenity Breather</h3>
          <p className="text-gray-700 leading-relaxed mb-4">
            Designed specifically for university students, Serenity Breather helps you manage stress, 
            anxiety, and emotional overload through personalized breathing exercises, calming music, 
            and daily wellness tracking. Take a moment for yourself and find your inner peace.
          </p>
          
          {/* Call to Action Buttons */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mt-6">
            <Button 
              onClick={handleTryDemo}
              variant="outline"
              className="flex items-center justify-center py-3 rounded-xl border-serenity-green text-serenity-green hover:bg-serenity-green hover:text-white transition-all"
            >
              <Play className="w-4 h-4 mr-2" />
              Try Demo
            </Button>
            <Button 
              onClick={handleExploreMusic}
              variant="outline"
              className="flex items-center justify-center py-3 rounded-xl border-blue-400 text-blue-600 hover:bg-blue-400 hover:text-white transition-all"
            >
              <Heart className="w-4 h-4 mr-2" />
              Explore Music
            </Button>
            <Button 
              onClick={handleViewProgress}
              variant="outline"
              className="flex items-center justify-center py-3 rounded-xl border-purple-400 text-purple-600 hover:bg-purple-400 hover:text-white transition-all"
            >
              <ArrowRight className="w-4 h-4 mr-2" />
              View Progress
            </Button>
          </div>
        </div>

        {/* Existing mood tracking functionality */}
        {isLoggedIn && (
          <>
            <div className="bg-white rounded-2xl shadow-sm p-6 card-gradient">
              <h2 className="text-xl font-medium mb-4">How are you feeling today?</h2>
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
              <ArrowRight className="w-5 h-5 mr-2" />
              Continue
            </Button>
          </>
        )}
      </div>
    </Layout>
  );
};

export default Home;
