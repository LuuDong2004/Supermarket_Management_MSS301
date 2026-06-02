// pages/Error/NotFoundPage.jsx
import { Link } from 'react-router-dom';
import { ROUTES } from '../../configs/routes';

export default function NotFoundPage() {
  return (
    <div className="container min-vh-100 d-flex align-items-center justify-content-center">
      <div className="text-center">
        <h1 className="display-1 fw-bold text-primary">404</h1>
        <h4 className="mb-4">Oops! Page Not Found</h4>
        <p className="text-muted mb-6">
          The page you are looking for doesn&apos;t exist or has been moved.
        </p>
        <Link to={ROUTES.DASHBOARD} className="btn btn-primary">
          <i className="ri-home-line me-2"></i>
          Back to Dashboard
        </Link>
      </div>
    </div>
  );
}
