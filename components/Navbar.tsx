import React, { useState, useEffect, useRef } from 'react';
import { Search, MoreVertical, Menu, X, Smartphone, Zap, ArrowUpRight, MessageCircle } from 'lucide-react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { MOCK_PRODUCTS } from '../constants';

interface NavbarProps {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  onOpenChat: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ searchQuery, setSearchQuery, onOpenChat }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [suggestions, setSuggestions] = useState<typeof MOCK_PRODUCTS>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const searchRef = useRef<HTMLDivElement>(null);

  // Check if we are on a product detail page
  const isProductPage = location.pathname.startsWith('/product/');

  useEffect(() => {
    // Close suggestions when clicking outside
    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setShowSuggestions(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const query = e.target.value;
    setSearchQuery(query);
    
    if (query.trim()) {
      const filtered = MOCK_PRODUCTS.filter(p => 
        p.name.toLowerCase().includes(query.toLowerCase()) || 
        p.brand.toLowerCase().includes(query.toLowerCase()) ||
        p.model.toLowerCase().includes(query.toLowerCase())
      ).slice(0, 6);
      setSuggestions(filtered);
      setShowSuggestions(true);
    } else {
      setSuggestions([]);
      setShowSuggestions(false);
    }
  };

  const executeSearch = () => {
    if (searchQuery.trim()) {
      navigate('/search');
      setShowSuggestions(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      executeSearch();
    }
  };

  const handleSuggestionClick = (id: string) => {
    navigate(`/product/${id}`);
    setShowSuggestions(false);
    setSearchQuery('');
    setIsSidebarOpen(false);
  };

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const handleNavClick = (path: string) => {
    setSearchQuery('');
    navigate(path);
    setIsSidebarOpen(false);
  };

  return (
    <>
      {/* Search Overlay Backdrop */}
      {showSuggestions && (
        <div 
          className="fixed inset-0 bg-black/60 z-[95] transition-opacity duration-300 backdrop-blur-[2px]"
          onClick={() => setShowSuggestions(false)}
          aria-hidden="true"
        />
      )}

      {/* Main Navbar */}
      <nav className="bg-[#2874F0] text-white fixed top-0 left-0 right-0 z-[100] shadow-md h-16">
        <div className="container mx-auto px-4 max-w-7xl h-full flex items-center justify-between gap-4">
          
          {/* Logo & Mobile Menu */}
          <div className="flex items-center gap-2 md:gap-4 shrink-0">
            <button className="md:hidden" onClick={toggleSidebar} aria-label="Open menu">
              <Menu className="w-6 h-6" />
            </button>
            <div className="flex flex-col items-start leading-none">
              <Link to="/" className="font-bold italic text-lg md:text-xl tracking-wide cursor-pointer hover:no-underline" onClick={() => setSearchQuery('')}>
                Buy Xtra
              </Link>
              <Link to="/plus" className="text-[10px] md:text-xs italic text-gray-200 flex items-center hover:underline cursor-pointer" onClick={() => setSearchQuery('')}>
                Explore <span className="text-[#FFE11B] font-bold ml-1">Plus</span>
                <span className="ml-1 text-[#FFE11B]">+</span>
              </Link>
            </div>
          </div>

          {/* Search Bar */}
          <div className="flex-1 max-w-2xl relative" ref={searchRef}>
            <div className="relative w-full z-[101]">
              <input
                type="text"
                placeholder="Search for products, brands and more"
                className="w-full h-9 md:h-10 px-4 pr-10 rounded-sm text-[#212121] outline-none shadow-sm text-sm md:text-base focus:shadow-md transition-shadow"
                value={searchQuery}
                onChange={handleSearchChange}
                onKeyDown={handleKeyDown}
                onFocus={() => searchQuery.trim() && setShowSuggestions(true)}
              />
              <button 
                onClick={executeSearch}
                className="absolute right-0 top-0 h-full px-3 text-[#2874F0] hover:bg-blue-50 transition-colors flex items-center justify-center rounded-r-sm active:scale-95"
                aria-label="Submit search"
              >
                <Search className="w-5 h-5" />
              </button>
            </div>

            {/* Autocomplete Dropdown */}
            {showSuggestions && suggestions.length > 0 && (
              <div className="absolute top-full left-0 right-0 bg-white shadow-xl rounded-b-md border-t border-gray-100 z-[101] max-h-[450px] overflow-y-auto mt-1 animate-in fade-in slide-in-from-top-1 duration-200">
                {suggestions.map(product => (
                  <div 
                    key={product.id}
                    onClick={() => handleSuggestionClick(product.id)}
                    className="flex items-center gap-4 p-3 hover:bg-gray-50 cursor-pointer border-b border-gray-50 last:border-0 transition-colors group"
                  >
                    <div className="w-12 h-12 shrink-0 p-1 border border-gray-100 rounded bg-white flex items-center justify-center group-hover:border-blue-200 transition-colors">
                      <img src={product.images[0]} alt={product.name} className="max-w-full max-h-full object-contain" />
                    </div>
                    
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-[#212121] truncate group-hover:text-[#2874F0] transition-colors">{product.name}</p>
                      <p className="text-xs text-[#878787] truncate">in {product.category}s</p>
                    </div>
                    
                    <div className="flex flex-col items-end">
                      <div className="text-sm font-bold text-[#212121]">
                        ₹{product.variants[0].price.toLocaleString()}
                      </div>
                      <ArrowUpRight className="w-3.5 h-3.5 text-gray-400 group-hover:text-[#2874F0] transition-colors mt-0.5" />
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Desktop Actions */}
          <div className="hidden md:flex items-center gap-8 text-sm lg:text-[15px] whitespace-nowrap">
             <Link to="/mobiles" onClick={() => setSearchQuery('')} className="cursor-pointer text-white/90 hover:text-white font-normal flex items-center gap-2 transition-colors tracking-wide">
               <Smartphone className="w-4 h-4 opacity-70" />
               <span>Mobiles</span>
             </Link>
             <Link to="/electronics" onClick={() => setSearchQuery('')} className="cursor-pointer text-white/90 hover:text-white font-normal flex items-center gap-2 transition-colors tracking-wide">
               <Zap className="w-4 h-4 opacity-70" />
               <span>Electronics</span>
             </Link>
             <button onClick={onOpenChat} className="cursor-pointer text-white/90 hover:text-white font-normal flex items-center gap-2 transition-colors tracking-wide">
               <MessageCircle className="w-4 h-4 opacity-70" />
               <span>Support</span>
             </button>
          </div>
        </div>
      </nav>

      {/* Mobile Category Bar */}
      {!isProductPage && (
        <div className="md:hidden bg-white shadow-sm border-b border-gray-100 fixed top-16 left-0 right-0 z-[90] h-[54px]">
          <div className="w-full h-full">
            <div className="grid grid-cols-3 py-1.5 h-full">
              <Link 
                to="/mobiles" 
                onClick={() => setSearchQuery('')}
                className="flex flex-col items-center justify-center gap-0.5 border-r border-gray-100 active:bg-gray-50"
              >
                  <div className="bg-blue-50 p-1.5 rounded-full">
                    <Smartphone className="w-3.5 h-3.5 text-[#2874F0]" />
                  </div>
                  <span className="text-[10px] font-normal text-[#212121] leading-none">Mobiles</span>
              </Link>
              
              <Link 
                to="/electronics" 
                onClick={() => setSearchQuery('')}
                className="flex flex-col items-center justify-center gap-0.5 border-r border-gray-100 active:bg-gray-50"
              >
                  <div className="bg-blue-50 p-1.5 rounded-full">
                    <Zap className="w-3.5 h-3.5 text-[#2874F0]" />
                  </div>
                  <span className="text-[10px] font-normal text-[#212121] leading-none">Electronics</span>
              </Link>

              <button onClick={onOpenChat} className="flex flex-col items-center justify-center gap-0.5 active:bg-gray-50">
                  <div className="bg-blue-50 p-1.5 rounded-full">
                    <MessageCircle className="w-3.5 h-3.5 text-[#2874F0]" />
                  </div>
                  <span className="text-[10px] font-normal text-[#212121] leading-none">Support</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Side Navigation Drawer */}
      {isSidebarOpen && (
        <div className="fixed inset-0 z-[120] flex md:hidden">
          <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={toggleSidebar}></div>
          <div className="relative w-[75%] max-w-xs bg-white h-full shadow-xl flex flex-col animate-in slide-in-from-left duration-300">
             <div className="bg-[#2874F0] p-4 text-white flex justify-between items-center">
                <span className="font-bold text-lg">Menu</span>
                <button onClick={toggleSidebar}>
                   <X className="w-6 h-6" />
                </button>
             </div>
             <div className="flex-1 overflow-y-auto">
                <div onClick={() => handleNavClick('/mobiles')} className="flex items-center gap-4 p-4 border-b border-gray-100 hover:bg-gray-50 active:bg-blue-50 cursor-pointer text-[#212121]">
                   <Smartphone className="w-5 h-5 text-[#2874F0]" />
                   <span className="font-normal text-[15px]">Mobiles</span>
                </div>
                <div onClick={() => handleNavClick('/electronics')} className="flex items-center gap-4 p-4 border-b border-gray-100 hover:bg-gray-50 active:bg-blue-50 cursor-pointer text-[#212121]">
                   <Zap className="w-5 h-5 text-[#2874F0]" />
                   <span className="font-normal text-[15px]">Electronics</span>
                </div>
                <div onClick={() => { onOpenChat(); setIsSidebarOpen(false); }} className="flex items-center gap-4 p-4 border-b border-gray-100 hover:bg-gray-50 active:bg-blue-50 cursor-pointer text-[#212121]">
                   <MessageCircle className="w-5 h-5 text-[#2874F0]" />
                   <span className="font-normal text-[15px]">Support Chat</span>
                </div>
             </div>
             <div className="p-4 border-t border-gray-100 text-xs text-gray-500 text-center">v1.0.0</div>
          </div>
        </div>
      )}
    </>
  );
};