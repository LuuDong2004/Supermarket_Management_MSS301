// pages/Dashboard/Settings/PaymentGatewaySettingPage.jsx
import React, { useEffect, useState } from 'react';
import SettingsTabNav from './SettingsTabNav';

export default function PaymentGatewaySettingPage() {
  const [payableAmount, setPayableAmount] = useState('1,999');
  const [nextPaymentDate, setNextPaymentDate] = useState('2026-06-30');
  
  // Payment methods checkboxes
  const [cash, setCash] = useState(true);
  const [card, setCard] = useState(true);
  const [upi, setUpi] = useState(true);
  const [wallet, setWallet] = useState(false);
  const [cod, setCod] = useState(false);

  // App Gateways switches
  const [paypalEnabled, setPaypalEnabled] = useState(true);
  const [stripeEnabled, setStripeEnabled] = useState(false);

  useEffect(() => {
    if (window.lucide) {
      window.lucide.createIcons();
    }
  }, []);

  const handleSave = (e) => {
    e.preventDefault();
    alert('Payment Gateway settings saved successfully!');
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
            <h6 className="mb-1 fs-16">POS Payment Gateway</h6>
            <p className="text-muted mb-6">Configure payment methods and gateways for POS transactions.</p>
            
            <div className="d-flex flex-column gap-6">
              <div className="row g-2 align-items-center">
                <div className="col-md-4">
                  <label htmlFor="paymentAmount" className="form-label mb-1 fs-15">Total Payable Amount</label>
                  <p className="text-muted mb-0 fs-xs">Set the default target checkout amount.</p>
                </div>
                <div className="col-md-8">
                  <div className="input-group w-56">
                    <span className="input-group-text">$</span>
                    <input type="text" id="paymentAmount" className="form-control" value={payableAmount} onChange={e => setPayableAmount(e.target.value)} />
                  </div>
                </div>
              </div>

              <div className="row g-2 align-items-center">
                <div className="col-md-4">
                  <label htmlFor="nextPaymentDate" className="form-label mb-0 fs-15">Next Payment Date</label>
                </div>
                <div className="col-md-8">
                  <input type="date" id="nextPaymentDate" className="form-control w-56" value={nextPaymentDate} onChange={e => setNextPaymentDate(e.target.value)} />
                </div>
              </div>

              <div className="row g-2">
                <div className="col-md-4">
                  <label className="form-label mb-1 fs-15">Payment Methods Enabled</label>
                  <p className="text-muted mb-0 fs-xs">Select options available at the POS checkout.</p>
                </div>
                <div className="col-md-8">
                  <div className="d-flex flex-wrap align-items-center gap-4">
                    <div className="form-check check-primary">
                      <input className="form-check-input" type="checkbox" id="payCash" checked={cash} onChange={e => setCash(e.target.checked)} />
                      <label className="form-check-label" htmlFor="payCash">Cash</label>
                    </div>
                    <div className="form-check check-primary">
                      <input className="form-check-input" type="checkbox" id="payCard" checked={card} onChange={e => setCard(e.target.checked)} />
                      <label className="form-check-label" htmlFor="payCard">Card</label>
                    </div>
                    <div className="form-check check-primary">
                      <input className="form-check-input" type="checkbox" id="payUPI" checked={upi} onChange={e => setUpi(e.target.checked)} />
                      <label className="form-check-label" htmlFor="payUPI">UPI</label>
                    </div>
                    <div className="form-check check-primary">
                      <input className="form-check-input" type="checkbox" id="payWallet" checked={wallet} onChange={e => setWallet(e.target.checked)} />
                      <label className="form-check-label" htmlFor="payWallet">Wallet</label>
                    </div>
                    <div className="form-check check-primary">
                      <input className="form-check-input" type="checkbox" id="payCOD" checked={cod} onChange={e => setCod(e.target.checked)} />
                      <label className="form-check-label" htmlFor="payCOD">COD</label>
                    </div>
                  </div>
                </div>
              </div>

              <hr className="my-3" />

              <h6 className="mb-1 fs-15">Digital Wallets & Gateways</h6>
              <p className="text-muted mb-4 fs-xs">Activate integrations for digital and online payments.</p>

              <div className="d-flex flex-wrap gap-4 justify-content-between align-items-center">
                <div>
                  <h6 className="mb-0 fw-medium">PayPal Integration</h6>
                  <p className="text-muted mb-0 fs-xs">Allow customers to check out using PayPal wallet.</p>
                </div>
                <div className="form-switch switch-light-primary">
                  <input type="checkbox" id="paypalApp" checked={paypalEnabled} onChange={e => setPaypalEnabled(e.target.checked)} />
                  <label className="label" htmlFor="paypalApp"></label>
                </div>
              </div>

              <div className="d-flex flex-wrap gap-4 justify-content-between align-items-center">
                <div>
                  <h6 className="mb-0 fw-medium">Stripe Payment Gateway</h6>
                  <p className="text-muted mb-0 fs-xs">Allow credit/debit card processing directly via Stripe.</p>
                </div>
                <div className="form-switch switch-light-primary">
                  <input type="checkbox" id="stripeApp" checked={stripeEnabled} onChange={e => setStripeEnabled(e.target.checked)} />
                  <label className="label" htmlFor="stripeApp"></label>
                </div>
              </div>
            </div>

            <div className="text-end mt-5">
              <button type="button" className="btn btn-outline-light border me-1">Cancel</button>
              <button type="submit" className="btn btn-primary">Save Payment Settings</button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
