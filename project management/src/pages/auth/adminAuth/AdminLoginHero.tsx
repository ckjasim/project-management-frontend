import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import {
  IconBrandGithub,
  IconBrandGoogle,
} from "@tabler/icons-react";
import { Link } from "react-router-dom";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { Toaster } from "@/components/ui/toaster";
import { useToast } from "@/components/hooks/use-toast";
import axios from "axios";

export function AdminLoginHero() {
  const { toast } = useToast();

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
      const response = await axios.post('http://localhost:3000/api/adminLogin', {
        email: values.email,
        password: values.password,
      });
      console.log('Login successful:', response);
      toast({
        title: "Login Successful",
        description: response?.data?.message || "Logged in successfully.",
        variant: 'success',
      });
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
    <div className="form-container h-svh flex justify-center align-center bg-[#0f4841f7]">
      <Toaster />
      <div className="form-wrapper mt-8">
        <div className="dark max-w-md w-full mx-auto rounded-none md:rounded-2xl p-4 md:p-8 shadow-input dark:bg-neutral-900 backdrop-blur-2xl bg-[#013a33c0]">
          <h2 className="font-bold text-xl text-neutral-800 dark:text-neutral-200">
            Admin Login
          </h2>

          <Formik
            initialValues={{ email: '', password: '' }}
            validationSchema={validationSchema}
            onSubmit={handleSubmit}
          >
            {({ isSubmitting }) => (
              <Form className="my-8">
                <LabelInputContainer className="mb-4">
                  <Label htmlFor="email">Email</Label>
                  <Field
                    name="email"
                    type="email"
                    as={Input}
                    placeholder="projectmayhem@fc.com"
                  />
                  <ErrorMessage name="email" component="div" className="text-red-600 font-semibold text-sm" />
                </LabelInputContainer>

                <LabelInputContainer className="mb-4">
                  <Label htmlFor="password">Password</Label>
                  <Field
                    name="password"
                    type="password"
                    as={Input}
                    placeholder="••••••••"
                  />
                  <ErrorMessage name="password" component="div" className="text-red-600 font-semibold text-sm" />
                </LabelInputContainer>

                <button
                  className="bg-gradient-to-br relative group/btn from-black dark:from-[#013a33] to-neutral-600 dark:to-emerald-700 block w-full text-white rounded-md h-10 font-medium shadow-[0px_1px_0px_0px_#ffffff40_inset,0px_-1px_0px_0px_#ffffff40_inset] dark:shadow-[0px_1px_0px_0px_var(--zinc-800)_inset,0px_-1px_0px_0px_var(--zinc-800)_inset]"
                  type="submit"
                  disabled={isSubmitting}
                >
                  Login &rarr;
                  <BottomGradient />
                </button>

                <div className='text-center mt-3 text-lime-100 font-normal text-sm'>
                  <Link to="/forgotPassword">Forgot Password?</Link>
                </div>

                <div className="bg-gradient-to-r from-transparent via-neutral-300 dark:via-neutral-600 to-transparent my-8 h-[1px] w-full" />

                <div className="flex flex-row space-x-4">
                  <button
                    className="relative group/btn flex space-x-2 items-center justify-start px-4 w-full text-black dark:text-white rounded-md h-10 font-medium shadow-input bg-gray-50 dark:bg-[#013a33] dark:shadow-[0px_0px_1px_1px_var(--neutral-800)]"
                    type="button"
                  >
                    <IconBrandGoogle className="h-4 w-4 text-neutral-800 dark:text-neutral-300" />
                    <span className="text-neutral-700 dark:text-neutral-300 text-sm">Google</span>
                    <BottomGradient />
                  </button>
                  <button
                    className="relative group/btn flex space-x-2 items-center justify-start px-4 w-full text-black dark:text-white rounded-md h-10 font-medium shadow-input bg-gray-50 dark:bg-[#013a33] dark:shadow-[0px_0px_1px_1px_var(--neutral-800)]"
                    type="button"
                  >
                    <IconBrandGithub className="h-4 w-4 text-neutral-800 dark:text-neutral-300" />
                    <span className="text-neutral-700 dark:text-neutral-300 text-sm">GitHub</span>
                    <BottomGradient />
                  </button>
                </div>
              </Form>
            )}
          </Formik>
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
  return (
    <div className={cn("flex flex-col space-y-2 w-full", className)}>
      {children}
    </div>
  );
};
