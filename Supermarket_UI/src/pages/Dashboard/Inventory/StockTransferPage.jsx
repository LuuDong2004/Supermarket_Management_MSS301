// pages/Dashboard/Inventory/StockTransferPage.jsx
import React, { useEffect, useState } from 'react';
import PageBreadcrumb from '../../../components/ui/PageBreadcrumb';
import { ROUTES } from '../../../configs/routes';

const initialTransfers = [
  { id: 1, transferId: '#TRF9081', date: '28-05-2026', fromWarehouse: 'Main Warehouse', toWarehouse: 'Branch Warehouse', totalItems: 15, status: 'Completed' },
  { id: 2, transferId: '#TRF9082', date: '29-05-2026', fromWarehouse: 'Branch Warehouse', toWarehouse: 'Sub Warehouse', totalItems: 8, status: 'In Transit' },
  { id: 3, transferId: '#TRF9083', date: '30-05-2026', fromWarehouse: 'Main Warehouse', toWarehouse: 'Sub Warehouse', totalItems: 25, status: 'Pending' }
];

const warehousesList = ['Main Warehouse', 'Branch Warehouse', 'Sub Warehouse'];

export default function StockTransferPage() {
  const [transfers, setTransfers] = useState(initialTransfers);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  // Modal State
  const [modalFrom, setModalFrom] = useState(warehousesList[0]);
  const [modalTo, setModalTo] = useState(warehousesList[1]);
  const [modalItems, setModalItems] = useState('');
  const [modalStatus, setModalStatus] = useState('Pending');
  const [editingId, setEditingId] = useState(null);
  const [deletingId, setDeletingId] = useState(null);

  useEffect(() => {
    if (window.lucide) {
      window.lucide.createIcons();
    }
  }, [transfers]);

  const handleDelete = () => {
    setTransfers(prev => prev.filter(t => t.id !== deletingId));
    const modalElement = document.getElementById('deleteModal');
    const modalInstance = window.bootstrap?.Modal?.getInstance(modalElement);
    modalInstance?.hide();
    setDeletingId(null);
  };

  const handleFormSubmit = (e) => {
    e.preventDefault();
    if (modalFrom === modalTo) {
      alert('Source and destination warehouses must be different!');
      return;
    }

    if (editingId) {
      setTransfers(prev => prev.map(t => t.id === editingId ? {
        ...t,
        fromWarehouse: modalFrom,
        toWarehouse: modalTo,
        totalItems: parseInt(modalItems) || 0,
        status: modalStatus,
      } : t));
    } else {
      const newTransfer = {
        id: transfers.length > 0 ? Math.max(...transfers.map(t => t.id)) + 1 : 1,
        transferId: `#TRF${9080 + transfers.length + 1}`,
        date: new Date().toLocaleDateString('en-GB').replace(/\//g, '-'),
        fromWarehouse: modalFrom,
        toWarehouse: modalTo,
        totalItems: parseInt(modalItems) || 0,
        status: modalStatus,
      };
      setTransfers(prev => [...prev, newTransfer]);
    }

    resetForm();

    const modalElement = document.getElementById('addTransferModal');
    const modalInstance = window.bootstrap?.Modal?.getInstance(modalElement);
    modalInstance?.hide();
  };

  const resetForm = () => {
    setModalFrom(warehousesList[0]);
    setModalTo(warehousesList[1]);
    setModalItems('');
    setModalStatus('Pending');
    setEditingId(null);
  };

  const openEditModal = (item) => {
    setEditingId(item.id);
    setModalFrom(item.fromWarehouse);
    setModalTo(item.toWarehouse);
    setModalItems(item.totalItems.toString());
    setModalStatus(item.status);

    const modalElement = document.getElementById('addTransferModal');
    const modalInstance = new window.bootstrap.Modal(modalElement);
    modalInstance.show();
  };

  const openAddModal = () => {
    resetForm();
    const modalElement = document.getElementById('addTransferModal');
    const modalInstance = new window.bootstrap.Modal(modalElement);
    modalInstance.show();
  };

  const filteredTransfers = transfers.filter(t => {
    const matchesSearch = t.transferId.toLowerCase().includes(search.toLowerCase()) || 
                          t.fromWarehouse.toLowerCase().includes(search.toLowerCase()) ||
                          t.toWarehouse.toLowerCase().includes(search.toLowerCase());
    const matchesStatus = statusFilter === 'all' || t.status.toLowerCase() === statusFilter.toLowerCase();
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="container-fluid">
      <PageBreadcrumb title="Stock Transfer" breadcrumbs={[{ label: 'Dashboard', href: ROUTES.DASHBOARD }, { label: 'Inventory' }, { label: 'Stock Transfer' }]} />

      <div className="card">
        <div className="card-header d-flex flex-wrap gap-3 justify-content-between align-items-center">
          <h5 className="card-title mb-0">Stock Transfers</h5>
          <div className="d-flex flex-wrap gap-2 align-items-center ms-auto">
            <div className="position-relative">
              <input type="text" className="form-control ps-9" placeholder="Search Transfer..." value={search} onChange={e => setSearch(e.target.value)} />
              <i data-lucide="search" className="size-4 icon-dark position-absolute top-50 start-0 ms-3 translate-middle-y"></i>
            </div>
            <select className="form-select w-36" value={statusFilter} onChange={e => setStatusFilter(e.target.value)}>
              <option value="all">All Status</option>
              <option value="pending">Pending</option>
              <option value="in transit">In Transit</option>
              <option value="completed">Completed</option>
            </select>
            <button className="btn btn-primary d-flex align-items-center gap-1" onClick={openAddModal}>
              <i className="ri-add-line fs-lg"></i> Add Transfer
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
                  <th className="fw-medium text-muted">Transfer ID</th>
                  <th className="fw-medium text-muted">Date</th>
                  <th className="fw-medium text-muted">From Warehouse</th>
                  <th className="fw-medium text-muted">To Warehouse</th>
                  <th className="fw-medium text-muted">Total Items</th>
                  <th className="fw-medium text-muted">Status</th>
                  <th className="fw-medium text-muted">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredTransfers.length === 0 ? (
                  <tr>
                    <td colSpan="8" className="text-center text-muted py-4">No records found.</td>
                  </tr>
                ) : (
                  filteredTransfers.map(item => (
                    <tr key={item.id}>
                      <td>
                        <div className="form-check check-primary">
                          <input className="form-check-input" type="checkbox" id={`check_${item.id}`} />
                        </div>
                      </td>
                      <td><span className="fw-semibold text-primary">{item.transferId}</span></td>
                      <td className="text-muted">{item.date}</td>
                      <td>{item.fromWarehouse}</td>
                      <td>{item.toWarehouse}</td>
                      <td>{item.totalItems}</td>
                      <td>
                        <span className={`badge bg-${item.status === 'Completed' ? 'success' : item.status === 'In Transit' ? 'warning' : 'secondary'}-subtle text-${item.status === 'Completed' ? 'success' : item.status === 'In Transit' ? 'warning' : 'secondary'}`}>
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
                  ))
                )}
              </tbody>
            </table>
          </div>
          <div className="row align-items-center g-3 mt-2">
            <div className="col-md-6">
              <p className="text-muted text-center text-md-start mb-0">
                Showing <b className="me-1">1-{filteredTransfers.length}</b> of <b className="ms-1">{filteredTransfers.length}</b> Results
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Add/Edit Transfer Modal */}
      <div className="modal fade" id="addTransferModal" tabIndex="-1" aria-labelledby="addTransferModalLabel" aria-hidden="true">
        <div className="modal-dialog modal-dialog-centered">
          <div className="modal-content">
            <div className="modal-header">
              <h6 className="modal-title" id="addTransferModalLabel">{editingId ? 'Edit Stock Transfer' : 'Add Stock Transfer'}</h6>
              <button type="button" className="btn-close" data-bs-dismiss="modal"></button>
            </div>
            <div className="modal-body">
              <form onSubmit={handleFormSubmit}>
                <div className="mb-3">
                  <label className="form-label">From Warehouse <span className="text-danger">*</span></label>
                  <select className="form-select" value={modalFrom} onChange={e => setModalFrom(e.target.value)}>
                    {warehousesList.map(w => (
                      <option key={w} value={w}>{w}</option>
                    ))}
                  </select>
                </div>
                <div className="mb-3">
                  <label className="form-label">To Warehouse <span className="text-danger">*</span></label>
                  <select className="form-select" value={modalTo} onChange={e => setModalTo(e.target.value)}>
                    {warehousesList.map(w => (
                      <option key={w} value={w}>{w}</option>
                    ))}
                  </select>
                </div>
                <div className="mb-3">
                  <label className="form-label">Total Items <span className="text-danger">*</span></label>
                  <input type="number" className="form-control" placeholder="0" min="1" value={modalItems} onChange={e => setModalItems(e.target.value)} required />
                </div>
                <div className="mb-3">
                  <label className="form-label">Status</label>
                  <select className="form-select" value={modalStatus} onChange={e => setModalStatus(e.target.value)}>
                    <option value="Pending">Pending</option>
                    <option value="In Transit">In Transit</option>
                    <option value="Completed">Completed</option>
                  </select>
                </div>
                <div className="d-flex gap-2 mt-7">
                  <button type="button" className="btn btn-light w-100" data-bs-dismiss="modal">Close</button>
                  <button type="submit" className="btn btn-primary w-100">{editingId ? 'Save Changes' : 'Submit Transfer'}</button>
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
            <h5 className="mb-4 lh-base">Are you sure you want to delete this Transfer?</h5>
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
