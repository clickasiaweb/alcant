import React from "react";
import dynamic from "next/dynamic";
import Layout from "../components/Layout";
import Link from "next/link";
import { getHomeContent } from "../services/contentService";

const NewProductsSection = dynamic(() => import("../components/NewProductsSectionMock"), {
  ssr: false,
  loading: () => (
    <section className="py-16 bg-white">
      <div className="container">
        <h2 className="text-3xl md:text-4xl font-bold text-primary-900 mb-12 text-center">
          New Arrivals
        </h2>
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
        </div>
      </div>
    </section>
  )
});
import Play from "lucide-react/dist/esm/icons/play";
import ShoppingBag from "lucide-react/dist/esm/icons/shopping-bag";
import ChevronRight from "lucide-react/dist/esm/icons/chevron-right";
import Tag from "lucide-react/dist/esm/icons/tag";
import Facebook from "lucide-react/dist/esm/icons/facebook";
import Twitter from "lucide-react/dist/esm/icons/twitter";
import Instagram from "lucide-react/dist/esm/icons/instagram";
import Youtube from "lucide-react/dist/esm/icons/youtube";
import Mail from "lucide-react/dist/esm/icons/mail";
import Phone from "lucide-react/dist/esm/icons/phone";
import MapPin from "lucide-react/dist/esm/icons/map-pin";

const AlcantaraHome = ({ homeContent = {} }) => {
  const collections = homeContent.collections?.items || [
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
  ];

  const tuners = homeContent.tuners?.items || [
    {
      id: 1,
      name: "John Smith",
      title: "Professional Car Tuner",
      image: "/api/placeholder/100/100",
      description:
        "Specializing in luxury vehicle modifications with Alcantara interiors.",
    },
    {
      id: 2,
      name: "Mike Johnson",
      title: "Performance Specialist",
      image: "/api/placeholder/100/100",
      description:
        "Expert in high-performance vehicle upgrades and custom Alcantara work.",
    },
    {
      id: 3,
      name: "David Lee",
      title: "Interior Designer",
      image: "/api/placeholder/100/100",
      description:
        "Creating bespoke automotive interiors with premium Alcantara materials.",
    },
  ];

  const communityPosts = Array.from({ length: 8 }, (_, i) => ({
    id: i + 1,
    image: "/api/placeholder/300/300",
    title: `Community Post ${i + 1}`,
  }));

  return (
    <Layout
      title="Alcantara Accessories - Premium Products"
      description="Premium Alcantara accessories for every day"
    >
      {/* Promotional Banner Section */}
      <section 
        className="relative w-full h-80 md:h-96 bg-gradient-to-r from-blue-600 to-blue-800 flex items-center overflow-hidden"
        style={{
          backgroundImage: homeContent.hero?.backgroundImage ? `url(${homeContent.hero.backgroundImage})` : undefined,
          backgroundSize: 'cover',
          backgroundPosition: 'center'
        }}
      >
        {/* Background Products */}
        <div className="absolute left-0 top-0 h-full w-1/3 flex items-center justify-center opacity-20">
          <div className="relative">
            <div className="w-32 h-32 bg-white/10 rounded-lg mb-4"></div>
            <div className="w-24 h-24 bg-white/10 rounded-lg mb-2"></div>
            <div className="w-20 h-16 bg-white/10 rounded-lg"></div>
          </div>
        </div>
        
        {/* Content */}
        <div className="relative z-10 text-left space-y-4 px-6 md:px-12 max-w-2xl">
          <p className=" font-semibold text-white uppercase tracking-wider drop-shadow-lg text-4xl">
            {homeContent.hero?.subtitle}
          </p>
          <h2 className="text-4xl md:text-6xl font-bold leading-tight text-white drop-shadow-2xl">
            {homeContent.hero?.title}
          </h2>
          <p className="text-xl text-white drop-shadow-lg max-w-lg">
            {homeContent.hero?.content}
          </p>
          <div className="pt-4">
            <Link
              href={homeContent.hero?.buttonLink || "/products"}
              className="inline-block bg-white text-blue-700 hover:bg-blue-50 text-lg font-semibold px-8 py-3 rounded-lg transition-all duration-300 transform hover:scale-105 shadow-lg"
            >
              {homeContent.hero?.buttonText}
            </Link>
          </div>
        </div>
        
        {/* Brand Name */}
        <div className="absolute bottom-4 right-6 text-white/80 text-sm font-medium">
          WWW.ALCANSIDE.COM
        </div>
      </section>

      {/* As Seen In Section */}
      <section className="py-12 bg-gray-50">
        <div className="container">
          <h3 className="text-center text-lg font-semibold text-gray-600 mb-8">
            {homeContent.asSeenIn?.title || "As seen in"}
          </h3>
          <div className="flex flex-wrap justify-center items-center gap-8 md:gap-12">
            {homeContent.asSeenIn?.items?.length > 0 ? (
              homeContent.asSeenIn.items.map((item, index) => (
                <div key={index} className="text-gray-400 font-bold text-xl">
                  {item.title}
                </div>
              ))
            ) : (
              <>
                <div className="text-gray-400 font-bold text-xl">REDLINE</div>
                <div className="text-gray-400 font-bold text-xl">MTAY</div>
                <div className="text-gray-400 font-bold text-xl">ONDERNEMER</div>
                <div className="text-gray-400 font-bold text-xl">TopGear</div>
              </>
            )}
          </div>
        </div>
      </section>

      <NewProductsSection />

      {/* Shop Our Collections */}
      <section className="py-16 bg-gray-50">
        <div className="container">
          <h2 className="text-3xl md:text-4xl font-bold text-primary-900 mb-12 text-center">
            {homeContent.collections?.title || "Shop Our Collections"}
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {homeContent.collections?.items?.length > 0 ? (
              homeContent.collections.items.map((item, index) => (
                <Link
                  key={index}
                  href={item.link || "/products"}
                  className="group block"
                >
                  <div className="relative overflow-hidden rounded-lg">
                    {item.image ? (
                      <img 
                        src={item.image} 
                        alt={item.title}
                        className="w-full h-64 object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                    ) : (
                      <div className="w-full h-64 bg-gray-200 flex items-center justify-center">
                        <span className="text-gray-600">
                          {item.title || 'Collection Image'}
                        </span>
                      </div>
                    )}
                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                      <span className="text-white font-semibold">
                        View Collection
                      </span>
                    </div>
                  </div>
                  <h3 className="text-lg font-semibold text-primary-900 mt-4">
                    {item.title || "Collection"}
                  </h3>
                </Link>
              ))
            ) : (
              collections.map((collection) => (
                <Link
                  key={collection.id}
                  href={collection.link}
                  className="group block"
                >
                  <div className="relative overflow-hidden rounded-lg">
                    {collection.image ? (
                      <img 
                        src={collection.image} 
                        alt={collection.title}
                        className="w-full h-64 object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                    ) : (
                      <div className="w-full h-64 bg-gray-200 flex items-center justify-center">
                        <span className="text-gray-600">Collection Image</span>
                      </div>
                    )}
                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                      <span className="text-white font-semibold">
                        View Collection
                      </span>
                    </div>
                  </div>
                  <h3 className="text-lg font-semibold text-primary-900 mt-4">
                    {collection.title}
                  </h3>
                </Link>
              ))
            )}
          </div>
        </div>
      </section>

      {/* New We Have Section */}
      <section className="py-16 bg-white">
        <div className="container">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold text-primary-900 mb-6">
                {homeContent.newWeHave?.title || "New We Have"}
              </h2>
              <p className="text-lg text-gray-600 mb-8">
                {homeContent.newWeHave?.content || "Discover our latest collection of premium Alcantara accessories, designed to elevate your everyday luxury experience."}
              </p>
              <Link
                href={homeContent.newWeHave?.buttonLink || "/products"}
                className="inline-flex items-center bg-primary-900 text-white px-8 py-3 rounded-lg font-semibold hover:bg-primary-800 transition-colors"
              >
                {homeContent.newWeHave?.buttonText || "Shop Now"}
                <ChevronRight className="w-5 h-5 ml-2" />
              </Link>
            </div>
            <div>
              {homeContent.newWeHave?.imageUrl ? (
                <img 
                  src={homeContent.newWeHave.imageUrl}
                  alt="New Products"
                  className="h-96 w-full rounded-lg object-cover"
                />
              ) : (
                <div className="bg-gray-200 h-96 rounded-lg flex items-center justify-center">
                  <span className="text-gray-600 text-xl">
                    New products image
                  </span>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Alcantara for Automotive */}
      <section className="py-16 bg-white">
        <div className="container">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="order-2 lg:order-1">
              <h2 className="text-3xl md:text-4xl font-bold text-primary-900 mb-6">
                {homeContent.automotive?.title || "ALCANTARA FOR AUTOMOTIVE"}
              </h2>
              <p className="text-lg text-gray-600 mb-8">
                {homeContent.automotive?.content || "Experience the luxury of Alcantara in your vehicle. Our premium automotive accessories provide the perfect combination of style, comfort, and durability for discerning car enthusiasts."}
              </p>
              <Link
                href={homeContent.automotive?.buttonLink || "/solutions/automotive"}
                className="inline-flex items-center bg-primary-900 text-white px-8 py-3 rounded-lg font-semibold hover:bg-primary-800 transition-colors"
              >
                {homeContent.automotive?.buttonText || "Discover More"}
                <ChevronRight className="w-5 h-5 ml-2" />
              </Link>
            </div>
            <div className="order-1 lg:order-2">
              {homeContent.automotive?.imageUrl ? (
                <img 
                  src={homeContent.automotive.imageUrl}
                  alt="Automotive"
                  className="h-96 w-full rounded-lg object-cover"
                />
              ) : (
                <div className="bg-gray-200 h-96 rounded-lg flex items-center justify-center">
                  <span className="text-gray-600 text-xl">
                    Two men with car image
                  </span>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Tuned by the world's top tuners */}
      <section className="py-16 bg-gray-50">
        <div className="container">
          <h2 className="text-3xl md:text-4xl font-bold text-primary-900 mb-12 text-center">
            {homeContent.tuners?.title || "Tuned by the world's top tuners"}
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {homeContent.tuners?.items?.length > 0 ? (
              homeContent.tuners.items.map((item, index) => (
                <div key={index} className="bg-white rounded-lg shadow-lg p-6">
                  <div className="flex items-center mb-4">
                    {item.image ? (
                      <img 
                        src={item.image} 
                        alt={item.title}
                        className="w-16 h-16 rounded-full object-cover mr-4"
                      />
                    ) : (
                      <div className="w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center mr-4">
                        <span className="text-gray-600">Photo</span>
                      </div>
                    )}
                    <div>
                      <h3 className="text-lg font-semibold text-primary-900">
                        {item.title || "Tuner Name"}
                      </h3>
                      <p className="text-sm text-gray-600">{item.description || "Professional Title"}</p>
                    </div>
                  </div>
                  <p className="text-gray-700">{item.link || "Tuner description"}</p>
                </div>
              ))
            ) : (
              tuners.map((tuner) => (
                <div key={tuner.id} className="bg-white rounded-lg shadow-lg p-6">
                  <div className="flex items-center mb-4">
                    {tuner.image ? (
                      <img 
                        src={tuner.image} 
                        alt={tuner.name}
                        className="w-16 h-16 rounded-full object-cover mr-4"
                      />
                    ) : (
                      <div className="w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center mr-4">
                        <span className="text-gray-600">Photo</span>
                      </div>
                    )}
                    <div>
                      <h3 className="text-lg font-semibold text-primary-900">
                        {tuner.name}
                      </h3>
                      <p className="text-sm text-gray-600">{tuner.title}</p>
                    </div>
                  </div>
                  <p className="text-gray-700">{tuner.description}</p>
                </div>
              ))
            )}
          </div>
        </div>
      </section>

      {/* Proud partner of Conkero.com */}
      <section className="py-16 bg-primary-900 text-white">
        <div className="container">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold mb-6">
                {homeContent.partner?.title || "Proud partner of Conkero.com"}
              </h2>
              <p className="text-lg text-primary-100 mb-8">
                {homeContent.partner?.content || "We are honored to partner with Conkero.com to bring you the finest Alcantara products and accessories. Together, we deliver exceptional quality and service to our valued customers."}
              </p>
              <div className="flex space-x-4">
                <Link
                  href={homeContent.partner?.buttonLink || "/partners"}
                  className="bg-white text-primary-900 px-6 py-3 rounded-lg font-semibold hover:bg-primary-50 transition-colors"
                >
                  {homeContent.partner?.buttonText || "Learn More"}
                </Link>
                <button className="border-2 border-white text-white px-6 py-3 rounded-lg font-semibold hover:bg-white hover:text-primary-900 transition-colors">
                  Contact Us
                </button>
              </div>
            </div>
            <div>
              {homeContent.partner?.videoFile ? (
                <div className="relative h-64 rounded-lg overflow-hidden">
                  <video
                    src={homeContent.partner.videoFile}
                    controls
                    className="w-full h-full object-cover"
                  >
                    Your browser does not support the video tag.
                  </video>
                </div>
              ) : homeContent.partner?.videoUrl ? (
                <div className="relative h-64 rounded-lg overflow-hidden">
                  <iframe
                    src={homeContent.partner.videoUrl}
                    className="w-full h-full"
                    allowFullScreen
                  />
                </div>
              ) : homeContent.partner?.imageUrl ? (
                <img 
                  src={homeContent.partner.imageUrl}
                  alt="Partner"
                  className="h-64 w-full rounded-lg object-cover"
                />
              ) : (
                <div className="bg-gray-800 h-64 rounded-lg flex items-center justify-center">
                  <div className="text-center">
                    <Play className="w-16 h-16 text-white mx-auto mb-4" />
                    <p className="text-white">Video Player</p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Team Alcantara */}
      <section className="py-16 bg-white">
        <div className="container">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              {homeContent.team?.imageUrl ? (
                <img 
                  src={homeContent.team.imageUrl}
                  alt="Team"
                  className="h-96 w-full rounded-lg object-cover"
                />
              ) : (
                <div className="bg-gray-200 h-96 rounded-lg flex items-center justify-center">
                  <span className="text-gray-600 text-xl">
                    Team with car image
                  </span>
                </div>
              )}
            </div>
            <div>
              <h2 className="text-3xl md:text-4xl font-bold text-primary-900 mb-6">
                {homeContent.team?.title || "Team Alcantara"}
              </h2>
              <p className="text-lg text-gray-600 mb-6">
                {homeContent.team?.content || "Our dedicated team of professionals is committed to bringing you the finest Alcantara products and exceptional customer service. With years of experience in the luxury goods industry, we understand what it takes to deliver excellence."}
              </p>
              <p className="text-lg text-gray-600 mb-8">
                From our skilled craftsmen to our knowledgeable sales team, every member of Team Alcantara shares a passion for quality and a commitment to customer satisfaction.
              </p>
              <Link
                href={homeContent.team?.buttonLink || "/about"}
                className="inline-flex items-center bg-primary-900 text-white px-8 py-3 rounded-lg font-semibold hover:bg-primary-800 transition-colors"
              >
                {homeContent.team?.buttonText || "Meet the Team"}
                <ChevronRight className="w-5 h-5 ml-2" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Join our community */}
      <section className="py-16 bg-gray-50">
        <div className="container">
          <h2 className="text-3xl md:text-4xl font-bold text-primary-900 mb-12 text-center">
            {homeContent.community?.title || "Join our community"}
          </h2>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
            {homeContent.community?.items?.length > 0 ? (
              homeContent.community.items.map((item, index) => (
                <div
                  key={index}
                  className="bg-white rounded-lg overflow-hidden shadow-md hover:shadow-lg transition-shadow"
                >
                  {item.image ? (
                    <img 
                      src={item.image} 
                      alt={item.title}
                      className="w-full h-48 object-cover"
                    />
                  ) : (
                    <div className="bg-gray-200 h-48 flex items-center justify-center">
                      <span className="text-gray-600">{item.title || 'Community Post'}</span>
                    </div>
                  )}
                  <div className="p-4">
                    <h3 className="text-sm font-semibold text-gray-900 mb-2">
                      {item.title || `Community Post ${index + 1}`}
                    </h3>
                    <p className="text-xs text-gray-600 mb-3">
                      {item.description || "Community description"}
                    </p>
                    <Link
                      href={item.link || "/community"}
                      className="text-primary-600 hover:text-primary-800 text-sm font-medium"
                    >
                      View More
                    </Link>
                  </div>
                </div>
              ))
            ) : (
              communityPosts.map((post) => (
                <div
                  key={post.id}
                  className="bg-gray-200 h-48 rounded-lg flex items-center justify-center"
                >
                  <span className="text-gray-600">Community Post</span>
                </div>
              ))
            )}
          </div>

          <div className="text-center">
            <Link
              href="/community"
              className="inline-flex items-center bg-primary-900 text-white px-8 py-3 rounded-lg font-semibold hover:bg-primary-800 transition-colors"
            >
              View more
              <ChevronRight className="w-5 h-5 ml-2" />
            </Link>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 bg-white">
        <div className="container">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <ShoppingBag className="w-8 h-8 text-primary-900" />
              </div>
              <h3 className="text-xl font-semibold text-primary-900 mb-2">
                Free Shipping
              </h3>
              <p className="text-gray-600">
                Free shipping on all orders over $100
              </p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Phone className="w-8 h-8 text-primary-900" />
              </div>
              <h3 className="text-xl font-semibold text-primary-900 mb-2">
                Support
              </h3>
              <p className="text-gray-600">24/7 customer support available</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <MapPin className="w-8 h-8 text-primary-900" />
              </div>
              <h3 className="text-xl font-semibold text-primary-900 mb-2">
                Safe Shopping
              </h3>
              <p className="text-gray-600">100% secure payment processing</p>
            </div>
          </div>
        </div>
      </section>
    </Layout>
  );
};

export async function getServerSideProps() {
  try {
    const homeContent = await getHomeContent();
    return {
      props: {
        homeContent,
      },
    };
  } catch (error) {
    console.error('Error fetching home content:', error);
    return {
      props: {
        homeContent: {},
      },
    };
  }
}

export default AlcantaraHome;
