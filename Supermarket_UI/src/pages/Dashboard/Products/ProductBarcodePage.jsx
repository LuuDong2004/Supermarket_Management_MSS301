// pages/Dashboard/Products/ProductBarcodePage.jsx
import React, { useEffect, useState } from 'react';
import PageBreadcrumb from '../../../components/ui/PageBreadcrumb';
import { ROUTES } from '../../../configs/routes';

const initialSelectedProducts = [
  { id: 1, name: 'Apple iPhone 15', category: 'Electronics', sku: 'APL-IP15-128', price: 799.99, quantity: 1, image: '/assets/img-01-BBWp8t8E.png' },
  { id: 2, name: 'Nike Air Max 270', category: 'Footwear', sku: 'NKE-AM270-01', price: 124.99, quantity: 2, image: '/assets/img-02-ClVfz9I5.png' },
  { id: 3, name: 'Samsung Galaxy Buds Pro', category: 'Audio', sku: 'SAM-BUDS-PRO', price: 69.99, quantity: 3, image: '/assets/img-03-oTTY_McP.png' }
];

const availableProducts = [
  { id: 1, name: 'Apple iPhone 15', category: 'Electronics', sku: 'APL-IP15-128', price: 799.99, image: '/assets/img-01-BBWp8t8E.png' },
  { id: 2, name: 'Nike Air Max 270', category: 'Footwear', sku: 'NKE-AM270-01', price: 124.99, image: '/assets/img-02-ClVfz9I5.png' },
  { id: 3, name: 'Samsung Galaxy Buds Pro', category: 'Audio', sku: 'SAM-BUDS-PRO', price: 69.99, image: '/assets/img-03-oTTY_McP.png' },
  { id: 4, name: 'Leather Shoulder Bag', category: 'Accessories', sku: 'LTH-SHB-02', price: 289.99, image: '/assets/img-04-DZ4OtBxS.png' }
];

export default function ProductBarcodePage() {
  const [selectedProducts, setSelectedProducts] = useState(initialSelectedProducts);
  const [search, setSearch] = useState('');
  const [barcodeType, setBarcodeType] = useState('Code 128');
  const [encodeValue, setEncodeValue] = useState('SKU');
  const [labelTemplate, setLabelTemplate] = useState('Standard (40 per sheet)');
  const [showName, setShowName] = useState(true);
  const [showPrice, setShowPrice] = useState(true);
  const [showLogo, setShowLogo] = useState(false);

  // Search autocomplete list
  const [searchResults, setSearchResults] = useState([]);

  useEffect(() => {
    if (window.lucide) {
      window.lucide.createIcons();
    }
  }, [selectedProducts]);

  useEffect(() => {
    if (search.trim() === '') {
      setSearchResults([]);
    } else {
      const results = availableProducts.filter(p => 
        p.name.toLowerCase().includes(search.toLowerCase()) ||
        p.sku.toLowerCase().includes(search.toLowerCase())
      );
      setSearchResults(results);
    }
  }, [search]);

  const addProduct = (prod) => {
    const existing = selectedProducts.find(p => p.id === prod.id);
    if (existing) {
      setSelectedProducts(prev => prev.map(p => p.id === prod.id ? { ...p, quantity: p.quantity + 1 } : p));
    } else {
      setSelectedProducts(prev => [...prev, { ...prod, quantity: 1 }]);
    }
    setSearch('');
    setSearchResults([]);
  };

  const removeProduct = (id) => {
    setSelectedProducts(prev => prev.filter(p => p.id !== id));
  };

  const handleQtyChange = (id, delta) => {
    setSelectedProducts(prev => prev.map(p => {
      if (p.id === id) {
        const newQty = Math.max(1, p.quantity + delta);
        return { ...p, quantity: newQty };
      }
      return p;
    }));
  };

  const handleReset = () => {
    setSelectedProducts([]);
  };

  const handleGenerate = () => {
    alert(`Successfully generated barcodes with ${barcodeType} format for selected items!`);
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="container-fluid">
      <PageBreadcrumb title="Barcode" breadcrumbs={[{ label: 'Dashboard', href: ROUTES.DASHBOARD }, { label: 'Products' }, { label: 'Barcode' }]} />

      <div className="card">
        <div className="card-header d-flex justify-content-between gap-2">
          <div>
            <h6 className="card-title mb-1">Print Barcodes</h6>
            <p className="text-muted mb-0">Generate, customize and print product barcodes with advanced options</p>
          </div>
        </div>
        <div className="card-body">
          <h6 className="mb-2">Product Selection</h6>
          <div className="row g-3 justify-content-between mb-5">
            <div className="col-lg-7">
              <div className="position-relative">
                <label className="form-label">Search Product</label>
                <div className="position-relative">
                  <input type="text" className="form-control ps-9" placeholder="Type product name, SKU or barcode to add..." value={search} onChange={e => setSearch(e.target.value)} />
                  <i data-lucide="search" className="size-4 icon-dark position-absolute top-50 start-0 ms-3 translate-middle-y"></i>
                </div>
                {searchResults.length > 0 && (
                  <ul className="position-absolute w-100 bg-white border border-gray-200 rounded shadow-lg z-3 mt-1 p-0 list-unstyled" style={{ maxHeight: '200px', overflowY: 'auto' }}>
                    {searchResults.map(p => (
                      <li key={p.id} className="p-3 border-bottom cursor-pointer hover-bg-light d-flex justify-content-between align-items-center" onClick={() => addProduct(p)}>
                        <div>
                          <span className="fw-semibold">{p.name}</span>
                          <span className="text-muted ms-2 fs-sm">({p.sku})</span>
                        </div>
                        <span className="text-primary fw-medium">${p.price.toFixed(2)}</span>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            </div>
            <div className="col-lg-3 col-xxl-2">
              <label className="form-label">Bulk Import</label>
              <label className="avatar w-100 h-10 p-4 text-center border border-dashed text-muted rounded cursor-pointer d-flex align-items-center justify-content-center gap-2">
                <i data-lucide="upload-cloud" className="size-5"></i>
                <span className="fs-sm">Upload CSV</span>
                <input type="file" className="d-none" />
              </label>
            </div>
          </div>

          <div className="table-responsive mb-5">
            <table className="table align-middle text-nowrap selected-table mb-0">
              <thead className="bg-light">
                <tr>
                  <th>Product Name</th>
                  <th>SKU</th>
                  <th>Price</th>
                  <th>Quantity</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {selectedProducts.length === 0 ? (
                  <tr>
                    <td colSpan="5" className="text-center text-muted py-4">No products selected. Search and add products above.</td>
                  </tr>
                ) : (
                  selectedProducts.map(item => (
                    <tr key={item.id}>
                      <td>
                        <div className="d-flex align-items-center gap-2">
                          <div className="avatar size-9 border rounded-1 p-1 bg-light">
                            <i className="ri-image-line text-muted"></i>
                          </div>
                          <div>
                            <div className="fw-medium">{item.name}</div>
                            <div className="text-muted fs-sm">{item.category}</div>
                          </div>
                        </div>
                      </td>
                      <td>{item.sku}</td>
                      <td>${item.price.toFixed(2)}</td>
                      <td>
                        <div className="input-spin-group input-spin-primary">
                          <button type="button" className="input-spin-minus" onClick={() => handleQtyChange(item.id, -1)}><i data-lucide="minus" className="size-4"></i></button>
                          <input type="text" className="input-spin form-control" readOnly value={item.quantity} />
                          <button type="button" className="input-spin-plus" onClick={() => handleQtyChange(item.id, 1)}><i data-lucide="plus" className="size-4"></i></button>
                        </div>
                      </td>
                      <td>
                        <button type="button" className="btn size-8 btn-icon btn-sub-danger" onClick={() => removeProduct(item.id)}><i className="ri-delete-bin-line"></i></button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          <h6 className="my-3">Barcode Options</h6>
          <div className="row g-3 mb-5">
            <div className="col-md-6 col-lg-4">
              <label className="form-label">Barcode Type</label>
              <select className="form-select" value={barcodeType} onChange={e => setBarcodeType(e.target.value)}>
                <option value="Code 128">Code 128 (Standard)</option>
                <option value="Code 39">Code 39</option>
                <option value="EAN-13">EAN-13</option>
                <option value="UPC-A">UPC-A</option>
              </select>
            </div>
            <div className="col-md-6 col-lg-4">
              <label className="form-label">Encode Value</label>
              <select className="form-select" value={encodeValue} onChange={e => setEncodeValue(e.target.value)}>
                <option value="SKU">SKU Code</option>
                <option value="Product ID">Product ID</option>
                <option value="Custom">Custom Text</option>
              </select>
            </div>
            <div className="col-md-12 col-lg-4">
              <label className="form-label">Label Template</label>
              <select className="form-select" value={labelTemplate} onChange={e => setLabelTemplate(e.target.value)}>
                <option value="Standard (40 per sheet)">Standard (40 per sheet)</option>
                <option value="A4 (30 per sheet)">A4 (30 per sheet)</option>
                <option value="Continuous Feed (Roll)">Continuous Feed (Roll)</option>
              </select>
            </div>
          </div>

          <div className="d-flex flex-wrap gap-5 mb-5">
            <div className="form-check check-primary">
              <input className="form-check-input" type="checkbox" id="showNameCheck" checked={showName} onChange={e => setShowName(e.target.checked)} />
              <label className="form-check-label" htmlFor="showNameCheck">
                Show Product Name
              </label>
            </div>
            <div className="form-check check-primary">
              <input className="form-check-input" type="checkbox" id="showPriceCheck" checked={showPrice} onChange={e => setShowPrice(e.target.checked)} />
              <label className="form-check-label" htmlFor="showPriceCheck">
                Show Price
              </label>
            </div>
            <div className="form-check check-primary">
              <input className="form-check-input" type="checkbox" id="showLogoCheck" checked={showLogo} onChange={e => setShowLogo(e.target.checked)} />
              <label className="form-check-label" htmlFor="showLogoCheck">
                Include Store Logo
              </label>
            </div>
          </div>

          <div className="d-flex flex-wrap justify-content-end align-items-center gap-2 border-top pt-4">
            <button type="button" className="btn btn-secondary" onClick={handleReset}><i className="ri-refresh-line me-1"></i> Reset</button>
            <button type="button" className="btn btn-primary" onClick={handleGenerate}><i className="ri-magic-line me-1"></i> Generate</button>
            <button type="button" className="btn btn-info" onClick={handlePrint}><i className="ri-printer-line me-1"></i> Print</button>
          </div>
        </div>
      </div>
    </div>
  );
}
