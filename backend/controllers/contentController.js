// Mock content data as fallback
const mockContent = {
  home: {
    pageKey: "home",
    hero: {
      title: "Premium Alcantara Accessories",
      subtitle: "Elevate Your Lifestyle",
      content: "Discover our premium collection of Alcantara products crafted with precision and care.",
      buttonText: "Shop Now",
      buttonLink: "/products",
      backgroundImage: ""
    },
    asSeenIn: {
      title: "As seen in",
      items: [
        { title: "REDLINE" },
        { title: "MTAY" },
        { title: "ONDERNEMER" },
        { title: "TopGear" }
      ]
    },
    collections: {
      title: "Shop Our Collections",
      items: [
        {
          id: 1,
          title: "Phone Cases",
          image: "/api/placeholder/400/300",
          link: "/category/phone-cases",
        },
        {
          id: 2,
          title: "Wallets",
          image: "/api/placeholder/400/300",
          link: "/category/wallets",
        },
        {
          id: 3,
          title: "Accessories",
          image: "/api/placeholder/400/300",
          link: "/category/accessories",
        },
        {
          id: 4,
          title: "Car & Travel",
          image: "/api/placeholder/400/300",
          link: "/category/car-travel",
        },
        {
          id: 5,
          title: "Office",
          image: "/api/placeholder/400/300",
          link: "/category/office",
        },
        {
          id: 6,
          title: "Sale",
          image: "/api/placeholder/400/300",
          link: "/category/sale",
        },
      ]
    },
    newWeHave: {
      title: "New We Have",
      content: "Discover our latest collection of premium Alcantara accessories, designed to elevate your everyday luxury experience.",
      buttonText: "Shop Now",
      buttonLink: "/products",
      imageUrl: ""
    },
    automotive: {
      title: "ALCANTARA FOR AUTOMOTIVE",
      content: "Experience the luxury of Alcantara in your vehicle. Our premium automotive accessories provide the perfect combination of style, comfort, and durability for discerning car enthusiasts.",
      buttonText: "Discover More",
      buttonLink: "/solutions/automotive",
      imageUrl: ""
    },
    tuners: {
      title: "Tuned by the world's top tuners",
      items: [
        {
          id: 1,
          title: "John Smith",
          description: "Professional Car Tuner",
          image: "/api/placeholder/100/100",
          link: "Specializing in luxury vehicle modifications with Alcantara interiors."
        },
        {
          id: 2,
          title: "Mike Johnson", 
          description: "Performance Specialist",
          image: "/api/placeholder/100/100",
          link: "Expert in high-performance vehicle upgrades and custom Alcantara work."
        },
        {
          id: 3,
          title: "David Lee",
          description: "Interior Designer", 
          image: "/api/placeholder/100/100",
          link: "Creating bespoke automotive interiors with premium Alcantara materials."
        }
      ]
    },
    partner: {
      title: "Proud partner of Conkero.com",
      content: "We are honored to partner with Conkero.com to bring you the finest Alcantara products and accessories. Together, we deliver exceptional quality and service to our valued customers.",
      buttonText: "Learn More",
      buttonLink: "/partners",
      imageUrl: "",
      videoUrl: "",
      videoFile: ""
    },
    team: {
      title: "Team Alcantara",
      content: "Our dedicated team of professionals is committed to bringing you the finest Alcantara products and exceptional customer service. With years of experience in the luxury goods industry, we understand what it takes to deliver excellence.",
      buttonText: "Meet the Team",
      buttonLink: "/about",
      imageUrl: ""
    },
    community: {
      title: "Join our community",
      items: Array.from({ length: 8 }, (_, i) => ({
        id: i + 1,
        title: `Community Post ${i + 1}`,
        description: "Community description",
        image: "/api/placeholder/300/300",
        link: "/community"
      }))
    }
  }
};

// Get content by page key
exports.getContent = async (req, res) => {
  try {
    const { pageKey } = req.params;
    
    // Return mock data for now
    const content = mockContent[pageKey] || mockContent.home;

    res.json({ content });
  } catch (error) {
    console.error('Error getting content:', error);
    res.status(500).json({ error: error.message });
  }
};

// Update content (Admin)
exports.updateContent = async (req, res) => {
  try {
    const { pageKey } = req.params;
    const updates = req.body;

    console.log('Updating content for:', pageKey, 'with data keys:', Object.keys(updates));

    // For now, just return success with the updated data
    const content = {
      ...mockContent[pageKey] || mockContent.home,
      ...updates,
      pageKey
    };

    console.log('Content updated successfully for page:', pageKey);

    res.json({
      message: "Content updated successfully",
      content,
    });
  } catch (error) {
    console.error('Error updating content:', error);
    res.status(500).json({ error: error.message });
  }
};
