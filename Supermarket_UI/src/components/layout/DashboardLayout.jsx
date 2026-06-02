// components/layout/DashboardLayout.jsx
// Layout for all authenticated dashboard pages (with Topbar + Sidebar)
import { useEffect, useContext } from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { ROUTES } from '../../configs/routes';
import { LayoutContext } from '../../context/LayoutContext';
import Topbar from './Topbar';
import Sidebar from './Sidebar';

export default function DashboardLayout() {
  const { isAuthenticated } = useAuth();
  const { closeMobileSidebar } = useContext(LayoutContext);

  // Re-initialize Lucide icons after React renders
  useEffect(() => {
    if (window.lucide) {
      window.lucide.createIcons();
    }
  });

  if (!isAuthenticated) {
    return <Navigate to={ROUTES.SIGN_IN} replace />;
  }

  return (
    <>
      <Topbar />
      <Sidebar />
      <div
        id="sidebar-backdrop"
        className="sidebar-backdrop"
        onClick={closeMobileSidebar}
      ></div>
      <div className="min-vh-100 position-relative">
        <div className="page-wrapper">
          <Outlet />
          
          {/* Main Footer */}
          <div className="main-footer">
            <div className="w-100">
              <div className="row align-items-center">
                <div className="col-lg-6 d-none d-lg-block">
                  <ul className="d-flex align-items-center mb-0 list-unstyled gap-4">
                    <li><a href="#!" className="fw-medium link link-custom-primary">About</a></li>
                    <li><a href="#!" className="fw-medium link link-custom-primary">Support</a></li>
                    <li><a href="#!" className="fw-medium link link-custom-primary">Purchase Now</a></li>
                  </ul>
                </div>
                <div className="col-lg-6 text-muted text-center text-lg-end">
                  <div>
                    &copy; {new Date().getFullYear()} GotPOS. Crafted by <a href="https://1.envato.market/srbthemes" target="_blank" className="fw-semibold text-reset" rel="noreferrer">SRBThemes</a>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
