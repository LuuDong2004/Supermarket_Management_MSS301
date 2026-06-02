// pages/Auth/ForgotPasswordPage.jsx
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { ROUTES } from '../../configs/routes';

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('');
  const [sent, setSent] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    // TODO: Connect to backend API
    setSent(true);
  };

  return (
    <div className="container min-vh-100 py-10 d-flex align-items-center justify-content-center">
      <div style={{ maxWidth: 480, width: '100%' }}>
        <div className="mb-10 text-center">
          <Link to={ROUTES.SIGN_IN} className="logos">
            <img src="/assets/main-logo-CWEU2RA-.png" loading="lazy" alt="Logo" className="h-7 mx-auto d-block" />
          </Link>
        </div>

        <div className="card">
          <div className="p-md-8 card-body">
            <h5 className="mb-3 fw-bold text-gradient text-uppercase text-center">Forgot Password?</h5>
            <p className="mb-7 text-center text-muted">
              Enter your email address to reset your password
            </p>

            {sent ? (
              <div className="alert alert-success text-center" role="alert">
                Password reset link sent to <strong>{email}</strong>. Please check your inbox.
              </div>
            ) : (
              <form onSubmit={handleSubmit}>
                <div className="row g-5 mt-3">
                  <div className="col-12 mt-0">
                    <label htmlFor="emailInput" className="form-label">Email Address</label>
                    <input
                      type="email"
                      id="emailInput"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="Enter your email"
                      className="form-control"
                      required
                    />
                  </div>
                  <div className="col-12">
                    <button type="submit" className="btn btn-primary w-100">Send Reset Link</button>
                  </div>
                  <div className="col-12">
                    <p className="text-center">
                      Remembered your password?{' '}
                      <Link to={ROUTES.SIGN_IN} className="link link-primary">Sign In</Link>
                    </p>
                  </div>
                </div>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
