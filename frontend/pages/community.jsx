import React, { useState } from 'react';
import Layout from '../components/Layout';
import { 
  Users, 
  Heart, 
  MessageCircle, 
  Share2, 
  Camera,
  Search,
  Filter,
  ChevronRight,
  Instagram,
  Twitter,
  Facebook,
  Linkedin
} from 'lucide-react';

const CommunityPage = () => {
  const [activeTab, setActiveTab] = useState('gallery');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');

  // Mock community data
  const communityPosts = [
    {
      id: 1,
      type: 'image',
      image: 'https://via.placeholder.com/400x400/e2e8f0/4a5568?text=Community+1',
      user: {
        name: 'Sarah Chen',
        avatar: 'https://via.placeholder.com/40x40/e2e8f0/4a5568?text=SC',
        company: 'Tech Manufacturing Inc.'
      },
      caption: 'Just installed our new automation system! The efficiency gains are incredible. #IndustrialAutomation #Manufacturing',
      likes: 245,
      comments: 32,
      timestamp: '2 hours ago',
      tags: ['automation', 'manufacturing', 'efficiency']
    },
    {
      id: 2,
      type: 'image',
      image: 'https://via.placeholder.com/400x400/e2e8f0/4a5568?text=Community+2',
      user: {
        name: 'Mike Johnson',
        avatar: 'https://via.placeholder.com/40x40/e2e8f0/4a5568?text=MJ',
        company: 'Precision Industries'
      },
      caption: 'Our new CNC machine is performing beyond expectations. Precision at its finest! #CNC #PrecisionEngineering',
      likes: 189,
      comments: 28,
      timestamp: '5 hours ago',
      tags: ['cnc', 'precision', 'engineering']
    },
    {
      id: 3,
      type: 'image',
      image: 'https://via.placeholder.com/400x400/e2e8f0/4a5568?text=Community+3',
      user: {
        name: 'Emma Davis',
        avatar: 'https://via.placeholder.com/40x40/e2e8f0/4a5568?text=ED',
        company: 'Advanced Solutions'
      },
      caption: 'Quality control has never been easier with our new inspection system. Zero defects in the first month! #QualityControl #Innovation',
      likes: 312,
      comments: 45,
      timestamp: '1 day ago',
      tags: ['quality', 'innovation', 'inspection']
    },
    {
      id: 4,
      type: 'image',
      image: 'https://via.placeholder.com/400x400/e2e8f0/4a5568?text=Community+4',
      user: {
        name: 'Alex Kim',
        avatar: 'https://via.placeholder.com/40x40/e2e8f0/4a5568?text=AK',
        company: 'Smart Manufacturing Co.'
      },
      caption: 'Robot arm integration complete! Our production line is now fully automated. #Robotics #Automation #FutureOfWork',
      likes: 428,
      comments: 67,
      timestamp: '2 days ago',
      tags: ['robotics', 'automation', 'integration']
    },
    {
      id: 5,
      type: 'image',
      image: 'https://via.placeholder.com/400x400/e2e8f0/4a5568?text=Community+5',
      user: {
        name: 'Robert Martinez',
        avatar: 'https://via.placeholder.com/40x40/e2e8f0/4a5568?text=RM',
        company: 'Industrial Tech Solutions'
      },
      caption: 'Hydraulic press installation complete. Ready for heavy-duty operations! #Hydraulic #Manufacturing #Power',
      likes: 156,
      comments: 23,
      timestamp: '3 days ago',
      tags: ['hydraulic', 'manufacturing', 'power']
    },
    {
      id: 6,
      type: 'image',
      image: 'https://via.placeholder.com/400x400/e2e8f0/4a5568?text=Community+6',
      user: {
        name: 'Lisa Wang',
        avatar: 'https://via.placeholder.com/40x40/e2e8f0/4a5568?text=LW',
        company: 'Precision Components Ltd.'
      },
      caption: 'Conveyor system upgrade complete. Material handling efficiency increased by 40%! #Logistics #Efficiency #Conveyor',
      likes: 234,
      comments: 41,
      timestamp: '4 days ago',
      tags: ['logistics', 'efficiency', 'conveyor']
    }
  ];

  const categories = [
    { id: 'all', name: 'All Posts', count: communityPosts.length },
    { id: 'automation', name: 'Automation', count: 3 },
    { id: 'manufacturing', name: 'Manufacturing', count: 4 },
    { id: 'quality', name: 'Quality Control', count: 2 },
    { id: 'robotics', name: 'Robotics', count: 2 }
  ];

  const featuredMembers = [
    {
      name: 'Sarah Chen',
      role: 'Plant Manager',
      company: 'Tech Manufacturing Inc.',
      avatar: 'https://via.placeholder.com/60x60/e2e8f0/4a5568?text=SC',
      contributions: 45,
      badges: ['Top Contributor', 'Early Adopter']
    },
    {
      name: 'Mike Johnson',
      role: 'Operations Director',
      company: 'Precision Industries',
      avatar: 'https://via.placeholder.com/60x60/e2e8f0/4a5568?text=MJ',
      contributions: 38,
      badges: ['Expert User']
    },
    {
      name: 'Emma Davis',
      role: 'CEO',
      company: 'Advanced Solutions',
      avatar: 'https://via.placeholder.com/60x60/e2e8f0/4a5568?text=ED',
      contributions: 52,
      badges: ['Top Contributor', 'Innovation Leader']
    },
    {
      name: 'Alex Kim',
      role: 'Engineering Lead',
      company: 'Smart Manufacturing Co.',
      avatar: 'https://via.placeholder.com/60x60/e2e8f0/4a5568?text=AK',
      contributions: 41,
      badges: ['Technical Expert']
    }
  ];

  const filteredPosts = communityPosts.filter(post => {
    const matchesSearch = post.caption.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         post.user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         post.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()));
    
    const matchesCategory = selectedCategory === 'all' || 
                           post.tags.includes(selectedCategory);
    
    return matchesSearch && matchesCategory;
  });

  const tabs = [
    { id: 'gallery', name: 'Community Gallery', icon: Camera },
    { id: 'members', name: 'Top Contributors', icon: Users },
    { id: 'discussions', name: 'Discussions', icon: MessageCircle }
  ];

  return (
    <Layout title="Community">
      <div className="bg-gray-50 py-8">
        <div className="container">
          <div className="max-w-6xl mx-auto">
            {/* Header */}
            <div className="text-center mb-12">
              <h1 className="text-4xl font-bold text-gray-900 mb-4">
                Join Our Community
              </h1>
              <p className="text-lg text-gray-600 mb-8">
                Connect with industry professionals, share experiences, and discover how others are transforming their operations with our solutions.
              </p>
              
              {/* Social Links */}
              <div className="flex justify-center space-x-4">
                <a
                  href="https://instagram.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-10 h-10 bg-gradient-to-r from-purple-600 to-pink-600 rounded-full flex items-center justify-center text-white hover:scale-110 transition-transform"
                >
                  <Instagram className="w-5 h-5" />
                </a>
                <a
                  href="https://twitter.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-10 h-10 bg-blue-400 rounded-full flex items-center justify-center text-white hover:scale-110 transition-transform"
                >
                  <Twitter className="w-5 h-5" />
                </a>
                <a
                  href="https://facebook.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center text-white hover:scale-110 transition-transform"
                >
                  <Facebook className="w-5 h-5" />
                </a>
                <a
                  href="https://linkedin.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-10 h-10 bg-blue-700 rounded-full flex items-center justify-center text-white hover:scale-110 transition-transform"
                >
                  <Linkedin className="w-5 h-5" />
                </a>
              </div>
            </div>

            {/* Tabs */}
            <div className="border-b border-gray-200 mb-8">
              <div className="flex space-x-8">
                {tabs.map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                      activeTab === tab.id
                        ? 'border-primary-600 text-primary-600'
                        : 'border-transparent text-gray-500 hover:text-gray-700'
                    }`}
                  >
                    <div className="flex items-center space-x-2">
                      <tab.icon className="w-4 h-4" />
                      <span>{tab.name}</span>
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Search and Filters */}
            <div className="mb-8">
              <div className="flex flex-col lg:flex-row gap-4">
                <div className="flex-1 relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search community posts..."
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                  />
                </div>
                <div className="flex items-center space-x-2">
                  <Filter className="w-5 h-5 text-gray-400" />
                  <select
                    value={selectedCategory}
                    onChange={(e) => setSelectedCategory(e.target.value)}
                    className="border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary-500"
                  >
                    {categories.map(category => (
                      <option key={category.id} value={category.id}>
                        {category.name} ({category.count})
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>

            {/* Tab Content */}
            {activeTab === 'gallery' && (
              <div>
                {/* Stats */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
                  <div className="bg-white rounded-lg p-6 text-center shadow-sm">
                    <Users className="w-8 h-8 text-primary-600 mx-auto mb-2" />
                    <div className="text-2xl font-bold text-gray-900">2,847</div>
                    <div className="text-sm text-gray-600">Community Members</div>
                  </div>
                  <div className="bg-white rounded-lg p-6 text-center shadow-sm">
                    <Camera className="w-8 h-8 text-primary-600 mx-auto mb-2" />
                    <div className="text-2xl font-bold text-gray-900">1,234</div>
                    <div className="text-sm text-gray-600">Posts Shared</div>
                  </div>
                  <div className="bg-white rounded-lg p-6 text-center shadow-sm">
                    <Heart className="w-8 h-8 text-primary-600 mx-auto mb-2" />
                    <div className="text-2xl font-bold text-gray-900">45.2K</div>
                    <div className="text-sm text-gray-600">Total Likes</div>
                  </div>
                  <div className="bg-white rounded-lg p-6 text-center shadow-sm">
                    <MessageCircle className="w-8 h-8 text-primary-600 mx-auto mb-2" />
                    <div className="text-2xl font-bold text-gray-900">8,921</div>
                    <div className="text-sm text-gray-600">Comments</div>
                  </div>
                </div>

                {/* Gallery Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {filteredPosts.map((post) => (
                    <div key={post.id} className="bg-white rounded-lg overflow-hidden shadow-sm hover:shadow-lg transition-shadow group">
                      {/* Image */}
                      <div className="relative aspect-square">
                        <img
                          src={post.image}
                          alt={post.caption}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                        
                        {/* Overlay */}
                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                          <div className="absolute bottom-4 left-4 right-4">
                            <div className="flex items-center justify-between text-white">
                              <div className="flex items-center space-x-4">
                                <button className="flex items-center space-x-1 hover:scale-110 transition-transform">
                                  <Heart className="w-4 h-4" />
                                  <span className="text-sm">{post.likes}</span>
                                </button>
                                <button className="flex items-center space-x-1 hover:scale-110 transition-transform">
                                  <MessageCircle className="w-4 h-4" />
                                  <span className="text-sm">{post.comments}</span>
                                </button>
                              </div>
                              <button className="hover:scale-110 transition-transform">
                                <Share2 className="w-4 h-4" />
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Content */}
                      <div className="p-4">
                        {/* User Info */}
                        <div className="flex items-center space-x-3 mb-3">
                          <img
                            src={post.user.avatar}
                            alt={post.user.name}
                            className="w-8 h-8 rounded-full"
                          />
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium text-gray-900 truncate">
                              {post.user.name}
                            </p>
                            <p className="text-xs text-gray-500 truncate">
                              {post.user.company}
                            </p>
                          </div>
                        </div>

                        {/* Caption */}
                        <p className="text-sm text-gray-600 mb-2 line-clamp-2">
                          {post.caption}
                        </p>

                        {/* Tags */}
                        <div className="flex flex-wrap gap-1 mb-2">
                          {post.tags.map((tag) => (
                            <span
                              key={tag}
                              className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded"
                            >
                              #{tag}
                            </span>
                          ))}
                        </div>

                        {/* Timestamp */}
                        <p className="text-xs text-gray-500">{post.timestamp}</p>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Load More */}
                <div className="text-center mt-8">
                  <button className="bg-primary-600 text-white px-8 py-3 rounded-lg hover:bg-primary-700 transition-colors">
                    Load More Posts
                  </button>
                </div>
              </div>
            )}

            {activeTab === 'members' && (
              <div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {featuredMembers.map((member, index) => (
                    <div key={index} className="bg-white rounded-lg p-6 text-center shadow-sm hover:shadow-lg transition-shadow">
                      <img
                        src={member.avatar}
                        alt={member.name}
                        className="w-20 h-20 rounded-full mx-auto mb-4"
                      />
                      <h3 className="text-lg font-semibold text-gray-900 mb-1">{member.name}</h3>
                      <p className="text-sm text-gray-600 mb-1">{member.role}</p>
                      <p className="text-sm text-gray-500 mb-4">{member.company}</p>
                      
                      <div className="flex flex-wrap justify-center gap-2 mb-4">
                        {member.badges.map((badge) => (
                          <span
                            key={badge}
                            className="text-xs bg-primary-100 text-primary-600 px-2 py-1 rounded"
                          >
                            {badge}
                          </span>
                        ))}
                      </div>
                      
                      <div className="text-sm text-gray-600">
                        <span className="font-semibold">{member.contributions}</span> contributions
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {activeTab === 'discussions' && (
              <div className="bg-white rounded-lg p-8 text-center shadow-sm">
                <MessageCircle className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-gray-900 mb-2">Discussions Coming Soon</h3>
                <p className="text-gray-600 mb-6">
                  Our discussion forums will be launching soon. Join our community gallery in the meantime!
                </p>
                <button
                  onClick={() => setActiveTab('gallery')}
                  className="bg-primary-600 text-white px-6 py-2 rounded-lg hover:bg-primary-700 transition-colors"
                >
                  View Community Gallery
                </button>
              </div>
            )}

            {/* Call to Action */}
            <div className="mt-16 bg-gradient-to-r from-primary-600 to-primary-700 rounded-lg p-8 text-center text-white">
              <h2 className="text-2xl font-bold mb-4">Share Your Story</h2>
              <p className="mb-6 text-primary-100">
                Have a success story with our products? Share it with the community and inspire others!
              </p>
              <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                <button className="bg-white text-primary-600 px-6 py-3 rounded-lg hover:bg-gray-100 transition-colors font-medium">
                  Share Your Story
                </button>
                <button className="border border-white text-white px-6 py-3 rounded-lg hover:bg-white hover:text-primary-600 transition-colors font-medium">
                  Community Guidelines
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default CommunityPage;
