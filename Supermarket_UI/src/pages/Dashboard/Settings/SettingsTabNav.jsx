// pages/Dashboard/Settings/SettingsTabNav.jsx
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { ROUTES } from '../../../configs/routes';

export default function SettingsTabNav() {
  const location = useLocation();
  const currentPath = location.pathname;

  const tabs = [
    { label: 'Tax', path: ROUTES.SETTINGS_TAX },
    { label: 'Coupons', path: ROUTES.SETTINGS_COUPONS },
    { label: 'General', path: ROUTES.SETTINGS_GENERAL },
    { label: 'POS', path: ROUTES.SETTINGS_POS },
    { label: 'Payment Gateway', path: ROUTES.SETTINGS_PAYMENT_GATEWAY },
    { label: 'Currencies', path: ROUTES.SETTINGS_CURRENCIES },
    { label: 'Invoices', path: ROUTES.SETTINGS_INVOICES },
    { label: 'Manager', path: ROUTES.SETTINGS_MANAGER }
  ];

  return (
    <ul className="nav nav-underline mb-5 border-bottom nav-primary" id="settings-tab" role="tablist">
      {tabs.map((tab, idx) => {
        const isActive = currentPath === tab.path;
        return (
          <li key={idx} className="nav-item" role="presentation">
            <Link to={tab.path} className={`nav-link py-6px ${isActive ? 'active' : ''}`}>
              {tab.label}
            </Link>
          </li>
        );
      })}
    </ul>
  );
}
