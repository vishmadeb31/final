import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { MOCK_PRODUCTS } from '../constants';
import { Star, Share2, Tag, ArrowLeft, Cpu, Smartphone, Battery, Camera, Bluetooth, HardDrive, Zap, ShieldCheck, Box, Palette, X, Link as LinkIcon, Copy, Check } from 'lucide-react';
import { WhatsAppButton } from '../components/WhatsAppButton';
import { Variant } from '../types';
import { Footer } from '../components/Footer';

interface SpecItemProps {
  icon: React.ReactNode;
  label: string;
  value?: string;
}

const SpecItem: React.FC<SpecItemProps> = ({ icon, label, value }) => {
  if (!value) return null;
  return (
    <div className="flex items-center gap-3 p-3 border border-gray-100 rounded-sm bg-gray-50">
       <div className="text-[#2874F0]">
         {/* Fix: cast icon to ReactElement with any to allow size prop in cloneElement */}
         {React.cloneElement(icon as React.ReactElement<any>, { size: 20 })}
       </div>
       <div>
         <div className="text-[10px] text-[#878787] uppercase font-bold tracking-wide mb-0.5">{label}</div>
         <div className="text-sm font-medium text-[#212121] leading-tight">{value}</div>
       </div>
    </div>
  );
};

export const ProductDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const product = MOCK_PRODUCTS.find(p => p.id === id);

  // Initialize with first variant
  const [selectedVariant, setSelectedVariant] = useState<Variant | null>(null);
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [showShareModal, setShowShareModal] = useState(false);
  const [linkCopied, setLinkCopied] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (product) {
      setSelectedVariant(product.variants[0]);
    }
  }, [product]);

  if (!product || !selectedVariant) {
    return <div className="p-10 text-center pt-[120px]">Product not found</div>;
  }

  const isMobile = product.category === 'mobile';
  const discount = Math.round(((selectedVariant.originalPrice - selectedVariant.price) / selectedVariant.originalPrice) * 100);

  // Derive unique RAM and Storage options for mobiles
  const uniqueRams = isMobile ? Array.from(new Set(product.variants.map(v => v.ram))) : [];
  const uniqueStorages = isMobile ? Array.from(new Set(product.variants.map(v => v.storage))) : [];

  const handleRamChange = (ram: string) => {
    if (!isMobile) return;
    const match = product.variants.find(v => v.ram === ram && v.storage === selectedVariant.storage);
    if (match) {
        setSelectedVariant(match);
    } else {
        const fallback = product.variants.find(v => v.ram === ram);
        if (fallback) setSelectedVariant(fallback);
    }
  };

  const handleStorageChange = (storage: string) => {
    if (!isMobile) return;
    const match = product.variants.find(v => v.storage === storage && v.ram === selectedVariant.ram);
    if (match) {
        setSelectedVariant(match);
    } else {
        const fallback = product.variants.find(v => v.storage === storage);
        if (fallback) setSelectedVariant(fallback);
    }
  };

  const handleScroll = () => {
    if (scrollRef.current) {
        const index = Math.round(scrollRef.current.scrollLeft / scrollRef.current.clientWidth);
        setActiveImageIndex(index);
    }
  };

  const shareText = `Check out ${product.name} on Buy Xtra! Price: ₹${selectedVariant.price}`;
  const shareUrl = window.location.href;

  const handleShare = async () => {
    const shareData = {
      title: product.name,
      text: shareText,
      url: shareUrl,
    };

    if (navigator.share) {
      try {
        await navigator.share(shareData);
      } catch (err) {
        // Fallback to modal if native share fails (excluding abort)
        if (err instanceof Error && err.name !== 'AbortError') {
             setShowShareModal(true);
        }
      }
    } else {
      setShowShareModal(true);
    }
  };

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(shareUrl);
      setLinkCopied(true);
      setTimeout(() => setLinkCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy', err);
    }
  };

  return (
    <div className="bg-white min-h-screen pb-24 md:pb-0 relative pt-[118px] md:pt-16 flex flex-col">
      <div className="container mx-auto px-0 md:px-4 py-0 md:py-4 max-w-7xl flex-1">
        
        {/* Breadcrumb / Back (Mobile) - Fixed under navbar */}
        <div className="md:hidden fixed top-16 left-0 right-0 h-[54px] px-4 flex items-center bg-white z-[90] shadow-sm border-b border-gray-100">
           <button onClick={() => navigate(-1)} className="mr-4 text-[#2874F0]">
              <ArrowLeft />
           </button>
           <span className="font-medium truncate text-sm">{product.name}</span>
        </div>

        {/* Back Button (Desktop) */}
        <div className="hidden md:flex mb-4 px-2">
           <button 
             onClick={() => navigate(-1)} 
             className="flex items-center gap-2 text-gray-600 hover:text-[#2874F0] font-medium transition-colors"
           >
              <ArrowLeft className="w-5 h-5" />
              <span>Back to products</span>
           </button>
        </div>

        <div className="flex flex-col md:flex-row gap-0 md:gap-8 bg-white md:p-6 md:shadow-sm rounded-sm">
          
          {/* Left Column: Image Gallery */}
          <div className="w-full md:w-1/3 lg:w-2/5 shrink-0 relative">
             <div className="sticky top-24">
               
               {/* Desktop: Thumbnails + Main Image */}
               <div className="hidden md:flex gap-4 mb-6 h-[400px]">
                  <div className="w-16 flex flex-col gap-2 overflow-y-auto hide-scrollbar">
                     {product.images.map((img, idx) => (
                         <div 
                           key={idx}
                           onClick={() => setActiveImageIndex(idx)}
                           className={`border p-1 cursor-pointer rounded-sm hover:border-[#2874F0] transition-all h-16 w-16 flex items-center justify-center ${activeImageIndex === idx ? 'border-[#2874F0] ring-1 ring-[#2874F0]' : 'border-gray-200'}`}
                         >
                            <img src={img} alt="" className="max-h-full max-w-full object-contain" />
                         </div>
                     ))}
                  </div>
                  <div className="flex-1 border border-gray-100 relative flex items-center justify-center p-4">
                     <button 
                        onClick={handleShare}
                        className="absolute top-2 right-2 p-2 rounded-full border border-gray-200 bg-white shadow-sm cursor-pointer hover:shadow text-gray-400 hover:text-blue-600 z-10 transition-colors"
                        title="Share"
                     >
                        <Share2 className="w-5 h-5" />
                     </button>
                     <img 
                        src={product.images[activeImageIndex]} 
                        alt={product.name} 
                        className="max-h-full max-w-full object-contain transition-opacity duration-300"
                     />
                  </div>
               </div>

               {/* Mobile: Swipeable Carousel */}
               <div className="md:hidden relative w-full aspect-square bg-white">
                  <div 
                    ref={scrollRef}
                    onScroll={handleScroll}
                    className="flex overflow-x-auto snap-x snap-mandatory w-full h-full scrollbar-hide"
                    style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
                  >
                    {product.images.map((img, idx) => (
                        <div key={idx} className="w-full h-full flex-shrink-0 snap-center flex items-center justify-center p-8 relative">
                           <img src={img} alt="" className="max-h-full max-w-full object-contain" />
                        </div>
                    ))}
                  </div>
                  {/* Dots Indicator */}
                  <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2 z-10">
                     {product.images.map((_, idx) => (
                        <div 
                          key={idx}
                          className={`w-2 h-2 rounded-full transition-colors ${activeImageIndex === idx ? 'bg-[#2874F0]' : 'bg-gray-300'}`}
                        />
                     ))}
                  </div>
                  <button 
                    onClick={handleShare}
                    className="absolute top-4 right-4 p-2 rounded-full bg-white/80 shadow-sm text-gray-400 z-10 hover:text-blue-600"
                  >
                     <Share2 className="w-5 h-5" />
                  </button>
               </div>
               
               {/* Desktop CTA */}
               <div className="hidden md:flex gap-4">
                 <WhatsAppButton 
                   model={product.model} 
                   ram={selectedVariant.ram || 'Standard'} 
                   storage={selectedVariant.storage || 'Standard'} 
                   price={selectedVariant.price}
                   className="flex-1 w-full"
                 />
               </div>
             </div>
          </div>

          {/* Right Column: Details */}
          <div className="flex-1 p-4 md:p-0">
            {/* Breadcrumbs (Desktop) */}
            <div className="hidden md:flex text-xs text-[#878787] mb-2 gap-1 capitalize">
              <span>Home</span> &gt; <span>{product.category}s</span> &gt; <span>{product.brand}</span> &gt; <span>{product.name}</span>
            </div>

            {/* Title */}
            <h1 className="text-lg md:text-xl font-medium text-[#212121] mb-2">
              {product.name}
            </h1>

            {/* Ratings */}
            <div className="flex items-center gap-3 mb-4">
              <div className="flex items-center gap-1 bg-[#388E3C] text-white text-xs font-bold px-1.5 py-0.5 rounded-[3px]">
                  {product.rating} <Star className="w-3 h-3 fill-white" />
              </div>
              <span className="text-[#878787] text-sm font-medium">
                {product.reviewCount.toLocaleString()} Ratings & Reviews
              </span>
            </div>

            {/* Price */}
            <div className="mb-6">
               <div className="flex items-baseline gap-3">
                 <span className="text-3xl font-bold text-[#212121]">₹{selectedVariant.price.toLocaleString('en-IN')}</span>
                 <span className="text-[#878787] line-through text-base">₹{selectedVariant.originalPrice.toLocaleString('en-IN')}</span>
                 <span className="text-[#388E3C] font-bold text-base">{discount}% off</span>
               </div>
               <div className="mt-2 text-xs font-medium text-[#212121]">
                  + ₹29 Secured Packaging Fee
               </div>
            </div>

            {/* Variants Selection (Only for Mobiles) */}
            {isMobile && (
              <div className="space-y-6 mb-8 border-t border-b py-4 border-gray-100">
                 
                 {/* RAM Selection */}
                 <div className="flex flex-col md:flex-row md:items-start gap-3">
                   <span className="text-[#878787] text-sm font-medium md:w-24 mt-2">RAM</span>
                   <div className="flex flex-wrap gap-2">
                      {uniqueRams.map(ram => {
                        const isSelected = selectedVariant.ram === ram;
                        return (
                          <button
                            key={ram}
                            onClick={() => handleRamChange(ram as string)}
                            className={`px-4 py-2 border rounded-sm text-sm font-bold transition-all relative overflow-hidden ${
                              isSelected 
                                ? 'border-[#2874F0] text-[#2874F0] bg-blue-50' 
                                : 'border-gray-300 text-[#212121] hover:border-[#2874F0]'
                            }`}
                          >
                            {ram}
                            {isSelected && <div className="absolute top-0 right-0 w-3 h-3 bg-[#2874F0] transform translate-x-1.5 -translate-y-1.5 rotate-45"></div>}
                          </button>
                        );
                      })}
                   </div>
                 </div>

                 {/* Storage Selection */}
                 <div className="flex flex-col md:flex-row md:items-start gap-3">
                   <span className="text-[#878787] text-sm font-medium md:w-24 mt-2">Storage</span>
                   <div className="flex flex-wrap gap-2">
                      {uniqueStorages.map(storage => {
                        const isSelected = selectedVariant.storage === storage;
                         const isValid = product.variants.some(v => v.ram === selectedVariant.ram && v.storage === storage);
                        return (
                          <button
                            key={storage}
                            onClick={() => handleStorageChange(storage as string)}
                            disabled={!isValid}
                            className={`px-4 py-2 border rounded-sm text-sm font-bold transition-all ${
                              isSelected 
                                ? 'border-[#2874F0] text-[#2874F0] bg-blue-50' 
                                : isValid 
                                  ? 'border-gray-300 text-[#212121] hover:border-[#2874F0]'
                                  : 'border-gray-200 text-gray-300 cursor-not-allowed border-dashed'
                            }`}
                          >
                            {storage}
                          </button>
                        );
                      })}
                   </div>
                 </div>
              </div>
            )}

            {/* Specifications - Dynamic based on category */}
            <div className="mb-8">
               <h2 className="text-lg font-bold text-[#212121] mb-4">Specifications</h2>
               <div className="grid grid-cols-2 md:grid-cols-3 gap-4 md:gap-6">
                  {isMobile ? (
                    <>
                      <SpecItem icon={<Cpu />} label="Processor" value={product.specs.processor} />
                      <SpecItem icon={<Smartphone />} label="Display" value={product.specs.display} />
                      <SpecItem icon={<Camera />} label="Camera" value={product.specs.camera} />
                      <SpecItem icon={<Battery />} label="Battery" value={product.specs.battery} />
                      <SpecItem icon={<Bluetooth />} label="Bluetooth" value={product.specs.bluetooth} />
                      <SpecItem icon={<HardDrive />} label="Storage" value={selectedVariant.storage} />
                    </>
                  ) : (
                    <>
                      {product.specs.power && <SpecItem icon={<Zap />} label="Power" value={product.specs.power} />}
                      {product.specs.type && <SpecItem icon={<Box />} label="Type" value={product.specs.type} />}
                      {product.specs.warranty && <SpecItem icon={<ShieldCheck />} label="Warranty" value={product.specs.warranty} />}
                      {product.specs.color && <SpecItem icon={<Palette />} label="Color" value={product.specs.color} />}
                      {product.specs.material && <SpecItem icon={<Box />} label="Material" value={product.specs.material} />}
                    </>
                  )}
               </div>
            </div>

            {/* Highlights */}
            <div className="mb-8">
               <h2 className="text-lg font-bold text-[#212121] mb-2">Highlights</h2>
               <ul className="list-disc list-inside text-sm text-[#212121] space-y-1">
                 {product.highlights.map((h, i) => (
                   <li key={i}>{h}</li>
                 ))}
               </ul>
            </div>

            {/* Description */}
            <div className="border border-gray-200 p-4 rounded-sm bg-blue-50">
               <div className="flex items-center gap-2 mb-2">
                 <Tag className="w-5 h-5 text-[#2874F0]" />
                 <span className="font-bold text-sm text-[#2874F0]">Bank Offer</span>
               </div>
               <p className="text-sm text-[#212121]">
                 5% Unlimited Cashback on Buy Xtra Axis Bank Credit Card. T&C Apply.
               </p>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Sticky CTA */}
      <WhatsAppButton 
        model={product.model} 
        ram={selectedVariant.ram || 'Standard'} 
        storage={selectedVariant.storage || 'Standard'} 
        price={selectedVariant.price}
        isStickyMobile={true}
      />

      {/* Custom Share Modal (Desktop/Fallback) */}
      {showShareModal && (
        <div 
          className="fixed inset-0 z-[60] flex items-center justify-center bg-black/60 backdrop-blur-sm animate-in fade-in duration-200" 
          onClick={() => setShowShareModal(false)}
        >
          <div 
            className="bg-white p-6 rounded-lg shadow-2xl w-[90%] max-w-sm relative animate-in zoom-in-95 duration-200" 
            onClick={e => e.stopPropagation()}
          >
            <div className="flex justify-between items-center mb-6">
               <h3 className="text-lg font-bold text-[#212121]">Share Product</h3>
               <button 
                  onClick={() => setShowShareModal(false)} 
                  className="text-gray-500 hover:text-gray-800 p-1 rounded-full hover:bg-gray-100"
               >
                 <X className="w-6 h-6" />
               </button>
            </div>
            
            <div className="grid grid-cols-3 gap-6">
                {/* WhatsApp */}
                <a 
                    href={`https://wa.me/?text=${encodeURIComponent(shareText + ' ' + shareUrl)}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex flex-col items-center gap-2 group"
                >
                    <div className="w-14 h-14 bg-[#25D366] rounded-full flex items-center justify-center text-white shadow-md group-hover:scale-110 transition-transform">
                       <svg viewBox="0 0 24 24" className="w-8 h-8 fill-current"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/></svg>
                    </div>
                    <span className="text-sm font-medium text-gray-700">WhatsApp</span>
                </a>

                {/* Facebook */}
                <a 
                    href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex flex-col items-center gap-2 group"
                >
                    <div className="w-14 h-14 bg-[#1877F2] rounded-full flex items-center justify-center text-white shadow-md group-hover:scale-110 transition-transform">
                       <svg viewBox="0 0 24 24" className="w-8 h-8 fill-current" stroke="currentColor" strokeWidth="0"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.791-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg>
                    </div>
                    <span className="text-sm font-medium text-gray-700">Facebook</span>
                </a>
                
                {/* Copy Link */}
                <button 
                    onClick={copyToClipboard}
                    className="flex flex-col items-center gap-2 group"
                >
                    <div className={`w-14 h-14 rounded-full flex items-center justify-center text-white shadow-md transition-all group-hover:scale-110 ${linkCopied ? 'bg-green-500' : 'bg-gray-600'}`}>
                        {linkCopied ? <Check className="w-8 h-8" /> : <LinkIcon className="w-8 h-8" />}
                    </div>
                    <span className="text-sm font-medium text-gray-700">{linkCopied ? 'Copied!' : 'Copy Link'}</span>
                </button>
            </div>
            
            <div className="mt-4 p-3 bg-gray-50 rounded border border-gray-100 flex items-center gap-2 overflow-hidden">
               <div className="text-xs text-gray-500 truncate flex-1">{shareUrl}</div>
               <button onClick={copyToClipboard} className="text-[#2874F0] font-bold text-xs shrink-0 hover:underline">
                  COPY
               </button>
            </div>
          </div>
        </div>
      )}
      <div className="mt-auto">
        <Footer />
      </div>
    </div>
  );
};