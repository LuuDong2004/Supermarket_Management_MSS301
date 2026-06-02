// pages/Auth/SignUpPage.jsx
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ROUTES } from '../../configs/routes';

export default function SignUpPage() {
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: '', email: '', password: '', confirmPassword: '' });
  const [error, setError] = useState('');

  const handleChange = (e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    setError('');
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (form.password !== form.confirmPassword) {
      setError('Passwords do not match');
      return;
    }
    // TODO: Connect to backend API
    navigate(ROUTES.SIGN_IN);
  };

  return (
    <div className="container min-vh-100 py-10 d-flex align-items-center">
      <div className="w-100">
        <div className="row align-items-center position-relative">
          <div className="col-lg-7 col-xl-6">
            <div className="row justify-content-center justify-content-lg-start">
              <div className="col-md-9 col-lg-11 col-xxl-8">
                <div className="mb-10">
                  <Link to={ROUTES.DASHBOARD} className="logos">
                    <img src="/assets/main-logo-CWEU2RA-.png" loading="lazy" alt="Logo" className="h-7 mx-auto d-block" />
                  </Link>
                </div>

                <div className="card">
                  <div className="p-md-8 card-body">
                    <h5 className="mb-3 fw-bold text-gradient text-uppercase text-center">
                      Create Account
                    </h5>
                    <p className="mb-7 text-center text-muted">
                      Register to start using GotPOS
                    </p>

                    <form onSubmit={handleSubmit}>
                      {error && (
                        <div className="alert alert-danger alert-dismissible" role="alert">
                          <span>{error}</span>
                          <button type="button" className="btn-close" onClick={() => setError('')}></button>
                        </div>
                      )}

                      <div className="row g-5 mt-3">
                        <div className="col-12 mt-0">
                          <label htmlFor="nameInput" className="form-label">Full Name</label>
                          <input type="text" id="nameInput" name="name" value={form.name} onChange={handleChange}
                            placeholder="Enter your full name" className="form-control" required />
                        </div>
                        <div className="col-12">
                          <label htmlFor="emailInput" className="form-label">Email</label>
                          <input type="email" id="emailInput" name="email" value={form.email} onChange={handleChange}
                            placeholder="Enter your email" className="form-control" required />
                        </div>
                        <div className="col-12">
                          <label htmlFor="passwordInput" className="form-label">Password</label>
                          <input type="password" id="passwordInput" name="password" value={form.password} onChange={handleChange}
                            placeholder="Create a password" className="form-control" required />
                        </div>
                        <div className="col-12">
                          <label htmlFor="confirmPasswordInput" className="form-label">Confirm Password</label>
                          <input type="password" id="confirmPasswordInput" name="confirmPassword" value={form.confirmPassword} onChange={handleChange}
                            placeholder="Confirm your password" className="form-control" required />
                        </div>
                        <div className="col-12">
                          <button type="submit" className="btn btn-primary w-100">Sign Up</button>
                        </div>
                        <div className="col-12">
                          <p className="text-center">
                            Already have an account?{' '}
                            <Link to={ROUTES.SIGN_IN} className="link link-primary">Sign In</Link>
                          </p>
                        </div>
                      </div>
                    </form>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="col-5 col-xl-6 d-none d-lg-block">
            <div className="text-white px-xl-12">
              <h2 className="fw-medium mb-5">Join GotPOS Today</h2>
              <p className="fs-17 opacity-75 max-w-xl mb-12">
                Start managing your business with the most powerful POS dashboard.
              </p>
            </div>
          </div>
        </div>
        <div className="auth-bg position-fixed top-0 bottom-0 end-0 d-none d-lg-block"></div>
      </div>
    </div>
  );
}
