import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import Input from '../../components/common/Input';
import Button from '../../components/common/Button';
import Toast from '../../components/common/Toast';
import { ShieldCheck, Sparkles } from 'lucide-react';

const Register = () => {
  const { register: registerUser } = useAuth();
  const navigate = useNavigate();
  const [serverError, setServerError] = useState('');
  const [toastMessage, setToastMessage] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    defaultValues: {
      name: '',
      email: '',
      password: '',
      specialization: 'Clinical Psychology',
      agreeTerms: false,
    },
  });

  const onSubmit = async (data) => {
    setServerError('');
    setSubmitting(true);
    try {
      await registerUser({
        name: data.name,
        email: data.email,
        password: data.password,
        specialization: data.specialization,
      });
      setToastMessage('Account created successfully! Redirecting...');
      setTimeout(() => {
        navigate('/dashboard');
      }, 1000);
    } catch (err) {
      setServerError(err.response?.data?.message || 'Failed to create account. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-bg-main flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <Toast message={toastMessage} type="success" onClose={() => setToastMessage('')} />

      <div className="sm:mx-auto sm:w-full sm:max-w-md text-center">
        <div className="inline-flex items-center gap-2.5 mb-3">
          <span className="w-3.5 h-3.5 rounded-full bg-sage ring-4 ring-sage/20"></span>
          <span className="text-2xl font-bold tracking-tight text-ink">unfazed</span>
        </div>
        <h2 className="text-2xl font-bold text-ink tracking-tight">Create your practice account</h2>
        <p className="mt-1 text-sm text-slate">
          Join leading therapists delivering calm, private, and seamless care.
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md px-4 sm:px-0">
        <div className="bg-bg-card-elevated py-8 px-6 sm:px-10 rounded-card shadow-card border border-border">
          {serverError && (
            <div className="mb-5 p-3 rounded-lg bg-error-bg text-error text-xs font-medium border border-error/20 flex items-center gap-2">
              <span className="font-bold">•</span>
              <span>{serverError}</span>
            </div>
          )}

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <Input
              label="Full Name"
              placeholder="e.g. Dr. Ananya Sharma"
              error={errors.name?.message}
              {...register('name', {
                required: 'Please enter your full name',
                minLength: { value: 3, message: 'Name must be at least 3 characters' },
              })}
            />

            <Input
              label="Professional Email"
              type="email"
              placeholder="ananya@yourdomain.com"
              error={errors.email?.message}
              {...register('email', {
                required: 'Please enter a valid email address.',
                pattern: {
                  value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                  message: 'Please enter a valid email address.',
                },
              })}
            />

            <Input
              label="Password"
              type="password"
              placeholder="Minimum 6 characters"
              error={errors.password?.message}
              helperText="Must be at least 6 characters"
              {...register('password', {
                required: 'Please enter a password',
                minLength: { value: 6, message: 'Password must be at least 6 characters long.' },
              })}
            />

            <div>
              <label className="block text-xs font-semibold text-ink uppercase tracking-wider mb-1.5">
                Primary Specialization
              </label>
              <select
                {...register('specialization')}
                className="w-full h-[44px] px-3.5 bg-bg-card text-ink text-sm rounded-[10px] border border-border focus:border-primary focus:ring-2 focus:ring-primary/20 focus:outline-none transition-colors"
              >
                <option value="Clinical Psychology">Clinical Psychology</option>
                <option value="Counseling Psychology">Counseling Psychology</option>
                <option value="Psychotherapy">Psychotherapy</option>
                <option value="Couples & Family Therapy">Couples & Family Therapy</option>
                <option value="Trauma & Somatic Care">Trauma & Somatic Care</option>
              </select>
            </div>

            <div className="flex items-start gap-2 pt-1">
              <input
                id="agreeTerms"
                type="checkbox"
                className="mt-1 h-4 w-4 rounded border-border text-primary focus:ring-primary accent-primary cursor-pointer"
                {...register('agreeTerms', {
                  required: 'You must agree to the Terms and Privacy Policy to continue',
                })}
              />
              <label htmlFor="agreeTerms" className="text-xs text-slate cursor-pointer select-none">
                I agree to the{' '}
                <span className="text-primary hover:underline font-medium">Terms of Service</span> and{' '}
                <span className="text-primary hover:underline font-medium">Privacy Policy</span>.
              </label>
            </div>
            {errors.agreeTerms && (
              <p className="text-xs text-error font-medium">• {errors.agreeTerms.message}</p>
            )}

            <div className="pt-2">
              <Button
                type="submit"
                variant="primary"
                loading={submitting}
                className="w-full text-sm font-semibold"
              >
                Create therapist account
              </Button>
            </div>
          </form>

          <div className="mt-6 text-center border-t border-border/60 pt-4">
            <p className="text-xs text-slate">
              Already have an account?{' '}
              <Link to="/login" className="font-semibold text-primary hover:text-primary-hover">
                Sign in
              </Link>
            </p>
          </div>
        </div>

        {/* Calm trust strip */}
        <div className="mt-6 flex items-center justify-center gap-4 text-xs text-slate">
          <span className="inline-flex items-center gap-1.5">
            <ShieldCheck className="w-4 h-4 text-sage" /> HIPAA & DPDP aligned
          </span>
          <span>•</span>
          <span className="inline-flex items-center gap-1.5">
            <Sparkles className="w-4 h-4 text-sage" /> Privacy-first architecture
          </span>
        </div>
      </div>
    </div>
  );
};

export default Register;
