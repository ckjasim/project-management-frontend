import React, { useEffect, useState } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { useToast } from '@/components/hooks/use-toast';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from '@/components/ui/input-otp';
import axios from 'axios';
import { Toaster } from '@/components/ui/toaster';
import { useNavigate } from 'react-router-dom';

const FormSchema = z.object({
  pin: z.string().min(6, {
    message: 'Your one-time password must be 6 characters.',
  }),
});

export function EmployeeOtpForm() {
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
    if (timerActive) return; 
  
    try {
      setRemainingTime(120);
      setTimerActive(true);
      const response = await axios.post(
        'http://localhost:3000/api/resendEmpOtp',
        {},
        { withCredentials: true }
      );
      console.log('OTP sent successfully:', response.data.message);
      toast({ title: 'OTP sent successfully', description: response.data.message });
    } catch (error: any) {
      console.error(
        'Error resending OTP:',
        error.response?.data?.message || 'An error occurred'
      );
      toast({ title: 'Error', description: error.response?.data?.message || 'An error occurred' });
    }
  };
  

  async function onSubmit(data: z.infer<typeof FormSchema>) {
    toast({
      title: 'You submitted the following values:',
      description: (
        <pre className="mt-2 w-[340px] rounded-md bg-slate-950 p-4">
          <code className="text-white">{JSON.stringify(data, null, 2)}</code>
        </pre>
      ),
    });
    try {
      const res = await axios.post(
        'http://localhost:3000/api/employeeOtp',
        { otp: data.pin },
        {
          withCredentials: true,
        }
      );
      console.log('OTP verification successful:', res.data.message);
      navigate('/employee/task');
    } catch (error: any) {
      console.error(
        'OTP verification error:',
        error.response?.data?.message || 'Error during OTP verification'
      );
    }
  }

  return (
    <div className="flex min-h-screen mt-32 justify-center">
      <Toaster/>
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="w-full max-w-md flex flex-col items-center space-y-6"
        >
          <FormField
            control={form.control}
            name="pin"
            render={({ field }) => (
              <FormItem className="flex flex-col items-center w-full">
                <FormLabel className="text-center">One-Time Password</FormLabel>
                <FormControl>
                  <InputOTP maxLength={6} {...field}>
                    <InputOTPGroup className="flex justify-center">
                      <InputOTPSlot index={0} />
                      <InputOTPSlot index={1} />
                      <InputOTPSlot index={2} />
                      <InputOTPSlot index={3} />
                      <InputOTPSlot index={4} />
                      <InputOTPSlot index={5} />
                    </InputOTPGroup>
                  </InputOTP>
                </FormControl>
                <FormDescription className="text-center">
                  Please enter the one-time password sent to your email.
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <div id="otpTimer" className="text-center text-red-700 font-semibold">
            {remainingTime > 0 ? formatTime(remainingTime) : '00:00'}
          </div>

          {!timerActive && (
            <span
              onClick={handleResendOTP}
              className="self-center cursor-pointer text-red-700 font-semibold text-sm"
            >
              Resend OTP?
            </span>
          )}

          <Button type="submit" className="self-center">
            Submit
          </Button>
        </form>
      </Form>
    </div>
  );
}
