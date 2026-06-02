// pages/Dashboard/Inventory/LostItemsPage.jsx
import React, { useEffect, useState } from 'react';
import PageBreadcrumb from '../../../components/ui/PageBreadcrumb';
import { ROUTES } from '../../../configs/routes';

const initialLostItems = [
  { id: 1, date: '2026-05-15', product: 'Apple iPhone 15 Pro', sku: 'APL-IP15P-256', category: 'Electronics', warehouse: 'Main Warehouse', qty: 2, unitPrice: 999, totalValue: 1998, lossType: 'Damaged', reason: 'Dropped during unloading' },
  { id: 2, date: '2026-05-18', product: 'Nike Air Max 270', sku: 'NKE-AM270-01', category: 'Footwear', warehouse: 'Branch Warehouse', qty: 5, unitPrice: 150, totalValue: 750, lossType: 'Stolen', reason: 'Shoplifting event' },
  { id: 3, date: '2026-05-20', product: 'Samsung Galaxy Buds 2', sku: 'SAM-BUDS2-W', category: 'Electronics', warehouse: 'Sub Warehouse', qty: 10, unitPrice: 120, totalValue: 1200, lossType: 'Expired', reason: 'Battery completely degraded in storage' },
  { id: 4, date: '2026-05-22', product: 'Logitech MX Master 3S', sku: 'LOG-MX3S-B', category: 'Accessories', warehouse: 'Main Warehouse', qty: 3, unitPrice: 99, totalValue: 297, lossType: 'Lost', reason: 'Discrepancy found during cycle count' }
];

const warehousesList = ['Main Warehouse', 'Branch Warehouse', 'Sub Warehouse'];
const lossTypes = ['Damaged', 'Lost', 'Stolen', 'Expired'];
const categories = ['Electronics', 'Footwear', 'Accessories', 'Apparel'];

export default function LostItemsPage() {
  const [lostItems, setLostItems] = useState(initialLostItems);
  const [search, setSearch] = useState('');
  const [warehouseFilter, setWarehouseFilter] = useState('all');
  const [typeFilter, setTypeFilter] = useState('all');

  // Form State for new Lost Item
  const [showAddModal, setShowAddModal] = useState(false);
  const [newItem, setNewItem] = useState({
    date: new Date().toISOString().split('T')[0],
    product: '',
    sku: '',
    category: 'Electronics',
    warehouse: 'Main Warehouse',
    qty: '',
    unitPrice: '',
    lossType: 'Damaged',
    reason: ''
  });

  useEffect(() => {
    if (window.lucide) {
      window.lucide.createIcons();
    }
  }, [lostItems, showAddModal]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewItem(prev => ({ ...prev, [name]: value }));
  };

  const handleAddLostItem = (e) => {
    e.preventDefault();
    if (!newItem.product || !newItem.sku || !newItem.qty || !newItem.unitPrice || !newItem.reason) {
      alert('Please fill in all fields.');
      return;
    }

    const qtyVal = parseInt(newItem.qty) || 0;
    const priceVal = parseFloat(newItem.unitPrice) || 0;

    const newRecord = {
      id: Date.now(),
      ...newItem,
      qty: qtyVal,
      unitPrice: priceVal,
      totalValue: qtyVal * priceVal
    };

    setLostItems([newRecord, ...lostItems]);
    setShowAddModal(false);
    // Reset form
    setNewItem({
      date: new Date().toISOString().split('T')[0],
      product: '',
      sku: '',
      category: 'Electronics',
      warehouse: 'Main Warehouse',
      qty: '',
      unitPrice: '',
      lossType: 'Damaged',
      reason: ''
    });
  };

  const handleDelete = (id) => {
    if (confirm('Are you sure you want to delete this record?')) {
      setLostItems(prev => prev.filter(item => item.id !== id));
    }
  };

  const filteredItems = lostItems.filter(item => {
    const matchesSearch = item.product.toLowerCase().includes(search.toLowerCase()) || 
                          item.sku.toLowerCase().includes(search.toLowerCase()) || 
                          item.reason.toLowerCase().includes(search.toLowerCase());
    const matchesWarehouse = warehouseFilter === 'all' || item.warehouse === warehouseFilter;
    const matchesType = typeFilter === 'all' || item.lossType.toLowerCase() === typeFilter.toLowerCase();
    return matchesSearch && matchesWarehouse && matchesType;
  });

  return (
    <div className="container-fluid">
      <PageBreadcrumb title="Lost Items" breadcrumbs={[{ label: 'Dashboard', href: ROUTES.DASHBOARD }, { label: 'Inventory' }, { label: 'Lost Items' }]} />

      <div className="card">
        <div className="card-header d-flex flex-wrap gap-3 justify-content-between align-items-center">
          <h5 className="card-title mb-0">Hàng Thất Thoát / Hư Hỏng</h5>
          <div className="d-flex flex-wrap gap-2 align-items-center ms-auto">
            <div className="position-relative">
              <input type="text" className="form-control ps-9" placeholder="Search Product, SKU, Reason..." value={search} onChange={e => setSearch(e.target.value)} />
              <i data-lucide="search" className="size-4 icon-dark position-absolute top-50 start-0 ms-3 translate-middle-y"></i>
            </div>
            <select className="form-select w-36" value={warehouseFilter} onChange={e => setWarehouseFilter(e.target.value)}>
              <option value="all">All Warehouses</option>
              {warehousesList.map(w => (
                <option key={w} value={w}>{w}</option>
              ))}
            </select>
            <select className="form-select w-36" value={typeFilter} onChange={e => setTypeFilter(e.target.value)}>
              <option value="all">All Loss Types</option>
              {lossTypes.map(t => (
                <option key={t} value={t}>{t}</option>
              ))}
            </select>
            <button type="button" className="btn btn-primary d-flex align-items-center gap-1" onClick={() => setShowAddModal(true)}>
              <i className="ri-add-line"></i> Add Lost Item
            </button>
          </div>
        </div>
        <div className="card-body pt-0">
          <div className="table-card table-responsive">
            <table className="table align-middle text-nowrap mb-0">
              <thead>
                <tr className="bg-light border-bottom">
                  <th>Date</th>
                  <th>Product Name</th>
                  <th>SKU</th>
                  <th>Category</th>
                  <th>Warehouse</th>
                  <th>Quantity</th>
                  <th>Unit Price</th>
                  <th>Total Value</th>
                  <th>Loss Type</th>
                  <th>Reason</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {filteredItems.length === 0 ? (
                  <tr>
                    <td colSpan="11" className="text-center text-muted py-4">No lost items recorded.</td>
                  </tr>
                ) : (
                  filteredItems.map(item => (
                    <tr key={item.id}>
                      <td>{item.date}</td>
                      <td><span className="fw-semibold text-reset">{item.product}</span></td>
                      <td><span className="fw-semibold text-primary">{item.sku}</span></td>
                      <td>{item.category}</td>
                      <td>{item.warehouse}</td>
                      <td className="fw-semibold text-danger">{item.qty}</td>
                      <td>${item.unitPrice.toFixed(2)}</td>
                      <td className="fw-semibold text-dark">${item.totalValue.toFixed(2)}</td>
                      <td>
                        <span className={`badge bg-${
                          item.lossType === 'Damaged' ? 'warning' :
                          item.lossType === 'Stolen' ? 'danger' :
                          item.lossType === 'Expired' ? 'secondary' : 'info'
                        }-subtle text-${
                          item.lossType === 'Damaged' ? 'warning' :
                          item.lossType === 'Stolen' ? 'danger' :
                          item.lossType === 'Expired' ? 'secondary' : 'info'
                        }`}>
                          {item.lossType}
                        </span>
                      </td>
                      <td className="text-wrap" style={{ maxWidth: '200px' }}>{item.reason}</td>
                      <td>
                        <div className="d-flex gap-2">
                          <button type="button" className="btn btn-sm btn-icon btn-light" onClick={() => alert(`Edit item: ${item.product}`)}>
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

      {/* Add Lost Item Modal */}
      {showAddModal && (
        <div className="modal fade show d-block" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Record Lost Item</h5>
                <button type="button" className="btn-close" onClick={() => setShowAddModal(false)}></button>
              </div>
              <form onSubmit={handleAddLostItem}>
                <div className="modal-body">
                  <div className="row g-3">
                    <div className="col-md-6">
                      <label className="form-label">Date <span className="text-danger">*</span></label>
                      <input type="date" className="form-control" name="date" value={newItem.date} onChange={handleInputChange} required />
                    </div>
                    <div className="col-md-6">
                      <label className="form-label">SKU <span className="text-danger">*</span></label>
                      <input type="text" className="form-control" name="sku" placeholder="e.g. APL-IP15P" value={newItem.sku} onChange={handleInputChange} required />
                    </div>
                    <div className="col-12">
                      <label className="form-label">Product Name <span className="text-danger">*</span></label>
                      <input type="text" className="form-control" name="product" placeholder="e.g. Apple iPhone 15 Pro" value={newItem.product} onChange={handleInputChange} required />
                    </div>
                    <div className="col-md-6">
                      <label className="form-label">Category</label>
                      <select className="form-select" name="category" value={newItem.category} onChange={handleInputChange}>
                        {categories.map(c => <option key={c} value={c}>{c}</option>)}
                      </select>
                    </div>
                    <div className="col-md-6">
                      <label className="form-label">Warehouse</label>
                      <select className="form-select" name="warehouse" value={newItem.warehouse} onChange={handleInputChange}>
                        {warehousesList.map(w => <option key={w} value={w}>{w}</option>)}
                      </select>
                    </div>
                    <div className="col-md-6">
                      <label className="form-label">Quantity <span className="text-danger">*</span></label>
                      <input type="number" className="form-control" name="qty" placeholder="e.g. 5" value={newItem.qty} onChange={handleInputChange} required />
                    </div>
                    <div className="col-md-6">
                      <label className="form-label">Unit Price ($) <span className="text-danger">*</span></label>
                      <input type="number" step="0.01" className="form-control" name="unitPrice" placeholder="e.g. 999.00" value={newItem.unitPrice} onChange={handleInputChange} required />
                    </div>
                    <div className="col-md-12">
                      <label className="form-label">Loss Type</label>
                      <select className="form-select" name="lossType" value={newItem.lossType} onChange={handleInputChange}>
                        {lossTypes.map(t => <option key={t} value={t}>{t}</option>)}
                      </select>
                    </div>
                    <div className="col-12">
                      <label className="form-label">Reason / Notes <span className="text-danger">*</span></label>
                      <textarea className="form-control" name="reason" rows="3" placeholder="Explain how it was damaged or lost..." value={newItem.reason} onChange={handleInputChange} required></textarea>
                    </div>
                  </div>
                </div>
                <div className="modal-footer">
                  <button type="button" className="btn btn-light" onClick={() => setShowAddModal(false)}>Cancel</button>
                  <button type="submit" className="btn btn-primary">Save Record</button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
