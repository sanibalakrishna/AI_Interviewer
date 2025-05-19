import { Link } from "react-router-dom";

function NotFoundPage() {
  return (
    <div className="text-center py-16">
      <h1 className="text-4xl font-bold mb-4">404 - Page Not Found</h1>
      <p className="text-gray-600 mb-6">
        The page you're looking for doesn't exist.
      </p>
      <Link to="/" className="text-primary hover:underline">
        Go to Dashboard
      </Link>
    </div>
  );
}

export default NotFoundPage;
