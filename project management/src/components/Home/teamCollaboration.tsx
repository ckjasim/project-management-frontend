
import { Cpu, Rabbit, Send, } from 'lucide-react';
import React from "react"
import { motion, useInView } from "framer-motion"
const TeamCollaborationSection = () => {
  // Inner circle items
  const ref = React.useRef(null)
  const isInView = useInView(ref, { once: true, amount: 0.3 })
  const innerCircleItems = [
    { type: 'avatar', angle: 0, size: 'sm', image: './2.png' },
    { type: 'icon', angle: 72, icon: <Cpu className='stroke-indigo-400'/>, background: 'bg-purple-100' },
    { type: 'text', angle: 144, text: 'Task Done', rating: 5, background: 'bg-white' },
    { type: 'button', angle: 216, text: 'Message', background: 'bg-indigo-500' },
    { type: 'icon', angle: 288, icon: <Send className='stroke-indigo-400'/>, background: 'bg-blue-100' }
  ];

  // Outer circle items
  const outerCircleItems = [
    { type: 'avatar', angle: 0, image: './1.png' },
    { type: 'avatar', angle: 60, image: './1.png' },
    { type: 'avatar', angle: 120, image: './1.png' },
    { type: 'avatar', angle: 180, image: './1.png' },
    { type: 'boost', angle: 240, text: 'Boost your work' },
    { type: 'avatar', angle: 300, image: './1.png' }
  ];

  const getItemStyle = (angle:any, radius:any) => ({
    left: '50%',
    top: '50%',
    transform: `rotate(${angle}deg) translateX(${radius}px) rotate(-${angle}deg) translate(-50%, -50%)`
  });

  const renderItem = (item:any, index:any, radius:any) => {
    const style = getItemStyle(item.angle, radius);

    switch (item.type) {
      case 'avatar':
        return (
          <div
            key={index}
            className={`absolute ${item.size === 'lg' ? 'w-20 h-20' : 'w-8 h-8'} rounded-full overflow-hidden`}
            style={style}
          >
            <img
              src={item.image}
              alt="Profile"
              className="w-full h-full object-cover"
            />
          </div>
        );
      case 'icon':
        return (
          <div
            key={index}
            className={`absolute w-8 h-8 ${item.background} rounded-full flex items-center justify-center shadow-sm`}
            style={style}
          >
            {item.icon}
          </div>
        );
      case 'text':
        return (
          <div
            key={index}
            className="absolute bg-white rounded-xl p-2 shadow-sm"
            style={style}
          >
            <div className="text-xs font-medium">{item.text}</div>
            <div className="flex text-yellow-400 text-xs">
              {'★'.repeat(item.rating)}
            </div>
          </div>
        );
      case 'button':
        return (
          <button
            key={index}
            className="absolute px-3 py-1.5 bg-gradient-to-r from-indigo-400 to-purple-400 text-white rounded-full text-xs font-medium shadow-sm"
            style={style}
          >
            {item.text}
          </button>
        );
      case 'boost':
        return (
          <div
            key={index}
            className="absolute flex items-center gap-1.5  text-purple-400 font-medium"
            style={style}
          >
           <span><Rabbit className='stroke-purple-400'/></span> 
            <span className="text-xs whitespace-nowrap">{item.text}</span>
          </div>
        );
      default:
        return null;
    }
  }; 

  return (
    <div className="flex items-center justify-between max-w-5xl mx-auto px-6 py-16 gap-16">
      {/* Left side - Circular visualization */}
      <div className="relative w-96 h-96  bg-gray-50 rounded-3xl flex items-center justify-center">
        {/* Dotted circles */}
        <div className="absolute w-[180px] h-[180px] rounded-full border border-dashed border-purple-200" />
        <div className="absolute w-[280px] h-[280px] rounded-full border border-dashed border-purple-200" />

        {/* Center profile */}
        <div className="absolute w-12 h-12 rounded-full overflow-hidden shadow-sm">
          <img
            src="./2.png"
            alt="Center profile"
            className="w-full h-full object-cover"
          />
        </div>

        {/* Inner circle items */}
        {innerCircleItems.map((item, index) => renderItem(item, index, 60))}

        {/* Outer circle items */}
        {outerCircleItems.map((item, index) => renderItem(item, index, 120))}

        {/* Decorative dots */}
        {[0, 60, 120, 180, 240, 300].map((angle, index) => (
          <div
            key={`dot-${index}`}
            className="absolute w-1.5 h-1.5 rounded-full"
            style={{
              ...getItemStyle(angle, 90),
              backgroundColor: ['#FF6B6B', '#4ECDC4', '#45B7D1', '#96CEB4', '#FFEEAD', '#D4A5A5'][index]
            }}
          />
        ))}
      </div>

      {/* Right side content remains unchanged */}
      <motion.div
        ref={ref}
        className="flex-1"
        initial={{ opacity: 0, x: 50 }}
        animate={isInView ? { opacity: 1, x: 0 } : { opacity: 0, x: 50 }}
        transition={{ duration: 0.5 }}
      >
        <motion.span
          className="inline-block px-4 py-1 text-sm bg-gradient-to-r text-transparent bg-clip-text border border-gradient-to-r from-indigo-500 to-rose-500 rounded-full"
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ duration: 0.5, delay: 0.1 }}
        >
          Team Collaboration
        </motion.span>

        <motion.h2
          className="text-3xl font-semibold mt-4 mb-4"
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          Collaborate seamlessly <br /> with your team in <br /> real-time.
        </motion.h2>

        <motion.p
          className="text-gray-600 mb-8"
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ duration: 0.5, delay: 0.3 }}
        >
          Our platform offers live editing, instant updates, and synchronized teamwork tools, ensuring your team stays
          connected and aligned effortlessly.
        </motion.p>

        <motion.div
          className="space-y-4"
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ duration: 0.5, delay: 0.4 }}
        >
          <motion.div
            className="flex items-center gap-3"
            initial={{ opacity: 0, x: -20 }}
            animate={isInView ? { opacity: 1, x: 0 } : { opacity: 0, x: -20 }}
            transition={{ duration: 0.5, delay: 0.5 }}
          >
            <div className="w-2 h-2 rounded-full bg-purple-600" />
            <span>Provide live chat support during peak hours.</span>
          </motion.div>

          <motion.div
            className="flex items-center gap-3"
            initial={{ opacity: 0, x: -20 }}
            animate={isInView ? { opacity: 1, x: 0 } : { opacity: 0, x: -20 }}
            transition={{ duration: 0.5, delay: 0.6 }}
          >
            <div className="w-2 h-2 rounded-full bg-purple-600" />
            <span>Offer email support with guaranteed response times.</span>
          </motion.div>
        </motion.div>

        <motion.button
          className="mt-8 px-6 py-2 bg-indigo-900 text-white rounded-full hover:bg-indigo-800 transition-colors"
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ duration: 0.5, delay: 0.7 }}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          Start for free
        </motion.button>
      </motion.div>
    </div>
  );
};

export default TeamCollaborationSection;