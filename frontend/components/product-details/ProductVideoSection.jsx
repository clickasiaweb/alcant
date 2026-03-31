import React, { useState } from 'react';
import { Play, Volume2, Maximize, Settings } from 'lucide-react';

const ProductVideoSection = ({ product }) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [showControls, setShowControls] = useState(true);

  const handlePlay = () => {
    setIsPlaying(!isPlaying);
  };

  return (
    <section className="py-16 bg-gray-50">
      <div className="container">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold mb-4">Watch the Film</h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Discover the story behind our innovative product and see it in action
          </p>
        </div>
        
        <div className="max-w-5xl mx-auto">
          <div className="relative bg-black rounded-lg overflow-hidden shadow-2xl">
            {/* Video Container */}
            <div className="aspect-video relative">
              <img 
                src="https://picsum.photos/seed/product-video/1920/1080.jpg"
                alt="Product Video Thumbnail"
                className="w-full h-full object-cover"
              />
              
              {/* Play Button Overlay */}
              {!isPlaying && (
                <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-40">
                  <button
                    onClick={handlePlay}
                    className="bg-white bg-opacity-90 hover:bg-opacity-100 rounded-full p-6 transition-all duration-300 group"
                  >
                    <Play className="w-16 h-16 text-gray-900 group-hover:scale-110 transition-transform" />
                  </button>
                </div>
              )}
              
              {/* Video Controls */}
              {isPlaying && (
                <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black to-transparent p-4">
                  <div className="flex items-center justify-between text-white">
                    <div className="flex items-center space-x-4">
                      <button className="hover:text-blue-400 transition-colors">
                        <Play className="w-5 h-5" />
                      </button>
                      <button className="hover:text-blue-400 transition-colors">
                        <Volume2 className="w-5 h-5" />
                      </button>
                      <div className="text-sm">
                        2:45 / 5:20
                      </div>
                    </div>
                    <div className="flex items-center space-x-4">
                      <button className="hover:text-blue-400 transition-colors">
                        <Settings className="w-5 h-5" />
                      </button>
                      <button className="hover:text-blue-400 transition-colors">
                        <Maximize className="w-5 h-5" />
                      </button>
                    </div>
                  </div>
                  {/* Progress Bar */}
                  <div className="mt-2 bg-gray-600 rounded-full h-1">
                    <div className="bg-blue-500 h-1 rounded-full" style={{ width: '50%' }}></div>
                  </div>
                </div>
              )}
            </div>
          </div>
          
          {/* Video Info */}
          <div className="mt-8 text-center">
            <h3 className="text-2xl font-semibold mb-3">The Making of Excellence</h3>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Join us on a journey through the design, engineering, and craftsmanship that goes into every product we create. 
              Learn about our commitment to quality and innovation.
            </p>
            <div className="flex justify-center space-x-4 mt-6">
              <button className="bg-primary-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-primary-700 transition-colors">
                Watch Full Story
              </button>
              <button className="border border-gray-300 px-6 py-3 rounded-lg font-semibold hover:bg-gray-50 transition-colors">
                Behind the Scenes
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ProductVideoSection;
