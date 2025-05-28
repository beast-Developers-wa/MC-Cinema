import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import '../styles/terms.css';

const Terms = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const handleAccept = () => {
    if (location.state?.fromSignup) {
      navigate('/signup', {
        state: {
          fromTerms: true,
           acceptedTerms: true,
          savedForm: location.state.savedForm,
        },
      });
    } else {
      navigate('/signup');
    }
  };

const handleDecline = () => {
  navigate('/signup', { state: { acceptedTerms: false } });
};

  return (
    <div className="terms-container">
      <h1>Terms and Conditions</h1>
      <div className="terms-text">
        <p>
          Welcome to our E-Commerce Platform. By accessing or using our website, you agree to be bound by these Terms and Conditions. We encourage you to read this document carefully before proceeding.
        </p>

        <h3>Acceptance of Terms</h3>
        <p>
          Creating an account, browsing products, or making purchases signifies your full acceptance of these Terms. If you disagree with any provision, please refrain from using the platform.
        </p>

        <h3>Account Registration</h3>
        <p>
          Access to certain features requires registration. You commit to providing truthful, accurate information and keeping your account credentials confidential. You are responsible for all activity under your account.
        </p>

        <h3>Orders and Payment</h3>
        <p>
          All purchases depend on product availability and order confirmation. Prices and shipping fees may change, but confirmed orders will not be affected. Payments are securely processed through trusted payment gateways.
        </p>

        <h3>Shipping and Delivery</h3>
        <p>
          Delivery timelines vary based on your location and the shipping option selected. We disclaim liability for delays caused by third parties such as shipping carriers or customs authorities.
        </p>

        <h3>Returns and Refunds</h3>
        <p>
          You may return eligible products within 14 days of receipt, provided they are unused and in original packaging. Certain goods such as perishables or custom orders are excluded. Please consult our detailed return policy for specifics.
        </p>

        <h3>Intellectual Property</h3>
        <p>
          All content including text, images, and logos are owned or licensed by us. Unauthorized copying or distribution is strictly prohibited.
        </p>

        <h3>Prohibited Activities</h3>
        <p>
          You agree not to misuse the platform by introducing harmful code, engaging in fraudulent behavior, or violating applicable laws.
        </p>

        <h3>Disclaimer</h3>
        <p>
          The platform and its services are provided “as is” without warranties of any kind, either express or implied.
        </p>

        <h3>Limitation of Liability</h3>
        <p>
          To the fullest extent allowed by law, we disclaim liability for indirect, incidental, or consequential damages resulting from your use of the platform.
        </p>

        <h3>Governing Law</h3>
        <p>
          These Terms are governed by the laws of [Your Country or State], and any disputes will be subject to the jurisdiction of the appropriate courts.
        </p>

        <h3>Amendments to Terms</h3>
        <p>
          We reserve the right to modify these Terms at any time. Your continued use of the website after such changes constitutes acceptance of the updated Terms.
        </p>
      </div>

      <div className="buttons">
        <button className="accept" onClick={handleAccept}>Accept</button>
        <button className="decline" onClick={handleDecline}>Decline</button>
      </div>
    </div>
  );
};

export default Terms;
