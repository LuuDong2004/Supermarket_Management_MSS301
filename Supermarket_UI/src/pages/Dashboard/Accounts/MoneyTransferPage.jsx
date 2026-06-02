// pages/Dashboard/Accounts/MoneyTransferPage.jsx
import React, { useEffect, useState } from 'react';
import PageBreadcrumb from '../../../components/ui/PageBreadcrumb';
import { ROUTES } from '../../../configs/routes';

const initialTransfers = [
  { id: 1, txnId: 'TXN-102458', fromAccount: '**** 2233', toAccount: '**** 8899', recipient: 'Emma Watson', recipientAvatar: '/assets/user-3-Bz6g7hsE.png', amount: 1100, currency: 'USD', status: 'Pending', date: '2025-12-17' },
  { id: 2, txnId: 'TXN-102459', fromAccount: '**** 3344', toAccount: '**** 9988', recipient: 'Liam Carter', recipientAvatar: '/assets/user-4-7l52E1Lo.png', amount: 950, currency: 'USD', status: 'Completed', date: '2025-12-16' },
  { id: 3, txnId: 'TXN-102460', fromAccount: '**** 4455', toAccount: '**** 2233', recipient: 'Olivia Taylor', recipientAvatar: '/assets/user-5-BsT8d_Co.png', amount: 2500, currency: 'USD', status: 'Completed', date: '2025-12-15' },
  { id: 4, txnId: 'TXN-102461', fromAccount: '**** 5566', toAccount: '**** 3344', recipient: 'William Harris', recipientAvatar: '/assets/user-6-BIO7_TUU.png', amount: 1750, currency: 'USD', status: 'Failed', date: '2025-12-14' },
  { id: 5, txnId: 'TXN-102462', fromAccount: '**** 6677', toAccount: '**** 4455', recipient: 'Ava Martinez', recipientAvatar: '/assets/user-7-BMyy-xCq.png', amount: 3200, currency: 'USD', status: 'Completed', date: '2025-12-13' },
  { id: 6, txnId: 'TXN-102463', fromAccount: '**** 7788', toAccount: '**** 5566', recipient: 'Mia Robinson', recipientAvatar: '/assets/user-8-BAGm131G.png', amount: 900, currency: 'USD', status: 'Pending', date: '2025-12-12' },
  { id: 7, txnId: 'TXN-102464', fromAccount: '**** 8899', toAccount: '**** 6677', recipient: 'Lucas Walker', recipientAvatar: '/assets/user-9-DB-6OyMr.png', amount: 1450, currency: 'USD', status: 'Completed', date: '2025-12-11' },
  { id: 8, txnId: 'TXN-102465', fromAccount: '**** 9900', toAccount: '**** 7788', recipient: 'Sophia Hall', recipientAvatar: '/assets/user-10-CzpspsdB.png', amount: 2750, currency: 'USD', status: 'Failed', date: '2025-12-10' }
];

const currencies = ['USD', 'INR', 'VND', 'EUR'];
const accountsList = ['**** 2233', '**** 3344', '**** 4455', '**** 5566', '**** 6677', '**** 7788', '**** 8899', '**** 9900'];

export default function MoneyTransferPage() {
  const [transfers, setTransfers] = useState(initialTransfers);
  const [activeTab, setActiveTab] = useState('all'); // all, pending, completed, failed
  
  // Filters State
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [dateFilter, setDateFilter] = useState('');
  const [recipientInput, setRecipientInput] = useState('');
  const [accountInput, setAccountInput] = useState('');

  // Modal State
  const [modalFromAccount, setModalFromAccount] = useState(accountsList[0]);
  const [modalToAccount, setModalToAccount] = useState(accountsList[1]);
  const [modalRecipient, setModalRecipient] = useState('');
  const [modalAmount, setModalAmount] = useState('');
  const [modalCurrency, setModalCurrency] = useState(currencies[0]);
  const [modalStatus, setModalStatus] = useState('Pending');
  const [modalDate, setModalDate] = useState('');

  const [editingId, setEditingId] = useState(null);
  const [deletingId, setDeletingId] = useState(null);

  useEffect(() => {
    if (window.lucide) {
      window.lucide.createIcons();
    }
  }, [transfers, activeTab]);

  const handleDelete = () => {
    setTransfers(prev => prev.filter(item => item.id !== deletingId));
    const modalElement = document.getElementById('deleteModal');
    const modalInstance = window.bootstrap?.Modal?.getInstance(modalElement);
    modalInstance?.hide();
    setDeletingId(null);
  };

  const handleFormSubmit = (e) => {
    e.preventDefault();
    const amountVal = parseFloat(modalAmount) || 0;

    if (editingId) {
      setTransfers(prev => prev.map(item => item.id === editingId ? {
        ...item,
        fromAccount: modalFromAccount,
        toAccount: modalToAccount,
        recipient: modalRecipient,
        amount: amountVal,
        currency: modalCurrency,
        status: modalStatus,
        date: modalDate || new Date().toISOString().split('T')[0]
      } : item));
    } else {
      const nextTxnNum = transfers.length > 0 ? Math.max(...transfers.map(t => parseInt(t.txnId.split('-')[1]))) + 1 : 102467;
      const txnStr = `TXN-${nextTxnNum}`;
      const newTransfer = {
        id: transfers.length > 0 ? Math.max(...transfers.map(t => t.id)) + 1 : 1,
        txnId: txnStr,
        fromAccount: modalFromAccount,
        toAccount: modalToAccount,
        recipient: modalRecipient,
        recipientAvatar: `/assets/user-${Math.floor(Math.random() * 10) + 1}-CzpspsdB.png`,
        amount: amountVal,
        currency: modalCurrency,
        status: modalStatus,
        date: modalDate || new Date().toISOString().split('T')[0]
      };
      setTransfers(prev => [newTransfer, ...prev]);
    }

    resetForm();

    const modalElement = document.getElementById('transferModal');
    const modalInstance = window.bootstrap?.Modal?.getInstance(modalElement);
    modalInstance?.hide();
  };

  const resetForm = () => {
    setModalFromAccount(accountsList[0]);
    setModalToAccount(accountsList[1]);
    setModalRecipient('');
    setModalAmount('');
    setModalCurrency(currencies[0]);
    setModalStatus('Pending');
    setModalDate('');
    setEditingId(null);
  };

  const openEditModal = (item) => {
    setEditingId(item.id);
    setModalFromAccount(item.fromAccount);
    setModalToAccount(item.toAccount);
    setModalRecipient(item.recipient);
    setModalAmount(item.amount.toString());
    setModalCurrency(item.currency);
    setModalStatus(item.status);
    setModalDate(item.date);

    const modalElement = document.getElementById('transferModal');
    const modalInstance = new window.bootstrap.Modal(modalElement);
    modalInstance.show();
  };

  const openAddModal = () => {
    resetForm();
    const modalElement = document.getElementById('transferModal');
    const modalInstance = new window.bootstrap.Modal(modalElement);
    modalInstance.show();
  };

  const formatDateString = (dateStr) => {
    if (!dateStr) return '';
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' });
  };

  // Filter & Tab logic
  const filteredTransfers = transfers.filter(item => {
    // Tab Filter
    if (activeTab !== 'all' && item.status.toLowerCase() !== activeTab.toLowerCase()) {
      return false;
    }

    // Status Filter (Top dropdown)
    if (statusFilter !== 'all' && item.status.toLowerCase() !== statusFilter.toLowerCase()) {
      return false;
    }

    // Date Filter
    if (dateFilter && item.date !== dateFilter) {
      return false;
    }

    // Recipient name filter
    if (recipientInput && !item.recipient.toLowerCase().includes(recipientInput.toLowerCase())) {
      return false;
    }

    // Account filter (last 4 digits matching fromAccount or toAccount)
    if (accountInput && !item.fromAccount.includes(accountInput) && !item.toAccount.includes(accountInput)) {
      return false;
    }

    // Global Search
    const matchesSearch = item.recipient.toLowerCase().includes(search.toLowerCase()) || 
                          item.txnId.toLowerCase().includes(search.toLowerCase()) ||
                          item.fromAccount.toLowerCase().includes(search.toLowerCase()) ||
                          item.toAccount.toLowerCase().includes(search.toLowerCase());

    return matchesSearch;
  });

  const getStatusBadge = (status) => {
    let type = 'warning';
    if (status === 'Completed') type = 'success';
    if (status === 'Failed') type = 'danger';
    return <span className={`badge bg-${type}-subtle text-${type} border border-${type}-subtle`}>{status}</span>;
  };

  return (
    <div className="container-fluid">
      <PageBreadcrumb title="Money Transfer" breadcrumbs={[{ label: 'Dashboard', href: ROUTES.DASHBOARD }, { label: 'Accounts' }, { label: 'Money Transfer' }]} />

      <div className="card">
        <div className="card-header pb-0">
          <div className="d-flex flex-wrap gap-4 align-items-center justify-content-between mb-4">
            <div>
              <h5 className="card-title mb-1">Money Transfer</h5>
              <p className="text-muted mb-0">Manage your Money Transfer accounts and transactions.</p>
            </div>
            <div className="d-flex flex-wrap gap-2 align-items-center ms-auto">
              <div className="position-relative">
                <input type="text" className="form-control ps-10" placeholder="Search accounts..." value={search} onChange={e => setSearch(e.target.value)} />
                <i data-lucide="search" className="size-4 icon-dark position-absolute top-50 start-0 ms-4 translate-middle-y"></i>
              </div>

              <select className="form-select w-32" value={statusFilter} onChange={e => setStatusFilter(e.target.value)}>
                <option value="all">Status</option>
                <option value="pending">Pending</option>
                <option value="completed">Completed</option>
                <option value="failed">Failed</option>
              </select>

              <div className="position-relative flex-shrink-0 w-48">
                <input type="date" className="form-control" value={dateFilter} onChange={e => setDateFilter(e.target.value)} />
              </div>

              <button type="button" className="btn btn-primary d-flex align-items-center gap-1" onClick={openAddModal}>
                <i className="ri-add-line fs-lg"></i> Add Transfer
              </button>
            </div>
          </div>

          <div className="d-flex flex-wrap gap-4 align-items-center justify-content-between border-top pt-3">
            <ul className="nav nav-underline" id="moneyTransferTabs" role="tablist">
              <li className="nav-item">
                <button className={`nav-link ${activeTab === 'all' ? 'active' : ''}`} onClick={() => setActiveTab('all')}>All Transfers</button>
              </li>
              <li className="nav-item">
                <button className={`nav-link ${activeTab === 'pending' ? 'active' : ''}`} onClick={() => setActiveTab('pending')}>Pending</button>
              </li>
              <li className="nav-item">
                <button className={`nav-link ${activeTab === 'completed' ? 'active' : ''}`} onClick={() => setActiveTab('completed')}>Completed</button>
              </li>
              <li className="nav-item">
                <button className={`nav-link ${activeTab === 'failed' ? 'active' : ''}`} onClick={() => setActiveTab('failed')}>Failed</button>
              </li>
            </ul>

            <div className="d-flex flex-wrap gap-4 align-items-center mb-1">
              <div className="d-flex gap-2 align-items-center">
                <label className="form-label flex-shrink-0 mb-0">Recipient:</label>
                <input type="text" className="form-control form-control-sm border-0 border-bottom p-0 w-28" placeholder="e.g. Emma" value={recipientInput} onChange={e => setRecipientInput(e.target.value)} />
              </div>
              <div className="d-flex gap-2 align-items-center">
                <label className="form-label flex-shrink-0 mb-0">Account (Last Digits):</label>
                <input type="text" className="form-control form-control-sm border-0 border-bottom p-0 w-16" placeholder="e.g. 2233" value={accountInput} onChange={e => setAccountInput(e.target.value)} />
              </div>
              {recipientInput || accountInput ? (
                <button type="button" className="btn btn-link text-danger p-0" onClick={() => { setRecipientInput(''); setAccountInput(''); }}><i className="ri-close-line fs-lg"></i></button>
              ) : null}
            </div>
          </div>
        </div>

        <div className="card-body pt-3">
          <div className="table-card table-responsive">
            <table className="table text-nowrap table-borderless align-middle mb-0">
              <thead>
                <tr className="border-bottom">
                  <th>
                    <div className="form-check check-primary">
                      <input className="form-check-input" type="checkbox" id="checkAllTransfers" />
                    </div>
                  </th>
                  <th className="fw-medium text-muted">Transaction ID</th>
                  <th className="fw-medium text-muted">From Account</th>
                  <th className="fw-medium text-muted">To Account</th>
                  <th className="fw-medium text-muted">Recipient</th>
                  <th className="fw-medium text-muted">Amount</th>
                  <th className="fw-medium text-muted">Currency</th>
                  <th className="fw-medium text-muted">Status</th>
                  <th className="fw-medium text-muted">Date</th>
                  <th className="fw-medium text-muted">Action</th>
                </tr>
              </thead>
              <tbody>
                {filteredTransfers.length === 0 ? (
                  <tr>
                    <td colSpan="10" className="text-center text-muted py-4">No records found.</td>
                  </tr>
                ) : (
                  filteredTransfers.map(item => (
                    <tr key={item.id}>
                      <td>
                        <div className="form-check check-primary">
                          <input className="form-check-input" type="checkbox" id={`check_${item.id}`} />
                        </div>
                      </td>
                      <td><a href="#!" className="link link-custom-primary fw-semibold">{item.txnId}</a></td>
                      <td>{item.fromAccount}</td>
                      <td>{item.toAccount}</td>
                      <td>
                        <div className="d-flex align-items-center gap-2">
                          <img src={item.recipientAvatar} className="size-8 rounded-circle" alt="User" onError={e => { e.target.src = '/assets/user-3-Bz6g7hsE.png'; }} />
                          <span>{item.recipient}</span>
                        </div>
                      </td>
                      <td className="fw-bold">${item.amount.toLocaleString()}</td>
                      <td>{item.currency}</td>
                      <td>{getStatusBadge(item.status)}</td>
                      <td className="text-muted">{formatDateString(item.date)}</td>
                      <td>
                        <div className="dropdown dropdown-menu-end">
                          <a href="#!" className="link link-custom-primary" data-bs-toggle="dropdown"><i className="ri-more-2-fill fs-lg"></i></a>
                          <ul className="dropdown-menu">
                            <li><a href="#!" className="dropdown-item d-flex gap-3 align-items-center"><i className="ri-eye-line text-muted"></i> Overview</a></li>
                            <li><a href="#!" className="dropdown-item d-flex gap-3 align-items-center" onClick={() => openEditModal(item)}><i className="ri-pencil-line text-muted"></i> Edit</a></li>
                            <li><a href="#!" className="dropdown-item d-flex gap-3 align-items-center text-danger" data-bs-toggle="modal" data-bs-target="#deleteModal" onClick={() => setDeletingId(item.id)}><i className="ri-delete-bin-line"></i> Delete</a></li>
                          </ul>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          <div className="row align-items-center g-3 mt-3">
            <div className="col-md-6">
              <p className="text-muted text-center text-md-start mb-0">
                Showing <b className="me-1">1-{filteredTransfers.length}</b> of <b className="ms-1">{filteredTransfers.length}</b> Results
              </p>
            </div>
            <div className="col-md-6">
              <nav aria-label="Page navigation example">
                <ul className="pagination justify-content-center justify-content-md-end mb-0 products-pagination">
                  <li className="page-item disabled"><a className="page-link" href="#"><i data-lucide="chevron-left" className="size-4"></i>Previous</a></li>
                  <li className="page-item active"><a className="page-link" href="#">1</a></li>
                  <li className="page-item disabled"><a className="page-link" href="#">Next<i data-lucide="chevron-right" className="size-4"></i></a></li>
                </ul>
              </nav>
            </div>
          </div>
        </div>
      </div>

      {/* Transfer Modal */}
      <div className="modal fade" id="transferModal" tabIndex="-1" aria-hidden="true">
        <div className="modal-dialog modal-dialog-centered">
          <div className="modal-content">
            <div className="modal-header">
              <h6 className="modal-title">{editingId ? 'Edit Money Transfer' : 'Add Money Transfer'}</h6>
              <button type="button" className="btn-close" data-bs-dismiss="modal" onClick={resetForm}></button>
            </div>
            <div className="modal-body">
              <form onSubmit={handleFormSubmit}>
                <div className="row g-4">
                  <div className="col-md-6">
                    <label className="form-label">From Account <span className="text-danger">*</span></label>
                    <select className="form-select" value={modalFromAccount} onChange={e => setModalFromAccount(e.target.value)}>
                      {accountsList.map(a => (
                        <option key={a} value={a}>{a}</option>
                      ))}
                    </select>
                  </div>
                  <div className="col-md-6">
                    <label className="form-label">To Account <span className="text-danger">*</span></label>
                    <select className="form-select" value={modalToAccount} onChange={e => setModalToAccount(e.target.value)}>
                      {accountsList.map(a => (
                        <option key={a} value={a}>{a}</option>
                      ))}
                    </select>
                  </div>
                  <div className="col-12">
                    <label className="form-label">Recipient Name <span className="text-danger">*</span></label>
                    <input type="text" className="form-control" placeholder="Enter recipient name" value={modalRecipient} onChange={e => setModalRecipient(e.target.value)} required />
                  </div>
                  <div className="col-md-6">
                    <label className="form-label">Amount ($) <span className="text-danger">*</span></label>
                    <input type="number" className="form-control" placeholder="0.00" value={modalAmount} onChange={e => setModalAmount(e.target.value)} required />
                  </div>
                  <div className="col-md-6">
                    <label className="form-label">Currency</label>
                    <select className="form-select" value={modalCurrency} onChange={e => setModalCurrency(e.target.value)}>
                      {currencies.map(c => (
                        <option key={c} value={c}>{c}</option>
                      ))}
                    </select>
                  </div>
                  <div className="col-md-6">
                    <label className="form-label">Status</label>
                    <select className="form-select" value={modalStatus} onChange={e => setModalStatus(e.target.value)}>
                      <option value="Pending">Pending</option>
                      <option value="Completed">Completed</option>
                      <option value="Failed">Failed</option>
                    </select>
                  </div>
                  <div className="col-md-6">
                    <label className="form-label">Date</label>
                    <input type="date" className="form-control" value={modalDate} onChange={e => setModalDate(e.target.value)} />
                  </div>
                </div>
                <div className="d-flex gap-3 mt-7">
                  <button type="button" className="btn btn-light w-50" data-bs-dismiss="modal" onClick={resetForm}>Cancel</button>
                  <button type="submit" className="btn btn-primary w-50">{editingId ? 'Save Changes' : 'Submit Transfer'}</button>
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
            <h5 className="mb-4 lh-base">Are you sure you want to delete this Transfer record?</h5>
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
