import React, { useMemo, useState, useEffect, useRef } from 'react';
import { ProductCard } from '../components/ProductCard';
import { MOCK_PRODUCTS } from '../constants';
import { ChevronDown, ArrowLeft, TrendingUp, ArrowUpNarrowWide, ArrowDownWideNarrow, LayoutGrid, LayoutList } from 'lucide-react';
import { Footer } from '../components/Footer';
import { useNavigate, useLocation } from 'react-router-dom';

interface ListingProps {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  category?: 'mobile' | 'electronics' | 'all';
  preSelectedBrand?: string;
  hideFilters?: boolean;
}

export const Listing: React.FC<ListingProps> = ({ 
  searchQuery, 
  setSearchQuery, 
  category = 'mobile',
  preSelectedBrand,
  hideFilters = false
}) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [selectedBrands, setSelectedBrands] = useState<string[]>([]);
  const [maxPrice, setMaxPrice] = useState<number>(200000);
  const [sortBy, setSortBy] = useState<'popularity' | 'price_asc' | 'price_desc'>('popularity');
  const [isSortOpen, setIsSortOpen] = useState(false);
  const sortRef = useRef<HTMLDivElement>(null);
  
  // Use list layout for search results or if explicitly requested
  const isSearchPage = location.pathname === '/search';
  const [layoutMode, setLayoutMode] = useState<'grid' | 'list'>(isSearchPage ? 'list' : 'grid');

  useEffect(() => {
    // Reset layout mode based on route
    setLayoutMode(isSearchPage ? 'list' : 'grid');
  }, [isSearchPage]);

  // Close sort dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (sortRef.current && !sortRef.current.contains(event.target as Node)) {
        setIsSortOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Reset local filters and synchronize brand selection whenever category or forced brand changes
  useEffect(() => {
    if (preSelectedBrand) {
      setSelectedBrands([preSelectedBrand]);
    } else {
      setSelectedBrands([]);
    }
    
    // Only reset filters if switching major categories, not just typing in search
    if (!isSearchPage) {
        setMaxPrice(200000);
        setSortBy('popularity');
    }
  }, [category, preSelectedBrand, isSearchPage]);

  const handleClearAll = () => {
    if (preSelectedBrand) {
      setSelectedBrands([preSelectedBrand]);
    } else {
      setSelectedBrands([]);
    }
    setMaxPrice(200000);
    setSortBy('popularity');
    setSearchQuery('');
  };

  const filteredProducts = useMemo(() => {
    let result = [...MOCK_PRODUCTS];
    
    // Category Filter
    if (category !== 'all') {
      result = result.filter(p => p.category === category);
    }

    // Search Filter
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      result = result.filter(p => 
        p.name.toLowerCase().includes(q) || 
        p.brand.toLowerCase().includes(q) || 
        p.model.toLowerCase().includes(q)
      );
    }

    // Brand Filter
    if (selectedBrands.length > 0) {
      result = result.filter(p => selectedBrands.includes(p.brand));
    }

    // Price Filter
    result = result.filter(p => {
       const price = p.variants[0].price;
       return price <= maxPrice;
    });

    // Sorting
    if (sortBy === 'price_asc') {
      result.sort((a, b) => a.variants[0].price - b.variants[0].price);
    } else if (sortBy === 'price_desc') {
      result.sort((a, b) => b.variants[0].price - a.variants[0].price);
    } else {
      result.sort((a, b) => b.reviewCount - a.reviewCount);
    }

    return result;
  }, [searchQuery, selectedBrands, maxPrice, sortBy, category]);

  const toggleBrand = (brand: string) => {
    setSelectedBrands(prev => 
      prev.includes(brand) ? prev.filter(b => b !== brand) : [...prev, brand]
    );
  };

  const availableBrands = useMemo(() => {
     let productsInCategory = MOCK_PRODUCTS;
     if (category !== 'all') {
       productsInCategory = productsInCategory.filter(p => p.category === category);
     }
     return Array.from(new Set(productsInCategory.map(p => p.brand)));
  }, [category]);

  const MAX_VAL = 200000;
  const maxPercent = (maxPrice / MAX_VAL) * 100;

  const isFilterModified = maxPrice < 200000 || (selectedBrands.length > 0 && !preSelectedBrand) || searchQuery.length > 0;
  const isPriceModified = maxPrice < 200000;

  const handleBack = () => {
    navigate('/');
  };

  const sortOptions = [
    { id: 'popularity', label: 'Popularity', icon: TrendingUp },
    { id: 'price_asc', label: 'Price: Low to High', icon: ArrowUpNarrowWide },
    { id: 'price_desc', label: 'Price: High to Low', icon: ArrowDownWideNarrow },
  ] as const;

  const currentOption = sortOptions.find(opt => opt.id === sortBy)!;

  const SortGroup = () => (
    <div className="relative w-full md:w-52 shrink-0 z-[100]" ref={sortRef}>
      <button 
        onClick={() => setIsSortOpen(!isSortOpen)}
        className="flex items-center justify-between w-full px-4 py-2 bg-white border border-gray-200 rounded-md shadow-sm hover:border-[#2874F0] hover:bg-blue-50/20 transition-all group"
      >
        <div className="flex items-center gap-2">
          <currentOption.icon className="w-4 h-4 text-[#2874F0]" />
          <span className="text-sm font-bold text-[#212121]">{currentOption.label}</span>
        </div>
        <ChevronDown className={`w-4 h-4 text-gray-400 transition-transform duration-200 group-hover:text-[#2874F0] ${isSortOpen ? 'rotate-180' : ''}`} />
      </button>
      
      {isSortOpen && (
        <div className="absolute top-full left-0 right-0 mt-1.5 bg-white border border-gray-200 rounded-lg shadow-xl overflow-hidden flex flex-col animate-in fade-in slide-in-from-top-2 duration-200 ring-1 ring-black/5">
          {sortOptions.map((opt) => (
            <button
              key={opt.id}
              onClick={() => {
                setSortBy(opt.id);
                setIsSortOpen(false);
              }}
              className={`flex items-center justify-between px-4 py-3 text-sm font-semibold transition-all hover:bg-gray-50
                ${sortBy === opt.id ? 'text-[#2874F0] bg-blue-50/50' : 'text-gray-700'}`}
            >
              <div className="flex items-center gap-3">
                <opt.icon className={`w-4 h-4 ${sortBy === opt.id ? 'text-[#2874F0]' : 'text-gray-400'}`} />
                {opt.label}
              </div>
              {sortBy === opt.id && <div className="w-1.5 h-1.5 bg-[#2874F0] rounded-full"></div>}
            </button>
          ))}
        </div>
      )}
    </div>
  );

  return (
    <div className="fixed top-[118px] md:top-[64px] left-0 right-0 bottom-0 bg-white z-0 flex flex-row">
      <div className="container mx-auto px-0 md:px-4 flex flex-row gap-0 md:gap-4 max-w-[1600px] h-full w-full">
        {/* Filters Sidebar */}
        {!hideFilters && (
          <div className="w-[130px] md:w-64 bg-white shrink-0 md:rounded-sm border-r md:border border-gray-100 h-full overflow-y-auto scrollbar-hide z-[80]">
            <div className="p-3 md:p-4 border-b bg-gray-50 md:bg-white flex justify-between items-center sticky top-0 z-10">
              <h2 className="text-xs md:text-lg font-bold text-[#212121] uppercase md:capitalize">Filters</h2>
              {isFilterModified && (
                <button 
                    className="md:hidden text-[#2874F0] text-[10px] font-bold uppercase"
                    onClick={handleClearAll}
                >
                    Clear All
                </button>
              )}
            </div>
            <div className="p-3 md:p-4 border-b">
              <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-4 md:mb-4 gap-1">
                <span className="text-[10px] md:text-xs font-semibold text-[#212121] uppercase tracking-wide">Max Price</span>
                {isFilterModified && (
                    <button 
                    className="hidden md:block text-[#2874F0] text-[10px] md:text-xs font-bold uppercase hover:underline"
                    onClick={handleClearAll}
                    >
                    Clear All
                    </button>
                )}
              </div>
              <div className="px-1 md:px-2">
                <div className="relative h-6 w-full flex items-center mb-2 select-none">
                    <div className="absolute left-0 right-0 h-1 bg-gray-200 rounded z-0"></div>
                    <div 
                      className="absolute left-0 h-1 bg-[#2874F0] rounded z-0"
                      style={{ width: `${maxPercent}%` }}
                    ></div>
                    <input 
                      type="range" 
                      min="0" 
                      max="200000" 
                      step="1000"
                      value={maxPrice} 
                      onChange={(e) => setMaxPrice(Number(e.target.value))}
                      className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-20"
                    />
                    <div 
                      className="absolute h-4 w-4 bg-[#2874F0] rounded-full border-2 border-white shadow-md z-10 pointer-events-none transition-transform duration-75 ease-out"
                      style={{ 
                          left: `${maxPercent}%`,
                          transform: 'translateX(-50%)'
                      }}
                    ></div>
                </div>
                <div className="flex justify-between text-[10px] md:text-xs text-gray-600 font-medium mt-1">
                    <span>Min</span>
                    <span className="truncate ml-1 font-bold text-[#212121]">₹{maxPrice.toLocaleString('en-IN')}</span>
                </div>
              </div>
            </div>
            <div className="p-3 md:p-4 border-b">
              <div className="flex justify-between items-center mb-2 cursor-pointer">
                <span className="text-[10px] md:text-xs font-semibold text-[#212121] uppercase tracking-wide">Brand</span>
                <ChevronDown className="w-3 h-3 md:w-4 md:h-4 text-gray-400" />
              </div>
              <div className="space-y-2 mt-2">
                {availableBrands.map(brand => (
                  <label key={brand} className="flex items-start md:items-center gap-2 cursor-pointer group hover:bg-gray-50 p-0.5 rounded">
                    <input 
                      type="checkbox" 
                      className="w-3.5 h-3.5 md:w-4 md:h-4 rounded border-gray-400 text-[#2874F0] focus:ring-[#2874F0] mt-0.5 md:mt-0 shrink-0"
                      checked={selectedBrands.includes(brand)}
                      onChange={() => toggleBrand(brand)}
                      disabled={!!preSelectedBrand && brand !== preSelectedBrand}
                    />
                    <span className={`text-[#212121] text-[11px] md:text-sm group-hover:font-medium transition-all leading-tight break-words ${preSelectedBrand && brand !== preSelectedBrand ? 'opacity-50' : ''}`}>{brand}</span>
                  </label>
                ))}
              </div>
            </div>
          </div>
        )}
        
        <div className="flex-1 bg-white shadow-sm md:rounded-sm flex flex-col h-full overflow-hidden border-l-0 md:border border-gray-100">
          <div className="flex-none border-b px-3 py-2 md:px-4 md:py-3 flex flex-col md:flex-row md:items-center gap-3 bg-white z-[80] shadow-sm md:shadow-none">
            <div className="flex justify-between items-center w-full md:w-auto">
              <div className="flex items-center gap-3">
                <button onClick={handleBack} className="p-1.5 -ml-1.5 text-[#2874F0] hover:bg-blue-50 rounded-full transition-colors group">
                    <ArrowLeft className="w-5 h-5 group-hover:-translate-x-0.5 transition-transform" />
                </button>
                <div className="flex flex-col md:flex-row md:items-baseline md:gap-2">
                  <span className="font-bold text-[#212121] capitalize text-sm md:text-base">
                    {searchQuery ? `Showing results for "${searchQuery}"` : (preSelectedBrand ? `${preSelectedBrand} Products` : (category === 'all' ? 'All Products' : `${category}s`))}
                  </span>
                  <span className="text-[10px] md:text-xs text-[#878787] font-medium hidden md:inline ml-1">
                    ({filteredProducts.length} items)
                  </span>
                </div>
              </div>
            </div>
            
            <div className="flex items-center gap-2 md:gap-4 ml-0 md:ml-auto w-full md:w-auto overflow-visible">
               <div className="hidden md:flex items-center bg-gray-100 p-0.5 rounded">
                  <button 
                    onClick={() => setLayoutMode('grid')}
                    className={`p-1.5 rounded transition-all ${layoutMode === 'grid' ? 'bg-white shadow-sm text-[#2874F0]' : 'text-gray-500 hover:text-gray-700'}`}
                    title="Grid View"
                  >
                    <LayoutGrid className="w-4 h-4" />
                  </button>
                  <button 
                    onClick={() => setLayoutMode('list')}
                    className={`p-1.5 rounded transition-all ${layoutMode === 'list' ? 'bg-white shadow-sm text-[#2874F0]' : 'text-gray-500 hover:text-gray-700'}`}
                    title="List View"
                  >
                    <LayoutList className="w-4 h-4" />
                  </button>
               </div>
               <SortGroup />
            </div>
          </div>
          
          <div className="flex-1 overflow-y-auto">
            <div className={layoutMode === 'grid' 
              ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-0 border-t border-gray-100 pb-20 md:pb-0"
              : "flex flex-col border-t border-gray-100 pb-20 md:pb-0"
            }>
              {filteredProducts.length > 0 ? (
                filteredProducts.map(product => (
                  <div key={product.id} className={layoutMode === 'grid' ? "border-b border-r border-gray-100" : ""}>
                    <ProductCard product={product} showViewDetails={true} layout={layoutMode} />
                  </div>
                ))
              ) : (
                <div className="p-10 text-center text-gray-500 col-span-full">
                  <h3 className="text-sm md:text-lg font-medium">No products found</h3>
                  <p className="text-xs md:text-base">Try adjusting your filters or search terms.</p>
                </div>
              )}
            </div>
            <Footer />
          </div>
        </div>
      </div>
    </div>
  );
};