import React from 'react';
import { Users } from 'lucide-react';

const TeamCollaborationSection = () => {
  const teamMembers = [
    { id: 1, color: '#FFD700', top: '20%', left: '10%' },
    { id: 2, color: '#87CEEB', top: '10%', left: '50%' },
    { id: 3, color: '#FF69B4', top: '20%', left: '90%' },
    { id: 4, color: '#98FB98', top: '50%', left: '95%' },
    { id: 5, color: '#DDA0DD', top: '80%', left: '90%' },
    { id: 6, color: '#F0E68C', top: '90%', left: '50%' },
    { id: 7, color: '#87CEFA', top: '80%', left: '10%' },
    { id: 8, color: '#FFB6C1', top: '50%', left: '5%' }
  ];

  return (
    <div className="flex items-center justify-between max-w-6xl mx-auto px-6 py-16 gap-16">
      {/* Left side - Circular visualization */}
      <div className="relative w-96 h-96 bg-gray-50 rounded-3xl flex items-center justify-center">
        <div className="w-72 h-72 rounded-full border-2 border-dashed border-gray-200 relative">
          {/* Center avatar */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-indigo-600 flex items-center justify-center">
            <Users className="w-6 h-6 text-white" />
          </div>
          
          {/* Orbiting team members */}
          {teamMembers.map((member) => (
            <div
              key={member.id}
              className="absolute w-8 h-8 rounded-full"
              style={{
                top: member.top,
                left: member.left,
                backgroundColor: member.color,
                transform: 'translate(-50%, -50%)'
              }}
            />
          ))}
          
          {/* Small dots */}
          <div className="absolute w-2 h-2 rounded-full bg-blue-400 top-1/4 left-1/2 transform -translate-x-1/2" />
          <div className="absolute w-2 h-2 rounded-full bg-green-400 top-1/2 right-0 transform translate-x-1/2" />
          <div className="absolute w-2 h-2 rounded-full bg-red-400 bottom-1/4 left-1/2 transform -translate-x-1/2" />
        </div>
      </div>

      {/* Right side - Content */}
      <div className="flex-1">
        <span className="px-4 py-1 text-sm text-purple-600 bg-purple-50 rounded-full">
          Team Collaboration
        </span>
        
        <h2 className="text-3xl font-bold mt-4 mb-4">
          Collaborate seamlessly with your team in real-time.
        </h2>
        
        <p className="text-gray-600 mb-8">
          Our platform offers live editing, instant updates, and synchronized 
          teamwork tools, ensuring your team stays connected and aligned 
          effortlessly.
        </p>
        
        <div className="space-y-4">
          <div className="flex items-center gap-3">
            <div className="w-2 h-2 rounded-full bg-purple-600" />
            <span>Provide live chat support during peak hours.</span>
          </div>
          
          <div className="flex items-center gap-3">
            <div className="w-2 h-2 rounded-full bg-purple-600" />
            <span>Offer email support with guaranteed response times.</span>
          </div>
        </div>
        
        <button className="mt-8 px-6 py-2 bg-indigo-900 text-white rounded-full hover:bg-indigo-800 transition-colors">
          Start for free
        </button>
      </div>
    </div>
  );
};

export default TeamCollaborationSection;