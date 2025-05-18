
import React, { useState, useEffect, useRef } from 'react';
import Layout from '@/components/Layout';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';

interface BreathingPattern {
  id: string;
  name: string;
  inhale: number;
  hold?: number;
  exhale: number;
  postExhaleHold?: number;
}

const BREATHING_PATTERNS: BreathingPattern[] = [
  { id: 'box', name: 'Box Breathing', inhale: 4, hold: 4, exhale: 4, postExhaleHold: 4 },
  { id: '478', name: '4-7-8 Breathing', inhale: 4, hold: 7, exhale: 8 },
  { id: 'deep', name: 'Deep Breathing', inhale: 5, hold: 2, exhale: 5 }
];

const AUDIO = {
  ocean: { name: 'Ocean Waves', url: 'https://assets.mixkit.co/sfx/preview/mixkit-sea-waves-loop-1196.mp3' },
  lofi: { name: 'Lo-fi Beats', url: 'https://assets.mixkit.co/sfx/preview/mixkit-lo-fi-daily-vlog-opener-2332.mp3' },
  nature: { name: 'Forest Sounds', url: 'https://assets.mixkit.co/sfx/preview/mixkit-forest-birds-ambience-1210.mp3' }
};

const Breathing = () => {
  const [pattern, setPattern] = useState<BreathingPattern>(BREATHING_PATTERNS[0]);
  const [isActive, setIsActive] = useState(false);
  const [phase, setPhase] = useState<'inhale' | 'hold' | 'exhale' | 'post-exhale-hold'>('inhale');
  const [timer, setTimer] = useState(0);
  const [playSound, setPlaySound] = useState(false);
  const [voiceGuide, setVoiceGuide] = useState(false);
  const [instruction, setInstruction] = useState('');

  const audioRef = useRef<HTMLAudioElement | null>(null);
  const animationRef = useRef<number | null>(null);

  // Handle pattern change
  const handlePatternChange = (newPatternId: string) => {
    const newPattern = BREATHING_PATTERNS.find(p => p.id === newPatternId) || BREATHING_PATTERNS[0];
    setPattern(newPattern);
    
    // Reset if active
    if (isActive) {
      setIsActive(false);
      setPhase('inhale');
      setTimer(0);
    }
  };

  // Handle sound toggle
  useEffect(() => {
    if (audioRef.current) {
      if (playSound && isActive) {
        audioRef.current.play().catch(err => console.error('Failed to play audio:', err));
      } else {
        audioRef.current.pause();
      }
    }
  }, [playSound, isActive]);

  // Animation and timing logic
  useEffect(() => {
    if (!isActive) {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
      return;
    }

    let lastTime = performance.now();
    let elapsed = 0;

    const animate = (currentTime: number) => {
      const deltaTime = currentTime - lastTime;
      lastTime = currentTime;
      
      elapsed += deltaTime / 1000; // Convert to seconds
      setTimer(prev => {
        const newTimer = prev + deltaTime / 1000;
        
        // Phase transition logic based on the current pattern
        let phaseDuration = 0;
        
        switch(phase) {
          case 'inhale':
            phaseDuration = pattern.inhale;
            if (newTimer >= phaseDuration) {
              setPhase(pattern.hold ? 'hold' : 'exhale');
              return 0; // Reset timer for next phase
            }
            setInstruction('Inhale slowly...');
            break;
            
          case 'hold':
            phaseDuration = pattern.hold || 0;
            if (newTimer >= phaseDuration) {
              setPhase('exhale');
              return 0;
            }
            setInstruction('Hold your breath...');
            break;
            
          case 'exhale':
            phaseDuration = pattern.exhale;
            if (newTimer >= phaseDuration) {
              if (pattern.postExhaleHold) {
                setPhase('post-exhale-hold');
              } else {
                setPhase('inhale');
              }
              return 0;
            }
            setInstruction('Exhale slowly...');
            break;
            
          case 'post-exhale-hold':
            phaseDuration = pattern.postExhaleHold || 0;
            if (newTimer >= phaseDuration) {
              setPhase('inhale');
              return 0;
            }
            setInstruction('Hold before inhaling...');
            break;
        }
        
        return newTimer;
      });
      
      animationRef.current = requestAnimationFrame(animate);
    };
    
    animationRef.current = requestAnimationFrame(animate);
    
    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [isActive, phase, pattern]);

  const toggleActive = () => {
    setIsActive(prev => !prev);
    if (!isActive) {
      setPhase('inhale');
      setTimer(0);
    }
  };

  return (
    <Layout 
      title="Breathing Exercise" 
      subtitle="Follow the rhythm for calm and focus"
      activePage="breathing"
    >
      <div className="space-y-6 animate-fade-in">
        <div className="relative flex justify-center items-center h-60 my-4">
          <div 
            className={`breathing-circle w-40 h-40 flex items-center justify-center text-white text-lg font-medium ${
              isActive ? 'animate-pulse-circle' : ''
            } ${
              phase === 'inhale' ? 'breathing-circle-expanded' : 
              phase === 'exhale' ? 'breathing-circle-contracted' : ''
            }`}
          >
            {instruction || "Ready"}
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-sm p-6 card-gradient space-y-4">
          <div className="space-y-2">
            <Label htmlFor="pattern-select" className="text-gray-700">Breathing Pattern</Label>
            <Select onValueChange={handlePatternChange} defaultValue={pattern.id}>
              <SelectTrigger id="pattern-select" className="w-full">
                <SelectValue placeholder="Select a pattern" />
              </SelectTrigger>
              <SelectContent>
                {BREATHING_PATTERNS.map(p => (
                  <SelectItem key={p.id} value={p.id}>
                    {p.name} ({p.inhale}-{p.hold || 0}-{p.exhale})
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="flex items-center justify-between">
            <Label htmlFor="sound-toggle" className="text-gray-700">Calming Sounds</Label>
            <Switch 
              id="sound-toggle" 
              checked={playSound} 
              onCheckedChange={setPlaySound} 
            />
          </div>

          <div className="flex items-center justify-between">
            <Label htmlFor="voice-toggle" className="text-gray-700">Voice Guide</Label>
            <Switch 
              id="voice-toggle" 
              checked={voiceGuide} 
              onCheckedChange={setVoiceGuide} 
            />
          </div>
        </div>

        <Button 
          onClick={toggleActive}
          className={`w-full py-6 text-lg ${isActive ? 'bg-red-400 hover:bg-red-500' : 'green-gradient hover:opacity-90'} border-0 transition-all rounded-xl`}
        >
          {isActive ? 'Pause Exercise' : 'Start Exercise'}
        </Button>
        
        {/* Hidden audio element for background sounds */}
        <audio 
          ref={audioRef} 
          src={AUDIO.ocean.url} 
          loop 
        />
      </div>
    </Layout>
  );
};

export default Breathing;
