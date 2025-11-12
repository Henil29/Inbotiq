"use client";
import LoginForm from "@/components/forms/LoginForm";
import { useAuth } from "@/hooks/useAuth";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import Loader from "@/components/ui/Loader";

export default function LoginPage() {
  const { user, initializing } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!initializing && user) {
      router.push("/dashboard");
    }
  }, [user, initializing, router]);

  if (initializing) return <Loader />;
  if (user) return null;

  return (
    <div className="mx-auto max-w-md">
      <LoginForm />
    </div>
  );
}
