import React from 'react';
import { Check, Cloud, HardDrive, Shield, Zap, Lock, Gift } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from '@/components/ui/card';
import { getPremiumApi } from '@/services/api/api';
import { loadStripe } from '@stripe/stripe-js';
const PremiumPage = () => {
  const features = [
    {
      icon: <Cloud className="h-5 w-5 text-blue-400" />,
      title: 'Google Drive Integration',
      description: 'Seamlessly sync and store your files',
    },
    {
      icon: <HardDrive className="h-5 w-5 text-purple-400" />,
      title: 'Unlimited Storage',
      description: 'Never worry about storage limits again',
    },
    {
      icon: <Zap className="h-5 w-5 text-yellow-400" />,
      title: 'Large File Uploads',
      description: 'Upload files up to 10GB in size',
    },
    {
      icon: <Lock className="h-5 w-5 text-green-400" />,
      title: 'Advanced Security',
      description: 'Enterprise-grade file protection',
    },
  ];
  const handlePremium =async ()=>{
    console.log('premiumm')
   const {sessionId}= await getPremiumApi()
console.log(sessionId,'lllllllllllllllllllllllll')
    const stripe = await loadStripe(import.meta.env.VITE_STRIPE_PUBLISH_KEY); 
    if(stripe){

      const { error } = await stripe.redirectToCheckout({ sessionId });
      if (error) {
        console.error('Error redirecting to checkout:', error);
      }
    }


  }

  return (
  <div className='flex items-center justify-center bg-slate-50'> 
     {/* <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black text-white p-8"> */}
    <div className="max-w-7xl bg-gradient-to-br from-gray-900 via-gray-800 to-black text-white p-8 my-8 rounded-2xl">
      {/* Animated background overlay */}
      {/* <div className="absolute inset-0 bg-[linear-gradient(to_right,#4f4f4f2e_1px,transparent_1px),linear-gradient(to_bottom,#4f4f4f2e_1px,transparent_1px)] bg-[size:14px_24px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)]" /> */}
      <div className=" inset-0 bg-[linear-gradient(to_right,#4f4f4f2e_1px,transparent_1px),linear-gradient(to_bottom,#4f4f4f2e_1px,transparent_1px)] bg-[size:14px_24px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)]" />

      <div className="max-w-5xl mx-auto relative">
        {/* Header Section */}
        <div className="text-center mb-16 space-y-4">
          <div className="inline-block animate-bounce-slow">
            <Gift className="h-12 w-12 text-lime-400 mx-auto mb-4" />
          </div>
          <h1 className="text-5xl font-bold bg-gradient-to-r from-lime-300 via-lime-200 to-green-300 text-transparent bg-clip-text">
            Unlock Premium Power
          </h1>
          <p className="text-xl text-gray-300 max-w-2xl mx-auto">
            Transform your workspace with advanced storage and seamless
            integration
          </p>
        </div>

        {/* Main Content Grid */}
        <div className="grid md:grid-cols-2 gap-8 items-start">
          {/* Features Card */}
          <Card className="bg-gray-900/50 border-0 backdrop-blur-xl ring-1 ring-gray-800">
            <CardHeader className="space-y-6 pb-8">
              <div className="flex justify-between items-center">
                <CardTitle className="text-2xl text-white">
                  Premium Features
                </CardTitle>
                <Shield className="h-6 w-6 text-lime-400" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                {features.map((feature, index) => (
                  <div
                    key={index}
                    className="p-4 rounded-xl bg-gray-800/50 hover:bg-gray-800/80 transition-all duration-300 hover:scale-105"
                  >
                    <div className="mb-2">{feature.icon}</div>
                    <h3 className="font-medium text-white mb-1">
                      {feature.title}
                    </h3>
                    <p className="text-sm text-gray-400">
                      {feature.description}
                    </p>
                  </div>
                ))}
              </div>
            </CardHeader>
          </Card>

          {/* Pricing Card */}
          <Card className="bg-gradient-to-br from-indigo-950/90 to-purple-900/90 border-0 backdrop-blur-xl ring-1 ring-purple-500/30">
            <CardHeader>
              <CardTitle className="text-3xl text-white">
                <span className="bg-gradient-to-r from-violet-200 via-purple-200 to-indigo-200 text-transparent bg-clip-text">
                  Premium Plan
                </span>
              </CardTitle>
              <CardDescription className="text-purple-200/80">
                All features included
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Price Tag */}
              <div className="text-center space-y-2">
                <div className="flex items-center justify-center">
                  <span className="text-5xl font-bold bg-gradient-to-r from-violet-300 via-purple-200 to-indigo-300 text-transparent bg-clip-text">
                    $9.99
                  </span>
                  <span className="text-purple-200/70 ml-2">/month</span>
                </div>
                <p className="text-sm text-purple-200/60">Billed monthly</p>
              </div>

              {/* Storage Meter */}
              <div className="space-y-4">
                <div className="h-2 bg-indigo-950/50 rounded-full overflow-hidden backdrop-blur-xl">
                  <div className="h-full w-3/4 bg-gradient-to-r from-violet-400 via-purple-400 to-indigo-400 rounded-full animate-pulse" />
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-purple-200/60">1TB Storage</span>
                  <span className="text-violet-300">Unlimited</span>
                </div>
              </div>

              {/* CTA Button */}
              <Button onClick={handlePremium} className="w-full bg-gradient-to-r from-violet-500 via-purple-500 to-indigo-500 hover:from-violet-600 hover:via-purple-600 hover:to-indigo-600 text-white font-semibold py-6 text-lg shadow-xl shadow-purple-500/20 hover:shadow-purple-500/40 transition-all duration-300 border border-purple-400/20 hover:border-purple-400/40">
                Upgrade Now
              </Button>
            </CardContent>
            <CardFooter>
              <div className="w-full space-y-4">
                <div className="flex items-center gap-2 justify-center">
                  <Lock className="h-4 w-4 text-purple-400" />
                  <span className="text-sm text-purple-200/60">
                    30-day money-back guarantee
                  </span>
                </div>
              </div>
            </CardFooter>
          </Card>
        </div>

        {/* Bottom Testimonial/Trust Section */}
        <div className="mt-16 text-center space-y-4">
          <div className="flex justify-center gap-8">
            {['Google', 'Microsoft', 'Slack', 'Dropbox'].map((partner) => (
              <div key={partner} className="text-gray-500 text-sm font-medium">
                {partner}
              </div>
            ))}
          </div>
          <p className="text-sm text-gray-400">
            Trusted by over 10,000+ teams worldwide
          </p>
        </div>
      </div>
    </div>
    </div>
  );
};

export default PremiumPage;
