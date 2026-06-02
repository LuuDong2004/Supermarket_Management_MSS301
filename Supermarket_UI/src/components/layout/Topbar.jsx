// components/layout/Topbar.jsx
import { useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { useTheme } from '../../hooks/useTheme';
import { ROUTES } from '../../configs/routes';
import { LayoutContext } from '../../context/LayoutContext';

export default function Topbar() {
  const { user, logout } = useAuth();
  const { isDark, toggleTheme } = useTheme();
  const { toggleSidebar, toggleFullscreen } = useContext(LayoutContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate(ROUTES.SIGN_IN);
  };

  return (
    <header className="main-topbar" id="main-topbar">
      {/* Brand / Logo */}
      <div className="navbar-brand gap-2">
        <div className="logos">
          <Link to={ROUTES.DASHBOARD} aria-label="Topbar Logo">
            <img src="/assets/main-logo-CWEU2RA-.png" loading="lazy" height="22" alt="Logo" className="logo-dark" />
            <img src="/assets/logo-white-B_ImY8Qx.png" loading="lazy" height="22" alt="Logo" className="logo-light" />
          </Link>
        </div>
        <button
          type="button"
          id="toggleSidebar"
          className="sidebar-toggle btn p-0"
          aria-label="sidebar-toggle"
          onClick={toggleSidebar}
        >
          <i className="ri-layout-left-line fs-17"></i>
        </button>
      </div>

      {/* Center Actions */}
      <div className="d-flex align-items-center gap-2">
        {/* Live Preview */}
        <a
          href="/"
          target="_blank"
          className="btn-icon size-9 bg-secondary text-white shadow-none btn d-none d-md-inline-flex justify-content-center align-items-center"
          data-bs-toggle="tooltip"
          data-bs-title="Live Preview"
          data-bs-placement="bottom"
          rel="noreferrer"
        >
          <i className="ri-global-line fs-17"></i>
        </a>

        {/* POS */}
        <Link to={ROUTES.POS} className="btn h-9 px-3 btn-primary py-6px d-none d-md-inline-flex align-items-center" target="_blank">
          <i className="ri-shopping-bag-3-line fs-16 pe-1"></i> POS
        </Link>

        {/* Add New Dropdown */}
        <div className="dropdown d-none d-xl-block">
          <button className="btn topbar-link w-auto shadow-none px-3" type="button" data-bs-toggle="dropdown" aria-expanded="false">
            Add New<i className="ri-add-line ps-1"></i>
          </button>
          <div className="dropdown-menu dropdown-menu-lg p-3" aria-labelledby="onBoardingCapaignDropdown">
            <div className="row g-2">
              <div className="col-4">
                <Link to={ROUTES.ORDERS_INVOICES} className="dropdown-item p-2 text-center rounded border d-flex flex-column align-items-center gap-1">
                  <div className="avatar size-8 bg-light rounded d-flex align-items-center justify-content-center"><i className="ri-file-list-3-line text-primary"></i></div>
                  <span className="fs-xs fw-medium">Invoice</span>
                </Link>
              </div>
              <div className="col-4">
                <Link to={ROUTES.CUSTOMERS_ADD} className="dropdown-item p-2 text-center rounded border d-flex flex-column align-items-center gap-1">
                  <div className="avatar size-8 bg-light rounded d-flex align-items-center justify-content-center"><i className="ri-user-add-line text-success"></i></div>
                  <span className="fs-xs fw-medium">Customer</span>
                </Link>
              </div>
              <div className="col-4">
                <Link to={ROUTES.ORDERS} className="dropdown-item p-2 text-center rounded border d-flex flex-column align-items-center gap-1">
                  <div className="avatar size-8 bg-light rounded d-flex align-items-center justify-content-center"><i className="ri-shopping-cart-2-line text-warning"></i></div>
                  <span className="fs-xs fw-medium">Order</span>
                </Link>
              </div>
              <div className="col-4">
                <Link to={ROUTES.SETTINGS_COUPONS} className="dropdown-item p-2 text-center rounded border d-flex flex-column align-items-center gap-1">
                  <div className="avatar size-8 bg-light rounded d-flex align-items-center justify-content-center"><i className="ri-coupon-3-line text-danger"></i></div>
                  <span className="fs-xs fw-medium">Coupons</span>
                </Link>
              </div>
              <div className="col-4">
                <Link to={ROUTES.PRODUCTS_ADD} className="dropdown-item p-2 text-center rounded border d-flex flex-column align-items-center gap-1">
                  <div className="avatar size-8 bg-light rounded d-flex align-items-center justify-content-center"><i className="ri-price-tag-3-line text-info"></i></div>
                  <span className="fs-xs fw-medium">Product</span>
                </Link>
              </div>
              <div className="col-4">
                <Link to={ROUTES.SUPPLIERS_ADD} className="dropdown-item p-2 text-center rounded border d-flex flex-column align-items-center gap-1">
                  <div className="avatar size-8 bg-light rounded d-flex align-items-center justify-content-center"><i className="ri-truck-line text-dark"></i></div>
                  <span className="fs-xs fw-medium">Supplier</span>
                </Link>
              </div>
            </div>
          </div>
        </div>

        {/* Branch Selector Dropdown */}
        <div className="dropdown d-none d-xl-block">
          <button className="topbar-link btn dropdown-toggle shadow-none w-auto px-3" type="button" data-bs-toggle="dropdown" aria-expanded="false">
            <i className="ri-store-2-line fs-16 text-primary me-1"></i>
            <span>Main Branch</span>
          </button>
          <ul className="dropdown-menu dropdown-menu-end">
            <li>
              <a className="dropdown-item d-flex align-items-center gap-2" href="#!">
                <i className="ri-store-2-line text-primary"></i> Main Branch
              </a>
            </li>
            <li>
              <a className="dropdown-item d-flex align-items-center gap-2" href="#!">
                <i className="ri-store-3-line text-primary"></i> Branch 2
              </a>
            </li>
            <li>
              <a className="dropdown-item d-flex align-items-center gap-2" href="#!">
                <i className="ri-home-4-line text-primary"></i> Head Office
              </a>
            </li>
          </ul>
        </div>
      </div>

      {/* Right Actions */}
      <div className="d-flex align-items-center gap-3 ms-auto">
        {/* Search */}
        <div className="align-items-center d-none d-lg-flex">
          <div className="position-relative navbar-search">
            <i className="ri-search-line icon fs-15"></i>
            <input type="search" className="form-control shadow-none border-0 bg-light h-9" placeholder="Search for GotPOS" />
          </div>
        </div>

        {/* Apps Modal Trigger */}
        <button type="button" className="topbar-link btn d-none d-md-block" aria-label="tools-apps-modal" data-bs-toggle="modal" data-bs-target="#toolAppsModal">
          <i data-lucide="layout-panel-left" className="size-4"></i>
        </button>

        {/* Fullscreen Button */}
        <button
          type="button"
          className="topbar-link btn d-none d-md-block"
          id="fullScreenButton"
          aria-label="toggle fullscreen"
          onClick={toggleFullscreen}
        >
          <i data-lucide="maximize-2" className="size-4"></i>
          <i data-lucide="minimize-2" className="size-4 d-none"></i>
        </button>

        {/* Dark Mode Toggle */}
        <button
          type="button"
          id="darkModeButton"
          className="topbar-link topbar-mode btn nav-link collapsed-mode"
          aria-label="toggle dark mode"
          onClick={toggleTheme}
        >
          {isDark ? (
            <i data-lucide="sun" className="size-4 light"></i>
          ) : (
            <i data-lucide="moon" className="size-4 dark"></i>
          )}
        </button>

        {/* Cart Dropdown */}
        <div className="dropdown">
          <button className="btn topbar-link" type="button" aria-label="Cart button" data-bs-toggle="dropdown" aria-expanded="false">
            <span className="position-relative">
              <i data-lucide="store" className="size-4"></i>
              <span className="notification-animate position-absolute top-0 end-0 size-1-5 animate-ping bg-danger rounded-circle"></span>
              <span className="notification-animate position-absolute top-0 end-0 size-1-5 bg-danger rounded-circle"></span>
            </span>
          </button>
          <div className="dropdown-menu dropdown-menu-end w-md p-0">
            <div className="d-flex align-items-center border-bottom gap-2 p-4">
              <h6 className="flex-grow-1 mb-0">Cart</h6>
              <span className="badge bg-light border text-muted">4 Items</span>
            </div>
            <div className="vstack">
              <div className="cursor-pointer d-flex align-items-center gap-4 p-4 border-bottom">
                <div className="d-flex align-items-center gap-3">
                  <div className="avatar size-11 bg-light rounded-1 p-1">
                    <img src="/assets/img-01-BBWp8t8E.png" loading="lazy" alt="Items" className="img-fluid size-10" />
                  </div>
                  <div className="flex-grow-1">
                    <a href="#!" className="text-reset fw-medium">Cotton T-shirt</a>
                    <p className="text-muted fs-xs">Pink M</p>
                  </div>
                </div>
                <div className="ms-auto text-end">
                  <h6 className="mb-0 fw-medium">$1,256</h6>
                  <small className="text-muted">Qty: 2</small>
                </div>
              </div>
              <div className="cursor-pointer d-flex align-items-center gap-4 p-4 border-bottom">
                <div className="d-flex align-items-center gap-3">
                  <div className="avatar size-11 bg-light rounded-1 p-1">
                    <img src="/assets/img-02-ClVfz9I5.png" loading="lazy" alt="Items" className="img-fluid size-10" />
                  </div>
                  <div className="flex-grow-1">
                    <a href="#!" className="text-reset fw-medium">Leather Shoulder Bag</a>
                    <p className="text-muted fs-xs">Brown</p>
                  </div>
                </div>
                <div className="ms-auto text-end">
                  <h6 className="mb-0 fw-medium">$2,890</h6>
                  <small className="text-muted">Qty: 1</small>
                </div>
              </div>
              <div className="cursor-pointer d-flex align-items-center gap-4 p-4 border-bottom">
                <div className="d-flex align-items-center gap-3">
                  <div className="avatar size-11 bg-light rounded-1 p-1">
                    <img src="/assets/img-03-oTTY_McP.png" loading="lazy" alt="Items" className="img-fluid size-10" />
                  </div>
                  <div className="flex-grow-1">
                    <a href="#!" className="text-reset fw-medium">Wireless Headphones</a>
                    <p className="text-muted fs-xs">Black</p>
                  </div>
                </div>
                <div className="ms-auto text-end">
                  <h6 className="mb-0 fw-medium">$3,450</h6>
                  <small className="text-muted">Qty: 1</small>
                </div>
              </div>
              <div className="cursor-pointer d-flex align-items-center gap-4 p-4">
                <div className="d-flex align-items-center gap-3">
                  <div className="avatar size-11 bg-light rounded-1 p-1">
                    <img src="/assets/img-04-DZ4OtBxS.png" loading="lazy" alt="Items" className="img-fluid size-10" />
                  </div>
                  <div className="flex-grow-1">
                    <a href="#!" className="text-reset fw-medium">Denim Jeans</a>
                    <p className="text-muted fs-xs">Blue 32</p>
                  </div>
                </div>
                <div className="ms-auto text-end">
                  <h6 className="mb-0 fw-medium">$1,899</h6>
                  <small className="text-muted">Qty: 3</small>
                </div>
              </div>
              <div className="d-flex align-items-center justify-content-between gap-3 py-4 fs-16 px-5 border-top border-bottom bg-light">
                <p className="text-muted mb-0">Total :</p>
                <h6 className="mb-0">$14,549</h6>
              </div>
            </div>
          </div>
        </div>

        {/* Notifications */}
        <div className="dropdown d-none d-md-block">
          <button className="btn topbar-link" type="button" data-bs-toggle="dropdown" aria-expanded="false">
            <i data-lucide="bell-ring" className="size-4"></i>
            <span className="position-relative">
              <span className="notification-animate position-absolute top-0 end-0 size-1-5 animate-ping bg-success rounded-circle"></span>
              <span className="notification-animate position-absolute top-0 end-0 size-1-5 bg-success rounded-circle"></span>
            </span>
          </button>
          <div className="dropdown-menu dropdown-menu-end dropdown-menu-lg p-0">
            <div className="d-flex align-items-center gap-2 p-4 border-bottom">
              <h6 className="flex-grow-1 mb-0">Notification (5)</h6>
              <ul className="nav nav-pills nav-light" id="notification-tab" role="tablist">
                <li className="nav-item" role="presentation">
                  <button className="nav-link py-1 px-3 fs-12 active" id="tab-all" data-bs-toggle="pill" data-bs-target="#content-all" type="button" role="tab">All</button>
                </li>
                <li className="nav-item" role="presentation">
                  <button className="nav-link py-1 px-3 fs-12" id="tab-unread" data-bs-toggle="pill" data-bs-target="#content-unread" type="button" role="tab">Unread</button>
                </li>
              </ul>
            </div>
            <div className="tab-content" id="notification-tabContent">
              <div className="tab-pane fade show active" id="content-all" role="tabpanel">
                <div style={{ maxHeight: '280px', overflowY: 'auto' }} className="topbar-notification">
                  <div className="vstack">
                    <a href="#!" className="notification-item d-flex gap-3 p-4 border-bottom unread text-reset text-decoration-none">
                      <img src="/assets/user-3-Bz6g7hsE.png" loading="lazy" alt="User" className="rounded-circle size-9 flex-shrink-0" />
                      <div className="flex-grow-1">
                        <h6 className="mb-1 fs-14">Alex Morgan<span className="fw-normal text-muted fs-xs ms-2">5m ago</span></h6>
                        <span className="text-muted fs-sm">New order placed #ORD-4592</span>
                      </div>
                    </a>
                    <a href="#!" className="notification-item d-flex gap-3 p-4 border-bottom unread text-reset text-decoration-none">
                      <img src="/assets/user-38-Do2kmZ3c.png" loading="lazy" alt="User" className="rounded-circle size-9 flex-shrink-0" />
                      <div className="flex-grow-1">
                        <h6 className="mb-1 fs-14">System Alert<span className="fw-normal text-muted fs-xs ms-2">20m ago</span></h6>
                        <span className="text-muted fs-sm">Product ID: #221 • Threshold crossed</span>
                      </div>
                    </a>
                    <a href="#!" className="notification-item d-flex gap-3 p-4 border-bottom text-reset text-decoration-none">
                      <img src="/assets/user-51-CsAqIIgX.png" loading="lazy" alt="User" className="rounded-circle size-9 flex-shrink-0" />
                      <div className="flex-grow-1">
                        <h6 className="mb-1 fs-14">Payment Received<span className="fw-normal text-muted fs-xs ms-2">1h ago</span></h6>
                        <span className="text-muted fs-sm">Invite you to GotPOS Admin & Dashboard</span>
                      </div>
                    </a>
                  </div>
                </div>
              </div>
              <div className="tab-pane fade" id="content-unread" role="tabpanel">
                <div style={{ maxHeight: '280px', overflowY: 'auto' }} className="topbar-notification">
                  <div className="vstack">
                    <a href="#!" className="notification-item d-flex gap-3 p-4 border-bottom unread text-reset text-decoration-none">
                      <img src="/assets/user-3-Bz6g7hsE.png" loading="lazy" alt="User" className="rounded-circle size-9 flex-shrink-0" />
                      <div className="flex-grow-1">
                        <h6 className="mb-1 fs-14">Alex Morgan<span className="fw-normal text-muted fs-xs ms-2">5m ago</span></h6>
                        <span className="text-muted fs-sm">New order placed #ORD-4592</span>
                      </div>
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Language Selection */}
        <div className="dropdown d-none d-md-block">
          <button className="btn topbar-link" id="languageButton" type="button" data-bs-toggle="dropdown" aria-expanded="false">
            <img src="data:image/svg+xml,%3csvg%20xmlns='http://www.w3.org/2000/svg'%20xmlns:xlink='http://www.w3.org/1999/xlink'%20viewBox='0%200%207410%203900'%3e%3cpath%20fill='%23b22234'%20d='M0%200h7410v3900H0z'/%3e%3cpath%20d='M0%20450h7410m0%20600H0m0%20600h7410m0%20600H0m0%20600h7410m0%20600H0'%20stroke='%23fff'%20stroke-width='300'/%3e%3cpath%20fill='%233c3b6e'%20d='M0%200h2964v2100H0z'/%3e%3cg%20fill='%23fff'%3e%3cg%20id='d'%3e%3cg%20id='c'%3e%3cg%20id='e'%3e%3cg%20id='b'%3e%3cpath%20id='a'%20d='M247%2090l70.534%20217.082-184.66-134.164h228.253L176.466%20307.082z'/%3e%3cuse%20xlink:href='%23a'%20y='420'/%3e%3cuse%20xlink:href='%23a'%20y='840'/%3e%3cuse%20xlink:href='%23a'%20y='1260'/%3e%3c/g%3e%3cuse%20xlink:href='%23a'%20y='1680'/%3e%3c/g%3e%3cuse%20xlink:href='%23b'%20x='247'%20y='210'/%3e%3c/g%3e%3cuse%20xlink:href='%23c'%20x='494'/%3e%3c/g%3e%3cuse%20xlink:href='%23d'%20x='988'/%3e%3cuse%20xlink:href='%23c'%20x='1976'/%3e%3cuse%20xlink:href='%23e'%20x='2470'/%3e%3c/g%3e%3c/svg%3e" loading="lazy" alt="en" className="object-fit-cover rounded-5 size-5" />
          </button>
          <div className="dropdown-menu dropdown-menu-end">
            <ul className="p-0 mb-0 list-unstyled">
              <li>
                <a className="dropdown-item d-flex gap-2 align-items-center" href="#!" data-lang="en">
                  <img src="data:image/svg+xml,%3csvg%20xmlns='http://www.w3.org/2000/svg'%20xmlns:xlink='http://www.w3.org/1999/xlink'%20viewBox='0%200%207410%203900'%3e%3cpath%20fill='%23b22234'%20d='M0%200h7410v3900H0z'/%3e%3cpath%20d='M0%20450h7410m0%20600H0m0%20600h7410m0%20600H0m0%20600h7410m0%20600H0'%20stroke='%23fff'%20stroke-width='300'/%3e%3cpath%20fill='%233c3b6e'%20d='M0%200h2964v2100H0z'/%3e%3cg%20fill='%23fff'%3e%3cg%20id='d'%3e%3cg%20id='c'%3e%3cg%20id='e'%3e%3cg%20id='b'%3e%3cpath%20id='a'%20d='M247%2090l70.534%20217.082-184.66-134.164h228.253L176.466%20307.082z'/%3e%3cuse%20xlink:href='%23a'%20y='420'/%3e%3cuse%20xlink:href='%23a'%20y='840'/%3e%3cuse%20xlink:href='%23a'%20y='1260'/%3e%3c/g%3e%3cuse%20xlink:href='%23a'%20y='1680'/%3e%3c/g%3e%3cuse%20xlink:href='%23b'%20x='247'%20y='210'/%3e%3c/g%3e%3cuse%20xlink:href='%23c'%20x='494'/%3e%3c/g%3e%3cuse%20xlink:href='%23d'%20x='988'/%3e%3cuse%20xlink:href='%23c'%20x='1976'/%3e%3cuse%20xlink:href='%23e'%20x='2470'/%3e%3c/g%3e%3c/svg%3e" loading="lazy" alt="en" className="object-fit-cover rounded-5 size-5" /> English
                </a>
              </li>
              <li>
                <a className="dropdown-item d-flex gap-2 align-items-center" href="#!" data-lang="vi">
                  <img src="data:image/svg+xml,%3csvg%20xmlns='http://www.w3.org/2000/svg'%20xmlns:xlink='http://www.w3.org/1999/xlink'%20viewBox='-15%20-10%2030%2020'%3e%3cpath%20fill='%23DA251d'%20d='M-20-15h40v30h-40z'/%3e%3cg%20id='b'%20transform='translate(0%20-6)'%3e%3cpath%20id='a'%20fill='%23FF0'%20transform='rotate(18)'%20d='M0%200v6h4'/%3e%3cuse%20xlink:href='%23a'%20transform='scale(-1%201)'/%3e%3c/g%3e%3cg%20id='c'%20transform='rotate(72)'%3e%3cuse%20xlink:href='%23b'/%3e%3cuse%20xlink:href='%23b'%20transform='rotate(72)'/%3e%3c/g%3e%3cuse%20xlink:href='%23c'%20transform='scale(-1%201)'/%3e%3c/svg%3e" loading="lazy" alt="vi" className="object-fit-cover rounded-5 size-5" /> Tiếng Việt
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* User Profile Dropdown */}
        <div className="dropdown profile-dropdown">
          <button className="btn p-0" type="button" data-bs-toggle="dropdown" aria-expanded="false">
            <img src="/assets/user-71-RNjOCE17.png" loading="lazy" alt="user" className="object-fit-cover rounded size-8" />
          </button>
          <div className="dropdown-menu w-64 profile-dropdown-menu p-0">
            <div className="d-flex align-items-center gap-3 px-4 py-3 border-bottom">
              <img src="/assets/user-71-RNjOCE17.png" loading="lazy" alt="User" className="rounded size-9 flex-shrink-0" />
              <div className="flex-grow-1 overflow-hidden">
                <h6 className="mb-0 text-truncate">{user?.email?.split('@')[0] || 'Lucas Ethan'}</h6>
                <p className="mb-0 text-truncate">
                  <span className="link link-custom-primary fs-sm">{user?.email || 'lucas@gotpos.com'}</span>
                </p>
              </div>
            </div>
            <div className="px-4 py-3">
              <ul className="list-unstyled mb-0">
                <li>
                  <Link className="profile-link rounded text-reset" to={ROUTES.USER_PROFILE}>
                    <i data-lucide="user" className="me-2 size-4 text-muted"></i> My Profile
                  </Link>
                </li>
                <li>
                  <Link className="profile-link rounded text-reset" to={ROUTES.SETTINGS_POS}>
                    <i data-lucide="settings" className="me-2 size-4 text-muted"></i> POS Settings
                  </Link>
                </li>
                <li>
                  <Link className="profile-link rounded text-reset" to={ROUTES.STAFF}>
                    <i data-lucide="users" className="me-2 size-4 text-muted"></i> Staff Management
                  </Link>
                </li>
              </ul>
              <hr className="border my-2" />
              <ul className="list-unstyled mb-0">
                <li className="d-flex profile-link rounded align-items-center justify-content-between">
                  <a className="text-reset" href="#!">
                    <i data-lucide="sparkles" className="me-2 size-4 text-muted"></i> What's New?
                  </a>
                  <a href="#!"><i data-lucide="square-arrow-out-up-right" className="size-4 text-body-tertiary"></i></a>
                </li>
                <li className="d-flex profile-link rounded align-items-center justify-content-between">
                  <a className="text-reset" href="#!">
                    <i data-lucide="help-circle" className="me-2 size-4 text-muted"></i> Get help?
                  </a>
                  <a href="#!"><i data-lucide="square-arrow-out-up-right" className="size-4 text-body-tertiary"></i></a>
                </li>
              </ul>
              <hr className="border my-2" />
              <ul className="list-unstyled mb-0">
                <li>
                  <button className="profile-link rounded text-reset w-100 text-start border-0 bg-transparent" onClick={handleLogout}>
                    <i data-lucide="log-out" className="me-2 size-4 text-muted"></i> Log Out
                  </button>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
