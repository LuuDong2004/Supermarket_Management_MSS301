// pages/Dashboard/Customers/CustomerListPage.jsx
import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import PageBreadcrumb from '../../../components/ui/PageBreadcrumb';
import { ROUTES } from '../../../configs/routes';

export default function CustomerListPage() {
  useEffect(() => {
    if (window.lucide) {
      window.lucide.createIcons();
    }
  }, []);

  return (
    <>
      <div className="container-fluid">

    <div className="gap-2 page-heading mb-3 flex-column flex-md-row">
        <h6 className="flex-grow-1 mb-0">Customers List</h6>
        <ul className="breadcrumb flex-shrink-0 mb-0">
            <li className="breadcrumb-item"><a href="#!">Customers</a></li>
            <li className="breadcrumb-item active">Customers List</li>
        </ul>
    </div>
    <div className="row row-cols-1 row-cols-md-2 row-cols-lg-3 row-cols-xxl-5">
        <div className="col">
            <div className="card p-4">
                <div className="d-flex justify-content-between gap-2 align-items-center mb-8">
                    <div className="d-flex align-items-center gap-3">
                        <div className="size-10 avatar bg-primary text-white rounded-circle">
                            <div data-lucide="users" className="size-5"></div>
                        </div>
                        <h6 className="fs-16 mb-0 fw-medium">Total Customers</h6>
                    </div>
                    <div className="dropdown">
                        <a href="#!" className="link link-custom-primary" data-bs-toggle="dropdown"><i className="ri-more-2-fill fs-lg"></i></a>
                        <ul className="dropdown-menu dropdown-menu-end">
                            <li><a href="#!" className="dropdown-item d-flex gap-3 align-items-center"><i className="ri-eye-line"></i> View</a></li>
                            <li><a href="#!" className="dropdown-item d-flex gap-3 align-items-center"><i className="ri-pencil-line"></i> Edit</a></li>
                            <li><a href="#!" className="dropdown-item d-flex gap-3 align-items-center text-danger"><i className="ri-delete-bin-5-line"></i> Delete</a></li>
                        </ul>
                    </div>
                </div>
                <div className="d-flex align-items-center gap-5">
                    <h4 className="mb-0 font-base">3,482</h4>
                    <p className="mb-0">
                        <span className="text-success fw-medium"><i data-lucide="arrow-big-up-dash" className="size-4 me-1"></i>4.2%</span>
                        <span className="text-muted ms-1">vs last month</span>
                    </p>
                </div>
            </div>
        </div>
        <div className="col">
            <div className="card p-4">
                <div className="d-flex justify-content-between gap-2 align-items-center mb-8">
                    <div className="d-flex align-items-center gap-3">
                        <div className="size-10 avatar bg-success text-white rounded-circle">
                            <div data-lucide="user-check" className="size-5"></div>
                        </div>
                        <h6 className="fs-16 mb-0 fw-medium">Active Customers</h6>
                    </div>
                    <div className="dropdown">
                        <a href="#!" className="link link-custom-primary" data-bs-toggle="dropdown"><i className="ri-more-2-fill fs-lg"></i></a>
                        <ul className="dropdown-menu dropdown-menu-end">
                            <li><a href="#!" className="dropdown-item d-flex gap-3 align-items-center"><i className="ri-eye-line"></i> View</a></li>
                            <li><a href="#!" className="dropdown-item d-flex gap-3 align-items-center"><i className="ri-pencil-line"></i> Edit</a></li>
                            <li><a href="#!" className="dropdown-item d-flex gap-3 align-items-center text-danger"><i className="ri-delete-bin-5-line"></i> Delete</a></li>
                        </ul>
                    </div>
                </div>
                <div className="d-flex align-items-center gap-5">
                    <h4 className="mb-0 font-base">2,916</h4>
                    <p className="mb-0">
                        <span className="text-success fw-medium"><i data-lucide="arrow-big-up-dash" className="size-4 me-1"></i>83.7%</span>
                        <span className="text-muted ms-1">engagement</span>
                    </p>
                </div>
            </div>
        </div>
        <div className="col">
            <div className="card p-4">
                <div className="d-flex justify-content-between gap-2 align-items-center mb-8">
                    <div className="d-flex align-items-center gap-3">
                        <div className="size-10 avatar bg-info text-white rounded-circle">
                            <div data-lucide="crown" className="size-5"></div>
                        </div>
                        <h6 className="fs-16 mb-0 fw-medium">VIP Customers</h6>
                    </div>
                    <div className="dropdown">
                        <a href="#!" className="link link-custom-primary" data-bs-toggle="dropdown"><i className="ri-more-2-fill fs-lg"></i></a>
                        <ul className="dropdown-menu dropdown-menu-end">
                            <li><a href="#!" className="dropdown-item d-flex gap-3 align-items-center"><i className="ri-eye-line"></i> View</a></li>
                            <li><a href="#!" className="dropdown-item d-flex gap-3 align-items-center"><i className="ri-pencil-line"></i> Edit</a></li>
                            <li><a href="#!" className="dropdown-item d-flex gap-3 align-items-center text-danger"><i className="ri-delete-bin-5-line"></i> Delete</a></li>
                        </ul>
                    </div>
                </div>
                <div className="d-flex align-items-center gap-5">
                    <h4 className="mb-0 font-base">428</h4>
                    <p className="mb-0">
                        <span className="text-success fw-medium"><i data-lucide="arrow-big-up-dash" className="size-4 me-1"></i>72.6%</span>
                        <span className="text-muted ms-1">high value</span>
                    </p>
                </div>
            </div>
        </div>
        <div className="col">
            <div className="card p-4">
                <div className="d-flex justify-content-between gap-2 align-items-center mb-8">
                    <div className="d-flex align-items-center gap-3">
                        <div className="size-10 avatar bg-warning text-white rounded-circle">
                            <div data-lucide="user-plus" className="size-5"></div>
                        </div>
                        <h6 className="fs-16 mb-0 fw-medium">New Customers</h6>
                    </div>
                    <div className="dropdown">
                        <a href="#!" className="link link-custom-primary" data-bs-toggle="dropdown"><i className="ri-more-2-fill fs-lg"></i></a>
                        <ul className="dropdown-menu dropdown-menu-end">
                            <li><a href="#!" className="dropdown-item d-flex gap-3 align-items-center"><i className="ri-eye-line"></i> View</a></li>
                            <li><a href="#!" className="dropdown-item d-flex gap-3 align-items-center"><i className="ri-pencil-line"></i> Edit</a></li>
                            <li><a href="#!" className="dropdown-item d-flex gap-3 align-items-center text-danger"><i className="ri-delete-bin-5-line"></i> Delete</a></li>
                        </ul>
                    </div>
                </div>
                <div className="d-flex align-items-center gap-5">
                    <h4 className="mb-0 font-base">312</h4>
                    <p className="mb-0">
                        <span className="text-success fw-medium"><i data-lucide="arrow-big-up-dash" className="size-4 me-1"></i>6.1%</span>
                        <span className="text-muted ms-1">this month</span>
                    </p>
                </div>
            </div>
        </div>
        <div className="col">
            <div className="card p-4">
                <div className="d-flex justify-content-between gap-2 align-items-center mb-8">
                    <div className="d-flex align-items-center gap-3">
                        <div className="size-10 avatar bg-danger text-white rounded-circle">
                            <div data-lucide="user-x" className="size-5"></div>
                        </div>
                        <h6 className="fs-16 mb-0 fw-medium">Inactive Customers</h6>
                    </div>
                    <div className="dropdown">
                        <a href="#!" className="link link-custom-primary" data-bs-toggle="dropdown"><i className="ri-more-2-fill fs-lg"></i></a>
                        <ul className="dropdown-menu dropdown-menu-end">
                            <li><a href="#!" className="dropdown-item d-flex gap-3 align-items-center"><i className="ri-eye-line"></i> View</a></li>
                            <li><a href="#!" className="dropdown-item d-flex gap-3 align-items-center"><i className="ri-pencil-line"></i> Edit</a></li>
                            <li><a href="#!" className="dropdown-item d-flex gap-3 align-items-center text-danger"><i className="ri-delete-bin-5-line"></i> Delete</a></li>
                        </ul>
                    </div>
                </div>
                <div className="d-flex align-items-center gap-5">
                    <h4 className="mb-0 font-base">566</h4>
                    <p className="mb-0">
                        <span className="text-danger fw-medium"><i data-lucide="arrow-big-down-dash" className="size-4 me-1"></i>16.3%</span>
                        <span className="text-muted ms-1">need follow-up</span>
                    </p>
                </div>
            </div>
        </div>
    </div>
    <div className="card">
        <div className="card-header d-flex flex-wrap gap-4 align-items-center gap-2 justify-content-between">
            <div>
                <h5 className="card-title mb-1">Customers List</h5>
                <p className="text-muted">total customers: <span className="text-body fw-medium">3,482</span></p>
            </div>
            <div className="d-flex flex-wrap gap-2 align-items-center">
                <div className="position-relative">
                    <input type="text" id="lostItemSearch" className="form-control ps-10" placeholder="Search Customer..." />
                    <i data-lucide="search" className="size-4 icon-dark position-absolute top-50 start-0 ms-4 translate-middle-y"></i>
                </div>
                <div className="dropdown">
                    <button type="button" className="btn btn-outline-light border" data-bs-toggle="dropdown" aria-expanded="false"><i className="ri-edit-line me-1"></i>Customize</button>
                    <div className="dropdown-menu dropdown-menu-end w-44 p-4">
                        <div className="form-check check-primary mb-2">
                            <input className="form-check-input column-toggle" type="checkbox" id="colCustomerID" data-column="1" />
                            <label className="form-check-label" htmlFor="colCustomerID">Customer ID</label>
                        </div>
                        <div className="form-check check-primary mb-2">
                            <input className="form-check-input column-toggle" type="checkbox" id="colCustomer" data-column="2" defaultChecked />
                            <label className="form-check-label" htmlFor="colCustomer">Customer</label>
                        </div>
                        <div className="form-check check-primary mb-2">
                            <input className="form-check-input column-toggle" type="checkbox" id="colPhone" data-column="3" />
                            <label className="form-check-label" htmlFor="colPhone">Phone</label>
                        </div>
                        <div className="form-check check-primary mb-2">
                            <input className="form-check-input column-toggle" type="checkbox" id="colCity" data-column="4" />
                            <label className="form-check-label" htmlFor="colCity">City</label>
                        </div>
                        <div className="form-check check-primary mb-2">
                            <input className="form-check-input column-toggle" type="checkbox" id="colOrders" data-column="5" />
                            <label className="form-check-label" htmlFor="colOrders">Orders</label>
                        </div>
                        <div className="form-check check-primary mb-2">
                            <input className="form-check-input column-toggle" type="checkbox" id="colTotalSpend" data-column="6" defaultChecked />
                            <label className="form-check-label" htmlFor="colTotalSpend">Total Spend</label>
                        </div>
                        <div className="form-check check-primary mb-2">
                            <input className="form-check-input column-toggle" type="checkbox" id="colCustomerType" data-column="7" />
                            <label className="form-check-label" htmlFor="colCustomerType">Customer Type</label>
                        </div>
                        <div className="form-check check-primary mb-2">
                            <input className="form-check-input column-toggle" type="checkbox" id="colLastOrder" data-column="8" defaultChecked />
                            <label className="form-check-label" htmlFor="colLastOrder">Last Order</label>
                        </div>
                        <div className="form-check check-primary mb-2">
                            <input className="form-check-input column-toggle" type="checkbox" id="colStatus" data-column="9" />
                            <label className="form-check-label" htmlFor="colStatus">Status</label>
                        </div>
                        <div className="form-check check-primary mb-2">
                            <input className="form-check-input column-toggle" type="checkbox" id="colActions" data-column="10" />
                            <label className="form-check-label" htmlFor="colActions">Actions</label>
                        </div>
                    </div>
                </div>
                <a href="apps-customers-add.html" className="btn btn-primary"><i data-lucide="plus" className="size-4 me-1"></i>Add Customer</a>
            </div>
        </div>
        <div className="card-body pt-0">
            <div className="table-card table-responsive">
                <table className="table table-borderless text-nowrap align-middle mb-0">
                    <thead>
                        <tr className="bg-light border-bottom">
                            <th>
                                <div className="form-check check-primary">
                                    <input className="form-check-input" type="checkbox" id="checAllCustomers" />
                                </div>
                            </th>
                            <th className="fw-medium text-muted">Customer ID</th>
                            <th className="fw-medium text-muted">Customer</th>
                            <th className="fw-medium text-muted">Phone</th>
                            <th className="fw-medium text-muted">City</th>
                            <th className="fw-medium text-muted">Orders</th>
                            <th className="fw-medium text-muted">Total Spend</th>
                            <th className="fw-medium text-muted">Customer Type</th>
                            <th className="fw-medium text-muted">Last Order</th>
                            <th className="fw-medium text-muted">Status</th>
                            <th className="fw-medium text-muted">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td>
                                <div className="form-check check-primary">
                                    <input className="form-check-input" type="checkbox" />
                                </div>
                            </td>
                            <td><a href="#!" className="link link-custom-primary fw-medium">#CUS1024</a></td>
                            <td>
                                <div className="d-flex align-items-center gap-2">
                                    <img src="/assets/user-10-CzpspsdB.png" className="size-9 rounded img-fluid" alt="User" />
                                    <div>
                                        <a href="#!" className="text-reset fw-medium d-block">Emma White</a>
                                        <a href="mailto:emma@gotpos.com" className="link link-custom-primary fs-14">emma@gotpos.com</a>
                                    </div>
                                </div>
                            </td>
                            <td>+1 987 654 3210</td>
                            <td>New York</td>
                            <td>18</td>
                            <td className="fw-medium">$1,240.50</td>
                            <td><span className="text-body-secondary border py-1 lh-base fw-medium px-3 rounded d-inline-flex align-items-center gap-2 fs-13"><span className="size-1-5 d-block bg-info rounded-circle"></span>VIP</span></td>
                            <td>Dec 19, 2025</td>
                            <td><span className="badge bg-success-subtle text-success border border-success-subtle">Active</span></td>
                            <td>
                                <div className="d-flex gap-2">
                                    <button className="btn btn-sub-primary size-8 btn-icon"><i className="ri-eye-line"></i></button>
                                    <button className="btn btn-sub-secondary size-8 btn-icon"><i className="ri-edit-line"></i></button>
                                    <button className="btn btn-sub-danger size-8 btn-icon" data-bs-toggle="modal" data-bs-target="#deleteModal"><i className="ri-delete-bin-line"></i></button>
                                </div>
                            </td>
                        </tr>
                        <tr>
                            <td>
                                <div className="form-check check-primary"><input className="form-check-input" type="checkbox" /></div>
                            </td>
                            <td><a href="#!" className="link link-custom-primary fw-medium">#CUS1025</a></td>
                            <td>
                                <div className="d-flex align-items-center gap-2">
                                    <img src="/assets/user-2-CroG7YJ0.png" className="size-9 rounded img-fluid" alt="User" />
                                    <div>
                                        <a href="#!" className="text-reset fw-medium d-block">John Miller</a>
                                        <a href="mailto:john@gotpos.com" className="link link-custom-primary fs-14">john@gotpos.com</a>
                                    </div>
                                </div>
                            </td>
                            <td>+1 456 789 2210</td>
                            <td>Chicago</td>
                            <td>12</td>
                            <td className="fw-medium">$860.00</td>
                            <td><span className="text-body-secondary border py-1 px-3 rounded fs-13 d-inline-flex align-items-center gap-2"><span className="size-1-5 bg-primary rounded-circle"></span>Regular</span></td>
                            <td>Dec 15, 2025</td>
                            <td><span className="badge bg-success-subtle text-success border border-success-subtle">Active</span></td>
                            <td>
                                <div className="d-flex gap-2">
                                    <button className="btn btn-sub-primary size-8 btn-icon"><i className="ri-eye-line"></i></button>
                                    <button className="btn btn-sub-secondary size-8 btn-icon"><i className="ri-edit-line"></i></button>
                                    <button className="btn btn-sub-danger size-8 btn-icon" data-bs-toggle="modal" data-bs-target="#deleteModal"><i className="ri-delete-bin-line"></i></button>
                                </div>
                            </td>
                        </tr>
                        <tr>
                            <td>
                                <div className="form-check check-primary"><input className="form-check-input" type="checkbox" /></div>
                            </td>
                            <td><a href="#!" className="link link-custom-primary fw-medium">#CUS1026</a></td>
                            <td>
                                <div className="d-flex align-items-center gap-2">
                                    <img src="/assets/user-3-Bz6g7hsE.png" className="size-9 rounded img-fluid" alt="User" />
                                    <div>
                                        <a href="#!" className="text-reset fw-medium d-block">Sophia Brown</a>
                                        <a href="mailto:sophia@gotpos.com" className="link link-custom-primary fs-14">sophia@gotpos.com</a>
                                    </div>
                                </div>
                            </td>
                            <td>+1 321 778 6654</td>
                            <td>Los Angeles</td>
                            <td>26</td>
                            <td className="fw-medium">$2,450.75</td>
                            <td><span className="text-body-secondary border py-1 px-3 rounded fs-13 d-inline-flex align-items-center gap-2"><span className="size-1-5 bg-info rounded-circle"></span>VIP</span></td>
                            <td>Dec 20, 2025</td>
                            <td><span className="badge bg-success-subtle text-success border border-success-subtle">Active</span></td>
                            <td>
                                <div className="d-flex gap-2">
                                    <button className="btn btn-sub-primary size-8 btn-icon"><i className="ri-eye-line"></i></button>
                                    <button className="btn btn-sub-secondary size-8 btn-icon"><i className="ri-edit-line"></i></button>
                                    <button className="btn btn-sub-danger size-8 btn-icon" data-bs-toggle="modal" data-bs-target="#deleteModal"><i className="ri-delete-bin-line"></i></button>
                                </div>
                            </td>
                        </tr>
                        <tr>
                            <td>
                                <div className="form-check check-primary"><input className="form-check-input" type="checkbox" /></div>
                            </td>
                            <td><a href="#!" className="link link-custom-primary fw-medium">#CUS1027</a></td>
                            <td>
                                <div className="d-flex align-items-center gap-2">
                                    <img src="/assets/user-4-7l52E1Lo.png" className="size-9 rounded img-fluid" alt="User" />
                                    <div>
                                        <a href="#!" className="text-reset fw-medium d-block">Daniel Lee</a>
                                        <a href="mailto:daniel@gotpos.com" className="link link-custom-primary fs-14">daniel@gotpos.com</a>
                                    </div>
                                </div>
                            </td>
                            <td>+1 908 554 1102</td>
                            <td>Seattle</td>
                            <td>6</td>
                            <td className="fw-medium">$310.40</td>
                            <td><span className="text-body-secondary border py-1 px-3 rounded fs-13 d-inline-flex align-items-center gap-2"><span className="size-1-5 bg-secondary rounded-circle"></span>New</span></td>
                            <td>Dec 10, 2025</td>
                            <td><span className="badge bg-danger-subtle text-danger border border-danger-subtle">Inactive</span></td>
                            <td>
                                <div className="d-flex gap-2">
                                    <button className="btn btn-sub-primary size-8 btn-icon"><i className="ri-eye-line"></i></button>
                                    <button className="btn btn-sub-secondary size-8 btn-icon"><i className="ri-edit-line"></i></button>
                                    <button className="btn btn-sub-danger size-8 btn-icon" data-bs-toggle="modal" data-bs-target="#deleteModal"><i className="ri-delete-bin-line"></i></button>
                                </div>
                            </td>
                        </tr>
                        <tr>
                            <td>
                                <div className="form-check check-primary"><input className="form-check-input" type="checkbox" /></div>
                            </td>
                            <td><a href="#!" className="link link-custom-primary fw-medium">#CUS1025</a></td>
                            <td>
                                <div className="d-flex align-items-center gap-2">
                                    <img src="/assets/user-11-bzS6tHsV.png" className="size-9 rounded img-fluid" alt="User" />
                                    <div>
                                        <a href="#!" className="text-reset fw-medium d-block">John Carter</a>
                                        <a href="mailto:john@gotpos.com" className="link link-custom-primary fs-14">john@gotpos.com</a>
                                    </div>
                                </div>
                            </td>
                            <td>+1 456 789 3210</td>
                            <td>Chicago</td>
                            <td>12</td>
                            <td className="fw-medium">$980.00</td>
                            <td><span className="text-body-secondary border py-1 lh-base fw-medium px-3 rounded d-inline-flex align-items-center gap-2 fs-13"><span className="size-1-5 d-block bg-primary rounded-circle"></span>Regular</span></td>
                            <td>Dec 17, 2025</td>
                            <td><span className="badge bg-success-subtle text-success border border-success-subtle">Active</span></td>
                            <td>
                                <div className="d-flex gap-2">
                                    <button className="btn btn-sub-primary size-8 btn-icon"><i className="ri-eye-line"></i></button>
                                    <button className="btn btn-sub-secondary size-8 btn-icon"><i className="ri-edit-line"></i></button>
                                    <button className="btn btn-sub-danger size-8 btn-icon" data-bs-toggle="modal" data-bs-target="#deleteModal"><i className="ri-delete-bin-line"></i></button>
                                </div>
                            </td>
                        </tr>
                        <tr>
                            <td>
                                <div className="form-check check-primary"><input className="form-check-input" type="checkbox" /></div>
                            </td>
                            <td><a href="#!" className="link link-custom-primary fw-medium">#CUS1026</a></td>
                            <td>
                                <div className="d-flex align-items-center gap-2">
                                    <img src="/assets/user-12-CfsiEgBV.png" className="size-9 rounded img-fluid" alt="User" />
                                    <div>
                                        <a href="#!" className="text-reset fw-medium d-block">Sophia Lee</a>
                                        <a href="mailto:sophia@gotpos.com" className="link link-custom-primary fs-14">sophia@gotpos.com</a>
                                    </div>
                                </div>
                            </td>
                            <td>+44 789 456 1230</td>
                            <td>London</td>
                            <td>25</td>
                            <td className="fw-medium">$2,430.75</td>
                            <td><span className="text-body-secondary border py-1 lh-base fw-medium px-3 rounded d-inline-flex align-items-center gap-2 fs-13"><span className="size-1-5 d-block bg-info rounded-circle"></span>VIP</span></td>
                            <td>Dec 18, 2025</td>
                            <td><span className="badge bg-success-subtle text-success border border-success-subtle">Active</span></td>
                            <td>
                                <div className="d-flex gap-2">
                                    <button className="btn btn-sub-primary size-8 btn-icon"><i className="ri-eye-line"></i></button>
                                    <button className="btn btn-sub-secondary size-8 btn-icon"><i className="ri-edit-line"></i></button>
                                    <button className="btn btn-sub-danger size-8 btn-icon" data-bs-toggle="modal" data-bs-target="#deleteModal"><i className="ri-delete-bin-line"></i></button>
                                </div>
                            </td>
                        </tr>
                        <tr>
                            <td>
                                <div className="form-check check-primary"><input className="form-check-input" type="checkbox" /></div>
                            </td>
                            <td><a href="#!" className="link link-custom-primary fw-medium">#CUS1027</a></td>
                            <td>
                                <div className="d-flex align-items-center gap-2">
                                    <img src="/assets/user-13-NgroKY8u.png" className="size-9 rounded img-fluid" alt="User" />
                                    <div>
                                        <a href="#!" className="text-reset fw-medium d-block">Michael Brown</a>
                                        <a href="mailto:michael@gotpos.com" className="link link-custom-primary fs-14">michael@gotpos.com</a>
                                    </div>
                                </div>
                            </td>
                            <td>+91 98765 43210</td>
                            <td>Mumbai</td>
                            <td>9</td>
                            <td className="fw-medium">$540.20</td>
                            <td><span className="text-body-secondary border py-1 lh-base fw-medium px-3 rounded d-inline-flex align-items-center gap-2 fs-13"><span className="size-1-5 d-block bg-warning rounded-circle"></span>New</span></td>
                            <td>Dec 15, 2025</td>
                            <td><span className="badge bg-danger-subtle text-danger border border-danger-subtle">Inactive</span></td>
                            <td>
                                <div className="d-flex gap-2">
                                    <button className="btn btn-sub-primary size-8 btn-icon"><i className="ri-eye-line"></i></button>
                                    <button className="btn btn-sub-secondary size-8 btn-icon"><i className="ri-edit-line"></i></button>
                                    <button className="btn btn-sub-danger size-8 btn-icon" data-bs-toggle="modal" data-bs-target="#deleteModal"><i className="ri-delete-bin-line"></i></button>
                                </div>
                            </td>
                        </tr>
                        <tr>
                            <td>
                                <div className="form-check check-primary"><input className="form-check-input" type="checkbox" /></div>
                            </td>
                            <td><a href="#!" className="link link-custom-primary fw-medium">#CUS1028</a></td>
                            <td>
                                <div className="d-flex align-items-center gap-2">
                                    <img src="/assets/user-14-BWimhkHc.png" className="size-9 rounded img-fluid" alt="User" />
                                    <div>
                                        <a href="#!" className="text-reset fw-medium d-block">Emily Davis</a>
                                        <a href="mailto:emily@gotpos.com" className="link link-custom-primary fs-14">emily@gotpos.com</a>
                                    </div>
                                </div>
                            </td>
                            <td>+61 412 345 678</td>
                            <td>Sydney</td>
                            <td>31</td>
                            <td className="fw-medium">$3,120.00</td>
                            <td><span className="text-body-secondary border py-1 lh-base fw-medium px-3 rounded d-inline-flex align-items-center gap-2 fs-13"><span className="size-1-5 d-block bg-info rounded-circle"></span>VIP</span></td>
                            <td>Dec 20, 2025</td>
                            <td><span className="badge bg-success-subtle text-success border border-success-subtle">Active</span></td>
                            <td>
                                <div className="d-flex gap-2">
                                    <button className="btn btn-sub-primary size-8 btn-icon"><i className="ri-eye-line"></i></button>
                                    <button className="btn btn-sub-secondary size-8 btn-icon"><i className="ri-edit-line"></i></button>
                                    <button className="btn btn-sub-danger size-8 btn-icon" data-bs-toggle="modal" data-bs-target="#deleteModal"><i className="ri-delete-bin-line"></i></button>
                                </div>
                            </td>
                        </tr>
                        <tr>
                            <td>
                                <div className="form-check check-primary"><input className="form-check-input" type="checkbox" /></div>
                            </td>
                            <td><a href="#!" className="link link-custom-primary fw-medium">#CUS1025</a></td>
                            <td>
                                <div className="d-flex align-items-center gap-2">
                                    <img src="/assets/user-17-Y_OiPHJx.png" className="size-9 rounded img-fluid" alt="User" />
                                    <div>
                                        <a href="#!" className="text-reset fw-medium d-block">John Carter</a>
                                        <a href="mailto:john@gotpos.com" className="link link-custom-primary fs-14">john@gotpos.com</a>
                                    </div>
                                </div>
                            </td>
                            <td>+1 555 210 3344</td>
                            <td>Chicago</td>
                            <td>12</td>
                            <td className="fw-medium">$860.00</td>
                            <td><span className="text-body-secondary border py-1 lh-base fw-medium px-3 rounded d-inline-flex align-items-center gap-2 fs-13"><span className="size-1-5 d-block bg-warning rounded-circle"></span>Regular</span></td>
                            <td>Dec 16, 2025</td>
                            <td><span className="badge bg-success-subtle text-success border border-success-subtle">Active</span></td>
                            <td>
                                <div className="d-flex gap-2">
                                    <button className="btn btn-sub-primary size-8 btn-icon"><i className="ri-eye-line"></i></button>
                                    <button className="btn btn-sub-secondary size-8 btn-icon"><i className="ri-edit-line"></i></button>
                                    <button className="btn btn-sub-danger size-8 btn-icon" data-bs-toggle="modal" data-bs-target="#deleteModal"><i className="ri-delete-bin-line"></i></button>
                                </div>
                            </td>
                        </tr>
                        <tr>
                            <td>
                                <div className="form-check check-primary"><input className="form-check-input" type="checkbox" /></div>
                            </td>
                            <td><a href="#!" className="link link-custom-primary fw-medium">#CUS1026</a></td>
                            <td>
                                <div className="d-flex align-items-center gap-2">
                                    <img src="/assets/user-18-C5ehJukC.png" className="size-9 rounded img-fluid" alt="User" />
                                    <div>
                                        <a href="#!" className="text-reset fw-medium d-block">Sophia Brown</a>
                                        <a href="mailto:sophia@gotpos.com" className="link link-custom-primary fs-14">sophia@gotpos.com</a>
                                    </div>
                                </div>
                            </td>
                            <td>+44 7700 900123</td>
                            <td>London</td>
                            <td>30</td>
                            <td className="fw-medium">$2,980.75</td>
                            <td><span className="text-body-secondary border py-1 lh-base fw-medium px-3 rounded d-inline-flex align-items-center gap-2 fs-13"><span className="size-1-5 d-block bg-info rounded-circle"></span>VIP</span></td>
                            <td>Dec 18, 2025</td>
                            <td><span className="badge bg-success-subtle text-success border border-success-subtle">Active</span></td>
                            <td>
                                <div className="d-flex gap-2">
                                    <button className="btn btn-sub-primary size-8 btn-icon"><i className="ri-eye-line"></i></button>
                                    <button className="btn btn-sub-secondary size-8 btn-icon"><i className="ri-edit-line"></i></button>
                                    <button className="btn btn-sub-danger size-8 btn-icon" data-bs-toggle="modal" data-bs-target="#deleteModal"><i className="ri-delete-bin-line"></i></button>
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

    {/* Delete Modal */}
    <div className="modal fade" id="deleteModal" tabindex="-1" aria-labelledby="deleteModalLabel" aria-hidden="true">
        <div className="modal-dialog modal-dialog-centered modal-xs">
            <div className="modal-content p-7 text-center">
                <div className="d-flex justify-content-center mb-4">
                    <div className="size-14 bg-danger-subtle rounded-circle d-flex align-items-center justify-content-center size-16">
                        <i className="ri-delete-bin-line text-danger fs-2xl"></i>
                    </div>
                </div>
                <h5 className="mb-4 lh-base">Are you sure you want to delete this Customer?</h5>
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
