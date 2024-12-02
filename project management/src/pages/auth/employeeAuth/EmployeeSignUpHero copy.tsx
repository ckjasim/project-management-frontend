import { Label } from '../../../components/ui/label';
import { Input } from '../../../components/ui/input';
import { cn } from '@/lib/utils';
import { IconBrandGithub, IconBrandGoogle } from '@tabler/icons-react';
import { Link, useNavigate } from 'react-router-dom';
import { useState } from 'react';
import axios from 'axios';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import { Toaster } from '@/components/ui/toaster';
import { useToast } from '@/components/hooks/use-toast';

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
  });

  const handleSubmit = async (values: any) => {
    const {
      firstName,
      lastName,
      email,
      password,
      mobile,
      projectCode,
      jobRole,
    } = values;
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
        },
        { withCredentials: true }
      );
      console.log('Sign up successful:', response.data.message);
      toast({
        title: 'Registration successfull',
        description:
          response?.data?.message || 'An error occurred during login.',
        variant: 'success',
      });
      navigate('/employee/task');
    } catch (error: any) {
      console.error('Sign up error:', error.response.data.message);
      toast({
        title: 'Login Failed',
        description:
          error?.response?.data?.message || 'An error occurred during login.',
        variant: 'destructive',
      });
    }
  };

  return (
    <div className="form-container flex justify-center align-center bg-[#0f4841f7]">
      <Toaster />

      <div className="form-wrapper py-8">
        <div className="dark max-w-md w-full mx-auto rounded-none md:rounded-2xl p-4 md:p-8 shadow-input dark:bg-neutral-900 backdrop-blur-2xl bg-[#013a33c0]">
          <h2 className="font-bold text-xl text-neutral-800 dark:text-neutral-200">
            Employee Sign Up
          </h2>
          <p className="text-neutral-600 text-sm max-w-sm mt-2 dark:text-neutral-400">
            Do you want to join your project? Signup here
          </p>

          <Formik
            initialValues={{
              firstName: '',
              lastName: '',
              email: '',
              password: '',
              confirmPassword: '',
              mobile: '',
              jobRole: '',
              projectCode: '',
            }}
            validationSchema={validationSchema}
            onSubmit={handleSubmit}
          >
            {() => (
              <Form className="my-8">
                <div className="flex flex-col md:flex-row space-y-2 md:space-y-0 md:space-x-2 mb-4">
                  <LabelInputContainer>
                    <Label htmlFor="firstName">First name</Label>
                    <Field
                      id="firstName"
                      name="firstName"
                      placeholder="Tyler"
                      type="text"
                      as={Input}
                    />
                    <ErrorMessage
                      name="firstName"
                      component="div"
                      className="text-red-600 font-semibold text-sm"
                    />
                  </LabelInputContainer>
                  <LabelInputContainer>
                    <Label htmlFor="lastName">Last name</Label>
                    <Field
                      id="lastName"
                      name="lastName"
                      placeholder="Durden"
                      type="text"
                      as={Input}
                    />
                    <ErrorMessage
                      name="lastName"
                      component="div"
                      className="text-red-600 font-semibold text-sm"
                    />
                  </LabelInputContainer>
                </div>
                <LabelInputContainer className="mb-4">
                  <Label htmlFor="email">Email</Label>
                  <Field
                    id="email"
                    name="email"
                    placeholder="projectmayhem@fc.com"
                    type="email"
                    as={Input}
                  />
                  <ErrorMessage
                    name="email"
                    component="div"
                    className="text-red-600 font-semibold text-sm"
                  />
                </LabelInputContainer>
                <LabelInputContainer className="mb-4">
                  <Label htmlFor="password">Password</Label>
                  <Field
                    id="password"
                    name="password"
                    placeholder="••••••••"
                    type="password"
                    as={Input}
                  />
                  <ErrorMessage
                    name="password"
                    component="div"
                    className="text-red-600 font-semibold text-sm"
                  />
                </LabelInputContainer>
                <LabelInputContainer className="mb-4">
                  <Label htmlFor="confirmPassword">Confirm Password</Label>
                  <Field
                    id="confirmPassword"
                    name="confirmPassword"
                    placeholder="••••••••"
                    type="password"
                    as={Input}
                  />
                  <ErrorMessage
                    name="confirmPassword"
                    component="div"
                    className="text-red-600 font-semibold text-sm"
                  />
                </LabelInputContainer>
                <LabelInputContainer className="mb-4">
                  <Label htmlFor="mobile">Mobile Number</Label>
                  <Field
                    id="mobile"
                    name="mobile"
                    placeholder="9999999999"
                    type="text"
                    as={Input}
                  />
                  <ErrorMessage
                    name="mobile"
                    component="div"
                    className="text-red-600 font-semibold text-sm"
                  />
                </LabelInputContainer>
                <LabelInputContainer className="mb-4">
                  <Label htmlFor="jobRole">Job Role</Label>
                  <Field
                    id="jobRole"
                    name="jobRole"
                    placeholder="Designer"
                    type="text"
                    as={Input}
                  />
                  <ErrorMessage
                    name="jobRole"
                    component="div"
                    className="text-red-600 font-semibold text-sm"
                  />
                </LabelInputContainer>
                <LabelInputContainer className="mb-4">
                  <Label htmlFor="projectCode">Project Code</Label>
                  <Field
                    id="projectCode"
                    name="projectCode"
                    placeholder="DFDFD"
                    type="text"
                    as={Input}
                  />
                  <ErrorMessage
                    name="projectCode"
                    component="div"
                    className="text-red-600 font-semibold text-sm"
                  />
                </LabelInputContainer>

                <button
                  className="bg-gradient-to-br relative group/btn from-black dark:from-[#013a33] to-neutral-600 dark:to-emerald-700 block w-full text-white rounded-md h-10 font-medium shadow-[0px_1px_0px_0px_#ffffff40_inset,0px_-1px_0px_0px_#ffffff40_inset] dark:shadow-[0px_1px_0px_0px_var(--zinc-800)_inset,0px_-1px_0px_0px_var(--zinc-800)_inset]"
                  type="submit"
                >
                  Sign up &rarr;
                  <BottomGradient />
                </button>

                {/*   
                <div className="flex flex-row space-x-4">
                  <button className="relative group/btn flex space-x-2 items-center justify-start px-4 w-full text-black dark:text-white rounded-md h-10 font-medium shadow-input bg-gray-50 dark:bg-[#013a33] dark:shadow-[0px_0px_1px_1px_var(--neutral-800)]" type="submit">
                    <IconBrandGoogle className="h-4 w-4 text-neutral-800 dark:text-neutral-300" />
                    <span className="text-neutral-700 dark:text-neutral-300 text-sm">Google</span>
                    <BottomGradient />
                  </button>
                  <button className="relative group/btn flex space-x-2 items-center justify-start px-4 w-full text-black dark:text-white rounded-md h-10 font-medium shadow-input bg-gray-50 dark:bg-[#013a33] dark:shadow-[0px_0px_1px_1px_var(--neutral-800)]" type="submit">
                    <IconBrandGithub className="h-4 w-4 text-neutral-800 dark:text-neutral-300" />
                    <span className="text-neutral-700 dark:text-neutral-300 text-sm">GitHub</span>
                    <BottomGradient />
                  </button>
                </div> */}

                <div className="text-center mt-4 text-lime-100 font-normal text-sm">
                  <p>
                    Already have an account?{' '}
                    <Link
                      to="/auth/employeeLogin"
                      className="font-medium text-white"
                    >
                      Login
                    </Link>
                  </p>
                </div>
                <div className="text-center mt-3 text-lime-100 font-normal text-sm">
                  <p>
                    Do you want to manage your project?{' '}
                    <Link
                      to="/auth/userLogin"
                      className="font-medium text-white"
                    >
                      Login
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

const LabelInputContainer = ({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) => <div className={`flex flex-col ${className}`}>{children}</div>;

const BottomGradient = () => (
  <div className="absolute -inset-1 bg-gradient-to-br from-black to-neutral-600 rounded-md blur opacity-0 transition-opacity duration-300 group-hover/btn:opacity-100" />
);
