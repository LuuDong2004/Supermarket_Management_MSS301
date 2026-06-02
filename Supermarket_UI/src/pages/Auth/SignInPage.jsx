// pages/Auth/SignInPage.jsx
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { ROUTES } from '../../configs/routes';
import { DEMO_CREDENTIALS } from '../../configs/constants';

export default function SignInPage() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleChange = (e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    const result = await login(form.email, form.password);

    if (result.success) {
      navigate(ROUTES.DASHBOARD);
    } else {
      setError(result.message || 'Invalid email or password');
    }
    setLoading(false);
  };

  const handleQuickLogin = (type) => {
    const creds = DEMO_CREDENTIALS[type];
    setForm({ email: creds.username, password: creds.password });
  };

  return (
    <div className="container min-vh-100 py-10 d-flex align-items-center">
      <div className="w-100">
        <div className="row align-items-center position-relative">
          {/* Sign In Form */}
          <div className="col-lg-7 col-xl-6">
            <div className="row justify-content-center justify-content-lg-start">
              <div className="col-md-9 col-lg-11 col-xxl-8">
                <div className="mb-10">
                  <Link to={ROUTES.DASHBOARD} className="logos">
                    <img
                      src="/assets/main-logo-CWEU2RA-.png"
                      loading="lazy"
                      alt="Logo"
                      className="h-7 mx-auto d-block"
                    />
                  </Link>
                </div>

                <div className="card">
                  <div className="p-md-8 card-body">
                    <h5 className="mb-3 fw-bold text-gradient text-uppercase text-center">
                      Welcome to GotPOS!
                    </h5>
                    <p className="mb-7 text-center text-muted">
                      Sign in to access your POS dashboard
                    </p>

                    <form onSubmit={handleSubmit}>
                      {error && (
                        <div className="alert alert-danger alert-dismissible" role="alert">
                          <span>{error}</span>
                          <button
                            type="button"
                            className="btn-close"
                            onClick={() => setError('')}
                          ></button>
                        </div>
                      )}

                      <div className="row g-5 mt-3">
                        <div className="col-12 mt-0">
                          <label htmlFor="emailInput" className="form-label">
                            Email Or Username
                          </label>
                          <input
                            type="text"
                            id="emailInput"
                            name="email"
                            value={form.email}
                            onChange={handleChange}
                            placeholder="Enter your email or username"
                            className="form-control"
                            required
                          />
                        </div>

                        <div className="col-12">
                          <label htmlFor="passwordInput" className="form-label">
                            Password
                          </label>
                          <div className="position-relative">
                            <input
                              type={showPassword ? 'text' : 'password'}
                              id="passwordInput"
                              name="password"
                              value={form.password}
                              onChange={handleChange}
                              className="form-control pe-8"
                              placeholder="Enter your password"
                              required
                            />
                            <div
                              className="position-absolute top-50 end-0 me-3 translate-middle-y text-muted cursor-pointer"
                              onClick={() => setShowPassword((v) => !v)}
                            >
                              <i
                                data-lucide={showPassword ? 'eye' : 'eye-off'}
                                className="size-5"
                              ></i>
                            </div>
                          </div>
                        </div>

                        <div className="col-12 d-flex justify-content-between align-items-center">
                          <div className="form-check check-primary">
                            <input
                              type="checkbox"
                              id="rememberMe"
                              className="form-check-input"
                            />
                            <label htmlFor="rememberMe" className="form-check-label">
                              Remember me
                            </label>
                          </div>
                          <Link to={ROUTES.FORGOT_PASSWORD} className="fs-sm">
                            Forgot Password?
                          </Link>
                        </div>

                        <div className="col-12">
                          <button
                            type="submit"
                            className="btn btn-primary w-100"
                            disabled={loading}
                          >
                            {loading ? (
                              <span
                                className="spinner-border spinner-border-sm me-2"
                                role="status"
                              ></span>
                            ) : null}
                            Sign In
                          </button>
                        </div>

                        <div className="col-12">
                          <p className="text-center">
                            Don&apos;t have an account?{' '}
                            <Link to={ROUTES.SIGN_UP} className="link link-primary">
                              Sign Up
                            </Link>
                          </p>
                        </div>
                      </div>
                    </form>
                  </div>
                </div>

                {/* Demo Credentials Card */}
                <div className="card mb-0">
                  <div className="card-body p-7">
                    <div className="d-flex mb-1 justify-content-between align-items-center">
                      <h6 className="mb-0">CEO</h6>
                      <p className="fs-sm">Full system access</p>
                    </div>
                    <div className="d-flex flex-wrap align-items-center gap-2 mb-4">
                      <div className="row g-0 border rounded flex-grow-1">
                        <div className="col-md-8 border-bottom border-bottom-md-0 border-end">
                          <p className="px-3 py-2">{DEMO_CREDENTIALS.ceo.username}</p>
                        </div>
                        <div className="col-md-4">
                          <p className="px-3 py-2">{DEMO_CREDENTIALS.ceo.password}</p>
                        </div>
                      </div>
                      <button
                        type="button"
                        className="btn btn-sub-primary flex-shrink-0"
                        onClick={() => handleQuickLogin('ceo')}
                      >
                        Login
                      </button>
                    </div>

                    <div className="d-flex mb-1 justify-content-between align-items-center">
                      <h6 className="mb-0">Admin</h6>
                      <p className="fs-sm">System &amp; settings access</p>
                    </div>
                    <div className="d-flex flex-wrap align-items-center gap-2">
                      <div className="row g-0 border rounded flex-grow-1">
                        <div className="col-md-8 border-bottom border-bottom-md-0 border-end">
                          <p className="px-3 py-2">{DEMO_CREDENTIALS.admin.username}</p>
                        </div>
                        <div className="col-md-4">
                          <p className="px-3 py-2">{DEMO_CREDENTIALS.admin.password}</p>
                        </div>
                      </div>
                      <button
                        type="button"
                        className="btn btn-sub-primary flex-shrink-0"
                        onClick={() => handleQuickLogin('admin')}
                      >
                        Login
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right side decoration */}
          <div className="col-5 col-xl-6 d-none d-lg-block">
            <div className="text-white px-xl-12">
              <h2 className="fw-medium mb-5">Powerful POS Admin Dashboard</h2>
              <p className="fs-17 opacity-75 max-w-xl mb-12">
                Manage sales, inventory, billing, and reports from one smart dashboard. GotPOS helps
                you run your business faster, smarter.
              </p>
            </div>
          </div>
        </div>

        <p className="position-absolute bottom-0 end-0 p-8 text-white fs-16">
          &copy; {new Date().getFullYear()} GotPOS. All rights reserved
        </p>
        <div className="auth-bg position-fixed top-0 bottom-0 end-0 d-none d-lg-block"></div>
      </div>
    </div>
  );
}
