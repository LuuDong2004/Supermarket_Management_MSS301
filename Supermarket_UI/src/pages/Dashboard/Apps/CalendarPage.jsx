// pages/Dashboard/Apps/CalendarPage.jsx
import React, { useEffect, useState } from 'react';
import PageBreadcrumb from '../../../components/ui/PageBreadcrumb';
import { ROUTES } from '../../../configs/routes';

const initialEvents = [
  { id: 1, title: 'Weekly Staff Sync', date: '2026-06-05', category: 'Work', color: 'primary' },
  { id: 2, title: 'Supplier Contract Review', date: '2026-06-12', category: 'Meeting', color: 'info' },
  { id: 3, title: 'National Holiday - Shop Closed', date: '2026-06-18', category: 'Holiday', color: 'danger' },
  { id: 4, title: 'Lucas Birthday Party', date: '2026-06-25', category: 'Personal', color: 'success' },
  { id: 5, title: 'Quarterly Inventory Audit', date: '2026-06-08', category: 'Work', color: 'primary' }
];

const categories = [
  { name: 'Work', color: 'primary' },
  { name: 'Meeting', color: 'info' },
  { name: 'Holiday', color: 'danger' },
  { name: 'Personal', color: 'success' }
];

export default function CalendarPage() {
  const [events, setEvents] = useState(initialEvents);
  const [activeCategories, setActiveCategories] = useState(['Work', 'Meeting', 'Holiday', 'Personal']);
  const [showAddModal, setShowAddModal] = useState(false);
  const [selectedDate, setSelectedDate] = useState('');
  const [newEventTitle, setNewEventTitle] = useState('');
  const [newEventCategory, setNewEventCategory] = useState('Work');

  useEffect(() => {
    if (window.lucide) {
      window.lucide.createIcons();
    }
  }, [showAddModal]);

  const toggleCategory = (cat) => {
    setActiveCategories(prev =>
      prev.includes(cat) ? prev.filter(c => c !== cat) : [...prev, cat]
    );
  };

  const handleDayClick = (dayStr) => {
    setSelectedDate(dayStr);
    setShowAddModal(true);
  };

  const handleAddEvent = (e) => {
    e.preventDefault();
    if (!newEventTitle.trim()) return;

    const catObj = categories.find(c => c.name === newEventCategory);
    const newRecord = {
      id: Date.now(),
      title: newEventTitle,
      date: selectedDate,
      category: newEventCategory,
      color: catObj ? catObj.color : 'primary'
    };

    setEvents([...events, newRecord]);
    setNewEventTitle('');
    setShowAddModal(false);
  };

  // Generate calendar days for June 2026 (June 2026 starts on Monday, 30 days)
  const renderCalendarDays = () => {
    const days = [];
    const totalDays = 30;
    const startOffset = 0; // June 1st, 2026 is Monday

    for (let i = 0; i < startOffset; i++) {
      days.push(<div key={`empty-${i}`} className="calendar-day empty border p-2 text-muted bg-light bg-opacity-25" style={{ minHeight: '100px' }}></div>);
    }

    for (let d = 1; d <= totalDays; d++) {
      const dayStr = `2026-06-${d.toString().padStart(2, '0')}`;
      const dayEvents = events.filter(e => e.date === dayStr && activeCategories.includes(e.category));

      days.push(
        <div key={d} className="calendar-day border p-2 cursor-pointer bg-card hover-bg" style={{ minHeight: '100px' }} onClick={() => handleDayClick(dayStr)}>
          <div className="d-flex justify-content-between align-items-center mb-1">
            <span className="fw-semibold fs-14">{d}</span>
          </div>
          <div className="vstack gap-1">
            {dayEvents.map(ev => (
              <span key={ev.id} className={`badge bg-${ev.color}-subtle text-${ev.color} text-truncate w-100 text-start`} title={ev.title} style={{ fontSize: '11px', padding: '3px 6px' }}>
                {ev.title}
              </span>
            ))}
          </div>
        </div>
      );
    }

    return days;
  };

  return (
    <div className="container-fluid">
      <PageBreadcrumb title="Calendar" breadcrumbs={[{ label: 'Dashboard', href: ROUTES.DASHBOARD }, { label: 'Apps' }, { label: 'Calendar' }]} />

      <div className="row g-4">
        {/* Left column: Categories & Filter */}
        <div className="col-lg-3">
          <div className="card h-100">
            <div className="card-header">
              <h5 className="card-title mb-0">Event Categories</h5>
            </div>
            <div className="card-body">
              <p className="text-muted fs-sm">Filter events by categories or click on any calendar day cell to create a new scheduler event.</p>
              
              <div className="vstack gap-2 mt-4">
                {categories.map(cat => {
                  const isChecked = activeCategories.includes(cat.name);
                  return (
                    <div className="d-flex align-items-center justify-content-between p-2 border rounded cursor-pointer" key={cat.name} onClick={() => toggleCategory(cat.name)}>
                      <span className="d-flex align-items-center gap-2">
                        <span className={`size-3 bg-${cat.color} rounded-circle`}></span>
                        <span className="fw-medium">{cat.name} Events</span>
                      </span>
                      <input type="checkbox" className="form-check-input cursor-pointer" checked={isChecked} readOnly />
                    </div>
                  );
                })}
              </div>

              <div className="border-top mt-4 pt-4">
                <h6 className="fw-semibold mb-3">Upcoming Events</h6>
                <div className="vstack gap-3">
                  {events.slice(0, 3).map(ev => (
                    <div className="d-flex align-items-start gap-3" key={ev.id}>
                      <div className={`avatar size-9 rounded bg-${ev.color}-subtle text-${ev.color} d-flex align-items-center justify-content-center flex-shrink-0`}>
                        <i className="ri-calendar-event-line fs-16"></i>
                      </div>
                      <div>
                        <h6 className="mb-0 fs-sm">{ev.title}</h6>
                        <span className="text-muted fs-xs">{ev.date} · {ev.category}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

            </div>
          </div>
        </div>

        {/* Right column: Main Calendar view */}
        <div className="col-lg-9">
          <div className="card">
            <div className="card-header d-flex justify-content-between align-items-center">
              <h5 className="card-title mb-0">June 2026</h5>
              <div className="btn-group">
                <button type="button" className="btn btn-sm btn-outline-primary" disabled><i className="ri-arrow-left-s-line"></i></button>
                <button type="button" className="btn btn-sm btn-outline-primary active">Month</button>
                <button type="button" className="btn btn-sm btn-outline-primary" disabled>Week</button>
                <button type="button" className="btn btn-sm btn-outline-primary" disabled>Day</button>
                <button type="button" className="btn btn-sm btn-outline-primary" disabled><i className="ri-arrow-right-s-line"></i></button>
              </div>
            </div>
            <div className="card-body">
              <div className="grid col-7 g-0 text-center bg-light border py-2 fw-semibold text-muted mb-1" style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)' }}>
                <div>Mon</div>
                <div>Tue</div>
                <div>Wed</div>
                <div>Thu</div>
                <div>Fri</div>
                <div>Sat</div>
                <div>Sun</div>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)' }}>
                {renderCalendarDays()}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Add Event Modal */}
      {showAddModal && (
        <div className="modal fade show d-block" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Create New Event ({selectedDate})</h5>
                <button type="button" className="btn-close" onClick={() => setShowAddModal(false)}></button>
              </div>
              <form onSubmit={handleAddEvent}>
                <div className="modal-body">
                  <div className="mb-3">
                    <label className="form-label">Event Title <span className="text-danger">*</span></label>
                    <input type="text" className="form-control" placeholder="e.g. Stock Taking Session" value={newEventTitle} onChange={e => setNewEventTitle(e.target.value)} required />
                  </div>
                  <div className="mb-3">
                    <label className="form-label">Category</label>
                    <select className="form-select" value={newEventCategory} onChange={e => setNewEventCategory(e.target.value)}>
                      {categories.map(c => <option key={c.name} value={c.name}>{c.name}</option>)}
                    </select>
                  </div>
                </div>
                <div className="modal-footer">
                  <button type="button" className="btn btn-light" onClick={() => setShowAddModal(false)}>Cancel</button>
                  <button type="submit" className="btn btn-primary">Save Event</button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
