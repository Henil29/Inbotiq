"use client";
import Link from "next/link";

export default function NotAuthorizedPage() {
  return (
    <div className="card space-y-4">
      <h2 className="text-lg font-semibold">Not authorized</h2>
      <p className="text-sm text-gray-300">You don’t have permission to view this page.</p>
      <div>
        <Link href="/" className="btn btn-primary">
          Go Home
        </Link>
      </div>
    </div>
  );
}
