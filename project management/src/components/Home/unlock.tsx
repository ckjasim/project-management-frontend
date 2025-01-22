"use client"

import React from 'react';
import { motion, useInView } from 'framer-motion';

const UnlockPerksSection = () => {
  const ref = React.useRef(null);
  const isInView = useInView(ref, { once: true, amount: 0.3 });

  return (
    <motion.div 
      ref={ref}
      className="max-w-5xl mx-auto px-6 py-16"
      initial={{ opacity: 0 }}
      animate={isInView ? { opacity: 1 } : { opacity: 0 }}
      transition={{ duration: 0.8 }}
    >
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Left column */}
        <motion.div
          initial={{ opacity: 0, x: -50 }}
          animate={isInView ? { opacity: 1, x: 0 } : { opacity: 0, x: -50 }}
          transition={{ duration: 0.8, delay: 0.2 }}
        >
          <h2 className="text-4xl font-bold leading-tight">
            Unlock exclusive <br /> perks to{' '}
            <span className="text-gray-400">supercharge <br /> your workflow.</span>
          </h2>
        </motion.div>
        
        {/* Right column */}
        <motion.div
          initial={{ opacity: 0, x: 50 }}
          animate={isInView ? { opacity: 1, x: 0 } : { opacity: 0, x: 50 }}
          transition={{ duration: 0.8, delay: 0.4 }}
        >
          <p className="text-gray-600 text-lg font-semibold leading-relaxed">
            Discover a suite of benefits designed to simplify your <br />project management. 
            From advanced tools to <br /> seamless collaboration, we're here to help you stay <br />
            organized, save time, and achieve your goals faster.
          </p>
        </motion.div>
      </div>

      {/* Image section */}
      <motion.div 
        className="mt-12 rounded-2xl overflow-hidden bg-gray-100"
        initial={{ opacity: 0, y: 50 }}
        animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 50 }}
        transition={{ duration: 0.8, delay: 0.6 }}
      >
        <img
          src="./5.jpg"
          alt="Students collaborating"
          className="w-full h-96 object-cover"
        />
      </motion.div>
    </motion.div>
  );
};

export default UnlockPerksSection;
