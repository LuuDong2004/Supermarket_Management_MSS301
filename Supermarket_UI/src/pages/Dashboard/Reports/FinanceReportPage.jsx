// pages/Dashboard/Reports/FinanceReportPage.jsx
import React, { useEffect, useState } from 'react';
import PageBreadcrumb from '../../../components/ui/PageBreadcrumb';
import { ROUTES } from '../../../configs/routes';

const initialFinance = [
  { id: 1, name: 'Wireless Mouse', sku: 'WM-102', category: 'Accessories', unitsSold: 120, costPrice: 10.00, sellingPrice: 18.00, tax: 180.00, discount: 0, image: '/assets/img-01-BBWp8t8E.png', status: 'Profitable' },
  { id: 2, name: 'Gaming Keyboard', sku: 'GK-210', category: 'Peripherals', unitsSold: 85, costPrice: 25.00, sellingPrice: 45.00, tax: 240.00, discount: 0, image: '/assets/img-02-ClVfz9I5.png', status: 'Profitable' },
  { id: 3, name: 'Wired Earphones', sku: 'WE-114', category: 'Sound', unitsSold: 140, costPrice: 6.00, sellingPrice: 5.50, tax: 95.00, discount: 0, image: '/assets/img-03-oTTY_McP.png', status: 'Loss' },
  { id: 4, name: 'Smart Watch', sku: 'SW-889', category: 'Wearables', unitsSold: 50, costPrice: 80.00, sellingPrice: 120.00, tax: 300.00, discount: 5, image: '/assets/img-04-DZ4OtBxS.png', status: 'Profitable' }
];

const categories = ['Accessories', 'Peripherals', 'Sound', 'Wearables', 'Gadgets'];
const statuses = ['Profitable', 'Loss'];

export default function FinanceReportPage() {
  const [financeList, setFinanceList] = useState(initialFinance);
  const [search, setSearch] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');

  // Accordion Inline Edit States
  const [expandedRowId, setExpandedRowId] = useState(null);
  
  // Inline edit inputs
  const [editSku, setEditSku] = useState('');
  const [editCategory, setEditCategory] = useState('');
  const [editUnitsSold, setEditUnitsSold] = useState('');
  const [editCostPrice, setEditCostPrice] = useState('');
  const [editSellingPrice, setEditSellingPrice] = useState('');
  const [editTax, setEditTax] = useState('');
  const [editDiscount, setEditDiscount] = useState('');
  const [editStatus, setEditStatus] = useState('');

  // Add Finance Modal
  const [showAddModal, setShowAddModal] = useState(false);
  const [addName, setAddName] = useState('');
  const [addSku, setAddSku] = useState('');
  const [addCategory, setAddCategory] = useState(categories[0]);
  const [addUnitsSold, setAddUnitsSold] = useState('');
  const [addCostPrice, setAddCostPrice] = useState('');
  const [addSellingPrice, setAddSellingPrice] = useState('');
  const [addTax, setAddTax] = useState('');
  const [addDiscount, setAddDiscount] = useState('');
  const [addStatus, setAddStatus] = useState(statuses[0]);

  useEffect(() => {
    if (window.lucide) {
      window.lucide.createIcons();
    }
  }, [financeList, expandedRowId, showAddModal]);

  const toggleRow = (item) => {
    if (expandedRowId === item.id) {
      setExpandedRowId(null);
    } else {
      setExpandedRowId(item.id);
      setEditSku(item.sku);
      setEditCategory(item.category);
      setEditUnitsSold(item.unitsSold.toString());
      setEditCostPrice(item.costPrice.toString());
      setEditSellingPrice(item.sellingPrice.toString());
      setEditTax(item.tax.toString());
      setEditDiscount(item.discount.toString());
      setEditStatus(item.status);
    }
  };

  const handleUpdate = (id) => {
    setFinanceList(prev => prev.map(item => {
      if (item.id === id) {
        const units = parseInt(editUnitsSold) || 0;
        const cp = parseFloat(editCostPrice) || 0;
        const sp = parseFloat(editSellingPrice) || 0;
        const discountVal = parseFloat(editDiscount) || 0;
        const totalRev = units * sp;
        const discAmount = totalRev * (discountVal / 100);
        const netRev = totalRev - discAmount;
        const totalCost = units * cp;
        const profit = netRev - totalCost;
        const calculatedStatus = profit >= 0 ? 'Profitable' : 'Loss';

        return {
          ...item,
          sku: editSku,
          category: editCategory,
          unitsSold: units,
          costPrice: cp,
          sellingPrice: sp,
          tax: parseFloat(editTax) || 0,
          discount: discountVal,
          status: calculatedStatus
        };
      }
      return item;
    }));
    setExpandedRowId(null);
  };

  const handleDelete = (id) => {
    if (window.confirm('Are you sure you want to delete this financial record?')) {
      setFinanceList(prev => prev.filter(item => item.id !== id));
      setExpandedRowId(null);
    }
  };

  const handleAddSubmit = (e) => {
    e.preventDefault();
    const units = parseInt(addUnitsSold) || 0;
    const cp = parseFloat(addCostPrice) || 0;
    const sp = parseFloat(addSellingPrice) || 0;
    const discountVal = parseFloat(addDiscount) || 0;
    const totalRev = units * sp;
    const discAmount = totalRev * (discountVal / 100);
    const netRev = totalRev - discAmount;
    const totalCost = units * cp;
    const profit = netRev - totalCost;
    const calculatedStatus = profit >= 0 ? 'Profitable' : 'Loss';

    const newItem = {
      id: Date.now(),
      name: addName,
      sku: addSku,
      category: addCategory,
      unitsSold: units,
      costPrice: cp,
      sellingPrice: sp,
      tax: parseFloat(addTax) || 0,
      discount: discountVal,
      image: '/assets/img-01-BBWp8t8E.png',
      status: calculatedStatus
    };

    setFinanceList([...financeList, newItem]);
    setShowAddModal(false);
    // Reset form
    setAddName('');
    setAddSku('');
    setAddCategory(categories[0]);
    setAddUnitsSold('');
    setAddCostPrice('');
    setAddSellingPrice('');
    setAddTax('');
    setAddDiscount('');
  };

  const filteredFinance = financeList.filter(item => {
    const matchesSearch = item.name.toLowerCase().includes(search.toLowerCase()) || 
                          item.sku.toLowerCase().includes(search.toLowerCase());
    const matchesCategory = categoryFilter === 'all' || item.category === categoryFilter;
    const matchesStatus = statusFilter === 'all' || item.status === statusFilter;

    return matchesSearch && matchesCategory && matchesStatus;
  });

  return (
    <div className="container-fluid">
      <PageBreadcrumb title="Finance Report" breadcrumbs={[{ label: 'Dashboard', href: ROUTES.DASHBOARD }, { label: 'Reports' }, { label: 'Finance' }]} />

      <div className="card">
        <div className="card-header d-flex flex-wrap justify-content-between align-items-center gap-2">
          <h5 className="card-title mb-0">Finance Summary</h5>
          <div className="d-flex flex-wrap gap-2">
            <div className="position-relative">
              <input type="text" className="form-control ps-10" placeholder="Search product/SKU..." value={search} onChange={e => setSearch(e.target.value)} />
              <i data-lucide="search" className="size-4 icon-dark position-absolute top-50 start-0 ms-4 translate-middle-y"></i>
            </div>
            <select className="form-select w-44" value={categoryFilter} onChange={e => setCategoryFilter(e.target.value)}>
              <option value="all">Category</option>
              {categories.map(c => <option key={c} value={c}>{c}</option>)}
            </select>
            <select className="form-select w-44" value={statusFilter} onChange={e => setStatusFilter(e.target.value)}>
              <option value="all">Status</option>
              {statuses.map(s => <option key={s} value={s}>{s}</option>)}
            </select>
            <button type="button" className="btn btn-primary" onClick={() => setShowAddModal(true)}>
              <i data-lucide="plus" className="size-4 me-1"></i>Add Finance
            </button>
          </div>
        </div>

        <div className="card-body pt-0">
          <div className="table-card table-responsive">
            <table className="table text-nowrap align-middle mb-0">
              <thead>
                <tr className="bg-light border-bottom">
                  <th className="text-muted fw-medium">Product</th>
                  <th className="text-muted fw-medium">SKU</th>
                  <th className="text-muted fw-medium">Category</th>
                  <th className="text-muted fw-medium">Units Sold</th>
                  <th className="text-muted fw-medium">Gross Profit</th>
                  <th className="text-muted fw-medium">Tax</th>
                  <th className="text-muted fw-medium">Status</th>
                  <th className="text-muted fw-medium">Total Cost</th>
                  <th className="text-muted fw-medium">Action</th>
                </tr>
              </thead>
              <tbody>
                {filteredFinance.length === 0 ? (
                  <tr>
                    <td colSpan="9" className="text-center text-muted py-4">No records found.</td>
                  </tr>
                ) : (
                  filteredFinance.map(item => {
                    const isExpanded = expandedRowId === item.id;
                    const totalCost = item.unitsSold * item.costPrice;
                    const grossRevenue = item.unitsSold * item.sellingPrice;
                    const netRevenue = grossRevenue - (grossRevenue * (item.discount / 100));
                    const grossProfit = netRevenue - totalCost;

                    return (
                      <React.Fragment key={item.id}>
                        <tr>
                          <td>
                            <div className="d-flex align-items-center gap-2">
                              <div className="avatar size-11 border rounded-1 p-1">
                                <img src={item.image} loading="lazy" alt="Product" className="img-fluid" onError={e => { e.target.src = '/assets/img-01-BBWp8t8E.png'; }} />
                              </div>
                              <div>
                                <span className="text-reset fw-medium d-block">{item.name}</span>
                                <span className="text-muted fs-sm">{item.category}</span>
                              </div>
                            </div>
                          </td>
                          <td><span className="link link-custom-primary fw-semibold">{item.sku}</span></td>
                          <td>{item.category}</td>
                          <td>{item.unitsSold}</td>
                          <td className={grossProfit >= 0 ? 'text-success fw-medium' : 'text-danger fw-medium'}>
                            <i className={grossProfit >= 0 ? 'ri-arrow-up-line me-1' : 'ri-arrow-down-line me-1'}></i>
                            ${Math.abs(grossProfit).toFixed(2)}
                          </td>
                          <td>${item.tax.toFixed(2)}</td>
                          <td>
                            <span className={`badge bg-${item.status === 'Profitable' ? 'success' : 'danger'}-subtle text-${item.status === 'Profitable' ? 'success' : 'danger'} border border-${item.status === 'Profitable' ? 'success' : 'danger'}-subtle`}>
                              {item.status}
                            </span>
                          </td>
                          <td>${totalCost.toFixed(2)}</td>
                          <td>
                            <div className="d-flex gap-2">
                              <button className={`btn ${isExpanded ? 'btn-secondary' : 'btn-sub-secondary'} btn-sm px-3`} onClick={() => toggleRow(item)}>
                                {isExpanded ? 'Close' : 'Edit'}
                              </button>
                            </div>
                          </td>
                        </tr>

                        {/* Accordion inline edit form */}
                        {isExpanded && (
                          <tr>
                            <td colSpan="9" className="p-0 border-0 bg-light bg-opacity-75">
                              <div className="p-4 border-bottom">
                                <form onSubmit={(e) => { e.preventDefault(); handleUpdate(item.id); }}>
                                  <div className="row g-4">
                                    <div className="col-md-2 text-center border-end">
                                      <div className="avatar size-24 bg-body-secondary border rounded p-1 mb-3 mx-auto">
                                        <img src={item.image} className="img-fluid" alt="Product" onError={e => { e.target.src = '/assets/img-01-BBWp8t8E.png'; }} />
                                      </div>
                                      <div>
                                        <label className="form-label">SKU</label>
                                        <input type="text" className="form-control form-control-sm" value={editSku} onChange={e => setEditSku(e.target.value)} required />
                                      </div>
                                    </div>
                                    <div className="col-md-8">
                                      <div className="row g-3">
                                        <div className="col-md-4">
                                          <label className="form-label">Product Name</label>
                                          <input type="text" className="form-control form-control-sm" value={item.name} readOnly disabled />
                                        </div>
                                        <div className="col-md-4">
                                          <label className="form-label">Category</label>
                                          <select className="form-select form-select-sm" value={editCategory} onChange={e => setEditCategory(e.target.value)}>
                                            {categories.map(c => <option key={c} value={c}>{c}</option>)}
                                          </select>
                                        </div>
                                        <div className="col-md-4">
                                          <label className="form-label">Units Sold</label>
                                          <input type="number" className="form-control form-control-sm" value={editUnitsSold} onChange={e => setEditUnitsSold(e.target.value)} required />
                                        </div>
                                        <div className="col-md-4">
                                          <label className="form-label">Cost Price ($)</label>
                                          <input type="number" step="0.01" className="form-control form-control-sm" value={editCostPrice} onChange={e => setEditCostPrice(e.target.value)} required />
                                        </div>
                                        <div className="col-md-4">
                                          <label className="form-label">Selling Price ($)</label>
                                          <input type="number" step="0.01" className="form-control form-control-sm" value={editSellingPrice} onChange={e => setEditSellingPrice(e.target.value)} required />
                                        </div>
                                        <div className="col-md-4">
                                          <label className="form-label">Tax ($)</label>
                                          <input type="number" step="0.01" className="form-control form-control-sm" value={editTax} onChange={e => setEditTax(e.target.value)} required />
                                        </div>
                                      </div>
                                    </div>
                                    <div className="col-md-2 border-start">
                                      <div className="mb-3">
                                        <label className="form-label">Discount (%)</label>
                                        <input type="number" className="form-control form-control-sm" value={editDiscount} onChange={e => setEditDiscount(e.target.value)} />
                                      </div>
                                      <div className="mb-3">
                                        <label className="form-label">Calculated Profit</label>
                                        <div className="form-control-plaintext fw-semibold">
                                          ${( ( (parseInt(editUnitsSold) || 0) * (parseFloat(editSellingPrice) || 0) ) - ( ( (parseInt(editUnitsSold) || 0) * (parseFloat(editSellingPrice) || 0) ) * ((parseFloat(editDiscount) || 0) / 100) ) - ( (parseInt(editUnitsSold) || 0) * (parseFloat(editCostPrice) || 0) ) ).toFixed(2)}
                                        </div>
                                      </div>
                                    </div>
                                  </div>
                                  <div className="d-flex justify-content-end gap-2 mt-3">
                                    <button type="button" className="btn btn-danger btn-sm px-4" onClick={() => handleDelete(item.id)}>Delete</button>
                                    <button type="submit" className="btn btn-secondary btn-sm px-4">Update</button>
                                  </div>
                                </form>
                              </div>
                            </td>
                          </tr>
                        )}
                      </React.Fragment>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Add Finance Modal */}
      {showAddModal && (
        <div className="modal fade show d-block" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
          <div className="modal-dialog modal-dialog-centered modal-lg">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Add Finance Record</h5>
                <button type="button" className="btn-close" onClick={() => setShowAddModal(false)}></button>
              </div>
              <form onSubmit={handleAddSubmit}>
                <div className="modal-body">
                  <div className="row g-3">
                    <div className="col-md-6">
                      <label className="form-label">Product Name</label>
                      <input type="text" className="form-control" value={addName} onChange={e => setAddName(e.target.value)} required />
                    </div>
                    <div className="col-md-6">
                      <label className="form-label">SKU</label>
                      <input type="text" className="form-control" value={addSku} onChange={e => setAddSku(e.target.value)} required />
                    </div>
                    <div className="col-md-6">
                      <label className="form-label">Category</label>
                      <select className="form-select" value={addCategory} onChange={e => setAddCategory(e.target.value)}>
                        {categories.map(c => <option key={c} value={c}>{c}</option>)}
                      </select>
                    </div>
                    <div className="col-md-6">
                      <label className="form-label">Units Sold</label>
                      <input type="number" className="form-control" value={addUnitsSold} onChange={e => setAddUnitsSold(e.target.value)} required />
                    </div>
                    <div className="col-md-4">
                      <label className="form-label">Cost Price ($)</label>
                      <input type="number" step="0.01" className="form-control" value={addCostPrice} onChange={e => setAddCostPrice(e.target.value)} required />
                    </div>
                    <div className="col-md-4">
                      <label className="form-label">Selling Price ($)</label>
                      <input type="number" step="0.01" className="form-control" value={addSellingPrice} onChange={e => setAddSellingPrice(e.target.value)} required />
                    </div>
                    <div className="col-md-4">
                      <label className="form-label">Tax ($)</label>
                      <input type="number" step="0.01" className="form-control" value={addTax} onChange={e => setAddTax(e.target.value)} required />
                    </div>
                    <div className="col-md-6">
                      <label className="form-label">Discount (%)</label>
                      <input type="number" className="form-control" value={addDiscount} onChange={e => setAddDiscount(e.target.value)} />
                    </div>
                  </div>
                </div>
                <div className="modal-footer">
                  <button type="button" className="btn btn-light" onClick={() => setShowAddModal(false)}>Close</button>
                  <button type="submit" className="btn btn-primary">Save Record</button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
