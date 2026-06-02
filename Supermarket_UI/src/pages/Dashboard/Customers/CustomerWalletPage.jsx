// pages/Dashboard/Customers/CustomerWalletPage.jsx
import React, { useEffect, useState } from 'react';
import PageBreadcrumb from '../../../components/ui/PageBreadcrumb';
import { ROUTES } from '../../../configs/routes';

const initialWallets = [
  { id: 1, cusId: '#CUS1025', name: 'John Miller', email: 'john@gotpos.com', phone: '+1 765 234 8899', balance: -45.00, credit: 600.00, debit: 645.00, status: 'Blocked', lastTxn: 'Dec 18, 2025' },
  { id: 2, cusId: '#CUS1026', name: 'Sophia Brown', email: 'sophia@gotpos.com', phone: '+1 889 456 7788', balance: 150.00, credit: 900.00, debit: 750.00, status: 'Active', lastTxn: 'Dec 20, 2025' },
  { id: 3, cusId: '#CUS1027', name: 'Michael Davis', email: 'michael@gotpos.com', phone: '+1 612 987 6543', balance: 350.00, credit: 1200.00, debit: 850.00, status: 'Active', lastTxn: 'Dec 22, 2025' }
];

export default function CustomerWalletPage() {
  const [wallets, setWallets] = useState(initialWallets);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [minBalance, setMinBalance] = useState('');
  const [maxBalance, setMaxBalance] = useState('');

  // Modal State
  const [modalCustomer, setModalCustomer] = useState('');
  const [modalAmount, setModalAmount] = useState('');
  const [modalTxnType, setModalTxnType] = useState('Credit');
  const [modalStatus, setModalStatus] = useState('Active');
  const [editingId, setEditingId] = useState(null);
  const [deletingId, setDeletingId] = useState(null);

  useEffect(() => {
    if (window.lucide) {
      window.lucide.createIcons();
    }
  }, [wallets]);

  const handleDelete = () => {
    setWallets(prev => prev.filter(w => w.id !== deletingId));
    const modalElement = document.getElementById('deleteModal');
    const modalInstance = window.bootstrap?.Modal?.getInstance(modalElement);
    modalInstance?.hide();
    setDeletingId(null);
  };

  const handleFormSubmit = (e) => {
    e.preventDefault();
    const amountVal = parseFloat(modalAmount) || 0;
    const finalBalanceDelta = modalTxnType === 'Credit' ? amountVal : -amountVal;

    if (editingId) {
      // Edit mode (simply updates fields for demo)
      setWallets(prev => prev.map(w => w.id === editingId ? {
        ...w,
        status: modalStatus,
      } : w));
    } else {
      // Add transaction mode (affects balance of a new/existing customer)
      const existingCus = wallets.find(w => w.name.toLowerCase() === modalCustomer.toLowerCase());
      if (existingCus) {
        setWallets(prev => prev.map(w => w.id === existingCus.id ? {
          ...w,
          balance: w.balance + finalBalanceDelta,
          credit: modalTxnType === 'Credit' ? w.credit + amountVal : w.credit,
          debit: modalTxnType === 'Debit' ? w.debit + amountVal : w.debit,
          lastTxn: new Date().toLocaleDateString('en-US', { month: 'short', day: '2-digit', year: 'numeric' })
        } : w));
      } else {
        const newCus = {
          id: wallets.length > 0 ? Math.max(...wallets.map(w => w.id)) + 1 : 1,
          cusId: `#CUS${1025 + wallets.length}`,
          name: modalCustomer,
          email: `${modalCustomer.toLowerCase().replace(/ /g, '')}@gotpos.com`,
          phone: '+1 000 000 0000',
          balance: finalBalanceDelta,
          credit: modalTxnType === 'Credit' ? amountVal : 0,
          debit: modalTxnType === 'Debit' ? amountVal : 0,
          status: modalStatus,
          lastTxn: new Date().toLocaleDateString('en-US', { month: 'short', day: '2-digit', year: 'numeric' })
        };
        setWallets(prev => [...prev, newCus]);
      }
    }

    resetForm();

    const modalElement = document.getElementById('addWalletBalanceModal');
    const modalInstance = window.bootstrap?.Modal?.getInstance(modalElement);
    modalInstance?.hide();
  };

  const resetForm = () => {
    setModalCustomer('');
    setModalAmount('');
    setModalTxnType('Credit');
    setModalStatus('Active');
    setEditingId(null);
  };

  const openEditModal = (item) => {
    setEditingId(item.id);
    setModalCustomer(item.name);
    setModalAmount('0');
    setModalTxnType('Credit');
    setModalStatus(item.status);

    const modalElement = document.getElementById('addWalletBalanceModal');
    const modalInstance = new window.bootstrap.Modal(modalElement);
    modalInstance.show();
  };

  const openAddModal = () => {
    resetForm();
    const modalElement = document.getElementById('addWalletBalanceModal');
    const modalInstance = new window.bootstrap.Modal(modalElement);
    modalInstance.show();
  };

  const filteredWallets = wallets.filter(w => {
    const matchesSearch = w.name.toLowerCase().includes(search.toLowerCase()) || 
                          w.cusId.toLowerCase().includes(search.toLowerCase());
    const matchesStatus = statusFilter === 'all' || w.status.toLowerCase() === statusFilter.toLowerCase();
    
    const minVal = parseFloat(minBalance);
    const maxVal = parseFloat(maxBalance);
    const matchesMin = isNaN(minVal) || w.balance >= minVal;
    const matchesMax = isNaN(maxVal) || w.balance <= maxVal;

    return matchesSearch && matchesStatus && matchesMin && matchesMax;
  });

  return (
    <div className="container-fluid">
      <PageBreadcrumb title="Wallet Balance" breadcrumbs={[{ label: 'Dashboard', href: ROUTES.DASHBOARD }, { label: 'Customers' }, { label: 'Wallet Balance' }]} />

      <div className="card">
        <div className="card-header d-flex flex-wrap gap-3 justify-content-between align-items-center">
          <h5 className="card-title mb-0">Customer Wallet Balance</h5>
          <div className="d-flex flex-wrap gap-2 align-items-center ms-auto">
            <div className="position-relative">
              <input type="text" className="form-control ps-9" placeholder="Search Customer..." value={search} onChange={e => setSearch(e.target.value)} />
              <i data-lucide="search" className="size-4 icon-dark position-absolute top-50 start-0 ms-3 translate-middle-y"></i>
            </div>
            <select className="form-select w-36" value={statusFilter} onChange={e => setStatusFilter(e.target.value)}>
              <option value="all">All Status</option>
              <option value="active">Active</option>
              <option value="blocked">Blocked</option>
            </select>
            <input type="number" className="form-control w-28" placeholder="Min Bal" value={minBalance} onChange={e => setMinBalance(e.target.value)} />
            <input type="number" className="form-control w-28" placeholder="Max Bal" value={maxBalance} onChange={e => setMaxBalance(e.target.value)} />
            <button className="btn btn-primary d-flex align-items-center gap-1" onClick={openAddModal}>
              <i className="ri-add-line fs-lg"></i> Add Balance
            </button>
          </div>
        </div>
        <div className="card-body pt-0">
          <div className="table-card table-responsive">
            <table className="table align-middle text-nowrap mb-0">
              <thead>
                <tr className="bg-light border-bottom">
                  <th>
                    <div className="form-check check-primary">
                      <input className="form-check-input" type="checkbox" aria-label="checkbox" id="checAllData" />
                    </div>
                  </th>
                  <th className="fw-medium text-muted">Customer ID</th>
                  <th className="fw-medium text-muted">Customer</th>
                  <th className="fw-medium text-muted">Phone</th>
                  <th className="fw-medium text-muted">Wallet Balance</th>
                  <th className="fw-medium text-muted">Total Credit</th>
                  <th className="fw-medium text-muted">Total Debit</th>
                  <th className="fw-medium text-muted">Wallet Status</th>
                  <th className="fw-medium text-muted">Last Wallet Txn</th>
                  <th className="fw-medium text-muted">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredWallets.length === 0 ? (
                  <tr>
                    <td colSpan="10" className="text-center text-muted py-4">No records found.</td>
                  </tr>
                ) : (
                  filteredWallets.map(item => (
                    <tr key={item.id}>
                      <td>
                        <div className="form-check check-primary">
                          <input className="form-check-input" type="checkbox" id={`check_${item.id}`} />
                        </div>
                      </td>
                      <td><span className="fw-semibold text-primary">{item.cusId}</span></td>
                      <td>
                        <div className="d-flex align-items-center gap-2">
                          <div className="avatar size-9 rounded-circle bg-light d-flex align-items-center justify-content-center">
                            <i className="ri-user-line text-muted"></i>
                          </div>
                          <div>
                            <div className="fw-semibold text-reset">{item.name}</div>
                            <div className="text-muted fs-sm">{item.email}</div>
                          </div>
                        </div>
                      </td>
                      <td>{item.phone}</td>
                      <td>
                        <span className={`fw-semibold ${item.balance >= 0 ? 'text-success' : 'text-danger'}`}>
                          {item.balance >= 0 ? `+ $${item.balance.toFixed(2)}` : `- $${Math.abs(item.balance).toFixed(2)}`}
                        </span>
                      </td>
                      <td>${item.credit.toFixed(2)}</td>
                      <td>${item.debit.toFixed(2)}</td>
                      <td>
                        <span className={`badge bg-${item.status === 'Active' ? 'success' : 'danger'}-subtle text-${item.status === 'Active' ? 'success' : 'danger'}`}>
                          {item.status}
                        </span>
                      </td>
                      <td className="text-muted">{item.lastTxn}</td>
                      <td>
                        <div className="d-flex gap-2">
                          <button className="btn btn-sub-secondary size-8 btn-icon" onClick={() => openEditModal(item)}><i className="ri-edit-line"></i></button>
                          <button className="btn btn-sub-danger size-8 btn-icon" data-bs-toggle="modal" data-bs-target="#deleteModal" onClick={() => setDeletingId(item.id)}><i className="ri-delete-bin-line"></i></button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
          <div className="row align-items-center g-3 mt-2">
            <div className="col-md-6">
              <p className="text-muted text-center text-md-start mb-0">
                Showing <b className="me-1">1-{filteredWallets.length}</b> of <b className="ms-1">{filteredWallets.length}</b> Results
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Add Wallet Balance Modal */}
      <div className="modal fade" id="addWalletBalanceModal" tabIndex="-1" aria-labelledby="addWalletBalanceModalLabel" aria-hidden="true">
        <div className="modal-dialog modal-dialog-centered">
          <div className="modal-content">
            <div className="modal-header">
              <h6 className="modal-title" id="addWalletBalanceModalLabel">{editingId ? 'Edit Wallet Status' : 'Add Wallet Transaction'}</h6>
              <button type="button" className="btn-close" data-bs-dismiss="modal"></button>
            </div>
            <div className="modal-body">
              <form onSubmit={handleFormSubmit}>
                <div className="mb-3">
                  <label className="form-label">Customer Name <span className="text-danger">*</span></label>
                  <input type="text" className="form-control" placeholder="e.g., John Miller" value={modalCustomer} onChange={e => setModalCustomer(e.target.value)} required disabled={!!editingId} />
                </div>
                {!editingId && (
                  <>
                    <div className="mb-3">
                      <label className="form-label">Amount ($) <span className="text-danger">*</span></label>
                      <input type="text" className="form-control" placeholder="0.00" value={modalAmount} onChange={e => setModalAmount(e.target.value)} required />
                    </div>
                    <div className="mb-3">
                      <label className="form-label">Transaction Type</label>
                      <select className="form-select" value={modalTxnType} onChange={e => setModalTxnType(e.target.value)}>
                        <option value="Credit">Credit (Add Balance)</option>
                        <option value="Debit">Debit (Deduct Balance)</option>
                      </select>
                    </div>
                  </>
                )}
                <div className="mb-3">
                  <label className="form-label">Wallet Status</label>
                  <select className="form-select" value={modalStatus} onChange={e => setModalStatus(e.target.value)}>
                    <option value="Active">Active</option>
                    <option value="Blocked">Blocked</option>
                  </select>
                </div>
                <div className="d-flex gap-2 mt-7">
                  <button type="button" className="btn btn-light w-100" data-bs-dismiss="modal">Close</button>
                  <button type="submit" className="btn btn-primary w-100">{editingId ? 'Save Changes' : 'Submit'}</button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>

      {/* Delete Modal */}
      <div className="modal fade" id="deleteModal" tabIndex="-1" aria-labelledby="deleteModalLabel" aria-hidden="true">
        <div className="modal-dialog modal-dialog-centered modal-xs">
          <div className="modal-content p-7 text-center">
            <div className="d-flex justify-content-center mb-4">
              <div className="size-14 bg-danger-subtle rounded-circle d-flex align-items-center justify-content-center size-16">
                <i className="ri-delete-bin-line text-danger fs-2xl"></i>
              </div>
            </div>
            <h5 className="mb-4 lh-base">Are you sure you want to delete this Wallet?</h5>
            <div className="d-flex justify-content-center align-items-center gap-2">
              <button type="button" className="btn btn-danger" onClick={handleDelete}>Delete</button>
              <button type="button" className="btn btn-link text-reset" data-bs-dismiss="modal">Cancel</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
