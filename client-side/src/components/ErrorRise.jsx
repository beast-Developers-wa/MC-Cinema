import React, { useEffect, useState } from 'react';
import '../styles/errorRise.css';

const ErrorRise = ({ message, trigger }) => {
  const [animate, setAnimate] = useState(false);

  useEffect(() => {
    if (trigger) {
      setAnimate(true);
      const timer = setTimeout(() => setAnimate(false), 1500); 
      return () => clearTimeout(timer);
    }
  }, [trigger]);

  if (!message) return null;

  return (
    <div className={`error-rise ${animate ? 'animate' : ''}`}>
      {message}
    </div>
  );
};

export default ErrorRise;
