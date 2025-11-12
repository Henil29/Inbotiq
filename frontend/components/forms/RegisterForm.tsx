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

const schema = z
  .object({
    name: z.string().min(2, "Name too short"),
    email: z.string().email("Invalid email"),
    password: z.string().min(6, "Min 6 characters"),
    confirmPassword: z.string().min(6, "Min 6 characters"),
    isAdmin: z.boolean().optional().default(false),
  })
  .refine((d) => d.password === d.confirmPassword, {
    path: ["confirmPassword"],
    message: "Passwords do not match",
  });

type FormValues = z.infer<typeof schema>;

export default function RegisterForm() {
  const { register: signup } = useAuth();
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
      const role = values.isAdmin ? "admin" : undefined;
      await signup(values.name, values.email, values.password, role);
      toast.success("Account created");
      router.push("/dashboard");
    } catch (err) {
      const friendly = handleError(err);
      setError(friendly.message);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 card">
      <h2 className="text-lg font-semibold">Register</h2>
      <Alert type="error" message={error} onClose={() => setError(null)} />
      <Input label="Name" {...register("name")} error={errors.name?.message} />
      <Input label="Email" type="email" {...register("email")} error={errors.email?.message} />
      <Input
        label="Password"
        type="password"
        {...register("password")}
        error={errors.password?.message}
      />
      <Input
        label="Confirm Password"
        type="password"
        {...register("confirmPassword")}
        error={errors.confirmPassword?.message}
      />
      <label className="flex items-center gap-2 text-sm">
        <input
          type="checkbox"
          {...register("isAdmin")}
          className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
        />
        <span>Do you want to be an admin?</span>
      </label>
      <Button type="submit" loading={isSubmitting} className="w-full">
        Create Account
      </Button>
    </form>
  );
}
