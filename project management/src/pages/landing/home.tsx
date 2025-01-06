import React, { useState, useEffect } from 'react';
import {
  Users,
  BarChart2,
  Clock,
  Settings,
  Star,
  CheckCircle,
  ArrowRight,
  ChevronRight,
  Folder,
  FileText,
  BarChart3,
} from 'lucide-react';
import { Card, CardHeader, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import Hero from '@/components/Home/hero';
import Trustedby from '@/components/Home/trustedby';
import First from '@/components/Home/first';
import TeamCollaborationSection from '@/components/Home/teamCollaboration';
import IntegrationSection from '@/components/Home/integration';
import DetailedReportsSection from '@/components/Home/report';
import UnlockPerksSection from '@/components/Home/unlock';
import FeaturesSection from '@/components/Home/features';
import TestimonialsSection from '@/components/Home/testimonial';
import Footer from '@/components/Home/footer';

const EnhancedLandingPage = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [activeFeature, setActiveFeature] = useState(0);

  useEffect(() => {
    setIsVisible(true);
    const timer = setInterval(() => {
      setActiveFeature((prev) => (prev + 1) % 4);
    }, 3000);
    return () => clearInterval(timer);
  }, []);

  const features = [
    {
      icon: <Users className="w-8 h-8" />,
      title: 'Collaborative Teams',
      description:
        'Build and manage high-performing teams with our advanced collaboration tools',
    },
    {
      icon: <BarChart2 className="w-8 h-8" />,
      title: 'Real-time Analytics',
      description:
        'Track performance metrics and make data-driven decisions with interactive dashboards',
    },
    {
      icon: <Clock className="w-8 h-8" />,
      title: 'Time Management',
      description:
        'Optimize productivity with intelligent time tracking and scheduling features',
    },
    {
      icon: <Settings className="w-8 h-8" />,
      title: 'Customizable Workflow',
      description:
        "Create personalized workflows that adapt to your team's unique needs",
    },
  ];

  const testimonials = [
    {
      name: 'Sarah Johnson',
      role: 'Product Manager',
      company: 'TechCorp',
      content:
        'This platform has transformed how our team collaborates. The productivity gains are remarkable.',
      rating: 5,
    },
    {
      name: 'Michael Chen',
      role: 'Team Lead',
      company: 'InnovateLabs',
      content:
        'The analytics features provide invaluable insights for our decision-making process.',
      rating: 5,
    },
  ];

  const pricingPlans = [
    {
      name: 'Starter',
      price: '0',
      period: 'month',
      features: [
        'Up to 5 team members',
        'Basic analytics',
        '2 projects',
        'Email support',
      ],
      recommended: false,
    },
    {
      name: 'Professional',
      price: '49',
      period: 'month',
      features: [
        'Up to 20 team members',
        'Advanced analytics',
        'Unlimited projects',
        'Priority support',
        'Custom workflows',
        'API access',
      ],
      recommended: true,
    },
    {
      name: 'Enterprise',
      price: '499',
      period: 'month',
      features: [
        'Unlimited team members',
        'Custom analytics',
        'Unlimited projects',
        '24/7 support',
        'Custom integrations',
        'Dedicated account manager',
      ],
      recommended: false,
    },
  ];

  const teamMembers = [
    { id: 1, color: '#FFD700', top: '20%', left: '10%' },
    { id: 2, color: '#87CEEB', top: '10%', left: '50%' },
    { id: 3, color: '#FF69B4', top: '20%', left: '90%' },
    { id: 4, color: '#98FB98', top: '50%', left: '95%' },
    { id: 5, color: '#DDA0DD', top: '80%', left: '90%' },
    { id: 6, color: '#F0E68C', top: '90%', left: '50%' },
    { id: 7, color: '#87CEFA', top: '80%', left: '10%' },
    { id: 8, color: '#FFB6C1', top: '50%', left: '5%' },
  ];

  const tools = [
    { id: 'excel', icon: '📊', color: '#217346', position: 'top-8 right-1/4' },
    { id: 'slack', icon: '💬', color: '#4A154B', position: 'top-1/4 right-8' },
    { id: 'dropbox', icon: '📦', color: '#0061FF', position: 'left-8 top-1/2' },
    {
      id: 'shopify',
      icon: '🛍️',
      color: '#96bf48',
      position: 'bottom-16 left-1/4',
    },
    {
      id: 'google-drive',
      icon: '📝',
      color: '#FBBC05',
      position: 'bottom-8 right-16',
    },
    { id: 'teams', icon: '👥', color: '#6264A7', position: 'top-1/4 right-16' },
  ];

  return (
    <div className="min-h-screen bg-white">
      <Hero />
      <Trustedby />
      <First />
      <TeamCollaborationSection />
      <IntegrationSection />
<DetailedReportsSection/>
<UnlockPerksSection/>
<FeaturesSection/>
<TestimonialsSection/>
<Footer/>
      {/* Hero Section */}
      <div
        className={`pt-32 pb-20 px-4 transition-opacity duration-1000 ${
          isVisible ? 'opacity-100' : 'opacity-0'
        }`}
      >
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <h1 className="text-5xl md:text-6xl font-bold leading-tight mb-6">
                Enhance Your
                <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-purple-600">
                  {' '}
                  Work & Team
                </span>
              </h1>
              <p className="text-xl text-gray-600 mb-8">
                Empower your team with our comprehensive workspace solution.
                Boost productivity and streamline collaboration.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <button className="px-8 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center gap-2">
                  Start Free Trial <ChevronRight className="w-4 h-4" />
                </button>
                <button className="px-8 py-3 border border-gray-300 rounded-lg hover:border-blue-600 transition-colors flex items-center justify-center gap-2">
                  Watch Demo
                </button>
              </div>
              <div className="mt-8 flex items-center gap-4">
                <div className="flex -space-x-2">
                  {[...Array(4)].map((_, i) => (
                    <div
                      key={i}
                      className="w-8 h-8 rounded-full bg-gray-200 border-2 border-white"
                    />
                  ))}
                </div>
                <p className="text-sm text-gray-600">
                  Join over <span className="font-semibold">25,000</span> teams
                  worldwide
                </p>
              </div>
            </div>
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-purple-500 rounded-3xl opacity-10 blur-2xl" />
              <div className="relative bg-white p-8 rounded-3xl shadow-xl">
                <img
                  src="/api/placeholder/600/400"
                  alt="Dashboard Preview"
                  className="rounded-xl shadow-lg"
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4">
              Features that empower your team
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Everything you need to manage projects, automate workflows, and
              scale your business
            </p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <Card
                key={index}
                className={`transition-all duration-300 hover:shadow-xl cursor-pointer ${
                  activeFeature === index ? 'border-blue-600 shadow-xl' : ''
                }`}
                onClick={() => setActiveFeature(index)}
              >
                <CardContent className="p-6">
                  <div
                    className={`text-blue-600 mb-4 transform transition-transform duration-300 ${
                      activeFeature === index ? 'scale-110' : ''
                    }`}
                  >
                    {feature.icon}
                  </div>
                  <h3 className="text-xl font-semibold mb-2">
                    {feature.title}
                  </h3>
                  <p className="text-gray-600">{feature.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>

      {/* Testimonials */}
      <div className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4">
          <h2 className="text-4xl font-bold text-center mb-16">
            Trusted by industry leaders
          </h2>
          <div className="grid md:grid-cols-2 gap-8">
            {testimonials.map((testimonial, index) => (
              <Card key={index} className="bg-white">
                <CardContent className="p-8">
                  <div className="flex mb-4">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <Star
                        key={i}
                        className="w-5 h-5 text-yellow-400 fill-current"
                      />
                    ))}
                  </div>
                  <p className="text-lg mb-6">{testimonial.content}</p>
                  <div className="flex items-center">
                    <div className="mr-4">
                      <div className="w-12 h-12 bg-gray-200 rounded-full" />
                    </div>
                    <div>
                      <div className="font-semibold">{testimonial.name}</div>
                      <div className="text-gray-600">
                        {testimonial.role}, {testimonial.company}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>

      {/* Pricing Section */}
      <div className="py-20">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4">
              Choose the plan that's right for you
            </h2>
            <p className="text-xl text-gray-600">
              Start free and scale as your team grows
            </p>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            {pricingPlans.map((plan, index) => (
              <Card
                key={index}
                className={`relative ${
                  plan.recommended ? 'border-blue-600 shadow-xl' : ''
                }`}
              >
                {plan.recommended && (
                  <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                    <span className="bg-blue-600 text-white px-4 py-1 rounded-full text-sm">
                      Recommended
                    </span>
                  </div>
                )}
                <CardHeader>
                  <h3 className="text-2xl font-bold">{plan.name}</h3>
                  <div className="mt-4">
                    <span className="text-4xl font-bold">${plan.price}</span>
                    <span className="text-gray-600">/{plan.period}</span>
                  </div>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-4">
                    {plan.features.map((feature, i) => (
                      <li key={i} className="flex items-center gap-2">
                        <CheckCircle className="w-5 h-5 text-blue-600" />
                        {feature}
                      </li>
                    ))}
                  </ul>
                  <button
                    className={`w-full mt-8 px-6 py-3 rounded-lg transition-colors ${
                      plan.recommended
                        ? 'bg-blue-600 text-white hover:bg-blue-700'
                        : 'border border-gray-300 hover:border-blue-600'
                    }`}
                  >
                    Get Started
                  </button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="bg-blue-600 py-20">
        <div className="max-w-4xl mx-auto text-center px-4">
          <h2 className="text-4xl font-bold text-white mb-6">
            Ready to transform your workflow?
          </h2>
          <p className="text-xl text-blue-100 mb-8">
            Join thousands of teams already using our platform
          </p>
          <button className="px-8 py-3 bg-white text-blue-600 rounded-lg hover:bg-blue-50 transition-colors">
            Start Free Trial
          </button>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-gray-900 text-gray-400 py-12">
        <div className="max-w-7xl mx-auto px-4 grid grid-cols-2 md:grid-cols-4 gap-8">
          <div>
            <h4 className="text-white font-semibold mb-4">Product</h4>
            <ul className="space-y-2">
              <li className="hover:text-white transition-colors cursor-pointer">
                Features
              </li>
              <li className="hover:text-white transition-colors cursor-pointer">
                Solutions
              </li>
              <li className="hover:text-white transition-colors cursor-pointer">
                Pricing
              </li>
            </ul>
          </div>
          <div>
            <h4 className="text-white font-semibold mb-4">Company</h4>
            <ul className="space-y-2">
              <li className="hover:text-white transition-colors cursor-pointer">
                About
              </li>
              <li className="hover:text-white transition-colors cursor-pointer">
                Careers
              </li>
              <li className="hover:text-white transition-colors cursor-pointer">
                Blog
              </li>
            </ul>
          </div>
          <div>
            <h4 className="text-white font-semibold mb-4">Resources</h4>
            <ul className="space-y-2">
              <li className="hover:text-white transition-colors cursor-pointer">
                Documentation
              </li>
              <li className="hover:text-white transition-colors cursor-pointer">
                Help Center
              </li>
              <li className="hover:text-white transition-colors cursor-pointer">
                API
              </li>
            </ul>
          </div>
          <div>
            <h4 className="text-white font-semibold mb-4">Connect</h4>
            <ul className="space-y-2">
              <li className="hover:text-white transition-colors cursor-pointer">
                Twitter
              </li>
              <li className="hover:text-white transition-colors cursor-pointer">
                LinkedIn
              </li>
              <li className="hover:text-white transition-colors cursor-pointer">
                GitHub
              </li>
            </ul>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default EnhancedLandingPage;
