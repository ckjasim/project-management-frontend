
import { Input } from "@/components/ui/input";
import { BackgroundBeams } from "@/components/ui/background-beams";
import { Link, useNavigate } from "react-router-dom";

import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { Toaster } from "@/components/ui/toaster";
import { useToast } from "@/components/hooks/use-toast";
import { adminLoginApi } from '@/services/api/api';
import { useDispatch } from "react-redux";
import { SetUser } from "@/redux/features/auth/authSlice";
import { Chrome, Github } from "lucide-react";

export function AdminLoginHero() {
  const { toast } = useToast();
  const navigate = useNavigate();
  const dispatch = useDispatch()

  const validationSchema = Yup.object({
    email: Yup.string()
      .email("Invalid email address")
      .required("Email is required"),
    password: Yup.string()
      .min(8, "Password must be at least 8 characters")
      .required("Password is required"),
  });

  const handleSubmit = async (values: { email: string; password: string }) => {
    try {
      const data={
        email: values.email,
        password: values.password,
      }
      const response = await adminLoginApi(data);

      console.log('Login successful:', response);
      
            const payload={role:response?.data.role,token:response?.data.token,_id:'',isBlock:false,email:'',name:''}
      
            dispatch(SetUser(payload))
      toast({
        title: "Login Successful",
        description: response?.data?.message || "Logged in successfully.",
        variant: 'success',
      });
      navigate('/admin/dashboard');
    } catch (error: any) {
      toast({
        title: "Login Failed",
        description: error?.response?.data?.message || "An error occurred while logging in.",
        variant: "destructive",
      });
      console.error(error);
    }
  };

  return (
    <div className="relative min-h-screen flex items-center justify-center bg-gradient-to-br from-emerald-50 to-teal-50 p-4 py-32 overflow-hidden">
      <Toaster />
      <div className="w-full max-w-[1000px] flex rounded-3xl overflow-hidden bg-white shadow-[0_20px_50px_rgba(8,_112,_184,_0.07)] relative z-10">
        {/* Left Side - Animated Background */}
        <div className="hidden lg:block w-1/2 rounded-md bg-neutral-950 relative flex flex-col items-center justify-center antialiased">
          <div className="max-w-2xl p-4">
            <h1 className="relative z-10 text-lg md:text-7xl bg-clip-text text-transparent bg-gradient-to-b from-neutral-200 to-neutral-600 text-center font-sans font-bold">
              Welcome Back Admin
            </h1>
          </div>
          <BackgroundBeams />
        </div>

        {/* Right Side - Form */}
        <div className="w-full lg:w-1/2 p-8 md:p-12">
          <div className="text-right mb-8">
            <span className="text-sm text-slate-600">Need help? </span>
            <Link to="/contact" className="text-teal-600 font-medium hover:text-teal-700">
              Contact Support
            </Link>
          </div>

          <div className="mb-10">
            <h1 className="text-3xl font-bold bg-gradient-to-r from-teal-600 to-emerald-500 bg-clip-text text-transparent mb-2">
              Admin Portal
            </h1>
            <p className="text-slate-600">Secure access to dashboard</p>
          </div>

          <Formik
            initialValues={{ email: '', password: '' }}
            validationSchema={validationSchema}
            onSubmit={handleSubmit}
          >
            {({ isSubmitting }) => (
              <Form className="space-y-6">
                <div className="space-y-1">
                  <Field
                    name="email"
                    type="email"
                    as={Input}
                    placeholder="Enter admin email"
                    className="w-full px-4 py-3 rounded-xl border-slate-200 bg-slate-50/50 focus:border-teal-500 focus:ring-1 focus:ring-teal-500 transition-all"
                  />
                  <ErrorMessage name="email" component="div" className="text-rose-500 text-sm" />
                </div>

                <div className="space-y-1">
                  <Field
                    name="password"
                    type="password"
                    as={Input}
                    placeholder="Password"
                    className="w-full px-4 py-3 rounded-xl border-slate-200 bg-slate-50/50 focus:border-teal-500 focus:ring-1 focus:ring-teal-500 transition-all"
                  />
                  <ErrorMessage name="password" component="div" className="text-rose-500 text-sm" />
                </div>

                <div className="flex justify-end">
                  <Link 
                    to="/forgotPassword" 
                    className="text-sm text-slate-600 hover:text-teal-600 transition-colors"
                  >
                    Reset Password
                  </Link>
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full bg-gradient-to-r from-teal-600 to-emerald-500 hover:from-teal-700 hover:to-emerald-600 text-white font-medium py-3 rounded-xl transition-all duration-200 shadow-lg shadow-teal-500/20 hover:shadow-teal-500/30"
                >
                  Sign In
                </button>

                <div className="relative flex items-center justify-center my-6">
                  <div className="border-t border-slate-200 w-full"></div>
                  <div className="absolute bg-white px-4 text-sm text-slate-500">Or continue with</div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <button
                    type="button"
                    className="flex items-center justify-center gap-2 px-4 py-2 rounded-xl border border-slate-200 bg-slate-50 hover:bg-slate-100 transition-colors"
                  >
                    <Chrome className="h-5 w-5" />
                    <span className="text-sm font-medium">Google</span>
                  </button>
                  <button
                    type="button"
                    className="flex items-center justify-center gap-2 px-4 py-2 rounded-xl border border-slate-200 bg-slate-50 hover:bg-slate-100 transition-colors"
                  >
                    <Github className="h-5 w-5" />
                    <span className="text-sm font-medium">GitHub</span>
                  </button>
                </div>

                <div className="text-center mt-6">
                  <p className="text-sm text-slate-600">
                    Looking for user login?{' '}
                    <Link to="/auth/userLogin" className="text-teal-600 font-medium hover:text-teal-700">
                      Click here
                    </Link>
                  </p>
                </div>
              </Form>
            )}
          </Formik>
        </div>
      </div>
    </div>
  );
}

export default AdminLoginHero;