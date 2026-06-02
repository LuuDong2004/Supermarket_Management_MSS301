// pages/Dashboard/Staff/StaffPayrollPage.jsx
import React, { useEffect, useState } from 'react';
import PageBreadcrumb from '../../../components/ui/PageBreadcrumb';
import { ROUTES } from '../../../configs/routes';

const initialPayroll = [
  { id: 1, name: 'Lucas Ethan', role: 'Store Manager', month: 'May 2026', basicSalary: 4500.00, allowance: 300.00, deduction: 150.00, status: 'Paid' },
  { id: 2, name: 'Emily Johnson', role: 'Cashier', month: 'May 2026', basicSalary: 2500.00, allowance: 100.00, deduction: 50.00, status: 'Paid' },
  { id: 3, name: 'Michael Davis', role: 'Sales Assistant', month: 'May 2026', basicSalary: 2800.00, allowance: 150.00, deduction: 80.00, status: 'Unpaid' }
];

export default function StaffPayrollPage() {
  const [payroll, setPayroll] = useState(initialPayroll);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  // Modal State
  const [modalName, setModalName] = useState('');
  const [modalMonth, setModalMonth] = useState('May 2026');
  const [modalBasic, setModalBasic] = useState('');
  const [modalAllowance, setModalAllowance] = useState('0');
  const [modalDeduction, setModalDeduction] = useState('0');
  const [modalStatus, setModalStatus] = useState('Paid');
  
  const [editingId, setEditingId] = useState(null);
  const [deletingId, setDeletingId] = useState(null);

  useEffect(() => {
    if (window.lucide) {
      window.lucide.createIcons();
    }
  }, [payroll]);

  const handleDelete = () => {
    setPayroll(prev => prev.filter(p => p.id !== deletingId));
    const modalElement = document.getElementById('deleteModal');
    const modalInstance = window.bootstrap?.Modal?.getInstance(modalElement);
    modalInstance?.hide();
    setDeletingId(null);
  };

  const handleFormSubmit = (e) => {
    e.preventDefault();
    const basicVal = parseFloat(modalBasic) || 0;
    const allowanceVal = parseFloat(modalAllowance) || 0;
    const deductionVal = parseFloat(modalDeduction) || 0;

    if (editingId) {
      setPayroll(prev => prev.map(p => p.id === editingId ? {
        ...p,
        name: modalName,
        month: modalMonth,
        basicSalary: basicVal,
        allowance: allowanceVal,
        deduction: deductionVal,
        status: modalStatus,
      } : p));
    } else {
      const newPay = {
        id: payroll.length > 0 ? Math.max(...payroll.map(p => p.id)) + 1 : 1,
        name: modalName,
        role: 'Staff Member',
        month: modalMonth,
        basicSalary: basicVal,
        allowance: allowanceVal,
        deduction: deductionVal,
        status: modalStatus,
      };
      setPayroll(prev => [...prev, newPay]);
    }

    resetForm();

    const modalElement = document.getElementById('addPayrollModal');
    const modalInstance = window.bootstrap?.Modal?.getInstance(modalElement);
    modalInstance?.hide();
  };

  const resetForm = () => {
    setModalName('');
    setModalMonth('May 2026');
    setModalBasic('');
    setModalAllowance('0');
    setModalDeduction('0');
    setModalStatus('Paid');
    setEditingId(null);
  };

  const openEditModal = (item) => {
    setEditingId(item.id);
    setModalName(item.name);
    setModalMonth(item.month);
    setModalBasic(item.basicSalary.toString());
    setModalAllowance(item.allowance.toString());
    setModalDeduction(item.deduction.toString());
    setModalStatus(item.status);

    const modalElement = document.getElementById('addPayrollModal');
    const modalInstance = new window.bootstrap.Modal(modalElement);
    modalInstance.show();
  };

  const openAddModal = () => {
    resetForm();
    const modalElement = document.getElementById('addPayrollModal');
    const modalInstance = new window.bootstrap.Modal(modalElement);
    modalInstance.show();
  };

  const filteredPayroll = payroll.filter(p => {
    const matchesSearch = p.name.toLowerCase().includes(search.toLowerCase()) || 
                          p.role.toLowerCase().includes(search.toLowerCase());
    const matchesStatus = statusFilter === 'all' || p.status.toLowerCase() === statusFilter.toLowerCase();
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="container-fluid">
      <PageBreadcrumb title="Payroll" breadcrumbs={[{ label: 'Dashboard', href: ROUTES.DASHBOARD }, { label: 'Staff' }, { label: 'Payroll' }]} />

      <div className="card">
        <div className="card-header d-flex flex-wrap gap-3 justify-content-between align-items-center">
          <h5 className="card-title mb-0">Staff Payroll</h5>
          <div className="d-flex flex-wrap gap-2 align-items-center ms-auto">
            <div className="position-relative">
              <input type="text" className="form-control ps-9" placeholder="Search Staff..." value={search} onChange={e => setSearch(e.target.value)} />
              <i data-lucide="search" className="size-4 icon-dark position-absolute top-50 start-0 ms-3 translate-middle-y"></i>
            </div>
            <select className="form-select w-36" value={statusFilter} onChange={e => setStatusFilter(e.target.value)}>
              <option value="all">All Status</option>
              <option value="paid">Paid</option>
              <option value="unpaid">Unpaid</option>
            </select>
            <button className="btn btn-primary d-flex align-items-center gap-1" onClick={openAddModal}>
              <i className="ri-add-line fs-lg"></i> Add Payroll
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
                  <th className="fw-medium text-muted">Staff Member</th>
                  <th className="fw-medium text-muted">Month</th>
                  <th className="fw-medium text-muted">Basic Salary</th>
                  <th className="fw-medium text-muted">Allowances</th>
                  <th className="fw-medium text-muted">Deductions</th>
                  <th className="fw-medium text-muted">Net Salary</th>
                  <th className="fw-medium text-muted">Status</th>
                  <th className="fw-medium text-muted">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredPayroll.length === 0 ? (
                  <tr>
                    <td colSpan="9" className="text-center text-muted py-4">No records found.</td>
                  </tr>
                ) : (
                  filteredPayroll.map(item => {
                    const netSalary = item.basicSalary + item.allowance - item.deduction;
                    return (
                      <tr key={item.id}>
                        <td>
                          <div className="form-check check-primary">
                            <input className="form-check-input" type="checkbox" id={`check_${item.id}`} />
                          </div>
                        </td>
                        <td>
                          <div className="d-flex align-items-center gap-2">
                            <div className="avatar size-9 rounded-circle bg-light d-flex align-items-center justify-content-center">
                              <i className="ri-wallet-3-line text-muted"></i>
                            </div>
                            <div>
                              <div className="fw-semibold text-reset">{item.name}</div>
                              <div className="text-muted fs-sm">{item.role}</div>
                            </div>
                          </div>
                        </td>
                        <td className="text-muted">{item.month}</td>
                        <td>${item.basicSalary.toFixed(2)}</td>
                        <td>${item.allowance.toFixed(2)}</td>
                        <td>-${item.deduction.toFixed(2)}</td>
                        <td className="fw-semibold text-primary">${netSalary.toFixed(2)}</td>
                        <td>
                          <span className={`badge bg-${item.status === 'Paid' ? 'success' : 'danger'}-subtle text-${item.status === 'Paid' ? 'success' : 'danger'}`}>
                            {item.status}
                          </span>
                        </td>
                        <td>
                          <div className="d-flex gap-2">
                            <button className="btn btn-sub-secondary size-8 btn-icon" onClick={() => openEditModal(item)}><i className="ri-edit-line"></i></button>
                            <button className="btn btn-sub-danger size-8 btn-icon" data-bs-toggle="modal" data-bs-target="#deleteModal" onClick={() => setDeletingId(item.id)}><i className="ri-delete-bin-line"></i></button>
                          </div>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Add/Edit Payroll Modal */}
      <div className="modal fade" id="addPayrollModal" tabIndex="-1" aria-labelledby="addPayrollModalLabel" aria-hidden="true">
        <div className="modal-dialog modal-dialog-centered">
          <div className="modal-content">
            <div className="modal-header">
              <h6 className="modal-title" id="addPayrollModalLabel">{editingId ? 'Edit Payroll Log' : 'Add Payroll Record'}</h6>
              <button type="button" className="btn-close" data-bs-dismiss="modal"></button>
            </div>
            <div className="modal-body">
              <form onSubmit={handleFormSubmit}>
                <div className="mb-3">
                  <label className="form-label">Staff Member Name <span className="text-danger">*</span></label>
                  <input type="text" className="form-control" placeholder="e.g., Lucas Ethan" value={modalName} onChange={e => setModalName(e.target.value)} required />
                </div>
                <div className="mb-3">
                  <label className="form-label">Month <span className="text-danger">*</span></label>
                  <input type="text" className="form-control" placeholder="e.g., May 2026" value={modalMonth} onChange={e => setModalMonth(e.target.value)} required />
                </div>
                <div className="mb-3">
                  <label className="form-label">Basic Salary ($) <span className="text-danger">*</span></label>
                  <input type="text" className="form-control" placeholder="0.00" value={modalBasic} onChange={e => setModalBasic(e.target.value)} required />
                </div>
                <div className="mb-3">
                  <label className="form-label">Allowance ($)</label>
                  <input type="text" className="form-control" placeholder="0.00" value={modalAllowance} onChange={e => setModalAllowance(e.target.value)} />
                </div>
                <div className="mb-3">
                  <label className="form-label">Deduction ($)</label>
                  <input type="text" className="form-control" placeholder="0.00" value={modalDeduction} onChange={e => setModalDeduction(e.target.value)} />
                </div>
                <div className="mb-3">
                  <label className="form-label">Status</label>
                  <select className="form-select" value={modalStatus} onChange={e => setModalStatus(e.target.value)}>
                    <option value="Paid">Paid</option>
                    <option value="Unpaid">Unpaid</option>
                  </select>
                </div>
                <div className="d-flex gap-2 mt-7">
                  <button type="button" className="btn btn-light w-100" data-bs-dismiss="modal">Close</button>
                  <button type="submit" className="btn btn-primary w-100">{editingId ? 'Save Changes' : 'Submit Payroll'}</button>
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
            <h5 className="mb-4 lh-base">Are you sure you want to delete this Payroll?</h5>
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
