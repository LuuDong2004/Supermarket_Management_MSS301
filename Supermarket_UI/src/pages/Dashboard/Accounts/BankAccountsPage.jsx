// pages/Dashboard/Accounts/BankAccountsPage.jsx
import React, { useEffect, useState } from 'react';
import PageBreadcrumb from '../../../components/ui/PageBreadcrumb';
import { ROUTES } from '../../../configs/routes';

const initialAccounts = [
  { id: 1, bankName: 'Chase Bank', holderName: 'Sophia Smith', holderImage: '/assets/user-1-xhBXJtq9.png', accountNumber: 'Ends in **** 1218', type: 'Saving Account', currency: 'USD', balance: 12500, status: 'Active', date: '24 Dec, 2025' },
  { id: 2, bankName: 'HDFC Bank', holderName: 'Rohan Patel', holderImage: '/assets/user-2-CroG7YJ0.png', accountNumber: 'Ends in **** 5678', type: 'Checking Account', currency: 'INR', balance: 450000, status: 'Active', date: '23 Dec, 2025' },
  { id: 3, bankName: 'Bank of America', holderName: 'Emma Johnson', holderImage: '/assets/user-3-Bz6g7hsE.png', accountNumber: 'Ends in **** 3321', type: 'Savings Account', currency: 'USD', balance: 75200, status: 'Inactive', date: '20 Dec, 2025' },
  { id: 4, bankName: 'ICICI Bank', holderName: 'Aarav Sharma', holderImage: '/assets/user-4-7l52E1Lo.png', accountNumber: 'Ends in **** 7789', type: 'Checking Account', currency: 'INR', balance: 250000, status: 'Active', date: '22 Dec, 2025' },
  { id: 5, bankName: 'Wells Fargo', holderName: 'Liam Davis', holderImage: '/assets/user-5-BsT8d_Co.png', accountNumber: 'Ends in **** 4455', type: 'Savings Account', currency: 'USD', balance: 98300, status: 'Active', date: '21 Dec, 2025' },
  { id: 6, bankName: 'Axis Bank', holderName: 'Neha Verma', holderImage: '/assets/user-6-BIO7_TUU.png', accountNumber: 'Ends in **** 9912', type: 'Checking Account', currency: 'INR', balance: 310000, status: 'Active', date: '19 Dec, 2025' },
  { id: 7, bankName: 'State Bank of India', holderName: 'Ankit Mehta', holderImage: '/assets/user-7-BMyy-xCq.png', accountNumber: 'Ends in **** 5566', type: 'Saving Account', currency: 'INR', balance: 120500, status: 'Inactive', date: '18 Dec, 2025' },
  { id: 8, bankName: 'Citibank', holderName: 'Karan Singh', holderImage: '/assets/user-8-BAGm131G.png', accountNumber: 'Ends in **** 7788', type: 'Checking Account', currency: 'USD', balance: 88900, status: 'Active', date: '17 Dec, 2025' },
  { id: 9, bankName: 'Punjab National Bank', holderName: 'Priya Sharma', holderImage: '/assets/user-9-DB-6OyMr.png', accountNumber: 'Ends in **** 3344', type: 'Savings Account', currency: 'INR', balance: 190000, status: 'Active', date: '16 Dec, 2025' },
  { id: 10, bankName: 'Standard Chartered', holderName: 'Rita Kapoor', holderImage: '/assets/user-10-CzpspsdB.png', accountNumber: 'Ends in **** 6677', type: 'Checking Account', currency: 'USD', balance: 52400, status: 'Active', date: '15 Dec, 2025' }
];

const accountTypes = ['Saving Account', 'Checking Account', 'Savings Account'];
const currencies = ['USD', 'INR', 'VND', 'EUR'];

export default function BankAccountsPage() {
  const [accounts, setAccounts] = useState(initialAccounts);
  const [search, setSearch] = useState('');
  const [typeFilter, setTypeFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [currencyFilter, setCurrencyFilter] = useState('all');

  // Advanced Filters State
  const [minBalance, setMinBalance] = useState('');
  const [maxBalance, setMaxBalance] = useState('');
  const [bankSearchVal, setBankSearchVal] = useState('');
  const [holderSearchVal, setHolderSearchVal] = useState('');

  // Modal State
  const [modalBankName, setModalBankName] = useState('');
  const [modalHolderName, setModalHolderName] = useState('');
  const [modalType, setModalType] = useState(accountTypes[0]);
  const [modalCurrency, setModalCurrency] = useState(currencies[0]);
  const [modalBalance, setModalBalance] = useState('');
  const [modalStatus, setModalStatus] = useState('Active');
  const [modalAccountNumber, setModalAccountNumber] = useState('');

  const [editingId, setEditingId] = useState(null);
  const [deletingId, setDeletingId] = useState(null);

  useEffect(() => {
    if (window.lucide) {
      window.lucide.createIcons();
    }
  }, [accounts]);

  const handleDelete = () => {
    setAccounts(prev => prev.filter(item => item.id !== deletingId));
    const modalElement = document.getElementById('deleteModal');
    const modalInstance = window.bootstrap?.Modal?.getInstance(modalElement);
    modalInstance?.hide();
    setDeletingId(null);
  };

  const handleFormSubmit = (e) => {
    e.preventDefault();
    const balanceVal = parseFloat(modalBalance) || 0;

    if (editingId) {
      setAccounts(prev => prev.map(item => item.id === editingId ? {
        ...item,
        bankName: modalBankName,
        holderName: modalHolderName,
        type: modalType,
        currency: modalCurrency,
        balance: balanceVal,
        status: modalStatus,
        accountNumber: modalAccountNumber.startsWith('Ends in') ? modalAccountNumber : `Ends in **** ${modalAccountNumber.slice(-4)}`
      } : item));
    } else {
      const newAccount = {
        id: accounts.length > 0 ? Math.max(...accounts.map(a => a.id)) + 1 : 1,
        bankName: modalBankName,
        holderName: modalHolderName,
        holderImage: `/assets/user-${Math.floor(Math.random() * 8) + 1}-xhBXJtq9.png`,
        type: modalType,
        currency: modalCurrency,
        balance: balanceVal,
        status: modalStatus,
        accountNumber: `Ends in **** ${modalAccountNumber.slice(-4)}`,
        date: new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })
      };
      setAccounts(prev => [...prev, newAccount]);
    }

    resetForm();

    const modalElement = document.getElementById('addBankAccountModal');
    const modalInstance = window.bootstrap?.Modal?.getInstance(modalElement);
    modalInstance?.hide();
  };

  const resetForm = () => {
    setModalBankName('');
    setModalHolderName('');
    setModalType(accountTypes[0]);
    setModalCurrency(currencies[0]);
    setModalBalance('');
    setModalStatus('Active');
    setModalAccountNumber('');
    setEditingId(null);
  };

  const openEditModal = (item) => {
    setEditingId(item.id);
    setModalBankName(item.bankName);
    setModalHolderName(item.holderName);
    setModalType(item.type);
    setModalCurrency(item.currency);
    setModalBalance(item.balance.toString());
    setModalStatus(item.status);
    setModalAccountNumber(item.accountNumber.replace('Ends in **** ', ''));

    const modalElement = document.getElementById('addBankAccountModal');
    const modalInstance = new window.bootstrap.Modal(modalElement);
    modalInstance.show();
  };

  const openAddModal = () => {
    resetForm();
    const modalElement = document.getElementById('addBankAccountModal');
    const modalInstance = new window.bootstrap.Modal(modalElement);
    modalInstance.show();
  };

  const handleApplyAdvancedFilters = (e) => {
    e.preventDefault();
    // Dropdown bootstrap closes automatically on click outside, but logic is handled in state
  };

  const handleResetAdvancedFilters = () => {
    setMinBalance('');
    setMaxBalance('');
    setBankSearchVal('');
    setHolderSearchVal('');
  };

  // Filter Logic
  const filteredAccounts = accounts.filter(item => {
    const matchesSearch = item.bankName.toLowerCase().includes(search.toLowerCase()) || 
                          item.holderName.toLowerCase().includes(search.toLowerCase());
    const matchesType = typeFilter === 'all' || item.type.toLowerCase() === typeFilter.toLowerCase();
    const matchesStatus = statusFilter === 'all' || item.status.toLowerCase() === statusFilter.toLowerCase();
    const matchesCurrency = currencyFilter === 'all' || item.currency.toLowerCase() === currencyFilter.toLowerCase();

    // Advanced filters
    const matchesMin = minBalance === '' || item.balance >= parseFloat(minBalance);
    const matchesMax = maxBalance === '' || item.balance <= parseFloat(maxBalance);
    const matchesBank = bankSearchVal === '' || item.bankName.toLowerCase().includes(bankSearchVal.toLowerCase());
    const matchesHolder = holderSearchVal === '' || item.holderName.toLowerCase().includes(holderSearchVal.toLowerCase());

    return matchesSearch && matchesType && matchesStatus && matchesCurrency && matchesMin && matchesMax && matchesBank && matchesHolder;
  });

  const formatBalance = (val, curr) => {
    if (curr === 'USD') return `$${val.toLocaleString()}`;
    if (curr === 'INR') return `₹${val.toLocaleString()}`;
    if (curr === 'VND') return `${val.toLocaleString()} ₫`;
    return `${val.toLocaleString()} ${curr}`;
  };

  return (
    <div className="container-fluid">
      <PageBreadcrumb title="Bank Accounts" breadcrumbs={[{ label: 'Dashboard', href: ROUTES.DASHBOARD }, { label: 'Accounts' }, { label: 'Bank Accounts' }]} />

      <div className="card">
        <div className="card-header">
          <div className="d-flex flex-wrap gap-4 align-items-center justify-content-between">
            <h5 className="card-title mb-1">Bank Accounts</h5>
            <div className="d-flex flex-wrap gap-2 align-items-center ms-auto">
              <div className="position-relative">
                <input type="text" className="form-control ps-10" placeholder="Search Bank Accounts..." value={search} onChange={e => setSearch(e.target.value)} />
                <i data-lucide="search" className="size-4 icon-dark position-absolute top-50 start-0 ms-4 translate-middle-y"></i>
              </div>
              
              <select className="form-select w-44" value={typeFilter} onChange={e => setTypeFilter(e.target.value)}>
                <option value="all">All Types</option>
                {accountTypes.map(t => (
                  <option key={t} value={t}>{t}</option>
                ))}
              </select>

              <select className="form-select w-44" value={statusFilter} onChange={e => setStatusFilter(e.target.value)}>
                <option value="all">All Status</option>
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
              </select>

              <select className="form-select w-36" value={currencyFilter} onChange={e => setCurrencyFilter(e.target.value)}>
                <option value="all">Currency</option>
                {currencies.map(c => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>

              <div className="dropdown">
                <button type="button" className="btn btn-outline-light btn-icon border" data-bs-toggle="dropdown" aria-expanded="false">
                  <i data-lucide="funnel" className="size-4"></i>
                </button>
                <ul className="dropdown-menu dropdown-menu-end p-4 w-80">
                  <h6 className="mb-3">Filter Options</h6>
                  <form onSubmit={handleApplyAdvancedFilters}>
                    <div className="d-flex align-items-center gap-3 mb-3">
                      <div>
                        <label className="form-label">Min Balance</label>
                        <input type="number" className="form-control" placeholder="0.00" value={minBalance} onChange={e => setMinBalance(e.target.value)} />
                      </div>
                      <span className="mt-6">-</span>
                      <div>
                        <label className="form-label">Max Balance</label>
                        <input type="number" className="form-control" placeholder="0.00" value={maxBalance} onChange={e => setMaxBalance(e.target.value)} />
                      </div>
                    </div>
                    <div className="mb-3">
                      <label className="form-label">Bank Name</label>
                      <input type="text" className="form-control" placeholder="Search by bank" value={bankSearchVal} onChange={e => setBankSearchVal(e.target.value)} />
                    </div>
                    <div className="mb-3">
                      <label className="form-label">Account Holder</label>
                      <input type="text" className="form-control" placeholder="Search by name" value={holderSearchVal} onChange={e => setHolderSearchVal(e.target.value)} />
                    </div>
                    <div className="d-flex align-items-center justify-content-end gap-2 mt-7">
                      <button type="button" className="btn-sm btn btn-light h-8 px-4" onClick={handleResetAdvancedFilters}>Reset</button>
                      <button type="submit" className="btn-sm btn btn-primary h-8 px-4">Apply</button>
                    </div>
                  </form>
                </ul>
              </div>

              <button type="button" className="btn btn-primary d-flex align-items-center gap-1" onClick={openAddModal}>
                <i className="ri-add-line fs-lg"></i> Add Accounts
              </button>
            </div>
          </div>
        </div>

        <div className="card-body pt-0">
          <div className="table-card table-responsive">
            <table className="table text-nowrap table-borderless align-middle mb-0">
              <thead>
                <tr className="bg-light border-bottom">
                  <th>
                    <div className="form-check check-primary">
                      <input className="form-check-input" type="checkbox" id="checkAllAccounts" />
                    </div>
                  </th>
                  <th className="fw-medium text-muted">Bank Name</th>
                  <th className="fw-medium text-muted">Account Holder</th>
                  <th className="fw-medium text-muted">Account Number</th>
                  <th className="fw-medium text-muted">Type</th>
                  <th className="fw-medium text-muted">Currency</th>
                  <th className="fw-medium text-muted">Balance</th>
                  <th className="fw-medium text-muted">Status</th>
                  <th className="fw-medium text-muted">Last Transaction</th>
                  <th className="fw-medium text-muted">Action</th>
                </tr>
              </thead>
              <tbody>
                {filteredAccounts.length === 0 ? (
                  <tr>
                    <td colSpan="10" className="text-center text-muted py-4">No records found.</td>
                  </tr>
                ) : (
                  filteredAccounts.map(item => (
                    <tr key={item.id}>
                      <td>
                        <div className="form-check check-primary">
                          <input className="form-check-input" type="checkbox" id={`check_${item.id}`} />
                        </div>
                      </td>
                      <td className="fw-semibold">{item.bankName}</td>
                      <td>
                        <div className="d-flex align-items-center gap-2">
                          <img src={item.holderImage} className="size-8 rounded-circle" alt="User" onError={e => { e.target.src = '/assets/user-1-xhBXJtq9.png'; }} />
                          <span>{item.holderName}</span>
                        </div>
                      </td>
                      <td><span className="fw-medium">{item.accountNumber}</span></td>
                      <td>{item.type}</td>
                      <td>{item.currency}</td>
                      <td className="fw-bold">{formatBalance(item.balance, item.currency)}</td>
                      <td>
                        <span className={`badge bg-${item.status === 'Active' ? 'success' : 'warning'}-subtle text-${item.status === 'Active' ? 'success' : 'warning'} border border-${item.status === 'Active' ? 'success' : 'warning'}-subtle`}>
                          {item.status}
                        </span>
                      </td>
                      <td className="text-muted">{item.date}</td>
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
                Showing <b className="me-1">1-{filteredAccounts.length}</b> of <b className="ms-1">{filteredAccounts.length}</b> Results
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

      {/* Add Bank Account Modal */}
      <div className="modal fade" id="addBankAccountModal" tabIndex="-1" aria-hidden="true">
        <div className="modal-dialog modal-dialog-centered">
          <div className="modal-content">
            <div className="modal-header">
              <h6 className="modal-title">{editingId ? 'Edit Bank Account' : 'Add Bank Account'}</h6>
              <button type="button" className="btn-close" data-bs-dismiss="modal" onClick={resetForm}></button>
            </div>
            <div className="modal-body">
              <form onSubmit={handleFormSubmit}>
                <div className="row g-4">
                  <div className="col-12">
                    <label className="form-label">Bank Name <span class="text-danger">*</span></label>
                    <input type="text" className="form-control" placeholder="Enter bank name" value={modalBankName} onChange={e => setModalBankName(e.target.value)} required />
                  </div>
                  <div className="col-12">
                    <label className="form-label">Account Holder <span class="text-danger">*</span></label>
                    <input type="text" className="form-control" placeholder="Enter account holder name" value={modalHolderName} onChange={e => setModalHolderName(e.target.value)} required />
                  </div>
                  <div className="col-md-6">
                    <label className="form-label">Account Type</label>
                    <select className="form-select" value={modalType} onChange={e => setModalType(e.target.value)}>
                      {accountTypes.map(t => (
                        <option key={t} value={t}>{t}</option>
                      ))}
                    </select>
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
                    <label className="form-label">Balance</label>
                    <input type="number" className="form-control" placeholder="Enter balance" value={modalBalance} onChange={e => setModalBalance(e.target.value)} />
                  </div>
                  <div className="col-md-6">
                    <label className="form-label">Status</label>
                    <select className="form-select" value={modalStatus} onChange={e => setModalStatus(e.target.value)}>
                      <option value="Active">Active</option>
                      <option value="Inactive">Inactive</option>
                    </select>
                  </div>
                  <div className="col-12">
                    <label className="form-label">Account Number <span class="text-danger">*</span></label>
                    <input type="text" className="form-control" placeholder="XXXX XXXX XXXX 1234" value={modalAccountNumber} onChange={e => setModalAccountNumber(e.target.value)} required />
                  </div>
                </div>
                <div className="d-flex gap-3 mt-7">
                  <button type="button" className="btn btn-light w-50" data-bs-dismiss="modal" onClick={resetForm}>Cancel</button>
                  <button type="submit" className="btn btn-primary w-50">{editingId ? 'Save Changes' : 'Save Account'}</button>
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
            <h5 className="mb-4 lh-base">Are you sure you want to delete this Bank Account?</h5>
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
