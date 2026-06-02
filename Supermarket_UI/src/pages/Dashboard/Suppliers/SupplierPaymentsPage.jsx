// pages/Dashboard/Suppliers/SupplierPaymentsPage.jsx
import React, { useEffect, useState } from 'react';
import PageBreadcrumb from '../../../components/ui/PageBreadcrumb';
import { ROUTES } from '../../../configs/routes';

const initialPayments = [
  { id: 1, name: 'Sunrise Wholesale', totalPurchase: 42380.00, totalPaid: 30000.00, status: 'Success', date: '15 Dec, 2025', method: 'Bank Transfer' },
  { id: 2, name: 'Global Traders', totalPurchase: 15000.00, totalPaid: 15000.00, status: 'Success', date: '18 Dec, 2025', method: 'Cash' },
  { id: 3, name: 'EcoPack Solutions', totalPurchase: 8500.00, totalPaid: 5000.00, status: 'Pending', date: '22 Dec, 2025', method: 'UPI' }
];

const methodsList = ['Bank Transfer', 'Cash', 'Card', 'UPI'];

export default function SupplierPaymentsPage() {
  const [payments, setPayments] = useState(initialPayments);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [methodFilter, setMethodFilter] = useState('all');

  // Modal State
  const [modalName, setModalName] = useState('');
  const [modalPurchase, setModalPurchase] = useState('');
  const [modalPaid, setModalPaid] = useState('');
  const [modalMethod, setModalMethod] = useState(methodsList[0]);
  const [modalStatus, setModalStatus] = useState('Success');
  
  const [editingId, setEditingId] = useState(null);
  const [deletingId, setDeletingId] = useState(null);

  useEffect(() => {
    if (window.lucide) {
      window.lucide.createIcons();
    }
  }, [payments]);

  const handleDelete = () => {
    setPayments(prev => prev.filter(p => p.id !== deletingId));
    const modalElement = document.getElementById('deleteModal');
    const modalInstance = window.bootstrap?.Modal?.getInstance(modalElement);
    modalInstance?.hide();
    setDeletingId(null);
  };

  const handleFormSubmit = (e) => {
    e.preventDefault();
    const purchaseVal = parseFloat(modalPurchase) || 0;
    const paidVal = parseFloat(modalPaid) || 0;

    if (editingId) {
      setPayments(prev => prev.map(p => p.id === editingId ? {
        ...p,
        name: modalName,
        totalPurchase: purchaseVal,
        totalPaid: paidVal,
        method: modalMethod,
        status: modalStatus,
      } : p));
    } else {
      const newPayment = {
        id: payments.length > 0 ? Math.max(...payments.map(p => p.id)) + 1 : 1,
        name: modalName,
        totalPurchase: purchaseVal,
        totalPaid: paidVal,
        method: modalMethod,
        status: modalStatus,
        date: new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })
      };
      setPayments(prev => [...prev, newPayment]);
    }

    resetForm();

    const modalElement = document.getElementById('addPaymentModal');
    const modalInstance = window.bootstrap?.Modal?.getInstance(modalElement);
    modalInstance?.hide();
  };

  const resetForm = () => {
    setModalName('');
    setModalPurchase('');
    setModalPaid('');
    setModalMethod(methodsList[0]);
    setModalStatus('Success');
    setEditingId(null);
  };

  const openEditModal = (item) => {
    setEditingId(item.id);
    setModalName(item.name);
    setModalPurchase(item.totalPurchase.toString());
    setModalPaid(item.totalPaid.toString());
    setModalMethod(item.method);
    setModalStatus(item.status);

    const modalElement = document.getElementById('addPaymentModal');
    const modalInstance = new window.bootstrap.Modal(modalElement);
    modalInstance.show();
  };

  const openAddModal = () => {
    resetForm();
    const modalElement = document.getElementById('addPaymentModal');
    const modalInstance = new window.bootstrap.Modal(modalElement);
    modalInstance.show();
  };

  const filteredPayments = payments.filter(p => {
    const matchesSearch = p.name.toLowerCase().includes(search.toLowerCase());
    const matchesStatus = statusFilter === 'all' || p.status.toLowerCase() === statusFilter.toLowerCase();
    const matchesMethod = methodFilter === 'all' || p.method.toLowerCase() === methodFilter.toLowerCase();
    return matchesSearch && matchesStatus && matchesMethod;
  });

  return (
    <div className="container-fluid">
      <PageBreadcrumb title="Supplier Payments" breadcrumbs={[{ label: 'Dashboard', href: ROUTES.DASHBOARD }, { label: 'Suppliers' }, { label: 'Payments' }]} />

      <div className="card">
        <div className="card-header d-flex flex-wrap gap-3 justify-content-between align-items-center">
          <h5 className="card-title mb-0">Supplier Payments</h5>
          <div className="d-flex flex-wrap gap-2 align-items-center ms-auto">
            <div className="position-relative">
              <input type="text" className="form-control ps-9" placeholder="Search Supplier..." value={search} onChange={e => setSearch(e.target.value)} />
              <i data-lucide="search" className="size-4 icon-dark position-absolute top-50 start-0 ms-3 translate-middle-y"></i>
            </div>
            <select className="form-select w-36" value={statusFilter} onChange={e => setStatusFilter(e.target.value)}>
              <option value="all">All Status</option>
              <option value="success">Success</option>
              <option value="pending">Pending</option>
            </select>
            <select className="form-select w-36" value={methodFilter} onChange={e => setMethodFilter(e.target.value)}>
              <option value="all">All Methods</option>
              {methodsList.map(m => (
                <option key={m} value={m}>{m}</option>
              ))}
            </select>
            <button className="btn btn-primary d-flex align-items-center gap-1" onClick={openAddModal}>
              <i className="ri-add-line fs-lg"></i> Add Payment
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
                  <th className="fw-medium text-muted">Supplier</th>
                  <th className="fw-medium text-muted">Total Purchase</th>
                  <th className="fw-medium text-muted">Total Paid</th>
                  <th className="fw-medium text-muted">Pending Amount</th>
                  <th className="fw-medium text-muted">Status</th>
                  <th className="fw-medium text-muted">Last Date</th>
                  <th className="fw-medium text-muted">Method</th>
                  <th className="fw-medium text-muted">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredPayments.length === 0 ? (
                  <tr>
                    <td colSpan="9" className="text-center text-muted py-4">No records found.</td>
                  </tr>
                ) : (
                  filteredPayments.map(item => {
                    const pending = item.totalPurchase - item.totalPaid;
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
                              <i className="ri-truck-line text-muted"></i>
                            </div>
                            <span className="fw-semibold text-reset">{item.name}</span>
                          </div>
                        </td>
                        <td>${item.totalPurchase.toFixed(2)}</td>
                        <td>${item.totalPaid.toFixed(2)}</td>
                        <td className="fw-semibold text-danger">${pending.toFixed(2)}</td>
                        <td>
                          <span className={`badge bg-${item.status === 'Success' ? 'success' : 'warning'}-subtle text-${item.status === 'Success' ? 'success' : 'warning'}`}>
                            {item.status}
                          </span>
                        </td>
                        <td className="text-muted">{item.date}</td>
                        <td>{item.method}</td>
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

      {/* Add Payment Modal */}
      <div className="modal fade" id="addPaymentModal" tabIndex="-1" aria-labelledby="addPaymentModalLabel" aria-hidden="true">
        <div className="modal-dialog modal-dialog-centered">
          <div className="modal-content">
            <div className="modal-header">
              <h6 className="modal-title" id="addPaymentModalLabel">{editingId ? 'Edit Payment Log' : 'Add Supplier Payment'}</h6>
              <button type="button" className="btn-close" data-bs-dismiss="modal"></button>
            </div>
            <div className="modal-body">
              <form onSubmit={handleFormSubmit}>
                <div className="mb-3">
                  <label className="form-label">Supplier Name <span className="text-danger">*</span></label>
                  <input type="text" className="form-control" placeholder="e.g., Sunrise Wholesale" value={modalName} onChange={e => setModalName(e.target.value)} required />
                </div>
                <div className="mb-3">
                  <label className="form-label">Total Purchase Amount ($) <span className="text-danger">*</span></label>
                  <input type="text" className="form-control" placeholder="0.00" value={modalPurchase} onChange={e => setModalPurchase(e.target.value)} required />
                </div>
                <div className="mb-3">
                  <label className="form-label">Total Paid ($) <span className="text-danger">*</span></label>
                  <input type="text" className="form-control" placeholder="0.00" value={modalPaid} onChange={e => setModalPaid(e.target.value)} required />
                </div>
                <div className="mb-3">
                  <label className="form-label">Payment Method</label>
                  <select className="form-select" value={modalMethod} onChange={e => setModalMethod(e.target.value)}>
                    {methodsList.map(m => (
                      <option key={m} value={m}>{m}</option>
                    ))}
                  </select>
                </div>
                <div className="mb-3">
                  <label className="form-label">Status</label>
                  <select className="form-select" value={modalStatus} onChange={e => setModalStatus(e.target.value)}>
                    <option value="Success">Success</option>
                    <option value="Pending">Pending</option>
                  </select>
                </div>
                <div className="d-flex gap-2 mt-7">
                  <button type="button" className="btn btn-light w-100" data-bs-dismiss="modal">Close</button>
                  <button type="submit" className="btn btn-primary w-100">{editingId ? 'Save Changes' : 'Submit Payment'}</button>
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
            <h5 className="mb-4 lh-base">Are you sure you want to delete this Payment record?</h5>
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
