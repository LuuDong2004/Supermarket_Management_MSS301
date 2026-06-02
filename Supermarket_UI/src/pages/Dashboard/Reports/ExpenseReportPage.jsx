// pages/Dashboard/Reports/ExpenseReportPage.jsx
import React, { useEffect, useState } from 'react';
import PageBreadcrumb from '../../../components/ui/PageBreadcrumb';
import { ROUTES } from '../../../configs/routes';

const initialExpenses = [
  { id: 1, payee: 'Office Rent', category: 'Rent', method: 'Bank', date: '2025-12-24', status: 'Paid', amount: 2500, trend: '15%', trendUp: true },
  { id: 2, payee: 'Electricity Board', category: 'Utilities', method: 'Online', date: '2025-12-23', status: 'Paid', amount: 440, trend: '4%', trendUp: false },
  { id: 3, payee: 'Staff Salary', category: 'Salary', method: 'Bank', date: '2025-12-22', status: 'Pending', amount: 4800, trend: '8%', trendUp: true },
  { id: 4, payee: 'Courier Service', category: 'Transportation', method: 'Cash', date: '2025-12-21', status: 'Paid', amount: 180, trend: '2%', trendUp: false },
  { id: 5, payee: 'Internet Provider', category: 'Utilities', method: 'Online', date: '2025-12-20', status: 'Paid', amount: 120, trend: '1%', trendUp: false }
];

const categories = ['Rent', 'Utilities', 'Salary', 'Transportation', 'Office Supplies', 'Maintenance', 'Fuel Expense'];
const methods = ['Bank', 'Online', 'Cash', 'Cheque'];
const statuses = ['Paid', 'Pending', 'Overdue'];

export default function ExpenseReportPage() {
  const [expenses, setExpenses] = useState(initialExpenses);
  const [search, setSearch] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [methodFilter, setMethodFilter] = useState('all');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');

  // Modal & Form States
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedExpense, setSelectedExpense] = useState(null);

  // Form inputs
  const [formPayee, setFormPayee] = useState('');
  const [formCategory, setFormCategory] = useState(categories[0]);
  const [formMethod, setFormMethod] = useState(methods[0]);
  const [formDate, setFormDate] = useState('');
  const [formStatus, setFormStatus] = useState(statuses[0]);
  const [formAmount, setFormAmount] = useState('');

  useEffect(() => {
    if (window.lucide) {
      window.lucide.createIcons();
    }
  }, [expenses, showAddModal, showEditModal]);

  const handleOpenAdd = () => {
    setFormPayee('');
    setFormCategory(categories[0]);
    setFormMethod(methods[0]);
    setFormDate(new Date().toISOString().split('T')[0]);
    setFormStatus(statuses[0]);
    setFormAmount('');
    setShowAddModal(true);
  };

  const handleAddSubmit = (e) => {
    e.preventDefault();
    const newExpense = {
      id: Date.now(),
      payee: formPayee,
      category: formCategory,
      method: formMethod,
      date: formDate,
      status: formStatus,
      amount: parseFloat(formAmount) || 0,
      trend: '0%',
      trendUp: true
    };
    setExpenses([newExpense, ...expenses]);
    setShowAddModal(false);
  };

  const handleOpenEdit = (expense) => {
    setSelectedExpense(expense);
    setFormPayee(expense.payee);
    setFormCategory(expense.category);
    setFormMethod(expense.method);
    setFormDate(expense.date);
    setFormStatus(expense.status);
    setFormAmount(expense.amount.toString());
    setShowEditModal(true);
  };

  const handleEditSubmit = (e) => {
    e.preventDefault();
    setExpenses(prev => prev.map(item => item.id === selectedExpense.id ? {
      ...item,
      payee: formPayee,
      category: formCategory,
      method: formMethod,
      date: formDate,
      status: formStatus,
      amount: parseFloat(formAmount) || 0
    } : item));
    setShowEditModal(false);
  };

  const handleDelete = (id) => {
    if (window.confirm('Are you sure you want to delete this expense?')) {
      setExpenses(prev => prev.filter(item => item.id !== id));
      if (showEditModal && selectedExpense?.id === id) {
        setShowEditModal(false);
      }
    }
  };

  const filteredExpenses = expenses.filter(item => {
    const matchesSearch = item.payee.toLowerCase().includes(search.toLowerCase()) || 
                          item.category.toLowerCase().includes(search.toLowerCase());
    const matchesCategory = categoryFilter === 'all' || item.category === categoryFilter;
    const matchesStatus = statusFilter === 'all' || item.status === statusFilter;
    const matchesMethod = methodFilter === 'all' || item.method === methodFilter;
    
    let matchesDate = true;
    if (startDate) {
      matchesDate = matchesDate && item.date >= startDate;
    }
    if (endDate) {
      matchesDate = matchesDate && item.date <= endDate;
    }

    return matchesSearch && matchesCategory && matchesStatus && matchesMethod && matchesDate;
  });

  // Calculations
  const totalExpenses = filteredExpenses.reduce((sum, item) => sum + item.amount, 0);
  const paidExpenses = filteredExpenses.filter(item => item.status === 'Paid').reduce((sum, item) => sum + item.amount, 0);
  const pendingExpenses = filteredExpenses.filter(item => item.status === 'Pending').reduce((sum, item) => sum + item.amount, 0);
  const overdueExpenses = filteredExpenses.filter(item => item.status === 'Overdue').reduce((sum, item) => sum + item.amount, 0);

  // Grouped expenses for breakdown
  const categoryTotals = expenses.reduce((acc, item) => {
    acc[item.category] = (acc[item.category] || 0) + item.amount;
    return acc;
  }, {});

  return (
    <div className="container-fluid">
      <PageBreadcrumb title="Expenses Report" breadcrumbs={[{ label: 'Dashboard', href: ROUTES.DASHBOARD }, { label: 'Reports' }, { label: 'Expenses' }]} />

      <div className="row">
        <div className="col-xl-7 col-xxl-8">
          {/* Expenses Overview Cards */}
          <div className="card">
            <div className="card-body">
              <div className="d-flex flex-wrap gap-2 justify-content-between align-items-center mb-6">
                <div className="d-flex align-items-center gap-2">
                  <div className="avatar size-8 bg-primary-subtle text-primary rounded">
                    <i data-lucide="wallet" className="size-4"></i>
                  </div>
                  <h6 className="mb-0">Expenses Overview</h6>
                </div>
                <span className="text-muted">Last updated: Jan, 2026</span>
              </div>
              <div className="row g-5">
                <div className="col-md-6 col-lg-3 col-xl-6 col-xxl-3 border-end-md">
                  <div>
                    <p className="text-muted mb-3">Total Expenses</p>
                    <h5 className="mb-0">${totalExpenses.toLocaleString()}<small className="text-muted fs-15 fw-normal ms-2">Filtered</small></h5>
                  </div>
                </div>
                <div className="col-md-6 col-lg-3 col-xl-6 col-xxl-3 d-flex border-end-lg border-end-xl-0 border-end-xxl">
                  <div className="px-md-10">
                    <p className="text-muted mb-3">Paid Expenses</p>
                    <h5 className="mb-0">${paidExpenses.toLocaleString()}<small className="text-muted fs-15 fw-normal ms-2">Completed</small></h5>
                  </div>
                </div>
                <div className="col-md-6 col-lg-3 col-xl-6 col-xxl-3 d-flex border-end-md">
                  <div className="px-lg-10 px-xl-0 px-xxl-10">
                    <p className="text-muted mb-3">Pending Expenses</p>
                    <h5 className="mb-0">${pendingExpenses.toLocaleString()}<small className="text-muted fs-15 fw-normal ms-2">Awaiting payment</small></h5>
                  </div>
                </div>
                <div className="col-md-6 col-lg-3 col-xl-6 col-xxl-3 d-flex">
                  <div className="px-md-10">
                    <p className="text-muted mb-3">Overdue Expenses</p>
                    <h5 className="mb-0">${overdueExpenses.toLocaleString()}<small className="text-muted fs-15 fw-normal ms-2">Past due</small></h5>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Chart Card */}
          <div className="card">
            <div className="card-header d-flex flex-wrap justify-content-between align-items-center">
              <h5 className="card-title mb-0">Income vs Expense</h5>
              <div className="text-muted fs-sm">Monthly Overview</div>
            </div>
            <div className="card-body">
              {/* SVG Custom Premium Chart */}
              <div style={{ width: '100%', height: '300px' }}>
                <svg viewBox="0 0 600 300" width="100%" height="100%">
                  {/* Grid Lines */}
                  <line x1="50" y1="50" x2="550" y2="50" stroke="#e9ecef" strokeDasharray="4 4" />
                  <line x1="50" y1="110" x2="550" y2="110" stroke="#e9ecef" strokeDasharray="4 4" />
                  <line x1="50" y1="170" x2="550" y2="170" stroke="#e9ecef" strokeDasharray="4 4" />
                  <line x1="50" y1="230" x2="550" y2="230" stroke="#e9ecef" strokeDasharray="4 4" />
                  <line x1="50" y1="250" x2="550" y2="250" stroke="#6c757d" strokeWidth="1.5" />

                  {/* Y Axis Labels */}
                  <text x="40" y="55" fill="#6c757d" fontSize="12" textAnchor="end">$10,000</text>
                  <text x="40" y="115" fill="#6c757d" fontSize="12" textAnchor="end">$7,500</text>
                  <text x="40" y="175" fill="#6c757d" fontSize="12" textAnchor="end">$5,000</text>
                  <text x="40" y="235" fill="#6c757d" fontSize="12" textAnchor="end">$2,500</text>
                  <text x="40" y="255" fill="#6c757d" fontSize="12" textAnchor="end">$0</text>

                  {/* Bar Groups: Jul, Aug, Sep, Oct, Nov, Dec */}
                  {/* July */}
                  <rect x="90" y="90" width="20" height="160" rx="3" fill="#38a169" opacity="0.85" />
                  <rect x="115" y="130" width="20" height="120" rx="3" fill="#e53e3e" opacity="0.85" />
                  <text x="112.5" y="270" fill="#6c757d" fontSize="12" textAnchor="middle">Jul</text>

                  {/* Aug */}
                  <rect x="170" y="70" width="20" height="180" rx="3" fill="#38a169" opacity="0.85" />
                  <rect x="195" y="120" width="20" height="130" rx="3" fill="#e53e3e" opacity="0.85" />
                  <text x="192.5" y="270" fill="#6c757d" fontSize="12" textAnchor="middle">Aug</text>

                  {/* Sep */}
                  <rect x="250" y="80" width="20" height="170" rx="3" fill="#38a169" opacity="0.85" />
                  <rect x="275" y="150" width="20" height="100" rx="3" fill="#e53e3e" opacity="0.85" />
                  <text x="272.5" y="270" fill="#6c757d" fontSize="12" textAnchor="middle">Sep</text>

                  {/* Oct */}
                  <rect x="330" y="60" width="20" height="190" rx="3" fill="#38a169" opacity="0.85" />
                  <rect x="355" y="110" width="20" height="140" rx="3" fill="#e53e3e" opacity="0.85" />
                  <text x="352.5" y="270" fill="#6c757d" fontSize="12" textAnchor="middle">Oct</text>

                  {/* Nov */}
                  <rect x="410" y="50" width="20" height="200" rx="3" fill="#38a169" opacity="0.85" />
                  <rect x="435" y="90" width="20" height="160" rx="3" fill="#e53e3e" opacity="0.85" />
                  <text x="432.5" y="270" fill="#6c757d" fontSize="12" textAnchor="middle">Nov</text>

                  {/* Dec */}
                  <rect x="490" y="40" width="20" height="210" rx="3" fill="#38a169" opacity="0.85" />
                  <rect x="515" y="100" width="20" height="150" rx="3" fill="#e53e3e" opacity="0.85" />
                  <text x="512.5" y="270" fill="#6c757d" fontSize="12" textAnchor="middle">Dec</text>

                  {/* Legend */}
                  <rect x="400" y="10" width="12" height="12" rx="2" fill="#38a169" />
                  <text x="418" y="21" fill="#4a5568" fontSize="12">Income</text>
                  <rect x="480" y="10" width="12" height="12" rx="2" fill="#e53e3e" />
                  <text x="498" y="21" fill="#4a5568" fontSize="12">Expense</text>
                </svg>
              </div>
            </div>
          </div>

          {/* Table Summary Card */}
          <div className="card">
            <div className="card-header d-flex flex-wrap justify-content-between align-items-center gap-2">
              <h5 className="card-title mb-0">Summary</h5>
              <button onClick={handleOpenAdd} className="btn btn-primary btn-sm"><i className="ri-add-line me-1"></i>Add Expense</button>
            </div>
            
            {/* Filters Row */}
            <div className="card-body pb-0 pt-3">
              <div className="row g-3 mb-4">
                <div className="col-md-3">
                  <div className="position-relative">
                    <input type="text" className="form-control ps-10" placeholder="Search payee/category..." value={search} onChange={e => setSearch(e.target.value)} />
                    <i data-lucide="search" className="size-4 icon-dark position-absolute top-50 start-0 ms-4 translate-middle-y"></i>
                  </div>
                </div>
                <div className="col-md-2">
                  <select className="form-select" value={categoryFilter} onChange={e => setCategoryFilter(e.target.value)}>
                    <option value="all">All Categories</option>
                    {categories.map(cat => (
                      <option key={cat} value={cat}>{cat}</option>
                    ))}
                  </select>
                </div>
                <div className="col-md-2">
                  <select className="form-select" value={statusFilter} onChange={e => setStatusFilter(e.target.value)}>
                    <option value="all">All Statuses</option>
                    {statuses.map(st => (
                      <option key={st} value={st}>{st}</option>
                    ))}
                  </select>
                </div>
                <div className="col-md-2">
                  <select className="form-select" value={methodFilter} onChange={e => setMethodFilter(e.target.value)}>
                    <option value="all">All Methods</option>
                    {methods.map(met => (
                      <option key={met} value={met}>{met}</option>
                    ))}
                  </select>
                </div>
                <div className="col-md-3 d-flex gap-2">
                  <input type="date" className="form-control form-control-sm" placeholder="Start Date" value={startDate} onChange={e => setStartDate(e.target.value)} />
                  <input type="date" className="form-control form-control-sm" placeholder="End Date" value={endDate} onChange={e => setEndDate(e.target.value)} />
                </div>
              </div>
            </div>

            <div className="card-body pt-0">
              <div className="table-card table-responsive">
                <table className="table text-nowrap align-middle mb-0">
                  <thead>
                    <tr className="bg-light border-bottom">
                      <th>Payee</th>
                      <th>Category</th>
                      <th>Payment Method</th>
                      <th>Amount</th>
                      <th>Date</th>
                      <th>Status</th>
                      <th>Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredExpenses.length === 0 ? (
                      <tr>
                        <td colSpan="7" className="text-center text-muted py-4">No records found.</td>
                      </tr>
                    ) : (
                      filteredExpenses.map(item => (
                        <tr key={item.id}>
                          <td><span className="fw-medium text-reset">{item.payee}</span></td>
                          <td>{item.category}</td>
                          <td><span className="fs-13 rounded fw-medium py-1 px-2 border text-reset">{item.method}</span></td>
                          <td className="fw-semibold">${item.amount.toLocaleString()}</td>
                          <td>{item.date}</td>
                          <td>
                            <span className={`badge bg-${item.status === 'Paid' ? 'success' : item.status === 'Pending' ? 'warning' : 'danger'}-subtle text-${item.status === 'Paid' ? 'success' : item.status === 'Pending' ? 'warning' : 'danger'} border border-${item.status === 'Paid' ? 'success' : item.status === 'Pending' ? 'warning' : 'danger'}-subtle`}>
                              {item.status}
                            </span>
                          </td>
                          <td>
                            <div className="d-flex gap-2">
                              <button className="btn btn-sub-secondary size-8 btn-icon" onClick={() => handleOpenEdit(item)}><i className="ri-edit-line"></i></button>
                              <button className="btn btn-sub-danger size-8 btn-icon" onClick={() => handleDelete(item.id)}><i className="ri-delete-bin-line"></i></button>
                            </div>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>

        {/* Right Sidebar Charts & Breakdown */}
        <div className="col-xl-5 col-xxl-4">
          <div className="card">
            <div className="card-header d-flex flex-wrap justify-content-between align-items-center">
              <h5 className="card-title mb-0">Week Progress</h5>
              <span className="text-muted fs-sm">Mon - Sun</span>
            </div>
            <div className="card-body">
              {/* Week progress interactive SVG chart */}
              <div style={{ width: '100%', height: '220px' }}>
                <svg viewBox="0 0 400 200" width="100%" height="100%">
                  {/* Grid Lines */}
                  <line x1="40" y1="40" x2="360" y2="40" stroke="#f1f3f5" />
                  <line x1="40" y1="90" x2="360" y2="90" stroke="#f1f3f5" />
                  <line x1="40" y1="140" x2="360" y2="140" stroke="#f1f3f5" />
                  <line x1="40" y1="160" x2="360" y2="160" stroke="#dee2e6" strokeWidth="1.5" />

                  {/* Bars */}
                  {/* Mon */}
                  <rect x="55" y="80" width="18" height="80" rx="2" fill="#4299e1" />
                  <text x="64" y="180" fill="#6c757d" fontSize="10" textAnchor="middle">Mon</text>
                  
                  {/* Tue */}
                  <rect x="95" y="50" width="18" height="110" rx="2" fill="#4299e1" />
                  <text x="104" y="180" fill="#6c757d" fontSize="10" textAnchor="middle">Tue</text>

                  {/* Wed */}
                  <rect x="135" y="110" width="18" height="50" rx="2" fill="#4299e1" />
                  <text x="144" y="180" fill="#6c757d" fontSize="10" textAnchor="middle">Wed</text>

                  {/* Thu */}
                  <rect x="175" y="60" width="18" height="100" rx="2" fill="#4299e1" />
                  <text x="184" y="180" fill="#6c757d" fontSize="10" textAnchor="middle">Thu</text>

                  {/* Fri */}
                  <rect x="215" y="40" width="18" height="120" rx="2" fill="#4299e1" />
                  <text x="224" y="180" fill="#6c757d" fontSize="10" textAnchor="middle">Fri</text>

                  {/* Sat */}
                  <rect x="255" y="120" width="18" height="40" rx="2" fill="#4299e1" />
                  <text x="264" y="180" fill="#6c757d" fontSize="10" textAnchor="middle">Sat</text>

                  {/* Sun */}
                  <rect x="295" y="140" width="18" height="20" rx="2" fill="#4299e1" />
                  <text x="304" y="180" fill="#6c757d" fontSize="10" textAnchor="middle">Sun</text>
                </svg>
              </div>
            </div>
          </div>

          <div className="card">
            <div className="card-header d-flex flex-wrap gap-2 justify-content-between align-items-center">
              <h5 className="card-title mb-0">Expense Breakdown</h5>
              <p className="text-muted mb-0 fs-sm">Compared to last month</p>
            </div>
            <div className="card-body p-0">
              <div className="row g-0">
                <div className="col-md-6 border-bottom border-end-md">
                  <div className="p-5 d-flex justify-content-between align-items-center">
                    <div className="d-flex align-items-center gap-3">
                      <div className="avatar size-10 bg-light text-muted rounded">
                        <i data-lucide="wallet" className="size-5"></i>
                      </div>
                      <div>
                        <p className="text-muted mb-0 fs-sm">Office Rent</p>
                        <h6 className="mb-0">${(categoryTotals['Rent'] || 0).toLocaleString()}</h6>
                      </div>
                    </div>
                    <p className="text-muted mb-0 fs-xs">15% <i data-lucide="arrow-up" className="text-success size-3"></i></p>
                  </div>
                </div>
                <div className="col-md-6 border-bottom">
                  <div className="p-5 d-flex justify-content-between align-items-center">
                    <div className="d-flex align-items-center gap-3">
                      <div className="avatar size-10 bg-light text-muted rounded">
                        <i data-lucide="users" className="size-5"></i>
                      </div>
                      <div>
                        <p className="text-muted mb-0 fs-sm">Staff Salary</p>
                        <h6 className="mb-0">${(categoryTotals['Salary'] || 0).toLocaleString()}</h6>
                      </div>
                    </div>
                    <p className="text-muted mb-0 fs-xs">8% <i data-lucide="arrow-up" className="text-success size-3"></i></p>
                  </div>
                </div>
                <div className="col-md-6 border-bottom border-end-md">
                  <div className="p-5 d-flex justify-content-between align-items-center">
                    <div className="d-flex align-items-center gap-3">
                      <div className="avatar size-10 bg-light text-muted rounded">
                        <i data-lucide="zap" className="size-5"></i>
                      </div>
                      <div>
                        <p className="text-muted mb-0 fs-sm">Utilities</p>
                        <h6 className="mb-0">${(categoryTotals['Utilities'] || 0).toLocaleString()}</h6>
                      </div>
                    </div>
                    <p className="text-muted mb-0 fs-xs">4% <i data-lucide="arrow-down" className="text-danger size-3"></i></p>
                  </div>
                </div>
                <div className="col-md-6 border-bottom">
                  <div className="p-5 d-flex justify-content-between align-items-center">
                    <div className="d-flex align-items-center gap-3">
                      <div className="avatar size-10 bg-light text-muted rounded">
                        <i data-lucide="truck" className="size-5"></i>
                      </div>
                      <div>
                        <p className="text-muted mb-0 fs-sm">Transportation</p>
                        <h6 className="mb-0">${(categoryTotals['Transportation'] || 0).toLocaleString()}</h6>
                      </div>
                    </div>
                    <p className="text-muted mb-0 fs-xs">2% <i data-lucide="arrow-up" className="text-success size-3"></i></p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Add Modal */}
      {showAddModal && (
        <div className="modal fade show d-block" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Add Expense</h5>
                <button type="button" className="btn-close" onClick={() => setShowAddModal(false)}></button>
              </div>
              <form onSubmit={handleAddSubmit}>
                <div className="modal-body">
                  <div className="mb-3">
                    <label className="form-label">Payee</label>
                    <input type="text" className="form-control" value={formPayee} onChange={e => setFormPayee(e.target.value)} required />
                  </div>
                  <div className="mb-3">
                    <label className="form-label">Category</label>
                    <select className="form-select" value={formCategory} onChange={e => setFormCategory(e.target.value)}>
                      {categories.map(c => <option key={c} value={c}>{c}</option>)}
                    </select>
                  </div>
                  <div className="mb-3">
                    <label className="form-label">Payment Method</label>
                    <select className="form-select" value={formMethod} onChange={e => setFormMethod(e.target.value)}>
                      {methods.map(m => <option key={m} value={m}>{m}</option>)}
                    </select>
                  </div>
                  <div className="mb-3">
                    <label className="form-label">Amount ($)</label>
                    <input type="number" className="form-control" value={formAmount} onChange={e => setFormAmount(e.target.value)} required />
                  </div>
                  <div className="mb-3">
                    <label className="form-label">Date</label>
                    <input type="date" className="form-control" value={formDate} onChange={e => setFormDate(e.target.value)} required />
                  </div>
                  <div className="mb-3">
                    <label className="form-label">Status</label>
                    <select className="form-select" value={formStatus} onChange={e => setFormStatus(e.target.value)}>
                      {statuses.map(s => <option key={s} value={s}>{s}</option>)}
                    </select>
                  </div>
                </div>
                <div className="modal-footer">
                  <button type="button" className="btn btn-light" onClick={() => setShowAddModal(false)}>Close</button>
                  <button type="submit" className="btn btn-primary">Save Expense</button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* Edit Modal */}
      {showEditModal && (
        <div className="modal fade show d-block" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Edit Expense</h5>
                <button type="button" className="btn-close" onClick={() => setShowEditModal(false)}></button>
              </div>
              <form onSubmit={handleEditSubmit}>
                <div className="modal-body">
                  <div className="mb-3">
                    <label className="form-label">Payee</label>
                    <input type="text" className="form-control" value={formPayee} onChange={e => setFormPayee(e.target.value)} required />
                  </div>
                  <div className="mb-3">
                    <label className="form-label">Category</label>
                    <select className="form-select" value={formCategory} onChange={e => setFormCategory(e.target.value)}>
                      {categories.map(c => <option key={c} value={c}>{c}</option>)}
                    </select>
                  </div>
                  <div className="mb-3">
                    <label className="form-label">Payment Method</label>
                    <select className="form-select" value={formMethod} onChange={e => setFormMethod(e.target.value)}>
                      {methods.map(m => <option key={m} value={m}>{m}</option>)}
                    </select>
                  </div>
                  <div className="mb-3">
                    <label className="form-label">Amount ($)</label>
                    <input type="number" className="form-control" value={formAmount} onChange={e => setFormAmount(e.target.value)} required />
                  </div>
                  <div className="mb-3">
                    <label className="form-label">Date</label>
                    <input type="date" className="form-control" value={formDate} onChange={e => setFormDate(e.target.value)} required />
                  </div>
                  <div className="mb-3">
                    <label className="form-label">Status</label>
                    <select className="form-select" value={formStatus} onChange={e => setFormStatus(e.target.value)}>
                      {statuses.map(s => <option key={s} value={s}>{s}</option>)}
                    </select>
                  </div>
                </div>
                <div className="modal-footer">
                  <button type="button" className="btn btn-danger me-auto" onClick={() => handleDelete(selectedExpense.id)}>Delete</button>
                  <button type="button" className="btn btn-light" onClick={() => setShowEditModal(false)}>Close</button>
                  <button type="submit" className="btn btn-primary">Save Changes</button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
