// pages/Dashboard/Purchase/PurchaseReturnsPage.jsx
import React, { useEffect, useState } from 'react';
import PageBreadcrumb from '../../../components/ui/PageBreadcrumb';
import { ROUTES } from '../../../configs/routes';

const initialReturns = [
  { id: 1, returnId: '#RET-0001', purchaseId: '#PUR-0001', name: 'Sunrise Wholesale', items: '5 Items', amount: 3450.00, status: 'Pending', date: '24 Dec, 2025', warehouse: 'Secondary Warehouse' },
  { id: 2, returnId: '#RET-0002', purchaseId: '#PUR-0002', name: 'Global Traders', items: '2 Items', amount: 1200.00, status: 'Completed', date: '25 Dec, 2025', warehouse: 'Main Warehouse' }
];

const warehousesList = ['Main Warehouse', 'Secondary Warehouse', 'Sub Warehouse'];

export default function PurchaseReturnsPage() {
  const [returns, setReturns] = useState(initialReturns);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  // Modal State
  const [modalPurchaseId, setModalPurchaseId] = useState('');
  const [modalName, setModalName] = useState('');
  const [modalItems, setModalItems] = useState('');
  const [modalAmount, setModalAmount] = useState('');
  const [modalWarehouse, setModalWarehouse] = useState(warehousesList[0]);
  const [modalStatus, setModalStatus] = useState('Pending');
  
  const [editingId, setEditingId] = useState(null);
  const [deletingId, setDeletingId] = useState(null);

  useEffect(() => {
    if (window.lucide) {
      window.lucide.createIcons();
    }
  }, [returns]);

  const handleDelete = () => {
    setReturns(prev => prev.filter(r => r.id !== deletingId));
    const modalElement = document.getElementById('deleteModal');
    const modalInstance = window.bootstrap?.Modal?.getInstance(modalElement);
    modalInstance?.hide();
    setDeletingId(null);
  };

  const handleFormSubmit = (e) => {
    e.preventDefault();
    const amountVal = parseFloat(modalAmount) || 0;

    if (editingId) {
      setReturns(prev => prev.map(r => r.id === editingId ? {
        ...r,
        purchaseId: modalPurchaseId,
        name: modalName,
        items: modalItems,
        amount: amountVal,
        warehouse: modalWarehouse,
        status: modalStatus,
      } : r));
    } else {
      const newReturn = {
        id: returns.length > 0 ? Math.max(...returns.map(r => r.id)) + 1 : 1,
        returnId: `#RET-000${returns.length + 1}`,
        purchaseId: modalPurchaseId,
        name: modalName,
        items: modalItems,
        amount: amountVal,
        warehouse: modalWarehouse,
        status: modalStatus,
        date: new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })
      };
      setReturns(prev => [...prev, newReturn]);
    }

    resetForm();

    const modalElement = document.getElementById('addReturnModal');
    const modalInstance = window.bootstrap?.Modal?.getInstance(modalElement);
    modalInstance?.hide();
  };

  const resetForm = () => {
    setModalPurchaseId('');
    setModalName('');
    setModalItems('');
    setModalAmount('');
    setModalWarehouse(warehousesList[0]);
    setModalStatus('Pending');
    setEditingId(null);
  };

  const openEditModal = (item) => {
    setEditingId(item.id);
    setModalPurchaseId(item.purchaseId);
    setModalName(item.name);
    setModalItems(item.items);
    setModalAmount(item.amount.toString());
    setModalWarehouse(item.warehouse);
    setModalStatus(item.status);

    const modalElement = document.getElementById('addReturnModal');
    const modalInstance = new window.bootstrap.Modal(modalElement);
    modalInstance.show();
  };

  const openAddModal = () => {
    resetForm();
    const modalElement = document.getElementById('addReturnModal');
    const modalInstance = new window.bootstrap.Modal(modalElement);
    modalInstance.show();
  };

  const filteredReturns = returns.filter(r => {
    const matchesSearch = r.name.toLowerCase().includes(search.toLowerCase()) || 
                          r.returnId.toLowerCase().includes(search.toLowerCase()) ||
                          r.purchaseId.toLowerCase().includes(search.toLowerCase());
    const matchesStatus = statusFilter === 'all' || r.status.toLowerCase() === statusFilter.toLowerCase();
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="container-fluid">
      <PageBreadcrumb title="Returns" breadcrumbs={[{ label: 'Dashboard', href: ROUTES.DASHBOARD }, { label: 'Purchase' }, { label: 'Returns' }]} />

      <div className="card">
        <div className="card-header d-flex flex-wrap gap-3 justify-content-between align-items-center">
          <h5 className="card-title mb-0">Purchase Returns</h5>
          <div className="d-flex flex-wrap gap-2 align-items-center ms-auto">
            <div className="position-relative">
              <input type="text" className="form-control ps-9" placeholder="Search Returns..." value={search} onChange={e => setSearch(e.target.value)} />
              <i data-lucide="search" className="size-4 icon-dark position-absolute top-50 start-0 ms-3 translate-middle-y"></i>
            </div>
            <select className="form-select w-36" value={statusFilter} onChange={e => setStatusFilter(e.target.value)}>
              <option value="all">All Status</option>
              <option value="pending">Pending</option>
              <option value="completed">Completed</option>
              <option value="rejected">Rejected</option>
            </select>
            <button className="btn btn-primary d-flex align-items-center gap-1" onClick={openAddModal}>
              <i className="ri-add-line fs-lg"></i> Add Return
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
                  <th className="fw-medium text-muted">Return ID</th>
                  <th className="fw-medium text-muted">Purchase ID</th>
                  <th className="fw-medium text-muted">Supplier</th>
                  <th className="fw-medium text-muted">Return Items</th>
                  <th className="fw-medium text-muted">Return Amount</th>
                  <th className="fw-medium text-muted">Return Status</th>
                  <th className="fw-medium text-muted">Created Date</th>
                  <th className="fw-medium text-muted">Warehouse</th>
                  <th className="fw-medium text-muted">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredReturns.length === 0 ? (
                  <tr>
                    <td colSpan="10" className="text-center text-muted py-4">No records found.</td>
                  </tr>
                ) : (
                  filteredReturns.map(item => (
                    <tr key={item.id}>
                      <td>
                        <div className="form-check check-primary">
                          <input className="form-check-input" type="checkbox" id={`check_${item.id}`} />
                        </div>
                      </td>
                      <td><span className="fw-semibold text-reset">{item.returnId}</span></td>
                      <td><span className="fw-semibold text-primary">{item.purchaseId}</span></td>
                      <td>
                        <div className="d-flex align-items-center gap-2">
                          <div className="avatar size-9 rounded-circle bg-light d-flex align-items-center justify-content-center">
                            <i className="ri-truck-line text-muted"></i>
                          </div>
                          <span className="fw-semibold text-reset">{item.name}</span>
                        </div>
                      </td>
                      <td>{item.items}</td>
                      <td>${item.amount.toFixed(2)}</td>
                      <td>
                        <span className={`badge bg-${item.status === 'Completed' ? 'success' : item.status === 'Pending' ? 'warning' : 'danger'}-subtle text-${item.status === 'Completed' ? 'success' : item.status === 'Pending' ? 'warning' : 'danger'}`}>
                          {item.status}
                        </span>
                      </td>
                      <td className="text-muted">{item.date}</td>
                      <td>{item.warehouse}</td>
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
        </div>
      </div>

      {/* Add Return Modal */}
      <div className="modal fade" id="addReturnModal" tabIndex="-1" aria-labelledby="addReturnModalLabel" aria-hidden="true">
        <div className="modal-dialog modal-dialog-centered">
          <div className="modal-content">
            <div className="modal-header">
              <h6 className="modal-title" id="addReturnModalLabel">{editingId ? 'Edit Purchase Return' : 'Add Purchase Return'}</h6>
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
                  <label className="form-label">Return Items (e.g., 5 Items) <span className="text-danger">*</span></label>
                  <input type="text" className="form-control" placeholder="e.g., 5 Items" value={modalItems} onChange={e => setModalItems(e.target.value)} required />
                </div>
                <div className="mb-3">
                  <label className="form-label">Return Amount ($) <span className="text-danger">*</span></label>
                  <input type="text" className="form-control" placeholder="0.00" value={modalAmount} onChange={e => setModalAmount(e.target.value)} required />
                </div>
                <div className="mb-3">
                  <label className="form-label">Warehouse</label>
                  <select className="form-select" value={modalWarehouse} onChange={e => setModalWarehouse(e.target.value)}>
                    {warehousesList.map(w => (
                      <option key={w} value={w}>{w}</option>
                    ))}
                  </select>
                </div>
                <div className="mb-3">
                  <label className="form-label">Status</label>
                  <select className="form-select" value={modalStatus} onChange={e => setModalStatus(e.target.value)}>
                    <option value="Pending">Pending</option>
                    <option value="Completed">Completed</option>
                    <option value="Rejected">Rejected</option>
                  </select>
                </div>
                <div className="d-flex gap-2 mt-7">
                  <button type="button" className="btn btn-light w-100" data-bs-dismiss="modal">Close</button>
                  <button type="submit" className="btn btn-primary w-100">{editingId ? 'Save Changes' : 'Submit Return'}</button>
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
            <h5 className="mb-4 lh-base">Are you sure you want to delete this Return record?</h5>
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
