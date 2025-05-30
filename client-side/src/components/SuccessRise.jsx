import React, { useEffect, useState } from 'react';
import '../styles/successRise.css';
import { useNavigate } from 'react-router-dom'; 

const SuccessRise = ({ message, trigger }) => {
  const [animate, setAnimate] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    if (trigger) {
      setAnimate(true);
      const timer = setTimeout(() => {
        setAnimate(false);
        navigate('/login'); 
      }, 2000); 
      return () => clearTimeout(timer);
    }
  }, [trigger, navigate]);

  if (!message) return null;

  return (
    <div className={`success-rise ${animate ? 'animate' : ''}`}>
      {message}
    </div>
  );
};

export default SuccessRise;