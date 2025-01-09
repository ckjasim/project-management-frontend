
const UnlockPerksSection = () => {
  return (
    <div className="max-w-6xl mx-auto px-6 py-16">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
        {/* Left column */}
        <div>
          <h2 className="text-5xl font-bold leading-tight">
            Unlock exclusive perks to{' '}
            <span className="text-gray-400">supercharge your workflow.</span>
          </h2>
        </div>
        
        {/* Right column */}
        <div>
          <p className="text-gray-600 text-lg leading-relaxed">
            Discover a suite of benefits designed to simplify your project management. 
            From advanced tools to seamless collaboration, we're here to help you stay 
            organized, save time, and achieve your goals faster.
          </p>
        </div>
      </div>

      {/* Image section */}
      <div className="mt-12 rounded-2xl overflow-hidden bg-gray-100">
        <img 
          src="/api/placeholder/1200/600"
          alt="Students collaborating"
          className="w-full h-auto rounded-2xl"
        />
      </div>
    </div>
  );
};

export default UnlockPerksSection;