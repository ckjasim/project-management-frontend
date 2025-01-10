import { useState } from 'react';
import { Users, Target, Award, ArrowRight } from 'lucide-react';

const AboutUs = () => {
  const [hoveredCard, setHoveredCard] = useState<any>(null);

  const stats = [
    { number: '10+', label: 'Years Experience', icon: Users },
    { number: '250+', label: 'Projects Completed', icon: Target },
    { number: '15+', label: 'Industry Awards', icon: Award }
  ];

  const teamMembers = [
    {
      name: 'Sarah Johnson',
      role: 'CEO & Founder',
      bio: 'Visionary leader with 15+ years of industry experience'
    },
    {
      name: 'Michael Chen',
      role: 'Creative Director',
      bio: 'Award-winning designer pushing creative boundaries'
    },
    {
      name: 'Lisa Rodriguez',
      role: 'Tech Lead',
      bio: 'Innovation expert specializing in emerging technologies'
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b pt-12 from-gray-50 to-white">
      {/* Hero Section */}
      <section className="px-4 py-20 text-center">
        <h1 className="text-5xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-purple-600">
          We Create Digital Excellence
        </h1>
        <p className="text-xl text-gray-600 max-w-2xl mx-auto">
          Transforming ideas into exceptional digital experiences through innovation, dedication, and expertise.
        </p>
      </section>

      {/* Stats Section */}
      <section className="px-4 py-16 bg-white">
        <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8">
          {stats.map((stat, index) => {
            const Icon = stat.icon;
            return (
              <div
                key={index}
                className="p-8 rounded-xl bg-white shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1"
              >
                <Icon className="w-12 h-12 text-blue-600 mb-4" />
                <h3 className="text-4xl font-bold text-gray-800 mb-2">{stat.number}</h3>
                <p className="text-gray-600">{stat.label}</p>
              </div>
            );
          })}
        </div>
      </section>

      {/* Mission Section */}
      <section className="px-4 py-16 bg-gradient-to-r from-blue-50 to-purple-50">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl font-bold mb-8">Our Mission</h2>
          <p className="text-xl text-gray-700 leading-relaxed">
            To empower businesses through innovative digital solutions that drive growth, 
            enhance user experience, and create lasting impact in an ever-evolving digital landscape.
          </p>
        </div>
      </section>

      {/* Team Section */}
      <section className="px-4 py-16">
        <h2 className="text-3xl font-bold text-center mb-12">Meet Our Team</h2>
        <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8">
          {teamMembers.map((member, index) => (
            <div
              key={index}
              className="relative p-6 rounded-xl bg-white shadow-lg"
              onMouseEnter={() => setHoveredCard(index)}
              onMouseLeave={() => setHoveredCard(null)}
            >
              <div className="w-24 h-24 mx-auto mb-4 rounded-full bg-gradient-to-r from-blue-400 to-purple-400" />
              <h3 className="text-xl font-bold text-center mb-2">{member.name}</h3>
              <p className="text-blue-600 text-center mb-4">{member.role}</p>
              <p className="text-gray-600 text-center">{member.bio}</p>
              
              <div className={`absolute inset-0 bg-gradient-to-r from-blue-600/90 to-purple-600/90 rounded-xl flex items-center justify-center opacity-0 transition-opacity duration-300 ${hoveredCard === index ? 'opacity-100' : ''}`}>
                <div className="text-white text-center p-6">
                  <p className="mb-4">{member.bio}</p>
                  <button className="flex items-center justify-center space-x-2 mx-auto text-white border border-white rounded-full px-4 py-2 hover:bg-white hover:text-blue-600 transition-colors duration-300">
                    <span>Learn More</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Contact CTA */}
      <section className="px-4 py-20 bg-gradient-to-r from-blue-600 to-purple-600 text-white">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl font-bold mb-6">Ready to Start Your Project?</h2>
          <p className="text-xl mb-8">Let's create something amazing together</p>
          <button className="bg-white text-blue-600 px-8 py-3 rounded-full font-semibold hover:bg-gray-100 transition-colors duration-300">
            Get in Touch
          </button>
        </div>
      </section>
    </div>
  );
};

export default AboutUs;
