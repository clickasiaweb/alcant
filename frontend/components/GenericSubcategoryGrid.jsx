import React from 'react';
import Link from 'next/link';

const GenericSubcategoryGrid = ({ subSubcategories, onLinkClick, subcategoryName }) => {
  // Debug logging
  console.log('GenericSubcategoryGrid:', { subcategoryName, subSubcategories });
  
  // For iPhone Cases, use the special grouping logic with clean layout
  if (subcategoryName === 'iPhone Cases') {
    const groupByGeneration = (subSubcategories) => {
      const groups = {};
      
      subSubcategories.forEach(item => {
        const name = item.name.toLowerCase();
        let generation = '';
        
        // Extract generation from actual data names
        if (name.includes('17') || name.includes('seventeen')) generation = 'iPhone 17';
        else if (name.includes('16') || name.includes('sixteen')) generation = 'iPhone 16';
        else if (name.includes('15') || name.includes('fifteen')) generation = 'iPhone 15';
        else if (name.includes('14') || name.includes('fourteen')) generation = 'iPhone 14';
        else if (name.includes('13') || name.includes('thirteen')) generation = 'iPhone 13';
        else if (name.includes('12') || name.includes('twelve')) generation = 'iPhone 12';
        else generation = 'OTHER';
        
        if (!groups[generation]) {
          groups[generation] = [];
        }
        groups[generation].push(item);
      });
      
      // Sort generations in descending order (latest first)
      const generationOrder = ['iPhone 17', 'iPhone 16', 'iPhone 15', 'iPhone 14', 'iPhone 13', 'iPhone 12', 'OTHER'];
      
      const sortedGroups = {};
      generationOrder.forEach(gen => {
        if (groups[gen]) {
          // Sort models within each generation: Pro Max > Pro > Plus/Air > base
          const sortedModels = groups[gen].sort((a, b) => {
            const aName = a.name.toLowerCase();
            const bName = b.name.toLowerCase();
            
            const getModelPriority = (name) => {
              if (name.includes('pro max') || name.includes('max')) return 1;
              if (name.includes('pro')) return 2;
              if (name.includes('plus') || name.includes('air')) return 3;
              if (name.includes('mini')) return 4;
              return 5; // Standard/base model
            };
            
            const aPriority = getModelPriority(aName);
            const bPriority = getModelPriority(bName);
            
            if (aPriority !== bPriority) {
              return aPriority - bPriority;
            }
            
            return a.name.localeCompare(b.name);
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
      <div className="subcategory-grid">
        <div className="grid grid-cols-3 gap-8 max-w-4xl">
          {generations.map((generation) => (
            <div key={generation} className="generation-column">
              {/* Sub-subcategories as column headers */}
              <div className="space-y-4">
                {groupedGenerations[generation].map((subSubcategory) => (
                  <div key={subSubcategory.slug} className="sub-subcategory-group">
                    {/* Sub-subcategory as column header */}
                    <h4 className="text-sm font-semibold text-gray-900 mb-3">
                      {subSubcategory.name
                        .replace(/iphone/gi, '')
                        .replace(/\s+/g, ' ')
                        .trim()}
                    </h4>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  // For other subcategories, use similar layout
  if (!subSubcategories || subSubcategories.length === 0) {
    return null;
  }

  // Group items by first letter for better organization
  const groupByFirstLetter = (items) => {
    const groups = {};
    
    items.forEach(item => {
      const firstLetter = item.name.charAt(0).toUpperCase();
      if (!groups[firstLetter]) {
        groups[firstLetter] = [];
      }
      groups[firstLetter].push(item);
    });
    
    return groups;
  };

  const groupedItems = groupByFirstLetter(subSubcategories);
  const groups = Object.keys(groupedItems).sort();

  // Determine optimal columns based on group count
  const getColumns = (count) => {
    if (count <= 2) return 2;
    if (count <= 4) return 3;
    return 4;
  };

  const columns = getColumns(groups.length);

  return (
    <div className="subcategory-grid">
      <div className={`grid grid-cols-${columns} gap-8 max-w-4xl`}>
        {groups.map((group) => (
          <div key={group} className="group-column">
            {/* Group Header - Bold, non-clickable */}
            <h4 className="text-sm font-semibold text-gray-900 mb-4 uppercase tracking-wide">
              {group}
            </h4>
            
            {/* Sub-subcategories as headings only */}
            <div className="space-y-3">
              {groupedItems[group].map((subSubcategory) => (
                <div key={subSubcategory.slug} className="sub-subcategory-group">
                  {/* Sub-subcategory as heading */}
                  <h5 className="text-sm font-medium text-gray-800">
                    {subSubcategory.name}
                  </h5>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default GenericSubcategoryGrid;
