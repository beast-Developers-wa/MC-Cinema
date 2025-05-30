import React, { useState, useEffect, useCallback, useRef, useMemo } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import '../styles/login.css';
import { FaEnvelope, FaEye, FaEyeSlash } from 'react-icons/fa';
import { auth, googleProvider, facebookProvider } from '../firebase';
import { signInWithPopup } from 'firebase/auth';
import ErrorRise from '../components/ErrorRise';
import SuccessRise from '../components/SuccessRise';

export default function Login() {
  const navigate = useNavigate();
  const location = useLocation();
  const hasClearedState = useRef(false);

  const [formData, setFormData] = useState({ email: '', password: '' });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  const providers = useMemo(() => ({
    google: googleProvider,
    facebook: facebookProvider,
  }), []);

  // Clear error/success messages after 1.5s
  useEffect(() => {
    if (errorMsg || successMsg) {
      const timer = setTimeout(() => {
        setErrorMsg('');
        setSuccessMsg('');
      }, 1500);
      return () => clearTimeout(timer);
    }
  }, [errorMsg, successMsg]);

  // Clear location.state on mount to avoid stale redirects
  useEffect(() => {
    if (location.state && !hasClearedState.current) {
      hasClearedState.current = true;
      navigate(location.pathname, { replace: true, state: {} });
    }
  }, [location, navigate]);

  const handleChange = useCallback((e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    setErrorMsg('');
    setSuccessMsg('');
  }, []);

  // Backend login - save token on success
  const backendLogin = useCallback(async () => {
    const { email, password } = formData;

    try {
      const response = await fetch('http://localhost:5000/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include', // to handle httpOnly cookies if any
        body: JSON.stringify({ emailOrUsername: email, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.msg || 'Login failed');
      }

      if (!data.accessToken) {
        throw new Error('No access token received');
      }

      localStorage.setItem('accessToken', data.accessToken);

      return data;
    } catch (err) {
      throw new Error(err.message || 'Network error');
    }
  }, [formData]);

  const handleSubmit = useCallback(async (e) => {
    e.preventDefault();
    if (loading) return;

    const { email, password } = formData;

    if (!email.trim() || !password.trim()) {
      setErrorMsg('Please enter both email and password.');
      return;
    }

    setLoading(true);
    try {
      await backendLogin();
      setSuccessMsg('Login successful! Redirecting...');
      setFormData({ email: '', password: '' });
      setTimeout(() => navigate('/home', { replace: true }), 1500);
    } catch (error) {
      console.error('Login error:', error);
      setErrorMsg(error.message || 'Login failed.');
    } finally {
      setLoading(false);
    }
  }, [formData, backendLogin, loading, navigate]);

  const handleSocialLogin = useCallback(
    async (providerKey, successText, failText) => {
      if (loading) return;

      const provider = providers[providerKey];
      setLoading(true);
      setErrorMsg('');
      setSuccessMsg('');

      try {
        await signInWithPopup(auth, provider);
        setSuccessMsg(successText);
        setTimeout(() => navigate('/home', { replace: true }), 1500);
      } catch (error) {
        console.error(`${providerKey} login error:`, error);
        setErrorMsg(error.message || failText);
      } finally {
        setLoading(false);
      }
    },
    [providers, loading, navigate]
  );

  return (
    <div className="auth-container" aria-live="polite">
      <h2>Login</h2>

      <form onSubmit={handleSubmit} noValidate>
        <div className="input-group">
          <input
            type="email"
            name="email"
            placeholder="Email"
            value={formData.email}
            onChange={handleChange}
            disabled={loading}
            required
            autoComplete="email"
            aria-label="Email"
          />
          <span className="icon-right"><FaEnvelope /></span>
        </div>

        <div className="input-group">
          <input
            type={showPassword ? 'text' : 'password'}
            name="password"
            placeholder="Password"
            value={formData.password}
            onChange={handleChange}
            disabled={loading}
            required
            autoComplete="current-password"
            aria-label="Password"
          />
          <span
            className="icon-right toggle-password"
            role="button"
            tabIndex={0}
            onClick={() => setShowPassword(v => !v)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                setShowPassword(v => !v);
              }
            }}
            aria-label={showPassword ? 'Hide password' : 'Show password'}
          >
            {showPassword ? <FaEyeSlash /> : <FaEye />}
          </span>
        </div>

        {/* Optional: Forgot Password link */}
        <div className="forgot-password">
          <Link to="/forgot-password">Forgot Password?</Link>
        </div>

        <div className="social-login-buttons">
          <button
            type="button"
            className="google-btn"
            onClick={() =>
              handleSocialLogin('google', 'Google login successful!', 'Google login failed')
            }
            disabled={loading}
            aria-label="Continue with Google"
          >
            <img
              src="https://developers.google.com/identity/images/g-logo.png"
              alt="Google icon"
              className="social-icon"
            />
            Continue with Google
          </button>

          <button
            type="button"
            className="facebook-btn"
            onClick={() =>
              handleSocialLogin('facebook', 'Facebook login successful!', 'Facebook login failed')
            }
            disabled={loading}
            aria-label="Continue with Facebook"
          >
            <img
              src="https://upload.wikimedia.org/wikipedia/commons/0/05/Facebook_Logo_%282019%29.png"
              alt="Facebook icon"
              className="social-icon"
            />
            Continue with Facebook
          </button>
        </div>

        <div className="button-wrapper">
          <button
            type="submit"
            disabled={loading}
            className="login-btn"
            aria-busy={loading}
          >
            {loading ? 'Please wait...' : 'Login'}
          </button>
        </div>

        <div className="signup">
          <span>Don't have an account? </span>
          <Link to="/signup">Sign Up</Link>
        </div>

        <ErrorRise message={errorMsg} trigger={!!errorMsg} />
        <SuccessRise message={successMsg} trigger={!!successMsg} />
      </form>
    </div>
  );
}
