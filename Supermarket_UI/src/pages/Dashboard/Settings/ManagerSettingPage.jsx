// pages/Dashboard/Settings/ManagerSettingPage.jsx
import React, { useEffect, useState } from 'react';
import SettingsTabNav from './SettingsTabNav';

export default function ManagerSettingPage() {
  const [viewReports, setViewReports] = useState(true);
  const [modifyPrices, setModifyPrices] = useState(false);
  const [approvePayments, setApprovePayments] = useState(true);
  const [staffManagement, setStaffManagement] = useState(false);
  const [discountCap, setDiscountCap] = useState('20');

  useEffect(() => {
    if (window.lucide) {
      window.lucide.createIcons();
    }
  }, []);

  const handleSave = (e) => {
    e.preventDefault();
    alert('Manager permissions saved successfully!');
  };

  return (
    <div className="container-fluid">
      <div className="mb-5">
        <h4 className="fs-xl">Settings</h4>
        <p className="text-muted">Manage overall store preferences and system configurations.</p>
      </div>

      <SettingsTabNav />

      <div className="card">
        <div className="card-body">
          <form onSubmit={handleSave}>
            <h6 className="mb-1 fs-16">Default Manager Rules</h6>
            <p className="text-muted mb-8">Define access permissions and limits for the manager role.</p>

            <div className="d-flex flex-column gap-6">
              <div className="d-flex flex-wrap gap-4 justify-content-between align-items-center">
                <div>
                  <h6 className="mb-0 fw-medium">View Financial Reports</h6>
                  <p className="text-muted mb-0 fs-xs">Allow manager to view daily/monthly sales and expense statements.</p>
                </div>
                <div className="form-switch switch-light-primary">
                  <input type="checkbox" id="viewReports" checked={viewReports} onChange={e => setViewReports(e.target.checked)} />
                  <label className="label" htmlFor="viewReports"></label>
                </div>
              </div>

              <div className="d-flex flex-wrap gap-4 justify-content-between align-items-center">
                <div>
                  <h6 className="mb-0 fw-medium">Modify Product Prices</h6>
                  <p className="text-muted mb-0 fs-xs">Allow manager to alter retail and wholesale prices directly on POS.</p>
                </div>
                <div className="form-switch switch-light-primary">
                  <input type="checkbox" id="modifyPrices" checked={modifyPrices} onChange={e => setModifyPrices(e.target.checked)} />
                  <label className="label" htmlFor="modifyPrices"></label>
                </div>
              </div>

              <div className="d-flex flex-wrap gap-4 justify-content-between align-items-center">
                <div>
                  <h6 className="mb-0 fw-medium">Approve Supplier Payments</h6>
                  <p className="text-muted mb-0 fs-xs">Allow manager to approve pending balances and supplier dues.</p>
                </div>
                <div className="form-switch switch-light-primary">
                  <input type="checkbox" id="approvePayments" checked={approvePayments} onChange={e => setApprovePayments(e.target.checked)} />
                  <label className="label" htmlFor="approvePayments"></label>
                </div>
              </div>

              <div className="d-flex flex-wrap gap-4 justify-content-between align-items-center">
                <div>
                  <h6 className="mb-0 fw-medium">Staff & Attendance Management</h6>
                  <p className="text-muted mb-0 fs-xs">Allow manager to schedule shifts, approve leaves, and edit payroll.</p>
                </div>
                <div className="form-switch switch-light-primary">
                  <input type="checkbox" id="staffManagement" checked={staffManagement} onChange={e => setStaffManagement(e.target.checked)} />
                  <label className="label" htmlFor="staffManagement"></label>
                </div>
              </div>

              <hr className="my-3" />

              <div className="row g-2 align-items-center">
                <div className="col-md-4">
                  <label htmlFor="discountCap" className="form-label mb-1 fs-15">Max Discount Cap (%)</label>
                  <p className="text-muted mb-0 fs-xs">Limit the maximum manual discount a manager can apply.</p>
                </div>
                <div className="col-md-8">
                  <input type="number" id="discountCap" className="form-control w-32" value={discountCap} onChange={e => setDiscountCap(e.target.value)} />
                </div>
              </div>
            </div>

            <div className="text-end mt-5">
              <button type="button" className="btn btn-outline-light border me-1">Cancel</button>
              <button type="submit" className="btn btn-primary">Save Manager Rules</button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
