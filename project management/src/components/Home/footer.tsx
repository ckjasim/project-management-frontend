import { ChevronDown } from 'lucide-react';

const Footer = () => {
  return (
    <div className="bg-white">
      <footer className="max-w-[1240px] mx-auto px-5 pt-20 pb-8 relative">
        {/* Large Background Text */}
        <div>
        <div className="absolute inset-0 flex items-end justify-center pointer-events-none overflow-hidden">
  <div className="text-[232px] leading-none font-bold text-[#F3F4F6] opacity-80">
    ProjectEase
  </div>
</div>


        <div className="grid grid-cols-12 gap-8 mb-20 relative">
          {/* Company Info */}
          <div className="col-span-4">
            <div className="flex items-center gap-2 mb-6">
              <div className="w-6 h-6 bg-[#6366F1] rounded-md"></div>
              <span className="text-xl font-semibold text-[#111827]">TaskHive</span>
            </div>
            <p className="text-[#4B5563] text-base leading-[1.75] mb-8 pr-8">
              We provide seamless solutions to manage your projects and keep all your task arranged with our best product.
            </p>
            <div className="flex gap-6">
              <a href="#" className="text-[#1877F2] hover:opacity-90">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M9 8H6v4h3v12h5V12h3.642L18 8h-4V6.333C14 5.378 14.192 5 15.115 5H18V0h-3.808C10.596 0 9 1.583 9 4.615V8z"/>
                </svg>
              </a>
              <a href="#" className="text-[#E4405F] hover:opacity-90">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                </svg>
              </a>
              <a href="#" className="text-[#1DA1F2] hover:opacity-90">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M23 3a10.9 10.9 0 0 1-3.14 1.53 4.48 4.48 0 0 0-7.86 3v1A10.66 10.66 0 0 1 3 4s-4 9 5 13a11.64 11.64 0 0 1-7 2c9 5 20 0 20-11.5a4.5 4.5 0 0 0-.08-.83A7.72 7.72 0 0 0 23 3z"/>
                </svg>
              </a>
              <a href="#" className="text-[#FF0000] hover:opacity-90">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
                </svg>
              </a>
            </div>
          </div>

          {/* Navigation */}
          <div className="col-span-2">
            <h3 className="text-[#111827] font-semibold mb-6">Navigation</h3>
            <nav className="space-y-4">
              <div className="flex items-center justify-between group cursor-pointer">
                <span className="text-[#4B5563] group-hover:text-[#111827]">Features</span>
                <ChevronDown className="w-4 h-4 text-[#4B5563] group-hover:text-[#111827]" />
              </div>
              <div className="text-[#4B5563] hover:text-[#111827] cursor-pointer">Pricing</div>
              <div className="text-[#4B5563] hover:text-[#111827] cursor-pointer">About</div>
              <div className="text-[#4B5563] hover:text-[#111827] cursor-pointer">Contact</div>
            </nav>
          </div>

          {/* Empty Column */}
          <div className="col-span-3" />

          {/* Contact */}
          <div className="col-span-3">
            <h3 className="text-[#111827] font-semibold mb-6">Contact</h3>
            <div className="space-y-6">
              <div>
                <p className="text-[#4B5563] text-sm mb-1">Location</p>
                <p className="text-[#111827] mb-1">2627 Park Street, San Francisco, CA</p>
                <a href="#" className="text-[#6366F1] text-sm hover:underline">Open Map</a>
              </div>
              <div>
                <p className="text-[#4B5563] text-sm mb-1">Phone Number</p>
                <p className="text-[#111827]">925-465-3762</p>
              </div>
              <div>
                <p className="text-[#4B5563] text-sm mb-1">Email</p>
                <p className="text-[#111827]">telldesk@example.com</p>
              </div>
            </div>
          </div>
        </div>
        </div>
        {/* Footer Bottom */}
      
      </footer>
      <div className="flex justify-center">
  <div className="flex justify-between items-center w-full max-w-[1240px] pt-2 border-t border-[#E5E7EB]">
    <p className="text-[#4B5563] text-sm">© 2024 TaskHive. All Rights Reserved</p>
    <div className="flex gap-6">
      <a href="#" className="text-[#4B5563] hover:text-[#111827] text-sm">Terms & Conditions</a>
      <a href="#" className="text-[#4B5563] hover:text-[#111827] text-sm">Privacy Policy</a>
    </div>
  </div>
</div>

      </div>
  );
};

export default Footer;