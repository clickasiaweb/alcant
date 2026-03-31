import React, { useState } from 'react';
import { Star, ThumbsUp, Filter, ChevronDown, ChevronUp } from 'lucide-react';

const CustomerReviews = ({ product }) => {
  const [showAllReviews, setShowAllReviews] = useState(false);
  const [selectedFilter, setSelectedFilter] = useState('all');

  const reviews = [
    {
      id: 1,
      author: "Alex Thompson",
      avatar: "https://picsum.photos/seed/alex/50/50.jpg",
      rating: 5,
      date: "2 weeks ago",
      verified: true,
      title: "Absolutely Perfect!",
      content: "I've been using this product for a month now and it's exceeded all my expectations. The build quality is exceptional and the attention to detail is remarkable. Highly recommend!",
      helpful: 23,
      images: ["https://picsum.photos/seed/review1/200/200.jpg"]
    },
    {
      id: 2,
      author: "Maria Garcia",
      avatar: "https://picsum.photos/seed/maria/50/50.jpg",
      rating: 4,
      date: "1 month ago",
      verified: true,
      title: "Great Product, Minor Issues",
      content: "Overall very happy with my purchase. The product works as described and looks great. Only minor issue was with the packaging which was slightly damaged on arrival, but the product itself was perfect.",
      helpful: 15,
      images: ["https://picsum.photos/seed/review2/200/200.jpg", "https://picsum.photos/seed/review2b/200/200.jpg"]
    },
    {
      id: 3,
      author: "James Wilson",
      avatar: "https://picsum.photos/seed/james/50/50.jpg",
      rating: 5,
      date: "2 months ago",
      verified: true,
      title: "Worth Every Penny",
      content: "This is exactly what I was looking for. Premium quality, fast shipping, and excellent customer service. The product feels premium and works flawlessly. Will definitely buy again!",
      helpful: 31
    },
    {
      id: 4,
      author: "Sophie Chen",
      avatar: "https://picsum.photos/seed/sophie/50/50.jpg",
      rating: 5,
      date: "3 months ago",
      verified: true,
      title: "Exceeded Expectations",
      content: "I was skeptical at first given the price point, but this product is worth every cent. The quality is outstanding and it has made my daily routine so much easier.",
      helpful: 18
    },
    {
      id: 5,
      author: "David Brown",
      avatar: "https://picsum.photos/seed/david/50/50.jpg",
      rating: 4,
      date: "3 months ago",
      verified: true,
      title: "Good Value",
      content: "Solid product with good features. Setup was easy and it works well. Only giving 4 stars because I wish it had more color options, but that's a personal preference.",
      helpful: 12
    }
  ];

  const displayReviews = showAllReviews ? reviews : reviews.slice(0, 3);

  const averageRating = 4.8;
  const totalReviews = 1247;

  const ratingDistribution = [
    { stars: 5, count: 892, percentage: 71.5 },
    { stars: 4, count: 234, percentage: 18.8 },
    { stars: 3, count: 87, percentage: 7.0 },
    { stars: 2, count: 28, percentage: 2.2 },
    { stars: 1, count: 6, percentage: 0.5 }
  ];

  return (
    <section className="py-16 bg-gray-50">
      <div className="container">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold mb-4">Customer Reviews</h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            See what our customers have to say about their experience
          </p>
        </div>
        
        {/* Reviews Summary */}
        <div className="max-w-4xl mx-auto mb-12">
          <div className="bg-white rounded-lg shadow-lg p-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {/* Overall Rating */}
              <div className="text-center">
                <div className="text-5xl font-bold text-gray-900 mb-2">{averageRating}</div>
                <div className="flex justify-center mb-2">
                  {[...Array(5)].map((_, i) => (
                    <Star 
                      key={i} 
                      className={`w-6 h-6 ${
                        i < Math.floor(averageRating) 
                          ? 'text-yellow-400 fill-current' 
                          : 'text-gray-300'
                      }`} 
                    />
                  ))}
                </div>
                <div className="text-gray-600">{totalReviews} Reviews</div>
                <div className="mt-4">
                  <span className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm font-medium">
                    Verified Purchase
                  </span>
                </div>
              </div>
              
              {/* Rating Distribution */}
              <div>
                <h4 className="font-semibold mb-4">Rating Distribution</h4>
                <div className="space-y-2">
                  {ratingDistribution.map((rating) => (
                    <div key={rating.stars} className="flex items-center space-x-3">
                      <div className="flex items-center space-x-1 w-16">
                        <span className="text-sm">{rating.stars}</span>
                        <Star className="w-4 h-4 text-yellow-400 fill-current" />
                      </div>
                      <div className="flex-1 bg-gray-200 rounded-full h-2">
                        <div 
                          className="bg-yellow-400 h-2 rounded-full" 
                          style={{ width: `${rating.percentage}%` }}
                        ></div>
                      </div>
                      <span className="text-sm text-gray-600 w-12 text-right">{rating.count}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
        
        {/* Filter Options */}
        <div className="max-w-4xl mx-auto mb-8">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center space-x-2">
              <Filter className="w-5 h-5 text-gray-500" />
              <span className="text-gray-700">Filter:</span>
              <select 
                value={selectedFilter}
                onChange={(e) => setSelectedFilter(e.target.value)}
                className="border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:border-primary-500"
              >
                <option value="all">All Reviews</option>
                <option value="5">5 Stars</option>
                <option value="4">4 Stars</option>
                <option value="3">3 Stars</option>
                <option value="verified">Verified Only</option>
              </select>
            </div>
            
            <button className="bg-primary-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-primary-700 transition-colors">
              Write a Review
            </button>
          </div>
        </div>
        
        {/* Reviews List */}
        <div className="max-w-4xl mx-auto space-y-6">
          {displayReviews.map((review) => (
            <div key={review.id} className="bg-white rounded-lg shadow-md p-6">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center space-x-3">
                  <img 
                    src={review.avatar}
                    alt={review.author}
                    className="w-12 h-12 rounded-full"
                  />
                  <div>
                    <div className="font-semibold text-gray-900">{review.author}</div>
                    <div className="flex items-center space-x-2 text-sm text-gray-600">
                      <div className="flex">
                        {[...Array(5)].map((_, i) => (
                          <Star 
                            key={i} 
                            className={`w-4 h-4 ${
                              i < review.rating 
                                ? 'text-yellow-400 fill-current' 
                                : 'text-gray-300'
                            }`} 
                          />
                        ))}
                      </div>
                      <span>•</span>
                      <span>{review.date}</span>
                      {review.verified && (
                        <>
                          <span>•</span>
                          <span className="text-green-600 font-medium">Verified Purchase</span>
                        </>
                      )}
                    </div>
                  </div>
                </div>
              </div>
              
              {review.title && (
                <h4 className="font-semibold text-lg mb-2">{review.title}</h4>
              )}
              
              <p className="text-gray-700 leading-relaxed mb-4">{review.content}</p>
              
              {review.images && (
                <div className="flex space-x-2 mb-4">
                  {review.images.map((image, index) => (
                    <img 
                      key={index}
                      src={image}
                      alt={`Review image ${index + 1}`}
                      className="w-20 h-20 object-cover rounded-lg cursor-pointer hover:opacity-80 transition-opacity"
                    />
                  ))}
                </div>
              )}
              
              <div className="flex items-center space-x-4 text-sm">
                <button className="flex items-center space-x-1 text-gray-600 hover:text-primary-600 transition-colors">
                  <ThumbsUp className="w-4 h-4" />
                  <span>Helpful ({review.helpful})</span>
                </button>
                <button className="text-gray-600 hover:text-primary-600 transition-colors">
                  Report
                </button>
              </div>
            </div>
          ))}
        </div>
        
        {/* Load More Button */}
        {!showAllReviews && reviews.length > 3 && (
          <div className="text-center mt-8">
            <button
              onClick={() => setShowAllReviews(true)}
              className="bg-white border border-gray-300 text-gray-700 px-8 py-3 rounded-lg font-semibold hover:bg-gray-50 transition-colors"
            >
              Load More Reviews
            </button>
          </div>
        )}
      </div>
    </section>
  );
};

export default CustomerReviews;
