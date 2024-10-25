import { Label } from '../../../components/ui/label';
import { Input } from '../../../components/ui/input';
import { cn } from '@/lib/utils';
import { IconBrandGithub, IconBrandGoogle } from '@tabler/icons-react';
import { Link, useNavigate } from 'react-router-dom';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import axios from 'axios';
import { Toaster } from '@/components/ui/toaster';
import { useToast } from '@/components/hooks/use-toast';

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
    password: Yup.string()
      .min(8, 'Password must be at least 8 characters')
      .required('Password is required'),
    confirmPassword: Yup.string()
      .oneOf([Yup.ref('password'), undefined], 'Password is not matching')
      .required('Confirm password is required'),
  });

  const handleSubmit = async (values: { firstName: string; lastName: string; email: string; password: string }) => {
    const name = `${values.firstName} ${values.lastName}`;
    
    try {
      const response = await axios.post('http://localhost:3000/api/userRegister', {
        name,
        email: values.email,
        password: values.password,
      }, {
        withCredentials: true,
      });
      toast({
        title: "OTP send to your Email",
        description: response?.data?.message || "An error occurred while logging in.",
        variant:'default',
      });
      console.log('Sign up successful:', response.data.message);
      navigate('/auth/otp');
    } catch (error: any) {
      // Show toast notification for errors
      toast({
        title: "Sign Up Failed",
        description: error.response?.data?.message || 'An error occurred during sign-up.',
        variant: "destructive",
      });
      console.error('SignUp error:', error.response?.data?.message || 'Error occurred during sign-up');
    }
  };

  return (
    <div className="form-container flex justify-center align-center bg-[#0f4841f7]">
      <Toaster />
      <div className="form-wrapper py-9">
        <div className="dark max-w-md w-full mx-auto rounded-none md:rounded-2xl p-4 md:p-8 shadow-input dark:bg-neutral-900 backdrop-blur-2xl bg-[#013a33c0]">
          <h2 className="font-bold text-xl text-neutral-800 dark:text-neutral-200">User Sign Up</h2>
          <p className="text-neutral-600 text-sm max-w-sm mt-2 dark:text-neutral-400">
            Do you want to manage your projects? Sign Up here
          </p>

          <Formik
            initialValues={{ firstName: '', lastName: '', email: '', password: '', confirmPassword: '' }}
            validationSchema={validationSchema}
            onSubmit={handleSubmit}
          >
            {({ isSubmitting }) => (
              <Form className="my-8">
                <div className="flex flex-col md:flex-row space-y-2 md:space-y-0 md:space-x-2 mb-4">
                  <LabelInputContainer>
                    <Label htmlFor="firstName">First name</Label>
                    <Field name="firstName" type="text" as={Input} placeholder="Tyler" />
                    <ErrorMessage name="firstName" component="div" className="text-red-600 font-semibold text-sm" />
                  </LabelInputContainer>
                  <LabelInputContainer>
                    <Label htmlFor="lastName">Last name</Label>
                    <Field name="lastName" type="text" as={Input} placeholder="Durden" />
                    <ErrorMessage name="lastName" component="div" className="text-red-600 font-semibold text-sm" />
                  </LabelInputContainer>
                </div>

                <LabelInputContainer className="mb-4">
                  <Label htmlFor="email">Email</Label>
                  <Field name="email" type="email" as={Input} placeholder="projectmayhem@fc.com" />
                  <ErrorMessage name="email" component="div" className="text-red-600 font-semibold text-sm" />
                </LabelInputContainer>

                <LabelInputContainer className="mb-4">
                  <Label htmlFor="password">Password</Label>
                  <Field name="password" type="password" as={Input} placeholder="••••••••" />
                  <ErrorMessage name="password" component="div" className="text-red-600 font-semibold text-sm" />
                </LabelInputContainer>

                <LabelInputContainer className="mb-4">
                  <Label htmlFor="confirmPassword">Confirm Password</Label>
                  <Field name="confirmPassword" type="password" as={Input} placeholder="••••••••" />
                  <ErrorMessage name="confirmPassword" component="div" className="text-red-600 font-semibold text-sm" />
                </LabelInputContainer>

                <button
                  className="bg-gradient-to-br relative group/btn from-black dark:from-[#013a33] to-neutral-600 dark:to-emerald-700 block w-full text-white rounded-md h-10 font-medium"
                  type="submit"
                  disabled={isSubmitting}
                >
                  Sign Up &rarr;
                  <BottomGradient />
                </button>
              </Form>
            )}
          </Formik>

          <div className="text-center mt-3 text-lime-100 font-normal text-sm">
            <Link to="/forgotPassword">Forgot Password?</Link>
          </div>

          <div className="bg-gradient-to-r from-transparent via-neutral-300 dark:via-neutral-600 to-transparent my-8 h-[1px] w-full" />

          <div className="flex flex-row space-x-4">
            <button
              className="relative group/btn flex space-x-2 items-center justify-start px-4 w-full text-black dark:text-white rounded-md h-10 font-medium shadow-input bg-gray-50 dark:bg-[#013a33]"
              type="button"
            >
              <IconBrandGoogle className="h-4 w-4 text-neutral-800 dark:text-neutral-300" />
              <span className="text-neutral-700 dark:text-neutral-300 text-sm">Google</span>
              <BottomGradient />
            </button>
            <button
              className="relative group/btn flex space-x-2 items-center justify-start px-4 w-full text-black dark:text-white rounded-md h-10 font-medium shadow-input bg-gray-50 dark:bg-[#013a33]"
              type="button"
            >
              <IconBrandGithub className="h-4 w-4 text-neutral-800 dark:text-neutral-300" />
              <span className="text-neutral-700 dark:text-neutral-300 text-sm">GitHub</span>
              <BottomGradient />
            </button>
          </div>

          <div className="text-center mt-4 text-lime-100 font-normal text-sm">
            <p>
              Already have an account?{' '}
              <Link to="/auth/userLogin" className="font-medium text-white">Login</Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

const BottomGradient = () => {
  return (
    <>
      <span className="group-hover/btn:opacity-100 block transition duration-500 opacity-0 absolute h-px w-full -bottom-px inset-x-0 bg-gradient-to-r from-transparent via-cyan-500 to-transparent" />
      <span className="group-hover/btn:opacity-100 blur-sm block transition duration-500 opacity-0 absolute h-px w-1/2 mx-auto -bottom-px inset-x-10 bg-gradient-to-r from-transparent via-indigo-500 to-transparent" />
    </>
  );
};

const LabelInputContainer = ({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) => {
  return <div className={cn('flex flex-col space-y-2 w-full', className)}>{children}</div>;
};
