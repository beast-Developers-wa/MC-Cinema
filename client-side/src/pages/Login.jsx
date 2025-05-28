import React, { useState } from 'react';
import '../styles/login.css';
import { FaEnvelope, FaEye, FaEyeSlash } from 'react-icons/fa';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const Login = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [emailOrUsername, setEmailOrUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setErrorMsg('');

   
    if (!emailOrUsername.trim() || !password.trim()) {
      setErrorMsg('Please enter email/username and password');
      return;
    }

    setLoading(true);
    try {
      const res = await axios.post(
        ' http://your-ip:5000/login',
        { emailOrUsername, password },
        { withCredentials: true }
      );

      if (res.status === 200) {
        toast.success('Login successful!');
      
        setEmailOrUsername('');
        setPassword('');
        navigate('/home');
      } else {
        setErrorMsg('Unexpected response from server.');
      }
    } catch (error) {
      console.error('Login error:', error);
      setErrorMsg(error.response?.data?.msg || 'Login failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="auth-container fade-in">
      <section className="login-container">
        <h2>Login to MC-Cinema</h2>
        <form onSubmit={handleLogin} noValidate>
          <div className="input-group">
            <input
              type="text"
              placeholder="Email or Username"
              value={emailOrUsername}
              onChange={(e) => setEmailOrUsername(e.target.value)}
              required
              disabled={loading}
              autoComplete="username"
              aria-label="Email or Username"
            />
            <span className="icon-right"><FaEnvelope /></span>
          </div>

          <div className="input-group">
            <input
              type={showPassword ? 'text' : 'password'}
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              disabled={loading}
              autoComplete="current-password"
              aria-label="Password"
            />
            <span
              className="icon-right toggle-password"
              role="button"
              tabIndex={0}
              onClick={() => setShowPassword(!showPassword)}
              onKeyDown={(e) => e.key === 'Enter' && setShowPassword(!showPassword)}
              aria-label={showPassword ? 'Hide password' : 'Show password'}
            >
              {showPassword ? <FaEyeSlash /> : <FaEye />}
            </span>
          </div>

          {errorMsg && <p className="error-msg" role="alert">{errorMsg}</p>}

          <div className="forgot-password">
            <Link to="/forgot-password">Forgot Password?</Link>
          </div>

          <p className="auth-alt">
            Don’t have an account? <Link to="/signup">Sign up</Link>
          </p>

          <button type="submit" className="auth-button" disabled={loading}>
            {loading ? 'Logging in...' : 'Login'}
          </button>
        </form>
      </section>
    </main>
  );
};

export default Login;
