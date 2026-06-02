// pages/Dashboard/Inventory/StockListPage.jsx
import React, { useEffect, useState } from 'react';
import PageBreadcrumb from '../../../components/ui/PageBreadcrumb';
import { ROUTES } from '../../../configs/routes';

const initialStock = [
  {id: 1, product: 'Apple iPhone 15', sku: 'APL-15', category: 'Electronics', stock: 120, reorderLevel: 20, status: 'In Stock', cost: 65000, price: 79999, lastUpdated: '10 mins ago', image: '/assets/images/products/img-01.png'},
  {id: 2, product: 'Samsung Galaxy S24', sku: 'SAM-S24', category: 'Electronics', stock: 85, reorderLevel: 15, status: 'In Stock', cost: 72000, price: 89999, lastUpdated: '1 hour ago', image: '/assets/images/products/img-02.png'},
  {id: 3, product: 'Nike Air Max', sku: 'NIK-AMX', category: 'Footwear', stock: 45, reorderLevel: 10, status: 'In Stock', cost: 4500, price: 7999, lastUpdated: '3 hours ago', image: '/assets/images/products/img-03.png'},
  {id: 4, product: 'Leather Wallet', sku: 'GUC-WL', category: 'Accessories', stock: 5, reorderLevel: 10, status: 'Low Stock', cost: 2000, price: 3500, lastUpdated: '1 day ago', image: '/assets/images/products/img-04.png'},
  {id: 5, product: 'Water Bottle', sku: 'PUM-BT', category: 'Accessories', stock: 0, reorderLevel: 15, status: 'Out of Stock', cost: 500, price: 999, lastUpdated: '2 days ago', image: '/assets/images/products/img-10.png'}
];

export default function StockListPage() {
  const [stock, setStock] = useState(initialStock);
  const [search, setSearch] = useState('');

  useEffect(() => {
    if (window.lucide) window.lucide.createIcons();
  }, [stock]);

  const filteredStock = stock.filter(item => 
    item.product.toLowerCase().includes(search.toLowerCase()) || 
    item.sku.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="container-fluid">
      <PageBreadcrumb title="Stock List" breadcrumbs={[{ label: 'Dashboard', href: ROUTES.DASHBOARD }, { label: 'Inventory' }, { label: 'Stock List' }]} />
      
      <div className="card">
        <div className="card-header">
          <h5 className="card-title mb-0">Inventory Stock List</h5>
        </div>
        <div className="card-body">
          <div className="d-flex flex-wrap gap-2 justify-content-between align-items-center">
            <div className="position-relative">
              <input type="text" className="form-control ps-9" value={search} onChange={e => setSearch(e.target.value)} placeholder="Search product or SKU..." />
              <i className="ri-search-line position-absolute top-50 start-0 ms-3 translate-middle-y text-muted"></i>
            </div>
          </div>
        </div>
        <div className="card-body pt-0">
          <div className="table-card table-responsive">
            <table className="table table-borderless mb-0 text-nowrap align-middle">
              <thead>
                <tr className="bg-light border-bottom">
                  <th scope="col" className="text-muted fw-medium">Product</th>
                  <th scope="col" className="text-muted fw-medium">SKU</th>
                  <th scope="col" className="text-muted fw-medium">Category</th>
                  <th scope="col" className="text-muted fw-medium">Stock Qty</th>
                  <th scope="col" className="text-muted fw-medium">Reorder Level</th>
                  <th scope="col" className="text-muted fw-medium">Cost Price</th>
                  <th scope="col" className="text-muted fw-medium">Selling Price</th>
                  <th scope="col" className="text-muted fw-medium">Status</th>
                  <th scope="col" className="text-muted fw-medium">Last Updated</th>
                </tr>
              </thead>
              <tbody>
                {filteredStock.map(item => (
                  <tr key={item.id}>
                    <td>
                      <div className="d-flex align-items-center gap-2">
                        <div className="avatar size-9 border rounded-1 p-1">
                          <img src={item.image} className="img-fluid size-8" alt={item.product} />
                        </div>
                        <span className="fw-medium">{item.product}</span>
                      </div>
                    </td>
                    <td>{item.sku}</td>
                    <td>{item.category}</td>
                    <td>{item.stock}</td>
                    <td>{item.reorderLevel}</td>
                    <td>${item.cost.toLocaleString()}</td>
                    <td>${item.price.toLocaleString()}</td>
                    <td>
                      <span className={`badge bg-${item.status === 'In Stock' ? 'success' : item.status === 'Low Stock' ? 'warning' : 'danger'}-subtle text-${item.status === 'In Stock' ? 'success' : item.status === 'Low Stock' ? 'warning' : 'danger'}`}>
                        {item.status}
                      </span>
                    </td>
                    <td className="text-muted">{item.lastUpdated}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
