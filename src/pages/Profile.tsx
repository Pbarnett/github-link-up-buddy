
import AuthGuard from "@/components/AuthGuard";
import { Link } from "react-router-dom";

function ProfilePage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
        <div className="bg-white shadow overflow-hidden rounded-lg">
          <div className="px-4 py-5 sm:p-6 space-y-4">
            <h1 className="text-2xl font-semibold">Profile (coming soon)</h1>
            <p className="text-gray-600">
              Manage your traveler info (name, DOB, FF#) here.
            </p>
            {/* TODO: add form fields for profile data */}
            <Link
              to="/dashboard"
              className="inline-block text-indigo-600 hover:underline"
            >
              ← Back to Dashboard
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function Profile() {
  return (
    <AuthGuard>
      <ProfilePage />
    </AuthGuard>
  );
}
