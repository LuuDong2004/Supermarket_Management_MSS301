// pages/Dashboard/Account/AccountLayout.jsx
import React, { useEffect } from 'react';
import { Link, Outlet, useLocation } from 'react-router-dom';
import PageBreadcrumb from '../../../components/ui/PageBreadcrumb';
import { ROUTES } from '../../../configs/routes';

export default function AccountLayout() {
  const location = useLocation();

  useEffect(() => {
    if (window.lucide) {
      window.lucide.createIcons();
    }
  }, [location.pathname]);

  const navItems = [
    { to: ROUTES.ACCOUNT_SETTINGS, label: 'Account', icon: 'user-round' },
    { to: ROUTES.ACCOUNT_SECURITY, label: 'Security', icon: 'shield-check' },
    { to: ROUTES.ACCOUNT_BILLING, label: 'Billing & Plans', icon: 'gem' },
    { to: ROUTES.ACCOUNT_NOTIFICATION, label: 'Notification', icon: 'bell' },
    { to: ROUTES.ACCOUNT_STATEMENTS, label: 'Statements', icon: 'list-tree' },
    { to: ROUTES.ACCOUNT_LOGS, label: 'Logs', icon: 'log-out' }
  ];

  return (
    <div className="container-fluid">
      <PageBreadcrumb title="Account Details" breadcrumbs={[{ label: 'Dashboard', href: ROUTES.DASHBOARD }, { label: 'Pages' }, { label: 'Account' }]} />

      <div className="position-relative mb-4">
        {/* Profile Background Banner */}
        <div className="main-profile-bg position-relative rounded-top overflow-hidden" style={{ height: '180px', background: 'linear-gradient(135deg, var(--bs-primary) 0%, var(--bs-indigo) 100%)' }}>
          <div className="position-absolute top-0 start-0 w-100 h-100 opacity-10 bg-pattern" style={{ backgroundImage: 'radial-gradient(circle, #fff 10%, transparent 11%)', backgroundSize: '12px 12px' }}></div>
          <div className="row h-100 align-items-center g-0 px-5 text-white position-relative z-1">
            <div className="col-12 col-md-8 offset-md-4">
              <h3 className="fw-medium mb-2 lh-base text-white">A powerful POS admin dashboard to manage sales, inventory, and daily store operations</h3>
              <p className="text-white text-opacity-75 mb-0 d-none d-md-block">Manage your account profile, settings, bills, statements, and security configurations.</p>
            </div>
          </div>
        </div>

        {/* User Info Card & Tab Navigation */}
        <div className="card border rounded-top-0 user-card mt-0 shadow-sm">
          <div className="card-body px-4 pb-0">
            <div className="d-flex flex-wrap gap-3 justify-content-between align-items-end mb-4">
              {/* Profile Avatar */}
              <div className="position-relative mt-n5 ms-3" style={{ zIndex: 5 }}>
                <img src="/assets/user-71-RNjOCE17.png" loading="lazy" alt="Avatar" className="rounded-circle border border-5 border-card bg-card" style={{ width: '120px', height: '120px', objectFit: 'cover' }} />
              </div>
              
              {/* Action Buttons */}
              <div className="d-flex flex-wrap align-items-center gap-3">
                <div className="border py-1 px-3 d-flex align-items-center gap-3 rounded bg-light">
                  <i className="ri-error-warning-fill text-secondary fs-18"></i>
                  <p className="mb-0 fw-medium">POS Offline Mode</p>
                  <div className="form-switch switch-light-primary my-auto d-flex">
                    <input type="checkbox" id="switch-light-1" className="form-check-input cursor-pointer" />
                  </div>
                </div>
                <Link to={ROUTES.POS} className="btn btn-primary px-4 py-2 d-flex align-items-center gap-1">
                  <i className="ri-shopping-bag-3-line"></i> Open POS
                </Link>
              </div>
            </div>

            {/* Profile User Info */}
            <div className="mb-4">
              <div className="d-flex align-items-center gap-2 mb-2">
                <h4 className="mb-0 fw-bold">Lucas Ethan</h4>
                <i data-lucide="badge-check" className="size-5 icon-primary text-primary"></i>
              </div>
              <ul className="text-muted d-flex align-items-center gap-4 flex-wrap ps-0 mb-0 list-unstyled">
                <li className="d-flex align-items-center gap-1.5">
                  <i data-lucide="building-2" className="size-4"></i>
                  <span>Store Manager · Main Branch</span>
                </li>
                <li className="d-flex align-items-center gap-1.5">
                  <i data-lucide="map-pin" className="size-4"></i>
                  <span>Buenos Aires, Argentina</span>
                </li>
                <li className="d-flex align-items-center gap-1.5">
                  <i data-lucide="calendar-days" className="size-4"></i>
                  <span>Joined on 24 April, 2024</span>
                </li>
              </ul>
            </div>

            {/* Underline Tabs */}
            <div className="border-top pt-2">
              <ul className="nav nav-underline gap-1 gap-lg-4">
                {navItems.map(item => {
                  const isActive = location.pathname === item.to;
                  return (
                    <li className="nav-item" key={item.to}>
                      <Link className={`nav-link py-3 d-flex align-items-center gap-2 ${isActive ? 'active' : ''}`} to={item.to}>
                        <i data-lucide={item.icon} className="size-4"></i>
                        {item.label}
                      </Link>
                    </li>
                  );
                })}
              </ul>
            </div>

          </div>
        </div>
      </div>

      {/* Render sub route content */}
      <div className="py-2">
        <Outlet />
      </div>
    </div>
  );
}
