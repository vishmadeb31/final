
import React from 'react';
import { PHONE_NUMBER } from '../constants';

interface WhatsAppButtonProps {
  model: string;
  ram: string;
  storage: string;
  price: number;
  className?: string;
  isStickyMobile?: boolean;
}

export const WhatsAppButton: React.FC<WhatsAppButtonProps> = ({ 
  model, 
  ram, 
  storage, 
  price, 
  className = '',
  isStickyMobile = false
}) => {
  const message = `Hello Buy Xtra,
I want to buy:
Model: ${model}
RAM: ${ram}
Storage: ${storage}
Price: ₹${price.toLocaleString('en-IN')}`;

  const encodedMessage = encodeURIComponent(message);
  const whatsappUrl = `https://wa.me/${PHONE_NUMBER}?text=${encodedMessage}`;

  const WhatsAppIcon = ({ size = 28 }: { size?: number }) => (
    <svg 
      viewBox="0 0 24 24" 
      width={size} 
      height={size} 
      className="fill-current"
    >
      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/>
    </svg>
  );

  if (isStickyMobile) {
    return (
      <a 
        href={whatsappUrl} 
        target="_blank" 
        rel="noopener noreferrer"
        className="fixed bottom-0 left-0 w-full z-50 bg-gradient-to-r from-[#25D366] to-[#128C7E] active:from-[#1DA851] active:to-[#0D7363] text-white h-20 flex items-center justify-center shadow-[0_-8px_30px_rgba(0,0,0,0.2)] md:hidden border-t border-white/10 animate-shine"
      >
        <div className="flex items-center gap-4 px-6">
          <div className="bg-white/20 p-2.5 rounded-full backdrop-blur-md border border-white/20 shadow-inner">
             <WhatsAppIcon size={26} />
          </div>
          <div className="flex flex-col items-start leading-tight">
             <span className="text-[10px] uppercase font-bold tracking-widest opacity-80 mb-0.5">Secure Checkout</span>
             <span className="text-lg font-black tracking-tight uppercase">Buy Now on WhatsApp</span>
          </div>
        </div>
      </a>
    );
  }

  return (
    <a 
      href={whatsappUrl} 
      target="_blank" 
      rel="noopener noreferrer"
      className={`group relative overflow-hidden bg-gradient-to-r from-[#25D366] via-[#1BD741] to-[#25D366] hover:from-[#1BD741] hover:to-[#25D366] text-white rounded-sm shadow-[0_4px_20px_rgba(37,211,102,0.3)] hover:shadow-[0_8px_30px_rgba(37,211,102,0.45)] transition-all duration-300 flex flex-col items-center justify-center py-4 px-10 transform hover:-translate-y-1 active:scale-[0.98] border border-white/10 animate-shine ${className}`}
    >
      <div className="flex items-center gap-4">
        <div className="bg-white/20 p-2.5 rounded-full backdrop-blur-md border border-white/20 shadow-inner group-hover:scale-110 transition-transform duration-300">
          <WhatsAppIcon size={30} />
        </div>
        <div className="flex flex-col items-start">
           <span className="text-xl font-black tracking-tight leading-none uppercase">Buy Now</span>
           <span className="text-xs font-bold opacity-90 uppercase tracking-widest mt-0.5">Order on WhatsApp</span>
        </div>
      </div>
      
      {/* Subtle indicator of security */}
      <div className="absolute top-1 right-2 opacity-30 text-white">
        <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor"><path d="M12 1L3 5v6c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V5l-9-4zm-2 16l-4-4 1.41-1.41L10 14.17l6.59-6.59L18 9l-8 8z"/></svg>
      </div>
    </a>
  );
};
