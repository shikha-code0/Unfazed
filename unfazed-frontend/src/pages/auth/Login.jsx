import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import Input from '../../components/common/Input';
import Button from '../../components/common/Button';
import Toast from '../../components/common/Toast';
import { ShieldCheck, HeartHandshake, Sparkles } from 'lucide-react';

const Login = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [serverError, setServerError] = useState('');
  const [toastMessage, setToastMessage] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm({
    defaultValues: {
      email: '',
      password: '',
    },
  });

  const onSubmit = async (data) => {
    setServerError('');
    setSubmitting(true);
    try {
      await login(data.email, data.password);
      setToastMessage('Signed in successfully! Redirecting...');
      setTimeout(() => {
        navigate('/dashboard');
      }, 800);
    } catch (err) {
      setServerError(err.response?.data?.message || 'Invalid email or password. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleFillDemo = () => {
    setValue('email', 'ananya@unfazed.care');
    setValue('password', 'Password123!');
  };

  return (
    <div className="min-h-screen bg-bg-main flex">
      <Toast message={toastMessage} type="success" onClose={() => setToastMessage('')} />

      {/* Left Brand Panel (Desktop) */}
      <div className="hidden lg:flex lg:w-1/2 bg-bg-dark-sidebar border-r border-border/20 flex-col justify-between p-12 relative overflow-hidden">
        {/* Soft background ambient gradient */}
        <div className="absolute top-0 right-0 -mr-20 -mt-20 w-96 h-96 rounded-full bg-primary/20 blur-[100px] pointer-events-none"></div>
        <div className="absolute bottom-0 left-0 -ml-20 -mb-20 w-96 h-96 rounded-full bg-bg-main/10 blur-[100px] pointer-events-none"></div>

        {/* Top Logo */}
        <div className="relative z-10 flex items-center gap-2.5">
          <span className="w-3.5 h-3.5 rounded-full bg-sage ring-4 ring-sage/20"></span>
          <span className="text-2xl font-bold tracking-tight text-white">unfazed</span>
        </div>

        {/* Hero Quote */}
        <div className="relative z-10 max-w-md space-y-6">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/10 text-white text-xs font-medium border border-white/20">
            <HeartHandshake className="w-3.5 h-3.5 text-sage" />
            <span>Dedicated to mental health professionals</span>
          </div>
          <h1 className="font-serif text-3xl xl:text-4xl text-white leading-snug">
            “A calm, private space where clinical care meets seamless practice management.”
          </h1>
          <p className="text-sm text-bg-main leading-relaxed">
            Unfazed handles scheduling, confidential workflows, and public presence so you can focus on healing and human connection.
          </p>
        </div>

        {/* Trust Footnote */}
        <div className="relative z-10 flex items-center gap-4 text-xs text-white/80">
          <span className="inline-flex items-center gap-1.5">
            <ShieldCheck className="w-4 h-4 text-sage" /> Privacy-first architecture
          </span>
          <span>•</span>
          <span>End-to-end encrypted notes</span>
        </div>
      </div>

      {/* Right Form Container */}
      <div className="flex-1 flex flex-col justify-center py-12 px-4 sm:px-6 lg:px-16 xl:px-24">
        <div className="mx-auto w-full max-w-sm sm:max-w-md bg-bg-card-elevated p-6 sm:p-10 rounded-card shadow-card border border-border">
          {/* Mobile Logo */}
          <div className="lg:hidden flex items-center gap-2 mb-8">
            <span className="w-3 h-3 rounded-full bg-sage ring-4 ring-sage/20"></span>
            <span className="text-xl font-bold tracking-tight text-ink">unfazed</span>
          </div>

          <div className="mb-6">
            <h2 className="text-2xl font-bold text-ink tracking-tight">Welcome back</h2>
            <p className="text-sm text-slate mt-1">
              Continue managing your practice with clarity and ease.
            </p>
          </div>

          {/* Demo account helper pill */}
          <div className="mb-6 p-3.5 rounded-card bg-bg-card border border-border flex items-center justify-between">
            <div className="text-xs">
              <span className="font-semibold text-primary block">Test with Demo Account:</span>
              <span className="text-slate text-[11px]">ananya@unfazed.care</span>
            </div>
            <button
              type="button"
              onClick={handleFillDemo}
              className="text-xs font-semibold px-2.5 py-1 rounded-md bg-white border border-primary/30 text-primary hover:bg-primary hover:text-white transition-all shadow-xs"
            >
              Fill Demo
            </button>
          </div>

          {serverError && (
            <div className="mb-5 p-3.5 rounded-lg bg-error-bg text-error text-xs font-medium border border-error/20 flex items-center gap-2">
              <span className="font-bold">•</span>
              <span>{serverError}</span>
            </div>
          )}

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <Input
              label="Email address"
              type="email"
              placeholder="e.g. ananya@unfazed.care"
              error={errors.email?.message}
              {...register('email', {
                required: 'Please enter your email address',
                pattern: {
                  value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                  message: 'Please enter a valid email address.',
                },
              })}
            />

            <div>
              <Input
                label="Password"
                type="password"
                placeholder="Enter your password"
                error={errors.password?.message}
                {...register('password', {
                  required: 'Please enter your password',
                })}
              />
              <div className="flex justify-end mt-1.5">
                <a href="#forgot" className="text-xs font-medium text-slate hover:text-primary transition-colors">
                  Forgot password?
                </a>
              </div>
            </div>

            <div className="pt-2">
              <Button
                type="submit"
                variant="primary"
                loading={submitting}
                className="w-full text-sm font-semibold"
              >
                Sign in to your practice
              </Button>
            </div>
          </form>

          <div className="mt-8 text-center border-t border-border/70 pt-6">
            <p className="text-xs text-slate">
              New to Unfazed?{' '}
              <Link to="/register" className="font-semibold text-primary hover:text-primary-hover">
                Create your therapist account
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
