// pages/Dashboard/Accounts/ExpensesPage.jsx
import React, { useEffect, useState } from 'react';
import PageBreadcrumb from '../../../components/ui/PageBreadcrumb';
import { ROUTES } from '../../../configs/routes';

const initialExpenses = [
  { id: 1, voucher: 'EXP-0019', payee: 'Office Rent', category: 'Rent', method: 'Bank', approvedBy: 'Admin', approvedAvatar: '/assets/user-1-xhBXJtq9.png', date: '2025-12-24', status: 'Paid', amount: 2500 },
  { id: 2, voucher: 'EXP-0018', payee: 'Electricity Board', category: 'Utilities', method: 'Online', approvedBy: 'Accountant', approvedAvatar: '/assets/user-3-Bz6g7hsE.png', date: '2025-12-23', status: 'Paid', amount: 320 },
  { id: 3, voucher: 'EXP-0017', payee: 'Staff Salary', category: 'Salary', method: 'Bank', approvedBy: 'Manager', approvedAvatar: '/assets/user-2-CroG7YJ0.png', date: '2025-12-22', status: 'Pending', amount: 4800 },
  { id: 4, voucher: 'EXP-0016', payee: 'Courier Service', category: 'Transportation', method: 'Cash', approvedBy: 'Cashier', approvedAvatar: '/assets/user-4-7l52E1Lo.png', date: '2025-12-21', status: 'Paid', amount: 180 },
  { id: 5, voucher: 'EXP-0015', payee: 'Internet Provider', category: 'Utilities', method: 'Online', approvedBy: 'Admin', approvedAvatar: '/assets/user-5-BsT8d_Co.png', date: '2025-12-20', status: 'Paid', amount: 120 },
  { id: 6, voucher: 'EXP-0014', payee: 'Printer Maintenance', category: 'Maintenance', method: 'Cash', approvedBy: 'Manager', approvedAvatar: '/assets/user-2-CroG7YJ0.png', date: '2025-12-19', status: 'Paid', amount: 90 },
  { id: 7, voucher: 'EXP-0013', payee: 'Office Supplies', category: 'Supplies', method: 'Card', approvedBy: 'Accountant', approvedAvatar: '/assets/user-3-Bz6g7hsE.png', date: '2025-12-18', status: 'Paid', amount: 150 }
];

const expenseCategories = ['Rent', 'Utilities', 'Salary', 'Transportation', 'Supplies', 'Maintenance'];
const paymentMethods = ['Bank', 'Online', 'Cash', 'Card'];
const approvers = ['Admin', 'Accountant', 'Manager', 'Cashier'];

export default function ExpensesPage() {
  const [expenses, setExpenses] = useState(initialExpenses);
  const [search, setSearch] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [methodFilter, setMethodFilter] = useState('all');
  const [dateFilter, setDateFilter] = useState('');

  // Modal State
  const [modalPayee, setModalPayee] = useState('');
  const [modalCategory, setModalCategory] = useState(expenseCategories[0]);
  const [modalMethod, setModalMethod] = useState(paymentMethods[0]);
  const [modalApprovedBy, setModalApprovedBy] = useState(approvers[0]);
  const [modalDate, setModalDate] = useState('');
  const [modalStatus, setModalStatus] = useState('Paid');
  const [modalAmount, setModalAmount] = useState('');

  const [editingId, setEditingId] = useState(null);
  const [deletingId, setDeletingId] = useState(null);

  useEffect(() => {
    if (window.lucide) {
      window.lucide.createIcons();
    }
  }, [expenses]);

  const handleDelete = () => {
    setExpenses(prev => prev.filter(item => item.id !== deletingId));
    const modalElement = document.getElementById('deleteModal');
    const modalInstance = window.bootstrap?.Modal?.getInstance(modalElement);
    modalInstance?.hide();
    setDeletingId(null);
  };

  const handleFormSubmit = (e) => {
    e.preventDefault();
    const amountVal = parseFloat(modalAmount) || 0;

    if (editingId) {
      setExpenses(prev => prev.map(item => item.id === editingId ? {
        ...item,
        payee: modalPayee,
        category: modalCategory,
        method: modalMethod,
        approvedBy: modalApprovedBy,
        date: modalDate || new Date().toISOString().split('T')[0],
        status: modalStatus,
        amount: amountVal,
        approvedAvatar: getAvatarForApprover(modalApprovedBy)
      } : item));
    } else {
      const nextVoucherNum = expenses.length > 0 ? Math.max(...expenses.map(e => parseInt(e.voucher.split('-')[1]))) + 1 : 1;
      const voucherStr = `EXP-${nextVoucherNum.toString().padStart(4, '0')}`;
      const newExpense = {
        id: expenses.length > 0 ? Math.max(...expenses.map(e => e.id)) + 1 : 1,
        voucher: voucherStr,
        payee: modalPayee,
        category: modalCategory,
        method: modalMethod,
        approvedBy: modalApprovedBy,
        approvedAvatar: getAvatarForApprover(modalApprovedBy),
        date: modalDate || new Date().toISOString().split('T')[0],
        status: modalStatus,
        amount: amountVal
      };
      setExpenses(prev => [newExpense, ...prev]);
    }

    resetForm();

    const modalElement = document.getElementById('addExpenseModal');
    const modalInstance = window.bootstrap?.Modal?.getInstance(modalElement);
    modalInstance?.hide();
  };

  const resetForm = () => {
    setModalPayee('');
    setModalCategory(expenseCategories[0]);
    setModalMethod(paymentMethods[0]);
    setModalApprovedBy(approvers[0]);
    setModalDate('');
    setModalStatus('Paid');
    setModalAmount('');
    setEditingId(null);
  };

  const openEditModal = (item) => {
    setEditingId(item.id);
    setModalPayee(item.payee);
    setModalCategory(item.category);
    setModalMethod(item.method);
    setModalApprovedBy(item.approvedBy);
    setModalDate(item.date);
    setModalStatus(item.status);
    setModalAmount(item.amount.toString());

    const modalElement = document.getElementById('addExpenseModal');
    const modalInstance = new window.bootstrap.Modal(modalElement);
    modalInstance.show();
  };

  const openAddModal = () => {
    resetForm();
    const modalElement = document.getElementById('addExpenseModal');
    const modalInstance = new window.bootstrap.Modal(modalElement);
    modalInstance.show();
  };

  const getAvatarForApprover = (name) => {
    if (name === 'Admin') return '/assets/user-1-xhBXJtq9.png';
    if (name === 'Manager') return '/assets/user-2-CroG7YJ0.png';
    if (name === 'Accountant') return '/assets/user-3-Bz6g7hsE.png';
    return '/assets/user-4-7l52E1Lo.png';
  };

  const formatDateString = (dateStr) => {
    if (!dateStr) return '';
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' });
  };

  const filteredExpenses = expenses.filter(item => {
    const matchesSearch = item.payee.toLowerCase().includes(search.toLowerCase()) || 
                          item.voucher.toLowerCase().includes(search.toLowerCase());
    const matchesCategory = categoryFilter === 'all' || item.category.toLowerCase() === categoryFilter.toLowerCase();
    const matchesMethod = methodFilter === 'all' || item.method.toLowerCase() === methodFilter.toLowerCase();
    const matchesDate = !dateFilter || item.date === dateFilter;

    return matchesSearch && matchesCategory && matchesMethod && matchesDate;
  });

  const totalSum = filteredExpenses.reduce((sum, item) => sum + item.amount, 0);

  return (
    <div className="container-fluid">
      <PageBreadcrumb title="Expenses" breadcrumbs={[{ label: 'Dashboard', href: ROUTES.DASHBOARD }, { label: 'Accounts' }, { label: 'Expenses' }]} />

      {/* Expense Stats */}
      <div className="card mb-4">
        <div className="row row-cols-1 row-cols-md-5 g-0">
          <div className="col border-end">
            <div className="d-flex align-items-center gap-2 p-4 bg-light bg-opacity-75">
              <span className="d-block size-2 bg-primary rounded-circle"></span>
              <h6 className="mb-0 fs-16 fw-medium text-truncate">Total Expenses</h6>
            </div>
            <div className="p-4 overflow-hidden text-truncate">
              <h4 className="mb-2 font-base">${totalSum.toLocaleString()}</h4>
              <span className="text-muted d-flex">
                <span className="text-success fw-medium me-2">
                  <i className="ri-arrow-up-line me-1"></i>9.8%
                </span>
                All-time spending
              </span>
            </div>
          </div>
          <div className="col border-end">
            <div className="d-flex align-items-center gap-2 p-4 bg-light bg-opacity-75">
              <span className="d-block size-2 bg-success rounded-circle"></span>
              <h6 className="mb-0 fs-16 fw-medium text-truncate">Today’s Expenses</h6>
            </div>
            <div className="p-4 overflow-hidden text-truncate">
              <h4 className="mb-2 font-base">$2,140</h4>
              <span className="text-muted d-flex">
                <span className="text-success fw-medium me-2">
                  <i className="ri-arrow-up-line me-1"></i>4.6%
                </span>
                Last 24 hours
              </span>
            </div>
          </div>
          <div className="col border-end">
            <div className="d-flex align-items-center gap-2 p-4 bg-light bg-opacity-75">
              <span className="d-block size-2 bg-warning rounded-circle"></span>
              <h6 className="mb-0 fs-16 fw-medium text-truncate">Pending Expenses</h6>
            </div>
            <div className="p-4 overflow-hidden text-truncate">
              <h4 className="mb-2 font-base">$6,320</h4>
              <span className="text-muted d-flex">
                <span className="text-success fw-medium me-2">
                  <i className="ri-arrow-up-line me-1"></i>2.1%
                </span>
                Awaiting payment
              </span>
            </div>
          </div>
          <div className="col border-end">
            <div className="d-flex align-items-center gap-2 p-4 bg-light bg-opacity-75">
              <span className="d-block size-2 bg-info rounded-circle"></span>
              <h6 className="mb-0 fs-16 fw-medium text-truncate">Total Vouchers</h6>
            </div>
            <div className="p-4 overflow-hidden text-truncate">
              <h4 className="mb-2 font-base">{filteredExpenses.length}</h4>
              <span className="text-muted d-flex">
                <span className="text-success fw-medium me-2">
                  <i className="ri-arrow-up-line me-1"></i>7.2%
                </span>
                Expense records
              </span>
            </div>
          </div>
          <div className="col">
            <div className="d-flex align-items-center gap-2 p-4 bg-light bg-opacity-75">
              <span className="d-block size-2 bg-danger rounded-circle"></span>
              <h6 className="mb-0 fs-16 fw-medium text-truncate">Avg / Expense</h6>
            </div>
            <div className="p-4 overflow-hidden text-truncate">
              <h4 className="mb-2 font-base">${(filteredExpenses.length > 0 ? (totalSum / filteredExpenses.length) : 0).toFixed(2)}</h4>
              <span className="text-muted d-flex">
                <span className="text-danger fw-medium me-2">
                  <i className="ri-arrow-down-line me-1"></i>3.4%
                </span>
                Cost efficiency
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
              {expenseCategories.map(c => (
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
              <input type="text" className="form-control ps-10" placeholder="Search expenses..." value={search} onChange={e => setSearch(e.target.value)} />
              <i data-lucide="search" className="size-4 icon-dark position-absolute top-50 start-0 ms-4 translate-middle-y"></i>
            </div>
            <button type="button" className="btn btn-primary d-flex align-items-center gap-1" onClick={openAddModal}>
              <i className="ri-add-line fs-lg"></i> Add Expense
            </button>
          </div>
        </div>

        <div className="card-body pt-0">
          <div className="table-card table-responsive">
            <table className="table text-nowrap align-middle mb-0">
              <thead>
                <tr className="bg-light border-bottom">
                  <th>
                    <div className="form-check check-primary">
                      <input className="form-check-input" type="checkbox" id="checkAllExpenses" />
                    </div>
                  </th>
                  <th className="fw-medium text-muted">Voucher</th>
                  <th className="fw-medium text-muted">Payee</th>
                  <th className="fw-medium text-muted">Category</th>
                  <th className="fw-medium text-muted">Payment Method</th>
                  <th className="fw-medium text-muted">Approved By</th>
                  <th className="fw-medium text-muted">Date</th>
                  <th className="fw-medium text-muted">Status</th>
                  <th className="fw-medium text-muted">Amount</th>
                  <th className="fw-medium text-muted">Action</th>
                </tr>
              </thead>
              <tbody>
                {filteredExpenses.length === 0 ? (
                  <tr>
                    <td colSpan="10" className="text-center text-muted py-4">No records found.</td>
                  </tr>
                ) : (
                  filteredExpenses.map(item => (
                    <tr key={item.id}>
                      <td>
                        <div className="form-check check-primary">
                          <input className="form-check-input" type="checkbox" id={`check_${item.id}`} />
                        </div>
                      </td>
                      <td><a href="#!" className="link link-custom-primary fw-semibold">{item.voucher}</a></td>
                      <td className="fw-semibold">{item.payee}</td>
                      <td>{item.category}</td>
                      <td><span className="fs-13 rounded fw-medium py-1 px-2 border text-reset">{item.method}</span></td>
                      <td>
                        <div className="d-flex align-items-center gap-2">
                          <img src={item.approvedAvatar} className="size-8 rounded-circle" alt="Avatar" onError={e => { e.target.src = '/assets/user-1-xhBXJtq9.png'; }} />
                          <span className="fw-medium">{item.approvedBy}</span>
                        </div>
                      </td>
                      <td className="text-muted">{formatDateString(item.date)}</td>
                      <td>
                        <span className={`badge bg-${item.status === 'Paid' ? 'success' : 'warning'}-subtle text-${item.status === 'Paid' ? 'success' : 'warning'} border border-${item.status === 'Paid' ? 'success' : 'warning'}-subtle`}>
                          {item.status}
                        </span>
                      </td>
                      <td className="fw-bold">${item.amount.toLocaleString()}</td>
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
                Showing <b className="me-1">1-{filteredExpenses.length}</b> of <b className="ms-1">{filteredExpenses.length}</b> Results
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

      {/* Add Expense Modal */}
      <div className="modal fade" id="addExpenseModal" tabIndex="-1" aria-hidden="true">
        <div className="modal-dialog modal-dialog-centered">
          <div className="modal-content">
            <div className="modal-header">
              <h6 className="modal-title">{editingId ? 'Edit Expense' : 'Add Expense'}</h6>
              <button type="button" className="btn-close" data-bs-dismiss="modal" onClick={resetForm}></button>
            </div>
            <div className="modal-body">
              <form onSubmit={handleFormSubmit}>
                <div className="row g-4">
                  <div className="col-12">
                    <label className="form-label">Payee <span className="text-danger">*</span></label>
                    <input type="text" className="form-control" placeholder="Enter payee or expense name" value={modalPayee} onChange={e => setModalPayee(e.target.value)} required />
                  </div>
                  <div className="col-md-6">
                    <label className="form-label">Category</label>
                    <select className="form-select" value={modalCategory} onChange={e => setModalCategory(e.target.value)}>
                      {expenseCategories.map(c => (
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
                    <label className="form-label">Approved By</label>
                    <select className="form-select" value={modalApprovedBy} onChange={e => setModalApprovedBy(e.target.value)}>
                      {approvers.map(a => (
                        <option key={a} value={a}>{a}</option>
                      ))}
                    </select>
                  </div>
                  <div className="col-md-6">
                    <label className="form-label">Status</label>
                    <select className="form-select" value={modalStatus} onChange={e => setModalStatus(e.target.value)}>
                      <option value="Paid">Paid</option>
                      <option value="Pending">Pending</option>
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
                  <button type="submit" className="btn btn-primary w-50">{editingId ? 'Save Changes' : 'Save Expense'}</button>
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
            <h5 className="mb-4 lh-base">Are you sure you want to delete this Expense voucher?</h5>
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
