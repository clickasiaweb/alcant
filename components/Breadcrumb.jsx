import React from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { ChevronRight, Home } from 'lucide-react';

const Breadcrumb = ({ items, className = '' }) => {
  const router = useRouter();

  // If items are not provided, generate from router path
  const breadcrumbItems = items || generateBreadcrumbFromPath(router.asPath);

  function generateBreadcrumbFromPath(path) {
    const pathSegments = path.split('/').filter(segment => segment);
    const items = [{ label: 'Home', href: '/' }];

    // Generate breadcrumb items based on path structure
    if (pathSegments.length > 0) {
      if (pathSegments[0] === 'products') {
        items.push({ label: 'Products', href: '/products' });
        
        if (pathSegments[1]) {
          // Handle product detail page
          if (pathSegments.length === 2) {
            items.push({ 
              label: 'Product Details', 
              href: `/products/${pathSegments[1]}`,
              current: true 
            });
          } else if (pathSegments.length > 2) {
            // Handle category/subcategory pages
            const category = pathSegments[1];
            items.push({ 
              label: category.charAt(0).toUpperCase() + category.slice(1), 
              href: `/products?category=${category}` 
            });
            
            if (pathSegments[2]) {
              const subcategory = pathSegments[2];
              items.push({ 
                label: subcategory.charAt(0).toUpperCase() + subcategory.slice(1), 
                href: `/products?category=${category}&subcategory=${subcategory}`,
                current: true 
              });
            }
          }
        }
      } else if (pathSegments[0] === 'solutions') {
        items.push({ label: 'Solutions', href: '/solutions' });
        
        if (pathSegments[1]) {
          const solution = pathSegments[1];
          items.push({ 
            label: solution.charAt(0).toUpperCase() + solution.slice(1), 
            href: `/solutions/${solution}`,
            current: true 
          });
        }
      } else if (pathSegments[0] === 'resources') {
        items.push({ label: 'Resources', href: '/resources' });
        
        if (pathSegments[1]) {
          const resource = pathSegments[1];
          items.push({ 
            label: resource.charAt(0).toUpperCase() + resource.slice(1), 
            href: `/resources/${resource}`,
            current: true 
          });
        }
      } else if (pathSegments[0] === 'community') {
        items.push({ 
          label: 'Community', 
          href: '/community',
          current: true 
        });
      } else if (pathSegments[0] === 'about') {
        items.push({ 
          label: 'About', 
          href: '/about',
          current: true 
        });
      } else if (pathSegments[0] === 'contact') {
        items.push({ 
          label: 'Contact', 
          href: '/contact',
          current: true 
        });
      } else if (pathSegments[0] === 'cart') {
        items.push({ 
          label: 'Shopping Cart', 
          href: '/cart',
          current: true 
        });
      } else if (pathSegments[0] === 'wishlist') {
        items.push({ 
          label: 'Wishlist', 
          href: '/wishlist',
          current: true 
        });
      } else if (pathSegments[0] === 'checkout') {
        items.push({ label: 'Checkout', href: '/checkout', current: true });
      } else if (pathSegments[0] === 'search') {
        items.push({ 
          label: 'Search Results', 
          href: '/search',
          current: true 
        });
      } else if (pathSegments[0] === 'faq') {
        items.push({ 
          label: 'FAQ', 
          href: '/faq',
          current: true 
        });
      } else if (pathSegments[0] === 'order-confirmation') {
        items.push({ 
          label: 'Order Confirmation', 
          href: '/order-confirmation',
          current: true 
        });
      }
    }

    return items;
  }

  if (!breadcrumbItems || breadcrumbItems.length <= 1) {
    return null;
  }

  return (
    <nav 
      className={`flex items-center space-x-2 text-sm text-gray-600 ${className}`}
      aria-label="Breadcrumb navigation"
    >
      {breadcrumbItems.map((item, index) => (
        <React.Fragment key={item.href}>
          {index > 0 && (
            <ChevronRight className="w-4 h-4 text-gray-400" aria-hidden="true" />
          )}
          
          {item.current ? (
            <span 
              className="text-gray-900 font-medium"
              aria-current="page"
            >
              {item.label}
            </span>
          ) : (
            <Link
              href={item.href}
              className="hover:text-primary-600 transition-colors"
            >
              {index === 0 ? (
                <Home className="w-4 h-4" aria-label="Home" />
              ) : (
                <span>{item.label}</span>
              )}
            </Link>
          )}
        </React.Fragment>
      ))}
    </nav>
  );
};

export default Breadcrumb;
