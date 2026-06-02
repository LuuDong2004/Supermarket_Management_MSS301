// pages/Dashboard/Products/ProductReviewsPage.jsx
import React, { useEffect, useState } from 'react';
import PageBreadcrumb from '../../../components/ui/PageBreadcrumb';
import { ROUTES } from '../../../configs/routes';

const initialReviews = [
  { id: 1, customerName: 'Alice Johnson', customerEmail: 'alice@example.com', rating: 5, comment: 'Excellent product! Very fast delivery.', status: 'Published', product: 'Apple iPhone 15', sku: 'APL-IP15-128', date: 'Mar 10, 2024' },
  { id: 2, customerName: 'Bob Smith', customerEmail: 'bob@example.com', rating: 4, comment: 'Good quality but shipping took 5 days.', status: 'Published', product: 'Nike Air Max 270', sku: 'NKE-AM270-01', date: 'Apr 02, 2024' },
  { id: 3, customerName: 'Charlie Brown', customerEmail: 'charlie@example.com', rating: 2, comment: 'The size is smaller than expected.', status: 'Hidden', product: 'Nike Air Max 270', sku: 'NKE-AM270-01', date: 'Feb 18, 2024' }
];

export default function ProductReviewsPage() {
  const [reviews, setReviews] = useState(initialReviews);
  const [activeTab, setActiveTab] = useState('all'); // all, published, hidden
  const [search, setSearch] = useState('');
  const [ratingFilter, setRatingFilter] = useState('all');

  // Modal Form State
  const [modalCustomer, setModalCustomer] = useState('');
  const [modalEmail, setModalEmail] = useState('');
  const [modalRating, setModalRating] = useState(5);
  const [modalComment, setModalComment] = useState('');
  const [modalProduct, setModalProduct] = useState('Apple iPhone 15');
  const [modalStatus, setModalStatus] = useState('Published');
  const [editingId, setEditingId] = useState(null);
  const [deletingId, setDeletingId] = useState(null);

  useEffect(() => {
    if (window.lucide) {
      window.lucide.createIcons();
    }
  }, [reviews, activeTab]);

  const handleDelete = () => {
    setReviews(prev => prev.filter(r => r.id !== deletingId));
    const modalElement = document.getElementById('deleteModal');
    const modalInstance = window.bootstrap?.Modal?.getInstance(modalElement);
    modalInstance?.hide();
    setDeletingId(null);
  };

  const handleToggleStatus = (id) => {
    setReviews(prev => prev.map(r => r.id === id ? {
      ...r,
      status: r.status === 'Published' ? 'Hidden' : 'Published'
    } : r));
  };

  const handleFormSubmit = (e) => {
    e.preventDefault();
    if (editingId) {
      setReviews(prev => prev.map(r => r.id === editingId ? {
        ...r,
        customerName: modalCustomer,
        customerEmail: modalEmail,
        rating: parseInt(modalRating),
        comment: modalComment,
        product: modalProduct,
        status: modalStatus,
      } : r));
    } else {
      const newReview = {
        id: reviews.length > 0 ? Math.max(...reviews.map(r => r.id)) + 1 : 1,
        customerName: modalCustomer,
        customerEmail: modalEmail,
        rating: parseInt(modalRating),
        comment: modalComment,
        product: modalProduct,
        sku: 'SKU-' + Math.floor(Math.random() * 1000),
        status: modalStatus,
        date: new Date().toLocaleDateString('en-US', { month: 'short', day: '2-digit', year: 'numeric' })
      };
      setReviews(prev => [...prev, newReview]);
    }

    resetForm();

    const modalElement = document.getElementById('addReviewModal');
    const modalInstance = window.bootstrap?.Modal?.getInstance(modalElement);
    modalInstance?.hide();
  };

  const resetForm = () => {
    setModalCustomer('');
    setModalEmail('');
    setModalRating(5);
    setModalComment('');
    setModalProduct('Apple iPhone 15');
    setModalStatus('Published');
    setEditingId(null);
  };

  const openEditModal = (item) => {
    setEditingId(item.id);
    setModalCustomer(item.customerName);
    setModalEmail(item.customerEmail);
    setModalRating(item.rating);
    setModalComment(item.comment);
    setModalProduct(item.product);
    setModalStatus(item.status);

    const modalElement = document.getElementById('addReviewModal');
    const modalInstance = new window.bootstrap.Modal(modalElement);
    modalInstance.show();
  };

  const openAddModal = () => {
    resetForm();
    const modalElement = document.getElementById('addReviewModal');
    const modalInstance = new window.bootstrap.Modal(modalElement);
    modalInstance.show();
  };

  const filteredReviews = reviews.filter(r => {
    const matchesSearch = r.customerName.toLowerCase().includes(search.toLowerCase()) || 
                          r.product.toLowerCase().includes(search.toLowerCase()) ||
                          r.comment.toLowerCase().includes(search.toLowerCase());
    const matchesRating = ratingFilter === 'all' || r.rating === parseInt(ratingFilter);
    const matchesTab = activeTab === 'all' || 
                       (activeTab === 'published' && r.status === 'Published') || 
                       (activeTab === 'hidden' && r.status === 'Hidden');
    return matchesSearch && matchesRating && matchesTab;
  });

  const renderStars = (rating) => {
    const stars = [];
    for (let i = 1; i <= 5; i++) {
      stars.push(
        <i key={i} className={`ri-star-fill ${i <= rating ? 'text-warning' : 'text-muted-light'}`} style={{ marginRight: '2px' }}></i>
      );
    }
    return stars;
  };

  return (
    <div className="container-fluid">
      <PageBreadcrumb title="Reviews" breadcrumbs={[{ label: 'Dashboard', href: ROUTES.DASHBOARD }, { label: 'Products' }, { label: 'Reviews' }]} />

      <div className="row">
        <div className="col-12">
          <div className="card">
            <div className="card-header d-flex flex-wrap gap-3 justify-content-between align-items-center">
              <ul className="nav nav-underline" role="tablist">
                <li className="nav-item">
                  <button className={`nav-link ${activeTab === 'all' ? 'active' : ''}`} onClick={() => setActiveTab('all')}>All Reviews</button>
                </li>
                <li className="nav-item">
                  <button className={`nav-link ${activeTab === 'published' ? 'active' : ''}`} onClick={() => setActiveTab('published')}>Published</button>
                </li>
                <li className="nav-item">
                  <button className={`nav-link ${activeTab === 'hidden' ? 'active' : ''}`} onClick={() => setActiveTab('hidden')}>Hidden</button>
                </li>
              </ul>
              <div className="d-flex flex-wrap align-items-center gap-2 ms-auto">
                <div className="flex-shrink-0">
                  <div className="position-relative">
                    <input type="text" className="form-control ps-9" placeholder="Search for..." value={search} onChange={e => setSearch(e.target.value)} />
                    <i data-lucide="search" className="size-4 icon-dark position-absolute top-50 start-0 ms-3 translate-middle-y"></i>
                  </div>
                </div>
                <select className="form-select w-36" value={ratingFilter} onChange={e => setRatingFilter(e.target.value)}>
                  <option value="all">All Ratings</option>
                  <option value="5">5 Stars</option>
                  <option value="4">4 Stars</option>
                  <option value="3">3 Stars</option>
                  <option value="2">2 Stars</option>
                  <option value="1">1 Star</option>
                </select>
                <button className="btn btn-primary flex-shrink-0 d-flex align-items-center gap-1" onClick={openAddModal}>
                  <i data-lucide="plus" className="size-4"></i> Add Review
                </button>
              </div>
            </div>

            <div className="card-body pt-0">
              <div className="table-card table-responsive">
                <table className="table align-middle text-nowrap mb-0">
                  <thead>
                    <tr className="bg-light border-bottom">
                      <th>
                        <div className="form-check check-primary">
                          <input className="form-check-input" type="checkbox" aria-label="checkbox" id="checAllData" />
                        </div>
                      </th>
                      <th className="fw-medium text-muted">Customer</th>
                      <th className="fw-medium text-muted">Review</th>
                      <th className="fw-medium text-muted">Status</th>
                      <th className="fw-medium text-muted">Product</th>
                      <th className="fw-medium text-muted">Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredReviews.length === 0 ? (
                      <tr>
                        <td colSpan="6" className="text-center text-muted py-4">No reviews found.</td>
                      </tr>
                    ) : (
                      filteredReviews.map(item => (
                        <tr key={item.id}>
                          <td>
                            <div className="form-check check-primary">
                              <input className="form-check-input" type="checkbox" id={`check_${item.id}`} />
                            </div>
                          </td>
                          <td>
                            <div className="d-flex align-items-center gap-2">
                              <div className="avatar size-9 rounded-circle bg-light d-flex align-items-center justify-content-center">
                                <i className="ri-user-line text-muted"></i>
                              </div>
                              <div>
                                <div className="fw-semibold text-reset">{item.customerName}</div>
                                <div className="text-muted fs-sm">{item.customerEmail}</div>
                              </div>
                            </div>
                          </td>
                          <td>
                            <div className="d-flex flex-column">
                              <div className="d-flex mb-1">{renderStars(item.rating)}</div>
                              <span className="text-wrap text-muted" style={{ maxWidth: '300px' }}>{item.comment}</span>
                            </div>
                          </td>
                          <td>
                            <span className={`badge bg-${item.status === 'Published' ? 'success' : 'danger'}-subtle text-${item.status === 'Published' ? 'success' : 'danger'}`}>
                              {item.status}
                            </span>
                          </td>
                          <td>
                            <div>
                              <div className="fw-semibold">{item.product}</div>
                              <span className="text-muted fs-sm">{item.sku}</span>
                            </div>
                          </td>
                          <td>
                            <div className="dropdown">
                              <a href="#!" className="link link-custom-primary" data-bs-toggle="dropdown" aria-expanded="false">
                                <i className="ri-more-2-fill"></i>
                              </a>
                              <ul className="dropdown-menu">
                                <li>
                                  <button className="dropdown-item d-flex gap-3 align-items-center border-0 bg-transparent" onClick={() => handleToggleStatus(item.id)}>
                                    <i className={item.status === 'Published' ? 'ri-eye-off-line' : 'ri-eye-line'}></i> 
                                    {item.status === 'Published' ? 'Hide' : 'Publish'}
                                  </button>
                                </li>
                                <li>
                                  <button className="dropdown-item d-flex gap-3 align-items-center border-0 bg-transparent" onClick={() => openEditModal(item)}>
                                    <i className="ri-pencil-line"></i> Edit
                                  </button>
                                </li>
                                <li>
                                  <button className="dropdown-item d-flex gap-3 align-items-center text-danger border-0 bg-transparent" data-bs-toggle="modal" data-bs-target="#deleteModal" onClick={() => setDeletingId(item.id)}>
                                    <i className="ri-delete-bin-line"></i> Delete
                                  </button>
                                </li>
                              </ul>
                            </div>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
              <div className="row align-items-center g-3 mt-2">
                <div className="col-md-6">
                  <p className="text-muted text-center text-md-start mb-0">
                    Showing <b className="me-1">1-{filteredReviews.length}</b> of <b className="ms-1">{filteredReviews.length}</b> Results
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Add/Edit Review Modal */}
      <div className="modal fade" id="addReviewModal" tabIndex="-1" aria-labelledby="addReviewModalLabel" aria-hidden="true">
        <div className="modal-dialog modal-dialog-centered">
          <div className="modal-content">
            <div className="modal-header">
              <h6 className="modal-title" id="addReviewModalLabel">{editingId ? 'Edit Review' : 'Add New Review'}</h6>
              <button type="button" className="btn-close" data-bs-dismiss="modal"></button>
            </div>
            <div className="modal-body">
              <form onSubmit={handleFormSubmit}>
                <div className="mb-3">
                  <label className="form-label">Customer Name <span className="text-danger">*</span></label>
                  <input type="text" className="form-control" placeholder="e.g., Alice Johnson" value={modalCustomer} onChange={e => setModalCustomer(e.target.value)} required />
                </div>
                <div className="mb-3">
                  <label className="form-label">Customer Email <span className="text-danger">*</span></label>
                  <input type="email" className="form-control" placeholder="e.g., alice@example.com" value={modalEmail} onChange={e => setModalEmail(e.target.value)} required />
                </div>
                <div className="mb-3">
                  <label className="form-label">Product Name <span className="text-danger">*</span></label>
                  <input type="text" className="form-control" placeholder="e.g., Apple iPhone 15" value={modalProduct} onChange={e => setModalProduct(e.target.value)} required />
                </div>
                <div className="mb-3">
                  <label className="form-label">Rating (1-5) <span className="text-danger">*</span></label>
                  <select className="form-select" value={modalRating} onChange={e => setModalRating(e.target.value)}>
                    <option value="5">5 Stars</option>
                    <option value="4">4 Stars</option>
                    <option value="3">3 Stars</option>
                    <option value="2">2 Stars</option>
                    <option value="1">1 Star</option>
                  </select>
                </div>
                <div className="mb-3">
                  <label className="form-label">Comment <span className="text-danger">*</span></label>
                  <textarea className="form-control" placeholder="Enter review comment..." rows="3" value={modalComment} onChange={e => setModalComment(e.target.value)} required></textarea>
                </div>
                <div className="mb-3">
                  <label className="form-label">Status</label>
                  <select className="form-select" value={modalStatus} onChange={e => setModalStatus(e.target.value)}>
                    <option value="Published">Published</option>
                    <option value="Hidden">Hidden</option>
                  </select>
                </div>
                <div className="d-flex gap-2 mt-7">
                  <button type="button" className="btn btn-light w-100" data-bs-dismiss="modal">Close</button>
                  <button type="submit" className="btn btn-primary w-100">{editingId ? 'Save Changes' : 'Add Review'}</button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>

      {/* Delete Modal */}
      <div className="modal fade" id="deleteModal" tabIndex="-1" aria-labelledby="deleteModalLabel" aria-hidden="true">
        <div className="modal-dialog modal-dialog-centered modal-xs">
          <div className="modal-content p-7 text-center">
            <div className="d-flex justify-content-center mb-4">
              <div className="size-14 bg-danger-subtle rounded-circle d-flex align-items-center justify-content-center size-16">
                <i className="ri-delete-bin-line text-danger fs-2xl"></i>
              </div>
            </div>
            <h5 className="mb-4 lh-base">Are you sure you want to delete this Review?</h5>
            <div className="d-flex justify-content-center align-items-center gap-2">
              <button type="button" className="btn btn-danger" onClick={handleDelete}>Delete</button>
              <button type="button" className="btn btn-link text-reset" data-bs-dismiss="modal">Cancel</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
