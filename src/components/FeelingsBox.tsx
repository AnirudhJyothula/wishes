import React, { useRef } from 'react';
import { Heart } from 'lucide-react';

interface FeelingsBoxProps {
  userFeelings: string;
  setUserFeelings: (value: string) => void;
  isSubmittingFeelings: boolean;
  onSubmit: () => void;
  onCancel: () => void;
}

export const FeelingsBox: React.FC<FeelingsBoxProps> = ({ 
  userFeelings, 
  setUserFeelings, 
  isSubmittingFeelings, 
  onSubmit, 
  onCancel 
}) => {
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  
  const handleTextareaChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setUserFeelings(e.target.value);
  };
  
  return (
    <div className="bg-white rounded-xl p-6 sm:p-8 shadow-lg space-y-6">
      <div className="text-center">
      <Heart className="w-12 h-12 text-pink-400 mx-auto mb-4 animate-pulse" fill="currentColor" />
        <h3 className="text-xl sm:text-2xl font-semibold text-gray-800 mb-2">Share Your Feelings</h3>
        <p className="text-sm sm:text-base text-gray-600 italic">
          How did this make you feel? Your words will be treasured forever...
        </p>
      </div>
      
      <div className="space-y-4">
        <textarea
          ref={textareaRef}
          value={userFeelings}
          onChange={handleTextareaChange}
          placeholder="Write your thoughts, feelings, or anything you'd like to share..."
          className="w-full h-32 sm:h-40 p-4 border-2 border-pink-200 rounded-xl resize-none focus:border-pink-400 focus:outline-none text-gray-700 placeholder-gray-400"
          style={{ transition: 'none' }}
        />
        
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <button
            onClick={onSubmit}
            disabled={!userFeelings.trim() || isSubmittingFeelings}
            className="bg-gradient-to-r from-pink-400 to-purple-500 text-white px-6 sm:px-8 py-3 rounded-full text-sm sm:text-base font-medium disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 justify-center"
          >
            {isSubmittingFeelings ? (
              <>
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full"></div>
                <span>Saving...</span>
              </>
            ) : (
              <>
                <Heart className="w-4 h-4" fill="currentColor" />
                <span>Keep Forever</span>
              </>
            )}
          </button>
          
          <button
            onClick={onCancel}
            className="bg-gradient-to-r from-gray-400 to-gray-500 text-white px-6 sm:px-8 py-3 rounded-full text-sm sm:text-base font-medium"
          >
            Maybe Later
          </button>
        </div>
      </div>
    </div>
  );
};