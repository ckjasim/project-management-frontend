"use client"

import React from 'react';
import { Headphones, Shield, Layout, Share2, DollarSign, Maximize, type LucideIcon } from 'lucide-react';
import { motion, useInView } from 'framer-motion';

interface Feature {
  icon: LucideIcon;
  title: string;
  description: string;
  bgColor: string;
  iconColor: string;
}

interface FeatureCardProps {
  icon: LucideIcon;
  title: string;
  description: string;
  bgColor: string;
  iconColor: string;
  learnMore?: boolean;
  index: number;
}

const FeatureCard: React.FC<FeatureCardProps> = ({ icon: Icon, title, description, bgColor, iconColor, learnMore = true, index }) => {
  const ref = React.useRef(null);
  const isInView = useInView(ref, { once: true, amount: 0.3 });

  return (
    <motion.div 
      ref={ref}
      className={`p-6 rounded-2xl ${bgColor}`}
      initial={{ opacity: 0, y: 50 }}
      animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 50 }}
      transition={{ duration: 0.8, delay: 0.2 + index * 0.1 }}
    >
      <div className={`w-10 h-10 rounded-full border-2 ${iconColor} flex items-center justify-center mb-3`}>
        <Icon className={iconColor.replace('border-', 'text-')} size={24} />
      </div>
      
      <h3 className="text-lg font-semibold mb-3">{title}</h3>
      <p className="text-gray-600 mb-4 text-sm leading-relaxed">{description}</p>
      
      {learnMore && (
        <motion.button 
          className="text-purple-600 font-medium inline-flex items-center group"
          whileHover={{ x: 5 }}
          transition={{ type: "spring", stiffness: 400, damping: 10 }}
        >
          Learn more 
          <span className="ml-2 group-hover:translate-x-1 transition-transform">→</span>
        </motion.button>
      )}
    </motion.div>
  );
};

const FeaturesSection = () => {
  const ref = React.useRef(null);
  const isInView = useInView(ref, { once: true, amount: 0.3 });

  const features: Feature[] = [
    {
      icon: Headphones,
      title: "24/7 Support",
      description: "Get round-the-clock assistance from our expert team to ensure your business runs smoothly anytime, anywhere.",
      bgColor: "bg-blue-50",
      iconColor: "border-blue-400"
    },
    {
      icon: Shield,
      title: "Secure Data",
      description: "Protect your data with top-tier security measures. Our platform uses advanced encryption and industry-leading protocols to ensure your information is always safe and secure.",
      bgColor: "bg-orange-50",
      iconColor: "border-orange-400"
    },
    {
      icon: Layout,
      title: "User-friendly Interface",
      description: "Our user-friendly interface makes it easy for anyone to get started, without the need for extensive training. Navigate effortlessly and access key features with just a few clicks, ensuring a smooth experience for all users.",
      bgColor: "bg-green-50",
      iconColor: "border-green-400"
    },
    {
      icon: Share2,
      title: "Customisable Workflows",
      description: "Create workflows that fit your unique needs. Our platform lets you customise every step, automate tasks, and ensure your team stays aligned and productive.",
      bgColor: "bg-orange-50",
      iconColor: "border-orange-400"
    },
    {
      icon: DollarSign,
      title: "Affordable Pricing",
      description: "Get access to powerful features at a price that fits your budget. Our flexible pricing plans ensure you only pay for what you need, making it easy to scale as your business grows.",
      bgColor: "bg-green-50",
      iconColor: "border-green-400"
    },
    {
      icon: Maximize,
      title: "Scalable Solutions",
      description: "Our scalable solutions grow with your business, providing the flexibility to adapt to changing needs and drive long-term success. Whether you're a startup or an established enterprise, we offer the tools to scale efficiently and effectively.",
      bgColor: "bg-blue-50",
      iconColor: "border-blue-400"
    }
  ];

  return (
    <motion.div 
      ref={ref}
      className="max-w-5xl mx-auto px-6 py-16"
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
        <h2 className="text-4xl font-semibold mb-4">
          Everything you will <span className="text-gray-400">ever need</span>
        </h2>
        <p className="text-gray-600 max-w-2xl mx-auto">
          Decide if you want to throw it away or retain it and continue with your 
          workflow unhindered. Need short bursts of productivity?
        </p>
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {features.map((feature, index) => (
          <FeatureCard
            key={index}
            icon={feature.icon}
            title={feature.title}
            description={feature.description}
            bgColor={feature.bgColor}
            iconColor={feature.iconColor}
            index={index}
          />
        ))}
      </div>
    </motion.div>
  );
};

export default FeaturesSection;
