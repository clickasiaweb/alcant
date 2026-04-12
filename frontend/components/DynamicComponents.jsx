import dynamic from 'next/dynamic';

// Heavy components that should be loaded on demand
export const DynamicProductGrid = dynamic(
  () => import('./ProductGrid'),
  { 
    loading: () => <div className="animate-pulse bg-gray-200 h-64 rounded-lg" />,
    ssr: false 
  }
);

export const DynamicCategoryMegaMenu = dynamic(
  () => import('./CategoryMegaMenu'),
  { 
    loading: () => <div className="animate-pulse bg-gray-200 h-32 rounded-lg" />,
    ssr: false 
  }
);

export const DynamicCartDrawer = dynamic(
  () => import('./CartDrawer'),
  { 
    loading: () => null,
    ssr: false 
  }
);

export const DynamicWishlistDrawer = dynamic(
  () => import('./WishlistDrawer'),
  { 
    loading: () => null,
    ssr: false 
  }
);

export const DynamicSearchDropdown = dynamic(
  () => import('./SearchDropdown'),
  { 
    loading: () => <div className="animate-pulse bg-gray-200 h-32 rounded-lg" />,
    ssr: false 
  }
);

export const DynamicProductModal = dynamic(
  () => import('./ProductModal'),
  { 
    loading: () => <div className="animate-pulse bg-gray-200 h-96 rounded-lg" />,
    ssr: false 
  }
);

// Admin panel heavy components
export const DynamicBulkUpload = dynamic(
  () => import('../admin-panel/src/components/BulkUpload'),
  { 
    loading: () => <div className="animate-pulse bg-gray-200 h-64 rounded-lg" />,
    ssr: false 
  }
);

export const DynamicOrdersPage = dynamic(
  () => import('../admin-panel/src/pages/OrdersPage'),
  { 
    loading: () => <div className="animate-pulse bg-gray-200 h-64 rounded-lg" />,
    ssr: false 
  }
);
