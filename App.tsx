import React, { useState } from 'react';
import { HashRouter as Router, Routes, Route } from 'react-router-dom';
import { Navbar } from './components/Navbar';
import { Home } from './pages/Home';
import { Listing } from './pages/Listing';
import { ProductDetail } from './pages/ProductDetail';
import { Chatbot } from './components/Chatbot';

const App: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [isChatOpen, setIsChatOpen] = useState(false);

  return (
    <Router>
      <div className="flex flex-col min-h-screen bg-[#F1F3F6] font-sans text-[#212121]">
        <Navbar 
          searchQuery={searchQuery} 
          setSearchQuery={setSearchQuery} 
          onOpenChat={() => setIsChatOpen(true)}
        />
        <main className="flex-1">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route 
              path="/mobiles" 
              element={
                <Listing 
                  key="mobiles-listing"
                  searchQuery={searchQuery} 
                  setSearchQuery={setSearchQuery} 
                  category="mobile" 
                />
              } 
            />
            <Route 
              path="/electronics" 
              element={
                <Listing 
                  key="electronics-listing"
                  searchQuery={searchQuery} 
                  setSearchQuery={setSearchQuery} 
                  category="electronics" 
                />
              } 
            />
            <Route 
              path="/search" 
              element={
                <Listing 
                  key="search-listing"
                  searchQuery={searchQuery} 
                  setSearchQuery={setSearchQuery} 
                  category="all" 
                />
              } 
            />
            <Route 
              path="/plus" 
              element={
                <Listing 
                  key="plus-listing"
                  searchQuery={searchQuery} 
                  setSearchQuery={setSearchQuery} 
                  category="all" 
                  preSelectedBrand="Sony" 
                  hideFilters={true} 
                />
              } 
            />
            <Route path="/product/:id" element={<ProductDetail />} />
          </Routes>
        </main>
        <Chatbot isOpen={isChatOpen} setIsOpen={setIsChatOpen} />
      </div>
    </Router>
  );
};

export default App;