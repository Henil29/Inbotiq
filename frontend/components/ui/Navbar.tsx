"use client";
import Link from "next/link";
import { useAuth } from "@/hooks/useAuth";
import Button from "@/components/ui/Button";
import { useRouter } from "next/navigation";

export default function Navbar() {
  const { user, logout } = useAuth();
  const router = useRouter();

  const handleLogout = async () => {
    await logout();
    router.push("/login");
  };

  return (
    <nav className="border-b border-white/10 bg-white/5 backdrop-blur-sm">
      <div className="container flex h-14 items-center justify-between">
        <div className="flex items-center gap-6">
          <Link href="/" className="text-sm font-semibold tracking-wide">
            Inbotiq
          </Link>
          {user && (
            <>
              <Link href="/dashboard" className="text-xs opacity-80 hover:opacity-100">
                Dashboard
              </Link>
              {user.role === "admin" && (
                <Link href="/admin/dashboard" className="text-xs opacity-80 hover:opacity-100">
                  Admin
                </Link>
              )}
            </>
          )}
        </div>
        <div className="flex items-center gap-3">
          {!user && (
            <>
              <Link href="/login" className="text-xs opacity-80 hover:opacity-100">
                Login
              </Link>
              <Link href="/register" className="text-xs opacity-80 hover:opacity-100">
                Register
              </Link>
            </>
          )}
          {user && (
            <>
              <span className="text-xs text-gray-300">
                {user.name} ({user.role})
              </span>
              <Button variant="secondary" onClick={handleLogout}>
                Logout
              </Button>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}
