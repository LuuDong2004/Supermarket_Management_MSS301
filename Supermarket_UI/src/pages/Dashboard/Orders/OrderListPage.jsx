// pages/Dashboard/Orders/OrderListPage.jsx
import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import PageBreadcrumb from '../../../components/ui/PageBreadcrumb';
import { ROUTES } from '../../../configs/routes';

export default function OrderListPage() {
  useEffect(() => {
    if (window.lucide) {
      window.lucide.createIcons();
    }
  }, []);

  return (
    <>
      <div className="container-fluid">

    <div className="gap-2 page-heading mb-3 flex-column flex-md-row">
        <h6 className="flex-grow-1 mb-0">Orders All</h6>
        <ul className="breadcrumb flex-shrink-0 mb-0">
            <li className="breadcrumb-item"><a href="#!">Orders</a></li>
            <li className="breadcrumb-item active">Orders All</li>
        </ul>
    </div>
    <div className="row row-cols-1 row-cols-md-2 row-cols-lg-3 row-cols-xxl-5">
        <div className="col">
            <div className="card p-4">
                <div className="d-flex align-items-center justify-content-between mb-5">
                    <h6 className="fs-16 mb-0 fw-medium">Total Orders</h6>
                    <div data-lucide="info" className="text-muted size-5"></div>
                </div>
                <h4 className="mb-4 font-base">1,245</h4>
                <p className="mb-0">
                    <span className="text-success fw-medium">
                        <i data-lucide="trending-up" className="size-4 me-1"></i>3.5%
                    </span>
                    <span className="text-muted">vs last month</span>
                </p>
            </div>
        </div>
        <div className="col">
            <div className="card p-4">
                <div className="d-flex align-items-center justify-content-between mb-5">
                    <h6 className="fs-16 mb-0 fw-medium">Total Revenue</h6>
                    <div data-lucide="info" className="text-muted size-5"></div>
                </div>
                <h4 className="mb-4 font-base">$245,890</h4>
                <p className="mb-0">
                    <span className="text-success fw-medium">
                        <i data-lucide="trending-up" className="size-4 me-1"></i>5.2%
                    </span>
                    <span className="text-muted">vs last month</span>
                </p>
            </div>
        </div>
        <div className="col">
            <div className="card p-4">
                <div className="d-flex align-items-center justify-content-between mb-5">
                    <h6 className="fs-16 mb-0 fw-medium">Pending Orders</h6>
                    <div data-lucide="info" className="text-muted size-5"></div>
                </div>
                <h4 className="mb-4 font-base">120</h4>
                <p className="mb-0">
                    <span className="text-danger fw-medium">
                        <i data-lucide="trending-down" className="size-4 me-1"></i>1.8%
                    </span>
                    <span className="text-muted">vs last month</span>
                </p>
            </div>
        </div>
        <div className="col">
            <div className="card p-4">
                <div className="d-flex align-items-center justify-content-between mb-5">
                    <h6 className="fs-16 mb-0 fw-medium">Completed Orders</h6>
                    <div data-lucide="info" className="text-muted size-5"></div>
                </div>
                <h4 className="mb-4 font-base">1,050</h4>
                <p className="mb-0">
                    <span className="text-success fw-medium">
                        <i data-lucide="trending-up" className="size-4 me-1"></i>4.1%
                    </span>
                    <span className="text-muted">vs last month</span>
                </p>
            </div>
        </div>
        <div className="col">
            <div className="card p-4">
                <div className="d-flex align-items-center justify-content-between mb-5">
                    <h6 className="fs-16 mb-0 fw-medium">Refunded Orders</h6>
                    <div data-lucide="info" className="text-muted size-5"></div>
                </div>
                <h4 className="mb-4 font-base">75</h4>
                <p className="mb-0">
                    <span className="text-danger fw-medium">
                        <i data-lucide="trending-up" className="size-4 me-1"></i>0.9%
                    </span>
                    <span className="text-muted">vs last month</span>
                </p>
            </div>
        </div>
    </div>
    <div className="card">
        <div className="card-header">
            <div className="d-flex flex-wrap gap-4 align-items-center gap-2 justify-content-between mb-4">
                <h5 className="card-title mb-0">All Orders</h5>
                <div className="d-flex flex-wrap align-items-center gap-2">
                    <button type="button" className="btn btn-outline-light border flex-shrink-0">Export CSV <i data-lucide="arrow-down-to-line" className="size-4"></i></button>
                    <button type="button" className="btn btn-outline-light border flex-shrink-0">Saved Views <i data-lucide="plus" className="size-4"></i></button>
                    <div className="position-relative w-64 flex-shrink-0">
                        <input type="text" className="form-control ps-10" data-datepicker data-date-format="dd-MM-yyyy" placeholder="Dec 1, 2025 - Dec 31, 2025" />
                        <i data-lucide="calendar" className="size-4 icon-dark position-absolute top-50 start-0 ms-4 translate-middle-y"></i>
                    </div>
                    <div id="orderStatus" className="w-44"></div>
                    <button type="button" className="btn btn-outline-light border flex-shrink-0"><i data-lucide="arrow-up-wide-narrow" className="size-4 me-1"></i>Sorting</button>
                    <div id="paymentMethod" className="w-56"></div>
                </div>
            </div>
            <div className="row g-2 justify-content-between">
                <div className="col-md-8 col-lg-6 col-xxl-4 position-relative">
                    <input type="text" id="lostItemSearch" className="form-control ps-9" placeholder="Search Order ID, Customer, Product, etc..." />
                    <i data-lucide="search" className="size-4 icon-dark position-absolute top-50 start-0 ms-4 translate-middle-y"></i>
                </div>
                <div className="col-md-4 text-end">
                    <button type="button" className="btn btn-primary" data-bs-toggle="modal" data-bs-target="#addOrderModal"><i data-lucide="plus" className="size-4 me-1"></i>Add New Order</button>
                </div>
            </div>
        </div>
        <div className="card-body pt-0">
            <div className="table-card table-responsive">
                <table className="table table-borderless text-nowrap align-middle mb-0">
                    <thead>
                        <tr className="bg-light border-bottom">
                            <th>
                                <div className="form-check check-primary">
                                    <input className="form-check-input" type="checkbox" id="checAllData" />
                                </div>
                            </th>
                            <th className="fw-medium text-muted">Order ID</th>
                            <th className="fw-medium text-muted">Date</th>
                            <th className="fw-medium text-muted">Product</th>
                            <th className="fw-medium text-muted">Customer</th>
                            <th className="fw-medium text-muted">Items</th>
                            <th className="fw-medium text-muted">Total Price</th>
                            <th className="fw-medium text-muted">Payment Status</th>
                            <th className="fw-medium text-muted">Quantity</th>
                            <th className="fw-medium text-muted">Order Status</th>
                            <th className="fw-medium text-muted">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td>
                                <div className="form-check check-primary">
                                    <input className="form-check-input" type="checkbox" id="checkData01" />
                                </div>
                            </td>
                            <td><a href="#!" className="link link-custom-primary fw-medium">#ORD1024</a></td>
                            <td>Dec 19, 2025</td>
                            <td>
                                <div className="d-flex align-items-center gap-2">
                                    <div className="avatar size-10 border rounded-1 p-1">
                                        <img src="/assets/img-01-BBWp8t8E.png" loading="lazy" alt="Product" className="img-fluid" />
                                    </div>
                                    <a href="#!" className="text-reset fw-medium">Blouse top</a>
                                </div>
                            </td>
                            <td>
                                <div className="d-flex gap-2 align-items-center">
                                    <img src="/assets/user-10-CzpspsdB.png" alt="User" className="size-10 rounded-circle img-fluid" />
                                    <div>
                                        <a href="#!" className="text-reset d-block fw-medium">Emma White</a>
                                        <a href="#!" className="link link-custom-primary fs-sm">industrial@gotpos.com</a>
                                    </div>
                                </div>
                            </td>
                            <td>3</td>
                            <td>
                                <p className="fw-medium">$120.50</p>
                                <p className="text-muted fs-sm">Cash on Delivery</p>
                            </td>
                            <td><span className="badge bg-success-subtle text-success border border-success-subtle">Paid</span></td>
                            <td>7</td>
                            <td><span className="badge bg-warning-subtle text-warning border border-warning-subtle">Pending</span></td>
                            <td>
                                <div className="d-flex gap-2">
                                    <button type="button" className="btn btn-sub-primary size-8 btn-icon"><i className="ri-eye-line"></i></button>
                                    <button type="button" className="btn btn-sub-secondary size-8 btn-icon edit-btn"><i className="ri-edit-line"></i></button>
                                    <button type="button" className="btn btn-sub-danger size-8 btn-icon delete-btn" data-bs-toggle="modal" data-bs-target="#deleteModal"><i className="ri-delete-bin-line"></i></button>
                                </div>
                            </td>
                        </tr>
                        <tr>
                            <td>
                                <div className="form-check check-primary">
                                    <input className="form-check-input" type="checkbox" id="checkData02" />
                                </div>
                            </td>
                            <td><a href="#!" className="link link-custom-primary fw-medium">#ORD1025</a></td>
                            <td>Dec 18, 2025</td>
                            <td>
                                <div className="d-flex align-items-center gap-2">
                                    <div className="avatar size-10 border rounded-1 p-1">
                                        <img src="/assets/img-02-ClVfz9I5.png" loading="lazy" alt="Product" className="img-fluid" />
                                    </div>
                                    <a href="#!" className="text-reset fw-medium">Summer Dress</a>
                                </div>
                            </td>
                            <td>
                                <div className="d-flex gap-2 align-items-center">
                                    <img src="/assets/user-11-bzS6tHsV.png" alt="User" className="size-10 rounded-circle img-fluid" />
                                    <div>
                                        <a href="#!" className="text-reset d-block fw-medium">Liam Johnson</a>
                                        <a href="#!" className="link link-custom-primary fs-sm">liam@gotpos.com</a>
                                    </div>
                                </div>
                            </td>
                            <td>1</td>
                            <td>
                                <p className="fw-medium">$85.00</p>
                                <p className="text-muted fs-sm">Credit Card</p>
                            </td>
                            <td><span className="badge bg-success-subtle text-success border border-success-subtle">Paid</span></td>
                            <td>2</td>
                            <td><span className="badge bg-danger-subtle text-danger border border-danger-subtle">Failed</span></td>
                            <td>
                                <div className="d-flex gap-2">
                                    <button type="button" className="btn btn-sub-primary size-8 btn-icon"><i className="ri-eye-line"></i></button>
                                    <button type="button" className="btn btn-sub-secondary size-8 btn-icon edit-btn"><i className="ri-edit-line"></i></button>
                                    <button type="button" className="btn btn-sub-danger size-8 btn-icon delete-btn" data-bs-toggle="modal" data-bs-target="#deleteModal"><i className="ri-delete-bin-line"></i></button>
                                </div>
                            </td>
                        </tr>
                        <tr>
                            <td>
                                <div className="form-check check-primary">
                                    <input className="form-check-input" type="checkbox" id="checkData03" />
                                </div>
                            </td>
                            <td><a href="#!" className="link link-custom-primary fw-medium">#ORD1026</a></td>
                            <td>Dec 17, 2025</td>
                            <td>
                                <div className="d-flex align-items-center gap-2">
                                    <div className="avatar size-10 border rounded-1 p-1">
                                        <img src="/assets/img-03-oTTY_McP.png" loading="lazy" alt="Product" className="img-fluid" />
                                    </div>
                                    <a href="#!" className="text-reset fw-medium">Casual Shirt</a>
                                </div>
                            </td>
                            <td>
                                <div className="d-flex gap-2 align-items-center">
                                    <img src="/assets/user-12-CfsiEgBV.png" alt="User" className="size-10 rounded-circle img-fluid" />
                                    <div>
                                        <a href="#!" className="text-reset d-block fw-medium">Olivia Brown</a>
                                        <a href="#!" className="link link-custom-primary fs-sm">olivia@gotpos.com</a>
                                    </div>
                                </div>
                            </td>
                            <td>2</td>
                            <td>
                                <p className="fw-medium">$60.75</p>
                                <p className="text-muted fs-sm">PayPal</p>
                            </td>
                            <td><span className="badge bg-warning-subtle text-warning border border-warning-subtle">Pending</span></td>
                            <td>4</td>
                            <td><span className="badge bg-success-subtle text-success border border-success-subtle">Paid</span></td>
                            <td>
                                <div className="d-flex gap-2">
                                    <button type="button" className="btn btn-sub-primary size-8 btn-icon"><i className="ri-eye-line"></i></button>
                                    <button type="button" className="btn btn-sub-secondary size-8 btn-icon edit-btn"><i className="ri-edit-line"></i></button>
                                    <button type="button" className="btn btn-sub-danger size-8 btn-icon delete-btn" data-bs-toggle="modal" data-bs-target="#deleteModal"><i className="ri-delete-bin-line"></i></button>
                                </div>
                            </td>
                        </tr>
                        <tr>
                            <td>
                                <div className="form-check check-primary">
                                    <input className="form-check-input" type="checkbox" id="checkData04" />
                                </div>
                            </td>
                            <td><a href="#!" className="link link-custom-primary fw-medium">#ORD1027</a></td>
                            <td>Dec 16, 2025</td>
                            <td>
                                <div className="d-flex align-items-center gap-2">
                                    <div className="avatar size-10 border rounded-1 p-1">
                                        <img src="/assets/img-04-DZ4OtBxS.png" loading="lazy" alt="Product" className="img-fluid" />
                                    </div>
                                    <a href="#!" className="text-reset fw-medium">Denim Jeans</a>
                                </div>
                            </td>
                            <td>
                                <div className="d-flex gap-2 align-items-center">
                                    <img src="/assets/user-13-NgroKY8u.png" alt="User" className="size-10 rounded-circle img-fluid" />
                                    <div>
                                        <a href="#!" className="text-reset d-block fw-medium">Noah Smith</a>
                                        <a href="#!" className="link link-custom-primary fs-sm">noah@gotpos.com</a>
                                    </div>
                                </div>
                            </td>
                            <td>1</td>
                            <td>
                                <p className="fw-medium">$150.00</p>
                                <p className="text-muted fs-sm">Cash on Delivery</p>
                            </td>
                            <td><span className="badge bg-danger-subtle text-danger border border-danger-subtle">Failed</span></td>
                            <td>1</td>
                            <td><span className="badge bg-warning-subtle text-warning border border-warning-subtle">Pending</span></td>
                            <td>
                                <div className="d-flex gap-2">
                                    <button type="button" className="btn btn-sub-primary size-8 btn-icon"><i className="ri-eye-line"></i></button>
                                    <button type="button" className="btn btn-sub-secondary size-8 btn-icon edit-btn"><i className="ri-edit-line"></i></button>
                                    <button type="button" className="btn btn-sub-danger size-8 btn-icon delete-btn" data-bs-toggle="modal" data-bs-target="#deleteModal"><i className="ri-delete-bin-line"></i></button>
                                </div>
                            </td>
                        </tr>
                        <tr>
                            <td>
                                <div className="form-check check-primary">
                                    <input className="form-check-input" type="checkbox" id="checkData05" />
                                </div>
                            </td>
                            <td><a href="#!" className="link link-custom-primary fw-medium">#ORD1028</a></td>
                            <td>Dec 15, 2025</td>
                            <td>
                                <div className="d-flex align-items-center gap-2">
                                    <div className="avatar size-10 border rounded-1 p-1">
                                        <img src="/assets/img-05-DPzi-ptA.png" loading="lazy" alt="Product" className="img-fluid" />
                                    </div>
                                    <a href="#!" className="text-reset fw-medium">Leather Jacket</a>
                                </div>
                            </td>
                            <td>
                                <div className="d-flex gap-2 align-items-center">
                                    <img src="/assets/user-14-BWimhkHc.png" alt="User" className="size-10 rounded-circle img-fluid" />
                                    <div>
                                        <a href="#!" className="text-reset d-block fw-medium">Sophia Lee</a>
                                        <a href="#!" className="link link-custom-primary fs-sm">sophia@gotpos.com</a>
                                    </div>
                                </div>
                            </td>
                            <td>2</td>
                            <td>
                                <p className="fw-medium">$220.00</p>
                                <p className="text-muted fs-sm">Credit Card</p>
                            </td>
                            <td><span className="badge bg-success-subtle text-success border border-success-subtle">Paid</span></td>
                            <td>5</td>
                            <td><span className="badge bg-warning-subtle text-warning border border-warning-subtle">Pending</span></td>
                            <td>
                                <div className="d-flex gap-2">
                                    <button type="button" className="btn btn-sub-primary size-8 btn-icon"><i className="ri-eye-line"></i></button>
                                    <button type="button" className="btn btn-sub-secondary size-8 btn-icon edit-btn"><i className="ri-edit-line"></i></button>
                                    <button type="button" className="btn btn-sub-danger size-8 btn-icon delete-btn" data-bs-toggle="modal" data-bs-target="#deleteModal"><i className="ri-delete-bin-line"></i></button>
                                </div>
                            </td>
                        </tr>
                        <tr>
                            <td>
                                <div className="form-check check-primary"><input className="form-check-input" type="checkbox" id="checkData06" /></div>
                            </td>
                            <td><a href="#!" className="link link-custom-primary fw-medium">#ORD1029</a></td>
                            <td>Dec 14, 2025</td>
                            <td>
                                <div className="d-flex align-items-center gap-2">
                                    <div className="avatar size-10 border rounded-1 p-1"><img src="/assets/img-06-DdkuSG6a.png" loading="lazy" alt="Product" className="img-fluid" /></div>
                                    <a href="#!" className="text-reset fw-medium">Floral Skirt</a>
                                </div>
                            </td>
                            <td>
                                <div className="d-flex gap-2 align-items-center">
                                    <img src="/assets/user-15-Bm8xnKEs.png" alt="User" className="size-10 rounded-circle img-fluid" />
                                    <div>
                                        <a href="#!" className="text-reset d-block fw-medium">Mason Clark</a>
                                        <a href="#!" className="link link-custom-primary fs-sm">mason@gotpos.com</a>
                                    </div>
                                </div>
                            </td>
                            <td>1</td>
                            <td>
                                <p className="fw-medium">$75.00</p>
                                <p className="text-muted fs-sm">PayPal</p>
                            </td>
                            <td><span className="badge bg-success-subtle text-success border border-success-subtle">Paid</span></td>
                            <td>3</td>
                            <td><span className="badge bg-warning-subtle text-warning border border-warning-subtle">Pending</span></td>
                            <td>
                                <div className="d-flex gap-2">
                                    <button type="button" className="btn btn-sub-primary size-8 btn-icon"><i className="ri-eye-line"></i></button>
                                    <button type="button" className="btn btn-sub-secondary size-8 btn-icon edit-btn"><i className="ri-edit-line"></i></button>
                                    <button type="button" className="btn btn-sub-danger size-8 btn-icon delete-btn" data-bs-toggle="modal" data-bs-target="#deleteModal"><i className="ri-delete-bin-line"></i></button>
                                </div>
                            </td>
                        </tr>

                        <tr>
                            <td>
                                <div className="form-check check-primary"><input className="form-check-input" type="checkbox" id="checkData07" /></div>
                            </td>
                            <td><a href="#!" className="link link-custom-primary fw-medium">#ORD1030</a></td>
                            <td>Dec 13, 2025</td>
                            <td>
                                <div className="d-flex align-items-center gap-2">
                                    <div className="avatar size-10 border rounded-1 p-1"><img src="/assets/img-07-9mjzrP7h.png" loading="lazy" alt="Product" className="img-fluid" /></div>
                                    <a href="#!" className="text-reset fw-medium">Casual Hoodie</a>
                                </div>
                            </td>
                            <td>
                                <div className="d-flex gap-2 align-items-center">
                                    <img src="/assets/user-16-DwC0VZG4.png" alt="User" className="size-10 rounded-circle img-fluid" />
                                    <div>
                                        <a href="#!" className="text-reset d-block fw-medium">Ava Martinez</a>
                                        <a href="#!" className="link link-custom-primary fs-sm">ava@gotpos.com</a>
                                    </div>
                                </div>
                            </td>
                            <td>2</td>
                            <td>
                                <p className="fw-medium">$95.50</p>
                                <p className="text-muted fs-sm">Credit Card</p>
                            </td>
                            <td><span className="badge bg-warning-subtle text-warning border border-warning-subtle">Pending</span></td>
                            <td>4</td>
                            <td><span className="badge bg-success-subtle text-success border border-success-subtle">Paid</span></td>
                            <td>
                                <div className="d-flex gap-2">
                                    <button type="button" className="btn btn-sub-primary size-8 btn-icon"><i className="ri-eye-line"></i></button>
                                    <button type="button" className="btn btn-sub-secondary size-8 btn-icon edit-btn"><i className="ri-edit-line"></i></button>
                                    <button type="button" className="btn btn-sub-danger size-8 btn-icon delete-btn" data-bs-toggle="modal" data-bs-target="#deleteModal"><i className="ri-delete-bin-line"></i></button>
                                </div>
                            </td>
                        </tr>

                        <tr>
                            <td>
                                <div className="form-check check-primary"><input className="form-check-input" type="checkbox" id="checkData08" /></div>
                            </td>
                            <td><a href="#!" className="link link-custom-primary fw-medium">#ORD1031</a></td>
                            <td>Dec 12, 2025</td>
                            <td>
                                <div className="d-flex align-items-center gap-2">
                                    <div className="avatar size-10 border rounded-1 p-1"><img src="/assets/img-08-BXmGY-HZ.png" loading="lazy" alt="Product" className="img-fluid" /></div>
                                    <a href="#!" className="text-reset fw-medium">Sneakers</a>
                                </div>
                            </td>
                            <td>
                                <div className="d-flex gap-2 align-items-center">
                                    <img src="/assets/user-17-Y_OiPHJx.png" alt="User" className="size-10 rounded-circle img-fluid" />
                                    <div>
                                        <a href="#!" className="text-reset d-block fw-medium">Ethan Scott</a>
                                        <a href="#!" className="link link-custom-primary fs-sm">ethan@gotpos.com</a>
                                    </div>
                                </div>
                            </td>
                            <td>1</td>
                            <td>
                                <p className="fw-medium">$120.00</p>
                                <p className="text-muted fs-sm">Cash on Delivery</p>
                            </td>
                            <td><span className="badge bg-success-subtle text-success border border-success-subtle">Paid</span></td>
                            <td>2</td>
                            <td><span className="badge bg-warning-subtle text-warning border border-warning-subtle">Pending</span></td>
                            <td>
                                <div className="d-flex gap-2">
                                    <button type="button" className="btn btn-sub-primary size-8 btn-icon"><i className="ri-eye-line"></i></button>
                                    <button type="button" className="btn btn-sub-secondary size-8 btn-icon edit-btn"><i className="ri-edit-line"></i></button>
                                    <button type="button" className="btn btn-sub-danger size-8 btn-icon delete-btn" data-bs-toggle="modal" data-bs-target="#deleteModal"><i className="ri-delete-bin-line"></i></button>
                                </div>
                            </td>
                        </tr>

                        <tr>
                            <td>
                                <div className="form-check check-primary"><input className="form-check-input" type="checkbox" id="checkData09" /></div>
                            </td>
                            <td><a href="#!" className="link link-custom-primary fw-medium">#ORD1032</a></td>
                            <td>Dec 11, 2025</td>
                            <td>
                                <div className="d-flex align-items-center gap-2">
                                    <div className="avatar size-10 border rounded-1 p-1"><img src="/assets/img-09-CqG2QIp1.png" loading="lazy" alt="Product" className="img-fluid" /></div>
                                    <a href="#!" className="text-reset fw-medium">Wool Sweater</a>
                                </div>
                            </td>
                            <td>
                                <div className="d-flex gap-2 align-items-center">
                                    <img src="/assets/user-18-C5ehJukC.png" alt="User" className="size-10 rounded-circle img-fluid" />
                                    <div>
                                        <a href="#!" className="text-reset d-block fw-medium">Isabella Adams</a>
                                        <a href="#!" className="link link-custom-primary fs-sm">isabella@gotpos.com</a>
                                    </div>
                                </div>
                            </td>
                            <td>2</td>
                            <td>
                                <p className="fw-medium">$180.00</p>
                                <p className="text-muted fs-sm">Credit Card</p>
                            </td>
                            <td><span className="badge bg-warning-subtle text-warning border border-warning-subtle">Pending</span></td>
                            <td>3</td>
                            <td><span className="badge bg-success-subtle text-success border border-success-subtle">Paid</span></td>
                            <td>
                                <div className="d-flex gap-2">
                                    <button type="button" className="btn btn-sub-primary size-8 btn-icon"><i className="ri-eye-line"></i></button>
                                    <button type="button" className="btn btn-sub-secondary size-8 btn-icon edit-btn"><i className="ri-edit-line"></i></button>
                                    <button type="button" className="btn btn-sub-danger size-8 btn-icon delete-btn" data-bs-toggle="modal" data-bs-target="#deleteModal"><i className="ri-delete-bin-line"></i></button>
                                </div>
                            </td>
                        </tr>

                        <tr>
                            <td>
                                <div className="form-check check-primary"><input className="form-check-input" type="checkbox" id="checkData10" /></div>
                            </td>
                            <td><a href="#!" className="link link-custom-primary fw-medium">#ORD1033</a></td>
                            <td>Dec 10, 2025</td>
                            <td>
                                <div className="d-flex align-items-center gap-2">
                                    <div className="avatar size-10 border rounded-1 p-1"><img src="/assets/img-10-DqnuMbAd.png" loading="lazy" alt="Product" className="img-fluid" /></div>
                                    <a href="#!" className="text-reset fw-medium">Formal Shirt</a>
                                </div>
                            </td>
                            <td>
                                <div className="d-flex gap-2 align-items-center">
                                    <img src="/assets/user-19-uC8d_L1u.png" alt="User" className="size-10 rounded-circle img-fluid" />
                                    <div>
                                        <a href="#!" className="text-reset d-block fw-medium">Logan Davis</a>
                                        <a href="#!" className="link link-custom-primary fs-sm">logan@gotpos.com</a>
                                    </div>
                                </div>
                            </td>
                            <td>3</td>
                            <td>
                                <p className="fw-medium">$140.00</p>
                                <p className="text-muted fs-sm">PayPal</p>
                            </td>
                            <td><span className="badge bg-success-subtle text-success border border-success-subtle">Paid</span></td>
                            <td>5</td>
                            <td><span className="badge bg-warning-subtle text-warning border border-warning-subtle">Pending</span></td>
                            <td>
                                <div className="d-flex gap-2">
                                    <button type="button" className="btn btn-sub-primary size-8 btn-icon"><i className="ri-eye-line"></i></button>
                                    <button type="button" className="btn btn-sub-secondary size-8 btn-icon edit-btn"><i className="ri-edit-line"></i></button>
                                    <button type="button" className="btn btn-sub-danger size-8 btn-icon delete-btn" data-bs-toggle="modal" data-bs-target="#deleteModal"><i className="ri-delete-bin-line"></i></button>
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
    </div>

    {/* Add/Edit Order Modal */}
    <div className="modal fade" id="addOrderModal" tabindex="-1" aria-hidden="true">
        <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content">
                <div className="modal-header">
                    <h6 className="modal-title">Add New Order</h6>
                    <button type="button" className="btn-close" data-bs-dismiss="modal"></button>
                </div>
                <div className="modal-body">
                    <form>
                        <div className="row g-4">
                            <div className="col-md-6">
                                <label htmlFor="orderId" className="form-label">Order ID <span className="text-danger">*</span></label>
                                <input type="text" className="form-control" id="orderId" placeholder="#ORD1032" required />
                            </div>
                            <div className="col-md-6">
                                <label htmlFor="orderDate" className="form-label">Order Date <span className="text-danger">*</span></label>
                                <input type="text" className="form-control" id="orderDate" data-datepicker data-date-format="dd-MM-yyyy" placeholder="Choose Date" required />
                            </div>
                            <div className="col-md-6">
                                <label htmlFor="productName" className="form-label">Product <span className="text-danger">*</span></label>
                                <input type="text" className="form-control" id="productName" placeholder="Product Name" required />
                            </div>
                            <div className="col-md-6">
                                <label htmlFor="orderQuantity" className="form-label">Quantity <span className="text-danger">*</span></label>
                                <div className="input-spin-group input-spin-primary">
                                    <button type="button" className="input-spin-minus">
                                        <i data-lucide="minus" className="size-4"></i>
                                    </button>
                                    <input type="text" className="input-spin form-control" id="orderQuantity" readonly defaultValue="1" />
                                    <button type="button" className="input-spin-plus">
                                        <i data-lucide="plus" className="size-4"></i>
                                    </button>
                                </div>
                            </div>
                            <div className="col-md-6">
                                <label htmlFor="customerName" className="form-label">Customer Name <span className="text-danger">*</span></label>
                                <input type="text" className="form-control" id="customerName" placeholder="Emma White" required />
                            </div>
                            <div className="col-md-6">
                                <label htmlFor="paymentMethod" className="form-label">Payment Method <span className="text-danger">*</span></label>
                                <div id="AddpaymentMethod"></div>
                            </div>
                            <div className="col-md-6">
                                <label htmlFor="totalPrice" className="form-label">Total Price <span className="text-danger">*</span></label>
                                <input type="number" className="form-control" id="totalPrice" step="0.01" placeholder="120.50" required />
                            </div>
                            <div className="col-md-6">
                                <label htmlFor="orderStatus" className="form-label">Order Status</label>
                                <div id="addOrderStatus"></div>
                            </div>
                            <div className="col-12">
                                <label htmlFor="orderNotes" className="form-label">Order Notes</label>
                                <textarea className="form-control" id="orderNotes" rows="3" placeholder="Any special instructions..."></textarea>
                            </div>
                        </div>
                        <div className="d-flex gap-3 mt-4">
                            <button type="button" className="btn btn-light w-50" data-bs-dismiss="modal">Cancel</button>
                            <button type="submit" className="btn btn-primary w-50">Save Order</button>
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
                <h5 className="mb-4 lh-base">Are you sure you want to delete this Order?</h5>
                <div className="d-flex justify-content-center align-items-center gap-2">
                    <button type="button" className="btn btn-danger" data-bs-dismiss="modal">Delete</button>
                    <button type="button" className="btn btn-link text-reset" data-bs-dismiss="modal">Cancel</button>
                </div>
            </div>
        </div>
    </div>

    
</div>
    </>
  );
}
