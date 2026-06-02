// pages/Dashboard/Staff/StaffHolidaysPage.jsx
import React, { useEffect, useState } from 'react';
import PageBreadcrumb from '../../../components/ui/PageBreadcrumb';
import { ROUTES } from '../../../configs/routes';

const initialHolidays = [
  { id: 1, name: 'New Year Day', startDate: '01-01-2026', endDate: '01-01-2026', totalDays: 1, desc: 'Official holiday for New Year Day', status: 'Completed' },
  { id: 2, name: 'Labor Day', startDate: '01-05-2026', endDate: '01-05-2026', totalDays: 1, desc: 'International Workers\' Day', status: 'Completed' },
  { id: 3, name: 'Christmas Holiday', startDate: '24-12-2026', endDate: '26-12-2026', totalDays: 3, desc: 'Christmas Eve, Christmas Day and Boxing Day', status: 'Active' }
];

export default function StaffHolidaysPage() {
  const [holidays, setHolidays] = useState(initialHolidays);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  // Modal State
  const [modalName, setModalName] = useState('');
  const [modalStart, setModalStart] = useState('');
  const [modalEnd, setModalEnd] = useState('');
  const [modalDays, setModalDays] = useState('');
  const [modalDesc, setModalDesc] = useState('');
  const [modalStatus, setModalStatus] = useState('Active');
  
  const [editingId, setEditingId] = useState(null);
  const [deletingId, setDeletingId] = useState(null);

  useEffect(() => {
    if (window.lucide) {
      window.lucide.createIcons();
    }
  }, [holidays]);

  const handleDelete = () => {
    setHolidays(prev => prev.filter(h => h.id !== deletingId));
    const modalElement = document.getElementById('deleteModal');
    const modalInstance = window.bootstrap?.Modal?.getInstance(modalElement);
    modalInstance?.hide();
    setDeletingId(null);
  };

  const handleFormSubmit = (e) => {
    e.preventDefault();

    if (editingId) {
      setHolidays(prev => prev.map(h => h.id === editingId ? {
        ...h,
        name: modalName,
        startDate: modalStart,
        endDate: modalEnd,
        totalDays: parseInt(modalDays) || 1,
        desc: modalDesc,
        status: modalStatus,
      } : h));
    } else {
      const newHoliday = {
        id: holidays.length > 0 ? Math.max(...holidays.map(h => h.id)) + 1 : 1,
        name: modalName,
        startDate: modalStart,
        endDate: modalEnd,
        totalDays: parseInt(modalDays) || 1,
        desc: modalDesc,
        status: modalStatus,
      };
      setHolidays(prev => [...prev, newHoliday]);
    }

    resetForm();

    const modalElement = document.getElementById('addHolidayModal');
    const modalInstance = window.bootstrap?.Modal?.getInstance(modalElement);
    modalInstance?.hide();
  };

  const resetForm = () => {
    setModalName('');
    setModalStart('');
    setModalEnd('');
    setModalDays('');
    setModalDesc('');
    setModalStatus('Active');
    setEditingId(null);
  };

  const openEditModal = (item) => {
    setEditingId(item.id);
    setModalName(item.name);
    setModalStart(item.startDate);
    setModalEnd(item.endDate);
    setModalDays(item.totalDays.toString());
    setModalDesc(item.desc);
    setModalStatus(item.status);

    const modalElement = document.getElementById('addHolidayModal');
    const modalInstance = new window.bootstrap.Modal(modalElement);
    modalInstance.show();
  };

  const openAddModal = () => {
    resetForm();
    const modalElement = document.getElementById('addHolidayModal');
    const modalInstance = new window.bootstrap.Modal(modalElement);
    modalInstance.show();
  };

  const filteredHolidays = holidays.filter(h => {
    const matchesSearch = h.name.toLowerCase().includes(search.toLowerCase()) || 
                          h.desc.toLowerCase().includes(search.toLowerCase());
    const matchesStatus = statusFilter === 'all' || h.status.toLowerCase() === statusFilter.toLowerCase();
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="container-fluid">
      <PageBreadcrumb title="Holidays" breadcrumbs={[{ label: 'Dashboard', href: ROUTES.DASHBOARD }, { label: 'Staff' }, { label: 'Holidays' }]} />

      <div className="card">
        <div className="card-header d-flex flex-wrap gap-3 justify-content-between align-items-center">
          <h5 className="card-title mb-0">Holidays List</h5>
          <div className="d-flex flex-wrap gap-2 align-items-center ms-auto">
            <div className="position-relative">
              <input type="text" className="form-control ps-9" placeholder="Search Holidays..." value={search} onChange={e => setSearch(e.target.value)} />
              <i data-lucide="search" className="size-4 icon-dark position-absolute top-50 start-0 ms-3 translate-middle-y"></i>
            </div>
            <select className="form-select w-36" value={statusFilter} onChange={e => setStatusFilter(e.target.value)}>
              <option value="all">All Status</option>
              <option value="active">Active</option>
              <option value="completed">Completed</option>
            </select>
            <button className="btn btn-primary d-flex align-items-center gap-1" onClick={openAddModal}>
              <i className="ri-add-line fs-lg"></i> Add Holiday
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
                  <th className="fw-medium text-muted">Holiday Name</th>
                  <th className="fw-medium text-muted">Start Date</th>
                  <th className="fw-medium text-muted">End Date</th>
                  <th className="fw-medium text-muted">No. of Days</th>
                  <th className="fw-medium text-muted">Description</th>
                  <th className="fw-medium text-muted">Status</th>
                  <th className="fw-medium text-muted">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredHolidays.length === 0 ? (
                  <tr>
                    <td colSpan="8" className="text-center text-muted py-4">No holidays found.</td>
                  </tr>
                ) : (
                  filteredHolidays.map(item => (
                    <tr key={item.id}>
                      <td>
                        <div className="form-check check-primary">
                          <input className="form-check-input" type="checkbox" id={`check_${item.id}`} />
                        </div>
                      </td>
                      <td><span className="fw-semibold text-reset">{item.name}</span></td>
                      <td className="text-muted">{item.startDate}</td>
                      <td className="text-muted">{item.endDate}</td>
                      <td>{item.totalDays} days</td>
                      <td className="text-wrap" style={{ maxWidth: '250px' }}>{item.desc}</td>
                      <td>
                        <span className={`badge bg-${item.status === 'Active' ? 'success' : 'secondary'}-subtle text-${item.status === 'Active' ? 'success' : 'secondary'}`}>
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

      {/* Add/Edit Holiday Modal */}
      <div className="modal fade" id="addHolidayModal" tabIndex="-1" aria-labelledby="addHolidayModalLabel" aria-hidden="true">
        <div className="modal-dialog modal-dialog-centered">
          <div className="modal-content">
            <div className="modal-header">
              <h6 className="modal-title" id="addHolidayModalLabel">{editingId ? 'Edit Holiday' : 'Add New Holiday'}</h6>
              <button type="button" className="btn-close" data-bs-dismiss="modal"></button>
            </div>
            <div className="modal-body">
              <form onSubmit={handleFormSubmit}>
                <div className="mb-3">
                  <label className="form-label">Holiday Name <span className="text-danger">*</span></label>
                  <input type="text" className="form-control" placeholder="e.g., Christmas" value={modalName} onChange={e => setModalName(e.target.value)} required />
                </div>
                <div className="row">
                  <div className="col-md-6 mb-3">
                    <label className="form-label">Start Date <span className="text-danger">*</span></label>
                    <input type="text" className="form-control" placeholder="dd-mm-yyyy" value={modalStart} onChange={e => setModalStart(e.target.value)} required />
                  </div>
                  <div className="col-md-6 mb-3">
                    <label className="form-label">End Date <span className="text-danger">*</span></label>
                    <input type="text" className="form-control" placeholder="dd-mm-yyyy" value={modalEnd} onChange={e => setModalEnd(e.target.value)} required />
                  </div>
                </div>
                <div className="mb-3">
                  <label className="form-label">Number of Days <span className="text-danger">*</span></label>
                  <input type="number" className="form-control" placeholder="1" min="1" value={modalDays} onChange={e => setModalDays(e.target.value)} required />
                </div>
                <div className="mb-3">
                  <label className="form-label">Description</label>
                  <textarea className="form-control" placeholder="Enter description..." rows="3" value={modalDesc} onChange={e => setModalDesc(e.target.value)}></textarea>
                </div>
                <div className="mb-3">
                  <label className="form-label">Status</label>
                  <select className="form-select" value={modalStatus} onChange={e => setModalStatus(e.target.value)}>
                    <option value="Active">Active</option>
                    <option value="Completed">Completed</option>
                  </select>
                </div>
                <div className="d-flex gap-2 mt-7">
                  <button type="button" className="btn btn-light w-100" data-bs-dismiss="modal">Close</button>
                  <button type="submit" className="btn btn-primary w-100">{editingId ? 'Save Changes' : 'Add Holiday'}</button>
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
            <h5 className="mb-4 lh-base">Are you sure you want to delete this Holiday?</h5>
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
