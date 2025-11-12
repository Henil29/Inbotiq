"use client";
import Link from "next/link";
import { useAuth } from "@/hooks/useAuth";
import Loader from "@/components/ui/Loader";

export default function HomePage() {
  const { user, initializing } = useAuth();

  if (initializing) return <Loader />;

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-semibold">Welcome to Inbotiq</h1>
      <div className="card space-y-4">
        {user ? (
          <div className="space-y-2">
            <p>
              Logged in as <b>{user.name}</b> ({user.role})
            </p>
            <div className="flex gap-3">
              <Link className="btn btn-primary" href="/dashboard">
                Go to Dashboard
              </Link>
              {user.role === "admin" && (
                <Link className="btn btn-secondary" href="/admin/dashboard">
                  Admin Dashboard
                </Link>
              )}
            </div>
          </div>
        ) : (
          <div className="flex gap-3">
            <Link className="btn btn-primary" href="/login">
              Login
            </Link>
            <Link className="btn btn-secondary" href="/register">
              Register
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
