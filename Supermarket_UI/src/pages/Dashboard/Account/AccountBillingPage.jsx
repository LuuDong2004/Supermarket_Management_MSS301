// pages/Dashboard/Account/AccountBillingPage.jsx
import React from 'react';

export default function AccountBillingPage() {
  const invoices = [
    { id: 'INV-2026-005', date: '2026-05-24', plan: 'POS Premium Tier', amount: 49.00, status: 'Paid' },
    { id: 'INV-2026-004', date: '2026-04-24', plan: 'POS Premium Tier', amount: 49.00, status: 'Paid' },
    { id: 'INV-2026-003', date: '2026-03-24', plan: 'POS Premium Tier', amount: 49.00, status: 'Paid' },
    { id: 'INV-2026-002', date: '2026-02-24', plan: 'POS Premium Tier', amount: 49.00, status: 'Paid' },
    { id: 'INV-2026-001', date: '2026-01-24', plan: 'POS Premium Tier', amount: 49.00, status: 'Paid' }
  ];

  return (
    <div className="row g-4">
      {/* Current Plan Card */}
      <div className="col-lg-6">
        <div className="card h-100">
          <div className="card-header">
            <h5 className="card-title mb-0">Current Plan</h5>
          </div>
          <div className="card-body d-flex flex-column justify-content-between">
            <div>
              <div className="d-flex align-items-center justify-content-between mb-3">
                <span className="badge bg-primary text-white fs-13 py-1.5 px-3">GotPOS Premium Plan</span>
                <h4 className="mb-0 text-primary fw-bold">$49<span className="fs-sm fw-normal text-muted">/month</span></h4>
              </div>
              <p className="text-muted">You are currently on our Premium POS tier. You have unlimited transactions, advanced multi-warehouse sync, and 24/7 priority support.</p>
              <ul className="ps-3 mb-4 text-muted">
                <li>Unlimited store terminals</li>
                <li>Real-time stock sync with branch warehouses</li>
                <li>Advanced financial statements and CSV/Excel exports</li>
              </ul>
              <div className="alert alert-info py-2 px-3 border-0 d-flex align-items-center gap-2 mb-0">
                <i className="ri-information-line fs-18"></i>
                <span className="fs-sm">Next billing date is <strong>June 24, 2026</strong>.</span>
              </div>
            </div>
            <div className="d-flex gap-2 mt-4">
              <button type="button" className="btn btn-outline-danger" onClick={() => alert('Plan cancellation is disabled in demo mode.')}>Cancel Plan</button>
              <button type="button" className="btn btn-primary" onClick={() => alert('Upgrade modal will open.')}>Upgrade Plan</button>
            </div>
          </div>
        </div>
      </div>

      {/* Payment Method Card */}
      <div className="col-lg-6">
        <div className="card h-100">
          <div className="card-header">
            <h5 className="card-title mb-0">Payment Method</h5>
          </div>
          <div className="card-body d-flex flex-column justify-content-between">
            <div>
              <p className="text-muted">Manage your credit cards, billing details, and payment options for subscription renewal.</p>
              <div className="card border shadow-none bg-light p-4 mb-4">
                <div className="d-flex align-items-center justify-content-between mb-3">
                  <span className="fw-semibold fs-16">Primary Card</span>
                  <img src="https://upload.wikimedia.org/wikipedia/commons/5/5e/Visa_Inc._logo.svg" alt="Visa" style={{ height: '22px' }} />
                </div>
                <h5 className="mb-2">•••• •••• •••• 4242</h5>
                <div className="d-flex justify-content-between align-items-center text-muted fs-sm">
                  <span>Lucas Ethan</span>
                  <span>Expires 12/28</span>
                </div>
              </div>
            </div>
            <div className="d-flex gap-2 justify-content-end">
              <button type="button" className="btn btn-outline-primary" onClick={() => alert('Edit card details')}>Edit Details</button>
              <button type="button" className="btn btn-primary" onClick={() => alert('Add new payment method')}>Add New Card</button>
            </div>
          </div>
        </div>
      </div>

      {/* Invoices List */}
      <div className="col-12">
        <div className="card">
          <div className="card-header">
            <h5 className="card-title mb-0">Billing History</h5>
          </div>
          <div className="card-body pt-0">
            <div className="table-card table-responsive">
              <table className="table align-middle mb-0">
                <thead>
                  <tr className="bg-light border-bottom">
                    <th>Invoice ID</th>
                    <th>Date</th>
                    <th>Plan / Description</th>
                    <th>Amount</th>
                    <th>Status</th>
                    <th className="text-end">Download</th>
                  </tr>
                </thead>
                <tbody>
                  {invoices.map(inv => (
                    <tr key={inv.id}>
                      <td><span className="fw-semibold text-primary">{inv.id}</span></td>
                      <td>{inv.date}</td>
                      <td>{inv.plan}</td>
                      <td className="fw-semibold">${inv.amount.toFixed(2)}</td>
                      <td>
                        <span className="badge bg-success-subtle text-success">
                          {inv.status}
                        </span>
                      </td>
                      <td className="text-end">
                        <button type="button" className="btn btn-sm btn-icon btn-light" onClick={() => alert(`Downloading PDF for invoice ${inv.id}`)}>
                          <i className="ri-download-2-line"></i>
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
