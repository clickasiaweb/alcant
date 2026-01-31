import React, { useState } from 'react';
import Layout from '../components/Layout';
import { 
  HelpCircle, 
  ChevronDown, 
  ChevronRight, 
  Phone, 
  Mail, 
  MessageCircle,
  Search,
  Package,
  CreditCard,
  Truck,
  Shield,
  RotateCcw
} from 'lucide-react';

const FAQPage = () => {
  const [expandedCategory, setExpandedCategory] = useState(null);
  const [expandedQuestion, setExpandedQuestion] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');

  const faqCategories = [
    {
      id: 'general',
      name: 'General Questions',
      icon: HelpCircle,
      questions: [
        {
          id: 'g1',
          question: 'What types of products do you offer?',
          answer: 'We offer a comprehensive range of industrial automation solutions including CNC machines, quality control systems, robot arms, hydraulic presses, and material handling equipment. All our products are designed for precision engineering and maximum reliability.'
        },
        {
          id: 'g2',
          question: 'Do you ship internationally?',
          answer: 'Yes, we ship to over 50 countries worldwide. International shipping rates and delivery times vary by location. Contact our sales team for specific shipping information to your country.'
        },
        {
          id: 'g3',
          question: 'How can I track my order?',
          answer: 'Once your order ships, you\'ll receive a tracking number via email. You can use this number to track your shipment on our website or the carrier\'s website. Real-time updates are available throughout the delivery process.'
        },
        {
          id: 'g4',
          question: 'What is your return policy?',
          answer: 'We offer a 30-day return policy for most products. Items must be in original condition and packaging. Custom orders and specialized equipment may have different return terms. Please review our full return policy for details.'
        }
      ]
    },
    {
      id: 'products',
      name: 'Product Information',
      icon: Package,
      questions: [
        {
          id: 'p1',
          question: 'Are your products customizable?',
          answer: 'Yes, many of our products can be customized to meet your specific requirements. We offer various configuration options, software customization, and integration services. Contact our technical team to discuss your customization needs.'
        },
        {
          id: 'p2',
          question: 'What certifications do your products have?',
          answer: 'All our products meet international standards including ISO 9001, CE certification, and industry-specific certifications. Detailed certification documents are available upon request.'
        },
        {
          id: 'p3',
          question: 'Do you provide technical specifications?',
          answer: 'Yes, detailed technical specifications are available for all products on their respective pages. You can also download comprehensive datasheets and technical manuals from our resource center.'
        },
        {
          id: 'p4',
          question: 'Can I request a product demonstration?',
          answer: 'Absolutely! We offer both virtual and on-site product demonstrations. Contact our sales team to schedule a demonstration tailored to your specific needs and applications.'
        }
      ]
    },
    {
      id: 'ordering',
      name: 'Ordering & Payment',
      icon: CreditCard,
      questions: [
        {
          id: 'o1',
          question: 'What payment methods do you accept?',
          answer: 'We accept all major credit cards, bank transfers, and purchase orders for qualified business customers. We also offer financing options for larger orders through our trusted financial partners.'
        },
        {
          id: 'o2',
          question: 'Can I get a quote before ordering?',
          answer: 'Yes, we provide detailed quotes for all orders. Simply add items to your cart and request a quote, or contact our sales team directly for custom configurations and bulk pricing.'
        },
        {
          id: 'o3',
          question: 'Do you offer bulk discounts?',
          answer: 'Yes, we offer competitive bulk pricing for orders of 5 or more units. Discount tiers increase with quantity. Contact our sales team for custom pricing on large orders.'
        },
        {
          id: 'o4',
          question: 'How do I place a purchase order?',
          answer: 'You can place purchase orders through our website, by email, or by phone. For government and educational institutions, we have dedicated account managers to assist with the PO process.'
        }
      ]
    },
    {
      id: 'shipping',
      name: 'Shipping & Delivery',
      icon: Truck,
      questions: [
        {
          id: 's1',
          question: 'What are your shipping options?',
          answer: 'We offer standard shipping (5-7 business days), expedited shipping (2-3 business days), and white-glove delivery service for large equipment. International shipping options are also available.'
        },
        {
          id: 's2',
          question: 'How long does delivery take?',
          answer: 'Delivery times vary by product and location. Standard items typically ship within 2-3 business days. Custom equipment may require 4-8 weeks. You\'ll receive an estimated delivery date with your order confirmation.'
        },
        {
          id: 's3',
          question: 'Do you offer installation services?',
          answer: 'Yes, we provide professional installation services for all our equipment. Our certified technicians ensure proper setup and integration with your existing systems.'
        },
        {
          id: 's4',
          question: 'What about freight and logistics?',
          answer: 'We handle all logistics including freight arrangements, customs clearance for international orders, and delivery coordination. Our logistics team ensures your equipment arrives safely and on schedule.'
        }
      ]
    },
    {
      id: 'support',
      name: 'Technical Support',
      icon: Shield,
      questions: [
        {
          id: 't1',
          question: 'What kind of technical support do you provide?',
          answer: 'We offer 24/7 technical support via phone, email, and remote assistance. Our support team includes certified engineers who can help with installation, troubleshooting, and optimization.'
        },
        {
          id: 't2',
          question: 'Is training included with purchases?',
          answer: 'Yes, comprehensive training is included with all equipment purchases. We provide on-site training, online courses, and detailed documentation to ensure your team can operate the equipment effectively.'
        },
        {
          id: 't3',
          question: 'What is your warranty policy?',
          answer: 'All products come with a comprehensive 5-year warranty covering parts and labor. Extended warranty options are available. We also offer maintenance contracts for ongoing support.'
        },
        {
          id: 't4',
          question: 'Do you offer maintenance services?',
          answer: 'Yes, we provide preventive maintenance, emergency repairs, and equipment upgrades. Our maintenance plans help ensure optimal performance and extend equipment life.'
        }
      ]
    }
  ];

  const toggleCategory = (categoryId) => {
    setExpandedCategory(expandedCategory === categoryId ? null : categoryId);
    setExpandedQuestion(null); // Reset expanded question when changing category
  };

  const toggleQuestion = (questionId) => {
    setExpandedQuestion(expandedQuestion === questionId ? null : questionId);
  };

  const filteredCategories = faqCategories.map(category => ({
    ...category,
    questions: category.questions.filter(q =>
      q.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
      q.answer.toLowerCase().includes(searchQuery.toLowerCase())
    )
  })).filter(category => 
    category.questions.length > 0 || 
    category.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const popularQuestions = [
    'What is your return policy?',
    'Do you ship internationally?',
    'How can I track my order?',
    'What payment methods do you accept?'
  ];

  return (
    <Layout title="Frequently Asked Questions">
      <div className="bg-gray-50 py-8">
        <div className="container">
          <div className="max-w-4xl mx-auto">
            {/* Header */}
            <div className="text-center mb-12">
              <h1 className="text-4xl font-bold text-gray-900 mb-4">
                Frequently Asked Questions
              </h1>
              <p className="text-lg text-gray-600 mb-8">
                Find answers to common questions about our products and services
              </p>

              {/* Search */}
              <div className="max-w-2xl mx-auto relative">
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search FAQ..."
                  className="w-full pl-12 pr-4 py-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                />
              </div>
            </div>

            {/* Popular Questions */}
            {!searchQuery && (
              <div className="mb-12">
                <h2 className="text-2xl font-semibold text-gray-900 mb-6">Popular Questions</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {popularQuestions.map((question, index) => (
                    <button
                      key={index}
                      onClick={() => setSearchQuery(question)}
                      className="text-left p-4 bg-white rounded-lg border border-gray-200 hover:border-primary-300 hover:bg-primary-50 transition-colors"
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-gray-700">{question}</span>
                        <ChevronRight className="w-4 h-4 text-gray-400" />
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* FAQ Categories */}
            <div className="space-y-6">
              {filteredCategories.map((category) => (
                <div key={category.id} className="bg-white rounded-lg shadow-sm overflow-hidden">
                  {/* Category Header */}
                  <button
                    onClick={() => toggleCategory(category.id)}
                    className="w-full px-6 py-4 flex items-center justify-between hover:bg-gray-50 transition-colors"
                  >
                    <div className="flex items-center space-x-3">
                      <category.icon className="w-5 h-5 text-primary-600" />
                      <h3 className="text-lg font-semibold text-gray-900">{category.name}</h3>
                      <span className="text-sm text-gray-500">({category.questions.length})</span>
                    </div>
                    {expandedCategory === category.id ? (
                      <ChevronDown className="w-5 h-5 text-gray-400" />
                    ) : (
                      <ChevronRight className="w-5 h-5 text-gray-400" />
                    )}
                  </button>

                  {/* Questions */}
                  {expandedCategory === category.id && (
                    <div className="border-t border-gray-200">
                      {category.questions.map((question) => (
                        <div key={question.id} className="border-b border-gray-100 last:border-b-0">
                          <button
                            onClick={() => toggleQuestion(question.id)}
                            className="w-full px-6 py-4 text-left hover:bg-gray-50 transition-colors"
                          >
                            <div className="flex items-start justify-between">
                              <h4 className="font-medium text-gray-900 pr-4">{question.question}</h4>
                              <ChevronDown 
                                className={`w-4 h-4 text-gray-400 mt-1 transition-transform ${
                                  expandedQuestion === question.id ? 'rotate-180' : ''
                                }`} 
                              />
                            </div>
                          </button>
                          
                          {expandedQuestion === question.id && (
                            <div className="px-6 pb-4">
                              <p className="text-gray-600 leading-relaxed">{question.answer}</p>
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>

            {/* No Results */}
            {filteredCategories.length === 0 && (
              <div className="text-center py-12">
                <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
                  <Search className="w-12 h-12 text-gray-400" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">No results found</h3>
                <p className="text-gray-600 mb-6">
                  Try searching with different keywords or browse our FAQ categories above.
                </p>
                <button
                  onClick={() => setSearchQuery('')}
                  className="bg-primary-600 text-white px-6 py-2 rounded-lg hover:bg-primary-700 transition-colors"
                >
                  Clear Search
                </button>
              </div>
            )}

            {/* Contact Support */}
            <div className="mt-16 bg-gradient-to-r from-primary-600 to-primary-700 rounded-lg p-8 text-white text-center">
              <h2 className="text-2xl font-bold mb-4">Still have questions?</h2>
              <p className="mb-8 text-primary-100">
                Our support team is here to help you with any questions or concerns.
              </p>
              <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                <a
                  href="tel:+1-800-123-4567"
                  className="flex items-center space-x-2 bg-white text-primary-600 px-6 py-3 rounded-lg hover:bg-gray-100 transition-colors"
                >
                  <Phone className="w-4 h-4" />
                  <span>Call Support</span>
                </a>
                <a
                  href="mailto:support@example.com"
                  className="flex items-center space-x-2 bg-primary-500 text-white px-6 py-3 rounded-lg hover:bg-primary-400 transition-colors"
                >
                  <Mail className="w-4 h-4" />
                  <span>Email Support</span>
                </a>
                <button className="flex items-center space-x-2 border border-white text-white px-6 py-3 rounded-lg hover:bg-white hover:text-primary-600 transition-colors">
                  <MessageCircle className="w-4 h-4" />
                  <span>Live Chat</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default FAQPage;
