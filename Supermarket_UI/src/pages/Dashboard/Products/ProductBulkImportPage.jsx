// pages/Dashboard/Products/ProductBulkImportPage.jsx
import React, { useEffect, useState } from 'react';
import PageBreadcrumb from '../../../components/ui/PageBreadcrumb';
import { ROUTES } from '../../../configs/routes';

const initialHistory = [
  { id: 1, name: 'products_jan.xlsx', type: 'Product Import', user: 'Admin', status: 'Success', date: '12 Jan 2025' },
  { id: 2, name: 'variants_feb.csv', type: 'Variant Import', user: 'Store Manager', status: 'Success', date: '05 Feb 2025' },
  { id: 3, name: 'prices_update_error.csv', type: 'Price Import', user: 'Admin', status: 'Failed', date: '18 Feb 2025' }
];

export default function ProductBulkImportPage() {
  const [history, setHistory] = useState(initialHistory);
  const [uploading, setUploading] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const [importType, setImportType] = useState('Product Import');

  useEffect(() => {
    if (window.lucide) {
      window.lucide.createIcons();
    }
  }, [history]);

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setSelectedFile(e.target.files[0]);
    }
  };

  const handleUploadSubmit = (e) => {
    e.preventDefault();
    if (!selectedFile) {
      alert('Please select a file to import!');
      return;
    }

    setUploading(true);

    // Simulate upload delay
    setTimeout(() => {
      const newImport = {
        id: history.length > 0 ? Math.max(...history.map(h => h.id)) + 1 : 1,
        name: selectedFile.name,
        type: importType,
        user: 'Admin',
        status: 'Success',
        date: new Date().toLocaleDateString('en-US', { day: '2-digit', month: 'short', year: 'numeric' })
      };
      setHistory(prev => [newImport, ...prev]);
      setUploading(false);
      setSelectedFile(null);
      alert('File imported successfully!');
    }, 1500);
  };

  const handleDelete = (id) => {
    if (confirm('Are you sure you want to delete this import record?')) {
      setHistory(prev => prev.filter(h => h.id !== id));
    }
  };

  return (
    <div className="container-fluid">
      <PageBreadcrumb title="Bulk Import" breadcrumbs={[{ label: 'Dashboard', href: ROUTES.DASHBOARD }, { label: 'Products' }, { label: 'Bulk Import' }]} />

      <div className="row g-4">
        <div className="col-lg-4">
          <div className="card">
            <div className="card-header">
              <h6 className="card-title mb-0">Import File</h6>
            </div>
            <div className="card-body">
              <form onSubmit={handleUploadSubmit}>
                <div className="mb-3">
                  <label className="form-label">Import Type</label>
                  <select className="form-select" value={importType} onChange={e => setImportType(e.target.value)}>
                    <option value="Product Import">Product Import</option>
                    <option value="Variant Import">Variant Import</option>
                    <option value="Price Import">Price Import</option>
                    <option value="Inventory Import">Inventory Import</option>
                  </select>
                </div>

                <div className="mb-4">
                  <label className="form-label">Upload File (Excel or CSV)</label>
                  <div className="border border-dashed rounded p-5 text-center cursor-pointer hover-bg-light position-relative" style={{ minHeight: '120px' }}>
                    <input type="file" className="position-absolute top-0 start-0 w-100 h-100 opacity-0 cursor-pointer" accept=".csv, .xls, .xlsx" onChange={handleFileChange} />
                    <div className="py-2">
                      <i className="ri-upload-cloud-2-line fs-2xl text-muted mb-2 d-inline-block"></i>
                      <div className="fw-medium text-dark">
                        {selectedFile ? selectedFile.name : 'Click or Drag file to upload'}
                      </div>
                      <span className="text-muted fs-xs">Supports XLS, XLSX, CSV up to 10MB</span>
                    </div>
                  </div>
                </div>

                <button type="submit" className="btn btn-primary w-100 d-flex align-items-center justify-content-center gap-2" disabled={uploading}>
                  {uploading ? (
                    <>
                      <span className="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
                      Uploading...
                    </>
                  ) : (
                    <>
                      <i className="ri-upload-2-line"></i> Start Import
                    </>
                  )}
                </button>
              </form>

              <div className="mt-4 border-top pt-3">
                <h6 className="fs-sm mb-2 text-dark">Download Instructions:</h6>
                <p className="text-muted fs-xs mb-3">To ensure a smooth import, please download our template files and match the headers exactly.</p>
                <div className="d-grid gap-2">
                  <a href="#!" className="btn btn-outline-secondary btn-sm d-flex align-items-center justify-content-center gap-1">
                    <i className="ri-download-2-line"></i> Download Product Template
                  </a>
                  <a href="#!" className="btn btn-outline-secondary btn-sm d-flex align-items-center justify-content-center gap-1">
                    <i className="ri-download-2-line"></i> Download Variant Template
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="col-lg-8">
          <div className="card">
            <div className="card-header">
              <h6 className="card-title mb-0">Import History</h6>
            </div>
            <div className="card-body pt-0">
              <div className="table-responsive">
                <table className="table align-middle text-nowrap mb-0">
                  <thead>
                    <tr className="bg-light border-bottom">
                      <th className="fw-medium text-muted">File Name</th>
                      <th className="fw-medium text-muted">Import Type</th>
                      <th className="fw-medium text-muted">Uploaded By</th>
                      <th className="fw-medium text-muted">Status</th>
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
                              <i className="ri-file-excel-2-line text-success fs-lg"></i>
                            </div>
                            <span className="fw-semibold text-reset">{item.name}</span>
                          </div>
                        </td>
                        <td>{item.type}</td>
                        <td>{item.user}</td>
                        <td>
                          <span className={`badge bg-${item.status === 'Success' ? 'success' : 'danger'}-subtle text-${item.status === 'Success' ? 'success' : 'danger'}`}>
                            {item.status}
                          </span>
                        </td>
                        <td className="text-muted">{item.date}</td>
                        <td>
                          <div className="d-flex gap-2">
                            <button type="button" className="btn btn-sub-secondary size-8 btn-icon" title="View details">
                              <i className="ri-eye-line"></i>
                            </button>
                            <button type="button" className="btn btn-sub-danger size-8 btn-icon" title="Delete record" onClick={() => handleDelete(item.id)}>
                              <i className="ri-delete-bin-line"></i>
                            </button>
                          </div>
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
