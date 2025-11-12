"use client";
import RegisterForm from "@/components/forms/RegisterForm";
import { useAuth } from "@/hooks/useAuth";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import Loader from "@/components/ui/Loader";

export default function RegisterPage() {
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
      <RegisterForm />
    </div>
  );
}
