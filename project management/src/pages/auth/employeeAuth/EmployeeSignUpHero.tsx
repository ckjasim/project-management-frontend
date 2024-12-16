import React, { useState, useRef } from 'react';
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { BackgroundBeams } from "@/components/ui/background-beams";
import { Link, useNavigate } from "react-router-dom";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { Toaster } from "@/components/ui/toaster";
import { useToast } from "@/components/hooks/use-toast";
import { useSearchParams } from "react-router-dom";
import { UploadCloud, X } from "lucide-react";
import { SetUser } from '@/redux/features/auth/authSlice';
import { useDispatch } from 'react-redux';
import { employeeSignupApi } from '@/services/api/api';

export function EmployeeSignUpHero() {
  const { toast } = useToast();
  const navigate = useNavigate();
  const dispatch = useDispatch()
  const [searchParams] = useSearchParams();
  const token = searchParams.get("token");
  const [previewImage, setPreviewImage] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [dragActive, setDragActive] = useState(false);

  const validationSchema = Yup.object({
    password: Yup.string()
      .min(8, 'Password must be at least 8 characters')
      .required('Password is required'),
    confirmPassword: Yup.string()
      .oneOf([Yup.ref('password'), undefined], 'Passwords must match')
      .required('Confirm password is required'),
    mobile: Yup.string()
      .required('Mobile number is required')
      .length(10, 'Enter a 10 digit mobile number'),
    file: Yup.mixed()
      .required('Profile image is required')
      .test('fileSize', 'File is too large', (value:any) => {
        return value && value[0]?.size <= 5 * 1024 * 1024; 
      })
      .test('fileType', 'Unsupported file format', (value:any) => {
        return value && ['image/jpeg', 'image/png', 'image/gif'].includes(value[0]?.type);
      }),
  });

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>, setFieldValue: (field: string, value: any) => void) => {
    const files = event.target.files;
    if (files && files.length > 0) {
      handleFileUpload(files[0], setFieldValue);
    }
  };

  const handleDrop = (event: React.DragEvent<HTMLDivElement>, setFieldValue: (field: string, value: any) => void) => {
    event.preventDefault();
    event.stopPropagation();
    setDragActive(false);
    
    const files = event.dataTransfer.files;
    if (files && files.length > 0) {
      handleFileUpload(files[0], setFieldValue);
    }
  };

  const handleFileUpload = (file: File, setFieldValue: (field: string, value: any) => void) => {

    const validTypes = ['image/jpeg', 'image/png', 'image/jpg'];
    if (!validTypes.includes(file.type)) {
      toast({
        title: 'Invalid File Type',
        description: 'Please upload a JPEG, PNG, JPG.',
        variant: 'destructive',
      });
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      toast({
        title: 'File Too Large',
        description: 'File must be smaller than 5MB.',
        variant: 'destructive',
      });
      return;
    }

  
    const reader = new FileReader();
    reader.onloadend = () => {
      setPreviewImage(reader.result as string);
    };
    reader.readAsDataURL(file);

    setFieldValue('file', [file]);
  };

  const clearImage = (setFieldValue: (field: string, value: any) => void) => {
    setPreviewImage(null);
    setFieldValue('file', null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleSubmit = async (values: any) => {
    const { password, mobile, file } = values;

    try {
      const reader = new FileReader();
      reader.readAsDataURL(file[0]);
      reader.onloadend = async () => {
        const base64Image = reader.result as string;

        try {
          const data = {
            token: token,
            password,
            mobile,
            image: base64Image
          }
          const response = await employeeSignupApi(data)
    
          const {role,email,_id,isBlock,name}  = response?.data?.newUser
          console.log(role)
          const payload = {role,email,_id,isBlock,name,token:response?.data?.token}
    
          dispatch(SetUser(payload))
          navigate('/employee/projects');
        } catch (error: any) {
          toast({
            title: 'Registration Failed',
            description: error?.response?.data?.message || 'An error occurred during registration.',
            variant: 'destructive',
          });
        }
      };
    } catch (error) {
      toast({
        title: 'Image Upload Failed',
        description: 'Unable to process the profile image.',
        variant: 'destructive',
      });
    }
  };

  return (
    <div>
      {token ? (
        <div className="relative min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-50 to-rose-50 p-4 py-32 overflow-hidden">
          <Toaster />
          <div className="w-full max-w-[1000px] flex rounded-3xl overflow-hidden bg-white shadow-[0_20px_50px_rgba(8,_112,_184,_0.07)] relative z-10">
            {/* Left Side - Animation */}
            <div className="rounded-md bg-neutral-950 relative flex flex-col items-center justify-center antialiased">
              <div className="max-w-2xl p-4">
                <h1 className="relative z-10 text-lg md:text-7xl bg-clip-text text-transparent bg-gradient-to-b from-neutral-200 to-neutral-600 text-center font-sans font-bold">
                  Join our team today
                </h1>
              </div>
              <BackgroundBeams />
            </div>

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
                  password: '',
                  confirmPassword: '',
                  mobile: '',
                  file: null
                }}
                validationSchema={validationSchema}
                onSubmit={handleSubmit}
              >
                {({ isSubmitting, setFieldValue }) => (
                  <Form className="space-y-4">
                                       <div className="space-y-2">
                      <Label className="block mb-2">Profile Picture</Label>
                      <div 
                        onDragEnter={(e) => {
                          e.preventDefault();
                          setDragActive(true);
                        }}
                        onDragLeave={(e) => {
                          e.preventDefault();
                          setDragActive(false);
                        }}
                        onDragOver={(e) => e.preventDefault()}
                        onDrop={(e) => handleDrop(e, setFieldValue)}
                        className={`relative w-full h-48 border-2 border-dashed rounded-xl transition-all duration-300 flex items-center justify-center 
                          ${dragActive 
                            ? 'border-indigo-500 bg-indigo-50' 
                            : 'border-gray-300 bg-gray-50 hover:border-indigo-500 hover:bg-indigo-50'}`}
                      >
                        {previewImage ? (
                          <div className="relative group">
                            <img 
                              src={previewImage}    
                              alt="Profile Preview" 
                              className="h-40 w-40 object-cover rounded-full shadow-lg"
                            />
                            <button
                              type="button"
                              onClick={() => clearImage(setFieldValue)}
                              className="absolute top-0 right-0 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                            >
                              <X size={16} />
                            </button>
                          </div>
                        ) : (
                          <div className="text-center">
                            <div className="flex justify-center mb-4">
                              <UploadCloud 
                                size={48} 
                                className="text-indigo-500 opacity-70 group-hover:opacity-100 transition-opacity"
                              />
                            </div>
                            <p className="text-gray-600">
                              Drag & drop your profile picture or 
                              <label 
                                htmlFor="file-upload" 
                                className="ml-1 text-indigo-600 cursor-pointer hover:underline"
                              >
                                browse
                              </label>
                            </p>
                            <p className="text-xs text-gray-500 mt-1">
                              PNG, JPG, GIF (max. 5MB)
                            </p>
                          </div>
                        )}
                        <input
                          ref={fileInputRef}
                          id="file-upload"
                          type="file"
                          accept="image/jpeg,image/png,image/gif"
                          onChange={(e) => handleFileChange(e, setFieldValue)}
                          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                        />
                      </div>
                      <ErrorMessage name="file" component="div" className="text-rose-500 text-sm mt-1" />
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
      ) : (
        <p>No token provided</p>
      )}
    </div>
  );
}

export default EmployeeSignUpHero;