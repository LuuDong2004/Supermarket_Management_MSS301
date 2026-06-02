// pages/Dashboard/Account/AccountNotificationPage.jsx
import React, { useState } from 'react';

export default function AccountNotificationPage() {
  const [emailSettings, setEmailSettings] = useState({
    stockAlerts: true,
    weeklyReport: true,
    dailySummary: false,
    securityLogs: true
  });

  const [pushSettings, setPushSettings] = useState({
    instantAlerts: true,
    customerActivity: false,
    newOrders: true,
    shiftClosing: true
  });

  const handleEmailToggle = (key) => {
    setEmailSettings(prev => ({ ...prev, [key]: !prev[key] }));
  };

  const handlePushToggle = (key) => {
    setPushSettings(prev => ({ ...prev, [key]: !prev[key] }));
  };

  const handleSave = (e) => {
    e.preventDefault();
    alert('Notification settings updated successfully!');
  };

  return (
    <div className="card">
      <div className="card-header">
        <h5 className="card-title mb-0">Notification Settings</h5>
      </div>
      <div className="card-body">
        <form onSubmit={handleSave}>
          <div className="row g-4">
            {/* Email Notifications Section */}
            <div className="col-lg-6">
              <h6 className="fw-semibold mb-3"><i className="ri-mail-line me-2"></i>Email Notifications</h6>
              <p className="text-muted fs-sm">Configure what alerts and reports you want to receive on your primary email address.</p>
              
              <div className="vstack gap-3 mt-3">
                <div className="d-flex align-items-center justify-content-between p-3 border rounded bg-light bg-opacity-25">
                  <div>
                    <h6 className="mb-1">Low Stock Alerts</h6>
                    <p className="text-muted fs-xs mb-0">Receive email as soon as an item crosses threshold.</p>
                  </div>
                  <div className="form-switch switch-light-primary my-auto d-flex">
                    <input type="checkbox" className="form-check-input cursor-pointer" checked={emailSettings.stockAlerts} onChange={() => handleEmailToggle('stockAlerts')} />
                  </div>
                </div>

                <div className="d-flex align-items-center justify-content-between p-3 border rounded bg-light bg-opacity-25">
                  <div>
                    <h6 className="mb-1">Weekly Store Report</h6>
                    <p className="text-muted fs-xs mb-0">Summary of sales, stock valuation and cash transfer.</p>
                  </div>
                  <div className="form-switch switch-light-primary my-auto d-flex">
                    <input type="checkbox" className="form-check-input cursor-pointer" checked={emailSettings.weeklyReport} onChange={() => handleEmailToggle('weeklyReport')} />
                  </div>
                </div>

                <div className="d-flex align-items-center justify-content-between p-3 border rounded bg-light bg-opacity-25">
                  <div>
                    <h6 className="mb-1">Daily Summary</h6>
                    <p className="text-muted fs-xs mb-0">End-of-day sales statistics and shift status.</p>
                  </div>
                  <div className="form-switch switch-light-primary my-auto d-flex">
                    <input type="checkbox" className="form-check-input cursor-pointer" checked={emailSettings.dailySummary} onChange={() => handleEmailToggle('dailySummary')} />
                  </div>
                </div>

                <div className="d-flex align-items-center justify-content-between p-3 border rounded bg-light bg-opacity-25">
                  <div>
                    <h6 className="mb-1">Security & Access Logs</h6>
                    <p className="text-muted fs-xs mb-0">Get emails for login attempts from new devices.</p>
                  </div>
                  <div className="form-switch switch-light-primary my-auto d-flex">
                    <input type="checkbox" className="form-check-input cursor-pointer" checked={emailSettings.securityLogs} onChange={() => handleEmailToggle('securityLogs')} />
                  </div>
                </div>
              </div>
            </div>

            {/* Push / SMS Notifications Section */}
            <div className="col-lg-6">
              <h6 className="fw-semibold mb-3"><i className="ri-smartphone-line me-2"></i>Push & SMS Alerts</h6>
              <p className="text-muted fs-sm">Configure instant push notifications on your phone or tablet application.</p>
              
              <div className="vstack gap-3 mt-3">
                <div className="d-flex align-items-center justify-content-between p-3 border rounded bg-light bg-opacity-25">
                  <div>
                    <h6 className="mb-1">Critical Stock Warning</h6>
                    <p className="text-muted fs-xs mb-0">Immediate alerts when items are completely out of stock.</p>
                  </div>
                  <div className="form-switch switch-light-primary my-auto d-flex">
                    <input type="checkbox" className="form-check-input cursor-pointer" checked={pushSettings.instantAlerts} onChange={() => handlePushToggle('instantAlerts')} />
                  </div>
                </div>

                <div className="d-flex align-items-center justify-content-between p-3 border rounded bg-light bg-opacity-25">
                  <div>
                    <h6 className="mb-1">Customer Activity Logs</h6>
                    <p className="text-muted fs-xs mb-0">Notify when wallet balances are adjusted manually.</p>
                  </div>
                  <div className="form-switch switch-light-primary my-auto d-flex">
                    <input type="checkbox" className="form-check-input cursor-pointer" checked={pushSettings.customerActivity} onChange={() => handlePushToggle('customerActivity')} />
                  </div>
                </div>

                <div className="d-flex align-items-center justify-content-between p-3 border rounded bg-light bg-opacity-25">
                  <div>
                    <h6 className="mb-1">New Order Created</h6>
                    <p className="text-muted fs-xs mb-0">Notification for each checkout made via terminal.</p>
                  </div>
                  <div className="form-switch switch-light-primary my-auto d-flex">
                    <input type="checkbox" className="form-check-input cursor-pointer" checked={pushSettings.newOrders} onChange={() => handlePushToggle('newOrders')} />
                  </div>
                </div>

                <div className="d-flex align-items-center justify-content-between p-3 border rounded bg-light bg-opacity-25">
                  <div>
                    <h6 className="mb-1">Shift Closing Summary</h6>
                    <p className="text-muted fs-xs mb-0">Alert when a staff closes cash drawer register.</p>
                  </div>
                  <div className="form-switch switch-light-primary my-auto d-flex">
                    <input type="checkbox" className="form-check-input cursor-pointer" checked={pushSettings.shiftClosing} onChange={() => handlePushToggle('shiftClosing')} />
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="d-flex justify-content-end gap-2 mt-4 pt-3 border-top">
            <button type="button" className="btn btn-light">Reset Defaults</button>
            <button type="submit" className="btn btn-primary">Save Preferences</button>
          </div>
        </form>
      </div>
    </div>
  );
}
