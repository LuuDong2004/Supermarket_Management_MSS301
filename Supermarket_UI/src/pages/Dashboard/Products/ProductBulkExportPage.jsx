// pages/Dashboard/Products/ProductBulkExportPage.jsx
import React, { useEffect, useState } from 'react';
import PageBreadcrumb from '../../../components/ui/PageBreadcrumb';
import { ROUTES } from '../../../configs/routes';

const initialExportHistory = [
  { id: 1, name: 'products_export_20250529.xlsx', format: 'Excel', size: '1.2 MB', status: 'Completed', date: '29 May 2025' },
  { id: 2, name: 'inventory_list.csv', format: 'CSV', size: '450 KB', status: 'Completed', date: '15 May 2025' }
];

export default function ProductBulkExportPage() {
  const [format, setFormat] = useState('excel'); // excel, csv, pdf
  const [columns, setColumns] = useState({
    name: true,
    sku: true,
    category: true,
    price: true,
    stock: true,
    description: false,
    status: true,
    created: false
  });
  const [history, setHistory] = useState(initialExportHistory);
  const [exporting, setExporting] = useState(false);

  useEffect(() => {
    if (window.lucide) {
      window.lucide.createIcons();
    }
  }, [history]);

  const handleCheckboxChange = (col) => {
    setColumns(prev => ({
      ...prev,
      [col]: !prev[col]
    }));
  };

  const handleSelectAll = (val) => {
    setColumns({
      name: val,
      sku: val,
      category: val,
      price: val,
      stock: val,
      description: val,
      status: val,
      created: val
    });
  };

  const handleExportSubmit = (e) => {
    e.preventDefault();
    const activeCols = Object.keys(columns).filter(k => columns[k]);
    if (activeCols.length === 0) {
      alert('Please select at least one column to export!');
      return;
    }

    setExporting(true);

    setTimeout(() => {
      const ext = format === 'excel' ? 'xlsx' : format;
      const newExport = {
        id: history.length > 0 ? Math.max(...history.map(h => h.id)) + 1 : 1,
        name: `products_export_${new Date().toISOString().slice(0,10).replace(/-/g,'')}.${ext}`,
        format: format.toUpperCase(),
        size: '850 KB',
        status: 'Completed',
        date: new Date().toLocaleDateString('en-US', { day: '2-digit', month: 'short', year: 'numeric' })
      };
      setHistory(prev => [newExport, ...prev]);
      setExporting(false);
      alert('Export file generated and downloaded successfully!');
    }, 1500);
  };

  return (
    <div className="container-fluid">
      <PageBreadcrumb title="Bulk Export" breadcrumbs={[{ label: 'Dashboard', href: ROUTES.DASHBOARD }, { label: 'Products' }, { label: 'Bulk Export' }]} />

      <div className="row g-4">
        <div className="col-lg-5">
          <div className="card">
            <div className="card-header">
              <h6 className="card-title mb-0">Export Configuration</h6>
            </div>
            <div className="card-body">
              <form onSubmit={handleExportSubmit}>
                <h6 className="fs-sm mb-3 text-dark">1. Select Export Format</h6>
                <div className="row g-3 mb-4">
                  <div className="col-6">
                    <label className={`card border p-3 cursor-pointer d-flex align-items-center gap-3 ${format === 'excel' ? 'border-primary bg-primary-subtle' : ''}`}>
                      <input type="radio" name="exportFormat" className="form-check-input" checked={format === 'excel'} onChange={() => setFormat('excel')} />
                      <div>
                        <div className="fw-semibold text-dark">Excel</div>
                        <span className="text-muted fs-xs">.xlsx spreadsheet</span>
                      </div>
                    </label>
                  </div>
                  <div className="col-6">
                    <label className={`card border p-3 cursor-pointer d-flex align-items-center gap-3 ${format === 'csv' ? 'border-primary bg-primary-subtle' : ''}`}>
                      <input type="radio" name="exportFormat" className="form-check-input" checked={format === 'csv'} onChange={() => setFormat('csv')} />
                      <div>
                        <div className="fw-semibold text-dark">CSV</div>
                        <span className="text-muted fs-xs">Comma separated</span>
                      </div>
                    </label>
                  </div>
                </div>

                <h6 className="fs-sm mb-3 text-dark d-flex justify-content-between">
                  <span>2. Select Columns to Export</span>
                  <div className="d-flex gap-2">
                    <button type="button" className="btn btn-link p-0 text-decoration-none fs-xs" onClick={() => handleSelectAll(true)}>Select All</button>
                    <span className="text-muted">|</span>
                    <button type="button" className="btn btn-link p-0 text-decoration-none fs-xs" onClick={() => handleSelectAll(false)}>Clear</button>
                  </div>
                </h6>
                <div className="row g-3 mb-5">
                  {Object.keys(columns).map(col => (
                    <div className="col-6" key={col}>
                      <div className="d-flex gap-2 align-items-center">
                        <div className="form-switch switch-light-primary">
                          <input type="checkbox" id={`col-${col}`} checked={columns[col]} onChange={() => handleCheckboxChange(col)} />
                          <label className="label" htmlFor={`col-${col}`}></label>
                        </div>
                        <span className="text-capitalize fs-sm text-dark">{col === 'sku' ? 'SKU' : col}</span>
                      </div>
                    </div>
                  ))}
                </div>

                <button type="submit" className="btn btn-primary w-100 d-flex align-items-center justify-content-center gap-2" disabled={exporting}>
                  {exporting ? (
                    <>
                      <span className="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
                      Generating File...
                    </>
                  ) : (
                    <>
                      <i className="ri-download-2-line"></i> Generate Export File
                    </>
                  )}
                </button>
              </form>
            </div>
          </div>
        </div>

        <div className="col-lg-7">
          <div className="card">
            <div className="card-header">
              <h6 className="card-title mb-0">Generated Exports</h6>
            </div>
            <div className="card-body pt-0">
              <div className="table-responsive">
                <table className="table align-middle text-nowrap mb-0">
                  <thead>
                    <tr className="bg-light border-bottom">
                      <th className="fw-medium text-muted">File Name</th>
                      <th className="fw-medium text-muted">Format</th>
                      <th className="fw-medium text-muted">Size</th>
                      <th className="fw-medium text-muted">Date</th>
                      <th className="fw-medium text-muted">Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {history.map(item => (
                      <tr key={item.id}>
                        <td>
                          <div className="d-flex align-items-center gap-2">
                            <div className="avatar size-8 bg-light d-flex align-items-center justify-content-center rounded">
                              <i className="ri-file-download-line text-primary fs-lg"></i>
                            </div>
                            <span className="fw-semibold text-reset">{item.name}</span>
                          </div>
                        </td>
                        <td>{item.format}</td>
                        <td>{item.size}</td>
                        <td className="text-muted">{item.date}</td>
                        <td>
                          <a href="#!" className="btn btn-sub-primary size-8 btn-icon" title="Download again">
                            <i className="ri-download-line"></i>
                          </a>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
