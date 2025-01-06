import React from 'react';
import { Headphones, Shield, Layout, Share2, DollarSign, Maximize } from 'lucide-react';

const FeatureCard = ({ icon: Icon, title, description, bgColor, iconColor, learnMore = true }) => (
  <div className={`p-8 rounded-2xl ${bgColor}`}>
    <div className={`w-12 h-12 rounded-full border-2 ${iconColor} flex items-center justify-center mb-6`}>
      <Icon className={iconColor.replace('border-', 'text-')} size={24} />
    </div>
    
    <h3 className="text-xl font-semibold mb-4">{title}</h3>
    <p className="text-gray-600 mb-4 leading-relaxed">{description}</p>
    
    {learnMore && (
      <button className="text-purple-600 font-medium inline-flex items-center group">
        Learn more 
        <span className="ml-2 group-hover:translate-x-1 transition-transform">→</span>
      </button>
    )}
  </div>
);

const FeaturesSection = () => {
  const features = [
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
    <div className="max-w-6xl mx-auto px-6 py-16">
      <div className="text-center mb-16">
        <h2 className="text-4xl font-bold mb-4">
          Everything you will <span className="text-gray-400">ever need</span>
        </h2>
        <p className="text-gray-600 max-w-2xl mx-auto">
          Decide if you want to throw it away or retain it and continue with your 
          workflow unhindered. Need short bursts of productivity?
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {features.map((feature, index) => (
          <FeatureCard
            key={index}
            icon={feature.icon}
            title={feature.title}
            description={feature.description}
            bgColor={feature.bgColor}
            iconColor={feature.iconColor}
          />
        ))}
      </div>
    </div>
  );
};

export default FeaturesSection;