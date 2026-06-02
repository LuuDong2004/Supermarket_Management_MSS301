// pages/Dashboard/Inventory/InventoryAlertsPage.jsx
import React, { useEffect, useState } from 'react';
import PageBreadcrumb from '../../../components/ui/PageBreadcrumb';
import { ROUTES } from '../../../configs/routes';

const initialAlerts = [
  { id: 1, product: 'Apple iPhone 15', sku: 'APL-IP15-128', warehouse: 'Main Warehouse', currentStock: 2, minStock: 10, alertLevel: 'Critical' },
  { id: 2, product: 'Nike Air Max 270', sku: 'NKE-AM270-01', warehouse: 'Branch Warehouse', currentStock: 4, minStock: 8, alertLevel: 'Low' },
  { id: 3, product: 'Samsung Galaxy Buds Pro', sku: 'SAM-BUDS-PRO', warehouse: 'Sub Warehouse', currentStock: 1, minStock: 5, alertLevel: 'Critical' }
];

const warehousesList = ['Main Warehouse', 'Branch Warehouse', 'Sub Warehouse'];

export default function InventoryAlertsPage() {
  const [alerts, setAlerts] = useState(initialAlerts);
  const [search, setSearch] = useState('');
  const [warehouseFilter, setWarehouseFilter] = useState('all');
  const [levelFilter, setLevelFilter] = useState('all');

  useEffect(() => {
    if (window.lucide) {
      window.lucide.createIcons();
    }
  }, [alerts]);

  const handleRestock = (id) => {
    alert(`Reorder request sent to supplier for item ID: ${id}`);
    setAlerts(prev => prev.map(a => a.id === id ? { ...a, currentStock: a.minStock + 10, alertLevel: 'Resolved' } : a).filter(a => a.alertLevel !== 'Resolved'));
  };

  const filteredAlerts = alerts.filter(a => {
    const matchesSearch = a.product.toLowerCase().includes(search.toLowerCase()) || 
                          a.sku.toLowerCase().includes(search.toLowerCase());
    const matchesWarehouse = warehouseFilter === 'all' || a.warehouse.toLowerCase() === warehouseFilter.toLowerCase();
    const matchesLevel = levelFilter === 'all' || a.alertLevel.toLowerCase() === levelFilter.toLowerCase();
    return matchesSearch && matchesWarehouse && matchesLevel;
  });

  return (
    <div className="container-fluid">
      <PageBreadcrumb title="Inventory Alerts" breadcrumbs={[{ label: 'Dashboard', href: ROUTES.DASHBOARD }, { label: 'Inventory' }, { label: 'Alerts' }]} />

      <div className="card">
        <div className="card-header d-flex flex-wrap gap-3 justify-content-between align-items-center">
          <h5 className="card-title mb-0">Low & Critical Stock Alerts</h5>
          <div className="d-flex flex-wrap gap-2 align-items-center ms-auto">
            <div className="position-relative">
              <input type="text" className="form-control ps-9" placeholder="Search Product..." value={search} onChange={e => setSearch(e.target.value)} />
              <i data-lucide="search" className="size-4 icon-dark position-absolute top-50 start-0 ms-3 translate-middle-y"></i>
            </div>
            <select className="form-select w-36" value={warehouseFilter} onChange={e => setWarehouseFilter(e.target.value)}>
              <option value="all">All Warehouses</option>
              {warehousesList.map(w => (
                <option key={w} value={w}>{w}</option>
              ))}
            </select>
            <select className="form-select w-36" value={levelFilter} onChange={e => setLevelFilter(e.target.value)}>
              <option value="all">All Levels</option>
              <option value="low">Low</option>
              <option value="critical">Critical</option>
            </select>
          </div>
        </div>
        <div className="card-body pt-0">
          <div className="table-card table-responsive">
            <table className="table align-middle text-nowrap mb-0">
              <thead>
                <tr className="bg-light border-bottom">
                  <th>Product</th>
                  <th>SKU</th>
                  <th>Warehouse</th>
                  <th>Current Stock</th>
                  <th>Min Stock (Threshold)</th>
                  <th>Alert Level</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {filteredAlerts.length === 0 ? (
                  <tr>
                    <td colSpan="7" className="text-center text-muted py-4">No stock alerts found. All stock levels are within normal range!</td>
                  </tr>
                ) : (
                  filteredAlerts.map(item => (
                    <tr key={item.id}>
                      <td><span className="fw-semibold text-reset">{item.product}</span></td>
                      <td><span className="fw-semibold text-primary">{item.sku}</span></td>
                      <td>{item.warehouse}</td>
                      <td className="fw-semibold text-danger">{item.currentStock}</td>
                      <td>{item.minStock}</td>
                      <td>
                        <span className={`badge bg-${item.alertLevel === 'Critical' ? 'danger' : 'warning'}-subtle text-${item.alertLevel === 'Critical' ? 'danger' : 'warning'}`}>
                          {item.alertLevel}
                        </span>
                      </td>
                      <td>
                        <button type="button" className="btn btn-sm btn-outline-primary d-flex align-items-center gap-1" onClick={() => handleRestock(item.id)}>
                          <i className="ri-shopping-cart-2-line"></i> Reorder
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
  );
}
