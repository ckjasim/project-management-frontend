import React from 'react';
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { BackgroundBeams } from "@/components/ui/background-beams";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { Toaster } from "@/components/ui/toaster";
import { useToast } from "@/components/hooks/use-toast";

export function EmployeeSignUpHero() {
  const { toast } = useToast();
  const navigate = useNavigate();

  const validationSchema = Yup.object({
    firstName: Yup.string().required('First name is required'),
    lastName: Yup.string().required('Last name is required'),
    email: Yup.string()
      .email('Invalid email address')
      .required('Email is required'),
    password: Yup.string()
      .min(8, 'Password must be at least 8 characters')
      .required('Password is required'),
    confirmPassword: Yup.string()
      .oneOf([Yup.ref('password'), undefined], 'Passwords must match')
      .required('Confirm password is required'),
    mobile: Yup.string()
      .required('Mobile number is required')
      .length(10, 'Enter a 10 digit mobile number'),
    jobRole: Yup.string().required('Job role is required'),
    projectCode: Yup.string()
      .required('Project code is required')
      .length(5, 'Project code must be exactly 5 characters'),
      organization: Yup.string().required('organization is required'),
  });

  const handleSubmit = async (values: any) => {
    const { firstName, lastName, email, password, mobile, projectCode, jobRole,organization } = values;
    const name = `${firstName} ${lastName}`;

    try {
      const response = await axios.post(
        'http://localhost:3000/api/employeeRegister',
        {
          name,
          email,
          password,
          mobile,
          projectCode,
          jobRole,
          organization
        },
        { withCredentials: true }
      );
      console.log('Sign up successful:', response.data.message);
      navigate('/auth/employeeOtp');
    } catch (error: any) {
      console.error('Sign up error:', error.response.data.message);
      toast({
        title: 'Registration Failed',
        description: error?.response?.data?.message || 'An error occurred during registration.',
        variant: 'destructive',
      });
    }
  };

  return (
    <div className="relative min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-50 to-rose-50 p-4 py-32 overflow-hidden">
      <Toaster />
      <div className="w-full max-w-[1000px] flex rounded-3xl overflow-hidden bg-white shadow-[0_20px_50px_rgba(8,_112,_184,_0.07)] relative z-10">
        {/* Left Side - Animation */}
          <div className="  rounded-md  bg-neutral-950 relative flex flex-col items-center justify-center antialiased">
      <div className="max-w-2xl  p-4">
        <h1 className="relative z-10 text-lg md:text-7xl  bg-clip-text text-transparent bg-gradient-to-b from-neutral-200 to-neutral-600  text-center font-sans font-bold">
         Join our team today
        </h1>
       
      </div>
      <BackgroundBeams />
    </div> 

        {/* Right Side - Form */}
        <div className="w-full lg:w-1/2 p-8 md:p-12">
          <div className="text-right mb-8">
            <span className="text-sm text-slate-600">Already have an account? </span>
            <Link to="/auth/employeeLogin" className="text-indigo-600 font-medium hover:text-indigo-700">
              Sign in
            </Link>
          </div>

          <div className="mb-10">
            <h1 className="text-3xl font-bold bg-gradient-to-r from-indigo-600 to-rose-500 bg-clip-text text-transparent mb-2">
              Welcome!
            </h1>
            <p className="text-slate-600">Let's get you started with your account</p>
          </div>

          <Formik
            initialValues={{
              firstName: '',
              lastName: '',
              email: '',
              password: '',
              confirmPassword: '',
              mobile: '',
              jobRole: '',
              organization:'',
              projectCode: '',
            }}
            validationSchema={validationSchema}
            onSubmit={handleSubmit}
          >
            {({ isSubmitting }) => (
              <Form className="space-y-4">
                <div className="flex gap-4">
                  <div className="flex-1 space-y-1">
                    <Field
                      name="firstName"
                      type="text"
                      as={Input}
                      placeholder="First Name"
                      className="w-full px-4 py-3 rounded-xl border-slate-200 bg-slate-50/50 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all"
                    />
                    <ErrorMessage name="firstName" component="div" className="text-rose-500 text-sm" />
                  </div>

                  <div className="flex-1 space-y-1">
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
                    placeholder="Email Address"
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
                    name="jobRole"
                    type="text"
                    as={Input}
                    placeholder="Job Role"
                    className="w-full px-4 py-3 rounded-xl border-slate-200 bg-slate-50/50 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all"
                  />
                  <ErrorMessage name="jobRole" component="div" className="text-rose-500 text-sm" />
                </div>

                <div className="space-y-1">
                  <Field
                    name="projectCode"
                    type="text"
                    as={Input}
                    placeholder="Project Code"
                    className="w-full px-4 py-3 rounded-xl border-slate-200 bg-slate-50/50 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all"
                  />
                  <ErrorMessage name="projectCode" component="div" className="text-rose-500 text-sm" />
                </div>

                <div className="space-y-1">
                  <Field
                    name="mobile"
                    type="text"
                    as={Input}
                    placeholder="Mobile Number"
                    className="w-full px-4 py-3 rounded-xl border-slate-200 bg-slate-50/50 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all"
                  />
                  <ErrorMessage name="mobile" component="div" className="text-rose-500 text-sm" />
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
}

export default EmployeeSignUpHero;