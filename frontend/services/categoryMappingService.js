// Dynamic category mapping service
import { getProducts } from './api';
import { categoryService } from './categoryService';

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

  // Generate collection slugs from category hierarchy (now dynamic)
  async generateCollectionMapping() {
    if (this.mappingCache) {
      return this.mappingCache;
    }

    const mapping = {};

    try {
      // Add dynamic special mappings from database
      const specialMappings = await this.generateSpecialMappings({});
      Object.assign(mapping, specialMappings);
      
      console.log('🎯 Dynamic mapping created with', Object.keys(mapping).length, 'mappings');
      
    } catch (error) {
      console.error('❌ Error generating dynamic mapping:', error);
      // Use fallback mappings if dynamic generation fails
      const fallbackMappings = this.getFallbackMappings();
      Object.assign(mapping, fallbackMappings);
    }

    this.mappingCache = mapping;
    return mapping;
  }

  // Get collection data by slug
  async getCollectionData(collectionSlug) {
    // Clear cache on every access to ensure fresh data from database
    this.mappingCache = null;
    this.categoryCache = null;
    
    const mapping = await this.generateCollectionMapping();
    const result = mapping[collectionSlug] || null;
    
    if (!result) {
      console.log(`❌ No mapping found for collection slug: "${collectionSlug}"`);
      console.log('📋 Available mappings:', Object.keys(mapping).slice(0, 10));
    } else {
      console.log(`✅ Found mapping for "${collectionSlug}":`, result.title);
    }
    
    return result;
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

  // Dynamic special mappings from database
  async generateSpecialMappings(hierarchy) {
    const specialMappings = {};
    
    try {
      // Fetch categories from database
      const categoriesResponse = await categoryService.getCategoriesWithHierarchy();
      const categories = categoriesResponse.data || [];
      
      console.log('📊 Dynamic categories fetched:', categories.length, 'categories');
      
      // Create mappings for each category from database
      categories.forEach(category => {
        if (category && category.id && category.name && category.slug) {
          // Primary slug mapping
          specialMappings[category.slug] = {
            title: `${category.name} Collection`,
            description: category.description || `Browse our premium ${category.name.toLowerCase()} collection`,
            categoryId: category.id
          };
          
          // Create alternative slugs for common variations
          const altSlugs = this.generateAlternativeSlugs(category.name, category.slug);
          altSlugs.forEach(altSlug => {
            if (!specialMappings[altSlug]) {
              specialMappings[altSlug] = {
                title: `${category.name} Collection`,
                description: category.description || `Browse our premium ${category.name.toLowerCase()} collection`,
                categoryId: category.id
              };
            }
          });
          
          console.log(`✅ Mapped "${category.name}" (${category.slug}) → ${category.id}`);
        }
      });
      
      // Handle iPhone 17 Pro specific case (if needed)
      const phoneCaseCategory = categories.find(cat => cat.name?.toLowerCase().includes('phone case'));
      if (phoneCaseCategory) {
        specialMappings['iphone-17-pro'] = {
          title: 'iPhone 17 Pro Collection',
          description: 'Premium iPhone 17 Pro cases with advanced protection',
          categoryId: phoneCaseCategory.id,
          specialFilter: 'iphone-17-pro'
        };
      }
      
    } catch (error) {
      console.error('❌ Error fetching dynamic categories:', error);
      // Fallback to minimal hardcoded mappings if database fails
      console.log('🔄 Using fallback mappings due to database error');
      return this.getFallbackMappings();
    }
    
    return specialMappings;
  }
  
  // Generate alternative slugs for better URL matching
  generateAlternativeSlugs(categoryName, primarySlug) {
    const alternatives = [];
    const name = categoryName.toLowerCase();
    
    // Generate common variations
    if (name.includes('phone cases')) {
      alternatives.push('phone-case', 'phone', 'cases');
    }
    if (name.includes('wallets')) {
      alternatives.push('wallet', 'wallets-cards');
    }
    if (name.includes('accessories')) {
      alternatives.push('accessory');
    }
    
    return alternatives.filter(alt => alt !== primarySlug);
  }
  
  // Fallback mappings if database fails
  getFallbackMappings() {
    return {
      'phone-case': {
        title: 'Phone Case Collection',
        description: 'Browse our premium phone case collection',
        categoryId: 'f009ca1d-9f5d-4bf3-81f7-b246d105d1be'
      },
      'phone-cases': {
        title: 'Phone Cases Collection',
        description: 'Browse our premium phone cases collection',
        categoryId: 'f009ca1d-9f5d-4bf3-81f7-b246d105d1be'
      },
      'wallet': {
        title: 'Wallet Collection',
        description: 'Browse our premium wallet collection',
        categoryId: '10ed20c8-b707-471c-be22-fe4ed960e1cd'
      }
    };
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
