import React from 'react';
import { Sparkles } from 'lucide-react';
import { FeelingsBox } from './FeelingsBox';

interface SurpriseScreenProps {
  showFeelingsBox: boolean;
  feelingsSubmitted: boolean;
  userFeelings: string;
  setUserFeelings: (value: string) => void;
  isSubmittingFeelings: boolean;
  onSubmitFeelings: () => void;
  onKeepForever: () => void;
  onCancelFeelings: () => void;
  onNavigateHome: () => void;
}

export const SurpriseScreen: React.FC<SurpriseScreenProps> = ({
  showFeelingsBox,
  feelingsSubmitted,
  userFeelings,
  setUserFeelings,
  isSubmittingFeelings,
  onSubmitFeelings,
  onKeepForever,
  onCancelFeelings,
  onNavigateHome
}) => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-teal-50 via-blue-50 to-indigo-50 p-4 sm:p-6">
      <div className="max-w-4xl mx-auto px-2 sm:px-0">
        <button
          onClick={onNavigateHome}
          className="mb-6 sm:mb-8 text-gray-600 hover:text-gray-800 transition-colors flex items-center gap-2 text-sm sm:text-base"
        >
          ← Back to Home
        </button>
        
        <div className="text-center">
          <div className="mb-8 sm:mb-12 px-4">
            <Sparkles className="w-12 h-12 sm:w-16 sm:h-16 text-teal-400 mx-auto mb-6 sm:mb-8 animate-pulse" />
            <h2 className="text-2xl sm:text-3xl font-light text-gray-700 mb-6 sm:mb-8">The Surprise</h2>
          </div>
          
          <div className="max-w-2xl mx-auto space-y-6 sm:space-y-8">
            {!showFeelingsBox && !feelingsSubmitted && (
              <div className="bg-white rounded-xl p-6 sm:p-8 shadow-lg">
                <p className="text-base sm:text-lg text-gray-600 italic leading-relaxed mb-6">
                  I couldn't change the past, but maybe in another world… another life… we would've had our beginning.
                </p>
                
                <p className="text-base sm:text-lg text-gray-600 italic leading-relaxed mb-6">
                  I hope this gift made you smile, even if only for a moment.
                </p>
                
                <div className="border-t pt-6">
                  <p className="text-lg sm:text-xl font-light text-gray-700 italic">
                    Goodbye for now. But not forever. Next time, I promise… I'll tell you sooner.
                  </p>
                </div>
              </div>
            )}
            
            {showFeelingsBox && !feelingsSubmitted && (
              <FeelingsBox
                userFeelings={userFeelings}
                setUserFeelings={setUserFeelings}
                isSubmittingFeelings={isSubmittingFeelings}
                onSubmit={onSubmitFeelings}
                onCancel={onCancelFeelings}
              />
            )}
            
            {feelingsSubmitted && (
              <div className="bg-gradient-to-br from-pink-50 to-purple-50 rounded-xl p-6 sm:p-8 shadow-lg border border-pink-200">
                <div className="text-center space-y-4">
                  <div className="w-16 h-16 bg-gradient-to-r from-pink-400 to-purple-500 rounded-full flex items-center justify-center mx-auto shadow-lg">
                    <Sparkles className="w-8 h-8 text-white animate-pulse" />
                  </div>
                  
                  <h3 className="text-xl sm:text-2xl font-semibold bg-gradient-to-r from-pink-600 to-purple-600 bg-clip-text text-transparent">
                    Thank You ✨
                  </h3>
                  
                  <p className="text-sm sm:text-base text-gray-700 italic leading-relaxed max-w-md mx-auto">
                    Your feelings have been saved in my heart forever. This memory, and your words, will always be treasured.
                  </p>
                  
                  <div className="pt-4 border-t border-pink-200">
                    <p className="text-sm text-gray-600 italic">
                      "Some connections transcend time and space..."
                    </p>
                  </div>
                </div>
              </div>
            )}
            
            {!showFeelingsBox && !feelingsSubmitted && (
              <>
                <div className="space-y-4">
                  <p className="text-sm sm:text-base text-gray-600 italic px-4">
                    Do you want to keep this memory forever, or let it rest in your heart?
                  </p>
                  <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center px-4">
                    <button 
                      onClick={onKeepForever}
                      className="bg-gradient-to-r from-pink-400 to-purple-500 text-white px-4 sm:px-6 py-3 rounded-full hover:shadow-lg transform hover:scale-105 transition-all duration-300 text-sm sm:text-base"
                    >
                      Keep Forever
                    </button>
                    <button 
                      onClick={onCancelFeelings}
                      className="bg-gradient-to-r from-gray-400 to-gray-500 text-white px-4 sm:px-6 py-3 rounded-full hover:shadow-lg transform hover:scale-105 transition-all duration-300 text-sm sm:text-base"
                    >
                      Let It Rest
                    </button>
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};