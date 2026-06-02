// pages/Dashboard/Orders/RefundPage.jsx
import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import PageBreadcrumb from '../../../components/ui/PageBreadcrumb';
import { ROUTES } from '../../../configs/routes';

export default function RefundPage() {
  useEffect(() => {
    if (window.lucide) {
      window.lucide.createIcons();
    }
  }, []);

  return (
    <>
      <div className="container-fluid">

    <div className="gap-2 page-heading mb-3 flex-column flex-md-row">
        <h6 className="flex-grow-1 mb-0">Refund</h6>
        <ul className="breadcrumb flex-shrink-0 mb-0">
            <li className="breadcrumb-item"><a href="#!">Orders</a></li>
            <li className="breadcrumb-item active">Refund</li>
        </ul>
    </div>
    <div className="card">
        <div className="card-header d-flex flex-wrap gap-4 justify-content-between align-items-center">
            <ul className="nav nav-underline" role="tablist">
                <li className="nav-item" role="presentation">
                    <button className="nav-link active" data-bs-toggle="tab" data-bs-target="#refund-all" type="button">
                        All Refunds
                    </button>
                </li>
                <li className="nav-item" role="presentation">
                    <button className="nav-link" data-bs-toggle="tab" data-bs-target="#refund-pending" type="button">
                        Pending
                    </button>
                </li>
                <li className="nav-item" role="presentation">
                    <button className="nav-link" data-bs-toggle="tab" data-bs-target="#refund-completed" type="button">
                        Completed
                    </button>
                </li>
                <li className="nav-item" role="presentation">
                    <button className="nav-link" data-bs-toggle="tab" data-bs-target="#refund-rejected" type="button">
                        Rejected
                    </button>
                </li>
            </ul>
            <button type="button" className="btn btn-primary" data-bs-toggle="modal" data-bs-target="#addRefundModal"><i className="ri-add-line align-bottom me-1"></i> Add New</button>
        </div>
        <div className="card-body pt-0">
            <div className="tab-content">
                <div className="tab-pane fade show active" id="refund-all">
                    <div className="table-card table-responsive">
                        <table className="table table-borderless text-nowrap align-middle mb-0">
                            <thead>
                                <tr className="bg-light border-bottom">
                                    <th>
                                        <div className="form-check check-primary">
                                            <input className="form-check-input" type="checkbox" id="checAllData" />
                                        </div>
                                    </th>
                                    <th className="fw-medium text-muted">Refund ID</th>
                                    <th className="fw-medium text-muted">Order ID</th>
                                    <th className="fw-medium text-muted">Refund Date</th>
                                    <th className="fw-medium text-muted">Customer</th>
                                    <th className="fw-medium text-muted">Refund Type</th>
                                    <th className="fw-medium text-muted">Reason</th>
                                    <th className="fw-medium text-muted">Refund Amount</th>
                                    <th className="fw-medium text-muted">Refund Method</th>
                                    <th className="fw-medium text-muted">Status</th>
                                    <th className="fw-medium text-muted">Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr>
                                    <td>
                                        <div className="form-check check-primary"><input className="form-check-input" type="checkbox" /></div>
                                    </td>
                                    <td><a href="#!" className="link link-custom-primary fw-medium">#REF-1021</a></td>
                                    <td><a href="#!" className="link link-custom-primary fw-medium">#ORD1024</a></td>
                                    <td>Dec 19, 2025</td>
                                    <td className="d-flex gap-2 align-items-center">
                                        <img src="/assets/user-1-xhBXJtq9.png" className="size-8 rounded img-fluid" alt="Avatar" />
                                        <span className="fw-medium">Emma White</span>
                                    </td>
                                    <td><span className="badge bg-info-subtle text-info border border-info-subtle">Partial</span></td>
                                    <td className="text-muted">Damaged item</td>
                                    <td className="fw-medium">$45.00</td>
                                    <td><span className="badge bg-body-tertiary text-body-secondary border border-dark-subtle">Cash</span></td>
                                    <td><span className="badge bg-warning-subtle text-warning border border-warning-subtle">Pending</span></td>
                                    <td className="d-flex gap-2">
                                        <div className="dropdown">
                                            <a href="#!" className="link link-custom-primary" data-bs-toggle="dropdown"><i className="ri-more-2-fill"></i></a>
                                            <ul className="dropdown-menu dropdown-menu-end">
                                                <li><a href="#!" className="dropdown-item d-flex gap-3 align-items-center"><i className="ri-eye-line"></i> View</a></li>
                                                <li><a href="#!" className="dropdown-item d-flex gap-3 align-items-center"><i className="ri-check-line"></i>Approve</a></li>
                                                <li><a href="#!" className="dropdown-item d-flex gap-3 align-items-center text-danger"><i className="ri-close-large-line"></i> Cancel</a></li>
                                            </ul>
                                        </div>
                                    </td>
                                </tr>
                                <tr>
                                    <td>
                                        <div className="form-check check-primary"><input className="form-check-input" type="checkbox" /></div>
                                    </td>
                                    <td><a href="#!" className="link link-custom-primary fw-medium">#REF-1022</a></td>
                                    <td><a href="#!" className="link link-custom-primary fw-medium">#ORD1025</a></td>
                                    <td>Dec 18, 2025</td>
                                    <td className="d-flex gap-2 align-items-center">
                                        <img src="/assets/user-2-CroG7YJ0.png" className="size-8 rounded img-fluid" alt="Avatar" />
                                        <span className="fw-medium">John Carter</span>
                                    </td>
                                    <td><span className="badge bg-primary-subtle text-primary border border-primary-subtle">Full</span></td>
                                    <td className="text-muted">Order cancelled</td>
                                    <td className="fw-medium">$120.00</td>
                                    <td><span className="badge bg-body-tertiary text-body-secondary border border-dark-subtle">Card</span></td>
                                    <td><span className="badge bg-success-subtle text-success border border-success-subtle">Completed</span></td>
                                    <td className="d-flex gap-2">
                                        <div className="dropdown">
                                            <a href="#!" className="link link-custom-primary" data-bs-toggle="dropdown"><i className="ri-more-2-fill"></i></a>
                                            <ul className="dropdown-menu dropdown-menu-end">
                                                <li><a href="#!" className="dropdown-item d-flex gap-3 align-items-center"><i className="ri-eye-line"></i> View</a></li>
                                            </ul>
                                        </div>
                                    </td>
                                </tr>
                                <tr>
                                    <td>
                                        <div className="form-check check-primary"><input className="form-check-input" type="checkbox" /></div>
                                    </td>
                                    <td><a href="#!" className="link link-custom-primary fw-medium">#REF-1023</a></td>
                                    <td><a href="#!" className="link link-custom-primary fw-medium">#ORD1026</a></td>
                                    <td>Dec 18, 2025</td>
                                    <td className="d-flex gap-2 align-items-center">
                                        <img src="/assets/user-3-Bz6g7hsE.png" className="size-8 rounded img-fluid" alt="Avatar" />
                                        <span className="fw-medium">Ava Brown</span>
                                    </td>
                                    <td><span className="badge bg-info-subtle text-info border border-info-subtle">Partial</span></td>
                                    <td className="text-muted">Wrong size</td>
                                    <td className="fw-medium">$30.50</td>
                                    <td><span className="badge bg-body-tertiary text-body-secondary border border-dark-subtle">UPI</span></td>
                                    <td><span className="badge bg-danger-subtle text-danger border border-danger-subtle">Rejected</span></td>
                                    <td className="d-flex gap-2">
                                        <div className="dropdown">
                                            <a href="#!" className="link link-custom-primary" data-bs-toggle="dropdown"><i className="ri-more-2-fill"></i></a>
                                            <ul className="dropdown-menu dropdown-menu-end">
                                                <li><a href="#!" className="dropdown-item d-flex gap-3 align-items-center"><i className="ri-eye-line"></i> View</a></li>
                                            </ul>
                                        </div>
                                    </td>
                                </tr>
                                <tr>
                                    <td>
                                        <div className="form-check check-primary"><input className="form-check-input" type="checkbox" /></div>
                                    </td>
                                    <td><a href="#!" className="link link-custom-primary fw-medium">#REF-1024</a></td>
                                    <td><a href="#!" className="link link-custom-primary fw-medium">#ORD1027</a></td>
                                    <td>Dec 17, 2025</td>
                                    <td className="d-flex gap-2 align-items-center">
                                        <img src="/assets/user-4-7l52E1Lo.png" className="size-8 rounded img-fluid" alt="Avatar" />
                                        <span className="fw-medium">Liam Scott</span>
                                    </td>
                                    <td><span className="badge bg-primary-subtle text-primary border border-primary-subtle">Full</span></td>
                                    <td className="text-muted">Duplicate order</td>
                                    <td className="fw-medium">$89.99</td>
                                    <td><span className="badge bg-body-tertiary text-body-secondary border border-dark-subtle">Wallet</span></td>
                                    <td><span className="badge bg-success-subtle text-success border border-success-subtle">Completed</span></td>
                                    <td className="d-flex gap-2">
                                        <div className="dropdown">
                                            <a href="#!" className="link link-custom-primary" data-bs-toggle="dropdown"><i className="ri-more-2-fill"></i></a>
                                            <ul className="dropdown-menu dropdown-menu-end">
                                                <li><a href="#!" className="dropdown-item d-flex gap-3 align-items-center"><i className="ri-eye-line"></i> View</a></li>
                                            </ul>
                                        </div>
                                    </td>
                                </tr>
                                <tr>
                                    <td>
                                        <div className="form-check check-primary"><input className="form-check-input" type="checkbox" /></div>
                                    </td>
                                    <td><a href="#!" className="link link-custom-primary fw-medium">#REF-1025</a></td>
                                    <td><a href="#!" className="link link-custom-primary fw-medium">#ORD1028</a></td>
                                    <td>Dec 17, 2025</td>
                                    <td className="d-flex gap-2 align-items-center">
                                        <img src="/assets/user-5-BsT8d_Co.png" className="size-8 rounded img-fluid" alt="Avatar" />
                                        <span className="fw-medium">Noah Green</span>
                                    </td>
                                    <td><span className="badge bg-info-subtle text-info border border-info-subtle">Partial</span></td>
                                    <td className="text-muted">Missing item</td>
                                    <td className="fw-medium">$15.00</td>
                                    <td><span className="badge bg-body-tertiary text-body-secondary border border-dark-subtle">Cash</span></td>
                                    <td><span className="badge bg-warning-subtle text-warning border border-warning-subtle">Pending</span></td>
                                    <td className="d-flex gap-2">
                                        <div className="dropdown">
                                            <a href="#!" className="link link-custom-primary" data-bs-toggle="dropdown"><i className="ri-more-2-fill"></i></a>
                                            <ul className="dropdown-menu dropdown-menu-end">
                                                <li><a href="#!" className="dropdown-item d-flex gap-3 align-items-center"><i className="ri-eye-line"></i> View</a></li>
                                                <li><a href="#!" className="dropdown-item d-flex gap-3 align-items-center"><i className="ri-check-line"></i>Approve</a></li>
                                                <li><a href="#!" className="dropdown-item d-flex gap-3 align-items-center text-danger"><i className="ri-close-large-line"></i> Cancel</a></li>
                                            </ul>
                                        </div>
                                    </td>
                                </tr>
                                <tr>
                                    <td>
                                        <div className="form-check check-primary"><input className="form-check-input" type="checkbox" /></div>
                                    </td>
                                    <td><a href="#!" className="link link-custom-primary fw-medium">#REF-1026</a></td>
                                    <td><a href="#!" className="link link-custom-primary fw-medium">#ORD1029</a></td>
                                    <td>Dec 16, 2025</td>
                                    <td className="d-flex gap-2 align-items-center">
                                        <img src="/assets/user-6-BIO7_TUU.png" className="size-8 rounded img-fluid" alt="Avatar" />
                                        <span className="fw-medium">Sophia Lee</span>
                                    </td>
                                    <td><span className="badge bg-primary-subtle text-primary border border-primary-subtle">Full</span></td>
                                    <td className="text-muted">Payment failed</td>
                                    <td className="fw-medium">$59.00</td>
                                    <td><span className="badge bg-body-tertiary text-body-secondary border border-dark-subtle">Card</span></td>
                                    <td><span className="badge bg-success-subtle text-success border border-success-subtle">Completed</span></td>
                                    <td className="d-flex gap-2">
                                        <div className="dropdown">
                                            <a href="#!" className="link link-custom-primary" data-bs-toggle="dropdown"><i className="ri-more-2-fill"></i></a>
                                            <ul className="dropdown-menu dropdown-menu-end">
                                                <li><a href="#!" className="dropdown-item d-flex gap-3 align-items-center"><i className="ri-eye-line"></i> View</a></li>
                                            </ul>
                                        </div>
                                    </td>
                                </tr>
                                <tr>
                                    <td>
                                        <div className="form-check check-primary"><input className="form-check-input" type="checkbox" /></div>
                                    </td>
                                    <td><a href="#!" className="link link-custom-primary fw-medium">#REF-1027</a></td>
                                    <td><a href="#!" className="link link-custom-primary fw-medium">#ORD1030</a></td>
                                    <td>Dec 16, 2025</td>
                                    <td className="d-flex gap-2 align-items-center">
                                        <img src="/assets/user-7-BMyy-xCq.png" className="size-8 rounded img-fluid" alt="Avatar" />
                                        <span className="fw-medium">Ethan Hall</span>
                                    </td>
                                    <td><span className="badge bg-info-subtle text-info border border-info-subtle">Partial</span></td>
                                    <td className="text-muted">Quality issue</td>
                                    <td className="fw-medium">$22.75</td>
                                    <td><span className="badge bg-body-tertiary text-body-secondary border border-dark-subtle">UPI</span></td>
                                    <td><span className="badge bg-danger-subtle text-danger border border-danger-subtle">Rejected</span></td>
                                    <td className="d-flex gap-2">
                                        <div className="dropdown">
                                            <a href="#!" className="link link-custom-primary" data-bs-toggle="dropdown"><i className="ri-more-2-fill"></i></a>
                                            <ul className="dropdown-menu dropdown-menu-end">
                                                <li><a href="#!" className="dropdown-item d-flex gap-3 align-items-center"><i className="ri-eye-line"></i> View</a></li>
                                            </ul>
                                        </div>
                                    </td>
                                </tr>
                                <tr>
                                    <td>
                                        <div className="form-check check-primary"><input className="form-check-input" type="checkbox" /></div>
                                    </td>
                                    <td><a href="#!" className="link link-custom-primary fw-medium">#REF-1028</a></td>
                                    <td><a href="#!" className="link link-custom-primary fw-medium">#ORD1031</a></td>
                                    <td>Dec 15, 2025</td>
                                    <td className="d-flex gap-2 align-items-center">
                                        <img src="/assets/user-8-BAGm131G.png" className="size-8 rounded img-fluid" alt="Avatar" />
                                        <span className="fw-medium">Mia Wilson</span>
                                    </td>
                                    <td><span className="badge bg-primary-subtle text-primary border border-primary-subtle">Full</span></td>
                                    <td className="text-muted">Customer return</td>
                                    <td className="fw-medium">$150.00</td>
                                    <td><span className="badge bg-body-tertiary text-body-secondary border border-dark-subtle">Wallet</span></td>
                                    <td><span className="badge bg-success-subtle text-success border border-success-subtle">Completed</span></td>
                                    <td className="d-flex gap-2">
                                        <div className="dropdown">
                                            <a href="#!" className="link link-custom-primary" data-bs-toggle="dropdown"><i className="ri-more-2-fill"></i></a>
                                            <ul className="dropdown-menu dropdown-menu-end">
                                                <li><a href="#!" className="dropdown-item d-flex gap-3 align-items-center"><i className="ri-eye-line"></i> View</a></li>
                                            </ul>
                                        </div>
                                    </td>
                                </tr>
                                <tr>
                                    <td>
                                        <div className="form-check check-primary"><input className="form-check-input" type="checkbox" /></div>
                                    </td>
                                    <td><a href="#!" className="link link-custom-primary fw-medium">#REF-1029</a></td>
                                    <td><a href="#!" className="link link-custom-primary fw-medium">#ORD1032</a></td>
                                    <td>Dec 15, 2025</td>
                                    <td className="d-flex gap-2 align-items-center">
                                        <img src="/assets/user-9-DB-6OyMr.png" className="size-8 rounded img-fluid" alt="Avatar" />
                                        <span className="fw-medium">Oliver King</span>
                                    </td>
                                    <td><span className="badge bg-info-subtle text-info border border-info-subtle">Partial</span></td>
                                    <td className="text-muted">Late delivery</td>
                                    <td className="fw-medium">$18.00</td>
                                    <td><span className="badge bg-body-tertiary text-body-secondary border border-dark-subtle">Cash</span></td>
                                    <td><span className="badge bg-warning-subtle text-warning border border-warning-subtle">Pending</span></td>
                                    <td className="d-flex gap-2">
                                        <div className="dropdown">
                                            <a href="#!" className="link link-custom-primary" data-bs-toggle="dropdown"><i className="ri-more-2-fill"></i></a>
                                            <ul className="dropdown-menu dropdown-menu-end">
                                                <li><a href="#!" className="dropdown-item d-flex gap-3 align-items-center"><i className="ri-eye-line"></i> View</a></li>
                                                <li><a href="#!" className="dropdown-item d-flex gap-3 align-items-center"><i className="ri-check-line"></i>Approve</a></li>
                                                <li><a href="#!" className="dropdown-item d-flex gap-3 align-items-center text-danger"><i className="ri-close-large-line"></i> Cancel</a></li>
                                            </ul>
                                        </div>
                                    </td>
                                </tr>
                                <tr>
                                    <td>
                                        <div className="form-check check-primary">
                                            <input className="form-check-input" type="checkbox" />
                                        </div>
                                    </td>
                                    <td>
                                        <a href="#!" className="link link-custom-primary fw-medium">#REF-1030</a>
                                    </td>
                                    <td>
                                        <a href="#!" className="link link-custom-primary fw-medium">#ORD1033</a>
                                    </td>
                                    <td>Dec 14, 2025</td>
                                    <td className="d-flex gap-2 align-items-center">
                                        <img src="/assets/user-10-CzpspsdB.png" className="size-8 rounded img-fluid" alt="Avatar" />
                                        <span className="fw-medium">Daniel Moore</span>
                                    </td>
                                    <td>
                                        <span className="badge bg-primary-subtle text-primary border border-primary-subtle">
                                            Full
                                        </span>
                                    </td>
                                    <td className="text-muted">Product not required</td>
                                    <td className="fw-medium">
                                        $72.00 <small className="text-muted">Incl. tax</small>
                                    </td>
                                    <td>
                                        <span className="badge bg-body-tertiary text-body-secondary border border-dark-subtle">
                                            Wallet
                                        </span>
                                    </td>
                                    <td>
                                        <span className="badge bg-warning-subtle text-warning border border-warning-subtle">
                                            Pending
                                        </span>
                                    </td>
                                    <td className="d-flex gap-2">
                                        <div className="dropdown">
                                            <a href="#!" className="link link-custom-primary" data-bs-toggle="dropdown">
                                                <i className="ri-more-2-fill"></i>
                                            </a>
                                            <ul className="dropdown-menu dropdown-menu-end">
                                                <li>
                                                    <a href="#!" className="dropdown-item d-flex gap-3 align-items-center">
                                                        <i className="ri-eye-line"></i> View
                                                    </a>
                                                </li>
                                                <li>
                                                    <a href="#!" className="dropdown-item d-flex gap-3 align-items-center">
                                                        <i className="ri-file-list-3-line"></i> View Order
                                                    </a>
                                                </li>
                                                <li>
                                                    <hr className="dropdown-divider" />
                                                </li>
                                                <li>
                                                    <a href="#!" className="dropdown-item d-flex gap-3 align-items-center text-success">
                                                        <i className="ri-check-line"></i> Approve
                                                    </a>
                                                </li>
                                                <li>
                                                    <a href="#!" className="dropdown-item d-flex gap-3 align-items-center text-danger">
                                                        <i className="ri-close-large-line"></i> Cancel
                                                    </a>
                                                </li>
                                            </ul>
                                        </div>
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                    <div className="row align-items-center g-3 mt-3">
                        <div className="col-md-6">
                            <p className="text-muted text-center text-md-start mb-0">Showing <b className="me-1">1-10</b> of <b className="ms-1">23</b> Results</p>
                        </div>
                        <div className="col-md-6">
                            <nav aria-label="Page navigation example">
                                <ul className="pagination justify-content-center justify-content-md-end mb-0 products-pagination">
                                    <li className="page-item disabled"><a className="page-link" href="#"><i data-lucide="chevron-left" className="size-4"></i>Previous</a></li>
                                    <li className="page-item active"><a className="page-link" href="#">1</a></li>
                                    <li className="page-item"><a className="page-link" href="#">2</a></li>
                                    <li className="page-item"><a className="page-link" href="#">3</a></li>
                                    <li className="page-item"><a className="page-link" href="#">Next<i data-lucide="chevron-right" className="size-4"></i></a></li>
                                </ul>
                            </nav>
                        </div>
                    </div>
                </div>
                <div className="tab-pane fade" id="refund-pending">
                    <div className="table-card table-responsive">
                        <table className="table table-borderless text-nowrap align-middle mb-0">
                            <thead>
                                <tr className="bg-light border-bottom">
                                    <th>
                                        <div className="form-check check-primary">
                                            <input className="form-check-input" type="checkbox" id="checkPendingData" />
                                        </div>
                                    </th>
                                    <th className="fw-medium text-muted">Refund ID</th>
                                    <th className="fw-medium text-muted">Order ID</th>
                                    <th className="fw-medium text-muted">Refund Date</th>
                                    <th className="fw-medium text-muted">Customer</th>
                                    <th className="fw-medium text-muted">Refund Type</th>
                                    <th className="fw-medium text-muted">Reason</th>
                                    <th className="fw-medium text-muted">Refund Amount</th>
                                    <th className="fw-medium text-muted">Refund Method</th>
                                    <th className="fw-medium text-muted">Status</th>
                                    <th className="fw-medium text-muted">Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr>
                                    <td>
                                        <div className="form-check check-primary"><input className="form-check-input" type="checkbox" /></div>
                                    </td>
                                    <td><a href="#!" className="link link-custom-primary fw-medium">#REF-1031</a></td>
                                    <td><a href="#!" className="link link-custom-primary fw-medium">#ORD1034</a></td>
                                    <td>Dec 22, 2025</td>
                                    <td className="d-flex gap-2 align-items-center">
                                        <img src="/assets/user-11-bzS6tHsV.png" className="size-8 rounded img-fluid" alt="Avatar" />
                                        <span className="fw-medium">Lily Adams</span>
                                    </td>
                                    <td><span className="badge bg-info-subtle text-info border border-info-subtle">Partial</span></td>
                                    <td className="text-muted">Late delivery</td>
                                    <td className="fw-medium">$25.50</td>
                                    <td><span className="badge bg-body-tertiary text-body-secondary border border-dark-subtle">Cash</span></td>
                                    <td><span className="badge bg-warning-subtle text-warning border border-warning-subtle">Pending</span></td>
                                    <td className="d-flex gap-2">
                                        <div className="dropdown">
                                            <a href="#!" className="link link-custom-primary" data-bs-toggle="dropdown"><i className="ri-more-2-fill"></i></a>
                                            <ul className="dropdown-menu dropdown-menu-end">
                                                <li><a href="#!" className="dropdown-item d-flex gap-3 align-items-center"><i className="ri-eye-line"></i> View</a></li>
                                                <li><a href="#!" className="dropdown-item d-flex gap-3 align-items-center"><i className="ri-check-line"></i>Approve</a></li>
                                                <li><a href="#!" className="dropdown-item d-flex gap-3 align-items-center text-danger"><i className="ri-close-large-line"></i> Cancel</a></li>
                                            </ul>
                                        </div>
                                    </td>
                                </tr>
                                <tr>
                                    <td>
                                        <div className="form-check check-primary"><input className="form-check-input" type="checkbox" /></div>
                                    </td>
                                    <td><a href="#!" className="link link-custom-primary fw-medium">#REF-1032</a></td>
                                    <td><a href="#!" className="link link-custom-primary fw-medium">#ORD1035</a></td>
                                    <td>Dec 21, 2025</td>
                                    <td className="d-flex gap-2 align-items-center">
                                        <img src="/assets/user-12-CfsiEgBV.png" className="size-8 rounded img-fluid" alt="Avatar" />
                                        <span className="fw-medium">Lucas Brown</span>
                                    </td>
                                    <td><span className="badge bg-info-subtle text-info border border-info-subtle">Partial</span></td>
                                    <td className="text-muted">Wrong item sent</td>
                                    <td className="fw-medium">$40.00</td>
                                    <td><span className="badge bg-body-tertiary text-body-secondary border border-dark-subtle">Card</span></td>
                                    <td><span className="badge bg-warning-subtle text-warning border border-warning-subtle">Pending</span></td>
                                    <td className="d-flex gap-2">
                                        <div className="dropdown">
                                            <a href="#!" className="link link-custom-primary" data-bs-toggle="dropdown"><i className="ri-more-2-fill"></i></a>
                                            <ul className="dropdown-menu dropdown-menu-end">
                                                <li><a href="#!" className="dropdown-item d-flex gap-3 align-items-center"><i className="ri-eye-line"></i> View</a></li>
                                                <li><a href="#!" className="dropdown-item d-flex gap-3 align-items-center"><i className="ri-check-line"></i>Approve</a></li>
                                                <li><a href="#!" className="dropdown-item d-flex gap-3 align-items-center text-danger"><i className="ri-close-large-line"></i> Cancel</a></li>
                                            </ul>
                                        </div>
                                    </td>
                                </tr>
                                <tr>
                                    <td>
                                        <div className="form-check check-primary"><input className="form-check-input" type="checkbox" /></div>
                                    </td>
                                    <td><a href="#!" className="link link-custom-primary fw-medium">#REF-1033</a></td>
                                    <td><a href="#!" className="link link-custom-primary fw-medium">#ORD1036</a></td>
                                    <td>Dec 20, 2025</td>
                                    <td className="d-flex gap-2 align-items-center">
                                        <img src="/assets/user-13-NgroKY8u.png" className="size-8 rounded img-fluid" alt="Avatar" />
                                        <span className="fw-medium">Ella Johnson</span>
                                    </td>
                                    <td><span className="badge bg-info-subtle text-info border border-info-subtle">Partial</span></td>
                                    <td className="text-muted">Damaged packaging</td>
                                    <td className="fw-medium">$32.00</td>
                                    <td><span className="badge bg-body-tertiary text-body-secondary border border-dark-subtle">UPI</span></td>
                                    <td><span className="badge bg-warning-subtle text-warning border border-warning-subtle">Pending</span></td>
                                    <td className="d-flex gap-2">
                                        <div className="dropdown">
                                            <a href="#!" className="link link-custom-primary" data-bs-toggle="dropdown"><i className="ri-more-2-fill"></i></a>
                                            <ul className="dropdown-menu dropdown-menu-end">
                                                <li><a href="#!" className="dropdown-item d-flex gap-3 align-items-center"><i className="ri-eye-line"></i> View</a></li>
                                                <li><a href="#!" className="dropdown-item d-flex gap-3 align-items-center"><i className="ri-check-line"></i>Approve</a></li>
                                                <li><a href="#!" className="dropdown-item d-flex gap-3 align-items-center text-danger"><i className="ri-close-large-line"></i> Cancel</a></li>
                                            </ul>
                                        </div>
                                    </td>
                                </tr>
                                <tr>
                                    <td>
                                        <div className="form-check check-primary"><input className="form-check-input" type="checkbox" /></div>
                                    </td>
                                    <td><a href="#!" className="link link-custom-primary fw-medium">#REF-1034</a></td>
                                    <td><a href="#!" className="link link-custom-primary fw-medium">#ORD1037</a></td>
                                    <td>Dec 19, 2025</td>
                                    <td className="d-flex gap-2 align-items-center">
                                        <img src="/assets/user-14-BWimhkHc.png" className="size-8 rounded img-fluid" alt="Avatar" />
                                        <span className="fw-medium">James Miller</span>
                                    </td>
                                    <td><span className="badge bg-info-subtle text-info border border-info-subtle">Partial</span></td>
                                    <td className="text-muted">Customer changed mind</td>
                                    <td className="fw-medium">$55.00</td>
                                    <td><span className="badge bg-body-tertiary text-body-secondary border border-dark-subtle">Cash</span></td>
                                    <td><span className="badge bg-warning-subtle text-warning border border-warning-subtle">Pending</span></td>
                                    <td className="d-flex gap-2">
                                        <div className="dropdown">
                                            <a href="#!" className="link link-custom-primary" data-bs-toggle="dropdown"><i className="ri-more-2-fill"></i></a>
                                            <ul className="dropdown-menu dropdown-menu-end">
                                                <li><a href="#!" className="dropdown-item d-flex gap-3 align-items-center"><i className="ri-eye-line"></i> View</a></li>
                                                <li><a href="#!" className="dropdown-item d-flex gap-3 align-items-center"><i className="ri-check-line"></i>Approve</a></li>
                                                <li><a href="#!" className="dropdown-item d-flex gap-3 align-items-center text-danger"><i className="ri-close-large-line"></i> Cancel</a></li>
                                            </ul>
                                        </div>
                                    </td>
                                </tr>
                                <tr>
                                    <td>
                                        <div className="form-check check-primary"><input className="form-check-input" type="checkbox" /></div>
                                    </td>
                                    <td><a href="#!" className="link link-custom-primary fw-medium">#REF-1035</a></td>
                                    <td><a href="#!" className="link link-custom-primary fw-medium">#ORD1038</a></td>
                                    <td>Dec 18, 2025</td>
                                    <td className="d-flex gap-2 align-items-center">
                                        <img src="/assets/user-15-Bm8xnKEs.png" className="size-8 rounded img-fluid" alt="Avatar" />
                                        <span className="fw-medium">Sophia Davis</span>
                                    </td>
                                    <td><span className="badge bg-info-subtle text-info border border-info-subtle">Partial</span></td>
                                    <td className="text-muted">Order delayed</td>
                                    <td className="fw-medium">$48.75</td>
                                    <td><span className="badge bg-body-tertiary text-body-secondary border border-dark-subtle">Card</span></td>
                                    <td><span className="badge bg-warning-subtle text-warning border border-warning-subtle">Pending</span></td>
                                    <td className="d-flex gap-2">
                                        <div className="dropdown">
                                            <a href="#!" className="link link-custom-primary" data-bs-toggle="dropdown"><i className="ri-more-2-fill"></i></a>
                                            <ul className="dropdown-menu dropdown-menu-end">
                                                <li><a href="#!" className="dropdown-item d-flex gap-3 align-items-center"><i className="ri-eye-line"></i> View</a></li>
                                                <li><a href="#!" className="dropdown-item d-flex gap-3 align-items-center"><i className="ri-check-line"></i>Approve</a></li>
                                                <li><a href="#!" className="dropdown-item d-flex gap-3 align-items-center text-danger"><i className="ri-close-large-line"></i> Cancel</a></li>
                                            </ul>
                                        </div>
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                    <div className="row align-items-center g-3 mt-3">
                        <div className="col-md-6">
                            <p className="text-muted text-center text-md-start mb-0">Showing <b className="me-1">1-5</b> of <b className="ms-1">5</b> Results</p>
                        </div>
                        <div className="col-md-6">
                            <nav aria-label="Page navigation example">
                                <ul className="pagination justify-content-center justify-content-md-end mb-0 products-pagination">
                                    <li className="page-item disabled"><a className="page-link" href="#">Previous</a></li>
                                    <li className="page-item active"><a className="page-link" href="#">1</a></li>
                                    <li className="page-item"><a className="page-link" href="#">Next</a></li>
                                </ul>
                            </nav>
                        </div>
                    </div>
                </div>
                <div className="tab-pane fade" id="refund-completed">
                    <div className="table-card table-responsive">
                        <table className="table table-borderless text-nowrap align-middle mb-0">
                            <thead>
                                <tr className="bg-light border-bottom">
                                    <th>
                                        <div className="form-check check-primary">
                                            <input className="form-check-input" type="checkbox" />
                                        </div>
                                    </th>
                                    <th className="fw-medium text-muted">Refund ID</th>
                                    <th className="fw-medium text-muted">Order ID</th>
                                    <th className="fw-medium text-muted">Refund Date</th>
                                    <th className="fw-medium text-muted">Customer</th>
                                    <th className="fw-medium text-muted">Refund Type</th>
                                    <th className="fw-medium text-muted">Reason</th>
                                    <th className="fw-medium text-muted">Refund Amount</th>
                                    <th className="fw-medium text-muted">Refund Method</th>
                                    <th className="fw-medium text-muted">Status</th>
                                    <th className="fw-medium text-muted">Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr>
                                    <td>
                                        <div className="form-check check-primary"><input className="form-check-input" type="checkbox" /></div>
                                    </td>
                                    <td><a href="#!" className="link link-custom-primary fw-medium">#REF-1022</a></td>
                                    <td><a href="#!" className="link link-custom-primary fw-medium">#ORD1025</a></td>
                                    <td>Dec 18, 2025</td>
                                    <td className="d-flex gap-2 align-items-center"><img src="/assets/user-2-CroG7YJ0.png" className="size-8 rounded img-fluid" alt="Avatar" /><span className="fw-medium">John Carter</span></td>
                                    <td><span className="badge bg-primary-subtle text-primary border border-primary-subtle">Full</span></td>
                                    <td className="text-muted">Order cancelled</td>
                                    <td className="fw-medium">$120.00</td>
                                    <td><span className="badge bg-body-tertiary text-body-secondary border border-dark-subtle">Card</span></td>
                                    <td><span className="badge bg-success-subtle text-success border border-success-subtle">Completed</span></td>
                                    <td className="d-flex gap-2">
                                        <div className="dropdown">
                                            <a href="#!" className="link link-custom-primary" data-bs-toggle="dropdown"><i className="ri-more-2-fill"></i></a>
                                            <ul className="dropdown-menu dropdown-menu-end">
                                                <li><a href="#!" className="dropdown-item d-flex gap-3 align-items-center"><i className="ri-eye-line"></i> View</a></li>
                                            </ul>
                                        </div>
                                    </td>
                                </tr>
                                <tr>
                                    <td>
                                        <div className="form-check check-primary"><input className="form-check-input" type="checkbox" /></div>
                                    </td>
                                    <td><a href="#!" className="link link-custom-primary fw-medium">#REF-1024</a></td>
                                    <td><a href="#!" className="link link-custom-primary fw-medium">#ORD1027</a></td>
                                    <td>Dec 17, 2025</td>
                                    <td className="d-flex gap-2 align-items-center"><img src="/assets/user-4-7l52E1Lo.png" className="size-8 rounded img-fluid" alt="Avatar" /><span className="fw-medium">Liam Scott</span></td>
                                    <td><span className="badge bg-primary-subtle text-primary border border-primary-subtle">Full</span></td>
                                    <td className="text-muted">Duplicate order</td>
                                    <td className="fw-medium">$89.99</td>
                                    <td><span className="badge bg-body-tertiary text-body-secondary border border-dark-subtle">Wallet</span></td>
                                    <td><span className="badge bg-success-subtle text-success border border-success-subtle">Completed</span></td>
                                    <td className="d-flex gap-2">
                                        <div className="dropdown">
                                            <a href="#!" className="link link-custom-primary" data-bs-toggle="dropdown"><i className="ri-more-2-fill"></i></a>
                                            <ul className="dropdown-menu dropdown-menu-end">
                                                <li><a href="#!" className="dropdown-item d-flex gap-3 align-items-center"><i className="ri-eye-line"></i> View</a></li>
                                            </ul>
                                        </div>
                                    </td>
                                </tr>
                                <tr>
                                    <td>
                                        <div className="form-check check-primary"><input className="form-check-input" type="checkbox" /></div>
                                    </td>
                                    <td><a href="#!" className="link link-custom-primary fw-medium">#REF-1026</a></td>
                                    <td><a href="#!" className="link link-custom-primary fw-medium">#ORD1029</a></td>
                                    <td>Dec 16, 2025</td>
                                    <td className="d-flex gap-2 align-items-center"><img src="/assets/user-6-BIO7_TUU.png" className="size-8 rounded img-fluid" alt="Avatar" /><span className="fw-medium">Sophia Lee</span></td>
                                    <td><span className="badge bg-primary-subtle text-primary border border-primary-subtle">Full</span></td>
                                    <td className="text-muted">Payment failed</td>
                                    <td className="fw-medium">$59.00</td>
                                    <td><span className="badge bg-body-tertiary text-body-secondary border border-dark-subtle">Card</span></td>
                                    <td><span className="badge bg-success-subtle text-success border border-success-subtle">Completed</span></td>
                                    <td className="d-flex gap-2">
                                        <div className="dropdown">
                                            <a href="#!" className="link link-custom-primary" data-bs-toggle="dropdown"><i className="ri-more-2-fill"></i></a>
                                            <ul className="dropdown-menu dropdown-menu-end">
                                                <li><a href="#!" className="dropdown-item d-flex gap-3 align-items-center"><i className="ri-eye-line"></i> View</a></li>
                                            </ul>
                                        </div>
                                    </td>
                                </tr>
                                <tr>
                                    <td>
                                        <div className="form-check check-primary"><input className="form-check-input" type="checkbox" /></div>
                                    </td>
                                    <td><a href="#!" className="link link-custom-primary fw-medium">#REF-1028</a></td>
                                    <td><a href="#!" className="link link-custom-primary fw-medium">#ORD1031</a></td>
                                    <td>Dec 15, 2025</td>
                                    <td className="d-flex gap-2 align-items-center"><img src="/assets/user-8-BAGm131G.png" className="size-8 rounded img-fluid" alt="Avatar" /><span className="fw-medium">Mia Wilson</span></td>
                                    <td><span className="badge bg-primary-subtle text-primary border border-primary-subtle">Full</span></td>
                                    <td className="text-muted">Customer return</td>
                                    <td className="fw-medium">$150.00</td>
                                    <td><span className="badge bg-body-tertiary text-body-secondary border border-dark-subtle">Wallet</span></td>
                                    <td><span className="badge bg-success-subtle text-success border border-success-subtle">Completed</span></td>
                                    <td className="d-flex gap-2">
                                        <div className="dropdown">
                                            <a href="#!" className="link link-custom-primary" data-bs-toggle="dropdown"><i className="ri-more-2-fill"></i></a>
                                            <ul className="dropdown-menu dropdown-menu-end">
                                                <li><a href="#!" className="dropdown-item d-flex gap-3 align-items-center"><i className="ri-eye-line"></i> View</a></li>
                                            </ul>
                                        </div>
                                    </td>
                                </tr>
                                <tr>
                                    <td>
                                        <div className="form-check check-primary"><input className="form-check-input" type="checkbox" /></div>
                                    </td>
                                    <td><a href="#!" className="link link-custom-primary fw-medium">#REF-1030</a></td>
                                    <td><a href="#!" className="link link-custom-primary fw-medium">#ORD1033</a></td>
                                    <td>Dec 14, 2025</td>
                                    <td className="d-flex gap-2 align-items-center"><img src="/assets/user-10-CzpspsdB.png" className="size-8 rounded img-fluid" alt="Avatar" /><span className="fw-medium">Daniel Moore</span></td>
                                    <td><span className="badge bg-primary-subtle text-primary border border-primary-subtle">Full</span></td>
                                    <td className="text-muted">Product not required</td>
                                    <td className="fw-medium">$72.00</td>
                                    <td><span className="badge bg-body-tertiary text-body-secondary border border-dark-subtle">Wallet</span></td>
                                    <td><span className="badge bg-success-subtle text-success border border-success-subtle">Completed</span></td>
                                    <td className="d-flex gap-2">
                                        <div className="dropdown">
                                            <a href="#!" className="link link-custom-primary" data-bs-toggle="dropdown"><i className="ri-more-2-fill"></i></a>
                                            <ul className="dropdown-menu dropdown-menu-end">
                                                <li><a href="#!" className="dropdown-item d-flex gap-3 align-items-center"><i className="ri-eye-line"></i> View</a></li>
                                            </ul>
                                        </div>
                                    </td>
                                </tr>
                                <tr>
                                    <td>
                                        <div className="form-check check-primary"><input className="form-check-input" type="checkbox" /></div>
                                    </td>
                                    <td><a href="#!" className="link link-custom-primary fw-medium">#REF-1022</a></td>
                                    <td><a href="#!" className="link link-custom-primary fw-medium">#ORD1025</a></td>
                                    <td>Dec 18, 2025</td>
                                    <td className="d-flex gap-2 align-items-center"><img src="/assets/user-2-CroG7YJ0.png" className="size-8 rounded img-fluid" alt="Avatar" /><span className="fw-medium">John Carter</span></td>
                                    <td><span className="badge bg-primary-subtle text-primary border border-primary-subtle">Full</span></td>
                                    <td className="text-muted">Order cancelled</td>
                                    <td className="fw-medium">$120.00</td>
                                    <td><span className="badge bg-body-tertiary text-body-secondary border border-dark-subtle">Card</span></td>
                                    <td><span className="badge bg-success-subtle text-success border border-success-subtle">Completed</span></td>
                                    <td className="d-flex gap-2">
                                        <div className="dropdown">
                                            <a href="#!" className="link link-custom-primary" data-bs-toggle="dropdown"><i className="ri-more-2-fill"></i></a>
                                            <ul className="dropdown-menu dropdown-menu-end">
                                                <li><a href="#!" className="dropdown-item d-flex gap-3 align-items-center"><i className="ri-eye-line"></i> View</a></li>
                                            </ul>
                                        </div>
                                    </td>
                                </tr>
                                <tr>
                                    <td>
                                        <div className="form-check check-primary"><input className="form-check-input" type="checkbox" /></div>
                                    </td>
                                    <td><a href="#!" className="link link-custom-primary fw-medium">#REF-1024</a></td>
                                    <td><a href="#!" className="link link-custom-primary fw-medium">#ORD1027</a></td>
                                    <td>Dec 17, 2025</td>
                                    <td className="d-flex gap-2 align-items-center"><img src="/assets/user-4-7l52E1Lo.png" className="size-8 rounded img-fluid" alt="Avatar" /><span className="fw-medium">Liam Scott</span></td>
                                    <td><span className="badge bg-primary-subtle text-primary border border-primary-subtle">Full</span></td>
                                    <td className="text-muted">Duplicate order</td>
                                    <td className="fw-medium">$89.99</td>
                                    <td><span className="badge bg-body-tertiary text-body-secondary border border-dark-subtle">Wallet</span></td>
                                    <td><span className="badge bg-success-subtle text-success border border-success-subtle">Completed</span></td>
                                    <td className="d-flex gap-2">
                                        <div className="dropdown">
                                            <a href="#!" className="link link-custom-primary" data-bs-toggle="dropdown"><i className="ri-more-2-fill"></i></a>
                                            <ul className="dropdown-menu dropdown-menu-end">
                                                <li><a href="#!" className="dropdown-item d-flex gap-3 align-items-center"><i className="ri-eye-line"></i> View</a></li>
                                            </ul>
                                        </div>
                                    </td>
                                </tr>
                                <tr>
                                    <td>
                                        <div className="form-check check-primary"><input className="form-check-input" type="checkbox" /></div>
                                    </td>
                                    <td><a href="#!" className="link link-custom-primary fw-medium">#REF-1026</a></td>
                                    <td><a href="#!" className="link link-custom-primary fw-medium">#ORD1029</a></td>
                                    <td>Dec 16, 2025</td>
                                    <td className="d-flex gap-2 align-items-center"><img src="/assets/user-6-BIO7_TUU.png" className="size-8 rounded img-fluid" alt="Avatar" /><span className="fw-medium">Sophia Lee</span></td>
                                    <td><span className="badge bg-primary-subtle text-primary border border-primary-subtle">Full</span></td>
                                    <td className="text-muted">Payment failed</td>
                                    <td className="fw-medium">$59.00</td>
                                    <td><span className="badge bg-body-tertiary text-body-secondary border border-dark-subtle">Card</span></td>
                                    <td><span className="badge bg-success-subtle text-success border border-success-subtle">Completed</span></td>
                                    <td className="d-flex gap-2">
                                        <div className="dropdown">
                                            <a href="#!" className="link link-custom-primary" data-bs-toggle="dropdown"><i className="ri-more-2-fill"></i></a>
                                            <ul className="dropdown-menu dropdown-menu-end">
                                                <li><a href="#!" className="dropdown-item d-flex gap-3 align-items-center"><i className="ri-eye-line"></i> View</a></li>
                                            </ul>
                                        </div>
                                    </td>
                                </tr>
                                <tr>
                                    <td>
                                        <div className="form-check check-primary"><input className="form-check-input" type="checkbox" /></div>
                                    </td>
                                    <td><a href="#!" className="link link-custom-primary fw-medium">#REF-1031</a></td>
                                    <td><a href="#!" className="link link-custom-primary fw-medium">#ORD1034</a></td>
                                    <td>Dec 14, 2025</td>
                                    <td className="d-flex gap-2 align-items-center"><img src="/assets/user-11-bzS6tHsV.png" className="size-8 rounded img-fluid" alt="Avatar" /><span className="fw-medium">Grace Allen</span></td>
                                    <td><span className="badge bg-primary-subtle text-primary border border-primary-subtle">Full</span></td>
                                    <td className="text-muted">Customer return</td>
                                    <td className="fw-medium">$105.50</td>
                                    <td><span className="badge bg-body-tertiary text-body-secondary border border-dark-subtle">Wallet</span></td>
                                    <td><span className="badge bg-success-subtle text-success border border-success-subtle">Completed</span></td>
                                    <td className="d-flex gap-2">
                                        <div className="dropdown">
                                            <a href="#!" className="link link-custom-primary" data-bs-toggle="dropdown"><i className="ri-more-2-fill"></i></a>
                                            <ul className="dropdown-menu dropdown-menu-end">
                                                <li><a href="#!" className="dropdown-item d-flex gap-3 align-items-center"><i className="ri-eye-line"></i> View</a></li>
                                            </ul>
                                        </div>
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                    <div className="row align-items-center g-3 mt-3">
                        <div className="col-md-6">
                            <p className="text-muted text-center text-md-start mb-0">Showing <b className="me-1">1-9</b> of <b className="ms-1">9</b> Results</p>
                        </div>
                        <div className="col-md-6">
                            <nav aria-label="Page navigation example">
                                <ul className="pagination justify-content-center justify-content-md-end mb-0 products-pagination">
                                    <li className="page-item disabled"><a className="page-link" href="#">Previous</a></li>
                                    <li className="page-item active"><a className="page-link" href="#">1</a></li>
                                    <li className="page-item"><a className="page-link" href="#">Next</a></li>
                                </ul>
                            </nav>
                        </div>
                    </div>
                </div>
                <div className="tab-pane fade" id="refund-rejected">
                    <div className="table-card table-responsive">
                        <table className="table table-borderless text-nowrap align-middle mb-0">
                            <thead>
                                <tr className="bg-light border-bottom">
                                    <th>
                                        <div className="form-check check-primary">
                                            <input className="form-check-input" type="checkbox" />
                                        </div>
                                    </th>
                                    <th className="fw-medium text-muted">Refund ID</th>
                                    <th className="fw-medium text-muted">Order ID</th>
                                    <th className="fw-medium text-muted">Refund Date</th>
                                    <th className="fw-medium text-muted">Customer</th>
                                    <th className="fw-medium text-muted">Refund Type</th>
                                    <th className="fw-medium text-muted">Reason</th>
                                    <th className="fw-medium text-muted">Refund Amount</th>
                                    <th className="fw-medium text-muted">Refund Method</th>
                                    <th className="fw-medium text-muted">Status</th>
                                    <th className="fw-medium text-muted">Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr>
                                    <td>
                                        <div className="form-check check-primary"><input className="form-check-input" type="checkbox" /></div>
                                    </td>
                                    <td><a href="#!" className="link link-custom-primary fw-medium">#REF-1023</a></td>
                                    <td><a href="#!" className="link link-custom-primary fw-medium">#ORD1026</a></td>
                                    <td>Dec 18, 2025</td>
                                    <td className="d-flex gap-2 align-items-center"><img src="/assets/user-3-Bz6g7hsE.png" className="size-8 rounded img-fluid" alt="Avatar" /><span className="fw-medium">Ava Brown</span></td>
                                    <td><span className="badge bg-info-subtle text-info border border-info-subtle">Partial</span></td>
                                    <td className="text-muted">Wrong size</td>
                                    <td className="fw-medium">$30.50</td>
                                    <td><span className="badge bg-body-tertiary text-body-secondary border border-dark-subtle">UPI</span></td>
                                    <td><span className="badge bg-danger-subtle text-danger border border-danger-subtle">Rejected</span></td>
                                    <td className="d-flex gap-2">
                                        <div className="dropdown">
                                            <a href="#!" className="link link-custom-primary" data-bs-toggle="dropdown"><i className="ri-more-2-fill"></i></a>
                                            <ul className="dropdown-menu dropdown-menu-end">
                                                <li><a href="#!" className="dropdown-item d-flex gap-3 align-items-center"><i className="ri-eye-line"></i> View</a></li>
                                            </ul>
                                        </div>
                                    </td>
                                </tr>
                                <tr>
                                    <td>
                                        <div className="form-check check-primary"><input className="form-check-input" type="checkbox" /></div>
                                    </td>
                                    <td><a href="#!" className="link link-custom-primary fw-medium">#REF-1027</a></td>
                                    <td><a href="#!" className="link link-custom-primary fw-medium">#ORD1030</a></td>
                                    <td>Dec 16, 2025</td>
                                    <td className="d-flex gap-2 align-items-center"><img src="/assets/user-7-BMyy-xCq.png" className="size-8 rounded img-fluid" alt="Avatar" /><span className="fw-medium">Ethan Hall</span></td>
                                    <td><span className="badge bg-info-subtle text-info border border-info-subtle">Partial</span></td>
                                    <td className="text-muted">Quality issue</td>
                                    <td className="fw-medium">$22.75</td>
                                    <td><span className="badge bg-body-tertiary text-body-secondary border border-dark-subtle">UPI</span></td>
                                    <td><span className="badge bg-danger-subtle text-danger border border-danger-subtle">Rejected</span></td>
                                    <td className="d-flex gap-2">
                                        <div className="dropdown">
                                            <a href="#!" className="link link-custom-primary" data-bs-toggle="dropdown"><i className="ri-more-2-fill"></i></a>
                                            <ul className="dropdown-menu dropdown-menu-end">
                                                <li><a href="#!" className="dropdown-item d-flex gap-3 align-items-center"><i className="ri-eye-line"></i> View</a></li>
                                            </ul>
                                        </div>
                                    </td>
                                </tr>
                                <tr>
                                    <td>
                                        <div className="form-check check-primary"><input className="form-check-input" type="checkbox" /></div>
                                    </td>
                                    <td><a href="#!" className="link link-custom-primary fw-medium">#REF-1033</a></td>
                                    <td><a href="#!" className="link link-custom-primary fw-medium">#ORD1035</a></td>
                                    <td>Dec 13, 2025</td>
                                    <td className="d-flex gap-2 align-items-center"><img src="/assets/user-12-CfsiEgBV.png" className="size-8 rounded img-fluid" alt="Avatar" /><span className="fw-medium">Lucas King</span></td>
                                    <td><span className="badge bg-primary-subtle text-primary border border-primary-subtle">Full</span></td>
                                    <td className="text-muted">Refund policy expired</td>
                                    <td className="fw-medium">$40.00</td>
                                    <td><span className="badge bg-body-tertiary text-body-secondary border border-dark-subtle">Card</span></td>
                                    <td><span className="badge bg-danger-subtle text-danger border border-danger-subtle">Rejected</span></td>
                                    <td className="d-flex gap-2">
                                        <div className="dropdown">
                                            <a href="#!" className="link link-custom-primary" data-bs-toggle="dropdown"><i className="ri-more-2-fill"></i></a>
                                            <ul className="dropdown-menu dropdown-menu-end">
                                                <li><a href="#!" className="dropdown-item d-flex gap-3 align-items-center"><i className="ri-eye-line"></i> View</a></li>
                                            </ul>
                                        </div>
                                    </td>
                                </tr>
                                <tr>
                                    <td>
                                        <div className="form-check check-primary"><input className="form-check-input" type="checkbox" /></div>
                                    </td>
                                    <td><a href="#!" className="link link-custom-primary fw-medium">#REF-1034</a></td>
                                    <td><a href="#!" className="link link-custom-primary fw-medium">#ORD1036</a></td>
                                    <td>Dec 12, 2025</td>
                                    <td className="d-flex gap-2 align-items-center"><img src="/assets/user-13-NgroKY8u.png" className="size-8 rounded img-fluid" alt="Avatar" /><span className="fw-medium">Olivia Adams</span></td>
                                    <td><span className="badge bg-info-subtle text-info border border-info-subtle">Partial</span></td>
                                    <td className="text-muted">Incorrect item</td>
                                    <td className="fw-medium">$35.00</td>
                                    <td><span className="badge bg-body-tertiary text-body-secondary border border-dark-subtle">Cash</span></td>
                                    <td><span className="badge bg-danger-subtle text-danger border border-danger-subtle">Rejected</span></td>
                                    <td className="d-flex gap-2">
                                        <div className="dropdown">
                                            <a href="#!" className="link link-custom-primary" data-bs-toggle="dropdown"><i className="ri-more-2-fill"></i></a>
                                            <ul className="dropdown-menu dropdown-menu-end">
                                                <li><a href="#!" className="dropdown-item d-flex gap-3 align-items-center"><i className="ri-eye-line"></i> View</a></li>
                                            </ul>
                                        </div>
                                    </td>
                                </tr>
                                <tr>
                                    <td>
                                        <div className="form-check check-primary"><input className="form-check-input" type="checkbox" /></div>
                                    </td>
                                    <td><a href="#!" className="link link-custom-primary fw-medium">#REF-1035</a></td>
                                    <td><a href="#!" className="link link-custom-primary fw-medium">#ORD1037</a></td>
                                    <td>Dec 11, 2025</td>
                                    <td className="d-flex gap-2 align-items-center"><img src="/assets/user-14-BWimhkHc.png" className="size-8 rounded img-fluid" alt="Avatar" /><span className="fw-medium">James Miller</span></td>
                                    <td><span className="badge bg-primary-subtle text-primary border border-primary-subtle">Full</span></td>
                                    <td className="text-muted">Order not verified</td>
                                    <td className="fw-medium">$55.00</td>
                                    <td><span className="badge bg-body-tertiary text-body-secondary border border-dark-subtle">Wallet</span></td>
                                    <td><span className="badge bg-danger-subtle text-danger border border-danger-subtle">Rejected</span></td>
                                    <td className="d-flex gap-2">
                                        <div className="dropdown">
                                            <a href="#!" className="link link-custom-primary" data-bs-toggle="dropdown"><i className="ri-more-2-fill"></i></a>
                                            <ul className="dropdown-menu dropdown-menu-end">
                                                <li><a href="#!" className="dropdown-item d-flex gap-3 align-items-center"><i className="ri-eye-line"></i> View</a></li>
                                            </ul>
                                        </div>
                                    </td>
                                </tr>
                                <tr>
                                    <td>
                                        <div className="form-check check-primary"><input className="form-check-input" type="checkbox" /></div>
                                    </td>
                                    <td><a href="#!" className="link link-custom-primary fw-medium">#REF-1036</a></td>
                                    <td><a href="#!" className="link link-custom-primary fw-medium">#ORD1038</a></td>
                                    <td>Dec 10, 2025</td>
                                    <td className="d-flex gap-2 align-items-center">
                                        <img src="/assets/user-15-Bm8xnKEs.png" className="size-8 rounded img-fluid" alt="Avatar" />
                                        <span className="fw-medium">Charlotte Davis</span>
                                    </td>
                                    <td><span className="badge bg-info-subtle text-info border border-info-subtle">Partial</span></td>
                                    <td className="text-muted">Damaged packaging</td>
                                    <td className="fw-medium">$28.50</td>
                                    <td><span className="badge bg-body-tertiary text-body-secondary border border-dark-subtle">Cash</span></td>
                                    <td><span className="badge bg-danger-subtle text-danger border border-danger-subtle">Rejected</span></td>
                                    <td className="d-flex gap-2">
                                        <div className="dropdown">
                                            <a href="#!" className="link link-custom-primary" data-bs-toggle="dropdown"><i className="ri-more-2-fill"></i></a>
                                            <ul className="dropdown-menu dropdown-menu-end">
                                                <li><a href="#!" className="dropdown-item d-flex gap-3 align-items-center"><i className="ri-eye-line"></i> View</a></li>
                                            </ul>
                                        </div>
                                    </td>
                                </tr>
                                <tr>
                                    <td>
                                        <div className="form-check check-primary"><input className="form-check-input" type="checkbox" /></div>
                                    </td>
                                    <td><a href="#!" className="link link-custom-primary fw-medium">#REF-1037</a></td>
                                    <td><a href="#!" className="link link-custom-primary fw-medium">#ORD1039</a></td>
                                    <td>Dec 09, 2025</td>
                                    <td className="d-flex gap-2 align-items-center">
                                        <img src="/assets/user-16-DwC0VZG4.png" className="size-8 rounded img-fluid" alt="Avatar" />
                                        <span className="fw-medium">Henry Wilson</span>
                                    </td>
                                    <td><span className="badge bg-primary-subtle text-primary border border-primary-subtle">Full</span></td>
                                    <td className="text-muted">Order mismatch</td>
                                    <td className="fw-medium">$65.00</td>
                                    <td><span className="badge bg-body-tertiary text-body-secondary border border-dark-subtle">Card</span></td>
                                    <td><span className="badge bg-danger-subtle text-danger border border-danger-subtle">Rejected</span></td>
                                    <td className="d-flex gap-2">
                                        <div className="dropdown">
                                            <a href="#!" className="link link-custom-primary" data-bs-toggle="dropdown"><i className="ri-more-2-fill"></i></a>
                                            <ul className="dropdown-menu dropdown-menu-end">
                                                <li><a href="#!" className="dropdown-item d-flex gap-3 align-items-center"><i className="ri-eye-line"></i> View</a></li>
                                            </ul>
                                        </div>
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                    <div className="row align-items-center g-3 mt-3">
                        <div className="col-md-6">
                            <p className="text-muted text-center text-md-start mb-0">Showing <b className="me-1">1-7</b> of <b className="ms-1">7</b> Results</p>
                        </div>
                        <div className="col-md-6">
                            <nav aria-label="Page navigation example">
                                <ul className="pagination justify-content-center justify-content-md-end mb-0 products-pagination">
                                    <li className="page-item disabled"><a className="page-link" href="#">Previous</a></li>
                                    <li className="page-item active"><a className="page-link" href="#">1</a></li>
                                    <li className="page-item"><a className="page-link" href="#">Next</a></li>
                                </ul>
                            </nav>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>

    {/* Add/Edit Order Modal */}
    <div className="modal fade" id="addRefundModal" tabindex="-1" aria-hidden="true">
        <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content">
                <div className="modal-header">
                    <h6 className="modal-title">Add New Refund</h6>
                    <button type="button" className="btn-close" data-bs-dismiss="modal"></button>
                </div>
                <div className="modal-body">
                    <form>
                        <div className="row g-4">
                            <div className="col-md-6">
                                <label htmlFor="refundId" className="form-label">Refund ID <span className="text-danger">*</span></label>
                                <input type="text" className="form-control" id="refundId" placeholder="#REF1033" required />
                            </div>
                            <div className="col-md-6">
                                <label htmlFor="refundDate" className="form-label">Refund Date <span className="text-danger">*</span></label>
                                <input type="text" className="form-control" id="refundDate" data-datepicker data-date-format="dd-MM-yyyy" placeholder="Choose Date" required />
                            </div>
                            <div className="col-md-6">
                                <label htmlFor="refundOrderId" className="form-label">Order ID <span className="text-danger">*</span></label>
                                <input type="text" className="form-control" id="refundOrderId" placeholder="#ORD1032" required />
                            </div>
                            <div className="col-md-6">
                                <label htmlFor="customerRefundName" className="form-label">Customer Name <span className="text-danger">*</span></label>
                                <input type="text" className="form-control" id="customerRefundName" placeholder="Emma White" required />
                            </div>
                            <div className="col-md-6">
                                <label htmlFor="refundType" className="form-label">Refund Type <span className="text-danger">*</span></label>
                                <div id="addRefundType"></div>
                            </div>
                            <div className="col-md-6">
                                <label htmlFor="refundMethod" className="form-label">Refund Method <span className="text-danger">*</span></label>
                                <div id="addRefundMethod"></div>
                            </div>
                            <div className="col-md-6">
                                <label htmlFor="refundAmount" className="form-label">Refund Amount <span className="text-danger">*</span></label>
                                <input type="number" className="form-control" id="refundAmount" step="0.01" placeholder="120.50" required />
                            </div>
                            <div className="col-md-6">
                                <label htmlFor="refundStatus" className="form-label">Refund Status</label>
                                <div id="addRefundStatus"></div>
                            </div>
                            <div className="col-12">
                                <label htmlFor="refundReason" className="form-label">Reason</label>
                                <textarea className="form-control" id="refundReason" rows="3" placeholder="Reason for refund..."></textarea>
                            </div>
                        </div>
                        <div className="d-flex gap-3 mt-7">
                            <button type="button" className="btn btn-light w-50" data-bs-dismiss="modal">Cancel</button>
                            <button type="submit" className="btn btn-primary w-50">Save Refund</button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    </div>

    
</div>
    </>
  );
}
