import React from "react";
import Link from "next/link";
import { 
  FaPhone, 
  FaEnvelope, 
  FaLinkedin, 
  FaTwitter, 
  FaFacebook,
  FaInstagram,
  FaYoutube,
  FaMapMarkerAlt,
  FaClock,
  FaShieldAlt,
  FaTruck
} from "react-icons/fa";
import { 
  Phone, 
  Mail, 
  MapPin, 
  Clock, 
  Shield, 
  Truck,
  Package,
  Settings,
  FileText,
  Users,
  ChevronRight,
  Instagram,
  Twitter,
  Facebook,
  Linkedin,
  Youtube
} from "lucide-react";

export default function Footer() {
  const currentYear = new Date().getFullYear();

  const footerSections = [
    {
      title: "Shop",
      links: [
        { name: "All Products", href: "/products" },
        { name: "Automation Systems", href: "/products?category=automation" },
        { name: "Machinery", href: "/products?category=machinery" },
        { name: "Quality Control", href: "/products?category=quality-control" },
        { name: "Robotics", href: "/products?category=robotics" },
        { name: "New Arrivals", href: "/products?filter=new" },
        { name: "Best Sellers", href: "/products?filter=popular" },
        { name: "Special Offers", href: "/products?filter=sale" }
      ]
    },
    {
      title: "Solutions",
      links: [
        { name: "Manufacturing", href: "/solutions/manufacturing" },
        { name: "Logistics", href: "/solutions/logistics" },
        { name: "Packaging", href: "/solutions/packaging" },
        { name: "Food Processing", href: "/solutions/food-processing" },
        { name: "Pharmaceutical", href: "/solutions/pharmaceutical" },
        { name: "Automotive", href: "/solutions/automotive" },
        { name: "Aerospace", href: "/solutions/aerospace" },
        { name: "Case Studies", href: "/solutions/case-studies" }
      ]
    },
    {
      title: "Resources",
      links: [
        { name: "Documentation", href: "/resources/documentation" },
        { name: "User Manuals", href: "/resources/manuals" },
        { name: "Technical Support", href: "/resources/support" },
        { name: "FAQ", href: "/faq" },
        { name: "Video Tutorials", href: "/resources/tutorials" },
        { name: "Webinars", href: "/resources/webinars" },
        { name: "Blog", href: "/blog" },
        { name: "Downloads", href: "/resources/downloads" }
      ]
    },
    {
      title: "Company",
      links: [
        { name: "About Us", href: "/about" },
        { name: "Our Story", href: "/about/story" },
        { name: "Team", href: "/about/team" },
        { name: "Careers", href: "/careers" },
        { name: "Press", href: "/press" },
        { name: "Partners", href: "/partners" },
        { name: "Sustainability", href: "/sustainability" },
        { name: "Investors", href: "/investors" }
      ]
    }
  ];

  const legalLinks = [
    { name: "Privacy Policy", href: "/privacy" },
    { name: "Terms of Service", href: "/terms" },
    { name: "Cookie Policy", href: "/cookies" },
    { name: "Shipping Policy", href: "/shipping" },
    { name: "Return Policy", href: "/returns" },
    { name: "Warranty", href: "/warranty" }
  ];

  const supportInfo = [
    {
      icon: Phone,
      label: "Phone Support",
      value: "+1 (800) 123-4567",
      description: "Mon-Fri 9AM-6PM EST"
    },
    {
      icon: Mail,
      label: "Email Support",
      value: "support@industrial-solutions.com",
      description: "24/7 response time"
    },
    {
      icon: MapPin,
      label: "Headquarters",
      value: "123 Industrial Park Drive",
      description: "Manufacturing City, CA 90210"
    },
    {
      icon: Clock,
      label: "Business Hours",
      value: "Monday - Friday",
      description: "9:00 AM - 6:00 PM EST"
    }
  ];

  const trustBadges = [
    {
      icon: Shield,
      title: "Secure Shopping",
      description: "SSL encrypted transactions"
    },
    {
      icon: Truck,
      title: "Free Shipping",
      description: "On orders over $10,000"
    },
    {
      icon: Package,
      title: "5 Year Warranty",
      description: "Comprehensive coverage"
    }
  ];

  const socialLinks = [
    {
      name: "Facebook",
      href: "https://facebook.com",
      icon: Facebook,
      color: "hover:bg-blue-600"
    },
    {
      name: "Twitter",
      href: "https://twitter.com",
      icon: Twitter,
      color: "hover:bg-blue-400"
    },
    {
      name: "LinkedIn",
      href: "https://linkedin.com",
      icon: Linkedin,
      color: "hover:bg-blue-700"
    },
    {
      name: "Instagram",
      href: "https://instagram.com",
      icon: Instagram,
      color: "hover:bg-pink-600"
    },
    {
      name: "YouTube",
      href: "https://youtube.com",
      icon: Youtube,
      color: "hover:bg-red-600"
    }
  ];

  return (
    <footer className="bg-gray-900 text-white">
      {/* Newsletter Signup */}
      <div className="border-b border-gray-800">
        <div className="container py-8">
          <div className="max-w-4xl mx-auto text-center">
            <h3 className="text-2xl font-bold mb-4">Stay Updated</h3>
            <p className="text-gray-400 mb-6">
              Get the latest product updates, industry news, and exclusive offers delivered to your inbox.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 max-w-md mx-auto">
              <input
                type="email"
                placeholder="Enter your email address"
                className="flex-1 px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary-500"
              />
              <button className="bg-primary-600 text-white px-6 py-3 rounded-lg hover:bg-primary-700 transition-colors font-medium">
                Subscribe
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Footer Content */}
      <div className="container py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-8">
          {/* Company Info */}
          <div className="lg:col-span-2">
            <div className="flex items-center space-x-2 mb-4">
              <Package className="w-8 h-8 text-primary-400" />
              <h3 className="text-2xl font-bold">Industrial Solutions</h3>
            </div>
            <p className="text-gray-400 mb-6 leading-relaxed">
              Providing premium industrial automation solutions with unmatched quality, reliability, and customer support. 
              Transform your manufacturing operations with cutting-edge technology.
            </p>
            
            {/* Trust Badges */}
            <div className="space-y-3">
              {trustBadges.map((badge, index) => (
                <div key={index} className="flex items-center space-x-3">
                  <badge.icon className="w-5 h-5 text-primary-400" />
                  <div>
                    <p className="text-sm font-medium text-white">{badge.title}</p>
                    <p className="text-xs text-gray-400">{badge.description}</p>
                  </div>
                </div>
              ))}
            </div>

            {/* Social Links */}
            <div className="mt-6">
              <h4 className="text-lg font-semibold mb-4">Follow Us</h4>
              <div className="flex space-x-3">
                {socialLinks.map((social) => (
                  <a
                    key={social.name}
                    href={social.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`w-10 h-10 bg-gray-800 rounded-full flex items-center justify-center text-gray-400 transition-all duration-300 hover:scale-110 ${social.color} hover:text-white`}
                    aria-label={social.name}
                  >
                    <social.icon className="w-5 h-5" />
                  </a>
                ))}
              </div>
            </div>
          </div>

          {/* Footer Sections */}
          {footerSections.map((section) => (
            <div key={section.title}>
              <h4 className="text-lg font-semibold mb-4">{section.title}</h4>
              <ul className="space-y-2">
                {section.links.map((link) => (
                  <li key={link.name}>
                    <Link
                      href={link.href}
                      className="text-gray-400 hover:text-primary-400 transition-colors duration-300 flex items-center group"
                    >
                      <ChevronRight className="w-3 h-3 mr-2 opacity-0 group-hover:opacity-100 transition-opacity" />
                      {link.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}

          {/* Contact Info */}
          <div>
            <h4 className="text-lg font-semibold mb-4">Contact Info</h4>
            <div className="space-y-4">
              {supportInfo.map((info, index) => (
                <div key={index} className="flex items-start space-x-3">
                  <info.icon className="w-5 h-5 text-primary-400 mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="text-sm font-medium text-white">{info.label}</p>
                    <p className="text-sm text-gray-400">{info.value}</p>
                    <p className="text-xs text-gray-500">{info.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Footer */}
      <div className="border-t border-gray-800">
        <div className="container py-6">
          <div className="flex flex-col lg:flex-row justify-between items-center space-y-4 lg:space-y-0">
            {/* Copyright */}
            <div className="text-sm text-gray-400">
              © {currentYear} Industrial Solutions. All rights reserved.
            </div>

            {/* Legal Links */}
            <div className="flex flex-wrap items-center space-x-6 text-sm">
              {legalLinks.map((link) => (
                <Link
                  key={link.name}
                  href={link.href}
                  className="text-gray-400 hover:text-primary-400 transition-colors duration-300"
                >
                  {link.name}
                </Link>
              ))}
            </div>

            {/* Payment Methods */}
            <div className="flex items-center space-x-4">
              <span className="text-sm text-gray-400">Payment Methods:</span>
              <div className="flex space-x-2">
                <div className="w-8 h-5 bg-gray-700 rounded flex items-center justify-center">
                  <span className="text-xs text-gray-400">VISA</span>
                </div>
                <div className="w-8 h-5 bg-gray-700 rounded flex items-center justify-center">
                  <span className="text-xs text-gray-400">MC</span>
                </div>
                <div className="w-8 h-5 bg-gray-700 rounded flex items-center justify-center">
                  <span className="text-xs text-gray-400">AMEX</span>
                </div>
                <div className="w-8 h-5 bg-gray-700 rounded flex items-center justify-center">
                  <span className="text-xs text-gray-400">PP</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
