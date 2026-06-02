// pages/Dashboard/Account/AccountStatementsPage.jsx
import React, { useState } from 'react';

const initialStatements = [
  { id: 'ST-9021', date: '2026-06-01', desc: 'Main Branch POS Sales Settlement', type: 'Credit', amount: 14250.00, balance: 48120.00 },
  { id: 'ST-9020', date: '2026-05-30', desc: 'Supplier Payment - Apple Supply Co.', type: 'Debit', amount: 8900.00, balance: 33870.00 },
  { id: 'ST-9019', date: '2026-05-28', desc: 'Electricity Bill payment - Main Warehouse', type: 'Debit', amount: 450.00, balance: 42770.00 },
  { id: 'ST-9018', date: '2026-05-25', desc: 'Transfer from Branch 2 Cash Registry', type: 'Credit', amount: 5200.00, balance: 43220.00 },
  { id: 'ST-9017', date: '2026-05-24', desc: 'Premium Subscription auto-renewal', type: 'Debit', amount: 49.00, balance: 38020.00 },
  { id: 'ST-9016', date: '2026-05-20', desc: 'Local Tax Payment - Q1 2026', type: 'Debit', amount: 1500.00, balance: 38069.00 }
];

export default function AccountStatementsPage() {
  const [statements] = useState(initialStatements);
  const [search, setSearch] = useState('');
  const [typeFilter, setTypeFilter] = useState('all');

  const filtered = statements.filter(s => {
    const matchesSearch = s.desc.toLowerCase().includes(search.toLowerCase()) || s.id.toLowerCase().includes(search.toLowerCase());
    const matchesType = typeFilter === 'all' || s.type.toLowerCase() === typeFilter.toLowerCase();
    return matchesSearch && matchesType;
  });

  return (
    <div className="card">
      <div className="card-header d-flex flex-wrap gap-3 justify-content-between align-items-center">
        <h5 className="card-title mb-0">Financial Statements</h5>
        <div className="d-flex flex-wrap gap-2 align-items-center ms-auto">
          <div className="position-relative">
            <input type="text" className="form-control ps-9" placeholder="Search description, ID..." value={search} onChange={e => setSearch(e.target.value)} />
            <i data-lucide="search" className="size-4 icon-dark position-absolute top-50 start-0 ms-3 translate-middle-y"></i>
          </div>
          <select className="form-select w-36" value={typeFilter} onChange={e => setTypeFilter(e.target.value)}>
            <option value="all">All Types</option>
            <option value="credit">Credit (+)</option>
            <option value="debit">Debit (-)</option>
          </select>
          <button type="button" className="btn btn-outline-primary" onClick={() => alert('Exporting all statements to CSV...')}>
            <i className="ri-file-excel-line me-1"></i> Export CSV
          </button>
        </div>
      </div>
      <div className="card-body pt-0">
        <div className="table-card table-responsive">
          <table className="table align-middle text-nowrap mb-0">
            <thead>
              <tr className="bg-light border-bottom">
                <th>Statement ID</th>
                <th>Date</th>
                <th>Description</th>
                <th>Type</th>
                <th>Amount</th>
                <th>Account Balance</th>
                <th className="text-end">Download</th>
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan="7" className="text-center text-muted py-4">No statements found.</td>
                </tr>
              ) : (
                filtered.map(s => (
                  <tr key={s.id}>
                    <td><span className="fw-semibold text-primary">{s.id}</span></td>
                    <td>{s.date}</td>
                    <td className="text-wrap" style={{ maxWidth: '280px' }}>{s.desc}</td>
                    <td>
                      <span className={`badge bg-${s.type === 'Credit' ? 'success' : 'danger'}-subtle text-${s.type === 'Credit' ? 'success' : 'danger'}`}>
                        {s.type}
                      </span>
                    </td>
                    <td className={`fw-semibold text-${s.type === 'Credit' ? 'success' : 'danger'}`}>
                      {s.type === 'Credit' ? '+' : '-'}${s.amount.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                    </td>
                    <td className="fw-semibold text-dark">${s.balance.toLocaleString(undefined, { minimumFractionDigits: 2 })}</td>
                    <td className="text-end">
                      <button type="button" className="btn btn-sm btn-icon btn-light" onClick={() => alert(`Downloading statement PDF for ${s.id}`)}>
                        <i className="ri-download-2-line"></i>
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
