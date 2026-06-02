// pages/Dashboard/Settings/CouponSettingPage.jsx
import React, { useEffect, useState } from 'react';
import SettingsTabNav from './SettingsTabNav';

const initialCoupons = [
  { id: 1, name: 'Weekend Sale', code: 'WEEKEND20', discount: '20%', startDate: '2025-12-01', endDate: '2025-12-31', status: 'Active', theme: 'weekend' },
  { id: 2, name: 'New Year Special', code: 'NEWYEAR15', discount: '15%', startDate: '2025-12-25', endDate: '2026-01-05', status: 'Active', theme: 'newyear' },
  { id: 3, name: 'Electronics Fest', code: 'ELEC30', discount: '30%', startDate: '2025-12-10', endDate: '2025-12-15', status: 'Active', theme: 'electronics' },
  { id: 4, name: 'Black Friday Deals', code: 'BLACK50', discount: '50%', startDate: '2025-11-20', endDate: '2025-11-28', status: 'Inactive', theme: 'blackfriday' }
];

export default function CouponSettingPage() {
  const [coupons, setCoupons] = useState(initialCoupons);
  const [search, setSearch] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);
  const [showViewModal, setShowViewModal] = useState(false);
  const [selectedCoupon, setSelectedCoupon] = useState(null);

  // Form states
  const [newName, setNewName] = useState('');
  const [newCode, setNewCode] = useState('');
  const [newDiscount, setNewDiscount] = useState('');
  const [newStart, setNewStart] = useState('');
  const [newEnd, setNewEnd] = useState('');
  const [newTheme, setNewTheme] = useState('weekend');

  useEffect(() => {
    if (window.lucide) {
      window.lucide.createIcons();
    }
  }, [coupons, showAddModal, showViewModal]);

  const handleToggleStatus = (id) => {
    setCoupons(prev => prev.map(c => c.id === id ? { ...c, status: c.status === 'Active' ? 'Inactive' : 'Active' } : c));
  };

  const handleOpenAdd = () => {
    setNewName('');
    setNewCode('');
    setNewDiscount('');
    setNewStart(new Date().toISOString().split('T')[0]);
    setNewEnd('');
    setNewTheme('weekend');
    setShowAddModal(true);
  };

  const handleAddSubmit = (e) => {
    e.preventDefault();
    const newCoupon = {
      id: Date.now(),
      name: newName,
      code: newCode.toUpperCase(),
      discount: newDiscount.includes('%') ? newDiscount : `${newDiscount}%`,
      startDate: newStart,
      endDate: newEnd,
      status: 'Active',
      theme: newTheme
    };
    setCoupons([newCoupon, ...coupons]);
    setShowAddModal(false);
  };

  const handleView = (coupon) => {
    setSelectedCoupon(coupon);
    setShowViewModal(true);
  };

  const handleDelete = (id) => {
    if (window.confirm('Are you sure you want to delete this coupon?')) {
      setCoupons(prev => prev.filter(c => c.id !== id));
      if (showViewModal && selectedCoupon?.id === id) {
        setShowViewModal(false);
      }
    }
  };

  const filteredCoupons = coupons.filter(c => 
    c.name.toLowerCase().includes(search.toLowerCase()) ||
    c.code.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="container-fluid">
      <div className="mb-5">
        <h4 className="fs-xl">Settings</h4>
        <p className="text-muted">Manage overall store preferences and system configurations.</p>
      </div>

      <SettingsTabNav />

      <div className="card">
        <div className="card-header d-flex flex-wrap justify-content-between align-items-center gap-2 mb-4">
          <h5 className="card-title mb-0">Coupon List</h5>
          <div className="d-flex align-items-center gap-2">
            <div className="position-relative">
              <input type="text" className="form-control ps-10" placeholder="Search coupon..." value={search} onChange={e => setSearch(e.target.value)} />
              <i data-lucide="search" className="size-4 icon-dark position-absolute top-50 start-0 ms-4 translate-middle-y"></i>
            </div>
            <button className="btn btn-primary" onClick={handleOpenAdd}><i className="ri-add-line me-1"></i>Add Coupon</button>
          </div>
        </div>

        <div className="card-body pt-0">
          <div className="table-card table-responsive">
            <table className="table text-nowrap align-middle mb-0">
              <thead>
                <tr className="bg-light border-bottom">
                  <th>Coupon Name</th>
                  <th>Code</th>
                  <th>Discount</th>
                  <th>Start Date</th>
                  <th>End Date</th>
                  <th>Status</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {filteredCoupons.length === 0 ? (
                  <tr>
                    <td colSpan="7" className="text-center text-muted py-4">No coupons found.</td>
                  </tr>
                ) : (
                  filteredCoupons.map(item => (
                    <tr key={item.id}>
                      <td><span className="fw-medium text-reset">{item.name}</span></td>
                      <td><span className="badge bg-secondary-subtle text-secondary border border-secondary-subtle font-monospace fs-13">{item.code}</span></td>
                      <td className="fw-semibold text-success">{item.discount}</td>
                      <td>{item.startDate}</td>
                      <td>{item.endDate}</td>
                      <td>
                        <div className="form-switch switch-light-secondary">
                          <input type="checkbox" id={`switch_coupon_${item.id}`} checked={item.status === 'Active'} onChange={() => handleToggleStatus(item.id)} />
                          <label className="label" htmlFor={`switch_coupon_${item.id}`}></label>
                        </div>
                      </td>
                      <td>
                        <div className="d-flex gap-2">
                          <button className="btn btn-sub-secondary size-8 btn-icon" onClick={() => handleView(item)}><i className="ri-eye-line"></i></button>
                          <button className="btn btn-sub-danger size-8 btn-icon" onClick={() => handleDelete(item.id)}><i className="ri-delete-bin-line"></i></button>
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

      {/* Add Coupon Modal */}
      {showAddModal && (
        <div className="modal fade show d-block" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Create Coupon</h5>
                <button type="button" className="btn-close" onClick={() => setShowAddModal(false)}></button>
              </div>
              <form onSubmit={handleAddSubmit}>
                <div className="modal-body">
                  <div className="mb-3">
                    <label className="form-label">Coupon Name</label>
                    <input type="text" className="form-control" value={newName} onChange={e => setNewName(e.target.value)} required />
                  </div>
                  <div className="mb-3">
                    <label className="form-label">Coupon Code</label>
                    <input type="text" className="form-control" value={newCode} onChange={e => setNewCode(e.target.value)} placeholder="e.g. SUMMER25" required />
                  </div>
                  <div className="mb-3">
                    <label className="form-label">Discount Value (e.g. 10% or 100)</label>
                    <input type="text" className="form-control" value={newDiscount} onChange={e => setNewDiscount(e.target.value)} required />
                  </div>
                  <div className="row mb-3">
                    <div className="col-6">
                      <label className="form-label">Start Date</label>
                      <input type="date" className="form-control" value={newStart} onChange={e => setNewStart(e.target.value)} required />
                    </div>
                    <div className="col-6">
                      <label className="form-label">End Date</label>
                      <input type="date" className="form-control" value={newEnd} onChange={e => setNewEnd(e.target.value)} required />
                    </div>
                  </div>
                  <div className="mb-3">
                    <label className="form-label">Theme Style</label>
                    <select className="form-select" value={newTheme} onChange={e => setNewTheme(e.target.value)}>
                      <option value="weekend">Blue Theme</option>
                      <option value="newyear">Red/New Year Theme</option>
                      <option value="electronics">Orange Theme</option>
                      <option value="blackfriday">Dark/Black Friday Theme</option>
                    </select>
                  </div>
                </div>
                <div className="modal-footer">
                  <button type="button" className="btn btn-light" onClick={() => setShowAddModal(false)}>Close</button>
                  <button type="submit" className="btn btn-primary">Save Coupon</button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* View Coupon Modal with specific theme */}
      {showViewModal && selectedCoupon && (
        <div className="modal fade show d-block" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content border-0 overflow-hidden" style={{ borderRadius: '15px' }}>
              
              {/* Conditional header decoration based on theme */}
              <div className={`p-5 text-white text-center position-relative ${
                selectedCoupon.theme === 'blackfriday' ? 'bg-dark' :
                selectedCoupon.theme === 'newyear' ? 'bg-danger bg-gradient' :
                selectedCoupon.theme === 'electronics' ? 'bg-warning text-dark bg-gradient' :
                'bg-primary bg-gradient'
              }`}>
                <h4 className="mb-1 text-white">{selectedCoupon.name}</h4>
                <p className="mb-0 text-white-50">Discount Offer Details</p>
                <div className="position-absolute top-50 start-0 translate-middle-y ms-3">
                  <i className="ri-coupon-3-line fs-1" style={{ opacity: 0.2 }}></i>
                </div>
              </div>

              <div className="modal-body text-center p-5">
                <div className="mb-4">
                  <span className="fs-14 text-muted d-block">PROMO CODE</span>
                  <span className="d-inline-block border border-dashed border-2 py-2 px-4 rounded font-monospace fs-18 fw-bold mt-2" style={{ color: 'var(--dx-primary)', letterSpacing: '2px' }}>
                    {selectedCoupon.code}
                  </span>
                </div>
                <div className="row g-3 justify-content-center">
                  <div className="col-6 text-end border-end">
                    <span className="fs-12 text-muted d-block">DISCOUNT</span>
                    <span className="fs-22 fw-bold text-success">{selectedCoupon.discount}</span>
                  </div>
                  <div className="col-6 text-start">
                    <span className="fs-12 text-muted d-block">STATUS</span>
                    <span className={`badge mt-2 bg-${selectedCoupon.status === 'Active' ? 'success' : 'danger'}-subtle text-${selectedCoupon.status === 'Active' ? 'success' : 'danger'}`}>
                      {selectedCoupon.status}
                    </span>
                  </div>
                </div>
                <hr className="my-4" />
                <div className="d-flex justify-content-between text-muted fs-13">
                  <span>Start: {selectedCoupon.startDate}</span>
                  <span>Expires: {selectedCoupon.endDate}</span>
                </div>
              </div>

              <div className="modal-footer bg-light border-0">
                <button type="button" className="btn btn-outline-danger me-auto btn-sm" onClick={() => handleDelete(selectedCoupon.id)}>Delete</button>
                <button type="button" className="btn btn-secondary btn-sm" onClick={() => setShowViewModal(false)}>Close</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
