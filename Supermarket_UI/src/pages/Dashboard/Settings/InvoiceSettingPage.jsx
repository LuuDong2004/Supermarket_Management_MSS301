// pages/Dashboard/Settings/InvoiceSettingPage.jsx
import React, { useEffect, useState } from 'react';
import SettingsTabNav from './SettingsTabNav';

export default function InvoiceSettingPage() {
  const [prefix, setPrefix] = useState('INV-');
  const [nextNumber, setNextNumber] = useState('1001');
  const [duePeriod, setDuePeriod] = useState('15 days');
  const [terms, setTerms] = useState('1. Payment is due within the specified period.\n2. Interest of 1.5% per month will be charged on late payments.\n3. Goods once sold cannot be returned without prior approval.');
  const [notes, setNotes] = useState('Thank you for shopping with GotPOS! We appreciate your business.');

  useEffect(() => {
    if (window.lucide) {
      window.lucide.createIcons();
    }
  }, []);

  const handleSave = (e) => {
    e.preventDefault();
    alert('Invoice settings saved successfully!');
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
            <h6 className="mb-1 fs-16">Invoice Settings</h6>
            <p className="text-muted mb-8">Set default invoice details and payment information used across POS and invoices.</p>

            <div className="row g-4">
              <div className="col-md-4">
                <label className="form-label" htmlFor="invoicePrefix">Invoice Prefix</label>
                <input type="text" id="invoicePrefix" className="form-control" value={prefix} onChange={e => setPrefix(e.target.value)} required />
              </div>
              <div className="col-md-4">
                <label className="form-label" htmlFor="nextInvoiceNumber">Next Invoice Number</label>
                <input type="number" id="nextInvoiceNumber" className="form-control" value={nextNumber} onChange={e => setNextNumber(e.target.value)} required />
              </div>
              <div className="col-md-4">
                <label className="form-label" htmlFor="invoiceDuePeriod">Invoice Due Period</label>
                <select id="invoiceDuePeriod" className="form-select" value={duePeriod} onChange={e => setDuePeriod(e.target.value)}>
                  <option value="0 days">Immediate</option>
                  <option value="7 days">7 days</option>
                  <option value="15 days">15 days</option>
                  <option value="30 days">30 days</option>
                  <option value="60 days">60 days</option>
                </select>
              </div>

              <div className="col-md-12">
                <label className="form-label" htmlFor="invoiceTerms">Terms & Conditions</label>
                <textarea id="invoiceTerms" className="form-control" rows="4" value={terms} onChange={e => setTerms(e.target.value)}></textarea>
              </div>

              <div className="col-md-12">
                <label className="form-label" htmlFor="invoiceNotes">Custom Notes (Footer)</label>
                <textarea id="invoiceNotes" className="form-control" rows="3" value={notes} onChange={e => setNotes(e.target.value)}></textarea>
              </div>
            </div>

            <div className="text-end mt-5">
              <button type="button" className="btn btn-outline-light border me-1">Cancel</button>
              <button type="submit" className="btn btn-primary">Save Invoice Settings</button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
