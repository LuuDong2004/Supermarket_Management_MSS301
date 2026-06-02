// pages/Dashboard/Inventory/StockAdjustmentPage.jsx
import React, { useEffect, useState } from 'react';
import PageBreadcrumb from '../../../components/ui/PageBreadcrumb';
import { ROUTES } from '../../../configs/routes';

const initialAdjustments = [
  { id: 1, adjustmentId: '#ADJ5001', date: '28-05-2026', warehouse: 'Main Warehouse', product: 'Apple iPhone 15', sku: 'APL-IP15-128', qty: 5, type: 'Addition', reason: 'Damaged item replacement' },
  { id: 2, adjustmentId: '#ADJ5002', date: '29-05-2026', warehouse: 'Branch Warehouse', product: 'Nike Air Max 270', sku: 'NKE-AM270-01', qty: 2, type: 'Subtraction', reason: 'Inventory discrepancy' }
];

const warehousesList = ['Main Warehouse', 'Branch Warehouse', 'Sub Warehouse'];

export default function StockAdjustmentPage() {
  const [adjustments, setAdjustments] = useState(initialAdjustments);
  const [search, setSearch] = useState('');
  const [typeFilter, setTypeFilter] = useState('all');

  // Modal State
  const [modalWarehouse, setModalWarehouse] = useState(warehousesList[0]);
  const [modalProduct, setModalProduct] = useState('');
  const [modalSku, setModalSku] = useState('');
  const [modalQty, setModalQty] = useState('');
  const [modalType, setModalType] = useState('Addition');
  const [modalReason, setModalReason] = useState('');
  
  const [editingId, setEditingId] = useState(null);
  const [deletingId, setDeletingId] = useState(null);

  useEffect(() => {
    if (window.lucide) {
      window.lucide.createIcons();
    }
  }, [adjustments]);

  const handleDelete = () => {
    setAdjustments(prev => prev.filter(a => a.id !== deletingId));
    const modalElement = document.getElementById('deleteModal');
    const modalInstance = window.bootstrap?.Modal?.getInstance(modalElement);
    modalInstance?.hide();
    setDeletingId(null);
  };

  const handleFormSubmit = (e) => {
    e.preventDefault();
    if (editingId) {
      setAdjustments(prev => prev.map(a => a.id === editingId ? {
        ...a,
        warehouse: modalWarehouse,
        product: modalProduct,
        sku: modalSku,
        qty: parseInt(modalQty) || 0,
        type: modalType,
        reason: modalReason,
      } : a));
    } else {
      const newAdj = {
        id: adjustments.length > 0 ? Math.max(...adjustments.map(a => a.id)) + 1 : 1,
        adjustmentId: `#ADJ${5000 + adjustments.length + 1}`,
        date: new Date().toLocaleDateString('en-GB').replace(/\//g, '-'),
        warehouse: modalWarehouse,
        product: modalProduct,
        sku: modalSku,
        qty: parseInt(modalQty) || 0,
        type: modalType,
        reason: modalReason,
      };
      setAdjustments(prev => [...prev, newAdj]);
    }

    resetForm();

    const modalElement = document.getElementById('addAdjustmentModal');
    const modalInstance = window.bootstrap?.Modal?.getInstance(modalElement);
    modalInstance?.hide();
  };

  const resetForm = () => {
    setModalWarehouse(warehousesList[0]);
    setModalProduct('');
    setModalSku('');
    setModalQty('');
    setModalType('Addition');
    setModalReason('');
    setEditingId(null);
  };

  const openEditModal = (item) => {
    setEditingId(item.id);
    setModalWarehouse(item.warehouse);
    setModalProduct(item.product);
    setModalSku(item.sku);
    setModalQty(item.qty.toString());
    setModalType(item.type);
    setModalReason(item.reason);

    const modalElement = document.getElementById('addAdjustmentModal');
    const modalInstance = new window.bootstrap.Modal(modalElement);
    modalInstance.show();
  };

  const openAddModal = () => {
    resetForm();
    const modalElement = document.getElementById('addAdjustmentModal');
    const modalInstance = new window.bootstrap.Modal(modalElement);
    modalInstance.show();
  };

  const filteredAdjustments = adjustments.filter(a => {
    const matchesSearch = a.product.toLowerCase().includes(search.toLowerCase()) || 
                          a.sku.toLowerCase().includes(search.toLowerCase()) ||
                          a.adjustmentId.toLowerCase().includes(search.toLowerCase());
    const matchesType = typeFilter === 'all' || a.type.toLowerCase() === typeFilter.toLowerCase();
    return matchesSearch && matchesType;
  });

  return (
    <div className="container-fluid">
      <PageBreadcrumb title="Stock Adjustment" breadcrumbs={[{ label: 'Dashboard', href: ROUTES.DASHBOARD }, { label: 'Inventory' }, { label: 'Stock Adjustment' }]} />

      <div className="card">
        <div className="card-header d-flex flex-wrap gap-3 justify-content-between align-items-center">
          <h5 className="card-title mb-0">Stock Adjustments</h5>
          <div className="d-flex flex-wrap gap-2 align-items-center ms-auto">
            <div className="position-relative">
              <input type="text" className="form-control ps-9" placeholder="Search Adjustment..." value={search} onChange={e => setSearch(e.target.value)} />
              <i data-lucide="search" className="size-4 icon-dark position-absolute top-50 start-0 ms-3 translate-middle-y"></i>
            </div>
            <select className="form-select w-36" value={typeFilter} onChange={e => setTypeFilter(e.target.value)}>
              <option value="all">All Types</option>
              <option value="addition">Addition</option>
              <option value="subtraction">Subtraction</option>
            </select>
            <button className="btn btn-primary d-flex align-items-center gap-1" onClick={openAddModal}>
              <i className="ri-add-line fs-lg"></i> Add Adjustment
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
                  <th className="fw-medium text-muted">Adjustment ID</th>
                  <th className="fw-medium text-muted">Date</th>
                  <th className="fw-medium text-muted">Warehouse</th>
                  <th className="fw-medium text-muted">Product</th>
                  <th className="fw-medium text-muted">SKU</th>
                  <th className="fw-medium text-muted">Qty</th>
                  <th className="fw-medium text-muted">Type</th>
                  <th className="fw-medium text-muted">Reason</th>
                  <th className="fw-medium text-muted">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredAdjustments.length === 0 ? (
                  <tr>
                    <td colSpan="10" className="text-center text-muted py-4">No records found.</td>
                  </tr>
                ) : (
                  filteredAdjustments.map(item => (
                    <tr key={item.id}>
                      <td>
                        <div className="form-check check-primary">
                          <input className="form-check-input" type="checkbox" id={`check_${item.id}`} />
                        </div>
                      </td>
                      <td><span className="fw-semibold text-primary">{item.adjustmentId}</span></td>
                      <td className="text-muted">{item.date}</td>
                      <td>{item.warehouse}</td>
                      <td>{item.product}</td>
                      <td><span className="fw-semibold text-primary">{item.sku}</span></td>
                      <td>{item.qty}</td>
                      <td>
                        <span className={`badge bg-${item.type === 'Addition' ? 'success' : 'danger'}-subtle text-${item.type === 'Addition' ? 'success' : 'danger'}`}>
                          {item.type}
                        </span>
                      </td>
                      <td className="text-wrap" style={{ maxWidth: '200px' }}>{item.reason}</td>
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
                Showing <b className="me-1">1-{filteredAdjustments.length}</b> of <b className="ms-1">{filteredAdjustments.length}</b> Results
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Add/Edit Adjustment Modal */}
      <div className="modal fade" id="addAdjustmentModal" tabIndex="-1" aria-labelledby="addAdjustmentModalLabel" aria-hidden="true">
        <div className="modal-dialog modal-dialog-centered">
          <div className="modal-content">
            <div className="modal-header">
              <h6 className="modal-title" id="addAdjustmentModalLabel">{editingId ? 'Edit Stock Adjustment' : 'Add Stock Adjustment'}</h6>
              <button type="button" className="btn-close" data-bs-dismiss="modal"></button>
            </div>
            <div className="modal-body">
              <form onSubmit={handleFormSubmit}>
                <div className="mb-3">
                  <label className="form-label">Warehouse <span className="text-danger">*</span></label>
                  <select className="form-select" value={modalWarehouse} onChange={e => setModalWarehouse(e.target.value)}>
                    {warehousesList.map(w => (
                      <option key={w} value={w}>{w}</option>
                    ))}
                  </select>
                </div>
                <div className="mb-3">
                  <label className="form-label">Product Name <span className="text-danger">*</span></label>
                  <input type="text" className="form-control" placeholder="e.g., Apple iPhone 15" value={modalProduct} onChange={e => setModalProduct(e.target.value)} required />
                </div>
                <div className="mb-3">
                  <label className="form-label">SKU <span className="text-danger">*</span></label>
                  <input type="text" className="form-control" placeholder="e.g., APL-IP15-128" value={modalSku} onChange={e => setModalSku(e.target.value)} required />
                </div>
                <div className="mb-3">
                  <label className="form-label">Quantity <span className="text-danger">*</span></label>
                  <input type="number" className="form-control" placeholder="0" min="1" value={modalQty} onChange={e => setModalQty(e.target.value)} required />
                </div>
                <div className="mb-3">
                  <label className="form-label">Adjustment Type</label>
                  <select className="form-select" value={modalType} onChange={e => setModalType(e.target.value)}>
                    <option value="Addition">Addition (+)</option>
                    <option value="Subtraction">Subtraction (-)</option>
                  </select>
                </div>
                <div className="mb-3">
                  <label className="form-label">Reason <span className="text-danger">*</span></label>
                  <textarea className="form-control" placeholder="Describe the adjustment reason..." rows="3" value={modalReason} onChange={e => setModalReason(e.target.value)} required></textarea>
                </div>
                <div className="d-flex gap-2 mt-7">
                  <button type="button" className="btn btn-light w-100" data-bs-dismiss="modal">Close</button>
                  <button type="submit" className="btn btn-primary w-100">{editingId ? 'Save Changes' : 'Submit Adjustment'}</button>
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
            <h5 className="mb-4 lh-base">Are you sure you want to delete this Adjustment?</h5>
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
