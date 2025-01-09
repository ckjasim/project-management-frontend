
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
    <div className="flex items-center justify-between max-w-6xl mx-auto px-6 py-16 gap-16">
      {/* Left side content */}
      <div className="flex-1">
        <span className="px-4 py-1 text-sm text-purple-600 bg-purple-50 rounded-full inline-block">
          Integration
        </span>
        
        <h2 className="text-4xl font-bold mt-6 mb-6 leading-tight">
          Integrate with popular tools to streamline your workflow.
        </h2>
        
        <p className="text-gray-600 mb-8 text-lg leading-relaxed">
          Integrating with popular tools centralizes tasks, automates 
          processes, and improves collaboration, saving time and boosting 
          productivity.
        </p>
        
        <button className="px-6 py-2 bg-indigo-900 text-white rounded-full hover:bg-indigo-800 transition-colors">
          Start for free
        </button>
      </div>

      {/* Right side visualization */}
      <div className="relative w-96 h-96 bg-gray-50 rounded-3xl flex items-center justify-center">
        {/* Center logo */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-16 h-16 bg-blue-600 rounded-lg flex items-center justify-center text-white text-2xl">
          A
        </div>

        {/* Three overlapping circles */}
        <svg className="absolute inset-0 w-full h-full" viewBox="0 0 400 400">
          <circle 
            cx="200" 
            cy="200" 
            r="120" 
            fill="none" 
            stroke="#E5E7EB" 
            strokeWidth="2" 
            strokeDasharray="4 4"
            transform="rotate(0 200 200)"
          />
          <circle 
            cx="200" 
            cy="200" 
            r="120" 
            fill="none" 
            stroke="#E5E7EB" 
            strokeWidth="2" 
            strokeDasharray="4 4"
            transform="rotate(120 200 200)"
          />
          <circle 
            cx="200" 
            cy="200" 
            r="120" 
            fill="none" 
            stroke="#E5E7EB" 
            strokeWidth="2" 
            strokeDasharray="4 4"
            transform="rotate(240 200 200)"
          />
        </svg>

        {/* Tool icons */}
        {tools.map((tool) => (
          <div
            key={tool.id}
            className={`absolute w-10 h-10 rounded-lg bg-white shadow-md flex items-center justify-center text-xl ${tool.position}`}
            style={{ border: '2px solid #F3F4F6' }}
          >
            {tool.icon}
          </div>
        ))}
      </div>
    </div>
  );
};

export default IntegrationSection;