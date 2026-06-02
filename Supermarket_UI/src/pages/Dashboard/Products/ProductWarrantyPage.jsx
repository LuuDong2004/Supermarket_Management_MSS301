// pages/Dashboard/Products/ProductWarrantyPage.jsx
import React, { useEffect, useState } from 'react';
import PageBreadcrumb from '../../../components/ui/PageBreadcrumb';
import { ROUTES } from '../../../configs/routes';

const initialWarranties = [
  { id: 1, product: 'iPhone 15 Pro', sku: 'APL-15P', customer: 'John Doe', warrantyType: '1 Year Brand', purchaseDate: '10-03-2024', status: 'Active', warrantyStart: '10-03-2024', warrantyEnd: '10-03-2025' },
  { id: 2, product: 'Galaxy S24 Ultra', sku: 'SAM-S24U', customer: 'Jane Smith', warrantyType: '2 Year Dealer', purchaseDate: '02-04-2024', status: 'Active', warrantyStart: '02-04-2024', warrantyEnd: '02-04-2026' },
  { id: 3, product: 'MacBook Air M3', sku: 'APL-MBA3', customer: 'Robert Johnson', warrantyType: '1 Year Brand', purchaseDate: '18-02-2024', status: 'Expired', warrantyStart: '18-02-2024', warrantyEnd: '18-02-2025' }
];

const warrantyTypesList = ['1 Year Brand', '2 Year Dealer', '6 Months Store'];

export default function ProductWarrantyPage() {
  const [warranties, setWarranties] = useState(initialWarranties);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [typeFilter, setTypeFilter] = useState('all');

  // Modal Form State
  const [modalProduct, setModalProduct] = useState('');
  const [modalSku, setModalSku] = useState('');
  const [modalType, setModalType] = useState(warrantyTypesList[0]);
  const [modalCustomer, setModalCustomer] = useState('');
  const [modalPurchaseDate, setModalPurchaseDate] = useState('');
  const [modalStatus, setModalStatus] = useState('Active');
  const [modalStart, setModalStart] = useState('');
  const [modalEnd, setModalEnd] = useState('');
  
  const [editingId, setEditingId] = useState(null);
  const [deletingId, setDeletingId] = useState(null);

  useEffect(() => {
    if (window.lucide) {
      window.lucide.createIcons();
    }
  }, [warranties]);

  const handleDelete = () => {
    setWarranties(prev => prev.filter(w => w.id !== deletingId));
    const modalElement = document.getElementById('deleteModal');
    const modalInstance = window.bootstrap?.Modal?.getInstance(modalElement);
    modalInstance?.hide();
    setDeletingId(null);
  };

  const handleFormSubmit = (e) => {
    e.preventDefault();
    if (editingId) {
      // Edit mode
      setWarranties(prev => prev.map(w => w.id === editingId ? {
        ...w,
        product: modalProduct,
        sku: modalSku,
        warrantyType: modalType,
        customer: modalCustomer,
        purchaseDate: modalPurchaseDate,
        status: modalStatus,
        warrantyStart: modalStart,
        warrantyEnd: modalEnd,
      } : w));
    } else {
      // Add mode
      const newWarranty = {
        id: warranties.length > 0 ? Math.max(...warranties.map(w => w.id)) + 1 : 1,
        product: modalProduct,
        sku: modalSku,
        warrantyType: modalType,
        customer: modalCustomer,
        purchaseDate: modalPurchaseDate,
        status: modalStatus,
        warrantyStart: modalStart,
        warrantyEnd: modalEnd,
      };
      setWarranties(prev => [...prev, newWarranty]);
    }

    resetForm();

    const modalElement = document.getElementById('addWarrantyModal');
    const modalInstance = window.bootstrap?.Modal?.getInstance(modalElement);
    modalInstance?.hide();
  };

  const resetForm = () => {
    setModalProduct('');
    setModalSku('');
    setModalType(warrantyTypesList[0]);
    setModalCustomer('');
    setModalPurchaseDate('');
    setModalStatus('Active');
    setModalStart('');
    setModalEnd('');
    setEditingId(null);
  };

  const openEditModal = (item) => {
    setEditingId(item.id);
    setModalProduct(item.product);
    setModalSku(item.sku);
    setModalType(item.warrantyType);
    setModalCustomer(item.customer);
    setModalPurchaseDate(item.purchaseDate);
    setModalStatus(item.status);
    setModalStart(item.warrantyStart);
    setModalEnd(item.warrantyEnd);

    const modalElement = document.getElementById('addWarrantyModal');
    const modalInstance = new window.bootstrap.Modal(modalElement);
    modalInstance.show();
  };

  const openAddModal = () => {
    resetForm();
    const modalElement = document.getElementById('addWarrantyModal');
    const modalInstance = new window.bootstrap.Modal(modalElement);
    modalInstance.show();
  };

  const filteredWarranties = warranties.filter(w => {
    const matchesSearch = w.product.toLowerCase().includes(search.toLowerCase()) || 
                          w.sku.toLowerCase().includes(search.toLowerCase()) ||
                          w.customer.toLowerCase().includes(search.toLowerCase());
    const matchesStatus = statusFilter === 'all' || w.status.toLowerCase() === statusFilter.toLowerCase();
    const matchesType = typeFilter === 'all' || w.warrantyType.toLowerCase() === typeFilter.toLowerCase();
    return matchesSearch && matchesStatus && matchesType;
  });

  return (
    <div className="container-fluid">
      <PageBreadcrumb title="Warranties" breadcrumbs={[{ label: 'Dashboard', href: ROUTES.DASHBOARD }, { label: 'Products' }, { label: 'Warranties' }]} />

      <div className="row">
        <div className="col-12">
          <div className="card">
            <div className="card-header d-flex flex-wrap gap-3 justify-content-between align-items-center">
              <div className="flex-shrink-0">
                <div className="position-relative">
                  <input type="text" className="form-control ps-9" placeholder="Search for..." value={search} onChange={e => setSearch(e.target.value)} />
                  <i data-lucide="search" className="size-4 icon-dark position-absolute top-50 start-0 ms-3 translate-middle-y"></i>
                </div>
              </div>
              <div className="d-flex gap-3 flex-wrap ms-auto flex-md-nowrap">
                <select className="form-select min-w-40" value={statusFilter} onChange={e => setStatusFilter(e.target.value)}>
                  <option value="all">All Status</option>
                  <option value="active">Active</option>
                  <option value="expired">Expired</option>
                </select>
                <select className="form-select min-w-44" value={typeFilter} onChange={e => setTypeFilter(e.target.value)}>
                  <option value="all">All Types</option>
                  {warrantyTypesList.map(type => (
                    <option key={type} value={type}>{type}</option>
                  ))}
                </select>
                <button type="button" className="btn btn-primary d-flex align-items-center gap-1 flex-shrink-0" onClick={openAddModal}>
                  <i data-lucide="plus" className="size-4"></i> Add Warranty
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
                      <th className="fw-medium text-muted">Product</th>
                      <th className="fw-medium text-muted">SKU</th>
                      <th className="fw-medium text-muted">Customer</th>
                      <th className="fw-medium text-muted">Warranty Type</th>
                      <th className="fw-medium text-muted">Purchase Date</th>
                      <th className="fw-medium text-muted">Status</th>
                      <th className="fw-medium text-muted">Warranty Start</th>
                      <th className="fw-medium text-muted">Warranty End</th>
                      <th className="fw-medium text-muted">Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredWarranties.map(item => (
                      <tr key={item.id}>
                        <td>
                          <div className="form-check check-primary">
                            <input className="form-check-input" type="checkbox" id={`check_${item.id}`} />
                          </div>
                        </td>
                        <td><span className="fw-semibold text-reset">{item.product}</span></td>
                        <td><span className="fw-semibold text-primary">{item.sku}</span></td>
                        <td>{item.customer}</td>
                        <td>{item.warrantyType}</td>
                        <td>{item.purchaseDate}</td>
                        <td>
                          <span className={`badge bg-${item.status === 'Active' ? 'success' : 'danger'}-subtle text-${item.status === 'Active' ? 'success' : 'danger'}`}>
                            {item.status}
                          </span>
                        </td>
                        <td>{item.warrantyStart}</td>
                        <td>{item.warrantyEnd}</td>
                        <td>
                          <div className="dropdown">
                            <a href="#!" className="link link-custom-primary" data-bs-toggle="dropdown" aria-expanded="false">
                              <i className="ri-more-2-fill"></i>
                            </a>
                            <ul className="dropdown-menu">
                              <li>
                                <button className="dropdown-item d-flex gap-3 align-items-center border-0 bg-transparent" onClick={() => openEditModal(item)}>
                                  <i className="ri-pencil-line"></i> Edit
                                </button>
                              </li>
                              <li>
                                <button className="dropdown-item d-flex gap-3 align-items-center text-danger border-0 bg-transparent" data-bs-toggle="modal" data-bs-target="#deleteModal" onClick={() => setDeletingId(item.id)}>
                                  <i className="ri-delete-bin-line"></i> Delete
                                </button>
                              </li>
                            </ul>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <div className="row align-items-center g-3 mt-2">
                <div className="col-md-6">
                  <p className="text-muted text-center text-md-start mb-0">
                    Showing <b className="me-1">1-{filteredWarranties.length}</b> of <b className="ms-1">{filteredWarranties.length}</b> Results
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Add/Edit Warranty Modal */}
      <div className="modal fade" id="addWarrantyModal" tabIndex="-1" aria-labelledby="addWarrantyModalLabel" aria-hidden="true">
        <div className="modal-dialog modal-dialog-centered">
          <div className="modal-content">
            <div className="modal-header">
              <h6 className="modal-title" id="addWarrantyModalLabel">{editingId ? 'Edit Warranty' : 'Add New Warranty'}</h6>
              <button type="button" className="btn-close" data-bs-dismiss="modal"></button>
            </div>
            <div className="modal-body">
              <form onSubmit={handleFormSubmit}>
                <div className="mb-3">
                  <label className="form-label">Product Name <span className="text-danger">*</span></label>
                  <input type="text" className="form-control" placeholder="e.g., Apple iPhone 15" value={modalProduct} onChange={e => setModalProduct(e.target.value)} required />
                </div>
                <div className="mb-3">
                  <label className="form-label">SKU <span className="text-danger">*</span></label>
                  <input type="text" className="form-control" placeholder="e.g., APL-15" value={modalSku} onChange={e => setModalSku(e.target.value)} required />
                </div>
                <div className="mb-3">
                  <label className="form-label">Warranty Type</label>
                  <select className="form-select" value={modalType} onChange={e => setModalType(e.target.value)}>
                    {warrantyTypesList.map(type => (
                      <option key={type} value={type}>{type}</option>
                    ))}
                  </select>
                </div>
                <div className="mb-3">
                  <label className="form-label">Customer <span className="text-danger">*</span></label>
                  <input type="text" className="form-control" placeholder="e.g., John Doe" value={modalCustomer} onChange={e => setModalCustomer(e.target.value)} required />
                </div>
                <div className="mb-3">
                  <label className="form-label">Purchase Date</label>
                  <input type="text" className="form-control" placeholder="dd-mm-yyyy" value={modalPurchaseDate} onChange={e => setModalPurchaseDate(e.target.value)} />
                </div>
                <div className="row">
                  <div className="col-md-6 mb-3">
                    <label className="form-label">Warranty Start</label>
                    <input type="text" className="form-control" placeholder="dd-mm-yyyy" value={modalStart} onChange={e => setModalStart(e.target.value)} />
                  </div>
                  <div className="col-md-6 mb-3">
                    <label className="form-label">Warranty End</label>
                    <input type="text" className="form-control" placeholder="dd-mm-yyyy" value={modalEnd} onChange={e => setModalEnd(e.target.value)} />
                  </div>
                </div>
                <div className="mb-3">
                  <label className="form-label">Status</label>
                  <select className="form-select" value={modalStatus} onChange={e => setModalStatus(e.target.value)}>
                    <option value="Active">Active</option>
                    <option value="Expired">Expired</option>
                  </select>
                </div>
                <div className="d-flex gap-2 mt-7">
                  <button type="button" className="btn btn-light w-100" data-bs-dismiss="modal">Close</button>
                  <button type="submit" className="btn btn-primary w-100">{editingId ? 'Save Changes' : 'Add Warranty'}</button>
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
            <h5 className="mb-4 lh-base">Are you sure you want to delete this Warranty?</h5>
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
