import React from 'react';
import { Product } from '../types';
import { Star } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface ProductCardProps {
  product: Product;
  showViewDetails?: boolean;
  layout?: 'grid' | 'list';
}

export const ProductCard: React.FC<ProductCardProps> = ({ product, showViewDetails = false, layout = 'grid' }) => {
  const navigate = useNavigate();
  const baseVariant = product.variants[0];
  const discount = Math.round(((baseVariant.originalPrice - baseVariant.price) / baseVariant.originalPrice) * 100);

  const handleClick = (e: React.MouseEvent) => {
    navigate(`/product/${product.id}`);
  };

  if (layout === 'list') {
    return (
      <div 
        onClick={handleClick}
        className="bg-white p-4 md:p-6 hover:shadow-lg transition-all duration-300 cursor-pointer flex flex-col md:flex-row gap-4 md:gap-8 border-b border-gray-100 relative group"
      >
        {/* Image Container */}
        <div className="w-full md:w-[250px] h-48 md:h-64 shrink-0 flex items-center justify-center p-2 relative">
           <img 
             src={product.images[0]} 
             alt={product.name} 
             className="max-h-full max-w-full object-contain group-hover:scale-105 transition-transform duration-300"
           />
        </div>

        {/* Content */}
        <div className="flex-1 flex flex-col md:flex-row gap-4 md:gap-8">
          <div className="flex-1 space-y-2">
            <h3 className="font-medium text-base md:text-lg text-[#212121] group-hover:text-[#2874F0] transition-colors leading-tight">
              {product.name}
            </h3>
            
            <div className="flex items-center gap-2">
              <div className="flex items-center gap-1 bg-[#388E3C] text-white text-xs font-bold px-1.5 py-0.5 rounded-[3px]">
                {product.rating} <Star className="w-2.5 h-2.5 fill-white" />
              </div>
              <span className="text-[#878787] text-sm font-medium">
                {product.reviewCount.toLocaleString()} Ratings & Reviews
              </span>
            </div>

            <ul className="text-sm text-gray-600 space-y-1 list-disc list-inside md:list-outside md:ml-4">
               {product.highlights.slice(0, 4).map((h, i) => (
                 <li key={i} className="line-clamp-1">{h}</li>
               ))}
            </ul>
          </div>

          <div className="md:w-64 shrink-0 flex flex-col items-start md:items-end md:text-right">
             <div className="text-2xl font-bold text-[#212121]">
                ₹{baseVariant.price.toLocaleString('en-IN')}
             </div>
             <div className="flex items-center gap-2 mt-1">
                <div className="text-[#878787] text-sm line-through">
                  ₹{baseVariant.originalPrice.toLocaleString('en-IN')}
                </div>
                <div className="text-[#388E3C] text-sm font-bold">
                  {discount}% off
                </div>
             </div>
             <div className="mt-2 text-xs text-[#212121] font-medium">
                Free delivery
             </div>
             <div className="mt-1 text-xs text-[#388E3C] font-bold">
                Daily Saver
             </div>
             
             {showViewDetails && (
               <button className="hidden md:block w-full mt-4 bg-[#2874F0] text-white text-sm font-bold py-2 rounded-sm shadow-sm uppercase tracking-wide hover:bg-[#1C54B2] transition-colors">
                 View Details
               </button>
             )}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div 
      onClick={handleClick}
      className="product-card-animate bg-white p-4 hover:shadow-lg transition-shadow duration-300 cursor-pointer flex flex-col gap-4 border border-gray-100 relative group rounded-sm h-full"
    >
      <div className="w-full h-48 shrink-0 flex items-center justify-center p-2 relative">
         <img 
           src={product.images[0]} 
           alt={product.name} 
           className="max-h-full max-w-full object-contain group-hover:scale-105 transition-transform duration-300"
         />
      </div>

      <div className="flex-1 flex flex-col gap-2">
        <div className="space-y-1">
          <h3 className="font-medium text-sm md:text-base text-[#212121] hover:text-[#2874F0] transition-colors leading-tight line-clamp-2 min-h-[2.5em]">
            {product.name}
          </h3>
          
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-1 bg-[#388E3C] text-white text-[10px] font-bold px-1.5 py-0.5 rounded-[3px]">
              {product.rating} <Star className="w-2.5 h-2.5 fill-white" />
            </div>
            <span className="text-[#878787] text-xs font-medium">
              ({product.reviewCount.toLocaleString()})
            </span>
          </div>

          <div className="text-xs text-gray-500 mt-2 space-y-1 hidden md:block">
            <p className="truncate"><span className="text-black font-medium">{baseVariant.ram ? `${baseVariant.ram} RAM | ` : ''}{baseVariant.storage ? `${baseVariant.storage} ROM` : ''}</span></p>
            <p className="truncate">{product.specs.display || product.specs.type}</p>
          </div>
        </div>

        <div className="mt-auto pt-2">
          <div className="flex flex-col items-start">
             <div className="text-lg font-bold text-[#212121]">
                ₹{baseVariant.price.toLocaleString('en-IN')}
             </div>
             <div className="flex items-center gap-2">
                <div className="text-[#878787] text-sm line-through">
                  ₹{baseVariant.originalPrice.toLocaleString('en-IN')}
                </div>
                <div className="text-[#388E3C] text-xs font-bold">
                  {discount}% off
                </div>
             </div>
          </div>
          <div className="hidden md:block mt-1 text-[10px] text-[#212121]">
             Free delivery
          </div>

          {showViewDetails && (
            <button className="w-full mt-3 bg-[#2874F0] text-white text-xs md:text-sm font-bold py-2 rounded-sm shadow-sm uppercase tracking-wide hover:bg-[#1C54B2] transition-colors">
              View Details
            </button>
          )}
        </div>
      </div>
    </div>
  );
};