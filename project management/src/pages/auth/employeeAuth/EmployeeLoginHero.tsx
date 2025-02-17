import React from 'react';
import { Input } from "@/components/ui/input";
import { BackgroundBeams } from "@/components/ui/background-beams";

import { Link, useNavigate } from "react-router-dom";
import  { AxiosError } from "axios";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { Toaster } from "@/components/ui/toaster";
import { useToast } from "@/components/hooks/use-toast";

import { useDispatch } from 'react-redux';
import { SetUser } from '@/redux/features/auth/authSlice';
import { employeeLoginApi } from '@/services/api/authApi';
interface FormValues {
  email: string;
  password: string;
}

const EmployeeLoginHero: React.FC = () => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const dispatch= useDispatch()

  const validationSchema = Yup.object({
    email: Yup.string()
      .email("Invalid email address")
      .required("Email is required"),
    password: Yup.string()
      .min(8, "Password must be at least 8 characters")
      .required("Password is required"),
  });

  const initialValues: FormValues = {
    email: '',
    password: '',
  };

  const handleSubmit = async (values: FormValues) => {
    try {
    
      const response = await employeeLoginApi(values)
      toast({
        title: "Login Successful",
        description: response.data.message || "Successfully logged in!",
        variant: 'success',
      });
      const {role,email,_id,isBlock,name}  = response?.data?.user
      const payload = {role,email,_id,isBlock,name,token:response?.data?.token}

      dispatch(SetUser(payload))

      navigate('/employee/projects');
    } catch (error) {
      const axiosError = error as AxiosError<{ message: string }>;
      toast({
        title: "Login Failed",
        description: axiosError.response?.data?.message || "An error occurred during login.",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="relative min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-50 to-rose-50 p-4 py-32 overflow-hidden">
      <Toaster />
      <div className="w-full max-w-[1000px] flex rounded-3xl overflow-hidden bg-white shadow-[0_20px_50px_rgba(8,_112,_184,_0.07)] relative z-10">
      
         <div className="  rounded-md bg-neutral-950 relative flex flex-col items-center justify-center antialiased">
      <div className="max-w-2xl  p-4">
        <h1 className="relative z-10 text-lg md:text-7xl  bg-clip-text text-transparent bg-gradient-to-b from-neutral-200 to-neutral-600  text-center font-sans font-bold">
          Relax,we are here for you
        </h1>
       
      </div>
      <BackgroundBeams />
    </div>

        <div className="w-full lg:w-1/2 p-8 md:p-12">
          

          <div className="mb-10 mt-8">
            <h1 className="text-3xl font-bold bg-gradient-to-r from-indigo-600 to-rose-500 bg-clip-text text-transparent mb-2">
              Hello Again!
            </h1>
            <p className="text-slate-600">Join into a project now!</p>
          </div>

          <Formik
            initialValues={initialValues}
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
                    placeholder="Enter email"
                    className="w-full px-4 py-3 rounded-xl border-indigo-200 bg-slate-90/50 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all"
                  />
                  <ErrorMessage name="email" component="div" className="text-rose-500 text-sm" />
                </div>

                <div className="space-y-1">
                  <Field
                    name="password"
                    type="password"
                    as={Input}
                    placeholder="Password"
                    className="w-full px-4 py-3 rounded-xl border-slate-200 bg-slate-90/50 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all"
                  />
                  <ErrorMessage name="password" component="div" className="text-rose-500 text-sm" />
                </div>

              

                <div className="flex justify-end">
                  <Link 
                    to="/forgotPassword" 
                    className="text-sm text-slate-600 hover:text-indigo-600 transition-colors"
                  >
                    Recovery Password
                  </Link>
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full bg-gradient-to-r from-indigo-600 to-indigo-500 hover:from-indigo-700 hover:to-indigo-600 text-white font-medium py-3 rounded-xl transition-all duration-200 shadow-lg shadow-indigo-500/20 hover:shadow-indigo-500/30"
                >
                  Sign In
                </button>

        
               
                <div className="text-center mt-6">
                  <p className="text-sm text-slate-600">
                    Want to manage your project?{' '}
                    <Link to="/auth/userLogin" className="text-indigo-600 font-medium hover:text-indigo-700">
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
};

export default EmployeeLoginHero;