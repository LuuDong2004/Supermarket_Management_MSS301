// components/layout/Sidebar.jsx
import { useContext, useState, useEffect } from 'react';
import { NavLink, Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { useTheme } from '../../hooks/useTheme';
import { ROUTES } from '../../configs/routes';
import { LayoutContext } from '../../context/LayoutContext';

function NavItem({ to, icon, label, children, onClickLink, isOpen, onToggle, submenuStyle }) {
  if (children) {
    return (
      <li className="nav-item">
        <a 
          className={`nav-link ${isOpen ? '' : 'collapsed'}`} 
          onClick={onToggle}
          style={{ cursor: 'pointer' }}
          aria-expanded={isOpen}
        >
          <span className="icons">
            <i className={`ri-${icon}`}></i>
          </span>
          <span className="content">{label}</span>
          <span className="ms-auto menu-arrow">
            <i data-lucide="chevron-down" className="size-4"></i>
          </span>
        </a>
        <div className={`collapse ${isOpen ? 'show' : ''}`}>
          <ul className="nav-menu-sub" style={submenuStyle}>
            {children}
          </ul>
        </div>
      </li>
    );
  }

  return (
    <li className="nav-item">
      <NavLink
        to={to}
        onClick={onClickLink}
        className={({ isActive }) => `nav-link${isActive ? ' active' : ''}`}
      >
        <span className="icons">
          <i className={`ri-${icon}`}></i>
        </span>
        <span className="content">{label}</span>
      </NavLink>
    </li>
  );
}

function SubMenuItem({ to, label, onClickLink }) {
  return (
    <li>
      <NavLink
        to={to}
        onClick={onClickLink}
        className={({ isActive }) => `nav-link${isActive ? ' active' : ''}`}
      >
        <span>{label}</span>
      </NavLink>
    </li>
  );
}

function NavSection({ title }) {
  return (
    <li className="nav-menu-title">
      <span>{title}</span>
    </li>
  );
}

export default function Sidebar() {
  const { user, logout } = useAuth();
  const { isDark, toggleTheme } = useTheme();
  const { closeMobileSidebar, openSidebar } = useContext(LayoutContext);
  const navigate = useNavigate();
  const location = useLocation();
  const [openMenuLabel, setOpenMenuLabel] = useState(null);
  const [submenuStyles, setSubmenuStyles] = useState({});

  // Tự động mở menu cha dựa trên đường dẫn hiện tại khi URL thay đổi
  useEffect(() => {
    const path = location.pathname;
    if (path.startsWith('/dashboard/products')) {
      setOpenMenuLabel('Products');
    } else if (path.startsWith('/dashboard/orders')) {
      setOpenMenuLabel('Orders');
    } else if (path.startsWith('/dashboard/customers')) {
      setOpenMenuLabel('Customers');
    } else if (path.startsWith('/dashboard/inventory')) {
      setOpenMenuLabel('Inventory');
    } else if (path.startsWith('/dashboard/suppliers')) {
      setOpenMenuLabel('Suppliers');
    } else if (path.startsWith('/dashboard/purchase')) {
      setOpenMenuLabel('Purchase');
    } else if (path.startsWith('/dashboard/staff')) {
      setOpenMenuLabel('Staff');
    } else if (path.startsWith('/dashboard/accounts')) {
      setOpenMenuLabel('Accounts');
    } else if (path.startsWith('/dashboard/reports')) {
      setOpenMenuLabel('Reports');
    } else if (path.startsWith('/dashboard/multi-store')) {
      setOpenMenuLabel('Multi Store');
    } else if (path.startsWith('/dashboard/account')) {
      setOpenMenuLabel('Account');
    } else if (path.startsWith('/dashboard/settings')) {
      setOpenMenuLabel('Settings');
    } else {
      setOpenMenuLabel(null);
    }
  }, [location.pathname]);

  // Đóng submenu trôi nổi khi click ra ngoài sidebar ở chế độ small hoặc horizontal
  useEffect(() => {
    const handleOutsideClick = (e) => {
      const html = document.documentElement;
      const sidebarMode = html.getAttribute('data-sidebar');
      const layoutMode = html.getAttribute('data-layout');
      const isSmallOrHorizontal = sidebarMode === 'small' || layoutMode === 'horizontal';

      if (isSmallOrHorizontal && openMenuLabel) {
        if (!e.target.closest('#main-sidebar')) {
          setOpenMenuLabel(null);
        }
      }
    };

    document.addEventListener('click', handleOutsideClick);
    return () => document.removeEventListener('click', handleOutsideClick);
  }, [openMenuLabel]);

  const handleLogout = () => {
    logout();
    closeMobileSidebar();
    navigate(ROUTES.SIGN_IN);
  };

  const handleLinkClick = () => {
    // Automatically close sidebar on mobile navigation
    closeMobileSidebar();
  };

  const handleToggle = (e, menuLabel) => {
    const html = document.documentElement;
    const sidebarMode = html.getAttribute('data-sidebar');
    const layoutMode = html.getAttribute('data-layout');
    const isSmallOrHorizontal = sidebarMode === 'small' || layoutMode === 'horizontal';

    if (isSmallOrHorizontal) {
      const liElement = e.currentTarget.parentElement;
      const subMenu = liElement.querySelector('.nav-menu-sub');
      
      if (subMenu) {
        // HACK: Temporary display to measure dimensions accurately
        const prevDisplay = subMenu.style.display;
        const prevVisibility = subMenu.style.visibility;
        
        subMenu.style.display = 'block';
        subMenu.style.visibility = 'hidden';
        
        const rect = liElement.getBoundingClientRect();
        const subRect = subMenu.getBoundingClientRect();
        const winHeight = window.innerHeight;
        const dir = html.getAttribute('dir') || 'ltr';
        
        subMenu.style.display = prevDisplay;
        subMenu.style.visibility = prevVisibility;

        let style = {
          position: 'fixed',
          zIndex: 1050,
        };
        
        // Calculate vertical position (top / bottom)
        if (rect.top + subRect.height > winHeight) {
          style.bottom = '0px';
          style.top = 'auto';
        } else {
          style.top = `${rect.top}px`;
          style.bottom = 'auto';
        }

        // Calculate horizontal position (left / right)
        if (dir === 'ltr') {
          style.left = `${rect.left + rect.width - 1}px`;
          style.right = 'auto';
        } else {
          style.right = `${window.innerWidth - rect.left}px`;
          style.left = 'auto';
        }
        
        setSubmenuStyles(prev => ({
          ...prev,
          [menuLabel]: style
        }));
      }
    } else {
      setSubmenuStyles(prev => ({
        ...prev,
        [menuLabel]: {}
      }));
    }

    if (openMenuLabel === menuLabel) {
      setOpenMenuLabel(null);
    } else {
      setOpenMenuLabel(menuLabel);
      openSidebar();
    }
  };

  return (
    <div id="main-sidebar" className="main-sidebar">
      <div className="sidebar-wrapper">
        {/* Brand / Logo */}
        <Link to={ROUTES.DASHBOARD} className="navbar-brand gap-2" onClick={() => { handleLinkClick(); setOpenMenuLabel(null); }}>
          <div className="logo-lg">
            <img src="/assets/main-logo-CWEU2RA-.png" loading="lazy" alt="Logo" height="22" className="mx-auto logo-dark" />
            <img src="/assets/logo-white-B_ImY8Qx.png" loading="lazy" alt="Logo" height="22" className="mx-auto logo-light" />
          </div>
          <div className="logo-sm">
            <img src="/assets/logo-sm-dark-JvuhiCGp.png" loading="lazy" alt="Logo" height="23" className="mx-auto logo-dark" />
            <img src="/assets/logo-white-B_ImY8Qx.png" loading="lazy" alt="Logo" height="23" className="mx-auto logo-light" />
          </div>
        </Link>

        {/* User profile section at the top of the sidebar */}
        <div className="dropdown profile-dropdown">
          <a href="#!" className="btn d-flex align-items-center w-100 gap-2 px-4 py-3 text-start" data-bs-toggle="dropdown" aria-expanded="false">
            <img src="/assets/user-71-RNjOCE17.png" loading="lazy" alt="User" className="size-10 rounded" />
            <div className="flex-grow-1 content">
              <h6 className="fw-medium text-truncate mb-0 text-body">{user?.email?.split('@')[0] || 'Lucas Ethan'}</h6>
              <p className="fs-14 mb-0 text-muted">ID: 150001</p>
            </div>
            <div className="arrow">
              <i data-lucide="chevron-down" className="size-4 text-body"></i>
            </div>
          </a>
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
                  <Link className="profile-link rounded text-reset" to={ROUTES.USER_PROFILE} onClick={() => { handleLinkClick(); setOpenMenuLabel(null); }}>
                    <i data-lucide="user" className="me-2 size-4 text-muted"></i> My Profile
                  </Link>
                </li>
                <li>
                  <Link className="profile-link rounded text-reset" to={ROUTES.SETTINGS_POS} onClick={() => { handleLinkClick(); setOpenMenuLabel(null); }}>
                    <i data-lucide="settings" className="me-2 size-4 text-muted"></i> POS Settings
                  </Link>
                </li>
                <li>
                  <Link className="profile-link rounded text-reset" to={ROUTES.STAFF} onClick={() => { handleLinkClick(); setOpenMenuLabel(null); }}>
                    <i data-lucide="users" className="me-2 size-4 text-muted"></i> Staff Management
                  </Link>
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

        {/* Navigation list */}
        <div className="navbar-menu px-5" id="navbar-menu-list" data-simplebar>
          <ul className="list-unstyled navbar-nav-menu mb-0" id="metismenu">

            <NavSection title="Main" />
            <NavItem to={ROUTES.DASHBOARD} icon="home-4-line" label="Dashboard" onClickLink={() => { handleLinkClick(); setOpenMenuLabel(null); }} />
            <NavItem to={ROUTES.POS} icon="shopping-bag-3-line" label="POS" onClickLink={() => { handleLinkClick(); setOpenMenuLabel(null); }} />

            <NavSection title="Apps" />
            <NavItem to={ROUTES.APPS_CHAT} icon="chat-3-line" label="Chat" onClickLink={() => { handleLinkClick(); setOpenMenuLabel(null); }} />
            <NavItem to={ROUTES.APPS_CALENDAR} icon="calendar-line" label="Calendar" onClickLink={() => { handleLinkClick(); setOpenMenuLabel(null); }} />
            <NavItem to={ROUTES.APPS_MAILBOX} icon="mail-line" label="Email" onClickLink={() => { handleLinkClick(); setOpenMenuLabel(null); }} />

            <NavSection title="Catalog" />
            {/* Products */}
            <NavItem 
              icon="price-tag-3-line" 
              label="Products"
              isOpen={openMenuLabel === 'Products'}
              onToggle={(e) => handleToggle(e, 'Products')}
              submenuStyle={submenuStyles['Products']}
            >
              <SubMenuItem to={ROUTES.PRODUCTS} label="Product List" onClickLink={handleLinkClick} />
              <SubMenuItem to={ROUTES.PRODUCTS_ADD} label="Add Product" onClickLink={handleLinkClick} />
              <SubMenuItem to={ROUTES.PRODUCTS_CATEGORIES} label="Categories" onClickLink={handleLinkClick} />
              <SubMenuItem to={ROUTES.PRODUCTS_SUB_CATEGORIES} label="Sub Categories" onClickLink={handleLinkClick} />
              <SubMenuItem to={ROUTES.PRODUCTS_BRANDS} label="Brands" onClickLink={handleLinkClick} />
              <SubMenuItem to={ROUTES.PRODUCTS_UNITS} label="Units" onClickLink={handleLinkClick} />
              <SubMenuItem to={ROUTES.PRODUCTS_VARIANT} label="Variant" onClickLink={handleLinkClick} />
              <SubMenuItem to={ROUTES.PRODUCTS_WARRANTY} label="Warranty" onClickLink={handleLinkClick} />
              <SubMenuItem to={ROUTES.PRODUCTS_BARCODE} label="Barcode" onClickLink={handleLinkClick} />
              <SubMenuItem to={ROUTES.PRODUCTS_REVIEWS} label="Reviews" onClickLink={handleLinkClick} />
              <SubMenuItem to={ROUTES.PRODUCTS_BULK_IMPORT} label="Bulk Import" onClickLink={handleLinkClick} />
              <SubMenuItem to={ROUTES.PRODUCTS_BULK_EXPORT} label="Bulk Export" onClickLink={handleLinkClick} />
            </NavItem>

            {/* Orders */}
            <NavItem 
              icon="shopping-cart-2-line" 
              label="Orders"
              isOpen={openMenuLabel === 'Orders'}
              onToggle={(e) => handleToggle(e, 'Orders')}
              submenuStyle={submenuStyles['Orders']}
            >
              <SubMenuItem to={ROUTES.ORDERS} label="All Orders" onClickLink={handleLinkClick} />
              <SubMenuItem to={ROUTES.ORDERS_INVOICES} label="Invoices" onClickLink={handleLinkClick} />
              <SubMenuItem to={ROUTES.ORDERS_REFUND} label="Refund" onClickLink={handleLinkClick} />
            </NavItem>

            {/* Customers */}
            <NavItem 
              icon="user-3-line" 
              label="Customers"
              isOpen={openMenuLabel === 'Customers'}
              onToggle={(e) => handleToggle(e, 'Customers')}
              submenuStyle={submenuStyles['Customers']}
            >
              <SubMenuItem to={ROUTES.CUSTOMERS} label="Customer List" onClickLink={handleLinkClick} />
              <SubMenuItem to={ROUTES.CUSTOMERS_ADD} label="Add Customer" onClickLink={handleLinkClick} />
              <SubMenuItem to={ROUTES.CUSTOMERS_WALLET} label="Wallet Balance" onClickLink={handleLinkClick} />
              <SubMenuItem to={ROUTES.CUSTOMERS_ACTIVITY} label="Activity Log" onClickLink={handleLinkClick} />
            </NavItem>

            <NavSection title="Operations" />
            {/* Inventory */}
            <NavItem 
              icon="archive-line" 
              label="Inventory"
              isOpen={openMenuLabel === 'Inventory'}
              onToggle={(e) => handleToggle(e, 'Inventory')}
              submenuStyle={submenuStyles['Inventory']}
            >
              <SubMenuItem to={ROUTES.INVENTORY_STOCK_LIST} label="Stock List" onClickLink={handleLinkClick} />
              <SubMenuItem to={ROUTES.INVENTORY_STOCK_IN} label="Stock In" onClickLink={handleLinkClick} />
              <SubMenuItem to={ROUTES.INVENTORY_STOCK_OUT} label="Stock Out" onClickLink={handleLinkClick} />
              <SubMenuItem to={ROUTES.INVENTORY_STOCK_TRANSFER} label="Stock Transfer" onClickLink={handleLinkClick} />
              <SubMenuItem to={ROUTES.INVENTORY_STOCK_ADJUSTMENT} label="Stock Adjustment" onClickLink={handleLinkClick} />
              <SubMenuItem to={ROUTES.INVENTORY_BATCH} label="Batch Management" onClickLink={handleLinkClick} />
              <SubMenuItem to={ROUTES.INVENTORY_LOST} label="Lost Items" onClickLink={handleLinkClick} />
              <SubMenuItem to={ROUTES.INVENTORY_ALERTS} label="Alerts" onClickLink={handleLinkClick} />
              <SubMenuItem to={ROUTES.INVENTORY_VALUATION} label="Valuation" onClickLink={handleLinkClick} />
              <SubMenuItem to={ROUTES.INVENTORY_WAREHOUSE} label="Warehouse" onClickLink={handleLinkClick} />
            </NavItem>

            {/* Suppliers */}
            <NavItem 
              icon="truck-line" 
              label="Suppliers"
              isOpen={openMenuLabel === 'Suppliers'}
              onToggle={(e) => handleToggle(e, 'Suppliers')}
              submenuStyle={submenuStyles['Suppliers']}
            >
              <SubMenuItem to={ROUTES.SUPPLIERS} label="Supplier List" onClickLink={handleLinkClick} />
              <SubMenuItem to={ROUTES.SUPPLIERS_ADD} label="Add Supplier" onClickLink={handleLinkClick} />
              <SubMenuItem to={ROUTES.SUPPLIERS_PAYMENTS} label="Payments" onClickLink={handleLinkClick} />
              <SubMenuItem to={ROUTES.SUPPLIERS_BALANCE} label="Balance Reports" onClickLink={handleLinkClick} />
            </NavItem>

            {/* Purchase */}
            <NavItem 
              icon="file-list-3-line" 
              label="Purchase"
              isOpen={openMenuLabel === 'Purchase'}
              onToggle={(e) => handleToggle(e, 'Purchase')}
              submenuStyle={submenuStyles['Purchase']}
            >
              <SubMenuItem to={ROUTES.PURCHASE} label="All Purchases" onClickLink={handleLinkClick} />
              <SubMenuItem to={ROUTES.PURCHASE_ADD} label="Add Purchase" onClickLink={handleLinkClick} />
              <SubMenuItem to={ROUTES.PURCHASE_PAYMENTS} label="Payments" onClickLink={handleLinkClick} />
              <SubMenuItem to={ROUTES.PURCHASE_RETURNS} label="Returns" onClickLink={handleLinkClick} />
            </NavItem>

            <NavSection title="HR" />
            {/* Staff */}
            <NavItem 
              icon="team-line" 
              label="Staff"
              isOpen={openMenuLabel === 'Staff'}
              onToggle={(e) => handleToggle(e, 'Staff')}
              submenuStyle={submenuStyles['Staff']}
            >
              <SubMenuItem to={ROUTES.STAFF} label="Staff List" onClickLink={handleLinkClick} />
              <SubMenuItem to={ROUTES.STAFF_ADD} label="Add Staff" onClickLink={handleLinkClick} />
              <SubMenuItem to={ROUTES.STAFF_ATTENDANCE} label="Attendance" onClickLink={handleLinkClick} />
              <SubMenuItem to={ROUTES.STAFF_PAYROLL} label="Payroll" onClickLink={handleLinkClick} />
              <SubMenuItem to={ROUTES.STAFF_SCHEDULE} label="Schedule" onClickLink={handleLinkClick} />
              <SubMenuItem to={ROUTES.STAFF_HOLIDAYS} label="Holidays" onClickLink={handleLinkClick} />
              <SubMenuItem to={ROUTES.STAFF_ROLE_PERMISSION} label="Role & Permissions" onClickLink={handleLinkClick} />
            </NavItem>

            <NavSection title="Finance" />
            {/* Accounts */}
            <NavItem 
              icon="bank-line" 
              label="Accounts"
              isOpen={openMenuLabel === 'Accounts'}
              onToggle={(e) => handleToggle(e, 'Accounts')}
              submenuStyle={submenuStyles['Accounts']}
            >
              <SubMenuItem to={ROUTES.ACCOUNTS_BANK} label="Bank Accounts" onClickLink={handleLinkClick} />
              <SubMenuItem to={ROUTES.ACCOUNTS_EXPENSES} label="Expenses" onClickLink={handleLinkClick} />
              <SubMenuItem to={ROUTES.ACCOUNTS_INCOME} label="Income" onClickLink={handleLinkClick} />
              <SubMenuItem to={ROUTES.ACCOUNTS_MONEY_TRANSFER} label="Money Transfer" onClickLink={handleLinkClick} />
            </NavItem>

            {/* Reports */}
            <NavItem 
              icon="bar-chart-line" 
              label="Reports"
              isOpen={openMenuLabel === 'Reports'}
              onToggle={(e) => handleToggle(e, 'Reports')}
              submenuStyle={submenuStyles['Reports']}
            >
              <SubMenuItem to={ROUTES.REPORTS_SALES} label="Sales Report" onClickLink={handleLinkClick} />
              <SubMenuItem to={ROUTES.REPORTS_PURCHASES} label="Purchase Report" onClickLink={handleLinkClick} />
              <SubMenuItem to={ROUTES.REPORTS_PRODUCTS} label="Products Report" onClickLink={handleLinkClick} />
              <SubMenuItem to={ROUTES.REPORTS_EXPENSES} label="Expenses Report" onClickLink={handleLinkClick} />
              <SubMenuItem to={ROUTES.REPORTS_FINANCE} label="Finance Report" onClickLink={handleLinkClick} />
              <SubMenuItem to={ROUTES.REPORTS_SUPPLIER} label="Supplier Report" onClickLink={handleLinkClick} />
            </NavItem>

            <NavSection title="Store" />
            {/* Multi Store */}
            <NavItem 
              icon="store-2-line" 
              label="Multi Store"
              isOpen={openMenuLabel === 'Multi Store'}
              onToggle={(e) => handleToggle(e, 'Multi Store')}
              submenuStyle={submenuStyles['Multi Store']}
            >
              <SubMenuItem to={ROUTES.MULTI_STORE} label="Store List" onClickLink={handleLinkClick} />
              <SubMenuItem to={ROUTES.MULTI_STORE_ADD} label="Add Store" onClickLink={handleLinkClick} />
            </NavItem>

            <NavSection title="Pages" />
            <NavItem 
              icon="account-circle-line" 
              label="Account"
              isOpen={openMenuLabel === 'Account'}
              onToggle={(e) => handleToggle(e, 'Account')}
              submenuStyle={submenuStyles['Account']}
            >
              <SubMenuItem to={ROUTES.ACCOUNT_SETTINGS} label="Account Settings" onClickLink={handleLinkClick} />
              <SubMenuItem to={ROUTES.ACCOUNT_SECURITY} label="Security" onClickLink={handleLinkClick} />
              <SubMenuItem to={ROUTES.ACCOUNT_BILLING} label="Billing & Plans" onClickLink={handleLinkClick} />
              <SubMenuItem to={ROUTES.ACCOUNT_NOTIFICATION} label="Notification" onClickLink={handleLinkClick} />
              <SubMenuItem to={ROUTES.ACCOUNT_STATEMENTS} label="Statements" onClickLink={handleLinkClick} />
              <SubMenuItem to={ROUTES.ACCOUNT_LOGS} label="Logs" onClickLink={handleLinkClick} />
            </NavItem>
            <NavItem to={ROUTES.USER_PROFILE} icon="user-3-line" label="User Profile" onClickLink={() => { handleLinkClick(); setOpenMenuLabel(null); }} />

            <NavSection title="Configuration" />
            {/* Settings */}
            <NavItem 
              icon="settings-3-line" 
              label="Settings"
              isOpen={openMenuLabel === 'Settings'}
              onToggle={(e) => handleToggle(e, 'Settings')}
              submenuStyle={submenuStyles['Settings']}
            >
              <SubMenuItem to={ROUTES.SETTINGS_GENERAL} label="General" onClickLink={handleLinkClick} />
              <SubMenuItem to={ROUTES.SETTINGS_POS} label="POS" onClickLink={handleLinkClick} />
              <SubMenuItem to={ROUTES.SETTINGS_TAX} label="Tax" onClickLink={handleLinkClick} />
              <SubMenuItem to={ROUTES.SETTINGS_CURRENCIES} label="Currencies" onClickLink={handleLinkClick} />
              <SubMenuItem to={ROUTES.SETTINGS_COUPONS} label="Coupons" onClickLink={handleLinkClick} />
              <SubMenuItem to={ROUTES.SETTINGS_PAYMENT_GATEWAY} label="Payment Gateway" onClickLink={handleLinkClick} />
              <SubMenuItem to={ROUTES.SETTINGS_INVOICES} label="Invoices" onClickLink={handleLinkClick} />
              <SubMenuItem to={ROUTES.SETTINGS_MANAGER} label="Manager" onClickLink={handleLinkClick} />
            </NavItem>

          </ul>

          {/* Bottom toolbar inside sidebar */}
          <ul className="list-unstyled navbar-bottom-menu mb-0">
            <li className="nav-item">
              <button
                type="button"
                id="darkModeButton2"
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
            </li>
            <li className="nav-item">
              <Link className="nav-link" to={ROUTES.SETTINGS_GENERAL} onClick={() => { handleLinkClick(); setOpenMenuLabel(null); }}>
                <span className="icons"><i className="ri-user-3-line"></i></span>
              </Link>
            </li>
            <li className="nav-item">
              <button className="nav-link border-0 bg-transparent" onClick={handleLogout}>
                <span className="icons"><i className="ri-logout-circle-line"></i></span>
              </button>
            </li>
            <li className="nav-item">
              <Link to={ROUTES.USER_PROFILE} className="mt-2 py-10px" onClick={() => { handleLinkClick(); setOpenMenuLabel(null); }}>
                <img src="/assets/user-71-RNjOCE17.png" loading="lazy" alt="User" className="object-fit-cover rounded size-8" />
              </Link>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}
