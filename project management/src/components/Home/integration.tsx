
const IntegrationSection = () => {


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