// pages/Dashboard/Reports/ProductReportPage.jsx
import React, { useEffect, useState } from 'react';
import PageBreadcrumb from '../../../components/ui/PageBreadcrumb';
import { ROUTES } from '../../../configs/routes';

const initialProducts = [
  { id: 1, productId: 'PEP-19115', name: 'Blouse Ruffle Tube top', image: '/assets/img-01-BBWp8t8E.png', category: 'Fashion', stockAvailable: true, price: 159, qty: 154, status: 'Published', brand: 'Zara', discount: 0, revenue: 15236, cost: 8.50 },
  { id: 2, productId: 'PEP-19112', name: 'Printed Sun Dress', image: '/assets/img-02-ClVfz9I5.png', category: 'Fashion', stockAvailable: false, price: 179, qty: 80, status: 'Published', brand: 'H&M', discount: 10, revenue: 8430, cost: 12.00 },
  { id: 3, productId: 'PEP-19113', name: 'Casual Shirt Summer', image: '/assets/img-03-oTTY_McP.png', category: 'Apparel', stockAvailable: true, price: 89, qty: 210, status: 'Published', brand: 'Zara', discount: 0, revenue: 18690, cost: 6.20 },
  { id: 4, productId: 'PEP-19114', name: 'Elegant Leather Bag', image: '/assets/img-04-DZ4OtBxS.png', category: 'Bags', stockAvailable: true, price: 120, qty: 45, status: 'Inactive', brand: 'Gucci', discount: 5, revenue: 5400, cost: 45.00 },
  { id: 5, productId: 'PEP-19116', name: 'Summer Sandals', image: '/assets/img-05-DPzi-ptA.png', category: 'Footwear', stockAvailable: true, price: 65, qty: 120, status: 'Published', brand: 'Nike', discount: 0, revenue: 7800, cost: 15.00 }
];

const categories = ['Fashion', 'Apparel', 'Bags', 'Footwear', 'Accessories'];
const statuses = ['Published', 'Inactive'];

export default function ProductReportPage() {
  const [products, setProducts] = useState(initialProducts);
  const [search, setSearch] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [dateFilter, setDateFilter] = useState('');

  // Row Expand State for Accordion Edit
  const [expandedRowId, setExpandedRowId] = useState(null);

  // Expanded Row Form State
  const [editProductId, setEditProductId] = useState('');
  const [editProductName, setEditProductName] = useState('');
  const [editCategory, setEditCategory] = useState(categories[0]);
  const [editPrice, setEditPrice] = useState('');
  const [editQty, setEditQty] = useState('');
  const [editStatus, setEditStatus] = useState(statuses[0]);
  const [editBrand, setEditBrand] = useState('');
  const [editDiscount, setEditDiscount] = useState('');
  const [editRevenue, setEditRevenue] = useState('');
  const [editCost, setEditCost] = useState('');
  const [editStockAvailable, setEditStockAvailable] = useState(true);

  useEffect(() => {
    if (window.lucide) {
      window.lucide.createIcons();
    }
  }, [products, expandedRowId]);

  const toggleRow = (item) => {
    if (expandedRowId === item.id) {
      setExpandedRowId(null);
    } else {
      setExpandedRowId(item.id);
      // Load item data to form
      setEditProductId(item.productId);
      setEditProductName(item.name);
      setEditCategory(item.category);
      setEditPrice(item.price.toString());
      setEditQty(item.qty.toString());
      setEditStatus(item.status);
      setEditBrand(item.brand);
      setEditDiscount(item.discount.toString());
      setEditRevenue(item.revenue.toString());
      setEditCost(item.cost.toString());
      setEditStockAvailable(item.stockAvailable);
    }
  };

  const handleUpdate = (id) => {
    setProducts(prev => prev.map(item => item.id === id ? {
      ...item,
      productId: editProductId,
      name: editProductName,
      category: editCategory,
      price: parseFloat(editPrice) || 0,
      qty: parseInt(editQty) || 0,
      status: editStatus,
      brand: editBrand,
      discount: parseFloat(editDiscount) || 0,
      revenue: parseFloat(editRevenue) || 0,
      cost: parseFloat(editCost) || 0,
      stockAvailable: editStockAvailable
    } : item));
    setExpandedRowId(null);
  };

  const handleDelete = (id) => {
    setProducts(prev => prev.filter(item => item.id !== id));
    setExpandedRowId(null);
  };

  const handleToggleStockAvailable = (id, val) => {
    setProducts(prev => prev.map(item => item.id === id ? { ...item, stockAvailable: val } : item));
  };

  const filteredProducts = products.filter(item => {
    const matchesSearch = item.name.toLowerCase().includes(search.toLowerCase()) || 
                          item.productId.toLowerCase().includes(search.toLowerCase()) ||
                          item.brand.toLowerCase().includes(search.toLowerCase());
    const matchesCategory = categoryFilter === 'all' || item.category.toLowerCase() === categoryFilter.toLowerCase();
    const matchesStatus = statusFilter === 'all' || item.status.toLowerCase() === statusFilter.toLowerCase();

    return matchesSearch && matchesCategory && matchesStatus;
  });

  // Stats calculation
  const totalProducts = products.length;
  const publishedCount = products.filter(p => p.status === 'Published').length;
  const inactiveCount = products.filter(p => p.status === 'Inactive').length;
  const outOfStockCount = products.filter(p => p.qty === 0 || !p.stockAvailable).length;
  const inventoryValue = products.reduce((sum, p) => sum + (p.price * p.qty), 0);

  return (
    <div className="container-fluid">
      <PageBreadcrumb title="Products Report" breadcrumbs={[{ label: 'Dashboard', href: ROUTES.DASHBOARD }, { label: 'Reports' }, { label: 'Products' }]} />

      {/* Stats Cards */}
      <div className="row row-cols-1 row-cols-md-2 row-cols-lg-3 row-cols-xxl-5 mb-4">
        <div className="col">
          <div className="card h-100">
            <div className="card-body">
              <p className="text-muted mb-4">Total Products</p>
              <div className="d-flex justify-content-between align-items-end mb-3">
                <h3 className="mb-0 font-base">{totalProducts}</h3>
                <span className="text-success fw-medium">
                  <i className="ri-arrow-up-line me-1"></i>9.8%
                </span>
              </div>
              <div className="progress progress-1" style={{ height: '4px' }}>
                <div className="progress-bar" style={{ width: '60%' }}></div>
              </div>
            </div>
          </div>
        </div>
        <div className="col">
          <div className="card h-100">
            <div className="card-body">
              <p className="text-muted mb-4">Published Products</p>
              <div className="d-flex justify-content-between align-items-end mb-3">
                <h3 className="mb-0 font-base">{publishedCount}</h3>
                <span className="text-success fw-medium">
                  <i className="ri-arrow-up-line me-1"></i>6.3%
                </span>
              </div>
              <div className="progress progress-1" style={{ height: '4px' }}>
                <div className="progress-bar bg-secondary" style={{ width: '75%' }}></div>
              </div>
            </div>
          </div>
        </div>
        <div className="col">
          <div className="card h-100">
            <div className="card-body">
              <p className="text-muted mb-4">Inactive Products</p>
              <div className="d-flex justify-content-between align-items-end mb-3">
                <h3 className="mb-0 font-base">{inactiveCount}</h3>
                <span className="text-danger fw-medium">
                  <i className="ri-arrow-down-line me-1"></i>2.1%
                </span>
              </div>
              <div className="progress progress-1" style={{ height: '4px' }}>
                <div className="progress-bar bg-danger" style={{ width: '30%' }}></div>
              </div>
            </div>
          </div>
        </div>
        <div className="col">
          <div className="card h-100">
            <div className="card-body">
              <p className="text-muted mb-4">Out of Stock</p>
              <div className="d-flex justify-content-between align-items-end mb-3">
                <h3 className="mb-0 font-base">{outOfStockCount}</h3>
                <span className="text-success fw-medium">
                  <i className="ri-arrow-up-line me-1"></i>4.7%
                </span>
              </div>
              <div className="progress progress-1" style={{ height: '4px' }}>
                <div className="progress-bar bg-success" style={{ width: '40%' }}></div>
              </div>
            </div>
          </div>
        </div>
        <div className="col">
          <div className="card h-100">
            <div className="card-body">
              <p className="text-muted mb-4">Inventory Value</p>
              <div className="d-flex justify-content-between align-items-end mb-3">
                <h3 className="mb-0 font-base">${(inventoryValue / 1000).toFixed(1)}K</h3>
                <span className="text-success fw-medium">
                  <i className="ri-arrow-up-line me-1"></i>12.4%
                </span>
              </div>
              <div className="progress progress-1" style={{ height: '4px' }}>
                <div className="progress-bar bg-info" style={{ width: '68%' }}></div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Product List Table with Accordion Edit */}
      <div className="card">
        <div className="card-header d-flex flex-wrap gap-2 align-items-center justify-content-between mb-4">
          <h5 className="card-title mb-0">Product List</h5>
          <div className="d-flex flex-wrap gap-2 align-items-center ms-auto">
            <div className="position-relative">
              <input type="text" className="form-control ps-10" placeholder="Search products..." value={search} onChange={e => setSearch(e.target.value)} />
              <i data-lucide="search" className="size-4 icon-dark position-absolute top-50 start-0 ms-4 translate-middle-y"></i>
            </div>
            <div className="position-relative flex-shrink-0 w-48">
              <input type="date" className="form-control" value={dateFilter} onChange={e => setDateFilter(e.target.value)} />
            </div>
            <select className="form-select w-40" value={categoryFilter} onChange={e => setCategoryFilter(e.target.value)}>
              <option value="all">Category</option>
              {categories.map(c => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>
            <select className="form-select w-40" value={statusFilter} onChange={e => setStatusFilter(e.target.value)}>
              <option value="all">Status</option>
              {statuses.map(s => (
                <option key={s} value={s}>{s}</option>
              ))}
            </select>
          </div>
        </div>

        <div className="card-body pt-0">
          <div className="table-card table-responsive">
            <table className="table text-nowrap align-middle mb-0">
              <thead>
                <tr className="bg-light border-bottom">
                  <th>
                    <div className="form-check check-primary">
                      <input className="form-check-input" type="checkbox" id="checkAllProducts" />
                    </div>
                  </th>
                  <th className="fw-medium text-muted">Product ID</th>
                  <th className="fw-medium text-muted">Product</th>
                  <th className="fw-medium text-muted">Category</th>
                  <th className="fw-medium text-muted">Stock available</th>
                  <th className="fw-medium text-muted">Price</th>
                  <th className="fw-medium text-muted">Status</th>
                  <th className="fw-medium text-muted">Action</th>
                </tr>
              </thead>
              <tbody>
                {filteredProducts.length === 0 ? (
                  <tr>
                    <td colSpan="8" className="text-center text-muted py-4">No records found.</td>
                  </tr>
                ) : (
                  filteredProducts.map(item => {
                    const isExpanded = expandedRowId === item.id;
                    return (
                      <React.Fragment key={item.id}>
                        <tr>
                          <td>
                            <div className="form-check check-primary">
                              <input className="form-check-input" type="checkbox" id={`check_${item.id}`} />
                            </div>
                          </td>
                          <td><a href="#!" className="link link-custom-primary fw-semibold">{item.productId}</a></td>
                          <td>
                            <div className="d-flex align-items-center gap-2">
                              <div className="avatar size-9 border rounded-1 p-1">
                                <img src={item.image} className="img-fluid" alt="Product" onError={e => { e.target.src = '/assets/img-01-BBWp8t8E.png'; }} />
                              </div>
                              <span className="fw-medium text-reset">{item.name}</span>
                            </div>
                          </td>
                          <td>{item.category}</td>
                          <td>
                            <div className="form-switch switch-light-secondary">
                              <input type="checkbox" id={`switch_${item.id}`} checked={item.stockAvailable} onChange={e => handleToggleStockAvailable(item.id, e.target.checked)} />
                              <label className="label" htmlFor={`switch_${item.id}`}></label>
                            </div>
                          </td>
                          <td className="fw-semibold">${item.price}</td>
                          <td>
                            <span className={`badge bg-${item.status === 'Published' ? 'success' : 'warning'}-subtle border border-${item.status === 'Published' ? 'success' : 'warning'}-subtle text-${item.status === 'Published' ? 'success' : 'warning'}`}>
                              {item.status}
                            </span>
                          </td>
                          <td>
                            <button className={`btn ${isExpanded ? 'btn-secondary' : 'btn-sub-secondary'} btn-sm px-3`} onClick={() => toggleRow(item)}>
                              {isExpanded ? 'Close' : 'Edit'}
                            </button>
                          </td>
                        </tr>

                        {/* Accordion Collapse Row for Edit Form */}
                        {isExpanded && (
                          <tr>
                            <td colSpan="8" className="p-0 border-0 bg-light bg-opacity-75">
                              <div className="p-4 border-bottom">
                                <form onSubmit={(e) => { e.preventDefault(); handleUpdate(item.id); }}>
                                  <div className="row g-4">
                                    <div className="col-md-2 text-center border-end">
                                      <div className="avatar size-24 bg-body-secondary border rounded p-1 mb-3 mx-auto">
                                        <img src={item.image} className="img-fluid" alt="Product" onError={e => { e.target.src = '/assets/img-01-BBWp8t8E.png'; }} />
                                      </div>
                                      <div>
                                        <p className="fw-medium mb-1">Stock available:</p>
                                        <div className="form-switch switch-light-secondary justify-content-center">
                                          <input type="checkbox" id={`edit_stock_${item.id}`} checked={editStockAvailable} onChange={e => setEditStockAvailable(e.target.checked)} />
                                          <label className="label" htmlFor={`edit_stock_${item.id}`}></label>
                                        </div>
                                      </div>
                                    </div>
                                    <div className="col-md-8">
                                      <div className="row g-3">
                                        <div className="col-md-4">
                                          <label className="form-label">Product ID</label>
                                          <input type="text" className="form-control form-control-sm" value={editProductId} onChange={e => setEditProductId(e.target.value)} required />
                                        </div>
                                        <div className="col-md-8">
                                          <label className="form-label">Product Name</label>
                                          <input type="text" className="form-control form-control-sm" value={editProductName} onChange={e => setEditProductName(e.target.value)} required />
                                        </div>
                                        <div className="col-md-4">
                                          <label className="form-label">Category</label>
                                          <select className="form-select form-select-sm" value={editCategory} onChange={e => setEditCategory(e.target.value)}>
                                            {categories.map(c => (
                                              <option key={c} value={c}>{c}</option>
                                            ))}
                                          </select>
                                        </div>
                                        <div className="col-md-4">
                                          <label className="form-label">Price ($)</label>
                                          <input type="number" className="form-control form-control-sm" value={editPrice} onChange={e => setEditPrice(e.target.value)} required />
                                        </div>
                                        <div className="col-md-4">
                                          <label className="form-label">Quantity</label>
                                          <input type="number" className="form-control form-control-sm" value={editQty} onChange={e => setEditQty(e.target.value)} required />
                                        </div>
                                        <div className="col-md-4">
                                          <label className="form-label">Status</label>
                                          <select className="form-select form-select-sm" value={editStatus} onChange={e => setEditStatus(e.target.value)}>
                                            {statuses.map(s => (
                                              <option key={s} value={s}>{s}</option>
                                            ))}
                                          </select>
                                        </div>
                                        <div className="col-md-4">
                                          <label className="form-label">Brand</label>
                                          <input type="text" className="form-control form-control-sm" value={editBrand} onChange={e => setEditBrand(e.target.value)} />
                                        </div>
                                        <div className="col-md-4">
                                          <label className="form-label">Discount (%)</label>
                                          <input type="number" className="form-control form-control-sm" value={editDiscount} onChange={e => setEditDiscount(e.target.value)} />
                                        </div>
                                      </div>
                                    </div>
                                    <div className="col-md-2 border-start">
                                      <div className="mb-3">
                                        <label className="form-label">Revenue ($)</label>
                                        <input type="number" className="form-control form-control-sm" value={editRevenue} onChange={e => setEditRevenue(e.target.value)} />
                                      </div>
                                      <div className="mb-3">
                                        <label className="form-label">Cost ($)</label>
                                        <input type="number" className="form-control form-control-sm" value={editCost} onChange={e => setEditCost(e.target.value)} />
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

          <div className="row align-items-center g-3 mt-3">
            <div className="col-md-6">
              <p className="text-muted text-center text-md-start mb-0">
                Showing <b className="me-1">1-{filteredProducts.length}</b> of <b className="ms-1">{filteredProducts.length}</b> Results
              </p>
            </div>
            <div className="col-md-6">
              <nav aria-label="Page navigation example">
                <ul className="pagination justify-content-center justify-content-md-end mb-0 products-pagination">
                  <li className="page-item disabled"><a className="page-link" href="#"><i data-lucide="chevron-left" className="size-4"></i>Previous</a></li>
                  <li className="page-item active"><a className="page-link" href="#">1</a></li>
                  <li className="page-item disabled"><a className="page-link" href="#">Next<i data-lucide="chevron-right" className="size-4"></i></a></li>
                </ul>
              </nav>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
