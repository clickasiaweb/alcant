import React from "react";
import Link from "next/link";
import Facebook from 'lucide-react/dist/esm/icons/facebook';
import Twitter from 'lucide-react/dist/esm/icons/twitter';
import Instagram from 'lucide-react/dist/esm/icons/instagram';
import Youtube from 'lucide-react/dist/esm/icons/youtube';
import Mail from 'lucide-react/dist/esm/icons/mail';
import Phone from 'lucide-react/dist/esm/icons/phone';
import MapPin from 'lucide-react/dist/esm/icons/map-pin';

export default function AlcantaraFooter() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-primary-900 text-white py-12">
      <div className="container">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          {/* Company Info */}
          <div>
            <h3 className="text-xl font-bold mb-4">Alcantara</h3>
            <p className="text-primary-200 mb-4">
              Premium Alcantara accessories for every day luxury and comfort.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="text-primary-200 hover:text-white transition-colors">
                <Facebook className="w-5 h-5" />
              </a>
              <a href="#" className="text-primary-200 hover:text-white transition-colors">
                <Twitter className="w-5 h-5" />
              </a>
              <a href="#" className="text-primary-200 hover:text-white transition-colors">
                <Instagram className="w-5 h-5" />
              </a>
              <a href="#" className="text-primary-200 hover:text-white transition-colors">
                <Youtube className="w-5 h-5" />
              </a>
            </div>
          </div>
          
          {/* Quick Links */}
          <div>
            <h4 className="text-lg font-semibold mb-4">Quick Links</h4>
            <ul className="space-y-2">
              <li><Link href="/products" className="text-primary-200 hover:text-white transition-colors">Shop</Link></li>
              <li><Link href="/collections" className="text-primary-200 hover:text-white transition-colors">Collections</Link></li>
              <li><Link href="/solutions/automotive" className="text-primary-200 hover:text-white transition-colors">Automotive</Link></li>
              <li><Link href="/about" className="text-primary-200 hover:text-white transition-colors">About Us</Link></li>
            </ul>
          </div>
          
          {/* Customer Service */}
          <div>
            <h4 className="text-lg font-semibold mb-4">Customer Service</h4>
            <ul className="space-y-2">
              <li><Link href="/contact" className="text-primary-200 hover:text-white transition-colors">Contact Us</Link></li>
              <li><Link href="/shipping" className="text-primary-200 hover:text-white transition-colors">Shipping Info</Link></li>
              <li><Link href="/returns" className="text-primary-200 hover:text-white transition-colors">Returns</Link></li>
              <li><Link href="/faq" className="text-primary-200 hover:text-white transition-colors">FAQ</Link></li>
            </ul>
          </div>
          
          {/* Newsletter */}
          <div>
            <h4 className="text-lg font-semibold mb-4">Newsletter</h4>
            <p className="text-primary-200 mb-4">
              Subscribe to get special offers and updates
            </p>
            <div className="flex">
              <input
                type="email"
                placeholder="Your email"
                className="flex-1 px-4 py-2 rounded-l-lg text-primary-900 focus:outline-none"
              />
              <button className="bg-primary-700 px-4 py-2 rounded-r-lg hover:bg-primary-600 transition-colors">
                <Mail className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
        
        {/* Divider */}
        <div className="border-t border-primary-800 pt-8">
          <p className="text-center text-primary-200">
            © {currentYear} Alcantara Accessories. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
