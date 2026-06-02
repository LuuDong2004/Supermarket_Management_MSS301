// pages/placeholder/PlaceholderPage.jsx
// Generic placeholder for pages not yet implemented
import PageBreadcrumb from '../../components/ui/PageBreadcrumb';

export default function PlaceholderPage({ title, breadcrumbs = [], icon = 'ri-file-list-line' }) {
  return (
    <div className="container-fluid">
      <PageBreadcrumb title={title} breadcrumbs={breadcrumbs} />
      <div className="row justify-content-center">
        <div className="col-lg-6">
          <div className="card text-center">
            <div className="card-body py-10">
              <div className="mb-5">
                <div className="size-20 avatar bg-primary bg-opacity-10 rounded-circle mx-auto mb-4">
                  <i className={`${icon} text-primary fs-2`}></i>
                </div>
                <h5 className="mb-2">{title}</h5>
                <p className="text-muted">
                  This module is ready for backend integration.
                  Connect your API endpoint to display real data here.
                </p>
              </div>
              <div className="d-flex justify-content-center gap-3">
                <button className="btn btn-primary" type="button">
                  <i className="ri-add-line me-1"></i> Add New
                </button>
                <button className="btn btn-light" type="button">
                  <i className="ri-download-line me-1"></i> Export
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
