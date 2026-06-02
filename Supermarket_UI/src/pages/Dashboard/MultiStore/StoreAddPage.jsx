// pages/Dashboard/MultiStore/StoreAddPage.jsx
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import PageBreadcrumb from '../../../components/ui/PageBreadcrumb';
import { ROUTES } from '../../../configs/routes';

export default function StoreAddPage() {
  const navigate = useNavigate();

  // Basic Information
  const [storeId, setStoreId] = useState('');
  const [storeName, setStoreName] = useState('');
  const [storeEmail, setStoreEmail] = useState('');
  const [storePhone, setStorePhone] = useState('');
  const [location, setLocation] = useState('');
  const [city, setCity] = useState('');
  const [state, setState] = useState('');
  const [zip, setZip] = useState('');

  // Manager Information
  const [managerName, setManagerName] = useState('');
  const [managerRole, setManagerRole] = useState('Manager');
  const [department, setDepartment] = useState('');
  const [dateOfJoining, setDateOfJoining] = useState('');
  const [managerEmail, setManagerEmail] = useState('');
  const [managerPhone, setManagerPhone] = useState('');
  const [managerAddress, setManagerAddress] = useState('');

  // Operational Details
  const [openingDate, setOpeningDate] = useState('');
  const [storeHours, setStoreHours] = useState('9:00 AM - 9:00 PM');
  const [staffCount, setStaffCount] = useState('5');
  const [posDevices, setPosDevices] = useState('2');
  const [dailyTarget, setDailyTarget] = useState('5000');
  const [storeType, setStoreType] = useState('Retail');

  useEffect(() => {
    // Generate simple store ID
    const saved = localStorage.getItem('gotpos_stores');
    let nextNum = 6;
    if (saved) {
      const parsed = JSON.parse(saved);
      nextNum = parsed.length + 1;
    }
    setStoreId(`STR-00${nextNum}`);

    if (window.lucide) {
      window.lucide.createIcons();
    }
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();

    const newStore = {
      id: Date.now(),
      storeId,
      name: storeName,
      location: city || location || 'Unknown',
      manager: managerName,
      email: storeEmail || managerEmail || 'info@store.com',
      phone: storePhone || managerPhone || 'N/A',
      status: 'Open',
      type: storeType,
      image: '/assets/user-6-BIO7_TUU.png'
    };

    const saved = localStorage.getItem('gotpos_stores');
    let currentStores = [];
    if (saved) {
      currentStores = JSON.parse(saved);
    }
    const updatedStores = [...currentStores, newStore];
    localStorage.setItem('gotpos_stores', JSON.stringify(updatedStores));

    navigate(ROUTES.MULTI_STORE);
  };

  const handleCancel = () => {
    navigate(ROUTES.MULTI_STORE);
  };

  return (
    <div className="container-fluid">
      <PageBreadcrumb title="Add Store" breadcrumbs={[{ label: 'Multi Store', href: ROUTES.MULTI_STORE }, { label: 'Add Store' }]} />

      <form onSubmit={handleSubmit}>
        {/* Basic Store Information */}
        <div className="card">
          <div className="card-header">
            <h5 className="card-title mb-0">Basic Store Information</h5>
          </div>
          <div className="card-body">
            <div className="row g-4">
              <div className="col-md-6">
                <label className="form-label">Store ID <span className="text-danger">*</span></label>
                <input type="text" className="form-control" value={storeId} onChange={e => setStoreId(e.target.value)} required />
              </div>
              <div className="col-md-6">
                <label className="form-label">Store Name <span className="text-danger">*</span></label>
                <input type="text" className="form-control" placeholder="Main City Store" value={storeName} onChange={e => setStoreName(e.target.value)} required />
              </div>
              <div className="col-md-6">
                <label className="form-label">Store Email</label>
                <input type="email" className="form-control" placeholder="contact@store.com" value={storeEmail} onChange={e => setStoreEmail(e.target.value)} />
              </div>
              <div className="col-md-6">
                <label className="form-label">Store Phone</label>
                <input type="text" className="form-control" placeholder="+1 212 555 0199" value={storePhone} onChange={e => setStorePhone(e.target.value)} />
              </div>
              <div className="col-lg-8">
                <label className="form-label">Location / Address <span className="text-danger">*</span></label>
                <textarea className="form-control" rows="3" placeholder="Enter Location Details..." value={location} onChange={e => setLocation(e.target.value)} required></textarea>
              </div>
              <div className="col-md-4">
                <label className="form-label">Store Type</label>
                <select className="form-select" value={storeType} onChange={e => setStoreType(e.target.value)}>
                  <option value="Retail">Retail</option>
                  <option value="Wholesale">Wholesale</option>
                  <option value="Warehouse">Warehouse</option>
                  <option value="Outlet">Outlet</option>
                </select>
              </div>
              <div className="col-md-4">
                <label className="form-label">City</label>
                <input type="text" className="form-control" placeholder="City" value={city} onChange={e => setCity(e.target.value)} />
              </div>
              <div className="col-md-4">
                <label className="form-label">State</label>
                <input type="text" className="form-control" placeholder="State" value={state} onChange={e => setState(e.target.value)} />
              </div>
              <div className="col-md-4">
                <label className="form-label">ZIP / Postal Code</label>
                <input type="text" className="form-control" placeholder="10001" value={zip} onChange={e => setZip(e.target.value)} />
              </div>
            </div>
          </div>
        </div>

        {/* Manager Information */}
        <div className="card">
          <div className="card-header">
            <h5 className="card-title mb-0">Manager Information</h5>
          </div>
          <div className="card-body">
            <div className="row g-4">
              <div className="col-lg-6">
                <label className="form-label">Manager Name <span className="text-danger">*</span></label>
                <input type="text" className="form-control" placeholder="John Doe" value={managerName} onChange={e => setManagerName(e.target.value)} required />
              </div>
              <div className="col-lg-6">
                <label className="form-label">Manager Role <span className="text-danger">*</span></label>
                <input type="text" className="form-control" placeholder="Manager" value={managerRole} onChange={e => setFormName(e.target.value) /* actually wait, use form fields */} value={managerRole} onChange={e => setManagerRole(e.target.value)} required />
              </div>
              <div className="col-md-4">
                <label className="form-label">Department</label>
                <input type="text" className="form-control" placeholder="Sales / Operations" value={department} onChange={e => setDepartment(e.target.value)} />
              </div>
              <div className="col-md-4">
                <label className="form-label">Date of Joining</label>
                <input type="date" className="form-control" value={dateOfJoining} onChange={e => setDateOfJoining(e.target.value)} />
              </div>
              <div className="col-md-4">
                <label className="form-label">Manager Email</label>
                <input type="email" className="form-control" placeholder="john.doe@store.com" value={managerEmail} onChange={e => setManagerEmail(e.target.value)} />
              </div>
              <div className="col-md-6">
                <label className="form-label">Manager Phone</label>
                <input type="text" className="form-control" placeholder="+1 212 555 0123" value={managerPhone} onChange={e => setManagerPhone(e.target.value)} />
              </div>
              <div className="col-md-6">
                <label className="form-label">Manager Address</label>
                <input type="text" className="form-control" placeholder="123 Main Street, City" value={managerAddress} onChange={e => setManagerAddress(e.target.value)} />
              </div>
            </div>
          </div>
        </div>

        {/* Operational Details */}
        <div className="card">
          <div className="card-header">
            <h5 className="card-title mb-0">Operational Details</h5>
          </div>
          <div className="card-body">
            <div className="row g-4">
              <div className="col-md-4">
                <label className="form-label">Opening Date</label>
                <input type="date" className="form-control" value={openingDate} onChange={e => setOpeningDate(e.target.value)} />
              </div>
              <div className="col-md-4">
                <label className="form-label">Store Hours</label>
                <input type="text" className="form-control" placeholder="9:00 AM - 9:00 PM" value={storeHours} onChange={e => setStoreHours(e.target.value)} />
              </div>
              <div className="col-md-4">
                <label className="form-label">Number of Staff</label>
                <input type="number" className="form-control" placeholder="5" value={staffCount} onChange={e => setStaffCount(e.target.value)} />
              </div>
              <div className="col-md-4">
                <label className="form-label">POS Terminals</label>
                <input type="number" className="form-control" placeholder="2" value={posDevices} onChange={e => setPosDevices(e.target.value)} />
              </div>
              <div className="col-md-4">
                <label className="form-label">Daily Sales Target ($)</label>
                <input type="number" className="form-control" placeholder="5000" value={dailyTarget} onChange={e => setDailyTarget(e.target.value)} />
              </div>
            </div>

            <div className="d-flex justify-content-end gap-3 mt-4">
              <button type="button" className="btn btn-secondary" onClick={handleCancel}>Cancel</button>
              <button type="submit" className="btn btn-primary">Add Store</button>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
}
