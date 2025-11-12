"use client";
import Link from "next/link";

export default function ErrorPage() {
  return (
    <div className="card space-y-4">
      <h2 className="text-lg font-semibold">Something went wrong</h2>
      <p className="text-sm text-gray-300">Please try again later.</p>
      <div>
        <Link href="/" className="btn btn-primary">
          Go Home
        </Link>
      </div>
    </div>
  );
}
