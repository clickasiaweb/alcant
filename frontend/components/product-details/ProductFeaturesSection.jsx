import React from 'react';
import { Shield, Zap, Award, Globe, Heart, Star } from 'lucide-react';

const ProductFeaturesSection = ({ product }) => {
  const features = [
    {
      icon: Shield,
      title: 'Premium Protection',
      description: 'Advanced shock-absorbing technology with military-grade protection',
      image: 'https://picsum.photos/seed/protection/400/300.jpg'
    },
    {
      icon: Zap,
      title: 'Fast Charging',
      description: 'Supports rapid charging technology for quick power replenishment',
      image: 'https://picsum.photos/seed/charging/400/300.jpg'
    },
    {
      icon: Award,
      title: 'Award Winning',
      description: 'Recognized internationally for superior design and innovation',
      image: 'https://picsum.photos/seed/award/400/300.jpg'
    },
    {
      icon: Globe,
      title: 'Eco Friendly',
      description: 'Sustainable materials with minimal environmental impact',
      image: 'https://picsum.photos/seed/eco/400/300.jpg'
    },
    {
      icon: Heart,
      title: 'Health Focused',
      description: 'Ergonomically designed for comfort and wellbeing',
      image: 'https://picsum.photos/seed/health/400/300.jpg'
    },
    {
      icon: Star,
      title: 'Premium Quality',
      description: 'Crafted with attention to detail and finest materials',
      image: 'https://picsum.photos/seed/quality/400/300.jpg'
    }
  ];

  return (
    <section className="bg-gray-900 text-white py-16">
      <div className="container">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold mb-4">Discover Excellence</h2>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto">
            Experience the perfect blend of innovation, style, and functionality
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <div key={index} className="group relative overflow-hidden rounded-lg bg-gray-800 hover:bg-gray-750 transition-all duration-300">
              <div className="aspect-video overflow-hidden">
                <img 
                  src={feature.image}
                  alt={feature.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
              </div>
              <div className="p-6">
                <div className="flex items-center mb-4">
                  <feature.icon className="w-8 h-8 text-blue-400 mr-3" />
                  <h3 className="text-xl font-semibold">{feature.title}</h3>
                </div>
                <p className="text-gray-300 leading-relaxed">{feature.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ProductFeaturesSection;
