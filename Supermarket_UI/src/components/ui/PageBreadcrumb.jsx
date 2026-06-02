// components/ui/PageBreadcrumb.jsx
// Reusable page header with breadcrumb
export default function PageBreadcrumb({ title, breadcrumbs = [] }) {
  return (
    <div className="page-header d-flex align-items-center justify-content-between mb-4">
      <div>
        <h4 className="page-title mb-1">{title}</h4>
        {breadcrumbs.length > 0 && (
          <nav aria-label="breadcrumb">
            <ol className="breadcrumb mb-0">
              {breadcrumbs.map((crumb, index) => (
                <li
                  key={index}
                  className={`breadcrumb-item${index === breadcrumbs.length - 1 ? ' active' : ''}`}
                >
                  {crumb.href && index !== breadcrumbs.length - 1 ? (
                    <a href={crumb.href}>{crumb.label}</a>
                  ) : (
                    crumb.label
                  )}
                </li>
              ))}
            </ol>
          </nav>
        )}
      </div>
    </div>
  );
}
