import React, { useState, useRef, useEffect } from 'react';
import { MOCK_PRODUCTS } from '../constants';
import { ProductCard } from '../components/ProductCard';
import { ChevronRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { SnowEffect } from '../components/SnowEffect';
import { Footer } from '../components/Footer';

const SLIDES = [
  {
    id: 1,
    title: "Big Sale is Live!",
    subtitle: "Get up to 40% off on top mobile brands.",
    ctaText: "Shop Mobiles",
    ctaLink: "/mobiles",
    bgClass: "bg-gradient-to-r from-blue-600 to-indigo-700",
    image: "https://images.unsplash.com/photo-1616077168079-7e09a677fb2c?auto=format&fit=crop&q=80&w=800",
    accentColor: "#FFE11B",
    textColor: "#2874F0"
  },
  {
    id: 2,
    title: "iPhone 15 Series",
    subtitle: "Titanium. So strong. So light. So Pro.",
    ctaText: "Check Now",
    ctaLink: "/product/1",
    bgClass: "bg-gradient-to-r from-gray-900 to-gray-800",
    image: "https://images.unsplash.com/photo-1696446701796-da61225697cc?auto=format&fit=crop&q=80&w=800",
    accentColor: "#FFFFFF",
    textColor: "#000000"
  },
  {
    id: 3,
    title: "Smart Home Fest",
    subtitle: "Upgrade your lifestyle with smart electronics.",
    ctaText: "Explore All",
    ctaLink: "/electronics",
    bgClass: "bg-gradient-to-r from-emerald-600 to-teal-600",
    image: "https://images.unsplash.com/photo-1558211583-d26f610c1eb1?auto=format&fit=crop&q=80&w=800",
    accentColor: "#FFE11B",
    textColor: "#047857"
  },
  {
    id: 4,
    title: "Premium Audio",
    subtitle: "Experience sound like never before.",
    ctaText: "Listen Now",
    ctaLink: "/electronics",
    bgClass: "bg-gradient-to-r from-purple-900 to-indigo-900",
    image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&q=80&w=800",
    accentColor: "#FFFFFF",
    textColor: "#4C1D95"
  }
];

export const Home: React.FC = () => {
  const featured = MOCK_PRODUCTS.filter(p => p.isFeatured).slice(0, 4);
  const bestSellers = MOCK_PRODUCTS.filter(p => p.isBestSeller).slice(0, 4);

  const [currentSlide, setCurrentSlide] = useState(0);
  const scrollRef = useRef<HTMLDivElement>(null);
  const [isPaused, setIsPaused] = useState(false);

  // Auto-slide logic
  useEffect(() => {
    if (isPaused) return;

    const timer = setInterval(() => {
      if (scrollRef.current) {
        const nextSlide = (currentSlide + 1) % SLIDES.length;
        const width = scrollRef.current.offsetWidth;
        scrollRef.current.scrollTo({
          left: width * nextSlide,
          behavior: 'smooth'
        });
      }
    }, 4000); // Increased interval slightly to match slower animations

    return () => clearInterval(timer);
  }, [currentSlide, isPaused]);

  const handleScroll = () => {
    if (scrollRef.current) {
      const width = scrollRef.current.offsetWidth;
      const scrollLeft = scrollRef.current.scrollLeft;
      const newIndex = Math.round(scrollLeft / width);
      if (newIndex !== currentSlide && newIndex >= 0 && newIndex < SLIDES.length) {
        setCurrentSlide(newIndex);
      }
    }
  };

  const scrollToSlide = (index: number) => {
    if (scrollRef.current) {
        const width = scrollRef.current.offsetWidth;
        scrollRef.current.scrollTo({
            left: width * index,
            behavior: 'smooth'
        });
    }
  };

  return (
    <div className="bg-[#F1F3F6] min-h-screen pt-[118px] md:pt-16 flex flex-col">
      <style>{`
        @keyframes slideInUp {
          0% { opacity: 0; transform: translateY(50px); }
          100% { opacity: 1; transform: translateY(0); }
        }
        @keyframes slideInRight {
          0% { opacity: 0; transform: translateX(100px); }
          100% { opacity: 1; transform: translateX(0); }
        }
        .animate-hero-up {
          /* Slower duration (1s) and smoother curve for professional feel */
          animation: slideInUp 1s cubic-bezier(0.22, 1, 0.36, 1) both;
        }
        .animate-hero-right {
          /* Image comes in slightly slower (1.2s) for a staggered effect */
          animation: slideInRight 1.2s cubic-bezier(0.22, 1, 0.36, 1) both;
        }
      `}</style>

       {/* Hero Carousel */}
      <div 
        className="w-full h-56 md:h-80 relative bg-gray-100 group"
        onMouseEnter={() => setIsPaused(true)}
        onMouseLeave={() => setIsPaused(false)}
        onTouchStart={() => setIsPaused(true)}
        onTouchEnd={() => setTimeout(() => setIsPaused(false), 2000)}
        role="region"
        aria-label="Promotional Carousel"
      >
         <div 
            ref={scrollRef}
            onScroll={handleScroll}
            className="w-full h-full flex overflow-x-auto overflow-y-hidden snap-x snap-mandatory scrollbar-hide touch-pan-y"
            style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
         >
            {SLIDES.map((slide, index) => {
               const isActive = index === currentSlide;
               return (
                 <div 
                   key={slide.id}
                   className={`
                     min-w-full w-full h-full snap-center flex-shrink-0 relative 
                     flex items-center 
                     ${slide.bgClass}
                   `}
                 >
                   {/* Snow Effect - Only on first slide */}
                   {index === 0 && <SnowEffect />}

                   <div className="container mx-auto max-w-7xl h-full flex items-center px-4 md:px-12 relative z-20">
                      
                      {/* Text Content */}
                      <div className="w-2/3 md:w-1/2 text-white relative z-20">
                         <h2 
                           className={`text-2xl md:text-5xl font-bold mb-2 md:mb-4 tracking-tight drop-shadow-md leading-tight ${isActive ? 'animate-hero-up' : 'opacity-0'}`}
                           style={{ animationDelay: '100ms' }}
                         >
                           {slide.title}
                         </h2>
                         <p 
                           className={`text-sm md:text-xl mb-4 md:mb-8 opacity-90 drop-shadow-sm font-medium leading-snug ${isActive ? 'animate-hero-up' : 'opacity-0'}`}
                           style={{ animationDelay: '300ms' }}
                         >
                           {slide.subtitle}
                         </p>
                         <div 
                           className={`${isActive ? 'animate-hero-up' : 'opacity-0'}`}
                           style={{ animationDelay: '500ms' }}
                         >
                            <Link 
                              to={slide.ctaLink} 
                              className="font-bold py-2 md:py-3 px-6 md:px-10 rounded-sm hover:shadow-lg inline-block transition-transform transform hover:-translate-y-1 text-sm md:text-base active:scale-95"
                              style={{ backgroundColor: slide.accentColor, color: slide.textColor }}
                            >
                              {slide.ctaText}
                            </Link>
                         </div>
                      </div>

                      {/* Image (Right Side) */}
                      <div className="absolute right-0 top-0 bottom-0 w-1/2 md:w-5/12 block">
                         <div className="relative w-full h-full">
                            {/* Gradient Overlay for seamless blending - Stronger on mobile */}
                            <div className={`absolute inset-0 bg-gradient-to-l ${slide.bgClass.split(' ')[1]} via-transparent to-transparent w-full md:w-2/3 z-10`}></div>
                            
                            <img 
                              src={slide.image} 
                              alt="" 
                              className={`w-full h-full object-cover md:object-cover object-center transform ${isActive ? 'animate-hero-right' : 'opacity-0'}`}
                              style={{ animationDelay: '200ms' }}
                            />
                         </div>
                      </div>

                      {/* Abstract Decoration */}
                      <div className="absolute right-10 top-10 w-40 h-40 bg-white opacity-5 rounded-full blur-3xl"></div>
                      <div className="absolute left-10 bottom-10 w-20 h-20 bg-white opacity-10 rounded-full blur-2xl"></div>

                   </div>
                 </div>
               );
            })}
         </div>

         {/* Indicators */}
         <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2 z-30">
            {SLIDES.map((_, idx) => (
              <button
                key={idx}
                onClick={() => scrollToSlide(idx)}
                className={`w-2 h-2 md:w-2.5 md:h-2.5 rounded-full transition-all duration-300 ${currentSlide === idx ? 'bg-white w-6 md:w-8' : 'bg-white/50 hover:bg-white/80'}`}
                aria-label={`Go to slide ${idx + 1}`}
                aria-current={currentSlide === idx}
              />
            ))}
         </div>
      </div>

      {/* Featured Section */}
      <div className="container mx-auto max-w-7xl mt-4 px-2 md:px-4">
        <div className="bg-white shadow-sm rounded-sm">
           <div className="flex justify-between items-center p-4 border-b">
              <h2 className="text-lg md:text-xl font-medium text-[#212121]">Featured Mobiles</h2>
              <Link to="/mobiles" className="bg-[#2874F0] text-white text-xs md:text-sm font-bold px-4 py-2 rounded-sm shadow-sm hover:shadow-md flex items-center gap-1">
                 VIEW ALL <ChevronRight className="w-4 h-4" />
              </Link>
           </div>
           <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
              {featured.map((p, idx) => (
                <div key={p.id} className={`${idx !== featured.length - 1 ? 'border-b md:border-b-0 border-r-0 md:border-r border-gray-100' : ''} ${idx % 2 === 0 ? 'border-r border-gray-100' : ''} lg:border-r`}>
                    <ProductCard product={p} showViewDetails={true} />
                </div>
              ))}
           </div>
        </div>
      </div>

      {/* Best Sellers Section */}
      <div className="container mx-auto max-w-7xl mt-4 px-2 md:px-4 mb-8">
        <div className="bg-white shadow-sm rounded-sm">
           <div className="flex justify-between items-center p-4 border-b">
              <h2 className="text-lg md:text-xl font-medium text-[#212121]">Best Sellers</h2>
              <Link to="/mobiles" className="bg-[#2874F0] text-white text-xs md:text-sm font-bold px-4 py-2 rounded-sm shadow-sm hover:shadow-md flex items-center gap-1">
                 VIEW ALL <ChevronRight className="w-4 h-4" />
              </Link>
           </div>
           <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
              {bestSellers.map((p, idx) => (
                <div key={p.id} className={`${idx !== bestSellers.length - 1 ? 'border-b md:border-b-0 border-r-0 md:border-r border-gray-100' : ''} ${idx % 2 === 0 ? 'border-r border-gray-100' : ''} lg:border-r`}>
                    <ProductCard product={p} showViewDetails={true} />
                </div>
              ))}
           </div>
        </div>
      </div>
      
      <div className="mt-auto">
        <Footer />
      </div>
    </div>
  );
};