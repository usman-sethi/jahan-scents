import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [isSignUp, setIsSignUp] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const token = localStorage.getItem('token');
    const userString = localStorage.getItem('user');
    if (token && userString) {
      try {
        const user = JSON.parse(userString);
        if (user.role === 'admin') {
          navigate('/admin');
        } else {
          const redirectUrl = location.state?.from || '/';
          navigate(redirectUrl);
        }
      } catch (e) {
        // Handle invalid JSON
      }
    }
  }, [navigate, location]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setMessage(null);

    try {
      if (isSignUp) {
        const response = await fetch('/api/auth/register', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({ email, password, name, phone })
        });
        
        let data;
        try {
          const text = await response.text();
          if (text.includes("Cookie check") || text.includes("Action required to load your app")) {
            throw new Error("Browser is blocking cookies in this preview. Please click 'Open App' (top right arrow icon) to use auth.");
          }
          try {
            data = JSON.parse(text);
          } catch(e) {
            data = { error: `Invalid response: ${text.substring(0, 40)}` };
          }
        } catch(e: any) {
           data = { error: e.message || 'Failed to read response body' };
        }
        
        if (!response.ok) {
          setError(data.error || 'Registration failed');
        } else {
          setMessage('Sign up successful! You can now sign in.');
          setIsSignUp(false);
        }
      } else {
        const response = await fetch('/api/auth/login', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({ email, password })
        });
        
        let data;
        try {
          const text = await response.text();
          if (text.includes("Cookie check") || text.includes("Action required to load your app")) {
            throw new Error("Browser is blocking cookies in this preview. Please click 'Open App' (top right arrow icon) to use auth.");
          }
          try {
            data = JSON.parse(text);
          } catch(e) {
            data = { error: `Invalid response: ${text.substring(0, 40)}` };
          }
        } catch(e: any) {
           data = { error: e.message || 'Failed to read response body' };
        }
        
        if (!response.ok) {
          setError(data.error || 'Login failed');
        } else {
          localStorage.setItem('token', data.token);
          localStorage.setItem('user', JSON.stringify(data.user));
          
          if (data.user.role === 'admin') {
            navigate('/admin');
          } else {
            const redirectUrl = location.state?.from || '/';
            navigate(redirectUrl);
          }
        }
      }
    } catch (err) {
      setError('An error occurred. Please try again.');
    }
  };

  return (
    <div className="min-h-screen bg-brand-cream flex items-center justify-center p-6 text-brand-black">
      <div className="w-full max-w-md bg-white p-10 shadow-xl rounded-sm border border-brand-black/5">
        <div className="flex justify-center items-center gap-4 mb-8">
          <img src="/logo.svg" alt="JAHAN" className="h-10 md:h-12 w-auto object-contain mix-blend-darken" />
          <span className="block text-3xl font-serif tracking-widest text-brand-black">JAHAN</span>
        </div>
        <h2 className="text-center font-serif text-xl mb-6">{isSignUp ? 'Create an Account' : 'Sign In'}</h2>
        
        {error && (
            <div className="bg-red-50 text-red-500 p-3 mb-6 border border-red-100 text-sm">{error}</div>
        )}
        {message && (
            <div className="bg-green-50 text-green-700 p-3 mb-6 border border-green-100 text-sm">{message}</div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          {isSignUp && (
            <>
              <div>
                <label className="block text-xs uppercase tracking-widest font-medium mb-2 opacity-70">Name</label>
                <input 
                  type="text" 
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full border-b border-brand-black/30 pb-2 px-2 focus:outline-none focus:border-brand-black transition-colors rounded-none bg-transparent"
                  required
                />
              </div>
              <div>
                <label className="block text-xs uppercase tracking-widest font-medium mb-2 opacity-70">Phone Number</label>
                <input 
                  type="tel" 
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full border-b border-brand-black/30 pb-2 px-2 focus:outline-none focus:border-brand-black transition-colors rounded-none bg-transparent"
                  required
                />
              </div>
            </>
          )}
          <div>
            <label className="block text-xs uppercase tracking-widest font-medium mb-2 opacity-70">Email</label>
            <input 
              type="email" 
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full border-b border-brand-black/30 pb-2 px-2 focus:outline-none focus:border-brand-black transition-colors rounded-none bg-transparent"
              required
            />
          </div>
          <div>
            <label className="block text-xs uppercase tracking-widest font-medium mb-2 opacity-70">Password</label>
            <input 
              type="password" 
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full border-b border-brand-black/30 pb-2 px-2 focus:outline-none focus:border-brand-black transition-colors rounded-none bg-transparent"
              required
            />
          </div>
          <button 
            type="submit"
            className="w-full bg-brand-black text-brand-white py-4 text-xs uppercase tracking-[0.15em] hover:bg-zinc-800 transition-colors mt-4"
          >
            {isSignUp ? 'Sign Up' : 'Sign In'}
          </button>
        </form>

        <div className="mt-8 text-center text-sm text-brand-black/70">
          {isSignUp ? (
            <p>
              Already have an account?{' '}
              <button type="button" onClick={() => setIsSignUp(false)} className="underline hover:text-brand-black transition-colors">
                Sign In
              </button>
            </p>
          ) : (
            <p>
              Don't have an account?{' '}
              <button type="button" onClick={() => setIsSignUp(true)} className="underline hover:text-brand-black transition-colors">
                Create one
              </button>
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
