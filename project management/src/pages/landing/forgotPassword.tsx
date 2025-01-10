import { useState } from 'react';
import { Mail, ArrowRight, Loader2 } from 'lucide-react';
import { Toaster } from "@/components/ui/toaster";
import { useToast } from '@/components/hooks/use-toast';
import { Link, useNavigate } from 'react-router-dom';
import { recoverPasswordApi } from '@/services/api/authApi';

const PasswordRecovery = () => {
  const navigate=useNavigate()
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async (e: { preventDefault: () => void; }) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      
      const res = await recoverPasswordApi(email)
      console.log(res)
      toast({
        variant: "success",
        title: "Check your email",
        description: ` ${res?.message} ${email}`,
        duration: 5000,
      });
      
      setEmail('');
      navigate('/forgotOtp')
    } catch (err) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Something went wrong. Please try again.",
        duration: 5000,
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full min-h-screen flex items-center justify-center bg-gray-50 p-4">
      <div className="w-full max-w-md space-y-8 bg-white p-8 rounded-lg shadow-lg">
        <div className="space-y-2 text-center">
          <h1 className="text-2xl font-semibold tracking-tight">Reset your password</h1>
          <p className="text-sm text-gray-500">
            Enter your email address and we'll send you instructions to reset your password.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <label htmlFor="email" className="text-sm font-medium leading-none">
              Email address
            </label>
            <div className="relative">
              <Mail className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
              <input
                id="email"
                type="email"
                placeholder="Enter your email"
                className="w-full pl-10 pr-4 py-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full flex items-center justify-center space-x-2 py-2 px-4 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? (
              <>
                <Loader2 className="h-5 w-5 animate-spin" />
                <span>Sending...</span>
              </>
            ) : (
              <>
                <span>Verify</span>
                <ArrowRight className="h-5 w-5" />
              </>
            )}
          </button>
        </form>

        <div className="text-center">
          <Link to="/auth/UserLogin" className="text-sm text-blue-600 hover:text-blue-700">
            Return to login
          </Link>
        </div>
      </div>
      <Toaster />
    </div>
  );
};

export default PasswordRecovery;