// pages/Dashboard/Customers/CustomerActivityPage.jsx
import React, { useEffect, useState } from 'react';
import PageBreadcrumb from '../../../components/ui/PageBreadcrumb';
import { ROUTES } from '../../../configs/routes';

const initialActivities = [
  {
    id: 1,
    time: '21:00 PM',
    date: '30-05-2026',
    customerName: 'John Doe',
    customerType: 'Wholesale Buyer',
    refId: '#CUS1025',
    actionType: 'New Account',
    actionBadge: 'bg-primary-subtle text-primary border border-primary-subtle',
    description: 'Customer account for John Doe was successfully created by staff at the billing desk after verification. The profile includes verified contact details, initial wallet configuration, default tax setup, and loyalty membership enrollment.',
    note: 'Account setup completed | System verification passed'
  },
  {
    id: 2,
    time: '13:30 PM',
    date: '30-05-2026',
    customerName: 'Emily Johnson',
    customerType: 'Retail Customer',
    refId: '#CUS1026',
    actionType: 'Wallet Credit',
    actionBadge: 'bg-success-subtle text-success border border-success-subtle',
    description: 'Wallet balance was credited successfully during an in-store transaction processed by the cashier. The credited amount reflects a prepaid balance added for faster checkout and future purchases.',
    note: '$100.00 added | Payment verified and recorded'
  },
  {
    id: 3,
    time: '11:58 AM',
    date: '30-05-2026',
    customerName: 'Michael Brown',
    customerType: 'Wholesale Buyer',
    refId: '#ORD-45821',
    actionType: 'Order Completed',
    actionBadge: 'bg-info-subtle text-info border border-info-subtle',
    description: 'Purchase order was completed successfully at the POS counter with multiple items added to the cart. Payment was confirmed, invoice generated, and inventory stock updated automatically.',
    note: 'Invoice generated | Payment via Credit Card'
  },
  {
    id: 4,
    time: '10:15 AM',
    date: '29-05-2026',
    customerName: 'Sarah Davis',
    customerType: 'Retail Customer',
    refId: '#CUS1027',
    actionType: 'Account Updated',
    actionBadge: 'bg-warning-subtle text-warning border border-warning-subtle',
    description: 'Customer profile details were updated. Changes include updating mobile number and adding secondary shipping address for loyalty reward shipping.',
    note: 'Phone updated to +1 555 123 4567 | Verified via SMS OTP'
  }
];

export default function CustomerActivityPage() {
  const [activities, setActivities] = useState(initialActivities);
  const [search, setSearch] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');

  // Form State to Add New Activity Log
  const [modalCustomer, setModalCustomer] = useState('');
  const [modalType, setModalType] = useState('New Account');
  const [modalDesc, setModalDesc] = useState('');
  const [modalNote, setModalNote] = useState('');

  useEffect(() => {
    if (window.lucide) {
      window.lucide.createIcons();
    }
  }, [activities]);

  const handleFormSubmit = (e) => {
    e.preventDefault();
    
    let badgeClass = 'bg-primary-subtle text-primary border border-primary-subtle';
    if (modalType === 'Wallet Credit') {
      badgeClass = 'bg-success-subtle text-success border border-success-subtle';
    } else if (modalType === 'Order Completed') {
      badgeClass = 'bg-info-subtle text-info border border-info-subtle';
    } else if (modalType === 'Account Updated') {
      badgeClass = 'bg-warning-subtle text-warning border border-warning-subtle';
    }

    const newLog = {
      id: activities.length > 0 ? Math.max(...activities.map(a => a.id)) + 1 : 1,
      time: new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }),
      date: new Date().toLocaleDateString('en-GB').replace(/\//g, '-'), // dd-mm-yyyy
      customerName: modalCustomer,
      customerType: 'Retail Customer',
      refId: `#CUS${1020 + activities.length}`,
      actionType: modalType,
      actionBadge: badgeClass,
      description: modalDesc,
      note: modalNote
    };

    setActivities(prev => [newLog, ...prev]);

    // Reset Form
    setModalCustomer('');
    setModalType('New Account');
    setModalDesc('');
    setModalNote('');

    const modalElement = document.getElementById('addActivityModal');
    const modalInstance = window.bootstrap?.Modal?.getInstance(modalElement);
    modalInstance?.hide();
  };

  const filteredActivities = activities.filter(a => {
    const matchesSearch = a.customerName.toLowerCase().includes(search.toLowerCase()) || 
                          a.actionType.toLowerCase().includes(search.toLowerCase()) ||
                          a.refId.toLowerCase().includes(search.toLowerCase());
    
    // Simple date string comparisons for mock purposes
    const matchesStart = !startDate || a.date.split('-').reverse().join('-') >= startDate.split('-').reverse().join('-');
    const matchesEnd = !endDate || a.date.split('-').reverse().join('-') <= endDate.split('-').reverse().join('-');

    return matchesSearch && matchesStart && matchesEnd;
  });

  // Group activities by date
  const groupedActivities = filteredActivities.reduce((groups, activity) => {
    const date = activity.date;
    if (!groups[date]) {
      groups[date] = [];
    }
    groups[date].push(activity);
    return groups;
  }, {});

  return (
    <div className="container-fluid">
      <PageBreadcrumb title="Activity Log" breadcrumbs={[{ label: 'Dashboard', href: ROUTES.DASHBOARD }, { label: 'Customers' }, { label: 'Activity Log' }]} />

      <div className="row">
        <div className="col-12">
          <div className="card">
            <div className="card-header d-flex flex-wrap gap-3 justify-content-between align-items-center">
              <h5 className="card-title mb-0">Customer Activities</h5>
              <div className="d-flex flex-wrap gap-2 ms-auto">
                <input type="text" className="form-control w-40" placeholder="Start Date (dd-mm-yyyy)" value={startDate} onChange={e => setStartDate(e.target.value)} />
                <input type="text" className="form-control w-40" placeholder="End Date (dd-mm-yyyy)" value={endDate} onChange={e => setEndDate(e.target.value)} />
                <div className="position-relative">
                  <input type="text" className="form-control ps-9" placeholder="Search Customer..." value={search} onChange={e => setSearch(e.target.value)} />
                  <i data-lucide="search" className="size-4 icon-dark position-absolute top-50 start-0 ms-3 translate-middle-y"></i>
                </div>
                <button className="btn btn-primary d-flex align-items-center gap-1" data-bs-toggle="modal" data-bs-target="#addActivityModal">
                  <i className="ri-add-line fs-lg"></i> Add Log
                </button>
              </div>
            </div>
            <div className="card-body">
              {Object.keys(groupedActivities).length === 0 ? (
                <p className="text-muted text-center py-4">No activities found matching criteria.</p>
              ) : (
                Object.keys(groupedActivities).map(date => (
                  <div key={date} className="mb-6">
                    <div className="d-flex justify-content-between mb-4 border-bottom pb-2">
                      <h6 className="text-uppercase text-muted fs-sm mb-0">{date === new Date().toLocaleDateString('en-GB').replace(/\//g, '-') ? 'TODAY' : date}</h6>
                      <span className="badge bg-body-secondary text-secondary">{groupedActivities[date].length} Activities</span>
                    </div>
                    <ul className="changelog-timeline customer-activity mb-0">
                      {groupedActivities[date].map(item => (
                        <li key={item.id} className="timeline-item d-flex mb-5">
                          <h6 className="text-end mb-3 mt-1 me-5 activity-time d-none d-md-block" style={{ width: '80px', minWidth: '80px' }}>{item.time}</h6>
                          <div className="me-4 flex-shrink-0">
                            <div className="avatar size-8 rounded-circle bg-light d-flex align-items-center justify-content-center">
                              <i className="ri-user-line text-muted"></i>
                            </div>
                          </div>
                          <div className="flex-grow-1 p-3 border rounded activity-box bg-body-subtle">
                            <div className="d-flex flex-wrap gap-2 align-items-center mb-3">
                              <span className="fw-semibold text-dark">{item.customerName}</span>
                              <span className="text-muted fs-xs">({item.customerType})</span>
                              <span className="text-primary fs-xs font-monospace">{item.refId}</span>
                              <span className={`badge ${item.actionBadge} ms-auto`}>
                                {item.actionType}
                              </span>
                            </div>
                            <div className="text-body fs-sm mb-2">{item.description}</div>
                            {item.note && <p className="text-muted fs-xs mb-0 italic"><i className="ri-information-line me-1"></i>{item.note}</p>}
                          </div>
                        </li>
                      ))}
                    </ul>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Add Activity Log Modal */}
      <div className="modal fade" id="addActivityModal" tabIndex="-1" aria-labelledby="addActivityModalLabel" aria-hidden="true">
        <div className="modal-dialog modal-dialog-centered">
          <div className="modal-content">
            <div className="modal-header">
              <h6 className="modal-title" id="addActivityModalLabel">Add Customer Activity Log</h6>
              <button type="button" className="btn-close" data-bs-dismiss="modal"></button>
            </div>
            <div className="modal-body">
              <form onSubmit={handleFormSubmit}>
                <div className="mb-3">
                  <label className="form-label">Customer Name <span className="text-danger">*</span></label>
                  <input type="text" className="form-control" placeholder="e.g., John Doe" value={modalCustomer} onChange={e => setModalCustomer(e.target.value)} required />
                </div>
                <div className="mb-3">
                  <label className="form-label">Action Type</label>
                  <select className="form-select" value={modalType} onChange={e => setModalType(e.target.value)}>
                    <option value="New Account">New Account</option>
                    <option value="Wallet Credit">Wallet Credit</option>
                    <option value="Order Completed">Order Completed</option>
                    <option value="Account Updated">Account Updated</option>
                  </select>
                </div>
                <div className="mb-3">
                  <label className="form-label">Description <span className="text-danger">*</span></label>
                  <textarea className="form-control" placeholder="Describe the activity in detail..." rows="4" value={modalDesc} onChange={e => setModalDesc(e.target.value)} required></textarea>
                </div>
                <div className="mb-3">
                  <label className="form-label">Internal Note / Details</label>
                  <input type="text" className="form-control" placeholder="e.g., Qty: 15 | Payment via Cash" value={modalNote} onChange={e => setModalNote(e.target.value)} />
                </div>
                <div className="d-flex gap-2 mt-7">
                  <button type="button" className="btn btn-light w-100" data-bs-dismiss="modal">Close</button>
                  <button type="submit" className="btn btn-primary w-100">Add Log</button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
