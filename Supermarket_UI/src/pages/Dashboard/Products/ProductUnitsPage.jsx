// pages/Dashboard/Products/ProductUnitsPage.jsx
import React, { useEffect, useState } from 'react';
import PageBreadcrumb from '../../../components/ui/PageBreadcrumb';
import { ROUTES } from '../../../configs/routes';

const initialUnits = [
  { id: 1, name: 'Kilogram', code: 'KG', type: 'Weight', products: 12, status: 'Active', created: 'Mar 10, 2024' },
  { id: 2, name: 'Piece', code: 'PC', type: 'Quantity', products: 45, status: 'Active', created: 'Apr 02, 2024' },
  { id: 3, name: 'Liter', code: 'L', type: 'Volume', products: 8, status: 'Inactive', created: 'Feb 18, 2024' },
  { id: 4, name: 'Meter', code: 'M', type: 'Length', products: 19, status: 'Active', created: 'Mar 28, 2024' },
  { id: 5, name: 'Box', code: 'BX', type: 'Quantity', products: 30, status: 'Active', created: 'Jan 09, 2024' }
];

export default function ProductUnitsPage() {
  const [units, setUnits] = useState(initialUnits);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  // Modal Form State
  const [modalName, setModalName] = useState('');
  const [modalCode, setModalCode] = useState('');
  const [modalType, setModalType] = useState('');
  const [modalProducts, setModalProducts] = useState(0);
  const [modalStatus, setModalStatus] = useState('Active');
  const [editingId, setEditingId] = useState(null);
  const [deletingId, setDeletingId] = useState(null);

  useEffect(() => {
    if (window.lucide) {
      window.lucide.createIcons();
    }
  }, [units]);

  const handleDelete = () => {
    setUnits(prev => prev.filter(unit => unit.id !== deletingId));
    const modalElement = document.getElementById('deleteModal');
    const modalInstance = window.bootstrap?.Modal?.getInstance(modalElement);
    modalInstance?.hide();
    setDeletingId(null);
  };

  const handleFormSubmit = (e) => {
    e.preventDefault();
    if (editingId) {
      // Edit mode
      setUnits(prev => prev.map(unit => unit.id === editingId ? {
        ...unit,
        name: modalName,
        code: modalCode,
        type: modalType,
        products: parseInt(modalProducts) || 0,
        status: modalStatus,
      } : unit));
    } else {
      // Add mode
      const newUnit = {
        id: units.length > 0 ? Math.max(...units.map(u => u.id)) + 1 : 1,
        name: modalName,
        code: modalCode,
        type: modalType,
        products: parseInt(modalProducts) || 0,
        status: modalStatus,
        created: new Date().toLocaleDateString('en-US', { month: 'short', day: '2-digit', year: 'numeric' })
      };
      setUnits(prev => [...prev, newUnit]);
    }

    // Reset Form and close modal
    setModalName('');
    setModalCode('');
    setModalType('');
    setModalProducts(0);
    setModalStatus('Active');
    setEditingId(null);

    const modalElement = document.getElementById('addUnitModal');
    const modalInstance = window.bootstrap?.Modal?.getInstance(modalElement);
    modalInstance?.hide();
  };

  const openEditModal = (item) => {
    setEditingId(item.id);
    setModalName(item.name);
    setModalCode(item.code);
    setModalType(item.type);
    setModalProducts(item.products);
    setModalStatus(item.status);

    const modalElement = document.getElementById('addUnitModal');
    const modalInstance = new window.bootstrap.Modal(modalElement);
    modalInstance.show();
  };

  const openAddModal = () => {
    setEditingId(null);
    setModalName('');
    setModalCode('');
    setModalType('');
    setModalProducts(0);
    setModalStatus('Active');

    const modalElement = document.getElementById('addUnitModal');
    const modalInstance = new window.bootstrap.Modal(modalElement);
    modalInstance.show();
  };

  const filteredUnits = units.filter(unit => {
    const matchesSearch = unit.name.toLowerCase().includes(search.toLowerCase()) || 
                          unit.code.toLowerCase().includes(search.toLowerCase()) ||
                          unit.type.toLowerCase().includes(search.toLowerCase());
    const matchesStatus = statusFilter === 'all' || unit.status.toLowerCase() === statusFilter.toLowerCase();
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="container-fluid">
      <PageBreadcrumb title="Units" breadcrumbs={[{ label: 'Dashboard', href: ROUTES.DASHBOARD }, { label: 'Products' }, { label: 'Units' }]} />

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
                  <option value="inactive">Inactive</option>
                </select>
                <button type="button" className="btn btn-primary d-flex align-items-center gap-1 flex-shrink-0" onClick={openAddModal}>
                  <i data-lucide="plus" className="size-4"></i> Add Units
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
                      <th className="fw-medium text-muted">Name</th>
                      <th className="fw-medium text-muted">Code</th>
                      <th className="fw-medium text-muted">Type</th>
                      <th className="fw-medium text-muted">No of Products</th>
                      <th className="fw-medium text-muted">Status</th>
                      <th className="fw-medium text-muted">Created</th>
                      <th className="fw-medium text-muted">Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredUnits.map(item => (
                      <tr key={item.id}>
                        <td>
                          <div className="form-check check-primary">
                            <input className="form-check-input" type="checkbox" id={`check_${item.id}`} />
                          </div>
                        </td>
                        <td><span className="fw-semibold text-reset">{item.name}</span></td>
                        <td><span className="fw-semibold text-primary">{item.code}</span></td>
                        <td>{item.type}</td>
                        <td>{item.products}</td>
                        <td>
                          <span className={`badge bg-${item.status === 'Active' ? 'success' : 'danger'}-subtle text-${item.status === 'Active' ? 'success' : 'danger'}`}>
                            {item.status}
                          </span>
                        </td>
                        <td className="text-muted">{item.created}</td>
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
                    Showing <b className="me-1">1-{filteredUnits.length}</b> of <b className="ms-1">{filteredUnits.length}</b> Results
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Add/Edit Unit Modal */}
      <div className="modal fade" id="addUnitModal" tabIndex="-1" aria-labelledby="addUnitModalLabel" aria-hidden="true">
        <div className="modal-dialog modal-dialog-centered">
          <div className="modal-content">
            <div className="modal-header">
              <h6 className="modal-title" id="addUnitModalLabel">{editingId ? 'Edit Unit' : 'Add New Unit'}</h6>
              <button type="button" className="btn-close" data-bs-dismiss="modal"></button>
            </div>
            <div className="modal-body">
              <form onSubmit={handleFormSubmit}>
                <div className="mb-3">
                  <label className="form-label">Unit Name <span className="text-danger">*</span></label>
                  <input type="text" className="form-control" placeholder="e.g., Kilogram" value={modalName} onChange={e => setModalName(e.target.value)} required />
                </div>
                <div className="mb-3">
                  <label className="form-label">Code <span className="text-danger">*</span></label>
                  <input type="text" className="form-control" placeholder="e.g., KG" value={modalCode} onChange={e => setModalCode(e.target.value)} required />
                </div>
                <div className="mb-3">
                  <label className="form-label">Type <span className="text-danger">*</span></label>
                  <input type="text" className="form-control" placeholder="e.g., Weight" value={modalType} onChange={e => setModalType(e.target.value)} required />
                </div>
                <div className="mb-3">
                  <label className="form-label">Products Count</label>
                  <input type="number" className="form-control" value={modalProducts} onChange={e => setModalProducts(e.target.value)} min="0" />
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
                  <button type="submit" className="btn btn-primary w-100">{editingId ? 'Save Changes' : 'Add Unit'}</button>
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
            <h5 className="mb-4 lh-base">Are you sure you want to delete this Unit?</h5>
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
