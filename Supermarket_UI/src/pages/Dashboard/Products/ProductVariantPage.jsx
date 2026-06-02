// pages/Dashboard/Products/ProductVariantPage.jsx
import React, { useEffect, useState } from 'react';
import PageBreadcrumb from '../../../components/ui/PageBreadcrumb';
import { ROUTES } from '../../../configs/routes';

const initialVariants = [
  { id: 1, name: 'Red / Medium', sku: 'TSH-RED-M', price: 19.99, stock: 15, quantity: 20, status: 'Active' },
  { id: 2, name: 'Blue / Large', sku: 'TSH-BLU-L', price: 21.99, stock: 8, quantity: 10, status: 'Active' },
  { id: 3, name: 'Green / Small', sku: 'TSH-GRN-S', price: 18.99, stock: 0, quantity: 0, status: 'Inactive' }
];

export default function ProductVariantPage() {
  const [variants, setVariants] = useState(initialVariants);
  const [search, setSearch] = useState('');

  // Modal Form State
  const [modalName, setModalName] = useState('');
  const [modalSku, setModalSku] = useState('');
  const [modalPrice, setModalPrice] = useState('');
  const [modalStock, setModalStock] = useState('');
  const [modalQuantity, setModalQuantity] = useState('');
  const [modalStatus, setModalStatus] = useState('Active');
  const [editingId, setEditingId] = useState(null);
  const [deletingId, setDeletingId] = useState(null);

  useEffect(() => {
    if (window.lucide) {
      window.lucide.createIcons();
    }
  }, [variants]);

  const handleDelete = () => {
    setVariants(prev => prev.filter(v => v.id !== deletingId));
    const modalElement = document.getElementById('deleteModal');
    const modalInstance = window.bootstrap?.Modal?.getInstance(modalElement);
    modalInstance?.hide();
    setDeletingId(null);
  };

  const handleFormSubmit = (e) => {
    e.preventDefault();
    if (editingId) {
      // Edit mode
      setVariants(prev => prev.map(v => v.id === editingId ? {
        ...v,
        name: modalName,
        sku: modalSku,
        price: parseFloat(modalPrice) || 0,
        stock: parseInt(modalStock) || 0,
        quantity: parseInt(modalQuantity) || 0,
        status: modalStatus,
      } : v));
    } else {
      // Add mode
      const newVar = {
        id: variants.length > 0 ? Math.max(...variants.map(v => v.id)) + 1 : 1,
        name: modalName,
        sku: modalSku,
        price: parseFloat(modalPrice) || 0,
        stock: parseInt(modalStock) || 0,
        quantity: parseInt(modalQuantity) || 0,
        status: modalStatus,
      };
      setVariants(prev => [...prev, newVar]);
    }

    // Reset Form
    resetForm();

    const modalElement = document.getElementById('addVariantModal');
    const modalInstance = window.bootstrap?.Modal?.getInstance(modalElement);
    modalInstance?.hide();
  };

  const resetForm = () => {
    setModalName('');
    setModalSku('');
    setModalPrice('');
    setModalStock('');
    setModalQuantity('');
    setModalStatus('Active');
    setEditingId(null);
  };

  const openEditModal = (item) => {
    setEditingId(item.id);
    setModalName(item.name);
    setModalSku(item.sku);
    setModalPrice(item.price.toString());
    setModalStock(item.stock.toString());
    setModalQuantity(item.quantity.toString());
    setModalStatus(item.status);

    const modalElement = document.getElementById('addVariantModal');
    const modalInstance = new window.bootstrap.Modal(modalElement);
    modalInstance.show();
  };

  const openAddModal = () => {
    resetForm();
    const modalElement = document.getElementById('addVariantModal');
    const modalInstance = new window.bootstrap.Modal(modalElement);
    modalInstance.show();
  };

  const filteredVariants = variants.filter(v => {
    return v.name.toLowerCase().includes(search.toLowerCase()) || 
           v.sku.toLowerCase().includes(search.toLowerCase());
  });

  return (
    <div className="container-fluid">
      <PageBreadcrumb title="Variants" breadcrumbs={[{ label: 'Dashboard', href: ROUTES.DASHBOARD }, { label: 'Products' }, { label: 'Variants' }]} />

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
              <button type="button" className="btn btn-primary d-flex align-items-center gap-1 ms-auto flex-shrink-0" onClick={openAddModal}>
                <i data-lucide="plus" className="size-4"></i> Add Variants
              </button>
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
                      <th className="fw-medium text-muted">Variant</th>
                      <th className="fw-medium text-muted">SKU</th>
                      <th className="fw-medium text-muted">Price</th>
                      <th className="fw-medium text-muted">Stock</th>
                      <th className="fw-medium text-muted">QTY</th>
                      <th className="fw-medium text-muted">Status</th>
                      <th className="fw-medium text-muted">Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredVariants.map(item => (
                      <tr key={item.id}>
                        <td>
                          <div className="form-check check-primary">
                            <input className="form-check-input" type="checkbox" id={`check_${item.id}`} />
                          </div>
                        </td>
                        <td><span className="fw-semibold text-reset">{item.name}</span></td>
                        <td><span className="fw-semibold text-primary">{item.sku}</span></td>
                        <td>${item.price.toFixed(2)}</td>
                        <td>{item.stock}</td>
                        <td>{item.quantity}</td>
                        <td>
                          <span className={`badge bg-${item.status === 'Active' ? 'success' : 'danger'}-subtle text-${item.status === 'Active' ? 'success' : 'danger'}`}>
                            {item.status}
                          </span>
                        </td>
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
                    Showing <b className="me-1">1-{filteredVariants.length}</b> of <b className="ms-1">{filteredVariants.length}</b> Results
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Add/Edit Variant Modal */}
      <div className="modal fade" id="addVariantModal" tabIndex="-1" aria-labelledby="addVariantModalLabel" aria-hidden="true">
        <div className="modal-dialog modal-dialog-centered">
          <div className="modal-content">
            <div className="modal-header">
              <h6 className="modal-title" id="addVariantModalLabel">{editingId ? 'Edit Variant' : 'Add New Variant'}</h6>
              <button type="button" className="btn-close" data-bs-dismiss="modal"></button>
            </div>
            <div className="modal-body">
              <form onSubmit={handleFormSubmit}>
                <div className="mb-3">
                  <label className="form-label">Variant Name <span className="text-danger">*</span></label>
                  <input type="text" className="form-control" placeholder="e.g., Black / Small" value={modalName} onChange={e => setModalName(e.target.value)} required />
                </div>
                <div className="mb-3">
                  <label className="form-label">SKU <span className="text-danger">*</span></label>
                  <input type="text" className="form-control" placeholder="e.g., TSH-BLK-S" value={modalSku} onChange={e => setModalSku(e.target.value)} required />
                </div>
                <div className="mb-3">
                  <label className="form-label">Price ($) <span className="text-danger">*</span></label>
                  <input type="text" className="form-control" placeholder="29.99" value={modalPrice} onChange={e => setModalPrice(e.target.value)} required />
                </div>
                <div className="row">
                  <div className="col-md-6 mb-3">
                    <label className="form-label">Quantity <span className="text-danger">*</span></label>
                    <input type="number" className="form-control" placeholder="0" min="0" value={modalQuantity} onChange={e => setModalQuantity(e.target.value)} required />
                  </div>
                  <div className="col-md-6 mb-3">
                    <label className="form-label">Stock <span className="text-danger">*</span></label>
                    <input type="number" className="form-control" placeholder="0" min="0" value={modalStock} onChange={e => setModalStock(e.target.value)} required />
                  </div>
                </div>
                <div className="mb-3">
                  <label className="form-label">Status</label>
                  <select className="form-select" value={modalStatus} onChange={e => setModalStatus(e.target.value)}>
                    <option value="Active">Active</option>
                    <option value="Inactive">Inactive</option>
                  </select>
                </div>
                <div className="d-flex gap-2 mt-7">
                  <button type="button" className="btn btn-light w-100" data-bs-dismiss="modal">Close</button>
                  <button type="submit" className="btn btn-primary w-100">{editingId ? 'Save Changes' : 'Add Variant'}</button>
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
            <h5 className="mb-4 lh-base">Are you sure you want to delete this Variant?</h5>
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
