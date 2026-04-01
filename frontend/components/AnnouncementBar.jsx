import React, { useState, useEffect } from 'react';
import { X, Clock, Tag } from 'lucide-react';

const AnnouncementBar = () => {
  const [isVisible, setIsVisible] = useState(true);
  const [timeLeft, setTimeLeft] = useState({ days: 2, hours: 15, minutes: 45, seconds: 30 });

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(prev => {
        const { days, hours, minutes, seconds } = prev;
        
        if (seconds > 0) {
          return { ...prev, seconds: seconds - 1 };
        } else if (minutes > 0) {
          return { ...prev, minutes: minutes - 1, seconds: 59 };
        } else if (hours > 0) {
          return { ...prev, hours: hours - 1, minutes: 59, seconds: 59 };
        } else if (days > 0) {
          return { days: days - 1, hours: 23, minutes: 59, seconds: 59 };
        } else {
          return { days: 0, hours: 0, minutes: 0, seconds: 0 };
        }
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  if (!isVisible) return null;

  const formatNumber = (num) => num.toString().padStart(2, '0');

  return (
    <div className="bg-primary-500 text-white relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-r from-primary-600 to-primary-500 opacity-90"></div>
      
      <div className="container relative">
        <div className="flex items-center justify-center py-2 px-4">
          <div className="flex flex-col sm:flex-row items-center justify-center space-y-2 sm:space-y-0 sm:space-x-4 text-xs sm:text-sm">
            {/* Left Icon - hidden on very small screens */}
            <Tag className="w-3 h-3 sm:w-4 sm:h-4 animate-pulse-soft hidden sm:block" />
            
            {/* Main Message */}
            <div className="flex flex-col sm:flex-row items-center space-y-1 sm:space-y-0 sm:space-x-2 text-center">
              <span className="font-medium text-xs sm:text-sm">Limited Time Offer:</span>
              <span className="text-xs sm:text-sm">25% off new arrivals</span>
              <span className="bg-accent-500 px-1.5 py-0.5 rounded text-[10px] sm:text-xs font-semibold">SAVE25</span>
            </div>
            
            {/* Countdown Timer */}
            <div className="flex items-center space-x-1 sm:space-x-2">
              <Clock className="w-3 h-3 sm:w-4 sm:h-4" />
              <div className="flex items-center space-x-0.5 sm:space-x-1">
                <div className="bg-primary-600 px-1 py-0.5 sm:px-2 sm:py-1 rounded text-[10px] sm:text-xs font-mono">
                  {formatNumber(timeLeft.days)}d
                </div>
                <span className="text-[10px] sm:text-xs">:</span>
                <div className="bg-primary-600 px-1 py-0.5 sm:px-2 sm:py-1 rounded text-[10px] sm:text-xs font-mono">
                  {formatNumber(timeLeft.hours)}h
                </div>
                <span className="text-[10px] sm:text-xs">:</span>
                <div className="bg-primary-600 px-1 py-0.5 sm:px-2 sm:py-1 rounded text-[10px] sm:text-xs font-mono">
                  {formatNumber(timeLeft.minutes)}m
                </div>
                <span className="text-[10px] sm:text-xs hidden sm:inline">:</span>
                <div className="bg-primary-600 px-1 py-0.5 sm:px-2 sm:py-1 rounded text-[10px] sm:text-xs font-mono hidden sm:block">
                  {formatNumber(timeLeft.seconds)}s
                </div>
              </div>
            </div>
          </div>
          
          {/* Close Button */}
          <button
            onClick={() => setIsVisible(false)}
            className="absolute right-3 sm:right-4 p-1 rounded hover:bg-primary-600 transition-colors duration-200"
            aria-label="Close announcement"
          >
            <X className="w-3 h-3 sm:w-4 sm:h-4" />
          </button>
        </div>
      </div>
      
      {/* Subtle animated gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -skew-x-12 animate-pulse"></div>
    </div>
  );
};

export default AnnouncementBar;
