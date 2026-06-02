// pages/Dashboard/Staff/StaffRolePermissionPage.jsx
import React, { useEffect, useState } from 'react';
import PageBreadcrumb from '../../../components/ui/PageBreadcrumb';
import { ROUTES } from '../../../configs/routes';

const initialRoles = [
  { id: 1, name: 'Admin', desc: 'Full system access, can manage settings and financial accounts.', users: 2, permissions: { products: 'All', orders: 'All', inventory: 'All', staff: 'All' } },
  { id: 2, name: 'Store Manager', desc: 'Manage products, inventory, and staff schedules.', users: 1, permissions: { products: 'All', orders: 'All', inventory: 'All', staff: 'Read/Write' } },
  { id: 3, name: 'Cashier', desc: 'Process sales and register drawer access.', users: 3, permissions: { products: 'Read Only', orders: 'Read/Write', inventory: 'Read Only', staff: 'None' } }
];

export default function StaffRolePermissionPage() {
  const [roles, setRoles] = useState(initialRoles);
  const [search, setSearch] = useState('');

  // Modal State
  const [modalName, setModalName] = useState('');
  const [modalDesc, setModalDesc] = useState('');
  const [modalPermissions, setModalPermissions] = useState({
    products: 'None',
    orders: 'None',
    inventory: 'None',
    staff: 'None'
  });
  
  const [editingId, setEditingId] = useState(null);
  const [deletingId, setDeletingId] = useState(null);

  useEffect(() => {
    if (window.lucide) {
      window.lucide.createIcons();
    }
  }, [roles]);

  const handleDelete = () => {
    setRoles(prev => prev.filter(r => r.id !== deletingId));
    const modalElement = document.getElementById('deleteModal');
    const modalInstance = window.bootstrap?.Modal?.getInstance(modalElement);
    modalInstance?.hide();
    setDeletingId(null);
  };

  const handlePermissionChange = (module, level) => {
    setModalPermissions(prev => ({
      ...prev,
      [module]: level
    }));
  };

  const handleFormSubmit = (e) => {
    e.preventDefault();

    if (editingId) {
      setRoles(prev => prev.map(r => r.id === editingId ? {
        ...r,
        name: modalName,
        desc: modalDesc,
        permissions: { ...modalPermissions }
      } : r));
    } else {
      const newRole = {
        id: roles.length > 0 ? Math.max(...roles.map(r => r.id)) + 1 : 1,
        name: modalName,
        desc: modalDesc,
        users: 0,
        permissions: { ...modalPermissions }
      };
      setRoles(prev => [...prev, newRole]);
    }

    resetForm();

    const modalElement = document.getElementById('addRoleModal');
    const modalInstance = window.bootstrap?.Modal?.getInstance(modalElement);
    modalInstance?.hide();
  };

  const resetForm = () => {
    setModalName('');
    setModalDesc('');
    setModalPermissions({
      products: 'None',
      orders: 'None',
      inventory: 'None',
      staff: 'None'
    });
    setEditingId(null);
  };

  const openEditModal = (item) => {
    setEditingId(item.id);
    setModalName(item.name);
    setModalDesc(item.desc);
    setModalPermissions({ ...item.permissions });

    const modalElement = document.getElementById('addRoleModal');
    const modalInstance = new window.bootstrap.Modal(modalElement);
    modalInstance.show();
  };

  const openAddModal = () => {
    resetForm();
    const modalElement = document.getElementById('addRoleModal');
    const modalInstance = new window.bootstrap.Modal(modalElement);
    modalInstance.show();
  };

  const filteredRoles = roles.filter(r => {
    return r.name.toLowerCase().includes(search.toLowerCase()) || 
           r.desc.toLowerCase().includes(search.toLowerCase());
  });

  return (
    <div className="container-fluid">
      <PageBreadcrumb title="Role & Permissions" breadcrumbs={[{ label: 'Dashboard', href: ROUTES.DASHBOARD }, { label: 'Staff' }, { label: 'Role & Permissions' }]} />

      <div className="card">
        <div className="card-header d-flex flex-wrap gap-3 justify-content-between align-items-center">
          <h5 className="card-title mb-0">Roles & Permissions</h5>
          <div className="d-flex flex-wrap gap-2 align-items-center ms-auto">
            <div className="position-relative">
              <input type="text" className="form-control ps-9" placeholder="Search Roles..." value={search} onChange={e => setSearch(e.target.value)} />
              <i data-lucide="search" className="size-4 icon-dark position-absolute top-50 start-0 ms-3 translate-middle-y"></i>
            </div>
            <button className="btn btn-primary d-flex align-items-center gap-1" onClick={openAddModal}>
              <i className="ri-add-line fs-lg"></i> Add Role
            </button>
          </div>
        </div>
        <div className="card-body pt-0">
          <div className="table-card table-responsive">
            <table className="table align-middle text-nowrap mb-0">
              <thead>
                <tr className="bg-light border-bottom">
                  <th>Role Name</th>
                  <th>Description</th>
                  <th>Users Assigned</th>
                  <th>Permissions Summary</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredRoles.length === 0 ? (
                  <tr>
                    <td colSpan="5" className="text-center text-muted py-4">No roles found.</td>
                  </tr>
                ) : (
                  filteredRoles.map(item => (
                    <tr key={item.id}>
                      <td><span className="fw-semibold text-reset">{item.name}</span></td>
                      <td className="text-wrap text-muted" style={{ maxWidth: '250px' }}>{item.desc}</td>
                      <td>{item.users} users</td>
                      <td>
                        <div className="d-flex gap-2 flex-wrap">
                          <span className="badge bg-primary-subtle text-primary">Products: {item.permissions.products}</span>
                          <span className="badge bg-success-subtle text-success">Orders: {item.permissions.orders}</span>
                          <span className="badge bg-warning-subtle text-warning">Inventory: {item.permissions.inventory}</span>
                          <span className="badge bg-danger-subtle text-danger">Staff: {item.permissions.staff}</span>
                        </div>
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

      {/* Add/Edit Role Modal */}
      <div className="modal fade" id="addRoleModal" tabIndex="-1" aria-labelledby="addRoleModalLabel" aria-hidden="true">
        <div className="modal-dialog modal-dialog-centered">
          <div className="modal-content">
            <div className="modal-header">
              <h6 className="modal-title" id="addRoleModalLabel">{editingId ? 'Edit Role Permissions' : 'Add New Role'}</h6>
              <button type="button" className="btn-close" data-bs-dismiss="modal"></button>
            </div>
            <div className="modal-body">
              <form onSubmit={handleFormSubmit}>
                <div className="mb-3">
                  <label className="form-label">Role Name <span className="text-danger">*</span></label>
                  <input type="text" className="form-control" placeholder="e.g., Cashier" value={modalName} onChange={e => setModalName(e.target.value)} required />
                </div>
                <div className="mb-3">
                  <label className="form-label">Description <span className="text-danger">*</span></label>
                  <input type="text" className="form-control" placeholder="Describe this role's purpose..." value={modalDesc} onChange={e => setModalDesc(e.target.value)} required />
                </div>

                <h6 className="fs-sm mb-3 text-dark border-bottom pb-2">Granular Permissions</h6>
                {['products', 'orders', 'inventory', 'staff'].map(module => (
                  <div className="mb-3 d-flex align-items-center justify-content-between" key={module}>
                    <span className="text-capitalize text-dark fw-medium">{module}</span>
                    <select className="form-select w-44 form-select-sm" value={modalPermissions[module]} onChange={e => handlePermissionChange(module, e.target.value)}>
                      <option value="All">All Access</option>
                      <option value="Read/Write">Read/Write</option>
                      <option value="Read Only">Read Only</option>
                      <option value="None">None</option>
                    </select>
                  </div>
                ))}

                <div className="d-flex gap-2 mt-7">
                  <button type="button" className="btn btn-light w-100" data-bs-dismiss="modal">Close</button>
                  <button type="submit" className="btn btn-primary w-100">{editingId ? 'Save Changes' : 'Add Role'}</button>
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
            <h5 className="mb-4 lh-base">Are you sure you want to delete this Role?</h5>
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
