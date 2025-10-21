"use client";
import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { loginSchema, LoginValues } from '@schemas/auth.schema';
import { useAuth } from '@hooks/useAuth';
import { useToast } from '@components/ui/toast';
import { useRouter } from 'next/navigation';
import { cn } from '@lib/utils';
import { Button } from '@components/ui/button';
import { Input } from '@components/ui/input';
import { Card, CardHeader, CardTitle, CardContent } from '@components/ui/card';
import { Eye, EyeOff } from 'lucide-react';

function FieldGroup({ children }: { children: React.ReactNode }) {
  return <div className="flex flex-col gap-4">{children}</div>;
}

function Field({ children }: { children: React.ReactNode }) {
  return <div className="flex flex-col gap-2">{children}</div>;
}

function FieldLabel(props: React.LabelHTMLAttributes<HTMLLabelElement>) {
  return <label {...props} className={cn('text-sm font-medium', props.className)} />;
}

function FieldDescription({ children, className }: React.PropsWithChildren<{ className?: string }>) {
  return <p className={cn('text-xs text-gray-500', className)}>{children}</p>;
}

export default function LoginPage() {
  const { login, loginState, user, meLoading } = useAuth();
  const { toast } = useToast();
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [isTransitioning, setIsTransitioning] = useState(false);
  
  useEffect(() => { 
    if (!meLoading && user && !isTransitioning) {
      setIsTransitioning(true);
      
      // Add smooth transition overlay
      const overlay = document.createElement('div');
      overlay.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: rgba(255, 255, 255, 0.9);
        backdrop-filter: blur(4px);
        z-index: 9999;
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 14px;
        color: #666;
      `;
      overlay.textContent = 'Redirecting to dashboard...';
      document.body.appendChild(overlay);
      
      // Navigate with slight delay to show transition
      setTimeout(() => {
        window.location.href = '/products';
      }, 500);
    }
  }, [user, meLoading, isTransitioning]);
  
  const { register, handleSubmit, formState: { errors } } = useForm<LoginValues>({ resolver: zodResolver(loginSchema), defaultValues: { email: '', password: '' } });
  const onSubmit = async (values: LoginValues) => {
    try { 
      await login(values); 
      toast({ message: 'Logged in', variant: 'success' }); 
    } catch { 
      toast({ message: 'Login failed', variant: 'error' }); 
    }
  };
  if (meLoading || (user && loginState.isLoading) || isTransitioning) return <div className="flex items-center justify-center h-screen"><p className="text-sm text-gray-600">Loading...</p></div>;
  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <div className="flex flex-col gap-6 w-full max-w-md">
      <Card>
        <CardHeader>
          <CardTitle>Login to your account</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <FieldGroup>
              <Field>
                <FieldLabel htmlFor="email">Email</FieldLabel>
                <Input id="email" type="email" placeholder="patrick@demo.com" required {...register('email')} />
                {errors.email && <p className="text-red-600 text-xs mt-1">{errors.email.message}</p>}
              </Field>
              <Field>
                <div className="flex items-center">
                  <FieldLabel htmlFor="password">Password</FieldLabel>
                </div>
                <div className="relative">
                  <Input 
                    id="password" 
                    type={showPassword ? "text" : "password"} 
                    required 
                    {...register('password')} 
                    className="pr-10"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600"
                  >
                    {showPassword ? (
                      <EyeOff className="h-4 w-4" />
                    ) : (
                      <Eye className="h-4 w-4" />
                    )}
                  </button>
                </div>
                {errors.password && <p className="text-red-600 text-xs mt-1">{errors.password.message}</p>}
              </Field>
              <Field>
                <div className="flex flex-col gap-2">
                  <Button type="submit" disabled={loginState.isLoading || isTransitioning}>
                    {isTransitioning ? 'Redirecting...' : (loginState.isLoading ? 'Logging in...' : 'Login')}
                  </Button>
                  <FieldDescription className="text-center">Use demo credentials: patrick@demo.com / demopass123</FieldDescription>
                  {loginState.isError && <p className="text-red-600 text-xs">Invalid credentials</p>}
                </div>
              </Field>
            </FieldGroup>
          </form>
        </CardContent>
      </Card>
      </div>
    </div>
  );
}
