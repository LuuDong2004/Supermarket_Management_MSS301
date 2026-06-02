// pages/Dashboard/Orders/InvoicesPage.jsx
import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import PageBreadcrumb from '../../../components/ui/PageBreadcrumb';
import { ROUTES } from '../../../configs/routes';

export default function InvoicesPage() {
  useEffect(() => {
    if (window.lucide) {
      window.lucide.createIcons();
    }
  }, []);

  return (
    <>
      <div className="container-fluid">

    <div className="gap-2 page-heading mb-3 flex-column flex-md-row">
        <h6 className="flex-grow-1 mb-0">Invoices</h6>
        <ul className="breadcrumb flex-shrink-0 mb-0">
            <li className="breadcrumb-item"><a href="#!">Orders</a></li>
            <li className="breadcrumb-item active">Invoices</li>
        </ul>
    </div>
    <div className="card mb-4">
        <div className="card-body">
            <div className="d-flex align-items-center justify-content-between mb-4">
                <h5 className="card-title mb-4">Invoices</h5>
                <button type="button" className="btn btn-primary" data-bs-toggle="modal" data-bs-target="#addInvoiceRefundModal"><i data-lucide="plus" className="size-4 me-1"></i>Add Invoice</button>
            </div>
            <div className="d-flex flex-wrap gap-2 justify-content-between align-items-center mb-6">
                <span className="text-muted">Total invoice value: <span className="text-body fw-semibold">$42,0002.21</span> | 634 Invoices</span>
                <span className="text-muted">Total estimated project value: <span className="text-body fw-semibold">$42,0002.21</span></span>
            </div>
            <div className="d-flex gap-1 mb-3">
                <div className="progress progress-3 flex-shrink-0 paid-progress" role="progressbar" aria-label="Example with label" aria-valuenow="66.66" aria-valuemin="0" aria-valuemax="100">
                    <div className="progress-bar bg-success" style={{"width":"100%"}}></div>
                </div>
                <div className="progress progress-3 flex-shrink-0 due-progress" role="progressbar" aria-label="Example with label" aria-valuenow="66.66" aria-valuemin="0" aria-valuemax="100">
                    <div className="progress-bar bg-warning" style={{"width":"100%"}}></div>
                </div>
                <div className="progress progress-3 flex-shrink-0 unpaid-progress" role="progressbar" aria-label="Example with label" aria-valuenow="66.66" aria-valuemin="0" aria-valuemax="100">
                    <div className="progress-bar bg-danger" style={{"width":"100%"}}></div>
                </div>
            </div>
            <div className="d-flex flex-wrap gap-4 gap-lg-6">
                <div className="d-flex align-items-center gap-2">
                    <span className="d-block size-2 rounded bg-success">&nbsp;</span>
                    <span className="text-muted">Paid: <span className="fw-semibold text-body">543 Invoices,</span> $284,738.40</span>
                </div>
                <div className="d-flex align-items-center gap-2">
                    <span className="d-block size-2 rounded bg-warning">&nbsp;</span>
                    <span className="text-muted">Due: <span className="fw-semibold text-body">22 Invoices,</span> $28,473.84</span>
                </div>
                <div className="d-flex align-items-center gap-2">
                    <span className="d-block size-2 rounded bg-danger">&nbsp;</span>
                    <span className="text-muted">Overdue: <span className="fw-semibold text-body">76 Invoices,</span> $28,473.84</span>
                </div>
            </div>
        </div>
    </div>
    <div className="card">
        <div className="card-header">
            <div className="d-flex align-items-center justify-content-between mb-4">
                <h5 className="card-title mb-0">Invoices</h5>
                <div className="dropdown">
                    <button type="button" className="btn btn-outline-light border" data-bs-toggle="dropdown" aria-expanded="false"><i data-lucide="arrow-down-to-line" className="size-4 me-1"></i>Export As</button>
                    <ul className="dropdown-menu dropdown-menu-end">
                        <li><a className="dropdown-item" href="#!" id="exportPrint">Print PDF</a></li>
                        <li><a className="dropdown-item" href="#!" id="exportJSON">Export CSV</a></li>
                        <li><a className="dropdown-item" href="#!" id="exportXML">Export XML</a></li>
                    </ul>
                </div>
            </div>
            <div className="d-flex flex-wrap gap-4 justify-content-between align-items-center">
                <div className="d-flex flex-wrap gap-2">
                    <div className="position-relative">
                        <input type="text" id="lostItemSearch" className="form-control ps-9" placeholder="Search for Invoices..." />
                        <i data-lucide="search" className="size-4 icon-dark position-absolute top-50 start-0 ms-3 translate-middle-y"></i>
                    </div>
                    <div className="dropdown">
                        <button type="button" className="btn btn-outline-light border dropdown-toggle" data-bs-toggle="dropdown" aria-expanded="false">Sort by</button>
                        <ul className="dropdown-menu dropdown-menu-end">
                            <li><a className="dropdown-item" href="#!">Oldest</a></li>
                            <li><a className="dropdown-item" href="#!">Newest</a></li>
                            <li><a className="dropdown-item" href="#!">Low to High</a></li>
                            <li><a className="dropdown-item" href="#!">High to Low</a></li>
                            <li><a className="dropdown-item" href="#!">Status</a></li>
                        </ul>
                    </div>
                    <button type="button" className="btn btn-outline-light border btn-icon"><i className="ri-equalizer-2-line"></i></button>
                </div>
                <div className="d-flex flex-wrap align-items-center gap-4 gap-lg-6">
                    <div className="d-flex align-items-center gap-1">
                        <i className="ri-time-line text-muted"></i>
                        <span className="text-muted">Payment Term <span className="fw-medium text-body ms-1">45 days</span></span>
                    </div>
                    <div className="d-flex align-items-center gap-1">
                        <i className="ri-file-text-line text-muted"></i>
                        <span className="text-muted">Account Receivable <span className="fw-medium text-body ms-1">7-CO-1 - Customers - Electronics Store</span></span>
                    </div>
                    <div className="d-flex align-items-center gap-1">
                        <i className="ri-user-3-line text-muted"></i>
                        <span className="text-muted">Salesman <span className="fw-medium text-body ms-1">Sarah Johnson</span></span>
                    </div>
                </div>
            </div>
        </div>
        <div className="card-body pt-0">
            <div className="table-card table-responsive">
                <table className="table text-nowrap align-middle mb-0">
                    <thead>
                        <tr className="bg-light border-bottom">
                            <th>
                                <div className="form-check check-primary">
                                    <input className="form-check-input" type="checkbox" id="checkAllInvoices" />
                                </div>
                            </th>
                            <th className="fw-medium text-muted">Invoice ID</th>
                            <th className="fw-medium text-muted">Order ID</th>
                            <th className="fw-medium text-muted">Invoice Date</th>
                            <th className="fw-medium text-muted">Due Date</th>
                            <th className="fw-medium text-muted">Customer</th>
                            <th className="fw-medium text-muted">Payment Status</th>
                            <th className="fw-medium text-muted">Amount</th>
                            <th className="fw-medium text-muted">Discount</th>
                            <th className="fw-medium text-muted">Tax</th>
                            <th className="fw-medium text-muted">Created By</th>
                            <th className="fw-medium text-muted">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td>
                                <div className="form-check check-primary"><input className="form-check-input" type="checkbox" /></div>
                            </td>
                            <td>
                                <img src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAEAAAABACAMAAACdt4HsAAAAAXNSR0IB2cksfwAAAAlwSFlzAAALEwAACxMBAJqcGAAAAtBQTFRFAAAA4uLi4uLi4uLi4uLi39/f0NDQu7u7t7e3t7e3t7e3t7e34+Pj4uLi4uLi4uLi4uLi39/f0tLSvLy8t7e3t7e3t7e3t7e3t7e34uLi4uLi4uLi1dXVubm5t7e3t7e3t7e3tbW14+Pj4uLi4ODgxcXFt7e3t7e34+Pj4uLizMzM4+Pjzs7Ot7e3t7e3t7e3t7e30tLSt7e3t7e33Nzcvr6+t7e319fXuLi4t7e339/f2NjYxsbGurq6t7e3vkAwvkAwvUAwxFtO4d7d4eHhvLy8vkAwvkAwvkAwvkAwvkAwvkEx2r+81dXVvkAwvkAwvkAwvkEx2ry44eHhvkAwvkAw4uLivkAwwEExzEY151I+x0Qz8VZC51I+ykU0v0Ew8VZC7lVB5lE+30483U073U486H1w7IyA642A6pSJ57Os49fW8VhE7nNj5cfD7Xpr49rZ8FxI57St6aCW8l1K82hX82lX8mBN8VdD8mZU8mRR8VdE8mdV8VpH6pyS+beu/vDu/vDv/eXi95iM8VpG9Hts/evp/evo+bWs8l5L8VlF+sa//u7s96KX/NXQ//79/ejm/eTg/eTh/vb1/vf29YV29pGE/////vHw/vHv+bOq8lxJ//38/efk/N/b9pKF//f29Hlp96SZ//39+Kyj+K6k9Hdn/enm8mJP829e8ltI9HRj//v6+Kuh8l9M/ebj821c96Sa//z8/eHe/NPO9YR1//7+/vTy/vLx/vPx9pWJ9Hxs82ta//j39YN18mhW/ezq8mRS/N7a+r22+r63/NzY+8jB8VhF+sjB/ero829d9YZ4//r6+9bR82tZ/NfT8VZC82dV825d9Hpq9YBx9HZm825e8VZC8VZC8VZC8VZC8FZC8VZC8VZC7nRl8lVB8VZC8VZC8VZC8VVC8VdE7IR357Ot49jW4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLiUYXpzAAAAPB0Uk5TAAEWJSYmJSYmIQ8BBnXe8fLx8vLy7diLH2T1//////5GAQG0///kTQTG/wX/40fOHf/8e///uv//y//////MCBQWG8v/zAtoyeDi4fbMmvr//fzMXPXMobWzs/+z///////////+/v///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////67///////+O/jfiAVjg/wEgaJWdnun//8j7hOOLDhkDfGCOdgAAAp1JREFUeJzt109o01AcB/Dfdx2urptduxlbdI4Npq0DxSFDKLKbRw8i/kPQo+Bp3r14EI/Dg6AgA0/qGAgqDtSDHuacdBYF2+J0G06pA2Ura+c2XH0vS5ukJHmvycEd/EGT177k0+Y1v9/LA3kMbD4ALGwO5T3sVXAEmuwBVeCRcwKitqdrBGG5EdO2QBd+O5xPW7HCtn6s6kIVEEPeCaDgElUJVUDPujMQ2ug2CO4Ag+AS0AW3AAXx3htAIaRcAMrPSrMNSRdAFD8q7ciEC4B2rfu+a82dr90A1IFZvtseAF6ZgH41CYCMAChHPBN/ZgCOakkIvJMEiHof6UB/UEtC4I00cHhEB05gjWoGEg904NQKeQNOl6uAW+DMskfgbLlSugXOsT9x0RNQX7kPBDUVD20AyW9lVX/EE8ALybA3IIT73gBqvWcPtGkDyeauCP6wZj2+8Y/r1N4t+Mp3u+/YAx0cKNUBU9TNs6PUAKRpHwrqUQF8EAH7tfkXb6kPbBZDQzHwJZcoBsAnpGa8FAJhrFKWMc8ZsK1I2d58EKOJor+F16ngZE4MBJ4Q9Sm/xhigsHpxDJ8X5hLFhcK8Pog1AfE9KuDfkaTmj1IAv4QjefUSDEBn6iBhfE4C0Aaxc9gMdLOPM9GnEkDMN06lcGxiygzs9YFelHISwAGMajeSCahxENXYAM5jLDHkFujhw7HYgls1ABeBm1rvpdlGtlWAG9R+fCY8JABSg+puALeXtN72k2pePU5z5sJdw6OhZTamcZ0kw7oeZHFNFrCuSJ+ANanf0HR50LIm0nSlKl91OB24gkOVdyagHOIHDD3+A5sWEC04hIBgyWOKZMQCECy6jDEJxQpwWvaZgqVPqxVAXTNywDxCZAnUGv8e+AvrcRZQoeKKBQAAAABJRU5ErkJggg==" alt="pdf" className="size-6 me-1" />
                                <a href="#!" className="link link-custom-primary fw-medium">INV-1001</a>
                            </td>
                            <td><a href="#!" className="link link-custom-primary fw-medium">#ORD1032</a></td>
                            <td>Dec 21, 2025</td>
                            <td>Dec 28, 2025</td>
                            <td>
                                <div className="d-flex gap-2 align-items-center">
                                    <img src="/assets/user-1-xhBXJtq9.png" className="size-8 rounded img-fluid" alt="Avatar" />
                                    <span className="fw-medium">Emma White</span>
                                </div>
                            </td>
                            <td><span className="badge bg-success-subtle text-success border border-success-subtle">Paid</span></td>
                            <td>$120.50 <small className="text-muted">/ Card</small></td>
                            <td>$0.00</td>
                            <td>$10.00</td>
                            <td>Admin</td>
                            <td>
                                <div className="dropdown">
                                    <a href="#!" className="link link-custom-primary" data-bs-toggle="dropdown"><i className="ri-more-2-fill"></i></a>
                                    <ul className="dropdown-menu dropdown-menu-end">
                                        <li><a href="#!" className="dropdown-item d-flex gap-3 align-items-center" data-bs-toggle="modal" data-bs-target="#invoicePreviewModal"><i className="ri-eye-line"></i> View</a></li>
                                        <li><a href="#!" className="dropdown-item d-flex gap-3 align-items-center"><i className="ri-printer-line"></i> Print</a></li>
                                        <li><a href="#!" className="dropdown-item d-flex gap-3 align-items-center text-danger" data-bs-toggle="modal" data-bs-target="#deleteModal"><i className="ri-delete-bin-5-line"></i> Delete</a></li>
                                    </ul>
                                </div>
                            </td>
                        </tr>
                        <tr>
                            <td>
                                <div className="form-check check-primary"><input className="form-check-input" type="checkbox" /></div>
                            </td>
                            <td>
                                <img src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAEAAAABACAMAAACdt4HsAAAAAXNSR0IB2cksfwAAAAlwSFlzAAALEwAACxMBAJqcGAAAAtBQTFRFAAAA4uLi4uLi4uLi4uLi39/f0NDQu7u7t7e3t7e3t7e3t7e34+Pj4uLi4uLi4uLi4uLi39/f0tLSvLy8t7e3t7e3t7e3t7e3t7e34uLi4uLi4uLi1dXVubm5t7e3t7e3t7e3tbW14+Pj4uLi4ODgxcXFt7e3t7e34+Pj4uLizMzM4+Pjzs7Ot7e3t7e3t7e3t7e30tLSt7e3t7e33Nzcvr6+t7e319fXuLi4t7e339/f2NjYxsbGurq6t7e3vkAwvkAwvUAwxFtO4d7d4eHhvLy8vkAwvkAwvkAwvkAwvkAwvkEx2r+81dXVvkAwvkAwvkAwvkEx2ry44eHhvkAwvkAw4uLivkAwwEExzEY151I+x0Qz8VZC51I+ykU0v0Ew8VZC7lVB5lE+30483U073U486H1w7IyA642A6pSJ57Os49fW8VhE7nNj5cfD7Xpr49rZ8FxI57St6aCW8l1K82hX82lX8mBN8VdD8mZU8mRR8VdE8mdV8VpH6pyS+beu/vDu/vDv/eXi95iM8VpG9Hts/evp/evo+bWs8l5L8VlF+sa//u7s96KX/NXQ//79/ejm/eTg/eTh/vb1/vf29YV29pGE/////vHw/vHv+bOq8lxJ//38/efk/N/b9pKF//f29Hlp96SZ//39+Kyj+K6k9Hdn/enm8mJP829e8ltI9HRj//v6+Kuh8l9M/ebj821c96Sa//z8/eHe/NPO9YR1//7+/vTy/vLx/vPx9pWJ9Hxs82ta//j39YN18mhW/ezq8mRS/N7a+r22+r63/NzY+8jB8VhF+sjB/ero829d9YZ4//r6+9bR82tZ/NfT8VZC82dV825d9Hpq9YBx9HZm825e8VZC8VZC8VZC8VZC8FZC8VZC8VZC7nRl8lVB8VZC8VZC8VZC8VVC8VdE7IR357Ot49jW4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLiUYXpzAAAAPB0Uk5TAAEWJSYmJSYmIQ8BBnXe8fLx8vLy7diLH2T1//////5GAQG0///kTQTG/wX/40fOHf/8e///uv//y//////MCBQWG8v/zAtoyeDi4fbMmvr//fzMXPXMobWzs/+z///////////+/v///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////67///////+O/jfiAVjg/wEgaJWdnun//8j7hOOLDhkDfGCOdgAAAp1JREFUeJzt109o01AcB/Dfdx2urptduxlbdI4Npq0DxSFDKLKbRw8i/kPQo+Bp3r14EI/Dg6AgA0/qGAgqDtSDHuacdBYF2+J0G06pA2Ura+c2XH0vS5ukJHmvycEd/EGT177k0+Y1v9/LA3kMbD4ALGwO5T3sVXAEmuwBVeCRcwKitqdrBGG5EdO2QBd+O5xPW7HCtn6s6kIVEEPeCaDgElUJVUDPujMQ2ug2CO4Ag+AS0AW3AAXx3htAIaRcAMrPSrMNSRdAFD8q7ciEC4B2rfu+a82dr90A1IFZvtseAF6ZgH41CYCMAChHPBN/ZgCOakkIvJMEiHof6UB/UEtC4I00cHhEB05gjWoGEg904NQKeQNOl6uAW+DMskfgbLlSugXOsT9x0RNQX7kPBDUVD20AyW9lVX/EE8ALybA3IIT73gBqvWcPtGkDyeauCP6wZj2+8Y/r1N4t+Mp3u+/YAx0cKNUBU9TNs6PUAKRpHwrqUQF8EAH7tfkXb6kPbBZDQzHwJZcoBsAnpGa8FAJhrFKWMc8ZsK1I2d58EKOJor+F16ngZE4MBJ4Q9Sm/xhigsHpxDJ8X5hLFhcK8Pog1AfE9KuDfkaTmj1IAv4QjefUSDEBn6iBhfE4C0Aaxc9gMdLOPM9GnEkDMN06lcGxiygzs9YFelHISwAGMajeSCahxENXYAM5jLDHkFujhw7HYgls1ABeBm1rvpdlGtlWAG9R+fCY8JABSg+puALeXtN72k2pePU5z5sJdw6OhZTamcZ0kw7oeZHFNFrCuSJ+ANanf0HR50LIm0nSlKl91OB24gkOVdyagHOIHDD3+A5sWEC04hIBgyWOKZMQCECy6jDEJxQpwWvaZgqVPqxVAXTNywDxCZAnUGv8e+AvrcRZQoeKKBQAAAABJRU5ErkJggg==" alt="pdf" className="size-6 me-1" />
                                <a href="#!" className="link link-custom-primary fw-medium">INV-1002</a>
                            </td>
                            <td><a href="#!" className="link link-custom-primary fw-medium">#ORD1033</a></td>
                            <td>Dec 20, 2025</td>
                            <td>Dec 27, 2025</td>
                            <td>
                                <div className="d-flex gap-2 align-items-center">
                                    <img src="/assets/user-2-CroG7YJ0.png" className="size-8 rounded img-fluid" alt="Avatar" />
                                    <span className="fw-medium">John Carter</span>
                                </div>
                            </td>
                            <td><span className="badge bg-warning-subtle text-warning border border-warning-subtle">Overdue</span></td>
                            <td>$75.00 <small className="text-muted">/ Cash</small></td>
                            <td>$5.00</td>
                            <td>$7.50</td>
                            <td>Admin</td>
                            <td>
                                <div className="dropdown">
                                    <a href="#!" className="link link-custom-primary" data-bs-toggle="dropdown"><i className="ri-more-2-fill"></i></a>
                                    <ul className="dropdown-menu dropdown-menu-end">
                                        <li><a href="#!" className="dropdown-item d-flex gap-3 align-items-center" data-bs-toggle="modal" data-bs-target="#invoicePreviewModal"><i className="ri-eye-line"></i> View</a></li>
                                        <li><a href="#!" className="dropdown-item d-flex gap-3 align-items-center"><i className="ri-printer-line"></i> Print</a></li>
                                        <li><a href="#!" className="dropdown-item d-flex gap-3 align-items-center text-danger" data-bs-toggle="modal" data-bs-target="#deleteModal"><i className="ri-delete-bin-5-line"></i> Delete</a></li>
                                    </ul>
                                </div>
                            </td>
                        </tr>
                        <tr>
                            <td>
                                <div className="form-check check-primary"><input className="form-check-input" type="checkbox" /></div>
                            </td>
                            <td>
                                <img src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAEAAAABACAMAAACdt4HsAAAAAXNSR0IB2cksfwAAAAlwSFlzAAALEwAACxMBAJqcGAAAAtBQTFRFAAAA4uLi4uLi4uLi4uLi39/f0NDQu7u7t7e3t7e3t7e3t7e34+Pj4uLi4uLi4uLi4uLi39/f0tLSvLy8t7e3t7e3t7e3t7e3t7e34uLi4uLi4uLi1dXVubm5t7e3t7e3t7e3tbW14+Pj4uLi4ODgxcXFt7e3t7e34+Pj4uLizMzM4+Pjzs7Ot7e3t7e3t7e3t7e30tLSt7e3t7e33Nzcvr6+t7e319fXuLi4t7e339/f2NjYxsbGurq6t7e3vkAwvkAwvUAwxFtO4d7d4eHhvLy8vkAwvkAwvkAwvkAwvkAwvkEx2r+81dXVvkAwvkAwvkAwvkEx2ry44eHhvkAwvkAw4uLivkAwwEExzEY151I+x0Qz8VZC51I+ykU0v0Ew8VZC7lVB5lE+30483U073U486H1w7IyA642A6pSJ57Os49fW8VhE7nNj5cfD7Xpr49rZ8FxI57St6aCW8l1K82hX82lX8mBN8VdD8mZU8mRR8VdE8mdV8VpH6pyS+beu/vDu/vDv/eXi95iM8VpG9Hts/evp/evo+bWs8l5L8VlF+sa//u7s96KX/NXQ//79/ejm/eTg/eTh/vb1/vf29YV29pGE/////vHw/vHv+bOq8lxJ//38/efk/N/b9pKF//f29Hlp96SZ//39+Kyj+K6k9Hdn/enm8mJP829e8ltI9HRj//v6+Kuh8l9M/ebj821c96Sa//z8/eHe/NPO9YR1//7+/vTy/vLx/vPx9pWJ9Hxs82ta//j39YN18mhW/ezq8mRS/N7a+r22+r63/NzY+8jB8VhF+sjB/ero829d9YZ4//r6+9bR82tZ/NfT8VZC82dV825d9Hpq9YBx9HZm825e8VZC8VZC8VZC8VZC8FZC8VZC8VZC7nRl8lVB8VZC8VZC8VZC8VVC8VdE7IR357Ot49jW4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLiUYXpzAAAAPB0Uk5TAAEWJSYmJSYmIQ8BBnXe8fLx8vLy7diLH2T1//////5GAQG0///kTQTG/wX/40fOHf/8e///uv//y//////MCBQWG8v/zAtoyeDi4fbMmvr//fzMXPXMobWzs/+z///////////+/v///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////67///////+O/jfiAVjg/wEgaJWdnun//8j7hOOLDhkDfGCOdgAAAp1JREFUeJzt109o01AcB/Dfdx2urptduxlbdI4Npq0DxSFDKLKbRw8i/kPQo+Bp3r14EI/Dg6AgA0/qGAgqDtSDHuacdBYF2+J0G06pA2Ura+c2XH0vS5ukJHmvycEd/EGT177k0+Y1v9/LA3kMbD4ALGwO5T3sVXAEmuwBVeCRcwKitqdrBGG5EdO2QBd+O5xPW7HCtn6s6kIVEEPeCaDgElUJVUDPujMQ2ug2CO4Ag+AS0AW3AAXx3htAIaRcAMrPSrMNSRdAFD8q7ciEC4B2rfu+a82dr90A1IFZvtseAF6ZgH41CYCMAChHPBN/ZgCOakkIvJMEiHof6UB/UEtC4I00cHhEB05gjWoGEg904NQKeQNOl6uAW+DMskfgbLlSugXOsT9x0RNQX7kPBDUVD20AyW9lVX/EE8ALybA3IIT73gBqvWcPtGkDyeauCP6wZj2+8Y/r1N4t+Mp3u+/YAx0cKNUBU9TNs6PUAKRpHwrqUQF8EAH7tfkXb6kPbBZDQzHwJZcoBsAnpGa8FAJhrFKWMc8ZsK1I2d58EKOJor+F16ngZE4MBJ4Q9Sm/xhigsHpxDJ8X5hLFhcK8Pog1AfE9KuDfkaTmj1IAv4QjefUSDEBn6iBhfE4C0Aaxc9gMdLOPM9GnEkDMN06lcGxiygzs9YFelHISwAGMajeSCahxENXYAM5jLDHkFujhw7HYgls1ABeBm1rvpdlGtlWAG9R+fCY8JABSg+puALeXtN72k2pePU5z5sJdw6OhZTamcZ0kw7oeZHFNFrCuSJ+ANanf0HR50LIm0nSlKl91OB24gkOVdyagHOIHDD3+A5sWEC04hIBgyWOKZMQCECy6jDEJxQpwWvaZgqVPqxVAXTNywDxCZAnUGv8e+AvrcRZQoeKKBQAAAABJRU5ErkJggg==" alt="pdf" className="size-6 me-1" />
                                <a href="#!" className="link link-custom-primary fw-medium">INV-1003</a>
                            </td>
                            <td><a href="#!" className="link link-custom-primary fw-medium">#ORD1034</a></td>
                            <td>Dec 19, 2025</td>
                            <td>Dec 26, 2025</td>
                            <td>
                                <div className="d-flex gap-2 align-items-center">
                                    <img src="/assets/user-3-Bz6g7hsE.png" className="size-8 rounded img-fluid" alt="Avatar" />
                                    <span className="fw-medium">Ava Brown</span>
                                </div>
                            </td>
                            <td><span className="badge bg-danger-subtle text-danger border border-danger-subtle">Unpaid</span></td>
                            <td>$50.00 <small className="text-muted">/ UPI</small></td>
                            <td>$0.00</td>
                            <td>$5.00</td>
                            <td>Admin</td>
                            <td>
                                <div className="dropdown">
                                    <a href="#!" className="link link-custom-primary" data-bs-toggle="dropdown"><i className="ri-more-2-fill"></i></a>
                                    <ul className="dropdown-menu dropdown-menu-end">
                                        <li><a href="#!" className="dropdown-item d-flex gap-3 align-items-center" data-bs-toggle="modal" data-bs-target="#invoicePreviewModal"><i className="ri-eye-line"></i> View</a></li>
                                        <li><a href="#!" className="dropdown-item d-flex gap-3 align-items-center"><i className="ri-printer-line"></i> Print</a></li>
                                        <li><a href="#!" className="dropdown-item d-flex gap-3 align-items-center text-danger" data-bs-toggle="modal" data-bs-target="#deleteModal"><i className="ri-delete-bin-5-line"></i> Delete</a></li>
                                    </ul>
                                </div>
                            </td>
                        </tr>
                        <tr>
                            <td>
                                <div className="form-check check-primary"><input className="form-check-input" type="checkbox" /></div>
                            </td>
                            <td>
                                <img src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAEAAAABACAMAAACdt4HsAAAAAXNSR0IB2cksfwAAAAlwSFlzAAALEwAACxMBAJqcGAAAAtBQTFRFAAAA4uLi4uLi4uLi4uLi39/f0NDQu7u7t7e3t7e3t7e3t7e34+Pj4uLi4uLi4uLi4uLi39/f0tLSvLy8t7e3t7e3t7e3t7e3t7e34uLi4uLi4uLi1dXVubm5t7e3t7e3t7e3tbW14+Pj4uLi4ODgxcXFt7e3t7e34+Pj4uLizMzM4+Pjzs7Ot7e3t7e3t7e3t7e30tLSt7e3t7e33Nzcvr6+t7e319fXuLi4t7e339/f2NjYxsbGurq6t7e3vkAwvkAwvUAwxFtO4d7d4eHhvLy8vkAwvkAwvkAwvkAwvkAwvkEx2r+81dXVvkAwvkAwvkAwvkEx2ry44eHhvkAwvkAw4uLivkAwwEExzEY151I+x0Qz8VZC51I+ykU0v0Ew8VZC7lVB5lE+30483U073U486H1w7IyA642A6pSJ57Os49fW8VhE7nNj5cfD7Xpr49rZ8FxI57St6aCW8l1K82hX82lX8mBN8VdD8mZU8mRR8VdE8mdV8VpH6pyS+beu/vDu/vDv/eXi95iM8VpG9Hts/evp/evo+bWs8l5L8VlF+sa//u7s96KX/NXQ//79/ejm/eTg/eTh/vb1/vf29YV29pGE/////vHw/vHv+bOq8lxJ//38/efk/N/b9pKF//f29Hlp96SZ//39+Kyj+K6k9Hdn/enm8mJP829e8ltI9HRj//v6+Kuh8l9M/ebj821c96Sa//z8/eHe/NPO9YR1//7+/vTy/vLx/vPx9pWJ9Hxs82ta//j39YN18mhW/ezq8mRS/N7a+r22+r63/NzY+8jB8VhF+sjB/ero829d9YZ4//r6+9bR82tZ/NfT8VZC82dV825d9Hpq9YBx9HZm825e8VZC8VZC8VZC8VZC8FZC8VZC8VZC7nRl8lVB8VZC8VZC8VZC8VVC8VdE7IR357Ot49jW4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLiUYXpzAAAAPB0Uk5TAAEWJSYmJSYmIQ8BBnXe8fLx8vLy7diLH2T1//////5GAQG0///kTQTG/wX/40fOHf/8e///uv//y//////MCBQWG8v/zAtoyeDi4fbMmvr//fzMXPXMobWzs/+z///////////+/v///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////67///////+O/jfiAVjg/wEgaJWdnun//8j7hOOLDhkDfGCOdgAAAp1JREFUeJzt109o01AcB/Dfdx2urptduxlbdI4Npq0DxSFDKLKbRw8i/kPQo+Bp3r14EI/Dg6AgA0/qGAgqDtSDHuacdBYF2+J0G06pA2Ura+c2XH0vS5ukJHmvycEd/EGT177k0+Y1v9/LA3kMbD4ALGwO5T3sVXAEmuwBVeCRcwKitqdrBGG5EdO2QBd+O5xPW7HCtn6s6kIVEEPeCaDgElUJVUDPujMQ2ug2CO4Ag+AS0AW3AAXx3htAIaRcAMrPSrMNSRdAFD8q7ciEC4B2rfu+a82dr90A1IFZvtseAF6ZgH41CYCMAChHPBN/ZgCOakkIvJMEiHof6UB/UEtC4I00cHhEB05gjWoGEg904NQKeQNOl6uAW+DMskfgbLlSugXOsT9x0RNQX7kPBDUVD20AyW9lVX/EE8ALybA3IIT73gBqvWcPtGkDyeauCP6wZj2+8Y/r1N4t+Mp3u+/YAx0cKNUBU9TNs6PUAKRpHwrqUQF8EAH7tfkXb6kPbBZDQzHwJZcoBsAnpGa8FAJhrFKWMc8ZsK1I2d58EKOJor+F16ngZE4MBJ4Q9Sm/xhigsHpxDJ8X5hLFhcK8Pog1AfE9KuDfkaTmj1IAv4QjefUSDEBn6iBhfE4C0Aaxc9gMdLOPM9GnEkDMN06lcGxiygzs9YFelHISwAGMajeSCahxENXYAM5jLDHkFujhw7HYgls1ABeBm1rvpdlGtlWAG9R+fCY8JABSg+puALeXtN72k2pePU5z5sJdw6OhZTamcZ0kw7oeZHFNFrCuSJ+ANanf0HR50LIm0nSlKl91OB24gkOVdyagHOIHDD3+A5sWEC04hIBgyWOKZMQCECy6jDEJxQpwWvaZgqVPqxVAXTNywDxCZAnUGv8e+AvrcRZQoeKKBQAAAABJRU5ErkJggg==" alt="pdf" className="size-6 me-1" />
                                <a href="#!" className="link link-custom-primary fw-medium">INV-1004</a>
                            </td>
                            <td><a href="#!" className="link link-custom-primary fw-medium">#ORD1035</a></td>
                            <td>Dec 18, 2025</td>
                            <td>Dec 25, 2025</td>
                            <td>
                                <div className="d-flex gap-2 align-items-center">
                                    <img src="/assets/user-4-7l52E1Lo.png" className="size-8 rounded img-fluid" alt="Avatar" />
                                    <span className="fw-medium">Liam Smith</span>
                                </div>
                            </td>
                            <td><span className="badge bg-success-subtle text-success border border-success-subtle">Paid</span></td>
                            <td>$200.00 <small className="text-muted">/ Card</small></td>
                            <td>$10.00</td>
                            <td>$15.00</td>
                            <td>Admin</td>
                            <td>
                                <div className="dropdown">
                                    <a href="#!" className="link link-custom-primary" data-bs-toggle="dropdown"><i className="ri-more-2-fill"></i></a>
                                    <ul className="dropdown-menu dropdown-menu-end">
                                        <li><a href="#!" className="dropdown-item d-flex gap-3 align-items-center" data-bs-toggle="modal" data-bs-target="#invoicePreviewModal"><i className="ri-eye-line"></i> View</a></li>
                                        <li><a href="#!" className="dropdown-item d-flex gap-3 align-items-center"><i className="ri-printer-line"></i> Print</a></li>
                                        <li><a href="#!" className="dropdown-item d-flex gap-3 align-items-center text-danger" data-bs-toggle="modal" data-bs-target="#deleteModal"><i className="ri-delete-bin-5-line"></i> Delete</a></li>
                                    </ul>
                                </div>
                            </td>
                        </tr>
                        <tr>
                            <td>
                                <div className="form-check check-primary"><input className="form-check-input" type="checkbox" /></div>
                            </td>
                            <td>
                                <img src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAEAAAABACAMAAACdt4HsAAAAAXNSR0IB2cksfwAAAAlwSFlzAAALEwAACxMBAJqcGAAAAtBQTFRFAAAA4uLi4uLi4uLi4uLi39/f0NDQu7u7t7e3t7e3t7e3t7e34+Pj4uLi4uLi4uLi4uLi39/f0tLSvLy8t7e3t7e3t7e3t7e3t7e34uLi4uLi4uLi1dXVubm5t7e3t7e3t7e3tbW14+Pj4uLi4ODgxcXFt7e3t7e34+Pj4uLizMzM4+Pjzs7Ot7e3t7e3t7e3t7e30tLSt7e3t7e33Nzcvr6+t7e319fXuLi4t7e339/f2NjYxsbGurq6t7e3vkAwvkAwvUAwxFtO4d7d4eHhvLy8vkAwvkAwvkAwvkAwvkAwvkEx2r+81dXVvkAwvkAwvkAwvkEx2ry44eHhvkAwvkAw4uLivkAwwEExzEY151I+x0Qz8VZC51I+ykU0v0Ew8VZC7lVB5lE+30483U073U486H1w7IyA642A6pSJ57Os49fW8VhE7nNj5cfD7Xpr49rZ8FxI57St6aCW8l1K82hX82lX8mBN8VdD8mZU8mRR8VdE8mdV8VpH6pyS+beu/vDu/vDv/eXi95iM8VpG9Hts/evp/evo+bWs8l5L8VlF+sa//u7s96KX/NXQ//79/ejm/eTg/eTh/vb1/vf29YV29pGE/////vHw/vHv+bOq8lxJ//38/efk/N/b9pKF//f29Hlp96SZ//39+Kyj+K6k9Hdn/enm8mJP829e8ltI9HRj//v6+Kuh8l9M/ebj821c96Sa//z8/eHe/NPO9YR1//7+/vTy/vLx/vPx9pWJ9Hxs82ta//j39YN18mhW/ezq8mRS/N7a+r22+r63/NzY+8jB8VhF+sjB/ero829d9YZ4//r6+9bR82tZ/NfT8VZC82dV825d9Hpq9YBx9HZm825e8VZC8VZC8VZC8VZC8FZC8VZC8VZC7nRl8lVB8VZC8VZC8VZC8VVC8VdE7IR357Ot49jW4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLiUYXpzAAAAPB0Uk5TAAEWJSYmJSYmIQ8BBnXe8fLx8vLy7diLH2T1//////5GAQG0///kTQTG/wX/40fOHf/8e///uv//y//////MCBQWG8v/zAtoyeDi4fbMmvr//fzMXPXMobWzs/+z///////////+/v///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////67///////+O/jfiAVjg/wEgaJWdnun//8j7hOOLDhkDfGCOdgAAAp1JREFUeJzt109o01AcB/Dfdx2urptduxlbdI4Npq0DxSFDKLKbRw8i/kPQo+Bp3r14EI/Dg6AgA0/qGAgqDtSDHuacdBYF2+J0G06pA2Ura+c2XH0vS5ukJHmvycEd/EGT177k0+Y1v9/LA3kMbD4ALGwO5T3sVXAEmuwBVeCRcwKitqdrBGG5EdO2QBd+O5xPW7HCtn6s6kIVEEPeCaDgElUJVUDPujMQ2ug2CO4Ag+AS0AW3AAXx3htAIaRcAMrPSrMNSRdAFD8q7ciEC4B2rfu+a82dr90A1IFZvtseAF6ZgH41CYCMAChHPBN/ZgCOakkIvJMEiHof6UB/UEtC4I00cHhEB05gjWoGEg904NQKeQNOl6uAW+DMskfgbLlSugXOsT9x0RNQX7kPBDUVD20AyW9lVX/EE8ALybA3IIT73gBqvWcPtGkDyeauCP6wZj2+8Y/r1N4t+Mp3u+/YAx0cKNUBU9TNs6PUAKRpHwrqUQF8EAH7tfkXb6kPbBZDQzHwJZcoBsAnpGa8FAJhrFKWMc8ZsK1I2d58EKOJor+F16ngZE4MBJ4Q9Sm/xhigsHpxDJ8X5hLFhcK8Pog1AfE9KuDfkaTmj1IAv4QjefUSDEBn6iBhfE4C0Aaxc9gMdLOPM9GnEkDMN06lcGxiygzs9YFelHISwAGMajeSCahxENXYAM5jLDHkFujhw7HYgls1ABeBm1rvpdlGtlWAG9R+fCY8JABSg+puALeXtN72k2pePU5z5sJdw6OhZTamcZ0kw7oeZHFNFrCuSJ+ANanf0HR50LIm0nSlKl91OB24gkOVdyagHOIHDD3+A5sWEC04hIBgyWOKZMQCECy6jDEJxQpwWvaZgqVPqxVAXTNywDxCZAnUGv8e+AvrcRZQoeKKBQAAAABJRU5ErkJggg==" alt="pdf" className="size-6 me-1" />
                                <a href="#!" className="link link-custom-primary fw-medium">INV-1005</a>
                            </td>
                            <td><a href="#!" className="link link-custom-primary fw-medium">#ORD1036</a></td>
                            <td>Dec 17, 2025</td>
                            <td>Dec 24, 2025</td>
                            <td>
                                <div className="d-flex gap-2 align-items-center">
                                    <img src="/assets/user-5-BsT8d_Co.png" className="size-8 rounded img-fluid" alt="Avatar" />
                                    <span className="fw-medium">Sophia Lee</span>
                                </div>
                            </td>
                            <td><span className="badge bg-warning-subtle text-warning border border-warning-subtle">Overdue</span></td>
                            <td>$150.00 <small className="text-muted">/ Cash</small></td>
                            <td>$0.00</td>
                            <td>$12.00</td>
                            <td>Admin</td>
                            <td>
                                <div className="dropdown">
                                    <a href="#!" className="link link-custom-primary" data-bs-toggle="dropdown"><i className="ri-more-2-fill"></i></a>
                                    <ul className="dropdown-menu dropdown-menu-end">
                                        <li><a href="#!" className="dropdown-item d-flex gap-3 align-items-center" data-bs-toggle="modal" data-bs-target="#invoicePreviewModal"><i className="ri-eye-line"></i> View</a></li>
                                        <li><a href="#!" className="dropdown-item d-flex gap-3 align-items-center"><i className="ri-printer-line"></i> Print</a></li>
                                        <li><a href="#!" className="dropdown-item d-flex gap-3 align-items-center text-danger" data-bs-toggle="modal" data-bs-target="#deleteModal"><i className="ri-delete-bin-5-line"></i> Delete</a></li>
                                    </ul>
                                </div>
                            </td>
                        </tr>
                        <tr>
                            <td>
                                <div className="form-check check-primary"><input className="form-check-input" type="checkbox" /></div>
                            </td>
                            <td>
                                <img src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAEAAAABACAMAAACdt4HsAAAAAXNSR0IB2cksfwAAAAlwSFlzAAALEwAACxMBAJqcGAAAAtBQTFRFAAAA4uLi4uLi4uLi4uLi39/f0NDQu7u7t7e3t7e3t7e3t7e34+Pj4uLi4uLi4uLi4uLi39/f0tLSvLy8t7e3t7e3t7e3t7e3t7e34uLi4uLi4uLi1dXVubm5t7e3t7e3t7e3tbW14+Pj4uLi4ODgxcXFt7e3t7e34+Pj4uLizMzM4+Pjzs7Ot7e3t7e3t7e3t7e30tLSt7e3t7e33Nzcvr6+t7e319fXuLi4t7e339/f2NjYxsbGurq6t7e3vkAwvkAwvUAwxFtO4d7d4eHhvLy8vkAwvkAwvkAwvkAwvkAwvkEx2r+81dXVvkAwvkAwvkAwvkEx2ry44eHhvkAwvkAw4uLivkAwwEExzEY151I+x0Qz8VZC51I+ykU0v0Ew8VZC7lVB5lE+30483U073U486H1w7IyA642A6pSJ57Os49fW8VhE7nNj5cfD7Xpr49rZ8FxI57St6aCW8l1K82hX82lX8mBN8VdD8mZU8mRR8VdE8mdV8VpH6pyS+beu/vDu/vDv/eXi95iM8VpG9Hts/evp/evo+bWs8l5L8VlF+sa//u7s96KX/NXQ//79/ejm/eTg/eTh/vb1/vf29YV29pGE/////vHw/vHv+bOq8lxJ//38/efk/N/b9pKF//f29Hlp96SZ//39+Kyj+K6k9Hdn/enm8mJP829e8ltI9HRj//v6+Kuh8l9M/ebj821c96Sa//z8/eHe/NPO9YR1//7+/vTy/vLx/vPx9pWJ9Hxs82ta//j39YN18mhW/ezq8mRS/N7a+r22+r63/NzY+8jB8VhF+sjB/ero829d9YZ4//r6+9bR82tZ/NfT8VZC82dV825d9Hpq9YBx9HZm825e8VZC8VZC8VZC8VZC8FZC8VZC8VZC7nRl8lVB8VZC8VZC8VZC8VVC8VdE7IR357Ot49jW4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLiUYXpzAAAAPB0Uk5TAAEWJSYmJSYmIQ8BBnXe8fLx8vLy7diLH2T1//////5GAQG0///kTQTG/wX/40fOHf/8e///uv//y//////MCBQWG8v/zAtoyeDi4fbMmvr//fzMXPXMobWzs/+z///////////+/v///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////67///////+O/jfiAVjg/wEgaJWdnun//8j7hOOLDhkDfGCOdgAAAp1JREFUeJzt109o01AcB/Dfdx2urptduxlbdI4Npq0DxSFDKLKbRw8i/kPQo+Bp3r14EI/Dg6AgA0/qGAgqDtSDHuacdBYF2+J0G06pA2Ura+c2XH0vS5ukJHmvycEd/EGT177k0+Y1v9/LA3kMbD4ALGwO5T3sVXAEmuwBVeCRcwKitqdrBGG5EdO2QBd+O5xPW7HCtn6s6kIVEEPeCaDgElUJVUDPujMQ2ug2CO4Ag+AS0AW3AAXx3htAIaRcAMrPSrMNSRdAFD8q7ciEC4B2rfu+a82dr90A1IFZvtseAF6ZgH41CYCMAChHPBN/ZgCOakkIvJMEiHof6UB/UEtC4I00cHhEB05gjWoGEg904NQKeQNOl6uAW+DMskfgbLlSugXOsT9x0RNQX7kPBDUVD20AyW9lVX/EE8ALybA3IIT73gBqvWcPtGkDyeauCP6wZj2+8Y/r1N4t+Mp3u+/YAx0cKNUBU9TNs6PUAKRpHwrqUQF8EAH7tfkXb6kPbBZDQzHwJZcoBsAnpGa8FAJhrFKWMc8ZsK1I2d58EKOJor+F16ngZE4MBJ4Q9Sm/xhigsHpxDJ8X5hLFhcK8Pog1AfE9KuDfkaTmj1IAv4QjefUSDEBn6iBhfE4C0Aaxc9gMdLOPM9GnEkDMN06lcGxiygzs9YFelHISwAGMajeSCahxENXYAM5jLDHkFujhw7HYgls1ABeBm1rvpdlGtlWAG9R+fCY8JABSg+puALeXtN72k2pePU5z5sJdw6OhZTamcZ0kw7oeZHFNFrCuSJ+ANanf0HR50LIm0nSlKl91OB24gkOVdyagHOIHDD3+A5sWEC04hIBgyWOKZMQCECy6jDEJxQpwWvaZgqVPqxVAXTNywDxCZAnUGv8e+AvrcRZQoeKKBQAAAABJRU5ErkJggg==" alt="pdf" className="size-6 me-1" />
                                <a href="#!" className="link link-custom-primary fw-medium">INV-1006</a>
                            </td>
                            <td><a href="#!" className="link link-custom-primary fw-medium">#ORD1037</a></td>
                            <td>Dec 16, 2025</td>
                            <td>Dec 23, 2025</td>
                            <td>
                                <div className="d-flex gap-2 align-items-center">
                                    <img src="/assets/user-6-BIO7_TUU.png" className="size-8 rounded img-fluid" alt="Avatar" />
                                    <span className="fw-medium">Oliver Jones</span>
                                </div>
                            </td>
                            <td><span className="badge bg-success-subtle text-success border border-success-subtle">Paid</span></td>
                            <td>$180.00 <small className="text-muted">/ Card</small></td>
                            <td>$0.00</td>
                            <td>$15.00</td>
                            <td>Admin</td>
                            <td>
                                <div className="dropdown">
                                    <a href="#!" className="link link-custom-primary" data-bs-toggle="dropdown"><i className="ri-more-2-fill"></i></a>
                                    <ul className="dropdown-menu dropdown-menu-end">
                                        <li><a href="#!" className="dropdown-item d-flex gap-3 align-items-center" data-bs-toggle="modal" data-bs-target="#invoicePreviewModal"><i className="ri-eye-line"></i> View</a></li>
                                        <li><a href="#!" className="dropdown-item d-flex gap-3 align-items-center"><i className="ri-printer-line"></i> Print</a></li>
                                        <li><a href="#!" className="dropdown-item d-flex gap-3 align-items-center text-danger" data-bs-toggle="modal" data-bs-target="#deleteModal"><i className="ri-delete-bin-5-line"></i> Delete</a></li>
                                    </ul>
                                </div>
                            </td>
                        </tr>
                        <tr>
                            <td>
                                <div className="form-check check-primary"><input className="form-check-input" type="checkbox" /></div>
                            </td>
                            <td>
                                <img src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAEAAAABACAMAAACdt4HsAAAAAXNSR0IB2cksfwAAAAlwSFlzAAALEwAACxMBAJqcGAAAAtBQTFRFAAAA4uLi4uLi4uLi4uLi39/f0NDQu7u7t7e3t7e3t7e3t7e34+Pj4uLi4uLi4uLi4uLi39/f0tLSvLy8t7e3t7e3t7e3t7e3t7e34uLi4uLi4uLi1dXVubm5t7e3t7e3t7e3tbW14+Pj4uLi4ODgxcXFt7e3t7e34+Pj4uLizMzM4+Pjzs7Ot7e3t7e3t7e3t7e30tLSt7e3t7e33Nzcvr6+t7e319fXuLi4t7e339/f2NjYxsbGurq6t7e3vkAwvkAwvUAwxFtO4d7d4eHhvLy8vkAwvkAwvkAwvkAwvkAwvkEx2r+81dXVvkAwvkAwvkAwvkEx2ry44eHhvkAwvkAw4uLivkAwwEExzEY151I+x0Qz8VZC51I+ykU0v0Ew8VZC7lVB5lE+30483U073U486H1w7IyA642A6pSJ57Os49fW8VhE7nNj5cfD7Xpr49rZ8FxI57St6aCW8l1K82hX82lX8mBN8VdD8mZU8mRR8VdE8mdV8VpH6pyS+beu/vDu/vDv/eXi95iM8VpG9Hts/evp/evo+bWs8l5L8VlF+sa//u7s96KX/NXQ//79/ejm/eTg/eTh/vb1/vf29YV29pGE/////vHw/vHv+bOq8lxJ//38/efk/N/b9pKF//f29Hlp96SZ//39+Kyj+K6k9Hdn/enm8mJP829e8ltI9HRj//v6+Kuh8l9M/ebj821c96Sa//z8/eHe/NPO9YR1//7+/vTy/vLx/vPx9pWJ9Hxs82ta//j39YN18mhW/ezq8mRS/N7a+r22+r63/NzY+8jB8VhF+sjB/ero829d9YZ4//r6+9bR82tZ/NfT8VZC82dV825d9Hpq9YBx9HZm825e8VZC8VZC8VZC8VZC8FZC8VZC8VZC7nRl8lVB8VZC8VZC8VZC8VVC8VdE7IR357Ot49jW4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLiUYXpzAAAAPB0Uk5TAAEWJSYmJSYmIQ8BBnXe8fLx8vLy7diLH2T1//////5GAQG0///kTQTG/wX/40fOHf/8e///uv//y//////MCBQWG8v/zAtoyeDi4fbMmvr//fzMXPXMobWzs/+z///////////+/v///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////67///////+O/jfiAVjg/wEgaJWdnun//8j7hOOLDhkDfGCOdgAAAp1JREFUeJzt109o01AcB/Dfdx2urptduxlbdI4Npq0DxSFDKLKbRw8i/kPQo+Bp3r14EI/Dg6AgA0/qGAgqDtSDHuacdBYF2+J0G06pA2Ura+c2XH0vS5ukJHmvycEd/EGT177k0+Y1v9/LA3kMbD4ALGwO5T3sVXAEmuwBVeCRcwKitqdrBGG5EdO2QBd+O5xPW7HCtn6s6kIVEEPeCaDgElUJVUDPujMQ2ug2CO4Ag+AS0AW3AAXx3htAIaRcAMrPSrMNSRdAFD8q7ciEC4B2rfu+a82dr90A1IFZvtseAF6ZgH41CYCMAChHPBN/ZgCOakkIvJMEiHof6UB/UEtC4I00cHhEB05gjWoGEg904NQKeQNOl6uAW+DMskfgbLlSugXOsT9x0RNQX7kPBDUVD20AyW9lVX/EE8ALybA3IIT73gBqvWcPtGkDyeauCP6wZj2+8Y/r1N4t+Mp3u+/YAx0cKNUBU9TNs6PUAKRpHwrqUQF8EAH7tfkXb6kPbBZDQzHwJZcoBsAnpGa8FAJhrFKWMc8ZsK1I2d58EKOJor+F16ngZE4MBJ4Q9Sm/xhigsHpxDJ8X5hLFhcK8Pog1AfE9KuDfkaTmj1IAv4QjefUSDEBn6iBhfE4C0Aaxc9gMdLOPM9GnEkDMN06lcGxiygzs9YFelHISwAGMajeSCahxENXYAM5jLDHkFujhw7HYgls1ABeBm1rvpdlGtlWAG9R+fCY8JABSg+puALeXtN72k2pePU5z5sJdw6OhZTamcZ0kw7oeZHFNFrCuSJ+ANanf0HR50LIm0nSlKl91OB24gkOVdyagHOIHDD3+A5sWEC04hIBgyWOKZMQCECy6jDEJxQpwWvaZgqVPqxVAXTNywDxCZAnUGv8e+AvrcRZQoeKKBQAAAABJRU5ErkJggg==" alt="pdf" className="size-6 me-1" />
                                <a href="#!" className="link link-custom-primary fw-medium">INV-1007</a>
                            </td>
                            <td><a href="#!" className="link link-custom-primary fw-medium">#ORD1038</a></td>
                            <td>Dec 15, 2025</td>
                            <td>Dec 22, 2025</td>
                            <td>
                                <div className="d-flex gap-2 align-items-center">
                                    <img src="/assets/user-7-BMyy-xCq.png" className="size-8 rounded img-fluid" alt="Avatar" />
                                    <span className="fw-medium">Mia Wilson</span>
                                </div>
                            </td>
                            <td><span className="badge bg-warning-subtle text-warning border border-warning-subtle">Overdue</span></td>
                            <td>$95.00 <small className="text-muted">/ Cash</small></td>
                            <td>$0.00</td>
                            <td>$8.50</td>
                            <td>Admin</td>
                            <td>
                                <div className="dropdown">
                                    <a href="#!" className="link link-custom-primary" data-bs-toggle="dropdown"><i className="ri-more-2-fill"></i></a>
                                    <ul className="dropdown-menu dropdown-menu-end">
                                        <li><a href="#!" className="dropdown-item d-flex gap-3 align-items-center" data-bs-toggle="modal" data-bs-target="#invoicePreviewModal"><i className="ri-eye-line"></i> View</a></li>
                                        <li><a href="#!" className="dropdown-item d-flex gap-3 align-items-center"><i className="ri-printer-line"></i> Print</a></li>
                                        <li><a href="#!" className="dropdown-item d-flex gap-3 align-items-center text-danger" data-bs-toggle="modal" data-bs-target="#deleteModal"><i className="ri-delete-bin-5-line"></i> Delete</a></li>
                                    </ul>
                                </div>
                            </td>
                        </tr>
                        <tr>
                            <td>
                                <div className="form-check check-primary"><input className="form-check-input" type="checkbox" /></div>
                            </td>
                            <td>
                                <img src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAEAAAABACAMAAACdt4HsAAAAAXNSR0IB2cksfwAAAAlwSFlzAAALEwAACxMBAJqcGAAAAtBQTFRFAAAA4uLi4uLi4uLi4uLi39/f0NDQu7u7t7e3t7e3t7e3t7e34+Pj4uLi4uLi4uLi4uLi39/f0tLSvLy8t7e3t7e3t7e3t7e3t7e34uLi4uLi4uLi1dXVubm5t7e3t7e3t7e3tbW14+Pj4uLi4ODgxcXFt7e3t7e34+Pj4uLizMzM4+Pjzs7Ot7e3t7e3t7e3t7e30tLSt7e3t7e33Nzcvr6+t7e319fXuLi4t7e339/f2NjYxsbGurq6t7e3vkAwvkAwvUAwxFtO4d7d4eHhvLy8vkAwvkAwvkAwvkAwvkAwvkEx2r+81dXVvkAwvkAwvkAwvkEx2ry44eHhvkAwvkAw4uLivkAwwEExzEY151I+x0Qz8VZC51I+ykU0v0Ew8VZC7lVB5lE+30483U073U486H1w7IyA642A6pSJ57Os49fW8VhE7nNj5cfD7Xpr49rZ8FxI57St6aCW8l1K82hX82lX8mBN8VdD8mZU8mRR8VdE8mdV8VpH6pyS+beu/vDu/vDv/eXi95iM8VpG9Hts/evp/evo+bWs8l5L8VlF+sa//u7s96KX/NXQ//79/ejm/eTg/eTh/vb1/vf29YV29pGE/////vHw/vHv+bOq8lxJ//38/efk/N/b9pKF//f29Hlp96SZ//39+Kyj+K6k9Hdn/enm8mJP829e8ltI9HRj//v6+Kuh8l9M/ebj821c96Sa//z8/eHe/NPO9YR1//7+/vTy/vLx/vPx9pWJ9Hxs82ta//j39YN18mhW/ezq8mRS/N7a+r22+r63/NzY+8jB8VhF+sjB/ero829d9YZ4//r6+9bR82tZ/NfT8VZC82dV825d9Hpq9YBx9HZm825e8VZC8VZC8VZC8VZC8FZC8VZC8VZC7nRl8lVB8VZC8VZC8VZC8VVC8VdE7IR357Ot49jW4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLiUYXpzAAAAPB0Uk5TAAEWJSYmJSYmIQ8BBnXe8fLx8vLy7diLH2T1//////5GAQG0///kTQTG/wX/40fOHf/8e///uv//y//////MCBQWG8v/zAtoyeDi4fbMmvr//fzMXPXMobWzs/+z///////////+/v///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////67///////+O/jfiAVjg/wEgaJWdnun//8j7hOOLDhkDfGCOdgAAAp1JREFUeJzt109o01AcB/Dfdx2urptduxlbdI4Npq0DxSFDKLKbRw8i/kPQo+Bp3r14EI/Dg6AgA0/qGAgqDtSDHuacdBYF2+J0G06pA2Ura+c2XH0vS5ukJHmvycEd/EGT177k0+Y1v9/LA3kMbD4ALGwO5T3sVXAEmuwBVeCRcwKitqdrBGG5EdO2QBd+O5xPW7HCtn6s6kIVEEPeCaDgElUJVUDPujMQ2ug2CO4Ag+AS0AW3AAXx3htAIaRcAMrPSrMNSRdAFD8q7ciEC4B2rfu+a82dr90A1IFZvtseAF6ZgH41CYCMAChHPBN/ZgCOakkIvJMEiHof6UB/UEtC4I00cHhEB05gjWoGEg904NQKeQNOl6uAW+DMskfgbLlSugXOsT9x0RNQX7kPBDUVD20AyW9lVX/EE8ALybA3IIT73gBqvWcPtGkDyeauCP6wZj2+8Y/r1N4t+Mp3u+/YAx0cKNUBU9TNs6PUAKRpHwrqUQF8EAH7tfkXb6kPbBZDQzHwJZcoBsAnpGa8FAJhrFKWMc8ZsK1I2d58EKOJor+F16ngZE4MBJ4Q9Sm/xhigsHpxDJ8X5hLFhcK8Pog1AfE9KuDfkaTmj1IAv4QjefUSDEBn6iBhfE4C0Aaxc9gMdLOPM9GnEkDMN06lcGxiygzs9YFelHISwAGMajeSCahxENXYAM5jLDHkFujhw7HYgls1ABeBm1rvpdlGtlWAG9R+fCY8JABSg+puALeXtN72k2pePU5z5sJdw6OhZTamcZ0kw7oeZHFNFrCuSJ+ANanf0HR50LIm0nSlKl91OB24gkOVdyagHOIHDD3+A5sWEC04hIBgyWOKZMQCECy6jDEJxQpwWvaZgqVPqxVAXTNywDxCZAnUGv8e+AvrcRZQoeKKBQAAAABJRU5ErkJggg==" alt="pdf" className="size-6 me-1" />
                                <a href="#!" className="link link-custom-primary fw-medium">INV-1008</a>
                            </td>
                            <td><a href="#!" className="link link-custom-primary fw-medium">#ORD1039</a></td>
                            <td>Dec 14, 2025</td>
                            <td>Dec 21, 2025</td>
                            <td>
                                <div className="d-flex gap-2 align-items-center">
                                    <img src="/assets/user-8-BAGm131G.png" className="size-8 rounded img-fluid" alt="Avatar" />
                                    <span className="fw-medium">Noah Davis</span>
                                </div>
                            </td>
                            <td><span className="badge bg-danger-subtle text-danger border border-danger-subtle">Unpaid</span></td>
                            <td>$60.00 <small className="text-muted">/ UPI</small></td>
                            <td>$0.00</td>
                            <td>$6.00</td>
                            <td>Admin</td>
                            <td>
                                <div className="dropdown">
                                    <a href="#!" className="link link-custom-primary" data-bs-toggle="dropdown"><i className="ri-more-2-fill"></i></a>
                                    <ul className="dropdown-menu dropdown-menu-end">
                                        <li><a href="#!" className="dropdown-item d-flex gap-3 align-items-center" data-bs-toggle="modal" data-bs-target="#invoicePreviewModal"><i className="ri-eye-line"></i> View</a></li>
                                        <li><a href="#!" className="dropdown-item d-flex gap-3 align-items-center"><i className="ri-printer-line"></i> Print</a></li>
                                        <li><a href="#!" className="dropdown-item d-flex gap-3 align-items-center text-danger" data-bs-toggle="modal" data-bs-target="#deleteModal"><i className="ri-delete-bin-5-line"></i> Delete</a></li>
                                    </ul>
                                </div>
                            </td>
                        </tr>
                        <tr>
                            <td>
                                <div className="form-check check-primary"><input className="form-check-input" type="checkbox" /></div>
                            </td>
                            <td>
                                <img src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAEAAAABACAMAAACdt4HsAAAAAXNSR0IB2cksfwAAAAlwSFlzAAALEwAACxMBAJqcGAAAAtBQTFRFAAAA4uLi4uLi4uLi4uLi39/f0NDQu7u7t7e3t7e3t7e3t7e34+Pj4uLi4uLi4uLi4uLi39/f0tLSvLy8t7e3t7e3t7e3t7e3t7e34uLi4uLi4uLi1dXVubm5t7e3t7e3t7e3tbW14+Pj4uLi4ODgxcXFt7e3t7e34+Pj4uLizMzM4+Pjzs7Ot7e3t7e3t7e3t7e30tLSt7e3t7e33Nzcvr6+t7e319fXuLi4t7e339/f2NjYxsbGurq6t7e3vkAwvkAwvUAwxFtO4d7d4eHhvLy8vkAwvkAwvkAwvkAwvkAwvkEx2r+81dXVvkAwvkAwvkAwvkEx2ry44eHhvkAwvkAw4uLivkAwwEExzEY151I+x0Qz8VZC51I+ykU0v0Ew8VZC7lVB5lE+30483U073U486H1w7IyA642A6pSJ57Os49fW8VhE7nNj5cfD7Xpr49rZ8FxI57St6aCW8l1K82hX82lX8mBN8VdD8mZU8mRR8VdE8mdV8VpH6pyS+beu/vDu/vDv/eXi95iM8VpG9Hts/evp/evo+bWs8l5L8VlF+sa//u7s96KX/NXQ//79/ejm/eTg/eTh/vb1/vf29YV29pGE/////vHw/vHv+bOq8lxJ//38/efk/N/b9pKF//f29Hlp96SZ//39+Kyj+K6k9Hdn/enm8mJP829e8ltI9HRj//v6+Kuh8l9M/ebj821c96Sa//z8/eHe/NPO9YR1//7+/vTy/vLx/vPx9pWJ9Hxs82ta//j39YN18mhW/ezq8mRS/N7a+r22+r63/NzY+8jB8VhF+sjB/ero829d9YZ4//r6+9bR82tZ/NfT8VZC82dV825d9Hpq9YBx9HZm825e8VZC8VZC8VZC8VZC8FZC8VZC8VZC7nRl8lVB8VZC8VZC8VZC8VVC8VdE7IR357Ot49jW4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLiUYXpzAAAAPB0Uk5TAAEWJSYmJSYmIQ8BBnXe8fLx8vLy7diLH2T1//////5GAQG0///kTQTG/wX/40fOHf/8e///uv//y//////MCBQWG8v/zAtoyeDi4fbMmvr//fzMXPXMobWzs/+z///////////+/v///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////67///////+O/jfiAVjg/wEgaJWdnun//8j7hOOLDhkDfGCOdgAAAp1JREFUeJzt109o01AcB/Dfdx2urptduxlbdI4Npq0DxSFDKLKbRw8i/kPQo+Bp3r14EI/Dg6AgA0/qGAgqDtSDHuacdBYF2+J0G06pA2Ura+c2XH0vS5ukJHmvycEd/EGT177k0+Y1v9/LA3kMbD4ALGwO5T3sVXAEmuwBVeCRcwKitqdrBGG5EdO2QBd+O5xPW7HCtn6s6kIVEEPeCaDgElUJVUDPujMQ2ug2CO4Ag+AS0AW3AAXx3htAIaRcAMrPSrMNSRdAFD8q7ciEC4B2rfu+a82dr90A1IFZvtseAF6ZgH41CYCMAChHPBN/ZgCOakkIvJMEiHof6UB/UEtC4I00cHhEB05gjWoGEg904NQKeQNOl6uAW+DMskfgbLlSugXOsT9x0RNQX7kPBDUVD20AyW9lVX/EE8ALybA3IIT73gBqvWcPtGkDyeauCP6wZj2+8Y/r1N4t+Mp3u+/YAx0cKNUBU9TNs6PUAKRpHwrqUQF8EAH7tfkXb6kPbBZDQzHwJZcoBsAnpGa8FAJhrFKWMc8ZsK1I2d58EKOJor+F16ngZE4MBJ4Q9Sm/xhigsHpxDJ8X5hLFhcK8Pog1AfE9KuDfkaTmj1IAv4QjefUSDEBn6iBhfE4C0Aaxc9gMdLOPM9GnEkDMN06lcGxiygzs9YFelHISwAGMajeSCahxENXYAM5jLDHkFujhw7HYgls1ABeBm1rvpdlGtlWAG9R+fCY8JABSg+puALeXtN72k2pePU5z5sJdw6OhZTamcZ0kw7oeZHFNFrCuSJ+ANanf0HR50LIm0nSlKl91OB24gkOVdyagHOIHDD3+A5sWEC04hIBgyWOKZMQCECy6jDEJxQpwWvaZgqVPqxVAXTNywDxCZAnUGv8e+AvrcRZQoeKKBQAAAABJRU5ErkJggg==" alt="pdf" className="size-6 me-1" />
                                <a href="#!" className="link link-custom-primary fw-medium">INV-1009</a>
                            </td>
                            <td><a href="#!" className="link link-custom-primary fw-medium">#ORD1040</a></td>
                            <td>Dec 13, 2025</td>
                            <td>Dec 20, 2025</td>
                            <td>
                                <div className="d-flex gap-2 align-items-center">
                                    <img src="/assets/user-9-DB-6OyMr.png" className="size-8 rounded img-fluid" alt="Avatar" />
                                    <span className="fw-medium">Lucas Martin</span>
                                </div>
                            </td>
                            <td><span className="badge bg-success-subtle text-success border border-success-subtle">Paid</span></td>
                            <td>$220.00 <small className="text-muted">/ Card</small></td>
                            <td>$20.00</td>
                            <td>$18.00</td>
                            <td>Admin</td>
                            <td>
                                <div className="dropdown">
                                    <a href="#!" className="link link-custom-primary" data-bs-toggle="dropdown"><i className="ri-more-2-fill"></i></a>
                                    <ul className="dropdown-menu dropdown-menu-end">
                                        <li><a href="#!" className="dropdown-item d-flex gap-3 align-items-center" data-bs-toggle="modal" data-bs-target="#invoicePreviewModal"><i className="ri-eye-line"></i> View</a></li>
                                        <li><a href="#!" className="dropdown-item d-flex gap-3 align-items-center"><i className="ri-printer-line"></i> Print</a></li>
                                        <li><a href="#!" className="dropdown-item d-flex gap-3 align-items-center text-danger" data-bs-toggle="modal" data-bs-target="#deleteModal"><i className="ri-delete-bin-5-line"></i> Delete</a></li>
                                    </ul>
                                </div>
                            </td>
                        </tr>
                        <tr>
                            <td>
                                <div className="form-check check-primary"><input className="form-check-input" type="checkbox" /></div>
                            </td>
                            <td>
                                <img src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAEAAAABACAMAAACdt4HsAAAAAXNSR0IB2cksfwAAAAlwSFlzAAALEwAACxMBAJqcGAAAAtBQTFRFAAAA4uLi4uLi4uLi4uLi39/f0NDQu7u7t7e3t7e3t7e3t7e34+Pj4uLi4uLi4uLi4uLi39/f0tLSvLy8t7e3t7e3t7e3t7e3t7e34uLi4uLi4uLi1dXVubm5t7e3t7e3t7e3tbW14+Pj4uLi4ODgxcXFt7e3t7e34+Pj4uLizMzM4+Pjzs7Ot7e3t7e3t7e3t7e30tLSt7e3t7e33Nzcvr6+t7e319fXuLi4t7e339/f2NjYxsbGurq6t7e3vkAwvkAwvUAwxFtO4d7d4eHhvLy8vkAwvkAwvkAwvkAwvkAwvkEx2r+81dXVvkAwvkAwvkAwvkEx2ry44eHhvkAwvkAw4uLivkAwwEExzEY151I+x0Qz8VZC51I+ykU0v0Ew8VZC7lVB5lE+30483U073U486H1w7IyA642A6pSJ57Os49fW8VhE7nNj5cfD7Xpr49rZ8FxI57St6aCW8l1K82hX82lX8mBN8VdD8mZU8mRR8VdE8mdV8VpH6pyS+beu/vDu/vDv/eXi95iM8VpG9Hts/evp/evo+bWs8l5L8VlF+sa//u7s96KX/NXQ//79/ejm/eTg/eTh/vb1/vf29YV29pGE/////vHw/vHv+bOq8lxJ//38/efk/N/b9pKF//f29Hlp96SZ//39+Kyj+K6k9Hdn/enm8mJP829e8ltI9HRj//v6+Kuh8l9M/ebj821c96Sa//z8/eHe/NPO9YR1//7+/vTy/vLx/vPx9pWJ9Hxs82ta//j39YN18mhW/ezq8mRS/N7a+r22+r63/NzY+8jB8VhF+sjB/ero829d9YZ4//r6+9bR82tZ/NfT8VZC82dV825d9Hpq9YBx9HZm825e8VZC8VZC8VZC8VZC8FZC8VZC8VZC7nRl8lVB8VZC8VZC8VZC8VVC8VdE7IR357Ot49jW4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLiUYXpzAAAAPB0Uk5TAAEWJSYmJSYmIQ8BBnXe8fLx8vLy7diLH2T1//////5GAQG0///kTQTG/wX/40fOHf/8e///uv//y//////MCBQWG8v/zAtoyeDi4fbMmvr//fzMXPXMobWzs/+z///////////+/v///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////67///////+O/jfiAVjg/wEgaJWdnun//8j7hOOLDhkDfGCOdgAAAp1JREFUeJzt109o01AcB/Dfdx2urptduxlbdI4Npq0DxSFDKLKbRw8i/kPQo+Bp3r14EI/Dg6AgA0/qGAgqDtSDHuacdBYF2+J0G06pA2Ura+c2XH0vS5ukJHmvycEd/EGT177k0+Y1v9/LA3kMbD4ALGwO5T3sVXAEmuwBVeCRcwKitqdrBGG5EdO2QBd+O5xPW7HCtn6s6kIVEEPeCaDgElUJVUDPujMQ2ug2CO4Ag+AS0AW3AAXx3htAIaRcAMrPSrMNSRdAFD8q7ciEC4B2rfu+a82dr90A1IFZvtseAF6ZgH41CYCMAChHPBN/ZgCOakkIvJMEiHof6UB/UEtC4I00cHhEB05gjWoGEg904NQKeQNOl6uAW+DMskfgbLlSugXOsT9x0RNQX7kPBDUVD20AyW9lVX/EE8ALybA3IIT73gBqvWcPtGkDyeauCP6wZj2+8Y/r1N4t+Mp3u+/YAx0cKNUBU9TNs6PUAKRpHwrqUQF8EAH7tfkXb6kPbBZDQzHwJZcoBsAnpGa8FAJhrFKWMc8ZsK1I2d58EKOJor+F16ngZE4MBJ4Q9Sm/xhigsHpxDJ8X5hLFhcK8Pog1AfE9KuDfkaTmj1IAv4QjefUSDEBn6iBhfE4C0Aaxc9gMdLOPM9GnEkDMN06lcGxiygzs9YFelHISwAGMajeSCahxENXYAM5jLDHkFujhw7HYgls1ABeBm1rvpdlGtlWAG9R+fCY8JABSg+puALeXtN72k2pePU5z5sJdw6OhZTamcZ0kw7oeZHFNFrCuSJ+ANanf0HR50LIm0nSlKl91OB24gkOVdyagHOIHDD3+A5sWEC04hIBgyWOKZMQCECy6jDEJxQpwWvaZgqVPqxVAXTNywDxCZAnUGv8e+AvrcRZQoeKKBQAAAABJRU5ErkJggg==" alt="pdf" className="size-6 me-1" />
                                <a href="#!" className="link link-custom-primary fw-medium">INV-1010</a>
                            </td>
                            <td><a href="#!" className="link link-custom-primary fw-medium">#ORD1041</a></td>
                            <td>Dec 12, 2025</td>
                            <td>Dec 19, 2025</td>
                            <td>
                                <div className="d-flex gap-2 align-items-center">
                                    <img src="/assets/user-10-CzpspsdB.png" className="size-8 rounded img-fluid" alt="Avatar" />
                                    <span className="fw-medium">Charlotte Wilson</span>
                                </div>
                            </td>
                            <td><span className="badge bg-warning-subtle text-warning border border-warning-subtle">Overdue</span></td>
                            <td>$140.00 <small className="text-muted">/ Cash</small></td>
                            <td>$10.00</td>
                            <td>$12.00</td>
                            <td>Admin</td>
                            <td>
                                <div className="dropdown">
                                    <a href="#!" className="link link-custom-primary" data-bs-toggle="dropdown"><i className="ri-more-2-fill"></i></a>
                                    <ul className="dropdown-menu dropdown-menu-end">
                                        <li><a href="#!" className="dropdown-item d-flex gap-3 align-items-center" data-bs-toggle="modal" data-bs-target="#invoicePreviewModal"><i className="ri-eye-line"></i> View</a></li>
                                        <li><a href="#!" className="dropdown-item d-flex gap-3 align-items-center"><i className="ri-printer-line"></i> Print</a></li>
                                        <li><a href="#!" className="dropdown-item d-flex gap-3 align-items-center text-danger" data-bs-toggle="modal" data-bs-target="#deleteModal"><i className="ri-delete-bin-5-line"></i> Delete</a></li>
                                    </ul>
                                </div>
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>
            <div className="row align-items-center g-3 mt-3">
                <div className="col-md-6">
                    <p className="text-muted text-center text-md-start mb-0">Showing <b className="me-1">1-10</b> of <b className="ms-1">27</b> Results</p>
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

    {/* Add/Edit Refund Modal (Invoice View) */}
    <div className="modal fade" id="addInvoiceRefundModal" tabindex="-1" aria-hidden="true">
        <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content">
                <div className="modal-header">
                    <h6 className="modal-title">Add New Invoice</h6>
                    <button type="button" className="btn-close" data-bs-dismiss="modal"></button>
                </div>
                <div className="modal-body">
                    <form>
                        <div className="row g-4">
                            <div className="col-md-6">
                                <label htmlFor="invoiceRefundId" className="form-label">Refund ID <span className="text-danger">*</span></label>
                                <input type="text" className="form-control" id="invoiceRefundId" placeholder="#REF2033" required />
                            </div>
                            <div className="col-md-6">
                                <label htmlFor="invoiceRefundDate" className="form-label">Refund Date <span className="text-danger">*</span></label>
                                <input type="text" className="form-control" id="invoiceRefundDate" data-datepicker data-date-format="dd-MM-yyyy" placeholder="Choose Date" required />
                            </div>
                            <div className="col-md-6">
                                <label htmlFor="invoiceId" className="form-label">Invoice ID <span className="text-danger">*</span></label>
                                <input type="text" className="form-control" id="invoiceId" placeholder="#INV1024" required />
                            </div>
                            <div className="col-md-6">
                                <label htmlFor="invoiceRefundType" className="form-label">Refund Type <span className="text-danger">*</span></label>
                                <div id="invoiceRefundType"></div>
                            </div>
                            <div className="col-12">
                                <label htmlFor="invoiceCustomerName" className="form-label">Customer Name <span className="text-danger">*</span></label>
                                <input type="text" className="form-control" id="invoiceCustomerName" placeholder="John Doe" required />
                            </div>
                            <div className="col-md-6">
                                <label htmlFor="invoiceRefundAmount" className="form-label">Refund Amount <span className="text-danger">*</span></label>
                                <input type="number" className="form-control" id="invoiceRefundAmount" step="0.01" placeholder="150.00" required />
                            </div>
                            <div className="col-md-6">
                                <label htmlFor="invoiceRefundStatus" className="form-label">Refund Status</label>
                                <div id="invoiceRefundStatus"></div>
                            </div>
                            <div className="col-12">
                                <label htmlFor="invoiceRefundMethod" className="form-label">Refund Method <span className="text-danger">*</span></label>
                                <div id="invoiceRefundMethod"></div>
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

    {/* Invoice Preview Modal */}
    <div className="modal fade" id="invoicePreviewModal" tabindex="-1" aria-hidden="true">
        <div className="modal-dialog modal-dialog-centered modal-xl">
            <div className="modal-content">
                <div className="modal-header border-bottom-0 pb-0">
                    <div className="d-flex flex-wrap align-items-center gap-4">
                        <h5 className="modal-title">Invoice Preview</h5>
                        <div className="d-flex flex-wrap gap-2">
                            <button type="button" className="btn btn-light btn-sm px-4 h-9"><i className="ri-file-pdf-2-line me-1"></i>PDF</button>
                            <button type="button" className="btn btn-active-dark btn-sm px-4 h-9"><i className="ri-mail-line me-1"></i>Email</button>
                            <button type="button" className="btn btn-active-dark btn-sm px-4 h-9"><i className="ri-bank-card-line me-1"></i>Online Payment</button>
                        </div>
                    </div>
                    <button type="button" className="btn btn-primary flex-shrink-0 ms-auto btn-sm px-4 h-9 rounded">Save Invoice</button>
                </div>
                <div className="modal-body">
                    <div className="border p-4 rounded">
                        <div className="d-flex justify-content-between mb-6">
                            <h6 className="fs-16">#INV-7853</h6>
                            <a href="index.html" className="logos">
                                <img src="/assets/main-logo-CWEU2RA-.png" loading="lazy" alt="Logo White" className="h-6 logo-dark" />
                                <img src="/assets/logo-white-B_ImY8Qx.png" loading="lazy" alt="Logo White" className="h-6 logo-light" />
                            </a>
                        </div>
                        <div className="row mb-3">
                            <div className="col-md-6">
                                <p className="text-muted mb-1">Invoice Purpose:</p>
                                <h6>E-Commerce POS Integration</h6>
                            </div>
                            <div className="col-md-6">
                                <div className="d-flex gap-10 align-items-center justify-content-end">
                                    <div>
                                        <p className="text-muted mb-1">Issued On:</p>
                                        <h6>Apr 05, 2025</h6>
                                    </div>
                                    <div>
                                        <p className="text-muted mb-1">Due By:</p>
                                        <h6>Apr 15, 2025</h6>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="row mb-4">
                            <div className="col-md-6">
                                <p className="text-muted mb-2">Seller:</p>
                                <h6>NovaTech Solutions Ltd.</h6>
                                <p className="text-muted mb-1">Sector 62, Noida, India</p>
                                <a href="#!" className="link link-custom-primary d-block mb-1">finance@novatech.io</a>
                                <p className="text-muted">+91 98765 43210</p>
                            </div>
                            <div className="col-md-6 text-md-end">
                                <p className="text-muted mb-2">Client:</p>
                                <h6>BrightMart Retail Pvt. Ltd.</h6>
                                <p className="text-muted mb-1">MG Road, Bengaluru, India</p>
                                <a href="#!" className="link link-custom-primary d-block mb-1">payments@brightmart.in</a>
                                <p className="text-muted">+91 80456 77890</p>
                            </div>
                        </div>
                        <div className="table-responsive mb-2">
                            <table className="table table-borderless text-nowrap">
                                <thead>
                                    <tr className="border-bottom">
                                        <th className="fw-medium text-muted">Service Details</th>
                                        <th className="fw-medium text-muted">Qty</th>
                                        <th className="fw-medium text-muted">Rate</th>
                                        <th className="fw-medium text-muted">GST</th>
                                        <th className="fw-medium text-muted text-end">Amount</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr>
                                        <td>POS Backend API Integration</td>
                                        <td>1</td>
                                        <td>₹95,000</td>
                                        <td>₹0.00</td>
                                        <td className="text-end">₹95,000.00</td>
                                    </tr>
                                    <tr>
                                        <td>Inventory Sync & Reporting</td>
                                        <td>1</td>
                                        <td>₹35,000</td>
                                        <td>₹0.00</td>
                                        <td className="text-end">₹35,000.00</td>
                                    </tr>
                                    <tr>
                                        <th colspan="4" className="text-end">Total Payable</th>
                                        <th className="text-end">₹1,30,000.00</th>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                        <p className="bg-light py-2 px-3 rounded border mb-6">
                            <span className="fw-medium">Payment Terms:</span> Full payment required before final deployment. Delays may affect delivery timelines.
                        </p>
                        <div className="row align-items-end">
                            <div className="col-md-6">
                                <h6>Payment Information:</h6>
                                <p className="text-muted">UPI / Bank Transfer</p>
                                <p className="text-muted">Beneficiary: NovaTech Solutions Ltd.</p>
                                <p className="text-muted">IFSC: HDFC0001298 · A/C No: 502001889334</p>
                                <p className="text-muted">GST Responsibility: Buyer</p>
                            </div>
                            <div className="col-md-6 text-end">
                                <img src="/assets/signature-BiyA9Vug.png" alt="Signature" className="h-12 mb-2" />
                                <h6 className="mb-0">Amit Verma</h6>
                                <p className="text-muted mb-0">Finance & Operations Head</p>
                            </div>
                        </div>
                    </div>
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
                <h5 className="mb-4 lh-base">Are you sure you want to delete this Invoice?</h5>
                <input type="hidden" id="deleteWarrantyId" />
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
