// pages/Dashboard/Inventory/InventoryValuationPage.jsx
import React, { useEffect, useState } from 'react';
import PageBreadcrumb from '../../../components/ui/PageBreadcrumb';
import { ROUTES } from '../../../configs/routes';

const initialWarehouses = [
  { id: 1, name: 'Main Warehouse', code: 'WH-MAIN-01', status: 'Active', lowStock: 2, outOfStock: 1, lastUpdated: '2026-06-01', value: 850000, itemCount: 12400, expectedProfit: 230000 },
  { id: 2, name: 'Branch Warehouse', code: 'WH-BR-02', status: 'Active', lowStock: 4, outOfStock: 0, lastUpdated: '2026-05-31', value: 310000, itemCount: 5120, expectedProfit: 840000 },
  { id: 3, name: 'Sub Warehouse', code: 'WH-SUB-03', status: 'Active', lowStock: 1, outOfStock: 3, lastUpdated: '2026-06-01', value: 90000, itemCount: 1850, expectedProfit: 25000 },
  { id: 4, name: 'Backup Warehouse', code: 'WH-BACK-04', status: 'Inactive', lowStock: 0, outOfStock: 0, lastUpdated: '2026-05-10', value: 0, itemCount: 0, expectedProfit: 0 }
];

export default function InventoryValuationPage() {
  const [warehouses] = useState(initialWarehouses);
  const [search, setSearch] = useState('');

  useEffect(() => {
    if (window.lucide) {
      window.lucide.createIcons();
    }
  }, []);

  const totalValue = warehouses.reduce((acc, curr) => acc + curr.value, 0);
  const totalItems = warehouses.reduce((acc, curr) => acc + curr.itemCount, 0);
  const totalExpectedProfit = warehouses.reduce((acc, curr) => acc + curr.expectedProfit, 0);
  const totalLowStock = warehouses.reduce((acc, curr) => acc + curr.lowStock, 0);

  const filteredWarehouses = warehouses.filter(w => 
    w.name.toLowerCase().includes(search.toLowerCase()) ||
    w.code.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="container-fluid">
      <PageBreadcrumb title="Inventory Valuation" breadcrumbs={[{ label: 'Dashboard', href: ROUTES.DASHBOARD }, { label: 'Inventory' }, { label: 'Valuation' }]} />

      {/* Overview stats cards */}
      <div className="row g-4 mb-4">
        <div className="col-md-3">
          <div className="card h-100">
            <div className="card-body">
              <div className="d-flex align-items-center justify-content-between mb-3">
                <span className="text-muted fw-medium">Total Stock Value</span>
                <span className="avatar size-9 bg-primary-subtle text-primary rounded"><i className="ri-money-dollar-circle-line fs-18"></i></span>
              </div>
              <h3 className="mb-1">${totalValue.toLocaleString()}</h3>
              <p className="text-success fs-sm mb-0"><i className="ri-arrow-up-line"></i> +5.8% <span className="text-muted">vs last month</span></p>
            </div>
          </div>
        </div>
        <div className="col-md-3">
          <div className="card h-100">
            <div className="card-body">
              <div className="d-flex align-items-center justify-content-between mb-3">
                <span className="text-muted fw-medium">Total Items in Stock</span>
                <span className="avatar size-9 bg-success-subtle text-success rounded"><i className="ri-archive-line fs-18"></i></span>
              </div>
              <h3 className="mb-1">{totalItems.toLocaleString()}</h3>
              <p className="text-muted fs-sm mb-0">Across all active locations</p>
            </div>
          </div>
        </div>
        <div className="col-md-3">
          <div className="card h-100">
            <div className="card-body">
              <div className="d-flex align-items-center justify-content-between mb-3">
                <span className="text-muted fw-medium">Expected Profit Margin</span>
                <span className="avatar size-9 bg-info-subtle text-info rounded"><i className="ri-line-chart-line fs-18"></i></span>
              </div>
              <h3 className="mb-1">${totalExpectedProfit.toLocaleString()}</h3>
              <p className="text-success fs-sm mb-0"><i className="ri-arrow-up-line"></i> +12.4% <span className="text-muted">potential profit</span></p>
            </div>
          </div>
        </div>
        <div className="col-md-3">
          <div className="card h-100">
            <div className="card-body">
              <div className="d-flex align-items-center justify-content-between mb-3">
                <span className="text-muted fw-medium">Low Stock Alerts</span>
                <span className="avatar size-9 bg-danger-subtle text-danger rounded"><i className="ri-error-warning-line fs-18"></i></span>
              </div>
              <h3 className="mb-1">{totalLowStock}</h3>
              <p className="text-danger fs-sm mb-0">Needs immediate restock</p>
            </div>
          </div>
        </div>
      </div>

      <div className="row g-4">
        {/* Main valuation table */}
        <div className="col-lg-8">
          <div className="card h-100">
            <div className="card-header d-flex justify-content-between align-items-center">
              <h5 className="card-title mb-0">Valuation by Warehouse</h5>
              <div className="position-relative">
                <input type="text" className="form-control ps-9" placeholder="Search Warehouse..." value={search} onChange={e => setSearch(e.target.value)} />
                <i data-lucide="search" className="size-4 icon-dark position-absolute top-50 start-0 ms-3 translate-middle-y"></i>
              </div>
            </div>
            <div className="card-body pt-0">
              <div className="table-card table-responsive">
                <table className="table align-middle text-nowrap mb-0">
                  <thead>
                    <tr className="bg-light border-bottom">
                      <th>Warehouse</th>
                      <th>Warehouse ID</th>
                      <th>Status</th>
                      <th>Low Stock</th>
                      <th>Out of Stock</th>
                      <th>Last Updated</th>
                      <th className="text-end">Stock Value</th>
                      <th className="text-end">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredWarehouses.length === 0 ? (
                      <tr>
                        <td colSpan="8" className="text-center text-muted py-4">No warehouses found.</td>
                      </tr>
                    ) : (
                      filteredWarehouses.map(item => (
                        <tr key={item.id}>
                          <td><span className="fw-semibold text-reset">{item.name}</span></td>
                          <td><span className="text-muted">{item.code}</span></td>
                          <td>
                            <span className={`badge bg-${item.status === 'Active' ? 'success' : 'secondary'}-subtle text-${item.status === 'Active' ? 'success' : 'secondary'}`}>
                              {item.status}
                            </span>
                          </td>
                          <td className="text-warning fw-semibold">{item.lowStock} items</td>
                          <td className="text-danger fw-semibold">{item.outOfStock} items</td>
                          <td>{item.lastUpdated}</td>
                          <td className="fw-semibold text-end">${item.value.toLocaleString()}</td>
                          <td className="text-end">
                            <button type="button" className="btn btn-sm btn-outline-primary" onClick={() => alert(`Showing breakdown for ${item.name}`)}>
                              View Breakdown
                            </button>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>

        {/* Visual asset allocation chart card */}
        <div className="col-lg-4">
          <div className="card h-100">
            <div className="card-header">
              <h5 className="card-title mb-0">Asset Allocation</h5>
            </div>
            <div className="card-body d-flex flex-column align-items-center justify-content-center">
              {/* Simple CSS-based circular chart */}
              <div className="position-relative mb-4" style={{ width: '180px', height: '180px' }}>
                <svg viewBox="0 0 36 36" className="w-100 h-100">
                  <path
                    className="text-body-secondary"
                    strokeWidth="4"
                    stroke="currentColor"
                    fill="none"
                    d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                  />
                  {/* Main WH: 68% */}
                  <path
                    className="text-primary"
                    strokeWidth="4"
                    strokeDasharray="68, 100"
                    strokeLinecap="round"
                    stroke="currentColor"
                    fill="none"
                    d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                  />
                  {/* Branch WH: 25% (offset by 68) */}
                  <path
                    className="text-success"
                    strokeWidth="4"
                    strokeDasharray="25, 100"
                    strokeDashoffset="-68"
                    strokeLinecap="round"
                    stroke="currentColor"
                    fill="none"
                    d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                  />
                  {/* Sub WH: 7% (offset by 93) */}
                  <path
                    className="text-warning"
                    strokeWidth="4"
                    strokeDasharray="7, 100"
                    strokeDashoffset="-93"
                    strokeLinecap="round"
                    stroke="currentColor"
                    fill="none"
                    d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                  />
                </svg>
                <div className="position-absolute top-50 start-50 translate-middle text-center">
                  <h4 className="mb-0 fw-bold">100%</h4>
                  <span className="text-muted fs-xs">Allocated</span>
                </div>
              </div>

              {/* Legends list */}
              <div className="w-100">
                <div className="d-flex justify-content-between align-items-center mb-2">
                  <span className="d-flex align-items-center gap-2"><span className="size-2-5 bg-primary rounded-circle"></span> Main Warehouse</span>
                  <span className="fw-semibold">68.0%</span>
                </div>
                <div className="d-flex justify-content-between align-items-center mb-2">
                  <span className="d-flex align-items-center gap-2"><span className="size-2-5 bg-success rounded-circle"></span> Branch Warehouse</span>
                  <span className="fw-semibold">24.8%</span>
                </div>
                <div className="d-flex justify-content-between align-items-center mb-2">
                  <span className="d-flex align-items-center gap-2"><span className="size-2-5 bg-warning rounded-circle"></span> Sub Warehouse</span>
                  <span className="fw-semibold">7.2%</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
