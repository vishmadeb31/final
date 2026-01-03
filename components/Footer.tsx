import React from 'react';
import { useLocation } from 'react-router-dom';

export const Footer = () => {
  const location = useLocation();
  const isProductPage = location.pathname.startsWith('/product/');

  // If on product page, hide footer on mobile (hidden), show on md (md:block)
  // Otherwise show always (block)
  const footerVisibilityClass = isProductPage ? "hidden md:block" : "block";

  return (
    <footer className={`bg-[#172337] text-white py-12 text-sm mt-auto ${footerVisibilityClass}`}>
      <div className="container mx-auto px-4 max-w-7xl grid grid-cols-1 md:grid-cols-4 gap-8">
        <div>
          <h3 className="text-[#878787] mb-4 uppercase text-xs font-bold">About</h3>
          <ul className="space-y-2">
            <li>Contact Us</li>
            <li>About Us</li>
            <li>Careers</li>
            <li>Buy Xtra Stories</li>
          </ul>
        </div>
        <div>
          <h3 className="text-[#878787] mb-4 uppercase text-xs font-bold">Help</h3>
          <ul className="space-y-2">
            <li>Payments</li>
            <li>Shipping</li>
            <li>Cancellation & Returns</li>
            <li>FAQ</li>
          </ul>
        </div>
        <div>
          <h3 className="text-[#878787] mb-4 uppercase text-xs font-bold">Policy</h3>
          <ul className="space-y-2">
            <li>Return Policy</li>
            <li>Terms of Use</li>
            <li>Security</li>
            <li>Privacy</li>
          </ul>
        </div>
        <div className="border-l border-[#454d5e] pl-0 md:pl-8">
          <h3 className="text-[#878787] mb-4 uppercase text-xs font-bold">Mail Us:</h3>
          <p className="leading-relaxed">
            Buy Xtra Internet Private Limited,<br/>
            Buildings Alyssa, Begonia &<br/>
            Clove Embassy Tech Village,<br/>
            Outer Ring Road, Devarabeesanahalli Village,<br/>
            Bengaluru, 560103,<br/>
            Karnataka, India
          </p>
        </div>
      </div>
      <div className="container mx-auto px-4 max-w-7xl mt-10 pt-6 border-t border-[#454d5e] flex flex-col md:flex-row justify-between items-center gap-4">
        <div className="flex items-center gap-2">
            <span className="text-[#FFE11B] font-bold italic">Buy Xtra</span>
            <span>© 2024-2025 BuyXtra.com</span>
        </div>
        <img src="https://static-assets-web.flixcart.com/fk-p-linchpin-web/fk-cp-zion/img/payment-method_69e7ec.svg" alt="Payments" className="h-4" />
      </div>
    </footer>
  );
};