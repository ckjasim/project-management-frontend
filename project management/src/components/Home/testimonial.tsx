import React, { useState } from 'react';

const testimonials = [
  {
    id: 1,
    name: 'Tom Nguyen',
    role: 'CEO, Techbites',
    image: '/api/placeholder/48/48',
    content: 'This platform has transformed how we work! Its seamless integration with our existing tools has cut our workload in half, and the intuitive interface makes it easy for everyone on the team to use. Highly recommend!',
    rating: 5.0
  },
  {
    id: 2,
    name: 'Michael Morales',
    role: 'CEO, Techbites',
    image: '/api/placeholder/48/48',
    content: 'The customer support is top-notch! Whenever we had questions, their team responded quickly with clear solutions. The platform itself is reliable, with features that perfectly meet our needs.',
    rating: 5.0
  },
  {
    id: 3,
    name: 'Rachel Kim',
    role: 'CTO, Megabytes',
    image: '/api/placeholder/48/48',
    content: 'Since adopting this SaaS solution, our productivity has soared. The automation features save us hours every week, and the real-time analytics help us make informed decisions faster.',
    rating: 5.0
  }
];

const TestimonialsSection = () => {
  const [activeIndex, setActiveIndex] = useState(0);

  return (
    <div className="max-w-7xl mx-auto px-4 py-20 rounded-lg bg-pink-50">
      <div className="text-center mb-16">
        <h2 className="text-[2.5rem] font-bold text-[#1a1a1a] leading-tight">
          Testimonials from our
          <br />
          <span className="text-[#6b7280] font-normal">satisfied customers</span>
        </h2>
      </div>

      <div className="relative">
        <div className="flex gap-6">
          {testimonials.map((testimonial, idx) => (
            <div
              key={testimonial.id}
              className="w-1/3 bg-white rounded-2xl p-8 shadow-[0_2px_8px_rgba(0,0,0,0.08)]"
            >
              <div className="flex items-center mb-6">
                <img
                  src={testimonial.image}
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
              <p className="text-[#374151] text-base leading-relaxed mb-8">
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
                    {testimonial.rating.toFixed(1)} Review from
                  </span>
                </div>
                <img 
                  src="/api/placeholder/80/20"
                  alt="Trustpilot"
                  className="h-5"
                />
              </div>
            </div>
          ))}
        </div>

        <div className="flex justify-center mt-12 space-x-2">
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
        </div>
      </div>
    </div>
  );
};

export default TestimonialsSection;