import React from 'react';
import Link from 'next/link';

const iPhoneSubcategoryGrid = ({ subSubcategories, onLinkClick }) => {
  // Group sub-subcategories by iPhone generation
  const groupByGeneration = (subSubcategories) => {
    const groups = {};
    
    subSubcategories.forEach(item => {
      const name = item.name;
      let generation = '';
      
      // Extract generation from name
      if (name.includes('iPhone 17')) generation = 'iPhone 17';
      else if (name.includes('iPhone 16')) generation = 'iPhone 16';
      else if (name.includes('iPhone 15')) generation = 'iPhone 15';
      else if (name.includes('iPhone 14')) generation = 'iPhone 14';
      else if (name.includes('iPhone 13')) generation = 'iPhone 13';
      else if (name.includes('iPhone 12')) generation = 'iPhone 12';
      else generation = 'Other';
      
      if (!groups[generation]) {
        groups[generation] = [];
      }
      groups[generation].push(item);
    });
    
    // Sort generations in descending order (latest first)
    const generationOrder = ['iPhone 17', 'iPhone 16', 'iPhone 15', 'iPhone 14', 'iPhone 13', 'iPhone 12', 'Other'];
    
    const sortedGroups = {};
    generationOrder.forEach(gen => {
      if (groups[gen]) {
        // Sort models within each generation: Pro Max > Pro > Plus/Air > base
        const sortedModels = groups[gen].sort((a, b) => {
          const aName = a.name;
          const bName = b.name;
          
          const getModelPriority = (name) => {
            if (name.includes('Pro Max')) return 1;
            if (name.includes('Pro')) return 2;
            if (name.includes('Plus') || name.includes('Air')) return 3;
            if (name.includes('Mini')) return 4;
            return 5; // Standard/base model
          };
          
          const aPriority = getModelPriority(aName);
          const bPriority = getModelPriority(bName);
          
          if (aPriority !== bPriority) {
            return aPriority - bPriority;
          }
          
          return aName.localeCompare(bName);
        });
        
        sortedGroups[gen] = sortedModels;
      }
    });
    
    return sortedGroups;
  };

  const groupedGenerations = groupByGeneration(subSubcategories || []);
  const generations = Object.keys(groupedGenerations);

  if (generations.length === 0) {
    return null;
  }

  return (
    <div className="iphone-subcategory-grid">
      <div className="grid grid-cols-3 gap-8 max-w-4xl">
        {generations.map((generation) => (
          <div key={generation} className="generation-column">
            {/* Generation Header - Non-clickable, bold */}
            <h4 className="text-sm font-semibold text-gray-900 mb-3 uppercase tracking-wide">
              {generation}
            </h4>
            
            {/* Model Links - Plain text only */}
            <div className="space-y-2">
              {groupedGenerations[generation].map((model) => (
                <Link
                  key={model.slug}
                  href={`/category/phone-cases?subcategory=iphone-cases&subSubcategory=${model.slug}`}
                  className="block text-sm text-gray-600 hover:text-gray-900 hover:underline transition-colors duration-200"
                  onClick={() => onLinkClick && onLinkClick()}
                >
                  {model.name}
                </Link>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default iPhoneSubcategoryGrid;
