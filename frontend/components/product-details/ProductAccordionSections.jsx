import React, { useState } from 'react';
import { ChevronDown, ChevronUp, Package, Heart, Truck, HelpCircle, Star } from 'lucide-react';
import ProductReviews from './ProductReviews';

const ProductAccordionSections = ({ product }) => {
  const [activeSection, setActiveSection] = useState('description');

  const sections = [
    {
      id: 'description',
      title: 'Description',
      icon: Package,
      content: (
        <div className="space-y-4">
          <p className="text-gray-600 leading-relaxed">
            {product?.description || product?.short_description || 
             "Experience premium quality and innovative design with this exceptional product. " +
             "Crafted with attention to detail and using only the finest materials, this product " +
             "delivers outstanding performance and durability that exceeds expectations."}
          </p>
          <div className="space-y-2">
            <h4 className="font-semibold text-gray-900">Key Features:</h4>
            <ul className="list-disc list-inside text-gray-600 space-y-1">
              <li>Premium materials and construction</li>
              <li>Innovative design and functionality</li>
              <li>Exceptional durability and performance</li>
              <li>Environmentally friendly manufacturing</li>
              <li>Comprehensive warranty coverage</li>
            </ul>
          </div>
          <div className="space-y-2">
            <h4 className="font-semibold text-gray-900">Specifications:</h4>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <span className="font-medium">Material:</span>
                <span className="text-gray-600 ml-2">Premium Grade</span>
              </div>
              <div>
                <span className="font-medium">Weight:</span>
                <span className="text-gray-600 ml-2">{product?.weight || 'Standard'}</span>
              </div>
              <div>
                <span className="font-medium">Dimensions:</span>
                <span className="text-gray-600 ml-2">Standard Size</span>
              </div>
              <div>
                <span className="font-medium">Warranty:</span>
                <span className="text-gray-600 ml-2">2 Years</span>
              </div>
            </div>
          </div>
        </div>
      )
    },
    {
      id: 'reviews',
      title: 'Reviews',
      icon: Star,
      content: <ProductReviews productId={product?.id} />
    },
    {
      id: 'shipping',
      title: 'Shipping & Returns',
      icon: Truck,
      content: (
        <div className="space-y-6">
          <div>
            <h4 className="font-semibold text-gray-900 mb-3">Shipping Information</h4>
            <div className="space-y-3">
              <div className="flex items-start space-x-3">
                <div className="w-2 h-2 bg-primary-600 rounded-full mt-2"></div>
                <div>
                  <div className="font-medium">Standard Shipping</div>
                  <div className="text-sm text-gray-600">5-7 business days - FREE on orders over $50</div>
                  <div className="text-sm text-primary-600">Otherwise $9.99</div>
                </div>
              </div>
              
              <div className="flex items-start space-x-3">
                <div className="w-2 h-2 bg-primary-600 rounded-full mt-2"></div>
                <div>
                  <div className="font-medium">Express Shipping</div>
                  <div className="text-sm text-gray-600">2-3 business days - $24.99</div>
                </div>
              </div>
              
              <div className="flex items-start space-x-3">
                <div className="w-2 h-2 bg-primary-600 rounded-full mt-2"></div>
                <div>
                  <div className="font-medium">Overnight Shipping</div>
                  <div className="text-sm text-gray-600">1 business day - $39.99</div>
                </div>
              </div>
              
              <div className="flex items-start space-x-3">
                <div className="w-2 h-2 bg-primary-600 rounded-full mt-2"></div>
                <div>
                  <div className="font-medium">International Shipping</div>
                  <div className="text-sm text-gray-600">7-14 business days - Rates calculated at checkout</div>
                </div>
              </div>
            </div>
          </div>
          
          <div>
            <h4 className="font-semibold text-gray-900 mb-3">Return Policy</h4>
            <div className="space-y-3">
              <div className="bg-green-50 p-4 rounded-lg">
                <div className="font-medium text-green-900 mb-2">30-Day Money-Back Guarantee</div>
                <div className="text-sm text-green-800">
                  If you're not completely satisfied with your purchase, you can return it within 30 days for a full refund.
                </div>
              </div>
              
              <div className="space-y-2 text-sm text-gray-600">
                <p><strong>Conditions for returns:</strong></p>
                <ul className="list-disc list-inside space-y-1 ml-4">
                  <li>Product must be in original condition</li>
                  <li>Original packaging and tags must be intact</li>
                  <li>Proof of purchase required</li>
                  <li>Custom/personalized items cannot be returned</li>
                </ul>
              </div>
              
              <div className="space-y-2 text-sm text-gray-600">
                <p><strong>Return process:</strong></p>
                <ol className="list-decimal list-inside space-y-1 ml-4">
                  <li>Contact our customer service team</li>
                  <li>Receive a prepaid return label</li>
                  <li>Package the item securely</li>
                  <li>Drop off at designated shipping location</li>
                  <li>Refund processed within 5-7 business days</li>
                </ol>
              </div>
            </div>
          </div>
          
          <div className="bg-gray-50 p-4 rounded-lg">
            <h4 className="font-semibold text-gray-900 mb-2">Need Help?</h4>
            <p className="text-sm text-gray-600 mb-3">
              Our customer service team is available 24/7 to assist with shipping and return questions.
            </p>
            <div className="flex space-x-4">
              <button className="text-primary-600 hover:text-primary-700 font-medium text-sm">
                Contact Support
              </button>
              <button className="text-primary-600 hover:text-primary-700 font-medium text-sm">
                Track Order
              </button>
            </div>
          </div>
        </div>
      )
    },
    {
      id: 'faq',
      title: 'FAQ',
      icon: HelpCircle,
      content: (
        <div className="space-y-4">
          <div className="space-y-3">
            <div className="border-b border-gray-200 pb-3">
              <h5 className="font-medium text-gray-900 mb-2">How do I track my order?</h5>
              <p className="text-sm text-gray-600">
                Once your order ships, you'll receive a tracking number via email. Use this to track your package in real-time.
              </p>
            </div>
            
            <div className="border-b border-gray-200 pb-3">
              <h5 className="font-medium text-gray-900 mb-2">What payment methods do you accept?</h5>
              <p className="text-sm text-gray-600">
                We accept all major credit cards, PayPal, Apple Pay, Google Pay, and Shop Pay.
              </p>
            </div>
            
            <div className="border-b border-gray-200 pb-3">
              <h5 className="font-medium text-gray-900 mb-2">Is my payment information secure?</h5>
              <p className="text-sm text-gray-600">
                Yes, all payments are processed using industry-standard SSL encryption and we never store your payment details.
              </p>
            </div>
            
            <div className="border-b border-gray-200 pb-3">
              <h5 className="font-medium text-gray-900 mb-2">Can I cancel or modify my order?</h5>
              <p className="text-sm text-gray-600">
                Orders can be cancelled or modified within 2 hours of placement. After that, please contact customer service.
              </p>
            </div>
            
            <div className="pb-3">
              <h5 className="font-medium text-gray-900 mb-2">Do you offer bulk discounts?</h5>
              <p className="text-sm text-gray-600">
                Yes, we offer competitive bulk pricing for orders of 10+ items. Please contact our sales team for a custom quote.
              </p>
            </div>
          </div>
          
          <div className="text-center pt-4">
            <button className="bg-primary-600 text-white px-6 py-2 rounded-lg font-medium hover:bg-primary-700 transition-colors">
              View All FAQs
            </button>
          </div>
        </div>
      )
    }
  ];

  const toggleSection = (sectionId) => {
    setActiveSection(activeSection === sectionId ? null : sectionId);
  };

  return (
    <section className="py-12 bg-white">
      <div className="container">
        <div className="max-w-4xl mx-auto">
          {/* Accordion Sections */}
          <div className="space-y-2 mb-8">
            {sections.map((section) => (
              <div 
                key={section.id}
                className="border border-gray-200 rounded-lg overflow-hidden"
              >
                <button
                  onClick={() => toggleSection(section.id)}
                  className="w-full px-6 py-4 text-left flex items-center justify-between hover:bg-gray-50 transition-colors"
                >
                  <div className="flex items-center space-x-3">
                    <section.icon className="w-5 h-5 text-primary-600" />
                    <span className="font-semibold text-gray-900">{section.title}</span>
                  </div>
                  <div className="flex-shrink-0">
                    {activeSection === section.id ? (
                      <ChevronUp className="w-5 h-5 text-gray-500" />
                    ) : (
                      <ChevronDown className="w-5 h-5 text-gray-500" />
                    )}
                  </div>
                </button>
                
                {activeSection === section.id && (
                  <div className="px-6 pb-6">
                    {section.content}
                  </div>
                )}
              </div>
            ))}
          </div>
          
          {/* Social Proof Section */}
          <div className="bg-gray-50 rounded-lg p-6">
            <div className="flex items-center space-x-4">
              <div className="flex -space-x-2">
                <img 
                  src="https://picsum.photos/seed/user1/40/40.jpg"
                  alt="User 1"
                  className="w-10 h-10 rounded-full border-2 border-white"
                />
                <img 
                  src="https://picsum.photos/seed/user2/40/40.jpg"
                  alt="User 2"
                  className="w-10 h-10 rounded-full border-2 border-white"
                />
                <img 
                  src="https://picsum.photos/seed/user3/40/40.jpg"
                  alt="User 3"
                  className="w-10 h-10 rounded-full border-2 border-white"
                />
                <div className="w-10 h-10 rounded-full bg-primary-600 border-2 border-white flex items-center justify-center">
                  <span className="text-white text-xs font-bold">+</span>
                </div>
              </div>
              <div className="text-gray-700">
                <span className="font-medium">Gudelj</span>, <span className="font-medium">Dirk Schouten</span>, and 
                <span className="font-medium text-primary-600"> 100,000+</span> others use ALCANSIDE
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ProductAccordionSections;
