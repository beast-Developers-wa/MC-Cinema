import React, { useState, useEffect, useCallback, useRef } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import '../styles/signup.css';
import { FaUser, FaEnvelope, FaPhone, FaEye, FaEyeSlash } from 'react-icons/fa';
import { auth, googleProvider, facebookProvider } from '../firebase';
import { signInWithPopup } from 'firebase/auth';
import ErrorRise from '../components/ErrorRise';    // Custom error popup
import SuccessRise from '../components/SuccessRise'; // Custom success popup

export default function Signup() {
  const navigate = useNavigate();
  const location = useLocation();

  const [formData, setFormData] = useState(
    location.state?.savedForm || { username: '', email: '', password: '', mobile: '' }
  );
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  const [acceptedTerms, setAcceptedTerms] = useState(location.state?.acceptedTerms || false);

  const hasClearedState = useRef(false);

  // Clear error/success messages after 4 seconds
  useEffect(() => {
    if (errorMsg || successMsg) {
      const timer = setTimeout(() => {
        setErrorMsg('');
        setSuccessMsg('');
      }, 4000);
      return () => clearTimeout(timer);
    }
  }, [errorMsg, successMsg]);

  // Clear location.state after first use (to prevent resubmission)
  useEffect(() => {
    if (location.state && !hasClearedState.current) {
      hasClearedState.current = true;
      navigate(location.pathname, { replace: true, state: {} });
    }
  }, [location, navigate]);

  const handleChange = useCallback((e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errorMsg) setErrorMsg('');
    if (successMsg) setSuccessMsg('');
  }, [errorMsg, successMsg]);

 const handleSubmit = useCallback(
  async (e) => {
    e.preventDefault();
    const { username, email, password, mobile } = formData;

    // Validation
    if (!username.trim() || !email.trim() || !password || !mobile.trim()) {
      setErrorMsg('Please fill all fields.');
      return;
    }
    if (!acceptedTerms) {
      setErrorMsg('Please accept the Terms and Conditions to signup.');
      return;
    }

    setLoading(true);
    setErrorMsg('');
    setSuccessMsg('');

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 10000); // 10s timeout

    try {
      const res = await fetch('http://192.168.149.99:5000/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ username, email, password, mobile }),
        signal: controller.signal,
      });

      clearTimeout(timeoutId);

      let data = {};
      try {
        data = await res.json();
      } catch {
        // ignore JSON parse errors
      }

      if (res.ok) {
        setSuccessMsg(data?.message || 'Signup successful!');
        setFormData({ username: '', email: '', password: '', mobile: '' });
        setAcceptedTerms(false);

        // Redirect to login after a short delay to show success message
        setTimeout(() => {
          navigate('/login');
        }, 1500);
      } else {
        setErrorMsg(data?.message || `Signup failed with status ${res.status}`);
      }
    } catch (err) {
      clearTimeout(timeoutId);
      if (err.name === 'AbortError') {
        setErrorMsg('Signup request timed out. Please try again.');
      } else {
        setErrorMsg('Network error: unable to signup.');
      }
    } finally {
      setLoading(false);
    }
  },
  [formData, acceptedTerms, navigate] // added navigate to deps
);

  const handleSocialLogin = useCallback(
    async (provider, successMsgText, errorMsgText) => {
      setLoading(true);
      setErrorMsg('');
      setSuccessMsg('');
      try {
        await signInWithPopup(auth, provider);
        setSuccessMsg(successMsgText);
      } catch (error) {
        setErrorMsg(error.message || errorMsgText || 'Social login failed.');
      } finally {
        setLoading(false);
      }
    },
    []
  );

  const handleTermsChange = useCallback(
    (e) => {
      if (e.target.checked) {
        // Navigate to terms page for acceptance confirmation
        navigate('/terms', { state: { savedForm: formData, acceptedTerms: false } });
      } else {
        setAcceptedTerms(false);
      }
    },
    [formData, navigate]
  );

  const openTerms = useCallback(() => {
    navigate('/terms', { state: { savedForm: formData, acceptedTerms } });
  }, [formData, acceptedTerms, navigate]);

  return (
    <div className="auth-container" aria-live="polite">
      <h2>Signup</h2>

      <form onSubmit={handleSubmit} noValidate>
        {[
          { type: 'text', name: 'username', placeholder: 'Username', icon: <FaUser /> },
          { type: 'email', name: 'email', placeholder: 'Email', icon: <FaEnvelope /> },
          { type: 'tel', name: 'mobile', placeholder: 'Mobile Number', icon: <FaPhone /> },
        ].map(({ type, name, placeholder, icon }) => (
          <div className="input-group" key={name}>
            <input
              type={type}
              name={name}
              placeholder={placeholder}
              value={formData[name]}
              onChange={handleChange}
              disabled={loading}
              required
              aria-label={placeholder}
              autoComplete={name === 'email' ? 'email' : name === 'mobile' ? 'tel' : 'off'}
            />
            <span className="icon-right" aria-hidden="true">{icon}</span>
          </div>
        ))}

        <div className="input-group">
          <input
            type={showPassword ? 'text' : 'password'}
            name="password"
            placeholder="Password"
            value={formData.password}
            onChange={handleChange}
            disabled={loading}
            required
            autoComplete="new-password"
            aria-label="Password"
          />
          <span
            className="icon-right toggle-password"
            role="button"
            tabIndex={0}
            onClick={() => setShowPassword((v) => !v)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                setShowPassword((v) => !v);
              }
            }}
            aria-label={showPassword ? 'Hide password' : 'Show password'}
          >
            {showPassword ? <FaEyeSlash /> : <FaEye />}
          </span>
        </div>

        <div className="terms-checkbox">
          <input
            type="checkbox"
            id="acceptTerms"
            checked={acceptedTerms}
            onChange={handleTermsChange}
            disabled={loading}
            aria-checked={acceptedTerms}
            aria-describedby="terms-desc"
          />
          <label htmlFor="acceptTerms">
            I accept the{' '}
            <span
              className="terms-link"
              onClick={openTerms}
              style={{ cursor: 'pointer', textDecoration: 'underline' }}
              role="button"
              tabIndex={0}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault();
                  openTerms();
                }
              }}
              aria-label="Open Terms and Conditions"
            >
              Terms and Conditions
            </span>
          </label>
          <p id="terms-desc" className="sr-only">
            You must accept terms and conditions before signing up.
          </p>
        </div>

        <div className="social-login-buttons">
          <button
            type="button"
            className="google-btn"
            onClick={() =>
              handleSocialLogin(
                googleProvider,
                'Google login successful!',
                'Google login failed'
              )
            }
            disabled={loading}
            aria-label="Continue with Google"
          >
            <img
              src="https://developers.google.com/identity/images/g-logo.png"
              alt="Google icon"
              className="social-icon"
              loading="lazy"
            />
            Continue with Google
          </button>

          <button
            type="button"
            className="facebook-btn"
            onClick={() =>
              handleSocialLogin(
                facebookProvider,
                'Facebook login successful!',
                'Facebook login failed'
              )
            }
            disabled={loading}
            aria-label="Continue with Facebook"
          >
            <img
              src="https://upload.wikimedia.org/wikipedia/commons/0/05/Facebook_Logo_%282019%29.png"
              alt="Facebook icon"
              className="social-icon"
              loading="lazy"
            />
            Continue with Facebook
          </button>
        </div>

        <div className="button-wrapper">
          <button
            type="submit"
            disabled={loading}
            aria-busy={loading}
            aria-live="polite"
            className="signup-btn"
          >
            {loading ? 'Please wait...' : 'Signup'}
          </button>
        </div>

        <ErrorRise message={errorMsg} trigger={!!errorMsg} />
        <SuccessRise message={successMsg} trigger={!!successMsg} />

        <div className="login">
          <p className="redirectlink">
            Already have an account?{' '}
            <Link to="/login" className="linktext">
              Login
            </Link>
          </p>
        </div>
      </form>
    </div>
  );
}
