import { Mail, Phone, MapPin, Clock, Users, MessageCircle } from 'lucide-react';
import { Card, CardContent } from "@/components/ui/card";

const ContactPage = () => {
  return (
    <div className="min-h-screen pt-7 bg-gradient-to-br from-blue-50 via-white to-purple-50">
      {/* Hero Section */}
      <div className="relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
          <div className="text-center relative z-10">
            <h1 className="text-5xl md:text-6xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-purple-600">
              Let's Connect
            </h1>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto leading-relaxed">
              We're here to help you succeed. Reach out through any of our channels below.
            </p>
          </div>
          {/* Decorative elements */}
          <div className="absolute inset-0 overflow-hidden">
            <div className="absolute -top-40 -right-40 w-80 h-80 bg-purple-100 rounded-full opacity-20 blur-3xl"></div>
            <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-blue-100 rounded-full opacity-20 blur-3xl"></div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-24">
        {/* Primary Contact Methods */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-20">
          <ContactCard
            icon={<Mail className="w-8 h-8" />}
            title="Email"
            content="support@example.com"
            subtitle="24/7 Support"
            gradient="from-blue-500 to-blue-600"
          />
          <ContactCard
            icon={<Phone className="w-8 h-8" />}
            title="Phone"
            content="+1 (555) 000-0000"
            subtitle="Mon-Fri, 9am-6pm EST"
            gradient="from-purple-500 to-purple-600"
          />
          <ContactCard
            icon={<MapPin className="w-8 h-8" />}
            title="Office"
            content="123 Innovation Drive"
            subtitle="New York, NY 10001"
            gradient="from-indigo-500 to-indigo-600"
          />
        </div>

        {/* Features Grid */}
        <div className="mb-20">
          <h2 className="text-3xl font-bold text-center mb-12 text-gray-900">
            Why Connect With Us?
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <FeatureCard
              icon={<Clock className="w-6 h-6" />}
              title="Quick Response"
              description="Get responses within 24 hours, guaranteed. Our team is ready to assist you."
            />
            <FeatureCard
              icon={<Users className="w-6 h-6" />}
              title="Dedicated Team"
              description="Work with our experienced team of professionals who care about your success."
            />
            <FeatureCard
              icon={<MessageCircle className="w-6 h-6" />}
              title="Multiple Channels"
              description="Reach us through your preferred communication channel - email, phone, or visit."
            />
          </div>
        </div>

        {/* Office Hours & Location */}
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
          <div className="grid md:grid-cols-2">
            <div className="p-8 md:p-12">
              <h3 className="text-2xl font-bold mb-6">Visit Our Office</h3>
              <div className="space-y-4">
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center">
                    <Clock className="w-6 h-6 text-blue-600" />
                  </div>
                  <div>
                    <h4 className="font-semibold">Business Hours</h4>
                    <p className="text-gray-600">Monday - Friday: 9:00 AM - 6:00 PM</p>
                    <p className="text-gray-600">Saturday: 10:00 AM - 4:00 PM</p>
                  </div>
                </div>
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 rounded-full bg-purple-100 flex items-center justify-center">
                    <MapPin className="w-6 h-6 text-purple-600" />
                  </div>
                  <div>
                    <h4 className="font-semibold">Location</h4>
                    <p className="text-gray-600">123 Innovation Drive</p>
                    <p className="text-gray-600">New York, NY 10001</p>
                  </div>
                </div>
              </div>
            </div>
            <div className="relative h-64 md:h-auto">
              <div className="absolute inset-0 bg-gradient-to-br from-blue-500 to-purple-600 opacity-90"></div>
              <div className="absolute inset-0 flex items-center justify-center text-white p-8">
                <div className="text-center">
                  <h3 className="text-2xl font-bold mb-4">Ready to Get Started?</h3>
                  <p className="mb-6">Reach out to us through any of our channels above.</p>
                  <div className="inline-flex space-x-4">
                    <a href="tel:+15550000000" className="hover:scale-105 transition-transform">
                      <Phone className="w-8 h-8" />
                    </a>
                    <a href="mailto:support@example.com" className="hover:scale-105 transition-transform">
                      <Mail className="w-8 h-8" />
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const ContactCard = ({ icon, title, content, subtitle, gradient }: {
  icon: React.ReactNode;
  title: string;
  content: string;
  subtitle: string;
  gradient: string;
}) => (
  <Card className="transform transition-all duration-300 hover:scale-105hover:shadow-xl">
    <CardContent className="p-8">
      <div className={`w-16 h-16 rounded-xl bg-gradient-to-r ${gradient} flex items-center justify-center mb-6 text-white`}>
        {icon}
      </div>
      <h3 className="text-xl font-bold mb-2">{title}</h3>
      <p className="text-lg text-gray-700 mb-1">{content}</p>
      <p className="text-sm text-gray-500">{subtitle}</p>
    </CardContent>
  </Card>
);

const FeatureCard = ({ icon, title, description }: {
  icon: React.ReactNode;
  title: string;
  description: string;
}) => (
  <Card className="transform transition-all duration-300 hover:shadow-lg">
    <CardContent className="p-6">
      <div className="w-12 h-12 rounded-lg bg-blue-50 flex items-center justify-center mb-4 text-blue-600">
        {icon}
      </div>
      <h3 className="text-lg font-semibold mb-2">{title}</h3>
      <p className="text-gray-600">{description}</p>
    </CardContent>
  </Card>
);

export default ContactPage;