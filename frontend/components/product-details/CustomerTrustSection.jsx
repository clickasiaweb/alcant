import React from 'react';
import { Quote, Star, Users, Award } from 'lucide-react';

const CustomerTrustSection = () => {
  const testimonials = [
    {
      quote: "This product exceeded all my expectations. The quality is outstanding and the attention to detail is remarkable.",
      author: "Sarah Johnson",
      role: "Professional Designer",
      image: "https://picsum.photos/seed/sarah/100/100.jpg",
      rating: 5
    },
    {
      quote: "I've been using this for 6 months now and it's still as good as new. Worth every penny!",
      author: "Michael Chen",
      role: "Tech Entrepreneur",
      image: "https://picsum.photos/seed/michael/100/100.jpg",
      rating: 5
    },
    {
      quote: "The customer service and product quality are unmatched. I'm a customer for life!",
      author: "Emma Williams",
      role: "Marketing Director",
      image: "https://picsum.photos/seed/emma/100/100.jpg",
      rating: 5
    }
  ];

  const trustStats = [
    { icon: Users, number: "50K+", label: "Happy Customers" },
    { icon: Star, number: "4.9", label: "Average Rating" },
    { icon: Award, number: "15+", label: "Industry Awards" }
  ];

  return (
    <section className="py-16 bg-gray-50">
      <div className="container">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold mb-4">Why Customers Trust Us</h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Join thousands of satisfied customers who have experienced excellence
          </p>
        </div>
        
        {/* Trust Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
          {trustStats.map((stat, index) => (
            <div key={index} className="text-center">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-primary-100 rounded-full mb-4">
                <stat.icon className="w-8 h-8 text-primary-600" />
              </div>
              <div className="text-3xl font-bold text-gray-900 mb-2">{stat.number}</div>
              <div className="text-gray-600">{stat.label}</div>
            </div>
          ))}
        </div>
        
        {/* Testimonials */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <div key={index} className="bg-white p-6 rounded-lg shadow-lg hover:shadow-xl transition-shadow">
              <div className="flex items-center mb-4">
                <Quote className="w-8 h-8 text-primary-600 mr-2" />
                <div className="flex">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 text-yellow-400 fill-current" />
                  ))}
                </div>
              </div>
              <p className="text-gray-700 mb-6 italic">"{testimonial.quote}"</p>
              <div className="flex items-center">
                <img 
                  src={testimonial.image}
                  alt={testimonial.author}
                  className="w-12 h-12 rounded-full mr-3"
                />
                <div>
                  <div className="font-semibold text-gray-900">{testimonial.author}</div>
                  <div className="text-sm text-gray-600">{testimonial.role}</div>
                </div>
              </div>
            </div>
          ))}
        </div>
        
        {/* Call to Action */}
        <div className="text-center mt-12">
          <div className="bg-primary-600 text-white p-8 rounded-lg max-w-4xl mx-auto">
            <h3 className="text-2xl font-bold mb-4">Ready to Experience Excellence?</h3>
            <p className="mb-6 text-lg">
              Join our community of satisfied customers and discover why we're the trusted choice for quality products.
            </p>
            <button className="bg-white text-primary-600 px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors">
              Shop with Confidence
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CustomerTrustSection;
