"use client";
import { useAuth } from "@/hooks/useAuth";
import Loader from "@/components/ui/Loader";
import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function DashboardPage() {
    const { user, initializing } = useAuth();
    const router = useRouter();

    useEffect(() => {
        if (!initializing) {
            if (!user) router.replace("/login");
            else if (user.role === "admin") router.replace("/admin/dashboard");
        }
    }, [user, initializing, router]);

    if (initializing || !user) return <Loader />;

    return (
        <div className="card space-y-4">
            <h1 className="text-2xl font-semibold">Dashboard</h1>
            <p className="text-sm text-gray-300">
                Welcome, <b>{user.name}</b> ({user.role})
            </p>
        </div>
    );
}