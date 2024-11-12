import React, { useEffect, useState } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { useToast } from '@/components/hooks/use-toast';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from '@/components/ui/form';
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from '@/components/ui/input-otp';
import { BackgroundBeams } from "@/components/ui/background-beams";
import axios from 'axios';
import { Toaster } from '@/components/ui/toaster';
import { useNavigate } from 'react-router-dom';

const FormSchema = z.object({
  pin: z.string().min(6, {
    message: 'Your one-time password must be 6 characters.',
  }),
});

export function InputOTPForm() {
  const { toast } = useToast();
  const navigate = useNavigate();
  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      pin: '',
    },
  });

  const [remainingTime, setRemainingTime] = useState(120);
  const [timerActive, setTimerActive] = useState(true);

  useEffect(() => {
    let timerInterval: NodeJS.Timeout;

    toast({
      title: "OTP send into your Email",
      variant: 'success'
    });

    if (timerActive) {
      timerInterval = setInterval(() => {
        setRemainingTime((prev) => {
          if (prev <= 1) {
            clearInterval(timerInterval);
            setTimerActive(false);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }

    return () => clearInterval(timerInterval);
  }, [timerActive]);

  const formatTime = (time: number) => {
    const minutes = Math.floor(time / 60);
    const seconds = time % 60;
    return `${minutes < 10 ? '0' + minutes : minutes}:${
      seconds < 10 ? '0' + seconds : seconds
    }`;
  };

  const handleResendOTP = async () => {
    try {
      setRemainingTime(120);
      setTimerActive(true);
      const response = await axios.post(
        'http://localhost:3000/api/resendOtp',
        {},
        { withCredentials: true }
      );
      console.log('OTP sent successfully:', response.data.message);
    } catch (error: any) {
      console.error(
        'Error resending OTP:',
        error.response?.data?.message || 'An error occurred'
      );
    }
  };

  async function onSubmit(data: z.infer<typeof FormSchema>) {
   
    try {
      const res = await axios.post(
        'http://localhost:3000/api/otp',
        { otp: data.pin },
        {
          withCredentials: true,
        }
      );
      toast({
        title: 'Verification Successful',
        description: 'Redirecting to dashboard...',
        variant: 'success'
      });
      navigate('/user/dashboard');
      console.log('OTP verification successful:', res.data.message);
    } catch (error: any) {
      toast({
        title: 'Verification Failed',
        description: error.response?.data?.message || 'Invalid OTP',
        variant: 'destructive'
      });
      console.error(
        'OTP verification error:',
        error.response?.data?.message || 'Error during OTP verification'
      );
    }
  }

  return (
    <div className="relative min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-50 to-rose-50 p-4 py-32 overflow-hidden">
      
      <div className="w-full max-w-[1000px] flex rounded-3xl overflow-hidden bg-white shadow-[0_20px_50px_rgba(8,_112,_184,_0.07)] relative z-10">
        {/* Left Side - Animation */}
        <div className="hidden lg:block w-1/2 rounded-md bg-neutral-950 relative flex flex-col items-center justify-center antialiased">
          <div className="max-w-2xl p-4">
            <h1 className="relative z-10 text-lg md:text-7xl bg-clip-text text-transparent bg-gradient-to-b from-neutral-200 to-neutral-600 text-center font-sans font-bold">
              Verify your email
            </h1>
          </div>
          <BackgroundBeams />
        </div>

        {/* Right Side - OTP Form */}
        <div className="w-full lg:w-1/2 p-8 md:p-12">
          <div className="mb-10">
            <h1 className="text-3xl font-bold bg-gradient-to-r from-indigo-600 to-rose-500 bg-clip-text text-transparent mb-2">
              Enter OTP
            </h1>
            <p className="text-slate-600">
              We've sent a verification code to your email
            </p>
          </div>

          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(onSubmit)}
              className="space-y-8"
            >
              <FormField
                control={form.control}
                name="pin"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <InputOTP
                        maxLength={6}
                        {...field}
                        className="flex justify-center gap-2"
                      >
                        <InputOTPGroup>
                          <InputOTPSlot 
                            index={0} 
                            className="w-12 h-12 text-lg border-slate-200 bg-slate-50/50 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
                          />
                          <InputOTPSlot 
                            index={1} 
                            className="w-12 h-12 text-lg border-slate-200 bg-slate-50/50 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
                          />
                          <InputOTPSlot 
                            index={2} 
                            className="w-12 h-12 text-lg border-slate-200 bg-slate-50/50 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
                          />
                          <InputOTPSlot 
                            index={3} 
                            className="w-12 h-12 text-lg border-slate-200 bg-slate-50/50 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
                          />
                          <InputOTPSlot 
                            index={4} 
                            className="w-12 h-12 text-lg border-slate-200 bg-slate-50/50 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
                          />
                          <InputOTPSlot 
                            index={5} 
                            className="w-12 h-12 text-lg border-slate-200 bg-slate-50/50 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
                          />
                        </InputOTPGroup>
                      </InputOTP>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="flex flex-col items-center space-y-4">
                <div className="text-indigo-600 font-semibold">
                  {remainingTime > 0 ? formatTime(remainingTime) : '00:00'}
                </div>

                {!timerActive && (
                  <button
                    type="button"
                    onClick={handleResendOTP}
                    className="text-indigo-600 hover:text-indigo-700 font-medium text-sm"
                  >
                    Resend OTP
                  </button>
                )}

                <button
                  type="submit"
                  className="w-full bg-gradient-to-r from-indigo-600 to-indigo-500 hover:from-indigo-700 hover:to-indigo-600 text-white font-medium py-3 rounded-xl transition-all duration-200 shadow-lg shadow-indigo-500/20 hover:shadow-indigo-500/30"
                >
                  Verify Email
                </button>
              </div>
            </form>
          </Form>
        </div>
      </div>
    </div>
  );
}

export default InputOTPForm;