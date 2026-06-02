// pages/Dashboard/Purchase/PurchasePaymentsPage.jsx
import React, { useEffect, useState } from 'react';
import PageBreadcrumb from '../../../components/ui/PageBreadcrumb';
import { ROUTES } from '../../../configs/routes';

const initialPayments = [
  { id: 1, purchaseId: '#PUR-0001', name: 'Sunrise Wholesale', email: 'sunrise@gmail.com', total: 42380.00, paid: 30000.00, method: 'Mastercard (Ends **** 18)', status: 'Partial', date: '21 Dec, 2025' },
  { id: 2, purchaseId: '#PUR-0002', name: 'Global Traders', email: 'global@gmail.com', total: 15000.00, paid: 15000.00, method: 'Cash', status: 'Paid', date: '22 Dec, 2025' },
  { id: 3, purchaseId: '#PUR-0003', name: 'EcoPack Solutions', email: 'ecopack@gmail.com', total: 8500.00, paid: 0.00, method: 'None', status: 'Unpaid', date: '24 Dec, 2025' }
];

const methodsList = ['Mastercard (Ends **** 18)', 'Visa (Ends **** 42)', 'Cash', 'Bank Transfer', 'UPI'];

export default function PurchasePaymentsPage() {
  const [payments, setPayments] = useState(initialPayments);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  // Modal State
  const [modalPurchaseId, setModalPurchaseId] = useState('');
  const [modalName, setModalName] = useState('');
  const [modalTotal, setModalTotal] = useState('');
  const [modalPaid, setModalPaid] = useState('');
  const [modalMethod, setModalMethod] = useState(methodsList[0]);
  const [modalStatus, setModalStatus] = useState('Paid');
  
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
    const totalVal = parseFloat(modalTotal) || 0;
    const paidVal = parseFloat(modalPaid) || 0;

    if (editingId) {
      setPayments(prev => prev.map(p => p.id === editingId ? {
        ...p,
        purchaseId: modalPurchaseId,
        name: modalName,
        total: totalVal,
        paid: paidVal,
        method: modalMethod,
        status: modalStatus,
      } : p));
    } else {
      const newPayment = {
        id: payments.length > 0 ? Math.max(...payments.map(p => p.id)) + 1 : 1,
        purchaseId: modalPurchaseId || `#PUR-000${payments.length + 1}`,
        name: modalName,
        email: `${modalName.toLowerCase().replace(/ /g, '')}@gmail.com`,
        total: totalVal,
        paid: paidVal,
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
    setModalPurchaseId('');
    setModalName('');
    setModalTotal('');
    setModalPaid('');
    setModalMethod(methodsList[0]);
    setModalStatus('Paid');
    setEditingId(null);
  };

  const openEditModal = (item) => {
    setEditingId(item.id);
    setModalPurchaseId(item.purchaseId);
    setModalName(item.name);
    setModalTotal(item.total.toString());
    setModalPaid(item.paid.toString());
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
    const matchesSearch = p.name.toLowerCase().includes(search.toLowerCase()) || 
                          p.purchaseId.toLowerCase().includes(search.toLowerCase());
    const matchesStatus = statusFilter === 'all' || p.status.toLowerCase() === statusFilter.toLowerCase();
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="container-fluid">
      <PageBreadcrumb title="Payments" breadcrumbs={[{ label: 'Dashboard', href: ROUTES.DASHBOARD }, { label: 'Purchase' }, { label: 'Payments' }]} />

      <div className="card">
        <div className="card-header d-flex flex-wrap gap-3 justify-content-between align-items-center">
          <h5 className="card-title mb-0">Purchase Payments</h5>
          <div className="d-flex flex-wrap gap-2 align-items-center ms-auto">
            <div className="position-relative">
              <input type="text" className="form-control ps-9" placeholder="Search Payments..." value={search} onChange={e => setSearch(e.target.value)} />
              <i data-lucide="search" className="size-4 icon-dark position-absolute top-50 start-0 ms-3 translate-middle-y"></i>
            </div>
            <select className="form-select w-36" value={statusFilter} onChange={e => setStatusFilter(e.target.value)}>
              <option value="all">All Status</option>
              <option value="paid">Paid</option>
              <option value="partial">Partial</option>
              <option value="unpaid">Unpaid</option>
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
                  <th className="fw-medium text-muted">Purchase ID</th>
                  <th className="fw-medium text-muted">Supplier</th>
                  <th className="fw-medium text-muted">Total</th>
                  <th className="fw-medium text-muted">Paid</th>
                  <th className="fw-medium text-muted">Due</th>
                  <th className="fw-medium text-muted">Payment Method</th>
                  <th className="fw-medium text-muted">Payment Status</th>
                  <th className="fw-medium text-muted">Last Payment</th>
                  <th className="fw-medium text-muted">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredPayments.length === 0 ? (
                  <tr>
                    <td colSpan="10" className="text-center text-muted py-4">No records found.</td>
                  </tr>
                ) : (
                  filteredPayments.map(item => {
                    const due = item.total - item.paid;
                    return (
                      <tr key={item.id}>
                        <td>
                          <div className="form-check check-primary">
                            <input className="form-check-input" type="checkbox" id={`check_${item.id}`} />
                          </div>
                        </td>
                        <td><span className="fw-semibold text-primary">{item.purchaseId}</span></td>
                        <td>
                          <div className="d-flex align-items-center gap-2">
                            <div className="avatar size-9 rounded-circle bg-light d-flex align-items-center justify-content-center">
                              <i className="ri-truck-line text-muted"></i>
                            </div>
                            <div>
                              <div className="fw-semibold text-reset">{item.name}</div>
                              <div className="text-muted fs-sm">{item.email}</div>
                            </div>
                          </div>
                        </td>
                        <td>${item.total.toFixed(2)}</td>
                        <td>${item.paid.toFixed(2)}</td>
                        <td className="fw-semibold text-danger">${due.toFixed(2)}</td>
                        <td>{item.method}</td>
                        <td>
                          <span className={`badge bg-${item.status === 'Paid' ? 'success' : item.status === 'Partial' ? 'warning' : 'danger'}-subtle text-${item.status === 'Paid' ? 'success' : item.status === 'Partial' ? 'warning' : 'danger'}`}>
                            {item.status}
                          </span>
                        </td>
                        <td className="text-muted">{item.date}</td>
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
              <h6 className="modal-title" id="addPaymentModalLabel">{editingId ? 'Edit Purchase Payment' : 'Add Purchase Payment'}</h6>
              <button type="button" className="btn-close" data-bs-dismiss="modal"></button>
            </div>
            <div className="modal-body">
              <form onSubmit={handleFormSubmit}>
                <div className="mb-3">
                  <label className="form-label">Purchase ID <span className="text-danger">*</span></label>
                  <input type="text" className="form-control" placeholder="e.g., #PUR-0001" value={modalPurchaseId} onChange={e => setModalPurchaseId(e.target.value)} required />
                </div>
                <div className="mb-3">
                  <label className="form-label">Supplier Name <span className="text-danger">*</span></label>
                  <input type="text" className="form-control" placeholder="e.g., Sunrise Wholesale" value={modalName} onChange={e => setModalName(e.target.value)} required />
                </div>
                <div className="mb-3">
                  <label className="form-label">Total Amount ($) <span className="text-danger">*</span></label>
                  <input type="text" className="form-control" placeholder="0.00" value={modalTotal} onChange={e => setModalTotal(e.target.value)} required />
                </div>
                <div className="mb-3">
                  <label className="form-label">Paid Amount ($) <span className="text-danger">*</span></label>
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
                    <option value="Paid">Paid</option>
                    <option value="Partial">Partial</option>
                    <option value="Unpaid">Unpaid</option>
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
            <h5 className="mb-4 lh-base">Are you sure you want to delete this Purchase Payment?</h5>
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
