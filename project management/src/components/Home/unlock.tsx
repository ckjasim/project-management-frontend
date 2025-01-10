
const UnlockPerksSection = () => {
  return (
    <div className="max-w-5xl mx-auto px-6 py-16">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Left column */}
        <div>
          <h2 className="text-4xl font-bold leading-tight">
            Unlock exclusive <br /> perks to{' '}
            <span className="text-gray-400">supercharge <br /> your workflow.</span>
          </h2>
        </div>
        
        {/* Right column */}
        <div>
          <p className="text-gray-600 text-lg font-semibold leading-relaxed">
            Discover a suite of benefits designed to simplify your <br />project management. 
            From advanced tools to <br /> seamless collaboration, we're here to help you stay <br />
            organized, save time, and achieve your goals faster.
          </p>
        </div>
      </div>

      {/* Image section */}
      <div className="mt-12 rounded-2xl overflow-hidden bg-gray-100">
  <img
    src="./5.jpg"
    alt="Students collaborating"
    className="w-full h-96 object-cover"
  />
</div>

    </div>
  );
};

export default UnlockPerksSection;