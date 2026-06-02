// pages/Dashboard/Staff/StaffAttendancePage.jsx
import React, { useEffect, useState } from 'react';
import PageBreadcrumb from '../../../components/ui/PageBreadcrumb';
import { ROUTES } from '../../../configs/routes';

const initialAttendance = [
  { id: 1, name: 'Lucas Ethan', role: 'Store Manager', date: '30-05-2026', clockIn: '08:00 AM', clockOut: '05:00 PM', hours: 9, status: 'Present' },
  { id: 2, name: 'Emily Johnson', role: 'Cashier', date: '30-05-2026', clockIn: '08:15 AM', clockOut: '05:00 PM', hours: 8.75, status: 'Late' },
  { id: 3, name: 'Michael Davis', role: 'Sales Assistant', date: '30-05-2026', clockIn: '--:--', clockOut: '--:--', hours: 0, status: 'Absent' }
];

export default function StaffAttendancePage() {
  const [attendance, setAttendance] = useState(initialAttendance);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  // Modal State
  const [modalName, setModalName] = useState('');
  const [modalClockIn, setModalClockIn] = useState('');
  const [modalClockOut, setModalClockOut] = useState('');
  const [modalStatus, setModalStatus] = useState('Present');
  
  const [editingId, setEditingId] = useState(null);
  const [deletingId, setDeletingId] = useState(null);

  useEffect(() => {
    if (window.lucide) {
      window.lucide.createIcons();
    }
  }, [attendance]);

  const handleDelete = () => {
    setAttendance(prev => prev.filter(a => a.id !== deletingId));
    const modalElement = document.getElementById('deleteModal');
    const modalInstance = window.bootstrap?.Modal?.getInstance(modalElement);
    modalInstance?.hide();
    setDeletingId(null);
  };

  const handleFormSubmit = (e) => {
    e.preventDefault();

    let calculatedHours = 0;
    if (modalClockIn && modalClockOut && modalClockIn !== '--:--' && modalClockOut !== '--:--') {
      const parseTime = (t) => {
        const [time, modifier] = t.split(' ');
        let [hours, minutes] = time.split(':').map(Number);
        if (modifier === 'PM' && hours < 12) hours += 12;
        if (modifier === 'AM' && hours === 12) hours = 0;
        return hours + minutes / 60;
      };
      try {
        calculatedHours = Math.max(0, parseTime(modalClockOut) - parseTime(modalClockIn));
      } catch (err) {
        calculatedHours = 8;
      }
    }

    if (editingId) {
      setAttendance(prev => prev.map(a => a.id === editingId ? {
        ...a,
        name: modalName,
        clockIn: modalClockIn || '--:--',
        clockOut: modalClockOut || '--:--',
        hours: calculatedHours,
        status: modalStatus,
      } : a));
    } else {
      const newAttendance = {
        id: attendance.length > 0 ? Math.max(...attendance.map(a => a.id)) + 1 : 1,
        name: modalName,
        role: 'Staff Member',
        date: new Date().toLocaleDateString('en-GB').replace(/\//g, '-'),
        clockIn: modalClockIn || '--:--',
        clockOut: modalClockOut || '--:--',
        hours: calculatedHours,
        status: modalStatus,
      };
      setAttendance(prev => [...prev, newAttendance]);
    }

    resetForm();

    const modalElement = document.getElementById('addAttendanceModal');
    const modalInstance = window.bootstrap?.Modal?.getInstance(modalElement);
    modalInstance?.hide();
  };

  const resetForm = () => {
    setModalName('');
    setModalClockIn('');
    setModalClockOut('');
    setModalStatus('Present');
    setEditingId(null);
  };

  const openEditModal = (item) => {
    setEditingId(item.id);
    setModalName(item.name);
    setModalClockIn(item.clockIn);
    setModalClockOut(item.clockOut);
    setModalStatus(item.status);

    const modalElement = document.getElementById('addAttendanceModal');
    const modalInstance = new window.bootstrap.Modal(modalElement);
    modalInstance.show();
  };

  const openAddModal = () => {
    resetForm();
    const modalElement = document.getElementById('addAttendanceModal');
    const modalInstance = new window.bootstrap.Modal(modalElement);
    modalInstance.show();
  };

  const filteredAttendance = attendance.filter(a => {
    const matchesSearch = a.name.toLowerCase().includes(search.toLowerCase()) || 
                          a.role.toLowerCase().includes(search.toLowerCase());
    const matchesStatus = statusFilter === 'all' || a.status.toLowerCase() === statusFilter.toLowerCase();
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="container-fluid">
      <PageBreadcrumb title="Attendance" breadcrumbs={[{ label: 'Dashboard', href: ROUTES.DASHBOARD }, { label: 'Staff' }, { label: 'Attendance' }]} />

      <div className="card">
        <div className="card-header d-flex flex-wrap gap-3 justify-content-between align-items-center">
          <h5 className="card-title mb-0">Staff Attendance</h5>
          <div className="d-flex flex-wrap gap-2 align-items-center ms-auto">
            <div className="position-relative">
              <input type="text" className="form-control ps-9" placeholder="Search Staff..." value={search} onChange={e => setSearch(e.target.value)} />
              <i data-lucide="search" className="size-4 icon-dark position-absolute top-50 start-0 ms-3 translate-middle-y"></i>
            </div>
            <select className="form-select w-36" value={statusFilter} onChange={e => setStatusFilter(e.target.value)}>
              <option value="all">All Status</option>
              <option value="present">Present</option>
              <option value="absent">Absent</option>
              <option value="late">Late</option>
            </select>
            <button className="btn btn-primary d-flex align-items-center gap-1" onClick={openAddModal}>
              <i className="ri-add-line fs-lg"></i> Add Attendance
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
                  <th className="fw-medium text-muted">Staff Member</th>
                  <th className="fw-medium text-muted">Date</th>
                  <th className="fw-medium text-muted">Clock In</th>
                  <th className="fw-medium text-muted">Clock Out</th>
                  <th className="fw-medium text-muted">Total Hours</th>
                  <th className="fw-medium text-muted">Status</th>
                  <th className="fw-medium text-muted">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredAttendance.length === 0 ? (
                  <tr>
                    <td colSpan="8" className="text-center text-muted py-4">No records found.</td>
                  </tr>
                ) : (
                  filteredAttendance.map(item => (
                    <tr key={item.id}>
                      <td>
                        <div className="form-check check-primary">
                          <input className="form-check-input" type="checkbox" id={`check_${item.id}`} />
                        </div>
                      </td>
                      <td>
                        <div className="d-flex align-items-center gap-2">
                          <div className="avatar size-9 rounded-circle bg-light d-flex align-items-center justify-content-center">
                            <i className="ri-user-follow-line text-muted"></i>
                          </div>
                          <div>
                            <div className="fw-semibold text-reset">{item.name}</div>
                            <div className="text-muted fs-sm">{item.role}</div>
                          </div>
                        </div>
                      </td>
                      <td className="text-muted">{item.date}</td>
                      <td>{item.clockIn}</td>
                      <td>{item.clockOut}</td>
                      <td>{item.hours > 0 ? `${item.hours.toFixed(2)} hrs` : '--'}</td>
                      <td>
                        <span className={`badge bg-${item.status === 'Present' ? 'success' : item.status === 'Late' ? 'warning' : 'danger'}-subtle text-${item.status === 'Present' ? 'success' : item.status === 'Late' ? 'warning' : 'danger'}`}>
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

      {/* Add/Edit Attendance Modal */}
      <div className="modal fade" id="addAttendanceModal" tabIndex="-1" aria-labelledby="addAttendanceModalLabel" aria-hidden="true">
        <div className="modal-dialog modal-dialog-centered">
          <div className="modal-content">
            <div className="modal-header">
              <h6 className="modal-title" id="addAttendanceModalLabel">{editingId ? 'Edit Attendance' : 'Add Attendance'}</h6>
              <button type="button" className="btn-close" data-bs-dismiss="modal"></button>
            </div>
            <div className="modal-body">
              <form onSubmit={handleFormSubmit}>
                <div className="mb-3">
                  <label className="form-label">Staff Member Name <span className="text-danger">*</span></label>
                  <input type="text" className="form-control" placeholder="e.g., Lucas Ethan" value={modalName} onChange={e => setModalName(e.target.value)} required />
                </div>
                <div className="mb-3">
                  <label className="form-label">Clock In Time (e.g., 08:00 AM)</label>
                  <input type="text" className="form-control" placeholder="08:00 AM" value={modalClockIn} onChange={e => setModalClockIn(e.target.value)} />
                </div>
                <div className="mb-3">
                  <label className="form-label">Clock Out Time (e.g., 05:00 PM)</label>
                  <input type="text" className="form-control" placeholder="05:00 PM" value={modalClockOut} onChange={e => setModalClockOut(e.target.value)} />
                </div>
                <div className="mb-3">
                  <label className="form-label">Status</label>
                  <select className="form-select" value={modalStatus} onChange={e => setModalStatus(e.target.value)}>
                    <option value="Present">Present</option>
                    <option value="Late">Late</option>
                    <option value="Absent">Absent</option>
                  </select>
                </div>
                <div className="d-flex gap-2 mt-7">
                  <button type="button" className="btn btn-light w-100" data-bs-dismiss="modal">Close</button>
                  <button type="submit" className="btn btn-primary w-100">{editingId ? 'Save Changes' : 'Submit Attendance'}</button>
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
            <h5 className="mb-4 lh-base">Are you sure you want to delete this Attendance?</h5>
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
