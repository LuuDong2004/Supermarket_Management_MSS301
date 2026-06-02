// pages/Dashboard/Inventory/BatchManagementPage.jsx
import React, { useEffect, useState } from 'react';
import PageBreadcrumb from '../../../components/ui/PageBreadcrumb';
import { ROUTES } from '../../../configs/routes';

const initialBatches = [
  { id: 1, batchId: 'BT-90231', product: 'Apple iPhone 15 Pro', sku: 'APL-IP15P-256', warehouse: 'Main Warehouse', supplier: 'Apple Inc.', mfg: '2025-10-10', expiry: '2027-10-10', qty: 150, status: 'Active' },
  { id: 2, batchId: 'BT-45892', product: 'Nike Air Max 270', sku: 'NKE-AM270-01', warehouse: 'Branch Warehouse', supplier: 'Nike Ltd.', mfg: '2024-05-15', expiry: '2026-05-15', qty: 85, status: 'Near Expiry' },
  { id: 3, batchId: 'BT-32104', product: 'Samsung Galaxy Buds 2', sku: 'SAM-BUDS2-W', warehouse: 'Sub Warehouse', supplier: 'Samsung Electronics', mfg: '2023-01-20', expiry: '2025-01-20', qty: 40, status: 'Expired' },
  { id: 4, batchId: 'BT-77401', product: 'Logitech MX Master 3S', sku: 'LOG-MX3S-B', warehouse: 'Main Warehouse', supplier: 'Logitech Supply', mfg: '2025-02-18', expiry: '2028-02-18', qty: 200, status: 'Active' },
  { id: 5, batchId: 'BT-10293', product: 'Dell UltraSharp 27"', sku: 'DEL-U2723QE', warehouse: 'Branch Warehouse', supplier: 'Dell Vietnam', mfg: '2024-11-05', expiry: '2026-11-05', qty: 30, status: 'Active' }
];

const warehousesList = ['Main Warehouse', 'Branch Warehouse', 'Sub Warehouse'];
const suppliersList = ['Apple Inc.', 'Nike Ltd.', 'Samsung Electronics', 'Logitech Supply', 'Dell Vietnam'];

export default function BatchManagementPage() {
  const [batches, setBatches] = useState(initialBatches);
  const [search, setSearch] = useState('');
  const [warehouseFilter, setWarehouseFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');

  // Form State for new Batch
  const [showAddModal, setShowAddModal] = useState(false);
  const [newBatch, setNewBatch] = useState({
    batchId: '',
    product: '',
    sku: '',
    warehouse: 'Main Warehouse',
    supplier: 'Apple Inc.',
    mfg: '',
    expiry: '',
    qty: '',
    status: 'Active'
  });

  useEffect(() => {
    if (window.lucide) {
      window.lucide.createIcons();
    }
  }, [batches, showAddModal]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewBatch(prev => ({ ...prev, [name]: value }));
  };

  const handleAddBatch = (e) => {
    e.preventDefault();
    if (!newBatch.batchId || !newBatch.product || !newBatch.sku || !newBatch.qty || !newBatch.mfg || !newBatch.expiry) {
      alert('Please fill in all fields.');
      return;
    }

    const newRecord = {
      id: Date.now(),
      ...newBatch,
      qty: parseInt(newBatch.qty) || 0
    };

    setBatches([newRecord, ...batches]);
    setShowAddModal(false);
    // Reset form
    setNewBatch({
      batchId: '',
      product: '',
      sku: '',
      warehouse: 'Main Warehouse',
      supplier: 'Apple Inc.',
      mfg: '',
      expiry: '',
      qty: '',
      status: 'Active'
    });
  };

  const handleDelete = (id) => {
    if (confirm('Are you sure you want to delete this batch?')) {
      setBatches(prev => prev.filter(b => b.id !== id));
    }
  };

  const filteredBatches = batches.filter(b => {
    const matchesSearch = b.product.toLowerCase().includes(search.toLowerCase()) || 
                          b.batchId.toLowerCase().includes(search.toLowerCase()) || 
                          b.sku.toLowerCase().includes(search.toLowerCase());
    const matchesWarehouse = warehouseFilter === 'all' || b.warehouse === warehouseFilter;
    const matchesStatus = statusFilter === 'all' || b.status.toLowerCase() === statusFilter.toLowerCase();
    return matchesSearch && matchesWarehouse && matchesStatus;
  });

  return (
    <div className="container-fluid">
      <PageBreadcrumb title="Batch Management" breadcrumbs={[{ label: 'Dashboard', href: ROUTES.DASHBOARD }, { label: 'Inventory' }, { label: 'Batch' }]} />

      <div className="card">
        <div className="card-header d-flex flex-wrap gap-3 justify-content-between align-items-center">
          <h5 className="card-title mb-0">Inventory Batches</h5>
          <div className="d-flex flex-wrap gap-2 align-items-center ms-auto">
            <div className="position-relative">
              <input type="text" className="form-control ps-9" placeholder="Search Product, Batch ID..." value={search} onChange={e => setSearch(e.target.value)} />
              <i data-lucide="search" className="size-4 icon-dark position-absolute top-50 start-0 ms-3 translate-middle-y"></i>
            </div>
            <select className="form-select w-36" value={warehouseFilter} onChange={e => setWarehouseFilter(e.target.value)}>
              <option value="all">All Warehouses</option>
              {warehousesList.map(w => (
                <option key={w} value={w}>{w}</option>
              ))}
            </select>
            <select className="form-select w-36" value={statusFilter} onChange={e => setStatusFilter(e.target.value)}>
              <option value="all">All Status</option>
              <option value="active">Active</option>
              <option value="near expiry">Near Expiry</option>
              <option value="expired">Expired</option>
            </select>
            <button type="button" className="btn btn-primary d-flex align-items-center gap-1" onClick={() => setShowAddModal(true)}>
              <i className="ri-add-line"></i> Add Batch
            </button>
          </div>
        </div>
        <div className="card-body pt-0">
          <div className="table-card table-responsive">
            <table className="table align-middle text-nowrap mb-0">
              <thead>
                <tr className="bg-light border-bottom">
                  <th>Batch ID</th>
                  <th>Product</th>
                  <th>SKU</th>
                  <th>Warehouse</th>
                  <th>Supplier</th>
                  <th>MFG Date</th>
                  <th>Expiry Date</th>
                  <th>Quantity</th>
                  <th>Status</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {filteredBatches.length === 0 ? (
                  <tr>
                    <td colSpan="10" className="text-center text-muted py-4">No batch items found.</td>
                  </tr>
                ) : (
                  filteredBatches.map(item => (
                    <tr key={item.id}>
                      <td><span className="fw-semibold text-primary">{item.batchId}</span></td>
                      <td>
                        <div className="d-flex align-items-center gap-2">
                          <span className="fw-medium text-reset">{item.product}</span>
                        </div>
                      </td>
                      <td><span className="text-muted">{item.sku}</span></td>
                      <td>{item.warehouse}</td>
                      <td>{item.supplier}</td>
                      <td>{item.mfg}</td>
                      <td>{item.expiry}</td>
                      <td className="fw-semibold">{item.qty}</td>
                      <td>
                        <span className={`badge bg-${
                          item.status === 'Active' ? 'success' :
                          item.status === 'Near Expiry' ? 'warning' : 'danger'
                        }-subtle text-${
                          item.status === 'Active' ? 'success' :
                          item.status === 'Near Expiry' ? 'warning' : 'danger'
                        }`}>
                          {item.status}
                        </span>
                      </td>
                      <td>
                        <div className="d-flex gap-2">
                          <button type="button" className="btn btn-sm btn-icon btn-light" onClick={() => alert(`Edit batch: ${item.batchId}`)}>
                            <i className="ri-pencil-line"></i>
                          </button>
                          <button type="button" className="btn btn-sm btn-icon btn-light-danger" onClick={() => handleDelete(item.id)}>
                            <i className="ri-delete-bin-line"></i>
                          </button>
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

      {/* Add Batch Modal */}
      {showAddModal && (
        <div className="modal fade show d-block" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Add New Batch</h5>
                <button type="button" className="btn-close" onClick={() => setShowAddModal(false)}></button>
              </div>
              <form onSubmit={handleAddBatch}>
                <div className="modal-body">
                  <div className="row g-3">
                    <div className="col-md-6">
                      <label className="form-label">Batch ID <span className="text-danger">*</span></label>
                      <input type="text" className="form-control" name="batchId" placeholder="e.g. BT-88301" value={newBatch.batchId} onChange={handleInputChange} required />
                    </div>
                    <div className="col-md-6">
                      <label className="form-label">SKU <span className="text-danger">*</span></label>
                      <input type="text" className="form-control" name="sku" placeholder="e.g. APL-IP15P" value={newBatch.sku} onChange={handleInputChange} required />
                    </div>
                    <div className="col-12">
                      <label className="form-label">Product Name <span className="text-danger">*</span></label>
                      <input type="text" className="form-control" name="product" placeholder="e.g. Apple iPhone 15 Pro" value={newBatch.product} onChange={handleInputChange} required />
                    </div>
                    <div className="col-md-6">
                      <label className="form-label">Warehouse</label>
                      <select className="form-select" name="warehouse" value={newBatch.warehouse} onChange={handleInputChange}>
                        {warehousesList.map(w => <option key={w} value={w}>{w}</option>)}
                      </select>
                    </div>
                    <div className="col-md-6">
                      <label className="form-label">Supplier</label>
                      <select className="form-select" name="supplier" value={newBatch.supplier} onChange={handleInputChange}>
                        {suppliersList.map(s => <option key={s} value={s}>{s}</option>)}
                      </select>
                    </div>
                    <div className="col-md-6">
                      <label className="form-label">Mfg Date <span className="text-danger">*</span></label>
                      <input type="date" className="form-control" name="mfg" value={newBatch.mfg} onChange={handleInputChange} required />
                    </div>
                    <div className="col-md-6">
                      <label className="form-label">Expiry Date <span className="text-danger">*</span></label>
                      <input type="date" className="form-control" name="expiry" value={newBatch.expiry} onChange={handleInputChange} required />
                    </div>
                    <div className="col-md-6">
                      <label className="form-label">Quantity <span className="text-danger">*</span></label>
                      <input type="number" className="form-control" name="qty" placeholder="e.g. 100" value={newBatch.qty} onChange={handleInputChange} required />
                    </div>
                    <div className="col-md-6">
                      <label className="form-label">Status</label>
                      <select className="form-select" name="status" value={newBatch.status} onChange={handleInputChange}>
                        <option value="Active">Active</option>
                        <option value="Near Expiry">Near Expiry</option>
                        <option value="Expired">Expired</option>
                      </select>
                    </div>
                  </div>
                </div>
                <div className="modal-footer">
                  <button type="button" className="btn btn-light" onClick={() => setShowAddModal(false)}>Cancel</button>
                  <button type="submit" className="btn btn-primary">Save Batch</button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
