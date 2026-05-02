// Dynamic category mapping service
import { getProducts } from './api';

class CategoryMappingService {
  constructor() {
    this.categoryCache = null;
    this.mappingCache = null;
  }

  // Get all categories with their hierarchy
  async getCategoriesWithHierarchy() {
    if (this.categoryCache) {
      return this.categoryCache;
    }

    try {
      // Fetch all products to build category hierarchy
      const response = await getProducts({ limit: 100 });
      const products = response.products || response.data?.products || [];
      
      // Build category hierarchy from products
      const hierarchy = {};
      
      products.forEach(product => {
        const categoryId = product.category;
        const subcategoryId = product.subcategory;
        const subSubcategoryId = product.subSubcategory;
        
        if (!categoryId) return;
        
        // Initialize main category
        if (!hierarchy[categoryId]) {
          hierarchy[categoryId] = {
            id: categoryId,
            name: this.getCategoryName(categoryId, product),
            subcategories: {}
          };
        }
        
        // Initialize subcategory
        if (subcategoryId && !hierarchy[categoryId].subcategories[subcategoryId]) {
          hierarchy[categoryId].subcategories[subcategoryId] = {
            id: subcategoryId,
            name: this.getSubcategoryName(subcategoryId, product),
            subSubcategories: {}
          };
        }
        
        // Initialize sub-subcategory
        if (subSubcategoryId && subcategoryId && hierarchy[categoryId].subcategories[subcategoryId]) {
          if (!hierarchy[categoryId].subcategories[subcategoryId].subSubcategories[subSubcategoryId]) {
            hierarchy[categoryId].subcategories[subcategoryId].subSubcategories[subSubcategoryId] = {
              id: subSubcategoryId,
              name: this.getSubSubcategoryName(subSubcategoryId, product)
            };
          }
        }
      });
      
      this.categoryCache = hierarchy;
      return hierarchy;
    } catch (error) {
      console.error('Error fetching category hierarchy:', error);
      return {};
    }
  }

  // Generate collection slugs from category hierarchy
  async generateCollectionMapping() {
    if (this.mappingCache) {
      return this.mappingCache;
    }

    const hierarchy = await this.getCategoriesWithHierarchy();
    const mapping = {};

    Object.entries(hierarchy).forEach(([categoryId, category]) => {
      // Main category collection
      const mainSlug = this.slugify(category.name);
      mapping[mainSlug] = {
        title: `${category.name} Collection`,
        description: `Browse our premium ${category.name.toLowerCase()} collection`,
        categoryId: categoryId
      };

      // Subcategory collections
      Object.entries(category.subcategories).forEach(([subcategoryId, subcategory]) => {
        // Create unique slug to avoid conflicts
        const categorySlug = this.slugify(category.name);
        const subSlug = this.slugify(subcategory.name);
        const uniqueSubSlug = `${categorySlug}-${subSlug}`;
        
        mapping[uniqueSubSlug] = {
          title: `${subcategory.name} Collection`,
          description: `Premium ${subcategory.name.toLowerCase()} with advanced protection and style`,
          categoryId: categoryId,
          subCategoryId: subcategoryId
        };

        // Also add the simple slug if it doesn't conflict
        if (!mapping[subSlug]) {
          mapping[subSlug] = {
            title: `${subcategory.name} Collection`,
            description: `Premium ${subcategory.name.toLowerCase()} with advanced protection and style`,
            categoryId: categoryId,
            subCategoryId: subcategoryId
          };
        }

        // Sub-subcategory collections
        Object.entries(subcategory.subSubcategories).forEach(([subSubcategoryId, subSubcategory]) => {
          const subSubSlug = this.slugify(subSubcategory.name);
          const uniqueSubSubSlug = `${categorySlug}-${subSlug}-${subSubSlug}`;
          
          mapping[uniqueSubSubSlug] = {
            title: `${subSubcategory.name} Collection`,
            description: `Latest ${subSubcategory.name.toLowerCase()} with cutting-edge protection`,
            categoryId: categoryId,
            subCategoryId: subcategoryId,
            subSubCategoryId: subSubcategoryId
          };
          
          // Also add simple slug if no conflict
          if (!mapping[subSubSlug]) {
            mapping[subSubSlug] = {
              title: `${subSubcategory.name} Collection`,
              description: `Latest ${subSubcategory.name.toLowerCase()} with cutting-edge protection`,
              categoryId: categoryId,
              subCategoryId: subcategoryId,
              subSubCategoryId: subSubcategoryId
            };
          }
        });
      });
    });

    // Add special mappings for admin panel selections
    const specialMappings = this.generateSpecialMappings(hierarchy);
    Object.assign(mapping, specialMappings);

    this.mappingCache = mapping;
    return mapping;
  }

  // Get collection data by slug
  async getCollectionData(collectionSlug) {
    // Clear cache for phone-cases to ensure fresh data
    if (collectionSlug === 'phone-cases' || collectionSlug === 'phone' || collectionSlug === 'cases') {
      this.mappingCache = null;
      this.categoryCache = null;
    }
    const mapping = await this.generateCollectionMapping();
    return mapping[collectionSlug] || null;
  }

  // Helper methods to extract names from products
  getCategoryName(categoryId, product) {
    // Try to extract from product name or use fallback
    const name = product.name || '';
    if (name.includes('iPhone')) return 'Phone Cases';
    if (name.includes('Pixel')) return 'Phone Cases';
    if (name.includes('Samsung')) return 'Phone Cases';
    if (name.includes('Wallet')) return 'Wallets';
    if (name.includes('Case')) return 'Phone Cases';
    if (name.includes('Accessory')) return 'Accessories';
    if (name.includes('Car')) return 'Car & Travel';
    if (name.includes('Yoga')) return 'Yoga';
    if (name.includes('Travel')) return 'Travel Accessories';
    return 'General';
  }

  getSubcategoryName(subcategoryId, product) {
    const name = product.name || '';
    if (name.includes('iPhone')) return 'iPhone Cases';
    if (name.includes('Pixel')) return 'Pixel Cases';
    if (name.includes('Samsung')) return 'Samsung Cases';
    if (name.includes('Watch')) return 'Watch Accessories';
    if (name.includes('AirPod')) return 'AirPod Cases';
    if (name.includes('Wallet')) return 'Wallets';
    if (name.includes('Pet')) return 'Pet Accessories';
    if (name.includes('Screen')) return 'Screen Protectors';
    
    // If subcategoryId is a readable string, use it
    if (subcategoryId && !subcategoryId.match(/^[a-f0-9-]{36}$/i)) {
      return subcategoryId;
    }
    
    return subcategoryId; // Fallback to ID
  }

  getSubSubcategoryName(subSubcategoryId, product) {
    const name = product.name || '';
    if (name.includes('15 Pro')) return 'iPhone 15 Pro Cases';
    if (name.includes('14 Pro')) return 'iPhone 14 Pro Cases';
    if (name.includes('13 Pro')) return 'iPhone 13 Pro Cases';
    if (name.includes('17 Pro')) return 'iPhone 17 Pro Cases';
    if (name.includes('8 Pro')) return 'Pixel 8 Pro Cases';
    if (name.includes('7 Pro')) return 'Pixel 7 Pro Cases';
    return subSubcategoryId; // Fallback to ID
  }

  // Special handling for admin panel selections
  generateSpecialMappings(hierarchy) {
    const specialMappings = {};
    
    // Hardcoded mapping for phone-cases to ensure it works correctly
    specialMappings['phone-cases'] = {
      title: 'Phone Cases Collection',
      description: 'Browse our premium phone cases collection with advanced protection and style',
      categoryId: 'f009ca1d-9f5d-4bf3-81f7-b246d105d1be'
    };
    
    // Also add alternative spellings
    specialMappings['phone'] = {
      title: 'Phone Cases Collection',
      description: 'Browse our premium phone cases collection with advanced protection and style',
      categoryId: 'f009ca1d-9f5d-4bf3-81f7-b246d105d1be'
    };
    
    specialMappings['cases'] = {
      title: 'Phone Cases Collection',
      description: 'Browse our premium phone cases collection with advanced protection and style',
      categoryId: 'f009ca1d-9f5d-4bf3-81f7-b246d105d1be'
    };
    
    // Handle iPhone 17 Pro specific case
    const phoneCaseCategory = hierarchy['f009ca1d-9f5d-4bf3-81f7-b246d105d1be'];
    if (phoneCaseCategory) {
      // Find iPhone 17 Pro products
      const iphone17ProProducts = [];
      Object.values(phoneCaseCategory.subcategories).forEach(subcategory => {
        Object.values(subcategory.subSubcategories).forEach(subSubcategory => {
          // This would be populated if products had sub-subcategories
        });
      });
      
      // Since iPhone 17 Pro products don't have sub-subcategories, 
      // create a special mapping based on product names
      specialMappings['iphone-17-pro'] = {
        title: 'iPhone 17 Pro Collection',
        description: 'Premium iPhone 17 Pro cases with advanced protection',
        categoryId: 'f009ca1d-9f5d-4bf3-81f7-b246d105d1be',
        subCategoryId: '3207f43f-b904-486e-b2e5-9c6230eb7793',
        specialFilter: 'iphone-17-pro' // Special filter for name-based matching
      };
    }
    
    return specialMappings;
  }

  // Convert string to slug
  slugify(text) {
    return text
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '');
  }
}

// Export singleton instance
export const categoryMappingService = new CategoryMappingService();
