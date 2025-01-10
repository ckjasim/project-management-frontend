
const IntegrationSection = () => {
  // Tool icons with their positions along the circles
  const tools = [
    { id: 'excel', icon: '📊', color: '#217346', position: 'top-8 right-1/4' },
    { id: 'slack', icon: '💬', color: '#4A154B', position: 'top-1/4 right-8' },
    { id: 'dropbox', icon: '📦', color: '#0061FF', position: 'left-8 top-1/2' },
    { id: 'shopify', icon: '🛍️', color: '#96bf48', position: 'bottom-16 left-1/4' },
    { id: 'google-drive', icon: '📝', color: '#FBBC05', position: 'bottom-8 right-16' },
    { id: 'teams', icon: '👥', color: '#6264A7', position: 'top-1/4 right-16' }
  ];

  return (
    <div className="flex items-center justify-between max-w-4xl mx-auto  py-16 gap-16">
      {/* Left side content */}
      <div className="flex-1">
      <span className="inline-block px-4 py-1 text-sm bg-gradient-to-r  text-transparent bg-clip-text border border-gradient-to-r from-indigo-500 to-rose-500 rounded-full">
          Integration
        </span>
        
        <h2 className="text-4xl font-semibold mt-6 mb-6 leading-tight">
          Integrate with popular <br />tools to streamline your <br /> workflow.
        </h2>
        
        <p className="text-gray-600 mb-8  leading-relaxed">
          Integrating with popular tools centralizes tasks, automates <br /> 
          processes, and improves collaboration, saving time and boosting <br />
          productivity.
        </p>
        
        <button className="px-6 py-2 bg-indigo-900 text-white rounded-full hover:bg-indigo-800 transition-colors">
          Start for free
        </button>
      </div>

      <div className="relative w-96 h-96 bg-gray-50 rounded-3xl p-7 pb-12 flex items-center justify-center">
        <img src="./Group 328.png" alt="" />

       
      </div>
    </div>
  );
};

export default IntegrationSection;