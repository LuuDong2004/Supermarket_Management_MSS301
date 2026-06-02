// pages/Dashboard/Settings/GeneralSettingPage.jsx
import React, { useEffect } from 'react';
import SettingsTabNav from './SettingsTabNav';

export default function GeneralSettingPage() {
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

        <div className="accordion accordion-boxed accordion-solid-secondary mb-5" id="accordionSecondary">
          <div className="accordion-item">
            <h2 className="accordion-header">
              <button className="accordion-button bg-body-secondary shadow-none border rounded-0 p-5 text-body fw-medium" type="button" data-bs-toggle="collapse" data-bs-target="#storeInfo" aria-expanded="true">
                Store & Business Information
              </button>
            </h2>
            <div id="storeInfo" className="accordion-collapse collapse show" data-bs-parent="#accordionSecondary">
              <div className="accordion-body border border-top-0 p-5">
                <div className="row g-5 g-md-6 align-items-center justify-content-between">
                  <div className="col-md-8 col-lg-6">
                    <h6 className="mb-1 fw-medium">Store Name</h6>
                    <p className="text-muted mb-0">Displayed on invoices, receipts, and other documents.</p>
                  </div>
                  <div className="col-md-4 col-lg-3 col-xxl-2">
                    <input type="text" className="form-control" defaultValue="My POS Store" />
                  </div>
                  <div className="col-md-8 col-lg-6">
                    <h6 className="mb-1 fw-medium">Contact Number</h6>
                    <p className="text-muted mb-0">Used for customer support and store communication.</p>
                  </div>
                  <div className="col-md-4 col-lg-3 col-xxl-2">
                    <input type="text" className="form-control" defaultValue="+91 00000 00000" />
                  </div>
                  <div className="col-md-8 col-lg-6">
                    <h6 className="mb-1 fw-medium">Email Address</h6>
                    <p className="text-muted mb-0">Receives system alerts and important notifications.</p>
                  </div>
                  <div className="col-md-4 col-lg-3 col-xxl-2">
                    <input type="email" className="form-control" defaultValue="store@email.com" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="accordion accordion-boxed accordion-solid-secondary mb-5" id="accordionSecondary">
          <div className="accordion-item">
            <h2 className="accordion-header">
              <button className="accordion-button collapsed bg-body-secondary shadow-none border rounded-0 p-5 text-body fw-medium" type="button" data-bs-toggle="collapse" data-bs-target="#posBehavior" aria-expanded="true">
                POS Behavior & Billing Flow
              </button>
            </h2>
            <div id="posBehavior" className="accordion-collapse collapse show" data-bs-parent="#accordionSecondary">
              <div className="accordion-body border border-top-0 p-5">
                <div className="d-flex flex-wrap gap-4 justify-content-between align-items-center mb-5 mb-md-6">
                  <div>
                    <h6 className="mb-1 fw-medium">Enable Quick Sale Mode</h6>
                    <p className="text-muted mb-0">Enable faster checkout by skipping optional billing steps.</p>
                  </div>
                  <div className="form-switch switch-light-primary">
                    <input type="checkbox" id="switch-light-1" defaultChecked />
                    <label className="label" htmlFor="switch-light-1"></label>
                  </div>
                </div>
                <div className="d-flex flex-wrap gap-4 justify-content-between align-items-center mb-5 mb-md-6">
                  <div>
                    <h6 className="mb-1 fw-medium">Default Product Visibility</h6>
                    <p className="text-muted mb-0">Control who can view products by default in the POS.</p>
                  </div>
                  <div className="form-switch switch-light-primary">
                    <input type="checkbox" id="switch-light-2" />
                    <label className="label" htmlFor="switch-light-2"></label>
                  </div>
                </div>
                <div className="d-flex flex-wrap gap-4 justify-content-between align-items-center mb-5 mb-md-6">
                  <div>
                    <h6 className="mb-1 fw-medium">Default Tax Percentage</h6>
                    <p className="text-muted mb-0">Applied automatically to taxable items during billing.</p>
                  </div>
                  <div className="d-flex align-items-center gap-2">
                    <input type="number" className="form-control w-36" defaultValue="18" />
                    <span className="text-muted">%</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
