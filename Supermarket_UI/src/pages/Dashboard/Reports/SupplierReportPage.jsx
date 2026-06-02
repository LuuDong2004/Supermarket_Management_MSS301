// pages/Dashboard/Reports/SupplierReportPage.jsx
import React, { useEffect, useState } from 'react';
import PageBreadcrumb from '../../../components/ui/PageBreadcrumb';
import { ROUTES } from '../../../configs/routes';

const initialSuppliers = [
  { id: 1, supplierId: '#SUP-0001', name: 'Sunrise Wholesale', totalPurchase: 42380, totalPaid: 38000, totalItems: 25, paymentMethod: 'Cash', lastPurchase: '2025-12-12', avgOrderValue: 2118, status: 'Active', image: '/assets/user-6-BIO7_TUU.png' },
  { id: 2, supplierId: '#SUP-0002', name: 'Fresh Valley Traders', totalPurchase: 18920, totalPaid: 12500, totalItems: 14, paymentMethod: 'Bank', lastPurchase: '2025-12-01', avgOrderValue: 1351, status: 'Inactive', image: '/assets/user-7-BMyy-xCq.png' },
  { id: 3, supplierId: '#SUP-0003', name: 'Global Foods Ltd.', totalPurchase: 30500, totalPaid: 30500, totalItems: 18, paymentMethod: 'Online', lastPurchase: '2025-12-08', avgOrderValue: 1694, status: 'Active', image: '/assets/user-8-BAGm131G.png' },
  { id: 4, supplierId: '#SUP-0004', name: 'EcoMart Suppliers', totalPurchase: 25700, totalPaid: 21300, totalItems: 16, paymentMethod: 'Cheque', lastPurchase: '2025-12-05', avgOrderValue: 1606, status: 'Active', image: '/assets/user-9-DB-6OyMr.png' },
  { id: 5, supplierId: '#SUP-0005', name: 'FreshMart Co.', totalPurchase: 12800, totalPaid: 9200, totalItems: 11, paymentMethod: 'Cash', lastPurchase: '2025-11-29', avgOrderValue: 1163, status: 'Inactive', image: '/assets/user-10-CzpspsdB.png' }
];

const methods = ['Cash', 'Bank', 'Online', 'Cheque'];
const statuses = ['Active', 'Inactive'];

export default function SupplierReportPage() {
  const [suppliers, setSuppliers] = useState(initialSuppliers);
  const [search, setSearch] = useState('');
  const [minItems, setMinItems] = useState('');
  const [maxItems, setMaxItems] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [methodFilter, setMethodFilter] = useState('all');
  const [dateFilter, setDateFilter] = useState('');

  // Modal States
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedSupplier, setSelectedSupplier] = useState(null);

  // Form States
  const [formName, setFormName] = useState('');
  const [formSupplierId, setFormSupplierId] = useState('');
  const [formTotalPurchase, setFormTotalPurchase] = useState('');
  const [formTotalPaid, setFormTotalPaid] = useState('');
  const [formTotalItems, setFormTotalItems] = useState('');
  const [formMethod, setFormMethod] = useState(methods[0]);
  const [formDate, setFormDate] = useState('');
  const [formStatus, setFormStatus] = useState(statuses[0]);

  useEffect(() => {
    if (window.lucide) {
      window.lucide.createIcons();
    }
  }, [suppliers, showAddModal, showEditModal]);

  const handleOpenAdd = () => {
    setFormName('');
    setFormSupplierId(`#SUP-000${suppliers.length + 1}`);
    setFormTotalPurchase('');
    setFormTotalPaid('');
    setFormTotalItems('');
    setFormMethod(methods[0]);
    setFormDate(new Date().toISOString().split('T')[0]);
    setFormStatus(statuses[0]);
    setShowAddModal(true);
  };

  const handleAddSubmit = (e) => {
    e.preventDefault();
    const purchase = parseFloat(formTotalPurchase) || 0;
    const paid = parseFloat(formTotalPaid) || 0;
    const items = parseInt(formTotalItems) || 0;
    const avg = items > 0 ? Math.round(purchase / items) : 0;

    const newSupplier = {
      id: Date.now(),
      supplierId: formSupplierId,
      name: formName,
      totalPurchase: purchase,
      totalPaid: paid,
      totalItems: items,
      paymentMethod: formMethod,
      lastPurchase: formDate,
      avgOrderValue: avg,
      status: formStatus,
      image: '/assets/user-6-BIO7_TUU.png'
    };

    setSuppliers([newSupplier, ...suppliers]);
    setShowAddModal(false);
  };

  const handleOpenEdit = (sup) => {
    setSelectedSupplier(sup);
    setFormName(sup.name);
    setFormSupplierId(sup.supplierId);
    setFormTotalPurchase(sup.totalPurchase.toString());
    setFormTotalPaid(sup.totalPaid.toString());
    setFormTotalItems(sup.totalItems.toString());
    setFormMethod(sup.paymentMethod);
    setFormDate(sup.lastPurchase);
    setFormStatus(sup.status);
    setShowEditModal(true);
  };

  const handleEditSubmit = (e) => {
    e.preventDefault();
    const purchase = parseFloat(formTotalPurchase) || 0;
    const paid = parseFloat(formTotalPaid) || 0;
    const items = parseInt(formTotalItems) || 0;
    const avg = items > 0 ? Math.round(purchase / items) : 0;

    setSuppliers(prev => prev.map(item => item.id === selectedSupplier.id ? {
      ...item,
      supplierId: formSupplierId,
      name: formName,
      totalPurchase: purchase,
      totalPaid: paid,
      totalItems: items,
      paymentMethod: formMethod,
      lastPurchase: formDate,
      avgOrderValue: avg,
      status: formStatus
    } : item));
    setShowEditModal(false);
  };

  const handleDelete = (id) => {
    if (window.confirm('Are you sure you want to delete this supplier record?')) {
      setSuppliers(prev => prev.filter(item => item.id !== id));
      if (showEditModal && selectedSupplier?.id === id) {
        setShowEditModal(false);
      }
    }
  };

  const filteredSuppliers = suppliers.filter(item => {
    const matchesSearch = item.name.toLowerCase().includes(search.toLowerCase()) || 
                          item.supplierId.toLowerCase().includes(search.toLowerCase());
    
    const matchesStatus = statusFilter === 'all' || item.status === statusFilter;
    const matchesMethod = methodFilter === 'all' || item.paymentMethod === methodFilter;
    const matchesDate = !dateFilter || item.lastPurchase === dateFilter;

    let matchesMin = true;
    let matchesMax = true;
    if (minItems !== '') {
      matchesMin = item.totalItems >= parseInt(minItems);
    }
    if (maxItems !== '') {
      matchesMax = item.totalItems <= parseInt(maxItems);
    }

    return matchesSearch && matchesStatus && matchesMethod && matchesDate && matchesMin && matchesMax;
  });

  // Calculate Metrics from current state
  const totalPurchaseValue = suppliers.reduce((sum, s) => sum + s.totalPurchase, 0);
  const totalPaidValue = suppliers.reduce((sum, s) => sum + s.totalPaid, 0);
  const totalItemsCount = suppliers.reduce((sum, s) => sum + s.totalItems, 0);
  const activeCount = suppliers.filter(s => s.status === 'Active').length;
  const inactiveCount = suppliers.filter(s => s.status === 'Inactive').length;

  return (
    <div className="container-fluid">
      <PageBreadcrumb title="Supplier Report" breadcrumbs={[{ label: 'Dashboard', href: ROUTES.DASHBOARD }, { label: 'Reports' }, { label: 'Supplier' }]} />

      {/* Metrics Row */}
      <div className="row g-3 mb-4">
        <div className="col-xxl-2 col-md-4 col-sm-6">
          <div className="card">
            <div className="card-body d-flex align-items-center gap-5">
              <div className="avatar size-11 bg-primary text-white rounded-1">
                <i className="ri-shopping-cart-2-line fs-xl"></i>
              </div>
              <div>
                <h5 className="mb-1">{suppliers.length}</h5>
                <p className="text-muted mb-0">Total Suppliers</p>
              </div>
            </div>
          </div>
        </div>
        <div className="col-xxl-2 col-md-4 col-sm-6">
          <div className="card">
            <div className="card-body d-flex align-items-center gap-5">
              <div className="avatar size-11 bg-primary text-white rounded-1">
                <i className="ri-wallet-3-line fs-xl"></i>
              </div>
              <div>
                <h5 className="mb-1">${totalPurchaseValue.toLocaleString()}</h5>
                <p className="text-muted mb-0">Total Purchases</p>
              </div>
            </div>
          </div>
        </div>
        <div className="col-xxl-2 col-md-4 col-sm-6">
          <div className="card">
            <div className="card-body d-flex align-items-center gap-5">
              <div className="avatar size-11 bg-primary text-white rounded-1">
                <i className="ri-bank-line fs-xl"></i>
              </div>
              <div>
                <h5 className="mb-1">${totalPaidValue.toLocaleString()}</h5>
                <p className="text-muted mb-0">Total Paid</p>
              </div>
            </div>
          </div>
        </div>
        <div className="col-xxl-2 col-md-4 col-sm-6">
          <div className="card">
            <div className="card-body d-flex align-items-center gap-5">
              <div className="avatar size-11 bg-primary text-white rounded-1">
                <i className="ri-stack-line fs-xl"></i>
              </div>
              <div>
                <h5 className="mb-1">{totalItemsCount}</h5>
                <p className="text-muted mb-0">Total Items</p>
              </div>
            </div>
          </div>
        </div>
        <div className="col-xxl-2 col-md-4 col-sm-6">
          <div className="card">
            <div className="card-body d-flex align-items-center gap-5">
              <div className="avatar size-11 bg-primary text-white rounded-1">
                <i className="ri-user-line fs-xl"></i>
              </div>
              <div>
                <h5 className="mb-1">{activeCount}</h5>
                <p className="text-muted mb-0">Active Suppliers</p>
              </div>
            </div>
          </div>
        </div>
        <div className="col-xxl-2 col-md-4 col-sm-6">
          <div className="card">
            <div className="card-body d-flex align-items-center gap-5">
              <div className="avatar size-11 bg-primary text-white rounded-1">
                <i className="ri-user-3-line fs-xl"></i>
              </div>
              <div>
                <h5 className="mb-1">{inactiveCount}</h5>
                <p className="text-muted mb-0">Inactive Suppliers</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Table Card */}
      <div className="card">
        <div className="card-header d-flex flex-wrap justify-content-between gap-2 align-items-center mb-4">
          <div className="position-relative">
            <input type="text" className="form-control ps-10" placeholder="Search supplier/ID..." value={search} onChange={e => setSearch(e.target.value)} />
            <i data-lucide="search" className="size-4 icon-dark position-absolute top-50 start-0 ms-4 translate-middle-y"></i>
          </div>
          <div className="d-flex flex-wrap align-items-center gap-2">
            <input type="number" className="form-control w-24 form-control-sm" placeholder="Min Items" value={minItems} onChange={e => setMinItems(e.target.value)} />
            <span>-</span>
            <input type="number" className="form-control w-24 form-control-sm" placeholder="Max Items" value={maxItems} onChange={e => setMaxItems(e.target.value)} />
            <div className="position-relative flex-shrink-0 w-40">
              <input type="date" className="form-control" value={dateFilter} onChange={e => setDateFilter(e.target.value)} />
            </div>
            <select className="form-select w-36" value={statusFilter} onChange={e => setStatusFilter(e.target.value)}>
              <option value="all">Status</option>
              {statuses.map(s => <option key={s} value={s}>{s}</option>)}
            </select>
            <select className="form-select w-36" value={methodFilter} onChange={e => setMethodFilter(e.target.value)}>
              <option value="all">Payment</option>
              {methods.map(m => <option key={m} value={m}>{m}</option>)}
            </select>
            <button type="button" className="btn btn-primary" onClick={handleOpenAdd}>
              <i data-lucide="plus" className="size-4 me-1"></i>Add Supplier
            </button>
          </div>
        </div>

        <div className="card-body pt-0">
          <div className="table-card table-responsive">
            <table className="table text-nowrap align-middle mb-0">
              <thead>
                <tr className="bg-light border-bottom">
                  <th>Supplier ID</th>
                  <th>Supplier</th>
                  <th>Total Purchase</th>
                  <th>Total Paid</th>
                  <th>Total Items</th>
                  <th>Payment</th>
                  <th>Last Purchase</th>
                  <th>Avg Order Value</th>
                  <th>Status</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {filteredSuppliers.length === 0 ? (
                  <tr>
                    <td colSpan="10" className="text-center text-muted py-4">No records found.</td>
                  </tr>
                ) : (
                  filteredSuppliers.map(item => (
                    <tr key={item.id}>
                      <td><a href="#!" className="link link-custom-primary fw-semibold">{item.supplierId}</a></td>
                      <td>
                        <div className="d-flex align-items-center gap-2">
                          <img src={item.image} className="size-8 rounded-circle img-fluid" alt="Supplier" onError={e => { e.target.src = '/assets/user-6-BIO7_TUU.png'; }} />
                          <span className="text-reset fw-medium">{item.name}</span>
                        </div>
                      </td>
                      <td className="fw-semibold">${item.totalPurchase.toLocaleString()}</td>
                      <td>${item.totalPaid.toLocaleString()}</td>
                      <td>{item.totalItems}</td>
                      <td>{item.paymentMethod}</td>
                      <td>{item.lastPurchase}</td>
                      <td>${item.avgOrderValue.toLocaleString()}</td>
                      <td>
                        <span className={`badge bg-${item.status === 'Active' ? 'success' : 'danger'}-subtle text-${item.status === 'Active' ? 'success' : 'danger'} border border-${item.status === 'Active' ? 'success' : 'danger'}-subtle`}>
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

          <div className="row align-items-center g-3 mt-3">
            <div className="col-md-6">
              <p className="text-muted text-center text-md-start mb-0">
                Showing <b className="me-1">1-{filteredSuppliers.length}</b> of <b className="ms-1">{filteredSuppliers.length}</b> Results
              </p>
            </div>
            <div className="col-md-6">
              <nav aria-label="Page navigation example">
                <ul className="pagination justify-content-center justify-content-md-end mb-0 products-pagination">
                  <li className="page-item disabled"><a className="page-link" href="#"><i data-lucide="chevron-left" class="size-4"></i>Previous</a></li>
                  <li className="page-item active"><a className="page-link" href="#">1</a></li>
                  <li className="page-item disabled"><a className="page-link" href="#">Next<i data-lucide="chevron-right" class="size-4"></i></a></li>
                </ul>
              </nav>
            </div>
          </div>
        </div>
      </div>

      {/* Add Modal */}
      {showAddModal && (
        <div className="modal fade show d-block" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
          <div className="modal-dialog modal-dialog-centered modal-lg">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Add Supplier Record</h5>
                <button type="button" className="btn-close" onClick={() => setShowAddModal(false)}></button>
              </div>
              <form onSubmit={handleAddSubmit}>
                <div className="modal-body">
                  <div className="row g-3">
                    <div className="col-md-6">
                      <label className="form-label">Supplier Name</label>
                      <input type="text" className="form-control" value={formName} onChange={e => setFormName(e.target.value)} required />
                    </div>
                    <div className="col-md-6">
                      <label className="form-label">Supplier ID</label>
                      <input type="text" className="form-control" value={formSupplierId} onChange={e => setFormSupplierId(e.target.value)} required />
                    </div>
                    <div className="col-md-6">
                      <label className="form-label">Total Purchase ($)</label>
                      <input type="number" className="form-control" value={formTotalPurchase} onChange={e => setFormTotalPurchase(e.target.value)} required />
                    </div>
                    <div className="col-md-6">
                      <label className="form-label">Total Paid ($)</label>
                      <input type="number" className="form-control" value={formTotalPaid} onChange={e => setFormTotalPaid(e.target.value)} required />
                    </div>
                    <div className="col-md-4">
                      <label className="form-label">Total Items</label>
                      <input type="number" className="form-control" value={formTotalItems} onChange={e => setFormTotalItems(e.target.value)} required />
                    </div>
                    <div className="col-md-4">
                      <label className="form-label">Payment Method</label>
                      <select className="form-select" value={formMethod} onChange={e => setFormMethod(e.target.value)}>
                        {methods.map(m => <option key={m} value={m}>{m}</option>)}
                      </select>
                    </div>
                    <div className="col-md-4">
                      <label className="form-label">Status</label>
                      <select className="form-select" value={formStatus} onChange={e => setFormStatus(e.target.value)}>
                        {statuses.map(s => <option key={s} value={s}>{s}</option>)}
                      </select>
                    </div>
                    <div className="col-md-12">
                      <label className="form-label">Last Purchase Date</label>
                      <input type="date" className="form-control" value={formDate} onChange={e => setFormDate(e.target.value)} required />
                    </div>
                  </div>
                </div>
                <div className="modal-footer">
                  <button type="button" className="btn btn-light" onClick={() => setShowAddModal(false)}>Close</button>
                  <button type="submit" className="btn btn-primary">Save Supplier</button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* Edit Modal */}
      {showEditModal && (
        <div className="modal fade show d-block" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
          <div className="modal-dialog modal-dialog-centered modal-lg">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Edit Supplier Record</h5>
                <button type="button" className="btn-close" onClick={() => setShowEditModal(false)}></button>
              </div>
              <form onSubmit={handleEditSubmit}>
                <div className="modal-body">
                  <div className="row g-3">
                    <div className="col-md-6">
                      <label className="form-label">Supplier Name</label>
                      <input type="text" className="form-control" value={formName} onChange={e => setFormName(e.target.value)} required />
                    </div>
                    <div className="col-md-6">
                      <label className="form-label">Supplier ID</label>
                      <input type="text" className="form-control" value={formSupplierId} onChange={e => setFormSupplierId(e.target.value)} required />
                    </div>
                    <div className="col-md-6">
                      <label className="form-label">Total Purchase ($)</label>
                      <input type="number" className="form-control" value={formTotalPurchase} onChange={e => setFormTotalPurchase(e.target.value)} required />
                    </div>
                    <div className="col-md-6">
                      <label className="form-label">Total Paid ($)</label>
                      <input type="number" className="form-control" value={formTotalPaid} onChange={e => setFormTotalPaid(e.target.value)} required />
                    </div>
                    <div className="col-md-4">
                      <label className="form-label">Total Items</label>
                      <input type="number" className="form-control" value={formTotalItems} onChange={e => setFormTotalItems(e.target.value)} required />
                    </div>
                    <div className="col-md-4">
                      <label className="form-label">Payment Method</label>
                      <select className="form-select" value={formMethod} onChange={e => setFormMethod(e.target.value)}>
                        {methods.map(m => <option key={m} value={m}>{m}</option>)}
                      </select>
                    </div>
                    <div className="col-md-4">
                      <label className="form-label">Status</label>
                      <select className="form-select" value={formStatus} onChange={e => setFormStatus(e.target.value)}>
                        {statuses.map(s => <option key={s} value={s}>{s}</option>)}
                      </select>
                    </div>
                    <div className="col-md-12">
                      <label className="form-label">Last Purchase Date</label>
                      <input type="date" className="form-control" value={formDate} onChange={e => setFormDate(e.target.value)} required />
                    </div>
                  </div>
                </div>
                <div className="modal-footer">
                  <button type="button" className="btn btn-danger me-auto" onClick={() => handleDelete(selectedSupplier.id)}>Delete</button>
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
