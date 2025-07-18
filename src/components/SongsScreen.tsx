import React, { useRef, useState } from 'react';
import { Heart } from 'lucide-react';

interface SongsScreenProps {
  onNavigateHome: () => void;
}

export const SongsScreen: React.FC<SongsScreenProps> = ({ onNavigateHome }) => {
  const [currentlyPlaying, setCurrentlyPlaying] = useState<number | null>(null);
  const audioRefs = useRef<(HTMLAudioElement | null)[]>([]);

  const songs = [
    { title: "You Are the Reason", caption: "Because you truly were.", audioFile: "/wishes/songs/sita.mp3" },
    { title: "Perfect", caption: "Because I imagined our first dance.", audioFile: "/wishes/songs/Kumkumala.mp3" },
    { title: "Dream", caption: "Because you made life beautiful.", audioFile: "/wishes/songs/PremaVelluva.mp3" }
  ];

  const handlePlayPause = (index: number) => {
    const audio = audioRefs.current[index];
    if (!audio) return;
    
    if (currentlyPlaying === index) {
      // Pause current song
      audio.pause();
      setCurrentlyPlaying(null);
    } else {
      // Stop any currently playing song
      if (currentlyPlaying !== null && audioRefs.current[currentlyPlaying]) {
        audioRefs.current[currentlyPlaying]!.pause();
        audioRefs.current[currentlyPlaying]!.currentTime = 0;
      }
      // Play new song
      audio.play().catch(console.error);
      setCurrentlyPlaying(index);
    }
  };
  
  const handleAudioEnded = () => {
    setCurrentlyPlaying(null);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-red-50 p-4 sm:p-6">
      <div className="max-w-4xl mx-auto px-2 sm:px-0">
        <button
          onClick={onNavigateHome}
          className="mb-6 sm:mb-8 text-gray-600 hover:text-gray-800 transition-colors flex items-center gap-2 text-sm sm:text-base"
        >
          ← Back to Home
        </button>
        
        <div className="text-center mb-8 sm:mb-12 px-4">
          <h2 className="text-2xl sm:text-3xl font-light text-gray-700 mb-4">Songs for You</h2>
          <p className="text-base sm:text-lg text-gray-600 italic max-w-2xl mx-auto">
            These are not just songs. They're the background music to every moment I imagined with you.
          </p>
        </div>
        
        <div className="space-y-4 sm:space-y-6">
          {songs.map((song, index) => (
            <div key={index} className="bg-white rounded-xl p-4 sm:p-6 shadow-lg hover:shadow-xl transition-shadow">
              {/* Hidden audio element - only render if audioFile exists */}
              {song.audioFile && (
                <audio
                  ref={(el) => {
                    audioRefs.current[index] = el;
                  }}
                  src={song.audioFile}
                  onEnded={handleAudioEnded}
                  preload="metadata"
                />
              )}
              <div className="flex items-center gap-4">
                <button
                  onClick={() => handlePlayPause(index)}
                  disabled={!song.audioFile}
                  className={`w-10 h-10 sm:w-12 sm:h-12 rounded-full flex items-center justify-center flex-shrink-0 transition-all duration-300 ${
                    song.audioFile 
                      ? 'bg-gradient-to-r from-purple-400 to-pink-500 hover:shadow-lg transform hover:scale-105 cursor-pointer' 
                      : 'bg-gray-300 cursor-not-allowed opacity-50'
                  }`}
                >
                  {currentlyPlaying === index ? (
                    <div className="flex items-center justify-center gap-0.5">
                      <div className="w-1 h-3 sm:h-4 bg-white"></div>
                      <div className="w-1 h-3 sm:h-4 bg-white"></div>
                    </div>
                  ) : (
                    <div className="w-0 h-0 border-l-[6px] sm:border-l-[8px] border-l-white border-t-[4px] sm:border-t-[6px] border-t-transparent border-b-[4px] sm:border-b-[6px] border-b-transparent ml-0.5"></div>
                  )}
                </button>
                <div className="flex-1">
                  <h3 className="text-lg sm:text-xl font-semibold text-gray-800">{song.title}</h3>
                  <p className="text-sm sm:text-base text-gray-600 italic">
                    {song.caption}
                    {!song.audioFile && <span className="text-gray-400 block text-xs mt-1">(Audio not available)</span>}
                  </p>
                </div>
                <button className="text-gray-400 hover:text-gray-600 transition-colors">
                  <Heart className="w-5 h-5 sm:w-6 sm:h-6" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
