// pages/Dashboard/Suppliers/SupplierBalanceReportsPage.jsx
import React, { useEffect, useState } from 'react';
import PageBreadcrumb from '../../../components/ui/PageBreadcrumb';
import { ROUTES } from '../../../configs/routes';

const initialBalances = [
  { id: 1, name: 'Ava Mason', bankAccount: 'SWIZ - 3456565767787', status: 'Active', credit: 614848.00, debit: -450.00, balance: 614389.00 },
  { id: 2, name: 'Caspian Marigold', bankAccount: 'NBC - 4324356677889', status: 'Inactive', credit: 1686.00, debit: -700.00, balance: 986.00 },
  { id: 3, name: 'Emma James', bankAccount: 'NBC - 2343547586900', status: 'Active', credit: 16547.00, debit: -1000.00, balance: 15547.00 },
  { id: 4, name: 'Isabella Jackson', bankAccount: 'IBO - 3434565776768', status: 'Pending', credit: 77818.00, debit: -300.00, balance: 77518.00 },
  { id: 5, name: 'Olivia Ethan', bankAccount: 'IBO - 3453647664889', status: 'Active', credit: 141845.00, debit: -1200.00, balance: 141645.00 }
];

export default function SupplierBalanceReportsPage() {
  const [balances, setBalances] = useState(initialBalances);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  useEffect(() => {
    if (window.lucide) {
      window.lucide.createIcons();
    }
  }, [balances]);

  const handleExport = (format) => {
    alert(`Successfully exported balance reports to ${format}!`);
  };

  const filteredBalances = balances.filter(b => {
    const matchesSearch = b.name.toLowerCase().includes(search.toLowerCase()) || 
                          b.bankAccount.toLowerCase().includes(search.toLowerCase());
    const matchesStatus = statusFilter === 'all' || b.status.toLowerCase() === statusFilter.toLowerCase();
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="container-fluid">
      <PageBreadcrumb title="Balance Reports" breadcrumbs={[{ label: 'Dashboard', href: ROUTES.DASHBOARD }, { label: 'Suppliers' }, { label: 'Balance Reports' }]} />

      <div className="card">
        <div className="card-header">
          <div className="row g-2 justify-content-between align-items-center">
            <div className="col-md-6 col-lg-5 col-xl-4 col-xxl-3">
              <div className="position-relative">
                <input type="text" className="form-control ps-9" placeholder="Search Name, Bank & Account Number..." value={search} onChange={e => setSearch(e.target.value)} />
                <i data-lucide="search" className="size-4 icon-dark position-absolute top-50 start-0 ms-3 translate-middle-y"></i>
              </div>
            </div>
            <div className="col-md-4 d-flex justify-content-end gap-2">
              <select className="form-select w-36" value={statusFilter} onChange={e => setStatusFilter(e.target.value)}>
                <option value="all">All Status</option>
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
                <option value="pending">Pending</option>
              </select>
              <div className="dropdown">
                <button type="button" className="btn btn-outline-light border text-dark dropdown-toggle" data-bs-toggle="dropdown" aria-expanded="false">
                  <i className="ri-download-2-line me-1"></i> Export As
                </button>
                <ul className="dropdown-menu dropdown-menu-end">
                  <li><button className="dropdown-item" onClick={() => handleExport('PDF')}>Print PDF</button></li>
                  <li><button className="dropdown-item" onClick={() => handleExport('CSV')}>Export CSV</button></li>
                  <li><button className="dropdown-item" onClick={() => handleExport('XML')}>Export XML</button></li>
                </ul>
              </div>
            </div>
          </div>
        </div>
        <div className="card-body pt-0">
          <div className="table-card table-responsive">
            <table className="table align-middle mb-0 text-nowrap">
              <thead>
                <tr className="bg-light border-bottom">
                  <th className="fw-medium text-muted">Name</th>
                  <th className="fw-medium text-muted">Bank & Account Number</th>
                  <th className="fw-medium text-muted">Status</th>
                  <th className="fw-medium text-muted">Credit</th>
                  <th className="fw-medium text-muted">Debit</th>
                  <th className="fw-medium text-muted">Balance</th>
                </tr>
              </thead>
              <tbody>
                {filteredBalances.length === 0 ? (
                  <tr>
                    <td colSpan="6" className="text-center text-muted py-4">No records found.</td>
                  </tr>
                ) : (
                  filteredBalances.map(item => (
                    <tr key={item.id}>
                      <td><span className="fw-semibold text-reset">{item.name}</span></td>
                      <td><span className="fw-semibold text-primary">{item.bankAccount}</span></td>
                      <td>
                        <span className={`badge bg-${item.status === 'Active' ? 'success' : item.status === 'Inactive' ? 'danger' : 'warning'}-subtle text-${item.status === 'Active' ? 'success' : item.status === 'Inactive' ? 'danger' : 'warning'}`}>
                          {item.status}
                        </span>
                      </td>
                      <td className="text-success">${item.credit.toLocaleString()}</td>
                      <td className="text-danger">-${Math.abs(item.debit).toLocaleString()}</td>
                      <td className="fw-semibold">${item.balance.toLocaleString()}</td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
          <div className="row align-items-center g-3 mt-2">
            <div className="col-md-6">
              <p className="text-muted text-center text-md-start mb-0">
                Showing <b className="me-1">1-{filteredBalances.length}</b> of <b className="ms-1">{filteredBalances.length}</b> Results
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
