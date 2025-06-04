import React, { useCallback } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import '../styles/terms.css';

const Terms = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const savedForm = location.state?.savedForm ?? null;

  const handleAccept = useCallback(() => {
    navigate('/signup', {
      state: {
        acceptedTerms: true,
        savedForm,
      },
      replace: true,
    });
  }, [navigate, savedForm]);

  const handleDecline = useCallback(() => {
    navigate('/signup', {
      state: {
        acceptedTerms: false,
      },
      replace: true,
    });
  }, [navigate]);

  return (
    <main className="terms-container" aria-label="Terms and Conditions">
      <h1>Terms and Conditions</h1>
      
<>
  <h3>Introduction</h3>
  <p>
    Welcome to our ecommerce platform. By using our site, you agree to comply with and be bound by these Terms and Conditions.
  </p>

  <h3>Eligibility</h3>
  <p>
    You must be at least 18 years old to create an account and make purchases.
  </p>

  <h3>Product Availability</h3>
  <p>
    All products are subject to availability, and we reserve the right to refuse or cancel any orders.
  </p>

  <h3>Pricing and Descriptions</h3>
  <p>
    Prices, descriptions, and availability of products may change without notice.
  </p>

  <h3>Privacy and Data Protection</h3>
  <p>
    Your personal information will be protected and handled according to our Privacy Policy.
  </p>

  <h3>User Conduct</h3>
  <p>
    Unauthorized use of our website or attempts to disrupt service may result in legal action.
  </p>

  <h3>Order Confirmation</h3>
  <p>
    You will receive an order confirmation email after placing an order, but this does not guarantee acceptance of your order.
  </p>

  <h3>Payment Terms</h3>
  <p>
    Payments must be made through our approved payment methods. We do not store your payment information.
  </p>

  <h3>Shipping and Delivery</h3>
  <p>
    Shipping times are estimates and may vary. We are not responsible for delays caused by third-party carriers.
  </p>

  <h3>Returns and Refunds</h3>
  <p>
    Returns and refunds are subject to our Return Policy. Please review it carefully before making a purchase.
  </p>
</>



      <div className="buttons" role="group" aria-label="Terms acceptance actions">
        <button
          className="accept"
          onClick={handleAccept}
          aria-label="Accept Terms and Conditions"
          type="button"
        >
          Accept
        </button>
        <button
          className="decline"
          onClick={handleDecline}
          aria-label="Decline Terms and Conditions"
          type="button"
        >
          Decline
        </button>
      </div>
    </main>
  );
};

export default Terms;
