import { XCircle, ArrowRight, RefreshCcw, HelpCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
// import { Alert, AlertDescription } from '@/components/ui/alert';
import { useNavigate } from 'react-router-dom';

const PaymentFailure = () => {
  const navigate = useNavigate();
  
  const handleRetry = () => {
    navigate('/premium'); // Navigate back to payment page
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-red-50 to-white dark:from-gray-900 dark:to-gray-800 p-6 flex items-center justify-center">
      <Card className="max-w-md w-full bg-white dark:bg-gray-800 shadow-2xl">
        <CardContent className="p-8">
          {/* Error Icon */}
          <div className="mb-8 text-center">
            <div className="h-16 w-16 bg-red-100 dark:bg-red-900/30 rounded-full flex items-center justify-center mx-auto mb-4 animate-pulse">
              <XCircle className="h-8 w-8 text-red-500" />
            </div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
              Payment Failed
            </h1>
            <p className="text-gray-500 dark:text-gray-400">
              We couldn't process your payment
            </p>
          </div>

          {/* Error Details
          <Alert className="mb-6 border-red-200 bg-red-50 dark:bg-red-900/20 dark:border-red-900/50">
            <AlertCircle className="h-4 w-4 text-red-500" />
            <AlertDescription className="text-red-800 dark:text-red-200 ml-2">
              Your card was declined. Please check your card details or try a different payment method.
            </AlertDescription>
          </Alert> */}

          {/* Common Issues */}
          <div className="mb-8 space-y-3">
            <h2 className="text-sm font-medium text-gray-700 dark:text-gray-300">This might be due to:</h2>
            <ul className="text-sm text-gray-600 dark:text-gray-400 space-y-2">
              <li className="flex items-center gap-2">
                <div className="h-1.5 w-1.5 bg-red-400 rounded-full"></div>
                Insufficient funds
              </li>
              <li className="flex items-center gap-2">
                <div className="h-1.5 w-1.5 bg-red-400 rounded-full"></div>
                Incorrect card information
              </li>
              <li className="flex items-center gap-2">
                <div className="h-1.5 w-1.5 bg-red-400 rounded-full"></div>
                Temporary bank issue
              </li>
            </ul>
          </div>

          {/* Action Buttons */}
          <div className="space-y-3">
            <Button 
              onClick={handleRetry}
              className="w-full bg-purple-600 hover:bg-purple-700 text-white flex items-center justify-center gap-2"
            >
              <RefreshCcw className="h-4 w-4" />
              Try Again
            </Button>
            
            <div className="flex gap-3">
              <Button 
                variant="outline"
                onClick={() => navigate('/dashboard')}
                className="flex-1 border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700 flex items-center justify-center gap-2"
              >
                <ArrowRight className="h-4 w-4" />
                Back to Dashboard
              </Button>
              <Button 
                variant="outline"
                onClick={() => window.open('/support', '_blank')}
                className="flex-1 border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700 flex items-center justify-center gap-2"
              >
                <HelpCircle className="h-4 w-4" />
                Get Help
              </Button>
            </div>
          </div>

          {/* Support Information */}
          <div className="mt-8 border-t border-gray-200 dark:border-gray-700 pt-6">
            <div className="text-center space-y-2">
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Need assistance? Our support team is here to help
              </p>
              <a 
                href="mailto:support@projectease.com" 
                className="text-sm text-purple-600 hover:text-purple-700 dark:text-purple-400 dark:hover:text-purple-300 font-medium"
              >
                support@projectease.com
              </a>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default PaymentFailure;