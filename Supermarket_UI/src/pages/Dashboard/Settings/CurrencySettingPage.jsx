// pages/Dashboard/Settings/CurrencySettingPage.jsx
import React, { useEffect, useState } from 'react';
import SettingsTabNav from './SettingsTabNav';

const initialCurrencies = [
  { id: 1, name: 'US Dollar', code: 'USD', symbol: '$', exchangeRate: 1.0, status: 'Active' },
  { id: 2, name: 'Euro', code: 'EUR', symbol: '€', exchangeRate: 0.92, status: 'Active' },
  { id: 3, name: 'British Pound', code: 'GBP', symbol: '£', exchangeRate: 0.78, status: 'Active' },
  { id: 4, name: 'Vietnamese Dong', code: 'VND', symbol: '₫', exchangeRate: 25400, status: 'Active' },
  { id: 5, name: 'Japanese Yen', code: 'JPY', symbol: '¥', exchangeRate: 155, status: 'Inactive' }
];

export default function CurrencySettingPage() {
  const [currencies, setCurrencies] = useState(initialCurrencies);
  const [search, setSearch] = useState('');

  // Modal States
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedCurrency, setSelectedCurrency] = useState(null);

  // Form States
  const [formName, setFormName] = useState('');
  const [formCode, setFormCode] = useState('');
  const [formSymbol, setFormSymbol] = useState('');
  const [formRate, setFormRate] = useState('');
  const [formStatus, setFormStatus] = useState('Active');

  useEffect(() => {
    if (window.lucide) {
      window.lucide.createIcons();
    }
  }, [currencies, showAddModal, showEditModal]);

  const handleToggleStatus = (id) => {
    setCurrencies(prev => prev.map(c => c.id === id ? { ...c, status: c.status === 'Active' ? 'Inactive' : 'Active' } : c));
  };

  const handleOpenAdd = () => {
    setFormName('');
    setFormCode('');
    setFormSymbol('');
    setFormRate('');
    setFormStatus('Active');
    setShowAddModal(true);
  };

  const handleAddSubmit = (e) => {
    e.preventDefault();
    const newCurrency = {
      id: Date.now(),
      name: formName,
      code: formCode.toUpperCase(),
      symbol: formSymbol,
      exchangeRate: parseFloat(formRate) || 1.0,
      status: formStatus
    };
    setCurrencies([...currencies, newCurrency]);
    setShowAddModal(false);
  };

  const handleOpenEdit = (curr) => {
    setSelectedCurrency(curr);
    setFormName(curr.name);
    setFormCode(curr.code);
    setFormSymbol(curr.symbol);
    setFormRate(curr.exchangeRate.toString());
    setFormStatus(curr.status);
    setShowEditModal(true);
  };

  const handleEditSubmit = (e) => {
    e.preventDefault();
    setCurrencies(prev => prev.map(c => c.id === selectedCurrency.id ? {
      ...c,
      name: formName,
      code: formCode.toUpperCase(),
      symbol: formSymbol,
      exchangeRate: parseFloat(formRate) || 1.0,
      status: formStatus
    } : c));
    setShowEditModal(false);
  };

  const handleDelete = (id) => {
    if (window.confirm('Are you sure you want to delete this currency?')) {
      setCurrencies(prev => prev.filter(c => c.id !== id));
      if (showEditModal && selectedCurrency?.id === id) {
        setShowEditModal(false);
      }
    }
  };

  const filteredCurrencies = currencies.filter(c =>
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
          <h5 className="card-title mb-0">Currencies Configuration</h5>
          <div className="d-flex align-items-center gap-2">
            <div className="position-relative">
              <input type="text" className="form-control ps-10" placeholder="Search currency..." value={search} onChange={e => setSearch(e.target.value)} />
              <i data-lucide="search" className="size-4 icon-dark position-absolute top-50 start-0 ms-4 translate-middle-y"></i>
            </div>
            <button className="btn btn-primary animate-fade-in" onClick={handleOpenAdd}>
              <i className="ri-add-line me-1"></i>Add Currency
            </button>
          </div>
        </div>

        <div className="card-body pt-0">
          <div className="table-card table-responsive">
            <table className="table text-nowrap align-middle mb-0">
              <thead>
                <tr className="bg-light border-bottom">
                  <th>Currency</th>
                  <th>Code</th>
                  <th>Symbol</th>
                  <th>Exchange Rate (vs USD)</th>
                  <th>Status</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {filteredCurrencies.length === 0 ? (
                  <tr>
                    <td colSpan="6" className="text-center text-muted py-4">No records found.</td>
                  </tr>
                ) : (
                  filteredCurrencies.map(item => (
                    <tr key={item.id}>
                      <td><span className="fw-medium text-reset">{item.name}</span></td>
                      <td><span className="badge bg-secondary-subtle text-secondary font-monospace border border-secondary-subtle fs-13">{item.code}</span></td>
                      <td className="fw-bold fs-15">{item.symbol}</td>
                      <td>{item.exchangeRate.toLocaleString()}</td>
                      <td>
                        <div className="form-switch switch-light-secondary">
                          <input type="checkbox" id={`switch_curr_${item.id}`} checked={item.status === 'Active'} onChange={() => handleToggleStatus(item.id)} />
                          <label className="label" htmlFor={`switch_curr_${item.id}`}></label>
                        </div>
                      </td>
                      <td>
                        <div className="d-flex gap-2">
                          <button className="btn btn-sub-secondary size-8 btn-icon" onClick={() => handleOpenEdit(item)}><i className="ri-edit-line"></i></button>
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

      {/* Add Modal */}
      {showAddModal && (
        <div className="modal fade show d-block" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Add Currency</h5>
                <button type="button" className="btn-close" onClick={() => setShowAddModal(false)}></button>
              </div>
              <form onSubmit={handleAddSubmit}>
                <div className="modal-body">
                  <div className="mb-3">
                    <label className="form-label">Currency Name</label>
                    <input type="text" className="form-control" value={formName} onChange={e => setFormName(e.target.value)} placeholder="e.g. Euro" required />
                  </div>
                  <div className="mb-3">
                    <label className="form-label">Currency Code</label>
                    <input type="text" className="form-control" value={formCode} onChange={e => setFormCode(e.target.value)} placeholder="e.g. EUR" required />
                  </div>
                  <div className="mb-3">
                    <label className="form-label">Symbol</label>
                    <input type="text" className="form-control" value={formSymbol} onChange={e => setFormSymbol(e.target.value)} placeholder="e.g. €" required />
                  </div>
                  <div className="mb-3">
                    <label className="form-label">Exchange Rate (vs 1 USD)</label>
                    <input type="number" step="0.0001" className="form-control" value={formRate} onChange={e => setFormRate(e.target.value)} placeholder="e.g. 0.92" required />
                  </div>
                  <div className="mb-3">
                    <label className="form-label">Status</label>
                    <select className="form-select" value={formStatus} onChange={e => setFormStatus(e.target.value)}>
                      <option value="Active">Active</option>
                      <option value="Inactive">Inactive</option>
                    </select>
                  </div>
                </div>
                <div className="modal-footer">
                  <button type="button" className="btn btn-light" onClick={() => setShowAddModal(false)}>Close</button>
                  <button type="submit" className="btn btn-primary">Save Currency</button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* Edit Modal */}
      {showEditModal && (
        <div className="modal fade show d-block" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Edit Currency</h5>
                <button type="button" className="btn-close" onClick={() => setShowEditModal(false)}></button>
              </div>
              <form onSubmit={handleEditSubmit}>
                <div className="modal-body">
                  <div className="mb-3">
                    <label className="form-label">Currency Name</label>
                    <input type="text" className="form-control" value={formName} onChange={e => setFormName(e.target.value)} required />
                  </div>
                  <div className="mb-3">
                    <label className="form-label">Currency Code</label>
                    <input type="text" className="form-control" value={formCode} onChange={e => setFormCode(e.target.value)} required />
                  </div>
                  <div className="mb-3">
                    <label className="form-label">Symbol</label>
                    <input type="text" className="form-control" value={formSymbol} onChange={e => setFormSymbol(e.target.value)} required />
                  </div>
                  <div className="mb-3">
                    <label className="form-label">Exchange Rate (vs 1 USD)</label>
                    <input type="number" step="0.0001" className="form-control" value={formRate} onChange={e => setFormRate(e.target.value)} required />
                  </div>
                  <div className="mb-3">
                    <label className="form-label">Status</label>
                    <select className="form-select" value={formStatus} onChange={e => setFormStatus(e.target.value)}>
                      <option value="Active">Active</option>
                      <option value="Inactive">Inactive</option>
                    </select>
                  </div>
                </div>
                <div className="modal-footer">
                  <button type="button" className="btn btn-danger me-auto" onClick={() => handleDelete(selectedCurrency.id)}>Delete</button>
                  <button type="button" className="btn btn-light" onClick={() => setShowEditModal(false)}>Close</button>
                  <button type="submit" className="btn btn-primary">Save Changes</button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
