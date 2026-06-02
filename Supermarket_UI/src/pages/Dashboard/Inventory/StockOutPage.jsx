// pages/Dashboard/Inventory/StockOutPage.jsx
import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import PageBreadcrumb from '../../../components/ui/PageBreadcrumb';
import { ROUTES } from '../../../configs/routes';

export default function StockOutPage() {
  useEffect(() => {
    if (window.lucide) {
      window.lucide.createIcons();
    }
  }, []);

  return (
    <>
      <div className="container-fluid">

    <div className="gap-2 page-heading mb-3 flex-column flex-md-row">
        <h6 className="flex-grow-1 mb-0">Stock Out</h6>
        <ul className="breadcrumb flex-shrink-0 mb-0">
            <li className="breadcrumb-item"><a href="#!">Inventory</a></li>
            <li className="breadcrumb-item active">Stock Out</li>
        </ul>
    </div>
    <div className="row">
        <div className="col-12">
            <div className="card">
                <div className="card-header d-flex flex-wrap gap-3 justify-content-between align-items-center">
                    <h5 className="card-title mb-0">Stock Out</h5>
                    <button type="button" className="btn btn-primary d-flex align-items-center gap-1 flex-shrink-0" data-bs-toggle="modal" data-bs-target="#addEditStockOutModal">
                        <i data-lucide="plus" className="size-4"></i> Add Stock Out
                    </button>
                </div>
                <div className="card-body">
                    <div className="d-flex flex-wrap gap-5 mb-4 justify-content-between">
                        <div className="flex-shrink-0">
                            <label htmlFor="searchProductInput" className="form-label d-none">Search</label>
                            <div className="position-relative">
                                <input type="text" className="form-control ps-9" id="searchProductInput" placeholder="Search for..." />
                                <i data-lucide="search" className="size-4 icon-dark position-absolute top-50 start-0 ms-3 translate-middle-y"></i>
                            </div>
                        </div>
                        <div className="d-flex flex-wrap flex-md-nowrap gap-2">
                            <div className="position-relative min-w-48">
                                <label htmlFor="stockOutDateFilter" className="form-label visually-hidden">Filter by Date</label>
                                <input type="text" id="stockOutDateFilter" className="form-control ps-9" placeholder="Filter by Date" readonly />
                                <i data-lucide="calendar" className="size-4 icon-dark position-absolute top-50 start-0 ms-3 translate-middle-y"></i>
                            </div>
                            <div id="Status" className="min-w-52"></div>
                            <div id="warehouseFilter" className="min-w-52"></div>
                        </div>
                    </div>

                    <div className="table-card table-responsive">
                        <table className="table table-borderless align-middle text-nowrap mb-0">
                            <thead>
                                <tr className="bg-light border-bottom">
                                    <th>
                                        <div className="form-check check-primary">
                                            <input className="form-check-input" type="checkbox" id="checAllData" />
                                        </div>
                                    </th>
                                    <th className="fw-medium text-muted sortable" data-column="referenceNo">Reference No</th>
                                    <th className="fw-medium text-muted sortable" data-column="stockOutDate">Stock Out Date</th>
                                    <th className="fw-medium text-muted sortable" data-column="customer">Customer</th>
                                    <th className="fw-medium text-muted sortable" data-column="warehouse">Warehouse</th>
                                    <th className="fw-medium text-muted sortable" data-column="totalItems">Total Items</th>
                                    <th className="fw-medium text-muted sortable" data-column="totalQty">Total Qty</th>
                                    <th className="fw-medium text-muted sortable" data-column="status">Status</th>
                                    <th className="fw-medium text-muted sortable" data-column="totalValue">Total Value</th>
                                    <th className="fw-medium text-muted">Action</th>
                                </tr>
                            </thead>
                            <tbody id="stockOutTableBody">
                                {/* Dynamically filled by JS */}
                            </tbody>
                        </table>
                    </div>

                    <div className="row align-items-center g-3 mt-2">
                        <div className="col-md-6">
                            <p className="text-muted text-center text-md-start mb-0" id="paginationInfo">
                                Showing <b className="me-1">1-0</b> of <b className="ms-1">0</b> Results
                            </p>
                        </div>
                        <div className="col-md-6">
                            <nav aria-label="Page navigation example">
                                <ul className="pagination justify-content-center justify-content-md-end mb-0" id="pagination">
                                    {/* Dynamically filled */}
                                </ul>
                            </nav>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>

    {/* Add / Edit Stock Out Modal */}
    <div className="modal fade" id="addEditStockOutModal" tabindex="-1" aria-labelledby="addEditStockOutModalLabel" aria-hidden="true">
        <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content overflow-hidden">
                <div className="h-24 rounded-top-2 pattern-bg"></div>
                <div className="modal-body position-relative">
                    <form id="stockOutForm">
                        <input type="hidden" id="stockOutId" />
                        <div className="text-center mb-2">
                            <label className="avatar border bg-body-secondary size-24 rounded p-3 mt-n20 cursor-pointer position-relative d-inline-block overflow-hidden" htmlFor="customerLogoInput" id="logoPreviewLabel">
                                <img id="customerLogoPreview" src="#" className="w-100 h-100 object-fit-cover rounded d-none" />
                                <div id="uploadIcon" className="d-flex align-items-center justify-content-center w-100 h-100 position-absolute top-0 start-0">
                                    <i className="ri-upload-cloud-2-line fs-2xl text-muted"></i>
                                </div>
                                <input type="file" id="customerLogoInput" className="d-none" accept="image/*" />
                            </label>
                        </div>
                        <div className="row g-3">
                            <div className="col-12">
                                <label htmlFor="referenceNo" className="form-label">Reference No <span className="text-danger">*</span></label>
                                <input type="text" className="form-control" id="referenceNo" placeholder="e.g., SO-000146" required />
                            </div>
                            <div className="col-md-6">
                                <label htmlFor="stockOutDate" className="form-label">Stock Out Date <span className="text-danger">*</span></label>
                                <input type="text" className="form-control" id="stockOutDate" placeholder="Choose date" readonly required />
                            </div>
                            <div className="col-md-6">
                                <label htmlFor="customerName" className="form-label">Customer <span className="text-danger">*</span></label>
                                <input type="text" className="form-control" id="customerName" placeholder="e.g., Retail Store XYZ" required />
                            </div>
                            <div className="col-12">
                                <label htmlFor="warehouse" className="form-label">Warehouse <span className="text-danger">*</span></label>
                                <div id="modalWarehouseSelect" className="min-w-52"></div>
                            </div>
                            <div className="col-md-6">
                                <label htmlFor="status" className="form-label">Status</label>
                                <div id="modalStatusSelect"></div>
                            </div>
                            <div className="col-md-6">
                                <label htmlFor="totalItems" className="form-label">Total Items</label>
                                <input type="number" className="form-control" id="totalItems" min="1" defaultValue="1" />
                            </div>
                            <div className="col-md-6">
                                <label htmlFor="totalQty" className="form-label">Total Qty</label>
                                <input type="number" className="form-control" id="totalQty" min="1" defaultValue="1" />
                            </div>
                            <div className="col-md-6">
                                <label htmlFor="totalValue" className="form-label">Total Value (₹)</label>
                                <input type="number" className="form-control" id="totalValue" min="0" defaultValue="0" />
                            </div>
                        </div>
                        <div className="d-flex gap-2 mt-7">
                            <button type="button" className="btn btn-light w-100" data-bs-dismiss="modal">Close</button>
                            <button type="submit" className="btn btn-primary w-100">Save Stock Out</button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    </div>

    {/* Delete Modal */}
    <div className="modal fade" id="deleteModal" tabindex="-1" aria-labelledby="deleteModalLabel" aria-hidden="true">
        <div className="modal-dialog modal-dialog-centered modal-xs">
            <div className="modal-content p-7 text-center">
                <div className="d-flex justify-content-center mb-4">
                    <div className="size-14 bg-danger-subtle rounded-circle d-flex align-items-center justify-content-center size-16">
                        <i className="ri-delete-bin-line text-danger fs-2xl"></i>
                    </div>
                </div>
                <h5 className="mb-4 lh-base">Are you sure you want to delete this Stock Out?</h5>
                <input type="hidden" id="deleteStockOutId" />
                <div className="d-flex justify-content-center align-items-center gap-2">
                    <button type="button" className="btn btn-danger" id="confirmDeleteBtn">Delete</button>
                    <button type="button" className="btn btn-link text-reset" data-bs-dismiss="modal">Cancel</button>
                </div>
            </div>
        </div>
    </div>

    
</div>
    </>
  );
}
