// pages/Dashboard/Accounts/IncomePage.jsx
import React, { useEffect, useState } from 'react';
import PageBreadcrumb from '../../../components/ui/PageBreadcrumb';
import { ROUTES } from '../../../configs/routes';

const initialIncomes = [
  { id: 1, date: '2025-12-24', invoice: 'INV-0012', customer: 'John Dave', category: 'Electronic', method: 'Cash', status: 'Paid', amount: 100, type: 'Sale' },
  { id: 2, date: '2025-12-24', invoice: 'INV-0013', customer: 'Mary Parker', category: 'Clothing', method: 'Card', status: 'Paid', amount: 200, type: 'Service' },
  { id: 3, date: '2025-12-23', invoice: 'INV-0014', customer: 'David Lee', category: 'Groceries', method: 'Online', status: 'Pending', amount: 150, type: 'Sale' },
  { id: 4, date: '2025-12-22', invoice: 'INV-0015', customer: 'Linda Brown', category: 'Furniture', method: 'Card', status: 'Paid', amount: 300, type: 'Sale' },
  { id: 5, date: '2025-12-21', invoice: 'INV-0016', customer: 'Michael Scott', category: 'Stationery', method: 'Cash', status: 'Overdue', amount: 80, type: 'Sale' }
];

const incomeCategories = ['Electronic', 'Clothing', 'Groceries', 'Furniture', 'Stationery', 'Consulting', 'Delivery'];
const paymentMethods = ['Cash', 'Card', 'Online', 'Bank'];
const incomeTypes = ['Sale', 'Service', 'Other'];
const statuses = ['Paid', 'Pending', 'Overdue'];

export default function IncomePage() {
  const [incomes, setIncomes] = useState(initialIncomes);
  const [search, setSearch] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [methodFilter, setMethodFilter] = useState('all');
  const [dateFilter, setDateFilter] = useState('');

  // Modal State
  const [modalCustomer, setModalCustomer] = useState('');
  const [modalCategory, setModalCategory] = useState(incomeCategories[0]);
  const [modalMethod, setModalMethod] = useState(paymentMethods[0]);
  const [modalStatus, setModalStatus] = useState('Paid');
  const [modalAmount, setModalAmount] = useState('');
  const [modalType, setModalType] = useState(incomeTypes[0]);
  const [modalDate, setModalDate] = useState('');

  const [editingId, setEditingId] = useState(null);
  const [deletingId, setDeletingId] = useState(null);

  useEffect(() => {
    if (window.lucide) {
      window.lucide.createIcons();
    }
  }, [incomes]);

  const handleDelete = () => {
    setIncomes(prev => prev.filter(item => item.id !== deletingId));
    const modalElement = document.getElementById('deleteModal');
    const modalInstance = window.bootstrap?.Modal?.getInstance(modalElement);
    modalInstance?.hide();
    setDeletingId(null);
  };

  const handleFormSubmit = (e) => {
    e.preventDefault();
    const amountVal = parseFloat(modalAmount) || 0;

    if (editingId) {
      setIncomes(prev => prev.map(item => item.id === editingId ? {
        ...item,
        customer: modalCustomer,
        category: modalCategory,
        method: modalMethod,
        status: modalStatus,
        amount: amountVal,
        type: modalType,
        date: modalDate || new Date().toISOString().split('T')[0]
      } : item));
    } else {
      const nextInvNum = incomes.length > 0 ? Math.max(...incomes.map(i => parseInt(i.invoice.split('-')[1]))) + 1 : 12;
      const invoiceStr = `INV-${nextInvNum.toString().padStart(4, '0')}`;
      const newIncome = {
        id: incomes.length > 0 ? Math.max(...incomes.map(i => i.id)) + 1 : 1,
        invoice: invoiceStr,
        customer: modalCustomer,
        category: modalCategory,
        method: modalMethod,
        status: modalStatus,
        amount: amountVal,
        type: modalType,
        date: modalDate || new Date().toISOString().split('T')[0]
      };
      setIncomes(prev => [newIncome, ...prev]);
    }

    resetForm();

    const modalElement = document.getElementById('addIncomeModal');
    const modalInstance = window.bootstrap?.Modal?.getInstance(modalElement);
    modalInstance?.hide();
  };

  const resetForm = () => {
    setModalCustomer('');
    setModalCategory(incomeCategories[0]);
    setModalMethod(paymentMethods[0]);
    setModalStatus('Paid');
    setModalAmount('');
    setModalType(incomeTypes[0]);
    setModalDate('');
    setEditingId(null);
  };

  const openEditModal = (item) => {
    setEditingId(item.id);
    setModalCustomer(item.customer);
    setModalCategory(item.category);
    setModalMethod(item.method);
    setModalStatus(item.status);
    setModalAmount(item.amount.toString());
    setModalType(item.type);
    setModalDate(item.date);

    const modalElement = document.getElementById('addIncomeModal');
    const modalInstance = new window.bootstrap.Modal(modalElement);
    modalInstance.show();
  };

  const openAddModal = () => {
    resetForm();
    const modalElement = document.getElementById('addIncomeModal');
    const modalInstance = new window.bootstrap.Modal(modalElement);
    modalInstance.show();
  };

  const formatDateString = (dateStr) => {
    if (!dateStr) return '';
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' });
  };

  const filteredIncomes = incomes.filter(item => {
    const matchesSearch = item.customer.toLowerCase().includes(search.toLowerCase()) || 
                          item.invoice.toLowerCase().includes(search.toLowerCase()) ||
                          item.category.toLowerCase().includes(search.toLowerCase());
    const matchesCategory = categoryFilter === 'all' || item.category.toLowerCase() === categoryFilter.toLowerCase();
    const matchesMethod = methodFilter === 'all' || item.method.toLowerCase() === methodFilter.toLowerCase();
    const matchesDate = !dateFilter || item.date === dateFilter;

    return matchesSearch && matchesCategory && matchesMethod && matchesDate;
  });

  const totalSum = filteredIncomes.reduce((sum, item) => sum + item.amount, 0);

  const getStatusBadgeClass = (status) => {
    if (status === 'Paid') return 'success';
    if (status === 'Pending') return 'warning';
    return 'danger';
  };

  return (
    <div className="container-fluid">
      <PageBreadcrumb title="Income" breadcrumbs={[{ label: 'Dashboard', href: ROUTES.DASHBOARD }, { label: 'Accounts' }, { label: 'Income' }]} />

      {/* Income Stats */}
      <div className="card mb-4">
        <div className="row row-cols-1 row-cols-md-5 g-0">
          <div className="col border-end">
            <div className="d-flex align-items-center gap-2 p-4 bg-light bg-opacity-75">
              <span className="d-block size-2 bg-primary rounded-circle"></span>
              <h6 className="mb-0 fs-16 fw-medium text-truncate">Total Income</h6>
            </div>
            <div className="p-4 overflow-hidden text-truncate">
              <h4 className="mb-2 font-base">${totalSum.toLocaleString()}</h4>
              <span className="text-muted d-flex">
                <span className="text-success fw-medium me-2">
                  <i className="ri-arrow-up-line me-1"></i>12.4%
                </span>
                All-time earnings
              </span>
            </div>
          </div>
          <div className="col border-end">
            <div className="d-flex align-items-center gap-2 p-4 bg-light bg-opacity-75">
              <span className="d-block size-2 bg-success rounded-circle"></span>
              <h6 className="mb-0 fs-16 fw-medium text-truncate">Today’s Income</h6>
            </div>
            <div className="p-4 overflow-hidden text-truncate">
              <h4 className="mb-2 font-base">$3,250</h4>
              <span className="text-muted d-flex">
                <span className="text-success fw-medium me-2">
                  <i className="ri-arrow-up-line me-1"></i>5.1%
                </span>
                Last 24 hours
              </span>
            </div>
          </div>
          <div className="col border-end">
            <div className="d-flex align-items-center gap-2 p-4 bg-light bg-opacity-75">
              <span className="d-block size-2 bg-warning rounded-circle"></span>
              <h6 className="mb-0 fs-16 fw-medium text-truncate">Pending Income</h6>
            </div>
            <div className="p-4 overflow-hidden text-truncate">
              <h4 className="mb-2 font-base">$8,740</h4>
              <span className="text-muted d-flex">
                <span className="text-danger fw-medium me-2">
                  <i className="ri-arrow-down-line me-1"></i>-2.3%
                </span>
                Awaiting payment
              </span>
            </div>
          </div>
          <div className="col border-end">
            <div className="d-flex align-items-center gap-2 p-4 bg-light bg-opacity-75">
              <span className="d-block size-2 bg-info rounded-circle"></span>
              <h6 className="mb-0 fs-16 fw-medium text-truncate">Total Invoices</h6>
            </div>
            <div className="p-4 overflow-hidden text-truncate">
              <h4 className="mb-2 font-base">{filteredIncomes.length}</h4>
              <span className="text-muted d-flex">
                <span className="text-success fw-medium me-2">
                  <i className="ri-arrow-up-line me-1"></i>8.7%
                </span>
                Income records
              </span>
            </div>
          </div>
          <div className="col">
            <div className="d-flex align-items-center gap-2 p-4 bg-light bg-opacity-75">
              <span className="d-block size-2 bg-secondary rounded-circle"></span>
              <h6 className="mb-0 fs-16 fw-medium text-truncate">Avg / Invoice</h6>
            </div>
            <div className="p-4 overflow-hidden text-truncate">
              <h4 className="mb-2 font-base">${(filteredIncomes.length > 0 ? (totalSum / filteredIncomes.length) : 0).toFixed(2)}</h4>
              <span className="text-muted d-flex">
                <span className="text-success fw-medium me-2">
                  <i className="ri-arrow-up-line me-1"></i>3.4%
                </span>
                Revenue quality
              </span>
            </div>
          </div>
        </div>
      </div>

      <div className="card">
        <div className="card-header d-flex flex-wrap gap-4 align-items-center justify-content-between mb-5">
          <div className="d-flex flex-wrap gap-2">
            <div className="position-relative flex-shrink-0 w-48">
              <input type="date" className="form-control" value={dateFilter} onChange={e => setDateFilter(e.target.value)} />
            </div>
            
            <select className="form-select w-44" value={categoryFilter} onChange={e => setCategoryFilter(e.target.value)}>
              <option value="all">Category</option>
              {incomeCategories.map(c => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>

            <select className="form-select w-36" value={methodFilter} onChange={e => setMethodFilter(e.target.value)}>
              <option value="all">Payment Method</option>
              {paymentMethods.map(m => (
                <option key={m} value={m}>{m}</option>
              ))}
            </select>
            
            {dateFilter || categoryFilter !== 'all' || methodFilter !== 'all' ? (
              <button type="button" className="btn btn-light btn-icon" onClick={() => { setDateFilter(''); setCategoryFilter('all'); setMethodFilter('all'); }}>
                <i className="ri-loop-left-line"></i>
              </button>
            ) : null}
          </div>

          <div className="d-flex flex-wrap gap-2 align-items-center ms-auto">
            <div className="position-relative">
              <input type="text" className="form-control ps-10" placeholder="Search payments..." value={search} onChange={e => setSearch(e.target.value)} />
              <i data-lucide="search" className="size-4 icon-dark position-absolute top-50 start-0 ms-4 translate-middle-y"></i>
            </div>
            <button type="button" className="btn btn-primary d-flex align-items-center gap-1" onClick={openAddModal}>
              <i className="ri-add-line fs-lg"></i> Add Income
            </button>
          </div>
        </div>

        <div className="card-body pt-0">
          <div className="table-card table-responsive">
            <table className="table table-hover text-nowrap align-middle mb-0">
              <thead>
                <tr className="bg-light border-bottom">
                  <th>
                    <div className="form-check check-primary">
                      <input className="form-check-input" type="checkbox" id="checkAllIncome" />
                    </div>
                  </th>
                  <th className="fw-medium text-muted">Date</th>
                  <th className="fw-medium text-muted">Invoice</th>
                  <th className="fw-medium text-muted">Customer</th>
                  <th className="fw-medium text-muted">Category</th>
                  <th className="fw-medium text-muted">Payment Method</th>
                  <th className="fw-medium text-muted">Status</th>
                  <th className="fw-medium text-muted">Amount</th>
                  <th className="fw-medium text-muted">Income Type</th>
                  <th className="fw-medium text-muted">Action</th>
                </tr>
              </thead>
              <tbody>
                {filteredIncomes.length === 0 ? (
                  <tr>
                    <td colSpan="10" className="text-center text-muted py-4">No records found.</td>
                  </tr>
                ) : (
                  filteredIncomes.map(item => (
                    <tr key={item.id}>
                      <td>
                        <div className="form-check check-primary">
                          <input className="form-check-input" type="checkbox" id={`check_${item.id}`} />
                        </div>
                      </td>
                      <td className="text-muted">{formatDateString(item.date)}</td>
                      <td><a href="#!" class="link link-custom-primary fw-semibold">{item.invoice}</a></td>
                      <td className="fw-semibold">{item.customer}</td>
                      <td>{item.category}</td>
                      <td><span className="fs-13 rounded fw-medium py-1 px-2 border text-reset">{item.method}</span></td>
                      <td>
                        <span className={`badge bg-${getStatusBadgeClass(item.status)}-subtle text-${getStatusBadgeClass(item.status)} border border-${getStatusBadgeClass(item.status)}-subtle`}>
                          {item.status}
                        </span>
                      </td>
                      <td className="fw-bold">${item.amount.toLocaleString()}</td>
                      <td>{item.type}</td>
                      <td>
                        <div className="d-flex gap-2">
                          <button className="btn btn-sub-primary size-8 btn-icon"><i className="ri-eye-line"></i></button>
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

          <div className="row align-items-center g-3 mt-3">
            <div className="col-md-6">
              <p className="text-muted text-center text-md-start mb-0">
                Showing <b className="me-1">1-{filteredIncomes.length}</b> of <b className="ms-1">{filteredIncomes.length}</b> Results
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

      {/* Add Income Modal */}
      <div className="modal fade" id="addIncomeModal" tabIndex="-1" aria-hidden="true">
        <div className="modal-dialog modal-dialog-centered">
          <div className="modal-content">
            <div className="modal-header">
              <h6 className="modal-title">{editingId ? 'Edit Income Record' : 'Add Income Record'}</h6>
              <button type="button" className="btn-close" data-bs-dismiss="modal" onClick={resetForm}></button>
            </div>
            <div className="modal-body">
              <form onSubmit={handleFormSubmit}>
                <div className="row g-4">
                  <div className="col-12">
                    <label className="form-label">Customer Name <span className="text-danger">*</span></label>
                    <input type="text" className="form-control" placeholder="Enter customer name" value={modalCustomer} onChange={e => setModalCustomer(e.target.value)} required />
                  </div>
                  <div className="col-md-6">
                    <label className="form-label">Category</label>
                    <select className="form-select" value={modalCategory} onChange={e => setModalCategory(e.target.value)}>
                      {incomeCategories.map(c => (
                        <option key={c} value={c}>{c}</option>
                      ))}
                    </select>
                  </div>
                  <div className="col-md-6">
                    <label className="form-label">Payment Method</label>
                    <select className="form-select" value={modalMethod} onChange={e => setModalMethod(e.target.value)}>
                      {paymentMethods.map(m => (
                        <option key={m} value={m}>{m}</option>
                      ))}
                    </select>
                  </div>
                  <div className="col-md-6">
                    <label className="form-label">Income Type</label>
                    <select className="form-select" value={modalType} onChange={e => setModalType(e.target.value)}>
                      {incomeTypes.map(t => (
                        <option key={t} value={t}>{t}</option>
                      ))}
                    </select>
                  </div>
                  <div className="col-md-6">
                    <label className="form-label">Status</label>
                    <select className="form-select" value={modalStatus} onChange={e => setModalStatus(e.target.value)}>
                      {statuses.map(s => (
                        <option key={s} value={s}>{s}</option>
                      ))}
                    </select>
                  </div>
                  <div className="col-md-6">
                    <label className="form-label">Amount ($) <span className="text-danger">*</span></label>
                    <input type="number" className="form-control" placeholder="0.00" value={modalAmount} onChange={e => setModalAmount(e.target.value)} required />
                  </div>
                  <div className="col-md-6">
                    <label className="form-label">Date</label>
                    <input type="date" className="form-control" value={modalDate} onChange={e => setModalDate(e.target.value)} />
                  </div>
                </div>
                <div className="d-flex gap-3 mt-7">
                  <button type="button" className="btn btn-light w-50" data-bs-dismiss="modal" onClick={resetForm}>Cancel</button>
                  <button type="submit" className="btn btn-primary w-50">{editingId ? 'Save Changes' : 'Save Income'}</button>
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
            <h5 className="mb-4 lh-base">Are you sure you want to delete this Income record?</h5>
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
