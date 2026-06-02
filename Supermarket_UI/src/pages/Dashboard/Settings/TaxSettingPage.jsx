// pages/Dashboard/Settings/TaxSettingPage.jsx
import React, { useEffect, useState } from 'react';
import SettingsTabNav from './SettingsTabNav';

export default function TaxSettingPage() {
  const [taxEnabled, setTaxEnabled] = useState(true);
  const [regNumber, setRegNumber] = useState('22AAAAA0000A1Z5');
  const [businessName, setBusinessName] = useState('ABC Company');
  const [displayName, setDisplayName] = useState('GST');
  const [taxRate, setTaxRate] = useState('18');

  useEffect(() => {
    if (window.lucide) {
      window.lucide.createIcons();
    }
  }, []);

  const handleSave = (e) => {
    e.preventDefault();
    alert('Tax settings saved successfully!');
  };

  return (
    <div className="container-fluid">
      <div className="mb-5">
        <h4 className="fs-xl">Settings</h4>
        <p className="text-muted">Manage overall store preferences and system configurations.</p>
      </div>

      <SettingsTabNav />

      <div className="card">
        <div className="card-body">
          <form onSubmit={handleSave}>
            <div className="d-flex flex-wrap gap-4 justify-content-between align-items-center mb-6">
              <div>
                <h6 className="mb-1 fw-medium">Enable Tax System</h6>
                <p className="text-muted mb-0">Apply tax calculations to POS transactions and invoices.</p>
              </div>
              <div className="form-switch switch-light-primary">
                <input type="checkbox" id="enableTax" checked={taxEnabled} onChange={e => setTaxEnabled(e.target.checked)} />
                <label className="label" htmlFor="enableTax"></label>
              </div>
            </div>

            <hr className="my-5" />

            <div className="row g-4">
              <div className="col-md-6">
                <label className="form-label" htmlFor="taxRegistrationNumber">Tax Registration Number (GSTIN)</label>
                <input type="text" id="taxRegistrationNumber" className="form-control" placeholder="22AAAAA0000A1Z5" value={regNumber} onChange={e => setRegNumber(e.target.value)} disabled={!taxEnabled} required={taxEnabled} />
              </div>
              <div className="col-md-6">
                <label className="form-label" htmlFor="taxRegistrationName">Registered Business Name</label>
                <input type="text" id="taxRegistrationName" className="form-control" placeholder="ABC Company" value={businessName} onChange={e => setBusinessName(e.target.value)} disabled={!taxEnabled} required={taxEnabled} />
              </div>
              <div className="col-md-6">
                <label className="form-label" htmlFor="taxDisplayName">Tax Display Name</label>
                <input type="text" id="taxDisplayName" className="form-control" placeholder="GST / VAT" value={displayName} onChange={e => setDisplayName(e.target.value)} disabled={!taxEnabled} required={taxEnabled} />
              </div>
              <div className="col-md-6">
                <label className="form-label" htmlFor="taxRate">Default Tax Rate (%)</label>
                <input type="number" id="taxRate" className="form-control" placeholder="18" value={taxRate} onChange={e => setTaxRate(e.target.value)} disabled={!taxEnabled} required={taxEnabled} />
              </div>
            </div>

            <div className="text-end mt-5">
              <button type="button" className="btn btn-outline-light border me-1">Cancel</button>
              <button type="submit" className="btn btn-primary">Save Tax Settings</button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
