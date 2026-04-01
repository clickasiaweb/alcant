import React, { useState, useEffect } from 'react';
import { X, Clock, Tag, ChevronLeft, ChevronRight } from 'lucide-react';

const AnnouncementBar = () => {
  const [isVisible, setIsVisible] = useState(true);
  const [currentPromo, setCurrentPromo] = useState(0);
  const [timeLeft, setTimeLeft] = useState({ days: 82, hours: 15, minutes: 45, seconds: 30 });

  // Multiple promotions data
  const promotions = [
    {
      id: 1,
      message: "Limited Time Offer:",
      description: "25% off new arrivals",
      code: "SAVE25",
      hasCountdown: true,
      bgColor: "bg-primary-500"
    },
    {
      id: 2,
      message: "Flash Sale:",
      description: "Free shipping on orders $50+",
      code: "FREESHIP",
      hasCountdown: false,
      bgColor: "bg-gradient-to-r from-purple-600 to-purple-500"
    },
    {
      id: 3,
      message: "Special Deal:",
      description: "Buy 2 get 1 free",
      code: "BOGO",
      hasCountdown: true,
      bgColor: "bg-gradient-to-r from-green-600 to-green-500"
    },
    {
      id: 4,
      message: "Weekend Offer:",
      description: "Extra 15% off sale items",
      code: "WEEKEND15",
      hasCountdown: false,
      bgColor: "bg-gradient-to-r from-orange-600 to-orange-500"
    }
  ];

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

  // Auto-slide promotions
  useEffect(() => {
    const slideTimer = setInterval(() => {
      setCurrentPromo((prev) => (prev + 1) % promotions.length);
    }, 5000); // Change every 5 seconds

    return () => clearInterval(slideTimer);
  }, [promotions.length]);

  const formatNumber = (num) => num.toString().padStart(2, '0');

  const goToPromo = (index) => {
    setCurrentPromo(index);
  };

  const nextPromo = () => {
    setCurrentPromo((prev) => (prev + 1) % promotions.length);
  };

  const prevPromo = () => {
    setCurrentPromo((prev) => (prev - 1 + promotions.length) % promotions.length);
  };

  if (!isVisible) return null;

  const currentPromotion = promotions[currentPromo];

  return (
    <div className={`${currentPromotion.bgColor} text-white relative overflow-hidden h-8 sm:h-10`}>
      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -skew-x-12 animate-pulse"></div>
      
      <div className="container relative h-full">
        <div className="flex items-center justify-center h-full px-4">
          <div className="flex items-center justify-center w-full max-w-4xl mx-auto">
            {/* Navigation Arrows - Desktop only */}
            <button
              onClick={prevPromo}
              className="hidden sm:flex items-center justify-center p-1 rounded hover:bg-white/10 transition-colors duration-200 mr-2"
              aria-label="Previous promotion"
            >
              <ChevronLeft className="w-3 h-3" />
            </button>

            {/* Promotion Content */}
            <div className="flex-1 flex items-center justify-center">
              <div className="flex flex-col sm:flex-row items-center space-y-0.5 sm:space-y-0 sm:space-x-2 text-center">
                {/* Main Message */}
                <div className="flex items-center space-x-1 sm:space-x-2">
                  <span className="font-medium text-[10px] sm:text-xs">{currentPromotion.message}</span>
                  <span className="text-[10px] sm:text-xs">{currentPromotion.description}</span>
                  <span className="bg-accent-500 px-1 py-0.5 rounded text-[8px] sm:text-[10px] font-semibold">
                    {currentPromotion.code}
                  </span>
                </div>
                
                {/* Countdown Timer - Only for promotions with countdown */}
                {currentPromotion.hasCountdown && (
                  <div className="flex items-center space-x-0.5 sm:space-x-1">
                    <Clock className="w-2.5 h-2.5 sm:w-3 sm:h-3" />
                    <div className="flex items-center space-x-0.5">
                      <div className="bg-white/20 px-1 py-0.5 rounded text-[8px] sm:text-[10px] font-mono">
                        {formatNumber(timeLeft.days)}d
                      </div>
                      <span className="text-[8px] sm:text-[10px]">:</span>
                      <div className="bg-white/20 px-1 py-0.5 rounded text-[8px] sm:text-[10px] font-mono">
                        {formatNumber(timeLeft.hours)}h
                      </div>
                      <span className="text-[8px] sm:text-[10px] hidden sm:inline">:</span>
                      <div className="bg-white/20 px-1 py-0.5 rounded text-[8px] sm:text-[10px] font-mono hidden sm:block">
                        {formatNumber(timeLeft.minutes)}m
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Navigation Arrows - Desktop only */}
            <button
              onClick={nextPromo}
              className="hidden sm:flex items-center justify-center p-1 rounded hover:bg-white/10 transition-colors duration-200 ml-2"
              aria-label="Next promotion"
            >
              <ChevronRight className="w-3 h-3" />
            </button>
          </div>
          
          {/* Close Button */}
          <button
            onClick={() => setIsVisible(false)}
            className="absolute right-2 sm:right-4 p-0.5 sm:p-1 rounded hover:bg-white/10 transition-colors duration-200"
            aria-label="Close announcement"
          >
            <X className="w-2.5 h-2.5 sm:w-3 sm:h-3" />
          </button>
        </div>
      </div>

      {/* Dots Indicator - Mobile only */}
      <div className="sm:hidden absolute bottom-0.5 left-0 right-0 flex justify-center space-x-1">
        {promotions.map((_, index) => (
          <button
            key={index}
            onClick={() => goToPromo(index)}
            className={`w-1 h-1 rounded-full transition-colors ${
              index === currentPromo ? 'bg-white' : 'bg-white/40'
            }`}
            aria-label={`Go to promotion ${index + 1}`}
          />
        ))}
      </div>
    </div>
  );
};

export default AnnouncementBar;
