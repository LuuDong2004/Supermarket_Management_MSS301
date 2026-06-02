// pages/Dashboard/Products/ProductSubCategoriesPage.jsx
import React, { useEffect, useState } from 'react';
import PageBreadcrumb from '../../../components/ui/PageBreadcrumb';
import { ROUTES } from '../../../configs/routes';

const initialSubCategories = [
  { id: 1, name: 'Shoes', category: 'Footwear', code: 'SHO-001', pos: true, description: 'Athletic shoes & sneakers', status: 'Active', updated: 'Mar 10, 2024' },
  { id: 2, name: 'T-Shirts', category: 'Apparel', code: 'TSH-002', pos: true, description: 'Cotton t-shirts & tops', status: 'Active', updated: 'Apr 02, 2024' },
  { id: 3, name: 'Headphones', category: 'Electronics', code: 'HDP-003', pos: false, description: 'Noise cancelling headphones', status: 'Inactive', updated: 'Feb 18, 2024' },
  { id: 4, name: 'Laptops', category: 'Electronics', code: 'LAP-004', pos: true, description: 'Portable computers & notebooks', status: 'Active', updated: 'Mar 28, 2024' },
  { id: 5, name: 'Phones', category: 'Electronics', code: 'PHO-005', pos: false, description: 'Smartphones & mobiles', status: 'Inactive', updated: 'Jan 09, 2024' },
  { id: 6, name: 'Watches', category: 'Accessories', code: 'WAC-006', pos: true, description: 'Smart watches & wrist watches', status: 'Active', updated: 'Apr 12, 2024' }
];

const categoriesList = ['Footwear', 'Apparel', 'Electronics', 'Accessories', 'Bags'];

export default function ProductSubCategoriesPage() {
  const [subCategories, setSubCategories] = useState(initialSubCategories);
  const [search, setSearch] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  
  // Modal Form State
  const [modalName, setModalName] = useState('');
  const [modalParent, setModalParent] = useState(categoriesList[0]);
  const [modalCode, setModalCode] = useState('');
  const [modalDesc, setModalDesc] = useState('');
  const [modalPos, setModalPos] = useState(true);
  const [modalStatus, setModalStatus] = useState('Active');
  const [editingId, setEditingId] = useState(null);
  const [deletingId, setDeletingId] = useState(null);

  useEffect(() => {
    if (window.lucide) {
      window.lucide.createIcons();
    }
  }, [subCategories]);

  const handleDelete = () => {
    setSubCategories(prev => prev.filter(sc => sc.id !== deletingId));
    // Close modal manually
    const modalElement = document.getElementById('deleteModal');
    const modalInstance = window.bootstrap?.Modal?.getInstance(modalElement);
    modalInstance?.hide();
    setDeletingId(null);
  };

  const handlePosToggle = (id) => {
    setSubCategories(prev => prev.map(sc => sc.id === id ? { ...sc, pos: !sc.pos } : sc));
  };

  const handleFormSubmit = (e) => {
    e.preventDefault();
    if (editingId) {
      // Edit mode
      setSubCategories(prev => prev.map(sc => sc.id === editingId ? {
        ...sc,
        name: modalName,
        category: modalParent,
        code: modalCode,
        description: modalDesc,
        pos: modalPos,
        status: modalStatus,
        updated: new Date().toLocaleDateString('en-US', { month: 'short', day: '2-digit', year: 'numeric' })
      } : sc));
    } else {
      // Add mode
      const newSub = {
        id: subCategories.length + 1,
        name: modalName,
        category: modalParent,
        code: modalCode,
        description: modalDesc,
        pos: modalPos,
        status: modalStatus,
        updated: new Date().toLocaleDateString('en-US', { month: 'short', day: '2-digit', year: 'numeric' })
      };
      setSubCategories(prev => [...prev, newSub]);
    }

    // Reset Form and close modal
    setModalName('');
    setModalCode('');
    setModalDesc('');
    setModalPos(true);
    setModalStatus('Active');
    setEditingId(null);

    const modalElement = document.getElementById('addSubCategoryModal');
    const modalInstance = window.bootstrap?.Modal?.getInstance(modalElement);
    modalInstance?.hide();
  };

  const openEditModal = (item) => {
    setEditingId(item.id);
    setModalName(item.name);
    setModalParent(item.category);
    setModalCode(item.code);
    setModalDesc(item.description);
    setModalPos(item.pos);
    setModalStatus(item.status);
    
    const modalElement = document.getElementById('addSubCategoryModal');
    const modalInstance = new window.bootstrap.Modal(modalElement);
    modalInstance.show();
  };

  const openAddModal = () => {
    setEditingId(null);
    setModalName('');
    setModalParent(categoriesList[0]);
    setModalCode('');
    setModalDesc('');
    setModalPos(true);
    setModalStatus('Active');

    const modalElement = document.getElementById('addSubCategoryModal');
    const modalInstance = new window.bootstrap.Modal(modalElement);
    modalInstance.show();
  };

  const filteredSubs = subCategories.filter(sc => {
    const matchesSearch = sc.name.toLowerCase().includes(search.toLowerCase()) || sc.code.toLowerCase().includes(search.toLowerCase());
    const matchesCategory = categoryFilter === 'all' || sc.category.toLowerCase() === categoryFilter.toLowerCase();
    const matchesStatus = statusFilter === 'all' || sc.status.toLowerCase() === statusFilter.toLowerCase();
    return matchesSearch && matchesCategory && matchesStatus;
  });

  return (
    <div className="container-fluid">
      <PageBreadcrumb title="Sub Categories" breadcrumbs={[{ label: 'Dashboard', href: ROUTES.DASHBOARD }, { label: 'Products' }, { label: 'Sub Categories' }]} />

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
              <div className="d-flex gap-3 ms-auto flex-wrap flex-md-nowrap">
                <select className="form-select min-w-40" value={statusFilter} onChange={e => setStatusFilter(e.target.value)}>
                  <option value="all">All Status</option>
                  <option value="active">Active</option>
                  <option value="inactive">Inactive</option>
                </select>
                <select className="form-select min-w-44" value={categoryFilter} onChange={e => setCategoryFilter(e.target.value)}>
                  <option value="all">All Parent Categories</option>
                  {categoriesList.map(cat => (
                    <option key={cat} value={cat}>{cat}</option>
                  ))}
                </select>
                <button type="button" className="btn btn-primary flex-shrink-0 d-flex align-items-center gap-1" onClick={openAddModal}>
                  <i data-lucide="plus" className="size-4"></i> Add Categories
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
                      <th className="fw-medium text-muted">Sub Category</th>
                      <th className="fw-medium text-muted">Category</th>
                      <th className="fw-medium text-muted">Code</th>
                      <th className="fw-medium text-muted">POS</th>
                      <th className="fw-medium text-muted">Description</th>
                      <th className="fw-medium text-muted">Status</th>
                      <th className="fw-medium text-muted">Updated</th>
                      <th className="fw-medium text-muted">Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredSubs.map(item => (
                      <tr key={item.id}>
                        <td>
                          <div className="form-check check-primary">
                            <input className="form-check-input" type="checkbox" id={`check_${item.id}`} />
                          </div>
                        </td>
                        <td><span className="fw-semibold text-reset">{item.name}</span></td>
                        <td>{item.category}</td>
                        <td><span className="fw-semibold text-primary">{item.code}</span></td>
                        <td>
                          <div className="form-switch switch-light-secondary">
                            <input type="checkbox" id={`pos_${item.id}`} checked={item.pos} onChange={() => handlePosToggle(item.id)} />
                            <label className="label" htmlFor={`pos_${item.id}`}></label>
                          </div>
                        </td>
                        <td>{item.description}</td>
                        <td>
                          <span className={`badge bg-${item.status === 'Active' ? 'success' : 'danger'}-subtle text-${item.status === 'Active' ? 'success' : 'danger'}`}>
                            {item.status}
                          </span>
                        </td>
                        <td className="text-muted">{item.updated}</td>
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
                    Showing <b className="me-1">1-{filteredSubs.length}</b> of <b className="ms-1">{filteredSubs.length}</b> Results
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Add/Edit Modal */}
      <div className="modal fade" id="addSubCategoryModal" tabIndex="-1" aria-labelledby="addSubCategoryModalLabel" aria-hidden="true">
        <div className="modal-dialog modal-dialog-centered">
          <div className="modal-content">
            <div className="modal-header">
              <h6 className="modal-title" id="addSubCategoryModalLabel">{editingId ? 'Edit Sub Category' : 'Add New Sub Category'}</h6>
              <button type="button" className="btn-close" data-bs-dismiss="modal"></button>
            </div>
            <div className="modal-body">
              <form onSubmit={handleFormSubmit}>
                <div className="mb-3">
                  <label className="form-label">Sub Category Name <span className="text-danger">*</span></label>
                  <input type="text" className="form-control" placeholder="Enter Name" value={modalName} onChange={e => setModalName(e.target.value)} required />
                </div>
                <div className="mb-3">
                  <label className="form-label">Parent Category <span className="text-danger">*</span></label>
                  <select className="form-select" value={modalParent} onChange={e => setModalParent(e.target.value)}>
                    {categoriesList.map(cat => (
                      <option key={cat} value={cat}>{cat}</option>
                    ))}
                  </select>
                </div>
                <div className="mb-3">
                  <label className="form-label">Code <span className="text-danger">*</span></label>
                  <input type="text" className="form-control" placeholder="Enter Code" value={modalCode} onChange={e => setModalCode(e.target.value)} required />
                </div>
                <div className="mb-3">
                  <label className="form-label">Description</label>
                  <textarea className="form-control" placeholder="Enter Description" rows="3" value={modalDesc} onChange={e => setModalDesc(e.target.value)}></textarea>
                </div>
                <div className="mb-3 d-flex align-items-center gap-3">
                  <div>Show on POS</div>
                  <div className="form-switch switch-light-secondary">
                    <input type="checkbox" id="modalPos" checked={modalPos} onChange={e => setModalPos(e.target.checked)} />
                    <label className="label" htmlFor="modalPos"></label>
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
                  <button type="submit" className="btn btn-primary w-100">{editingId ? 'Save Changes' : 'Add Sub Category'}</button>
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
            <h5 className="mb-4 lh-base">Are you sure you want to delete this Sub Category?</h5>
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
