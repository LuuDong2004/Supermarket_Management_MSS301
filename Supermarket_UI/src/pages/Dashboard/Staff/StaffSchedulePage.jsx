// pages/Dashboard/Staff/StaffSchedulePage.jsx
import React, { useEffect, useState } from 'react';
import PageBreadcrumb from '../../../components/ui/PageBreadcrumb';
import { ROUTES } from '../../../configs/routes';

const initialSchedules = [
  { id: 1, name: 'Lucas Ethan', role: 'Store Manager', shift: 'Morning Shift (08:00 AM - 04:00 PM)', mon: 'Present', tue: 'Present', wed: 'Present', thu: 'Present', fri: 'Present', sat: 'Off', sun: 'Off' },
  { id: 2, name: 'Emily Johnson', role: 'Cashier', shift: 'Evening Shift (04:00 PM - 12:00 AM)', mon: 'Present', tue: 'Present', wed: 'Present', thu: 'Off', fri: 'Present', sat: 'Present', sun: 'Off' },
  { id: 3, name: 'Michael Davis', role: 'Sales Assistant', shift: 'Night Shift (12:00 AM - 08:00 AM)', mon: 'Off', tue: 'Present', wed: 'Present', thu: 'Present', fri: 'Present', sat: 'Present', sun: 'Present' }
];

const shiftsList = [
  'Morning Shift (08:00 AM - 04:00 PM)',
  'Evening Shift (04:00 PM - 12:00 AM)',
  'Night Shift (12:00 AM - 08:00 AM)'
];

export default function StaffSchedulePage() {
  const [schedules, setSchedules] = useState(initialSchedules);
  const [search, setSearch] = useState('');
  const [shiftFilter, setShiftFilter] = useState('all');

  // Modal State
  const [modalName, setModalName] = useState('');
  const [modalShift, setModalShift] = useState(shiftsList[0]);
  const [modalMon, setModalMon] = useState('Present');
  const [modalTue, setModalTue] = useState('Present');
  const [modalWed, setModalWed] = useState('Present');
  const [modalThu, setModalThu] = useState('Present');
  const [modalFri, setModalFri] = useState('Present');
  const [modalSat, setModalSat] = useState('Off');
  const [modalSun, setModalSun] = useState('Off');
  
  const [editingId, setEditingId] = useState(null);
  const [deletingId, setDeletingId] = useState(null);

  useEffect(() => {
    if (window.lucide) {
      window.lucide.createIcons();
    }
  }, [schedules]);

  const handleDelete = () => {
    setSchedules(prev => prev.filter(s => s.id !== deletingId));
    const modalElement = document.getElementById('deleteModal');
    const modalInstance = window.bootstrap?.Modal?.getInstance(modalElement);
    modalInstance?.hide();
    setDeletingId(null);
  };

  const handleFormSubmit = (e) => {
    e.preventDefault();

    if (editingId) {
      setSchedules(prev => prev.map(s => s.id === editingId ? {
        ...s,
        name: modalName,
        shift: modalShift,
        mon: modalMon,
        tue: modalTue,
        wed: modalWed,
        thu: modalThu,
        fri: modalFri,
        sat: modalSat,
        sun: modalSun,
      } : s));
    } else {
      const newSchedule = {
        id: schedules.length > 0 ? Math.max(...schedules.map(s => s.id)) + 1 : 1,
        name: modalName,
        role: 'Staff Member',
        shift: modalShift,
        mon: modalMon,
        tue: modalTue,
        wed: modalWed,
        thu: modalThu,
        fri: modalFri,
        sat: modalSat,
        sun: modalSun,
      };
      setSchedules(prev => [...prev, newSchedule]);
    }

    resetForm();

    const modalElement = document.getElementById('addScheduleModal');
    const modalInstance = window.bootstrap?.Modal?.getInstance(modalElement);
    modalInstance?.hide();
  };

  const resetForm = () => {
    setModalName('');
    setModalShift(shiftsList[0]);
    setModalMon('Present');
    setModalTue('Present');
    setModalWed('Present');
    setModalThu('Present');
    setModalFri('Present');
    setModalSat('Off');
    setModalSun('Off');
    setEditingId(null);
  };

  const openEditModal = (item) => {
    setEditingId(item.id);
    setModalName(item.name);
    setModalShift(item.shift);
    setModalMon(item.mon);
    setModalTue(item.tue);
    setModalWed(item.wed);
    setModalThu(item.thu);
    setModalFri(item.fri);
    setModalSat(item.sat);
    setModalSun(item.sun);

    const modalElement = document.getElementById('addScheduleModal');
    const modalInstance = new window.bootstrap.Modal(modalElement);
    modalInstance.show();
  };

  const openAddModal = () => {
    resetForm();
    const modalElement = document.getElementById('addScheduleModal');
    const modalInstance = new window.bootstrap.Modal(modalElement);
    modalInstance.show();
  };

  const filteredSchedules = schedules.filter(s => {
    const matchesSearch = s.name.toLowerCase().includes(search.toLowerCase()) || 
                          s.role.toLowerCase().includes(search.toLowerCase());
    const matchesShift = shiftFilter === 'all' || s.shift.toLowerCase().includes(shiftFilter.toLowerCase());
    return matchesSearch && matchesShift;
  });

  const getStatusBadge = (status) => {
    return status === 'Present' 
      ? 'bg-success-subtle text-success border border-success-subtle' 
      : 'bg-secondary-subtle text-secondary border border-secondary-subtle';
  };

  return (
    <div className="container-fluid">
      <PageBreadcrumb title="Schedule" breadcrumbs={[{ label: 'Dashboard', href: ROUTES.DASHBOARD }, { label: 'Staff' }, { label: 'Schedule' }]} />

      <div className="card">
        <div className="card-header d-flex flex-wrap gap-3 justify-content-between align-items-center">
          <h5 className="card-title mb-0">Staff Weekly Schedules</h5>
          <div className="d-flex flex-wrap gap-2 align-items-center ms-auto">
            <div className="position-relative">
              <input type="text" className="form-control ps-9" placeholder="Search Staff..." value={search} onChange={e => setSearch(e.target.value)} />
              <i data-lucide="search" className="size-4 icon-dark position-absolute top-50 start-0 ms-3 translate-middle-y"></i>
            </div>
            <select className="form-select w-44" value={shiftFilter} onChange={e => setShiftFilter(e.target.value)}>
              <option value="all">All Shifts</option>
              <option value="morning">Morning Shift</option>
              <option value="evening">Evening Shift</option>
              <option value="night">Night Shift</option>
            </select>
            <button className="btn btn-primary d-flex align-items-center gap-1" onClick={openAddModal}>
              <i className="ri-add-line fs-lg"></i> Add Schedule
            </button>
          </div>
        </div>
        <div className="card-body pt-0">
          <div className="table-card table-responsive">
            <table className="table align-middle text-nowrap mb-0 text-center">
              <thead>
                <tr className="bg-light border-bottom">
                  <th className="text-start fw-medium text-muted">Staff Member</th>
                  <th className="fw-medium text-muted">Shift</th>
                  <th className="fw-medium text-muted">Mon</th>
                  <th className="fw-medium text-muted">Tue</th>
                  <th className="fw-medium text-muted">Wed</th>
                  <th className="fw-medium text-muted">Thu</th>
                  <th className="fw-medium text-muted">Fri</th>
                  <th className="fw-medium text-muted">Sat</th>
                  <th className="fw-medium text-muted">Sun</th>
                  <th className="fw-medium text-muted">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredSchedules.length === 0 ? (
                  <tr>
                    <td colSpan="10" className="text-center text-muted py-4">No records found.</td>
                  </tr>
                ) : (
                  filteredSchedules.map(item => (
                    <tr key={item.id}>
                      <td className="text-start">
                        <div className="d-flex align-items-center gap-2">
                          <div className="avatar size-9 rounded-circle bg-light d-flex align-items-center justify-content-center">
                            <i className="ri-calendar-2-line text-muted"></i>
                          </div>
                          <div>
                            <div className="fw-semibold text-reset">{item.name}</div>
                            <div className="text-muted fs-sm">{item.role}</div>
                          </div>
                        </div>
                      </td>
                      <td>{item.shift}</td>
                      <td><span className={`badge ${getStatusBadge(item.mon)}`}>{item.mon}</span></td>
                      <td><span className={`badge ${getStatusBadge(item.tue)}`}>{item.tue}</span></td>
                      <td><span className={`badge ${getStatusBadge(item.wed)}`}>{item.wed}</span></td>
                      <td><span className={`badge ${getStatusBadge(item.thu)}`}>{item.thu}</span></td>
                      <td><span className={`badge ${getStatusBadge(item.fri)}`}>{item.fri}</span></td>
                      <td><span className={`badge ${getStatusBadge(item.sat)}`}>{item.sat}</span></td>
                      <td><span className={`badge ${getStatusBadge(item.sun)}`}>{item.sun}</span></td>
                      <td>
                        <div className="d-flex gap-2 justify-content-center">
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

      {/* Add/Edit Schedule Modal */}
      <div className="modal fade" id="addScheduleModal" tabIndex="-1" aria-labelledby="addScheduleModalLabel" aria-hidden="true">
        <div className="modal-dialog modal-dialog-centered">
          <div className="modal-content">
            <div className="modal-header">
              <h6 className="modal-title" id="addScheduleModalLabel">{editingId ? 'Edit Weekly Schedule' : 'Add Weekly Schedule'}</h6>
              <button type="button" className="btn-close" data-bs-dismiss="modal"></button>
            </div>
            <div className="modal-body">
              <form onSubmit={handleFormSubmit}>
                <div className="mb-3">
                  <label className="form-label">Staff Member Name <span className="text-danger">*</span></label>
                  <input type="text" className="form-control" placeholder="e.g., Lucas Ethan" value={modalName} onChange={e => setModalName(e.target.value)} required />
                </div>
                <div className="mb-3">
                  <label className="form-label">Shift <span className="text-danger">*</span></label>
                  <select className="form-select" value={modalShift} onChange={e => setModalShift(e.target.value)}>
                    {shiftsList.map(s => (
                      <option key={s} value={s}>{s}</option>
                    ))}
                  </select>
                </div>
                
                <h6 className="fs-sm mb-3 text-dark border-bottom pb-2">Shift Duties (Mon-Sun)</h6>
                <div className="row g-2">
                  <div className="col-4 mb-2">
                    <label className="form-label fs-xs">Mon</label>
                    <select className="form-select form-select-sm" value={modalMon} onChange={e => setModalMon(e.target.value)}>
                      <option value="Present">Present</option>
                      <option value="Off">Off</option>
                    </select>
                  </div>
                  <div className="col-4 mb-2">
                    <label className="form-label fs-xs">Tue</label>
                    <select className="form-select form-select-sm" value={modalTue} onChange={e => setModalTue(e.target.value)}>
                      <option value="Present">Present</option>
                      <option value="Off">Off</option>
                    </select>
                  </div>
                  <div className="col-4 mb-2">
                    <label className="form-label fs-xs">Wed</label>
                    <select className="form-select form-select-sm" value={modalWed} onChange={e => setModalWed(e.target.value)}>
                      <option value="Present">Present</option>
                      <option value="Off">Off</option>
                    </select>
                  </div>
                  <div className="col-4 mb-2">
                    <label className="form-label fs-xs">Thu</label>
                    <select className="form-select form-select-sm" value={modalThu} onChange={e => setModalThu(e.target.value)}>
                      <option value="Present">Present</option>
                      <option value="Off">Off</option>
                    </select>
                  </div>
                  <div className="col-4 mb-2">
                    <label className="form-label fs-xs">Fri</label>
                    <select className="form-select form-select-sm" value={modalFri} onChange={e => setModalFri(e.target.value)}>
                      <option value="Present">Present</option>
                      <option value="Off">Off</option>
                    </select>
                  </div>
                  <div className="col-4 mb-2">
                    <label className="form-label fs-xs">Sat</label>
                    <select className="form-select form-select-sm" value={modalSat} onChange={e => setModalSat(e.target.value)}>
                      <option value="Present">Present</option>
                      <option value="Off">Off</option>
                    </select>
                  </div>
                  <div className="col-4 mb-2">
                    <label className="form-label fs-xs">Sun</label>
                    <select className="form-select form-select-sm" value={modalSun} onChange={e => setModalSun(e.target.value)}>
                      <option value="Present">Present</option>
                      <option value="Off">Off</option>
                    </select>
                  </div>
                </div>

                <div className="d-flex gap-2 mt-7">
                  <button type="button" className="btn btn-light w-100" data-bs-dismiss="modal">Close</button>
                  <button type="submit" className="btn btn-primary w-100">{editingId ? 'Save Changes' : 'Submit Schedule'}</button>
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
            <h5 className="mb-4 lh-base">Are you sure you want to delete this Schedule?</h5>
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
