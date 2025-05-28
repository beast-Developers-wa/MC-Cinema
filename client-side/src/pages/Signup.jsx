import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import '../styles/signup.css';
import ErrorRise from '../components/ErrorRise';
import SuccessRise from '../components/SuccessRise';
import { FaUser, FaEnvelope, FaPhone, FaEye, FaEyeSlash } from 'react-icons/fa';

export default function Signup() {
  const navigate = useNavigate();
  const location = useLocation();


  const [formData, setFormData] = useState(() => {
    return location.state && location.state.savedForm
      ? location.state.savedForm
      : { username: '', email: '', password: '', mobile: '' };
  });

  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  const [triggerError, setTriggerError] = useState(false);
  const [triggerSuccess, setTriggerSuccess] = useState(false);


  const [acceptedTerms, setAcceptedTerms] = useState(() => {
    return location.state && location.state.acceptedTerms
      ? true
      : false;
  });


  useEffect(() => {
    if (triggerError) {
      const timer = setTimeout(() => setTriggerError(false), 2100);
      return () => clearTimeout(timer);
    }
  }, [triggerError]);


  useEffect(() => {
    if (triggerSuccess) {
      const timer = setTimeout(() => setTriggerSuccess(false), 2100);
      return () => clearTimeout(timer);
    }
  }, [triggerSuccess]);


  useEffect(() => {
    if (location.state && (location.state.acceptedTerms || location.state.savedForm)) {
      navigate(location.pathname, { replace: true, state: {} });
    }
  }, [location, navigate]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setErrorMsg('');
    setSuccessMsg('');
    setTriggerError(false);
    setTriggerSuccess(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const { username, email, password, mobile } = formData;

    if (!username || !email || !password || !mobile) {
      setErrorMsg('Please fill all fields');
      setTriggerError(true);
      return;
    }

    if (!acceptedTerms) {
      setErrorMsg('Please accept the Terms and Conditions to signup.');
      setTriggerError(true);
      return;
    }

    setLoading(true);
    setErrorMsg('');
    setSuccessMsg('');

    try {
      const res = await fetch('http://192.168.43.16:5000/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, email, password, mobile }),
      });

      const data = await res.json();

      if (res.ok) {
        setSuccessMsg(data.message || 'Signup successful!');
        setTriggerSuccess(true);
        setFormData({ username: '', email: '', password: '', mobile: '' });
        
      } else {
        setErrorMsg(data.message || 'Signup failed');
        setTriggerError(true);
      }
    } catch (err) {
      setErrorMsg('Network error: unable to signup');
      setTriggerError(true);
    } finally {
      setLoading(false);
    }
  };

  const handleSocialClick = (provider) => {
    setErrorMsg(`The ${provider} integration is coming soon. Stay tuned!`);
    setTriggerError(true);
    setSuccessMsg('');
    setTriggerSuccess(false);
  };

  return (
    <div className="auth-container">
      <h2>Signup</h2>
      <form onSubmit={handleSubmit}>

        <div className="input-group">
          <input
            type="text"
            name="username"
            placeholder="Username"
            value={formData.username}
            onChange={handleChange}
            required
            aria-label="Username"
            disabled={loading}
          />
          <span className="icon-right"><FaUser /></span>
        </div>

        <div className="input-group">
          <input
            type="email"
            name="email"
            placeholder="Email"
            value={formData.email}
            onChange={handleChange}
            required
            aria-label="Email"
            disabled={loading}
          />
          <span className="icon-right"><FaEnvelope /></span>
        </div>

        <div className="input-group">
          <input
            type="text"
            name="mobile"
            placeholder="Mobile Number"
            value={formData.mobile}
            onChange={handleChange}
            required
            aria-label="Mobile Number"
            disabled={loading}
          />
          <span className="icon-right"><FaPhone /></span>
        </div>

        <div className="input-group">
          <input
            type={showPassword ? 'text' : 'password'}
            name="password"
            placeholder="Password"
            value={formData.password}
            onChange={handleChange}
            required
            aria-label="Password"
            disabled={loading}
          />
          <span
            className="icon-right toggle-password"
            role="button"
            tabIndex={0}
            aria-label="Toggle password visibility"
            onClick={() => setShowPassword(!showPassword)}
            onKeyDown={(e) => e.key === 'Enter' && setShowPassword(!showPassword)}
          >
            {showPassword ? <FaEyeSlash /> : <FaEye />}
          </span>
        </div>

     
        <div className="terms-checkbox">
          <input
            type="checkbox"
            id="acceptTerms"
            checked={acceptedTerms}
            onChange={(e) => {
              if (e.target.checked) {
                navigate('/terms', {
                  state: { fromSignup: true, savedForm: formData },
                });
              } else {
                setAcceptedTerms(false);
              }
            }}
            disabled={loading}
          />
          <label htmlFor="acceptTerms">
            I accept the <span>Terms and Conditions</span>
          </label>
        </div>

        <div className="social-login-buttons">
          <button type="button" className="google-btn" onClick={() => handleSocialClick('Google')}>
            <img
              src="https://developers.google.com/identity/images/g-logo.png"
              alt="Google icon"
              className="social-icon"
            />
            Continue with Google
          </button>

          <button type="button" className="facebook-btn" onClick={() => handleSocialClick('Facebook')}>
            <img
              src="https://upload.wikimedia.org/wikipedia/commons/0/05/Facebook_Logo_%282019%29.png"
              alt="Facebook icon"
              className="social-icon"
            />
            Continue with Facebook
          </button>
        </div>

        <div className="button-wrapper">
          <button type="submit" disabled={loading}>
            {loading ? 'Signing up...' : 'Signup'}
          </button>
        </div>

        <div className="auth-redirect">
          <p>
            Already signed up? <Link to="/login" aria-label="Login page">Login</Link>
          </p>
        </div>
      </form>

      <ErrorRise message={errorMsg} trigger={triggerError} />
      <SuccessRise message={successMsg} trigger={triggerSuccess} />
    </div>
  );
}
