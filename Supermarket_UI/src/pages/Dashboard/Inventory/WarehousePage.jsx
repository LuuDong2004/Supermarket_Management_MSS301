// pages/Dashboard/Inventory/WarehousePage.jsx
import React, { useEffect, useState } from 'react';
import PageBreadcrumb from '../../../components/ui/PageBreadcrumb';
import { ROUTES } from '../../../configs/routes';

const initialWarehouses = [
  { id: 1, name: 'Main Warehouse', code: 'WH-MAIN', phone: '+1 555 019 2831', email: 'main.wh@gotpos.com', location: 'New York, USA', status: 'Active' },
  { id: 2, name: 'Branch Warehouse', code: 'WH-BRANCH', phone: '+1 555 019 4482', email: 'branch.wh@gotpos.com', location: 'California, USA', status: 'Active' },
  { id: 3, name: 'Sub Warehouse', code: 'WH-SUB', phone: '+1 555 019 9011', email: 'sub.wh@gotpos.com', location: 'Texas, USA', status: 'Inactive' }
];

export default function WarehousePage() {
  const [warehouses, setWarehouses] = useState(initialWarehouses);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  // Modal State
  const [modalName, setModalName] = useState('');
  const [modalCode, setModalCode] = useState('');
  const [modalPhone, setModalPhone] = useState('');
  const [modalEmail, setModalEmail] = useState('');
  const [modalLocation, setModalLocation] = useState('');
  const [modalStatus, setModalStatus] = useState('Active');
  
  const [editingId, setEditingId] = useState(null);
  const [deletingId, setDeletingId] = useState(null);

  useEffect(() => {
    if (window.lucide) {
      window.lucide.createIcons();
    }
  }, [warehouses]);

  const handleDelete = () => {
    setWarehouses(prev => prev.filter(w => w.id !== deletingId));
    const modalElement = document.getElementById('deleteModal');
    const modalInstance = window.bootstrap?.Modal?.getInstance(modalElement);
    modalInstance?.hide();
    setDeletingId(null);
  };

  const handleFormSubmit = (e) => {
    e.preventDefault();
    if (editingId) {
      setWarehouses(prev => prev.map(w => w.id === editingId ? {
        ...w,
        name: modalName,
        code: modalCode,
        phone: modalPhone,
        email: modalEmail,
        location: modalLocation,
        status: modalStatus,
      } : w));
    } else {
      const newWarehouse = {
        id: warehouses.length > 0 ? Math.max(...warehouses.map(w => w.id)) + 1 : 1,
        name: modalName,
        code: modalCode,
        phone: modalPhone,
        email: modalEmail,
        location: modalLocation,
        status: modalStatus,
      };
      setWarehouses(prev => [...prev, newWarehouse]);
    }

    resetForm();

    const modalElement = document.getElementById('addWarehouseModal');
    const modalInstance = window.bootstrap?.Modal?.getInstance(modalElement);
    modalInstance?.hide();
  };

  const resetForm = () => {
    setModalName('');
    setModalCode('');
    setModalPhone('');
    setModalEmail('');
    setModalLocation('');
    setModalStatus('Active');
    setEditingId(null);
  };

  const openEditModal = (item) => {
    setEditingId(item.id);
    setModalName(item.name);
    setModalCode(item.code);
    setModalPhone(item.phone);
    setModalEmail(item.email);
    setModalLocation(item.location);
    setModalStatus(item.status);

    const modalElement = document.getElementById('addWarehouseModal');
    const modalInstance = new window.bootstrap.Modal(modalElement);
    modalInstance.show();
  };

  const openAddModal = () => {
    resetForm();
    const modalElement = document.getElementById('addWarehouseModal');
    const modalInstance = new window.bootstrap.Modal(modalElement);
    modalInstance.show();
  };

  const filteredWarehouses = warehouses.filter(w => {
    const matchesSearch = w.name.toLowerCase().includes(search.toLowerCase()) || 
                          w.code.toLowerCase().includes(search.toLowerCase()) ||
                          w.location.toLowerCase().includes(search.toLowerCase());
    const matchesStatus = statusFilter === 'all' || w.status.toLowerCase() === statusFilter.toLowerCase();
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="container-fluid">
      <PageBreadcrumb title="Warehouse" breadcrumbs={[{ label: 'Dashboard', href: ROUTES.DASHBOARD }, { label: 'Inventory' }, { label: 'Warehouse' }]} />

      <div className="card">
        <div className="card-header d-flex flex-wrap gap-3 justify-content-between align-items-center">
          <h5 className="card-title mb-0">Warehouse List</h5>
          <div className="d-flex flex-wrap gap-2 align-items-center ms-auto">
            <div className="position-relative">
              <input type="text" className="form-control ps-9" placeholder="Search Warehouse..." value={search} onChange={e => setSearch(e.target.value)} />
              <i data-lucide="search" className="size-4 icon-dark position-absolute top-50 start-0 ms-3 translate-middle-y"></i>
            </div>
            <select className="form-select w-36" value={statusFilter} onChange={e => setStatusFilter(e.target.value)}>
              <option value="all">All Status</option>
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
            </select>
            <button className="btn btn-primary d-flex align-items-center gap-1" onClick={openAddModal}>
              <i className="ri-add-line fs-lg"></i> Add Warehouse
            </button>
          </div>
        </div>
        <div className="card-body pt-0">
          <div className="table-card table-responsive">
            <table className="table align-middle text-nowrap mb-0">
              <thead>
                <tr className="bg-light border-bottom">
                  <th>Warehouse Name</th>
                  <th>Code</th>
                  <th>Phone</th>
                  <th>Email</th>
                  <th>Location</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredWarehouses.length === 0 ? (
                  <tr>
                    <td colSpan="7" className="text-center text-muted py-4">No warehouses found.</td>
                  </tr>
                ) : (
                  filteredWarehouses.map(item => (
                    <tr key={item.id}>
                      <td><span className="fw-semibold text-reset">{item.name}</span></td>
                      <td><span className="fw-semibold text-primary">{item.code}</span></td>
                      <td>{item.phone}</td>
                      <td>{item.email}</td>
                      <td>{item.location}</td>
                      <td>
                        <span className={`badge bg-${item.status === 'Active' ? 'success' : 'danger'}-subtle text-${item.status === 'Active' ? 'success' : 'danger'}`}>
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
        </div>
      </div>

      {/* Add/Edit Warehouse Modal */}
      <div className="modal fade" id="addWarehouseModal" tabIndex="-1" aria-labelledby="addWarehouseModalLabel" aria-hidden="true">
        <div className="modal-dialog modal-dialog-centered">
          <div className="modal-content">
            <div className="modal-header">
              <h6 className="modal-title" id="addWarehouseModalLabel">{editingId ? 'Edit Warehouse' : 'Add New Warehouse'}</h6>
              <button type="button" className="btn-close" data-bs-dismiss="modal"></button>
            </div>
            <div className="modal-body">
              <form onSubmit={handleFormSubmit}>
                <div className="mb-3">
                  <label className="form-label">Warehouse Name <span className="text-danger">*</span></label>
                  <input type="text" className="form-control" placeholder="e.g., Main Warehouse" value={modalName} onChange={e => setModalName(e.target.value)} required />
                </div>
                <div className="mb-3">
                  <label className="form-label">Code <span className="text-danger">*</span></label>
                  <input type="text" className="form-control" placeholder="e.g., WH-MAIN" value={modalCode} onChange={e => setModalCode(e.target.value)} required />
                </div>
                <div className="mb-3">
                  <label className="form-label">Phone <span className="text-danger">*</span></label>
                  <input type="text" className="form-control" placeholder="e.g., +1 555 019 2831" value={modalPhone} onChange={e => setModalPhone(e.target.value)} required />
                </div>
                <div className="mb-3">
                  <label className="form-label">Email <span className="text-danger">*</span></label>
                  <input type="email" className="form-control" placeholder="e.g., warehouse@gotpos.com" value={modalEmail} onChange={e => setModalEmail(e.target.value)} required />
                </div>
                <div className="mb-3">
                  <label className="form-label">Location <span className="text-danger">*</span></label>
                  <input type="text" className="form-control" placeholder="e.g., New York, USA" value={modalLocation} onChange={e => setModalLocation(e.target.value)} required />
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
                  <button type="submit" className="btn btn-primary w-100">{editingId ? 'Save Changes' : 'Add Warehouse'}</button>
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
            <h5 className="mb-4 lh-base">Are you sure you want to delete this Warehouse?</h5>
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
