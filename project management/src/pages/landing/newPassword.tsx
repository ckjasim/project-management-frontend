import  { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Eye, EyeOff, Check, X } from 'lucide-react';
import { Toaster } from "@/components/ui/toaster";
import { useToast } from '@/components/hooks/use-toast';
import { submitPasswordApi } from '@/services/api/authApi';

const NewPasswordPage = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    password: '',
    confirmPassword: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // Password requirements
  const requirements = [
    { text: "At least 8 characters", test: (pass: string | any[]) => pass.length >= 8 },
    { text: "Contains uppercase letter", test: (pass: string) => /[A-Z]/.test(pass) },
    { text: "Contains lowercase letter", test: (pass: string) => /[a-z]/.test(pass) },
    { text: "Contains number", test: (pass: string) => /\d/.test(pass) },
    { text: "Contains special character", test: (pass: string) => /[!@#$%^&*(),.?":{}|<>]/.test(pass) }
  ];

  const handleChange = (e: { target: { name: any; value: any; }; }) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: { preventDefault: () => void; }) => {
    e.preventDefault();
    setIsLoading(true);

    // Validate all requirements are met
    const allRequirementsMet = requirements.every(req => req.test(formData.password));
    if (!allRequirementsMet) {
      toast({
        variant: "destructive",
        title: "Invalid Password",
        description: "Please meet all password requirements",
        duration: 3000,
      });
      setIsLoading(false);
      return;
    }

    // Check if passwords match
    if (formData.password !== formData.confirmPassword) {
      toast({
        variant: "destructive",
        title: "Passwords Don't Match",
        description: "Please make sure your passwords match",
        duration: 3000,
      });
      setIsLoading(false);
      return;
    }

    try {
     const res = await submitPasswordApi(formData)
     console.log(res)
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      toast({
        title: "Success",
        description: "Your password has been updated successfully",
        duration: 3000,
      });
      
      
      setTimeout(() => navigate('/auth/userLogin'), 1500);
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to update password. Please try again.",
        duration: 3000,
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8 bg-white p-8 rounded-xl shadow-lg">
        <div className="text-center">
          <h2 className="text-3xl font-bold text-gray-900">Create New Password</h2>
          <p className="mt-2 text-sm text-gray-600">
            Please create a strong password that meets all the requirements below
          </p>
        </div>

        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div className="space-y-4">
            {/* Password Field */}
            <div>
              <label htmlFor="password" className="text-sm font-medium text-gray-700">
                New Password
              </label>
              <div className="mt-1 relative">
                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  id="password"
                  value={formData.password}
                  onChange={handleChange}
                  className="appearance-none relative block w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 text-sm"
                />
                <button
                  type="button"
                  className="absolute inset-y-0 right-0 flex items-center pr-3"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? (
                    <EyeOff className="h-5 w-5 text-gray-400" />
                  ) : (
                    <Eye className="h-5 w-5 text-gray-400" />
                  )}
                </button>
              </div>
            </div>

            {/* Confirm Password Field */}
            <div>
              <label htmlFor="confirmPassword" className="text-sm font-medium text-gray-700">
                Confirm Password
              </label>
              <div className="mt-1 relative">
                <input
                  type={showConfirmPassword ? "text" : "password"}
                  name="confirmPassword"
                  id="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  className="appearance-none relative block w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 text-sm"
                />
                <button
                  type="button"
                  className="absolute inset-y-0 right-0 flex items-center pr-3"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                >
                  {showConfirmPassword ? (
                    <EyeOff className="h-5 w-5 text-gray-400" />
                  ) : (
                    <Eye className="h-5 w-5 text-gray-400" />
                  )}
                </button>
              </div>
            </div>

            {/* Password Requirements */}
            <div className="space-y-2">
              <p className="text-sm font-medium text-gray-700">Password Requirements:</p>
              <div className="space-y-2">
                {requirements.map((requirement, index) => (
                  <div key={index} className="flex items-center space-x-2">
                    {requirement.test(formData.password) ? (
                      <Check className="h-4 w-4 text-green-500" />
                    ) : (
                      <X className="h-4 w-4 text-red-500" />
                    )}
                    <span className="text-sm text-gray-600">{requirement.text}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className={`w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 ${
              isLoading ? 'opacity-50 cursor-not-allowed' : ''
            }`}
          >
            {isLoading ? (
              <div className="flex items-center">
                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Setting New Password...
              </div>
            ) : (
              'Set New Password'
            )}
          </button>
        </form>
      </div>
      <Toaster />
    </div>
  );
};

export default NewPasswordPage;