
import AuthGuard from "@/components/AuthGuard";
import { Link } from "react-router-dom";
import { ProfileForm } from "@/components/ProfileForm";

function ProfilePage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h1 className="text-3xl font-bold text-gray-900">Profile</h1>
            <Link
              to="/dashboard"
              className="inline-flex items-center text-indigo-600 hover:text-indigo-500 font-medium"
            >
              ← Back to Dashboard
            </Link>
          </div>
          
          <ProfileForm />
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
