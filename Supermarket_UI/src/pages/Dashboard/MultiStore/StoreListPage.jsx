// pages/Dashboard/MultiStore/StoreListPage.jsx
import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import PageBreadcrumb from '../../../components/ui/PageBreadcrumb';
import { ROUTES } from '../../../configs/routes';

const defaultStores = [
  { id: 1, storeId: 'STR-001', name: 'Main City Store', location: 'New York', manager: 'John Doe', email: 'john.doe@store.com', phone: '+1 212 555 0123', status: 'Open', type: 'Retail', image: '/assets/user-6-BIO7_TUU.png' },
  { id: 2, storeId: 'STR-002', name: 'Downtown Outlet', location: 'Los Angeles', manager: 'Emily Clark', email: 'emily.clark@store.com', phone: '+1 310 555 0145', status: 'Open', type: 'Retail', image: '/assets/user-2-CroG7YJ0.png' },
  { id: 3, storeId: 'STR-003', name: 'West End Store', location: 'Chicago', manager: 'Michael Lee', email: 'michael.lee@store.com', phone: '+1 773 555 0198', status: 'Closed', type: 'Retail', image: '/assets/user-3-Bz6g7hsE.png' },
  { id: 4, storeId: 'STR-004', name: 'Central Mall', location: 'Houston', manager: 'Sophia Martinez', email: 'sophia.m@store.com', phone: '+1 713 555 0167', status: 'Open', type: 'Retail', image: '/assets/user-4-7l52E1Lo.png' },
  { id: 5, storeId: 'STR-005', name: 'North Side Market', location: 'San Francisco', manager: 'Daniel Cooper', email: 'daniel.cooper@store.com', phone: '+1 415 555 0189', status: 'Open', type: 'Retail', image: '/assets/user-5-BsT8d_Co.png' }
];

export default function StoreListPage() {
  const [stores, setStores] = useState([]);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  useEffect(() => {
    const saved = localStorage.getItem('gotpos_stores');
    if (saved) {
      setStores(JSON.parse(saved));
    } else {
      setStores(defaultStores);
      localStorage.setItem('gotpos_stores', JSON.stringify(defaultStores));
    }
  }, []);

  useEffect(() => {
    if (window.lucide) {
      window.lucide.createIcons();
    }
  }, [stores]);

  const handleDelete = (id) => {
    if (window.confirm('Are you sure you want to delete this store?')) {
      const updated = stores.filter(s => s.id !== id);
      setStores(updated);
      localStorage.setItem('gotpos_stores', JSON.stringify(updated));
    }
  };

  const handleToggleStatus = (id) => {
    const updated = stores.map(s => {
      if (s.id === id) {
        return { ...s, status: s.status === 'Open' ? 'Closed' : 'Open' };
      }
      return s;
    });
    setStores(updated);
    localStorage.setItem('gotpos_stores', JSON.stringify(updated));
  };

  const filteredStores = stores.filter(item => {
    const matchesSearch = item.name.toLowerCase().includes(search.toLowerCase()) ||
                          item.location.toLowerCase().includes(search.toLowerCase()) ||
                          item.manager.toLowerCase().includes(search.toLowerCase()) ||
                          item.storeId.toLowerCase().includes(search.toLowerCase());
    const matchesStatus = statusFilter === 'all' || item.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  const totalStores = stores.length;
  const activeStores = stores.filter(s => s.status === 'Open').length;
  const inactiveStores = stores.filter(s => s.status === 'Closed').length;

  return (
    <div className="container-fluid">
      <PageBreadcrumb title="Store List" breadcrumbs={[{ label: 'Multi Store', href: ROUTES.MULTI_STORE }, { label: 'Store List' }]} />

      {/* Widgets Row */}
      <div className="row">
        <div className="col-md-6 col-xxl-3">
          <div className="card p-4 store-widget">
            <div className="d-flex align-items-center gap-3 mb-8">
              <div className="size-10 avatar bg-primary text-white rounded-3">
                <i data-lucide="users" className="size-5"></i>
              </div>
              <div>
                <h6 className="fs-16 mb-1 fw-medium">Total Stores</h6>
                <p className="text-muted mb-0">All registered branches</p>
              </div>
            </div>
            <div className="d-flex justify-content-between gap-2 align-items-center">
              <div>
                <h4 className="mb-0">{totalStores} <span className="text-success fw-medium fs-sm"><i className="ri-arrow-up-s-fill"></i>3.5%</span></h4>
                <p className="mb-0"><span className="text-muted fs-xs">Recurring Stores</span></p>
              </div>
              <div className="text-end">
                <div className="py-1 px-3 d-inline-flex gap-1 mb-2 bg-light bg-opacity-50 text-end rounded-pill align-items-center">
                  <span className="fs-12 fw-medium text-success">65%</span>
                </div>
                <p className="text-muted mb-0 fs-xs">Engagement</p>
              </div>
            </div>
          </div>
        </div>

        <div className="col-md-6 col-xxl-3">
          <div className="card p-4 store-widget">
            <div className="d-flex align-items-center gap-3 mb-8">
              <div className="size-10 avatar bg-success text-white rounded-3">
                <i data-lucide="check-circle" className="size-5"></i>
              </div>
              <div>
                <h6 className="fs-16 mb-1 fw-medium">Active Stores</h6>
                <p className="text-muted mb-0">Currently operational</p>
              </div>
            </div>
            <div className="d-flex justify-content-between gap-2 align-items-center">
              <div>
                <h4 className="mb-0">{activeStores} <span className="text-success fw-medium fs-sm"><i className="ri-arrow-up-s-fill"></i>4.2%</span></h4>
                <p className="mb-0"><span className="text-muted fs-xs">Open branches</span></p>
              </div>
              <div className="text-end">
                <div className="py-1 px-3 d-inline-flex gap-1 mb-2 bg-light bg-opacity-50 text-end rounded-pill align-items-center">
                  <span className="fs-12 fw-medium text-success">75%</span>
                </div>
                <p className="text-muted mb-0 fs-xs">Operational</p>
              </div>
            </div>
          </div>
        </div>

        <div className="col-md-6 col-xxl-3">
          <div className="card p-4 store-widget">
            <div className="d-flex align-items-center gap-3 mb-8">
              <div className="size-10 avatar bg-danger text-white rounded-3">
                <i data-lucide="slash" className="size-5"></i>
              </div>
              <div>
                <h6 className="fs-16 mb-1 fw-medium">Inactive Stores</h6>
                <p className="text-muted mb-0">Closed branches</p>
              </div>
            </div>
            <div className="d-flex justify-content-between gap-2 align-items-center">
              <div>
                <h4 className="mb-0">{inactiveStores} <span className="text-danger fw-medium fs-sm"><i className="ri-arrow-down-s-fill"></i>1.8%</span></h4>
                <p className="mb-0"><span className="text-muted fs-xs">Needs attention</span></p>
              </div>
              <div className="text-end">
                <div className="py-1 px-3 d-inline-flex gap-1 mb-2 bg-light bg-opacity-50 text-end rounded-pill align-items-center">
                  <span className="fs-12 fw-medium text-danger">25%</span>
                </div>
                <p className="text-muted mb-0 fs-xs">Inactive rate</p>
              </div>
            </div>
          </div>
        </div>

        <div className="col-md-6 col-xxl-3">
          <div className="card p-4 store-widget">
            <div className="d-flex align-items-center gap-3 mb-8">
              <div className="size-10 avatar bg-warning text-white rounded-3">
                <i data-lucide="dollar-sign" className="size-5"></i>
              </div>
              <div>
                <h6 className="fs-16 mb-1 fw-medium">Today’s Sales</h6>
                <p className="text-muted mb-0">Total revenue generated</p>
              </div>
            </div>
            <div className="d-flex justify-content-between gap-2 align-items-center">
              <div>
                <h4 className="mb-0">$42,500 <span className="text-success fw-medium fs-sm"><i className="ri-arrow-up-s-fill"></i>5.1%</span></h4>
                <p className="mb-0"><span className="text-muted fs-xs">Target Achieved</span></p>
              </div>
              <div className="text-end">
                <div className="py-1 px-3 d-inline-flex gap-1 mb-2 bg-light bg-opacity-50 text-end rounded-pill align-items-center">
                  <span className="fs-12 fw-medium text-success">80%</span>
                </div>
                <p className="text-muted mb-0 fs-xs">Progress</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Table Card */}
      <div className="card">
        <div className="card-header d-flex flex-wrap gap-4 align-items-center justify-content-between">
          <h5 className="card-title mb-0">Store Branches</h5>
          <div className="d-flex flex-wrap gap-2 align-items-center">
            <div className="position-relative">
              <input type="text" className="form-control ps-10" placeholder="Search store..." value={search} onChange={e => setSearch(e.target.value)} />
              <i data-lucide="search" className="size-4 icon-dark position-absolute top-50 start-0 ms-4 translate-middle-y"></i>
            </div>
            <select className="form-select w-36" value={statusFilter} onChange={e => setStatusFilter(e.target.value)}>
              <option value="all">Status</option>
              <option value="Open">Open</option>
              <option value="Closed">Closed</option>
            </select>
            <Link to={ROUTES.MULTI_STORE_ADD} className="btn btn-primary">
              <i data-lucide="plus" className="size-4 me-1"></i>Add Store
            </Link>
          </div>
        </div>

        <div className="card-body pt-0">
          <div className="table-card table-responsive">
            <table className="table text-nowrap align-middle mb-0">
              <thead>
                <tr className="bg-light border-bottom">
                  <th>Store ID</th>
                  <th>Store Name</th>
                  <th>Location</th>
                  <th>Manager</th>
                  <th>Email</th>
                  <th>Phone</th>
                  <th>Status</th>
                  <th>Store Type</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {filteredStores.length === 0 ? (
                  <tr>
                    <td colSpan="9" className="text-center text-muted py-4">No records found.</td>
                  </tr>
                ) : (
                  filteredStores.map(item => (
                    <tr key={item.id}>
                      <td><a href="#!" className="link link-custom-primary fw-semibold">{item.storeId}</a></td>
                      <td className="fw-medium text-reset">{item.name}</td>
                      <td>{item.location}</td>
                      <td>
                        <div className="d-flex align-items-center gap-2">
                          <img src={item.image} className="size-8 rounded-circle img-fluid" alt="Manager" onError={e => { e.target.src = '/assets/user-6-BIO7_TUU.png'; }} />
                          <span className="fw-medium">{item.manager}</span>
                        </div>
                      </td>
                      <td><a href={`mailto:${item.email}`} className="link link-custom-primary">{item.email}</a></td>
                      <td>{item.phone}</td>
                      <td>
                        <span style={{ cursor: 'pointer' }} onClick={() => handleToggleStatus(item.id)} className={`badge bg-${item.status === 'Open' ? 'success' : 'warning'}-subtle text-${item.status === 'Open' ? 'success' : 'warning'} border border-${item.status === 'Open' ? 'success' : 'warning'}-subtle`}>
                          {item.status}
                        </span>
                      </td>
                      <td>{item.type}</td>
                      <td>
                        <div className="d-flex gap-2">
                          <button type="button" className="btn btn-sub-danger size-8 btn-icon" onClick={() => handleDelete(item.id)}><i className="ri-delete-bin-line"></i></button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
