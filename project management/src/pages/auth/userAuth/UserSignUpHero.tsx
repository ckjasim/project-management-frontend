import { Input } from "@/components/ui/input";
import { BackgroundBeams } from "@/components/ui/background-beams";
import { Link, useNavigate } from "react-router-dom";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { Toaster } from "@/components/ui/toaster";
import { useToast } from "@/components/hooks/use-toast";
import { userSignupApi } from '@/services/api/api';
import { Chrome, Github } from 'lucide-react';

export function UserSignUpHero() {
  const navigate = useNavigate();
  const { toast } = useToast();

  const validationSchema = Yup.object({
    firstName: Yup.string().required('First name is required'),
    lastName: Yup.string().required('Last name is required'),
    email: Yup.string()
      .email('Invalid email address')
      .matches(/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i, 'Invalid email address')
      .required('Email is required'),
    organization: Yup.string().required('organization is required'),

    password: Yup.string() 
      .min(8, 'Password must be at least 8 characters')
      .required('Password is required'),
    confirmPassword: Yup.string()
      .oneOf([Yup.ref('password'), undefined], 'Password is not matching')
      .required('Confirm password is required'),
  });

  const handleSubmit = async (values: { firstName: string; lastName: string; email: any; password: any;organization:string }) => {
    const name = `${values.firstName} ${values.lastName}`;
    
    try {
      const data ={
        name,
        email: values.email,
        password: values.password,
        organization:values.organization
      }
      const response = await userSignupApi(data)
      toast({
        title: "OTP send to your Email",
        description: response?.data?.message || "An error occurred while logging in.",
        variant:'success',
      });
      navigate('/auth/otp');
    } catch (error:any) {
      toast({
        title: "Sign Up Failed",
        description: error.response?.data?.message || 'An error occurred during sign-up.',
        variant: "destructive",
      });
    }
  };

  const googleAuth = () => {
    window.location.href = 'http://localhost:3000/api/google';
  };

  return (
    <div className="relative min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-50 to-rose-50 p-4 py-32 overflow-hidden">
      <Toaster />
      <div className="w-full max-w-[1000px] flex rounded-3xl overflow-hidden bg-white shadow-[0_20px_50px_rgba(8,_112,_184,_0.07)] relative z-10">
       
        <div className="hidden lg:block w-1/2 rounded-md bg-neutral-950 relative flex flex-col items-center justify-center antialiased">
          <div className="max-w-2xl p-4">
            <h1 className="relative z-10 text-lg md:text-7xl bg-clip-text text-transparent bg-gradient-to-b from-neutral-200 to-neutral-600 text-center font-sans font-bold">
              Join us today
            </h1>
          </div>
          <BackgroundBeams />
        </div>

       
        <div className="w-full lg:w-1/2 p-8 md:p-12">
          <div className="text-right mb-8">
            <span className="text-sm text-slate-600">Already a member? </span>
            <Link to="/auth/userLogin" className="text-indigo-600 font-medium hover:text-indigo-700">
              Sign in
            </Link>
          </div>

          <div className="mb-10">
            <h1 className="text-3xl font-bold bg-gradient-to-r from-indigo-600 to-rose-500 bg-clip-text text-transparent mb-2">
              Create Account
            </h1>
            <p className="text-slate-600">Start your journey with us today!</p>
          </div>

          <Formik
            initialValues={{ firstName: '', lastName: '', email: '', password: '', confirmPassword: '' , organization:'',}}
            validationSchema={validationSchema}
            onSubmit={handleSubmit}
          >
            {({ isSubmitting }) => (
              <Form className="space-y-6">
                <div className="flex gap-4">
                  <div className="space-y-1 flex-1">
                    <Field
                      name="firstName"
                      type="text"
                      as={Input}
                      placeholder="First Name"
                      className="w-full px-4 py-3 rounded-xl border-slate-200 bg-slate-50/50 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all"
                    />
                    <ErrorMessage name="firstName" component="div" className="text-rose-500 text-sm" />
                  </div>
                  <div className="space-y-1 flex-1">
                    <Field
                      name="lastName"
                      type="text"
                      as={Input}
                      placeholder="Last Name"
                      className="w-full px-4 py-3 rounded-xl border-slate-200 bg-slate-50/50 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all"
                    />
                    <ErrorMessage name="lastName" component="div" className="text-rose-500 text-sm" />
                  </div>
                </div>

                <div className="space-y-1">
                  <Field
                    name="email"
                    type="email"
                    as={Input}
                    placeholder="Email address"
                    className="w-full px-4 py-3 rounded-xl border-slate-200 bg-slate-50/50 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all"
                  />
                  <ErrorMessage name="email" component="div" className="text-rose-500 text-sm" />
                </div>
                <div className="space-y-1">
                  <Field
                    name="organization"
                    type="organization"
                    as={Input}
                    placeholder="Organization"
                    className="w-full px-4 py-3 rounded-xl border-slate-200 bg-slate-50/50 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all"
                  />
                  <ErrorMessage name="organization" component="div" className="text-rose-500 text-sm" />
                </div>

                <div className="space-y-1">
                  <Field
                    name="password"
                    type="password"
                    as={Input}
                    placeholder="Password"
                    className="w-full px-4 py-3 rounded-xl border-slate-200 bg-slate-50/50 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all"
                  />
                  <ErrorMessage name="password" component="div" className="text-rose-500 text-sm" />
                </div>

                <div className="space-y-1">
                  <Field
                    name="confirmPassword"
                    type="password"
                    as={Input}
                    placeholder="Confirm Password"
                    className="w-full px-4 py-3 rounded-xl border-slate-200 bg-slate-50/50 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all"
                  />
                  <ErrorMessage name="confirmPassword" component="div" className="text-rose-500 text-sm" />
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full bg-gradient-to-r from-indigo-600 to-indigo-500 hover:from-indigo-700 hover:to-indigo-600 text-white font-medium py-3 rounded-xl transition-all duration-200 shadow-lg shadow-indigo-500/20 hover:shadow-indigo-500/30"
                >
                  Create Account
                </button>

                <div className="relative flex items-center justify-center my-6">
                  <div className="border-t border-slate-200 w-full"></div>
                  <div className="absolute bg-white px-4 text-sm text-slate-500">Or continue with</div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <button
                    onClick={googleAuth}
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
                    Want to join a project?{' '}
                    <Link to="/auth/employeeLogin" className="text-indigo-600 font-medium hover:text-indigo-700">
                      Login here
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

export default UserSignUpHero;