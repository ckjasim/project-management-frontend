import React from 'react';
import { AlertOctagon, ArrowLeft, Home } from 'lucide-react';

const ErrorPage = ({ 
  errorCode = '404', 
  message = 'Oops! Page Not Found', 
  description = 'The page you are searching for might have been moved, renamed, or temporarily unavailable.' 
}) => {
  return (
    <div className="relative min-h-screen bg-gradient-to-br from-indigo-50 via-white to-blue-100 flex items-center justify-center overflow-hidden">
      {/* Subtle Background Shapes */}
      <div className="absolute top-0 left-0 w-full h-full opacity-10 pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-96 h-96 bg-blue-200 rounded-full mix-blend-multiply filter blur-2xl animate-slow-spin"></div>
        <div className="absolute bottom-[-10%] right-[-10%] w-96 h-96 bg-purple-200 rounded-full mix-blend-multiply filter blur-2xl animate-slow-spin-reverse"></div>
      </div>
      
      {/* Main Error Content */}
      <div className="relative z-10 max-w-xl w-full p-8 bg-white/60 backdrop-blur-lg rounded-2xl shadow-2xl border border-white/30 transform transition-all duration-500 hover:scale-[1.02]">
        <div className="flex flex-col items-center text-center">
          {/* Animated Icon */}
          <div className="mb-6 relative">
            <div className="absolute -inset-3 bg-blue-400/20 rounded-full animate-pulse"></div>
            <AlertOctagon 
              size={96} 
              className="relative text-blue-600 stroke-[1.3] drop-shadow-lg animate-bounce-slow"
            />
          </div>
          
          {/* Error Code */}
          <h1 className="text-8xl font-black text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600 mb-4 tracking-tight">
            {errorCode}
          </h1>
          
          {/* Error Message */}
          <h2 className="text-3xl font-bold text-gray-800 mb-4 tracking-tight">
            {message}
          </h2>
          
          {/* Description */}
          <p className="text-gray-600 mb-8 max-w-md leading-relaxed">
            {description}
          </p>
          
          {/* Action Buttons */}
          <div className="flex space-x-4">
            {/* <button 
              onClick={() => window.history.back()}
              className="flex items-center gap-2 px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-all duration-300 shadow-md hover:shadow-xl group"
            >
              <ArrowLeft className="group-hover:-translate-x-1 transition-transform" />
              Go Back
            </button> */}
            
            <button 
              onClick={() => window.location.href = '/auth/userLogin'}
              className="flex items-center gap-2 px-6 py-3 bg-white text-gray-700 rounded-lg border border-gray-200 hover:bg-gray-100 transition-all duration-300 shadow-md hover:shadow-xl group"
            >
              <Home className="group-hover:rotate-12 transition-transform" />
              Home Page
            </button>
          </div>
        </div>
      </div>
      
      {/* Subtle Particle Background */}
      <div className="absolute inset-0 pointer-events-none opacity-20">
        {[...Array(50)].map((_, i) => (
          <div 
            key={i} 
            className="absolute bg-blue-300 rounded-full opacity-40"
            style={{
              width: `${Math.random() * 6}px`,
              height: `${Math.random() * 6}px`,
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 5}s`,
              animation: 'float 10s infinite alternate'
            }}
          />
        ))}
      </div>
    </div>
  );
};

export default ErrorPage;