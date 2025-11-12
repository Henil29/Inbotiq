"use client";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import Input from "@/components/ui/Input";
import Button from "@/components/ui/Button";
import Alert from "@/components/ui/Alert";
import { useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import { handleError } from "@/utils/handleError";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";

const schema = z.object({
  email: z.string().email("Invalid email"),
  password: z.string().min(6, "Min 6 characters"),
});

type FormValues = z.infer<typeof schema>;

export default function LoginForm() {
  const { login } = useAuth();
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<FormValues>({ resolver: zodResolver(schema) });

  const onSubmit = async (values: FormValues) => {
    setError(null);
    try {
      await login(values.email, values.password);
      toast.success("Logged in");
      router.push("/dashboard");
    } catch (err) {
      const friendly = handleError(err);
      setError(friendly.message);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 card">
      <h2 className="text-lg font-semibold">Login</h2>
      <Alert type="error" message={error} onClose={() => setError(null)} />
      <Input label="Email" type="email" {...register("email")} error={errors.email?.message} />
      <Input
        label="Password"
        type="password"
        {...register("password")}
        error={errors.password?.message}
      />
      <Button type="submit" loading={isSubmitting} className="w-full">
        Sign In
      </Button>
    </form>
  );
}
