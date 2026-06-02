// pages/Dashboard/Settings/PosSettingPage.jsx
import React, { useEffect } from 'react';
import SettingsTabNav from './SettingsTabNav';

export default function PosSettingPage() {
  useEffect(() => {
    if (window.lucide) {
      window.lucide.createIcons();
    }
  }, []);

  return (
    <>
      <div className="container-fluid">
        <div className="mb-5">
          <h4 className="fs-xl">Settings</h4>
          <p className="text-muted">Manage overall store preferences and system configurations.</p>
        </div>
        
        <SettingsTabNav />

        <div className="card">
          <div className="card-body">
            <h6 className="mb-1">POS Configuration Settings</h6>
            <p className="text-muted mb-5">Manage POS receipts, printers, customer types, stock alerts, and payment options.</p>
            <div className="d-flex flex-column gap-6">
              <div className="row g-2 align-items-center">
                <div className="col-md-4">
                  <label className="form-label mb-0 fs-15">Receipt Format</label>
                </div>
                <div className="col-md-8">
                  <select className="form-select w-56">
                    <option>Standard 80mm</option>
                    <option>Standard 58mm</option>
                    <option>Letter Size</option>
                    <option>A4 Size</option>
                  </select>
                </div>
              </div>
              <div className="row g-2 align-items-center">
                <div className="col-md-4">
                  <label className="form-label mb-0 fs-15">POS Printer Type</label>
                </div>
                <div className="col-md-8">
                  <select className="form-select w-56">
                    <option>Thermal Printer</option>
                    <option>Inkjet Printer</option>
                    <option>Laser Printer</option>
                  </select>
                </div>
              </div>
              <div className="row g-2 align-items-center">
                <div className="col-md-4">
                  <label className="form-label mb-0 fs-15">Auto Print Receipt</label>
                </div>
                <div className="col-md-8">
                  <div className="form-switch switch-light-primary">
                    <input type="checkbox" id="switch-light-1" defaultChecked />
                    <label className="label" htmlFor="switch-light-1"></label>
                  </div>
                </div>
              </div>
              <div className="row g-2 align-items-center">
                <div className="col-md-4">
                  <label className="form-label mb-0 fs-15">Default Customer Type</label>
                </div>
                <div className="col-md-8">
                  <div className="d-flex flex-wrap align-items-center gap-6">
                    <div className="form-check check-primary">
                      <input className="form-check-input" type="checkbox" id="defaultCheck1" defaultChecked />
                      <label className="form-check-label" htmlFor="defaultCheck1">Regular</label>
                    </div>
                    <div className="form-check check-primary">
                      <input className="form-check-input" type="checkbox" id="defaultCheck2" />
                      <label className="form-check-label" htmlFor="defaultCheck2">Member</label>
                    </div>
                    <div className="form-check check-primary">
                      <input className="form-check-input" type="checkbox" id="defaultCheck3" />
                      <label className="form-check-label" htmlFor="defaultCheck3">Wholesale</label>
                    </div>
                  </div>
                </div>
              </div>
              <div className="row g-2 align-items-center">
                <div className="col-md-4">
                  <label className="form-label mb-0 fs-15">Low Stock Alert</label>
                </div>
                <div className="col-md-8">
                  <input type="number" className="form-control w-28" id="lowStock" placeholder="Enter threshold" defaultValue="5" />
                </div>
              </div>
            </div>
            <div className="text-end mt-5">
              <button className="btn btn-outline-light border me-1">Cancel</button>
              <button className="btn btn-primary">Save POS Settings</button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
