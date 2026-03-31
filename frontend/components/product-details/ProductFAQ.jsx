import React, { useState } from 'react';
import { ChevronDown, ChevronUp, HelpCircle, Package, Shield, Truck, RotateCcw } from 'lucide-react';

const ProductFAQ = ({ product }) => {
  const [activeIndex, setActiveIndex] = useState(null);

  const faqs = [
    {
      question: "What is included in the package?",
      answer: "The package includes the main product, user manual, charging cable, and a complimentary cleaning cloth. Everything you need to get started right away.",
      icon: Package
    },
    {
      question: "What is the warranty period?",
      answer: "We offer a comprehensive 2-year warranty that covers manufacturing defects and hardware failures. Extended warranty options are available at checkout.",
      icon: Shield
    },
    {
      question: "How long does shipping take?",
      answer: "Standard shipping typically takes 5-7 business days. Express shipping (2-3 business days) and overnight shipping options are also available. International shipping times vary by location.",
      icon: Truck
    },
    {
      question: "What is your return policy?",
      answer: "We offer a 30-day money-back guarantee. If you're not completely satisfied, you can return the product in its original condition for a full refund. Return shipping is free for defective items.",
      icon: RotateCcw
    },
    {
      question: "Is the product compatible with my device?",
      answer: "This product is designed to be universally compatible with most modern devices. Please check the technical specifications section or contact our support team for specific compatibility questions.",
      icon: HelpCircle
    },
    {
      question: "How do I clean and maintain the product?",
      answer: "Use a soft, dry cloth for regular cleaning. For deeper cleaning, use a slightly damp cloth with mild soap. Avoid harsh chemicals or abrasive materials that could damage the finish.",
      icon: HelpCircle
    },
    {
      question: "Do you offer technical support?",
      answer: "Yes, our technical support team is available 24/7 via phone, email, and live chat. We also have an extensive knowledge base and video tutorials available on our website.",
      icon: HelpCircle
    },
    {
      question: "Can I track my order?",
      answer: "Absolutely! Once your order ships, you'll receive a tracking number via email. You can use this to track your package in real-time from our warehouse to your doorstep.",
      icon: Package
    }
  ];

  const toggleFAQ = (index) => {
    setActiveIndex(activeIndex === index ? null : index);
  };

  return (
    <section className="py-16 bg-white">
      <div className="container">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold mb-4">Frequently Asked Questions</h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Got questions? We've got answers. Find everything you need to know about our product.
          </p>
        </div>
        
        <div className="max-w-4xl mx-auto">
          <div className="space-y-4">
            {faqs.map((faq, index) => (
              <div 
                key={index}
                className="bg-gray-50 rounded-lg overflow-hidden border border-gray-200 hover:border-primary-300 transition-colors"
              >
                <button
                  onClick={() => toggleFAQ(index)}
                  className="w-full px-6 py-4 text-left flex items-center justify-between hover:bg-gray-100 transition-colors"
                >
                  <div className="flex items-center space-x-3">
                    <faq.icon className="w-5 h-5 text-primary-600 flex-shrink-0" />
                    <span className="font-semibold text-gray-900">{faq.question}</span>
                  </div>
                  <div className="flex-shrink-0">
                    {activeIndex === index ? (
                      <ChevronUp className="w-5 h-5 text-gray-500" />
                    ) : (
                      <ChevronDown className="w-5 h-5 text-gray-500" />
                    )}
                  </div>
                </button>
                
                {activeIndex === index && (
                  <div className="px-6 pb-4">
                    <div className="pl-8 text-gray-600 leading-relaxed">
                      {faq.answer}
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
          
          {/* Still have questions */}
          <div className="mt-12 text-center bg-primary-50 p-8 rounded-lg">
            <h3 className="text-2xl font-bold mb-4">Still have questions?</h3>
            <p className="text-gray-600 mb-6 max-w-2xl mx-auto">
              Our customer support team is here to help. Get in touch with us and we'll be happy to assist you.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button className="bg-primary-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-primary-700 transition-colors">
                Contact Support
              </button>
              <button className="border border-primary-600 text-primary-600 px-6 py-3 rounded-lg font-semibold hover:bg-primary-50 transition-colors">
                View Help Center
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ProductFAQ;
