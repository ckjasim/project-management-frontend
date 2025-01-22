"use client"

import React, { useState } from 'react';
import { motion, useInView } from 'framer-motion';

const testimonials = [
  {
    id: 1,
    name: 'Tom Nguyen',
    role: 'CEO, Techbites',
    image: './2.png',
    content: 'This platform has transformed how we work! Its seamless integration with our existing tools has cut our workload in half, and the intuitive interface makes it easy for everyone on the team to use. Highly recommend!',
    rating: 5.0
  },
  {
    id: 2,
    name: 'Michael Morales',
    role: 'CEO, Techbites',
    image: './1.png',
    content: 'The customer support is top-notch! Whenever we had questions, their team responded quickly with clear solutions. The platform itself is reliable, with features that perfectly meet our needs.',
    rating: 5.0
  },
  {
    id: 3,
    name: 'Rachel Kim',
    role: 'CTO, Megabytes',
    image: './2.png',
    content: 'Since adopting this SaaS solution, our productivity has soared. The automation features save us hours every week, and the real-time analytics help us make informed decisions faster.',
    rating: 5.0
  }
];

const TestimonialsSection = () => {
  const [activeIndex, setActiveIndex] = useState(0);
  const ref = React.useRef(null);
  const isInView = useInView(ref, { once: true, amount: 0.3 });

  return (
    <motion.div 
      ref={ref}
      className="max-w-6xl mx-auto px-8 py-20 rounded-lg bg-pink-50"
      initial={{ opacity: 0 }}
      animate={isInView ? { opacity: 1 } : { opacity: 0 }}
      transition={{ duration: 0.8 }}
    >
      <motion.div 
        className="text-center mb-16"
        initial={{ opacity: 0, y: -50 }}
        animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: -50 }}
        transition={{ duration: 0.8, delay: 0.2 }}
      >
        <h2 className="text-[2.5rem] font-semibold text-[#1a1a1a] leading-tight">
          Testimonials from our
          <br />
          <span className="text-[#6b7280] font-normal">satisfied customers</span>
        </h2>
      </motion.div>

      <div className="relative">
        <motion.div 
          className="flex gap-6"
          initial={{ opacity: 0, x: -50 }}
          animate={isInView ? { opacity: 1, x: 0 } : { opacity: 0, x: -50 }}
          transition={{ duration: 0.8, delay: 0.4 }}
        >
          {testimonials.map((testimonial, index) => (
            <motion.div
              key={testimonial.id}
              className="w-1/3 bg-white rounded-2xl p-6 shadow-[0_2px_8px_rgba(0,0,0,0.08)]"
              initial={{ opacity: 0, y: 50 }}
              animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 50 }}
              transition={{ duration: 0.8, delay: 0.4 + index * 0.1 }}
            >
              <div className="flex items-center mb-6">
                <img
                  src={testimonial.image || "/placeholder.svg"}
                  alt={testimonial.name}
                  className="w-12 h-12 rounded-full mr-4"
                />
                <div>
                  <h3 className="font-semibold text-lg text-[#1a1a1a]">
                    {testimonial.name}
                  </h3>
                  <p className="text-[#6b7280] text-sm">{testimonial.role}</p>
                </div>
              </div>
              <p className="text-[#374151] text-sm leading-relaxed mb-8">
                {testimonial.content}
              </p>
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <div className="flex mr-2">
                    {[...Array(5)].map((_, i) => (
                      <svg
                        key={i}
                        className="w-5 h-5 text-[#fbbf24]"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                      </svg>
                    ))}
                  </div>
                  <span className="text-[#6b7280] text-sm">
                    {testimonial.rating.toFixed(1)} Review
                  </span>
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>

        <motion.div 
          className="flex justify-center mt-12 space-x-2"
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ duration: 0.8, delay: 0.6 }}
        >
          {testimonials.map((_, index) => (
            <button
              key={index}
              onClick={() => setActiveIndex(index)}
              className={`w-2.5 h-2.5 rounded-full transition-colors duration-200 ${
                index === activeIndex ? 'bg-[#4f46e5]' : 'bg-[#e5e7eb]'
              }`}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </motion.div>
      </div>
    </motion.div>
  );
};

export default TestimonialsSection;
