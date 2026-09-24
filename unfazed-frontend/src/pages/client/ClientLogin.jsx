import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import Button from '../../components/common/Button';
import Input from '../../components/common/Input';
import Toast from '../../components/common/Toast';
import { Lock } from 'lucide-react';

const ClientLogin = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const { loginClient } = useAuth();
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const res = await loginClient(email, password);
      if (res.success) {
        navigate('/portal');
      } else {
        setError(res.message || 'Login failed');
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex bg-bg-main items-center justify-center p-4">
      {error && <Toast message={error} type="error" onClose={() => setError('')} />}
      
      <div className="max-w-md w-full bg-bg-card rounded-2xl p-8 border border-border shadow-card">
        <div className="text-center mb-8">
          <div className="mx-auto w-12 h-12 bg-primary/10 flex items-center justify-center rounded-xl mb-4">
            <Lock className="w-6 h-6 text-primary" />
          </div>
          <h2 className="text-2xl font-serif font-bold text-ink mb-2">Client Portal Access</h2>
          <p className="text-slate text-sm">Sign in to manage your appointments, intake forms, and billing.</p>
        </div>

        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="block text-sm font-semibold text-ink mb-1.5">Email Address</label>
            <Input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-ink mb-1.5">Password</label>
            <Input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter your password"
              required
            />
          </div>

          <Button
            type="submit"
            variant="primary"
            className="w-full justify-center mt-2"
            disabled={loading}
          >
            {loading ? 'Signing In...' : 'Sign In'}
          </Button>
        </form>
        
        <div className="mt-6 text-center text-xs text-slate">
          If this is your first time here, please check your email for the login instructions provided by your therapist.
        </div>
      </div>
    </div>
  );
};

export default ClientLogin;
