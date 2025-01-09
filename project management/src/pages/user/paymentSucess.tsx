import { Check, ArrowRight, Download, Calendar } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { useNavigate } from 'react-router-dom';

const PaymentSuccess = () => {
  const navigate = useNavigate();
  const today = new Date().toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });

  const nextBilling = new Date();
  nextBilling.setMonth(nextBilling.getMonth() + 1);
  const nextBillingDate = nextBilling.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });

  return (
    <div className="min-h-screen bg-gradient-to-b from-purple-50 to-white dark:from-gray-900 dark:to-gray-800 p-6 flex items-center justify-center">
      {/* Success Card */}
      <Card className="max-w-md w-full bg-white dark:bg-gray-800 shadow-2xl">
        <CardContent className="p-8">
          {/* Success Icon */}
          <div className="mb-8 text-center">
            <div className="h-16 w-16 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center mx-auto mb-4 animate-bounce">
              <Check className="h-8 w-8 text-green-500" />
            </div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
              Payment Successful!
            </h1>
            <p className="text-gray-500 dark:text-gray-400">
              Your premium subscription is now active
            </p>
          </div>

          {/* Payment Details */}
          <div className="space-y-4 mb-8">
            <div className="bg-gray-50 dark:bg-gray-900/50 rounded-lg p-4 space-y-3">
              <div className="flex justify-between">
                <span className="text-gray-600 dark:text-gray-400">Amount paid</span>
                <span className="font-semibold text-gray-900 dark:text-white">$9.99</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600 dark:text-gray-400">Payment date</span>
                <span className="text-gray-900 dark:text-white">{today}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600 dark:text-gray-400">Next billing</span>
                <span className="text-gray-900 dark:text-white">{nextBillingDate}</span>
              </div>
              <div className="pt-3 border-t border-gray-200 dark:border-gray-700">
                <div className="flex justify-between items-center">
                  <span className="text-gray-600 dark:text-gray-400">Storage limit</span>
                  <span className="text-green-500 font-semibold">Unlimited</span>
                </div>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="space-y-3">
            <Button 
              onClick={() => navigate('/dashboard')}
              className="w-full bg-purple-600 hover:bg-purple-700 text-white flex items-center justify-center gap-2"
            >
              Go to Dashboard
              <ArrowRight className="h-4 w-4" />
            </Button>
            
            <div className="flex gap-3">
              <Button 
                variant="outline"
                className="flex-1 border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700 flex items-center justify-center gap-2"
              >
                <Download className="h-4 w-4" />
                Receipt
              </Button>
              <Button 
                variant="outline"
                className="flex-1 border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700 flex items-center justify-center gap-2"
              >
                <Calendar className="h-4 w-4" />
                Manage Plan
              </Button>
            </div>
          </div>

          {/* Support Link */}
          <div className="mt-6 text-center">
            <a 
              href="#" 
              className="text-sm text-purple-600 hover:text-purple-700 dark:text-purple-400 dark:hover:text-purple-300"
            >
              Need help? Contact support
            </a>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default PaymentSuccess;