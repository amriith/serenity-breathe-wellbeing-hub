
import React, { useState, useRef, useEffect } from 'react';
import Layout from '@/components/Layout';
import { Heart } from 'lucide-react';
import { Slider } from '@/components/ui/slider';
import { Button } from '@/components/ui/button';
import { toggleFavorite, isFavorite } from '@/lib/userDataService';
import { cn } from '@/lib/utils';

interface Track {
  id: string;
  title: string;
  artist: string;
  category: 'nature' | 'lofi' | 'ocean' | 'piano';
  url: string;
  duration: number; // in seconds
}

const MUSIC_TRACKS: Track[] = [
  { 
    id: 'nature-1', 
    title: 'Forest Ambience', 
    artist: 'Nature Sounds', 
    category: 'nature', 
    url: 'https://assets.mixkit.co/sfx/preview/mixkit-forest-birds-ambience-1210.mp3', 
    duration: 180 
  },
  { 
    id: 'nature-2', 
    title: 'Morning Birds', 
    artist: 'Nature Sounds', 
    category: 'nature', 
    url: 'https://assets.mixkit.co/sfx/preview/mixkit-forest-bird-chirp-singing-68.mp3', 
    duration: 150 
  },
  { 
    id: 'lofi-1', 
    title: 'Study Beats', 
    artist: 'Lo-Fi Records', 
    category: 'lofi', 
    url: 'https://assets.mixkit.co/sfx/preview/mixkit-lo-fi-daily-vlog-opener-2332.mp3', 
    duration: 210 
  },
  { 
    id: 'lofi-2', 
    title: 'Chill Afternoon', 
    artist: 'Lo-Fi Records', 
    category: 'lofi', 
    url: 'https://assets.mixkit.co/sfx/preview/mixkit-technical-vlog-opener-2334.mp3', 
    duration: 190 
  },
  { 
    id: 'ocean-1', 
    title: 'Ocean Waves', 
    artist: 'Ocean Sounds', 
    category: 'ocean', 
    url: 'https://assets.mixkit.co/sfx/preview/mixkit-sea-waves-loop-1196.mp3', 
    duration: 240 
  },
  { 
    id: 'ocean-2', 
    title: 'Beach Sunset', 
    artist: 'Ocean Sounds', 
    category: 'ocean',
    url: 'https://assets.mixkit.co/sfx/preview/mixkit-beach-waves-loop-1200.mp3',  
    duration: 220 
  },
  { 
    id: 'piano-1', 
    title: 'Peaceful Piano', 
    artist: 'Piano Calm', 
    category: 'piano', 
    url: 'https://assets.mixkit.co/sfx/preview/mixkit-simple-melody-piano-loop-786.mp3', 
    duration: 200 
  },
  { 
    id: 'piano-2', 
    title: 'Moonlight Sonata', 
    artist: 'Piano Calm', 
    category: 'piano', 
    url: 'https://assets.mixkit.co/sfx/preview/mixkit-sad-piano-tone-2828.mp3', 
    duration: 230 
  }
];

const CATEGORIES = [
  { id: 'nature', name: 'Nature Sounds', color: 'green' },
  { id: 'lofi', name: 'Lo-fi Beats', color: 'purple' },
  { id: 'ocean', name: 'Ocean Waves', color: 'blue' },
  { id: 'piano', name: 'Piano Calm', color: 'indigo' }
];

const Music = () => {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [currentTrack, setCurrentTrack] = useState<Track | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolume] = useState(70);
  const [progress, setProgress] = useState(0);
  const [favorites, setFavorites] = useState<Record<string, boolean>>({});
  
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const progressIntervalRef = useRef<number | null>(null);

  // Load favorites on mount
  useEffect(() => {
    const loadedFavorites: Record<string, boolean> = {};
    MUSIC_TRACKS.forEach(track => {
      loadedFavorites[track.id] = isFavorite(track.id);
    });
    setFavorites(loadedFavorites);
  }, []);

  // Handle audio element setup
  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = volume / 100;
      
      const handleTrackEnd = () => {
        setIsPlaying(false);
        setProgress(0);
      };
      
      audioRef.current.addEventListener('ended', handleTrackEnd);
      
      return () => {
        audioRef.current?.removeEventListener('ended', handleTrackEnd);
      };
    }
  }, [volume]);

  // Handle play/pause
  useEffect(() => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.play().catch(err => {
          console.error('Failed to play audio:', err);
          setIsPlaying(false);
        });
        
        // Set up progress tracking
        if (progressIntervalRef.current) {
          clearInterval(progressIntervalRef.current);
        }
        
        progressIntervalRef.current = window.setInterval(() => {
          if (audioRef.current) {
            setProgress((audioRef.current.currentTime / audioRef.current.duration) * 100);
          }
        }, 1000) as unknown as number;
      } else {
        audioRef.current.pause();
        
        if (progressIntervalRef.current) {
          clearInterval(progressIntervalRef.current);
          progressIntervalRef.current = null;
        }
      }
    }
    
    return () => {
      if (progressIntervalRef.current) {
        clearInterval(progressIntervalRef.current);
      }
    };
  }, [isPlaying]);

  const handleCategorySelect = (categoryId: string) => {
    setSelectedCategory(categoryId === selectedCategory ? null : categoryId);
  };

  const handleTrackSelect = (track: Track) => {
    // If selecting the same track, toggle play/pause
    if (currentTrack?.id === track.id) {
      setIsPlaying(!isPlaying);
      return;
    }
    
    setCurrentTrack(track);
    setIsPlaying(true);
    setProgress(0);
  };

  const handleVolumeChange = (newVolume: number[]) => {
    const vol = newVolume[0];
    setVolume(vol);
    if (audioRef.current) {
      audioRef.current.volume = vol / 100;
    }
  };

  const handleToggleFavorite = (trackId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    const isFav = toggleFavorite(trackId);
    setFavorites(prev => ({
      ...prev,
      [trackId]: isFav
    }));
  };

  const filteredTracks = selectedCategory 
    ? MUSIC_TRACKS.filter(track => track.category === selectedCategory)
    : MUSIC_TRACKS;

  return (
    <Layout 
      title="Music Therapy" 
      subtitle="Relax with calming sounds"
      activePage="music"
    >
      <div className="space-y-6 animate-fade-in">
        <div className="grid grid-cols-2 gap-3">
          {CATEGORIES.map((category) => (
            <button
              key={category.id}
              onClick={() => handleCategorySelect(category.id)}
              className={`p-4 rounded-xl text-left transition-all ${
                selectedCategory === category.id 
                  ? 'blue-gradient shadow-md scale-105' 
                  : 'bg-white shadow-sm hover:shadow'
              }`}
            >
              <h3 className="font-medium mb-1">{category.name}</h3>
              <p className="text-xs text-gray-600">
                {MUSIC_TRACKS.filter(t => t.category === category.id).length} tracks
              </p>
            </button>
          ))}
        </div>

        <div className="space-y-3 mt-4">
          {filteredTracks.map((track) => (
            <div
              key={track.id}
              onClick={() => handleTrackSelect(track)}
              className={`p-4 rounded-xl cursor-pointer flex items-center justify-between ${
                currentTrack?.id === track.id 
                  ? 'bg-serenity-blue/20 border border-serenity-blue/30' 
                  : 'bg-white hover:bg-gray-50'
              }`}
            >
              <div>
                <h3 className="font-medium">{track.title}</h3>
                <p className="text-xs text-gray-600">{track.artist}</p>
              </div>
              <div className="flex items-center space-x-3">
                <button
                  onClick={(e) => handleToggleFavorite(track.id, e)}
                  className={cn(
                    "p-2 rounded-full transition-colors",
                    favorites[track.id] ? "text-red-500" : "text-gray-400 hover:text-gray-600"
                  )}
                >
                  <Heart className={favorites[track.id] ? "fill-red-500" : ""} size={18} />
                </button>
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-8 w-8 p-0 rounded-full"
                >
                  {currentTrack?.id === track.id && isPlaying ? (
                    <span className="font-bold">⏸</span>
                  ) : (
                    <span className="font-bold">▶️</span>
                  )}
                </Button>
              </div>
            </div>
          ))}
        </div>

        {currentTrack && (
          <div className="fixed bottom-20 left-0 right-0 bg-white p-4 shadow-lg border-t">
            <div className="max-w-md mx-auto">
              <div className="flex items-center justify-between mb-2">
                <div>
                  <h3 className="font-medium">{currentTrack.title}</h3>
                  <p className="text-xs text-gray-600">{currentTrack.artist}</p>
                </div>
                <div className="flex items-center">
                  <button
                    onClick={() => setIsPlaying(!isPlaying)}
                    className="h-10 w-10 rounded-full bg-serenity-blue flex items-center justify-center text-white"
                  >
                    {isPlaying ? (
                      <span className="text-lg">⏸</span>
                    ) : (
                      <span className="text-lg">▶️</span>
                    )}
                  </button>
                </div>
              </div>
              
              <div className="relative h-2 bg-gray-200 rounded-full overflow-hidden">
                <div 
                  className="absolute top-0 left-0 h-full music-waveform"
                  style={{ width: `${progress}%` }}
                ></div>
              </div>
              
              <div className="flex items-center mt-3">
                <span className="text-xs text-gray-500 mr-2">Volume</span>
                <Slider
                  value={[volume]}
                  onValueChange={handleVolumeChange}
                  max={100}
                  step={1}
                  className="flex-1"
                />
              </div>
            </div>
          </div>
        )}

        <audio 
          ref={audioRef}
          src={currentTrack?.url}
          preload="auto"
        />
      </div>
    </Layout>
  );
};

export default Music;
